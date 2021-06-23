import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import { getGridCells } from '../rndrgen/math/grids';
import {
    setTextureClippingMaskEnabled,
    textureRectSprials,
    textureRectStipple,
    textureRect,
    textureRectZigZag,
} from '../rndrgen/canvas/textures';

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
    };

    let cnvs;
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
    let image = new Bitmap(sourcePng);

    const foreColor = bicPenBlue.clone();

    let numCells;
    let grid;

    const droppedImage = (imageData) => {
        image = new Bitmap(imageData);
        image.init(cnvs, ctx, false);
        draw({});
    };

    const setup = ({ canvas, context, sketchInstance }) => {
        // sketchInstance.enableDragUpload((d) => droppedImage(d));

        image.init(canvas, context, true);

        cnvs = canvas;
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

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(backgroundColor);

        setTextureClippingMaskEnabled(false);
        grid = getGridCells(cnvs.width, cnvs.height, numCells, numCells, 0);

        grid.points.forEach((p, i) => {
            const grey = image.averageGreyFromCell(p[0], p[1], grid.columnWidth, grid.rowHeight);
            const theta = grey / 256;
            const amount = mapRange(50, 255, 1, 8, 255 - grey) / 3;

            // textureRect(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, 'blue', amount, 'circles2', 3);
            // textureRectSprials(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, 'red', amount);
            textureRectStipple(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, 'green', amount * 1.5);
            // textureRectZigZag(context)(p[0], p[1], grid.columnWidth, grid.rowHeight, 'yellow', amount, theta);
        });

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
