// "paint splatters" around center point
import { randomNumberBetween, randomWholeBetween } from '../math/random';
import { drawCircleFilled } from './primatives';
import { TAU } from '../math/math';

export const splatter = (context) => (x, y, color, size, amount = 3, range = 20) => {
    for (let i = 0; i < amount; i++) {
        const s = randomWholeBetween(size * 0.25, size * 3);
        // circle dist
        const radius = randomWholeBetween(0, range);
        const angle = randomNumberBetween(0, TAU);
        const xoff = radius * Math.cos(angle);
        const yoff = radius * Math.sin(angle);
        // square dist
        // const xoff = randomWholeBetween(-range, range);
        // const yoff = randomWholeBetween(-range, range);
        drawCircleFilled(context)(x + xoff, y + yoff, s, color);
    }
};
