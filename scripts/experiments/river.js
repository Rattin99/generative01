import tinycolor from 'tinycolor2';
import { uvFromAngle, randomNormalWholeBetween, chaikin, pointDistance, lerp, mapRange } from '../lib/math';
import { background, drawCircleFilled, drawLine } from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { bicPenBlue, palettes, warmGreyDark, warmWhite } from '../lib/palettes';
import { Vector } from '../lib/Vector';
import {
    segmentFromPoints,
    segmentOrientation,
    pointsFromSegment,
    reduceLineFromStart,
    reduceLineFromEnd,
    a2pA,
    reduceLineEqually,
    trimSegments,
    segmentsIntersect,
    connectSegments,
} from '../lib/lineSegments';
import { simplexNoise2d, simplexNoise3d, cliffordAttractor, jongAttractor, renderField } from '../lib/attractors';
import { bezierCurveFromPoints } from '../lib/canvas-shapes-complex';
import { defaultValue } from '../lib/utils';
import { createCirclePoints } from '../lib/grids';

/*
Based on
http://roberthodgin.com/project/meander

And Eric's copies - https://www.reddit.com/r/generative/comments/lfsl8t/pop_art_meandering_river/


Ref
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/shape/MeanderingRiver.kt
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/sketch/S23_MeanderClone.kt

Here's how he did it ...
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/shape/MeanderingRiver.kt#L102

Kotlin/Openrndr Vector 2
https://github.com/openrndr/openrndr/blob/master/openrndr-math/src/main/kotlin/org/openrndr/math/Vector2.kt
https://github.com/openrndr/openrndr/blob/master/openrndr-core/src/main/kotlin/org/openrndr/shape/Segment.kt
https://github.com/openrndr/openrndr/blob/master/openrndr-core/src/main/kotlin/org/openrndr/shape/LineSegment.kt
 */

// const simplex2d = (x, y) => simplexNoise2d(x, y, 0.001);
// const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
// const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
// const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);
// const noise = simplex2d;

const TAU = Math.PI * 2;

const createSimplePath = ({ width, height }, startX, startY, steps = 20) => {
    const coords = [];
    const incr = Math.round(width / steps);
    const midx = width / 2;
    for (let i = startX; i < width; i += incr) {
        // greater variation in the middle
        const midDist = Math.round(midx - Math.abs(i - midx));
        const y = randomNormalWholeBetween(startY - midDist, startY + midDist);

        coords.push([i, y]);
    }
    coords.push([width, startY]);
    return coords;
};

class River {
    constructor(starting, props) {
        this.maxHistory = 50;
        this.history = [];
        this.channelSegments = starting;
        this.oxbows = [];

        this.curveAdjacentSegments = defaultValue(props, 'curveAdjacentSegments', 10);
        this.segCurveMultiplier = defaultValue(props, 'segCurveMultiplier', 20);
        this.mixTangentRatio = defaultValue(props, 'mixTangentRatio', 0.6); // 0 tangent ... 1 bitangent
        this.mixMagnitude = defaultValue(props, 'mixMagnitude', 3);
        this.curveMagnitude = defaultValue(props, 'curveMagnitude', 40);
        this.insertionFactor = defaultValue(props, 'insertionFactor', 2); // insert more proints
        this.indexNearnessMetric = Math.ceil(this.curveAdjacentSegments * 1.5);
        this.pointRemoveProx = defaultValue(props, 'pointRemoveProx', this.curveMagnitude * 0.3);
        this.oxbowProx = this.curveMagnitude; // 25;
        this.oxbowShrinkRate = defaultValue(props, 'oxbowShrinkRate', 4);
        this.fixedEndPoints = defaultValue(props, 'fixedEndPoints', 1);
    }

