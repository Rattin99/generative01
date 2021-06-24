import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, orientation, scale } from '../rndrgen/Sketch';
import { mapRange} from '../rndrgen/math/math';
import { randomNumberBetween } from '../rndrgen/math/random';
import { ribbonSegmented ribbonSegment } from '../rndrgen/canvas/ribbon';
import { splatter } from '../scratch/shapes';
import { cliffordAttractor, simplexNoise2d, simplexNoise3d } from '../rndrgen/math/attractors';
import {nicePalette} from "../rndrgen/color/palettes";

/*
Original inspiration
Churn by Kenny Vaden
https://www.reddit.com/r/generative/comments/lq8r11/churn_r_code/
 */

const drawDots = (context, path, yorigin, sourceColor, scale, stroke = false) => {
    let color = sourceColor.clone();

    path.forEach((point) => {
        const rnd = randomNumberBetween(0, yorigin);
        if (rnd < 2) {
            let radius = randomNumberBetween(1, 2 * scale);
            let quantity = 3;
            if (rnd < 0.005) {
                radius = randomNumberBetween(25 * scale, 50 * scale);
                quantity = 1;
                color = color.clone().darken(10);
            } else {
                color = color.clone().lighten(5).saturate(10);
            }
            // x, y, color, size, amount = 3, range = 20
            splatter(context)(point[0], point[1], color.toRgbString(), radius, quantity, 35 * scale);
        }
    });

    if (stroke) {
        // context.strokeStyle = color.darken(70).toRgbString();
        // context.lineWidth = 1;
        // context.stroke();
    }
};

export const waves01b = () => {
    const config = {
        name: 'waves01b',
        orientation: orientation.landscape,
        // ratio: ratio.a3,
        ratio: ratio.square,
        // scale: scale.hidpi,
        scale: scale.standard,
    };

    let canvasWidth;
    let canvasHeight;
    let canvasMiddle;
    const renderScale = config.scale; // 1 or 2

    const colorBackground = 'hsl(46, 75%, 70%)';
    const colorTop = 'hsl(185, 100%, 18%)'; // 'hsl(350, 65%, 46%)';
    const colorBottom = 'hsl(182, 100%, 29%)'; // 'hsl(185, 19%, 40%)';

    const waveYValues = [];
    let numWaveXPoints;
    const waveDensity = renderScale;
    let numWaveRows;

    const startX = 0;
    let maxX;
    let startY = 0;
    let maxY;
    let time = 0;

    const createNoiseValues = (idx, distance, frequency, amplitude) => {
        const points = [];
        for (let i = 0; i < numWaveXPoints; i++) {
            const n = simplexNoise3d(i, distance, idx, frequency) * amplitude;
            // const n = simplexNoise3d(i, idx, time, frequency) * amplitude;
            // const n = simplexNoise2d(i, idx * 2, frequency) * amplitude;
            points.push(n);
        }

        return points;
    };

    const createRow = (idx) => {
        time += 1;
        const mid = numWaveRows / 2;
        const distFromCenter = Math.abs(mid - idx);
        const frequency =
            mapRange(0, mid, 1.25, 0.5, distFromCenter + randomNumberBetween(-5, 5)) *
            (randomNumberBetween(9, 12) * 0.001);
        const amplitude = mapRange(0, mid, 10, 20, distFromCenter * randomNumberBetween(0, 2));

        return {
            top: createNoiseValues(idx, distFromCenter, frequency, amplitude),
            bottom: createNoiseValues(idx, distFromCenter, frequency, amplitude),
        };
    };

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        maxX = canvas.width;
        numWaveXPoints = canvas.width / 5;
        canvasMiddle = canvas.height / 2;
        numWaveRows = canvasHeight / waveDensity;
        const yBufferSpace = canvasHeight / 7;
        startY = yBufferSpace;
        maxY = canvasHeight - yBufferSpace * 1.25;

        for (let i = 0; i < numWaveRows; i++) {
            waveYValues.push(createRow(i + 1));
        }

        background(canvas, context)(tinycolor(colorBackground).lighten(20));
    };

    const draw = ({ canvas, context }) => {
        let currentY = startY;
        const incrementX = Math.ceil((maxX - startX) / numWaveXPoints) + 1;
        const incrementY = (maxY - startY) / numWaveRows;

        const canvasFocal = (canvasHeight / 3) * 2;
        const focalRange = canvasFocal * 0.75;

        const maxWaveHeight = 40 * renderScale;
        const minWaveHeight = 3;

        const palette = nicePalette();

        for (let i = 0; i < waveYValues.length; i++) {
            const color = tinycolor
                .mix(colorTop, colorBottom, mapRange(startY, maxY, 0, 100, currentY))
                .brighten(15)
                .spin(randomNumberBetween(-10, 10));

            const distFromMiddle = Math.abs(canvasFocal - currentY);
            color.spin(mapRange(0, focalRange, 20, -20, distFromMiddle));
            color.brighten(mapRange(0, focalRange, 50, 0, distFromMiddle + randomNumberBetween(0, 100)));
            color.darken(mapRange(0, canvasFocal, 0, 15, distFromMiddle + randomNumberBetween(0, 50)));
            // color.saturate(mapRange(0, focalRange, 10, 0, distFromMiddle + randomNumberBetween(0, 100)));

            const waveheight = mapRange(startY, maxY, maxWaveHeight, minWaveHeight, currentY);

            const waveTop = [];
            const waveBottom = [];
            let currentX = 0;
            for (let j = 0; j < numWaveXPoints; j++) {
                waveTop.push([currentX, currentY + waveYValues[i].top[j]]);
                waveBottom.push([currentX, currentY + waveYValues[i].bottom[j] + waveheight]);
                currentX += incrementX;
            }

            context.strokeStyle = color.clone().darken(60).toRgbString();
            context.lineWidth = renderScale;

            ribbonSegment(context)(waveTop, waveBottom.reverse(), color, true, 0);
            drawDots(context, waveTop, currentY, color, renderScale, false);
            // ribbonSegmented(context)(waveTop, waveBottom, color, { segments: 15, gap: 0, colors: palette });


            currentY += incrementY;
        }

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
