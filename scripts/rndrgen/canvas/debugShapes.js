import tinycolor from 'tinycolor2';
import { uvFromAngle } from '../math/math';
import { line } from './primatives';

const debugDrawVectors = (segments) => {
    const tmult = 50;
    const bmult = 50;
    const mmult = 20;
    const cmult = 50;
    const tan = 'red';
    const bitan = 'blue';
    const mx = 'purple';

    segments.forEach((seg, i) => {
        if (seg.hasOwnProperty('tangent') && seg.hasOwnProperty('bitangent') && seg.hasOwnProperty('mix')) {
            const { x } = seg.start;
            const { y } = seg.start;
            const { tangent, bitangent, mix, curvature } = seg;

            const utan = tangent.setMag(1);
            const ubitan = bitangent.setMag(1);
            const umix = bitangent.setMag(1);
            const ucurve = uvFromAngle(curvature);
            console.log(ucurve);

            // ctx.strokeStyle = tinycolor(tan).toRgbString();
            // line(ctx)(x, y, x + utan.x * tmult, y + utan.y * tmult, 0.25);
            //
            // ctx.strokeStyle = tinycolor(bitan).toRgbString();
            // line(ctx)(x, y, x + ubitan.x * bmult, y + ubitan.y * bmult, 0.25);
            //
            ctx.strokeStyle = tinycolor(mx).toRgbString();
            line(ctx)(x, y, x + mix.x * mmult, y + mix.y * mmult, 0.5);

            // ctx.strokeStyle = tinycolor(mx).toRgbString();
            // line(ctx)(x, y, x + ucurve.x * cmult, y + ucurve.y * cmult, 0.5);
        }
    });
};
export const drawTestPoint = (context) => ({ x, y, radius, color }) => {
    context.strokeStyle = color.toRgbString();
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
    line(context)(x, y, x + radius, y, 1);
};

export const debugShowMouse = (context) => ({ x, y, radius }) => {
    if (x === undefined || y === undefined) return;
    context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
};
