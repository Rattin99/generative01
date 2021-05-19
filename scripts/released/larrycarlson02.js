import tinycolor from 'tinycolor2';
import { mapRange } from '../lib/math/math';
import { background, pixel } from '../lib/canvas/canvas';
import { ratio, scale, orientation } from '../lib/Sketch';
import { paperWhite } from '../lib/color/palettes';
import { Bitmap } from '../lib/canvas/Bitmap';
import sourcePng from '../../media/images/alexander-krivitskiy-2wOEPBkaH7o-unsplash.png';

/*
https://larrycarlson.com/collections/wavy-art-prints
 */

export const larrycarlson02 = () => {
    const config = {
        name: 'larrycarlson2',
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
    const ribbonThickness = 10;

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

    // const circleX = (theta, amp, freq) => Math.cos(theta / freq) * amp;
    // const circleY = (theta, amp, freq) => Math.sin(theta / freq) * amp;

    const renderImage = () => {
        const resolution = ribbonThickness / 2;
        const border = margin / -2;
        // const freq = 30;
        // const amp = 1;
        // let theta = 0;
        for (let x = startX + border; x < maxX - border; x += resolution) {
            for (let y = startY + border; y < maxY - border; y += resolution) {
                const pxcolor = image.pixelColorFromCanvas(x, y);
                const pxbrightness = pxcolor.getBrightness();
                const bright = mapRange(128, 255, 0, 50, pxbrightness);

                const color = tinycolor.mix(colorImageTop, colorImageBottom, mapRange(startY, maxY, 0, 100, y));

                const size = resolution;

                if (pxbrightness > 128) color.brighten(bright);

                if (pxbrightness >= 70 && pxbrightness <= 100) {
                    color.spin(30);
                }

                if (pxbrightness >= 120 && pxbrightness <= 220) {
                    // color.spin(-30);
                }

                // const ox = circleX(theta, amp, freq) + x;
                // const oy = circleY(theta, amp, freq) + y;

                pixel(ctx)(x, y, color, 'circle', size);

                // theta += 0.25;
            }
        }
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

    const drawRibbon = (sideA, color, stroke = false) => {
        const rColor = tinycolor(color).clone();
        const gradient = ctx.createLinearGradient(0, startY, 0, maxY);
        gradient.addColorStop(0, colorLinesTop.toRgbString());
        gradient.addColorStop(1, colorLinesBottom.toRgbString());

        ctx.beginPath();
        ctx.moveTo(sideA[0], sideA[0]);
        sideA.forEach((w) => {
            drawRibbonPoint(w, false);
        });
        sideA.reverse().forEach((w) => {
            drawRibbonPoint(w, true);
        });
        ctx.closePath();

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
    const getPointsDiagSinWave = (xoffset, yoffset) => {
        const freq = 40; // 30
        const amp = 15; // 5
        let y = 0;
        const a = Math.PI / 3; // angle of the wave, 1 is 45
        const points = [];
        for (let x = 0; x < canvasWidth; x++) {
            const b = x; // Math.sin(x / Math.PI) * 2;
            // y = amp * Math.sin((y + b) / freq) + x * a;
            y = amp * Math.sin((y * a + b) / freq) + x * a;
            const px = x + xoffset;
            const py = y + yoffset;
            if (px > startX && px < maxX && py > startY && py < maxY) {
                points.push([px, py]);
            }
        }
        return points;
    };

    const draw = ({ canvas, context }) => {
        const points = [];

        renderImage();

        for (let x = (imageWidth + 100) * -1; x < imageWidth * 2; x += ribbonThickness) {
            points.push(getPointsDiagSinWave(x, 0));
        }

        renderPoints(points);

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
