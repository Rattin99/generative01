import tinycolor from 'tinycolor2';

let isHiDPI = false;
let contextScale = 1;

const contextHistory = [];

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

const contextDefaults = {
    strokeStyle: '#000',
    fillStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    textAlign: 'left',
    textBaseline: 'top',
    globalCompositeOperation: 'source-over',
};

export const setContext = (context) => (settings) => {
    contextHistory.push(settings);
    Object.keys(settings).forEach((k) => {
        context[k] = settings[k];
    });
};

export const resetContext = (context) => {
    setContext(context)(contextDefaults);
    context.setLineDash([]);
};

// https://www.rgraph.net/canvas/howto-antialias.html
export const sharpLines = (context) => context.translate(0.5, 0.5);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
// multiply, screen, overlay, soft-light, hard-light, color-dodge, color-burn, darken, lighten, difference, exclusion, hue, saturation, luminosity, color, add, subtract, average, negative
export const blendMode = (context) => (mode = 'source-over') => (context.globalCompositeOperation = mode);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
export const filter = (context) => (f = '') => (context.filter = f);

export const strokeWeight = (context) => (w = 1) => (context.lineWidth = w);
export const stokeColor = (context) => (color = '#000') => (context.strokeStyle = tinycolor(color).toRgbString());
export const fillColor = (context) => (color = '#000') => (context.fillStyle = tinycolor(color).toRgbString());

export const clear = (canvas, context) => (_) => context.clearRect(0, 0, canvas.width, canvas.height);

export const background = ({ width, height }, context) => (color = 'black') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(0, 0, width, height);
};
