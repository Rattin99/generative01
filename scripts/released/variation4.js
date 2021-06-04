import { createRandomParticleValues, Particle } from '../systems/Particle';
import { fillCanvas } from '../lib/canvas/canvas';
import { normalizeInverse, pointDistance } from '../lib/math/math';
import { connectParticles, drawParticlePoint } from '../lib/canvas/canvas-particles';

const pointPush = (point, particle, f = 1) => {
    const dx = point.x - particle.x;
    const dy = point.y - particle.y;
    const distance = pointDistance(point, particle);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const force = normalizeInverse(0, point.radius, distance) * f;
    particle.velocityX = forceDirectionX * force * particle.mass * 0.8;
    particle.velocityY = forceDirectionY * force * particle.mass * 0.8;

    if (distance < point.radius) {
        particle.x -= particle.velocityX;
        particle.y -= particle.velocityY;
    } else {
        // TODO if < 1 then snap to 0
        if (particle.x !== particle.oX) {
            particle.x -= (particle.x - particle.oX) * 0.1;
        }
        if (particle.y !== particle.oY) {
            particle.y -= (particle.y - particle.oY) * 0.1;
        }
    }
};

export const variation4 = () => {
    const config = {
        numParticles: 0,
    };

    const particlesArray = [];
    const circles = [];

    const setup = ({ canvas, context }) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const diameter = canvas.height / 4;
        const steps = 10;

        for (let theta = 0; theta < 360; theta += steps) {
            const rad = theta * (Math.PI / 180);
            const x = Math.cos(rad) * diameter + centerX;
            const y = Math.sin(rad) * diameter + centerY;
            circles.push([x, y]);
            const props = createRandomParticleValues(canvas);
            props.x = x;
            props.y = y;
            props.radius = 1;
            props.color = { r: 0, g: 0, b: 0 };
            props.index = circles.length - 1;
            particlesArray.push(new Particle(props));
        }
        config.numParticles = particlesArray.length;
        fillCanvas(canvas, context)(1, '255,255,255');
    };

    // will run every frame
    const draw = ({ canvas, context, mouse }) => {
        fillCanvas(canvas, context)(0.005, '255,255,255');
        for (let i = 0; i < config.numParticles; i++) {
            pointPush(mouse, particlesArray[i], mouse.isDown ? -1 : 5);
            drawParticlePoint(context)(particlesArray[i]);
            // let index = particlesArray[i].index + 1;
            // if(index === circles.length) {
            //     index = 0;
            // }
            // particlesArray[i].x = circles[index][0];
            // particlesArray[i].y = circles[index][1];
            // particlesArray.index = index;
        }
        connectParticles(context)(particlesArray, 200);
        return 1; // -1 to exit animation loop
    };

    return {
        config,
        setup,
        draw,
    };
};
