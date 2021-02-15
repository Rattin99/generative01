import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues, edgeWrap,
} from './lib/particle';
import {clearCanvas, connectParticles, drawMouse, drawPoint, drawPointTrail, fillCanvas} from './lib/canvas';

export const particleBasicTemplate = () => {
    const config = {
        width: 200,
        height: 200,
        fps: 24
    }

    const numParticles= 500;
    const particlesArray = [];

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width/2;
        canvasCenterY = canvas.height/2;
        centerRadius = canvas.height/4;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.radius = 1;
            particlesArray.push(new Particle(props));
        }
    };

    /*
        edgeBounce(canvas, particlesArray[i]);
        avoidPoint({ radius: centerRadius, x:canvasCenterX, y:canvasCenterY }, particlesArray[i], 4);
        attractPoint(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
        drawPointTrail(context)(particlesArray[i]);
        connectParticles(context)(particlesArray, 200);
        drawCircle(context)(mouse);
     */

    const draw = (canvas, context, mouse) => {
        fillCanvas(canvas, context)(1,'0,0,0');
        for (let i = 0; i < numParticles; i++) {
            updatePosWithVelocity(particlesArray[i]);
            edgeWrap(canvas, particlesArray[i]);
            drawPoint(context)(particlesArray[i]);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
