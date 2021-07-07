import { background, currentContextScale } from '../rndrgen/canvas/canvas';
import { round2 } from '../rndrgen/math/math';
import { brightest, darkest, nicePalette } from '../rndrgen/color/palettes';
import { ratio, scale } from '../rndrgen/sketch';
import { textFilled, setTextAlignLeftTop, textStyles } from '../rndrgen/canvas/text';
import { getGridCells } from '../rndrgen/math/grids';
import { create2dNoiseAbs, oneOf, randomWholeBetween } from '../rndrgen/math/random';
import { rect, pixel } from '../rndrgen/canvas/primatives';
import { pointDistance } from '../rndrgen/math/points';

class Curve {
    constructor(x, y, radius, angle, speed, noise) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
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
}

export const lissajous01 = () => {
    const config = {
        name: 'lissajous01',
        ratio: ratio.square,
        scale: scale.hidpi,
    };

    const renderBatch = 10;
    const curves = [];
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    const columns = 3;
    let margin;
    const palette = nicePalette();
    const colorBackground = brightest(palette).clone().lighten(10);
    const colorCurve = darkest(palette).clone().darken(25);
    const colorText = colorBackground.clone().darken(15).desaturate(20);
    let tick = 0;
    let grid;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;
        margin = 50 * currentContextScale();
        if (columns === 1) {
            curves.push(new Curve(canvasCenterX, canvasCenterY, centerRadius, 0, 0.05));
        } else {
            grid = getGridCells(canvas.width, canvas.width, columns, columns, margin, margin / 2);
            grid.points.forEach((point) => {
                const x = point[0];
                const y = point[1];
                curves.push(new Curve(x, y, grid.columnWidth / 2, 0, 0.05, create2dNoiseAbs(x, y)));
            });
        }

        background(canvas, context)(colorBackground);
    };

    // k is # of petals
    // https://en.wikipedia.org/wiki/Rose_(mathematics)
    // http://xahlee.info/SpecialPlaneCurves_dir/Rose_dir/rose.html
    const roseX = (curve, k = 1, a = 1, b = 1) =>
        curve.radius * Math.cos(k * curve.angle * a) * Math.cos(curve.angle * b);
    const roseY = (curve, k = 1, a = 1, b = 1) =>
        curve.radius * Math.cos(k * curve.angle * a) * Math.sin(curve.angle * b);

    const linearYDown = (curve) => {
        let { y } = curve;
        if (++y > curve.size) y = 0;
        return y;
    };

    const draw = ({ context }) => {
        grid.points.forEach((point) => {
            rect(context)(point[0], point[1], grid.columnWidth, grid.rowHeight, 1, colorText);
        });
        for (let b = 0; b < renderBatch; b++) {
            for (let i = 0; i < curves.length; i++) {
                // const idx = i + 1;
                // const pointRad = 1;
                const c = curves[i];

                const k = round2(((i + 1) * 2) / 9);

                const { xa } = c;
                const { xb } = c;
                const { ya } = c;
                const { yb } = c;

                // c.x = circleX(c);
                // c.y = circleY(c);
                c.x = roseX(c, k, xa, xb);
                c.y = roseY(c, k, ya, yb);
                // c.y = linearYDown(c);

                // TODO, put a/b on the canvas so i can remember them!

                c.angle += c.speed;

                // const h = mapRange(0, c.radius, 180, 270, c.distFromCenter);
                // const s = 100;
                // const l = 30;
                // const a = 0.75;
                // const color = `hsla(${h},${s}%,${l}%,${a})`;

                pixel(context)(c.x + c.centerX, c.y + c.centerY, colorCurve);

                setTextAlignLeftTop(context);
                textFilled(context)(
                    `k=${k}, ${xa}, ${xb}, ${ya}, ${yb}`,
                    c.originX,
                    c.originY + c.size + 10,
                    colorText,
                    textStyles.size(10)
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
