import { Vector } from './Vector';
import { pointDistance, pointsOrientation } from './points';

// https://www.xarg.org/2010/02/reduce-the-length-of-a-line-segment-by-a-certain-amount/
export const reduceLineFromStart = (p1, p2, r) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    return {
        x: p1.x + (r * dx) / mag,
        y: p1.y + (r * dy) / mag,
    };
};

export const reduceLineFromEnd = (p1, p2, r) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    return {
        x: p2.x - (r * dx) / mag,
        y: p2.y - (r * dy) / mag,
    };
};

export const reduceLineEqually = (p1, p2, r) => {
    const r2 = r / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    return [
        {
            x: p1.x + (r2 * dx) / mag,
            y: p1.y + (r2 * dy) / mag,
        },
        {
            x: p2.x - (r2 * dx) / mag,
            y: p2.y - (r2 * dy) / mag,
        },
    ];
};

export const lineSlope = (p1, p2) => (p2.y - p1.y) / (p2.x - p1.x);

// https://github.com/Jam3/chaikin-smooth/blob/master/index.js
export const chaikinSmooth = (input, itr = 1) => {
    if (itr === 0) return input;
    const output = [];

    for (let i = 0; i < input.length - 1; i++) {
        const p0 = input[i];
        const p1 = input[i + 1];
        const p0x = p0[0];
        const p0y = p0[1];
        const p1x = p1[0];
        const p1y = p1[1];

        const Q = [0.75 * p0x + 0.25 * p1x, 0.75 * p0y + 0.25 * p1y];
        const R = [0.25 * p0x + 0.75 * p1x, 0.25 * p0y + 0.75 * p1y];
        output.push(Q);
        output.push(R);
    }

    return itr === 1 ? output : chaikinSmooth(output, itr - 1);
};

// https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
// returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
export const linesIntersect = (a, b, c, d, p, q, r, s) => {
    const det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    }
    const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1;
};

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments Return FALSE if the lines don't getLineIntersectPoint
export const getLineIntersectPoint = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }

    // Return a object with the x and y coordinates of the intersection
    const x = x1 + ua * (x2 - x1);
    const y = y1 + ua * (y2 - y1);

    return { x, y };
};

// Menger curvature of a triple of points in n-dimensional Euclidean space Rn is the reciprocal of
// the radius of the circle that passes through the three points
export const mengerCurvature = (p1, p2, p3) => {
    // https://stackoverflow.com/questions/41144224/calculate-curvature-for-3-points-x-y
    // possible alternate https://www.mathsisfun.com/geometry/herons-formula.html
    const triangleArea2 = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

    const t4 = 2 * triangleArea2(p1, p2, p3);
    const la = pointDistance(p1, p2);
    const lb = pointDistance(p2, p3);
    const lc = pointDistance(p3, p1);
    return t4 / (la * lb * lc);
};

export const segment = (x1, y1, x2, y2) => {
    const start = new Vector(x1, y1);
    const end = new Vector(x2, y2);
    return { start, end };
};

export const segmentOrientation = ({ start, end }) => pointsOrientation(start, end);

export const segmentFromPoints = (points) => {
    const seg = [];
    for (let i = 0; i < points.length; i += 2) {
        // if it's an uneven number, dupe the last point
        const next = i + 1 === points.length ? i : i + 1;
        seg.push(segment(points[i][0], points[i][1], points[next][0], points[next][1]));
    }
    return seg;
};

export const segmentsIntersect = (a, b) =>
    linesIntersect(a.start.x, a.start.y, a.end.x, a.end.y, b.start.x, b.start.y, b.end.x, b.end.y);

// Remove every skip points from a segment to simplify
export const trimSegments = (segs, skip = 2) =>
    segs.reduce((acc, s, i) => {
        if (i === 0 || i === segs.length - 1) {
            acc.push(s);
        } else if (i % skip === 0) {
            acc.push(s);
        }
        return acc;
    }, []);

// export const connectSegments = (segs) =>
//     segs.map((s, i) => {
//         if (i === segs.length - 1) {
//             return s;
//         }
//         const next = segs[i + 1];
//
//         const distance = pointDistance({ x: s.end.x, y: s.end.y }, { x: next.start.x, y: s.start.y });
//         if (distance > 1) {
//             s.end = new Vector(next.start.x, next.start.y);
//         }
//         return s;
//     });

// For array of points from segments, return the mid point of the segment
// export const getSegPointsMid = (points) => {
//     const p = [];
//     for (let i = 0; i < points.length; i += 2) {
//         const s = points[i];
//         const e = points[i + 1];
//         if (e) {
//             const midX = s[0] + (e[0] - s[0]) * 0.5;
//             const midY = s[1] + (e[1] - s[1]) * 0.5;
//             p.push([midX, midY]);
//         } else {
//             p.push(s);
//         }
//     }
//     // last end point
//     p.push(last(points));
//     return p;
// };
