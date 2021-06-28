import tinycolor from 'tinycolor2';
import { randomWholeBetween, oneOf } from '../math/random';
import { sumArray } from '../utils';
import { percentage } from '../math/math';

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

export const ribbonSegment = (context) => (sideA, sideB, sourceColor, stroke = false, thickness = 1) => {
    const segStartX = sideA[0][0];
    const segStartY = sideA[0][1];
    const segEndX = sideB[0][0] + thickness;
    const segEndY = sideB[0][1] + thickness;

    const color = sourceColor.clone();

    const gradient = context.createLinearGradient(0, lowestYPA(sideA), 0, highestYPA(sideB) + thickness);
    // const gradient = context.createLinearGradient(0, segStartY - thickness, 0, segEndY + thickness);
    // gradient.addColorStop(0, color.toRgbString());
    gradient.addColorStop(0.5, color.toRgbString());
    gradient.addColorStop(1, color.clone().darken(5).saturate(10).toRgbString());

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
    context.closePath();
};

/*
sideA and B are an array of points [[x,y], [x,y], ...] that are roughly parallel to each other
segments is a value between 1 and n determining how to break up the ribbon
 */

export const ribbonSegmented = (context) => (
    sideA,
    sideB,
    color,
    { segments, gap, colors },
    stroke = false,
    thickness = 0
) => {
    if (segments === 1) {
        ribbonSegment(context)(sideA, sideB.reverse(), color, stroke, thickness);
        return;
    }

    // calculate segment sizes based on random percentages of the line length
    const segmentGap = gap || 0;
    const minSegPct = 5;
    const minSegLength = segmentGap + minSegPct;
    const segmentLengths = [];
    let lenPctLeft = 100 - minSegLength;
    for (let k = 0; k < segments - 1; k++) {
        if (lenPctLeft > minSegPct) {
            const pct = randomWholeBetween(minSegLength, lenPctLeft / 2);
            segmentLengths.push(percentage(sideA.length, pct));
            lenPctLeft -= pct;
        }
    }
    // add whatever is left to the end
    segmentLengths.push(sideA.length - sumArray(segmentLengths));

    // break up the sides in to points based on segment lengths
    let pos = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
        let end = pos + segmentLengths[i];
        if (i < segmentLengths.length - 1) {
            end -= segmentGap;
        }

        // TODO color is a random pick from segment colors

        let rcolor = color;
        if (colors) {
            rcolor = tinycolor(oneOf(colors));
        }

        ribbonSegment(context)(sideA.slice(pos, end), sideB.slice(pos, end).reverse(), rcolor, stroke, thickness);
        pos += segmentLengths[i];
    }
};
