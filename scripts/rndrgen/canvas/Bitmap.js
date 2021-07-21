import tinycolor from 'tinycolor2';
import { clear } from './canvas';
import { mapRange, E } from '../math/math';
import { point } from '../math/points';
import { averageNumArray } from '../utils';
import { pixel, rectFilled } from './primatives';
import { Matrix } from '../math/Matrix';

/*
import sourcePng from '../../media/images/kristijan-arsov-woman-400.png';
import { Bitmap } from '../rndrgen/canvas/Bitmap';

const image = new Bitmap(sourcePng);

image.init(canvas, context); // in setup

 */

// from https://github.com/cmisenas/cabbage.js/blob/master/cabbage.js

// const pixelDirections = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
// const pixelColorValues = ['r', 'g', 'b', 'a'];
//
// export class Pixel {
//     constructor(x, y, vals) {
//         this.x = x;
//         this.y = y;
//         this.neighbors = {};
//
//         // wat?
//         if (vals) {
//             pixelColorValues.forEach((d) => {
//                 this[d] = vals.shift();
//             });
//         }
//
//         pixelDirections.forEach((d) => {
//             this.neighbors[d] = this[d]();
//         });
//     }
//
//     n() {
//         return { x: this.x, y: this.y - 1 };
//     }
//
//     e() {
//         return { x: this.x + 1, y: this.y };
//     }
//
//     s() {
//         return { x: this.x, y: this.y + 1 };
//     }
//
//     w() {
//         return { x: this.x - 1, y: this.y };
//     }
//
//     ne() {
//         return { x: this.x + 1, y: this.y - 1 };
//     }
//
//     nw() {
//         return { x: this.x - 1, y: this.y - 1 };
//     }
//
//     se() {
//         return { x: this.x + 1, y: this.y - 1 };
//     }
//
//     sw() {
//         return { x: this.x + 1, y: this.y - 1 };
//     }
// }

// from https://github.com/cmisenas/canny-edge-detection
// const generateGausianKernel = function (sigma, size) {
//     const kernel = [];
//     const E = 2.718; // Euler's number rounded of to 3 places
//     for (let y = -(size - 1) / 2, i = 0; i < size; y++, i++) {
//         kernel[i] = [];
//         for (let x = -(size - 1) / 2, j = 0; j < size; x++, j++) {
//             // create kernel round to 3 decimal places
//             kernel[i][j] =
//                 (1 / (2 * Math.PI * Math.pow(sigma, 2))) *
//                 Math.pow(E, -(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)) / (2 * Math.pow(sigma, 2)));
//         }
//     }
//     // normalize the kernel to make its sum 1
//     // const normalize = 1 / Matrix.sum(kernel);
//     // for (let k = 0; k < kernel.length; k++) {
//     //     for (let l = 0; l < kernel[k].length; l++) {
//     //         kernel[k][l] = Math.round(normalize * kernel[k][l] * 1000) / 1000;
//     //     }
//     // }
//     return kernel;
// };
//
// Matrix.fromArray2(generateGausianKernel(1, 10)).log();

//----------------------------------------------------------------------------------------------------------------------

