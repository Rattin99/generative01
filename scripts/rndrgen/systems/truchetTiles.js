import tinycolor from 'tinycolor2';
import { line, circleFilled, rectFilled, rect, arcQuarter, circle } from '../canvas/primatives';
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

const endLineMult = 1.25;

const sqTileLinesHorizontal = (context) => (
    x,
    y,
    w,
    h,
    lineWidth,
    num = 5,
    margin = 0,
    foreColor = 'black',
    backColor = 'white'
) => {
    context.save();
    const region = new Path2D();
    region.rect(x, y, w, h);
    context.clip(region);

    y += margin;
    h -= margin * 2;

    const x2 = x + w;
    const gap = h / num;

    context.strokeStyle = tinycolor(foreColor).toRgbString();
    rectFilled(context)(x, y, w, h, backColor);

    for (let i = 0; i < num + 1; i++) {
        let iy = y + i * gap;

        if (i === 0 || i === num) {
            context.lineWidth = lineWidth * endLineMult;
            if (i === 0) {
                iy += lineWidth * endLineMult;
            } else {
                iy -= lineWidth * endLineMult;
            }
        } else {
            context.lineWidth = lineWidth;
        }

        line(context)(x, iy, x2, iy);
    }

    context.restore();
};

const sqTileLinesVertical = (context) => (
    x,
    y,
    w,
    h,
    lineWidth,
    num = 5,
    margin = 0,
    foreColor = 'black',
    backColor = 'white'
) => {
    if (margin) {
        sqTileLinesHorizontal(x, y, w, h, lineWidth, num, margin, foreColor, backColor);
    }

    context.save();
    const region = new Path2D();
    region.rect(x, y, w, h);
    context.clip(region);

    x += margin;
    w -= margin * 2;

    const y2 = y + h;
    const gap = w / num;

    context.strokeStyle = tinycolor(foreColor).toRgbString();
    rectFilled(context)(x, y, w, h, backColor);

    for (let i = 0; i < num + 1; i++) {
        let ix = x + i * gap;

        if (i === 0 || i === num) {
            context.lineWidth = lineWidth * endLineMult;
            if (i === 0) {
                ix += lineWidth * endLineMult;
            } else {
                ix -= lineWidth * endLineMult;
            }
        } else {
            context.lineWidth = lineWidth;
        }

        line(context)(ix, y, ix, y2);
    }

    context.restore();
};

const rings = (context) => (x, y, r, lineWidth, num = 5, margin = 0, foreColor = 'black', backColor = 'white') => {
    r -= margin * 2;

    const gap = r / num;

    context.strokeStyle = tinycolor(foreColor).toRgbString();
    if (backColor) circleFilled(context)(x, y, r + margin, backColor);

    for (let i = 0; i < num + 1; i++) {
        let ir = i * gap + margin;

        if (i === 0 || i === num) {
            context.lineWidth = lineWidth * endLineMult;
            if (i === 0) {
                ir += lineWidth * endLineMult;
            } else {
                ir -= lineWidth * endLineMult;
            }
        } else {
            context.lineWidth = lineWidth;
        }

        circle(context)(x, y, ir, foreColor);
    }
};

const sqTileCornerArc = (context) => (
    x,
    y,
    r,
    lineWidth,
    c = 0,
    num = 5,
    margin = 0,
    foreColor = 'black',
    backColor = 'white'
) => {
    context.save();
    const region = new Path2D();
    region.rect(x, y, r, r);
    context.clip(region);

    context.strokeStyle = tinycolor(foreColor).toRgbString();
    rectFilled(context)(x, y, r, r, backColor);

    const x2 = x + r;
    const y2 = y + r;

    if (c === 0) {
        // top left
        rings(context)(x2, y2, r, lineWidth, num, margin, foreColor, null);
        rings(context)(x, y, r, lineWidth, num, margin, foreColor, backColor);
    } else if (c === 1) {
        // top right
        rings(context)(x, y2, r, lineWidth, num, margin, foreColor, null);
        rings(context)(x2, y, r, lineWidth, num, margin, foreColor, backColor);
    } else if (c === 2) {
        // bottom left
        rings(context)(x, y2, r, lineWidth, num, margin, foreColor, null);
        rings(context)(x2, y, r, lineWidth, num, margin, foreColor, backColor);
    } else {
        // bottom right
        rings(context)(x, y, r, lineWidth, num, margin, foreColor, null);
        rings(context)(x2, y2, r, lineWidth, num, margin, foreColor, backColor);
    }

    context.restore();
};

export const motifListInterlaced = ['-', '|', 'fnw', 'fne', 'fsw', 'fse'];

// https://www.reddit.com/r/generative/comments/ju1xjr/truchet_tiles_pen_plot/
export const truchetInterlaced = (
    context,
    rectangle,
    lines = 3,
    lineWidth = 1,
    margin = 0,
    fore = 'black',
    back = 'white'
) => {
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
        lineWidth,
        lineJoin: 'bevel',
    });

    rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, backColor);

    const motif = motifListInterlaced[rectangle.motif];

    switch (motif) {
        case '-':
            sqTileLinesVertical(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                rectangle.w,
                lineWidth,
                lines,
                margin,
                foreColor,
                back
            );
            sqTileLinesHorizontal(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                rectangle.w,
                lineWidth,
                lines,
                margin,
                foreColor,
                back
            );
            break;
        case '|':
            sqTileLinesHorizontal(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                rectangle.w,
                lineWidth,
                lines,
                margin,
                foreColor,
                back
            );
            sqTileLinesVertical(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                rectangle.w,
                lineWidth,
                lines,
                margin,
                foreColor,
                back
            );
            break;
        case 'fnw':
            sqTileCornerArc(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                lineWidth,
                0,
                lines,
                margin,
                foreColor,
                back
            );
            break;
        case 'fne':
            sqTileCornerArc(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                lineWidth,
                1,
                lines,
                margin,
                foreColor,
                back
            );
            break;
        case 'fsw':
            sqTileCornerArc(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                lineWidth,
                2,
                lines,
                margin,
                foreColor,
                back
            );
            break;
        case 'fse':
            sqTileCornerArc(context)(
                rectangle.x,
                rectangle.y,
                rectangle.w,
                lineWidth,
                3,
                lines,
                margin,
                foreColor,
                back
            );
            break;
        default:
            // "x."
            break;
    }

    context.closePath();
};
