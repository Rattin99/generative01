import tinycolor from 'tinycolor2';
import { uvFromAngle, randomNormalWholeBetween, chaikin, pointDistance, lerp, mapRange } from '../lib/math';
import { background, drawCircleFilled, drawLine } from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { bicPenBlue, warmGreyDark, warmWhite } from '../lib/palettes';
import { Vector } from '../lib/Vector';
import {
    segmentFromPoints,
    segmentOrientation,
    pointsFromSegment,
    reduceLineFromStart,
    reduceLineFromEnd,
    reduceLineEqually,
    segmentsIntersect,
    createSplinePoints,
    getSegPointsMid,
} from '../lib/lineSegments';
import { simplexNoise2d, simplexNoise3d, cliffordAttractor, jongAttractor, renderField } from '../lib/attractors';
import { defaultValue } from '../lib/utils';

/*
Based on Meander by Roger Hodgin
http://roberthodgin.com/project/meander

And Eric's recreations
https://www.reddit.com/r/generative/comments/lfsl8t/pop_art_meandering_river/
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/shape/MeanderingRiver.kt
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/sketch/S23_MeanderClone.kt

Kotlin/Openrndr Vector 2
https://github.com/openrndr/openrndr/blob/master/openrndr-math/src/main/kotlin/org/openrndr/math/Vector2.kt
https://github.com/openrndr/openrndr/blob/master/openrndr-core/src/main/kotlin/org/openrndr/shape/Segment.kt
https://github.com/openrndr/openrndr/blob/master/openrndr-core/src/main/kotlin/org/openrndr/shape/LineSegment.kt

TODO
- [ ] BUG - chaikin smooth points causes line to be all removed
- [ ] Jitter!
- [ ] reduce all oxbow segments not just ends
        > reduction closer to end
- [ ]  Better use noise function to simulate spread in certain areas?
        Roger's is straight on flat, and meanders > on hilly
- [ ] Random starting line on a noise path

 */

const TAU = Math.PI * 2;

class River {
    constructor(starting, props) {
        this.steps = 0;
        this.maxHistory = defaultValue(props, 'maxHistory', 10);
        this.storeHistoryEvery = defaultValue(props, 'storeHistoryEvery', 2);
        this.history = [];
        this.channelSegments = starting;
        this.channelPoints = undefined;
        this.oxbows = [];

        this.curveAdjacentSegments = defaultValue(props, 'curveAdjacentSegments', 10);
        this.segCurveMultiplier = defaultValue(props, 'segCurveMultiplier', 20);
        this.mixTangentRatio = defaultValue(props, 'mixTangentRatio', 0.6); // 0 tangent ... 1 bitangent
        this.mixMagnitude = defaultValue(props, 'mixMagnitude', 3);
        this.curveMagnitude = defaultValue(props, 'curveMagnitude', 40);
        this.insertionFactor = defaultValue(props, 'insertionFactor', 2); // insert more proints
        this.indexNearnessMetric = Math.ceil(this.curveAdjacentSegments * 1.5);
        this.pointRemoveProx = defaultValue(props, 'pointRemoveProx', this.curveMagnitude * 0.3);
        this.oxbowProx = defaultValue(props, 'oxbowProx', this.curveMagnitude);
        this.oxbowShrinkRate = defaultValue(props, 'oxbowShrinkRate', 4);
        this.fixedEndPoints = defaultValue(props, 'fixedEndPoints', 1);

        this.noiseFn = defaultValue(props, 'noiseFn', undefined);
        this.noiseStrengthAffect = defaultValue(props, 'noiseStrengthAffect', 0); // only noise theta > will cause drift
        this.mixNoiseRatio = defaultValue(props, 'mixNoiseRatio', 0.1);
    }

