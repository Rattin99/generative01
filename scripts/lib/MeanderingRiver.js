import { linesIntersect, mCurvature, pa2VA, trimPoints, va2pA } from './lineSegments';
import { defaultValue, getArrayValuesFromEnd, getArrayValuesFromStart } from './utils';
import { chaikin, degreesToRadians, lerp, mapRange, percentage, pointDistance, uvFromAngle } from './math';
import { Vector } from './Vector';

/*
Based on Meander by Robert Hodgin
http://roberthodgin.com/project/meander

And Eric's recreations
https://www.reddit.com/r/generative/comments/lfsl8t/pop_art_meandering_river/
 */

/*
The settings for the effect are very particular.  Too many points tends to result in "mushrooming" of the flow and
on the extreme, oxbows everywhere. But this can be very interesting! Too too few will cause the flow to flatten.

    - Curve measure larger will create larger bubbles
    - Curve size, even larger bubbles
    - Seg curve multiplier should be <1
    - If point remove prox is too low line will create mushrooms. Should be curve size or a few decimal points under
    - If insertion factor is > 1, then the line will just be straight
    - Mix mag should be incr in small sizes
*/

/*
Settings for a nice medium high turbulence river

// Convenience settings object
const cs = {
    mixTangentRatio: 0.45,
    mixMagnitude: 1.75,
    curvemeasure: 4,
    curvesize: 5,
    pointremove: 5,
    oxbowProx: 2.5,
};

const mediumRiver = new MeanderingRiver(points, {
    maxHistory,
    storeHistoryEvery: historyStep,
    fixedEndPoints: 3,
    influenceLimit: 0,

    mixTangentRatio: cs.mixTangentRatio,
    mixMagnitude: cs.mixMagnitude,
    oxbowProx: cs.oxbowProx,
    oxbowPointIndexProx: cs.curvemeasure,
    measureCurveAdjacent: cs.curvemeasure,
    curveSize: cs.curvesize,
    pointRemoveProx: cs.pointremove,

    pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

    noiseFn: noise,
    noiseMode: 'mix',
    noiseStrengthAffect: 0,
    mixNoiseRatio: 0.3,
});

 */

