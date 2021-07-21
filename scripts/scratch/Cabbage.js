/* Used by edge detect

Originally from https://github.com/cmisenas/cabbage.js/blob/master/cabbage.js

Modifications from 7/15/21, Matt Perkins
* conversion to ES6 classes
* Change constructor to use passed canvas element
*/
const pixelDirections = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
const pixelColorValues = ['r', 'g', 'b', 'a'];

// Pixel is a dumb object that does not know about image data
// It is only meant to be used by Cabbage directly for:
// manipulating canvas values, storing and easy retrieval of rgba

class Pixel {
    constructor(x, y, vals) {
        const self = this;
        this.x = x;
        this.y = y;
        this.neighbors = {};

        // TODO ?
        if (vals) {
            pixelColorValues.forEach(function (d) {
                this[d] = vals.shift();
            });
        }

        pixelDirections.forEach(function (d) {
            this.neighbors[d] = self[d]();
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

const doc = window.document;
const COORDS = 'coordinate';
const PIXIDX = 'pixel index';
const IDIDX = 'image data index';

export class Cabbage {
    // Original
    // constructor(id, w, h, doc) {
    //     doc = doc || doc;
    //     this.width = w || 600;
    //     this.height = h || 400;
    //     this.elem = doc.getElementById(id) || this._createCanvas(id);
    //     this.ctx = this.elem.getContext('2d');
    //     this.origImg = {};
    //     this.currImg = {};
    // }

    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.elem = canvas;
        this.ctx = this.elem.getContext('2d');
        this.origImg = this.getCurrentImg();
        this.currImg = this.getCurrentImg();
        this.setImg();
    }

    loadImg(img, sx, sy) {
        const self = this;
        if (typeof img === 'string') {
            this._createImage(img, function (usrImg) {
                self._img = usrImg;
                if (usrImg.width !== self.width || usrImg.height !== self.height) {
                    self.width = usrImg.width;
                    self.height = usrImg.height;
                    self.elem.width = self.width;
                    self.elem.height = self.height;
                }
                self.drawImage(sx, sy);
            });
        } else if (/HTMLImageElement/.test(img.constructor)) {
            this._img = img;
            this.drawImage(sx, sy);
        }
        return this;
    }

    _createImage(imgSrc, fn) {
        const self = this;
        usrImg = new Image();
        usrImg.onload = function () {
            fn(usrImg);
        };
        usrImg.src = imgSrc;
    }

    _createCanvas(id) {
        let elem;
        elem = doc.createElement('canvas');
        elem.id = id;
        elem.width = this.width;
        elem.height = this.height;
        doc.body.insertBefore(elem, doc.body.firstChild);
        return elem;
    }

    drawImage(sx, sy) {
        this.ctx.drawImage(this._img, sx || 0, sy || 0);
        this.refreshCurrImageData();
        this.origImg = this.getCurrentImg();
    }

    // TODO: This looks sort of confusing
    // rethink its use/name
    setImg() {
        this.putImageData(this.currImg, 0, 0);
    }

    /*
        // Delete image data; leave canvas blank
        deleteImg = function() {
        };
        */

    // Reset to original data
    resetImageData() {
        // put back the original image to the canvas
        this.putImageData(this.origImg);
    }

    // returns the actual current image data
    getCurrentImg() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    }

    // returns a copy of original image data
    originalImg() {
        return this.ctx.createImageData(this.origImg);
    }

    map(fn) {
        let x;
        let y;
        let cvsIndex;
        let pixelIndex;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                pixelIndex = y * this.width + x;
                cvsIndex = x * 4 + y * this.width * 4;
                fn(x, y, pixelIndex, cvsIndex);
            }
        }
    }

