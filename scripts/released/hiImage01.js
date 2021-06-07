import sourcePng from '../../media/images/hi1.png';
import { clear, background } from '../rndrgen/canvas/canvas';
import { createRandomParticleValues, edgeWrap, Particle } from '../rndrgen/systems/Particle';
import { particlePoint } from '../rndrgen/canvas/particles';
import { randomNumberBetween } from '../rndrgen/math/random';

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

export const hiImage01 = (_) => {
    const config = {
        width: 600,
        height: 600,
    };

    let imageZoomFactor;
    const png = new Image();
    png.src = sourcePng;
    let imageData;

    const numParticles = 500;
    const particlesArray = [];
    const particleColor = { r: 252, g: 3, b: 152 };

    const setup = ({ canvas, context }) => {
        imageData = getImageDataFromImage(context)(png);
        clear(canvas, context)();
        imageZoomFactor = canvas.width / imageData.width;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.radius = randomNumberBetween(1, 5);
            props.color = particleColor;
            if (i % 2) {
                props.x = 0;
            } else {
                props.x = canvas.width;
            }
            particlesArray.push(new Particle(props));
        }

        background(canvas, context)({ r: 255, g: 255, b: 0 });
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)({ r: 255, g: 255, b: 0, a: 0.004 });

        for (let i = 0; i < numParticles; i++) {
            particlesArray[i].updatePosWithVelocity();
            edgeWrap(canvas, particlesArray[i]);

            const pxColor = getImageDataColor(
                imageData,
                Math.round(particlesArray[i].x / imageZoomFactor),
                Math.round(particlesArray[i].y / imageZoomFactor)
            );

            if (pxColor.r > 250) {
                particlesArray[i].drag(0.001);
                particlesArray[i].color = { r: 3, g: 227, b: 252 };
            } else {
                particlesArray[i].color = particleColor;
            }

            particlePoint(context)(particlesArray[i]);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
