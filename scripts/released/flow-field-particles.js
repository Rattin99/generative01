import tinycolor from 'tinycolor2';
import { mapRange, uvFromAngle, snapNumber, quantize } from '../rndrgen/math/math';
import { edgeWrap, Particle, createRandomParticleValues } from '../systems/Particle';
import { background, drawCircleFilled } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/Sketch';
import { Vector } from '../rndrgen/math/Vector';
import { simplexNoise3d } from '../rndrgen/math/attractors';
import { hslFromRange } from '../rndrgen/color/palettes';
import { randomWholeBetween } from '../rndrgen/math/random';

export const flowFieldParticles = () => {
    const config = {
        name: 'flowFieldParticles',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 400;
    const particlesArray = [];
    const maxSize = 3;

    let time = 0;

    const createRandomParticle = (canvas) => {
        const props = createRandomParticleValues(canvas);
        props.x = randomWholeBetween(0, canvas.width);
        props.y = randomWholeBetween(0, canvas.height);
        props.velocityX = 0;
        props.velocityY = 0;
        return new Particle(props);
    };

    const setup = ({ canvas, context }) => {
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(createRandomParticle(canvas));
        }

        background(canvas, context)('rgba(50,50,50,1)');
    };

    const drawPixel = (canvas, context, force, particle, color, rad = 1) => {
        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(1);
        particle.updatePosWithVelocity();
        edgeWrap(canvas, particle);
        const pcolor = color || particle.color;
        const x = snapNumber(maxSize * 2, particle.x);
        const y = snapNumber(maxSize * 2, particle.y);
        drawCircleFilled(context)(x, y, rad, pcolor);
        return true;
    };

    const drawParticles = ({ canvas, context }) => {
        for (let i = 0; i < numParticles; i++) {
            const particle = particlesArray[i];
            const sNoise3d = simplexNoise3d(particle.x, particle.y, time, 0.002);
            const theta = quantize(3, sNoise3d);
            const force = uvFromAngle(theta);
            const clr = hslFromRange(5, 270, 360, Math.abs(theta)).setAlpha(0.25);
            const size = mapRange(0, 5, 1, maxSize, Math.abs(theta));

            drawPixel(canvas, context, force, particle, clr, size);

            particle.acceleration = new Vector(0, 0);
        }
    };

    const drawFibers = ({ canvas, context }) => {
        const particle = createRandomParticle(canvas);
        const length = 200;
        for (let i = 0; i < length; i++) {
            const sNoise3d = simplexNoise3d(particle.x, particle.y, time, 0.002);
            const theta = sNoise3d;
            const force = uvFromAngle(theta);
            const clr = 'rgba(0,0,0,.05)';

            drawPixel(canvas, context, force, particle, clr, 1);

            particle.acceleration = new Vector(0, 0);
        }
    };

    const draw = ({ canvas, context }) => {
        drawFibers({ canvas, context });
        drawParticles({ canvas, context });
        time += 0.01;
    };

    return {
        config,
        setup,
        draw,
    };
};
