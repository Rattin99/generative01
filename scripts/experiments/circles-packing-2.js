import { background } from '../rndrgen/canvas/canvas';
import { instagram } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { circle, circleFilled } from '../rndrgen/canvas/primatives';
import { PackCircle } from '../rndrgen/math/Circle';
import { Rectangle } from '../rndrgen/math/Rectangle';
import { randomCircleFill } from '../rndrgen/systems/CirclePackingRandom';
import sourcePng from '../../media/images/kristijan-arsov-woman-400.png';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import { flatDepthSortedAsc, quadTreeFromPoints, show } from '../rndrgen/math/QuadTree';
import { randomNormalNumberBetween, randomNumberBetween, randomWholeBetween } from '../rndrgen/math/random';

const drawCircle = (context) => ({ x, y, radius }, color = 'black') => {
    circleFilled(context)(x, y, radius, color);
};

// https://www.youtube.com/watch?v=QHEQuoIKgNE&t=1s

/*
Random space filling
 */

export const circlePacking02 = () => {
    const config = {
        name: 'circle-packing-02',
        ...instagram,
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

    const backgroundColor = paperWhite.clone().darken(80);
    const foreColor = bicPenBlue.clone();

    const image = new Bitmap(sourcePng);

    let canvasBounds;
    let canvasCircle;
    let quadtree;

    const fill = randomCircleFill(10000, 500);

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        canvasBounds = new Rectangle(0, 0, canvasWidth, canvasHeight);
        canvasCircle = new PackCircle(canvasCenterX, canvasCenterY, canvasCenterX * 0.75);

        image.init(canvas, context);
        // const points = image.thresholdAsPoints(200, 130);
        // quadtree = quadTreeFromPoints(canvasBounds, 10, points);

        const res = canvasWidth / 5;
        image.boxBlur(1);
        // image.sharpen();
        image.findEdges(20, 'white', 'black', 64);
        const points = image.thresholdAsPoints(res, 20, false);

        image.resetImageData();

        quadtree = quadTreeFromPoints(canvasBounds, 1, points);

        image.showToCanvas(res);
        // show(context)(quadtree);

        const startingCircles = [];
        flatDepthSortedAsc(quadtree).forEach((q) => {
            const rad = q.boundary.w / 3; // Math.max(q.boundary.w / 3, 1);
            const radDif = q.boundary.w / 2 - rad;
            const x = q.boundary.mx + randomNormalNumberBetween(-1 * radDif, radDif);
            const y = q.boundary.my + randomNormalNumberBetween(-1 * radDif, radDif);
            startingCircles.push(new PackCircle(x, y, rad, q.boundary.w / 2));
        });
        fill.setCircles(startingCircles);

        background(canvas, context)(backgroundColor.setAlpha(0.8));
    };

    const randomNewPointInCircle = (_) => canvasCircle.randomPointInside();
    const randomNewPointInCanvas = (_) => ({
        x: randomNumberBetween(0, canvasWidth),
        y: randomNumberBetween(0, canvasHeight),
    });

    const draw = ({ canvas, context }) => {
        const result = fill.insert(randomNewPointInCanvas);

        // background(canvas, context)(backgroundColor);

        fill.grow(canvasBounds);

        fill.getCircles().forEach((c) => {
            if (c.growing) drawCircle(ctx)(c, image.pixelColorFromCanvas(c.x, c.y));
        });

        return result;
    };
    return {
        config,
        setup,
        draw,
    };
};
