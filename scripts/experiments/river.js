import tinycolor from 'tinycolor2';
import {
    uvFromAngle,
    randomNormalWholeBetween,
    chaikin,
    pointDistance,
    lerp,
    mapRange,
    degreesToRadians,
    randomNumberBetween,
} from '../lib/math';
import { background, drawCircleFilled, drawLine } from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { bicPenBlue, darkest, warmGreyDark, warmWhite } from '../lib/palettes';
import { Vector } from '../lib/Vector';
import { createSplinePoints, pa2VA, va2pA, mCurvature, trimPoints } from '../lib/lineSegments';
import { simplexNoise2d, renderField } from '../lib/attractors';
import { circleAtPoint, drawConnectedPoints, drawPoints, drawPointsTaper } from '../lib/canvas-linespoints';
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

- [ ] ALL POINTS TO VECTORS

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
    constructor(initPoints, props) {
        this.startingPoints = initPoints;
        this.pointVectors = pa2VA(initPoints);
        this.oxbows = [];

        // %age of line length to fix at each end
        this.fixedEndPoints = defaultValue(props, 'fixedEndPoints', 10);
        // how many adjacent points to use to measure the average curvature
        this.measureCurveAdjacent = defaultValue(props, 'measureCurveAdjacent', 30);
        // Ineffective multiply the measured curvature vector magnitude to enhance effect
        this.segCurveMultiplier = defaultValue(props, 'segCurveMultiplier', 1);

        // How much to blend tangent and bitangent, 0 = tangent, 1 = bitangent
        this.mixTangentRatio = defaultValue(props, 'mixTangentRatio', 0.5);
        // Magnitude of the mixed vector, increase the effect, < slower
        this.mixMagnitude = defaultValue(props, 'mixMagnitude', 0);
        // Limit the influence vector,  less than 1, slower. > 1 no affect
        this.influenceLimit = defaultValue(props, 'influenceLimit', 0.25);

        this.pushFlowVectorFn = defaultValue(props, 'pushFlowVectorFn', undefined);

        // Add new points if the distance between is larger
        this.curveSize = defaultValue(props, 'curveSize', 2);
        // Multiplier for the amount of new points to add
        this.insertionFactor = defaultValue(props, 'insertionFactor', 1);
        // Remove points closer than this
        this.pointRemoveProx = defaultValue(props, 'pointRemoveProx', this.curveSize * 0.8);

        // Point proximity to create a new oxbow and ...
        this.oxbowProx = defaultValue(props, 'oxbowProx', this.curveSize);
        // If points are not this close than create oxbow
        this.oxbowPointIndexProx = Math.ceil(this.measureCurveAdjacent * 1.5);

        this.oxbowShrinkRate = defaultValue(props, 'oxbowShrinkRate', 25);

        this.noiseMode = defaultValue(props, 'noiseMode', 'mix'); // mix or only (mix and exclude less than strength)
        this.noiseFn = defaultValue(props, 'noiseFn', undefined);
        this.noiseStrengthAffect = defaultValue(props, 'noiseStrengthAffect', 3); // only noise theta > will cause drift
        this.mixNoiseRatio = defaultValue(props, 'mixNoiseRatio', 0.1);

        this.steps = 0;
        this.maxHistory = defaultValue(props, 'maxHistory', 10);
        this.storeHistoryEvery = defaultValue(props, 'storeHistoryEvery', 2);
        this.history = [];
    }

    get points() {
        return va2pA(this.pointVectors);
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
    averageMCurvature(points) {
        const sum = points.reduce((diffs, point, i) => {
            const prev = i - 1;
            const next = i + 1;
            if (prev >= 0 && next < points.length) {
                diffs += mCurvature(points[prev], point, points[next]);
            }
            return diffs;
        }, 0);
        return degreesToRadians(sum / points.length);
    }

    curvatureInfluence(point, i, allPoints) {
        const nextPoint = allPoints[i + 1];
        const min = i < this.measureCurveAdjacent ? 0 : i - this.measureCurveAdjacent;
        const max = i > allPoints.length - this.measureCurveAdjacent ? allPoints.length : i + this.measureCurveAdjacent;
        const curvature = this.averageMCurvature(allPoints.slice(min, max)) * this.segCurveMultiplier;
        const polarity = curvature < 0 ? 1 : -1;

        const tangent = nextPoint.sub(point);
        const biangle = tangent.angle() + 1.5708 * polarity;
        const bitangent = uvFromAngle(biangle).setMag(Math.abs(curvature));

        const a = tangent.normalize();
        const b = bitangent.normalize();
        let mVector = a.mix(b, this.mixTangentRatio);

        if (this.noiseFn) {
            const t = this.noiseFn(point.x, point.y);
            // add if theta is high enough
            if (Math.abs(t) > this.noiseStrengthAffect) {
                const n = uvFromAngle(t);
                mVector = mVector.mix(n, this.mixNoiseRatio);
            } else if (Math.abs(t) < this.noiseStrengthAffect && this.noiseMode === 'only') {
                mVector = new Vector(0, 0);
            } else if (this.noiseMode === 'scaleMag') {
                const nscale = mapRange(0, this.noiseStrengthAffect, 5, 1, 3, Math.abs(t));
                mVector = mVector.setMag(nscale);
            }
        }

        if (this.mixMagnitude) {
            mVector = mVector.setMag(this.mixMagnitude);
        }

        if (this.influenceLimit > 0) {
            mVector = mVector.limit(this.influenceLimit);
        }

        return mVector;
    }

    isPointIndexInEndsRange(i) {
        const pvlen = this.pointVectors.length;
        const pct = Math.round(this.fixedEndPoints * (pvlen / 100)) + 1;
        return i <= pct || i >= pvlen - pct;
    }

    meander(points) {
        const pct = Math.round(this.fixedEndPoints * (points.length / 100)) + 1;

        const startIndex = pct;
        const startIndexPoints = points.slice(0, startIndex);
        const endIndex = points.length - pct;
        const endIndexPoints = points.slice(endIndex, points.length);
        const middlePoints = points.slice(startIndex, endIndex);
        const influencedPoints = middlePoints.map((point, i) => {
            const mixVector = this.curvatureInfluence(point, i + startIndex, points);
            let infPoint = point.add(mixVector);
            if (this.pushFlowVectorFn) {
                const pushVector = this.pushFlowVectorFn(point, mixVector);
                infPoint = infPoint.add(pushVector);
            }
            return infPoint;
        });
        return startIndexPoints.concat(influencedPoints).concat(endIndexPoints);
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
            const distance = pointDistance(point, next);

            if (distance > this.curveSize) {
                // ensure that for points with large distances between, an appropriate number of midpoints are added
                const numInsertPoints = Math.round((distance / this.curveSize) * this.insertionFactor) + 1;
                for (let k = 0; k < numInsertPoints; k++) {
                    const ratio = (1 / numInsertPoints) * k;
                    const nx = lerp(point.x, next.x, ratio);
                    const ny = lerp(point.y, next.y, ratio);
                    acc.push(new Vector(nx, ny));
                    // console.log('add', nx, ny, distance, point, next);
                }
            } else if (
                i > this.fixedEndPoints &&
                i < points.length - this.fixedEndPoints &&
                distance < this.pointRemoveProx
            ) {
                // If too close, remove it
                // console.log(distance, point, next);
            } else {
                acc.push(point);
            }
            return acc;
        }, []);
    }

    checkForOxbows(points) {
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            newPoints.push(point);
            for (let j = i; j < points.length; j++) {
                const next = points[j];
                const dist = pointDistance(point, next);
                if (dist < this.oxbowProx && Math.abs(i - j) > this.oxbowPointIndexProx) {
                    newPoints.push(next);
                    // create oxbow
                    this.oxbows.push(va2pA(points.slice(i, j)));
                    i = j;
                }
            }
        }
        return newPoints;
    }

    // array of point arrays points, not vectors
    shrinkOxbows(oxbowArr) {
        return oxbowArr.reduce((oxacc, pointArry, i) => {
            if (pointArry.length > 1) {
                const shrinkPct = Math.ceil(this.oxbowShrinkRate / pointArry.length);
                pointArry = pointArry.reduce((ptacc, point, i) => {
                    // check every channel segment for an intersection with this oxbow segment
                    // const intersect = this.channelSegments.reduce((acc, cs) => {
                    //     if (!acc) {
                    //         acc = segmentsIntersect(cs, point);
                    //     }
                    //     return acc;
                    // }, false);

                    const intersect = false;

                    if (!intersect) {
                        // remove the first and last
                        if (i > shrinkPct && i < pointArry.length - shrinkPct) {
                            ptacc.push(point);
                        }
                    }

                    return ptacc;
                }, []);

                oxacc.push(pointArry);
            }
            return oxacc;
        }, []);
    }

    step() {
        // influence segments to sim flow
        let newPoints = this.meander(this.pointVectors);
        // vectors -> points -> smooth -> vectors
        // newPoints = pa2VA(chaikin(va2pA(newPoints), 1));
        newPoints = this.adjustPointsSpacing(newPoints);
        newPoints = this.checkForOxbows(newPoints);
        this.pointVectors = newPoints;
        this.oxbows = this.shrinkOxbows(this.oxbows);
        this.addToHistory(this.oxbows, va2pA(this.pointVectors));
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

    const noise = (x, y) => simplexNoise2d(x, y, 0.001);
    const getHistoricalColor = (i) => historicalColors[i];

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        background(canvas, context)(backgroundColor);
        const points = createSplinePoints(createHorizontalPath(canvas, 0, canvasMidY, 10));
        // const points = chaikin(createHorizontalPath(canvas, 0, canvasMidY, 10), 5);

        circleAtPoint(ctx)(points, tinycolor('white'), 10);

        const csbak = {
            curvemeasure: 10,
            curvesize: 6,
            pointremove: 6 * 0.25,
            insertion: 6 * 0.8,
        };

        const flowRight = (p, m) => new Vector(0.25, 0);

        // stronger middle pressure the farther away it is
        const flowRightToMiddle = (p, m) => {
            const dist = Math.abs(canvasMidY - p.y);
            let y = mapRange(0, canvasMidY / 2, 0, 0.75, dist);
            if (p.y > canvasMidY) {
                y *= -1;
            }
            return new Vector(0.25, y);
        };

        const cs = {
            mixTangentRatio: 0.5,
            mixMagnitude: 1.25,
            curvemeasure: 4,
            curvesize: 5,
            pointremove: 5,
            insertion: 1,
        };

        /*
        Findings
        Curve measure larger will create larger bubbles
        Curve size, even larger bubbles
        If point remove prox is too low line will create mushrooms.
            Should be curve size or a few decimal points under
        If insertion is > 1, then the line will just be straight
        Mix mag should be incr in small sizes
         */

        // red
        // rivers.push(
        //     new River(points, {
        //         maxHistory: historicalColors.length / 2,
        //         storeHistoryEvery: 30,
        //
        //         influenceLimit: 0,
        //
        //         mixTangentRatio: cs.mixTangentRatio,
        //         mixMagnitude: cs.mixMagnitude,
        //         pushFlowVectorFn: flowRight,
        //         oxbowProx: cs.curvesize,
        //
        //         measureCurveAdjacent: cs.curvemeasure,
        //         curveSize: cs.curvesize,
        //         pointRemoveProx: cs.pointremove,
        //         insertionFactor: cs.insertion,
        //     })
        // );

        // blue
        rivers.push(
            new River(points, {
                maxHistory: historicalColors.length,
                storeHistoryEvery: 30,
                fixedEndPoints: 3,
                influenceLimit: 0,

                mixTangentRatio: cs.mixTangentRatio,
                mixMagnitude: cs.mixMagnitude + 0.5,
                pushFlowVectorFn: flowRightToMiddle,
                oxbowProx: cs.curvesize * 0.5,
                oxbowPointIndexProx: cs.curvemeasure, // measureCurveAdjacent * 1.5

                measureCurveAdjacent: cs.curvemeasure,
                curveSize: cs.curvesize,
                pointRemoveProx: cs.pointremove,
                insertionFactor: cs.insertion,

                // noiseFn: noise,
                // noiseMode: 'scaleMag',
                // noiseStrengthAffect: 2,
                // mixNoiseRatio: 0.3,
            })
        );
    };

    const smoothPoints = (points, trim, smooth) => chaikin(trimPoints(points, trim), smooth);
    // const smoothPoints = (points, trim, smooth) => createSplinePoints(trimPoints(points, trim));

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor.clone().setAlpha(0.1));
        // renderField(canvas, context, noise, 'rgba(0,0,0,.1)', 30);

        const riverColor = warmWhite;
        const riverWeight = 20;
        const oxbowColor = warmWhite; // warmGreyDark.clone().brighten(30).setAlpha(0.5);
        const oxbowWeight = 20;

        const colors = ['red', 'blue'];

        rivers.forEach((r, i) => {
            r.step();

            for (let i = r.history.length - 1; i >= 0; i--) {
                // drawOxbows(r.history[i].oxbows, tintingColor, oxbowWeight);
                drawConnectedPoints(ctx)(
                    smoothPoints(r.history[i].channel, 5, 2),
                    getHistoricalColor(i),
                    riverWeight * 1.25
                );
            }

            const points = smoothPoints(r.points, 1, 5);

            r.oxbows.forEach((o) => {
                const w = mapRange(1, 200, oxbowWeight * 0.25, oxbowWeight, o.length);
                drawConnectedPoints(ctx)(o, oxbowColor, w);
            });

            drawConnectedPoints(ctx)(points, warmGreyDark, riverWeight + 2);
            drawConnectedPoints(ctx)(points, warmWhite, riverWeight);
        });

        // if (time > 1000) {
        //     return -1;
        // }

        time++;
    };

    return {
        config,
        setup,
        draw,
    };
};
