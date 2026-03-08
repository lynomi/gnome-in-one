import Matter from "matter-js";
import { Block } from "./Block";

export class SpeedRamp extends Block {
    constructor(x, y, width = 120, height = 20, options = {}) {
        const {
            angle = 0,
            isStatic = true,
            color = "#00e5ff",
            label = "speedRamp",
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

        this.color = color;
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
        ctx.fillStyle = "#ffffff";
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