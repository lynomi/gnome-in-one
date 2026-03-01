import Matter from "matter-js";
import { Block } from "./Block";

export class Ramp extends Block {
    constructor(x, y, width, height, options = {}) {
        const {
            angle = 0,
            isStatic = true,
            color = "#6b6b6b",
            label = "ramp",
            ...bodyOptions
        } = options;

        super(x, y, width, height, {
            angle,
            isStatic,
            color,
            label,
            ...bodyOptions
        });

        // Replace rectangular body with triangular body
        this.body = Matter.Bodies.fromVertices(
            x,
            y,
            [
                { x: -width / 2, y: height / 2 },   // bottom left
                { x: width / 2, y: height / 2 },   // bottom right
                { x: -width / 2, y: -height / 2 }   // top left
            ],
            {
                isStatic,
                angle,
                label,
                friction: 0.6,
                restitution: 0.1,
                ...bodyOptions
            },
            true
        );
    }

    render(ctx) {
        const { x, y } = this.body.position;
        const angle = this.body.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(-this.width / 2, this.height / 2);  // bottom left
        ctx.lineTo(this.width / 2, this.height / 2);   // bottom right
        ctx.lineTo(-this.width / 2, -this.height / 2); // top left
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}