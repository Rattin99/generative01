import tinycolor from 'tinycolor2';
import { mapRange, uvFromAngle, isValueInRange } from '../math/math';
import { randomWholeBetween } from '../math/random';
import { pixelAtPoints } from './primatives';

export const renderField = ({ width, height }, context, fn, color = 'black', resolution = '50', length = 10) => {
    const xStep = Math.round(width / resolution);
    const yStep = Math.round(height / resolution);
    const xMid = xStep / 2;
    const yMid = yStep / 2;
    for (let x = 0; x < width; x += xStep) {
        for (let y = 0; y < height; y += yStep) {
            const theta = fn(x, y);
            const vect = uvFromAngle(theta).setMag(length || xMid);
            const x1 = x + xMid;
            const y1 = y + yMid;
            const x2 = x1 + vect.x;
            const y2 = y1 + vect.y;
            context.strokeStyle = tinycolor(color);
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
        }
    }
};

export const renderFieldColor = (
    { width, height },
    context,
    fn,
    resolution = '50',
    lowColor,
    highColor,
    noiseMax = 5
) => {
    const xStep = Math.round(width / resolution);
    const yStep = Math.round(height / resolution);
    for (let x = 0; x < width; x += xStep) {
        for (let y = 0; y < height; y += yStep) {
            const theta = fn(x, y);
            const colorMix = mapRange(0, noiseMax * 2, 0, 100, theta + noiseMax);
            const fillColor = tinycolor.mix(lowColor, highColor, colorMix);
            context.fillStyle = tinycolor(fillColor).toRgbString();
            context.fillRect(x, y, x + xStep, y + yStep);
        }
    }
};

// https://codepen.io/crummy/pen/RWRWQe?editors=0010
// http://bl.ocks.org/blinsay/c8bcfeff0b6159f44aec
// https://github.com/anvaka/streamlines
export const renderFieldContour = (
    { width, height },
    context,
    fn,
    min = -8,
    max = 8,
    steps = 30,
    lowColor = 'black',
    highColor = 'white',
    varience = 0.025
) => {
    const nsteps = (max - min) / steps;
    const rpoints = 100000;

    for (let n = min; n < max; n += nsteps) {
        const lowPoints = [];
        const highPoints = [];
        for (let i = 0; i < rpoints; i++) {
            const px = randomWholeBetween(0, width);
            const py = randomWholeBetween(0, height);
            const nheight = fn(px, py);
            if (isValueInRange(n, nheight, varience)) {
                if (nheight <= 0) lowPoints.push([px, py]);
                else highPoints.push([px, py]);

                // const vect = uvFromAngle(nheight).setMag(5);
                // const x2 = px + vect.x;
                // const y2 = py + vect.y;
                // context.strokeStyle = tinycolor(lowColor);
                // context.lineWidth = 1;
                // context.beginPath();
                // context.moveTo(px, py);
                // context.lineTo(x2, y2);
                // context.stroke();
            }
        }
        pixelAtPoints(context)(lowPoints, lowColor, 1);
        pixelAtPoints(context)(highPoints, highColor, 1);
    }
};

// https://thingonitsown.blogspot.com/2019/02/finding-perlin-contours.html
/*
function renderNoiseContour(startX, startY, borderVal, fn) {
    const lookRad = 2;
    let nextX = startX;
    let nextY = startY;
    const coords = [];
    // set color
    // start shape

    let distance = 0;
    for (let i = 0; i < 50000; i++) {
        const lastDistance = distance;
        const lastX = nextX;
        const lastY = nextY;
        for (
            distance = lastDistance + Math.PI / 2;
            (distance > lastDistance - Math.PI / 2 && !isValueInRange(borderVal, fn(startX, startY), 0.0035)) ||
            distance === lastDistance + Math.PI / 2;
            distance -= 0.17
        ) {
            nextX = lastX + lookRad * Math.cos(distance);
            nextY = lastY - lookRad * Math.sin(distance);
        }
        coords.push([nextX, nextY]);
        // vertex(nextX - mx + windowWidth / 2, nextY - my + windowHeight / 2)

        if (pointDistance({ x: nextX, y: nextY }, { x: startX, y: startY }) < lookRad && i > 1) {
            if (i > 4) {
                // endShape(CLOSE)
                return coords;
            }
            break;
        }
    }
}
*/
