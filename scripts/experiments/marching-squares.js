import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';

import { simplexNoise3d } from '../rndrgen/math/attractors';
import { mapRange } from '../rndrgen/math/math';
import { Matrix } from '../rndrgen/math/Matrix';
import { isoline, mSquare } from '../rndrgen/systems/marchingSquares';

export const marchingSquares = () => {
    const config = {
        name: 'marchingSquares',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasWidth;
    let canvasHeight;

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    const resolution = 40;
    const lowColor = backgroundColor.clone().darken(25);
    const highColor = backgroundColor.clone().brighten(25);

    let cols = Math.ceil(canvasWidth / resolution) + 1;
    let rows = Math.ceil(canvasHeight / resolution) + 1;
    let field = new Matrix(rows, cols);

    let z = 0;

    const lineWidth = 2;
    const lineColor = 'black';
    const lineJoin = 'round';
    const lineCap = 'round';

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        cols = Math.ceil(canvasWidth / resolution) + 1;
        rows = Math.ceil(canvasHeight / resolution) + 1;
        field = new Matrix(rows, cols);

        background(canvas, context)(backgroundColor);

        context.lineWidth = lineWidth;
        context.lineCap = lineCap;
        context.lineJoin = lineJoin;
        context.strokeStyle = tinycolor(lineColor);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)('rgba(255,255,255,.1');

        const sq = [];

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * resolution;
                const y = j * resolution;
                const noise = simplexNoise3d(x, y, z, 0.004);
                const normalized = mapRange(-7, 7, -1, 1, noise);
                field.data[j][i] = normalized;
                const fillColor = tinycolor.mix(lowColor, highColor, normalized * 100);
                context.fillStyle = tinycolor(fillColor).toRgbString();
                context.fillRect(x, y, x + resolution, y + resolution);
            }
        }

        for (let i = 0; i < cols - 1; i++) {
            for (let j = 0; j < rows - 1; j++) {
                const x = i * resolution;
                const y = j * resolution;
                const a = field.data[j][i];
                const b = field.data[j][i + 1];
                const c = field.data[j + 1][i + 1];
                const d = field.data[j + 1][i];
                sq.push(new mSquare(x, y, resolution, a, b, c, d));
            }
        }

        sq.forEach((s) => isoline(context, s, true));

        z += 0.7;

        return 1;
    };
    return {
        config,
        setup,
        draw,
    };
};
