import domokunPng from '../../domokun.png';
import {
    clearCanvas,
    drawMouse,
    drawSquareFilled,
    background,
    getImageDataFromImage,
    getImageDataColor,
} from '../lib/canvas';
import { randomNumberBetween, scalePointToCanvas } from '../lib/math';
import { Particle, pointPush } from '../lib/Particle';

// Based on https://www.youtube.com/watch?v=afdHgwn1XCY
export const domokun = (_) => {
    const config = {
        width: 600,
        height: 600,
    };

    let numParticles;
    const imageSize = 100; // square
    const png = new Image();
    png.src = domokunPng;
    const particlesArray = [];

    const setup = ({ canvas, context }) => {
        const imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();

        const imageZoomFactor = canvas.width / imageSize;
        const cropColor = 255 / 2;

        for (let y = 0, { height } = imageData; y < height; y++) {
            for (let x = 0, { width } = imageData; x < width; x++) {
                const pxColor = getImageDataColor(imageData, x, y);
                if (pxColor.a > cropColor) {
                    const points = scalePointToCanvas(
                        canvas.width,
                        canvas.height,
                        imageData.width,
                        imageData.height,
                        imageZoomFactor,
                        x,
                        y
                    );
                    const pX = points.x;
                    const pY = points.y;
                    const mass = randomNumberBetween(2, 12);
                    const color = pxColor;
                    const radius = imageZoomFactor;
                    particlesArray.push(new Particle({ x: pX, y: pY, mass, color, radius }));
                }
            }
        }

        numParticles = particlesArray.length;
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)('yellow');

        for (let i = 0; i < numParticles; i++) {
            pointPush(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
            drawSquareFilled(context)(
                particlesArray[i].x,
                particlesArray[i].y,
                particlesArray[i].radius,
                particlesArray[i].color
            );
        }
        // drawMouse(context)(mouse);
    };

    return {
        config,
        setup,
        draw,
    };
};
