import Matter from "matter-js";
import { Block } from "./Block";
import { Hole } from "./Hole";

export class Course {
    constructor(engine, ctx, width, height, map, onWin, onLoss) {
        this.engine = engine;
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.map = map;
        this.onWin = onWin || (() => { });
        this.onLoss = onLoss || (() => { });

        this.blocks = [];
        this.hole = null;
        this.ball = null;

        // Game state
        this.ballInHole = false;
        this.ballStopped = false;
        this.isRunning = false;

        this.buildMap();
        this.bindCollisions();
    }

    buildMap() {
        this.blocks = this.map.obstacles.map(obstacle => {
            return new Block(obstacle.x, obstacle.y, obstacle.width, obstacle.height, {
                angle: obstacle.angle || 0,
                color: obstacle.color || "#6b6b6b",
                label: obstacle.label || "block"
            });
        });

        if (this.map.hole) {
            const { x, y, radius } = this.map.hole;
            this.hole = new Hole(x, y, radius);
        }

        const bodies = [
            ...this.blocks.map(block => block.body),
            ...(this.hole ? [this.hole.body] : [])
        ];

        if (bodies.length) {
            Matter.World.add(this.engine.world, bodies);
        }

        this.blockCount = this.blocks.length;
    }

    clearBlocks() {
        const placed = this.blocks.slice(this.blockCount);
        placed.forEach(block => Matter.World.remove(this.engine.world, block.body));
        this.blocks = this.blocks.slice(0, this.blockCount);
    }

    setBall(ball) {
        this.ball = ball;
        this.ballInHole = false;
        this.ballStopped = false;
        this.isRunning = false;
    }

    resetBall() {
        if (!this.ball) return;
        this.ballInHole = false;
        this.ballStopped = false;
        this.isRunning = false;
        Matter.Body.setStatic(this.ball.body, false);

    }

    startSimulation() {
        this.isRunning = true;
    }

    update() {
        if (!this.isRunning || !this.ball || this.ballInHole || this.ballStopped) return;

        // Check if ball stopped moving
        const velocity = this.ball.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

        // Let gravity and friction settle it. If speed is very low and it's practically stationary
        if (speed < 0.1 && this.ball.body.angularVelocity < 0.05) {
            this.ballStopped = true;
            this.onLoss();
        }
    }

    bindCollisions() {
        Matter.Events.on(this.engine, "collisionStart", event => {
            if (!this.ball) return;

            for (const pair of event.pairs) {
                const labels = [pair.bodyA.label, pair.bodyB.label];

                // hole
                if (!this.ballInHole && this.hole && labels.includes("ball") && labels.includes("hole")) {
                    this.ballInHole = true;
                    this.isRunning = false;
                    Matter.Body.setVelocity(this.ball.body, { x: 0, y: 0 });
                    Matter.Body.setAngularVelocity(this.ball.body, 0);
                    Matter.Body.setPosition(this.ball.body, this.hole.body.position);
                    Matter.Body.setStatic(this.ball.body, true);
                    this.onWin();
                    break;
                }

                // Bomb Gnome - shoots ball away
                if (labels.includes("ball") && labels.includes("bombgnome")) {
                    const bombBody = pair.bodyA.label === "bombgnome" ? pair.bodyA : pair.bodyB;
                    const ballBody = this.ball.body;

                    const dx = ballBody.position.x - bombBody.position.x;
                    const dy = ballBody.position.y - bombBody.position.y;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    Matter.Body.setVelocity(ballBody, { x: (dx / len) * 18, y: (dy / len) * 18 });
                }
                // Speed Ramp - boosts ball in the ramp's facing direction
                if (labels.includes("ball") && labels.includes("speedRamp")) {
                    const rampBody = pair.bodyA.label === "speedRamp" ? pair.bodyA : pair.bodyB;
                    const ballBody = this.ball.body;

                    // Get the ramp's facing direction from its angle
                    const rampAngle = rampBody.angle;
                    const boostStrength = 18; // tweak this for more/less speed

                    // Project current velocity onto ramp direction, then boost along it
                    const boostX = Math.cos(rampAngle) * boostStrength;
                    const boostY = Math.sin(rampAngle) * boostStrength;

                    // Preserve vertical momentum, override horizontal with boost
                    const currentVel = ballBody.velocity;
                    Matter.Body.setVelocity(ballBody, {
                        x: boostX,
                        y: boostY + currentVel.y * 0.3 // blend gravity with boost
                    });
                }

            }
        });

    }

    render() {
        if (!this.ctx) return;

        if (this.hole) {
            this.hole.render(this.ctx);
        }

        for (const block of this.blocks) {
            block.render(this.ctx);
        }
    }
}
