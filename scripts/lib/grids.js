import { create2dNoiseAbs } from './math';

// [[x,y], ...]
export const createCirclePoints = (offsetX, offsetY, diameter, steps, sx = 1, sy = 1) => {
    const points = [];
    for (let theta = 0; theta < 360; theta += steps) {
        const radius = theta * (Math.PI / 180);
        const x = Math.cos(radius) * diameter + sx + offsetX;
        const y = Math.sin(radius) * diameter + sy + offsetY;
        points.push([x, y]);
    }
    return points;
};
export const createGridPointsXY = (width, height, xMargin, yMargin, columns, rows) => {
    const gridPoints = [];

    const colStep = Math.round((width - xMargin * 2) / (columns - 1));
    const rowStep = Math.round((height - yMargin * 2) / (rows - 1));

    for (let col = 0; col < columns; col++) {
        const x = xMargin + col * colStep;
        for (let row = 0; row < rows; row++) {
            const y = yMargin + row * rowStep;
            gridPoints.push([x, y]);
        }
    }

    return { points: gridPoints, columnWidth: colStep, rowHeight: rowStep };
};
export const createGridCellsXY = (width, height, columns, rows, margin = 0, gutter = 0) => {
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
// -> [{radius, rotation, position:[u,v]}, ...]
export const createGridPointsUV = (columns, rows) => {
    rows = rows || columns;
    const points = [];

    const amplitude = 0.1;
    const frequency = 1;

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            const u = columns <= 1 ? 0.5 : x / (columns - 1);
            const v = columns <= 1 ? 0.5 : y / (rows - 1);
            // const radius = Math.abs(random.gaussian() * 0.02);
            const radius = create2dNoiseAbs(u, v);
            const rotation = create2dNoiseAbs(u, v);
            points.push({
                radius,
                rotation,
                position: [u, v],
            });
        }
    }
    return points;
};
