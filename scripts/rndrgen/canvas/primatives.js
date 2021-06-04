import tinycolor from 'tinycolor2';
import { currentContextScale } from './canvas';

export const pixel = (context) => (x, y, color = 'black', mode = 'square', size) => {
    size = size || currentContextScale();
    context.fillStyle = tinycolor(color).toRgbString();
    if (mode === 'circle') {
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2, false);
        context.fill();
    } else {
        context.fillRect(x, y, size, size);
    }
};
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
