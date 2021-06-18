// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://editor.p5js.org/codingtrain/sketches/18cjVoAX1
// http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
// https://en.wikipedia.org/wiki/Marching_squares#/media/File:Marching_squares_algorithm.svg

import { line } from '../canvas/primatives';

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
