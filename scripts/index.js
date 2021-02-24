/*
Explorations with generative code
*/

import normliaze from 'normalize.css';

import { sketch } from './lib/sketch';
import { getRandomSeed } from './lib/math';
import { forcesDev } from './experiments/forcesDev';
import { forcesDevGravity } from './experiments/forcesDevGravity';
import { testGrid } from './experiments/test-grid';
import { blackhole } from './experiments/blackhole';
import { waves01 } from './experiments/waves01';
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

const s = sketch();

const DEBUG = true;

// TODO append random seed value
const saveCanvasCapture = (_) => {
    console.log('Saving capture');
    const imageURI = s.canvas().toDataURL('image/png');
    document.getElementById('download').setAttribute('download', `canvas-${getRandomSeed()}.png`);
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

let variationKey = getQueryVariable('variation');
variationKey = variationKey || '1';

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
};

if (variations.hasOwnProperty(variationKey) & !DEBUG) {
    const vToRun = variations[variationKey];
    setNote(vToRun.note);
    s.run(vToRun.sketch());
} else {
    setNote('Not a valid variation!');
}

if (DEBUG) {
    // s.run(forcesDev());
    // s.run(testGrid());
    // s.run(blackhole());
    s.run(waves01());
}
