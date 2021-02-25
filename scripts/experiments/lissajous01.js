import tinycolor from 'tinycolor2';
import { background, connectParticles, drawMouse, drawParticlePoint, drawPointTrail } from '../lib/canvas';
import { mapRange, pointDistance, randomNumberBetween } from '../lib/math';

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
    constructor(centerX, centerY, radius, angle, speed) {
        this.x = undefined;
        this.y = undefined;
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.speed = speed || 1;
        this.angle = angle || 0;
    }
}

export const lissajous01 = () => {
    const config = {
        width: 1000,
        height: 1000,
    };

    const curves = [];
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    const columns = 1;
    const margin = 50;
    let tick = 0;

    const setup = (canvas, context) => {
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
                    curves.push(new Curve(x, y, colOffset * 0.75, 0, 0.05));
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
    // x = cos(14πk/9000)(1-(3/4)(sin(20πk/9000))4-(1/4)(cos(60πk/9000))3)
    // y = sin(14πk/9000)(1-(3/4)(sin(20πk/9000))4-(1/4)(cos(60πk/9000))3)
    // r = (1/120)+(1/18)(sin(60πk/9000))4+(1/18)(sin(160πk/9000))4
    const manyX = (curve, r, k, i) =>
        r * cos((14 * PI * k) / i) * pow(1 - 0.75 * sin((20 * PI * k) / i), 4) -
        0.25 * (pow(cos((60 * PI * k) / i)), 3);
    const manyY = (curve, r, k, i) =>
        r * sin((14 * PI * k) / i) * pow(1 - 0.75 * sin((20 * PI * k) / i), 4) - 0.25 * pow(cos((60 * PI * k) / i), 3);
    const manyR = (curve, k, i) =>
        abs(
            0.008333333333 +
                0.05555555556 * sin((60 * PI * k) / i) * 4 +
                0.05555555556 * pow(sin((160 * PI * k) / i), 4)
        );

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 230, g: 230, b: 230, a: 0.001 });

        for (let i = 0; i < curves.length; i++) {
            const pointRad = 0.5;
            const c = curves[i];

            const px = c.x;
            const py = c.y;

            // c.x = c.centerX + circleX(c);
            // c.y = c.centerY + circleY(c);
            // c.x = c.centerX + roseX(c, (i + 1) / 9, 1);
            // c.y = c.centerY + roseY(c, (i + 1) / 9, 1);
            c.x = c.centerX + manyX(c, c.radius * 0.15, tick, 9000);
            c.y = c.centerY + manyY(c, c.radius * 0.15, tick, 9000);
            pointRad = manyR(c, tick, 9000) * 250;
            c.angle += c.speed;

            const distFromCenter = pointDistance({ x: canvasCenterX, y: canvasCenterY }, { x: c.x, y: c.y });
            const h = mapRange(0, canvasCenterX, 180, 270, distFromCenter);
            const s = 100;
            const l = 30;
            const a = 0.1;
            const color = `hsla(${h},${s}%,${l}%,${a})`;

            // if (px && py) line(context, px, py, c.x, c.y, 'rgba(0,0,0,.1');
            pointStroked(context, c.x, c.y, pointRad, color);
        }
        tick++;
    };

    return {
        config,
        setup,
        draw,
    };
};
