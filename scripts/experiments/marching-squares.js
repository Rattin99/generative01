import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, get2Tone, paperWhite } from '../rndrgen/color/palettes';

import { simplexNoise3d } from '../rndrgen/math/attractors';
import { mapRange } from '../rndrgen/math/math';
import { createRectGrid } from '../rndrgen/math/Rectangle';
import { isoline } from '../rndrgen/systems/marchingSquares';

export const marchingSquares = () => {
    const config = {
        name: 'marching-squares',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasWidth;
    let canvasHeight;

    let margin = 50;

    let timeIncrement = 0;

    const colors = get2Tone(5, 15);
    const resolution = 80;

    const showField = true;

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        background(canvas, context)(colors.light);
        context.strokeStyle = tinycolor(colors.dark);
    };

    const noiseFn = (x, y, time, min = -7, max = 7, outmin = -1, outmax = 1) => {
        const noise = simplexNoise3d(x, y, time, 0.005);
        return mapRange(min, max, outmin, outmax, noise);
    };

    const drawNoise = (context, width, resCells) => {
        const cellW = Math.ceil(width / resCells);
        const numCols = resCells + 1;
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numCols; j++) {
                const x = i * cellW;
                const y = j * cellW;
                const noise = noiseFn(x, y, timeIncrement);
                const fillColor = tinycolor.mix('#ccc', '#fff', noise * 100);
                context.fillStyle = tinycolor(fillColor).toRgbString();
                context.fillRect(x, y, cellW, cellW);
            }
        }
    };

    const slices = [
        { nmin: -7, nmax: 7, omin: -1, omax: 1 },
        { nmin: 1, nmax: 3, omin: -0.25, omax: 1 },
        { nmin: 3, nmax: 7, omin: -0.5, omax: 1 },
        { nmin: -6, nmax: -5, omin: -1, omax: 0.25 },
    ];

    const draw = ({ canvas, context }) => {
        background(canvas, context)(colors.light);

        margin = canvasWidth / 10;

        if (showField) {
            drawNoise(context, canvasWidth, resolution / 2);
        }

        const squares = createRectGrid(
            margin,
            margin,
            canvasWidth - margin * 2,
            canvasHeight - margin * 2,
            resolution,
            resolution
        );

        squares.forEach((s) => {
            slices.forEach((slice) => {
                s.corners = [s.cornerAPx, s.cornerBPx, s.cornerCPx, s.cornerDPx].map((c) =>
                    noiseFn(c.x, c.y, timeIncrement, slice.nmin, slice.nmax, slice.omin, slice.omax)
                );
                isoline(context, s, true);
            });
        });

        timeIncrement += 0.99;
        return 1;
    };
    return {
        config,
        setup,
        draw,
    };
};
