/*
Flow field inside?
Particle physics inside
Border
Clip to no overflow?
 */

import tinycolor from 'tinycolor2';
import { randomWholeBetween, randomNormalWholeBetween } from './math';
import { defaultValue } from './utils';
import { drawRect, drawRectFilled, resetStyles } from './canvas';
import { Point } from './Point';

const defaultMP = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const defaultFlow = (x, y) => 0;

let boxIndex = 0;

export class Box {
    #backgroundColor;

    constructor(props, children = []) {
        this.name = `box${boxIndex++}`;
        this.canvas = props.canvas;
        this.context = props.context;
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.rotation = defaultValue(props, 'rotation', 0);
        this.#backgroundColor = tinycolor(defaultValue(props, 'backgroundColor', 'white'));
        this.padding = defaultValue(props, 'padding', defaultMP);
        this.clip = defaultValue(props, 'clip', true);
        this.flowField = defaultValue(props, 'flowField', defaultFlow);
        this.children = children;
    }

    get x2() {
        return this.x + this.width;
    }

    get y2() {
        return this.y + this.height;
    }

    get innerWidth() {
        return this.width - this.padding.left - this.padding.right;
    }

    get innerHeight() {
        return this.height - this.padding.top - this.padding.bottom;
    }

    get centerPoint() {
        return new Point(this.x + Math.round(this.width / 2), this.y + Math.round(this.height / 2));
    }

    get backgroundColor() {
        return this.#backgroundColor.clone();
    }

    set backgroundColor(c) {
        this.#backgroundColor = tinycolor(c);
    }

    fill(color) {
        color = color || this.backgroundColor;
        drawRectFilled(this.context)(this.x, this.y, this.width, this.height, color);
    }

    erase() {
        this.context.clearRect(this.x, this.y, this.width, this.height);
    }

    outline(thickness, color) {
        this.context.strokeStyle = tinycolor(color).toRgbString();
        this.context.lineWidth = thickness;
        this.context.rect(this.x, this.y, this.width, this.height);
        this.context.stroke();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip
    // https://dustinpfister.github.io/2019/08/14/canvas-save/
    // https://dustinpfister.github.io/2019/10/08/canvas-clip/
    createClip() {
        this.context.save();
        const region = new Path2D();
        region.rect(this.x, this.y, this.width, this.height);
        this.context.clip(region);
    }

    removeClip() {
        this.context.restore();
    }

    translateX(x) {
        return this.x + x;
    }

    translateY(y) {
        return this.y + y;
    }

    translateInto(point) {
        return new Point(this.translateX(point.x), this.translateY(point.y));
    }

    translateOut(point) {
        return new Point(point.x - this.x, point.y - this.y);
    }

    randomPointInside(distribution = 'whole') {
        const edgeBuffer = 10;
        let point = new Point(
            randomWholeBetween(edgeBuffer, this.width - edgeBuffer),
            randomWholeBetween(edgeBuffer, this.height - edgeBuffer)
        );
        if (distribution === 'normal') {
            point = new Point(
                randomNormalWholeBetween(edgeBuffer, this.width - edgeBuffer),
                randomNormalWholeBetween(edgeBuffer, this.height - edgeBuffer)
            );
        }
        return point;
    }

    isInside(point) {
        return point.x >= this.x && point.x <= this.x2 && point.y >= this.y && point.y <= this.y2;
    }

    isOutside(point) {
        return !this.isInside(point);
    }

    clipPoint(point) {
        const np = new Point(point.x, point.y);
        if (point.x < this.x) np.x = this.x;
        if (point.x > this.x2) np.x = this.x2;
        if (point.y < this.y) np.y = this.y;
        if (point.y > this.y2) np.y = this.y2;
        return np;
    }

    wrapPoint(point) {
        const np = new Point(point.x, point.y);
        if (point.x < this.x) np.x = this.x2;
        if (point.x > this.x2) np.x = this.x;
        if (point.y < this.y) np.y = this.y2;
        if (point.y > this.y2) np.y = this.y;
        return np;
    }

    particleEdgeBounce = (particle) => {
        const psize = particle.radius;
        if (particle.x + psize > this.x2) {
            particle.x = this.x2 - psize;
            particle.reverseVelocityX();
        }
        if (particle.x - psize < this.x) {
            particle.x = this.x + psize;
            particle.reverseVelocityX();
        }
        if (particle.y + psize > this.y2) {
            particle.y = this.y2 - psize;
            particle.reverseVelocityY();
        }
        if (particle.y - psize < this.y) {
            particle.y = this.y + psize;
            particle.reverseVelocityY();
        }
    };

    particleEdgeWrap = (particle) => {
        const psize = particle.radius;
        if (particle.x + psize > this.x2) {
            particle.x = this.x + psize;
        }
        if (particle.x - psize < this.x) {
            particle.x = this.x2 - psize;
        }
        if (particle.y + psize > this.y2) {
            particle.y = this.y + psize;
        }
        if (particle.y - psize < this.y) {
            particle.y = this.y2 - psize;
        }
    };
}
