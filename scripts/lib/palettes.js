import * as nicepalettes from 'nice-color-palettes';
import { oneOf } from './math';

export const palettes = {
    pop: ['#ed3441', '#ffd630', '#329fe3', '#154296', '#ffffff', '#303030'],
    '70s': ['#73BFA3', '#F2DBAE', '#F29829', '#D9631E', '#593C2C'],
    '80s_pastells': ['#FF3F3F', '#FF48C4', '#F3EA5F', '#C04DF9', '#2BD1FC', '#38CEF6'],
    '80s_pop': ['#FF82E2', '#70BAFF', '#FED715', '#0037B3', '#FE0879'],
    '90s': ['#42C8B0', '#4575F3', '#6933B0', '#D36F88', '#FC8D45'],
    retro_sunset: ['#FFD319', '#FF2975', '#F222FF', '#8C1EFF', '#FF901F'],
    vapor_wave: ['#F6A3EF', '#50D8EC', '#DD6DFB', '#EECD69', '#6FEAE6'],
};

export const nicePalette = (_) => nicepalettes[oneOf(Object.keys(nicepalettes))];
export const palette = (_) => palettes[oneOf(Object.keys(palettes))];
