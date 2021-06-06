import { background, stokeColor } from '../rndrgen/canvas/canvas';
import { nicePalette } from '../rndrgen/color/palettes';
import { toSinValue, uvFromAngle } from '../rndrgen/math/math';
import { Timeline } from '../rndrgen/animation/Timeline';
import { create2dNoiseAbs, create3dNoiseAbs, oneOf } from '../rndrgen/math/random';
import { lineAtAngle } from '../rndrgen/canvas/primatives';
import { uvPointToCanvas } from '../rndrgen/math/points';

// -> [{radius, rotation, position:[u,v]}, ...]
const createGridPointsUV = (columns, rows) => {
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
            const { x, y } = uvPointToCanvas({ margin: 100, u, v, width: canvas.width, height: canvas.height });
            const t = toSinValue(timeline.playhead) * 0.1;
            const wave = create3dNoiseAbs(u, v, counter, 3 * t) * 10;
            const startvect = uvFromAngle((rotation + wave) * -1).setMag(25);
            stokeColor(context)(color);
            lineAtAngle(context)(x + startvect.x, y + startvect.y, rotation + wave, 25, 4, 'round');
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
