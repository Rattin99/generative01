import tinycolor from 'tinycolor2';
import { randomWholeBetween, degreesToRadians, randomPointAround, quantize } from '../lib/math/math';
import { background, drawCircleFilled, clearCanvas } from '../lib/canvas/canvas';
import { ratio, scale } from '../lib/Sketch';
import { brightest, darkest, hslFromRange, nicePalette } from '../lib/color/palettes';
import { simplexNoise2d, simplexNoise3d } from '../lib/math/attractors';
import sourcePng from '../../media/images/gaetano-cessati-waves-400.png';

/*
Started here but took a detour
https://www.reddit.com/r/creativecoding/comments/lx9prx/audiovisual_sound_of_space_solar_system_david/
 */

const TAU = Math.PI * 2;

const getImageDataFromImage = (context) => (image) => {
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.width);
};

const getImageDataColor = (imageData, x, y) => ({
    r: imageData.data[y * 4 * imageData.width + x * 4],
    g: imageData.data[y * 4 * imageData.width + x * 4 + 1],
    b: imageData.data[y * 4 * imageData.width + x * 4 + 2],
    a: imageData.data[y * 4 * imageData.width + x * 4 + 3],
});

export const radialImage = () => {
    const config = {
        name: 'radialImage',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasMidX;
    let canvasMidY;
    let maxRadius;
    let radiusScale;
    let currentRadiusSize = 360;

    let originX;
    let originY;
    let time = 0;
    let angle = 0;

    let history = {};

    const palette = nicePalette();
    const imageColor = darkest(palette).clone();
    const backgroundColor = tinycolor('#f4f6ed'); // brightest(palette).clone().lighten(10);

    let imageZoomFactor;
    const png = new Image();
    png.src = sourcePng;
    let imageData;

    const setup = ({ canvas, context }) => {
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        maxRadius = canvas.width * 0.4;
        radiusScale = currentRadiusSize / maxRadius;

        originX = canvasMidX;
        originY = canvasMidY;

        imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();
        imageZoomFactor = currentRadiusSize / imageData.width;

        background(canvas, context)(backgroundColor);
    };

    const getImagePixelTheta = (x, y) => {
        const imagePixelColor = tinycolor(getImageDataColor(imageData, x, y)).getBrightness();
        return (imagePixelColor / 256) * TAU;
    };

    const getImagePixelColor = (x, y) => {
        const imagePixel = getImageDataColor(
            imageData,
            Math.round(x / imageZoomFactor),
            Math.round(y / imageZoomFactor)
        );
        return tinycolor(imagePixel);
    };

    const drawPixel = (context, x, y, color, size = 1, heading = 0) => {
        drawCircleFilled(context)(x, y, size, color);
    };

    const drawLine = (context, x1, y1, x2, y2, color, strokeWidth = 1) => {
        context.strokeStyle = tinycolor(color).toRgbString();
        context.lineWidth = strokeWidth;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    };

    const circleX = (r, a, v = 1) => r * Math.cos(a * v);
    const circleY = (r, a, v = 1) => r * Math.sin(a * v);

    const draw = ({ canvas, context }) => {
        for (let radius = 0; radius < currentRadiusSize; radius++) {
            let ox;
            let oy;

            if (history.hasOwnProperty(radius)) {
                ox = history[radius].x;
                oy = history[radius].y;
            }

            const radScaled = radius / radiusScale;
            const a = 1;
            const b = 1;
            const radians = degreesToRadians(angle) - Math.PI / 8;
            const x = originX + circleX(radScaled, radians, a);
            const y = originY + circleY(radScaled, radians, b);

            const noise = simplexNoise3d(x, y, time, 0.01);
            // noise = quantize(36, noise);
            x += noise;
            y += noise;

            const monoColor = imageColor.clone().spin(time * 0.1);
            const pixelColor = getImagePixelColor(angle, radius).spin(time * 0.01);

            // drawPixel(context, x, y, pixelColor, 1);

            if (ox !== undefined && oy !== undefined) {
                drawLine(context, ox, oy, x, y, pixelColor, 0.5);
            }

            history[radius] = { x, y };

            // originY += Math.sin(noise) * 0.01;

            time += 0.01;
        }

        angle += 0.5;

        if (angle > 365) {
            angle = 0;
            history = {};

            currentRadiusSize = randomWholeBetween(100, 360);
            radiusScale = 1; // currentRadiusSize / maxRadius;
            imageZoomFactor = currentRadiusSize / imageData.width;

            const offs = randomPointAround((canvas.width - maxRadius) * 0.75);
            originX = canvasMidX + offs.x;
            originY = canvasMidY + offs.y;
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
