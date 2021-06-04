import tinycolor from 'tinycolor2';
import { mapRange, uvFromAngle, aFromVector, snapNumber, quantize, houghQuantize } from '../rndrgen/math/math';
import { edgeWrap, Particle, createRandomParticleValues } from '../systems/Particle';
import {
    background,
    drawCircleFilled,
    drawLineAngle,
    drawQuadRectFilled,
    drawRectFilled,
    drawRoundRectFilled,
} from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { nicePalette, hslFromRange } from '../rndrgen/color/palettes';
import { Vector } from '../rndrgen/math/Vector';
import {
    simplexNoise2d,
    simplexNoise3d,
    sinField,
    cliffordAttractor,
    jongAttractor,
    diagLines,
} from '../rndrgen/math/attractors';
import { create2dNoise, create3dNoise, oneOf, randomWholeBetween } from '../rndrgen/math/random';

const tile = (context, x, y, size, color, heading) => {
    // drawQuadRectFilled(context)(x, y, size, size, color);

    context.save();
    context.translate(x - size / 2, y - size / 2);
    context.rotate(heading);
    drawRoundRectFilled(context)(0, 0, size, size, 3, color);
    context.restore();
};

export const flowFieldTiles = () => {
    const config = {
        name: 'flowFieldTiles',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const palette = nicePalette();
    let clifford;
    let jong;

    const tileSize = 15;

    // Simple collision
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
        props.color = color;
        return new Particle(props);
    };

    const setup = ({ canvas, context }) => {
        clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
        jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);

        background(canvas, context)('rgba(50,50,50,1)');
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

    const drawTile = (canvas, context, force, particle, color) => {
        const smallerTile = tileSize * 1.5;
        const x = snapNumber(smallerTile, particle.x);
        const y = snapNumber(smallerTile, particle.y);

        color = color || particle.color;

        // Prevent overlap with a previous tile
        if (!checkHistory(x, y)) {
            currentTilePos.push(`${x},${y}`);
            tile(context, x, y, tileSize, color, particle.heading);
            return true;
        }

        return false;
    };

    const drawFibers = ({ canvas, context }) => {
        const particle = createRandomParticle(canvas);
        const length = 500;
        let run = true;
        for (let i = 0; i < length; i++) {
            const theta = simplexNoise2d(particle.x, particle.y, 0.00005);
            const force = uvFromAngle(theta);
            const color = particle.color.clone();
            const saturation = mapRange(0, 5, 0, 100, Math.abs(theta));
            const brightness = mapRange(0, 5, 0, 100, Math.abs(theta));
            color.saturate(saturation).brighten(brightness);

            if (run) {
                // Run stops if the fiber collides with a previous one
                particle.applyForce(force);
                particle.velocity = particle.velocity.limit(4);
                particle.updatePosWithVelocity();
                run = drawTile(canvas, context, force, particle, color);
            }

            particle.acceleration = new Vector(0, 0);
        }
        tileHistory = tileHistory.concat(currentTilePos);
        currentTilePos = [];
    };

    const draw = ({ canvas, context }) => {
        // renderField(canvas, context, simplexNoise2d, 20);
        drawFibers({ canvas, context });
    };

    return {
        config,
        setup,
        draw,
    };
};