const colorChannels = ['r', 'g', 'b'];

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

    getImageData() {
        return this.context.getImageData(0, 0, this.imageWidth, this.imageHeight);
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

    pixelIndexValue(x, y) {
        return y * this.imageData.width + x * 4;
    }

    pixelColorFromImageData(imagedata, x, y) {
        const { data, width } = imagedata;
        return {
            r: data[y * 4 * width + x * 4],
            g: data[y * 4 * width + x * 4 + 1],
            b: data[y * 4 * width + x * 4 + 2],
            a: data[y * 4 * width + x * 4 + 3],
        };
    }

    // Possible faster way https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
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

    // TODO Optimize this
    // create a NxN matrix of x,y coords centered around px and py and map a fn
    // const logPos = (x, y) => `${x}, ${y}`;
    // const colorChannel = (channel) => (x, y) => this.pixelColorRaw(x, y)[channel];
    mapPixelPositionMatrix(mapper, px, py, range = 1) {
        const defaultMapper = (x, y) => ({ x, y });
        mapper = mapper || defaultMapper;
        const size = range * 2 + 1;
        const startside = range * -1;
        const sidelen = range * 2 - (range - 1);
        const m = new Matrix(size, size);
        for (let r = startside; r < sidelen; r++) {
            for (let c = startside; c < sidelen; c++) {
                const x = px + c;
                const y = py + r;
                m.data[r + range][c + range] = mapper(x, y);
            }
        }

        return m;
    }

    // passes mapper current x,y and then sets the pixel to the returned color value
    map(mapper) {
        for (let x = 0; x < this.imageData.width; x++) {
            for (let y = 0; y < this.imageData.height; y++) {
                const result = mapper(x, y);
                pixel(this.context)(x, y, result);
            }
        }
    }

    greyscale() {
        this.map((x, y) => {
            const grey = this.pixelAverageGrey(x, y);
            return tinycolor({ r: grey, g: grey, b: grey });
        });
        this.refreshImageData();
    }

    invert() {
        this.map((x, y) => {
            const color = this.pixelColorRaw(x, y);
            return tinycolor({ r: 255 - color.r, g: 255 - color.g, b: 255 - color.b });
        });
        this.refreshImageData();
    }

    // https://www.codingame.com/playgrounds/2524/basic-image-manipulation/filtering
    // TODO optimize w/ seperable filters https://www.youtube.com/watch?v=SiJpkucGa1o
    convolveColorChannels(kernel) {
        // Needs to be odd
        const kernelSize = kernel.size;
        const pxMatrixSize = (kernelSize - 1) / 2;
        let kernelSum = Matrix.sum(kernel);
        if (kernelSum === 0) kernelSum = 1;

        const colorChannel = (channel) => (x, y) => this.pixelColorRaw(x, y)[channel];

        this.map((x, y) => {
            const newColors = [];
            colorChannels.forEach((c) => {
                // get a matrix around the pixel
                const colorMatrix = this.mapPixelPositionMatrix(colorChannel(c), x, y, pxMatrixSize);
                // for each color channel multiply by the matrix
                colorMatrix.multiply(kernel);
                // sum both, div by the boxBlur matrix
                newColors.push(Matrix.sum(colorMatrix) / kernelSum);
            });
            // averaged color value of the pixel, set the color channel to that value
            return tinycolor({ r: newColors[0], g: newColors[1], b: newColors[2] });
        });
    }

    boxBlur(size = 1) {
        const kernelSize = size * 2 + 1;
        const kernel = new Matrix(kernelSize, kernelSize);
        kernel.fill(1);
        this.convolveColorChannels(kernel);
        this.refreshImageData();
    }

    sharpen(amount = 1) {
        const sharpenKernel = Matrix.fromArray2([
            [0, -0.5, 0],
            [-0.5, 3, -0.5],
            [0, -0.5, 0],
        ]);

        for (let i = 0; i < amount; i++) {
            this.convolveColorChannels(sharpenKernel);
        }

        this.refreshImageData();
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

    getValueInFlatArray(array, width, x, y) {
        return array[y * width + x];
    }

    convolveGrey(kernel, minValue = -255, maxValue = 255, channel = 'r') {
        // Needs to be odd
        const kernelSize = kernel.size;
        const pxMatrixSize = (kernelSize - 1) / 2;
        let kernelSum = Matrix.sum(kernel);
        if (kernelSum === 0) kernelSum = 1;

        const colorChannel = (x, y) => this.pixelColorRaw(x, y)[channel];

        // const result = [];
        // let max = 0;
        // let min = 0;
        this.map((x, y) => {
            // get a matrix around the pixel
            const colorMatrix = this.mapPixelPositionMatrix(colorChannel, x, y, pxMatrixSize);
            // for each color channel multiply by the matrix
            colorMatrix.multiply(kernel);
            // sum both, div by the boxBlur matrix
            const colorValue = Matrix.sum(colorMatrix) / kernelSum;

            // if (colorValue > max) max = colorValue;
            // if (colorValue < min) min = colorValue;
            // result.push(colorValue);

            const colorValueMapped = mapRange(minValue, maxValue, 0, 255, colorValue);
            // averaged color value of the pixel, set the color channel to that value
            return tinycolor({ r: colorValueMapped, g: colorValueMapped, b: colorValueMapped });
        });

        // console.log(`min ${min}, max ${max}`);
        // return result;
    }

    convolveXYKernels(xkernel, ykernel) {
        const minValue = -255;
        const maxValue = 255;

        this.convolveGrey(xkernel, minValue, maxValue);
        const xgradient = this.getImageData();
        this.convolveGrey(ykernel, minValue, maxValue);
        const ygradient = this.getImageData();

        this.map((x, y) => {
            const xg = mapRange(0, 255, minValue, maxValue, this.pixelColorFromImageData(xgradient, x, y).r);
            const yg = mapRange(0, 255, minValue, maxValue, this.pixelColorFromImageData(ygradient, x, y).r);
            const fg = Math.hypot(xg, yg);
            const colorValueMapped = mapRange(0, 255, 0, 255, fg);
            return tinycolor({ r: colorValueMapped, g: colorValueMapped, b: colorValueMapped });
        });
    }

    sobelEdges() {
        const sobelXKernel = Matrix.fromArray2([
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1],
        ]);
        const sobelYKernel = Matrix.fromArray2([
            [1, 2, 1],
            [0, 0, 0],
            [-1, -2, -1],
        ]);

        this.convolveXYKernels(sobelXKernel, sobelYKernel);
        this.refreshImageData();
    }

    robertsEdges() {
        // current implementation won't work with matricies smaller than 3x3
        // const robertsXKernel = Matrix.fromArray2([
        //     [1, 0],
        //     [0, -1],
        // ]);
        // const robertsYKernel = Matrix.fromArray2([
        //     [0, 1],
        //     [-1, 0],
        // ]);

        const robertsXKernel = Matrix.fromArray2([
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, -1],
        ]);
        const robertsYKernel = Matrix.fromArray2([
            [0, 0, 1],
            [0, 0, 0],
            [-1, 0, 0],
        ]);
        this.convolveXYKernels(robertsXKernel, robertsYKernel);
        this.refreshImageData();
    }

    prewittEdges() {
        const prewittXKernel = Matrix.fromArray2([
            [-1, 0, 1],
            [-1, 0, 1],
            [-1, 0, 1],
        ]);
        const prewittYKernel = Matrix.fromArray2([
            [-1, -1, -1],
            [0, 0, 0],
            [1, 1, 1],
        ]);
        this.convolveXYKernels(prewittXKernel, prewittYKernel);
        this.refreshImageData();
    }

    // IN DEV - loading a new image that's been dropped onto the canvas
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
