import { background, drawLineAngle, setStokeColor } from '../rndrgen/canvas/canvas';
import { nicePalette } from '../rndrgen/color/palettes';
import { marginify, toSinValue, uvFromAngle } from '../rndrgen/math/math';
import { Timeline } from '../rndrgen/animation/Timeline';
import { createGridPointsUV } from '../rndrgen/math/grids';
import { create3dNoiseAbs, oneOf } from '../rndrgen/math/random';

export const windLines = () => {
    const config = {
        width: 600,
        height: 600,
        fps: 60,
    };

    let counter = 0;
    let grid = createGridPointsUV(15, 15);

    const timeline = new Timeline(config.fps, 0, 5);

    const setup = ({ canvas, context }) => {
        const colors = nicePalette();
        grid = grid.map((g) => {
            g.color = oneOf(colors);
            return g;
        });
        background(canvas, context)('rgba(255,255,255,1');
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)('rgba(255,255,255,.1');

        grid.forEach(({ position, rotation, color }) => {
            const [u, v] = position;
            const { x, y } = marginify({ margin: 100, u, v, width: canvas.width, height: canvas.height });
            const t = toSinValue(timeline.playhead) * 0.1;
            const wave = create3dNoiseAbs(u, v, counter, 3 * t) * 10;
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
