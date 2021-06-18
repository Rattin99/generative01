// [[x,y], ...]
export const getPointsOnCircle = (offsetX, offsetY, radius, steps, close = false) => {
    const startAngle = 270;
    const maxAngle = 360 + startAngle;
    const points = [];
    for (let angle = startAngle; angle < maxAngle; angle += steps) {
        const theta = angle * (Math.PI / 180);
        const x = Math.cos(theta) * radius + offsetX;
        const y = Math.sin(theta) * radius + offsetY;
        points.push([x, y]);
    }
    if (close) {
        const theta = maxAngle - 1 * (Math.PI / 180);
        const x = Math.cos(theta) * radius + offsetX;
        const y = Math.sin(theta) * radius + offsetY;
        points.push([x, y]);
    }
    return points;
};

export const getGridCells = (width, height, columns, rows, margin = 0, gutter = 0) => {
    const points = [];

    const colStep = Math.ceil((width - margin * 2 - gutter * (columns - 1)) / columns);
    const rowStep = Math.ceil((height - margin * 2 - gutter * (rows - 1)) / rows);

    for (let row = 0; row < rows; row++) {
        const y = margin + row * rowStep + gutter * row;
        for (let col = 0; col < columns; col++) {
            const x = margin + col * colStep + gutter * col;
            points.push([x, y]);
        }
    }

    return { points, columnWidth: colStep, rowHeight: rowStep };
};

/*
const resolution = 40;
let cols = Math.ceil(canvasWidth / resolution) + 1;
let rows = Math.ceil(canvasHeight / resolution) + 1;
let field = new Matrix(rows, cols);

for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * resolution;
                const y = j * resolution;
                const noise = noiseFn(x, y, z);
                field.data[j][i] = noise;
                const fillColor = tinycolor.mix(lowColor, highColor, noise * 100);
                context.fillStyle = tinycolor(fillColor).toRgbString();
                context.fillRect(x, y, x + resolution, y + resolution);
            }
        }
 */
