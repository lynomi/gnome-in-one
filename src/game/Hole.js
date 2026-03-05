import Matter from "matter-js";

export class Hole {
    constructor(x, y, radius, options = {}) {
        const {
            label = "hole",
            rimColor = "#ce1313",
            centerColor = "#000000",
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
        ctx.restore();
    }
}
