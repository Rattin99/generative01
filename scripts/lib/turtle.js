import tinycolor from 'tinycolor2';

let lineCap = 'butt';
let lineJoin = 'miter';

export const turtleLineMode = (m = 'butt') => {
    if (m === 'butt') {
        lineCap = 'butt';
        lineJoin = 'miter';
    } else if (m === 'round') {
        lineCap = 'round';
        lineJoin = 'round';
    }
};

export const plotLines = (context) => (points, color = 'black', width = 1) => {
    context.beginPath();
    context.strokeStyle = tinycolor(color).toRgbString();
    context.lineWidth = width;
    context.lineCap = lineCap;
    context.lineJoin = lineJoin;

    points.forEach((coords, i) => {
        if (i === 0) {
            context.moveTo(coords[0], coords[1]);
        } else {
            context.lineTo(coords[0], coords[1]);
        }
    });
    context.stroke();
};
