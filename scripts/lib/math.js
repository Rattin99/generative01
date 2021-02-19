/*
  // Math aliases
  var π = Math.PI
  var random = Math.random
  var round = Math.round
  var floor = Math.floor
  var abs = Math.abs
  var sin = Math.sin
  var cos = Math.cos
  var tan = Math.tan

  Math Snippets
  https://github.com/terkelg/math
*/

import random from 'canvas-sketch-util/random';

random.setSeed(random.getRandomSeed());
console.log(`Using seed ${random.getSeed()}`);

export const TAU = Math.PI * 2;

export const getRandomSeed = () => random.getSeed();
export const setRandomSeed = (s) => random.setRandomSeed(s);

export const randomNumberBetween = (min, max) => random.value() * (max - min) + min;
export const randomNumberBetweenMid = (min, max) => randomNumberBetween(min, max) - max / 2;

export const randomSign = () => (Math.round(random.value()) == 1 ? 1 : -1);

export const oneOf = (arry) => {
    const i = Math.round(randomNumberBetween(0, arry.length - 1));
    return arry[i];
};

export const createRandomNumberArray = (len, min, max) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(randomNumberBetween(min, max));
    }
    return arr;
};

export const pointOnCircle = (x, y, r, d) => ({ x: r * Math.sin(d) + x, y: r * Math.cos(d) + y });

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
// a is point in 1 and converts to point in 2
// range(10, 100, 2000, 20000, 50) // 10000
export const lerpRange = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

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

export const radiansToDegrees = (rad) => (rad * 180) / Math.PI;

// Scale up point grid and center in the canvas
export const scalePointToCanvas = (cwidth, cheight, width, height, zoomFactor, x, y) => {
    const particleXOffset = cwidth / 2 - (width * zoomFactor) / 2;
    const particleYOffset = cheight / 2 - (height * zoomFactor) / 2;
    return {
        x: x * zoomFactor + particleXOffset,
        y: y * zoomFactor + particleYOffset,
    };
};

// [[x,y], ...]
export const createCirclePoints = (centerX, centerY, diameter, steps, sx = 1, sy = 1) => {
    const points = [];
    for (let theta = 0; theta < 360; theta += steps) {
        const radius = theta * (Math.PI / 180);
        const x = Math.cos(radius) * diameter + sx + centerX;
        const y = Math.sin(radius) * diameter + sy + centerY;
        points.push([x, y]);
    }
    return points;
};

export const createGridPoints = (width, height, xMargin, yMargin, columns, rows) => {
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

export const createGridPoints2dNoise = (cols, rows) => {
    rows = rows || cols;
    const points = [];
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const u = cols <= 1 ? 0.5 : x / (cols - 1);
            const v = cols <= 1 ? 0.5 : y / (rows - 1);
            // const radius = Math.abs(random.gaussian() * 0.02);
            const radius = Math.abs(random.noise2D(u, v)) * 0.1;
            const rotation = Math.abs(random.noise2D(u, v)) * 0.5;
            points.push({
                radius,
                rotation,
                position: [u, v],
            });
        }
    }
    return points;
};
