/*
Convenience canvas sketch runner. Based on p5js


const variation = () => {
    const config = {};

    const setup = ({canvas, context}) => {
        // create initial state
    };

    // will run every frame
    const draw = ({canvas, context, mouse}) => {
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
- [ ] merge screen shot code
- [ ] Canvas Recorder  https://xosh.org/canvas-recorder/
- [ ] coords of a mouse down to variation?
- [ ] better touch input
- [ ] svg https://github.com/canvg/canvg
- [ ] great ideas here http://paperjs.org/features/
*/

import { isHiDPICanvas, resizeCanvas } from './canvas/canvas';
import { defaultValue } from './utils';
import { getRandomSeed } from './math/random';

export const orientation = {
    portrait: 0,
    landscape: 1,
};

export const ratio = {
    letter: 0.773, // 8.5x11
    poster: 0.667, // 24x36
    golden: 0.6180339887498948482,
    square: -1,
    auto: 1,
};

export const scale = {
    standard: 1,
    hidpi: 2,
};

export const sketchSizeMode = {
    js: 0,
    css: 1,
    sketch: 2,
};

export const sketch = (canvasElId, smode = 0) => {
    const mouse = {
        x: undefined,
        y: undefined,
        isDown: false,
        radius: 100,
    };

    const sizeMode = smode;
    let hasStarted = false;
    let fps = 0;
    let drawRuns = 0;
    let currentVariationFn;
    let currentVariationRes;
    let animationId;

    const canvasSizeFraction = 0.9;
    const canvas = document.getElementById(canvasElId);
    const context = canvas.getContext('2d');

    const getCanvas = (_) => canvas;
    const getContext = (_) => context;
    const getMouse = (_) => mouse;

    const mouseDown = (evt) => {
        mouse.isDown = true;
    };

    const mouseMove = (evt) => {
        const mult = isHiDPICanvas() ? 2 : 1;
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

    const applyCanvasSize = (config, fraction) => {
        if (sizeMode === sketchSizeMode.css) {
            const s = canvas.getBoundingClientRect();
            resizeCanvas(canvas, context, s.width, s.height, 1);
            return;
        }

        const width = defaultValue(config, 'width', window.innerWidth);
        const height = defaultValue(config, 'height', window.innerHeight);
        let finalWidth = width;
        let finalHeight = height;

        const cfgOrientation = defaultValue(config, 'orientation', orientation.landscape);
        const cfgRatio = defaultValue(config, 'ratio', ratio.auto);
        const cfgScale = defaultValue(config, 'scale', scale.standard);

        if (cfgRatio === ratio.auto) {
            finalWidth = width;
            finalHeight = height;
        } else if (cfgRatio === ratio.square) {
            const smallestWindowSize = Math.min(width, height) * fraction;
            finalWidth = smallestWindowSize;
            finalHeight = smallestWindowSize;
        } else if (cfgOrientation === orientation.landscape) {
            let w = width;
            let h = Math.round(cfgRatio * width);
            const delta = h - height;
            if (delta > 0) {
                w -= delta;
                h -= delta;
            }
            finalWidth = w * fraction;
            finalHeight = h * fraction;
        } else if (cfgOrientation === orientation.portrait) {
            let w = Math.round(cfgRatio * height);
            let h = height;
            const delta = w - width;
            if (delta > 0) {
                w -= delta;
                h -= delta;
            }
            finalWidth = w * fraction;
            finalHeight = h * fraction;
        }

        resizeCanvas(canvas, context, finalWidth, finalHeight, cfgScale);
    };

    const run = (variation) => {
        currentVariationFn = variation;
        currentVariationRes = currentVariationFn();

        addEvents();

        let currentDrawLimit;
        let rendering = true;
        const targetFpsInterval = 1000 / fps;
        let lastAnimationFrameTime;

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (currentVariationRes.hasOwnProperty('config')) {
            const { config } = currentVariationRes;
            applyCanvasSize(config, canvasSizeFraction);
            if (config.fps) {
                fps = config.fps;
            }
            if (config.drawLimit > 0) {
                currentDrawLimit = config.drawLimit;
            }
        } else {
            // TODO check for sizeMode
            resizeCanvas(canvas, context, window.innerWidth, window.innerHeight);
        }

        const checkDrawLimit = () => {
            if (currentDrawLimit) {
                return drawRuns < currentDrawLimit;
            }
            return true;
        };

        const startSketch = () => {
            window.removeEventListener('load', startSketch);
            hasStarted = true;

            currentVariationRes.setup({ canvas, context });

            const drawFrame = () => {
                drawRuns++;
                return currentVariationRes.draw({ canvas, context, mouse });
            };

            const render = () => {
                const result = drawFrame();
                if (result !== -1 && checkDrawLimit()) {
                    animationId = requestAnimationFrame(render);
                }
            };

            const renderAtFps = () => {
                if (rendering) {
                    animationId = window.requestAnimationFrame(renderAtFps);
                }

                const now = Date.now();
                const elapsed = now - lastAnimationFrameTime;

                if (elapsed > targetFpsInterval) {
                    lastAnimationFrameTime = now - (elapsed % targetFpsInterval);
                    const result = drawFrame();
                    if (result === -1 || (currentDrawLimit && drawRuns >= currentDrawLimit)) {
                        rendering = false;
                    }
                }
            };

            if (!fps) {
                animationId = window.requestAnimationFrame(render);
            } else {
                lastAnimationFrameTime = Date.now();
                animationId = window.requestAnimationFrame(renderAtFps);
            }
        };

        if (!hasStarted) {
            window.addEventListener('load', startSketch);
        } else {
            startSketch();
        }
    };

    const addEvents = (_) => {
        window.addEventListener('mousedown', mouseDown);
        window.addEventListener('touchstart', mouseDown);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('touchend', mouseUp);
        window.addEventListener('mouseout', mouseOut);
        window.addEventListener('touchcancel', mouseOut);
        window.addEventListener('resize', windowResize);
    };

    const removeEvents = (_) => {
        window.removeEventListener('mousedown', mouseDown);
        window.removeEventListener('touchstart', mouseDown);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('touchend', mouseUp);
        window.removeEventListener('mouseout', mouseOut);
        window.removeEventListener('touchcancel', mouseOut);
        window.removeEventListener('resize', windowResize);
    };

    const stop = () => {
        removeEvents();
        window.cancelAnimationFrame(animationId);
    };

    const windowResize = (evt) => {
        // clear and rerun to avoid artifacts
        if (animationId) {
            stop();
            run(currentVariationFn);
        }
    };

    const getVariationName = () => {
        const seed = getRandomSeed();
        let name = 'untitled';
        if (
            currentVariationRes &&
            currentVariationRes.hasOwnProperty('config') &&
            currentVariationRes.config.hasOwnProperty('name')
        ) {
            name = currentVariationRes.config.name;
        }
        return `sketch-${name}-${seed}`;
    };

    const saveCanvasCapture = (evt) => {
        console.log('Saving capture', evt);
        const imageURI = canvas.toDataURL('image/png');
        evt.target.setAttribute('download', `${getVariationName()}.png`);
        evt.target.href = imageURI;
    };

    return {
        variationName: getVariationName,
        canvas: getCanvas,
        context: getContext,
        mouse: getMouse,
        run,
        stop,
        saveCanvasCapture,
    };
};
