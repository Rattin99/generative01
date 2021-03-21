// More detailed implementation https://blog.wolfram.com/2016/05/06/computational-stippling-can-machines-do-as-well-as-humans/
import tinycolor from 'tinycolor2';
import {
    logInterval,
    mapRange,
    randomNormalWholeBetween,
    randomNumberBetween,
    randomSign,
    randomWholeBetween,
    round2,
} from './math';
import { drawRectFilled } from './canvas';
import { plotLines } from './canvas-linespoints';
import { last } from './utils';

const TAU = Math.PI * 2;
const intervals = logInterval(10, 1, 10);
let clipping = true;

export const setTextureClippingMask = (v = true) => {
    clipping = v;
};

const getRotatedXYCoords = (x, y, length, theta) => ({
    x1: x,
    y1: y,
    x2: x + length * Math.cos(theta),
    y2: y + length * Math.sin(theta),
});

const getRotatedYCoords = (x, y, length, theta) => ({
    x1: x,
    y1: y,
    x2: x + length, // * Math.cos(theta),
    y2: y + length * Math.sin(theta),
});

export const texturizeRect = (context) => (
    x,
    y,
    width,
    height,
    color = 'black',
    amount = 5,
    mode = 'circles2',
    mult = 1
) => {
    if (amount <= 0) return;

    if (clipping) {
        context.save();
        const region = new Path2D();
        region.rect(x, y, width, height);
        context.clip(region);
    }

    const quarter = width / 4;
    const strokeColor = tinycolor(color).toRgbString();
    const lineWidth = 1;
    // const numIttr = mapRange(1, 10, 2, 200, amount) * mult;
    const endValue = mode === 'xhatch' ? 100 : 25;
    const numIttr = intervals[Math.round(amount) - 1] * mapRange(1, 10, 1, endValue, amount) * mult;

    const maxDim = Math.max(width, height);
    const maxRadius = maxDim * 0.7;

    for (let i = 0; i < numIttr; i++) {
        let tx = randomWholeBetween(x, x + width);
        let ty = randomWholeBetween(y, y + height);
        let size = randomWholeBetween(quarter, width);

        context.strokeStyle = strokeColor;
        context.lineWidth = lineWidth;
        context.beginPath();

        if (mode === 'circles') {
            context.arc(tx, ty, size, 0, Math.PI * 2, false);
        } else if (mode === 'circles2') {
            tx = randomNormalWholeBetween(x, x + width);
            ty = randomNormalWholeBetween(y, y + height);
            size = randomWholeBetween(1, maxRadius);
            context.arc(tx, ty, size, 0, Math.PI * 2, false);
        } else if (mode === 'xhatch') {
            const tx2 = tx + size * randomSign();
            const ty2 = ty + size * randomSign();
            context.moveTo(tx, ty);
            context.lineTo(tx2, ty2);
        }

        context.stroke();
    }
    if (clipping) {
        context.restore();
    }
};

export const spiralRect = (context) => (x, y, width, height, color = 'black', amount = 5, mult = 1) => {
    if (amount <= 0) return;

    const maxDim = Math.max(width, height);
    const maxRadius = maxDim * 0.7;

    const fillamount = mapRange(1, 10, 30, 150, amount) * mult;

    const numIttr = fillamount; // maxDim * (amount * 0.8);
    const radIncr = maxRadius / numIttr;

    const thetaIncr = TAU / 50; // Math.floor(amount) * 0.05; // TAU / (Math.floor(amount) * 0.05);

    if (clipping) {
        context.save();
        const region = new Path2D();
        region.rect(x, y, width, height);
        context.clip(region);
    }

    const strokeColor = tinycolor(color).toRgbString();
    const lineWidth = 1;

    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;

    const spirals = intervals[Math.round(amount) - 1] * mapRange(1, 10, 1, 15, amount) * mult;
    for (let s = 0; s < spirals; s++) {
        const ox = randomNormalWholeBetween(x, x + width);
        const oy = randomNormalWholeBetween(y, y + height);
        let theta = randomNumberBetween(0, TAU);
        let radius = 0;

        context.beginPath();
        context.moveTo(ox, oy);

        for (let i = 0; i < numIttr; i++) {
            radius += radIncr; // + Math.sin(i / 2);
            theta += thetaIncr;
            const px = ox + radius * Math.cos(theta);
            const py = oy + radius * Math.sin(theta);
            context.lineTo(px, py);
        }

        context.stroke();
    }
    if (clipping) {
        context.restore();
    }
};

