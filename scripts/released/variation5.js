import { edgeBounce, Particle, createRandomParticleValues } from '../lib/Particle';
import { connectParticles, drawParticlePoint, fillCanvas } from '../lib/canvas';
import { normalizeInverse, pointDistance, randomNumberBetween } from '../lib/math';

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

export const variation5 = () => {
    const config = {
        numParticles: 50,
    };

    const particlesArray = [];
    const circles = [];

    const setup = ({ canvas, context }) => {
        for (let i = 0; i < config.numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.x = canvas.width / 2;
            props.y = canvas.height / 2;
            props.color = { r: 0, g: 0, b: 0 };
            props.radius = 0.5;
            particlesArray.push(new Particle(props));
        }
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const diameter = canvas.height / 4;
        const steps = 30;
        for (let theta = 0; theta < 360; theta += steps) {
            const rad = theta * (Math.PI / 180);
            const x = Math.cos(rad) * diameter + centerX;
            const y = Math.sin(rad) * diameter + centerY;
            circles.push([x, y, randomNumberBetween(20, 100)]);
        }
        fillCanvas(canvas, context)(1, '255,255,255');
    };

    const draw = ({ canvas, context, mouse }) => {
        // fillCanvas(canvas, context)(.005,'255,255,255');
        for (let i = 0; i < config.numParticles; i++) {
            particlesArray[i].updatePosWithVelocity();
            edgeBounce(canvas, particlesArray[i]);
            for (let c = 0; c < circles.length; c++) {
                avoidPoint({ radius: circles[c][2], x: circles[c][0], y: circles[c][1] }, particlesArray[i], 4);
            }
            drawParticlePoint(context)(particlesArray[i]);
        }
        connectParticles(context)(particlesArray, 50);
    };

    return {
        config,
        setup,
        draw,
    };
};
