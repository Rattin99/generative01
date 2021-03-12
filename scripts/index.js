/*
Explorations with generative code
*/

import normalize from 'normalize.css';
import { sketch } from './lib/sketch';
import { variationsIndex } from './variationsIndex';

import { larrycarlson03 } from './experiments/larrycarlson03';
import { gridDither } from './experiments/grid-dither';

// const experimentalVariation = undefined;
const experimentalVariation = gridDither;

const s = sketch();

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

let variationKey = getQueryVariable('variation');
const variationKeys = Object.keys(variationsIndex);
variationKey = variationKey || variationKeys[variationKeys.length - 1];

if (variationsIndex.hasOwnProperty(variationKey) && experimentalVariation === undefined) {
    const vToRun = variationsIndex[variationKey];
    setNote(vToRun.note);
    s.run(vToRun.sketch);
} else {
    setNote('Not a valid variation!');
}

if (experimentalVariation) {
    s.run(experimentalVariation);
}
