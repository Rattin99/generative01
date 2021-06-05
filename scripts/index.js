/*
Explorations with generative code
*/

import normalize from 'normalize.css';
import { variationsIndex } from './variationsIndex';

import * as rndrgen from './rndrgen/rndrgen';
import { gridDitherImage } from './experiments/grid-dither-image';

console.log(rndrgen);

const s = rndrgen.sketch('canvas');

const experimentalVariation = undefined;
// const experimentalVariation = gridDitherImage;

const setNote = (note) => (document.getElementById('note').innerText = note);

const runVariation = (v) => {
    setNote(v.note);
    s.run(v.sketch);
};

const variationMapKeys = Object.keys(variationsIndex);
const urlKey = rndrgen.utils.getQueryVariable('variation') || variationMapKeys[variationMapKeys.length - 1];

if (experimentalVariation !== undefined) {
    runVariation({ sketch: experimentalVariation, note: 'Current experiment ...' });
} else if (urlKey && variationsIndex.hasOwnProperty(urlKey)) {
    runVariation(variationsIndex[urlKey]);
} else {
    runVariation(variationsIndex[variationMapKeys.length]);
}

document.getElementById('download').addEventListener('click', s.saveCanvasCapture);
