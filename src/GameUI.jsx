import { useState, useRef, useEffect } from "react";
import { Engine } from "./game/Engine";
import { Ramp } from "./game/Ramp";
import { Block } from "./game/Block";
import { BombGnome, bombImage } from "./game/BombGnome";
import { flag as flagImage } from "./game/Hole";
import { LEVELS } from "./game/Levels";
import { SpeedRamp } from "./game/SpeedRamp";

const BLOCK_TYPES = [
    {
        id: "ramp",
        label: "Ramp",
        description: "ramp",
        BlockClass: Ramp,
        defaultWidth: 130,
        defaultHeight: 80
    },
    {
        id: "plank",
        label: "Plank",
        description: "plank",
        BlockClass: Block,
        defaultWidth: 120,
        defaultHeight: 18,
        previewWidth: 70,
        previewHeight: 14
    },
    {
        id: "bombgnome",
        label: "Bomb",
        description: "bombgnome",
        BlockClass: BombGnome,
        defaultWidth: 60,
        defaultHeight: 40
    },
    {
        id: "speedramp",
        label: "Speed Ramp",
        description: "speedramp",
        BlockClass: SpeedRamp,
        defaultWidth: 120,
        defaultHeight: 20
    }
];

export default function GameUI() {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [phase, setPhase] = useState("BUILD"); // "BUILD", "SWING", "RESULT"
    const [resultMessage, setResultMessage] = useState("");

    const [selected, setSelected] = useState(null);
    const [rotation, setRotation] = useState(0); // rotation in radians
    const [previewPosition, setPreviewPosition] = useState(null);
    // max # of blocks allowed
    const [placedBlocks, setPlacedBlocks] = useState(0);
    const MAX_BLOCKS = 3;
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

        // re-render to load images
        const rerender = () => engine.render();
        bombImage.addEventListener('load', rerender);
        flagImage.addEventListener('load', rerender);
        if (bombImage.complete) rerender();
        if (flagImage.complete) rerender();

        return () => {
            engine.stop();
            bombImage.removeEventListener('load', rerender);
            flagImage.removeEventListener('load', rerender);
        };
    }, []);

    // Load initial level when engine is ready
    // handled above in engine initialization

    // render block preview
    useEffect(() => {
        if (!selected || !previewPosition || !engineRef.current || phase !== "BUILD") return;

        const blockType = BLOCK_TYPES.find(bt => bt.id === selected);
        if (!blockType) return;

        const handleKeyDown = (e) => {
            if (phase === "BUILD" && selected && (e.key === 'r' || e.key === 'R')) {
                setRotation(prev => prev + Math.PI / 4); // Rotate 45 degrees
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const renderPreview = () => {
            engineRef.current.render();
            const pw = blockType.previewWidth ?? blockType.defaultWidth;
            const ph = blockType.previewHeight ?? blockType.defaultHeight;
            engineRef.current.renderPreview(blockType.BlockClass, previewPosition.x, previewPosition.y, pw, ph, { angle: rotation });
            animationFrameRef.current = requestAnimationFrame(renderPreview);
        };

        animationFrameRef.current = requestAnimationFrame(renderPreview);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // ensure clean render after unmounting preview
            if (engineRef.current) engineRef.current.render();
        };
    }, [selected, previewPosition, phase, rotation]);

    // render block type preview
    const drawBlockPreviews = () => {
        BLOCK_TYPES.forEach(blockType => {
            const canvas = blockPreviewRefs.current[blockType.id];
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const pw = blockType.previewWidth ?? blockType.defaultWidth * 0.5;
            const ph = blockType.previewHeight ?? blockType.defaultHeight * 0.5;
            const block = new blockType.BlockClass(
                canvas.width / 2,
                canvas.height / 2,
                pw,
                ph
            );
            block.render(ctx);
        });
    };

    useEffect(() => {
        drawBlockPreviews();
        bombImage.addEventListener('load', drawBlockPreviews);
        return () => bombImage.removeEventListener('load', drawBlockPreviews);
    }, []);

    const handleRun = () => {
        if (engineRef.current && phase === "BUILD") {
            engineRef.current.stop();
            engineRef.current.resetBall();

            setPhase("SWING");
            setSelected(null); // Deselect any blocks
            setRotation(0);
            engineRef.current.start();
        }
    };

    const handleReset = () => {
        if (engineRef.current) {
            engineRef.current.stop();
            engineRef.current.resetBall();
            setPhase("BUILD");
            setResultMessage("");
            setRotation(0);
        }
    };

    const handleClear = () => {
        if (engineRef.current) {
            engineRef.current.stop();
            engineRef.current.clearBlocks();
            engineRef.current.resetBall();
            setPhase("BUILD");
            setResultMessage("");
            setPlacedBlocks(0);
            setRotation(0);
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
            setPlacedBlocks(0);
        }
    };

    const handleSelectBlockType = (blockType) => {
        if (phase !== "BUILD" || placedBlocks >= MAX_BLOCKS) return;
        if (selected === blockType.id) {
            setSelected(null);
            setRotation(0);
        } else {
            setSelected(blockType.id);
            setRotation(0);
        }
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

        // disallows clicking if placement isnt valid
        if (!engineRef.current.isValidPlacement(blockType.BlockClass, x, y, blockType.defaultWidth, blockType.defaultHeight, { angle: rotation })) return;
        engineRef.current.addBlock(blockType.BlockClass, x, y, blockType.defaultWidth, blockType.defaultHeight, { angle: rotation });
        setPlacedBlocks(prev => prev + 1);
        setSelected(null);
        setPreviewPosition(null);
        setRotation(0);
    };

    // disables preview when leaving canvas
    const handleCanvasLeave = () => {
        setPreviewPosition(null);
    };

    // drop down menu for level select
    const handleSelectLevel = (e) => {
        const idx = Number(e.target.value);
        if (engineRef.current) {
            engineRef.current.stop();
            engineRef.current.loadLevel(LEVELS[idx]);
        }
        setCurrentLevel(idx);
        // sets phase to build if simulation running
        setPhase("BUILD");
        setResultMessage("");
        setSelected(null);
        setPlacedBlocks(0);
    };

    return (
        <div style={css.root}>

            {/* block panel */}
            <div style={{ ...css.leftPanel, opacity: phase === "BUILD" ? 1 : 0.5 }}>
                <h3 style={css.leftPanelTitle}>Blocks</h3>
                <p style={{ textAlign: "center", margin: "0 0 12px 0", fontSize: "13px", color: placedBlocks >= MAX_BLOCKS ? "#ff6666" : "#aaa" }}>
                    {MAX_BLOCKS - placedBlocks}/{MAX_BLOCKS}
                </p>
                <div style={css.blockGrid}>
                    {BLOCK_TYPES.map(blockType => (
                        <div
                            key={blockType.id}
                            onClick={() => handleSelectBlockType(blockType)}
                            style={{
                                ...css.blockPreview,
                                background: selected === blockType.id ? "#555" : "#222",
                                cursor: phase === "BUILD" && placedBlocks < MAX_BLOCKS ? "pointer" : "default",
                                opacity: phase === "BUILD" && placedBlocks >= MAX_BLOCKS ? 0.4 : 1
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
                    <select value={currentLevel} onChange={handleSelectLevel} style={css.levelSelect}>
                        {LEVELS.map((lvl, idx) => (
                            <option key={lvl.id} value={idx}>{lvl.title}</option>
                        ))}
                    </select>
                    <div style={css.phaseIndicator}>
                        <span style={{ fontWeight: 'bold' }}>PHASE:</span> <span style={{ fontWeight: 'bold', color: phase === "RESULT" ? "#ffaa00" : "#00ffaa" }}>{phase}</span>
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
                                <button style={css.actionButton} onClick={handleReset}>Retry</button>
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
                {phase === "BUILD" && selected && (
                    <div style={css.instructions}>
                        Tip: Press <kbd style={css.kbd}>R</kbd> to rotate the block.
                    </div>
                )}
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
        fontFamily: "wendy-one",
        color: "#ffffff",
        padding: "16px",
        gap: "16px",
        boxSizing: "border-box"
    },

    // blocks panel  
    leftPanel: {
        width: "120px",
        height: "572px",
        flexShrink: 0,
        // transparent bg
        background: "#11111166",
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
        padding: "0 24px",
        // transparent bg
        background: "#11111166",
        borderRadius: "8px",
        border: "1px solid #333",
    },

    // drop down menu for level select
    levelSelect: {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "wendy-one",
        background: "#11111166",
        border: "none",
        color: "#fff",
        padding: "8px 12px",
        cursor: "pointer",
    },

    phaseIndicator: {
        fontSize: "24px",
        padding: "8px 16px",
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

