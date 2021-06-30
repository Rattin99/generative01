import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite, get2Tone } from '../rndrgen/color/palettes';

import { truchet, truchetInterlaced } from '../rndrgen/systems/truchetTiles';
import { createRectGrid, Rectangle } from '../rndrgen/math/Rectangle';
import { random, randomWholeBetween } from '../rndrgen/math/random';
import { point } from '../rndrgen/math/points';
import { flatDepthSortedAsc, quadTreeFromPoints } from '../rndrgen/math/QuadTree';
import { rect } from '../rndrgen/canvas/primatives';

// https://www.reddit.com/r/generative/comments/ju1xjr/truchet_tiles_pen_plot/

export const truchetTiles02 = () => {
    const config = {
        name: 'interlaced-truchet-tiles',
        ratio: ratio.square,
        // ratio: ratio.a3plus,
        scale: scale.hidpi,
        // orientation: orientation.portrait,
        // fps: 1,
    };

    let canvasWidth;
    let canvasHeight;

    let margin = 100;

    let quadtree;
    let rectangles;

    const colors = get2Tone(5, 15);

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        margin = canvasWidth / 18;

        // 35x21 for a3plus
        rectangles = createRectGrid(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2, 20, 20);

        // const boundary = new Rectangle(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2);
        // const points = [...Array(500)].map((_) => point(random(canvasWidth), random(canvasHeight)));
        // quadtree = quadTreeFromPoints(boundary, 2, points);

        // background(canvas, context)('white');
    };

    let motif = 0;

    const nextMotif = (_) => {
        const n = motif++;
        if (motif === 6) motif = 0;
        return n;
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(colors.light);

        // flatDepthSortedAsc(quadtree).forEach((q) => {
        //     // assign a random pattern
        //     q.boundary.motif = randomWholeBetween(0, 6);
        //     // draw it
        //     truchetInterlaced(context, q.boundary, 9, 2, colors.dark, colors.light);
        // });

        rectangles.forEach((r) => {
            // assign a random pattern
            r.motif = randomWholeBetween(0, 6);
            // draw it
            truchetInterlaced(context, r, 9, 1, colors.dark, colors.light);
        });

        return -1;
    };
    return {
        config,
        setup,
        draw,
    };
};
