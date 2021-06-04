/*
Explorations with generative code
*/

import normalize from 'normalize.css';
import { getQueryVariable } from './rndrgen/utils';
import { sketch } from './rndrgen/sketch';
import { variationsIndex } from './variationsIndex';

const s = sketch('canvas');

const experimentalVariation = undefined;
// const experimentalVariation = marchingSquares;

const setNote = (note) => (document.getElementById('note').innerText = note);

const runVariation = (v) => {
    setNote(v.note);
    s.run(v.sketch);
};

let variationKey = getQueryVariable('variation');
const variationKeys = Object.keys(variationsIndex);
variationKey = variationKey || variationKeys[variationKeys.length - 1];

if (getQueryVariable('variation') && variationsIndex.hasOwnProperty(variationKey)) {
    runVariation(variationsIndex[variationKey]);
} else if (experimentalVariation !== undefined) {
    runVariation({ sketch: experimentalVariation, note: 'Current experiment ...' });
} else {
    runVariation(variationsIndex[variationKeys.length]);
}

document.getElementById('download').addEventListener('click', s.saveCanvasCapture);
