import { lerp } from './math';

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
export class Rectangle {
    constructor(x, y, width, height, a, b, c, d) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.x2 = x + width;
        this.y2 = y + height;
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

    contains(p) {
        return p.x >= this.x - this.w && p.x < this.x + this.w && p.y >= this.y - this.h && p.y < this.y + this.h;
    }

    intersects(rect) {
        return !(
            rect.x - rect.w > this.x + this.w ||
            rect.x + rect.w < this.x - this.w ||
            rect.y - rect.h > this.y + this.h ||
            rect.y + rect.h < this.y - this.h
        );
    }
}