export const stippleRect = (context) => (x, y, width, height, color = 'black', amount = 5, theta) => {
    if (amount <= 0) return;
    // amount = Math.min(amount, 10);
    if (clipping) {
        context.save();
        const region = new Path2D();
        region.rect(x, y, width, height);
        context.clip(region);
    }

    const strokeColor = tinycolor(color).toRgbString();
    const size = 3;

    const colStep = width / mapRange(1, 10, 3, width / 3, amount);
    const rowStep = height / mapRange(1, 10, 3, height / 3, amount);

    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.lineCap = 'round';

    theta = theta === undefined ? Math.PI / 3 : theta;

    for (let i = 0; i < width; i += colStep) {
        for (let j = 0; j < height; j += rowStep) {
            // about the middle of the cell
            const tx = x + randomNormalWholeBetween(i, i + colStep);
            const ty = y + randomNormalWholeBetween(j, j + rowStep);

            const coords = getRotatedYCoords(tx, ty, size, theta);

            const tx2 = coords.x2; // tx + size;
            const ty2 = coords.y2; // ty + size * -1;
            context.beginPath();
            context.moveTo(tx, ty);
            context.lineTo(tx2, ty2);
            context.stroke();
        }
    }

    if (clipping) {
        context.restore();
    }
};

// TODO needs to intersect "nicely" at the rect area boundaries
export const linesRect = (context) => (x, y, width, height, color = 'black', amount = 5, theta = 0, mult = 1) => {
    if (amount <= 0) return;

    if (clipping) {
        context.save();
        const region = new Path2D();
        region.rect(x, y, width, height);
        context.clip(region);
    }

    const points = [];

    const strokeColor = tinycolor(color).toRgbString();
    const lineWidth = 1;

    const yDelta = width * Math.sin(theta); // height of angle line
    const yIncrement = height / amount / 2;

    let yincr = 0;
    const loops = height / yIncrement;

    // keep centered
    const yOff = yIncrement / 2 - yDelta / 2;
    let connectSide = 1;
    let coords = { x1: x, y1: y, x2: x, y2: y };
    let lastCoords = { x1: x, y1: Math.min(y, y + yOff), x2: x, y2: Math.min(y, y + yOff) };

    // drawRectFilled(context)(x, y, width, height, '#ddd');

    for (let i = 0; i < loops; i++) {
        coords = getRotatedYCoords(x, yOff + y + yincr, width, theta);

        // draw bar

        if (yincr === 0) {
            // line to the top
            if (coords.y1 > y) {
                points.push([coords.x1, y]);
            }
            points.push([coords.x1, coords.y1]);
        }

        if (connectSide === 1) {
            // right
            points.push([coords.x2, coords.y2]);
            points.push([coords.x2, coords.y2 + yIncrement]);
        } else {
            // left
            points.push([coords.x1, coords.y1]);
            points.push([coords.x1, coords.y1 + yIncrement]);
        }

        yincr += yIncrement;
        connectSide *= -1;
        lastCoords = coords;
    }

    // line to the bottom
    if (last(points)[1] < y + height) {
        last(points)[1] = y + height;
    }

    plotLines(context)(points, strokeColor, lineWidth);

    if (clipping) {
        context.restore();
    }
};

