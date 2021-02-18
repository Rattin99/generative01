import tinycolor from 'tinycolor2';

import { radiansToDegrees, pointAngleFromVelocity, pointDistance, normalizeInverse, pointOnCircle } from './math';

export const resizeCanvas = (canvas, width, height) => {
    canvas.width = width;
    canvas.height = height;
};

export const getImageDataFromImage = (context) => (image) => {
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.width);
};

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
export const getImageColor = (imageData, x, y) => ({
    r: imageData.data[y * 4 * imageData.width + x * 4],
    g: imageData.data[y * 4 * imageData.width + x * 4 + 1],
    b: imageData.data[y * 4 * imageData.width + x * 4 + 2],
    a: imageData.data[y * 4 * imageData.width + x * 4 + 3],
});

export const clearCanvas = (canvas, context) => (_) => context.clearRect(0, 0, canvas.width, canvas.height);

export const fillCanvas = (canvas, context) => (opacity = 1, color = '0,0,0') => {
    context.fillStyle = `rgba(${color},${opacity})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
};

export const background = (canvas, context) => (color = 'black') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(0, 0, canvas.width, canvas.height);
};

// context.save() and context.restore() may be slow, just reset what i'm using
export const resetStyles = (context) => {
    context.strokeStyle = '#000';
    context.fillStyle = '#fff';
    context.lineWidth = 1;
    context.setLineDash([]);
    context.lineCap = 'butt';
};

export const drawRotatedParticle = (ctx, drawFn, particle, ...args) => {
    const pSaveX = particle.x;
    const pSaveY = particle.y;
    particle.x = 0;
    particle.y = 0;
    ctx.save();
    ctx.translate(pSaveX, pSaveY);
    ctx.rotate(particle.heading);
    drawFn(ctx)(particle, args);
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

export const drawTestPoint = (context) => ({ x, y, radius, color }) => {
    context.strokeStyle = color.toRgbString();
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
    drawLine(context)(1, x, y, x + radius, y);
};

// TODO center it
export const drawRake = (context) => ({ x, y, radius, color }, spacing) => {
    const points = 5;
    spacing |= radius * 3;
    for (let i = 0; i < points; i++) {
        drawPoint(context)({ x: x + spacing * i, y, radius, color });
    }
};

export const drawRect = (context) => (x, y, w, h, color = 'white') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(x, y, w, h);
};

export const drawSquare = (context) => ({ x, y, radius, color }) => {
    drawRect(context)(x, y, radius, radius, color);
};

export const drawTriangle = (context) => ({ x, y, radius, color }) => {
    const half = radius / 2;
    context.beginPath();
    context.moveTo(x - half, y - half);
    context.lineTo(x + half, y);
    context.lineTo(x - half, y + half);
    context.fillStyle = color.toRgbString();
    context.fill();

    // context.beginPath();
    // context.arc(x+half, y, 3, 0, Math.PI * 2, false);
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

export const drawThickLine = (context) => (strokeWidth, x1, y1, x2, y2) => {
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
};

export const drawCircle = (context) => (strokeWidth, x, y, radius) => {
    // context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
};

export const drawParticleVectors = (context) => (particle) => {
    const vmult = 5;
    const amult = 100;
    const vel = 'green';
    const acc = 'yellow';
    const { vVector } = particle;
    const { aVector } = particle;

    context.strokeStyle = tinycolor(vel).toRgbString();
    drawLine(context)(1, particle.x, particle.y, particle.x + vVector.x * vmult, particle.y + vVector.y * vmult);

    context.strokeStyle = tinycolor(acc).toRgbString();
    drawLine(context)(1, particle.x, particle.y, particle.x + aVector.x * amult, particle.y + aVector.y * amult);
};

// Spikes is an array of angles
export const drawSpikeCircle = (context) => ({ x, y, radius, color }, spikes, spikeLength = 5) => {
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
        drawLine(context)(spikeStroke, pointA.x, pointA.y, pointB.x, pointB.y);
    }
};

export const connectParticles = (context) => (pArray, proximity, useAlpha = true) => {
    const len = pArray.length;
    for (let a = 0; a < len; a++) {
        // all consecutive particles
        for (let b = a; b < len; b++) {
            const pA = pArray[a];
            const pB = pArray[b];
            const distance = pointDistance(pA, pB);
            if (distance < proximity) {
                const pColor = pA.color;
                if (useAlpha) {
                    pColor.setAlpha(normalizeInverse(0, proximity, distance));
                }
                context.strokeStyle = pColor.toHslString();
                drawLine(context)(0.5, pA.x, pA.y, pB.x, pB.y);
            }
        }
    }
    resetStyles(context);
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
        pColor.setAlpha(alpha);
        context.strokeStyle = pColor.toRgbString();
        alpha -= aFade;
        stroke -= sFade;
    }
    //
};

export const drawMouse = (context) => ({ x, y, radius }) => {
    if (x === undefined || y === undefined) return;
    context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
};

export const drawAttractor = (context) => ({ x, y, mass, g }, mode, radius) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(0,0,0,.1)';
    context.fill();

    context.beginPath();
    context.arc(x, y, Math.sqrt(mass) * g, 0, Math.PI * 2, false);
    context.fillStyle = mode === 1 ? 'rgba(0,255,0,.25)' : 'rgba(255,0,0,.25)';
    context.fill();
};
