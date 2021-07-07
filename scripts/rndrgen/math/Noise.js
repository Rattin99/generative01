import csRandom from 'canvas-sketch-util/random';
import { mapRange, TAU } from './math';

export const noiseType = {
    none: -1,
    simplex2d: 0,
    simplex3d: 1,
};

/*
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
    constructor(type, amplitude = 1, frequency = 0.001, min = 0, max = 1) {
        this.type = type;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.min = min;
        this.max = max;
    }

    simplexNoise2d(x, y) {
        return csRandom.noise2D(x * this.frequency, y * this.frequency) * this.amplitude;
    }

    simplexNoise3d(x, y, z) {
        return csRandom.noise3D(x * this.frequency, y * this.frequency, z * this.frequency) * this.amplitude;
    }

    diagLines(x, y) {
        return (x * this.frequency + y * this.frequency) * this.amplitude;
    }

    sinField(x, y) {
        return (Math.sin(x * this.frequency) + Math.sin(y * this.frequency)) * this.amplitude;
    }

    atPosition(x, y, z = 0) {
        let value = 0;
        switch (this.type) {
            case noiseType.simplex2d:
                value = this.simplexNoise2d(x, y);
                break;
            case noiseType.simplex3d:
                value = this.simplexNoise3d(x, y, z);
                break;
            default:
                value = 1;
        }
        if (this.min !== 0 && this.min !== 1) {
            value = mapRange(0, 1, this.min, this.max, value);
        }
        return value;
    }

    atPositionRad(x, y, z = 0) {
        return this.atPosition(x, y, z) * TAU;
    }

    atPoint({ x, y, z }) {
        return this.atPosition(x, y, z);
    }
}
