import tinycolor from 'tinycolor2';

import { radiansToDegrees, pointAngleFromVelocity, pointDistance, normalizeInverse } from './math';

export const resizeCanvas = (canvas, width, height) => {
    canvas.width = width;
    canvas.height = height;
}

export const clearCanvas = (canvas, context) => (_) => context.clearRect(0, 0, canvas.width, canvas.height);

export const fillCanvas = (canvas, context) => (opacity = 1, color = '0,0,0') => {
    context.fillStyle = `rgba(${color},${opacity})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
};

export const drawRotatedParticle = (ctx, drawFn, particle) => {
    const pSaveX = particle.x;
    const pSaveY = particle.y;
    particle.x = 0;
    particle.y = 0;
    ctx.save();
    ctx.translate(pSaveX, pSaveY);
    ctx.rotate(radiansToDegrees(pointAngleFromVelocity(particle)));
    drawFn(ctx)(particle);
    ctx.restore();
    particle.x = pSaveX;
    particle.y = pSaveY;
};

export const drawPoint = (context) => ({ x, y, radius, color }) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color.toRgbString();
    context.fill();
};

export const drawSquare = (context) => ({ x, y, radius, color }) => {
    context.fillStyle = color.toRgbString();
    context.fillRect(x, y, radius, radius);
    // const half = radius / 2;
    // context.beginPath();
    // context.moveTo(x - half, y - half);
    // context.lineTo(x + half, y - half);
    // context.lineTo(x + half, y + half);
    // context.lineTo(x - half, y + half);
    // context.fillStyle = color;
    // context.fill();
};

// https://codepen.io/jlmakes/pen/grEENL?editors=0010
export const drawTriangle = (context) => ({ x, y, radius, color }) => {
    const half = radius / 2;
    const apothem = radius / (2 * Math.tan(Math.PI / 3));
    const height = Math.round(Math.sqrt(3) * half);
    // draw triangle (clockwise)
    context.beginPath();
    context.moveTo(x, y + (-height + apothem));
    context.lineTo(x + half, y + apothem);
    context.lineTo(x - half, y + apothem);
    context.fillStyle = color.toRgbString();
    context.fill();

    // context.beginPath();
    // context.arc(x, y - 3, 3, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgb(255,0,0)';
    // context.fill();
};

export const drawLine = (context) => (strokeWidth, x1, y1, x2, y2) => {
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
};

export const connectParticles = (context) => (pArray, proximity) => {
    let opacity = 1;
    const len = pArray.length;
    for (let a = 0; a < len; a++) {
        // all consecutive particles
        for (let b = a; b < len; b++) {
            const pA = pArray[a];
            const pB = pArray[b];
            const distance = pointDistance(pA, pB);
            if (distance < proximity) {
                const pColor = pA.color;
                pColor.setAlpha(normalizeInverse(0, proximity, distance));
                context.strokeStyle = pColor.toHslString();
                drawLine(context)(.5, pA.x, pA.y, pB.x, pB.y);
            }
        }
    }
};

export const drawPointTrail = (context) => (particle) => {
    const trailLen = particle.xHistory.length;
    context.lineWidth = particle.radius;
    const pColor = particle.color;
    const aFade = (100 / trailLen) * 0.01;
    let alpha = 1;
    const sFade = (particle.radius * 2) / trailLen;
    let stroke = particle.radius * 2;
    for (let i = 0; i < trailLen; i++) {
        const startX = i === 0 ? particle.x : particle.xHistory[i - 1];
        const startY = i === 0 ? particle.y : particle.yHistory[i - 1];
        drawLine(context)(stroke, startX, startY, particle.xHistory[i], particle.yHistory[i]);
        pColor.setAlpha(alpha)
        context.strokeStyle = pColor.toRgbString();
        alpha -= aFade;
        stroke -= sFade;
    }
    //
};

// TODO rename to drawMouse and move inside var when needed
export const drawCircle = (context) => ({ x, y, radius }) => {
    if (x === undefined || y === undefined) return;
    context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
};
