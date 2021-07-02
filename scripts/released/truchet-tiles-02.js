import { background } from '../rndrgen/canvas/canvas';
import { instagram, largePrint } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite, get2Tone } from '../rndrgen/color/palettes';

import { truchet, truchetInterlaced } from '../rndrgen/systems/truchetTiles';
import { createRectGrid, Rectangle } from '../rndrgen/math/Rectangle';
import { random, randomWholeBetween } from '../rndrgen/math/random';
import { point } from '../rndrgen/math/points';
import { flatDepthSortedAsc, quadTreeFromPoints } from '../rndrgen/math/QuadTree';
import { rect } from '../rndrgen/canvas/primatives';

// https://www.reddit.com/r/generative/comments/ju1xjr/truchet_tiles_pen_plot/

export const truchetTiles02 = () => {
    const config = { name: 'interlaced-truchet-tiles', ...instagram };

    let canvasWidth;
    let canvasHeight;

    let margin = 100;

    let rectangles;

    const colors = get2Tone(5, 15);

    const tiles = randomWholeBetween(5, 30) * 2;
    const lines = randomWholeBetween(2, 8);
    const gap = randomWholeBetween(0, 4);

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        margin = Math.round(canvasWidth / 18);

        const tiles = randomWholeBetween(10, 30) * 2;

        // 35x21 for a3plus
        rectangles = createRectGrid(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2, tiles, tiles);
    };

    let motif = 0;

    const nextMotif = (_) => {
        const n = motif++;
        if (motif === 6) motif = 0;
        return n;
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(colors.light);

        rectangles.forEach((r) => {
            r.motif = randomWholeBetween(0, 6);
            truchetInterlaced(context, r, lines, 0.5, gap, colors.dark, colors.light);
        });

        return -1;
    };
    return {
        config,
        setup,
        draw,
    };
};
