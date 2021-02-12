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

export const randomSign = () => (Math.round(Math.random()) == 1 ? 1 : -1);

// returns value between 0-1, 250,500,0 => .5
export const normalize = (min, max, val) => (val - min) / (max - min);
export const normalizeInverse = (min, max, val) => 1 - normalize(min, max, val);

// https://twitter.com/mattdesl/status/1031305279227478016
// https://www.trysmudford.com/blog/linear-interpolation-functions/
// lerp(20, 80, 0.5) // 40
export const lerp = (x, y, a) => x * (1 - a) + y * a;
export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
// invlerp(50, 100, 75)  // 0.5
export const invlerp = (x, y, a) => clamp((a - x) / (y - x));
// a is point in 1 and converts to point in 2
// range(10, 100, 2000, 20000, 50) // 10000
export const lerpRange = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

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

export const randomNumberBetween = (min, max) => Math.random() * (max - min) + min;
export const randomNumberBetweenMid = (min, max) => randomNumberBetween(min, max) - max / 2;

// Scale up point grid and center in the canvas
export const scalePointToCanvas = (cwidth, cheight, width, height, zoomFactor, x, y) => {
    const particleXOffset = cwidth / 2 - (width * zoomFactor) / 2;
    const particleYOffset = cheight / 2 - (height * zoomFactor) / 2;
    return {
        x: x * zoomFactor + particleXOffset,
        y: y * zoomFactor + particleYOffset,
    };
};
