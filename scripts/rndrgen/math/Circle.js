import { point, pointDistance } from './points';
import { randomNumberBetween, randomWholeBetween } from './random';
import { TAU } from './math';

export class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.diameter = radius * 2;
        // array of subdivisions
        this.children = [];
        // 1 or -1
        this.phase = 1;
        this.depth = 0;
    }

    get center() {
        return point(this.x, this.y);
    }

    get midTop() {
        return point(this.x, this.y - this.radius);
    }

    get midRight() {
        return point(this.x + this.radius, this.y);
    }

    get midBottom() {
        return point(this.x, this.y + this.radius);
    }

    get midLeft() {
        return point(this.x - this.radius, this.y);
    }

    get bounds() {
        return {
            top: this.y - this.radius,
            right: this.x + this.radius,
            bottom: this.y + this.radius,
            left: this.x - this.radius,
        };
    }

    randomPointInside() {
        const radius = randomWholeBetween(0, this.radius);
        const angle = randomNumberBetween(0, TAU);
        const x = radius * Math.cos(angle) + this.x;
        const y = radius * Math.sin(angle) + this.y;
        return point(x, y);
    }

    contains(p, buffer = 0, onEdge = false) {
        const dist = Math.abs(pointDistance(p, this.center));
        return onEdge ? dist <= this.radius + buffer : dist < this.radius + buffer;
    }

    intersects(circ, buffer = 0) {
        const dist = Math.abs(pointDistance(this.center, circ.center));
        const rads = this.radius + circ.radius;
        return dist - buffer < rads;
    }

    // https://en.wikipedia.org/wiki/Circle_packing_in_a_circle
    subdivide(radian = 0) {
        const pos = this.radius * (2 / 3);
        const radius = this.radius * (1 / 3);
        const step = 1.5708; // 90 degrees
        let center = radian;

        this.children.push(new Circle(this.x, this.y, radius));

        for (let i = 0; i < 4; i++) {
            const x = pos * Math.cos(center) + this.x;
            const y = pos * Math.sin(center) + this.y;
            this.children.push(new Circle(x, y, radius));
            center += step;
        }

        this.children.forEach((c) => {
            c.phase *= -1;
            c.parent = this;
            c.depth = this.depth + 1;
        });
    }
}

// For circle packing
// https://www.youtube.com/watch?v=QHEQuoIKgNE&t=1s
export class PackCircle extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
        this.growing = true;
    }

    grow() {
        if (this.growing) this.radius += 1;
    }

    edges(rect) {
        const b = this.bounds;
        return b.left < rect.x || b.right > rect.x2 || b.top < rect.y || b.bottom > rect.y2;
    }
}
