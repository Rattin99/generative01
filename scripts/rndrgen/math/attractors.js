import { TAU } from './math';
import { create2dNoise, create3dNoise, randomNumberBetween } from './random';

export const simplexNoise2d = (x, y, f = 0.0005) => create2dNoise(x, y, 1, f) * TAU;
export const simplexNoise3d = (x, y, t, f = 0.002) => create3dNoise(x, y, t, 1, f) * TAU;
export const diagLines = (x, y) => (x + y) * 0.01 * TAU;
// From https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
export const sinField = (x, y) => (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * TAU;

const attractorScale = 0.01;
const attractorVarA = randomNumberBetween(-2, 2);
const attractorVarB = randomNumberBetween(-2, 2);
const attractorVarC = randomNumberBetween(-2, 2);
const attractorVarD = randomNumberBetween(-2, 2);

// http://paulbourke.net/fractals/clifford/
export const cliffordAttractor = (width, height, x, y) => {
    x = (x - width / 2) * attractorScale;
    y = (y - height / 2) * attractorScale;
    const x1 = Math.sin(attractorVarA * y) + attractorVarC * Math.cos(attractorVarA * x);
    const y1 = Math.sin(attractorVarB * x) + attractorVarD * Math.cos(attractorVarB * y);
    return Math.atan2(y1 - y, x1 - x);
};

// http://paulbourke.net/fractals/peterdejong/
export const jongAttractor = (width, height, x, y) => {
    x = (x - width / 2) * attractorScale;
    y = (y - height / 2) * attractorScale;
    const x1 = Math.sin(attractorVarA * y) - Math.cos(attractorVarB * x);
    const y1 = Math.sin(attractorVarC * x) - Math.cos(attractorVarD * y);
    return Math.atan2(y1 - y, x1 - x);
};

// testing different attractor functions
export const fieldFlowAtPoint = (x, y) => {
    const simplex = simplexNoise2d(x, y, 0.01);
    const theta = simplex;
    // const r1 = (Math.sin(1.2 * x) + 0.2 * Math.atan(2 * y)) * 8 * Math.PI;
    // const r2 = (Math.pow(x, 2) + 0.8 * Math.pow(y, 1 / 2)) * 8 * Math.PI * 4;
    // const theta = ((r1 + r2 + simplex) / 3) * 0.001;
    // const theta = ((Math.cos(x) + x + Math.sin(y)) * 24) % (Math.PI / 2); // wander dl like like
    // const theta = Math.atan2(y, x); // cones out from top left
    // const theta = x + y + Math.cos(x * attractorScale) * Math.sin(x * attractorScale); // bl to tr diag and cross perp lines
    // const theta = Math.cos(x * attractorScale) * Math.sin(x * attractorScale); // vertical lines
    // const theta = Math.cos(x) * Math.sin(x) * attractorScale; // horizontal lines
    // const theta = x * Math.sin(y) * attractorScale; // scribble
    // const theta = Math.sin(x * attractorScale) + Math.sin(y * attractorScale); // diamonds
    return theta * TAU;
};
