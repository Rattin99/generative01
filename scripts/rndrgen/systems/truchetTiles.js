import tinycolor from 'tinycolor2';
import { line, circleFilled, rectFilled, rect, arcQuarter } from '../canvas/primatives';
import { setContext } from '../canvas/canvas';

const motifList = ['\\', '/', '-', '|', '+', '+.', 'x.', 'fnw', 'fne', 'fsw', 'fse', 'tn', 'ts', 'te', 'tw'];

// https://observablehq.com/@osteele/truchet-carlson-tiles
// https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/
// Scaling changes by a factor of 2, and the fore/back colors should swap at each change
export const truchet = (context, rectangle, fore = 'black', back = 'white') => {
    const factor = 3;
    const scale = Math.round(rectangle.w / factor);
    const arcRad = Math.round(rectangle.w / 2);
    const wingDotRad = Math.round(scale / 2) - 1;
    const tSize = scale * (factor - 1); // rectangle.size - scale;

    let foreColor = fore;
    let backColor = back;

    if (rectangle.phase < 0) {
        foreColor = back;
        backColor = fore;
    }

    setContext(context)({
        strokeStyle: tinycolor(foreColor).toRgbString(),
        fillStyle: tinycolor(foreColor).toRgbString(),
        lineCap: 'butt',
        lineWidth: scale,
        lineJoin: 'round',
    });

    rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, backColor);

    const motif = motifList[rectangle.motif];

    switch (motif) {
        case '\\':
            arcQuarter(context)(rectangle.x2, rectangle.y, arcRad, Math.PI / 2);
            arcQuarter(context)(rectangle.x, rectangle.y2, arcRad, Math.PI * 1.5);
            break;
        case '/':
            arcQuarter(context)(rectangle.x, rectangle.y, arcRad, 0);
            arcQuarter(context)(rectangle.x, rectangle.y2, arcRad, Math.PI);
            break;
        case '-':
            rectFilled(context)(rectangle.x, rectangle.y + scale, rectangle.w, scale, foreColor);
            break;
        case '|':
            //
            rectFilled(context)(rectangle.x + scale, rectangle.y, scale, rectangle.w, foreColor);
            break;
        case '+':
            rectFilled(context)(rectangle.x, rectangle.y + scale, rectangle.w, scale, foreColor);
            rectFilled(context)(rectangle.x + scale, rectangle.y, scale, rectangle.w, foreColor);
            break;
        case '+.':
            // default wing background
            break;
        case 'x.':
            rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, foreColor);
            break;
        case 'fnw':
            arcQuarter(context)(rectangle.x, rectangle.y, arcRad, 0);
            break;
        case 'fne':
            arcQuarter(context)(rectangle.x2, rectangle.y, arcRad, Math.PI / 2);
            break;
        case 'fsw':
            //
            arcQuarter(context)(rectangle.x, rectangle.y2, arcRad, Math.PI * 1.5);
            break;
        case 'fse':
            arcQuarter(context)(rectangle.x, rectangle.y2, arcRad, Math.PI);
            break;
        case 'tn':
            rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, tSize, foreColor);
            break;
        case 'ts':
            rectFilled(context)(rectangle.x, rectangle.y + scale, rectangle.w, tSize, foreColor);
            break;
        case 'te':
            rectFilled(context)(rectangle.x + scale, rectangle.y, tSize, rectangle.w, foreColor);
            break;
        case 'tw':
            rectFilled(context)(rectangle.x, rectangle.y, tSize, rectangle.w, foreColor);
            break;
        case 15:
        default:
            // "x."
            rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, foreColor);
            break;
    }

    circleFilled(context)(rectangle.x, rectangle.y, scale, backColor);
    circleFilled(context)(rectangle.x2, rectangle.y, scale, backColor);
    circleFilled(context)(rectangle.x2, rectangle.y2, scale, backColor);
    circleFilled(context)(rectangle.x, rectangle.y2, scale, backColor);
    circleFilled(context)(rectangle.mx, rectangle.y, wingDotRad, foreColor);
    circleFilled(context)(rectangle.x2, rectangle.my, wingDotRad, foreColor);
    circleFilled(context)(rectangle.mx, rectangle.y2, wingDotRad, foreColor);
    circleFilled(context)(rectangle.x, rectangle.my, wingDotRad, foreColor);
};
