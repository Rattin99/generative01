import csRandom from 'canvas-sketch-util/random';
import { TAU } from './math';

const create2dNoise = (u, v, amplitude = 1, frequency = 0.5) =>
    csRandom.noise2D(u * frequency, v * frequency) * amplitude;

const create3dNoise = (u, v, t, amplitude = 1, frequency = 0.5) =>
    csRandom.noise3D(u * frequency, v * frequency, t * frequency) * amplitude;

export const noiseType = {
    none: -1,
    simplex2d: 0,
    simplex3d: 1,
};

/*
const theta = simplexNoise2d(x, y, 0.01);;
const r1 = (Math.sin(1.2 * x) + 0.2 * Math.atan(2 * y)) * 8 * Math.PI;
const r2 = (Math.pow(x, 2) + 0.8 * Math.pow(y, 1 / 2)) * 8 * Math.PI * 4;
const theta = ((r1 + r2 + simplex) / 3) * 0.001;
const theta = ((Math.cos(x) + x + Math.sin(y)) * 24) % (Math.PI / 2); // wander dl like like
const theta = Math.atan2(y, x); // cones out from top left
const theta = x + y + Math.cos(x * attractorScale) * Math.sin(x * attractorScale); // bl to tr diag and cross perp lines
const theta = Math.cos(x * attractorScale) * Math.sin(x * attractorScale); // vertical lines
const theta = Math.cos(x) * Math.sin(x) * attractorScale; // horizontal lines
const theta = x * Math.sin(y) * attractorScale; // scribble
const theta = Math.sin(x * attractorScale) + Math.sin(y * attractorScale); // diamonds
*/

export class Noise {
    constructor(type, amplitude = 1, frequency = 0.001) {
        this.type = type;
        this.amplitude = amplitude;
        this.frequency = frequency;
    }

    simplexNoise2d(x, y) {
        return create2dNoise(x, y, this.amplitude, this.frequency);
    }

    simplexNoise3d(x, y, z) {
        return create3dNoise(x, y, z, this.amplitude, this.frequency);
    }

    diagLines(x, y) {
        return (x * this.frequency + y * this.frequency) * this.amplitude;
    }

    sinField(x, y) {
        return (Math.sin(x * this.frequency) + Math.sin(y * this.frequency)) * this.amplitude;
    }

    atPosition(x, y, z = 0) {
        switch (this.type) {
            case 0:
                return this.simplexNoise2d(x, y);
            case 1:
                return this.simplexNoise3d(x, y, z);
            default:
                return 1;
        }
    }

    atPositionRad(x, y, z = 0) {
        return this.atPosition(x, y, z) * TAU;
    }
}
