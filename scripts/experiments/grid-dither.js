import tinycolor from 'tinycolor2';
import { mapRange, randomWholeBetween } from '../lib/math';
import { background, pixel } from '../lib/canvas';
import { ratio, scale, orientation } from '../lib/sketch';
import { bicPenBlue, paperWhite } from '../lib/palettes';
import { Bitmap } from '../lib/Bitmap';
import { createGridCellsXY } from '../lib/grids';
import { setTextureClippingMask, spiralRect, stippleRect, texturizeRect, linesRect } from '../lib/canvas-textures';

import sourcePng from '../../media/images/hi1.png';
// import sourcePng from '../../media/images/hayley-catherine-CRporLYp750-unsplash.png';

export const gridDither = () => {
    const config = {
        name: 'gridDither',
        ratio: ratio.square,
        // ratio: ratio.golden,
        // orientation: orientation.landscape,
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

    let rows;
    const columns = [];

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

        rows = createGridCellsXY(canvas.width, canvas.height, 1, 5);
        rows.points.forEach((p, i) => {
            const c = createGridCellsXY(canvas.width, rows.rowHeight, 10, 1, 0, 10);
            columns.push(c);
        });

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor);

        setTextureClippingMask(false);

        columns.forEach((c, i) => {
            c.points.forEach((p, cell) => {
                // console.log(i, cell + 1);
                const amount = cell + 1;
                if (i === 2) {
                    const theta = randomWholeBetween(0, Math.PI * 2);
                    linesRect(context)(
                        p[0],
                        p[1] + c.rowHeight * i,
                        c.columnWidth,
                        c.rowHeight,
                        foreColor,
                        amount,
                        theta
                    );
                }
                /* if (i === 0) {
                    texturizeRect(context)(
                        p[0],
                        p[1] + c.rowHeight * i,
                        c.columnWidth,
                        c.rowHeight,
                        foreColor,
                        amount,
                        'circles'
                    );
                }
                if (i === 1) {
                    texturizeRect(context)(
                        p[0],
                        p[1] + c.rowHeight * i,
                        c.columnWidth,
                        c.rowHeight,
                        foreColor,
                        amount,
                        'circles2'
                    );
                }
                if (i === 2) {
                    texturizeRect(context)(
                        p[0],
                        p[1] + c.rowHeight * i,
                        c.columnWidth,
                        c.rowHeight,
                        foreColor,
                        amount,
                        'xhatch'
                    );
                }
                if (i === 3) {
                    spiralRect(context)(p[0], p[1] + c.rowHeight * i, c.columnWidth, c.rowHeight, foreColor, amount);
                }
                if (i === 4) {
                    stippleRect(context)(p[0], p[1] + c.rowHeight * i, c.columnWidth, c.rowHeight, foreColor, amount);
                } */
            });
        });

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
