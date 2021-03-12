import { createRandomNumberArray, mapRange } from '../lib/math';
import { Particle, createRandomParticleValues } from '../lib/Particle';
import { background } from '../lib/canvas';
import { connectParticles, drawParticlePoint } from '../lib/canvas-particles';
import { createGridPointsXY } from '../lib/grids';

export const threeAttractors = () => {
    const config = {
        // width: 500,
        // height: 500,
        // fps: 24,
    };

    let numParticles;
    const particlesArray = [];
    let gridPoints = [];
    const hue = 0;

    let attractorDist;

    let leftattractor;
    let midattractor;
    let rightattractor;

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        attractorDist = canvas.width / 0.7;

        leftattractor = { x: 0, y: canvas.height / 2, mass: 10, g: 3 };
        midattractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 50, g: 10 };
        rightattractor = { x: canvas.width, y: canvas.height / 2, mass: 10, g: 3 };

        gridPoints = createGridPointsXY(canvas.width, canvas.height, 100, 100, canvas.width / 50, canvas.height / 50)
            .points;
        numParticles = gridPoints.length;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.x = gridPoints[i][0];
            props.y = gridPoints[i][1];
            props.velocityX = 0;
            props.velocityY = 0;
            props.mass = 1;
            props.radius = 1; // randomNumberBetween(10, 30);
            props.spikes = createRandomNumberArray(20, 0, 360);

            const h = mapRange(0, canvas.width, 0, 90, props.x);
            const s = 100; // lerpRange(0,10,0,100,prop.radius);
            const l = 50; // lerpRange(0,10,25,75,prop.radius);
            props.color = `hsla(${h},${s}%,${l}%,0.1)`;

            // props.color = { r: 0, g: 0, b: 0, a: 0.1 };

            particlesArray.push(new Particle(props));
        }

        background(canvas, context)('white');
    };

    const draw = ({ canvas, context, mouse }) => {
        // background(canvas, context)({ r: 255, g: 255, b: 255, a: 0.001 });
        for (let i = 0; i < numParticles; i++) {
            particlesArray[i].attract(leftattractor, -1, attractorDist);
            particlesArray[i].attract(midattractor, 1, attractorDist);
            particlesArray[i].attract(rightattractor, -1, attractorDist);

            particlesArray[i].velocity = particlesArray[i].velocity.limit(10);

            particlesArray[i].updatePosWithVelocity();
            // edgeBounce(canvas, particlesArray[i]);
            drawParticlePoint(context)(particlesArray[i]);
        }
        connectParticles(context)(particlesArray, 50, false);
    };

    return {
        config,
        setup,
        draw,
    };
};
