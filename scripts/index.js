/*
Explorations with generative code
*/

import normalize from 'normalize.css';
import { variationsIndex } from './variationsIndex';

import * as rndrgen from './rndrgen/rndrgen';
import { brushShape } from './experiments/brush-shape';
import { circles01 } from './experiments/circles';
import { circlePacking01 } from './experiments/circles-packing';

const debug = true;

const s = rndrgen.sketch('canvas', 0, debug);

// const experimentalVariation = undefined;
const experimentalVariation = circlePacking01;

const setNote = (note) => (document.getElementById('note').innerText = note);

const runVariation = (v) => {
    setNote(v.note);
    s.run(v.sketch, s);
};

const variationMapKeys = Object.keys(variationsIndex);
const urlKey = rndrgen.utils.getQueryVariable('variation') || variationMapKeys[variationMapKeys.length - 1];

if (experimentalVariation !== undefined) {
    runVariation({ sketch: experimentalVariation, note: 'Current experiment ...' });
} else if (urlKey && variationsIndex.hasOwnProperty(urlKey)) {
    console.log(urlKey, variationsIndex.hasOwnProperty(urlKey));
    runVariation(variationsIndex[urlKey]);
} else {
    runVariation(variationsIndex[variationMapKeys[variationMapKeys.length - 1]]);
}

document.getElementById('download').addEventListener('click', s.saveCanvasCapture);
document.getElementById('record').addEventListener('click', s.saveCanvasRecording);
