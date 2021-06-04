import tinycolor from 'tinycolor2';
import { mapRange } from '../rndrgen/math/math';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { bicPenBlue, warmWhite } from '../rndrgen/color/palettes';
import { MeanderingRiver, flowRightToMiddle } from '../systems/MeanderingRiver';
import { chaikin, createSplinePoints, trimPoints } from '../rndrgen/math/lineSegments';
import { simplexNoise2d } from '../rndrgen/math/attractors';
import { drawConnectedPoints, drawPoints, variableCircleAtPoint } from '../rndrgen/canvas/canvas-linespoints';
import { createCirclePoints } from '../rndrgen/math/grids';
import { renderField, renderFieldColor, renderFieldContour } from '../rndrgen/canvas/rendernoise';
import { randomNormalWholeBetween } from '../rndrgen/math/random';

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
        ratio: ratio.poster,
        scale: scale.standard,
        // drawLimit: 100,
    };

    let ctx;
    let canvasMidX;
    let canvasMidY;
    const rivers = [];
    let time = 0;

    const backgroundColor = warmWhite;

    const riverColor = warmWhite.clone().brighten(20);
    const riverWeight = [15, 10];
    const oxbowColor = riverColor.clone();
    const outlineColor = bicPenBlue.setAlpha(0.25);

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

    const flatColor = backgroundColor.clone().darken(10);

    const noise = (x, y) => simplexNoise2d(x, y, 0.001);
    const maxHistory = 15;
    const historyStep = 15;

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;

        const horizpoints = createSplinePoints(createHorizontalPath(canvas, 0, canvasMidY, 15));
        const circlepoints = createCirclePoints(canvasMidX, canvasMidY, canvasMidX / 2, Math.PI * 4, true);

        const cs = {
            mixTangentRatio: 0.6,
            mixMagnitude: 1.25,
            curvemeasure: 4,
            curvesize: 3,
            pointremove: 4,
            oxbowProx: 3,
        };

        const horizontal = new MeanderingRiver(horizpoints, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 2,
            influenceLimit: 0,

            mixTangentRatio: 0.6,
            mixMagnitude: 1.5,
            oxbowProx: 3,
            oxbowPointIndexProx: 4,
            measureCurveAdjacent: 6,
            curveSize: 4,
            pointRemoveProx: 4,

            pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

            noiseFn: noise,
            noiseMode: 'flowInTo',
            noiseStrengthAffect: 3,
            mixNoiseRatio: 0.3,
        });

        const circular = new MeanderingRiver(circlepoints, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,
            wrapEnd: true,

            mixTangentRatio: 0.45,
            mixMagnitude: 1,
            oxbowProx: 2,
            oxbowPointIndexProx: 2,
            measureCurveAdjacent: 10,
            curveSize: 5,
            pointRemoveProx: 3,

            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

            noiseFn: noise,
            noiseMode: 'flowInTo',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.4,
        });

        rivers.push(horizontal);
        // rivers.push(circular);

        // Run some steps before render to smooth lines
        for (let i = 0; i < 30; i++) {
            rivers.forEach((r) => {
                r.step();
            });
        }

        background(canvas, context)(backgroundColor);
        renderFieldColor(canvas, context, noise, 100, flatColor, backgroundColor, 4);
        renderFieldContour(
            canvas,
            context,
            noise,
            -8,
            8,
            15,
            flatColor.clone().darken(5),
            backgroundColor.clone().brighten(1)
        );
    };

    const draw = ({ canvas, context }) => {
        // step
        rivers.forEach((r) => {
            r.step();
        });

        const oColor = palette[Math.round(time * 0.01) % palette.length]; // .clone().setAlpha(0.75);
        const oSize = 4;

        // outline
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, 1, riverWeight[i] * 1.5, o.points.length));
                drawConnectedPoints(ctx)(o.points, oColor, w + oSize / 2);
            });
            const points = chaikin(r.points, 5);
            drawConnectedPoints(ctx)(points, oColor, riverWeight[i] + oSize);
        });

        // main
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, riverWeight[i] / 2, riverWeight[i], o.points.length));
                drawConnectedPoints(ctx)(o.points, oxbowColor, w);
            });
            const points = chaikin(r.points, 5);
            drawConnectedPoints(ctx)(points, riverColor, riverWeight[i], false, false);
            // drawPoints(ctx)(r.points, 'red', 1);
        });

        time++;
    };

    return {
        config,
        setup,
        draw,
    };
};
