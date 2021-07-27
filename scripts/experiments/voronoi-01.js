import { background, resetContext } from '../rndrgen/canvas/canvas';
import { instagram, largePrint } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { Delaunay } from '../rndrgen/systems/d3Delaunay';
import { randomWholeBetween } from '../rndrgen/math/random';
import { circlePointsPA } from '../rndrgen/math/grids';

/*
Using https://github.com/d3/d3-delaunay
Examples https://observablehq.com/@mbostock/the-delaunays-dual
 */

const randomPointPA = (xmin, ymin, xmax, ymax) => [randomWholeBetween(xmin, xmax), randomWholeBetween(ymin, ymax)];
const getRandomPointsPA = (len, xmin, ymin, xmax, ymax) => {
    const points = [];
    for (let i = 0; i < len; i++) {
        points.push(randomPointPA(xmin, ymin, xmax, ymax));
    }
    return points;
};

export const voronoi01 = () => {
    const config = {
        name: 'voronoi-01',
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
    const margin = 0;
    const renderScale = config.scale; // 1 or 2

    const backgroundColor = bicPenBlue.clone();
    const foreColor = paperWhite.clone();

    let points;
    let delaunay;
    let voronoi;

    const render = (context) => {
        // context.fillStyle = foreColor.toRgbString();
        // context.beginPath();
        // delaunay.renderPoints(context);
        // context.fill();
        // context.stroke();
        // context.closePath();

        // context.strokeStyle = foreColor.clone().setAlpha(0.25).toRgbString();
        // context.beginPath();
        // delaunay.render(context);
        // context.stroke();
        // context.closePath();

        context.strokeStyle = foreColor.toRgbString();
        context.beginPath();
        voronoi.render(context);
        context.stroke();
        context.closePath();
    };

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

        points = getRandomPointsPA(50, startX, startY, maxX, maxY);

        points = points.concat(circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 3, Math.PI / 40));
        points = points.concat(circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 4, Math.PI / 20));
        points = points.concat(circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 5, Math.PI / 10));
        points = points.concat(circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 6, Math.PI / 5));

        delaunay = Delaunay.from(points);
        voronoi = delaunay.voronoi([startX, startY, maxX, maxY]);

        background(canvas, context)(backgroundColor);

        render(context);
    };

    const draw = ({ canvas, context, mouse }) => {
        if (mouse.x && mouse.y) {
            background(canvas, context)(backgroundColor);
            points.push([mouse.x, mouse.y]);
            delaunay = Delaunay.from(points);
            voronoi = delaunay.voronoi([startX, startY, maxX, maxY]);
            render(context);
        }
        return -1;
    };

    // const draw = ({ canvas, context, mouse }) => {
    //     if (mouse.x && mouse.y) {
    //         background(canvas, context)(backgroundColor);
    //         points.push([mouse.x, mouse.y]);
    //         delaunay = Delaunay.from(points);
    //         voronoi = delaunay.voronoi([startX, startY, maxX, maxY]);
    //         render(context);
    //     }
    //     return 1;
    // };

    return {
        config,
        setup,
        draw,
    };
};
