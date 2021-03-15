import tinycolor from 'tinycolor2';

export const plotLines = (context) => (points, color = 'black', width = 1) => {
    context.beginPath();
    context.strokeStyle = tinycolor(color).toRgbString();
    context.lineWidth = width;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    points.forEach((coords, i) => {
        if (i === 0) {
            context.moveTo(coords[0], coords[1]);
        } else {
            context.lineTo(coords[0], coords[1]);
        }
    });
    context.stroke();
};
