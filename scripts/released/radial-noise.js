import tinycolor from 'tinycolor2';
import { degreesToRadians } from '../rndrgen/math/math';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { brightest, darkest, hslFromRange, nicePalette } from '../rndrgen/color/palettes';
import { simplexNoise2d, simplexNoise3d } from '../rndrgen/math/attractors';
import { randomPointAround, randomWholeBetween } from '../rndrgen/math/random';
import { drawCircleFilled } from '../rndrgen/canvas/primatives';

/*
Started here but took a detour
https://www.reddit.com/r/creativecoding/comments/lx9prx/audiovisual_sound_of_space_solar_system_david/
 */

const TAU = Math.PI * 2;

export const radialNoise = () => {
    const config = {
        name: 'radialNoise',
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

    const history = {};

    const palette = nicePalette();
    const backgroundColor = brightest(palette).clone().lighten(10);
    const imageColor = darkest(palette).clone();

    // let imageZoomFactor;
    // const png = new Image();
    // png.src = sourcePng;
    // let imageData;

    const setup = ({ canvas, context }) => {
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        maxRadius = canvas.width * 0.4;
        radiusScale = currentRadiusSize / maxRadius;

        originX = canvasMidX;
        originY = canvasMidY;

        // imageData = getImageDataFromImage(context)(png);
        // clearCanvas(canvas, context)();
        // imageZoomFactor = 360 / imageData.width;

        background(canvas, context)(backgroundColor);
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
            let x = originX + circleX(radScaled, radians, a);
            let y = originY + circleY(radScaled, radians, b);

            const noise = simplexNoise3d(x, y, time, 0.02);
            x += noise;
            y += noise;

            const monoColor = imageColor.clone().spin(time * 0.1);

            if (ox !== undefined && oy !== undefined) {
                drawLine(context, ox, oy, x, y, monoColor, 0.5);
            }

            history[radius] = { x, y };

            time += 0.01;
        }

        angle += 3;

        if (angle > 360) {
            angle = 0;

            currentRadiusSize = randomWholeBetween(100, 360);
            radiusScale = 1; // currentRadiusSize / maxRadius;

            const offs = randomPointAround((canvas.width - maxRadius) * 0.75);
            originX = canvasMidX + offs.x;
            originY = canvasMidY + offs.y;
            background(canvas, context)(backgroundColor.setAlpha(0.25));
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
