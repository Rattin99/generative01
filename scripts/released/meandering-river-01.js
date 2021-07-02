import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background, strokeDash } from '../rndrgen/canvas/canvas';
import { orientation, ratio, scale } from '../rndrgen/Sketch';
import { bicPenBlue, warmWhite } from '../rndrgen/color/palettes';
import { MeanderingRiver, flowRightToMiddle } from '../rndrgen/systems/MeanderingRiver';
import { chaikinSmooth } from '../rndrgen/math/segments';
import { simplexNoise2d } from '../rndrgen/math/attractors';
import { getPointsOnCircleOld } from '../rndrgen/math/grids';
import { renderFieldColor, renderFieldContour } from '../rndrgen/canvas/fields';
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

export const meanderingRiver01 = () => {
    const config = {
        name: 'meandering-river-01',
        ratio: ratio.a3plus,
        scale: scale.hidpi,
        orientation: orientation.landscape,
    };

    let ctx;
    let canvasMidX;
    let canvasMidY;
    const renderScale = config.scale; // 1 or 2
    const rivers = [];
    let time = 0;

    const backgroundColor = warmWhite;

    const riverColor = warmWhite.clone().brighten(20);
    const oxbowColor = riverColor.clone();

    const flatColor = backgroundColor.clone().darken(10);
    const isolowColor = flatColor.clone().darken(2);
    const isohighColor = backgroundColor.clone().brighten(10);

    const tintingColor = tinycolor('hsl(38, 38%, 64%)');
    const palette = [
        tinycolor('hsl(97, 9%, 73%)'),
        tinycolor('hsl(51, 7%, 38%)'),
        tinycolor('hsl(19, 39%, 47%)'),
        tinycolor('hsl(166, 39%, 59%)'),
        tinycolor.mix('hsl(97, 9%, 73%)', tintingColor, 25),
        tinycolor.mix('hsl(51, 7%, 38%)', tintingColor, 25),
        tinycolor.mix('hsl(19, 39%, 47%)', tintingColor, 25),
        tinycolor.mix('hsl(166, 39%, 59%)', tintingColor, 25),
        tinycolor.mix('hsl(97, 9%, 73%)', tintingColor, 55),
        tinycolor.mix('hsl(51, 7%, 38%)', tintingColor, 55),
        tinycolor.mix('hsl(19, 39%, 47%)', tintingColor, 55),
        tinycolor.mix('hsl(166, 39%, 59%)', tintingColor, 55),
        tinycolor.mix('hsl(97, 9%, 73%)', tintingColor, 75),
        tinycolor.mix('hsl(51, 7%, 38%)', tintingColor, 75),
        tinycolor.mix('hsl(19, 39%, 47%)', tintingColor, 75),
        tinycolor.mix('hsl(166, 39%, 59%)', tintingColor, 75),
    ].reverse();

    let noiseScale = 0.001 / renderScale;
    const noise = (x, y) => simplexNoise2d(x, y, noiseScale);
    const maxHistory = 15;
    const historyStep = 15;

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;

        const horizpoints = createSplineFromPointArray(createHorizontalPath(canvas, 0, canvasMidY, 15));

        const riverScale = 1.25;

        noiseScale /= riverScale * 2;

        const horizontal = new MeanderingRiver(horizpoints, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 2,

            oxbowProx: 3 * renderScale,
            oxbowPointIndexProx: 4 * renderScale,

            mixTangentRatio: 0.7,
            mixMagnitude: 1.5 * riverScale,

            measureCurveAdjacent: 6 * renderScale * riverScale,
            curveSize: 4 * renderScale * riverScale,
            pointRemoveProx: 4 * renderScale * riverScale,

            pushFlowVectorFn: flowRightToMiddle(0.6, canvasMidY),

            noiseFn: noise,
            noiseMode: 'flowInTo',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3,
        });

        rivers.push(horizontal);

        // Run some steps before render to smooth lines
        for (let i = 0; i < 50; i++) {
            rivers.forEach((r) => {
                r.step();
            });
        }

        background(canvas, context)(backgroundColor);
        // renderFieldColor(canvas, context, noise, 100, flatColor, backgroundColor, 4);

        const slices = [
            { nmin: -7, nmax: 7, omin: -1, omax: 1, color: isohighColor },
            { nmin: -6, nmax: -4, omin: -1, omax: 1, color: isolowColor },
            { nmin: -4, nmax: -2, omin: -1, omax: 1, color: isolowColor },
            { nmin: -2, nmax: 0, omin: -1, omax: 1, color: isolowColor },
            { nmin: 0, nmax: 2, omin: -1, omax: 1, color: isohighColor },
            { nmin: 2, nmax: 4, omin: -1, omax: 1, color: isohighColor },
            { nmin: 4, nmax: 6, omin: -1, omax: 1, color: isohighColor },
        ];

        renderIsolines(context, canvas, noise, 50 * renderScale, 100 * renderScale, true, slices);
    };

    const outlineThickness = 3 * renderScale;
    const riverSmoothing = 4;
    const riverWeight = 20 * renderScale;

    const draw = ({ canvas, context }) => {
        // step
        rivers.forEach((r) => {
            for (let i = 0; i < renderScale; i++) {
                r.step();
            }
        });

        const outlineColor = palette[Math.round(time * 0.03) % palette.length]; // .clone().setAlpha(0.75);

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

        time++;
        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
