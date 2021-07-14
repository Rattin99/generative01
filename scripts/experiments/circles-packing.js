import { background } from '../rndrgen/canvas/canvas';
import { instagram } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { circle } from '../rndrgen/canvas/primatives';
import { PackCircle } from '../rndrgen/math/Circle';
import { Rectangle } from '../rndrgen/math/Rectangle';
import { randomCircleFill } from '../rndrgen/systems/CirclePackingRandom';

const drawCircle = (context) => ({ x, y, radius }, color = 'black') => {
    circle(context)(x, y, radius, color);
};

// https://www.youtube.com/watch?v=QHEQuoIKgNE&t=1s

/*
Random space filling
 */

export const circlePacking01 = () => {
    const config = {
        name: 'circle-packing-01',
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

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    let canvasBounds;
    let canvasCircle;

    const fill = randomCircleFill(500);

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        canvasBounds = new Rectangle(0, 0, canvasWidth, canvasHeight);

        canvasCircle = new PackCircle(canvasCenterX, canvasCenterY, canvasCenterX * 0.75);

        background(canvas, context)(backgroundColor);
    };

    const randomNewPoint = (_) => canvasCircle.randomPointInside();

    const draw = ({ canvas, context }) => {
        const result = fill.insert(randomNewPoint);

        background(canvas, context)(backgroundColor);

        fill.grow(canvasBounds);

        fill.getCircles().forEach((c) => drawCircle(ctx)(c, foreColor));

        return result;
    };
    return {
        config,
        setup,
        draw,
    };
};
