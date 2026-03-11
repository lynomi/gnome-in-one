import Matter from "matter-js";
import { Ball } from "./Ball";
import { Course } from "./Course";
import golfSwingSrc from '/src/assets/golfswing.mp3';
import bouncedOnceSrc from '/src/assets/bouncedOnce.mp3';
import bricksBuildSrc from '/src/assets/bricksBuild.mp3';
import clearingBricksSrc from '/src/assets/clearingBricks.mp3';

export class Engine {
    constructor(canvas, width = 1000, height = 500, onWin, onLoss) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this.wallThickness = 20;

        this.onWin = onWin || (() => { });
        this.onLoss = onLoss || (() => { });

        // web audio api
        this.audioContext = new AudioContext();
        this.swingBuffer = null;
        fetch(golfSwingSrc)
            .then(r => r.arrayBuffer())
            .then(buf => this.audioContext.decodeAudioData(buf))
            .then(decoded => { this.swingBuffer = decoded; })
            .catch(() => { });

        // create engine
        this.engine = Matter.Engine.create();
        this.engine.world.gravity.y = 1.2;

        // create walls
        this.createWalls();

        // ball and animation frame id
        this.ball = null;
        this.animationId = null;
        this.showTrajectory = true;
        this.collisionSoundHandler = null;

        // course (obstacles + hole)
        this.course = null;
        this.currentLevelConfig = null;
        this.currentVelocity = { x: 0, y: 0 };
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
        this.showTrajectory = true;
        this.course = new Course(this.engine, this.ctx, this.width, this.height, levelConfig, this.onWin, this.onLoss);

        // Add ball at starting position
        const { startPos, velocity } = levelConfig;
        this.currentVelocity = { ...velocity };
        this.addBall(startPos.x, startPos.y, 8, velocity.x, velocity.y);

        this.setupCollisionSounds(); // sound for ball

        this.render();

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

    // shows trajectory of ball path
    renderTrajectory(ctx) {
        if (!this.ball || !this.currentLevelConfig) return;
        const { startPos } = this.currentLevelConfig;
        const velocity = this.currentVelocity;
        const delta = 1000 / 60;
        const g = this.engine.world.gravity.y * 0.001 * delta * delta; // matches Matter.js Verlet: gravity * scale * deltaÂ²
        let x = startPos.x, y = startPos.y;
        let vx = velocity.x, vy = velocity.y;

        ctx.save();
        // Limit trajectory to a short preview (e.g., 12 steps) to prevent trivializing puzzles
        const maxSteps = 12;
        for (let i = 0; i < maxSteps; i++) {
            vx *= (1 - 0.005); // air friction
            vy *= (1 - 0.005);
            vy += g;
            x += vx;
            y += vy;
            if (x < 0 || x > this.width || y < 0 || y > this.height) break;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            // Fade out smoothly over the steps
            ctx.fillStyle = `rgba(255,255,255,${0.6 - i * (0.6 / maxSteps)})`;
            ctx.fill();
        }
        ctx.restore();
    }

    // starts physics sim
    start() {
        this.showTrajectory = false;
        if (this.swingBuffer) {
            if (this.audioContext.state === 'suspended') this.audioContext.resume();
            const source = this.audioContext.createBufferSource();
            source.buffer = this.swingBuffer;
            source.connect(this.audioContext.destination);
            source.start(0);
        }
        // stops last animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.course) {
            this.course.startSimulation();
        }

        // consistent frame time simulation
        const FRAME_MS = 1000 / 60;
        let lastTime = 0;

        const animate = (timestamp) => {
            this.animationId = requestAnimationFrame(animate);
            if (timestamp - lastTime < FRAME_MS) return;
            lastTime = timestamp;
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
        ctx.fillStyle = "#3599d7"; // PLAYFIELD BG COLOR
        ctx.fillRect(0, 0, this.width, this.height);

        // draw border
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, this.width, this.height);

        // render course
        if (this.course) {
            this.course.render(ctx);
        }

        // render trajectory preview (BUILD phase only)
        if (this.showTrajectory) {
            this.renderTrajectory(ctx);
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
            const { startPos } = this.currentLevelConfig;
            this.ball.reset(startPos.x, startPos.y);
            this.ball.setVelocity(this.currentVelocity.x, this.currentVelocity.y);
            this.showTrajectory = true;
            if (this.course) {
                this.course.resetBall();
            }
            this.render();
        }
    }

    setSwingVelocity(vx, vy) {
        this.currentVelocity = { x: vx, y: vy };
        if (this.ball && this.showTrajectory) {
            this.ball.setVelocity(vx, vy);
            this.render();
        }
    }

    // adds a block to the course
    addBlock(BlockClass, x, y, width, height, options = {}) {
        if (!this.course) return null;
        const sound = new Audio(bricksBuildSrc);
        sound.volume = 0.5;
        sound.play();
        const block = new BlockClass(x, y, width, height, options);
        this.course.blocks.push(block);
        Matter.World.add(this.engine.world, block.body);
        this.render();

        return block;
    }
    clearBlocks() {
        if (this.course) {
            this.course.clearBlocks();
            const sound = new Audio(clearingBricksSrc);
            sound.volume = 0.5;
            sound.play();
        }
        this.render();
    }

    // returns true if placing block doesnt overlap existing objects
    isValidPlacement(BlockClass, x, y, width, height, options = {}) {
        const tempBlock = new BlockClass(x, y, width, height, options);
        const bodiesToCheck = [];

        if (this.ball) bodiesToCheck.push(this.ball.body);
        if (this.course?.hole) bodiesToCheck.push(this.course.hole.body);
        if (this.course) bodiesToCheck.push(...this.course.blocks.map(b => b.body));

        return Matter.Query.collides(tempBlock.body, bodiesToCheck).length === 0;
    }

    // placing preview
    renderPreview(BlockClass, x, y, width, height, options = {}) {
        const block = new BlockClass(x, y, width, height, options);
        // turns red if invalid
        if (!this.isValidPlacement(BlockClass, x, y, width, height, options)) block.color = "#ff3333";

        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = 0.5;
        block.render(ctx);
        ctx.restore();
    }

    setupCollisionSounds() {
        if (this.collisionSoundHandler) {
            Matter.Events.off(this.engine, "collisionStart", this.collisionSoundHandler);
        }

        this.collisionSoundHandler = (event) => {
            const pairs = event.pairs;
            for (let pair of pairs) {
                const { bodyA, bodyB } = pair;
                const isBallInvolved =
                    bodyA.label === "ball" || bodyB.label === "ball";

                if (isBallInvolved) {
                    const ballBody = bodyA.label === "ball" ? bodyA : bodyB;
                    const vel = ballBody.speed;

                    // Map speed to volume (min 0.05, max 1.0)
                    const volume = Math.min(1.0, Math.max(0.05, vel / 20));

                    const bounce = new Audio(bouncedOnceSrc);
                    bounce.volume = volume;
                    bounce.currentTime = 0.3;
                    bounce.play();
                    break;
                }
            }
        };

        Matter.Events.on(this.engine, "collisionStart", this.collisionSoundHandler);
    }
}
