/*

Originally from https://github.com/cmisenas/canny-edge-detection
Demo http://canny-edge-detection.herokuapp.com/

Works the following way:
1. Convert the canvas image to grayscale
2. Smooth the image to reduce noise as much as possible. In this implementation, Gaussian filter can be applied
    (max kernel size is 21).
3. Determine the gradient intensity (amount of change) and direction for each pixel. This is done by convolving image
    with the chosen filter. Currently, there are 3 operators you may choose from: Sobel, Prewitts, Cross
4. Thin the resulting edges with non-maximum suppression.
5. Remove weak/false edges. A process called hysteresis is used where there are two thresholds--high and low--to be
    compared to each pixel.

Modifications from 7/15/21, Matt Perkins
* Merged to one file
* conversion to ES6 classes
* bootstrap functions (bottom of file)
 */

import { Cabbage } from './Cabbage';

// helpers.js

const sumArr = function (arr) {
    // receives an array and returns sum
    let result = 0;
    arr.map(function (el, idx) {
        result += /^\s*function Array/.test(String(el.constructor)) ? sumArr(el) : el;
    });
    return result;
};

const COLORS = {
    RED: { r: 255, g: 0, b: 0 },
    GREEN: { r: 0, g: 255, b: 0 },
    BLUE: { r: 0, g: 0, b: 255 },
    YELLOW: { r: 255, g: 255, b: 0 },
    PINK: { r: 255, g: 0, b: 255 },
    AQUA: { r: 0, g: 255, b: 255 },
};

const roundDir = function (deg) {
    // rounds degrees to 4 possible orientations: horizontal, vertical, and 2 diagonals
    var deg = deg < 0 ? deg + 180 : deg;

    if ((deg >= 0 && deg <= 22.5) || (deg > 157.5 && deg <= 180)) {
        return 0;
    }
    if (deg > 22.5 && deg <= 67.5) {
        return 45;
    }
    if (deg > 67.5 && deg <= 112.5) {
        return 90;
    }
    if (deg > 112.5 && deg <= 157.5) {
        return 135;
    }
};

const getPixelNeighbors = function (dir) {
    const degrees = {
        0: [
            { x: 1, y: 2 },
            { x: 1, y: 0 },
        ],
        45: [
            { x: 0, y: 2 },
            { x: 2, y: 0 },
        ],
        90: [
            { x: 0, y: 1 },
            { x: 2, y: 1 },
        ],
        135: [
            { x: 0, y: 0 },
            { x: 2, y: 2 },
        ],
    };
    return degrees[dir];
};

const getEdgeNeighbors = function (i, imgData, threshold, includedEdges) {
    const neighbors = [];
    const pixel = new Pixel(i, imgData.width, imgData.height);
    for (let j = 0; j < pixel.neighbors.length; j++)
        if (
            imgData.data[pixel.neighbors[j]] >= threshold &&
            (includedEdges === undefined || includedEdges.indexOf(pixel.neighbors[j]) === -1)
        )
            neighbors.push(pixel.neighbors[j]);

    return neighbors;
};

const createHistogram = function (cvs) {
    const histogram = { g: [] };
    let size = 256;
    let total = 0;
    const imgData = cvs.getCurrentImg();
    while (size--) histogram.g[size] = 0;
    cvs.map(function (x, y, pixelIndex, cvsIndex) {
        histogram.g[imgData.data[cvsIndex]]++;
        total++;
    });
    histogram.length = total;
    return histogram;
};

// mean threshold works better than median threshold
// however is sensitive to noise
// works best when Gaussian blur is applied first
const calcMeanThreshold = function (cvs) {
    const histogram = createHistogram(cvs);
    let sum = 0;
    const total = histogram.length;
    histogram.g.forEach(function (e, i) {
        sum += e * (i + 1);
    });
    return sum / total;
};

// does not work that well
// median value is almost always 0 (black)
// if background is bigger than foreground
const calcMedianThreshold = function (cvs) {
    const histogram = createHistogram(cvs);
    const m = Math.round(histogram.length / 2);
    let n = 0;
    let median;
    histogram.g.some(function (e, i) {
        n += e;
        if (n >= m) {
            median = i;
            return true;
        }
        return false;
    });
    return median;
};