export class MeanderingRiver {
    constructor(initPoints, props) {
        this.startingPoints = initPoints;
        this.pointVectors = pa2VA(initPoints);
        this.oxbows = [];

        // Toggle oxbow checking
        this.handleOxbows = defaultValue(props, 'handleOxbows', true);

        // Wrap around end points for testing circles/closed shapes
        this.wrapEnd = defaultValue(props, 'wrapEnd', false);

        // %age of line length to fix at each end. Must be >= 1
        // Setting to 1 will be fixing the first 1 point only, not percentage
        this.fixedEndPoints = defaultValue(props, 'fixedEndPoints', 1);
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

        // Additional vector to push the flow in a direction
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

        // this.oxbowShrinkRate = defaultValue(props, 'oxbowShrinkRate', 25);

        // Additional flow influence. mix, only, scaleMag
        this.noiseMode = defaultValue(props, 'noiseMode', 'mix'); // mix or only (mix and exclude less than strength)
        // Passed x,y returns a small -/+ value
        this.noiseFn = defaultValue(props, 'noiseFn', undefined);
        // Values returned from noise fn less than this will be ignored
        this.noiseStrengthAffect = defaultValue(props, 'noiseStrengthAffect', 3); // only noise theta > will cause drift
        // Ratio to mix in noise with the calculated influence vector. Best kept less than .3
        this.mixNoiseRatio = defaultValue(props, 'mixNoiseRatio', 0.1);

        // Store history of the past flows
        this.steps = 0;
        this.maxHistory = defaultValue(props, 'maxHistory', 10);
        this.storeHistoryEvery = defaultValue(props, 'storeHistoryEvery', 2);
        this.history = [];
        this.running = true;
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

    getPointsToMeasure(i, points) {
        const len = this.measureCurveAdjacent;
        let min = 0;
        let max = points.length;
        if (false && this.wrapEnd) {
            // Circular - resulting in good curve values
            const start = getArrayValuesFromStart(points, i, len);
            const end = getArrayValuesFromEnd(points, i, len);
            return start.concat(end);
        }
        min = i < len ? 0 : i - len;
        max = i > points.length - len ? points.length : i + len;
        return points.slice(min, max);
    }

    // The main part of the effect - most important parts
    // 1. The curvature of a portion of the points is measured and averaged
    // 2. The angle/tangent of the current and next points is measured
    // 3. A perpendicular bitangent is calculated and it's magnitude set to the curvature
    // 4. A mix vector is created from a blend of the tangent and bitangent
    curvatureInfluence(point, i, allPoints) {
        // get x points on either side of the given point
        const curvature = this.averageMCurvature(this.getPointsToMeasure(i, allPoints)) * this.segCurveMultiplier;
        const curveDirection = curvature < 0 ? 1 : -1;

        let nextPoint = allPoints[i + 1];

        if (!nextPoint && this.wrapEnd) {
            // If wrapped, the next point at the end is the start
            nextPoint = allPoints[0];
        }

        const tangent = nextPoint.sub(point);
        const biangle = tangent.angle() + 1.5708 * curveDirection;
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

        // Increase the strength
        if (this.mixMagnitude) {
            mVector = mVector.setMag(this.mixMagnitude);
        }

        // Limit the length
        if (this.influenceLimit > 0) {
            mVector = mVector.limit(this.influenceLimit);
        }

        return mVector;
    }

    // Move the points
    // TODO refactor to better take into account wrapped ends
    meander(points) {
        // Slice the array in to points to affect (mid) and to not (start and end)
        const pct = this.fixedEndPoints === 1 ? 1 : percentage(points.length, this.fixedEndPoints) + 1;
        const fixedPointsPct = pct;
        const startIndex = this.wrapEnd ? 0 : fixedPointsPct;
        const startIndexPoints = points.slice(0, startIndex);
        const endIndex = points.length - fixedPointsPct;
        const endIndexPoints = points.slice(endIndex, points.length);
        const middlePoints = this.wrapEnd ? points : points.slice(startIndex, endIndex);
        let influencedPoints = [];

        if (middlePoints.length > 3) {
            influencedPoints = middlePoints.map((point, i) => {
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
        } else {
            // Lines crossed and there were cut off/oxbowed
            this.running = false;
            console.log('Meander crossed, stopping');
        }
        return this.wrapEnd ? influencedPoints : startIndexPoints.concat(influencedPoints).concat(endIndexPoints);
        // return
    }

    canRemovePoint(i, points) {
        if (this.wrapEnd) {
            // TODO Should be able to remove the first and last?
        }
        const fixed = this.fixedEndPoints || 1;
        return i > fixed && i < points.length - fixed;
    }

    // If points are too far apart, add extra points to allow for expansion
    // If they're too close, remove them to remove uneccessary information
    // Too many points too close together will trash performance and cause many many oxbows to form w/ short segments
    adjustPointsSpacing(points) {
        return points.reduce((acc, point, i) => {
            if (i === 0 || (i === points.length - 1 && !this.wrapEnd)) {
                acc.push(point);
                return acc;
            }

            let next = points[i + 1];

            if (this.wrapEnd && !next) next = points[0];

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
            } else if (this.canRemovePoint(i, points) && distance < this.pointRemoveProx) {
                // Remove points
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
                // exclude first and last if it's wrapping
                if ((this.wrapEnd && i === 0) || j === 0 || i === points.length - 1 || j === points.length - 1)
                    continue;
                const next = points[j];
                const dist = pointDistance(point, next);
                // Check the proximity of the points on the screen and their proximity in the points array
                if (dist < this.oxbowProx && Math.abs(i - j) > this.oxbowPointIndexProx) {
                    newPoints.push(next);
                    let oxpoints = va2pA(points.slice(i, j));
                    oxpoints = chaikin(trimPoints(oxpoints, 3), 3);
                    this.oxbows.push({ points: oxpoints, startLength: oxpoints.length });
                    // Skip i ahead to j since these points were removed
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
                    // Check check each channel segment for intersection with an oxbow segment
                    // If it intersects, remove it
                    const intersect = this.pointVectors.reduce((acc, cp, k) => {
                        if (!acc) {
                            const np = this.pointVectors[k + 1];
                            const nop = oxpoints[i + 1];
                            if (np && nop) {
                                acc = linesIntersect(cp.x, cp.y, np.x, np.y, point[0], point[1], nop[0], nop[1]);
                            }
                        }
                        return acc;
                    }, false);

                    if (!intersect) {
                        // remove the first and last point
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
        // Running stops if the line crosses it self at the ends and the whole segment is cut ad becomes an oxbow
        if (this.running) {
            // influence segments to sim flow and process points
            let newPoints = this.meander(this.pointVectors);
            newPoints = this.adjustPointsSpacing(newPoints);
            if (this.handleOxbows) newPoints = this.checkForOxbows(newPoints);

            this.pointVectors = newPoints;

            if (this.handleOxbows) this.oxbows = this.shrinkOxbows(this.oxbows);

            // Record history
            this.addToHistory(this.oxbows, va2pA(this.pointVectors));
            this.steps++;
        } else if (this.handleOxbows) this.oxbows = this.shrinkOxbows(this.oxbows);
    }
}

// Push the flow right
export const flowRight = (p, m) => new Vector(0.25, 0);

// Push right and towards the middle
export const flowRightToMiddle = (f, mid) => (p, m) => {
    const dist = Math.abs(mid - p.y);
    let y = mapRange(0, mid / 2, 0, f, dist);
    if (p.y > mid) {
        y *= -1;
    }
    return new Vector(0.5, y);
};
