import { background } from '../rndrgen/canvas/canvas';
import { instagram, largePrint } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { circle, pixel } from '../rndrgen/canvas/primatives';
import { Circle } from '../rndrgen/math/Circle';

const drawCircle = (context) => ({ x, y, radius }, color = 'black') => {
    circle(context)(x, y, radius, color);
};

export const circles01 = () => {
    const config = {
        name: 'circles-01',
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

    let c;
    let r = 0;
    const maxDepth = 3;

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

        c = new Circle(canvasCenterX, canvasCenterY, canvasCenterX * 0.75);

        background(canvas, context)(backgroundColor);

        // drawCircle(context)(c, foreColor);
    };

    const subdiv = (c, depth = 0) => {
        if (depth++ > maxDepth) return;
        c.subdivide(r);
        r += Math.PI / 8;
        c.children.forEach((s) => {
            subdiv(s, depth);
        });
    };

    const drawSubdiv = (c) => {
        drawCircle(ctx)(c, foreColor);
        c.children.forEach((s) => {
            drawSubdiv(s);
        });
    };

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(backgroundColor);

        // c.subdivide(2);

        subdiv(c);

        drawSubdiv(c);

        // console.log(c);
        // c.children.forEach((s) => {
        //     drawCircle(context)(s);
        // });

        // const p = c.randomPointInside();
        // pixel(context)(p.x, p.y, foreColor);

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
