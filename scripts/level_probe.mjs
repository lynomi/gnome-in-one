import Matter from 'matter-js';
import { LEVELS } from '../src/game/levels.js';

const LEVEL_ID = Number(process.argv[2] || '6');
const level = LEVELS.find((l) => l.id === LEVEL_ID);
if (!level) {
  console.error('Level not found');
  process.exit(1);
}

const WIDTH = 1000;
const HEIGHT = 500;
const WALL_T = 20;
const DT = 1000 / 60;

function createWalls(world) {
  const w = WIDTH;
  const h = HEIGHT;
  const t = WALL_T;
  Matter.World.add(world, [
    Matter.Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, { isStatic: true, label: 'wall', friction: 0.5 }),
    Matter.Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, { isStatic: true, label: 'wall', friction: 0.5 }),
    Matter.Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, { isStatic: true, label: 'wall', friction: 0.5 }),
    Matter.Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, { isStatic: true, label: 'wall', friction: 0.5 }),
  ]);
}

function simulate(angleDeg, power, maxSteps = 1000) {
  const engine = Matter.Engine.create();
  engine.world.gravity.y = 1.2;
  createWalls(engine.world);

  const blocks = level.obstacles.map((o) =>
    Matter.Bodies.rectangle(o.x, o.y, o.width, o.height, {
      isStatic: true,
      angle: o.angle || 0,
      label: o.label || 'block',
      friction: 0.001,
      restitution: 0.2,
    })
  );
  Matter.World.add(engine.world, blocks);

  const hole = Matter.Bodies.circle(level.hole.x, level.hole.y, level.hole.radius, {
    isStatic: true,
    isSensor: true,
    label: 'hole',
  });
  Matter.World.add(engine.world, hole);

  const ball = Matter.Bodies.circle(level.startPos.x, level.startPos.y, 8, {
    friction: 0.001,
    frictionAir: 0.005,
    restitution: 0.85,
    density: 0.04,
    label: 'ball',
  });

  const rad = (angleDeg * Math.PI) / 180;
  Matter.Body.setVelocity(ball, { x: Math.cos(rad) * power, y: Math.sin(rad) * power });
  Matter.World.add(engine.world, ball);

  let won = false;

  Matter.Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      const labels = [a.label, b.label];

      if (labels.includes('ball') && labels.includes('hole')) {
        won = true;
        return;
      }

      if (labels.includes('ball') && labels.includes('bombgnome')) {
        const bombBody = a.label === 'bombgnome' ? a : b;
        const dx = ball.position.x - bombBody.position.x;
        const dy = ball.position.y - bombBody.position.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        Matter.Body.setVelocity(ball, { x: (dx / len) * 18, y: (dy / len) * 18 });
      }

      if (labels.includes('ball') && labels.includes('speedRamp')) {
        const rampBody = a.label === 'speedRamp' ? a : b;
        const rampAngle = rampBody.angle;
        const boostStrength = 18;
        const boostX = Math.cos(rampAngle) * boostStrength;
        const boostY = Math.sin(rampAngle) * boostStrength;
        const currentVel = ball.velocity;
        Matter.Body.setVelocity(ball, {
          x: boostX,
          y: boostY + currentVel.y * 0.3,
        });
      }
    }
  });

  for (let i = 0; i < maxSteps; i++) {
    Matter.Engine.update(engine, DT);
    if (won) return true;
    const speed = ball.speed;
    if (speed < 0.1 && Math.abs(ball.angularVelocity) < 0.05) return false;
  }

  return won;
}

let count = 0;
for (let a = -180; a <= 180; a++) {
  for (let p = 1; p <= 30; p++) {
    count++;
    if (simulate(a, p, 1200)) {
      console.log(`Found: level ${LEVEL_ID}, angle=${a}, power=${p}, tested=${count}`);
      process.exit(0);
    }
  }
}
console.log(`No shot found for level ${LEVEL_ID} after ${count} tests.`);
