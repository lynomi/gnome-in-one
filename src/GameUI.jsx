import { useState, useRef, useEffect } from "react";
import { Engine } from "./game/Engine";
import { Ramp } from "./game/Ramp";

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
    const [selected, setSelected] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [previewPosition, setPreviewPosition] = useState(null);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const blockPreviewRefs = useRef({});
    const animationFrameRef = useRef(null);

    // engine
    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new Engine(canvasRef.current, 1000, 500);
        engineRef.current = engine;

        // creates ball
        engine.addBall(400, 200, 8, 5, -5);

        // render initial state to show blocks
        engine.render();

        return () => {
            engine.stop();
        };
    }, []);

    // render block preview
    useEffect(() => {
        if (!selected || !previewPosition || !engineRef.current) return;

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
        };
    }, [selected, previewPosition]);

    // render block type previews
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

    // run button
    const handleRun = () => {
        if (engineRef.current) {
            engineRef.current.stop();
            engineRef.current.resetBall(400, 200);

            // BALL VELOCITY
            if (engineRef.current.ball) {
                engineRef.current.ball.setVelocity(10, -10);
            }
            setIsRunning(true);
            engineRef.current.start();
        }
    };

    // reset button
    const handleReset = () => {
        if (engineRef.current) {
            engineRef.current.stop();
            engineRef.current.resetBall(400, 200);
            setIsRunning(false);
        }
    };

    // click to select block type
    const handleSelectBlockType = (blockType) => {
        setSelected(selected === blockType.id ? null : blockType.id);
    };

    // move mouse for preview
    const handleCanvasMouseMove = (e) => {
        if (!selected || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPreviewPosition({ x, y });
    };

    // canvas click to place block
    const handleCanvasClick = (e) => {
        if (!selected || !engineRef.current || !canvasRef.current) return;

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

    return (
        <div style={css.root}>

            {/* block panel */}
            <div style={css.leftPanel}>
                <h3 style={css.leftPanelTitle}>Blocks</h3>
                <div style={css.blockGrid}>
                    {BLOCK_TYPES.map(blockType => (
                        <div
                            key={blockType.id}
                            onClick={() => handleSelectBlockType(blockType)}
                            style={{
                                ...css.blockPreview,
                                background: selected === blockType.id ? "#333" : "#222",
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

            {/* playfield and play button*/}
            <main style={css.main}>
                <canvas
                    ref={canvasRef}
                    width={1000}
                    height={500}
                    style={css.playfield}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={handleCanvasLeave}
                />
                <button style={css.runButton} onClick={isRunning ? handleReset : handleRun}>
                    {isRunning ? "Reset" : "Run"}
                </button>
            </main>
        </div>
    );
}

// styles

const css = {
    root: {
        display: "flex",
        height: "auto",
        background: "#000000",
        fontFamily: "'Calibri', system-ui, sans-serif",
        color: "#ffffff",
        padding: "8px",
        gap: "8px"
    },

    // blocks panel  
    leftPanel: {
        width: "100px",
        height: "flex",
        background: "#111",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #333"
    },

    leftPanelTitle: {
        margin: "0 0 16px 0",
        fontSize: "16px",
        fontWeight: "bold"
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
        cursor: "pointer",
        transition: "all 0.2s",
        userSelect: "none"
    },

    previewCanvas: {
        marginBottom: "0",
        borderRadius: "4px"
    },

    leftPanelButton: {
        width: "100%",
        padding: "12px",
        marginBottom: "8px",
        background: "#222",
        color: "#fff",
        border: "1px solid #444",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        transition: "background 0.2s"
    },

    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    playfield: {
        border: "1px solid #333",
        borderRadius: "8px"
    },

    runButton: {
        padding: "12px 24px",
        background: "#111",
        color: "#fff",
        border: "1px solid #333",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.2s"
    }
}

