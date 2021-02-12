/*
Explorations with generative code
*/

import normliaze from 'normalize.css';

import { sketch } from './lib/sketch';
import { variation1 } from './variation1';
import { variation2 } from './variation2';
import { variation3 } from './variation3';

const s = sketch();

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
};

if (variations.hasOwnProperty(variationKey)) {
    const vToRun = variations[variationKey];
    setNote(vToRun.note);
    s.run(vToRun.sketch());
} else {
    setNote('Not a valid variation!');
}
