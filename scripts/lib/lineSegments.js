import { Vector } from './Vector';

export const lineSlope = (a, b) => (b.y - a.y) / (b.x - a.x);

export const segment = (x1, y1, x2, y2) => {
    const start = new Vector(x1, y1);
    const end = new Vector(x2, y2);
    return { start, end };
};

export const trimSegments = (segs, skip = 2) =>
    segs.reduce((acc, s, i) => {
        if (i === 0 || i === segs.length - 1) {
            acc.push(s);
        } else if (i % skip === 0) {
            acc.push(s);
        }
        return acc;
    }, []);

export const segmentOrientation = ({ start, end }) => Math.atan2(end.y - start.y, end.x - start.x);

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
export const a2pA = (arry) => arry.map((a) => a2p(a));

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