    addToHistory(ox, channel) {
        this.history.unshift({ oxbows: ox, channel });
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(0, this.maxHistory);
        }
    }

    // get the difference in orientation between the segment and the next segment
    averageCurvature(segments) {
        const sum = segments.reduce((diffs, seg, i) => {
            const next = i + 1;
            if (next < segments.length) {
                const segO = segmentOrientation(seg);
                const nextO = segmentOrientation(segments[next]);
                const oDifference = segO - nextO;
                // diffs += oDifference;

                // when crossing the π/-π threshold, the difference will be large even though the angular difference is small.
                // We can adjust for this special case by adding 2π to the negative value
                if (Math.abs(oDifference) > Math.PI && nextO > 0) {
                    diffs += nextO - (segO + TAU);
                } else if (Math.abs(oDifference) > Math.PI && segO > 0) {
                    diffs += nextO + TAU - segO;
                } else {
                    diffs += oDifference;
                }
            }
            return diffs;
        }, 0);
        return sum / segments.length;
    }

    curvatureInfluence(seg, i, all) {
        const { start, end } = seg;

        const distToMid = Math.abs(all.length / 2 - i);
        const mag = this.mixMagnitude; // mapRange(0, all.length / 2, 1, this.mixMagnitude, distToMid);

        const min = i < this.curveAdjacentSegments ? 0 : i - this.curveAdjacentSegments;
        const max = i > all.length - this.curveAdjacentSegments ? all.length : i + this.curveAdjacentSegments;
        const curvature = this.averageCurvature(all.slice(min, max));
        const polarity = curvature < 0 ? 1 : -1;

        const tangent = end.sub(start);
        const biangle = tangent.angle() + 1.5708 * polarity;
        // const bitangent = uvFromAngle(biangle).setMag(tangent);
        const bitangent = uvFromAngle(biangle).setMag(Math.abs(curvature) * this.segCurveMultiplier);

        // tangent.normalized.mix(bitan.normalized, this.mixTangentRatio(segment.start)) * abs(curvature) * this.segCurveMultiplier(segment.start)
        // const mixed = tangent.normalize().mix(bitangent.normalize(), this.mixTangentRatio * seg.start.x).mag() * Math.abs(curvature) * this.segCurveMultiplier * seg.start.mag();

        const a = tangent.normalize();
        const b = bitangent.normalize(); // .setMag(Math.abs(curvature) * this.segCurveMultiplier);
        const m = a.mix(b, this.mixTangentRatio).setMag(mag);

        return {
            tangent: a,
            bitangent: b,
            mix: m,
            curvature,
        };
    }

    meander(segs) {
        // fix first and end so they don't move
        const firstFixedIndex = this.fixedEndPoints;
        const firstFixedPoints = segs.slice(0, firstFixedIndex);

        const lastFixedIndex = segs.length - this.fixedEndPoints - 1;
        const lastFixedPoints = segs.slice(lastFixedIndex, segs.length);

        const middleSegments = segs.slice(firstFixedIndex, lastFixedIndex);

        const adjustedMiddleSegments = middleSegments.map((seg, i) => {
            const values = this.curvatureInfluence(seg, i + firstFixedIndex, segs);
            seg.start = seg.start.add(values.mix);
            // for debug display
            seg.tangent = values.tangent;
            seg.bitangent = values.bitangent;
            seg.mix = values.mix;
            seg.curvature = values.curvature;
            return seg;
        });

        return firstFixedPoints.concat(adjustedMiddleSegments).concat(lastFixedPoints);
    }

    potentialOxbow(a, b, min) {
        return pointDistance({ x: a[0], y: a[1] }, { x: b[0], y: b[1] }) < min;
    }

    indicesAreNear(a, b, min) {
        return Math.abs(a - b) < min;
    }

    addOxbow(i, j) {
        // cut segments corresponding to points at i to j
        const s = Math.floor(i / 2);
        const s2 = Math.ceil(j / 2);
        const segs = this.channelSegments.slice(s, s2);
        this.oxbows.push(segs);
    }

    joinMeanders(points) {
        const line = [];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            line.push(point);
            for (let j = i; j < points.length; j++) {
                const next = points[j];
                // if points are proximate, we should cut the interim pieces into an oxbow, UNLESS the indices are very close
                if (
                    this.potentialOxbow(point, next, this.oxbowProx) &&
                    !this.indicesAreNear(i, j, this.indexNearnessMetric)
                ) {
                    line.push(next);
                    this.addOxbow(i, j);
                    i = j;
                }
            }
        }
        return line;
    }

    // As points move (and others do not), the relative spacing of segments may become unbalanced.
    // On each iteration, check all segments and remove if they are too close together, or add if they are too far apart
    adjustSpacing(points) {
        return points.reduce((acc, point, i) => {
            if (i === 0 || i === points.length - 1) {
                acc.push(point);
                return acc;
            }

            const next = points[i + 1];
            const distance = pointDistance({ x: point[0], y: point[1] }, { x: next[0], y: next[1] });

            if (distance > this.curveMagnitude) {
                // ensure that for points with large distances between, an appropriate number of midpoints are added
                const numInsertPoints = Math.floor(distance / this.curveMagnitude) * this.insertionFactor + 1;
                for (let k = 0; k < numInsertPoints; k++) {
                    const ratio = (1 / numInsertPoints) * k;
                    const nx = lerp(point[0], next[0], ratio);
                    const ny = lerp(point[1], next[1], ratio);
                    acc.push([nx, ny]);
                }
            } else if (distance < this.pointRemoveProx) {
                // If too close, remove it
            } else {
                acc.push(point);
            }
            return acc;
        }, []);
    }

    shrinkOxbows(oxarry) {
        return oxarry.reduce((oxacc, oseg) => {
            if (oseg.length > 1) {
                const shrinkPct = this.oxbowShrinkRate / oseg.length;

                oseg = oseg.reduce((sacc, s, i) => {
                    // check every channel segment for an intersection with this oxbow segment
                    const intersect = this.channelSegments.reduce((acc, cs) => {
                        if (!acc) {
                            acc = segmentsIntersect(cs, s);
                        }
                        return acc;
                    }, false);

                    if (!intersect) {
                        // shrink the first and last line in the segment
                        if (i === 0) {
                            const r = reduceLineFromStart(s.start, s.end, shrinkPct);
                            s.start = new Vector(r.x, r.y);
                        } else if (i === oseg.length - 1) {
                            const r = reduceLineFromEnd(s.start, s.end, shrinkPct);
                            s.end = new Vector(r.x, r.y);
                        } else {
                            const r = reduceLineEqually(s.start, s.end, 0.01);
                            s.start = new Vector(r[0].x, r[0].y);
                            s.end = new Vector(r[1].x, r[1].y);
                        }

                        // remove if it's too small
                        if (pointDistance(s.start, s.end) > 1) {
                            sacc.push(s);
                        }
                    }

                    return sacc;
                }, []);

                oxacc.push(oseg);
            }
            return oxacc;
        }, []);
    }

    // this.channelSegments and oxbow are global
    run(debug = false) {
        this.channelSegments = this.meander(this.channelSegments);
        let points = pointsFromSegment(this.channelSegments);
        points = this.joinMeanders(points);
        points = this.adjustSpacing(points);
        this.channelSegments = segmentFromPoints(points);
        this.oxbows = this.shrinkOxbows(this.oxbows);
        this.addToHistory(this.oxbows, this.channelSegments);
        return points;
    }
}

