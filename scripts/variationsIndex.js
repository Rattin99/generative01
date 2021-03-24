import { variation1 } from './released/variation1';
import { variation2 } from './released/variation2';
import { domokun } from './released/domokun';
import { variation4 } from './released/variation4';
import { variation5 } from './released/variation5';
import { variation6 } from './released/variation6';
import { rainbowRakeOrbit } from './released/rainbow-rake-orbit-mouse';
import { threeAttractors } from './released/threeAttractors';
import { hiImage01 } from './released/hiImage01';
import { windLines } from './released/windLines';
import { waves01 } from './released/waves01';
import { lissajous01 } from './released/lissajous01';
import { flowFieldParticles } from './released/flow-field-particles';
import { flowFieldArcs } from './released/flow-field-arcs';
import { flowFieldImage } from './released/flow-field-image';
import { radialNoise } from './released/radial-noise';
import { flowFieldRibbons } from './released/flow-field-ribbons';
import { flowFieldRibbons2 } from './released/flow-field-ribbons-2';
import { shadedBoxes } from './released/shaded-boxes';
import { larrycarlson02 } from './released/larrycarlson02';
import { meanderingRiver01 } from './released/meandering-river-01';

export const variationsIndex = {
    1: {
        note: 'Particles are attracted to the pointer. Press to repel.',
        sketch: variation1,
    },
    2: {
        note: 'Press to increase speed.',
        sketch: variation2,
    },
    3: {
        note: 'Particles are repelled from the pointer. Press to attract.',
        sketch: domokun,
    },
    4: {
        note: 'Particles are repelled from the pointer. Press to attract.',
        sketch: variation4,
    },
    5: {
        note: 'Sit back and watch.',
        sketch: variation5,
    },
    6: {
        note: 'Move the mouse',
        sketch: variation6,
    },
    7: {
        note: 'Rakes orbit center and the mouse. Click to repel.',
        sketch: rainbowRakeOrbit,
    },
    8: {
        note: 'One attractor in the center, two on the sides.',
        sketch: threeAttractors,
    },
    9: {
        note: 'Say Hi',
        sketch: hiImage01,
    },
    10: {
        note: 'In the breeze',
        sketch: windLines,
    },
    11: {
        note: 'Inspired by Churn, Kenny Vaden https://www.reddit.com/r/generative/comments/lq8r11/churn_r_code/',
        sketch: waves01,
    },
    12: {
        note: 'Experimenting with rose shapes. Refresh for new randomized set.',
        sketch: lissajous01,
    },
    13: {
        note: 'Particles and fibers flowing with 3d simplex noise.',
        sketch: flowFieldParticles,
    },
    14: {
        note: 'Arcs flowing with 3d simplex noise.',
        sketch: flowFieldArcs,
    },
    15: {
        note: 'Rendering an image with flow fields. Photo by Francesca Zama https://unsplash.com/photos/OFjnQOf1pPA',
        sketch: flowFieldImage,
    },
    16: {
        note: 'Simplex noise going around ...',
        sketch: radialNoise,
    },
    17: {
        note: 'Ribbons attracted to an attractor',
        sketch: flowFieldRibbons,
    },
    18: {
        note: 'Ribbons attracted to an attractor',
        sketch: flowFieldRibbons2,
    },
    19: {
        note: 'Shaded boxes with flow field particles.',
        sketch: shadedBoxes,
    },
    20: {
        note: 'Render an image in the wavy art style of Larry Carlson',
        sketch: larrycarlson02,
    },
    21: {
        note: 'Based on "Meander" by Robert Hodgin and an implementation by Eric on Reddit',
        sketch: meanderingRiver01,
    },
};
