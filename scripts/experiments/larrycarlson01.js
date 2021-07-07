import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/sketch';
import { paperWhite } from '../rndrgen/color/palettes';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import sourcePng from '../../media/images/rafaella-mendes-diniz-400.png';
import { pixel } from '../rndrgen/canvas/primatives';

/*
https://larrycarlson.com/collections/wavy-art-prints
 */

export const larrycarlson01 = () => {
    const config = {
        name: 'larrycarlson',
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

    const backgroundColor = paperWhite.clone();
    const image = new Bitmap(sourcePng);

    const colorImageTop = tinycolor('#ffeb00');
    const colorImageBottom = tinycolor('#01ff4f');

    const colorLinesTop = tinycolor('#ff01d7');
    const colorLinesBottom = tinycolor('#5600cc');

    const setup = ({ canvas, context }) => {
        image.init(canvas, context);

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

    const circleX = (theta, amp, freq) => Math.cos(theta / freq) * amp;
    const circleY = (theta, amp, freq) => Math.sin(theta / freq) * amp;

    const renderImage = () => {
        const resolution = 10;
        const border = margin / -2;
        const freq = 15;
        const amp = 3;
        let theta = 0;
        for (let x = startX + border; x < maxX - border; x += resolution) {
            for (let y = startY + border; y < maxY - border; y += resolution) {
                const pxcolor = image.pixelColorFromCanvas(x, y);
                const pxbrightness = pxcolor.getBrightness();
                const color = tinycolor.mix(colorImageTop, colorImageBottom, mapRange(startY, maxY, 0, 100, y));

                const size = resolution;

                if (pxbrightness >= 70 && pxbrightness <= 100) {
                    color.spin(30);
                }

                if (pxbrightness >= 120 && pxbrightness <= 220) {
                    color.spin(-30);
                }

                const ox = circleX(theta, amp, freq) + x;
                const oy = circleY(theta, amp, freq) + y;

                pixel(ctx)(ox, oy, color, 'circle', size);

                theta += 0.25;
            }
        }
    };

    const plot = (x, y) => {
        if (x > startX && x < maxX && y > startY && y < maxY) {
            const size = image.sizeFromPixelBrightness(x, y, 3, 128, 256);
            const color = tinycolor.mix(colorLinesTop, colorLinesBottom, mapRange(startY, maxY, 0, 100, y));
            pixel(ctx)(x + 1, y, color.clone().darken(20), 'circle', size);
            pixel(ctx)(x, y, color, 'circle', size);
        }
    };

    /*
    https://www.desmos.com/calculator/rzwar3xxpy
    y-x = amp * Math.sin((y+x)/freq)
     */
    const plotDiagSinWave = (xoffset, yoffset) => {
        const freq = 30; // 30
        const amp = 5; // 5
        let y = 0;
        const a = Math.PI / 3; // angle of the wave, 1 is 45
        for (let x = 0; x < canvasWidth + 10; x++) {
            const b = Math.sin(x / Math.PI) * 5;
            // x = y - Math.sin(y+x)
            y = amp * Math.sin((y + b) / freq) + x * a;
            plot(x + xoffset, y + yoffset);
        }
    };

    const draw = ({ canvas, context }) => {
        renderImage();

        for (let x = (imageWidth + 100) * -1; x < imageWidth * 2; x += 15) {
            plotDiagSinWave(x, 0);
        }

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
