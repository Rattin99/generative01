import { TAU } from './math';
import { create2dNoise, create3dNoise, randomNumberBetween } from './random';

export const simplexNoise2d = (x, y, f = 0.0005) => create2dNoise(x, y, 1, f) * TAU;
export const simplexNoise3d = (x, y, t, f = 0.002) => create3dNoise(x, y, t, 1, f) * TAU;

export const diagLines = (x, y) => (x + y) * 0.01 * TAU;

// From https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
export const sinField = (x, y) => (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * TAU;

// random attractor params
const a = randomNumberBetween(-2, 2);
const b = randomNumberBetween(-2, 2);
const c = randomNumberBetween(-2, 2);
const d = randomNumberBetween(-2, 2);

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

// const flowAtPoint = (x, y) => {
//     const scale = 0.01;
//     const fromCenter = pointDistance({ x, y }, { x: canvasMidX, y: canvasMidY });
//     const simplex = simplexNoise2d(x, y, 0.01);
//     // const theta = simplex;
//     const theta = (fromCenter + simplex) / 2; // mostly radial around middle
//     // const r1 = (Math.sin(1.2 * x) + 0.2 * Math.atan(2 * y)) * 8 * Math.PI;
//     // const r2 = (Math.pow(x, 2) + 0.8 * Math.pow(y, 1 / 2)) * 8 * Math.PI * 4;
//     // const theta = ((r1 + r2 + simplex) / 3) * 0.001;
//     // const theta = ((Math.cos(x) + x + Math.sin(y)) * 24) % (Math.PI / 2); // wander dl like like
//     // const theta = Math.atan2(y, x); // cones out from top left
//     // const theta = x + y + Math.cos(x * scale) * Math.sin(x * scale); // bl to tr diag and cross perp lines
//     // const theta = Math.cos(x * scale) * Math.sin(x * scale); // vertical lines
//     // const theta = Math.cos(x) * Math.sin(x) * scale; // horizontal lines
//     // const theta = x * Math.sin(y) * scale; // scribble
//     // const theta = Math.sin(x * scale) + Math.sin(y * scale); // diamonds
//     return theta * TAU;
// };

/*
const plotFFPointLines = (num) => {
        for (let i = 0; i < num; i++) {
            const coords = createFFParticleCoords(noise, 0, randomWholeBetween(0, canvasMidY * 2), 2000, 1);
            pointPath(ctx)(coords, tinycolor('rgba(0,0,0,.5'), 1);
        }
    };
 */
// export const createFFParticleCoords = (fieldFn, startX, startY, length, fMag = 1, vlimit = 1) => {
//     const props = {
//         x: startX,
//         y: startY,
//         velocityX: 0,
//         velocityY: 0,
//         mass: 1,
//     };
//     const particle = new Particle(props);
//     const coords = [];
//     for (let i = 0; i < length; i++) {
//         const theta = fieldFn(particle.x, particle.y);
//         // theta = quantize(4, theta);
//         const force = uvFromAngle(theta).setMag(fMag);
//
//         particle.applyForce(force);
//         particle.velocity = particle.velocity.limit(vlimit);
//         particle.updatePosWithVelocity();
//         coords.push([particle.x, particle.y]);
//         particle.acceleration = new Vector(0, 0);
//     }
//     return coords;
// };
