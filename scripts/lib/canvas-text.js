import tinycolor from 'tinycolor2';
import { contextScale } from './canvas';

// https://www.cssfontstack.com/
export const textStyles = {
    size: (s) => `${s * contextScale}px "Helvetica Neue",Helvetica,Arial,sans-serif`,
    sansHelvetica: (s) => `${s * contextScale}px "Helvetica Neue",Helvetica,Arial,sans-serif`,
    monoCourier: (s) =>
        `${s * contextScale}px "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
    monoLucidia: (s) =>
        `${
            s * contextScale
        }px "Lucida Sans Typewriter", "Lucida Console", monaco, "Bitstream Vera Sans Mono", monospace`,
    serifGeorgia: (s) => `${s * contextScale}px Georgia, Times, "Times New Roman", serif`,
    default: '16px "Helvetica Neue",Helvetica,Arial,sans-serif',
    small: '12px "Helvetica Neue",Helvetica,Arial,sans-serif',
};
export const drawTextFilled = (context) => (text, x, y, color, style) => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.font = style || textStyles.sansHelvetica(16);
    context.fillText(text, x, y);
    // https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
    return context.measureText(text);
};
export const setTextAlignLeftTop = (context) => {
    context.textAlign = 'left';
    context.textBaseline = 'top';
};
export const setTextAlignAllCenter = (context) => {
    context.textAlign = 'center';
    context.textBaseline = 'middle';
};
