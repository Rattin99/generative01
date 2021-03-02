import { create2dNoise, create3dNoise, randomNumberBetween } from './math';

const TAU = Math.PI * 2;

export const simplexNoise2d = (x, y) => create2dNoise(x, y, 1, 0.002) * TAU;
export const simplexNoise3d = (x, y, t) => create3dNoise(x, y, t, 1, 0.002) * TAU;

export const diagLines = (x, y) => (x + y) * 0.01 * TAU;

// From https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
export const sinField = (x, y) => (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * TAU;

// random attractor params
export const a = randomNumberBetween(-2, 2);
export const b = randomNumberBetween(-2, 2);
export const c = randomNumberBetween(-2, 2);
export const d = randomNumberBetween(-2, 2);

// http://paulbourke.net/fractals/clifford/
export const cliffordAttractor = (width, height, x, y) => {
    const scale = 0.01;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(a * y) + c * Math.cos(a * x);
    const y1 = Math.sin(b * x) + d * Math.cos(b * y);
    return Math.atan2(y1 - y, x1 - x);
};

// http://paulbourke.net/fractals/peterdejong/
export const jongAttractor = (width, height, x, y) => {
    const scale = 0.01;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(a * y) - Math.cos(b * x);
    const y1 = Math.sin(c * x) - Math.cos(d * y);
    return Math.atan2(y1 - y, x1 - x);
};
