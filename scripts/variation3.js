import domokun from '../domokun.png';
import { clearCanvas, drawCircle, drawSquare, fillCanvas } from './lib/canvas';
import { randomNumberBetween, scalePointToCanvas } from './lib/math';
import { Particle, pointPush } from './lib/particle';

// Based on https://www.youtube.com/watch?v=afdHgwn1XCY
export const variation3 = (_) => {
    const config = {
        friction: 0.8,
        gravity: 1,
        decay: 0.05,
        tweenDamp: 0.1,
        margin: 50,
        intensity: 0,
        numParticles: 200,
    };

    const png = new Image();
    png.src = domokun;
    const particlesArray = [];

    const setup = (canvas, context) => {
        context.drawImage(png, 0, 0);
        const data = context.getImageData(0, 0, png.width, png.width);
        clearCanvas(canvas, context)();

        const imageZoomFactor = 7;

        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++) {
                // BUG drawing transparent px
                if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
                    const points = scalePointToCanvas(
                        canvas.width,
                        canvas.height,
                        data.width,
                        data.height,
                        imageZoomFactor,
                        x,
                        y
                    );
                    const pX = points.x;
                    const pY = points.y;
                    const mass = randomNumberBetween(2, 12);
                    const r = data.data[y * 4 * data.width + x * 4];
                    const g = data.data[y * 4 * data.width + x * 4 + 1];
                    const b = data.data[y * 4 * data.width + x * 4 + 2];
                    const color = { r, g, b };
                    const radius = imageZoomFactor;
                    particlesArray.push(new Particle({ x: pX, y: pY, mass, color, radius }));
                }
            }
        }

        config.numParticles = particlesArray.length;
    };

    const draw = (canvas, context, mouse) => {
        fillCanvas(canvas, context)(0.5);

        for (let i = 0; i < config.numParticles; i++) {
            pointPush(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
            drawSquare(context)(particlesArray[i]);
        }
        drawCircle(context)(mouse);

        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
