import { create2dNoiseAbs, oneOf, randomWholeBetween } from '../math/random';
import { round2 } from '../math/math';
import { pointDistance } from '../math/points';

export class RoseCurve {
    constructor(x, y, radius, angle, speed, noise) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.radius = radius;
        this.speed = speed || 1;
        this.angle = angle || 0;
        this.noise = noise || create2dNoiseAbs(x, y);

        // Randomize some noise possibilities
        this.xa = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
        this.xb = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
        this.ya = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
        this.yb = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
    }

    get size() {
        return this.radius * 2;
    }

    get centerX() {
        return this.originX + this.radius;
    }

    get centerY() {
        return this.originY + this.radius;
    }

    get distFromCenter() {
        return pointDistance({ x: this.centerX, y: this.centerY }, { x: this.x, y: this.y });
    }

    // export const circleX = (theta, amp, freq) => Math.cos(theta / freq) * amp;
    // export const circleY = (theta, amp, freq) => Math.sin(theta / freq) * amp;

    // k is # of petals
    // https://en.wikipedia.org/wiki/Rose_(mathematics)
    // http://xahlee.info/SpecialPlaneCurves_dir/Rose_dir/rose.html
    roseX(k = 1, a = 1, b = 1) {
        return this.radius * Math.cos(k * this.angle * a) * Math.cos(this.angle * b);
    }

    roseY(k = 1, a = 1, b = 1) {
        this.radius * Math.cos(k * this.angle * a) * Math.sin(this.angle * b);
    }
}
