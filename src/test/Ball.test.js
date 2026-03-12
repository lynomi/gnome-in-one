import { describe, it, expect } from 'vitest';
import { Ball } from '../game/Ball';

describe('Ball', () => {
    it('creates a body with correct label, position, and slop', () => {
        const ball = new Ball(100, 200, 8);
        expect(ball.body.label).toBe('ball');
        expect(ball.body.position.x).toBeCloseTo(100);
        expect(ball.body.position.y).toBeCloseTo(200);
        expect(ball.body.slop).toBe(0);
    });

    it('reset restores position and clears velocity and trail', () => {
        const ball = new Ball(100, 100, 8);
        ball.trail = [{ x: 1, y: 2 }];
        ball.setVelocity(10, 10);
        ball.reset(50, 75);
        expect(ball.body.position.x).toBeCloseTo(50);
        expect(ball.body.velocity.x).toBeCloseTo(0);
        expect(ball.trail).toHaveLength(0);
    });
});
