import Matter from "matter-js";
import { Block } from "./Block";

export class Ramp extends Block {
    constructor(x, y, width = 130, height = 80, options = {}) {
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

        this.body = Matter.Bodies.fromVertices(
            x,
            y,
            [
                { x: -width / 3, y: height / 3 },   // bottom left
                { x: -width / 3, y: -2 * height / 3 },  // top left
                { x: 2 * width / 3, y: height / 3 }     // bottom right
            ],
            {
                isStatic,
                angle,
                label,
                friction: 0.001,
                restitution: 0.2,
                ...bodyOptions
            }
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
        ctx.moveTo(-this.width / 3, this.height / 3); // bottom left
        ctx.lineTo(-this.width / 3, -2 * this.height / 3); // top left
        ctx.lineTo(2 * this.width / 3, this.height / 3); // bottom right
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
