/*
Explorations with generative code
*/

import normalize from 'normalize.css';

import { sketch } from './lib/sketch';

import { lissajous01 } from './released/lissajous01';
import { waves01 } from './released/waves01';
import { windLines } from './released/windLines';
import { hiImage01 } from './released/hiImage01';
import { variation1 } from './released/variation1';
import { variation2 } from './released/variation2';
import { domokun } from './released/domokun';
import { variation4 } from './released/variation4';
import { variation5 } from './released/variation5';
import { variation6 } from './released/variation6';
import { rainbowRakeOrbit } from './released/rainbow-rake-orbit-mouse';
import { threeAttractors } from './released/threeAttractors';

import { flowFieldTiles } from './experiments/flow-field-tiles';

import { flowFieldParticles } from './released/flow-field-particles';
import { flowFieldImage } from './released/flow-field-image';
import { flowFieldArcs } from './released/flow-field-arcs';
import { radialNoise } from './released/radial-noise';
import { radialImage } from './experiments/radial-image';

const s = sketch();

// const DEBUG = undefined;
const DEBUG = radialImage;

// TODO append random seed value
const saveCanvasCapture = (_) => {
    console.log('Saving capture');
    const imageURI = s.canvas().toDataURL('image/png');
    document.getElementById('download').setAttribute('download', `${s.variationName()}.png`);
    document.getElementById('download').href = imageURI;
};

document.getElementById('download').addEventListener('click', saveCanvasCapture);
window.addEventListener('keydown', (e) => {
    if (e.key === 's') {
        document.getElementById('download').click();
    }
});

const setNote = (note) => (document.getElementById('note').innerText = note);

const getQueryVariable = (variable) => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
};

const variations = {
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
};

let variationKey = getQueryVariable('variation');
const variationKeys = Object.keys(variations);
variationKey = variationKey || variationKeys[variationKeys.length - 1];

if (variations.hasOwnProperty(variationKey) && DEBUG === undefined) {
    const vToRun = variations[variationKey];
    setNote(vToRun.note);
    s.run(vToRun.sketch());
} else {
    setNote('Not a valid variation!');
}

if (DEBUG) {
    s.run(DEBUG());
}
