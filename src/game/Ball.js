import Matter from "matter-js";

export class Ball {
    constructor(x, y, radius = 10, options = {}) {
        this.radius = radius;
        this.trail = [];
        this.body = Matter.Bodies.circle(x, y, radius, {
            friction: 0.001,
            frictionAir: 0.005,
            restitution: 0.85, // bounce setting
            density: 0.04,
            label: "ball",
            ...options
        });
    }

    // creates the ball
    static createCircle(x, y, radius = 10, options = {}) {
        return Matter.Bodies.circle(x, y, radius, {
            friction: 0.001,
            frictionAir: 0.005,
            restitution: 0.85,
            density: 0.04,
            label: "ball",
            ...options
        });
    }

    // sets ball velocty
    setVelocity(vx, vy) {
        Matter.Body.setVelocity(this.body, { x: vx, y: vy });
    }

    // apply force to ball
    applyForce(fx, fy) {
        Matter.Body.applyForce(this.body, this.body.position, { x: fx, y: fy });
    }

    // resets ball
    reset(x, y) {
        Matter.Body.setPosition(this.body, { x, y });
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(this.body, 0);
        this.trail = [];
    }

    // render ball
    render(ctx) {
        const { x, y } = this.body.position;
        const angle = this.body.angle;

        // update and draw trail
        this.trail.push({ x, y });
        if (this.trail.length > 20) this.trail.shift();
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i / this.trail.length) * 0.4;
            const r = this.radius * 0.5 * (i / this.trail.length);
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fill();
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.radius, 0);
        ctx.stroke();
        ctx.restore();
    }
}
