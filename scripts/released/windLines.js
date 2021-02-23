import { background, drawLineAngle, setStokeColor } from '../lib/canvas';
import { nicePalette } from '../lib/palettes';
import { create3dNoise, createGridPointsUV, marginify, oneOf, toSinValue, uvFromAngle } from '../lib/math';
import { Timeline } from '../lib/Timeline';

export const windLines = () => {
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
        background(canvas, context)('rgba(255,255,255,.1');

        grid.forEach(({ position, rotation, color }) => {
            const [u, v] = position;
            const { x, y } = marginify({ margin: 100, u, v, width: canvas.width, height: canvas.height });
            const t = toSinValue(timeline.playhead) * 0.1;
            const wave = create3dNoise(u, v, counter, 3 * t) * 10;
            const startvect = uvFromAngle((rotation + wave) * -1).setMag(25);
            setStokeColor(context)(color);
            drawLineAngle(context)(x + startvect.x, y + startvect.y, rotation + wave, 25, 4, 'round');
        });

        counter += 0.01;
        return timeline.onFrame();
    };

    return {
        config,
        setup,
        draw,
    };
};
