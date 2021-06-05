import tinycolor from 'tinycolor2';

import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { nicePalette, hslFromRange } from '../rndrgen/color/palettes';
import {
    simplexNoise2d,
    simplexNoise3d,
    sinField,
    cliffordAttractor,
    jongAttractor,
    diagLines,
} from '../rndrgen/math/attractors';
import { mapRange, snapNumber } from '../rndrgen/math/math';
import { lineAtAngle } from '../rndrgen/canvas/primatives';

const TAU = Math.PI * 2;

const arc = (context, x, y, size, thick, color, theta) => {
    const startR = snapNumber(Math.PI / 2, theta);
    const endR = startR + Math.PI / 2;
    const clockWise = true;

    context.strokeStyle = tinycolor(color).toRgbString();
    context.lineCap = 'round';
    context.lineWidth = thick;
    context.beginPath();
    context.arc(x + size, y + size, size, startR, endR, clockWise);
    context.stroke();
};

const circle = (context, x, y, size, color, theta) => {
    const startR = 0; // snapNumber(Math.PI / 2, theta);
    const endR = TAU; // startR + Math.PI / 2;
    const clockWise = true;
    const rad = mapRange(0, 5, size * 0.2, size * 0.6, Math.abs(theta));

    context.beginPath();
    context.arc(x + size, y + size, rad, startR, endR, clockWise);
    context.fillStyle = tinycolor(color).toRgbString();
    context.fill();
};

const line = (context, x, y, size, thick, color, theta) => {
    const startR = snapNumber(Math.PI / 2, theta) + Math.PI / 2;
    context.strokeStyle = tinycolor(color).toRgbString();
    lineAtAngle(context)(x + size, y + size, startR, size * 2, thick, 'round');
};

export const flowFieldArcs = () => {
    const config = {
        name: 'flowFieldArcs',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let time = 0;
    const palette = nicePalette();
    const colorBackground = tinycolor('rgba(50,50,50,1)');

    const setup = ({ canvas, context }) => {
        background(canvas, context)(colorBackground);
    };

    const renderField = ({ width, height }, context, fn, cell) => {
        const mid = cell / 2;
        for (let x = 0; x < width; x += cell) {
            for (let y = 0; y < height; y += cell) {
                const theta = fn(x, y);
                const arcColor = hslFromRange(5, 270, 360, Math.abs(theta));
                const lineColor = hslFromRange(5, 180, 270, Math.abs(theta)).darken(10);
                line(context, x, y, mid, mid * 0.5, lineColor, theta);
                circle(context, x, y, mid, lineColor, theta);
                arc(context, x, y, mid, mid * 0.5, arcColor, theta);
                arc(context, x, y, mid, mid * 0.1, 'yellow', theta);
            }
        }
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(colorBackground.setAlpha(0.1));

        // const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
        // const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);
        const noise = (x, y) => simplexNoise3d(x, y, time, 0.001);

        renderField(canvas, context, noise, Math.round(canvas.width / 20));
        time += 0.25;
    };

    return {
        config,
        setup,
        draw,
    };
};