const calcWeight = function (histogram, s, e) {
    const total = histogram.reduce(function (i, j) {
        return i + j;
    }, 0);
    const partHist = s === e ? [histogram[s]] : histogram.slice(s, e);
    const part = partHist.reduce(function (i, j) {
        return i + j;
    }, 0);
    return parseFloat(part, 10) / total;
};

const calcMean = function (histogram, s, e) {
    const partHist = s === e ? [histogram[s]] : histogram.slice(s, e);
    let val = (total = 0);
    partHist.forEach(function (el, i) {
        val += (s + i) * el;
        total += el;
    });
    return parseFloat(val, 10) / total;
};

const calcBetweenClassVariance = function (weight1, mean1, weight2, mean2) {
    return weight1 * weight2 * (mean1 - mean2) * (mean1 - mean2);
};

const fastOtsu = function (canvas) {
    const histogram = createHistogram(canvas);
    const start = 0;
    const end = histogram.g.length - 1;
    let leftWeight;
    let rightWeight;
    let leftMean;
    let rightMean;
    const betweenClassVariances = [];
    let max = -Infinity;
    let threshold;

    histogram.g.forEach(function (el, i) {
        leftWeight = calcWeight(histogram.g, start, i);
        rightWeight = calcWeight(histogram.g, i, end + 1);
        leftMean = calcMean(histogram.g, start, i);
        rightMean = calcMean(histogram.g, i, end + 1);
        betweenClassVariances[i] = calcBetweenClassVariance(leftWeight, leftMean, rightWeight, rightMean);
        if (betweenClassVariances[i] > max) {
            max = betweenClassVariances[i];
            threshold = i;
        }
    });

    return threshold;
};

// filters.js

const calculateGray = function (pixel) {
    return 0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b;
};

const generateKernel = function (sigma, size) {
    const kernel = [];
    const E = 2.718; // Euler's number rounded of to 3 places
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
    const normalize = 1 / sumArr(kernel);
    for (let k = 0; k < kernel.length; k++) {
        for (let l = 0; l < kernel[k].length; l++) {
            kernel[k][l] = Math.round(normalize * kernel[k][l] * 1000) / 1000;
        }
    }
    return kernel;
};

export class Filters {
    constructor(cvs) {
        this.cabbageCnvs = cvs;
    }

    grayscale() {
        const that = this;
        let grayLevel;

        console.time('Grayscale Time');
        this.cabbageCnvs.map(function (x, y, pixelIndex, cvsIndex) {
            grayLevel = calculateGray(that.cabbageCnvs.getPixel(cvsIndex));
            that.cabbageCnvs.setPixel({ x, y }, grayLevel);
        });
        this.cabbageCnvs.setImg();
        console.timeEnd('Grayscale Time');
    }

    gaussianBlur(sigma, size) {
        const that = this;
        const kernel = generateKernel(sigma, size);

        console.time('Blur Time');
        this.cabbageCnvs.convolve(function (neighbors, x, y, pixelIndex, cvsIndex) {
            // ignore edges
            // TODO: make this faster!
            if (x !== 0 && y !== 0 && x !== that.cabbageCnvs.width - 1 && y !== that.cabbageCnvs.height - 1) {
                let resultR = 0;
                let resultG = 0;
                let resultB = 0;
                let pixel;
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        pixel = that.cabbageCnvs.getPixel(neighbors[i][j]);
                        // return the existing pixel value multiplied by the kernel
                        resultR += pixel.r * kernel[i][j];
                        resultG += pixel.g * kernel[i][j];
                        resultB += pixel.b * kernel[i][j];
                    }
                }
                that.cabbageCnvs.setPixel({ x, y }, { r: resultR, g: resultG, b: resultB });
            }
        }, size);
        this.cabbageCnvs.setImg();
        console.timeEnd('Blur Time');
    }

    invertColors() {
        const that = this;
        let pixel;

        console.time('Invert Colors Time');
        this.cabbageCnvs.map(function (x, y, pixelIndex, cvsIndex) {
            pixel = that.cabbageCnvs.getPixel(cvsIndex);
            that.cabbageCnvs.setPixel({ x, y }, { r: 255 - pixel.r, g: 255 - pixel.g, b: 255 - pixel.b });
        });
        this.cabbageCnvs.setImg();
        console.timeEnd('Invert Colors Time');
    }
}

