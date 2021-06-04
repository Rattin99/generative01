import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import { createGridCellsXY } from '../rndrgen/math/grids';
import { setTextureClippingMask, spiralRect, stippleRect, texturizeRect, linesRect } from '../rndrgen/canvas/textures';

// import sourcePng from '../../media/images/hi1.png';
import sourcePng from '../../media/images/hayley-catherine-CRporLYp750-unsplash.png';
import { randomWholeBetween } from '../rndrgen/math/random';
import { pixel } from '../rndrgen/canvas/primatives';

export const gridDitherImage = () => {
    const config = {
        name: 'gridDitherImage',
        ratio: ratio.square,
        // ratio: ratio.poster,
        // orientation: orientation.portrait,
        scale: scale.standard,
        fps: 1,
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

        numCells = 30; // Math.ceil(canvas.width / 40);

        grid = createGridCellsXY(canvas.width, canvas.height, numCells, numCells, 0);
        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor);

        setTextureClippingMask(false);

        grid.points.forEach((p, i) => {
            // stippleRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, randomWholeBetween(1, 10));

            const grey = image.averageGreyFromCell(p[0], p[1], grid.columnWidth, grid.rowHeight);
            const theta = grey / 256;

            const amount = mapRange(50, 255, 1, 8, 255 - grey);
            // spiralRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, amount);
            // stippleRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, amount);
            // texturizeRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, amount, 'circles2', 10);
            linesRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, foreColor, amount, theta);
        });

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
