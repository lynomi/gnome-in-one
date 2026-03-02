import Matter from "matter-js";
import { Block } from "./Block";
import { Hole } from "./Hole";

const DEFAULT_MAP = {
    hole: { x: 735, y: 330, radius: 12 },
    obstacles: [
        { id: "ramp-1", x: 240, y: 260, width: 130, height: 18, angle: -0.25 },
        { id: "ramp-2", x: 460, y: 160, width: 160, height: 18, angle: 0.3 },
        { id: "block-3", x: 620, y: 260, width: 90, height: 18, angle: 0 }
    ]
};

export class Course {
    constructor(engine, ctx, width, height, map = DEFAULT_MAP) {
        this.engine = engine;
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.map = map;

        this.blocks = [];
        this.hole = null;
        this.ball = null;
        this.ballInHole = false;

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
    }

    resetBall() {
        if (!this.ball) return;
        this.ballInHole = false;
        Matter.Body.setStatic(this.ball.body, false);
    }

    bindCollisions() {
        Matter.Events.on(this.engine, "collisionStart", event => {
            if (!this.ball || !this.hole || this.ballInHole) return;

            for (const pair of event.pairs) {
                const labels = [pair.bodyA.label, pair.bodyB.label];
                const isBallHole = labels.includes("ball") && labels.includes("hole");

                if (isBallHole) {
                    this.ballInHole = true;
                    Matter.Body.setVelocity(this.ball.body, { x: 0, y: 0 });
                    Matter.Body.setAngularVelocity(this.ball.body, 0);
                    Matter.Body.setPosition(this.ball.body, this.hole.body.position);
                    Matter.Body.setStatic(this.ball.body, true);
                    break;
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
