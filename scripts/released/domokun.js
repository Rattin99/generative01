import domokunPng from '../../media/images/domokun.png';
import { clearCanvas, drawSquareFilled, background } from '../lib/canvas/canvas';
import { normalizeInverse, pointDistance, randomNumberBetween, scalePointToCanvas } from '../lib/math/math';
import { Particle } from '../lib/systems/Particle';
import { drawMouse } from '../lib/canvas/canvas-particles';

const pointPush = (point, particle, f = 1) => {
    const dx = point.x - particle.x;
    const dy = point.y - particle.y;
    const distance = pointDistance(point, particle);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const force = normalizeInverse(0, point.radius, distance) * f;
    particle.velocityX = forceDirectionX * force * particle.mass * 0.8;
    particle.velocityY = forceDirectionY * force * particle.mass * 0.8;

    if (distance < point.radius) {
        particle.x -= particle.velocityX;
        particle.y -= particle.velocityY;
    } else {
        // TODO if < 1 then snap to 0
        if (particle.x !== particle.oX) {
            particle.x -= (particle.x - particle.oX) * 0.1;
        }
        if (particle.y !== particle.oY) {
            particle.y -= (particle.y - particle.oY) * 0.1;
        }
    }
};

const getImageDataFromImage = (context) => (image) => {
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.width);
};

const getImageDataColor = (imageData, x, y) => ({
    r: imageData.data[y * 4 * imageData.width + x * 4],
    g: imageData.data[y * 4 * imageData.width + x * 4 + 1],
    b: imageData.data[y * 4 * imageData.width + x * 4 + 2],
    a: imageData.data[y * 4 * imageData.width + x * 4 + 3],
});

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
