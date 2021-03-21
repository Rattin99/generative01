import { Vector } from './Vector';
import { pointDistance } from './math';
import { getCurvePoints } from './curve-calc';
import { last } from './utils';

// https://stackoverflow.com/questions/41144224/calculate-curvature-for-3-points-x-y
// possible alternate https://www.mathsisfun.com/geometry/herons-formula.html
export const triangleArea2 = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

// Menger curvature of a triple of points in n-dimensional Euclidean space Rn is the reciprocal of
// the radius of the circle that passes through the three points
export const mCurvature = (p1, p2, p3) => {
    const t4 = 2 * triangleArea2(p1, p2, p3);
    const la = pointDistance(p1, p2);
    const lb = pointDistance(p2, p3);
    const lc = pointDistance(p3, p1);
    return t4 / (la * lb * lc);
};

export const lineSlope = (a, b) => (b.y - a.y) / (b.x - a.x);

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

export const segmentsIntersect = (a, b) =>
    linesIntersect(a.start.x, a.start.y, a.end.x, a.end.y, b.start.x, b.start.y, b.end.x, b.end.y);

export const segment = (x1, y1, x2, y2) => {
    const start = new Vector(x1, y1);
    const end = new Vector(x2, y2);
    return { start, end };
};

export const connectSegments = (segs) =>
    segs.map((s, i) => {
        if (i === segs.length - 1) {
            return s;
        }
        const next = segs[i + 1];

        const distance = pointDistance({ x: s.end.x, y: s.end.y }, { x: next.start.x, y: s.start.y });
        if (distance > 1) {
            s.end = new Vector(next.start.x, next.start.y);
        }
        return s;
    });

export const trimSegments = (segs, skip = 2) =>
    segs.reduce((acc, s, i) => {
        if (i === 0 || i === segs.length - 1) {
            acc.push(s);
        } else if (i % skip === 0) {
            acc.push(s);
        }
        return acc;
    }, []);

// For array of points from segments, take only the first start
export const startPointsOnly = (points) => {
    const p = [];
    for (let i = 0; i < points.length; i += 2) {
        p.push(points[i]);
    }
    // last end point
    p.push(last(points));
    return p;
};

// For array of points from segments, return the mid point of the segment
export const getSegPointsMid = (points) => {
    const p = [];
    for (let i = 0; i < points.length; i += 2) {
        const s = points[i];
        const e = points[i + 1];
        if (e) {
            const midX = s[0] + (e[0] - s[0]) * 0.5;
            const midY = s[1] + (e[1] - s[1]) * 0.5;
            p.push([midX, midY]);
        } else {
            p.push(s);
        }
    }
    // last end point
    p.push(last(points));
    return p;
};

export const trimPoints = (points, skip = 2) =>
    points.reduce((acc, s, i) => {
        if (i === 0 || i === points.length - 1) {
            acc.push(s);
        } else if (i % skip === 0) {
            acc.push(s);
        }
        return acc;
    }, []);

export const pointsOrientation = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
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

export const pointsFromSegment = (seg) => {
    const points = [];
    for (let i = 0; i < seg.length; i++) {
        points.push([seg[i].start.x, seg[i].start.y]);
        points.push([seg[i].end.x, seg[i].end.y]);
    }
    return points;
};

// [x,y] => {x:x,y:y}
export const a2p = (a) => ({ x: a[0], y: a[1] });
// [x,y] => Vector{x:x,y:y}
export const a2V = (a) => new Vector(a[0], a[1]);
export const v2a = (v) => [v.x, v.y];
// [[x,y]] => [{x:x,y:y}]
export const a2pA = (arry) => arry.map((a) => a2p(a));
// [[x,y]] => [Vector{x:x,y:y}]
export const pa2VA = (arry) => arry.map((a) => a2V(a));
export const va2pA = (arry) => arry.map((a) => v2a(a));

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

// Using https://github.com/gdenisov/cardinal-spline-js
export const createSplinePoints = (points) => {
    const fpoints = flattenPointArray(points);
    const curve = getCurvePoints(fpoints);
    return unflattenPointArray(curve);
};

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
