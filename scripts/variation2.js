import { avoidPoint, Particle, createRandomParticleValues } from './lib/Particle';
import { clearCanvas, connectParticles, drawMouse, drawParticlePoint } from './lib/canvas';
import { randomNumberBetween } from './lib/math';

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

    const setup = (canvas, context) => {
        for (let i = 0; i < config.numParticles; i++) {
            particlesArray.push(new Particle(createRandomParticleValues(canvas)));
        }
    };

    const draw = (canvas, context, mouse) => {
        clearCanvas(canvas, context)();

        for (let i = 0; i < config.numParticles; i++) {
            particlesArray[i].radius -= config.decay;
            if (particlesArray[i].radius <= 0) {
                const newValues = createRandomParticleValues(canvas);
                const newCoords = mouse;
                newValues.x = newCoords.x + randomNumberBetween(-10, 10);
                newValues.y = newCoords.y + randomNumberBetween(-10, 10);
                particlesArray[i].initValues(newValues);
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
