import csRandom from 'canvas-sketch-util/random';
import { TAU } from './math';

csRandom.setSeed(csRandom.getRandomSeed());
console.log(`Using seed ${csRandom.getSeed()}`);

export const getRandomSeed = () => csRandom.getSeed();
export const setRandomSeed = (s) => csRandom.setRandomSeed(s);
// Box-Muller Transform
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
export const randomNormalBM = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = csRandom.value(); // Converting [0,1) to (0,1)
    while (v === 0) v = csRandom.value();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randomNormalBM(); // resample between 0 and 1
    return num;
};
// same source as above
// better solution https://spin.atomicobject.com/2019/09/30/skew-normal-prng-javascript/
export const randomNormalBM2 = (min = 0, max = 1, skew = 1) => {
    let u = 0;
    let v = 0;
    while (u === 0) u = csRandom.value(); // Converting [0,1) to (0,1)
    while (v === 0) v = csRandom.value();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) {
        // // resample between 0 and 1 if out of range
        num = randomNormalBM2(min, max, skew);
    } else {
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
    }
    return num;
};
export const randomNormalNumberBetween = (min, max) => randomNormalBM() * (max - min) + min;
export const randomNormalWholeBetween = (min, max) => Math.round(randomNormalBM() * (max - min) + min);
export const randomNumberBetween = (min, max) => csRandom.valueNonZero() * (max - min) + min;
export const randomWholeBetween = (min, max) => Math.floor(csRandom.value() * (max - min) + min);
export const randomNumberBetweenMid = (min, max) => randomNumberBetween(min, max) - max / 2;

export const random = (max) => (max > 0 ? randomWholeBetween(0, max) : randomWholeBetween(max, 0));
export const randomN = (max) => (max > 0 ? randomNormalWholeBetween(0, max) : randomNormalWholeBetween(max, 0));

export const randomSign = () => (Math.round(csRandom.value()) === 1 ? 1 : -1);
export const randomBoolean = () => Math.round(csRandom.value()) === 1;
export const randomChance = (chance = 0.5) => csRandom.chance(chance);

export const oneOf = (arry) => {
    const i = randomWholeBetween(0, arry.length - 1);
    return arry[i];
};
export const createRandomNumberArray = (len, min, max) =>
    Array.from(new Array(len)).map(() => randomNumberBetween(min, max));

export const create2dNoise = (u, v, amplitude = 1, frequency = 0.5) =>
    csRandom.noise2D(u * frequency, v * frequency) * amplitude;

export const create2dNoiseAbs = (u, v, amplitude = 1, frequency = 0.5) =>
    Math.abs(csRandom.noise2D(u * frequency, v * frequency)) * amplitude;

export const create3dNoise = (u, v, t, amplitude = 1, frequency = 0.5) =>
    csRandom.noise3D(u * frequency, v * frequency, t * frequency) * amplitude;

export const create3dNoiseAbs = (u, v, t, amplitude = 1, frequency = 0.5) =>
    Math.abs(csRandom.noise3D(u * frequency, v * frequency, t * frequency)) * amplitude;

export const randomPointAround = (range = 20) => {
    const radius = randomWholeBetween(0, range);
    const angle = randomNumberBetween(0, TAU);
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
};
