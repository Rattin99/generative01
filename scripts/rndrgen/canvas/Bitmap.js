import tinycolor from 'tinycolor2';
import { clear } from './canvas';
import { mapRange, E } from '../math/math';
import { point } from '../math/points';
import { averageNumArray } from '../utils';
import { pixel, rectFilled } from './primatives';
// import { initialize } from './EdgeDetect';
import { Matrix } from '../math/Matrix';

/*
import sourcePng from '../../media/images/kristijan-arsov-woman-400.png';
import { Bitmap } from '../rndrgen/canvas/Bitmap';

const image = new Bitmap(sourcePng);

image.init(canvas, context); // in setup

 */

// from https://github.com/cmisenas/cabbage.js/blob/master/cabbage.js

const pixelDirections = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
const pixelColorValues = ['r', 'g', 'b', 'a'];

export class Pixel {
    constructor(x, y, vals) {
        this.x = x;
        this.y = y;
        this.neighbors = {};

        // wat?
        if (vals) {
            pixelColorValues.forEach((d) => {
                this[d] = vals.shift();
            });
        }

        pixelDirections.forEach((d) => {
            this.neighbors[d] = this[d]();
        });
    }

    n() {
        return { x: this.x, y: this.y - 1 };
    }

    e() {
        return { x: this.x + 1, y: this.y };
    }

    s() {
        return { x: this.x, y: this.y + 1 };
    }

    w() {
        return { x: this.x - 1, y: this.y };
    }

    ne() {
        return { x: this.x + 1, y: this.y - 1 };
    }

    nw() {
        return { x: this.x - 1, y: this.y - 1 };
    }

    se() {
        return { x: this.x + 1, y: this.y - 1 };
    }

    sw() {
        return { x: this.x + 1, y: this.y - 1 };
    }
}

// from https://github.com/cmisenas/canny-edge-detection
// Generate normal kernel for gausian blur
const generateKernel = function (sigma, size) {
    const kernel = [];
    // const E = 2.718; // Euler's number rounded of to 3 places
    for (let y = -(size - 1) / 2, i = 0; i < size; y++, i++) {
        kernel[i] = [];
        for (let x = -(size - 1) / 2, j = 0; j < size; x++, j++) {
            // create kernel round to 3 decimal places
            kernel[i][j] =
                (1 / (2 * Math.PI * Math.pow(sigma, 2))) *
                Math.pow(E, -(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)) / (2 * Math.pow(sigma, 2)));
        }
    }
    // normalize the kernel to make its sum 1
    const normalize = 1 / Matrix.sum(kernel);
    for (let k = 0; k < kernel.length; k++) {
        for (let l = 0; l < kernel[k].length; l++) {
            kernel[k][l] = Math.round(normalize * kernel[k][l] * 1000) / 1000;
        }
    }
    return kernel;
};

const SOBEL_X_FILTER = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
];
const SOBEL_Y_FILTER = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
];
const ROBERTS_X_FILTER = [
    [1, 0],
    [0, -1],
];
const ROBERTS_Y_FILTER = [
    [0, 1],
    [-1, 0],
];
const PREWITT_X_FILTER = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
];
const PREWITT_Y_FILTER = [
    [-1, -1, -1],
    [0, 0, 0],
    [1, 1, 1],
];

const findEdgeKernels = {
    sobel: {
        x: SOBEL_X_FILTER,
        y: SOBEL_Y_FILTER,
        len: SOBEL_X_FILTER.length,
    },
    roberts: {
        x: ROBERTS_X_FILTER,
        y: ROBERTS_Y_FILTER,
        len: ROBERTS_Y_FILTER.length,
    },
    prewitt: {
        x: PREWITT_X_FILTER,
        y: PREWITT_Y_FILTER,
        len: PREWITT_Y_FILTER.length,
    },
};

//----------------------------------------------------------------------------------------------------------------------

export class Bitmap {
    constructor(src) {
        this.scaleX = 1;
        this.scaleY = 1;

        this.image = new Image();
        this.image.src = src;
        this.imageData = undefined;
    }

    get width() {
        return this.imageData.width;
    }

    get height() {
        return this.imageData.height;
    }

    get data() {
        return this.imageData;
    }

    toCanvasX(x) {
        return Math.round(x * this.scaleX);
    }

    toCanvasY(y) {
        return Math.round(y * this.scaleY);
    }

