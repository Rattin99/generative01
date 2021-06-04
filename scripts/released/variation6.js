import { Particle, createRandomParticleValues, edgeBounce } from '../systems/Particle';
import { fillCanvas } from '../rndrgen/canvas/canvas';
import { drawParticlePoint } from '../rndrgen/canvas/particles';
import { normalizeInverse, mapRange } from '../rndrgen/math/math';
import { pointDistance } from '../rndrgen/math/points';

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

// Based on https://www.youtube.com/watch?v=j_BgnpMPxzM
export const variation6 = () => {
    const numParticles = 200;
    const particlesArray = [];
    let hue = 0;

    const setup = ({ canvas, context }) => {
        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.color = { r: 255, g: 255, b: 255 };
            particlesArray.push(new Particle(props));
        }
    };

    const draw = ({ canvas, context, mouse }) => {
        fillCanvas(canvas, context)(0.08);
        if (hue++ > 361) hue = 0;
        for (let i = 0; i < numParticles; i++) {
            particlesArray[i].radius -= 0.05;
            if (particlesArray[i].radius <= 0) {
                const initValues = createRandomParticleValues(canvas);
                initValues.x = mouse.x ? mouse.x : canvas.width / 2;
                initValues.y = mouse.y ? mouse.y : canvas.height / 2;
                // let h = lerpRange(0,canvas.width,100,200,initValues.x);
                const s = mapRange(0, 10, 0, 100, initValues.radius);
                const l = mapRange(0, 10, 25, 75, initValues.radius);
                initValues.color = `hsl(${hue},${s}%,${l}%)`;
                particlesArray[i].initValues(initValues);
            }
            particlesArray[i].updatePosWithVelocity();
            edgeBounce(canvas, particlesArray[i]);

            gravityPoint()(canvas.width / 2, canvas.height, 2000, particlesArray[i]);
            // gravityPoint({x:canvas.width/2, y:canvas.height}, particlesArray[i])
            drawParticlePoint(context)(particlesArray[i]);
        }
        // connectParticles(context)(particlesArray, 100);
        return 1;
    };

    return {
        setup,
        draw,
    };
};
