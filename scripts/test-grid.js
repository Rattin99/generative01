import { createRandomNumberArray, pointOnCircle, randomNumberBetween, createGridPoints, lerpRange } from './lib/math';
import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
    edgeWrap,
    attract,
} from './lib/particle';
import {
    background,
    clearCanvas,
    connectParticles,
    drawMouse,
    drawLine,
    drawPoint,
    drawPointTrail,
    fillCanvas,
    drawSpikeCircle,
} from './lib/canvas';

export const testGrid = () => {
    const config = {
        // width: 500,
        // height: 500,
        // fps: 24,
    };

    let numParticles;
    const particlesArray = [];
    let gridPoints = [];
    const hue = 0;

    const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 50, g: 1 };

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        gridPoints = createGridPoints(canvas.width, canvas.height, 100, 100, 10, 7);
        numParticles = gridPoints.length;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.x = gridPoints[i][0];
            props.y = gridPoints[i][1];
            props.velocityX = 0;
            props.velocityY = 0;
            props.radius = randomNumberBetween(10, 30);
            props.spikes = createRandomNumberArray(20, 0, 360);

            const h = lerpRange(0, canvas.width, 180, 360, props.x);
            const s = 100; // lerpRange(0,10,0,100,prop.radius);
            const l = 50; // lerpRange(0,10,25,75,prop.radius);
            props.color = `hsl(${h},${s}%,${l}%)`;

            particlesArray.push(new Particle(props));
        }
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 100, g: 100, b: 100, a: 1 });

        let mode = 1;

        attractor.x = mouse.x ? mouse.x : canvasCenterX;
        attractor.y = mouse.y ? mouse.y : canvasCenterY;

        for (let i = 0; i < numParticles; i++) {
            if (mouse.isDown) {
                mode = -1;
            } else {
                mode = 1;
            }
            attract(attractor, particlesArray[i], mode, 2000);
            particlesArray[i].vVector = particlesArray[i].vVector.limit(5);

            updatePosWithVelocity(particlesArray[i]);
            edgeBounce(canvas, particlesArray[i]);
            // edgeWrap(canvas, particlesArray[i]);
            drawPoint(context)(particlesArray[i]);

            // drawSpikeCircle(context)(particlesArray[i], particlesArray[i].props.spikes);
        }
        connectParticles(context)(particlesArray, 200, false);
    };

    return {
        config,
        setup,
        draw,
    };
};
