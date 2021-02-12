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

import { fillCanvas } from './canvas';

export const sketch = () => {
    const mouse = {
        x: undefined,
        y: undefined,
        isDown: false,
        radius: 100,
    };

    const canvasSizeFraction = 0.75;
    const canvas = document.getElementById('canvas1');
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

    const windowResize = (evt) => {
        canvas.width = window.innerWidth * canvasSizeFraction;
        canvas.height = window.innerHeight * canvasSizeFraction;
    };

    const run = (variation) => {
        const startSketch = () => {
            window.removeEventListener('load', startSketch);
            variation.setup(canvas, context);
            // fillCanvas(canvas, context)();
            const render = () => {
                const result = variation.draw(canvas, context, mouse);
                if (result !== -1) {
                    requestAnimationFrame(render);
                }
            };
            requestAnimationFrame(render);
        };

        window.addEventListener('load', startSketch);
    };

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('touchstart', mouseDown);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchmove', mouseMove);

    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('touchend', mouseUp);

    window.addEventListener('mouseout', mouseOut);
    window.addEventListener('touchcancel', mouseOut);

    window.addEventListener('resize', windowResize);

    return {
        canvas: getCanvas,
        context: getContext,
        mouse: getMouse,
        run,
    };
};
