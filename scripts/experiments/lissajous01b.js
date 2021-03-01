import tinycolor from 'tinycolor2';
import { background, drawTextFilled, textstyles } from '../lib/canvas';
import { create2dNoise, mapRange, oneOf, pointDistance, randomWholeBetween, round2 } from '../lib/math';
import { brightest, darkest, nicePalette } from '../lib/palettes';
import { ratio } from '../lib/sketch';

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
        this.#y = 0;
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.speed = speed || 1;
        this.angle = angle || 0;
        this.noise = noise;

        // Randomize some noise possibilities
        this.xa = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
        this.xb = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
        this.ya = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
        this.yb = oneOf([randomWholeBetween(1, 5), round2(this.noise)]);
    }

    get height() {
        return this.radius * 2;
    }

    get x() {
        return this.#x + this.centerX;
    }

    set x(v) {
        this.#x = v;
    }

    get y() {
        // return this.#y;
        return this.#y;
    }

    set y(v) {
        this.#y = v;
    }

    get distFromCenter() {
        return pointDistance({ x: this.centerX, y: this.centerY }, { x: this.x, y: this.y });
    }
}

export const lissajous01b = () => {
    const config = {
        name: 'lissajous01',
        ratio: ratio.square,
    };

    const renderBatch = 10;
    const curves = [];
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    const columns = 3;
    const margin = 50;
    let colSize;
    let colOffset;
    const palette = nicePalette();
    const colorBackground = brightest(palette).clone().lighten(10);
    const colorCurve = darkest(palette).clone().darken(25);
    const colorText = colorBackground.clone().darken(15).desaturate(20);
    let tick = 0;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        colSize = (canvas.width - margin * 2) / columns;
        colOffset = (canvas.width - margin * 2) / (columns * 2);

        if (columns === 1) {
            curves.push(new Curve(canvasCenterX, canvasCenterY, centerRadius, 0, 0.05));
        } else {
            for (let y = colOffset + margin; y < canvas.height - margin; y += colSize) {
                for (let x = colOffset + margin; x < canvas.width - margin; x += colSize) {
                    curves.push(new Curve(x, y, colOffset * 0.9, 0, 0.05, create2dNoise(x, y)));
                }
            }
        }

        // background(canvas, context)({ r: 230, g: 230, b: 230 });
        background(canvas, context)(colorBackground);
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

    const draw = ({ canvas, context, mouse }) => {
        for (let b = 0; b < renderBatch; b++) {
            for (let i = 0; i < curves.length; i++) {
                const idx = i + 1;
                const pointRad = 1;
                const c = curves[i];

                // const px = c.x;
                // const py = c.y;

                const k = round2(((i + 1) * 2) / 9);

                const { xa } = c;
                const { xb } = c;
                // const { ya } = c;
                // const { yb } = c;

                // c.x = circleX(c);
                // c.y = circleY(c);
                c.x = roseX(c, k, xa, xb);
                // c.y = roseY(c, k, ya, yb);
                c.y += 1;

                // TODO, put a/b on the canvas so i can remember them!

                c.angle += c.speed;

                const h = mapRange(0, c.radius, 180, 270, c.distFromCenter);
                const s = 100;
                const l = 30;
                const a = 0.75;
                const color = `hsla(${h},${s}%,${l}%,${a})`;

                // if (px && py) line(context, px, py, c.x, c.y, 'rgba(0,0,0,.1');
                pointStroked(context, c.x, c.y + c.centerY - colOffset + margin / 2, pointRad, colorCurve);

                if (c.y > c.height) c.y = 0;

                drawTextFilled(context)(
                    `k=${k}, ${xa}, ${xb}`,
                    c.centerX - c.radius,
                    c.centerY + c.radius + 40,
                    colorText,
                    textstyles.size(0.75)
                );
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
