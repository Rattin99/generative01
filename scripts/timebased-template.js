import random from 'canvas-sketch-util/random';
import { background, drawCircleFilled, drawQuadRectFilled, drawRoundRectFilled, drawTextFilled } from './lib/canvas';
import { nicePalette } from './lib/palettes';
import { create3dNoise, createGridPointsUV, marginify, oneOf, toSinValue } from './lib/math';
import { Timeline } from './lib/Timeline';

export const timebasedTemplate = () => {
    const config = {
        width: 600,
        height: 600,
        fps: 60,
    };

    let counter = 0;
    let grid = createGridPointsUV(15, 15);

    const timeline = new Timeline(config.fps, 0, 5);

    const setup = (canvas, context) => {
        const colors = nicePalette();
        grid = grid.map((g) => {
            g.color = oneOf(colors);
            return g;
        });
        background(canvas, context)('rgba(255,255,255,1');
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)('rgba(255,255,255,1');

        // drawTextFilled(context)(timeline.playhead, 25, 25, 'red');

        grid.forEach(({ position, color }) => {
            const [u, v] = position;
            const { x, y } = marginify({ margin: 100, u, v, width: canvas.width, height: canvas.height });
            const t = toSinValue(timeline.playhead) * 0.1;
            const radius = create3dNoise(u, v, counter, 3 * t) * 100;
            // drawCircleFilled(context)(x, y, radius, color);
            drawQuadRectFilled(context)(x, y, radius, radius, color);
            drawRoundRectFilled(context)(x, y, radius, radius, 5, color);
        });

        counter += 0.01;
        // returns -1 if number of loops exceeded
        return timeline.onFrame();
    };

    return {
        config,
        setup,
        draw,
    };
};
