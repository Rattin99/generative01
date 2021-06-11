// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://editor.p5js.org/codingtrain/sketches/18cjVoAX1
// http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
// https://en.wikipedia.org/wiki/Marching_squares#/media/File:Marching_squares_algorithm.svg

import tinycolor from 'tinycolor2';
import { line, circleFilled, rectFilled, rect, arcQuarter } from '../canvas/primatives';
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

const motifList = ['\\', '/', '-', '|', '+', '+.', 'x.', 'fnw', 'fne', 'fsw', 'fse', 'tn', 'ts', 'te', 'tw'];

// https://observablehq.com/@osteele/truchet-carlson-tiles
// https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/
// Scaling changes by a factor of 2, and the fore/back colors should swap at each change
export const truchet = (context, square, foreColor = 'black', backColor = 'white') => {
    const factor = 3;
    const scale = square.size / factor;
    const tSize = scale * (factor - 1); // square.size - scale;
    const arcRad = square.size / 2;

    // background X
    // context.strokeStyle = tinycolor(backColor).toRgbString();
    // context.lineCap = 'round';
    // context.lineWidth = scale;
    // line(context)(square.x, square.y, square.x2, square.y2);
    // line(context)(square.x, square.y2, square.x2, square.y);

    // rectFilled(context)(square.x, square.y, square.size, square.size, backColor);

    context.strokeStyle = tinycolor(foreColor).toRgbString();
    context.lineCap = 'butt';
    context.lineWidth = scale;
    context.lineJoin = 'round';

    const motif = motifList[square.state];

    switch (motif) {
        case '\\':
            arcQuarter(context)(square.x2, square.y, arcRad, Math.PI / 2);
            arcQuarter(context)(square.x, square.y2, arcRad, Math.PI * 1.5);
            break;
        case '/':
            arcQuarter(context)(square.x, square.y, arcRad, 0);
            arcQuarter(context)(square.x, square.y2, arcRad, Math.PI);
            break;
        case '-':
            rectFilled(context)(square.x, square.y + scale, square.size, scale, foreColor);
            break;
        case '|':
            //
            rectFilled(context)(square.x + scale, square.y, scale, square.size, foreColor);
            break;
        case '+':
            rectFilled(context)(square.x, square.y + scale, square.size, scale, foreColor);
            rectFilled(context)(square.x + scale, square.y, scale, square.size, foreColor);
            break;
        case '+.':
            // default wing background
            break;
        case 'x.':
            rectFilled(context)(square.x, square.y, square.size, square.size, foreColor);
            break;
        case 'fnw':
            arcQuarter(context)(square.x, square.y, arcRad, 0);
            break;
        case 'fne':
            arcQuarter(context)(square.x2, square.y, arcRad, Math.PI / 2);
            break;
        case 'fsw':
            //
            arcQuarter(context)(square.x, square.y2, arcRad, Math.PI * 1.5);
            break;
        case 'fse':
            arcQuarter(context)(square.x, square.y2, arcRad, Math.PI);
            break;
        case 'tn':
            rectFilled(context)(square.x, square.y, square.size, tSize, foreColor);
            break;
        case 'ts':
            rectFilled(context)(square.x, square.y + scale, square.size, tSize, foreColor);
            break;
        case 'te':
            rectFilled(context)(square.x + scale, square.y, tSize, square.size, foreColor);
            break;
        case 'tw':
            rectFilled(context)(square.x, square.y, tSize, square.size, foreColor);
            break;
        case 15:
        default:
            // "x."
            rectFilled(context)(square.x, square.y, square.size, square.size, foreColor);
            break;
    }

    circleFilled(context)(square.x, square.y, scale, backColor);
    circleFilled(context)(square.x2, square.y, scale, backColor);
    circleFilled(context)(square.x2, square.y2, scale, backColor);
    circleFilled(context)(square.x, square.y2, scale, backColor);
    circleFilled(context)(square.mx, square.y, scale / 2, foreColor);
    circleFilled(context)(square.x2, square.my, scale / 2, foreColor);
    circleFilled(context)(square.mx, square.y2, scale / 2, foreColor);
    circleFilled(context)(square.x, square.ym, scale / 2, foreColor);
};
