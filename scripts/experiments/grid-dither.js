import tinycolor from 'tinycolor2';
import { mapRange, randomWholeBetween } from '../lib/math';
import { background, pixel } from '../lib/canvas';
import { ratio, scale, orientation } from '../lib/sketch';
import { bicPenBlue, paperWhite } from '../lib/palettes';
import { Bitmap } from '../lib/Bitmap';
import { createGridCellsXY } from '../lib/grids';
import { spiralRect, stippleRect, texturizeRect } from '../lib/canvas-textures';

// import sourcePng from '../../media/images/hi1.png';
import sourcePng from '../../media/images/hayley-catherine-CRporLYp750-unsplash.png';

export const gridDither = () => {
    const config = {
        name: 'gridDither',
        ratio: ratio.square,
        // ratio: ratio.poster,
        // orientation: orientation.portrait,
        scale: scale.standard,
    };

    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let imageWidth;
    let imageHeight;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;

    const backgroundColor = paperWhite.clone();
    const image = new Bitmap(sourcePng);

    const foreColor = bicPenBlue.clone();

    let numCells;
    let grid;

    const setup = ({ canvas, context }) => {
        image.init(canvas, context);

        ctx = context;
        // canvasWidth = canvas.width;
        // canvasHeight = canvas.height;
        // canvasCenterX = canvas.width / 2;
        // canvasCenterY = canvas.height / 2;
        // centerRadius = canvas.height / 4;
        //
        // imageWidth = canvas.width - margin * 2;
        // imageHeight = canvas.height - margin * 2;
        //
        startX = margin;
        maxX = canvas.width - margin;
        startY = margin;
        maxY = canvas.height - margin;

        numCells = canvas.width / 30;

        grid = createGridCellsXY(canvas.width, canvas.height, numCells, numCells);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor);

        grid.points.forEach((p, i) => {
            // stippleRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, randomWholeBetween(1, 10));

            const grey = image.averageGreyFromCell(p[0], p[1], grid.columnWidth, grid.rowHeight);

            const amount = mapRange(0, 255, 1, 10, grey);
            spiralRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, amount);
            // stippleRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, amount);
            // texturizeRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, amount, 'circles2', 10);
        });

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
