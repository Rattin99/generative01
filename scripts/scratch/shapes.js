import tinycolor from 'tinycolor2';
import { circleX, circleY, mapRange, pointOnCircle, TAU } from '../rndrgen/math/math';
import { circleFilled, line, pixel } from '../rndrgen/canvas/primatives';
import { randomNumberBetween, randomWholeBetween } from '../rndrgen/math/random';

/*
ctx.lineWidth = oxbowWeight;
ctx.strokeStyle = oxbowColor.toRgbString();
bezierCurveFromPoints(ctx)(arrayPointArrayToObjectArray(oxpoints));
 */
// BUG it spikes Y pos
// https://www.geeksforgeeks.org/how-to-draw-smooth-curve-through-multiple-points-using-javascript/
// export const bezierCurveFromPoints = (context) => (points, f, t) => {
//     if (typeof f === 'undefined') f = 0.3;
//     if (typeof t === 'undefined') t = 0.6;
//
//     context.beginPath();
//     context.moveTo(points[0].x, points[0].y);
//
//     let m = 0;
//     let dx1 = 0;
//     let dy1 = 0;
//
//     let preP = points[0];
//
//     for (let i = 1; i < points.length; i++) {
//         const curP = points[i];
//         const nexP = points[i + 1];
//         let dx2;
//         let dy2;
//         if (nexP) {
//             m = lineSlope(preP, nexP);
//             dx2 = (nexP.x - curP.x) * -f;
//             dy2 = dx2 * m * t;
//         } else {
//             dx2 = 0;
//             dy2 = 0;
//         }
//
//         context.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
//
//         dx1 = dx2;
//         dy1 = dy2;
//         preP = curP;
//     }
//     context.stroke();
// };

// Spikes is an array of angles
export const spikedCircle = (context) => ({ x, y, radius, color }, spikes, spikeLength = 5) => {
    const circleStroke = 1;
    const spikeStroke = 2;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = circleStroke;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
    for (let s = 0; s < spikes.length; s++) {
        const pointA = pointOnCircle(x, y, radius, spikes[s]);
        const pointB = pointOnCircle(x, y, radius + spikeLength, spikes[s]);
        context.strokeStyle = color.toRgbString();
        line(context)(pointA.x, pointA.y, pointB.x, pointB.y, spikeStroke);
    }
};

export const pathRibbon = (context) => (path, color, thickness = 1, stroke = false) => {
    // const rColor = tinycolor(color).clone();
    // const gradient = context.createLinearGradient(0, startY, 0, maxY);
    // gradient.addColorStop(0, colorLinesTop.toRgbString());
    // gradient.addColorStop(1, colorLinesBottom.toRgbString());

    context.beginPath();
    context.moveTo(path[0], path[0]);
    path.forEach((point, i) => {
        const x = point[0];
        const y = point[1];
        context.lineTo(x, y);
    });
    path.reverse().forEach((point, i) => {
        const x = point[0];
        const y = point[1];
        const distFromCenter = Math.abs(path.length / 2 - i);
        const size = mapRange(0, path.length / 2, 1, thickness, distFromCenter);
        context.lineTo(x + size, y + size);
    });
    context.closePath();

    // if (stroke) {
    //     context.strokeStyle = rColor.darken(70).toRgbString();
    //     context.lineWidth = 0.75;
    //     context.stroke();
    // }

    // context.fillStyle = gradient;
    context.fillStyle = tinycolor(color).toRgbString();
    context.fill();
};

export const splatter = (context) => (x, y, color, size, amount = 3, range = 20) => {
    for (let i = 0; i < amount; i++) {
        const s = randomWholeBetween(size * 0.25, size * 3);
        // circle dist
        const radius = randomWholeBetween(0, range);
        const angle = randomNumberBetween(0, TAU);
        const xoff = radius * Math.cos(angle);
        const yoff = radius * Math.sin(angle);
        // square dist
        // const xoff = randomWholeBetween(-range, range);
        // const yoff = randomWholeBetween(-range, range);
        circleFilled(context)(x + xoff, y + yoff, s, color);
    }
};

const lineCap = 'butt';
const lineJoin = 'miter';

export const turtleLineMode = (m = 'butt') => {
    if (m === 'butt') {
        lineCap = 'butt';
        lineJoin = 'miter';
    } else if (m === 'round') {
        lineCap = 'round';
        lineJoin = 'round';
    }
};

export const drawPointsTaper = (ctx) => (points, color = 'black', width = 1) => {
    ctx.strokeStyle = tinycolor(color).clone().toRgbString();

    const mid = points.length / 2;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    points.forEach((coords, i) => {
        const dist = Math.abs(mid - i);
        const w = mapRange(0, mid, width, 1, dist);
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(coords[0], coords[1]);
        ctx.lineTo(coords[0], coords[1]);
        ctx.stroke();
    });
};

export const circleAtPoint = (context) => (points, color = 'black', radius = 5) => {
    points.forEach((coords) => {
        circleFilled(context)(coords[0], coords[1], radius, color);
    });
};

