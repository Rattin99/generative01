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

import { isHiDPI, contextScale, resizeCanvas } from './canvas/canvas';
import { golden } from './math/math';
import { defaultValue } from './utils';
import { getRandomSeed } from './math/random';

export const orientation = {
    portrait: 0,
    landscape: 1,
};

export const ratio = {
    letter: 0.773, // 8.5x11
    poster: 0.667, // 24x36
    golden: golden - 1,
    square: -1,
    auto: 1,
};

export const scale = {
    standard: 1,
    hidpi: 2,
};

export const sketch = () => {
    const mouse = {
        x: undefined,
        y: undefined,
        isDown: false,
        radius: 100,
    };

    let hasStarted = false;

    let fps = 0;

    let drawRuns = 0;

    let currentVariationFn;
    let currentVariationRes;
    let animationId;

    const canvasSizeFraction = 0.9;
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

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('touchstart', mouseDown);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchmove', mouseMove);

    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('touchend', mouseUp);

    window.addEventListener('mouseout', mouseOut);
    window.addEventListener('touchcancel', mouseOut);

    const applyCanvasSize = (config, fraction) => {
        const width = defaultValue(config, 'width', window.innerWidth);
        const height = defaultValue(config, 'height', window.innerHeight);
        let newWidth = width;
        let newHeight = height;

        const cfgOrientation = defaultValue(config, 'orientation', orientation.landscape);
        const cfgRatio = defaultValue(config, 'ratio', ratio.auto);
        const cfgScale = defaultValue(config, 'scale', scale.standard);

        const aSide = Math.min(width, height) * fraction;
        const bSide = Math.round(cfgRatio * aSide) * fraction;

        if (cfgRatio === ratio.square) {
            newWidth = aSide;
            newHeight = aSide;
        } else if (cfgOrientation === orientation.portrait) {
            newWidth = bSide;
            newHeight = aSide;
        } else if (cfgOrientation === orientation.landscape && cfgRatio !== ratio.auto) {
            newWidth = aSide;
            newHeight = bSide;
        }

        resizeCanvas(canvas, context, newWidth, newHeight, cfgScale);
    };

    const run = (variation) => {
        currentVariationFn = variation;
        currentVariationRes = currentVariationFn.call(this);

        let currentDrawLimit;

        let backgroundColor;

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (currentVariationRes.hasOwnProperty('config')) {
            const { config } = currentVariationRes;
            applyCanvasSize(config, canvasSizeFraction);
            if (config.background) {
                backgroundColor = config.background;
            }
            if (config.fps) {
                fps = config.fps;
            }
            if (config.drawLimit > 0) {
                currentDrawLimit = config.drawLimit;
            }
        } else {
            resizeCanvas(canvas, context, window.innerWidth, window.innerHeight);
        }

        let rendering = true;
        const targetFpsInterval = 1000 / fps;
        let lastAnimationFrameTime;

        // context.translate(0.5, 0.5);

        const checkDrawLimit = () => {
            if (currentDrawLimit) {
                return drawRuns < currentDrawLimit;
            }
            return true;
        };

        const startSketch = () => {
            window.removeEventListener('load', startSketch);
            hasStarted = true;

            currentVariationRes.setup({ canvas, context, s: this });

            const render = () => {
                const result = currentVariationRes.draw({ canvas, context, mouse });
                drawRuns++;
                if (result !== -1 && checkDrawLimit()) {
                    animationId = requestAnimationFrame(render);
                }
            };

            // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
            const renderAtFps = () => {
                if (rendering) {
                    animationId = window.requestAnimationFrame(renderAtFps);
                }

                const now = Date.now();
                const elapsed = now - lastAnimationFrameTime;

                if (elapsed > targetFpsInterval) {
                    lastAnimationFrameTime = now - (elapsed % targetFpsInterval);
                    const result = currentVariationRes.draw({ canvas, context, mouse });
                    drawRuns++;
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

    const stop = () => {
        window.cancelAnimationFrame(animationId);
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

    const windowResize = (evt) => {
        // resizeCanvas(canvas, context, window.innerWidth * canvasSizeFraction, window.innerHeight * canvasSizeFraction);
        if (animationId) {
            stop();
            run(currentVariationFn);
        }
    };
    window.addEventListener('resize', windowResize);

    return {
        variationName: getVariationName,
        canvas: getCanvas,
        context: getContext,
        mouse: getMouse,
        run,
        stop,
        s: sketch,
    };
};