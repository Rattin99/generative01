import tinycolor from 'tinycolor2';
import { background, connectParticles, drawMouse, drawParticlePoint, drawPointTrail } from '../lib/canvas';
import { create2dNoise, mapRange, pointDistance, randomNumberBetween } from '../lib/math';

/*
Based on Coding Challenge #116​: Lissajous Curve Table https://www.youtube.com/watch?v=--6eyLO78CY

 */

const { PI } = Math;
const TAU = Math.PI * 2;
const { abs } = Math;
const { sin } = Math;
const { cos } = Math;
const { tan } = Math;
const { pow } = Math;

const point = (context, x, y, radius, color) => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
};

const pointStroked = (context, x, y, radius, color) => {
    context.strokeStyle = tinycolor(color).toRgbString();
    context.lineWidth = 0.5;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.stroke();
};

const line = (context, x1, y1, x2, y2, color) => {
    context.strokeStyle = tinycolor(color).toRgbString();
    context.lineWidth = 0.5;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
};

class Curve {
    #x;

    #y;

    constructor(centerX, centerY, radius, angle, speed, noise) {
        this.#x = undefined;
        this.#y = undefined;
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.speed = speed || 1;
        this.angle = angle || 0;
        this.noise = noise;
    }

    get x() {
        return this.#x + this.centerX;
    }

    set x(v) {
        this.#x = v;
    }

    get y() {
        return this.#y + this.centerY;
    }

    set y(v) {
        this.#y = v;
    }

    get distFromCenter() {
        return pointDistance({ x: this.centerX, y: this.centerY }, { x: this.x, y: this.y });
    }
}

export const hny = () => {
    const config = {
        width: 1000,
        height: 1000,
    };

    const renderBatch = 1000;
    const curves = [];
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    const columns = 3;
    const margin = 50;
    let tick = 0;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        const colSize = (canvas.width - margin * 2) / columns;
        const colOffset = (canvas.width - margin * 2) / (columns * 2);

        if (columns === 1) {
            curves.push(new Curve(canvasCenterX, canvasCenterY, centerRadius, 0, 0.05));
        } else {
            for (let x = colOffset + margin; x < canvas.width - margin; x += colSize) {
                for (let y = colOffset + margin; y < canvas.height - margin; y += colSize) {
                    curves.push(new Curve(x, y, colOffset * 0.75, 0, 0.05, create2dNoise(x, y)));
                }
            }
        }

        background(canvas, context)({ r: 230, g: 230, b: 230 });
    };

    const circleX = (curve, v = 1) => curve.radius * Math.cos(curve.angle * v);
    const circleY = (curve, v = 1) => curve.radius * Math.sin(curve.angle * v);

    // k is # of petals
    // https://en.wikipedia.org/wiki/Rose_(mathematics)
    // http://xahlee.info/SpecialPlaneCurves_dir/Rose_dir/rose.html
    const roseX = (curve, k = 1, a = 1, b = 1) =>
        curve.radius * Math.cos(k * curve.angle * a) * Math.cos(curve.angle * b);
    const roseY = (curve, k = 1, a = 1, b = 1) =>
        curve.radius * Math.cos(k * curve.angle * a) * Math.sin(curve.angle * b);

    // https://www.huffpost.com/entry/flowers_b_9817126
    const manyX = (r, k, i) =>
        r * cos((14 * PI * k) / i) * pow(1 - 0.75 * sin((20 * PI * k) / i), 4) -
        0.25 * (pow(cos((60 * PI * k) / i)), 3);
    const manyY = (r, k, i) =>
        r * sin((14 * PI * k) / i) * pow(1 - 0.75 * sin((20 * PI * k) / i), 4) - 0.25 * pow(cos((60 * PI * k) / i), 3);
    const manyR = (k, i) =>
        abs(
            0.008333333333 +
                0.05555555556 * sin((60 * PI * k) / i) * 4 +
                0.05555555556 * pow(sin((160 * PI * k) / i), 4)
        );

    /*
    https://barbourdesign.com/the-beauty-of-math/
    A(k)+iB(k)+C(k)e^(300πik/9000)
    and
    A(k)+iB(k)-C(k)e^(300πik/9000)
    and the eccentricity of the k-th ellipse is D(k), where
    A(k)=sin(12πk/9000)cos(8πk/9000),
    B(k)=cos(12πk/9000)cos(8πk/9000),
    C(k)=(1/14)+(1/16)sin(10πk/9000),
    D(k)=(49/50)-(1/7)(sin(10πk/9000))^4.
     */

    /*
    Cardiods https://www.huffpost.com/entry/these-beautiful-images-are-created-by-drawing-cardioids_b_578233ace4b05b4c02fcd129
    z(t)=X(k)+iY(k)+S(k)(2e^(it)-e^(2it))e^(iT(k)),
    where,
    X(k)=cos(2πk/4000)((4/5)+(1/5)(cos(24πk/4000))^3),
    Y(k)=sin(2πk/4000)((4/5)+(1/5)(cos(24πk/4000))^3),
    S(k)=(1/20)+(1/8)(sin(24πk/4000))^2,
    T(k)=18πk/4000
     */

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)({ r: 230, g: 230, b: 230, a: 0.001 });

        for (let b = 0; b < renderBatch; b++) {
            for (let i = 0; i < curves.length; i++) {
                const idx = i + 1;
                const pointRad = 0.5;
                const c = curves[i];

                const px = c.x;
                const py = c.y;

                // c.x = c.centerX + circleX(c);
                // c.y = c.centerY + circleY(c);
                // c.x = c.centerX + roseX(c, (i + 1) / 9, 1);
                // c.y = c.centerY + roseY(c, (i + 1) / 9, 1);

                const n = 500 * (i + 1);
                c.x = manyX(c.radius / (columns * 3), tick, n);
                c.y = manyY(c.radius / (columns * 3), tick, n);
                pointRad = (manyR(tick, n) * 250) / (columns * 1.25);
                c.angle += c.speed;

                const h = mapRange(0, c.radius, 180, 270, c.distFromCenter);
                const s = 100;
                const l = 30;
                const a = 0.1;
                const color = `hsla(${h},${s}%,${l}%,${a})`;

                // if (px && py) line(context, px, py, c.x, c.y, 'rgba(0,0,0,.1');
                pointStroked(context, c.x, c.y, pointRad, color);
            }
            tick++;
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
