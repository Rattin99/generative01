import tinycolor from 'tinycolor2';
import {
    mapRange,
    create2dNoise,
    round2,
    randomWholeBetween,
    uvFromAngle,
    oneOf,
    aFromVector,
    radiansToDegrees,
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
    drawQuadRectFilled,
    drawRect,
    drawRectFilled,
    drawTextFilled,
    pixel,
    resetStyles,
    textAlignAllCenter,
    textStyles,
} from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { nicePalette } from '../lib/palettes';

/*
https://www.khanacademy.org/math/multivariable-calculus/thinking-about-multivariable-function/visualizing-vector-valued-functions/v/parametric-curves
Based on https://www.youtube.com/watch?v=BjoM9oKOAKY
Attractor fns https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
Read
https://codepen.io/DonKarlssonSan/post/particles-in-simplex-noise-flow-field
https://tylerxhobbs.com/essays/2020/flow-fields
 */

const tile = (context, x, y, size, color, angle) => {
    // context.beginPath();
    // context.arc(x, y, Math.floor(size/2), 0, Math.PI * 2, false);
    // context.fillStyle = color.toRgbString();
    // context.fill();
    // context.save();
    // context.translate(x, y);
    // context.rotate();
    drawQuadRectFilled(context)(x, y, size, size, color);
    // context.restore();
};

const TAU = Math.PI * 2;

// const noiseFn = (x, y) => round2(create2dNoise(x, y, 1, 0.001));
const createNoiseField = (width, height, columns, rows, margin = 0, gutter = 0, noiseFn) => {
    const points = [];
    const coords = [];

    const colStep = Math.ceil((width - margin * 2 - gutter * (columns - 1)) / columns);
    const rowStep = Math.ceil((height - margin * 2 - gutter * (rows - 1)) / rows);

    for (let col = 0; col < columns; col++) {
        const x = margin + col * colStep + gutter * col;
        coords[col] = [];
        for (let row = 0; row < rows; row++) {
            const y = margin + row * rowStep + gutter * row;
            const noise = noiseFn ? noiseFn(x, y) : 0;
            points.push([x, y, noise]);
            coords[col][row] = noise;
        }
    }

    return { points, coords, columnWidth: colStep, rowHeight: rowStep };
};

const drawNoiseField = (context, field) => {
    // textAlignAllCenter(context);
    field.points.forEach((point) => {
        const x = point[0];
        const y = point[1];
        const n = point[2];
        const midX = field.columnWidth / 2;
        const midY = field.rowHeight / 2;

        // drawRectFilled(context)(x, y, grid.columnWidth, grid.rowHeight, `hsl(${360 * (n * 2)},100,50)`);
        drawRectFilled(context)(x, y, field.columnWidth, field.rowHeight, `rgba(0,0,0,${n / 2 + 0.5}`);
        drawLineAngle(context)(x + midX, y + midY, n * TAU, midY);
        // drawTextFilled(context)(n, x + midX, y + midY, 'black', textStyles.size(10));
    });
};

// Map canvas coords to field resolution and get index in array
const getNoiseFieldVectorAtPoint = (field, resolution, width, height, x, y) => {
    const noiseX = Math.floor(mapRange(0, width, 0, resolution - 1, x));
    const noiseY = Math.floor(mapRange(0, height, 0, resolution - 1, y));
    return field.coords[noiseX][noiseY];
    // return uvFromAngle(field.coords[noiseX][noiseY] * TAU);
};

