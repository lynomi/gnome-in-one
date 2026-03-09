import Matter from "matter-js";
import { Block } from "./Block";
import bombGnomeSrc from '/src/assets/bombGnome.png';

export const bombImage = new Image();
bombImage.src = bombGnomeSrc;

// scale to this height; width derived from PNG aspect ratio once loaded
const DISPLAY_HEIGHT = 80;

function getDims() {
    if (bombImage.complete && bombImage.naturalHeight > 0) {
        const w = Math.round(bombImage.naturalWidth / bombImage.naturalHeight * DISPLAY_HEIGHT);
        return { w, h: DISPLAY_HEIGHT };
    }
    return { w: 60, h: DISPLAY_HEIGHT };
}

function makeOvalVertices(rx, ry, segments = 16) {
    const verts = [];
    for (let i = 0; i < segments; i++) {
        const angle = (2 * Math.PI * i) / segments;
        verts.push({ x: rx * Math.cos(angle), y: ry * Math.sin(angle) });
    }
    return verts;
}

export class BombGnome extends Block {
    constructor(x, y, width, height, options = {}) {
        const { w, h } = getDims();
        super(x, y, w, h, {
            color: "#cc3300",
            label: "bombgnome",
            restitution: 0,
            ...options
        });

        const { isStatic = true, angle = 0, restitution = 0, ...rest } = options;
        this.body = Matter.Bodies.fromVertices(
            x, y,
            makeOvalVertices(w / 2, h / 2),
            { isStatic, angle, label: "bombgnome", friction: 0.001, restitution, ...rest }
        );
        // fromVertices shifts the centroid — re-center it
        Matter.Body.setPosition(this.body, { x, y });
    }

    render(ctx) {
        const { x, y } = this.body.position;
        const angle = this.body.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        if (bombImage.complete) {
            ctx.drawImage(bombImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
}
