import { describe, it, expect } from 'vitest';
import { SpeedRamp } from '../game/SpeedRamp';
import { Block } from '../game/Block';

describe('SpeedRamp', () => {
    it('is a static Block with label "speedRamp"', () => {
        const ramp = new SpeedRamp(200, 300);
        expect(ramp).toBeInstanceOf(Block);
        expect(ramp.body.label).toBe('speedRamp');
        expect(ramp.body.isStatic).toBe(true);
    });
});
