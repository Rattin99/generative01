import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { mapRange } from '../rndrgen/math/math';
import { connectParticles, drawMouse, drawParticlePoint, drawPointTrail } from '../rndrgen/canvas/particles';
import { randomNumberBetween } from '../rndrgen/math/random';
import { pointDistance } from '../rndrgen/math/points';

/*
Based on https://www.reddit.com/r/generative/comments/lqrg0t/some_parametric_equations/

parametric formula of the cardioid

https://proofwiki.org/wiki/Equation_of_Cardioid/Parametric#:~:text=From%20Polar%20Form%20of%20Equation,x%3Drcos%CE%B8
 */

/*
let a = 100;
let t = 0;
let x = 500;
let y = 500;
let dt = 0.0001

function setup() {
  createCanvas(1000, 1000);
  background(200);

  for (let i = 0; i < 1000000; i++) {
    let del = 2*a*cos(4*dt*t) + a*cos(t)
    strokeWeight(2);
    stroke(del,2*a*sin(t) - a*cos(3*dt*t) , 100, 10);
    point(2*a*sin(2*t*dt) + a*cos(t*dt) + 500, 2*a*sin(t*dt) - a*sin(5*t) + 500);

    t = t + 0.01;
    dt = dt + 0.1
  }
}
 */

export const parametric01 = () => {
    const config = {
        width: 600,
        height: 600,
    };

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let lastX;
    let lastY;
    const scale = 75;
    let drawSpeed = 0;
    let pathSpeed = 0.0001;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        background(canvas, context)('#dddddd');
    };

    const point = (context, x, y, color) => {
        const radius = 1; // rnd < 0.008 ? randomNumberBetween(50, 100) : randomNumberBetween(1, 3);
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

    // const distFromCenter = pointDistance({ x: canvasCenterX, y: canvasCenterY }, { x: px, y: py });
    // const h = mapRange(0, canvasCenterX, 90, 270, distFromCenter);
    // const s = 100;
    // const l = 50;
    // // const a = mapRange(0, hole.rs * 1.5, 0.1, 1, distFromCenter); // 50;
    // const color = `hsl(${h},${s}%,${l}%)`;

    const draw = ({ canvas, context, mouse }) => {
        // background(canvas, context)({ r: 230, g: 230, b: 230, a: 0.01 });

        const stepsPerFrame = 100;
        const factor = 2 * scale;

        for (let i = 0; i < stepsPerFrame; i++) {
            const red = factor * Math.cos(4 * pathSpeed * drawSpeed) + scale * Math.cos(drawSpeed);
            const greed = 2 * factor * Math.sin(drawSpeed) - scale * Math.cos(3 * pathSpeed * drawSpeed);
            const blue = 100;

            const color = `rgba(${red}, ${greed}, ${blue}, ${0.5})`;

            // vase
            // let px = factor * Math.sin(2 * drawSpeed * pathSpeed) + scale * Math.cos(drawSpeed * pathSpeed);
            // let py = factor * Math.sin(drawSpeed * pathSpeed) - scale * Math.sin(5 * drawSpeed);

            // boomerang
            // let px = factor * Math.cos(2 * drawSpeed * pathSpeed) + scale * Math.cos(drawSpeed * pathSpeed);
            // let py = factor * Math.sin(drawSpeed * pathSpeed) - scale * Math.sin(drawSpeed);

            // 4 vertical circles
            // let px = factor * Math.cos(5 * drawSpeed * pathSpeed) + scale * Math.cos(drawSpeed * pathSpeed);
            // let py = factor * Math.sin(5 * drawSpeed * pathSpeed) - scale * Math.sin(2 * drawSpeed);

            // spirograph 1
            let px = factor * Math.cos(5 * drawSpeed * pathSpeed) + scale * Math.cos(9 * drawSpeed * pathSpeed);
            let py = factor * Math.sin(5 * drawSpeed * pathSpeed) - scale * Math.sin(2 * drawSpeed);

            px += canvasCenterX;
            py += canvasCenterY;

            point(context, px, py, color);
            // if (lastX && lastY) line(context, lastX, lastY, px, py, color);

            lastX = px;
            lastY = py;

            drawSpeed += 0.0001;
            pathSpeed += 0.001;
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
