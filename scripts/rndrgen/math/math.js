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

export const checkBoundsLeft = (b, v) => (v < b ? b : v);
export const checkBoundsRight = (b, v) => (v > b ? b : v);

export const snapNumber = (snap, n) => Math.floor(n / snap) * snap;

export const percentage = (total, num) => Math.round(num * (total / 100));

// Hough transform
// https://stackoverflow.com/questions/24372921/how-to-calculate-quantized-angle
export const houghQuantize = (numAngles, theta) => Math.floor((numAngles * theta) / TAU + 0.5);
// https://stackoverflow.com/questions/47047691/how-to-quantize-directions-in-canny-edge-detector-in-python
export const quantize = (numAngles, theta) => (Math.round(theta * (numAngles / Math.PI)) + numAngles) % numAngles;

export const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

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

export const aFromVector = ({ x, y }) => Math.atan2(y, x);
export const uvFromAngle = (a) => new Vector(Math.cos(a), Math.sin(a));

export const radiansToDegrees = (rad) => (rad * 180) / Math.PI;
export const degreesToRadians = (deg) => (deg * Math.PI) / 180;

export const valueCloseTo = (testVal, val, range) => {
    if (val === testVal) return true;
    if (val - range < testVal && val + range > testVal) return true;
    return false;
};

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

// Scale up point grid and center in the canvas
export const scalePointToCanvas = (canvasWidth, canvasHeight, width, height, zoomFactor, x, y) => {
    const particleXOffset = canvasWidth / 2 - (width * zoomFactor) / 2;
    const particleYOffset = canvasHeight / 2 - (height * zoomFactor) / 2;
    return {
        x: x * zoomFactor + particleXOffset,
        y: y * zoomFactor + particleYOffset,
    };
};
