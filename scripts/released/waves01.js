import tinycolor from 'tinycolor2';
import { background } from '../lib/canvas';
import { create2dNoise, mapRange, randomNumberBetween, lowest, highest } from '../lib/math';

/*
Original inspiration
Churn by Kenny Vaden
https://www.reddit.com/r/generative/comments/lq8r11/churn_r_code/
 */

const createWave = (width, angle, frequency, amplitude, noise = 1) => {
    const points = [];
    const cfrequency = frequency * noise;
    const camplitude = amplitude * noise;

    for (let i = 0; i < width; i++) {
        const s = Math.sin((angle + Math.PI * 2 + i) / frequency) * amplitude;
        const c = Math.cos((angle + Math.PI * 2 + i) / cfrequency) * camplitude;
        points.push(s + c);
    }

    return points;
};

// get the lowest of top and the highest of bottom, height+=that difference
const drawWaveLine = (context) => (startx, endx, yorigin, height, topWave, bottomWave, color, dots = true) => {
    let currentX = startx;
    let currentY = yorigin;

    const waveColor = color.clone();

    // const highestTop = lowest(topWave);
    const lineheight = highest(bottomWave) - lowest(topWave) + height;

    const gradient = context.createLinearGradient(0, yorigin, 0, yorigin + lineheight);
    gradient.addColorStop(0, waveColor.toRgbString());
    gradient.addColorStop(1, waveColor.darken(20).toRgbString());

    context.strokeStyle = waveColor.darken(70).toRgbString();
    context.lineWidth = 0.75;
    context.beginPath();

    context.moveTo(startx, currentY);

    let xstep = (endx - startx) / topWave.length + 1;
    topWave.forEach((w) => {
        context.lineTo(currentX, w + currentY);
        currentX += xstep;
    });

    currentY += lineheight;
    context.lineTo(currentX, currentY);

    xstep = (endx - startx) / bottomWave.length + 1;
    bottomWave.forEach((w) => {
        context.lineTo(currentX, w + currentY);
        currentX -= xstep;
    });

    context.lineTo(startx, currentY);

    if (dots) {
        context.stroke();
        context.fillStyle = gradient;
    } else {
        context.fillStyle = tinycolor(waveColor).toRgbString();
    }

    context.fill();

    if (dots) {
        currentX = startx;
        currentY = yorigin;
        xstep = (endx - startx) / topWave.length + 1;
        const dotColor = color.clone();
        topWave.forEach((w) => {
            // if (w <= highestTop * 0.5) {
            const rnd = randomNumberBetween(0, yorigin);
            if (rnd < 2) {
                // context.strokeStyle = tinycolor(waveColor).darken(20).toRgbString();
                // context.lineWidth = 2;
                const radius = rnd < 0.008 ? randomNumberBetween(50, 100) : randomNumberBetween(1, 3);

                context.fillStyle = dotColor.lighten(5).toRgbString();
                context.beginPath();
                context.arc(
                    currentX + randomNumberBetween(-50, 50),
                    w + currentY - randomNumberBetween(5, 50),
                    radius,
                    0,
                    Math.PI * 2,
                    false
                );
                context.fill();
                context.stroke();
            }
            // }
            currentX += xstep;
        });
    }
};

export const waves01 = () => {
    const config = {
        name: 'waves01',
    };

    let canvasHeight;
    let canvasMiddle;

    // Palette from https://www.colourlovers.com/palette/694737/Thought_Provoking
    const colorBackground = 'hsl(46, 75%, 70%)';
    const colorTop = 'hsl(350, 65%, 46%)';
    const colorBottom = 'hsl(185, 19%, 40%)';

    const waves = [];

    const waveResolution = 400;
    let waveRows;

    let incrementY = 1;
    let startY = 0;
    let currentY;
    let maxY;

    let angle = 90;
    let frequency = 10;
    let amplitude = 10;
    let cosOffset = 0;

    const createWavesRow = (idx) => {
        const mid = waveRows / 2;
        const distFromCenter = Math.abs(mid - idx);

        angle = mapRange(0, waveRows, 0, 360, idx);

        frequency = mapRange(0, mid, 8, 30, distFromCenter);
        amplitude = mapRange(0, mid, 15, 20, distFromCenter) + randomNumberBetween(-5, 5);

        const noise = create2dNoise(angle, idx, amplitude * 0.5, frequency * randomNumberBetween(0, 2));
        cosOffset = noise / randomNumberBetween(2, 10);

        return {
            top: createWave(waveResolution, angle, frequency, amplitude, cosOffset),
            bottom: createWave(waveResolution, angle, frequency, amplitude, cosOffset),
        };
    };

    const setup = (canvas, context) => {
        canvasHeight = canvas.height;
        canvasMiddle = canvas.height / 2;

        waveRows = canvas.height;

        const buffer = canvas.height / 5;
        startY = buffer;

        currentY = startY;

        maxY = canvas.height - buffer * 1.5;
        incrementY = (maxY - startY) / waveRows;

        for (let i = 0; i < waveRows; i++) {
            waves.push(createWavesRow(i));
        }

        background(canvas, context)(tinycolor(colorBackground).lighten(20));
    };

    const draw = (canvas, context, mouse) => {
        const mid = canvasMiddle;

        for (let i = 0; i < waves.length; i++) {
            const distFromCenter = Math.abs(mid - currentY);
            const color = tinycolor.mix(colorTop, colorBottom, mapRange(startY, maxY, 0, 100, currentY));

            color.spin(mapRange(0, mid / 2, 60, 0, distFromCenter));
            color.brighten(mapRange(0, mid / 2, 50, 0, distFromCenter));
            color.darken(mapRange(0, mid, 0, 40, distFromCenter) + randomNumberBetween(0, 30));

            const height = mapRange(startY, maxY, 50, 0, currentY);
            drawWaveLine(context)(0, canvas.width, currentY, height, waves[i].top, waves[i].bottom, color, true);

            currentY += incrementY;
        }

        // final white lines at top and bottom to clean up edges
        // drawWaveLine(context)(0, canvas.width, currentY + rowHeight, 200, topwave, [0], 'white', false);
        // drawWaveLine(context)(0, canvas.width, -100, 100, topwave, bottomwave, 'white', false);

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
