import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { Palette, warmWhite } from '../rndrgen/color/palettes';
import { circleFilled, line } from '../rndrgen/canvas/primatives';
import { create2dNoise, create3dNoise, randomNormalNumberBetween, randomNumberBetween } from '../rndrgen/math/random';
import { mapRange, PI, TAU, uvFromAngle } from '../rndrgen/math/math';
import { getPointGrid } from '../rndrgen/math/grids';
import { pointDistance } from '../rndrgen/math/points';
import { cliffordAttractor, jongAttractor } from '../rndrgen/math/attractors';

const fieldLine = (context) => (x, y, theta, length = 10) => {
    const vect = uvFromAngle(theta).setMag(length);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + vect.x, y + vect.y);
    context.stroke();
};

export const ffGridPainting01 = () => {
    const config = {
        name: 'ff-grid-painting01.js',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    let renderAreaWidth;
    let time = 0;
    let resolution = 100;
    const margin = 150;
    const renderScale = config.scale; // 1 or 2

    const palette = new Palette();

    const colorBackground = warmWhite;
    const colorTop = 'hsl(185, 100%, 18%)';
    const colorBottom = 'hsl(182, 100%, 29%)';

    let canvasFocalH;
    let canvasFocalV;
    let focalRangeH;
    let focalDistance;

    let points = [];
    const foregroundPoints = [];
    const backgroundPoints = [];

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;

        renderAreaWidth = maxX - startX;

        resolution = renderAreaWidth / 7;

        canvasFocalH = canvasWidth / 2;
        canvasFocalV = canvasHeight / 2;
        focalRangeH = canvasFocalH * 0.5;
        focalDistance = canvasWidth / 4;

        points = getPointGrid(startX, startY, maxX, maxY, resolution, resolution);

        points.forEach((p) => {
            if (pointDistance(p, { x: canvasFocalH, y: canvasFocalV }) < focalDistance) {
                foregroundPoints.push(p);
            } else {
                backgroundPoints.push(p);
            }
        });

        context.lineCap = 'round';

        background(canvas, context)(colorBackground);
    };

    const noise2d = (x, y, f) => create2dNoise(x, y, 1, f);
    const noise3d = (x, y, z, f) => create3dNoise(x, y, z, 1, f);

    const clifford = (x, y, s) => cliffordAttractor(canvasWidth, canvasHeight, x, y, s);
    const jong = (x, y, s) => jongAttractor(canvasWidth, canvasHeight, x, y, s);

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(colorBackground.clone().setAlpha(0.1));

        backgroundPoints.forEach((p) => {
            const { x, y } = p;
            const distFromFocalH = Math.abs(canvasFocalH - x);
            const fa = randomNumberBetween(1, 1.2);
            // const n = create3dNoise(x, y, time, 1, 0.001 * fa);
            const n = noise3d(x, y, time, 0.001 * fa);

            // let color = tinycolor.mix(colorTop, colorBottom, mapRange(-1, 1, 0, 100, n));
            // color = tinycolor.mix(color, 'hsl(46, 75%, 70%)', mapRange(0, 1, 0, 100, n));
            // // color.spin(mapRange(0, focalRangeH, 20, -20, distFromFocalH + randomNumberBetween(0, 100)));
            // // color.brighten(mapRange(0, focalRangeH, 10, 0, distFromFocalH + randomNumberBetween(0, 100)));
            // color.darken(mapRange(0, canvasFocalH, 0, 15, distFromFocalH + randomNumberBetween(0, 100)));
            // // color.saturate(mapRange(0, focalRangeH, 10, 0, distFromFocalH + randomNumberBetween(0, 100)));
            // color.brighten(mapRange(-1, 1, 0, 20, n));
            // color.brighten(mapRange(0.75, 1, 0, 20, n));
            // color.desaturate(40);
            // color.spin(randomNumberBetween(-5, 5));

            const color = palette.get(n * palette.length, 20);

            context.strokeStyle = tinycolor(color);
            context.lineWidth = Math.abs(n) * 2 + 1; // + randomNormalNumberBetween(0, 10);
            const lineLength = Math.abs(n) * 50 + 5; // randomNormalNumberBetween(0, 5);
            const hl = lineLength / 2;
            fieldLine(context)(x + hl, y + hl, n * PI, lineLength);
        });

        foregroundPoints.forEach((p) => {
            const { x, y } = p;
            const distFromFocalH = Math.abs(canvasFocalH - x);
            const fa = randomNumberBetween(1, 1.2);
            // const n = create3dNoise(x, y, time, 1, 0.001 * fa);
            const n = noise3d(x, y, time, 0.002);

            // let color = tinycolor.mix(colorTop, colorBottom, mapRange(-1, 1, 0, 100, n));
            // color = tinycolor.mix(color, 'hsl(46, 75%, 70%)', mapRange(0, 1, 0, 100, n));
            // // color.spin(mapRange(0, focalRangeH, 20, -20, distFromFocalH + randomNumberBetween(0, 100)));
            // // color.brighten(mapRange(0, focalRangeH, 10, 0, distFromFocalH + randomNumberBetween(0, 100)));
            // color.darken(mapRange(0, canvasFocalH, 0, 15, distFromFocalH + randomNumberBetween(0, 100)));
            // // color.saturate(mapRange(0, focalRangeH, 10, 0, distFromFocalH + randomNumberBetween(0, 100)));
            // color.brighten(mapRange(-1, 1, 0, 20, n));
            // color.brighten(mapRange(0.75, 1, 0, 20, n));
            // color.spin(20);

            const color = palette.get(n * palette.length, 50);

            context.strokeStyle = tinycolor(color);
            context.lineWidth = Math.abs(n) * 2 + randomNormalNumberBetween(1, 10);
            const lineLength = Math.abs(n) * 50 + randomNormalNumberBetween(2, 15);
            const hl = lineLength / 2;
            fieldLine(context)(x + hl, y + hl, n * PI, lineLength);
        });

        time += 0.5;
        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
