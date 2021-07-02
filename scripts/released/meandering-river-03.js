import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background, strokeDash } from '../rndrgen/canvas/canvas';
import { instagram, largePrint, orientation, ratio, scale } from '../rndrgen/Sketch';
import { bicPenBlue, warmPink, warmWhite } from '../rndrgen/color/palettes';
import { MeanderingRiver, flowRightToMiddle, flowRight } from '../rndrgen/systems/MeanderingRiver';
import { chaikinSmooth } from '../rndrgen/math/segments';
import { simplexNoise2d, simplexNoise3d } from '../rndrgen/math/attractors';
import { randomNormalWholeBetween } from '../rndrgen/math/random';
import { createSplineFromPointArray } from '../rndrgen/math/points';
import { pointPathPA } from '../rndrgen/canvas/primatives';
import { renderIsolines } from '../rndrgen/systems/marchingSquares';

/*
Meandering River class at ../rndrgen/MeanderingRiver
 */

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

export const meanderingRiver03 = () => {
    const config = { name: 'meandering-river-03', ...instagram };

    let ctx;
    let canvasMidX;
    let canvasMidY;

    const renderScale = config.scale; // 1 or 2
    const renderSteps = renderScale * 4;

    const outlineThickness = 3 * renderScale;
    const riverSmoothing = 0;
    const riverWeight = 10 * renderScale;
    const rivers = [];
    let time = 0;

    const backgroundColor = warmPink;
    const riverColor = warmPink.clone().brighten(10);
    const oxbowColor = riverColor;
    const outlineColor = bicPenBlue.clone().setAlpha(0.3);

    const riverScale = 2;

    let noiseScale = 0.006 / renderScale;
    const noise = (x, y) => simplexNoise3d(x, y, time, noiseScale);
    // const noise = (x, y) => simplexNoise2d(x, y, noiseScale);

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;

        const horizpoints = createSplineFromPointArray(createHorizontalPath(canvas, 0, canvasMidY, 15));

        noiseScale /= riverScale * 2;

        const horizontal = new MeanderingRiver(horizpoints, {
            maxHistory: 15,
            storeHistoryEvery: 15,
            fixedEndPoints: 2,

            oxbowProx: 3 * renderScale,
            oxbowPointIndexProx: 3 * renderScale,

            mixTangentRatio: 0.55,
            mixMagnitude: 1 * riverScale,

            measureCurveAdjacent: 4 * renderScale * riverScale,
            curveSize: 2 * renderScale * riverScale,
            pointRemoveProx: 3 * renderScale * riverScale,

            // pushFlowVectorFn: flowRight,
            // pushFlowVectorFn: flowRightToMiddle(0.9, canvasMidY),

            // noiseFn: noise,
            // noiseMode: 'flowInTo',
            // noiseStrengthAffect: 5,
            // mixNoiseRatio: 0.2,
        });

        rivers.push(horizontal);

        // Run some steps before render to smooth lines
        for (let i = 0; i < 50; i++) {
            rivers.forEach((r) => {
                r.step();
            });
        }

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        // step
        rivers.forEach((r) => {
            for (let i = 0; i < renderSteps; i++) {
                r.step();
            }
        });

        // outline
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, 1, riverWeight, o.points.length));
                pointPathPA(ctx)(o.points, outlineColor, w + outlineThickness / 2);
            });
            const points = chaikinSmooth(r.points, riverSmoothing);
            pointPathPA(ctx)(points, outlineColor, riverWeight + outlineThickness);
        });

        // main
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, riverWeight / 2, riverWeight, o.points.length));
                pointPathPA(ctx)(o.points, oxbowColor, w);
            });
            const points = chaikinSmooth(r.points, riverSmoothing);
            pointPathPA(ctx)(points, riverColor, riverWeight, false, false);
        });

        time += 0.1;
        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
