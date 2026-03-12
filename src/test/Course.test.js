import { describe, it, expect, vi } from 'vitest';
import Matter from 'matter-js';
import { Course } from '../game/Course';
import { Ball } from '../game/Ball';

function makeEngine() {
    return Matter.Engine.create({ gravity: { y: 1.2 } });
}

const MAP = {
    obstacles: [{ x: 400, y: 300, width: 100, height: 18 }],
    hole: { x: 800, y: 400, radius: 12 }
};

describe('Course', () => {
    it('calls onWin when ball collides with hole', () => {
        const engine = makeEngine();
        const onWin = vi.fn();
        const course = new Course(engine, null, 1000, 500, MAP, onWin);
        const ball = new Ball(100, 100, 8);
        Matter.World.add(engine.world, ball.body);
        course.setBall(ball);
        course.startSimulation();

        Matter.Events.trigger(engine, 'collisionStart', {
            pairs: [{ bodyA: ball.body, bodyB: course.hole.body }]
        });

        expect(onWin).toHaveBeenCalledTimes(1);
    });

    it('calls onLoss when ball stops moving', () => {
        const engine = makeEngine();
        const onLoss = vi.fn();
        const course = new Course(engine, null, 1000, 500, MAP, undefined, onLoss);
        const ball = new Ball(100, 100, 8);
        Matter.World.add(engine.world, ball.body);
        course.setBall(ball);
        course.startSimulation();

        Matter.Body.setVelocity(ball.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(ball.body, 0);
        course.update();

        expect(onLoss).toHaveBeenCalledTimes(1);
    });
});
