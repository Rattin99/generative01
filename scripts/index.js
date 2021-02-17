/*
Explorations with generative code
*/

import normliaze from 'normalize.css';

import { sketch } from './lib/sketch';
import { forcesDev } from './forcesDev';
import { forcesDevGravity } from './forcesDevGravity';
import { variation1 } from './variation1';
import { variation2 } from './variation2';
import { variation3 } from './variation3';
import { variation4 } from './variation4';
import { variation5 } from './variation5';
import { variation6 } from './variation6';
import { rainbowRakeOrbit } from './rainbow-rake-orbit-mouse';

const s = sketch();

const DEBUG = false;

const saveCanvasCapture = (_) => {
    console.log('Saving capture');
    const imageURI = s.canvas().toDataURL('image/png');
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
        sketch: variation3,
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
    s.run(forcesDevGravity());
}
