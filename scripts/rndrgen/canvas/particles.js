import { normalizeInverse } from '../math/math';
import { resetStyles } from './canvas';
import { line } from './primatives';
import { pointDistance } from '../math/points';

// TODO use pixel
export const particlePoint = (context) => ({ x, y, radius, color }) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color.toRgbString();
    context.fill();
};

export const particleRotated = (ctx, drawFn, particle, ...args) => {
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

export const particleHistoryTrail = (context) => (particle) => {
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
        line(context)(startX, startY, particle.xHistory[i], particle.yHistory[i], stroke);
        pColor.setAlpha(alpha);
        context.strokeStyle = pColor.toRgbString();
        alpha -= aFade;
        stroke -= sFade;
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
                line(context)(pA.x, pA.y, pB.x, pB.y, 0.5);
            }
        }
    }
    resetStyles(context);
};
