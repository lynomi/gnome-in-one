import { describe, it, expect } from 'vitest';
import { Block } from '../game/Block';

describe('Block', () => {
    it('creates a static body with correct label and position', () => {
        const block = new Block(300, 200, 120, 18);
        expect(block.body.isStatic).toBe(true);
        expect(block.body.label).toBe('block');
        expect(block.body.position.x).toBeCloseTo(300);
    });

    it('respects custom label and angle options', () => {
        const block = new Block(0, 0, 120, 18, { label: 'custom', angle: Math.PI / 4 });
        expect(block.body.label).toBe('custom');
        expect(block.body.angle).toBeCloseTo(Math.PI / 4);
    });
});
