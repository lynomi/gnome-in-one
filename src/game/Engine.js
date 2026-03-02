import Matter from "matter-js";
import { Ball } from "./Ball";
import { Course } from "./Course";
import golfSwingSrc from '/src/assets/golfswing.mp3';

export class Engine {
    constructor(canvas, width = 1000, height = 500, onWin, onLoss) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this.wallThickness = 20;

        this.onWin = onWin || (() => { });
        this.onLoss = onLoss || (() => { });

        // create engine
        this.engine = Matter.Engine.create();
        this.engine.world.gravity.y = 1.2;

        // create walls
        this.createWalls();

        // ball and animation frame id
        this.ball = null;
        this.animationId = null;

        // course (obstacles + hole)
        this.course = null;
        this.currentLevelConfig = null;
    }

    loadLevel(levelConfig) {
        if (this.course) {
            // Remove existing bodies
            Matter.World.clear(this.engine.world);
            Matter.Engine.clear(this.engine);
            this.createWalls();
            this.ball = null;
        }

        this.currentLevelConfig = levelConfig;
        this.course = new Course(this.engine, this.ctx, this.width, this.height, levelConfig, this.onWin, this.onLoss);

        // Add ball at starting position
        const { startPos, velocity } = levelConfig;
        this.addBall(startPos.x, startPos.y, 8, velocity.x, velocity.y);

        this.render();

        //swing sound
        this.swingSound = new Audio(golfSwingSrc);
    }

    createWalls() {
        const w = this.width;
        const h = this.height;
        const t = this.wallThickness;

        const topWall = Matter.Bodies.rectangle(
            w / 2,
            -t / 2,
            w + t * 2,
            t,
            { isStatic: true, label: "wall", friction: 0.5 }
        );

        const bottomWall = Matter.Bodies.rectangle(
            w / 2,
            h + t / 2,
            w + t * 2,
            t,
            { isStatic: true, label: "wall", friction: 0.5 }
        );

        const leftWall = Matter.Bodies.rectangle(
            -t / 2,
            h / 2,
            t,
            h + t * 2,
            { isStatic: true, label: "wall", friction: 0.5 }
        );

        const rightWall = Matter.Bodies.rectangle(
            w + t / 2,
            h / 2,
            t,
            h + t * 2,
            { isStatic: true, label: "wall", friction: 0.5 }
        );

        Matter.World.add(this.engine.world, [topWall, bottomWall, leftWall, rightWall]);
    }

    // adds ball to engine
    addBall(x, y, radius = 8, vx = 5, vy = -5) {

        this.ball = new Ball(x, y, radius);
        this.ball.setVelocity(vx, vy);
        Matter.World.add(this.engine.world, this.ball.body);
        if (this.course) {
            this.course.setBall(this.ball);
        }
        return this.ball;
    }

    // starts physics sim
    start() {
        this.swingSound.currentTime = 0;
        this.swingSound.play();
        // stops last animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.course) {
            this.course.startSimulation();
        }

        // CAPS 60 FPS
        const FRAME_MS = 1000 / 60;
        let lastTime = 0;

        const animate = (timestamp) => {
            this.animationId = requestAnimationFrame(animate);
            if (timestamp - lastTime < FRAME_MS) return;
            lastTime = timestamp - ((timestamp - lastTime) % FRAME_MS);
            Matter.Engine.update(this.engine, FRAME_MS);
            if (this.course) {
                this.course.update();
            }
            this.render();
        };
        requestAnimationFrame(animate);
    }

    // stops simulation
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.render();
    }

    // render to canvas
    render() {
        const ctx = this.ctx;

        // clear canvas
        ctx.fillStyle = "#111"; // PLAYFIELD BG COLOR
        ctx.fillRect(0, 0, this.width, this.height);

        // draw border
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, this.width, this.height);

        // render course
        if (this.course) {
            this.course.render(ctx);
        }

        // render ball
        if (this.ball) {
            this.ball.render(ctx);
        }
    }

    // resets ball to start
    resetBall() {
        if (!this.currentLevelConfig) return;

        if (this.ball) {
            const { startPos, velocity } = this.currentLevelConfig;
            this.ball.reset(startPos.x, startPos.y);
            this.ball.setVelocity(velocity.x, velocity.y);
            if (this.course) {
                this.course.resetBall();
            }
            this.render();
        }
    }

    // adds a block to the course
    addBlock(BlockClass, x, y, options = {}) {
        if (!this.course) return null;

        const block = new BlockClass(x, y, undefined, undefined, options);
        this.course.blocks.push(block);
        Matter.World.add(this.engine.world, block.body);
        this.render();

        return block;
    }
    clearBlocks() {
        if (this.course) {
            this.course.clearBlocks();
        }
        this.render();
    }

    // preview
    renderPreview(BlockClass, x, y) {
        const block = new BlockClass(x, y);
        const ctx = this.ctx;

        ctx.save();
        ctx.globalAlpha = 0.5;
        block.render(ctx);
        ctx.restore();
    }
}
