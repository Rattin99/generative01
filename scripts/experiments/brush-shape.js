import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { instagram, largePrint } from '../rndrgen/sketch';
import { Palette, paperWhite } from '../rndrgen/color/palettes';
import { circlePointsPA } from '../rndrgen/math/grids';
import { polygonPA, line, rect, pointPathPA } from '../rndrgen/canvas/primatives';
import { segmentFromPoint, segmentsFromPoints, segArrayToPointsArray } from '../rndrgen/math/segments';
import { pointObjectToPointArray } from '../rndrgen/math/points';
import { logInterval, uvFromAngle } from '../rndrgen/math/math';
import { randomNormalNumberBetween, randomNumberBetween } from '../rndrgen/math/random';
import sourcePng from '../../media/images/kristijan-arsov-woman-400.png';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import { createRectGrid } from '../rndrgen/math/Rectangle';

// Tyler Hobbs how to hack a painting
// https://youtu.be/5R9eywArFTE?t=789

const roughenPoly = (segPoly, detail = 3, maxV = 0.5, spread = 1) => {
    const roughSegment = (seg) => {
        const rMix = randomNormalNumberBetween(0.1, 1.9) + 0.1;
        const rMag = randomNormalNumberBetween(0, seg.length * seg.variance) * spread;

        // Technique from meander
        const tangent = seg.start.sub(seg.end);
        const biangle = tangent.angle() + 1.5708; // + 90 deg
        const bitangent = uvFromAngle(biangle).setMag(1);
        const a = tangent.normalize();
        const b = bitangent.normalize();

        const mVector = a.mix(b, rMix).setMag(rMag);
        const newMid = seg.mid.add(mVector);

        const sa = segmentFromPoint(seg.start, newMid);
        const sb = segmentFromPoint(newMid, seg.end);
        sa.variance = seg.variance * 1.1;
        sb.variance = seg.variance * 1.1;
        return [sa, sb];
    };

    const roughPolySegments = (segments, ittrs, step = 0) => {
        let res = [];
        for (let i = 0; i < segments.length; i++) {
            const s = segments[i];
            // Greater max variance = more spread
            s.variance = s.variance || randomNumberBetween(0.1, maxV);
            res = res.concat(roughSegment(s));
        }
        if (++step > ittrs) {
            return res;
        }
        return roughPolySegments(res, ittrs, step);
    };

    return roughPolySegments(segPoly, detail);
};

const waterColorBrush = (context) => (
    x,
    y,
    size = 50,
    color = 'black',
    polySteps = 4,
    layers = 10,
    detail = 2,
    spreadIncr = 0
) => {
    const maxVariance = 1.1;
    const poly = circlePointsPA(x, y, size, Math.PI / polySteps, 0, true);
    const segpoly = segmentsFromPoints(poly);
    const startingPoly = roughenPoly(segpoly, detail, maxVariance);
    const alphas = logInterval(layers, 1, 100).reverse();
    color = tinycolor(color);

    const strength = 1;
    let spread = 1;
    const alphaDiv = layers / 2;

    let rough;
    let points;
    let currentColor;

    for (let i = 0; i < layers; i++) {
        rough = roughenPoly(startingPoly, detail, maxVariance, spread);
        points = segArrayToPointsArray(rough);
        currentColor = color.clone().setAlpha((alphas[i] * 0.01) / alphaDiv);
        for (let s = 0; s < strength; s++) {
            polygonPA(context)(points, currentColor);
        }
        spread += spreadIncr;
    }

    // pointPathPA(context)(points, color, 1);
    // polygonPA(context)(segArrayToPointsArray(startingPoly), 'blue');
    // polygonPA(context)(segArrayToPointsArray(segpoly), 'green');
};

export const brushShape = () => {
    const config = {
        name: 'brush-shape',
        ...instagram,
    };

    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 25;
    const renderScale = config.scale; // 1 or 2

    const backgroundColor = paperWhite.clone();

    const palette = new Palette();

    const image = new Bitmap(sourcePng);

    let rectangles;

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;
        image.init(canvas, context);

        // rectangles = createRectGrid(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2, tiles, tiles);
        rectangles = createRectGrid(
            margin,
            margin,
            canvasWidth - margin * 2,
            canvasHeight - margin * 2,
            3,
            3,
            margin,
            margin
        );

        background(canvas, context)(backgroundColor.darken(10));
    };

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(backgroundColor);
        // const brushColor = palette.oneOf().clone();

        rectangles.forEach((r) => {
            const x = r.mx;
            const y = r.my;
            const s = r.w * 0.4;
            const brushColor = tinycolor.random(); // palette.oneOf();
            // rect(context)(r.x, r.y, r.w, r.h, 1, tinycolor(`rgba(0,0,0,.1)`));
            waterColorBrush(context)(x, y, s, brushColor, 6, 40, 2, 0.1);
        });

        // const x = randomNumberBetween(0, canvasWidth);
        // const y = randomNumberBetween(0, canvasHeight);
        // const s = randomNormalNumberBetween(5, 50);
        // const brushColor = image.pixelColorFromCanvas(x, y);
        // waterColorBrush(context)(x, y, s, brushColor, 4,10, 2);

        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
