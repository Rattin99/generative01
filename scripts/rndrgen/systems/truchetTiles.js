import tinycolor from 'tinycolor2';
import { line, circleFilled, rectFilled, rect, arcQuarter } from '../canvas/primatives';
import { setContext } from '../canvas/canvas';

export const motifList = ['\\', '/', '-', '|', '+', '+.', 'x.', 'fnw', 'fne', 'fsw', 'fse', 'tn', 'ts', 'te', 'tw'];

// http://archive.bridgesmathart.org/2018/bridges2018-39.pdf
// https://observablehq.com/@osteele/truchet-carlson-tiles
// https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/
// Scaling changes by a factor of 2, and the fore/back colors should swap at each change
export const truchet = (context, rectangle, fore = 'black', back = 'white') => {
    const half = rectangle.w / 2;
    const third = rectangle.w / 3;
    const twoThirds = third * 2;
    const sixth = rectangle.w / 6;

    let foreColor = fore;
    let backColor = back;

    if (rectangle.phase < 0) {
        foreColor = back;
        backColor = fore;
    }

    context.beginPath();

    setContext(context)({
        strokeStyle: tinycolor(foreColor).toRgbString(),
        fillStyle: tinycolor(foreColor).toRgbString(),
        lineCap: 'butt',
        lineWidth: third,
        lineJoin: 'round',
    });

    rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, backColor);

    const motif = motifList[rectangle.motif];

    switch (motif) {
        case '\\':
            arcQuarter(context)(rectangle.x2, rectangle.y, half, Math.PI / 2);
            arcQuarter(context)(rectangle.x, rectangle.y2, half, Math.PI * 1.5);
            break;
        case '/':
            arcQuarter(context)(rectangle.x, rectangle.y, half, 0);
            arcQuarter(context)(rectangle.x2, rectangle.y2, half, Math.PI);
            break;
        case '-':
            line(context)(rectangle.x, rectangle.my, rectangle.x2, rectangle.my);
            break;
        case '|':
            line(context)(rectangle.mx, rectangle.y, rectangle.mx, rectangle.y2);
            break;
        case '+':
            line(context)(rectangle.x, rectangle.my, rectangle.x2, rectangle.my);
            line(context)(rectangle.mx, rectangle.y, rectangle.mx, rectangle.y2);
            break;
        case '+.':
            // default wing background
            break;
        case 'x.':
            rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, foreColor);
            break;
        case 'fnw':
            arcQuarter(context)(rectangle.x, rectangle.y, half, 0);
            break;
        case 'fne':
            arcQuarter(context)(rectangle.x2, rectangle.y, half, Math.PI / 2);
            break;
        case 'fsw':
            arcQuarter(context)(rectangle.x, rectangle.y2, half, Math.PI * 1.5);
            break;
        case 'fse':
            arcQuarter(context)(rectangle.x2, rectangle.y2, half, Math.PI);
            break;
        case 'tn':
            rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, twoThirds, foreColor);
            break;
        case 'ts':
            rectFilled(context)(rectangle.x, rectangle.y + third, rectangle.w, twoThirds, foreColor);
            break;
        case 'te':
            rectFilled(context)(rectangle.x + third, rectangle.y, twoThirds, rectangle.w, foreColor);
            break;
        case 'tw':
            rectFilled(context)(rectangle.x, rectangle.y, twoThirds, rectangle.w, foreColor);
            break;
        case 15:
        default:
            // "x."
            rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, foreColor);
            break;
    }

    circleFilled(context)(rectangle.x, rectangle.y, third, backColor);
    circleFilled(context)(rectangle.x2, rectangle.y, third, backColor);
    circleFilled(context)(rectangle.x2, rectangle.y2, third, backColor);
    circleFilled(context)(rectangle.x, rectangle.y2, third, backColor);

    circleFilled(context)(rectangle.mx, rectangle.y, sixth, foreColor);
    circleFilled(context)(rectangle.x2, rectangle.my, sixth, foreColor);
    circleFilled(context)(rectangle.mx, rectangle.y2, sixth, foreColor);
    circleFilled(context)(rectangle.x, rectangle.my, sixth, foreColor);

    // rect(context)(rectangle.x + 1, rectangle.y + 1, rectangle.w - 2, rectangle.h - 2, 1, 'green');

    context.closePath();
};
