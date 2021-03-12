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

export const snapNumber = (snap, n) => Math.floor(n / snap) * snap;

// Hough transform
// https://stackoverflow.com/questions/24372921/how-to-calculate-quantized-angle
export const houghQuantize = (numAngles, theta) => Math.floor((numAngles * theta) / TAU + 0.5);
// https://stackoverflow.com/questions/47047691/how-to-quantize-directions-in-canny-edge-detector-in-python
export const quantize = (numAngles, theta) => (Math.round(theta * (numAngles / Math.PI)) + numAngles) % numAngles;

export const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const getRandomSeed = () => random.getSeed();
export const setRandomSeed = (s) => random.setRandomSeed(s);

// Box-Muller Transform
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
export const randomNormalBM = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = random.value(); // Converting [0,1) to (0,1)
    while (v === 0) v = random.value();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randomNormalBM(); // resample between 0 and 1
    return num;
};

// same source as above
// better solution https://spin.atomicobject.com/2019/09/30/skew-normal-prng-javascript/
export const randomNormalBM2 = (min = 0, max = 1, skew = 1) => {
    let u = 0;
    let v = 0;
    while (u === 0) u = random.value(); // Converting [0,1) to (0,1)
    while (v === 0) v = random.value();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) {
        // // resample between 0 and 1 if out of range
        num = randomNormalBM2(min, max, skew);
    } else {
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
    }
    return num;
};

export const randomNormalNumberBetween = (min, max) => randomNormalBM() * (max - min) + min;
export const randomNormalWholeBetween = (min, max) => Math.round(randomNormalBM() * (max - min) + min);

export const randomNumberBetween = (min, max) => random.valueNonZero() * (max - min) + min;
export const randomWholeBetween = (min, max) => Math.floor(random.value() * (max - min) + min);

export const randomNumberBetweenMid = (min, max) => randomNumberBetween(min, max) - max / 2;

export const randomSign = () => (Math.round(random.value()) === 1 ? 1 : -1);
export const randomBoolean = () => Math.round(random.value()) === 1;
export const randomChance = (chance = 0.5) => random.chance(chance);

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

export const mapToTau = (start, end, value) => mapRange(start, end, 0, TAU, value);

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
export const degreesToRadians = (deg) => (deg * Math.PI) / 180;

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
    random.noise2D(u * frequency, v * frequency) * amplitude;

export const create2dNoiseAbs = (u, v, amplitude = 1, frequency = 0.5) =>
    Math.abs(random.noise2D(u * frequency, v * frequency)) * amplitude;

export const create3dNoise = (u, v, t, amplitude = 1, frequency = 0.5) =>
    random.noise3D(u * frequency, v * frequency, t * frequency) * amplitude;

export const create3dNoiseAbs = (u, v, t, amplitude = 1, frequency = 0.5) =>
    Math.abs(random.noise3D(u * frequency, v * frequency, t * frequency)) * amplitude;

export const randomPointAround = (range = 20) => {
    const radius = randomWholeBetween(0, range);
    const angle = randomNumberBetween(0, TAU);
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
};

// https://observablehq.com/@pamacha/chaikins-algorithm
export const chaikin = (arr, num) => {
    if (num === 0) return arr;
    const l = arr.length;
    const smooth = arr
        .map((c, i) => [
            [0.75 * c[0] + 0.25 * arr[(i + 1) % l][0], 0.75 * c[1] + 0.25 * arr[(i + 1) % l][1]],
            [0.25 * c[0] + 0.75 * arr[(i + 1) % l][0], 0.25 * c[1] + 0.75 * arr[(i + 1) % l][1]],
        ])
        .flat();
    return num === 1 ? smooth : chaikin(smooth, num - 1);
};
