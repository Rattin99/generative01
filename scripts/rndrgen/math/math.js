/*
  Math Snippets
  https://github.com/terkelg/math
*/

import { Vector } from './Vector';

// Math aliases
export const π = Math.PI;
export const { PI } = Math;
export const TAU = Math.PI * 2;
export const { abs } = Math;
export const { sin } = Math;
export const { cos } = Math;
export const { tan } = Math;
export const { pow } = Math;
export const { round } = Math;
export const { floor } = Math;

// φ phi
export const golden = 1.6180339887498948482;
// g angles: 222.5, 137.5

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

export const checkBoundsLeft = (b, v) => (v < b ? b : v);
export const checkBoundsRight = (b, v) => (v > b ? b : v);

export const clamp = (min = 0, max = 1, a) => Math.min(max, Math.max(min, a));

export const snapNumber = (snap, n) => Math.floor(n / snap) * snap;

export const percentage = (total, num) => Math.round(num * (total / 100));
export const percentageFloor = (total, num) => Math.floor(num * (total / 100));

// Hough transform
// https://stackoverflow.com/questions/24372921/how-to-calculate-quantized-angle
export const houghQuantize = (numAngles, theta) => Math.floor((numAngles * theta) / TAU + 0.5);

// https://stackoverflow.com/questions/47047691/how-to-quantize-directions-in-canny-edge-detector-in-python
export const quantize = (numAngles, theta) => (Math.round(theta * (numAngles / Math.PI)) + numAngles) % numAngles;

export const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const roundToNearest = (near, num) => Math.round(num / near) * near;

// -> -1 ... 1
export const loopingValue = (t, m = 0.5) => Math.sin(t * m);

// t is 0-1, -> -1 ... 1
export const pingPontValue = (t) => Math.sin(t * Math.PI);

// x,y offsets for the current circleOld position
export const pointOnCircle = (x, y, r, a) => ({ x: r * Math.sin(a) + x, y: r * Math.cos(a) + y });

// returns value between 0-1, 250,500,0 => .5
export const normalize = (min, max, val) => (val - min) / (max - min);
export const normalizeInverse = (min, max, val) => 1 - normalize(min, max, val);

// https://twitter.com/mattdesl/status/1031305279227478016
// https://www.trysmudford.com/blog/linear-interpolation-functions/
// lerp(20, 80, 0.5) -> 40
export const lerp = (x, y, a) => x * (1 - a) + y * a;

// invlerp(50, 100, 75)  -> 0.5
export const invlerp = (x, y, a) => clamp(0, 1, (a - x) / (y - x));

// range(10, 100, 2000, 20000, 50) -> 10000
export const mapRange = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

export const isValueInRange = (testVal, val, range) =>
    val === testVal || (val - range < testVal && val + range > testVal);

export const mapToTau = (start, end, value) => mapRange(start, end, 0, TAU, value);

// https://stackoverflow.com/questions/38457053/find-n-logarithmic-intervals-between-two-end-points
export const logInterval = (total_intervals, start, end) => {
    const startInterVal = 1;
    const endInterval = total_intervals;
    const minLog = Math.log(start);
    const maxLog = Math.log(end);
    const scale = (maxLog - minLog) / (endInterval - startInterVal);
    const result = [];
    for (let i = 1; i < total_intervals; i++) {
        result.push(Math.exp(minLog + scale * (i - startInterVal)));
    }
    result.push(end);
    return result;
};

export const angleFromVector = ({ x, y }) => Math.atan2(y, x);
export const uvFromAngle = (a) => new Vector(Math.cos(a), Math.sin(a));

// Accepts a value 0-1 and returns a value 0-1 in a sin wave
export const toSinValue = (value) => Math.abs(Math.sin(value * TAU));

export const radiansToDegrees = (rad) => (rad * 180) / Math.PI;
export const degreesToRadians = (deg) => (deg * Math.PI) / 180;

export const circleX = (theta, amp, freq) => Math.cos(theta / freq) * amp;
export const circleY = (theta, amp, freq) => Math.sin(theta / freq) * amp;
