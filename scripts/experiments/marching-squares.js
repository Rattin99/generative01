import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';

import { simplexNoise2d } from '../rndrgen/math/attractors';
import { renderFieldColor, renderFieldContour } from '../rndrgen/canvas/fields';
import { mapRange } from '../rndrgen/math/math';
import { circleFilled, pixel } from '../rndrgen/canvas/primatives';

// https://www.youtube.com/watch?v=0ZONMNUKTfU&t=2s

export const marchingSquares = () => {
    const config = {
        name: 'marchingSquares',
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

    const noise = (x, y) => simplexNoise2d(x, y, 0.004);

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

    const getTile = (num) => {};

    const draw = ({ canvas, context }) => {
        const { width, height } = canvas;
        const resolution = 10;
        const lowColor = backgroundColor.clone().darken(25);
        const highColor = backgroundColor.clone().brighten(25);
        const noiseMax = 8;
        const xStep = Math.round(width / resolution) + 1;
        const yStep = Math.round(height / resolution) + 1;

        const field = [];

        for (let x = 0; x <= width; x += xStep) {
            for (let y = 0; y <= height; y += yStep) {
                const theta = noise(x, y);
                const normalized = mapRange(-5, 5, 0, 1, theta);
                field.push({ x, y, val: normalized });
                const fillColor = tinycolor.mix(lowColor, highColor, normalized * 100);
                context.fillStyle = tinycolor(fillColor).toRgbString();
                context.fillRect(x, y, x + xStep, y + yStep);
                circleFilled(context)(x, y, 3, 'red');
            }
        }

        // console.log(field);

        return -1;
    };
    return {
        config,
        setup,
        draw,
    };
};
