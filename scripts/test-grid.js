import { createRandomNumberArray, pointOnCircle, randomNumberBetween } from './lib/math';
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
} from './lib/canvas';

export const testGrid = () => {
    const config = {
        // width: 500,
        // height: 500,
        // fps: 24,
    };

    let numParticles;
    const particlesArray = [];
    const gridPoints = [];

    const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 50, g: 1 };

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        const xMargin = 100;
        const yMargin = 100;

        const columns = 4;
        const rows = 4;

        const colStep = (canvas.width - xMargin * 2) / (columns - 1);
        const rowStep = (canvas.height - yMargin * 2) / (rows - 1);

        for (let col = 0; col < columns; col++) {
            const x = xMargin + col * colStep;
            for (let row = 0; row < rows; row++) {
                const y = yMargin + row * rowStep;
                gridPoints.push([x, y]);
            }
        }

        numParticles = gridPoints.length;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.x = gridPoints[i][0];
            props.y = gridPoints[i][1];
            props.velocityX = 0;
            props.velocityY = 0;
            props.radius = randomNumberBetween(10, 30);
            props.spikes = createRandomNumberArray(20, 0, 360);
            particlesArray.push(new Particle(props));
        }
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 0, g: 0, b: 50, a: 0.5 });

        const mode = 1;

        attractor.x = mouse.x ? mouse.x : canvasCenterX;
        attractor.y = mouse.y ? mouse.y : canvasCenterY;

        for (let i = 0; i < numParticles; i++) {
            // if (mouse.isDown) {
            //     mode = -1;
            // } else {
            //     mode = 1;
            // }
            attract(attractor, particlesArray[i], mode, 2000);
            particlesArray[i].vVector = particlesArray[i].vVector.limit(5);

            updatePosWithVelocity(particlesArray[i]);
            // edgeBounce(canvas, particlesArray[i]);
            // edgeWrap(canvas, particlesArray[i]);
            // drawPoint(context)(particlesArray[i]);

            context.strokeStyle = particlesArray[i].color.toRgbString();
            context.lineWidth = 1;
            context.beginPath();
            context.arc(particlesArray[i].x, particlesArray[i].y, particlesArray[i].radius, 0, Math.PI * 2, false);
            // context.fillStyle = 'rgba(255,255,255,.1)';
            // context.fill();
            context.stroke();
            for (let s = 0; s < particlesArray[i].props.spikes.length; s++) {
                const pointA = pointOnCircle(
                    particlesArray[i].x,
                    particlesArray[i].y,
                    particlesArray[i].radius,
                    particlesArray[i].props.spikes[s]
                );

                const pointB = pointOnCircle(
                    particlesArray[i].x,
                    particlesArray[i].y,
                    particlesArray[i].radius + 10,
                    particlesArray[i].props.spikes[s]
                );
                drawLine(context)(1, pointA.x, pointA.y, pointB.x, pointB.y);

                // particlesArray[i].props.spikes[s] += 0.02;
            }
        }
        // connectParticles(context)(particlesArray, 100);
    };

    return {
        config,
        setup,
        draw,
    };
};
