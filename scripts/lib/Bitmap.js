import tinycolor from 'tinycolor2';
import { clearCanvas, getImageDataColor } from './canvas';
import { averageNumArray, mapRange } from './math';

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

    init(canvas, context, clear = true) {
        this.canvas = canvas;
        this.context = context;
        this.context.drawImage(this.image, 0, 0);
        this.imageData = context.getImageData(0, 0, this.image.width, this.image.width);
        this.scaleX = canvas.width / this.imageData.width;
        this.scaleY = canvas.height / this.imageData.height;
        if (clear) clearCanvas(canvas, context);
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
        return 255 - Math.sqrt((color.r * color.r + color.g * color.g + color.b * color.b) / 3);
    }

    pixelTheta(x, y) {
        // return this.pixelColor(x, y).getBrightness() / 256;
        return this.pixelAverageGrey(x, y) / 256;
    }

    pixelColorFromCanvas(x, y) {
        return this.pixelColor(Math.round(x / this.scaleX), Math.round(y / this.scaleY));
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

    // const createColorArrayFromImageData = (imageData) => {
    //     const data = [];
    //     for (let y = 0, { height } = imageData; y < height; y++) {
    //         for (let x = 0, { width } = imageData; x < width; x++) {
    //             data.push({ x, y, ...getImageColor(imageData, x, y) });
    //         }
    //     }
    //     return data;
    // };
}

/*
const renderImage = () => {
        for (let x = startX; x < maxX; x++) {
            for (let y = startY; y < maxY; y++) {
                const color = image.pixelColorFromCanvas(x, y);
                pixel(ctx)(x, y, color, 'square', 1);
            }
        }
    };
 */
