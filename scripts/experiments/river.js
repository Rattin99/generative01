import tinycolor from 'tinycolor2';
import random from 'canvas-sketch-util/random';
import { uvFromAngle, randomNormalWholeBetween, chaikin, pointDistance, lerp } from '../lib/math';
import { background, drawLine } from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { bicPenBlue, palettes, warmWhite } from '../lib/palettes';
import { Vector } from '../lib/Vector';
import { simplexNoise2d, simplexNoise3d, cliffordAttractor, jongAttractor, renderField } from '../lib/attractors';

/*
Based on
http://roberthodgin.com/project/meander

And Eric's copies - https://www.reddit.com/r/generative/comments/lfsl8t/pop_art_meandering_river/


Ref
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/shape/MeanderingRiver.kt
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/sketch/S23_MeanderClone.kt

Here's how he did it ...
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/shape/MeanderingRiver.kt#L102
 */

const simplex2d = (x, y) => simplexNoise2d(x, y, 0.001);
const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);
const noise = simplex2d;

const segment = (x1, y1, x2, y2) => {
    const start = new Vector(x1, y1);
    const end = new Vector(x2, y2);
    return { start, end };
};

const segmentOrientation = ({ start, end }) => Math.atan2(end.y - start.y, end.x - start.x);

const segmentFromPoints = (points) => {
    const seg = [];
    for (let i = 0; i < points.length; i += 2) {
        // if it's an uneven number, dupe the last point
        const next = i + 1 === points.length ? i : i + 1;
        seg.push(segment(points[i][0], points[i][1], points[next][0], points[next][1]));
    }
    return seg;
};

const pointsFromSegment = (seg) => {
    const points = [];
    for (let i = 0; i < seg.length; i++) {
        points.push([seg[i].start.x, seg[i].start.y]);
        points.push([seg[i].end.x, seg[i].end.y]);
    }
    return points;
};

