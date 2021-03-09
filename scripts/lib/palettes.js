import tinycolor from 'tinycolor2';
import * as nicepalettes from 'nice-color-palettes';
import { mapRange, oneOf, randomWholeBetween } from './math';

export const asTinyColor = (arry) => arry.map((c) => tinycolor(c));

export const brightest = (arry) => {
    const colors = asTinyColor(arry);
    return colors.reduce((acc, c) => {
        if (c.getBrightness() > acc.getBrightness()) {
            acc = c;
        }
        return acc;
    }, colors[0]);
};

export const darkest = (arry) => {
    const colors = asTinyColor(arry);
    return colors.reduce((acc, c) => {
        if (c.getBrightness() < acc.getBrightness()) {
            acc = c;
        }
        return acc;
    }, colors[0]);
};

export const bicPenBlue = tinycolor('hsl(250,79,29)').clone();
export const paperWhite = tinycolor('hsl(53,3,100)').clone();

export const warmWhite = tinycolor('hsl(42, 14%, 86%)').clone();
export const warmPink = tinycolor('hsl(29, 42%, 86%)').clone();

// greys from https://uxdesign.cc/dark-mode-ui-design-the-definitive-guide-part-1-color-53dcfaea5129
export const coolGreyDark = tinycolor('#1f2933').clone();
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

// hslFromRange(50, 90,270, v);
export const hslFromRange = (y1, x2, y2, v) => {
    const h = mapRange(0, y1, x2, y2, v);
    const s = 100;
    const l = 50;
    return tinycolor(`hsl(${h},${s}%,${l}%)`);
};

/*
Color between 2 defined and a hue spin in the middle to introduce a 3rd
// Palette from https://www.colourlovers.com/palette/694737/Thought_Provoking

const colorTop = 'hsl(350, 65%, 46%)';
const colorBottom = 'hsl(185, 19%, 40%)';
const distFromCenter = Math.abs(mid - currentY);
const color = tinycolor.mix(colorTop, colorBottom, mapRange(startY, maxY, 0, 100, currentY));
color.spin(mapRange(0, mid / 2, 60, 0, distFromCenter));
color.brighten(mapRange(0, mid / 2, 50, 0, distFromCenter));
color.darken(mapRange(0, mid, 0, 40, distFromCenter) + randomNumberBetween(0, 30));
 */
