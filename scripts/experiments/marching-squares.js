import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/sketch';
import { bicPenBlue, get2Tone, paperWhite } from '../rndrgen/color/palettes';

import { simplexNoise3d } from '../rndrgen/math/attractors';
import { mapRange } from '../rndrgen/math/math';
import { createRectGrid } from '../rndrgen/math/Rectangle';
import { renderIsolines } from '../rndrgen/systems/marchingSquares';

export const marchingSquares = () => {
    const config = {
        name: 'marching-squares',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasWidth;
    let canvasHeight;

    // let margin = 50;
    // const resolution = 80;

    let timeIncrement = 0;

    const colors = get2Tone(5, 15);

    const showField = true;

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        background(canvas, context)(colors.light);
        context.strokeStyle = tinycolor(colors.dark);
    };

    const noiseFn = (x, y, time = 0) => simplexNoise3d(x, y, time, 0.005);

    const drawNoise = (context, { width, height }, noiseFn2d, resolution, lowcolor = '#ccc', highcolor = '#fff') => {
        const cellW = Math.ceil(width / resolution);
        const numCols = resolution + 1;
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numCols; j++) {
                const x = i * cellW;
                const y = j * cellW;
                const rawnoise = noiseFn2d(x, y);
                const noise = mapRange(-7, 7, -1, 1, rawnoise);
                const fillColor = tinycolor.mix(lowcolor, highcolor, noise * 100);
                context.fillStyle = tinycolor(fillColor).toRgbString();
                context.fillRect(x, y, cellW, cellW);
            }
        }
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(colors.light);

        const slices = [
            { nmin: -7, nmax: 7, omin: -1, omax: 1 },
            { nmin: 1, nmax: 3, omin: -0.25, omax: 1 },
            { nmin: 3, nmax: 7, omin: -0.5, omax: 1 },
            { nmin: -6, nmax: -5, omin: -1, omax: 0.25 },
        ];

        if (showField) {
            drawNoise(context, canvas, noiseFn, 40, colors.text, colors.light);
        }

        renderIsolines(context, canvas, noiseFn, 50, 80, true, slices);

        timeIncrement += 0.99;
        return 1;
    };
    return {
        config,
        setup,
        draw,
    };
};