// From https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
const sinField = (x, y) => (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * Math.PI * 2;

// random attractor params
const a = Math.random() * 4 - 2;
const b = Math.random() * 4 - 2;
const c = Math.random() * 4 - 2;
const d = Math.random() * 4 - 2;

// http://paulbourke.net/fractals/clifford/
const cliffordAttractor = (width, height, x, y) => {
    const scale = 0.005;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(a * y) + c * Math.cos(a * x);
    const y1 = Math.sin(b * x) + d * Math.cos(b * y);
    return Math.atan2(y1 - y, x1 - x);
};

// http://paulbourke.net/fractals/peterdejong/
const jongAttractor = (width, height, x, y) => {
    const scale = 0.005;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(a * y) - Math.cos(b * x);
    const y1 = Math.sin(c * x) - Math.cos(d * y);
    return Math.atan2(y1 - y, x1 - x);
};

export const flowField = () => {
    const config = {
        name: 'flowField',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 100;
    const particlesArray = [];
    const fieldResolution = 30;
    let noiseField;

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const palette = nicePalette();

    const createRandomParticle = (canvas) => {
        const props = createRandomParticleValues(canvas);
        props.x = randomWholeBetween(0, canvas.width);
        props.y = randomWholeBetween(0, canvas.height);
        props.velocityX = 0;
        props.velocityY = 0;
        const color = tinycolor(oneOf(palette));
        props.color = color.desaturate(randomWholeBetween(0, 25));
        // const h = mapRange(0, canvas.width, 90, 270, props.x);
        // const s = 100; // lerpRange(0,10,0,100,prop.radius);
        // const l = 50; // lerpRange(0,10,25,75,prop.radius);
        // props.color = `hsla(${h},${s}%,${l}%,1)`;
        return new Particle(props);
    };

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        const noiseFn = (x, y) => round2(create2dNoise(x, y, 1, 0.001));
        noiseField = createNoiseField(canvas.width, canvas.width, fieldResolution, fieldResolution, 0, 0, noiseFn);

        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(createRandomParticle(canvas));
        }

        background(canvas, context)('white');

        // drawNoiseField(context, noiseField);
        // background(canvas, context)('rgba(255,255,255,.75)');
        background(canvas, context)('rgba(50,50,50,1)');
    };

    const radius = 10;
    const snapPx = (r, px) => Math.floor(px / r) * r;

    let tileHistory = [];
    let currentTilePos = [];

    const checkHistory = (x, y) => {
        const pos = `${x},${y}`;
        if (tileHistory.includes(pos)) {
            return true;
        }
        return false;
    };

    const drawTile = (canvas, context, force, particle) => {
        const angle = aFromVector(force);

        applyForce(force, particle);
        particle.vVector = particle.vVector.limit(4);
        updatePosWithVelocity(particle);
        edgeWrap(canvas, particle);

        const x = snapPx(radius, particle.x);
        const y = snapPx(radius, particle.y);

        if (!checkHistory(x, y)) {
            currentTilePos.push(`${x},${y}`);
            tile(context, x, y, radius, particle.color, angle);
            return true;
        }

        return false;
    };

    const drawPixel = (canvas, context, force, particle) => {
        applyForce(force, particle);
        particle.vVector = particle.vVector.limit(1);
        updatePosWithVelocity(particle);
        edgeWrap(canvas, particle);

        pixel(context)(particle.x, particle.y, 'white'); // particle.color

        return true;
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)('rgba(50,50,50,.001)');

        const particle = createRandomParticle(canvas);
        const length = 50;
        const run = true;
        for (let i = 0; i < length; i++) {
            const sNoise = getNoiseFieldVectorAtPoint(
                noiseField,
                fieldResolution,
                canvas.width,
                canvas.height,
                particle.x,
                particle.y
            );

            const sinF = sinField(particle.x, particle.y);
            const clif = cliffordAttractor(canvas.width, canvas.height, particle.x, particle.y);
            const jong = jongAttractor(canvas.width, canvas.height, particle.x, particle.y);

            // const force = uvFromAngle(sNoise * TAU);
            // const force = uvFromAngle(sinF);
            const force = uvFromAngle(clif);
            // const force = uvFromAngle(jong);

            if (run) {
                // run = drawTile(canvas, context, force, particle);
                drawPixel(canvas, context, force, particle);
            }
        }
        tileHistory = tileHistory.concat(currentTilePos);
        currentTilePos = [];
    };

    return {
        config,
        setup,
        draw,
    };
};
