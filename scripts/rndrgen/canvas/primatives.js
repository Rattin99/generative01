import tinycolor from 'tinycolor2';
import * as cnvs from './canvas';
import { snapNumber } from '../math/math';

export const pixel = (context) => (x, y, color = 'black', mode = 'square', size) => {
    size = size || cnvs.currentContextScale();
    context.beginPath();
    context.fillStyle = tinycolor(color).toRgbString();
    if (mode === 'circleOld') {
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2, false);
        context.fill();
    } else {
        context.fillRect(x, y, size, size);
    }
    context.closePath();
};

// linecap = butt, round, square
export const line = (context) => (x1, y1, x2, y2, strokeWidth, linecap) => {
    context.beginPath();
    // color = 'black',
    // context.strokeStyle = tinycolor(color).toRgbString();
    if (strokeWidth) context.lineWidth = strokeWidth;
    if (linecap) context.lineCap = linecap;

    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
};

export const lineAtAngle = (context) => (x1, y1, angle, length, strokeWidth, linecap) => {
    const theta = (Math.PI * angle) / 180.0;
    const x2 = x1 + length * Math.cos(theta);
    const y2 = y1 + length * Math.sin(theta);
    line(context)(x1, y1, x2, y2, strokeWidth, linecap);
};

export const circleOld = (context) => (strokeWidth, x, y, radius, color) => {
    context.beginPath();
    if (color) {
        context.strokeStyle = tinycolor(color).toRgbString();
    }
    context.lineWidth = strokeWidth;

    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
    context.closePath();
};

export const circle = (context) => (x, y, radius, color) => {
    context.beginPath();
    if (color) {
        context.strokeStyle = tinycolor(color).toRgbString();
    }

    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
};

export const circleFilled = (context) => (x, y, radius, color) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = tinycolor(color).toRgbString();
    context.fill();
    context.closePath();
};

export const rect = (context) => (x, y, w, h, strokeWidth = 1, color) => {
    context.beginPath();
    if (color) {
        context.strokeStyle = tinycolor(color).toRgbString();
    }
    context.lineWidth = strokeWidth;
    context.rect(x, y, w, h);
    context.stroke();
    context.closePath();
};

export const rectFilled = (context) => (x, y, w, h, color = 'white') => {
    context.beginPath();
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(x, y, w, h);
    context.closePath();
};

export const squareFilled = (context) => (x, y, size, color) => {
    rectFilled(context)(x, y, size, size, color);
};

export const drawTriangleFilled = (context) => (x, y, size, color) => {
    const half = size / 2;
    context.beginPath();
    context.moveTo(x - half, y - half);
    context.lineTo(x + half, y);
    context.lineTo(x - half, y + half);
    context.fillStyle = color.toRgbString();
    context.fill();
    context.closePath();
};

// https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y
export const quadRectFilled = (context) => (x, y, w, h, color) => {
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
    context.closePath();
};

// https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y
export const roundRectFilled = (context) => (x, y, w, h, corner, color) => {
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
    context.closePath();
};

export const pixelAtPoints = (context) => (points, color = 'black', width = 1) => {
    points.forEach((coords, i) => {
        pixel(context)(coords[0], coords[1], color, 'circleOld', width);
    });
};

export const pointPathPA = (context) => (points, color = 'black', width = 1, close = false, drawPoint = false) => {
    context.beginPath();
    context.strokeStyle = tinycolor(color).clone().toRgbString();

    context.lineWidth = width;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    points.forEach((coords, i) => {
        if (i === 0) {
            context.moveTo(coords[0], coords[1]);
        } else {
            context.lineTo(coords[0], coords[1]);
        }
        if (drawPoint) {
            circleFilled(context)(coords[0], coords[1], 1, 'red');
        }
    });
    if (close) {
        context.lineTo(points[0][0], points[0][1]);
    }
    context.stroke();
    context.closePath();
};

export const pointPathPO = (context) => (points, color = 'black', width = 1, close = false, drawPoint = false) => {
    context.beginPath();
    context.strokeStyle = tinycolor(color).clone().toRgbString();

    context.lineWidth = width;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    points.forEach((coords, i) => {
        if (i === 0) {
            context.moveTo(coords.x, coords.y);
        } else {
            context.lineTo(coords.x, coords.y);
        }
        if (drawPoint) {
            circleFilled(context)(coords.x, coords.y, 1, 'red');
        }
    });
    if (close) {
        context.lineTo(points[0].x, points[0].y);
    }
    context.stroke();
    context.closePath();
};

/*
// tl
arcQuarter(context)(square.x, square.y, arcRad, 0);
// tr
arcQuarter(context)(square.x2, square.y, arcRad, Math.PI / 2);
// bl
arcQuarter(context)(square.x, square.y2, arcRad, Math.PI * 1.5);
// br
arcQuarter(context)(square.x, square.y2, arcRad, Math.PI);
 */
export const arcQuarter = (context) => (x, y, radius, startRadians, clockWise = false) => {
    // context.strokeStyle = tinycolor(color).toRgbString();
    // context.lineCap = 'butt';
    // context.lineWidth = thickness;
    const startR = snapNumber(Math.PI / 2, startRadians);
    const endR = startR + Math.PI / 2;
    context.beginPath();
    context.arc(x, y, radius, startR, endR, clockWise);
    context.stroke();
    context.closePath();
};
