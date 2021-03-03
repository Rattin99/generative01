import sourcePng from '../../hi1.png';
import {
    clearCanvas,
    drawSquareFilled,
    background,
    getImageDataFromImage,
    getImageDataColor,
    connectParticles,
    drawParticlePoint,
} from '../lib/canvas';
import { createRandomParticleValues, edgeWrap, Particle, drag, updatePosWithVelocity } from '../lib/Particle';
import { createGridPointsXY, createRandomNumberArray, mapRange, randomNumberBetween } from '../lib/math';

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

    // let imageColorData;

    // const createColorArrayFromImageData = (imageData) => {
    //     const data = [];
    //     for (let y = 0, { height } = imageData; y < height; y++) {
    //         for (let x = 0, { width } = imageData; x < width; x++) {
    //             data.push({ x, y, ...getImageColor(imageData, x, y) });
    //         }
    //     }
    //     return data;
    // };

    const setup = ({ canvas, context }) => {
        imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();
        imageZoomFactor = canvas.width / imageData.width;

        // imageColorData = createColorArrayFromImageData(imageData);

        // const gridPoints = createGridPoints(
        //     canvas.width,
        //     canvas.height,
        //     100,
        //     100,
        //     canvas.width / 50,
        //     canvas.height / 50
        // );
        // numParticles = gridPoints.length;
        // for (let i = 0; i < numParticles; i++) {
        //     const props = createRandomParticleValues(canvas);
        //     props.x = gridPoints[i][0];
        //     props.y = gridPoints[i][1];
        //     props.radius = randomNumberBetween(1, 5);
        //     props.color = particleColor;
        //     particlesArray.push(new Particle(props));
        // }

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
            updatePosWithVelocity(particlesArray[i]);
            edgeWrap(canvas, particlesArray[i]);

            const pxColor = getImageDataColor(
                imageData,
                Math.round(particlesArray[i].x / imageZoomFactor),
                Math.round(particlesArray[i].y / imageZoomFactor)
            );

            if (pxColor.r > 250) {
                drag(particlesArray[i], 0.001);
                particlesArray[i].color = { r: 3, g: 227, b: 252 };
            } else {
                particlesArray[i].color = particleColor;
            }

            drawParticlePoint(context)(particlesArray[i]);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
