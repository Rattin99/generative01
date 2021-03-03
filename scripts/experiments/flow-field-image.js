import tinycolor from 'tinycolor2';
import {
    mapRange,
    create2dNoise,
    randomWholeBetween,
    uvFromAngle,
    oneOf,
    aFromVector,
    snapNumber,
    create3dNoise,
    quantize,
    houghQuantize,
} from '../lib/math';
import { edgeWrap, Particle, updatePosWithVelocity, createRandomParticleValues, applyForce } from '../lib/Particle';
import {
    background,
    drawCircleFilled,
    drawLineAngle,
    drawQuadRectFilled,
    drawRectFilled,
    drawRoundRectFilled,
} from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { nicePalette, hslFromRange } from '../lib/palettes';
import { Vector } from '../lib/Vector';
import {
    simplexNoise2d,
    simplexNoise3d,
    sinField,
    cliffordAttractor,
    jongAttractor,
    diagLines,
} from '../lib/attractors';

/*
https://marcteyssier.com/projects/flowfield/
https://larrycarlson.com/collections/wavy-art-prints
 */

const TAU = Math.PI * 2;

const tile = (context, x, y, size, color, heading) => {
    drawRoundRectFilled(context)(x, y, size - 2, size - 2, 3, color);

    // context.save();
    // context.translate(x, y);
    // context.rotate(heading);
    // // drawQuadRectFilled(context)(0, 0, size, size, color);
    // drawRoundRectFilled(context)(0, 0, size - 2, size - 2, 3, color);
    // // drawRectFilled(context)(0, 0, size, size, color);
    // context.restore();
};

export const flowFieldImage = () => {
    const config = {
        name: 'flowFieldImage',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 100;
    const particlesArray = [];

    const palette = nicePalette();
    let clifford;
    let jong;

    let time = 0;

    const tileSize = 10;

    let tileHistory = [];
    let currentTilePos = [];
    const checkHistory = (x, y) => {
        const pos = `${x},${y}`;
        return tileHistory.includes(pos);
    };

    const createRandomParticle = (canvas) => {
        const props = createRandomParticleValues(canvas);
        props.x = randomWholeBetween(0, canvas.width);
        props.y = randomWholeBetween(0, canvas.height);
        props.velocityX = 0;
        props.velocityY = 0;
        const color = tinycolor(oneOf(palette));
        props.color = color.desaturate(randomWholeBetween(0, 25));
        return new Particle(props);
    };

    const setup = ({ canvas, context }) => {
        clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
        jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);

        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(createRandomParticle(canvas));
        }

        background(canvas, context)('rgba(50,50,50,1)');
    };

    const drawTile = (canvas, context, force, particle) => {
        const angle = aFromVector(force);

        applyForce(force, particle);
        particle.vVector = particle.vVector.limit(4);
        updatePosWithVelocity(particle);
        edgeWrap(canvas, particle);

        const x = snapNumber(tileSize, particle.x);
        const y = snapNumber(tileSize, particle.y);

        // Prevent overlap with a previous tile
        if (!checkHistory(x, y)) {
            currentTilePos.push(`${x},${y}`);
            tile(context, x, y, tileSize, particle.color, particle.heading);
            return true;
        }

        return false;
    };

    const drawPixel = (canvas, context, force, particle, color, rad = 1) => {
        applyForce(force, particle);
        particle.vVector = particle.vVector.limit(5);
        updatePosWithVelocity(particle);
        edgeWrap(canvas, particle);
        const pcolor = color || particle.color;
        const x = snapNumber(rad * 2, particle.x);
        const y = snapNumber(rad * 2, particle.y);
        drawCircleFilled(context)(x, y, rad, pcolor);
        return true;
    };

    const renderField = ({ width, height }, context, fn, cell) => {
        const mid = cell / 2;
        for (let x = 0; x < width; x += cell) {
            for (let y = 0; y < height; y += cell) {
                const theta = fn(x, y);
                drawLineAngle(context)(x + mid, y + mid, theta, mid);
            }
        }
    };

    const draw = ({ canvas, context }) =>
        // renderField(canvas, context, simplexNoise2d, 20);
        // drawParticles({ canvas, context });
        // drawFibers({ canvas, context });
        -1;
    const drawParticles = ({ canvas, context }) => {
        // background(canvas, context)('rgba(50,50,50,.01)');
        // const n3d = (x, y) => simplexNoise3d(x, y, time);
        // renderField(canvas, context, n3d, 20);

        for (let i = 0; i < numParticles; i++) {
            const particle = particlesArray[i];

            // vals from -5 to 5
            const sNoise2d = simplexNoise2d(particle.x, particle.y);
            const sNoise3d = simplexNoise3d(particle.x, particle.y, time);
            const diag = diagLines(particle.x, particle.y);
            const sinF = sinField(particle.x, particle.y);
            const clif = clifford(particle.x, particle.y);
            const jng = jong(particle.x, particle.y);

            // const theta = clif;
            // const theta = snapNumber(Math.PI / 2, sNoise3d);
            const theta = quantize(2, sNoise3d);

            const force = uvFromAngle(theta);

            // force.x += Math.cos(theta) * 0.1;
            // force.y += Math.sin(theta) * 0.1;

            const clr = hslFromRange(5, 180, 270, Math.abs(theta)).setAlpha(0.25);
            const size = 3; // mapRange(0, 5, 1, 5, Math.abs(theta));

            // drawTile(canvas, context, force, particle);
            drawPixel(canvas, context, force, particle, clr, size);

            particle.aVector = new Vector(0, 0);
        }

        time += 0.01;
    };

    const drawFibers = ({ canvas, context }) => {
        const particle = createRandomParticle(canvas);
        const length = 500;
        const run = true;
        for (let i = 0; i < length; i++) {
            const sNoise2d = simplexNoise2d(particle.x, particle.y);
            const sNoise3d = simplexNoise3d(particle.x, particle.y, time);
            const sinF = sinField(particle.x, particle.y);
            const clif = cliffordAttractor(canvas.width, canvas.height, particle.x, particle.y);
            const jong = jongAttractor(canvas.width, canvas.height, particle.x, particle.y);

            const theta = jong;
            const force = uvFromAngle(theta);
            const clr = hslFromRange(5, 270, 359, Math.abs(theta)).setAlpha(0.1);
            const size = mapRange(0, 5, 1, 5, Math.abs(theta));

            if (run) {
                // run = drawTile(canvas, context, force, particle);
                drawPixel(canvas, context, force, particle);
            }

            particle.aVector = new Vector(0, 0);
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
