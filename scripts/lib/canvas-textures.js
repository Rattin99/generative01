// More detailed implementation https://blog.wolfram.com/2016/05/06/computational-stippling-can-machines-do-as-well-as-humans/
import tinycolor from 'tinycolor2';
import { mapRange, randomNormalWholeBetween, randomNumberBetween, randomSign, randomWholeBetween } from './math';

const TAU = Math.PI * 2;

export const stippleRect = (context) => (x, y, width, height, color = 'black', amount = 5, mode = 'ticks') => {
    if (amount <= 0) return;
    // amount = Math.min(amount, 10);
    context.save();
    const region = new Path2D();
    region.rect(x, y, width, height);
    context.clip(region);
    const strokeColor = tinycolor(color).toRgbString();
    const size = 3;
    const colStep = width / amount; // mapRange(1, 10, 20, 3, amount);
    const rowStep = height / amount; // mapRange(1, 10, 20, 3, amount);

    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.lineCap = 'round';

    for (let i = 0; i < width; i += colStep) {
        for (let j = 0; j < height; j += rowStep) {
            const tx = x + randomNormalWholeBetween(i, i + colStep);
            const ty = y + randomNormalWholeBetween(j, j + rowStep);
            const tx2 = tx + size;
            const ty2 = ty + size * -1;
            context.beginPath();
            context.moveTo(tx, ty);
            context.lineTo(tx2, ty2);
            context.stroke();
        }
    }

    context.restore();
};

export const texturizeRect = (context) => (
    x,
    y,
    width,
    height,
    color = 'black',
    amount = 5,
    mode = 'circles',
    mult = 100
) => {
    if (amount <= 0) return;

    context.save();
    const region = new Path2D();
    region.rect(x, y, width, height);
    context.clip(region);
    const half = width / 4;
    const strokeColor = tinycolor(color).toRgbString();
    const lineWidth = 1;
    const fillamount = amount * mult;

    for (let i = 0; i < fillamount; i++) {
        let tx = randomWholeBetween(x, x + width);
        let ty = randomWholeBetween(y, y + height);
        let size = randomWholeBetween(half, width);

        context.strokeStyle = strokeColor;
        context.lineWidth = lineWidth;
        context.beginPath();

        if (mode === 'circles') {
            context.arc(tx, ty, size, 0, Math.PI * 2, false);
        } else if (mode === 'circles2') {
            tx = randomNormalWholeBetween(x, x + width);
            ty = randomNormalWholeBetween(y, y + height);
            size = randomWholeBetween(1, width);
            context.arc(tx, ty, size, 0, Math.PI * 2, false);
        } else if (mode === 'xhatch') {
            const tx2 = tx + size * randomSign();
            const ty2 = ty + size * randomSign();
            context.moveTo(tx, ty);
            context.lineTo(tx2, ty2);
        }

        context.stroke();
    }
    context.restore();
};

export const spiralRect = (context) => (x, y, width, height, color = 'black', amount = 5) => {
    if (amount <= 0) return;
    const amountInv = 11 - Math.min(amount, 10);

    const maxDim = Math.max(width, height);
    const maxRadius = maxDim * 0.7;

    const numIttr = maxDim * (amountInv * 0.8);
    const radIncr = maxRadius / numIttr;

    const thetaIncr = TAU / 50; // Math.floor(amount) * 0.05; // TAU / (Math.floor(amount) * 0.05);

    context.save();

    const strokeColor = tinycolor(color).toRgbString();
    const lineWidth = 1;
    const region = new Path2D();
    region.rect(x, y, width, height);
    context.clip(region);
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;

    const spirals = Math.ceil(amountInv);
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
    context.restore();
};
