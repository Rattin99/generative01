import {
    mapRange,
    createGridCellsXY,
    create2dNoiseAbs,
    create2dNoise,
    round2,
    randomWholeBetween,
    uvFromAngle,
} from '../lib/math';
import {
    edgeBounce,
    edgeWrap,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
    applyForce,
} from '../lib/Particle';
import {
    background,
    drawCircleFilled,
    drawLine,
    drawLineAngle,
    drawRect,
    drawRectFilled,
    drawTextFilled,
    pixel,
    resetStyles,
    textAlignAllCenter,
    textStyles,
} from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';

const TAU = Math.PI * 2;

export const flowField = () => {
    const config = {
        name: 'flowField',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 50;
    const particlesArray = [];
    let grid;
    const gridResolution = 30;

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        const noiseFn = (x, y) => round2(create2dNoise(x, y, 1, 0.001));

        grid = createGridCellsXY(canvas.width, canvas.width, gridResolution, gridResolution, 0, 0, noiseFn);
        console.log(grid);
        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.x = randomWholeBetween(0, canvas.width);
            props.y = randomWholeBetween(0, canvas.height);
            props.velocityX = 0;
            props.velocityY = 0;
            props.mass = 1;
            props.radius = 4;

            // const h = mapRange(0, canvas.width, 0, 90, props.x);
            // const s = 100; // lerpRange(0,10,0,100,prop.radius);
            // const l = 50; // lerpRange(0,10,25,75,prop.radius);
            // props.color = `hsla(${h},${s}%,${l}%,1)`;

            props.color = 'red';

            particlesArray.push(new Particle(props));
        }

        background(canvas, context)('white');
        textAlignAllCenter(context);

        grid.points.forEach((point) => {
            const x = point[0];
            const y = point[1];
            const n = point[2];
            const midX = grid.columnWidth / 2;
            const midY = grid.rowHeight / 2;

            // drawRectFilled(context)(x, y, grid.columnWidth, grid.rowHeight, `hsl(${360 * (n * 2)},100,50)`);
            drawRectFilled(context)(x, y, grid.columnWidth, grid.rowHeight, `rgba(0,0,0,${n / 2 + 0.5}`);
            drawLineAngle(context)(x + midX, y + midY, n * TAU, midY);
            // drawTextFilled(context)(n, x + midX, y + midY, 'black', textStyles.size(10));
        });

        background(canvas, context)('rgba(255,255,255,.75)');
    };

    const draw = ({ canvas, context, mouse }) => {
        // background(canvas, context)('white');

        for (let i = 0; i < numParticles; i++) {
            particlesArray[i].vVector = particlesArray[i].vVector.limit(10);

            const noiseX = Math.floor(mapRange(0, canvas.width, 0, gridResolution - 1, particlesArray[i].x));
            const noiseY = Math.floor(mapRange(0, canvas.height, 0, gridResolution - 1, particlesArray[i].y));
            let noiseAtPoint = 0;

            try {
                noiseAtPoint = grid.coords[noiseX][noiseY];
            } catch (e) {
                console.log(`Error at ${noiseX}, ${noiseY}`);
            }

            const force = uvFromAngle(noiseAtPoint * TAU);
            applyForce(force, particlesArray[i]);
            particlesArray[i].vVector = particlesArray[i].vVector.limit(2);
            updatePosWithVelocity(particlesArray[i]);
            // edgeBounce(canvas, particlesArray[i]);
            edgeWrap(canvas, particlesArray[i]);
            pixel(context)(particlesArray[i].x, particlesArray[i].y, particlesArray[i].color);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
