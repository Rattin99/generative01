import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite, get2Tone } from '../rndrgen/color/palettes';

import { truchet } from '../rndrgen/systems/truchetTiles';
import { createRectGrid, Rectangle } from '../rndrgen/math/Rectangle';
import { randomN, randomWholeBetween } from '../rndrgen/math/random';
import { point } from '../rndrgen/math/points';
import { flatDepthSortedAsc, quadTreeFromPoints } from '../rndrgen/math/QuadTree';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import sourcePng from '../../media/images/hi1.png';

export const truchetTiles = () => {
    const config = {
        name: 'multiscale-truchet-tiles',
        ratio: ratio.square,
        scale: scale.hidpi,
        // fps: 1,
    };

    let canvasWidth;
    let canvasHeight;

    let margin = 100;

    let quadtree;

    const colors = get2Tone(5, 15);

    const image = new Bitmap(sourcePng);

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        image.init(canvas, context);

        margin = canvasWidth / 10;

        const boundary = new Rectangle(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2);
        // const points = [...Array(1000)].map((_) => point(randomN(canvasWidth), randomN(canvasHeight)));
        // quadtree = quadTreeFromPoints(boundary, 4, points);

        const points = image.thresholdAsPoints(150, 128);
        quadtree = quadTreeFromPoints(boundary, 1, points);

        // background(canvas, context)('white');
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(colors.light);

        const max = randomWholeBetween(0, 15);

        flatDepthSortedAsc(quadtree).forEach((q) => {
            // assign a random pattern
            q.boundary.motif = randomWholeBetween(0, max); // randomWholeBetween(0, 15);
            // draw it
            truchet(context, q.boundary, colors.dark, colors.light);
        });

        return -1;
    };
    return {
        config,
        setup,
        draw,
    };
};
