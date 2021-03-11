import tinycolor from 'tinycolor2';
import { mapRange } from '../lib/math';
import { background, pixel } from '../lib/canvas';
import { ratio, scale, orientation } from '../lib/sketch';
import { paperWhite } from '../lib/palettes';
import { Bitmap } from '../lib/Bitmap';
import sourcePng from '../../media/images/rafaella-mendes-diniz-400.png';

/*
https://larrycarlson.com/collections/wavy-art-prints
 */

export const larrycarlson01 = () => {
    const config = {
        name: 'larrycarlson',
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

    const horizontalSinWave = (yoffset) => {
        const freq = 5;
        const amp = 15;
        const step = 2;
        let theta = 0;
        for (let x = startX; x < maxX; x += step) {
            const y = circleY(theta, amp, freq) + yoffset;
            pixel(ctx)(x, y, pixelColor, 'circle', 2);
            theta++;
        }
    };

    const verticalSinWave = (xoffset) => {
        const freq = 5;
        const amp = 15;
        const step = 2;
        let theta = 0;
        for (let y = startY; y < maxY; y += step) {
            const x = circleY(theta, amp, freq) + xoffset;
            pixel(ctx)(x, y, pixelColor, 'circle', 2);
            theta++;
        }
    };

    const fullScreenSin = (xoffset, yoffset) => {
        const freq = 30;
        const amp = 5;
        const step = 5;
        let theta = 0;
        for (let sx = startX; sx < maxX; sx += step) {
            for (let sy = startY; sy < maxY; sy += step) {
                const x = circleX(theta, amp, freq) + xoffset + sx;
                const y = circleY(theta, amp, freq) + yoffset + sy;
                plot(x + xoffset, y + yoffset);
                theta++;
            }
        }
    };

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

    const drawRibbonPoint = (point, sideB) => {
        const x = point[0];
        const y = point[1];

        const size = image.sizeFromPixelBrightness(x, y, 10, 128, 255);
        let jitterX = size;
        let jitterY = 0;

        if (false && sideB) {
            jitterX = size * -1;
            jitterY = size * -0.5;
        }

        ctx.lineTo(x + jitterX, y + jitterY);
    };

    const drawRibbon = (sideA, color, stroke = false, thickness = 1) => {
        const sideB = sideA.slice(); // .reverse();

        const startx = sideA[0][0];
        const starty = sideA[0][1];
        const endx = sideB[0][0];
        const endy = sideB[0][1];

        const rColor = tinycolor(color).clone();
        const gradient = ctx.createLinearGradient(0, startY, 0, maxY);
        gradient.addColorStop(0, colorLinesTop.toRgbString());
        gradient.addColorStop(1, colorLinesBottom.toRgbString());

        ctx.beginPath();
        ctx.moveTo(startx, starty);
        sideA.forEach((w, i) => {
            drawRibbonPoint(w, false);
        });
        sideB.forEach((w, i) => {
            drawRibbonPoint(w, true);
        });
        ctx.lineTo(startx, starty);

        if (stroke) {
            ctx.strokeStyle = rColor.darken(70).toRgbString();
            ctx.lineWidth = 0.75;
            ctx.stroke();
        }

        ctx.fillStyle = gradient;
        ctx.fill();
    };

    const renderPoints = (points) => {
        points.forEach((line) => {
            if (line.length) {
                drawRibbon(line, 'red', false, 0);
            }
        });
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

    const getPointsDiagSinWave = (xoffset, yoffset) => {
        const freq = 30; // 30
        const amp = 5; // 5
        let y = 0;
        const a = Math.PI / 3; // angle of the wave, 1 is 45
        const points = [];
        for (let x = 0; x < canvasWidth + 10; x++) {
            const b = x / Math.PI;
            y = amp * Math.sin((y + b) / freq) + x * a;
            const px = x + xoffset;
            const py = y + yoffset;
            if (px > startX && px < maxX && py > startY && py < maxY) {
                points.push([px, py]);
            }
        }
        return points;
    };

    const draw = ({ canvas, context }) => {
        // horizontalSinWave(startY);
        // verticalSinWave(startX);
        // fullScreenSin(0, 0);

        const points = [];

        renderImage();

        for (let x = (imageWidth + 100) * -1; x < imageWidth * 2; x += 15) {
            plotDiagSinWave(x, 0);
            // points.push(getPointsDiagSinWave(x, 0));
        }

        // renderPoints(points);

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
