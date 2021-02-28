import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
} from '../lib/Particle';
import { clearCanvas, connectParticles, drawMouse, drawParticlePoint, drawPointTrail, fillCanvas } from '../lib/canvas';

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
            updatePosWithVelocity(particlesArray[i]);
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
