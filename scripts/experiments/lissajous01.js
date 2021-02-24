import tinycolor from 'tinycolor2';
import { background, connectParticles, drawMouse, drawParticlePoint, drawPointTrail } from '../lib/canvas';
import { mapRange, pointDistance, randomNumberBetween } from '../lib/math';

/*
Based on Coding Challenge #116​: Lissajous Curve Table https://www.youtube.com/watch?v=--6eyLO78CY

 */

const point = (context, x, y, radius, color) => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
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

    update() {}

    draw() {}
}

export const lissajous01 = () => {
    const config = {
        width: 600,
        height: 600,
    };

    const curves = [];
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    const angle = 0;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        const fourths = canvas.width / 4;
        const eights = canvas.width / 8;

        for (let x = eights; x < canvas.width; x += fourths) {
            for (let y = eights; y < canvas.width; y += fourths) {
                curves.push(new Curve(x, y, eights * 0.75, 0, 0.05));
            }
        }

        background(canvas, context)({ r: 230, g: 230, b: 230 });
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 230, g: 230, b: 230, a: 0.01 });

        for (let i = 0; i < curves.length; i++) {
            const c = curves[i];

            const px = c.x;
            const py = c.y;

            c.x = c.centerX + c.radius * Math.cos(c.angle * (i + 1));
            c.y = c.centerY + c.radius * Math.sin(c.angle * (i + 1));
            c.angle += c.speed;

            const distFromCenter = pointDistance({ x: canvasCenterX, y: canvasCenterY }, { x: c.x, y: c.y });
            const h = mapRange(0, canvasCenterX, 0, 360, distFromCenter);
            const s = 100;
            const l = 40;
            const color = `hsl(${h},${s}%,${l}%)`;

            // if (px && py) line(context, px, py, c.x, c.y, 'rgba(0,0,0,.1');
            point(context, c.x, c.y, 2, color);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
