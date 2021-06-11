import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';

import { simplexNoise3d } from '../rndrgen/math/attractors';
import { mapRange } from '../rndrgen/math/math';
import { Matrix } from '../rndrgen/math/Matrix';
import { mSquare, truchet } from '../rndrgen/systems/truchetTiles';
import { createRectGrid, Square } from '../rndrgen/math/Rectangle';
import { randomWholeBetween } from '../rndrgen/math/random';

export const truchetTiles = () => {
    const config = {
        name: 'marchingSquares',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasWidth;
    let canvasHeight;

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        // background(canvas, context)('rgba(255,255,255,.005');

        const res = Math.round(canvasWidth / 100);

        const squares = createRectGrid(0, 0, canvasWidth, canvasHeight, res, res);

        squares.forEach((s) => {
            if (randomWholeBetween(0, 3) === 1) {
                s.divideQuad();
                if (randomWholeBetween(0, 2) === 1) {
                    s.children.forEach((c) => c.divideQuad());
                }
            }
        });

        const drawSquares = (rect) => {
            if (rect.children.length) {
                rect.children.forEach((r) => drawSquares(r));
            } else {
                rect.motif = randomWholeBetween(0, 15);
                truchet(context, rect, foreColor, backgroundColor);
            }
        };

        squares.forEach((s) => {
            drawSquares(s);
        });

        return -1;
    };
    return {
        config,
        setup,
        draw,
    };
};
