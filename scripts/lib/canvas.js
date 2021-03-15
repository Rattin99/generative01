import tinycolor from 'tinycolor2';
import { uvFromAngle } from './math';

export let isHiDPI = false;
export let contextScale = 1;

export const resizeCanvas = (canvas, context, width, height, scale) => {
    contextScale = scale || window.devicePixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.width = Math.floor(width * contextScale);
    canvas.height = Math.floor(height * contextScale);

    if (contextScale === 2) {
        isHiDPI = true;
        context.scale(1, 1);
        // context.scale(2, 2);
    } else {
        context.scale(contextScale, contextScale);
    }
};

export const clearCanvas = (canvas, context) => (_) => context.clearRect(0, 0, canvas.width, canvas.height);

export const fillCanvas = (canvas, context) => (opacity = 1, color = '0,0,0') => {
    context.fillStyle = `rgba(${color},${opacity})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
};

export const background = (canvas, context) => (color = 'black') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(0, 0, canvas.width, canvas.height);
};

export const resetStyles = (context) => {
    context.strokeStyle = '#000';
    context.fillStyle = '#fff';
    context.lineWidth = 1;
    context.setLineDash([]);
    context.lineCap = 'butt';
};

// https://www.rgraph.net/canvas/howto-antialias.html
export const sharpLines = (context) => context.translate(0.5, 0.5);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
// multiply, screen, overlay, soft-light, hard-light, color-dodge, color-burn, darken, lighten, difference, exclusion, hue, saturation, luminosity, color, add, subtract, average, negative
export const blendMode = (context) => (mode = 'source-over') => (context.globalCompositeOperation = mode);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
export const filter = (context) => (f = '') => (context.filter = f);

//----------------------------------------------------------------------------------------------------------------------
// PRIMITIVES
//----------------------------------------------------------------------------------------------------------------------

export const pixel = (context) => (x, y, color = 'black', mode = 'square', size) => {
    size = size || contextScale;
    context.fillStyle = tinycolor(color).toRgbString();
    if (mode === 'circle') {
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2, false);
        context.fill();
    } else {
        context.fillRect(x, y, size, size);
    }
};

export const setStokeColor = (context) => (color) => (context.strokeStyle = tinycolor(color).toRgbString());

// linecap = butt, round, square
export const drawLine = (context) => (x1, y1, x2, y2, strokeWidth = 1, linecap = 'butt') => {
    // color = 'black',
    // context.strokeStyle = tinycolor(color).toRgbString();
    context.lineWidth = strokeWidth;
    context.lineCap = linecap;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
};

export const drawLineAngle = (context) => (x1, y1, angle, length, strokeWidth, linecap) => {
    const theta = (Math.PI * angle) / 180.0;
    const x2 = x1 + length * Math.cos(theta);
    const y2 = y1 + length * Math.sin(theta);
    drawLine(context)(x1, y1, x2, y2, strokeWidth, linecap);
};

// export const drawLineAngleV = (context) => (x1, y1, angle, length, strokeWidth, linecap) => {
//     const vect = uvFromAngle(angle).setMag(length);
//     const x2 = x1 + vect.x;
//     const y2 = y1 + vect.y;
//     drawLine(context)(x1, y1, x2, y2, strokeWidth, linecap);
// };

export const drawCircle = (context) => (strokeWidth, x, y, radius, color) => {
    if (color) {
        context.strokeStyle = tinycolor(color).toRgbString();
    }
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
};

export const drawCircleFilled = (context) => (x, y, radius, color) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color;
    context.fill();
};

export const drawRect = (context) => (x, y, w, h, strokeWidth = 1, color) => {
    if (color) {
        context.strokeStyle = tinycolor(color).toRgbString();
    }
    context.lineWidth = strokeWidth;
    context.rect(x, y, w, h);
    context.stroke();
};

export const drawRectFilled = (context) => (x, y, w, h, color = 'white') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(x, y, w, h);
};

export const drawSquareFilled = (context) => (x, y, size, color) => {
    drawRectFilled(context)(x, y, size, size, color);
};

export const drawTriangleFilled = (context) => (x, y, size, color) => {
    const half = size / 2;
    context.beginPath();
    context.moveTo(x - half, y - half);
    context.lineTo(x + half, y);
    context.lineTo(x - half, y + half);
    context.fillStyle = color.toRgbString();
    context.fill();
};

// https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y
export const drawQuadRectFilled = (context) => (x, y, w, h, color) => {
    const mx = x + w / 2;
    const my = y + h / 2;
    context.beginPath();
    // context.strokeStyle = 'green';
    // context.lineWidth = '4';
    context.fillStyle = tinycolor(color).toRgbString();
    context.moveTo(x, my);
    context.quadraticCurveTo(x, y, mx, y);
    context.quadraticCurveTo(x + w, y, x + w, my);
    context.quadraticCurveTo(x + w, y + h, mx, y + h);
    context.quadraticCurveTo(x, y + h, x, my);
    // context.stroke();
    context.fill();
};

// https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y
export const drawRoundRectFilled = (context) => (x, y, w, h, corner, color) => {
    if (w < corner || h < corner) {
        corner = Math.min(w, h);
    }

    const r = x + w;
    const b = y + h;
    context.beginPath();
    // context.strokeStyle = 'green';
    // context.lineWidth = '4';
    context.fillStyle = tinycolor(color).toRgbString();
    context.moveTo(x + corner, y);
    context.lineTo(r - corner, y);
    context.quadraticCurveTo(r, y, r, y + corner);
    context.lineTo(r, y + h - corner);
    context.quadraticCurveTo(r, b, r - corner, b);
    context.lineTo(x + corner, b);
    context.quadraticCurveTo(x, b, x, b - corner);
    context.lineTo(x, y + corner);
    context.quadraticCurveTo(x, y, x + corner, y);
    // context.stroke();
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
    drawLine(context)(x, y, x + radius, y, 1);
};
