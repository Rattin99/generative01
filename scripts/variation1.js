import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
} from './lib/particle';
import { clearCanvas, connectParticles, drawCircle, drawPoint, drawPointTrail } from './lib/canvas';

const psCanvasCenter = (canvas) => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
});

// Based on https://www.youtube.com/watch?v=d620nV6bp0A
export const variation1 = () => {
    const config = {
        friction: 0.8,
        gravity: 1,
        decay: 0.05,
        tweenDamp: 0.1,
        margin: 50,
        intensity: 0,
        numParticles: 100,
    };

    const particlesArray = [];

    const setup = (canvas, context) => {
        for (let i = 0; i < config.numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            // props.radius = 10;
            particlesArray.push(new Particle(props));
        }
    };

    const draw = (canvas, context, mouse) => {
        clearCanvas(canvas, context)();

        for (let i = 0; i < config.numParticles; i++) {
            updatePosWithVelocity(particlesArray[i]);
            edgeBounce(canvas, particlesArray[i]);
            avoidPoint({ radius: 200, ...psCanvasCenter(canvas) }, particlesArray[i], 4);
            attractPoint(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
            drawPoint(context)(particlesArray[i]);
            drawPointTrail(context)(particlesArray[i]);
        }
        connectParticles(context)(particlesArray, 200);
        drawCircle(context)(mouse);
    };

    return {
        config,
        setup,
        draw,
    };
};
