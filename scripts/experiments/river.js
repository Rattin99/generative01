import tinycolor from 'tinycolor2';
import { randomNormalWholeBetween, chaikin, mapRange } from '../lib/math';
import { background } from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { bicPenBlue, warmWhite } from '../lib/palettes';
import { MeanderingRiver, flowRightToMiddle } from '../lib/MeanderingRiver';
import { createSplinePoints, trimPoints } from '../lib/lineSegments';
import { simplexNoise2d, renderField, renderFieldColor, renderFieldContour } from '../lib/attractors';
import { drawConnectedPoints, variableCircleAtPoint } from '../lib/canvas-linespoints';

/*
Meandering River class at ../lib/MeanderingRiver
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
        // ratio: ratio.poster,
        // scale: scale.standard,
        // drawLimit: 100,
    };

    let ctx;
    let canvasMidX;
    let canvasMidY;
    const rivers = [];
    const time = 0;

    const backgroundColor = warmWhite;

    const riverColor = warmWhite.clone().brighten(20);
    const riverWeight = [20, 3];
    const oxbowColor = warmWhite.clone().darken(10);
    const outlineColor = bicPenBlue.setAlpha(0.25);

    const hunterGreen = 'hsl(156, 67%, 19%)';

    const flatColor = tinycolor.mix(backgroundColor, hunterGreen, 5).darken(10);

    const noise = (x, y) => simplexNoise2d(x, y, 0.0009);
    const maxHistory = 15;
    const historyStep = 15;

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;

        const points = createSplinePoints(createHorizontalPath(canvas, 0, canvasMidY, 15));

        const cs = {
            mixTangentRatio: 0.45,
            mixMagnitude: 1.75,
            curvemeasure: 4,
            curvesize: 5,
            pointremove: 5,
            oxbowProx: 2.5,
        };

        const mainRiver = new MeanderingRiver(points, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 2,
            influenceLimit: 0,
            // wrapEnd: true,
            handleOxbows: true,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,

            pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

            noiseFn: noise,
            noiseMode: 'flowInTo',
            noiseStrengthAffect: 3,
            mixNoiseRatio: 0.3,
        });

        rivers.push(mainRiver);

        // Run some steps before render to smooth lines
        for (let i = 0; i < 10; i++) {
            rivers.forEach((r) => {
                r.step();
            });
        }

        background(canvas, context)(backgroundColor);
        renderFieldColor(canvas, context, noise, 100, flatColor, backgroundColor, 2);

        renderFieldContour(canvas, context, noise, -8, 0, 30, flatColor.clone().darken(15), backgroundColor.clone());
    };

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(backgroundColor.clone());

        // step
        rivers.forEach((r) => {
            r.step();
            r.step();
        });

        // history
        // rivers.forEach((r, i) => {
        //     for (let h = r.history.length - 1; h >= 0; h--) {
        //         // const a = mapRange(0, maxHistory, 0.35, 0.1, h);
        //         const b = mapRange(0, maxHistory, 5, 20, h);
        //         const hcolor = tinycolor.mix(riverColor, backgroundColor, mapRange(0, maxHistory, 0, 100, h)).darken(b);
        //         // const hcolor = riverColor.clone().darken(b);
        //         const hpoints = r.history[h].channel; // smoothPoints(r.history[h].channel, 8, 3);
        //         drawConnectedPoints(ctx)(hpoints, hcolor, riverWeight[i] * 2);
        //     }
        // });

        // outline
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, 2, riverWeight[i], o.points.length));
                drawConnectedPoints(ctx)(o.points, oxbowColor, w + 2);
                // variableCircleAtPoint(ctx)(o.points, outlineColor, w / 2 + 2);
            });
            const { points } = r;
            drawConnectedPoints(ctx)(points, outlineColor, riverWeight[i] + 3);
            // variableCircleAtPoint(ctx)(points, outlineColor, riverWeight[i] / 2 + 1, 30, 3);
        });

        // main
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, riverWeight[i] / 2, riverWeight[i], o.points.length));
                drawConnectedPoints(ctx)(o.points, outlineColor, w);
                // variableCircleAtPoint(ctx)(o.points, oxbowColor, w / 2);
            });
            const { points } = r;
            drawConnectedPoints(ctx)(points, riverColor, riverWeight[i], false, false);
            // variableCircleAtPoint(ctx)(points, riverColor, riverWeight[i] / 2);
        });

        // if (++time > 1000) {
        // return -1;
        // }
    };

    return {
        config,
        setup,
        draw,
    };
};