/*
export const linesRect = (context) => (x, y, width, height, color = 'black', amount = 5, theta = 0, mult = 1) => {
    if (amount <= 0) return;

    if (clipping) {
        context.save();
        const region = new Path2D();
        region.rect(x, y, width, height);
        context.clip(region);
    }

    // theta = 0.5;

    const centerH = Math.round(width / 2);
    const centerV = Math.round(height / 2);
    const quarter = width / 4;
    const strokeColor = tinycolor(color).toRgbString();
    const lineWidth = 1;
    // const numIttr = mapRange(1, 10, 1, height / 2, amount);
    const numIttr = (intervals[Math.round(amount) - 1] * mapRange(1, 10, 1, 15, amount) * mult) / 1;

    const yDelta = width * Math.sin(theta); // height of angle line
    const steps = height / amount / 2;
    // keep centered
    const yOff = steps / 2 - yDelta / 2;
    let connectSide = -1;
    let coords = { x1: x, y1: y, x2: x, y2: y };
    let lastCoords = { x1: x, y1: Math.min(y, y + yOff), x2: x, y2: Math.min(y, y + yOff) };

    drawRectFilled(context)(x, y, width, height, '#ddd');

    // const maxx = x + width;
    // const maxy = y + height;

    const points = [];

    for (let i = 0; i < height; i += steps) {
        coords = getRotatedYCoords(x, yOff + y + i, width, theta);

        // if (coords.y1 < y) {
        //     const a = coords.y1 - y;
        //     const b = a / Math.atan(round2(theta));
        //
        //     context.beginPath();
        //     context.strokeStyle = 'red';
        //     // context.moveTo(x, y);
        //     // context.lineTo(x, y + a);
        //     context.moveTo(coords.x1, y);
        //     context.lineTo(coords.x1 - b, y);
        //     context.stroke();
        // }
        //
        // if (coords.y2 > maxy) {
        //     const a = coords.y2 - maxy;
        //     const b = a / Math.atan(round2(theta));
        //
        //     context.beginPath();
        //     context.strokeStyle = 'green';
        //     // context.moveTo(maxx, maxy);
        //     // context.lineTo(maxx, maxy + a);
        //     context.moveTo(maxx, maxy);
        //     context.lineTo(maxx - b, maxy);
        //     context.stroke();
        // }

        // draw bar
        context.beginPath();
        context.strokeStyle = strokeColor;
        context.lineWidth = lineWidth;
        if(i === 0) {
            context.moveTo(coords.x1, coords.y1);
        } else {
            context.moveTo(coords.x1, coords.y1);
        }
        context.moveTo(coords.x1, coords.y1);
        context.lineTo(coords.x2, coords.y2);
        points.push([coords.x1, coords.y1]);
        points.push([coords.x2, coords.y2]);
        context.stroke();

        context.beginPath();
        if (connectSide === -1) {
            // left
            context.moveTo(lastCoords.x1, lastCoords.y1);
            context.lineTo(coords.x1, coords.y1);
            points.push([lastCoords.x1, lastCoords.y1]);
            points.push([coords.x1, coords.y1]);
        } else {
            // right
            context.moveTo(lastCoords.x2, lastCoords.y2);
            context.lineTo(coords.x2, coords.y2);
            points.push([lastCoords.x2, lastCoords.y2]);
            points.push([coords.x2, coords.y2]);
        }
        context.stroke();

        connectSide *= -1;
        lastCoords = coords;
    }

    context.beginPath();
    if (connectSide === -1) {
        // left
        context.moveTo(lastCoords.x1, lastCoords.y1);
        context.lineTo(x, y + height);
        points.push([lastCoords.x1, lastCoords.y1]);
        points.push([x, y + height]);
    } else {
        // right
        context.moveTo(lastCoords.x2, lastCoords.y2);
        context.lineTo(x + width, Math.max(coords.y2, y + height));
        points.push([lastCoords.x2, lastCoords.y2]);
        points.push([x + width, Math.max(coords.y2, y + height)]);
    }
    context.stroke();

    // plotPoints(context)(points);

    if (clipping) {
        context.restore();
    }
};
 */

/*
const theta = (Math.PI * angle) / 180.0;
const x2 = x1 + length * Math.cos(theta);
const y2 = y1 + length * Math.sin(theta);
 */
