import tinycolor from 'tinycolor2';
import { randomWholeBetween } from '../math/random';

export const lowestYPA = (arry) =>
    arry.reduce((acc, p) => {
        if (p[1] < acc) {
            acc = p[1];
        }
        return acc;
    }, 0);

export const highestYPA = (arry) =>
    arry.reduce((acc, p) => {
        if (p[1] > acc) {
            acc = p[1];
        }
        return acc;
    }, 0);

const drawSegment = (context, sideA, sideB, sourceColor, stroke = false, thickness = 1) => {
    const segStartX = sideA[0][0];
    const segStartY = sideA[0][1];
    const segEndX = sideB[0][0] + thickness;
    const segEndY = sideB[0][1] + thickness;

    const color = sourceColor.clone();

    const gradient = context.createLinearGradient(0, lowestYPA(sideA), 0, highestYPA(sideB) + thickness);

    // const gradient = context.createLinearGradient(0, segStartY - thickness, 0, segEndY + thickness);

    gradient.addColorStop(0, color.toRgbString());
    // gradient.addColorStop(0.5, color.toRgbString());
    gradient.addColorStop(1, color.clone().darken(20).saturate(10).toRgbString());

    context.beginPath();
    context.moveTo(segStartX, segStartY);

    sideA.forEach((point) => {
        context.lineTo(point[0], point[1]);
    });

    sideB.forEach((point) => {
        context.lineTo(point[0], point[1] + thickness);
    });

    context.lineTo(segStartX, segStartY);

    if (stroke) {
        // context.strokeStyle = color.darken(70).toRgbString();
        // context.lineWidth = 1;
        context.stroke();
    }

    context.fillStyle = gradient;
    context.fill();
};

/*
sideA and B are an array of points [[x,y], [x,y], ...] that are roughly parallel to each other
segments is a valuve between 1 and n determining how to break up the ribbon
 */

export const drawRibbon = (context) => (sideA, sideB, color, segments = 1, stroke = false, thickness = 1) => {
    const segmentGap = 1;
    const segmentData = [];

    let left = sideA.length;
    let start = 0;

    for (let i = 0; i < segments; i++) {
        const len = segments === 1 ? sideA.length : randomWholeBetween(1, left / 2);
        segmentData.push({
            sideA: sideA.slice(start, start + len),
            sideB: sideB.slice(start, start + len).reverse(),
        });
        start += len + segmentGap;
        left -= len + segmentGap;
    }

    segmentData.forEach((s) => {
        drawSegment(context, s.sideA, s.sideB, color, stroke, thickness);
    });
};
