/*
Convenience canvas sketch runner. Based on p5js


const variation = () => {
    const config = {};

    const setup = (canvas, context) => {
        // create initial state
    };

    // will run every frame
    const draw = (canvas, context, mouse) => {
        // draw on every frame
        return 1; // -1 to exit animation loop
    };

    return {
        config,
        setup,
        draw,
    };
};
*/

import { fillCanvas, resizeCanvas } from './canvas';

export const sketch = () => {
    const mouse = {
        x: undefined,
        y: undefined,
        isDown: false,
        radius: 100,
    };

    let fps = 0;

    let currentVariation;

    const canvasSizeFraction = 0.85;
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth * canvasSizeFraction;
    canvas.height = window.innerHeight * canvasSizeFraction;

    const getCanvas = (_) => canvas;
    const getContext = (_) => context;
    const getMouse = (_) => mouse;

    const mouseDown = (evt) => {
        mouse.isDown = true;
    };

    const mouseMove = (evt) => {
        const canvasFrame = canvas.getBoundingClientRect();
        mouse.x = evt.x - canvasFrame.x;
        mouse.y = evt.y - canvasFrame.y;
    };

    const mouseUp = (evt) => {
        mouse.isDown = false;
    };

    const mouseOut = (evt) => {
        mouse.x = undefined;
        mouse.y = undefined;
        mouse.isDown = false;
    };

    const windowResize = (evt) =>
        resizeCanvas(canvas, window.innerWidth * canvasSizeFraction, window.innerHeight * canvasSizeFraction);

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('touchstart', mouseDown);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchmove', mouseMove);

    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('touchend', mouseUp);

    window.addEventListener('mouseout', mouseOut);
    window.addEventListener('touchcancel', mouseOut);

    window.addEventListener('resize', windowResize);

    const run = (variation) => {
        currentVariation = variation;

        let backgroundColor = '0,0,0';

        if (variation.hasOwnProperty('config')) {
            const { config } = variation;
            console.log('Sketch config:', variation.config);
            if (config.width && config.height) {
                window.removeEventListener('resize', windowResize);
                resizeCanvas(canvas, config.width, config.height);
            }
            if (config.background) {
                backgroundColor = config.background;
            }
            if (config.fps) {
                fps = config.fps;
            }
        }

        let rendering = true;
        const targetFpsInterval = 1000 / fps;
        let lastAnimationFrameTime;

        const startSketch = () => {
            window.removeEventListener('load', startSketch);
            variation.setup(canvas, context);

            // fillCanvas(canvas, context)(1,backgroundColor);

            const render = () => {
                const result = variation.draw(canvas, context, mouse);
                if (result !== -1) {
                    requestAnimationFrame(render);
                }
            };

            // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
            const renderAtFps = () => {
                if (rendering) {
                    requestAnimationFrame(renderAtFps);
                }

                const now = Date.now();
                const elapsed = now - lastAnimationFrameTime;

                if (elapsed > targetFpsInterval) {
                    lastAnimationFrameTime = now - (elapsed % targetFpsInterval);
                    const result = variation.draw(canvas, context, mouse);
                    if (result === -1) {
                        rendering = false;
                    }
                }
            };

            if (!fps) {
                requestAnimationFrame(render);
            } else {
                lastAnimationFrameTime = Date.now();
                requestAnimationFrame(renderAtFps);
            }
        };

        window.addEventListener('load', startSketch);
    };

    return {
        canvas: getCanvas,
        context: getContext,
        mouse: getMouse,
        run,
    };
};
