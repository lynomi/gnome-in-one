import Matter from "matter-js";
import { Block } from "./Block";

export class SpeedRamp extends Block {
    constructor(x, y, width = 120, height = 20, options = {}) {
        const {
            angle = 0,
            isStatic = true,
            color = "#00e5ff",
            label = "speedRamp",
            boostForce = 0.30,
            ...bodyOptions
        } = options;

        super(x, y, width, height, {
            angle,
            isStatic,
            color,
            label,
            friction: 0.0,
            restitution: 0.0,
            ...bodyOptions
        });

        this.boostForce = boostForce;
        this.color = color;
    }

    // call this each physics frame from Course.update()
    applyBoost(ball) {
        if (!ball) return;
        const collision = Matter.Query.collides(ball.body, [this.body]);
        if (collision.length > 0) {
            const vel = ball.body.velocity;
            const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
            if (speed > 0.1) {
                // boost in the direction the ball is already moving
                const nx = vel.x / speed;
                const ny = vel.y / speed;
                Matter.Body.applyForce(ball.body, ball.body.position, {
                    x: nx * this.boostForce,
                    y: ny * this.boostForce
                });
            }
        }
    }

    render(ctx) {
        const { x, y } = this.body.position;
        const angle = this.body.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // main rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // arrow indicators showing boost direction
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        const arrowCount = 3;
        const spacing = this.width / (arrowCount + 1);
        for (let i = 1; i <= arrowCount; i++) {
            const ax = -this.width / 2 + spacing * i;
            ctx.beginPath();
            ctx.moveTo(ax - 6, -4);
            ctx.lineTo(ax + 6, 0);
            ctx.lineTo(ax - 6, 4);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}
