import tinycolor from 'tinycolor2';
import * as nicepalettes from 'nice-color-palettes';
import { mapRange } from '../math/math';
import { oneOf, randomWholeBetween } from '../math/random';

export const arrayToTinyColor = (arry) => arry.map((c) => tinycolor(c));

/*
TODO - fn for this from grid-dither-image
const grey = image.averageGreyFromCell(p[0], p[1], grid.columnWidth, grid.rowHeight);
const amount = mapRange(0, 255, 1, 10, 255 - grey);
 */

// hslFromRange(50, 90,270, v);
export const hslFromRange = (y1, x2, y2, v) => {
    const h = mapRange(0, y1, x2, y2, v);
    const s = 100;
    const l = 50;
    return tinycolor(`hsl(${h},${s}%,${l}%)`);
};

export const brightest = (arry) => {
    const colors = arrayToTinyColor(arry);
    return colors.reduce((acc, c) => {
        if (c.getBrightness() > acc.getBrightness()) {
            acc = c;
        }
        return acc;
    }, colors[0]);
};

export const darkest = (arry) => {
    const colors = arrayToTinyColor(arry);
    return colors.reduce((acc, c) => {
        if (c.getBrightness() < acc.getBrightness()) {
            acc = c;
        }
        return acc;
    }, colors[0]);
};

export const bicPenBlue = tinycolor('hsl(250,79,29)').clone();
export const paperWhite = tinycolor('hsl(53,3,100)').clone();

// hsl(46, 45%, 85%)
export const warmWhite = tinycolor('hsl(42, 14%, 86%)').clone();
export const warmPink = tinycolor('hsl(29, 42%, 86%)').clone();

export const coolGreyDark = tinycolor('#1f2933').clone();
// hsl(43, 57%, 11%)
export const warmGreyDark = tinycolor('#27241d').clone();

export const palettes = {
    greyWarm: [
        '#faf97f',
        '#e8e6e1',
        '#d3cec4',
        '#b8b2a7',
        '#a39e93',
        '#857f72',
        '#625d52',
        '#504a40',
        '#423d33',
        '#27241d',
    ],
    greyCool: [
        '#f5f7fa',
        '#e4e7eb',
        '#cbd2d9',
        '#9aa5b1',
        '#7b8794',
        '#616e7c',
        '#52606d',
        '#3e4c59',
        '#323f4b',
        '#1f2933',
    ],
    pop: ['#ed3441', '#ffd630', '#329fe3', '#154296', '#303030'],
    '60s_psyc': ['#ffeb00', '#fc0019', '#01ff4f', '#ff01d7', '#5600cc', '#00edf5'],
    '70s': ['#73BFA3', '#F2DBAE', '#F29829', '#D9631E', '#593C2C'],
    '80s_pastells': ['#FF3F3F', '#FF48C4', '#F3EA5F', '#C04DF9', '#2BD1FC', '#38CEF6'],
    '80s_pop': ['#FF82E2', '#70BAFF', '#FED715', '#0037B3', '#FE0879'],
    '90s': ['#42C8B0', '#4575F3', '#6933B0', '#D36F88', '#FC8D45'],
    retro_sunset: ['#FFD319', '#FF2975', '#F222FF', '#8C1EFF', '#FF901F'],
    vapor_wave: ['#F6A3EF', '#50D8EC', '#DD6DFB', '#EECD69', '#6FEAE6'],
    // https://www.colourlovers.com/palette/694737/Thought_Provoking
    thought_provoking: [
        'hsl(46, 75%, 70%)',
        'hsl(10, 66%, 56%)',
        'hsl(350, 65%, 46%)',
        'hsl(336, 40%, 24%)',
        'hsl(185, 19%, 40%)',
    ],
};

export const nicePalette = (_) => nicepalettes[randomWholeBetween(0, 99)];
export const palette = (_) => palettes[oneOf(Object.keys(palettes))];

export const get2Tone = (l = 10, d = 25) => {
    const pal = nicePalette();
    const light = brightest(pal).clone().lighten(l);
    const dark = darkest(pal).clone().darken(d);
    const text = light.clone().darken(15).desaturate(20);
    return { palette, light, dark, text };
};
