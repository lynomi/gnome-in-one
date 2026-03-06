import Matter from "matter-js";
import redFlagSrc from '/src/assets/red-flag.svg';

const flag = new Image();
flag.src = redFlagSrc;

export class Hole {
    constructor(x, y, radius, options = {}) {
        const {
            label = "hole",
            rimColor = "#007c25",
            centerColor = "#009431",
            ...bodyOptions
        } = options;

        this.radius = radius;
        this.rimColor = rimColor;
        this.centerColor = centerColor;

        this.body = Matter.Bodies.circle(x, y, radius, {
            isStatic: true,
            isSensor: true,
            label,
            ...bodyOptions
        });
    }

    render(ctx) {
        const { x, y } = this.body.position;

        ctx.save();
        ctx.fillStyle = this.rimColor;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.centerColor;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, this.radius - 3), 0, Math.PI * 2);
        ctx.fill();

        // render flag
        if (flag.complete) {
            const flagH = 90;
            const flagW = flagH * (flag.naturalWidth / flag.naturalHeight);
            ctx.drawImage(flag, x - flagW / 2, y - this.radius - flagH, flagW, flagH);
        }

        ctx.restore();
    }
}
