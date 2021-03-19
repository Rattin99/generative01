import tinycolor from 'tinycolor2';
import { mapRange, pointOnCircle } from './math';
import { drawLine } from './canvas';
import { lineSlope } from './lineSegments';

/*
ctx.lineWidth = oxbowWeight;
ctx.strokeStyle = oxbowColor.toRgbString();
bezierCurveFromPoints(ctx)(a2pA(oxpoints));
 */
// There's BUG where it spikes Y pos
// https://www.geeksforgeeks.org/how-to-draw-smooth-curve-through-multiple-points-using-javascript/
export const bezierCurveFromPoints = (context) => (points, f, t) => {
    if (typeof f === 'undefined') f = 0.3;
    if (typeof t === 'undefined') t = 0.6;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    let m = 0;
    let dx1 = 0;
    let dy1 = 0;

    let preP = points[0];

    for (let i = 1; i < points.length; i++) {
        const curP = points[i];
        const nexP = points[i + 1];
        let dx2;
        let dy2;
        if (nexP) {
            m = lineSlope(preP, nexP);
            dx2 = (nexP.x - curP.x) * -f;
            dy2 = dx2 * m * t;
        } else {
            dx2 = 0;
            dy2 = 0;
        }

        context.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);

        dx1 = dx2;
        dy1 = dy2;
        preP = curP;
    }
    context.stroke();
};

// Spikes is an array of angles
export const drawSpikeCircle = (context) => ({ x, y, radius, color }, spikes, spikeLength = 5) => {
    const circleStroke = 1;
    const spikeStroke = 2;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = circleStroke;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
    for (let s = 0; s < spikes.length; s++) {
        const pointA = pointOnCircle(x, y, radius, spikes[s]);
        const pointB = pointOnCircle(x, y, radius + spikeLength, spikes[s]);
        context.strokeStyle = color.toRgbString();
        drawLine(context)(pointA.x, pointA.y, pointB.x, pointB.y, spikeStroke);
    }
};

export const drawPathRibbon = (context) => (path, color, thickness = 1, stroke = false) => {
    // const rColor = tinycolor(color).clone();
    // const gradient = context.createLinearGradient(0, startY, 0, maxY);
    // gradient.addColorStop(0, colorLinesTop.toRgbString());
    // gradient.addColorStop(1, colorLinesBottom.toRgbString());

    context.beginPath();
    context.moveTo(path[0], path[0]);
    path.forEach((point, i) => {
        const x = point[0];
        const y = point[1];
        context.lineTo(x, y);
    });
    path.reverse().forEach((point, i) => {
        const x = point[0];
        const y = point[1];
        const distFromCenter = Math.abs(path.length / 2 - i);
        const size = mapRange(0, path.length / 2, 1, thickness, distFromCenter);
        context.lineTo(x + size, y + size);
    });
    context.closePath();

    // if (stroke) {
    //     context.strokeStyle = rColor.darken(70).toRgbString();
    //     context.lineWidth = 0.75;
    //     context.stroke();
    // }

    // context.fillStyle = gradient;
    context.fillStyle = tinycolor(color).toRgbString();
    context.fill();
};
