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
export const cliffordAttractor = (width, height, x, y, scale) => {
    scale = scale || attractorScale;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(attractorVarA * y) + attractorVarC * Math.cos(attractorVarA * x);
    const y1 = Math.sin(attractorVarB * x) + attractorVarD * Math.cos(attractorVarB * y);
    return Math.atan2(y1 - y, x1 - x);
};

// http://paulbourke.net/fractals/peterdejong/
export const jongAttractor = (width, height, x, y, scale) => {
    scale = scale || attractorScale;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(attractorVarA * y) - Math.cos(attractorVarB * x);
    const y1 = Math.sin(attractorVarC * x) - Math.cos(attractorVarD * y);
    return Math.atan2(y1 - y, x1 - x);
};

const simplex2d = (x, y) => simplexNoise2d(x, y, 0.002);
const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
const clifford = (x, y, scale) => cliffordAttractor(canvas.width, canvas.height, x, y, scale);
const jong = (x, y, scale) => jongAttractor(canvas.width, canvas.height, x, y, scale);
