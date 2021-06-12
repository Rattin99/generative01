import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';

import { truchet } from '../rndrgen/systems/truchetTiles';
import { createRectGrid } from '../rndrgen/math/Rectangle';
import { randomWholeBetween } from '../rndrgen/math/random';

export const truchetTiles = () => {
    const config = {
        name: 'multiscale-truchet-tiles',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasWidth;
    let canvasHeight;

    const backgroundColor = paperWhite.clone().darken(10);
    const foreColor = bicPenBlue.clone();

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)('rgba(255,255,255,.1');

        const res = 5; // Math.round(canvasWidth / 4);

        const squares = createRectGrid(0, 0, canvasWidth, canvasHeight, res, res);

        squares.forEach((s, i) => {
            if (i % 2) {
                s.divideQuad();
                if (randomWholeBetween(0, 3) === 1) {
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