    addToHistory(ox, channel) {
        if (this.steps % this.storeHistoryEvery === 0) {
            this.history.unshift({ oxbows: ox, channel });
            if (this.history.length > this.maxHistory) {
                this.history = this.history.slice(0, this.maxHistory);
            }
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

        // testing increasing mag if closer to center
        // const distToMid = Math.abs(all.length / 2 - i);
        const mag = this.mixMagnitude; // mapRange(0, all.length / 2, 1, this.mixMagnitude, distToMid);

        const min = i < this.curveAdjacentSegments ? 0 : i - this.curveAdjacentSegments;
        const max = i > all.length - this.curveAdjacentSegments ? all.length : i + this.curveAdjacentSegments;
        const curvature = this.averageCurvature(all.slice(min, max));
        const polarity = curvature < 0 ? 1 : -1;

        const tangent = end.sub(start);
        const biangle = tangent.angle() + 1.5708 * polarity;
        const bitangent = uvFromAngle(biangle).setMag(Math.abs(curvature) * this.segCurveMultiplier);

        const a = tangent.normalize();
        const b = bitangent.normalize();
        let mVector = a.mix(b, this.mixTangentRatio);

        if (this.noiseFn) {
            const t = this.noiseFn(start.x, start.y);
            if (Math.abs(t) > this.noiseStrengthAffect) {
                const n = uvFromAngle(t);
                mVector = mVector.mix(n, this.mixNoiseRatio);
            }
        }

        mVector = mVector.setMag(mag);

        return mVector;
    }

    meander(segs) {
        // lock first and end segments so they aren't affected
        const firstFixedIndex = this.fixedEndPoints;
        const firstFixedPoints = segs.slice(0, firstFixedIndex);
        const lastFixedIndex = segs.length - this.fixedEndPoints - 1;
        const lastFixedPoints = segs.slice(lastFixedIndex, segs.length);

        const middleSegments = segs.slice(firstFixedIndex, lastFixedIndex);

        const adjustedMiddleSegments = middleSegments.map((seg, i) => {
            const mVector = this.curvatureInfluence(seg, i + firstFixedIndex, segs);
            seg.start = seg.start.add(mVector);
            // trying to smooth out the jitter by moving end point as well
            // seg.end = seg.end.add(mVector.div(4));
            return seg;
        });

        return firstFixedPoints.concat(adjustedMiddleSegments).concat(lastFixedPoints);
    }

    addOxbow(i, j) {
        // cut segments corresponding to points at i to j
        const s = Math.floor(i / 2);
        const s2 = Math.ceil(j / 2);
        const segs = this.channelSegments.slice(s, s2);
        this.oxbows.push(segs);
    }

    closeCloseSegments(points) {
        const potentialOxbow = (a, b, min) => pointDistance({ x: a[0], y: a[1] }, { x: b[0], y: b[1] }) < min;
        const indicesAreNear = (a, b, min) => Math.abs(a - b) < min;

        const line = [];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            line.push(point);
            for (let j = i; j < points.length; j++) {
                const next = points[j];
                // if points are proximate, we should cut the interim pieces into an oxbow, UNLESS the indices are very close
                if (potentialOxbow(point, next, this.oxbowProx) && !indicesAreNear(i, j, this.indexNearnessMetric)) {
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
    adjustPointsSpacing(points) {
        return points.reduce((acc, point, i) => {
            if (i === 0 || i === points.length - 1) {
                acc.push(point);
                return acc;
            }

            const next = points[i + 1];
            const distance = pointDistance({ x: point[0], y: point[1] }, { x: next[0], y: next[1] });

            if (distance > this.curveMagnitude) {
                // ensure that for points with large distances between, an appropriate number of midpoints are added
                const numInsertPoints = Math.ceil(distance / this.curveMagnitude) * this.insertionFactor + 1;
                for (let k = 0; k < numInsertPoints; k++) {
                    const ratio = (1 / numInsertPoints) * k;
                    const nx = lerp(point[0], next[0], ratio);
                    const ny = lerp(point[1], next[1], ratio);
                    acc.push([nx, ny]);
                }
            } else if (
                i > this.fixedEndPoints &&
                i < points.length - this.fixedEndPoints &&
                distance < this.pointRemoveProx
            ) {
                // If too close, remove it
            } else {
                acc.push(point);
            }
            return acc;
        }, []);
    }

    shrinkOxbowSegments(oxarry) {
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

    step() {
        // influence segments to sim flow
        this.channelSegments = this.meander(this.channelSegments);
        // convert to array of points
        let points = pointsFromSegment(this.channelSegments);
        // cut off portions that are close and create and oxbow
        points = this.closeCloseSegments(points);
        // cut points that are close and add new points where they are far apart
        points = this.adjustPointsSpacing(points);
        this.channelPoints = points;
        // back to a segment to
        this.channelSegments = segmentFromPoints(this.channelPoints);
        // reduce the size of the oxbows
        this.oxbows = this.shrinkOxbowSegments(this.oxbows);
        // record for a "historical" record
        this.addToHistory(this.oxbows, this.channelSegments);

        this.steps++;
    }
}

const createHorizontalPath = ({ width, height }, startX, startY, steps = 20) => {
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

export const river = () => {
    const config = {
        name: 'river',
        ratio: ratio.poster,
        scale: scale.standard,
    };

    let ctx;
    let canvasMidX;
    let canvasMidY;
    // const backgroundColor = warmWhite;
    const rivers = [];
    let time = 0;

    // colors sampled from http://roberthodgin.com/project/meander
    const backgroundColor = tinycolor('hsl(42, 43%, 76%)');
    const tintingColor = tinycolor('hsl(38, 38%, 64%)');
    const palette = [
        tinycolor('hsl(97, 9%, 73%)'),
        tinycolor('hsl(51, 7%, 38%)'),
        tinycolor('hsl(19, 39%, 47%)'),
        tinycolor('hsl(166, 39%, 59%)'),
    ];
    const historicalColors = [
        palette[0],
        palette[1],
        palette[2],
        palette[3],
        tinycolor.mix(palette[0], tintingColor, 25),
        tinycolor.mix(palette[1], tintingColor, 25),
        tinycolor.mix(palette[2], tintingColor, 25),
        tinycolor.mix(palette[4], tintingColor, 25),
        tinycolor.mix(palette[0], tintingColor, 50),
        tinycolor.mix(palette[1], tintingColor, 50),
        tinycolor.mix(palette[2], tintingColor, 50),
        tinycolor.mix(palette[4], tintingColor, 50),
        tinycolor.mix(palette[0], tintingColor, 75),
        tinycolor.mix(palette[1], tintingColor, 75),
        tinycolor.mix(palette[2], tintingColor, 75),
        tinycolor.mix(palette[4], tintingColor, 75),
    ];

    const drawCircleAtPoint = (points, color = 'black', width = 1) => {
        points.forEach((coords) => {
            drawCircleFilled(ctx)(coords[0], coords[1], width / 2, color);
        });
    };

    const drawPoints = (points, color = 'black', width = 1) => {
        ctx.beginPath();
        ctx.strokeStyle = tinycolor(color).clone().toRgbString();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        // ctx.lineJoin = 'round';

        points.forEach((coords, i) => {
            if (i === 0) {
                ctx.moveTo(coords[0], coords[1]);
            } else {
                ctx.lineTo(coords[0], coords[1]);
            }
        });
        ctx.stroke();
    };

    const drawSegment = (segments, color, weight, points = false) => {
        ctx.lineCap = 'round';
        // ctx.lineJoin = 'round';
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

    // Various noise fns to test
    const simplex2d = (x, y) => simplexNoise2d(x, y, 0.001);
    const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
    const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
    const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);
    const noise = simplex2d;

    const segmentFromSplinedPoints = (points) => segmentFromPoints(createSplinePoints(points));

    const drawOxbows = (bows, color, weight, smooth = 2) => {
        bows.forEach((o) => {
            const a = mapRange(0, 10, 0, 1, o.length);
            const w = mapRange(0, 10, 1, weight, o.length);
            // connectSegments(oxsegments) // connect ends and starts
            // BUG here, can cause invalid float32array len, trapped in code

            const p = createSplinePoints(getSegPointsMid(pointsFromSegment(o)));
            drawPoints(p, color, w);

            // const seg = segmentFromSplinedPoints(pointsFromSegment(o));
            // drawSegment(seg, color, w);
            // drawSegmentTaper(seg, color, w);
        });
    };

    const drawMainChannel = (points, color, weight, smooth = false) => {
        let p = getSegPointsMid(points);
        if (smooth) {
            p = createSplinePoints(p);
        } else {
            p = chaikin(p, 2);
        }
        drawPoints(p, color, weight);
    };

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        background(canvas, context)(backgroundColor);
        const points = chaikin(createHorizontalPath(canvas, 0, canvasMidY, 20), 1);
        const channelSegments = segmentFromPoints(points);
        // rivers.push(
        //     new River(channelSegments, {
        //         mixTangentRatio: 0.5,
        //         maxHistory: 5,
        //         storeHistoryEvery: 20,
        //         noiseFn: noise,
        //         mixNoiseRatio: 0.2,
        //     })
        // );
        rivers.push(
            new River(channelSegments, {
                fixedEndPoints: 1,
                curveAdjacentSegments: 10,
                curveMagnitude: 30,
                insertionFactor: 5,
                pointRemoveProx: 4, // curveMag * .3
                oxbowProx: 15, // curveMag
                mixMagnitude: 2,
                mixTangentRatio: 0.55,
                maxHistory: historicalColors.length / 4,
                storeHistoryEvery: 20,
                noiseFn: noise,
                noiseStrengthAffect: 3,
                mixNoiseRatio: 0.1,
            })
        );

        // const circleSegments = segmentFromPoints(createCirclePoints(canvasMidX, canvasMidY, canvasMidX, 30));
        // rivers.push(new River(circleSegments, { mixTangentRatio: 0.5, fixedEndPoints: 0 }));
    };

    // i-1 assuming current is a different color
    // need to create tints for differt mult of i based on # of colors: 4

    const getHistoricalColor = (i) => historicalColors[i - 1];

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor.clone().setAlpha(1));

        renderField(canvas, context, noise, 'rgba(0,0,0,.1)', 30);

        const riverColor = bicPenBlue;
        const riverWeight = 10;
        const oxbowColor = warmGreyDark.clone().brighten(30).setAlpha(0.5);
        const oxbowWeight = 7;

        rivers.forEach((r) => {
            r.step();

            // for (let i = r.history.length - 1; i >= 0; i--) {
            //     const b = mapRange(r.history.length, 0, 50, 10, i);
            //     // const ccolor = i == 0 ? riverColor : warmGreyDark.clone().brighten(b);
            //
            //     const ccolor = i === 0 ? tintingColor : getHistoricalColor(i);
            //     const ocolor = oxbowColor;
            //
            //     // drawOxbows(r.history[i].oxbows, tintingColor, oxbowWeight);
            //
            //     drawMainChannel(pointsFromSegment(r.history[i].channel), ccolor, riverWeight * 2);
            // }

            drawOxbows(r.oxbows, oxbowColor, oxbowWeight);
            drawMainChannel(r.channelPoints, warmWhite, riverWeight, true);
        });

        time += 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
