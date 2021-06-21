// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://editor.p5js.org/codingtrain/sketches/18cjVoAX1
// http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
// https://en.wikipedia.org/wiki/Marching_squares#/media/File:Marching_squares_algorithm.svg

import { strokeColor } from '../canvas/canvas';
import { line } from '../canvas/primatives';
import { createRectGrid } from '../math/Rectangle';
import { mapRange } from '../math/math';

export const isoline = (context, rect, smooth = false) => {
    const drawLine = (p1, p2) => line(context)(p1.x, p1.y, p2.x, p2.y);
    const sides = rect.getSides(smooth);
    switch (rect.cornerState) {
        case 1:
        case 14:
            drawLine(sides.left, sides.bottom);
            break;
        case 2:
        case 13:
            drawLine(sides.bottom, sides.right);
            break;
        case 3:
        case 12:
            drawLine(sides.left, sides.right);
            break;
        case 4:
            drawLine(sides.top, sides.right);
            break;
        case 5:
            drawLine(sides.left, sides.top);
            drawLine(sides.bottom, sides.right);
            break;
        case 6:
        case 9:
            drawLine(sides.top, sides.bottom);
            break;
        case 7:
        case 8:
            drawLine(sides.left, sides.top);
            break;
        case 10:
            drawLine(sides.left, sides.bottom);
            drawLine(sides.top, sides.right);
            break;
        case 11:
            drawLine(sides.top, sides.right);
            break;
        case 0:
        case 15:
        default:
            break;
    }
};

/*
const isolowColor = flatColor.clone().darken(2);
const isohighColor = backgroundColor.clone().brighten(10);

const slices = [
    { nmin: -7, nmax: 7, omin: -1, omax: 1, color: isohighColor },
    { nmin: -6, nmax: -4, omin: -1, omax: 1, color: isolowColor },
    { nmin: -4, nmax: -2, omin: -1, omax: 1, color: isolowColor },
    { nmin: -2, nmax: 0, omin: -1, omax: 1, color: isolowColor },
    { nmin: 0, nmax: 2, omin: -1, omax: 1, color: isohighColor },
    { nmin: 2, nmax: 4, omin: -1, omax: 1, color: isohighColor },
    { nmin: 4, nmax: 6, omin: -1, omax: 1, color: isohighColor },
];

renderIsolines(context, canvas, noiseFn, 0, 80, true, slices);
 */

export const renderIsolines = (
    context,
    { width, height },
    noiseFn2d,
    margin = 0,
    resolution = 50,
    smoothing = true,
    slices
) => {
    const squares = createRectGrid(margin, margin, width - margin * 2, height - margin * 2, resolution, resolution);
    slices = slices || [{ nmin: -7, nmax: 7, omin: -1, omax: 1 }];
    squares.forEach((s) => {
        slices.forEach((slice) => {
            s.corners = [s.cornerAPx, s.cornerBPx, s.cornerCPx, s.cornerDPx].map((c) => {
                const noise = noiseFn2d(c.x, c.y);
                return mapRange(slice.nmin, slice.nmax, slice.omin, slice.omax, noise);
            });
            if (slice.color) {
                strokeColor(context)(slice.color);
            }
            isoline(context, s, smoothing);
        });
    });
};
