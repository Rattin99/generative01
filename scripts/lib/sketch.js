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

TODO
- [ ] options for layout: portrait, landscape
- [ ] canvas ratio: auto, square, golden, letter
- [ ] merge screen shot code
- [ ] Canvas Recorder  https://xosh.org/canvas-recorder/
- [ ] pass obj to variation setup and draw functions
- [ ] coords of a mouse down to variation?
- [ ] better touch input
- [ ] svg https://github.com/canvg/canvg
*/

import { isHiDPI, resizeCanvas } from './canvas';
import { getRandomSeed, golden } from './math';

export const orientation = {
    portrait: 0,
    landscape: 1,
};

export const ratio = {
    letter: 0.773,
    golden: golden - 1,
    square: -1,
    auto: 1,
};

const defaultValue = (obj, key, value) => (obj.hasOwnProperty(key) ? obj[key] : value);

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

    const getCanvas = (_) => canvas;
    const getContext = (_) => context;
    const getMouse = (_) => mouse;

    const mouseDown = (evt) => {
        mouse.isDown = true;
    };

    const mouseMove = (evt) => {
        const mult = isHiDPI ? 2 : 1;
        const canvasFrame = canvas.getBoundingClientRect();
        mouse.x = (evt.x - canvasFrame.x) * mult;
        mouse.y = (evt.y - canvasFrame.y) * mult;
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
        resizeCanvas(canvas, context, window.innerWidth * canvasSizeFraction, window.innerHeight * canvasSizeFraction);

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('touchstart', mouseDown);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchmove', mouseMove);

    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('touchend', mouseUp);

    window.addEventListener('mouseout', mouseOut);
    window.addEventListener('touchcancel', mouseOut);

    // window.addEventListener('resize', windowResize);

    const applyCanvasSize = (config) => {
        const width = defaultValue(config, 'width', window.innerWidth * canvasSizeFraction);
        const height = defaultValue(config, 'height', window.innerHeight * canvasSizeFraction);
        let newWidth = width;
        let newHeight = height;

        const cfgOrientation = defaultValue(config, 'orientation', orientation.landscape);
        const cfgRatio = defaultValue(config, 'ratio', ratio.auto);

        const aSide = Math.min(width, height);
        const bSide = Math.round(cfgRatio * aSide);

        if (cfgRatio === ratio.square) {
            newWidth = aSide;
            newHeight = aSide;
        } else if (cfgOrientation === orientation.portrait) {
            newWidth = bSide;
            newHeight = aSide;
        } else if (cfgOrientation === orientation.landscape && cfgRatio !== ratio.auto) {
            console.log('land');
            newWidth = aSide;
            newHeight = bSide;
        }

        resizeCanvas(canvas, context, newWidth, newHeight);
    };

    const run = (variation) => {
        currentVariation = variation;

        let backgroundColor = '0,0,0';

        if (variation.hasOwnProperty('config')) {
            const { config } = variation;
            console.log('Sketch config:', variation.config);
            applyCanvasSize(config);
            if (config.background) {
                backgroundColor = config.background;
            }
            if (config.fps) {
                fps = config.fps;
            }
        } else {
            resizeCanvas(
                canvas,
                context,
                window.innerWidth * canvasSizeFraction,
                window.innerHeight * canvasSizeFraction
            );
        }

        let rendering = true;
        const targetFpsInterval = 1000 / fps;
        let lastAnimationFrameTime;

        context.translate(0.5, 0.5);

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

    const getVariationName = () => {
        const seed = getRandomSeed();
        let name = 'untitled';
        if (
            currentVariation &&
            currentVariation.hasOwnProperty('config') &&
            currentVariation.config.hasOwnProperty('name')
        ) {
            name = currentVariation.config.name;
        }
        return `sketch-${name}-${seed}`;
    };

    return {
        variationName: getVariationName,
        canvas: getCanvas,
        context: getContext,
        mouse: getMouse,
        run,
    };
};
