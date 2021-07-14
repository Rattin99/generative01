import { Vector } from './Vector';
import { cos, lerp, sin } from './math';
import { getCurvePoints } from './curve-calc';

export const point = (x, y) => ({ x, y });
export const pointA = (x, y) => [x, y];

export const midPoint = (a, b) => Math.round((b - a) / 2) + a;

export const pointObjectToPointArray = (p) => [p.x, p.y];
export const pointArrayToPointObject = (a) => ({ x: a[0], y: a[1] });
export const pointArrayToVector = (a) => new Vector(a[0], a[1]);
export const vectorToPointArray = (v) => [v.x, v.y];
// [[x,y]] => [{x:x,y:y}]
export const arrayPointArrayToObjectArray = (arry) => arry.map((a) => pointArrayToPointObject(a));
// [[x,y]] => [Vector{x:x,y:y}]
export const arrayPointArrayToVectorArray = (arry) => arry.map((a) => pointArrayToVector(a));
export const arrayVectorToPointArray = (arry) => arry.map((a) => vectorToPointArray(a));

// [[x,y]] => [x1, y1,  x2, y2, ... xn, yn]
export const flattenPointArray = (arry) =>
    arry.reduce((acc, p) => {
        if (p) {
            acc.push(p[0]);
            acc.push(p[1]);
        }

        return acc;
    }, []);

// [x1, y1,  x2, y2, ... xn, yn] => [[x,y]]
export const unflattenPointArray = (arry) => {
    const points = [];
    for (let i = 0; i < arry.length; i += 2) {
        points.push([arry[i], arry[i + 1]]);
    }
    return points;
};

export const uvPointToCanvas = ({ margin = 0, u, v, width, height }) => ({
    x: lerp(margin, width - margin, u),
    y: lerp(margin, height - margin, v),
});

export const pointDistance = (pointA, pointB) => {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
};

export const midpoint = (pointA, pointB) => ({ x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 });

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

export const pointsOrientation = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);

export const pointsFromSegment = (seg) => {
    const points = [];
    for (let i = 0; i < seg.length; i++) {
        points.push([seg[i].start.x, seg[i].start.y]);
        points.push([seg[i].end.x, seg[i].end.y]);
    }
    return points;
};

export const trimPointArray = (points, skip = 2) =>
    points.reduce((acc, s, i) => {
        if (i === 0 || i === points.length - 1) {
            acc.push(s);
        } else if (i % skip === 0) {
            acc.push(s);
        }
        return acc;
    }, []);

export const createSplineFromPointArray = (points) => unflattenPointArray(getCurvePoints(flattenPointArray(points)));

// // For array of points from segments, take only the first start
// export const startPointsOnly = (points) => {
//     const p = [];
//     for (let i = 0; i < points.length; i += 2) {
//         p.push(points[i]);
//     }
//     // last end point
//     p.push(last(points));
//     return p;
// };
// Using https://github.com/gdenisov/cardinal-spline-js