export const river = () => {
    const config = {
        name: 'river',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let ctx;
    let canvasMidX;
    let canvasMidY;

    const backgroundColor = warmWhite;

    const river = [];

    let time = 0;

    const debugDrawVectors = (segments) => {
        const tmult = 50;
        const bmult = 50;
        const mmult = 20;
        const cmult = 50;
        const tan = 'red';
        const bitan = 'blue';
        const mx = 'purple';

        segments.forEach((seg, i) => {
            if (seg.hasOwnProperty('tangent') && seg.hasOwnProperty('bitangent') && seg.hasOwnProperty('mix')) {
                const { x } = seg.start;
                const { y } = seg.start;
                const { tangent, bitangent, mix, curvature } = seg;

                const utan = tangent.setMag(1);
                const ubitan = bitangent.setMag(1);
                const umix = bitangent.setMag(1);
                const ucurve = uvFromAngle(curvature);
                console.log(ucurve);

                // ctx.strokeStyle = tinycolor(tan).toRgbString();
                // drawLine(ctx)(x, y, x + utan.x * tmult, y + utan.y * tmult, 0.25);
                //
                // ctx.strokeStyle = tinycolor(bitan).toRgbString();
                // drawLine(ctx)(x, y, x + ubitan.x * bmult, y + ubitan.y * bmult, 0.25);
                //
                ctx.strokeStyle = tinycolor(mx).toRgbString();
                drawLine(ctx)(x, y, x + mix.x * mmult, y + mix.y * mmult, 0.5);

                // ctx.strokeStyle = tinycolor(mx).toRgbString();
                // drawLine(ctx)(x, y, x + ucurve.x * cmult, y + ucurve.y * cmult, 0.5);
            }
        });
    };

    const drawSegment = (segments, color, weight, points = false) => {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = tinycolor(color).clone().toRgbString();
        ctx.lineWidth = weight;
        ctx.beginPath();
        segments.forEach((seg, i) => {
            if (i === 0) {
                ctx.moveTo(seg.start.x, seg.start.y);
            } else {
                ctx.lineTo(seg.start.x, seg.start.y);
            }
            ctx.lineTo(seg.end.x, seg.end.y);
        });
        ctx.stroke();
        if (points) {
            segments.forEach((seg, i) => {
                const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
                drawCircleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
                drawCircleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
            });
        }
    };

    const drawSegmentTaper = (segments, color, maxWeight, minWeight = 1, points = false) => {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = tinycolor(color).clone().toRgbString();

        const mid = segments.length / 2;

        segments.forEach((seg, i) => {
            const dist = Math.abs(mid - i);
            const w = mapRange(0, mid, maxWeight, minWeight, dist);

            ctx.beginPath();
            ctx.lineWidth = w;
            if (i === 0) {
                ctx.moveTo(seg.start.x, seg.start.y);
            } else {
                ctx.lineTo(seg.start.x, seg.start.y);
            }
            ctx.lineTo(seg.end.x, seg.end.y);
            ctx.stroke();
        });

        if (points) {
            segments.forEach((seg, i) => {
                const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
                drawCircleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
                drawCircleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
            });
        }
    };

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        background(canvas, context)(backgroundColor);
        const channelSegments = segmentFromPoints(createSimplePath(canvas, 0, canvasMidY, 30));
        river.push(new River(channelSegments, { mixTangentRatio: 0.5 }));

        // const circleSegments = segmentFromPoints(createCirclePoints(canvasMidX, canvasMidY, canvasMidX, 30));
        // river.push(new River(circleSegments, { mixTangentRatio: 0.5, fixedEndPoints: 0 }));
    };

    const drawOxbows = (bows, color, weight, smooth = 2) => {
        bows.forEach((o) => {
            const a = mapRange(0, 10, 0, 1, o.length);
            const w = mapRange(0, 10, 1, weight, o.length);
            const oxpoints = chaikin(pointsFromSegment(o), smooth);
            const oxsegments = segmentFromPoints(oxpoints);
            // drawSegment(segmentFromPoints(oxpoints), color.setAlpha(a), w, false);
            drawSegmentTaper(connectSegments(oxsegments), color, w);
        });
    };

    const drawMainChannel = (points, color, weight, smooth = 2) => {
        const seg = segmentFromPoints(chaikin(points, smooth));
        drawSegmentTaper(trimSegments(seg, 5), color, weight, weight * 0.5);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor.clone().setAlpha(1));

        const riverColor = bicPenBlue;
        const riverWeight = 30;
        const oxbowColor = warmGreyDark.clone().brighten(50);
        const oxbowWeight = 30;

        river.forEach((r) => {
            const points = r.run();
            drawOxbows(r.oxbows, oxbowColor, oxbowWeight);
            // drawMainChannel(points, backgroundColor, riverWeight * 2);
            drawMainChannel(points, riverColor, riverWeight, 5);

            // for (let i = r.history.length - 1; i >= 0; i--) {
            //     const b = mapRange(r.history.length, 0, 50, 10, i);
            //     const ccolor = i == 0 ? riverColor : warmGreyDark.clone().brighten(b);
            //     const ocolor = i == 0 ? oxbowColor : warmGreyDark.clone().brighten(b / 2);
            //
            //     drawOxbows(r.history[i].oxbows, ccolor, oxbowWeight);
            //
            //     drawMainChannel(pointsFromSegment(r.history[i].channel), ccolor, riverWeight);
            // }
        });

        time += 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
