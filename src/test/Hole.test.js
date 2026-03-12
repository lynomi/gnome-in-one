import { describe, it, expect } from 'vitest';
import { Hole } from '../game/Hole';

describe('Hole', () => {
    it('creates a static sensor body with label "hole"', () => {
        const hole = new Hole(500, 400, 12);
        expect(hole.body.label).toBe('hole');
        expect(hole.body.isStatic).toBe(true);
        expect(hole.body.isSensor).toBe(true);
    });
});
