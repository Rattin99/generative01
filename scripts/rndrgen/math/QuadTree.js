/*
Originally from Coding Train https://www.youtube.com/watch?v=OJxEcs0w_kE&t=0s
https://georgefrancis.dev/writing/generative-grid-layouts-with-quadtrees/
 */

import { Rectangle } from './Rectangle';
import { pixel, rect } from '../canvas/primatives';
import { randomWholeBetween } from './random';
import { truchet } from '../systems/truchetTiles';

/*
TODO
- [ ] Max depth
- [ ] margin between subdivisions


Corners
nw---ne
|     |
sw---se

Rect, corners
  a---b
  |   |
  d---c
*/
export class QuadTree {
    constructor(boundary, capacity = 4, margin = 0, maxd = 0) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;

        this.maxDepth = maxd;
        this.margin = margin;

        // 1 or -1
        this.phase = 1;
        this.depth = 0;

        this.northwest = undefined;
        this.northeast = undefined;
        this.southwest = undefined;
        this.southeast = undefined;
    }

    get subdivisions() {
        return this.divided ? [this.northwest, this.northeast, this.southeast, this.southwest] : [];
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;

        const halfW = w / 2 + this.margin;
        const halfH = h / 2 + this.margin;

        const divWidth = w / 2 - this.margin;
        const divHeight = h / 2 - this.margin;

        const nw = new Rectangle(x, y, divWidth, divHeight);
        const ne = new Rectangle(x + halfW, y, divWidth, divHeight);
        const sw = new Rectangle(x, y + halfH, divWidth, divHeight);
        const se = new Rectangle(x + halfW, y + halfH, divWidth, divHeight);

        this.northwest = new QuadTree(nw, this.capacity, this.margin, this.maxDepth);
        this.northeast = new QuadTree(ne, this.capacity, this.margin, this.maxDepth);
        this.southwest = new QuadTree(sw, this.capacity, this.margin, this.maxDepth);
        this.southeast = new QuadTree(se, this.capacity, this.margin, this.maxDepth);

        this.divided = true;

        this.subdivisions.forEach((s) => {
            s.phase = this.phase * -1;
            s.depth = this.depth + 1;
        });
    }

    insert(p) {
        if (!this.boundary.contains(p)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(p);
            return true;
        }

        // if (this.maxDepth && this.depth === this.maxDepth) return;

        if (!this.divided) {
            this.subdivide();
        }
        return (
            this.northwest.insert(p) || this.northeast.insert(p) || this.southwest.insert(p) || this.southeast.insert(p)
        );
    }

    query(rectangle, arry = []) {
        if (!this.boundary.intersects(rectangle)) return;

        this.points.forEach((p) => {
            if (rectangle.contains(p)) {
                arry.push(p);
            }
        });

        if (this.divided) {
            this.subdivisions.forEach((s) => {
                s.query(rectangle, arry);
            });
        }

        return arry;
    }

    flatten(arry = []) {
        if (this.divided) {
            this.subdivisions.forEach((s) => {
                s.flatten(arry);
            });
        } else {
            arry.push(this);
        }

        return arry;
    }
}

export const flatDepthSortedAsc = (qt) => qt.flatten().sort((a, b) => a.depth - b.depth);

export const quadTreeFromPoints = (boundary, capacity, points, margin = 0, maxd = 0) => {
    const quadtree = new QuadTree(boundary, capacity, margin, maxd);
    points.forEach((p) => quadtree.insert(p));
    return quadtree;
};

export const show = (context) => (qt) => {
    const { x, y, w, h } = qt.boundary;
    if (qt.phase === -1) {
        rect(context)(x, y, w, h, 0.5, 'black');
    } else {
        rect(context)(x, y, w, h, 0.5, 'red');
    }

    qt.points.forEach((p) => {
        pixel(context)(p.x, p.y, 'black', 'square', 2);
    });
    if (qt.divided) {
        qt.subdivisions.forEach((s) => {
            show(context)(s);
        });
    }
};
