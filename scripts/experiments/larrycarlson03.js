import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import sourcePng from '../../media/images/alexander-krivitskiy-2wOEPBkaH7o-unsplash.png';
import { pixel } from '../rndrgen/canvas/primatives';

/*
https://larrycarlson.com/collections/wavy-art-prints
 */

export const larrycarlson03 = () => {
    const config = {
        name: 'larrycarlson3',
        ratio: ratio.square,
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
    const ribbonThickness = 10;

    const backgroundColor = paperWhite.clone();
    const image = new Bitmap(sourcePng);

    const colorImageTop = tinycolor('#ffeb00');
    const colorImageBottom = tinycolor('#01ff4f');

    const colorLinesTop = tinycolor('#ff01d7');
    const colorLinesBottom = tinycolor('#5600cc');

    const ribbonColor = bicPenBlue.clone();

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

        background(canvas, context)(backgroundColor);
    };

    const drawRibbonPoint = (point, isOtherSide) => {
        const x = point[0];
        const y = point[1];

        // -2 +1 to keep from overlapping other ribbons and give it a min thickness of 1
        const size = image.sizeFromPixelBrightness(x, y, ribbonThickness - 2, 128, 255) + 0.75;
        let jitterX = 0; // size;
        // let jitterY = 0;

        if (isOtherSide) {
            jitterX = size * -1;
            // jitterY = size * -0.25;
        }

        ctx.lineTo(x + jitterX, y);
    };

    const drawRibbon = (sideA, color) => {
        ctx.beginPath();
        ctx.moveTo(sideA[0], sideA[0]);
        sideA.forEach((w) => {
            drawRibbonPoint(w, false);
        });
        sideA.reverse().forEach((w) => {
            drawRibbonPoint(w, true);
        });
        ctx.closePath();

        ctx.fillStyle = color.toRgbString();
        ctx.fill();
    };

    /*
    https://www.desmos.com/calculator/rzwar3xxpy
    y-x = amp * Math.sin((y+x)/freq)
     */
    const getPointsDiagSinWave = (minx, maxx, miny, maxy, xoffset = 0, yoffset = 0) => {
        const freq = 40; // 30
        const amp = 5; // 5
        let y = 0;
        const a = Math.PI / 3; // angle of the wave, 1 is 45
        const points = [];
        for (let x = minx; x < maxx; x++) {
            const b = x; // Math.sin(x / Math.PI) * 2;
            // y = amp * Math.sin((y + b) / freq) + x * a;
            y = amp * Math.sin((y * a + b) / freq) + x * a;
            const px = x + xoffset;
            const py = y + yoffset;
            if (px >= minx && px <= maxx && py >= miny && py <= maxy) {
                points.push([px, py]);
            }
        }
        return points;
    };

    const draw = ({ canvas, context }) => {
        const points = [];

        const w = canvas.width;

        for (let x = w * -1; x < w; x += ribbonThickness) {
            points.push(getPointsDiagSinWave(0, canvas.height, 0, canvas.height, x, 0));
        }

        points.forEach((line) => {
            if (line.length) {
                drawRibbon(line, ribbonColor);
            }
        });

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
