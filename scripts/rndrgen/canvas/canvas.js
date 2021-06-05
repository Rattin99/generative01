import tinycolor from 'tinycolor2';

let isHiDPI = false;
let contextScale = 1;

export const isHiDPICanvas = (_) => isHiDPI;
export const currentContextScale = (_) => contextScale;

export const resizeCanvas = (canvas, context, width, height, scale) => {
    contextScale = scale || window.devicePixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.width = Math.floor(width * contextScale);
    canvas.height = Math.floor(height * contextScale);

    if (contextScale === 2) {
        isHiDPI = true;
        context.scale(1, 1);
        // context.scale(2, 2); // not working
    } else {
        context.scale(contextScale, contextScale);
    }
};

export const resetStyles = (context) => {
    context.strokeStyle = '#000';
    context.fillStyle = '#000';
    context.lineWidth = 1;
    context.setLineDash([]);
    context.lineCap = 'butt';
    context.lineJoin = 'miter';
    context.textAlign = 'left';
    context.textBaseline = 'top';
};

// https://www.rgraph.net/canvas/howto-antialias.html
export const sharpLines = (context) => context.translate(0.5, 0.5);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
// multiply, screen, overlay, soft-light, hard-light, color-dodge, color-burn, darken, lighten, difference, exclusion, hue, saturation, luminosity, color, add, subtract, average, negative
export const blendMode = (context) => (mode = 'source-over') => (context.globalCompositeOperation = mode);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
export const filter = (context) => (f = '') => (context.filter = f);

export const stokeColor = (context) => (color) => (context.strokeStyle = tinycolor(color).toRgbString());
export const fillColor = (context) => (color) => (context.fillStyle = tinycolor(color).toRgbString());

export const clear = (canvas, context) => (_) => context.clearRect(0, 0, canvas.width, canvas.height);

export const background = (canvas, context) => (color = 'black') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(0, 0, canvas.width, canvas.height);
};
