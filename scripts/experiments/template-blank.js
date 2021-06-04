import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background, pixel } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import { createGridCellsXY } from '../rndrgen/math/grids';
import {
    setTextureClippingMask,
    spiralRect,
    stippleRect,
    texturizeRect,
    linesRect,
} from '../rndrgen/canvas/canvas-textures';

import sourcePng from '../../media/images/hi1.png';
import { randomWholeBetween } from '../rndrgen/math/random';
// import sourcePng from '../../media/images/hayley-catherine-CRporLYp750-unsplash.png';

export const templateBlank = () => {
    const config = {
        name: 'blankTemplate',
        ratio: ratio.square,
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
    const foreColor = bicPenBlue.clone();

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        imageWidth = canvas.width - margin * 2;
        imageHeight = canvas.height - margin * 2;

        startX = margin;
        maxX = canvas.width - margin;
        startY = margin;
        maxY = canvas.height - margin;

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor);
        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
