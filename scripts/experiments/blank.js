import { background } from '../lib/canvas';
import { orientation, ratio } from '../lib/sketch';

export const blank = () => {
    const config = {
        // width: 700,
        // height: 500,
        // fps: 60,
        // orientation: orientation.portrait,
        // ratio: ratio.square,
    };

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        background(canvas, context)('blue');
    };

    const draw = (canvas, context, mouse) => -1;

    return {
        config,
        setup,
        draw,
    };
};
