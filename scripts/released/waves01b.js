import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, orientation, scale } from '../rndrgen/Sketch';
import { mapRange, TAU } from '../rndrgen/math/math';
import { create3dNoiseAbs, randomNumberBetween } from '../rndrgen/math/random';
import { drawRibbon, highestYPA, lowestYPA } from '../rndrgen/canvas/ribbon';
import { splatter } from '../scratch/shapes';
import { simplexNoise2d, simplexNoise3d } from '../rndrgen/math/attractors';

/*
Original inspiration
Churn by Kenny Vaden
https://www.reddit.com/r/generative/comments/lq8r11/churn_r_code/
 */

const drawDots = (context, path, yorigin, sourceColor, stroke = false) => {
    let color = sourceColor.clone();

    path.forEach((point) => {
        const rnd = randomNumberBetween(0, yorigin);
        if (rnd < 2) {
            let radius = randomNumberBetween(1, 3);
            if (rnd < 0.005) {
                radius = randomNumberBetween(50, 100);
                color = color.clone().darken(10);
            } else {
                color = color.clone().lighten(2).saturate(10);
            }
            // x, y, color, size, amount = 3, range = 20
            splatter(context)(point[0], point[1], color.toRgbString(), radius, 2, 50);
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
        ratio: ratio.a3plus,
        scale: scale.hidpi,
    };

    let canvasHeight;
    let canvasMiddle;
    const renderScale = config.scale; // 1 or 2

    // Palette from https://www.colourlovers.com/palette/694737/Thought_Provoking
    const colorBackground = 'hsl(46, 75%, 70%)';
    const colorTop = '#06c'; // 'hsl(350, 65%, 46%)';
    const colorBottom = '#3df'; // 'hsl(185, 19%, 40%)';

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
        maxX = canvas.width;

        numWaveXPoints = canvas.width / 5;

        canvasHeight = canvas.height;
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

        const maxWaveHeight = 40 * renderScale;
        const minWaveHeight = 1;

        for (let i = 0; i < waveYValues.length; i++) {
            const color = tinycolor.mix(colorTop, colorBottom, mapRange(startY, maxY, 0, 100, currentY));

            const distFromMiddle = Math.abs(canvasMiddle - currentY);
            color.spin(mapRange(0, canvasMiddle / 2, 20, 0, distFromMiddle));
            color.brighten(mapRange(0, canvasMiddle / 2, 50, 0, distFromMiddle + randomNumberBetween(0, 50)));
            color.darken(mapRange(0, canvasMiddle, 0, 15, distFromMiddle + randomNumberBetween(0, 50)));
            color.saturate(mapRange(0, canvasMiddle / 2, 10, 0, distFromMiddle + randomNumberBetween(0, 50)));

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
            context.lineWidth = 1;

            drawRibbon(context)(waveTop, waveBottom, color, 1, true, 0);
            drawDots(context, waveTop, currentY, color, false);

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
