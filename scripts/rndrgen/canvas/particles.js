import tinycolor from 'tinycolor2';
import { normalizeInverse } from '../math/math';
import { resetStyles } from './canvas';
import { drawLine } from './primatives';
import { pointDistance } from '../math/points';

export const drawParticlePoint = (context) => ({ x, y, radius, color }) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color.toRgbString();
    context.fill();
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
                drawLine(context)(pA.x, pA.y, pB.x, pB.y, 0.5);
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
        drawLine(context)(startX, startY, particle.xHistory[i], particle.yHistory[i], stroke);
        pColor.setAlpha(alpha);
        context.strokeStyle = pColor.toRgbString();
        alpha -= aFade;
        stroke -= sFade;
    }
};

export const drawParticleVectors = (context) => (particle) => {
    const vmult = 5;
    const amult = 100;
    const vel = 'green';
    const acc = 'yellow';
    const { velocity } = particle;
    const { acceleration } = particle;

    context.strokeStyle = tinycolor(vel).toRgbString();
    drawLine(context)(particle.x, particle.y, particle.x + velocity.x * vmult, particle.y + velocity.y * vmult, 1);

    context.strokeStyle = tinycolor(acc).toRgbString();
    drawLine(context)(
        particle.x,
        particle.y,
        particle.x + acceleration.x * amult,
        particle.y + acceleration.y * amult,
        1
    );
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
