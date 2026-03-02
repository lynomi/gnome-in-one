import { useState, useRef, useEffect } from "react";
import { Engine } from "./game/Engine";
import { Ramp } from "./game/Ramp";
import { LEVELS } from "./game/levels";

const BLOCK_TYPES = [
    {
        id: "ramp",
        label: "Ramp",
        description: "ramp",
        BlockClass: Ramp,
        defaultWidth: 130,
        defaultHeight: 80
    }
];

export default function GameUI() {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [phase, setPhase] = useState("BUILD"); // "BUILD", "SWING", "RESULT"
    const [resultMessage, setResultMessage] = useState("");

    const [selected, setSelected] = useState(null);
    const [previewPosition, setPreviewPosition] = useState(null);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const blockPreviewRefs = useRef({});
    const animationFrameRef = useRef(null);

    // engine initialization
    useEffect(() => {
        if (!canvasRef.current) return;

        const handleWin = () => {
            setResultMessage("Hole in One!");
            setPhase("RESULT");
        };

        const handleLoss = () => {
            setResultMessage("Missed!");
            setPhase("RESULT");
        };

        const engine = new Engine(canvasRef.current, 1000, 500, handleWin, handleLoss);
        engineRef.current = engine;

        // Load initial level
        engine.loadLevel(LEVELS[0]);

        return () => {
            engine.stop();
        };
    }, []);

    // Load initial level when engine is ready
    // handled above in engine initialization

    // render block preview
    useEffect(() => {
        if (!selected || !previewPosition || !engineRef.current || phase !== "BUILD") return;

        const blockType = BLOCK_TYPES.find(bt => bt.id === selected);
        if (!blockType) return;

        const renderPreview = () => {
            engineRef.current.render();
            engineRef.current.renderPreview(blockType.BlockClass, previewPosition.x, previewPosition.y);
            animationFrameRef.current = requestAnimationFrame(renderPreview);
        };

        animationFrameRef.current = requestAnimationFrame(renderPreview);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // ensure clean render after unmounting preview
            if (engineRef.current) engineRef.current.render();
        };
    }, [selected, previewPosition, phase]);

    // render block type preview
    useEffect(() => {
        BLOCK_TYPES.forEach(blockType => {
            const canvas = blockPreviewRefs.current[blockType.id];
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const block = new blockType.BlockClass(
                canvas.width / 2,
                canvas.height / 2,
                blockType.defaultWidth * 0.5,
                blockType.defaultHeight * 0.5
            );
            block.render(ctx);
        });
    }, []);

    // run/swing button
    const handleRun = () => {
        if (engineRef.current && phase === "BUILD") {
            engineRef.current.stop();
            engineRef.current.resetBall();

            setPhase("SWING");
            setSelected(null); // Deselect any blocks
            engineRef.current.start();
        }
    };

    // reset to build phase for current level
    const handleReset = () => {
        if (engineRef.current) {
            engineRef.current.stop();
            engineRef.current.resetBall();
            setPhase("BUILD");
            setResultMessage("");
        }
    };

    // clear blocks and retry
    const handleClear = () => {
        if (engineRef.current) {
            engineRef.current.stop();
            engineRef.current.clearBlocks();
            engineRef.current.resetBall();
            setPhase("BUILD");
            setResultMessage("");
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < LEVELS.length - 1) {
            if (engineRef.current) {
                engineRef.current.stop();
            }
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);

            if (engineRef.current) {
                engineRef.current.loadLevel(LEVELS[nextLevel]);
            }
            setPhase("BUILD");
            setResultMessage("");
            setSelected(null);
        }
    };

    // click to select block type
    const handleSelectBlockType = (blockType) => {
        if (phase !== "BUILD") return;
        setSelected(selected === blockType.id ? null : blockType.id);
    };

    // move mouse for preview
    const handleCanvasMouseMove = (e) => {
        if (!selected || !canvasRef.current || phase !== "BUILD") return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPreviewPosition({ x, y });
    };

    // canvas click to place block
    const handleCanvasClick = (e) => {
        if (!selected || !engineRef.current || !canvasRef.current || phase !== "BUILD") return;

        const blockType = BLOCK_TYPES.find(bt => bt.id === selected);
        if (!blockType) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        engineRef.current.addBlock(blockType.BlockClass, x, y);
        setSelected(null);
        setPreviewPosition(null);
    };

    // disables preview when leaving canvas
    const handleCanvasLeave = () => {
        setPreviewPosition(null);
    };

    const currentLevelData = LEVELS[currentLevel];

    return (
        <div style={css.root}>

            {/* block panel */}
            <div style={{ ...css.leftPanel, opacity: phase === "BUILD" ? 1 : 0.5 }}>
                <h3 style={css.leftPanelTitle}>Blocks</h3>
                <div style={css.blockGrid}>
                    {BLOCK_TYPES.map(blockType => (
                        <div
                            key={blockType.id}
                            onClick={() => handleSelectBlockType(blockType)}
                            style={{
                                ...css.blockPreview,
                                background: selected === blockType.id ? "#555" : "#222",
                                cursor: phase === "BUILD" ? "pointer" : "default"
                            }}
                        >
                            <canvas
                                ref={el => blockPreviewRefs.current[blockType.id] = el}
                                width={80}
                                height={80}
                                style={css.previewCanvas}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* playfield and controls*/}
            <main style={css.main}>

                <div style={css.header}>
                    <h2>{currentLevelData ? currentLevelData.title : "Gnome-in-one"}</h2>
                    <div style={css.phaseIndicator}>
                        Phase: <span style={{ fontWeight: 'bold', color: phase === "RESULT" ? "#ffaa00" : "#00ffaa" }}>{phase}</span>
                    </div>
                </div>

                <div style={css.canvasContainer}>
                    <canvas
                        ref={canvasRef}
                        width={1000}
                        height={500}
                        style={{ ...css.playfield, cursor: (phase === "BUILD" && selected) ? "crosshair" : "default" }}
                        onClick={handleCanvasClick}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseLeave={handleCanvasLeave}
                    />

                    {/* overlays */}
                    {phase === "RESULT" && (
                        <div style={css.overlay}>
                            <h1 style={css.overlayTitle}>{resultMessage}</h1>
                            <div style={css.overlayButtons}>
                                <button style={css.actionButton} onClick={handleReset}>Retry Level</button>
                                {resultMessage === "Hole in One!" && currentLevel < LEVELS.length - 1 && (
                                    <button style={{ ...css.actionButton, background: "#00aa55" }} onClick={handleNextLevel}>Next Level</button>
                                )}
                                {resultMessage === "Hole in One!" && currentLevel === LEVELS.length - 1 && (
                                    <div style={css.winText}>You completed all levels!</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div style={css.controls}>
                    {phase === "BUILD" && (
                        <>
                            <button style={{ ...css.runButton, background: "#1a5a2a" }} onClick={handleRun}>
                                Swing
                            </button>
                            <button style={css.runButton} onClick={handleClear}>
                                Clear Blocks
                            </button>
                        </>
                    )}
                    {(phase === "SWING" || phase === "RESULT") && (
                        <button style={css.runButton} onClick={handleReset}>
                            Reset to Build Phase
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}

// STYLES

const css = {
    root: {
        display: "flex",
        height: "100vh",
        background: "#000000",
        fontFamily: "'Calibri', system-ui, sans-serif",
        color: "#ffffff",
        padding: "16px",
        gap: "16px",
        boxSizing: "border-box"
    },

    // blocks panel  
    leftPanel: {
        width: "120px",
        height: "594px",
        flexShrink: 0,
        background: "#111",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #333",
        transition: "opacity 0.3s",
        boxSizing: "border-box"
    },

    leftPanelTitle: {
        margin: "0 0 16px 0",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center"
    },

    blockGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    blockPreview: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
        background: "#222",
        border: "none",
        borderRadius: "8px",
        transition: "all 0.2s",
        userSelect: "none"
    },

    previewCanvas: {
        marginBottom: "0",
        borderRadius: "4px"
    },

    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 8px",
        background: "#111",
        borderRadius: "8px",
        border: "1px solid #333",
    },

    phaseIndicator: {
        fontSize: "18px",
        padding: "8px 16px",
        background: "#222",
        borderRadius: "4px"
    },

    canvasContainer: {
        position: "relative",
        width: "1000px",
        height: "500px",
    },

    playfield: {
        border: "1px solid #333",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        backdropFilter: "blur(4px)"
    },

    overlayTitle: {
        fontSize: "48px",
        marginBottom: "32px",
        textShadow: "0 2px 4px rgba(0,0,0,0.8)"
    },

    overlayButtons: {
        display: "flex",
        gap: "16px"
    },

    actionButton: {
        padding: "12px 24px",
        fontSize: "18px",
        fontWeight: "bold",
        background: "#333",
        color: "#fff",
        border: "1px solid #555",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "transform 0.1s, background 0.2s"
    },

    controls: {
        display: "flex",
        gap: "12px"
    },

    runButton: {
        padding: "16px 32px",
        fontSize: "18px",
        fontWeight: "bold",
        background: "#222",
        color: "#fff",
        border: "1px solid #444",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.2s"
    },

    winText: {
        fontSize: "24px",
        color: "#00ffaa",
        fontWeight: "bold",
        padding: "12px"
    }
}

