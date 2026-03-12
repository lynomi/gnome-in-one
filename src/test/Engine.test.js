import { describe, it, expect, vi, beforeEach } from 'vitest';
import Matter from 'matter-js';
import { Engine } from '../game/Engine';
import { Block } from '../game/Block';
import { Ramp } from '../game/Ramp';
import { LEVELS } from '../game/levels';

function makeCanvas() {
    const ctx = {
        fillRect: vi.fn(), strokeRect: vi.fn(), clearRect: vi.fn(),
        beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(),
        moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(),
        save: vi.fn(), restore: vi.fn(), translate: vi.fn(), rotate: vi.fn(),
        drawImage: vi.fn(), measureText: vi.fn(() => ({ width: 0 })),
    };
    return { getContext: () => ctx, width: 1000, height: 500 };
}

describe('Engine', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine(makeCanvas(), 1000, 500);
    });

    it('adds 4 walls on init with wallThickness of 50', () => {
        const walls = Matter.Composite.allBodies(engine.engine.world).filter(b => b.label === 'wall');
        expect(walls).toHaveLength(4);
        expect(engine.wallThickness).toBe(50);
    });

    it('isValidPlacement returns true for empty space, false when overlapping', () => {
        engine.loadLevel(LEVELS[0]);
        const { x, y } = LEVELS[0].startPos;
        expect(engine.isValidPlacement(Block, 500, 50, 60, 12)).toBe(true);
        expect(engine.isValidPlacement(Block, x, y, 120, 18)).toBe(false);
    });

    it('addBlock appends to course and clearBlocks removes only placed blocks', () => {
        engine.loadLevel(LEVELS[0]);
        const base = engine.course.blocks.length;
        engine.addBlock(Block, 500, 50, 120, 18);
        engine.addBlock(Ramp, 600, 50, 130, 80);
        expect(engine.course.blocks).toHaveLength(base + 2);
        engine.clearBlocks();
        expect(engine.course.blocks).toHaveLength(base);
    });

    it('loadLevel places the ball at the level start position', () => {
        engine.loadLevel(LEVELS[0]);
        const { x, y } = LEVELS[0].startPos;
        expect(engine.ball.body.position.x).toBeCloseTo(x);
        expect(engine.ball.body.position.y).toBeCloseTo(y);
    });
});
