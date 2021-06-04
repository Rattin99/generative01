import { pixel } from '../rndrgen/canvas/primatives';
import { circleX, circleY } from '../rndrgen/math/math';

const horizontalSinWave = (ctx, startX, maxX, yoffset, pixelColor) => {
    const freq = 5;
    const amp = 15;
    const step = 2;
    let theta = 0;
    for (let x = startX; x < maxX; x += step) {
        const y = circleY(theta, amp, freq) + yoffset;
        pixel(ctx)(x, y, pixelColor, 'circle', 2);
        theta++;
    }
};

const verticalSinWave = (ctx, startX, maxX, yoffset, pixelColor) => {
    const freq = 5;
    const amp = 15;
    const step = 2;
    let theta = 0;
    for (let y = startY; y < maxY; y += step) {
        const x = circleY(theta, amp, freq) + xoffset;
        pixel(ctx)(x, y, pixelColor, 'circle', 2);
        theta++;
    }
};

const fullScreenSin = (xoffset, yoffset) => {
    const freq = 30;
    const amp = 5;
    const step = 5;
    let theta = 0;
    for (let sx = startX; sx < maxX; sx += step) {
        for (let sy = startY; sy < maxY; sy += step) {
            const x = circleX(theta, amp, freq) + xoffset + sx;
            const y = circleY(theta, amp, freq) + yoffset + sy;
            plot(x + xoffset, y + yoffset);
            theta++;
        }
    }
};

/*
    https://www.desmos.com/calculator/rzwar3xxpy
    y-x = amp * Math.sin((y+x)/freq)
     */
const plotDiagSinWave = (xoffset, yoffset) => {
    const freq = 30; // 30
    const amp = 5; // 5
    let y = 0;
    const a = Math.PI / 3; // angle of the wave, 1 is 45
    for (let x = 0; x < canvasWidth + 10; x++) {
        const b = Math.sin(x / Math.PI) * 5;
        // x = y - Math.sin(y+x)
        y = amp * Math.sin((y + b) / freq) + x * a;
        plot(x + xoffset, y + yoffset);
    }
};
