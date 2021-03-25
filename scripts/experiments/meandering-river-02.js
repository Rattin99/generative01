import tinycolor from 'tinycolor2';
import { randomNormalWholeBetween, chaikin, mapRange } from '../lib/math';
import { background } from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { bicPenBlue, warmWhite } from '../lib/palettes';
import { MeanderingRiver, flowRightToMiddle } from '../lib/MeanderingRiver';
import { createSplinePoints, trimPoints } from '../lib/lineSegments';
import { simplexNoise2d, renderField } from '../lib/attractors';
import { drawConnectedPoints, variableCircleAtPoint } from '../lib/canvas-linespoints';
import { createCirclePoints } from '../lib/grids';

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

const createVerticalPath = ({ width, height }, startX, startY, steps = 20) => {
    const coords = [];
    const incr = Math.round(height / steps);
    const midy = height / 2;
    for (let i = startY; i < height; i += incr) {
        // greater variation in the middle
        const midDist = Math.round(midy - Math.abs(i - midy));
        const x = randomNormalWholeBetween(startX - midDist, startX + midDist);

        coords.push([x, i]);
    }
    coords.push([startX, height]);
    return coords;
};

export const meanderingRiver02 = () => {
    const config = {
        name: 'meandering-river-02',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let ctx;
    let canvasMidX;
    let canvasMidY;
    const rivers = [];
    const time = 0;

    // colors sampled from http://roberthodgin.com/project/meander
    const agedWarmWhite = tinycolor('hsl(42, 43%, 76%)');
    const tintingColor = tinycolor('hsl(38, 38%, 64%)');
    const palette = [
        tinycolor('hsl(97, 9%, 73%)'),
        tinycolor('hsl(51, 7%, 38%)'),
        tinycolor('hsl(19, 39%, 47%)'),
        tinycolor('hsl(166, 39%, 59%)'),
    ];

    const backgroundColor = warmWhite;

    const noise = (x, y) => simplexNoise2d(x, y, 0.002);
    const maxHistory = 10;
    const historyStep = 25;

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        background(canvas, context)(backgroundColor);
        const horizontal = createSplinePoints(createHorizontalPath(canvas, 0, canvasMidY, 15));
        const vertical = createSplinePoints(createVerticalPath(canvas, canvasMidX, 0, 15));

        const circle = createCirclePoints(canvasMidX, canvasMidY, canvasMidX / 2, Math.PI * 7, true);

        const cs = {
            mixTangentRatio: 0.45,
            mixMagnitude: 1.75,
            curvemeasure: 4,
            curvesize: 5,
            pointremove: 5,
            oxbowProx: 2.5,
        };

        const mainRiver = new MeanderingRiver(circle, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,

            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

            // noiseFn: noise,
            // noiseMode: 'mix',
            // noiseStrengthAffect: 0,
            // mixNoiseRatio: 0.3,
        });

        // mainRiver.handleOxbows = false;
        rivers.push(mainRiver);
    };

    const smoothPoints = (points, trim, smooth) => chaikin(trimPoints(points, trim), smooth);

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(backgroundColor.clone());
        // renderField(
        //     canvas,
        //     context,
        //     noise,
        //     'rgba(0,0,0,.5)',
        //     30,
        //     0,
        //     backgroundColor.clone().darken(5),
        //     backgroundColor.clone(),
        //     5
        // );

        const riverColor = bicPenBlue;
        const riverWeight = [20, 3];
        const oxbowColor = riverColor;
        const outlineColor = bicPenBlue.clone().setAlpha(0.05);

        // step
        rivers.forEach((r) => {
            r.step();
        });

        // history
        rivers.forEach((r, i) => {
            for (let h = r.history.length - 1; h >= 0; h--) {
                // const a = mapRange(0, maxHistory, 0.35, 0.1, h);
                const b = mapRange(0, maxHistory, 5, 20, h);
                const hcolor = tinycolor.mix(
                    riverColor.clone().brighten(25),
                    backgroundColor,
                    mapRange(0, maxHistory, 0, 100, h)
                );
                // const hcolor = riverColor.clone().darken(b);
                const hpoints = r.history[h].channel; // smoothPoints(r.history[h].channel, 8, 3);
                drawConnectedPoints(ctx)(hpoints, hcolor, riverWeight[i]);
                // variableCircleAtPoint(ctx)(chaikin(r.history[h].channel, 2), hcolor, riverWeight[i] / 2);
            }
        });

        // outline
        // rivers.forEach((r, i) => {
        //     r.oxbows.forEach((o) => {
        //         const w = Math.abs(mapRange(0, o.startLength, riverWeight[i] / 2, riverWeight[i], o.points.length));
        //         // drawConnectedPoints(ctx)(o.points, outlineColor, w + 2);
        //         variableCircleAtPoint(ctx)(o.points, outlineColor, w / 2 + 2);
        //     });
        //     const points = smoothPoints(r.points, 1, 3);
        //     // drawConnectedPoints(ctx)(points, outlineColor, riverWeight[i] + 2);
        //     variableCircleAtPoint(ctx)(points, outlineColor, riverWeight[i] / 2 + 1, 30, 3);
        // });

        // main
        rivers.forEach((r, i) => {
            r.oxbows.forEach((o) => {
                const w = Math.abs(mapRange(0, o.startLength, riverWeight[i] / 2, riverWeight[i], o.points.length));
                drawConnectedPoints(ctx)(o.points, oxbowColor, w);
                // variableCircleAtPoint(ctx)(o.points, oxbowColor, w / 2);
            });
            const points = smoothPoints(r.points, 1, 3);
            drawConnectedPoints(ctx)(points, riverColor.clone(), riverWeight[i], true);
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
