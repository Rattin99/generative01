import { radiansToDegrees, pointAngleFromVelocity, pointDistance, normalizeInverse } from './math';

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
    context.fillStyle = color;
    context.fill();
};

export const drawSquare = (context) => ({ x, y, radius, color }) => {
    context.fillStyle = color;
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
    context.fillStyle = color;
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
            const pColor = pA.colorRgba.toRgb();

            if (distance < proximity) {
                opacity = normalizeInverse(0, proximity, distance);
                const lColor = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${opacity})`;
                context.strokeStyle = lColor;
                drawLine(context)(1, pA.x, pA.y, pB.x, pB.y);
            }
        }
    }
};

export const drawPointTrail = (context) => (particle) => {
    const trailLen = particle.xHistory.length;
    context.lineWidth = particle.radius;
    const pColor = particle.colorRgba.toRgb();
    const aFade = (100 / trailLen) * 0.01;
    const alpha = 1;
    const sFade = (particle.radius * 2) / trailLen;
    let stroke = particle.radius * 2;
    for (let i = 0; i < trailLen; i++) {
        const startX = i === 0 ? particle.x : particle.xHistory[i - 1];
        const startY = i === 0 ? particle.y : particle.yHistory[i - 1];
        drawLine(context)(stroke, startX, startY, particle.xHistory[i], particle.yHistory[i]);
        context.strokeStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${alpha})`;
        // alpha -= aFade;
        stroke -= sFade;
    }
    //
};

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