    init(canvas, context, wipe = true) {
        this.canvas = canvas;
        this.context = context;
        this.context.drawImage(this.image, 0, 0);

        this.imageWidth = this.image.width || this.canvas.width;
        this.imageHeight = this.image.height || this.canvas.height;

        this.rawImageData = this.context.getImageData(0, 0, this.imageWidth, this.imageHeight);
        this.refreshImageData();

        this.scaleX = this.canvas.width / this.imageWidth;
        this.scaleY = this.canvas.height / this.imageHeight;
        if (wipe) clear(this.canvas, this.context);
    }

    refreshImageData() {
        this.imageData = this.context.getImageData(0, 0, this.imageWidth, this.imageHeight);
    }

    resetImageData() {
        this.context.putImageData(this.rawImageData, 0, 0);
        this.refreshImageData();
    }

    pixelIsBorder(x, y) {
        return (
            (x === 0 && y < this.height && y >= 0) ||
            (y === 0 && x < this.width && x >= 0) ||
            (x === this.width - 1 && y < this.height && y >= 0) ||
            (y === this.height - 1 && x < this.width && x >= 0)
        );
    }

    pixelIsOutOfBounds(x, y) {
        return x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1;
    }

    // TODO: implement bounds wrapping
    pixelColorRaw(x, y) {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x >= this.width) x = this.width - 1;
        if (y >= this.height) y = this.height - 1;
        return {
            r: this.imageData.data[y * 4 * this.imageData.width + x * 4],
            g: this.imageData.data[y * 4 * this.imageData.width + x * 4 + 1],
            b: this.imageData.data[y * 4 * this.imageData.width + x * 4 + 2],
            a: this.imageData.data[y * 4 * this.imageData.width + x * 4 + 3],
        };
    }

    pixelColor(x, y) {
        return tinycolor(this.pixelColorRaw(x, y));
    }

    // 0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b;
    /*
    Gray = 0.21R + 0.72G + 0.07B // Luminosity
    Gray = (R + G + B) ÷ 3 // Average Brightness
    Gray = 0.299R + 0.587G + 0.114B // rec601 standard
    Gray = 0.2126R + 0.7152G + 0.0722B // ITU-R BT.709 standard
    Gray = 0.2627R + 0.6780G + 0.0593B // ITU-R BT.2100 standard
     */
    // https://sighack.com/post/averaging-rgb-colors-the-right-way
    pixelAverageGrey(x, y) {
        const color = this.pixelColorRaw(x, y);
        return Math.sqrt((color.r * color.r + color.g * color.g + color.b * color.b) / 3);
    }

    pixelTheta(x, y) {
        // return this.pixelColor(x, y).getBrightness() / 256;
        return this.pixelAverageGrey(x, y) / 256;
    }

    pixelColorFromCanvas(x, y) {
        return this.pixelColor(Math.round(x / this.scaleX), Math.round(y / this.scaleY));
    }

    pixelAverageGreyFromCanvas(x, y) {
        return this.pixelAverageGrey(Math.round(x / this.scaleX), Math.round(y / this.scaleY));
    }

    pixelThetaFromCanvas(x, y) {
        return this.pixelTheta(Math.round(x / this.scaleX), Math.round(y / this.scaleY));
    }

    sizeFromPixelBrightness(x, y, size = 5, low = 0, max = 255) {
        const pixelColor = this.pixelColorFromCanvas(x, y);
        const brightness = 256 - pixelColor.getBrightness();
        return mapRange(low, max, 0, size, brightness);
    }

    averageGreyFromCell(x, y, w, h, res = 2) {
        const points = [];
        for (let i = x; i < x + w; i += res) {
            for (let k = y; k < y + h; k += res) {
                points.push(this.pixelAverageGrey(Math.round(i / this.scaleX), Math.round(k / this.scaleY)));
            }
        }
        return averageNumArray(points);
    }

    showToCanvas(res) {
        const { width, height } = this.canvas;

        res = res || width / 4;

        const colw = width / res;
        const rowh = height / res;

        for (let i = 0; i < res; i++) {
            for (let j = 0; j < res; j++) {
                const x = i * colw;
                const y = j * rowh;
                rectFilled(this.context)(x, y, colw, rowh, this.pixelColorFromCanvas(x, y));
            }
        }
    }

    thresholdAsPoints(res, threshold = 128, inv = false) {
        const testFn = (g) => (inv ? g < threshold : g > threshold);

        const points = [];
        const { width, height } = this.canvas;

        const colw = width / res;
        const rowh = height / res;

        for (let i = 0; i < res; i++) {
            for (let j = 0; j < res; j++) {
                const x = i * colw;
                const y = j * rowh;
                if (testFn(this.pixelAverageGreyFromCanvas(x, y))) {
                    points.push(point(x, y));
                }
            }
        }

        return points;
    }

    // create a NxN matrix of x,y coords centered around px and py and map a fn
    // const logPos = (x, y) => `${x}, ${y}`;
    mapPixelPositionMatrix(mapper, px, py, border = 1) {
        const defaultMapper = (x, y) => ({ x, y });

        mapper = mapper || defaultMapper;

        const size = border * 2 + 1;
        const startside = border * -1;
        const sidelen = border * 2 - (border - 1);
        const m = new Matrix(size, size);
        for (let r = startside; r < sidelen; r++) {
            for (let c = startside; c < sidelen; c++) {
                const x = px + c;
                const y = py + r;
                m.data[r + border][c + border] = mapper(x, y);
            }
        }

        return m;
    }

    // passes mapper current x,y and then sets the pixel to the returned color value
    map(mapper, save = true) {
        for (let x = 0; x < this.imageData.width; x++) {
            for (let y = 0; y < this.imageData.height; y++) {
                const result = mapper(x, y);
                pixel(this.context)(x, y, result);
            }
        }
        if (save) this.refreshImageData();
    }

    greyscale() {
        this.map((x, y) => {
            const grey = this.pixelAverageGrey(x, y);
            return tinycolor({ r: grey, g: grey, b: grey });
        });
    }

    invert() {
        this.map((x, y) => {
            const color = this.pixelColorRaw(x, y);
            return tinycolor({ r: 255 - color.r, g: 255 - color.g, b: 255 - color.b });
        });
    }

    findEdges(threshold = 30, edgeColor = 'white', backColor = 'black', edgeStrength = 255) {
        this.map((x, y) => {
            let diff = 0;

            const current = this.pixelAverageGrey(x, y);
            const left = this.pixelAverageGrey(x - 1, y);
            const right = this.pixelAverageGrey(x + 1, y);
            const top = this.pixelAverageGrey(x, y - 1);
            const bottom = this.pixelAverageGrey(x, y + 1);

            if (current > left + threshold || current < left - threshold) {
                diff = Math.abs(current - left);
            } else if (current > right + threshold || current < right - threshold) {
                diff = Math.abs(current - right);
            } else if (current > top + threshold || current < top - threshold) {
                diff = Math.abs(current - top);
            } else if (current > bottom + threshold || current < bottom - threshold) {
                diff = Math.abs(current - bottom);
            }

            return tinycolor.mix(backColor, edgeColor, mapRange(0, edgeStrength, 0, 100, diff));
        });
    }

    loadImageData(src, wipe = true) {
        // const MAX_HEIGHT = 100;
        this.image = new Image();
        this.image.onload = function () {
            console.log(this, this.context);
            this.context.drawImage(this.image, 0, 0);
            // TODO update raw as well
            this.imageData = this.context.getImageData(0, 0, this.image.width, this.image.width);
            this.scaleX = this.canvas.width / this.imageData.width;
            this.scaleY = this.canvas.height / this.imageData.height;
            if (wipe) clear(this.canvas, this.context);
            // const canvas = document.getElementById('myCanvas');
            // if (dropImage.height > MAX_HEIGHT) {
            //     dropImage.width *= MAX_HEIGHT / dropImage.height;
            //     dropImage.height = MAX_HEIGHT;
            // }
            // const ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            // canvas.width = dropImage.width;
            // canvas.height = dropImage.height;
            // ctx.drawImage(dropImage, 0, 0, dropImage.width, dropImage.height);
        };
        this.image.src = src;
    }
}

// scratch
/*
    findEdgesCabbage(method = 0, blur = false) {
        this.edge = initialize(this.canvas);

        if (blur) {
            this.edge.blur();
            this.edge.greyScale();
        }

        switch (method) {
            case 1:
                this.edge.prewitt();
                break;
            case 2:
                this.edge.roberts();
                break;
            default:
                this.edge.sobel();
        }
        this.refreshImageData();
    }

const createColorArrayFromImageData = (imageData) => {
    const data = [];
    for (let y = 0, { height } = imageData; y < height; y++) {
        for (let x = 0, { width } = imageData; x < width; x++) {
            data.push({ x, y, ...getImageColor(imageData, x, y) });
        }
    }
    return data;
};

const renderImage = () => {
    for (let x = startX; x < maxX; x++) {
        for (let y = startY; y < maxY; y++) {
            const color = image.pixelColorFromCanvas(x, y);
            pixel(ctx)(x, y, color, 'square', 1);
        }
    }
};
*/
