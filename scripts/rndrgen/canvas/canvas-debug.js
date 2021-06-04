import tinycolor from 'tinycolor2';
import { uvFromAngle } from '../math/math';
import { drawLine } from './canvas';

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
            // drawLine(ctx)(x, y, x + utan.x * tmult, y + utan.y * tmult, 0.25);
            //
            // ctx.strokeStyle = tinycolor(bitan).toRgbString();
            // drawLine(ctx)(x, y, x + ubitan.x * bmult, y + ubitan.y * bmult, 0.25);
            //
            ctx.strokeStyle = tinycolor(mx).toRgbString();
            drawLine(ctx)(x, y, x + mix.x * mmult, y + mix.y * mmult, 0.5);

            // ctx.strokeStyle = tinycolor(mx).toRgbString();
            // drawLine(ctx)(x, y, x + ucurve.x * cmult, y + ucurve.y * cmult, 0.5);
        }
    });
};
