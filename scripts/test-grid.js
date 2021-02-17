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

    const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 1, g: 2 };

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        const xMargin = 50;
        const yMargin = 50;
        const columns = 20;
        const rows = 15;
        const colStep = (canvas.width - xMargin * 2) / columns;
        const rowStep = (canvas.height - yMargin * 2) / rows;
        let x = xMargin;
        let y = yMargin;
        for (let col = 0; col <= columns; col++) {
            x = xMargin + col * colStep;
            for (let row = 0; row <= rows; row++) {
                y = yMargin + row * rowStep;
                gridPoints.push([x, y]);
            }
        }

        numParticles = gridPoints.length;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            console.log(gridPoints[i][0], gridPoints[i][1]);
            props.x = gridPoints[i][0];
            props.y = gridPoints[i][1];
            props.velocityX = 0;
            props.velocityY = 0;
            props.radius = 5;
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
        background(canvas, context)({ r: 0, g: 0, b: 50, a: 0.01 });

        let mode = 1;

        attractor.x = mouse.x ? mouse.x : canvasCenterX;
        attractor.y = mouse.y ? mouse.y : canvasCenterY;

        for (let i = 0; i < numParticles; i++) {
            if (mouse.isDown) {
                mode = -1;
            } else {
                mode = 1;
            }
            attract(attractor, particlesArray[i], mode, 500);
            particlesArray[i].vVector = particlesArray[i].vVector.limit(5);

            updatePosWithVelocity(particlesArray[i]);
            // edgeWrap(canvas, particlesArray[i]);
            drawPoint(context)(particlesArray[i]);
        }
        // connectParticles(context)(particlesArray, 100);
    };

    return {
        config,
        setup,
        draw,
    };
};
