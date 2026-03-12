import { describe, it, expect } from 'vitest';
import { Ramp } from '../game/Ramp';
import { Block } from '../game/Block';

describe('Ramp', () => {
    it('is a static Block with label "ramp" and polygon vertices', () => {
        const ramp = new Ramp(200, 300);
        expect(ramp).toBeInstanceOf(Block);
        expect(ramp.body.label).toBe('ramp');
        expect(ramp.body.isStatic).toBe(true);
        expect(ramp.body.vertices.length).toBeGreaterThan(2);
    });
});
