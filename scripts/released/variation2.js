import { Particle, createRandomParticleValues } from '../lib/systems/Particle';
import { clearCanvas } from '../lib/canvas/canvas';
import { normalizeInverse, pointDistance, randomNumberBetween } from '../lib/math/math';
import { connectParticles, drawMouse, drawParticlePoint } from '../lib/canvas/canvas-particles';

const gravityPoint = (mult = 0.2, f = 1) => (x, y, radius, particle) => {
    const distance = pointDistance({ x, y }, particle);
    if (distance < radius) {
        const dx = x - particle.x;
        const dy = y - particle.y;
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = normalizeInverse(0, radius, distance) * f * mult;
        const tempX = forceDirectionX * force * particle.radius * 2;
        const tempY = forceDirectionY * force * particle.radius * 2;
        particle.x += tempX;
        particle.y += tempY;
    }
};

// for moving points, push away/around from point
const avoidPoint = (point, particle, f = 1) => {
    gravityPoint(1, (f *= -1))(point.x, point.y, point.radius, particle);
};

// Based on https://www.youtube.com/watch?v=j_BgnpMPxzM
export const variation2 = () => {
    const config = {
        friction: 0.8,
        gravity: 1,
        decay: 0.05,
        tweenDamp: 0.1,
        margin: 50,
        intensity: 0,
        numParticles: 200,
    };

    const particlesArray = [];

    const setup = ({ canvas, context }) => {
        for (let i = 0; i < config.numParticles; i++) {
            particlesArray.push(new Particle(createRandomParticleValues(canvas)));
        }
    };

    const draw = ({ canvas, context, mouse }) => {
        clearCanvas(canvas, context)();

        for (let i = 0; i < config.numParticles; i++) {
            particlesArray[i].radius -= config.decay;
            if (particlesArray[i].radius <= 0) {
                const props = createRandomParticleValues(canvas);
                props.x = mouse.x + randomNumberBetween(-10, 10);
                props.y = mouse.y + randomNumberBetween(-10, 10);
                particlesArray[i].initValues(props);
            }
            particlesArray[i].y += particlesArray[i].mass * (mouse.isDown ? 1 : 0.2);
            particlesArray[i].mass += 0.2 * config.gravity;
            if (
                particlesArray[i].y + particlesArray[i].radius > canvas.height ||
                particlesArray[i].y - particlesArray[i].radius < 0
            ) {
                particlesArray[i].mass *= -1;
            }

            avoidPoint(mouse, particlesArray[i]);
            // attractPoint(psMouseCoords(), particlesArray[i]);
            drawParticlePoint(context)(particlesArray[i]);
            // drawPointTrail(context)(particlesArray[i]);
        }
        connectParticles(context)(particlesArray, 100);
        drawMouse(context)(mouse);

        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
