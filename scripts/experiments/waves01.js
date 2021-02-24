import tinycolor from 'tinycolor2';
import { background, drawCircleFilled } from '../lib/canvas';
import { nicePalette } from '../lib/palettes';
import {
    create3dNoise,
    createGridPointsUV,
    mapRange,
    marginify,
    oneOf,
    pointDistance,
    randomNumberBetween,
    toSinValue,
    uvFromAngle,
} from '../lib/math';
import { Timeline } from '../lib/Timeline';

/*
Original inspiration https://www.reddit.com/r/generative/comments/lq8r11/churn_r_code/
 */

// period == freqency, phase = angle
// sin((phase + (Math.PI*2) + x) / period) * ampilitude;
// const theta = (angle + Math.PI * 2 + i) / frequency;

const createWave = (width, angle, frequency, amplitude, cosOffset = 1) => {
    const wave = [];
    const cfrequency = frequency + cosOffset / 2;
    const camplitude = amplitude / cosOffset;

    for (let i = 0; i < width; i++) {
        const s = Math.sin((angle + Math.PI * 2 + i) / frequency) * amplitude;
        const c = 0; // Math.cos((angle + Math.PI * 2 + i) / cfrequency) * camplitude;
        const z = Math.sin((angle + 90 + Math.PI * 2 + i) / (frequency * cosOffset)) * (amplitude * cosOffset * 0.5);
        wave.push(s + c - z);
    }

    return wave;
};

const lowest = (arry) =>
    arry.reduce((acc, v) => {
        if (v < acc) {
            acc = v;
        }
        return acc;
    }, 0);

const highest = (arry) =>
    arry.reduce((acc, v) => {
        if (v > acc) {
            acc = v;
        }
        return acc;
    }, 0);

// get the lowest of top and the highest of bottom, height+=that difference
const drawWaveLine = (context) => (startx, endx, yorigin, height, topWave, bottomWave, color, dots = true) => {
    let currentX = startx;
    let currentY = yorigin;

    const highestTop = lowest(topWave);
    const lineheight = highest(bottomWave) - lowest(topWave) + height;

    const gradient = context.createLinearGradient(0, yorigin, 0, yorigin + lineheight);
    gradient.addColorStop(0, tinycolor(color).toRgbString());
    gradient.addColorStop(1, tinycolor(color).darken(20).toRgbString());

    context.strokeStyle = tinycolor(color).darken(70).toRgbString();
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
        context.fillStyle = tinycolor(color).toRgbString();
    }

    context.fill();

    if (dots) {
        currentX = startx;
        currentY = yorigin;
        xstep = (endx - startx) / topWave.length + 1;
        topWave.forEach((w) => {
            if (true || w <= highestTop * 0.5) {
                if (randomNumberBetween(0, 100) < 2) {
                    // context.strokeStyle = tinycolor(color).darken(20).toRgbString();
                    // context.lineWidth = 0.5;
                    context.beginPath();
                    context.arc(
                        currentX + randomNumberBetween(-30, 30),
                        w + currentY - randomNumberBetween(5, 30),
                        2,
                        0,
                        Math.PI * 2,
                        false
                    );
                    // context.fillStyle = tinycolor(color).lighten(10).toRgbString();
                    context.fill();
                    context.stroke();
                }
            }
            currentX += xstep;
        });
    }
};

export const waves01 = () => {
    const config = {
        // width: 900,
        // height: 800,
    };

    let canvasHeight;
    let canvasMiddle;
    const topColor = '#BF1F3C';
    const bottomColor = '#A0E3F2';
    const timeline = new Timeline(config.fps, 0, 5);
    const waveResolution = 200;
    const lineHeight = 50;
    const yIncrement = 1;
    let currentY;
    let maxY;
    let topwave;
    let bottomwave;
    let angle = 90;
    let frequency = 10;
    let amplitude = 10;
    let cosOffset = 0;

    const createWaves = () => {
        const distFromCenter = pointDistance({ x: 0, y: currentY }, { x: 0, y: canvasMiddle });
        // mapRange(0, canvasMiddle, 0.1, 0.5, distFromCenter);

        // angle = 90 + randomNumberBetween(-5, 5);
        // angle += randomNumberBetween(-1, 1);

        angle = mapRange(0, canvasMiddle, 0, 360, distFromCenter);
        frequency = mapRange(0, canvasMiddle, 10, 2, distFromCenter); // - randomNumberBetween(0, 1);
        amplitude = mapRange(0, canvasMiddle, 1, 10, distFromCenter) + randomNumberBetween(10, 20);
        cosOffset = randomNumberBetween(1, 5);

        topwave = createWave(waveResolution, angle, frequency, amplitude, cosOffset);
        bottomwave = createWave(waveResolution, angle, frequency, amplitude, cosOffset);
    };

    const setup = (canvas, context) => {
        canvasHeight = canvas.height;
        canvasMiddle = canvas.height / 2;
        currentY = 100;
        maxY = canvas.height - currentY - lineHeight;

        createWaves();

        background(canvas, context)('rgba(255,255,255,1');
    };

    const draw = (canvas, context, mouse) => {
        const distFromCenter = pointDistance({ x: 0, y: currentY }, { x: 0, y: canvasMiddle });

        // const h = mapRange(0, canvasHeight, 160, 200, currentY);
        // const s = randomNumberBetween(50, 100);
        // const l = mapRange(0, canvasMiddle, 50, 0, distFromCenter) - randomNumberBetween(-10, 20);
        // const a = 1;
        // const color = `hsla(${h},${s}%,${l}%,${a})`;

        const color = tinycolor.mix(topColor, bottomColor, mapRange(0, canvasHeight, 0, 100, currentY));
        color.spin(mapRange(0, canvasMiddle / 2, 90, 0, distFromCenter));
        color.brighten(mapRange(0, canvasMiddle / 2, 20, 0, distFromCenter));
        color.darken(mapRange(0, canvasMiddle, 0, 50, distFromCenter) + randomNumberBetween(0, 30));

        drawWaveLine(context)(0, canvas.width, currentY, lineHeight, topwave, bottomwave, color, true);

        currentY += yIncrement;

        createWaves();

        if (currentY > maxY) {
            // final white lines at top and bottom to clean up edges
            drawWaveLine(context)(0, canvas.width, currentY + lineHeight, 200, topwave, [0], 'white', false);
            drawWaveLine(context)(0, canvas.width, -100, 100, topwave, bottomwave, 'white', false);
            return -1;
        }

        return timeline.onFrame();
    };

    return {
        config,
        setup,
        draw,
    };
};
