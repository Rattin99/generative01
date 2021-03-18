import tinycolor from 'tinycolor2';
import random from 'canvas-sketch-util/random';
import { uvFromAngle, chaikin, randomNormalWholeBetween } from '../lib/math';
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
    const tangentBitangentRatio = 0.55;
    // chaikin smoothness itterations
    const smoothness = 1;

    // Larger curveMagnitude will make the meanders larger
    const curveMagnitude = 2.5;

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
            const midDist = Math.round((midx - Math.abs(i - midx)) * 0.5);
            const y = randomNormalWholeBetween(startY - midDist, startY + midDist);
            coords.push([i, y]);
        }
        coords.push([width, startY]);
        return coords;
    };

    const debugDrawPointVectors = (path, color) => {
        const tmult = 30;
        const bmult = 30;
        const tan = 'purple';
        const bitan = 'green';

        path.forEach((point, i) => {
            const { x, y, tangent, bitangent } = point;

            ctx.strokeStyle = tinycolor(tan).toRgbString();
            drawLine(ctx)(x, y, x + tangent.x * tmult, y + tangent.y * tmult, 1);

            ctx.strokeStyle = tinycolor(bitan).toRgbString();
            drawLine(ctx)(x, y, x + bitangent.x * bmult, y + bitangent.y * bmult, 1);
        });
    };

    const drawChannel = (path, color) => {
        ctx.beginPath();

        path.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point[0], point[1]);
            } else {
                ctx.lineTo(point[0], point[1]);
            }
        });

        ctx.strokeStyle = color.toRgbString();
        ctx.lineWidth = 10;
        ctx.stroke();
    };

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;

        background(canvas, context)(backgroundColor);

        // create a line and distort points on a flow field
        // steps need to produce an even number of points
        const points = createSimplePath(canvas, 0, canvasMidY, 60);
        channelSegments = segmentFromPoints(points);
    };

    const averageCurvature = (segments) => {
        const sum = segments.reduce((diffs, seg, i) => {
            const next = i + 1;
            if (next < segments.length) {
                const { start, end } = seg;
                const orientation = Math.atan2(end.y - start.y, end.x - start.x);
                const o = seg.orientation;
                const nextO = segments[next].orientation;
                const cdiff = seg.orientation - nextO;
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

    const influence = (segment, i, all) => {
        const { start, end } = segment;

        const min = i < curvatureScale ? 0 : i - curvatureScale;
        const max = i > all.length - curvatureScale ? all.length : i + curvatureScale;
        const curvature = averageCurvature(all.slice(min, max));
        const polarity = curvature < 0 ? 1 : -1;

        const tangent = end.sub(start);

        const biangle = tangent.angle() + 1.5708 * polarity; // 90 deg in rad
        const bitangent = uvFromAngle(biangle).setMag(tangent.mag());

        segment.tangent = tangent;
        segment.bitangent = bitangent;

        // console.log(tangent.angle(), bitangent.angle());

        /*
        tangent.normalized.mix(bitan.normalized, tangentBitangentRatio(segment.start))
        * abs(curvature)
        * meanderStrength(segment.start)
         */

        // what does Vector2 return when you call it? getter? x,y, or length?

        // console.log(
        //     tangent.normalize().mix(bitangent.normalize(), segment.start.x).length()) *
        //         Math.abs(curvature) *
        //         segment.start.x
        // );

        return segment;
    };

    const smooth = (points) => chaikin(points, smoothness);

    const meander = (seg) => {
        const firstFixedIndex = Math.round(seg.length * 0.05);
        const lastFixedIndex = Math.round(seg.length * 0.85);
        const firstFixedPoints = seg.slice(0, firstFixedIndex);
        const lastFixedPoints = seg.slice(lastFixedIndex, seg.length);
        let middleSegments = seg.slice(firstFixedIndex, lastFixedIndex);

        middleSegments = middleSegments.map(influence);

        return firstFixedPoints.concat(middleSegments).concat(lastFixedPoints);
    };

    const updateChannel = (points) =>
        points.map((point, i) => {
            // let { x, y, tangent, bitangent } = point;
            //
            // // How should these be merged? Not just added
            // const merged = tangent.add(tangent).add(bitangent);
            //
            // if (i !== 0 && i !== points.length - 1) {
            //     x += merged.x;
            //     y += merged.y;
            // }
            // return tPoint(x, y, merged);
        });

    /*
    Using the tangent and modified bitangent, we create a new vector that is a blend of the two. This new vector is
    added to the position of each point on the curve. With this basic logic, the bends in the channel form organically.
    The style of the bends can be influenced by adjusting the overall influence of these two vectors individually, and
    the intensity of the bends can be adjusted by increasing the scale of the final blended vector.
     */
    /*
   var polyline = meander(channel.segments)
   polyline = smooth(polyline)
   polyline = joinMeanders(polyline)
   polyline = adjustSpacing(polyline)
   polyline = smooth(polyline)
   channel = ShapeContour.fromPoints(polyline, closed = false)
   shrinkOxbows()
    */

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor.clone().setAlpha(0.75));

        channelSegments = meander(channelSegments);
        const points = pointsFromSegment(channelSegments);
        // points = smooth(points);

        drawChannel(points, riverColor);
        channelSegments = segmentFromPoints(points);
        // if (time === 0) debugDrawPointVectors(context)(channel);
        // debugDrawPointVectors(context)(channel);
        // channel = updateChannel(channel);
        // segmentFromTPoints(channel);

        if (time === 0) {
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
