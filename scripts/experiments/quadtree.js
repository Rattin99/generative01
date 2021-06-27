import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { point } from '../rndrgen/math/points';
import { Rectangle } from '../rndrgen/math/Rectangle';
import { random, randomN } from '../rndrgen/math/random';
import { pixel, rect } from '../rndrgen/canvas/primatives';

/*
From Coding Train
 */

const divs = 0;
/*
Corners
nw---ne
|     |
sw---se

  a---b
  |   |
  d---c
*/
class QuadTree {
    constructor(boundary, capacity = 4) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;

        this.northwest = undefined;
        this.northeast = undefined;
        this.southwest = undefined;
        this.southeast = undefined;
    }

    get subdivisions() {
        return [this.northwest, this.northeast, this.southeast, this.southwest];
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;

        const halfW = w / 2;
        const halfH = h / 2;

        const nw = new Rectangle(x, y, halfW, halfH);
        const ne = new Rectangle(x + halfW, y, halfW, halfH);
        const sw = new Rectangle(x, y + halfH, halfW, halfH);
        const se = new Rectangle(x + halfW, y + halfH, halfW, halfH);

        this.northwest = new QuadTree(nw, this.capacity);
        this.northeast = new QuadTree(ne, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);

        this.divided = true;
    }

    insert(p) {
        if (!this.boundary.contains(p)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(p);
            return true;
        }
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
            // this.northeast.query(rectangle, arry);
            // this.northwest.query(rectangle, arry);
            // this.southeast.query(rectangle, arry);
            // this.southwest.query(rectangle, arry);
            this.subdivisions.forEach((s) => {
                if (s) {
                    s.query(rectangle, arry);
                }
            });
        }

        return arry;
    }
}

const show = (context) => (qt) => {
    const { x, y, w, h } = qt.boundary;
    rect(context)(x, y, w, h, 0.5, 'black');
    qt.points.forEach((p) => {
        pixel(context)(p.x, p.y, 'black', 'square', 2);
    });
    if (qt.divided) {
        if (qt.northwest) show(context)(qt.northwest);
        if (qt.northeast) show(context)(qt.northeast);
        if (qt.southwest) show(context)(qt.southwest);
        if (qt.southeast) show(context)(qt.southeast);
    }
};

export const quadtree01 = () => {
    const config = {
        name: 'quadtree01',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    const renderScale = config.scale; // 1 or 2

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    let qt;

    const setup = ({ canvas, context }) => {
        console.log('set up quad tree');
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;

        const boundary = new Rectangle(0, 0, canvasWidth, canvasHeight);
        qt = new QuadTree(boundary, 4);

        for (let i = 0; i < 1000; i++) {
            const p = point(randomN(canvasWidth), randomN(canvasHeight));
            qt.insert(p);
        }

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)(backgroundColor);

        show(context)(qt);

        const qrtr = canvasWidth / 4;
        const testrect = new Rectangle(mouse.x, mouse.y, 200, 200);

        rect(context)(testrect.x, testrect.y, testrect.w, testrect.h);

        const found = qt.query(testrect);
        found.forEach((p) => {
            pixel(context)(p.x, p.y, 'red', 'circle', 3);
        });

        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
