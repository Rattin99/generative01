import tinycolor from 'tinycolor2';
import { clear } from './canvas';
import { mapRange } from '../math/math';
import { point } from '../math/points';
import { averageNumArray } from '../utils';

// const createColorArrayFromImageData = (imageData) => {
//     const data = [];
//     for (let y = 0, { height } = imageData; y < height; y++) {
//         for (let x = 0, { width } = imageData; x < width; x++) {
//             data.push({ x, y, ...getImageColor(imageData, x, y) });
//         }
//     }
//     return data;
// };

// const renderImage = () => {
//     for (let x = startX; x < maxX; x++) {
//         for (let y = startY; y < maxY; y++) {
//             const color = image.pixelColorFromCanvas(x, y);
//             pixel(ctx)(x, y, color, 'square', 1);
//         }
//     }
// };

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
        return Math.round(y * this.scaley);
    }

    init(canvas, context, wipe = true) {
        this.canvas = canvas;
        this.context = context;
        this.context.drawImage(this.image, 0, 0);

        const imageWidth = this.image.width || this.canvas.width;
        const imageHeight = this.image.height || this.canvas.height;

        this.imageData = this.context.getImageData(0, 0, imageWidth, imageHeight);
        this.scaleX = this.canvas.width / imageWidth;
        this.scaleY = this.canvas.height / imageHeight;
        if (wipe) clear(this.canvas, this.context);
    }

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

    thresholdAsPoints(res, threshold = 128) {
        const testFn = (g) => g > threshold;

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

    loadImageData(src, wipe = true) {
        // const MAX_HEIGHT = 100;
        this.image = new Image();
        this.image.onload = function () {
            console.log(this, this.context);
            this.context.drawImage(this.image, 0, 0);
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
