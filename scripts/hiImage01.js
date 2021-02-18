import sourcePng from '../hi1.png';
import {
    clearCanvas,
    drawMouse,
    drawSquare,
    background,
    getImageDataFromImage,
    getImageColor,
    connectParticles,
} from './lib/canvas';
import { lerpRange, randomNumberBetween, scalePointToCanvas } from './lib/math';
import {
    createRandomParticleValues,
    edgeBounce,
    edgeWrap,
    Particle,
    pointPush,
    updatePosWithVelocity,
} from './lib/particle';

export const hiImage01 = (_) => {
    const config = {
        width: 600,
        height: 600,
    };

    const numParticles = 2000;
    const imageSize = 100; // square
    let imageZoomFactor;
    const png = new Image();
    png.src = sourcePng;
    const particlesArray = [];
    let imageData;
    let imageColorData;
    const cropColor = 255 / 2;

    const createColorArrayFromImageData = (imageData) => {
        const data = [];
        for (let y = 0, { height } = imageData; y < height; y++) {
            for (let x = 0, { width } = imageData; x < width; x++) {
                data.push({ x, y, ...getImageColor(imageData, x, y) });
            }
        }
        return data;
    };

    const setup = (canvas, context) => {
        imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();

        imageZoomFactor = canvas.width / imageSize;

        // imageColorData = createColorArrayFromImageData(imageData);

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.radius = 5;
            props.color = 'black';
            if (i % 2) {
                props.x = 0;
            } else {
                props.x = canvas.width;
            }
            // const pxColor = getImageColor(
            //     imageData,
            //     Math.round(props.x / imageZoomFactor),
            //     Math.round(props.y / imageZoomFactor)
            // );
            // props.color = `rgba(${pxColor.r},${pxColor.g},${pxColor.b}, ${pxColor.a})`;
            particlesArray.push(new Particle(props));
        }

        background(canvas, context)({ r: 255, g: 255, b: 0 });
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 255, g: 255, b: 0, a: 0.01 });

        for (let i = 0; i < numParticles; i++) {
            updatePosWithVelocity(particlesArray[i]);
            // edgeBounce(canvas, particlesArray[i]);
            edgeWrap(canvas, particlesArray[i]);

            const pxColor = getImageColor(
                imageData,
                Math.round(particlesArray[i].x / imageZoomFactor),
                Math.round(particlesArray[i].y / imageZoomFactor)
            );

            if (pxColor.r > 250) {
                particlesArray[i].velocityX *= -1;
                particlesArray[i].velocityY *= -1;
            }

            // particlesArray[i].color = `rgb(${pxColor.r},${pxColor.g},${pxColor.b})`;
            // particlesArray[i].color = `rgba(${pxColor.r},${pxColor.g},${pxColor.b}, ${pxColor.a})`;

            drawSquare(context)(particlesArray[i]);
        }
        // connectParticles(context)(particlesArray, 100, true);
    };

    return {
        config,
        setup,
        draw,
    };
};
