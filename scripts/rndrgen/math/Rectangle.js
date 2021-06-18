import { lerp } from './math';
import { randomNormalWholeBetween } from './random';

const point = (x, y) => ({ x, y });
const midPoint = (a, b) => Math.round((b - a) / 2) + a;

// a...d are 0 or 1
const getStateFromCorners = (a, b, c, d) => a * 8 + b * 4 + c * 2 + d * 1;

// a and b are -1 to 1
const lerpAmt = (a, b) => (1 - (a + 1)) / (b + 1 - (a + 1));

/*
Corners and lerps are for marching squares

Corners
  a---b
  |   |
  d---c
 */
export class Rectangle {
    constructor(x, y, width, height, corners) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.x2 = x + width;
        this.y2 = y + height;
        this.mx = midPoint(this.x, this.x2);
        this.my = midPoint(this.y, this.y2);
        // 1 or -1
        this.phase = 1;
        // -1 to 1 noise values
        this.corners = corners || [0, 0, 0, 0];
        // array of subdivisions, [rect]
        this.children = [];
        this.parent = null;
        this.depth = 0;
    }

    // 0 to 15
    get cornerState() {
        return getStateFromCorners(
            Math.ceil(this.corners[0]),
            Math.ceil(this.corners[1]),
            Math.ceil(this.corners[2]),
            Math.ceil(this.corners[3])
        );
    }

    get cornerAverage() {
        return (this.average = (this.corners[0] + this.corners[2] + this.corners[2] + this.corners[3]) / 4);
    }

    get center() {
        return point(this.mx, this.my);
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
        return point(lerp(this.x, this.x2, lerpAmt(this.corners[0], this.corners[1])), this.y);
    }

    get lerpRight() {
        return point(this.x2, lerp(this.y, this.y2, lerpAmt(this.corners[1], this.corners[2])));
    }

    get lerpBottom() {
        return point(lerp(this.x, this.x2, lerpAmt(this.corners[3], this.corners[2])), this.y2);
    }

    get lerpLeft() {
        return point(this.x, lerp(this.y, this.y2, lerpAmt(this.corners[0], this.corners[3])));
    }

    get cornerAPx() {
        return point(this.x, this.y);
    }

    get cornerBPx() {
        return point(this.x2, this.y);
    }

    get cornerCPx() {
        return point(this.x2, this.y2);
    }

    get cornerDPx() {
        return point(this.x, this.y2);
    }

    getSides(smooth) {
        return {
            top: smooth ? this.lerpTop : this.midTop,
            right: smooth ? this.lerpRight : this.midRight,
            bottom: smooth ? this.lerpBottom : this.midBottom,
            left: smooth ? this.lerpLeft : this.midLeft,
        };
    }

    randomPointInside() {
        const x = randomNormalWholeBetween(0, this.w) + this.x;
        const y = randomNormalWholeBetween(0, this.h) + this.y;
        return point(x, y);
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

    divideQuad() {
        const halfW = this.w / 2;
        const halfH = this.h / 2;

        this.children.push(new Rectangle(this.x, this.y, halfW, halfH));
        this.children.push(new Rectangle(this.x + halfW, this.y, halfW, halfH));
        this.children.push(new Rectangle(this.x, this.y + halfH, halfW, halfH));
        this.children.push(new Rectangle(this.x + halfW, this.y + halfH, halfW, halfH));
        this.children.forEach((c) => {
            c.phase *= -1;
            c.parent = this;
            c.depth = this.depth + 1;
        });
    }
}

export class Square extends Rectangle {
    constructor(x, y, size, corners = [0, 0, 0, 0]) {
        super(x, y, size, size, corners);
        this.size = size;
    }
}

export const createRectGrid = (x, y, w, h, cols = 2, rows = 2, colgap = 0, rowgap = 0) => {
    const rects = [];
    const colw = Math.round((w - (cols - 1) * colgap) / cols);
    const rowh = Math.round((h - (rows - 1) * rowgap) / rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const rx = i * (colw + colgap) + x;
            const ry = j * (rowh + rowgap) + y;
            rects.push(new Rectangle(rx, ry, colw, rowh));
        }
    }

    return rects;
};
