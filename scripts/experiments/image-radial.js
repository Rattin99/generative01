import tinycolor from 'tinycolor2';
import {
    mapRange,
    randomWholeBetween,
    uvFromAngle,
    snapNumber,
    quantize,
    pointDistance,
    degreesToRadians,
    randomNumberBetween,
    fibonacci,
} from '../lib/math';
import {
    background,
    drawCircleFilled,
    getImageDataFromImage,
    getImageDataColor,
    clearCanvas,
    splatter,
} from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { brightest, darkest, hslFromRange, nicePalette } from '../lib/palettes';
import sourcePng from '../../gaetano-cessati-waves-400.png';
import { simplexNoise2d, simplexNoise3d } from '../lib/attractors';

/*
https://www.reddit.com/r/creativecoding/comments/lx9prx/audiovisual_sound_of_space_solar_system_david/
 */

const TAU = Math.PI * 2;

export const imageRadial = () => {
    const config = {
        name: 'imageRadial',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasMidX;
    let canvasMidY;
    let radiusScale;

    let time = 0;
    let angle = 0;

    const history = {};

    const palette = nicePalette();
    const backgroundColor = brightest(palette).clone().lighten(10);
    const imageColor = darkest(palette).clone();

    let imageZoomFactor;
    const png = new Image();
    png.src = sourcePng;
    let imageData;

    const setup = ({ canvas, context }) => {
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        radiusScale = 360 / (canvas.width * 0.4);

        imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();
        imageZoomFactor = 360 / imageData.width;

        background(canvas, context)(backgroundColor);
    };

    const drawPixel = (context, x, y, color, size = 1, heading = 0) => {
        // drawRectFilled(context)(x, y, size, size, color);
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

    const draw = ({ canvas, context }) => {
        const radStep = randomWholeBetween(Math.PI * 2, Math.PI * 4);
        for (let radius = 0; radius < 360; radius += radStep) {
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
            let x = canvasMidX + circleX(radScaled, radians, a);
            let y = canvasMidY + circleY(radScaled, radians, b);

            const noise = simplexNoise3d(x, y, time, 0.08) + getImagePixelTheta(Math.floor(angle), Math.floor(radius));
            x += noise;
            y += noise;

            const imagePixelColor = getImagePixelColor(Math.floor(angle), Math.floor(radius));
            const imagePixelBrightness = 256 - imagePixelColor.getBrightness();

            const alpha = mapRange(0, 255, 0, 1, imagePixelBrightness) * 0.2;

            const monoColor = imageColor
                .clone()
                .spin(time * 0.1)
                .setAlpha(alpha);

            // if (fibonacci.includes(radius)) {
            // if (radius > 356) {
            //     splatter(context)(x, y, monoColor, 2, 2, 50);
            // }

            if (ox !== undefined && oy !== undefined) {
                drawLine(context, ox, oy, x, y, monoColor, 0.5);
            }

            history[radius] = { x, y };

            time += 0.01;
        }

        angle += randomNumberBetween(0, 1);
        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
