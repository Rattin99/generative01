/*
  Math Snippets
  https://github.com/terkelg/math
*/

import random from 'canvas-sketch-util/random';
import { Vector } from './Vector';

// Math aliases
const π = Math.PI;
const { PI } = Math;
const TAU = Math.PI * 2;
const { abs } = Math;
const { sin } = Math;
const { cos } = Math;
const { tan } = Math;
const { pow } = Math;
const { round } = Math;
const { floor } = Math;

random.setSeed(random.getRandomSeed());
console.log(`Using seed ${random.getSeed()}`);

// φ phi
export const golden = 1.6180339887498948482;
// g angles: 222.5, 137.5

// https://www.mathsisfun.com/numbers/fibonacci-sequence.html
export const fibonacci = [
    0,
    1,
    1,
    2,
    3,
    5,
    8,
    13,
    21,
    34,
    55,
    89,
    144,
    233,
    377,
    610,
    987,
    1597,
    2584,
    4181,
    6765,
    10946,
    17711,
    28657,
    46368,
    75025,
    121393,
    196418,
    317811,
];

export const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const getRandomSeed = () => random.getSeed();
export const setRandomSeed = (s) => random.setRandomSeed(s);

export const randomNumberBetween = (min, max) => random.value() * (max - min) + min;
export const randomWholeBetween = (min, max) => Math.round(random.value() * (max - min) + min);
export const randomNumberBetweenMid = (min, max) => randomNumberBetween(min, max) - max / 2;

export const randomSign = () => (Math.round(random.value()) == 1 ? 1 : -1);

export const oneOf = (arry) => {
    const i = randomWholeBetween(0, arry.length - 1);
    return arry[i];
};

export const lowest = (arry) =>
    arry.reduce((acc, v) => {
        if (v < acc) {
            acc = v;
        }
        return acc;
    }, 0);

export const highest = (arry) =>
    arry.reduce((acc, v) => {
        if (v > acc) {
            acc = v;
        }
        return acc;
    }, 0);

export const createRandomNumberArray = (len, min, max) =>
    Array.from(new Array(len)).map(() => randomNumberBetween(min, max));

// -> -1 ... 1
export const loopingValue = (t, m = 0.5) => Math.sin(t * m);

// t is 0-1, -> -1 ... 1
export const pingPontValue = (t) => Math.sin(t * Math.PI);

// x,y offsets for the current circle position
export const pointOnCircle = (x, y, r, a) => ({ x: r * Math.sin(a) + x, y: r * Math.cos(a) + y });

// returns value between 0-1, 250,500,0 => .5
export const normalize = (min, max, val) => (val - min) / (max - min);
export const normalizeInverse = (min, max, val) => 1 - normalize(min, max, val);

// https://twitter.com/mattdesl/status/1031305279227478016
// https://www.trysmudford.com/blog/linear-interpolation-functions/
// lerp(20, 80, 0.5) // 40
export const lerp = (x, y, a) => x * (1 - a) + y * a;

export const clamp = (min = 0, max = 1, a) => Math.min(max, Math.max(min, a));

// invlerp(50, 100, 75)  // 0.5
export const invlerp = (x, y, a) => clamp(0, 1, (a - x) / (y - x));

// p5js map fn is reverse map(a,x2,y2,x1,y1)
// a is point in 1 and converts to point in 2
// range(10, 100, 2000, 20000, 50) // 10000
export const mapRange = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

// Accepts a value 0-1 and returns a value 0-1 in a sin wave
export const toSinValue = (value) => Math.abs(Math.sin(value * TAU));

export const marginify = ({ margin, u, v, width, height }) => ({
    x: lerp(margin, width - margin, u),
    y: lerp(margin, height - margin, v),
});

export const pointDistance = (pointA, pointB) => {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
};

// https://stackoverflow.com/questions/13043945/how-do-i-calculate-the-position-of-a-point-in-html5-canvas-after-rotation
export const pointRotateCoord = (point, angle) => ({
    x: point.x * cos(angle) - point.y * sin(angle),
    y: point.y * cos(angle) + point.x * sin(angle),
});

// https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-angular-movement/a/pointing-towards-movement
export const pointAngleFromVelocity = ({ velocityX, velocityY }) => Math.atan2(velocityY, velocityX);

export const aFromVector = ({ x, y }) => Math.atan2(y, x);
export const uvFromAngle = (a) => new Vector(Math.cos(a), Math.sin(a));

export const radiansToDegrees = (rad) => (rad * 180) / Math.PI;

// Scale up point grid and center in the canvas
export const scalePointToCanvas = (canvasWidth, canvasHeight, width, height, zoomFactor, x, y) => {
    const particleXOffset = canvasWidth / 2 - (width * zoomFactor) / 2;
    const particleYOffset = canvasHeight / 2 - (height * zoomFactor) / 2;
    return {
        x: x * zoomFactor + particleXOffset,
        y: y * zoomFactor + particleYOffset,
    };
};

export const create2dNoise = (u, v, amplitude = 1, frequency = 0.5) =>
    Math.abs(random.noise2D(u * frequency, v * frequency)) * amplitude;

export const create3dNoise = (u, v, t, amplitude = 1, frequency = 0.5) =>
    Math.abs(random.noise3D(u * frequency, v * frequency, t * frequency)) * amplitude;

// [[x,y], ...]
export const createCirclePoints = (offsetX, offsetY, diameter, steps, sx = 1, sy = 1) => {
    const points = [];
    for (let theta = 0; theta < 360; theta += steps) {
        const radius = theta * (Math.PI / 180);
        const x = Math.cos(radius) * diameter + sx + offsetX;
        const y = Math.sin(radius) * diameter + sy + offsetY;
        points.push([x, y]);
    }
    return points;
};

// -> [[x,y], ...]
export const createGridPointsXY = (width, height, xMargin, yMargin, columns, rows) => {
    const gridPoints = [];

    const colStep = (width - xMargin * 2) / (columns - 1);
    const rowStep = (height - yMargin * 2) / (rows - 1);

    for (let col = 0; col < columns; col++) {
        const x = xMargin + col * colStep;
        for (let row = 0; row < rows; row++) {
            const y = yMargin + row * rowStep;
            gridPoints.push([x, y]);
        }
    }

    return gridPoints;
};

// -> [{radius, rotation, position:[u,v]}, ...]
export const createGridPointsUV = (columns, rows) => {
    rows = rows || columns;
    const points = [];

    const amplitude = 0.1;
    const frequency = 1;

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            const u = columns <= 1 ? 0.5 : x / (columns - 1);
            const v = columns <= 1 ? 0.5 : y / (rows - 1);
            // const radius = Math.abs(random.gaussian() * 0.02);
            const radius = create2dNoise(u, v);
            const rotation = create2dNoise(u, v);
            points.push({
                radius,
                rotation,
                position: [u, v],
            });
        }
    }
    return points;
};
