import tinycolor from 'tinycolor2';
import { mapRange, randomWholeBetween, uvFromAngle, snapNumber, quantize, pointDistance } from '../lib/math';
import { edgeWrap, Particle, updatePosWithVelocity, createRandomParticleValues, applyForce } from '../lib/Particle';
import {
    background,
    drawCircleFilled,
    getImageDataFromImage,
    getImageDataColor,
    clearCanvas,
    drawLineAngle,
} from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { Vector } from '../lib/Vector';
import { diagLines, simplexNoise2d, simplexNoise3d } from '../lib/attractors';
import { hslFromRange } from '../lib/palettes';
import sourcePng from '../../francesca-zama-woman-400.png';

/*
https://marcteyssier.com/projects/flowfield/
https://larrycarlson.com/collections/wavy-art-prints
 */

const TAU = Math.PI * 2;

export const flowFieldImage = () => {
    const config = {
        name: 'flowFieldImage',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasMidX;
    let canvasMidY;

    const numParticles = 200;
    const particlesArray = [];
    const maxSize = 5;

    let time = 0;

    const backgroundColor = tinycolor('rgb(215,205,200)');

    let imageZoomFactor;
    const png = new Image();
    png.src = sourcePng;
    let imageData;

    const createRandomParticle = (canvas) => {
        const props = createRandomParticleValues(canvas);
        props.x = randomWholeBetween(0, canvas.width);
        props.y = randomWholeBetween(0, canvas.height);
        props.velocityX = 0;
        props.velocityY = 0;
        return new Particle(props);
    };

    const flowAtPoint = (x, y) => {
        const scale = 0.01;
        const fromCenter = pointDistance({ x, y }, { x: canvasMidX, y: canvasMidY });
        const simplex = simplexNoise2d(x, y, 0.01);

        // const theta = simplex;
        const theta = (fromCenter + simplex) / 2; // mostly radial around middle

        // const r1 = (Math.sin(1.2 * x) + 0.2 * Math.atan(2 * y)) * 8 * Math.PI;
        // const r2 = (Math.pow(x, 2) + 0.8 * Math.pow(y, 1 / 2)) * 8 * Math.PI * 4;
        // const theta = ((r1 + r2 + simplex) / 3) * 0.001;

        // const theta = ((Math.cos(x) + x + Math.sin(y)) * 24) % (Math.PI / 2); // wander dl like like

        // const theta = Math.atan2(y, x); // cones out from top left
        // const theta = x + y + Math.cos(x * scale) * Math.sin(x * scale); // bl to tr diag and cross perp lines
        // const theta = Math.cos(x * scale) * Math.sin(x * scale); // vertical lines
        // const theta = Math.cos(x) * Math.sin(x) * scale; // horizontal lines
        // const theta = x * Math.sin(y) * scale; // scribble
        // const theta = Math.sin(x * scale) + Math.sin(y * scale); // diamonds

        return theta * TAU;
    };

    const renderField = ({ width, height }, context, fn, cell) => {
        const mid = cell / 2;
        for (let x = 0; x < width; x += cell) {
            for (let y = 0; y < height; y += cell) {
                const theta = fn(x, y);
                drawLineAngle(context)(x + mid, y + mid, theta, mid);
            }
        }
    };

    const setup = ({ canvas, context }) => {
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();
        imageZoomFactor = canvas.width / imageData.width;

        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(createRandomParticle(canvas));
        }

        background(canvas, context)(backgroundColor);
        // renderField(canvas, context, flowAtPoint, 20);
    };

    const drawPixel = (canvas, context, particle, color, rad = 1) => {
        const pcolor = color || particle.color;
        const { x } = particle;
        const { y } = particle;
        // const x = snapNumber(maxSize * 0.5, particle.x);
        // const y = snapNumber(maxSize * 0.5, particle.y);
        drawCircleFilled(context)(x, y, rad, pcolor);
        return true;
    };

    const getImagePixelTheta = (imageData, x, y) => {
        const imagePixelColor = tinycolor(getImageDataColor(imageData, x, y)).getBrightness();
        return (imagePixelColor / 256) * TAU;
    };

    const drawParticle = ({ canvas, context }, particle) => {
        const noiseFlow = flowAtPoint(particle.x, particle.y);
        const imageFlow = getImagePixelTheta(
            imageData,
            Math.round(particle.x / imageZoomFactor),
            Math.round(particle.y / imageZoomFactor)
        );

        const theta = quantize(TAU, (noiseFlow + imageFlow) / 2);

        const force = uvFromAngle(theta);

        applyForce(force, particle);
        particle.vVector = particle.vVector.limit(5);
        updatePosWithVelocity(particle);

        const imagePixel = getImageDataColor(
            imageData,
            Math.round(particle.x / imageZoomFactor),
            Math.round(particle.y / imageZoomFactor)
        );
        const imagePixelColor = tinycolor(imagePixel);
        const imagePixelBrightness = 256 - imagePixelColor.getBrightness();
        const hslColor = hslFromRange(canvas.width, 90, 270, particle.x);

        let particleColor = tinycolor.mix(hslColor, imagePixelColor, 80).spin(time).setAlpha(1);

        let size = mapRange(0, 255, 1, maxSize, imagePixelBrightness);

        // if (Math.abs(imageFlow) < 0.8) {}

        if (Math.abs(imageFlow) >= 5.6) {
            size = 50;
            particleColor = particleColor.clone().brighten(20);
        }

        drawPixel(canvas, context, particle, particleColor, size);

        particle.aVector = new Vector(0, 0);
    };

    const drawParticlesArray = ({ canvas, context }) => {
        for (let i = 0; i < numParticles; i++) {
            drawParticle({ canvas, context }, particlesArray[i]);
        }
    };

    const drawFibers = ({ canvas, context }) => {
        const particle = createRandomParticle(canvas);
        const length = randomWholeBetween(50, 1000);
        for (let i = 0; i < length; i++) {
            drawParticle({ canvas, context }, particle);
        }
    };

    const draw = ({ canvas, context }) => {
        drawFibers({ canvas, context });
        // drawParticlesArray({ canvas, context });
        time += 0.1;
    };

    return {
        config,
        setup,
        draw,
    };
};
