import { variation5 } from './released/variation5';
import { threeAttractors } from './released/threeAttractors';
import { hiImage01 } from './released/hiImage01';
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
import { meanderingRiver02 } from './released/meandering-river-02';
import { meanderingRiver01 } from './released/meandering-river-01';
import { truchetTiles } from './released/truchet-tiles';

export const variationsIndex = {
    5: {
        note: 'Like spider webs',
        sketch: variation5,
    },
    8: {
        note: 'One attractor in the center, two on the sides.',
        sketch: threeAttractors,
    },
    9: {
        note: 'Say Hi',
        sketch: hiImage01,
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
        sketch: meanderingRiver02,
    },
    22: {
        note: 'Meandering river over landscape. Refresh for new terrain. Based on "Meander" by Robert Hodgin.',
        sketch: meanderingRiver01,
    },
    23: {
        note: 'Multiscale Truchet Tiles',
        sketch: truchetTiles,
    },
};
