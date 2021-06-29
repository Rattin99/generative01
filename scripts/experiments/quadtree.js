import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { point } from '../rndrgen/math/points';
import { Rectangle } from '../rndrgen/math/Rectangle';
import { random, randomN } from '../rndrgen/math/random';
import { pixel, rect } from '../rndrgen/canvas/primatives';
import { QuadTree, quadTreeFromPoints, show } from '../rndrgen/math/QuadTree';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import sourcePng from '../../media/images/hi1.png';

export const quadtree01 = () => {
    const config = {
        name: 'quadtree01',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    const renderScale = config.scale; // 1 or 2

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    let quadtree;

    const image = new Bitmap(sourcePng);

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;

        image.init(canvas, context, false);

        const boundary = new Rectangle(0, 0, canvasWidth, canvasHeight);
        const points = [...Array(100)].map((_) => point(randomN(canvasWidth), randomN(canvasHeight)));
        const ipoints = image.thresholdAsPoints(100, 128);
        // quadtree = quadTreeFromPoints(boundary, 4, points);
        quadtree = quadTreeFromPoints(boundary, 4, ipoints, 2);

        background(canvas, context)(backgroundColor);
    };

    // const draw = ({ canvas, context }) => {
    //     background(canvas, context)(backgroundColor);
    //
    //     show(context)(quadtree);
    //
    //     return -1;
    // };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)(backgroundColor);

        show(context)(quadtree);

        const qrtr = canvasWidth / 4;
        const testrect = new Rectangle(mouse.x, mouse.y, 200, 200);

        rect(context)(testrect.x, testrect.y, testrect.w, testrect.h, 1, 'green');

        const found = quadtree.query(testrect);
        found.forEach((p) => {
            pixel(context)(p.x, p.y, 'red', 'circle', 3);
        });

        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
