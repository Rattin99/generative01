import tinycolor from 'tinycolor2';
import {
    create2dNoise,
    create3dNoise,
    degreesToRadians,
    mapRange,
    pointDistance,
    randomNumberBetween,
    randomWholeBetween,
    uvFromAngle,
} from './math';
import { drawRectFilled } from './canvas';
import { Particle } from './Particle';
import { Vector } from './Vector';
import { drawConnectedPoints, drawPoints } from './canvas-linespoints';

const TAU = Math.PI * 2;

export const simplexNoise2d = (x, y, f = 0.0005) => create2dNoise(x, y, 1, f) * TAU;
export const simplexNoise3d = (x, y, t, f = 0.002) => create3dNoise(x, y, t, 1, f) * TAU;

export const diagLines = (x, y) => (x + y) * 0.01 * TAU;

// From https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
export const sinField = (x, y) => (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * TAU;

// random attractor params
const a = randomNumberBetween(-2, 2);
const b = randomNumberBetween(-2, 2);
const c = randomNumberBetween(-2, 2);
const d = randomNumberBetween(-2, 2);

// http://paulbourke.net/fractals/clifford/
export const cliffordAttractor = (width, height, x, y) => {
    const scale = 0.01;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(a * y) + c * Math.cos(a * x);
    const y1 = Math.sin(b * x) + d * Math.cos(b * y);
    return Math.atan2(y1 - y, x1 - x);
};

// http://paulbourke.net/fractals/peterdejong/
export const jongAttractor = (width, height, x, y) => {
    const scale = 0.01;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(a * y) - Math.cos(b * x);
    const y1 = Math.sin(c * x) - Math.cos(d * y);
    return Math.atan2(y1 - y, x1 - x);
};

// Misc formula
const flowAtPoint = (x, y) => {
    const scale = 0.01;
    const fromCenter = pointDistance({ x, y }, { x: canvasMidX, y: canvasMidY });
    const simplex = simplexNoise2d(x, y, 0.01);
    // const theta = simplex;
    const theta = (fromCenter + simplex) / 2; // mostly radial around middle
    // const r1 = (Math.sin(1.2 * x) + 0.2 * Math.atan(2 * y)) * 8 * Math.PI;
    // const r2 = (Math.pow(x, 2) + 0.8 * Math.pow(y, 1 / 2)) * 8 * Math.PI * 4;
    // const theta = ((r1 + r2 + simplex) / 3) * 0.001;
    // const theta = ((Math.cos(x) + x + Math.sin(y)) * 24) % (Math.PI / 2); // wander dl like like
    // const theta = Math.atan2(y, x); // cones out from top left
    // const theta = x + y + Math.cos(x * scale) * Math.sin(x * scale); // bl to tr diag and cross perp lines
    // const theta = Math.cos(x * scale) * Math.sin(x * scale); // vertical lines
    // const theta = Math.cos(x) * Math.sin(x) * scale; // horizontal lines
    // const theta = x * Math.sin(y) * scale; // scribble
    // const theta = Math.sin(x * scale) + Math.sin(y * scale); // diamonds
    return theta * TAU;
};
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

const valueCloseTo = (testVal, val, range) => {
    if (val === testVal) return true;
    if (val - range < testVal && val + range > testVal) return true;
    return false;
};

// https://thingonitsown.blogspot.com/2019/02/finding-perlin-contours.html
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
    varience = 0.01
) => {
    const nsteps = (max - min) / steps;
    const rpoints = 50000;

    for (let n = min; n < max; n += nsteps) {
        const lowPoints = [];
        const highPoints = [];
        for (let i = 0; i < rpoints; i++) {
            const px = randomWholeBetween(0, width);
            const py = randomWholeBetween(0, height);
            const nheight = fn(px, py);
            if (valueCloseTo(n, nheight, varience)) {
                if (nheight < 0) lowPoints.push([px, py]);
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
        drawPoints(context)(lowPoints, lowColor, 1);
        drawPoints(context)(highPoints, highColor, 1);
    }
};

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
            (distance > lastDistance - Math.PI / 2 && !valueCloseTo(borderVal, fn(startX, startY), 0.0035)) ||
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

/*
const plotFFPointLines = (num) => {
        for (let i = 0; i < num; i++) {
            const coords = createFFParticleCoords(noise, 0, randomWholeBetween(0, canvasMidY * 2), 2000, 1);
            drawConnectedPoints(ctx)(coords, tinycolor('rgba(0,0,0,.5'), 1);
        }
    };
 */
export const createFFParticleCoords = (fieldFn, startX, startY, length, fMag = 1, vlimit = 1) => {
    const props = {
        x: startX,
        y: startY,
        velocityX: 0,
        velocityY: 0,
        mass: 1,
    };
    const particle = new Particle(props);
    const coords = [];
    for (let i = 0; i < length; i++) {
        const theta = fieldFn(particle.x, particle.y);
        // theta = quantize(4, theta);
        const force = uvFromAngle(theta).setMag(fMag);

        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(vlimit);
        particle.updatePosWithVelocity();
        coords.push([particle.x, particle.y]);
        particle.acceleration = new Vector(0, 0);
    }
    return coords;
};
