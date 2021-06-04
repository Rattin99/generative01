// https://github.com/gdenisov/cardinal-spline-js
// https://github.com/gdenisov/cardinal-spline-js/blob/master/src/curve_calc.js
/*!	Curve calc function for canvas 2.3.1
 *	Epistemex (c) 2013-2014
 *	License: MIT
 */

/**
 * Calculates an array containing points representing a cardinal spline through given point array.
 * Points must be arranged as: [x1, y1, x2, y2, ..., xn, yn].
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param {Array} points - point array
 * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
 * @param {Number} [numOfSeg=20] - number of segments between two points (line resolution)
 * @param {Boolean} [close=false] - Close the ends making the line continuous
 * @returns {Float32Array} New array with the calculated points that was added to the path
 */
export const getCurvePoints = (points, tension, numOfSeg, close) => {
    // options or defaults
    tension = typeof tension === 'number' ? tension : 0.5;
    numOfSeg = numOfSeg || 25;

    let pts; // for cloning point array
    let i = 1;
    let l = points.length;
    let rPos = 0;
    const rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0);

    if (rLen < 0) {
        return [];
    }

    const res = new Float32Array(rLen);
    const cache = new Float32Array((numOfSeg + 2) * 4);
    let cachePtr = 4;

    pts = points.slice(0);

    if (close) {
        pts.unshift(points[l - 1]); // insert end point as first point
        pts.unshift(points[l - 2]);
        pts.push(points[0], points[1]); // first point as last point
    } else {
        pts.unshift(points[1]); // copy 1. point and insert at beginning
        pts.unshift(points[0]);
        pts.push(points[l - 2], points[l - 1]); // duplicate end-points
    }

    // cache inner-loop calculations as they are based on t alone
    cache[0] = 1; // 1,0,0,0

    for (; i < numOfSeg; i++) {
        const st = i / numOfSeg;
        const st2 = st * st;
        const st3 = st2 * st;
        const st23 = st3 * 2;
        const st32 = st2 * 3;

        cache[cachePtr++] = st23 - st32 + 1; // c1
        cache[cachePtr++] = st32 - st23; // c2
        cache[cachePtr++] = st3 - 2 * st2 + st; // c3
        cache[cachePtr++] = st3 - st2; // c4
    }

    cache[++cachePtr] = 1; // 0,1,0,0

    // calc. points
    parse(pts, cache, l);

    if (close) {
        // l = points.length;
        pts = [];
        pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]); // second last and last
        pts.push(points[0], points[1], points[2], points[3]); // first and second
        parse(pts, cache, 4);
    }

    function parse(pts, cache, l) {
        for (var i = 2, t; i < l; i += 2) {
            const pt1 = pts[i];
            const pt2 = pts[i + 1];
            const pt3 = pts[i + 2];
            const pt4 = pts[i + 3];

            const t1x = (pt3 - pts[i - 2]) * tension;
            const t1y = (pt4 - pts[i - 1]) * tension;
            const t2x = (pts[i + 4] - pt1) * tension;
            const t2y = (pts[i + 5] - pt2) * tension;

            for (t = 0; t < numOfSeg; t++) {
                const c = t << 2; // t * 4;
                const c1 = cache[c];
                const c2 = cache[c + 1];
                const c3 = cache[c + 2];
                const c4 = cache[c + 3];

                res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
            }
        }
    }

    // add last point
    l = close ? 0 : points.length - 2;
    res[rPos++] = points[l];
    res[rPos] = points[l + 1];

    return res;
};