// canny.js

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

const OPERATORS = {
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

export class EdgeDetect {
    constructor(canvElem) {
        this.cabbageCnvs = canvElem;
    }

    // find intensity gradient of image
    gradient(op) {
        const imgDataCopy = this.cabbageCnvs.getCurrentImg();
        const dirMap = [];
        const gradMap = [];
        const that = this;

        console.time('Sobel Filter Time');
        this.cabbageCnvs.convolve(function (neighbors, x, y, pixelIndex, cvsIndex) {
            let edgeX = 0;
            let edgeY = 0;

            if (!that.cabbageCnvs.isBorder({ x, y })) {
                for (let i = 0; i < OPERATORS[op].len; i++) {
                    for (let j = 0; j < OPERATORS[op].len; j++) {
                        if (!neighbors[i][j]) continue;
                        edgeX += imgDataCopy.data[neighbors[i][j]] * OPERATORS[op].x[i][j];
                        edgeY += imgDataCopy.data[neighbors[i][j]] * OPERATORS[op].y[i][j];
                    }
                }
            }

            dirMap[cvsIndex] = roundDir(Math.atan2(edgeY, edgeX) * (180 / Math.PI));
            gradMap[cvsIndex] = Math.round(Math.sqrt(edgeX * edgeX + edgeY * edgeY));

            that.cabbageCnvs.setPixel({ x, y }, gradMap[cvsIndex]);
        }, 3);
        this.cabbageCnvs.setImg();
        console.timeEnd('Sobel Filter Time');

        this.cabbageCnvs.dirMap = dirMap;
        this.cabbageCnvs.gradMap = gradMap;
    }

    nonMaximumSuppress() {
        const that = this;

        console.time('NMS Time');
        this.cabbageCnvs.convolve(function (neighbors, x, y, pixelIndex, cvsIndex) {
            const pixNeighbors = getPixelNeighbors(that.cabbageCnvs.dirMap[cvsIndex]);

            // pixel neighbors to compare
            const pix1 = that.cabbageCnvs.gradMap[neighbors[pixNeighbors[0].x][pixNeighbors[0].y]];
            const pix2 = that.cabbageCnvs.gradMap[neighbors[pixNeighbors[1].x][pixNeighbors[1].y]];

            if (
                pix1 > that.cabbageCnvs.gradMap[cvsIndex] ||
                pix2 > that.cabbageCnvs.gradMap[cvsIndex] ||
                (pix2 === that.cabbageCnvs.gradMap[cvsIndex] && pix1 < that.cabbageCnvs.gradMap[cvsIndex])
            ) {
                that.cabbageCnvs.setPixel({ x, y }, 0);
            }
        }, 3);
        this.cabbageCnvs.setImg();
        console.timeEnd('NMS Time');
    }

    // TODO: Do not use sparse array for storing real edges
    // mark strong and weak edges, discard others as false edges; only keep weak edges that are connected to strong edges
    hysteresis() {
        const that = this;
        const imgDataCopy = this.cabbageCnvs.getCurrentImg();
        const realEdges = []; // where real edges will be stored with the 1st pass
        const t1 = fastOtsu(this.cabbageCnvs); // high threshold value
        const t2 = t1 / 2; // low threshold value

        // first pass
        console.time('Hysteresis Time');
        this.cabbageCnvs.map(function (x, y, pixelIndex, cvsIndex) {
            if (imgDataCopy.data[cvsIndex] > t1 && realEdges[cvsIndex] === undefined) {
                // accept as a definite edge
                const group = that._traverseEdge(cvsIndex, imgDataCopy, t2, []);
                for (let i = 0; i < group.length; i++) {
                    realEdges[group[i]] = true;
                }
            }
        });

        // second pass
        this.cabbageCnvs.map(function (x, y, pixelIndex, cvsIndex) {
            if (realEdges[cvsIndex] === undefined) {
                that.cabbageCnvs.setPixel({ x, y }, 0);
            } else {
                that.cabbageCnvs.setPixel({ x, y }, 255);
            }
        });

        this.cabbageCnvs.setImg();
        console.timeEnd('Hysteresis Time');
    }

    // just a quick function to look at the direction results
    showDirMap() {
        const that = this;
        this.cabbageCnvs.map(function (x, y, pixelIndex, cvsIndex) {
            switch (that.cabbageCnvs.dirMap[cvsIndex]) {
                case 0:
                    that.cabbageCnvs.setPixel({ x, y }, COLORS.RED);
                    break;
                case 45:
                    that.cabbageCnvs.setPixel({ x, y }, COLORS.GREEN);
                    break;
                case 90:
                    that.cabbageCnvs.setPixel({ x, y }, COLORS.BLUE);
                    break;
                case 135:
                    that.cabbageCnvs.setPixel({ x, y }, COLORS.YELLOW);
                    break;
                default:
                    that.cabbageCnvs.setPixel({ x, y }, COLORS.PINK);
            }
        });
        this.cabbageCnvs.setImg();
    }

    // TODO: Evaluate function use/fulness
    showGradMap() {
        const that = this;
        this.cabbageCnvs.map(function (x, y, pixelIndex, cvsIndex) {
            if (that.cabbageCnvs.gradMap[cvsIndex] < 0) {
                that.cabbageCnvs.setPixel({ x, y }, COLORS.RED);
            } else if (that.cabbageCnvs.gradMap[cvsIndex] < 200) {
                that.cabbageCnvs.setPixel({ x, y }, COLORS.GREEN);
            } else if (that.cabbageCnvs.gradMap[cvsIndex] < 400) {
                that.cabbageCnvs.setPixel({ x, y }, COLORS.BLUE);
            } else if (that.cabbageCnvs.gradMap[cvsIndex] < 600) {
                that.cabbageCnvs.setPixel({ x, y }, COLORS.YELLOW);
            } else if (that.cabbageCnvs.gradMap[cvsIndex] < 800) {
                that.cabbageCnvs.setPixel({ x, y }, COLORS.AQUA);
            } else {
                that.cabbageCnvs.setPixel({ x, y }, COLORS.PINK);
            }
        });
        this.cabbageCnvs.setImg();
    }

    // TODO: Optimize prime!
    // traverses the current pixel until a length has been reached
    _traverseEdge(current, imgData, threshold, traversed) {
        // initialize the group from the current pixel's perspective
        let group = [current];
        // pass the traversed group to the getEdgeNeighbors so that it will not include those anymore
        const neighbors = getEdgeNeighbors(current, imgData, threshold, traversed);
        for (let i = 0; i < neighbors.length; i++) {
            // recursively get the other edges connected
            group = group.concat(this._traverseEdge(neighbors[i], imgData, threshold, traversed.concat(group)));
        }
        return group;
        // if the pixel group is not above max length,
        // it will return the pixels included in that small pixel group
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

export const initialize = (canvas, sz = 3, sg = 1.5) => {
    const cabbageCanvas = new Cabbage(canvas);
    const edgeDetect = new EdgeDetect(cabbageCanvas);
    const filters = new Filters(cabbageCanvas);

    cabbageCanvas.setImg();

    let size;
    let sigma;

    const setSize = (s) => (size = s <= 1 || s > 21 ? 3 : s % 2 === 0 ? s - 1 : s);
    const setSigma = (s) => (sigma = s < 1 || s > 10 ? 1.5 : s);

    size = setSize(sz);
    sigma = setSigma(sg);

    const resetImage = (_) => cabbageCanvas.resetImageData();

    const greyScale = (_) => filters.grayscale();
    const blur = (_) => filters.gaussianBlur(sigma, size);
    const invert = (_) => filters.invertColors();

    const sobel = (_) => edgeDetect.gradient('sobel');
    const roberts = (_) => edgeDetect.gradient('roberts');
    const prewitt = (_) => edgeDetect.gradient('prewitt');

    /*
    edgeDetect.nonMaximumSuppress();
    edgeDetect.hysteresis();
    edgeDetect.showDirMap();
    edgeDetect.showGradMap();
     */

    return {
        setSize,
        setSigma,
        greyScale,
        blur,
        invert,
        resetImage,
        sobel,
        roberts,
        prewitt,
    };
};
