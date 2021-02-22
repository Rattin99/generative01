import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
    edgeWrap,
} from './lib/Particle';
import { background, connectParticles, drawMouse, drawParticlePoint, drawPointTrail } from './lib/canvas';
import { mapRange } from './lib/math';

export const particleBasicTemplate = () => {
    const config = {
        width: 200,
        height: 200,
        fps: 24,
    };

    const numParticles = 500;
    const particlesArray = [];
    const hue = 0;

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.radius = 1;

            const h = mapRange(0, canvas.width, 100, 200, props.x);
            const s = 100; // lerpRange(0,10,0,100,prop.radius);
            const l = 50; // lerpRange(0,10,25,75,prop.radius);
            props.color = `hsl(${h},${s}%,${l}%)`;

            particlesArray.push(new Particle(props));
        }
        // background(canvas, context)('white');
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
        background(canvas, context)({ r: 100, g: 100, b: 100, a: 1 });

        // if you want to rotate
        // if(hue++ > 361) hue = 0;

        for (let i = 0; i < numParticles; i++) {
            updatePosWithVelocity(particlesArray[i]);
            edgeWrap(canvas, particlesArray[i]);
            drawParticlePoint(context)(particlesArray[i]);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
