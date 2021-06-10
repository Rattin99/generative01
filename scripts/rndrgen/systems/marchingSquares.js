// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://editor.p5js.org/codingtrain/sketches/18cjVoAX1
// http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
// https://en.wikipedia.org/wiki/Marching_squares#/media/File:Marching_squares_algorithm.svg

import tinycolor from 'tinycolor2';
import { line, circleFilled, rectFilled, rect } from '../canvas/primatives';
import { lerp, snapNumber } from '../math/math';

const point = (x, y) => ({ x, y });
const midPoint = (a, b) => (b - a) / 2 + a;

// a...d are 0 or 1
const getState = (a, b, c, d) => a * 8 + b * 4 + c * 2 + d * 1;

// a and b are -1 to 1
const lerpAmt = (a, b) => (1 - (a + 1)) / (b + 1 - (a + 1));

/*
  a---b
  |   |
  d---c
 */
export class mSquare {
    constructor(x, y, size, a, b, c, d) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.x2 = x + size;
        this.y2 = y + size;
        this.mx = midPoint(this.x, this.x2);
        this.my = midPoint(this.y, this.y2);
        // -1 to 1 noise values
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        // 0 to 15
        this.state = getState(Math.ceil(a), Math.ceil(b), Math.ceil(c), Math.ceil(d));
    }

    get midTop() {
        return point(this.mx, this.y);
    }

    get midRight() {
        return point(this.x2, this.my);
    }

    get midBottom() {
        return point(this.mx, this.y2);
    }

    get midLeft() {
        return point(this.x, this.my);
    }

    get lerpTop() {
        return point(lerp(this.x, this.x2, lerpAmt(this.a, this.b)), this.y);
    }

    get lerpRight() {
        return point(this.x2, lerp(this.y, this.y2, lerpAmt(this.b, this.c)));
    }

    get lerpBottom() {
        return point(lerp(this.x, this.x2, lerpAmt(this.d, this.c)), this.y2);
    }

    get lerpLeft() {
        return point(this.x, lerp(this.y, this.y2, lerpAmt(this.a, this.d)));
    }

    getSides(smooth) {
        return {
            top: smooth ? this.lerpTop : this.midTop,
            right: smooth ? this.lerpRight : this.midRight,
            bottom: smooth ? this.lerpBottom : this.midBottom,
            left: smooth ? this.lerpLeft : this.midLeft,
        };
    }
}

export const isoline = (context, square, smooth = false) => {
    const drawLine = (p1, p2) => line(context)(p1.x, p1.y, p2.x, p2.y);

    const sides = square.getSides(smooth);

    switch (square.state) {
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
// tl
arc(context, square.x, square.y, arcRad, arcSize, foreColor, 0);
// tr
arc(context, square.x2, square.y, arcRad, arcSize, foreColor, Math.PI / 2);
// bl
arc(context, square.x, square.y2, arcRad, arcSize, foreColor, Math.PI * 1.5);
// br
arc(context, square.x, square.y2, arcRad, arcSize, foreColor, Math.PI);
 */
const arc = (context, x, y, radius, thick, color, theta, clockWise = false) => {
    const startR = snapNumber(Math.PI / 2, theta);
    const endR = startR + Math.PI / 2;
    context.strokeStyle = tinycolor(color).toRgbString();
    context.lineCap = 'butt';
    context.lineWidth = thick;
    context.beginPath();
    context.arc(x, y, radius, startR, endR, clockWise);
    context.stroke();
};

// https://questionsindataviz.com/2021/03/03/what-are-truchet-tiles/
// https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/
export const truchet = (context, square) => {
    const foreColor = 'black';
    const backColor = 'white';
    const scale = square.size / 3;
    const arcRad = square.size / 2;
    const arcSize = scale;

    // rectFilled(context)(square.x, square.y, square.size, square.size, backColor);

    switch (square.state) {
        case 0:
            arc(context, square.x2, square.y, arcRad, arcSize, foreColor, Math.PI / 2);
            arc(context, square.x, square.y2, arcRad, arcSize, foreColor, Math.PI * 1.5);
            break;
        case 1:
            arc(context, square.x, square.y, arcRad, arcSize, foreColor, 0);
            arc(context, square.x, square.y2, arcRad, arcSize, foreColor, Math.PI);
            break;
        case 2:
            rectFilled(context)(square.x, square.y + scale, square.size, scale, foreColor);
            break;
        case 3:
            rectFilled(context)(square.x + scale, square.y, scale, square.size, foreColor);
            break;
        case 4:
            rectFilled(context)(square.x, square.y + scale, square.size, scale, foreColor);
            rectFilled(context)(square.x + scale, square.y, scale, square.size, foreColor);
            break;
        case 6:
            rectFilled(context)(square.x, square.y, square.size, square.size, foreColor);
            break;
        case 7:
            arc(context, square.x, square.y, arcRad, arcSize, foreColor, 0);
            break;
        case 8:
            arc(context, square.x2, square.y, arcRad, arcSize, foreColor, Math.PI / 2);
            break;
        case 9:
            arc(context, square.x, square.y2, arcRad, arcSize, foreColor, Math.PI * 1.5);
            break;
        case 10:
            arc(context, square.x, square.y2, arcRad, arcSize, foreColor, Math.PI);
            break;
        case 11:
            rectFilled(context)(square.x, square.y, square.size, square.size - scale, foreColor);
            break;
        case 12:
            rectFilled(context)(square.x, square.y + scale, square.size, square.size - scale, foreColor);
            break;
        case 13:
            rectFilled(context)(square.x + scale, square.y, square.size - scale, square.size, foreColor);
            break;
        case 14:
            rectFilled(context)(square.x, square.y, square.size - scale, square.size, foreColor);
            break;
        case 5:
        case 15:
        default:
            break;
    }

    // wing
    circleFilled(context)(square.x, square.y, scale, backColor);
    circleFilled(context)(square.x2, square.y, scale, backColor);
    circleFilled(context)(square.x2, square.y2, scale, backColor);
    circleFilled(context)(square.x, square.y2, scale, backColor);
    circleFilled(context)(square.mx, square.y, scale / 2, foreColor);
    circleFilled(context)(square.x2, square.my, scale / 2, foreColor);
    circleFilled(context)(square.mx, square.y2, scale / 2, foreColor);
    circleFilled(context)(square.x, square.ym, scale / 2, foreColor);
};
