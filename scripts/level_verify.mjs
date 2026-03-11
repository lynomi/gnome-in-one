import Matter from 'matter-js';
import { LEVELS } from '../src/game/levels.js';

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

function simulate(level, angleDeg, power, maxSteps = 900) {
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

function findShot(level) {
  const defAngle = Math.round((Math.atan2(level.velocity.y, level.velocity.x) * 180) / Math.PI);
  const defPower = Math.round(Math.sqrt(level.velocity.x ** 2 + level.velocity.y ** 2));

  const tried = new Set();
  const test = (a, p) => {
    const angle = Math.max(-180, Math.min(180, a));
    const power = Math.max(1, Math.min(30, p));
    const key = `${angle}:${power}`;
    if (tried.has(key)) return false;
    tried.add(key);
    return simulate(level, angle, power);
  };

  if (test(defAngle, defPower)) return { angle: defAngle, power: defPower };

  for (let da = -70; da <= 70; da += 5) {
    for (let dp = -14; dp <= 14; dp += 1) {
      const a = defAngle + da;
      const p = defPower + dp;
      if (test(a, p)) {
        return {
          angle: Math.max(-180, Math.min(180, a)),
          power: Math.max(1, Math.min(30, p)),
        };
      }
    }
  }

  for (let a = -180; a <= 180; a += 5) {
    for (let p = 1; p <= 30; p += 1) {
      if (test(a, p)) return { angle: a, power: p };
    }
  }

  return null;
}

const missing = [];
for (const level of LEVELS) {
  const shot = findShot(level);
  if (!shot) {
    missing.push(level.id);
    console.log(`Level ${level.id}: NO SHOT FOUND`);
  } else {
    console.log(`Level ${level.id}: SOLVABLE at angle=${shot.angle}, power=${shot.power}`);
  }
}

console.log(`Missing levels: ${missing.length ? missing.join(', ') : 'none'}`);