export const river = () => {
    const config = {
        name: 'river',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let channelSegments = [];
    const oxbows = [];

    let ctx;
    let canvasMidX;
    let canvasMidY;
    const backgroundColor = warmWhite;
    const riverColor = bicPenBlue;

    // The length of the meander influence vector
    const meanderStrength = 50;
    // The number of adjacent segments to evaluate when determining the curvature at a point in a contour
    const curvatureScale = 10;
    // Should always return in range [0.0, 1.0], where 1.0 is full bitangent influence, 0.0 is full tangent influence, and 0.5 is a perfect mix
    const tangentBitangentRatio = 0.5;
    // chaikin smoothness itterations
    const smoothness = 1;
    // Larger curveMagnitude will make the meanders larger
    const curveMagnitude = 3; // 2.5

    const oxbowShrinkRate = 10;
    const indexNearnessMetric = Math.ceil(curvatureScale * 1.5);
    const oxbowNearnessMetric = 20;

    let time = 0;

    const createSimplePath = ({ width, height }, startX, startY, steps = 20) => {
        const coords = [];
        const incr = Math.round(width / steps);
        const midx = width / 2;
        for (let i = startX; i < width; i += incr) {
            // Add a bulge in the middle
            const midDist = Math.round((midx - Math.abs(i - midx)) * 3);
            const y = randomNormalWholeBetween(startY - midDist, startY + midDist);

            coords.push([i, y]);
        }
        coords.push([width, startY]);
        return coords;
    };

    const debugDrawVectors = (segments) => {
        const tmult = 50;
        const bmult = 50;
        const mmult = 50;
        const tan = 'red';
        const bitan = 'blue';
        const mx = 'purple';

        segments.forEach((seg, i) => {
            if (seg.hasOwnProperty('tangent') && seg.hasOwnProperty('bitangent') && seg.hasOwnProperty('mix')) {
                const { x } = seg.start;
                const { y } = seg.start;
                const { tangent, bitangent, mix } = seg;

                const utan = tangent.setMag(1);
                const ubitan = bitangent.setMag(1);
                const umix = bitangent.setMag(1);

                ctx.strokeStyle = tinycolor(tan).toRgbString();
                drawLine(ctx)(x, y, x + utan.x * tmult, y + utan.y * tmult, 0.25);

                ctx.strokeStyle = tinycolor(bitan).toRgbString();
                drawLine(ctx)(x, y, x + ubitan.x * bmult, y + ubitan.y * bmult, 0.25);

                ctx.strokeStyle = tinycolor(mx).toRgbString();
                drawLine(ctx)(x, y, x + mix.x * mmult, y + mix.y * mmult, 1);
            }
        });
    };

    const drawChannelSegments = (segments, color) => {
        ctx.beginPath();

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        segments.forEach((seg, i) => {
            if (i === 0) {
                ctx.moveTo(seg.start.x, seg.start.y);
            } else {
                ctx.lineTo(seg.start.x, seg.start.y);
            }
            ctx.lineTo(seg.end.x, seg.end.y);
        });

        ctx.strokeStyle = color.toRgbString();
        ctx.lineWidth = 20;
        ctx.stroke();
    };

    const smooth = (points) => chaikin(points, smoothness);

    const averageCurvature = (segments) => {
        const sum = segments.reduce((diffs, seg, i) => {
            const next = i + 1;
            if (next < segments.length) {
                const o = segmentOrientation(seg);
                const nextO = segmentOrientation(segments[next]);
                const cdiff = o - nextO;
                if (Math.abs(cdiff) > Math.PI && nextO > 0) {
                    diffs += nextO - (o + 2 * Math.PI);
                } else if (Math.abs(cdiff) > Math.PI && o > 0) {
                    diffs += nextO + 2 * Math.PI - o;
                } else {
                    diffs += cdiff;
                }
            }
            return diffs;
        }, 0);
        return sum / segments.length;
    };

    const influence = (seg, i, all) => {
        const { start, end } = seg;

        const min = i < curvatureScale ? 0 : i - curvatureScale;
        const max = i > all.length - curvatureScale ? all.length : i + curvatureScale;
        const curvature = averageCurvature(all.slice(min, max));
        const polarity = curvature < 0 ? 1 : -1;

        const tangent = end.sub(start);

        const biangle = tangent.angle() + 1.5708 * polarity; // 90 deg in rad
        const bitangent = uvFromAngle(biangle).setMag(Math.abs(curvature) * meanderStrength);

        const a = tangent.normalize();
        const b = bitangent.normalize();
        const m = a.mix(b, tangentBitangentRatio); // .setMag(Math.abs(curvature) * meanderStrength);

        return {
            tangent: a,
            bitangent: b,
            mix: m,
        };
    };

    const meander = (seg) => {
        const firstFixedIndex = Math.round(seg.length * 0.05);
        const lastFixedIndex = Math.round(seg.length * 0.95);
        const firstFixedPoints = seg.slice(0, firstFixedIndex);
        const lastFixedPoints = seg.slice(lastFixedIndex, seg.length); // .map { it.start } + segments.last().end
        const middleSegments = seg.slice(firstFixedIndex, lastFixedIndex);

        const adjustedMiddleSegments = middleSegments.map((seg, i) => {
            const values = influence(seg, i + firstFixedIndex, middleSegments);
            seg.start = seg.start.add(values.mix);
            // seg.end = seg.start.add(values.mix);
            return seg;
        });

        return firstFixedPoints.concat(adjustedMiddleSegments).concat(lastFixedPoints);
    };

    const potentialOxbow = (a, b, min) => pointDistance({ x: a[0], y: a[1] }, { x: b[0], y: b[1] }) < min;
    const indicesAreNear = (a, b, min) => Math.abs(a - b) < indexNearnessMetric;
    const addOxbow = (i, j) => {
        // cut segments corresponding to points at i to j
        // oxbows.push()
    };

    const joinMeanders = (points) => {
        const line = [];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            line.push(point);

            // We only need to compare to the points "in front of" our current point -- we'll never join backwards
            for (let j = i; j < points.length; j++) {
                const other = points[j];

                // check for proximity:
                // if points are proximate, we should cut the interim pieces into an oxbow, UNLESS the indices are very close
                // if (potentialOxbow(point, other) && !indicesAreNear(i, j)) {
                if (potentialOxbow(point, other, oxbowNearnessMetric) && !indicesAreNear(i, j)) {
                    line.push(other);
                    addOxbow(i, j);
                    // i will be incremented again below, but that's OK since we already added `points[j]` (a.k.a. `other`)
                    i = j;
                }
            }
        }

        return line;
    };

    const adjustSpacing = (points) =>
        points.reduce((acc, point, i) => {
            if (i === 0 || i === points.length - 1) {
                acc.push(point);
                return acc;
            }

            const next = points[i + 1];
            const targetDist = curveMagnitude;
            const distance = pointDistance({ x: point[0], y: point[1] }, { x: next[0], y: next[1] });

            // If too far apart, add a midpoint
            // If too close, skip current point
            // If neither too close nor too far, add the point normally
            if (distance > targetDist) {
                // ensure that for points with large distances between, an appropriate number of midpoints are added
                const nMidpointsNeeded = Math.round(distance / targetDist) + 1;
                for (let i = 0; i < nMidpointsNeeded; i++) {
                    const ratio = (1 / nMidpointsNeeded) * i;
                    const nx = lerp(point[0], next[0], ratio);
                    const ny = lerp(point[1], next[1], ratio);
                    acc.push([nx, ny]);
                }
            } else if (distance < targetDist * 0.3) {
                // remove it
            } else {
                acc.push(point);
            }
            return acc;
        }, []);

    const shrinkOxbows = () => false;

    const influenceVectors = (segments, showEvery = 1) =>
        segments.reduce((acc, seg, i) => {
            if (i % showEvery === 0) {
                const values = influence(seg, i, segments);
                seg.end = seg.start.add(values.mix);
                acc.push(seg);
            }
            return acc;
        }, []);

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;

        background(canvas, context)(backgroundColor);

        let points = createSimplePath(canvas, 0, canvasMidY, 20);
        points = chaikin(points, 2);
        channelSegments = segmentFromPoints(points);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor.clone().setAlpha(0.01));

        channelSegments = meander(channelSegments);
        // debugDrawVectors(channelSegments);

        let points = pointsFromSegment(channelSegments);
        // points = chaikin(points, 1);
        points = joinMeanders(points);
        points = adjustSpacing(points);
        // points = chaikin(points, 1);

        channelSegments = segmentFromPoints(points);

        // channelSegments = influenceVectors(channelSegments, 2).map(
        //     (seg) =>
        //         // seg.start = seg.start.mult(1.5);
        //         // seg.end = seg.end.mult(1.5);
        //         seg
        // );

        drawChannelSegments(channelSegments, riverColor);
        if (time === 500) {
            console.log('DONE');
            return -1;
        }

        time += 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
