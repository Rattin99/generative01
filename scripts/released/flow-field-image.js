import tinycolor from 'tinycolor2';
import { mapRange, uvFromAngle, snapNumber, quantize } from '../rndrgen/math/math';
import { Particle, createRandomParticleValues } from '../rndrgen/systems/Particle';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { Vector } from '../rndrgen/math/Vector';
import { hslFromRange, warmWhite } from '../rndrgen/color/palettes';
import { Bitmap } from '../rndrgen/canvas/Bitmap';
import sourcePng from '../../media/images/kristijan-arsov-woman-400.png';
import { renderField } from '../rndrgen/canvas/fields';
import { randomNumberBetween, randomWholeBetween } from '../rndrgen/math/random';
import { circleFilled } from '../rndrgen/canvas/primatives';
import { pointDistance } from '../rndrgen/math/points';

/*
https://marcteyssier.com/projects/flowfield/
https://larrycarlson.com/collections/wavy-art-prints
 */

const TAU = Math.PI * 2;

const splatter = (context) => (x, y, color, size, amount = 3, range = 20) => {
    for (let i = 0; i < amount; i++) {
        const s = randomWholeBetween(size * 0.25, size * 3);
        // circle dist
        const radius = randomWholeBetween(0, range);
        const angle = randomNumberBetween(0, TAU);
        const xoff = radius * Math.cos(angle);
        const yoff = radius * Math.sin(angle);
        // square dist
        // const xoff = randomWholeBetween(-range, range);
        // const yoff = randomWholeBetween(-range, range);
        circleFilled(context)(x + xoff, y + yoff, s, color);
    }
};

const createRandomParticle = (canvas) => {
    const props = createRandomParticleValues(canvas);
    props.x = randomWholeBetween(0, canvas.width);
    props.y = randomWholeBetween(0, canvas.height);
    props.velocityX = 0;
    props.velocityY = 0;
    return new Particle(props);
};

export const flowFieldImage = () => {
    const config = {
        name: 'flowFieldImage',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const maxSize = 5;
    let time = 0;
    const backgroundColor = warmWhite;
    const image = new Bitmap(sourcePng);

    const imageFlow = (x, y) => image.pixelThetaFromCanvas(x, y) * TAU;

    const setup = ({ canvas, context }) => {
        image.init(canvas, context);
        background(canvas, context)(backgroundColor);
        renderField(canvas, context, imageFlow, 'rgba(0,0,0,.15)', 50, 10);
    };

    const drawPixel = (canvas, context, particle, color, rad = 1) => {
        const pcolor = color || particle.color;
        const { x } = particle;
        const { y } = particle;
        circleFilled(context)(x, y, rad, pcolor);
        return true;
    };

    const drawParticle = ({ canvas, context }, particle) => {
        const theta = imageFlow(particle.x, particle.y);
        const force = uvFromAngle(theta);
        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(3);
        particle.updatePosWithVelocity();

        const fromCenter = pointDistance(particle, { x: canvas.width / 2, y: canvas.height / 2 });

        const imagePixelColor = image.pixelColorFromCanvas(particle.x, particle.y);
        const imagePixelBrightness = 256 - imagePixelColor.getBrightness();
        const hslColor = hslFromRange(canvas.width, 90, 270, particle.x).spin(time);
        const particleColor = tinycolor.mix(hslColor, imagePixelColor, 90);
        particleColor.desaturate(mapRange(canvas.width / 3, canvas.width / 2, 0, 10, fromCenter));

        const size = mapRange(0, 255, 0, maxSize, imagePixelBrightness);
        const sizeMult = mapRange(canvas.width / 3, canvas.width / 2, 1, 5, fromCenter);

        drawPixel(canvas, context, particle, particleColor, size * sizeMult);

        if (Math.abs(theta) >= 5.7) {
            splatter(context)(particle.x, particle.y, particleColor.brighten(10), 1, 3, 100);
        }

        particle.acceleration = new Vector(0, 0);
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
        time += 0.05;
    };

    return {
        config,
        setup,
        draw,
    };
};
