// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://editor.p5js.org/codingtrain/sketches/18cjVoAX1
// http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
// https://en.wikipedia.org/wiki/Marching_squares#/media/File:Marching_squares_algorithm.svg

import { line } from '../canvas/primatives';
import { lerp } from '../math/math';

const point = (x, y) => ({ x, y });
const midPoint = (a, b) => (b - a) / 2 + a;

// a...d are 0 or 1
const getState = (a, b, c, d) => a * 8 + b * 4 + c * 2 + d * 1;

// a and b are -1 to 1
const lerpAmt = (a, b) => (1 - (a + 1)) / (b + 1 - (a + 1));

export const isoline = (context, x, y, x2, y2, a, b, c, d, smooth = false) => {
    const state = getState(Math.ceil(a), Math.ceil(b), Math.ceil(c), Math.ceil(d));
    const drawLine = (p1, p2) => line(context)(p1.x, p1.y, p2.x, p2.y);

    const mx = midPoint(x, x2);
    const my = midPoint(y, y2);

    const midTop = point(mx, y);
    const midRight = point(x2, my);
    const midBottom = point(mx, y2);
    const midLeft = point(x, my);

    if (smooth) {
        midTop.x = lerp(x, x2, lerpAmt(a, b));
        midRight.y = lerp(y, y2, lerpAmt(b, c));
        midBottom.x = lerp(x, x2, lerpAmt(d, c));
        midLeft.y = lerp(y, y2, lerpAmt(a, d));
    }

    switch (state) {
        case 1:
        case 14:
            drawLine(midLeft, midBottom);
            break;
        case 2:
        case 13:
            drawLine(midBottom, midRight);
            break;
        case 3:
        case 12:
            drawLine(midLeft, midRight);
            break;
        case 4:
            drawLine(midTop, midRight);
            break;
        case 5:
            drawLine(midLeft, midTop);
            drawLine(midBottom, midRight);
            break;
        case 6:
        case 9:
            drawLine(midTop, midBottom);
            break;
        case 7:
        case 8:
            drawLine(midLeft, midTop);
            break;
        case 10:
            drawLine(midLeft, midBottom);
            drawLine(midTop, midRight);
            break;
        case 11:
            drawLine(midTop, midRight);
            break;
        case 0:
        case 15:
        default:
            break;
    }
};

// https://questionsindataviz.com/2021/03/03/what-are-truchet-tiles/
// https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/
export const truchet = () => {};
