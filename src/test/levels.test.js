import { describe, it, expect } from 'vitest';
import { LEVELS } from '../game/levels';

describe('LEVELS', () => {
    it('has 20 levels with sequential IDs', () => {
        expect(LEVELS).toHaveLength(20);
        LEVELS.forEach((l, i) => expect(l.id).toBe(i + 1));
    });

    it('every level has startPos, velocity, hole, obstacles, and maxBlocks', () => {
        for (const l of LEVELS) {
            expect(l.startPos).toHaveProperty('x');
            expect(l.startPos).toHaveProperty('y');
            expect(l.velocity).toHaveProperty('x');
            expect(l.velocity).toHaveProperty('y');
            expect(l.hole.radius).toBeGreaterThan(0);
            expect(Array.isArray(l.obstacles)).toBe(true);
            expect(l.maxBlocks).toBeGreaterThan(0);
        }
    });
});
