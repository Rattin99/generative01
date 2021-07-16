import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { Rectangle } from '../rndrgen/math/Rectangle';
import { pixel, rect } from '../rndrgen/canvas/primatives';
import { QuadTree, quadTreeFromPoints, show } from '../rndrgen/math/QuadTree';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import { initialize } from '../rndrgen/canvas/EdgeDetect';
import sourcePng from '../../media/images/kristijan-arsov-woman-400.png';

export const bitmapTest01 = () => {
    const config = {
        name: 'bitmapTest01',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    let quadtree;

    const image = new Bitmap(sourcePng);

    let imageThresholdPoints;

    let boundary;

    const showPoints = (points, color = 'red') =>
        points.forEach((p) => {
            pixel(ctx)(p.x, p.y, color, 'circle', 1);
        });

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        image.init(canvas, context, false);

        boundary = new Rectangle(0, 0, canvasWidth, canvasHeight);
        // imageThresholdPoints = image.thresholdAsPoints(100, 128, true);
        // quadtree = quadTreeFromPoints(boundary, 4, imageThresholdPoints);

        // background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(backgroundColor);

        const res = canvasWidth / 5;
        image.findEdges(25, 'white', 'black');
        const t = image.thresholdAsPoints(res, 100, false);
        background(canvas, context)(backgroundColor);
        // image.resetImageData();
        // image.showToCanvas(res);

        quadtree = quadTreeFromPoints(boundary, 1, t);
        // show(context)(quadtree);
        showPoints(t);

        return -1;
    };
    return {
        config,
        setup,
        draw,
    };
};
