import random from 'canvas-sketch-util/random';
import { background, drawCircleFilled } from './lib/canvas';
import { nicePalette } from './lib/palettes';
import { createGridPoints2dNoise, marginify, oneOf, toSinValue } from './lib/math';

export const timebasedTemplate = () => {
    const config = {
        width: 600,
        height: 600,
        fps: 60,
    };

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let counter = 0;
    let grid = createGridPoints2dNoise(15, 15);

    // FPS must be defined
    const loop = 0; // total loops
    const duration = 5; // duration of each loop in seconds
    const totalLoopFrames = duration ? duration * config.fps : 1;
    let drawLoopIterations = 0; // number of times drawn
    let time = 0; // elapsed time in seconds
    let playhead = 0; // current progress of the loop between 0 and 1
    let frame = 1; // frame of the loop
    let elapsedLoops = 0;

    const updateTimeProps = () => {
        drawLoopIterations++;
        if (config.fps) {
            // one frame
            frame++;
            playhead = frame / totalLoopFrames;
            if (drawLoopIterations % config.fps === 0) {
                // a second elapsed
                time++;
                if (frame >= totalLoopFrames) {
                    // one loop duration passed
                    // console.log('Looping');
                    elapsedLoops++;
                    playhead = 0;
                    frame = 0;
                    if (loop && elapsedLoops >= loop) {
                        console.log('End of loops');
                        return -1;
                    }
                }
            }
        }
        return 1;
    };

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;
        const colors = nicePalette();
        grid = grid.map((g) => {
            g.color = oneOf(colors);
            return g;
        });
        background(canvas, context)('rgba(255,255,255,1');
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)('rgba(255,255,255,.1');

        grid.forEach(({ position, color }) => {
            const [u, v] = position;
            const { x, y } = marginify({ margin: 100, u, v, width: canvas.width, height: canvas.height });
            const t = toSinValue(playhead) * 0.1;
            const radius = Math.abs(random.noise3D(u, v, counter) * 3) * t;
            drawCircleFilled(context)(color, x, y, radius * 50);
        });

        counter += 0.01;
        const end = updateTimeProps();
        return end;
    };

    return {
        config,
        setup,
        draw,
    };
};
