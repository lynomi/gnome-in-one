import { Block } from "./Block";
import bombGnomeSrc from '/src/assets/bombGnome.png';

const bombImage = new Image();
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

export class BombGnome extends Block {
    constructor(x, y, options = {}) {
        const { w, h } = getDims();
        super(x, y, w, h, {
            color: "#cc3300",
            label: "bombgnome",
            restitution: 0,
            ...options
        });
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