    convolve(fn, size) {
        let x;
        let y;
        let cvsIndex;
        let pixelIndex;
        let matrix;
        size = size || 3;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                pixelIndex = y * this.width + x;
                cvsIndex = x * 4 + y * this.width * 4;
                matrix = this._buildMatrix(x, y, size);
                fn(matrix, x, y, pixelIndex, cvsIndex);
            }
        }
    }

    // returns the pixel object if it exists
    // otherwise throws an error
    getPixel(loc) {
        let index;
        let coords;
        let rgba;

        if (typeof loc === 'number') {
            if (!this._checkValidIDIndex(loc)) {
                this._throwValidationError(IDIDX, COORDS);
            }
            index = loc;
            coords = this._convertIDIndexToCoords(loc);
        } else {
            if (!this._checkValidCoords(loc)) {
                this._throwValidationError(COORDS, IDIDX);
            }
            index = this._convertCoordsToIDIndex(loc);
            coords = loc;
        }
        rgba = Array.prototype.slice.call(this.currImg.data, index, index + 4);
        return new Pixel(coords.x, coords.y, rgba);
    }

    // Modifies the current image data pixels
    // Does not modify the canvas image
    // That is the job of setImg
    setPixel(pixel, val) {
        const i = this._convertCoordsToIDIndex(pixel);

        if (typeof val === 'number') {
            this.currImg.data[i] = val;
            this.currImg.data[i + 1] = val;
            this.currImg.data[i + 2] = val;
        } else {
            this.currImg.data[i] = val.r;
            this.currImg.data[i + 1] = val.g;
            this.currImg.data[i + 2] = val.b;
            this.currImg.data[i + 3] = val.a || 255;
        }
        // this._drawPixel(pixel, r, g, b, a);
    }

    _drawPixel(pixel, r, g, b, a) {
        this.ctx.fillStyle = `rgba(${[r, g, b, a].join(', ')})`;
        this.ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }

    isBorder(coords) {
        return (
            (coords.x === 0 && coords.y < this.height && coords.y >= 0) ||
            (coords.y === 0 && coords.x < this.width && coords.x >= 0) ||
            (coords.x === this.width - 1 && coords.y < this.height && coords.y >= 0) ||
            (coords.y === this.height - 1 && coords.x < this.width && coords.x >= 0)
        );
    }

    isOutOfBounds(coords) {
        return coords.x < 0 || coords.x > this.width - 1 || coords.y < 0 || coords.y > this.height - 1;
    }

    // Every putImageData done via object
    // stores current image for faster access later
    putImageData(id, x, y) {
        this.ctx.putImageData(id, x || 0, y || 0);
        this.refreshCurrImageData();
    }

    refreshCurrImageData() {
        this.currImg = this.getCurrentImg();
    }

    _buildMatrix(cx, cy, size) {
        const matrix = [];
        let nx;
        let ny;
        const min = 3;
        const max = Math.max(this.width, this.height); // temp max value

        size = size || 3;
        size = size % 2 === 0 ? size + 1 : size;

        // TODO make it so that max size is dictated by the dimensions of the image
        if (size < min || size > max) size = min;

        for (let i = 0, y = -(size - 1) / 2; i < size; i++, y++) {
            matrix[i] = [];
            for (let j = 0, x = -(size - 1) / 2; j < size; j++, x++) {
                nx = cx + x;
                ny = cy + y;
                if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) {
                    matrix[i][j] = undefined;
                } else {
                    matrix[i][j] = this._convertCoordsToIDIndex({ x: nx, y: ny });
                }
            }
        }
        return matrix;
    }

    _convertCoordsToIDIndex(coords) {
        const m = 4;
        return (coords.y * this.width + coords.x) * m;
    }

    _convertCoordsToPixIndex(coords) {
        return coords.y * this.width + coords.x;
    }

    _checkValidCoords(coords) {
        return (
            !!coords &&
            coords.x === parseInt(coords.x, 10) &&
            coords.y === parseInt(coords.y, 10) &&
            coords.x >= 0 &&
            coords.x < this.width &&
            coords.y >= 0 &&
            coords.y < this.height
        );
    }

    _checkValidPIndex(pIdx) {
        return pIdx === parseInt(pIdx, 10) && pIdx >= 0 && pIdx < this.width * this.height;
    }

    _checkValidIDIndex(pIdx) {
        return pIdx === parseInt(pIdx, 10) && pIdx >= 0 && pIdx < this.width * this.height * 4;
    }

    _convertIDIndexToCoords(idIdx) {
        const m = 4;
        if (idIdx % 4 > 0) idIdx -= idIdx % 4;
        return {
            x: (idIdx % (this.width * m)) / m,
            y: Math.floor(idIdx / (this.width * m)),
        };
    }

    _convertIDIndexToPixIndex(idIdx) {
        const m = 4;
        return Math.floor(idIdx / m);
    }

    _convertPixIndexToCoords(pIdx) {
        return { x: pIdx % this.width, y: Math.floor(pIdx / this.width) };
    }

    _convertPixIndexToIDIndex(pIdx) {
        return pIdx * 4;
    }

    _throwValidationError(from, to) {
        const msg = `Invalid ${from}. Unable to convert to ${to}`;
        throw new Error(msg);
    }
}
