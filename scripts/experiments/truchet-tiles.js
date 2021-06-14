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
        fps: 1,
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
        background(canvas, context)('rgba(255,255,255,1');

        const res = 5;
        const max = randomWholeBetween(2, 15);

        // Create some squares in a grid
        const squares = createRectGrid(0, 0, canvasWidth, canvasHeight, res, res, 0, 0);

        // randomly subdivide some of them
        squares.forEach((s, i) => {
            // if (i % 2) {
            // if (s.x === s.y) {
            if (randomWholeBetween(0, 2) === 1) {
                s.divideQuad();
                if (randomWholeBetween(0, 3) === 1) {
                    s.children.forEach((c) => c.divideQuad());
                }
            }
        });

        // flatted all of the subdivided squares into one array
        const sortedSquares = [];
        const flattenSquares = (rect) => {
            if (rect.children.length) {
                rect.children.forEach((r) => flattenSquares(r));
            } else {
                sortedSquares.push(rect);
            }
        };
        squares.forEach((s) => {
            flattenSquares(s);
        });

        // sort them by depth, shallow are drawn first, deeper are drawn later so that wings line up
        sortedSquares
            .sort((a, b) => a.depth - b.depth)
            .forEach((s) => {
                // assign a random pattern
                s.motif = randomWholeBetween(0, max); // randomWholeBetween(0, 15);
                // draw it
                truchet(context, s, foreColor, backgroundColor);
            });

        return 1;
    };
    return {
        config,
        setup,
        draw,
    };
};
