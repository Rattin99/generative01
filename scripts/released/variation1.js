import { edgeBounce, Particle, createRandomParticleValues } from '../lib/systems/Particle';
import { clearCanvas, fillCanvas } from '../lib/canvas/canvas';
import { normalizeInverse, pointDistance } from '../lib/math/math';
import { connectParticles, drawMouse, drawParticlePoint, drawPointTrail } from '../lib/canvas/canvas-particles';

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

// for moving points, pull towards point
const attractPoint = (point, particle, f = 1) => {
    gravityPoint(1, f)(point.x, point.y, point.radius, particle);
};

// Based on https://www.youtube.com/watch?v=d620nV6bp0A
export const variation1 = () => {
    const numParticles = 100;
    const particlesArray = [];

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.radius = 5;
            particlesArray.push(new Particle(props));
        }
    };

    const draw = ({ canvas, context, mouse }) => {
        fillCanvas(canvas, context)();

        for (let i = 0; i < numParticles; i++) {
            particlesArray[i].updatePosWithVelocity();
            edgeBounce(canvas, particlesArray[i]);
            avoidPoint({ radius: centerRadius, x: canvasCenterX, y: canvasCenterY }, particlesArray[i], 4);
            attractPoint(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
            drawParticlePoint(context)(particlesArray[i]);
            drawPointTrail(context)(particlesArray[i]);
        }
        connectParticles(context)(particlesArray, 200);
        drawMouse(context)(mouse);
    };

    return {
        setup,
        draw,
    };
};
