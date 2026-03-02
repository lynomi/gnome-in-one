import Matter from "matter-js";

export class Block {
    constructor(x, y, width, height, options = {}) {
        const {
            angle = 0,
            isStatic = true,
            color = "#6b6b6b",
            label = "block",
            ...bodyOptions
        } = options;

        this.width = width;
        this.height = height;
        this.color = color;

        this.body = Matter.Bodies.rectangle(x, y, width, height, {
            isStatic,
            angle,
            label,
            friction: 0.001,
            restitution: 0.2,
            ...bodyOptions
        });
    }

    render(ctx) {
        const { x, y } = this.body.position;
        const angle = this.body.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}