export const variableCircleAtPoint = (context) => (points, color = 'black', radius = 5, freq = 10, amp = 2) => {
    points.forEach((coords) => {
        const v = Math.sin(coords[0] / freq) * amp;
        circleFilled(context)(coords[0], coords[1], Math.abs(radius - v), color);
    });
};

export const drawSegment = (ctx) => (segments, color, weight, points = false) => {
    ctx.lineCap = 'round';
    // ctx.lineJoin = 'round';
    ctx.strokeStyle = tinycolor(color).clone().toRgbString();
    ctx.lineWidth = weight;
    ctx.beginPath();
    segments.forEach((seg, i) => {
        if (i === 0) {
            ctx.moveTo(seg.start.x, seg.start.y);
        } else {
            ctx.lineTo(seg.start.x, seg.start.y);
        }
        ctx.lineTo(seg.end.x, seg.end.y);
    });
    ctx.stroke();
    if (points) {
        segments.forEach((seg, i) => {
            const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
            circleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
            circleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
        });
    }
};

export const drawSegmentTaper = (ctx) => (segments, color, maxWeight, minWeight = 1, points = false) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tinycolor(color).clone().toRgbString();

    const mid = segments.length / 2;

    segments.forEach((seg, i) => {
        const dist = Math.abs(mid - i);
        const w = mapRange(0, mid, maxWeight, minWeight, dist);

        ctx.beginPath();
        ctx.lineWidth = w;
        if (i === 0) {
            ctx.moveTo(seg.start.x, seg.start.y);
        } else {
            ctx.lineTo(seg.start.x, seg.start.y);
        }
        ctx.lineTo(seg.end.x, seg.end.y);
        ctx.stroke();
    });

    if (points) {
        segments.forEach((seg, i) => {
            const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
            circleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
            circleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
        });
    }
};

const horizontalSinWave = (ctx, startX, maxX, yoffset, pixelColor) => {
    const freq = 5;
    const amp = 15;
    const step = 2;
    let theta = 0;
    for (let x = startX; x < maxX; x += step) {
        const y = circleY(theta, amp, freq) + yoffset;
        pixel(ctx)(x, y, pixelColor, 'circle', 2);
        theta++;
    }
};

const verticalSinWave = (ctx, startX, maxX, yoffset, pixelColor) => {
    const freq = 5;
    const amp = 15;
    const step = 2;
    let theta = 0;
    for (let y = startY; y < maxY; y += step) {
        const x = circleY(theta, amp, freq) + xoffset;
        pixel(ctx)(x, y, pixelColor, 'circle', 2);
        theta++;
    }
};

const fullScreenSin = (xoffset, yoffset) => {
    const freq = 30;
    const amp = 5;
    const step = 5;
    let theta = 0;
    for (let sx = startX; sx < maxX; sx += step) {
        for (let sy = startY; sy < maxY; sy += step) {
            const x = circleX(theta, amp, freq) + xoffset + sx;
            const y = circleY(theta, amp, freq) + yoffset + sy;
            plot(x + xoffset, y + yoffset);
            theta++;
        }
    }
};

/*
    https://www.desmos.com/calculator/rzwar3xxpy
    y-x = amp * Math.sin((y+x)/freq)
     */
const plotDiagSinWave = (xoffset, yoffset) => {
    const freq = 30; // 30
    const amp = 5; // 5
    let y = 0;
    const a = Math.PI / 3; // angle of the wave, 1 is 45
    for (let x = 0; x < canvasWidth + 10; x++) {
        const b = Math.sin(x / Math.PI) * 5;
        // x = y - Math.sin(y+x)
        y = amp * Math.sin((y + b) / freq) + x * a;
        plot(x + xoffset, y + yoffset);
    }
};

export const debugShowAttractor = (context) => ({ x, y, mass, g }, mode, radius) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(0,0,0,.1)';
    context.fill();

    context.beginPath();
    context.arc(x, y, Math.sqrt(mass) * g, 0, Math.PI * 2, false);
    context.fillStyle = mode === 1 ? 'rgba(0,255,0,.25)' : 'rgba(255,0,0,.25)';
    context.fill();
};

const plotFFPointLines = (num) => {
    for (let i = 0; i < num; i++) {
        const coords = createFFParticleCoords(noise, 0, randomWholeBetween(0, canvasMidY * 2), 2000, 1);
        pointPathPA(ctx)(coords, tinycolor('rgba(0,0,0,.5'), 1);
    }
};

export const createFFParticleCoords = (fieldFn, startX, startY, length, fMag = 1, vlimit = 1) => {
    const props = {
        x: startX,
        y: startY,
        velocityX: 0,
        velocityY: 0,
        mass: 1,
    };
    const particle = new Particle(props);
    const coords = [];
    for (let i = 0; i < length; i++) {
        const theta = fieldFn(particle.x, particle.y);
        // theta = quantize(4, theta);
        const force = uvFromAngle(theta).setMag(fMag);

        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(vlimit);
        particle.updatePosWithVelocity();
        coords.push([particle.x, particle.y]);
        particle.acceleration = new Vector(0, 0);
    }
    return coords;
};
