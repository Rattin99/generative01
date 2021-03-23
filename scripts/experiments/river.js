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
import {
    circleAtPoint,
    drawConnectedPoints,
    drawPoints,
    drawPointsTaper,
    variableCircleAtPoint,
} from '../lib/canvas-linespoints';
import { defaultValue } from '../lib/utils';

/*
Based on Meander by Roger Hodgin
http://roberthodgin.com/project/meander

And Eric's recreations
https://www.reddit.com/r/generative/comments/lfsl8t/pop_art_meandering_river/
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/shape/MeanderingRiver.kt
https://github.com/ericyd/generative-art/blob/738d93c5e0de69539ceaca7a6e096fa93bad9cfd/openrndr/src/main/kotlin/sketch/S23_MeanderClone.kt
 */

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

    // Average Menger curvature of the segments
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

        // Noise to add interesting extra flows
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

    // Move the points
    meander(points) {
        // Slice the array in to points to affect (mid) and to not (start and end)
        const pct = Math.round(this.fixedEndPoints * (points.length / 100)) + 1;
        const startIndex = pct;
        const startIndexPoints = points.slice(0, startIndex);
        const endIndex = points.length - pct;
        const endIndexPoints = points.slice(endIndex, points.length);
        const middlePoints = points.slice(startIndex, endIndex);

        const influencedPoints = middlePoints.map((point, i) => {
            const mixVector = this.curvatureInfluence(point, i + startIndex, points);
            let infPoint = point.add(mixVector);
            // Additional motion to the point vectors to push around the screen, sim flows in directions, keep towards
            // the center of the screen, etc.
            if (this.pushFlowVectorFn) {
                const pushVector = this.pushFlowVectorFn(point, mixVector);
                infPoint = infPoint.add(pushVector);
            }
            return infPoint;
        });

        return startIndexPoints.concat(influencedPoints).concat(endIndexPoints);
    }

    // If points are too far apart, add extra points to allow for expansion
    // If they're too close, remove them to remove uneccessary information
    // Too many points too close together will trash performance and cause many many oxbows to form w/ short segments
    adjustPointsSpacing(points) {
        return points.reduce((acc, point, i) => {
            if (i === 0 || i === points.length - 1) {
                acc.push(point);
                return acc;
            }

            const next = points[i + 1];
            const distance = pointDistance(point, next);

            if (distance > this.curveSize) {
                // Add points
                const numInsertPoints = Math.round((distance / this.curveSize) * this.insertionFactor) + 1;
                for (let k = 0; k < numInsertPoints; k++) {
                    const ratio = (1 / numInsertPoints) * k;
                    const nx = lerp(point.x, next.x, ratio);
                    const ny = lerp(point.y, next.y, ratio);
                    acc.push(new Vector(nx, ny));
                }
            } else if (
                i > this.fixedEndPoints &&
                i < points.length - this.fixedEndPoints &&
                distance < this.pointRemoveProx
            ) {
                // Remove points
            } else {
                acc.push(point);
            }
            return acc;
        }, []);
    }

    // Check the proximity of the points on the screen and their proximity in the points array
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
                    let oxpoints = va2pA(points.slice(i, j));
                    oxpoints = chaikin(trimPoints(oxpoints, 3), 3);
                    this.oxbows.push({ points: oxpoints, startLength: oxpoints.length });
                    i = j;
                }
            }
        }
        return newPoints;
    }

    // Shrink the oxbows so the "evaporate"
    // TODO - shrink distance between points not just cut off of the end
    shrinkOxbows(oxbowArr) {
        return oxbowArr.reduce((oxacc, oxbow) => {
            const oxpoints = oxbow.points;
            if (oxpoints.length > 1) {
                const shrinkPct = 1; // Math.ceil(this.oxbowShrinkRate / oxpoints.length);
                oxbow.points = oxpoints.reduce((ptacc, point, i) => {
                    // TODO rewrite and put this back in
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
                        if (i > shrinkPct && i < oxbow.points.length - shrinkPct) {
                            ptacc.push(point);
                        }
                    }

                    return ptacc;
                }, []);
                oxacc.push(oxbow);
            }
            return oxacc;
        }, []);
    }

    // Execute one step
    step() {
        // influence segments to sim flow and process points
        let newPoints = this.meander(this.pointVectors);
        newPoints = this.adjustPointsSpacing(newPoints);
        newPoints = this.checkForOxbows(newPoints);

        this.pointVectors = newPoints;

        this.oxbows = this.shrinkOxbows(this.oxbows);

        // Record history
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
    const maxHistory = historicalColors.length / 2;

    const flowRight = (p, m) => new Vector(0.25, 0);

    // stronger middle pressure the farther away it is
    const flowRightToMiddle = (f) => (p, m) => {
        const dist = Math.abs(canvasMidY - p.y);
        let y = mapRange(0, canvasMidY / 2, 0, f, dist);
        if (p.y > canvasMidY) {
            y *= -1;
        }
        return new Vector(0.25, y);
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
    const cs = {
        mixTangentRatio: 0.45,
        mixMagnitude: 1.25,
        curvemeasure: 4,
        curvesize: 5,
        pointremove: 5,
        insertion: 1,
    };

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        background(canvas, context)(backgroundColor);
        const points = createSplinePoints(createHorizontalPath(canvas, 0, canvasMidY, 15));

        const baseRiver = new River(points, {
            maxHistory,
            storeHistoryEvery: 30,

            influenceLimit: 0,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            pushFlowVectorFn: flowRight,
            oxbowProx: cs.curvesize,

            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,
            insertionFactor: cs.insertion,
        });

        // blue
        const mainRiver = new River(points, {
            maxHistory,
            storeHistoryEvery: 50,
            fixedEndPoints: 3,
            influenceLimit: 0,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude + 0.5,
            pushFlowVectorFn: flowRightToMiddle(0.75),
            oxbowProx: cs.curvesize * 0.5,
            oxbowPointIndexProx: cs.curvemeasure, // measureCurveAdjacent * 1.5

            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,
            insertionFactor: cs.insertion,

            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.2,
        });

        const mainRiverSideChannel = new River(points, {
            maxHistory,
            storeHistoryEvery: 50,
            fixedEndPoints: 3,
            influenceLimit: 0,

            // difference
            segCurveMultiplier: 0.9999,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude + 0.5,
            pushFlowVectorFn: flowRightToMiddle(0.75),
            oxbowProx: cs.curvesize * 0.5,
            oxbowPointIndexProx: cs.curvemeasure, // measureCurveAdjacent * 1.5

            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,
            insertionFactor: cs.insertion,

            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.2,
        });

        rivers.push(mainRiver); // , mainRiverSideChannel
    };

    const smoothPoints = (points, trim, smooth) => chaikin(trimPoints(points, trim), smooth);

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor.clone());
        renderField(canvas, context, noise, 'rgba(0,0,0,.25)', 30, 5, warmGreyDark.clone(), warmWhite.clone(), 5, 0.25);

        const riverColor = warmWhite;
        const riverWeight = [15, 5];
        const oxbowColor = riverColor;
        const outlineColor = warmGreyDark;

        // step
        rivers.forEach((r) => {
            r.step();
        });

        // history
        rivers.forEach((r, i) => {
            for (let h = r.history.length - 1; h >= 0; h--) {
                const a = mapRange(0, historicalColors.length / 2, 0.35, 0.1, h);
                const hcolor = tinycolor
                    .mix(warmGreyDark, tintingColor, mapRange(0, maxHistory, 20, 100, h))
                    .setAlpha(a);
                const hpoints = smoothPoints(r.history[h].channel, 2, 1);
                // warmGreyDark.clone().setAlpha(a) getHistoricalColor(h)
                drawConnectedPoints(ctx)(hpoints, hcolor, riverWeight[i]);
                // variableCircleAtPoint(ctx)(chaikin(r.history[h].channel, 2), hcolor, riverWeight[i] / 2);
            }
        });

        // outline
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = mapRange(0, o.startLength, 0, riverWeight[i], o.points.length);
                // drawConnectedPoints(ctx)(o.points, outlineColor, w + 2);
                variableCircleAtPoint(ctx)(o.points, outlineColor, w / 2 + 3);
            });
            const points = smoothPoints(r.points, 1, 3);
            drawConnectedPoints(ctx)(points, outlineColor, riverWeight[i] + 2);
            // variableCircleAtPoint(ctx)(points, outlineColor, riverWeight[i] / 2 + 2);
        });

        // main
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, riverWeight[i] / 2, riverWeight[i], o.points.length));
                // drawConnectedPoints(ctx)(o.points, oxbowColor, w);
                variableCircleAtPoint(ctx)(o.points, oxbowColor, w / 2);
            });
            const points = smoothPoints(r.points, 1, 3);
            drawConnectedPoints(ctx)(points, riverColor, riverWeight[i]);
            // variableCircleAtPoint(ctx)(points, riverColor, riverWeight[i] / 2);
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
