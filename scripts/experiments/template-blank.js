import { background } from '../rndrgen/canvas/canvas';
import { instagram, largePrint } from '../rndrgen/sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';

export const templateBlank = () => {
    const config = {
        name: 'blankTemplate',
        ...instagram,
    };

    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    const renderScale = config.scale; // 1 or 2

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    const setup = ({ canvas, context }) => {
        ctx = context;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        background(canvas, context)(backgroundColor);
        return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
