import tinycolor from 'tinycolor2';
import random from 'canvas-sketch-util/random';
import { randomWholeBetween, uvFromAngle, oneOf, randomPointAround, randomBoolean } from '../lib/math';
import { Particle, updatePosWithVelocity, applyForce } from '../lib/Particle';
import { background, renderField } from '../lib/canvas';
import { ratio, scale } from '../lib/sketch';
import { palettes } from '../lib/palettes';
import { Vector } from '../lib/Vector';
import { simplexNoise2d, simplexNoise3d, cliffordAttractor, jongAttractor } from '../lib/attractors';

/*
Based on
https://tylerxhobbs.com/essays/2020/flow-fields
 */

const drawRibbonPoint = (context, point, i, thickness = 0, height = 0) => {
    const x = point[0];
    const y = point[1];
    const jitterX = 0; // Math.cos(i * 0.05) * height;
    const jitterY = 0; // Math.sin(i * 0.05) * height;
    context.lineTo(x + thickness + jitterX, y + thickness + jitterY);
};

const drawRibbonSegment = (context, sideA, sideB, color, stroke = false, thickness = 1) => {
    const segStartX = sideA[0][0];
    const segStartY = sideA[0][1];
    const segEndX = sideB[0][0] + thickness;
    const segEndY = sideB[0][1] + thickness;

    const rColor = tinycolor(color).clone();
    const gradient = context.createLinearGradient(0, segStartY - thickness, 0, segEndY + thickness);
    gradient.addColorStop(0, rColor.toRgbString());
    gradient.addColorStop(0.5, rColor.toRgbString());
    gradient.addColorStop(1, rColor.clone().darken(20).saturate(50).toRgbString());

    context.beginPath();
    context.moveTo(segStartX, segStartY);
    sideA.forEach((w, i) => {
        drawRibbonPoint(context, w, i, 0, thickness * 0.1);
    });
    sideB.forEach((w, i) => {
        drawRibbonPoint(context, w, i, thickness, thickness * 0.1);
    });
    context.lineTo(segStartX, segStartY);

    if (stroke) {
        context.strokeStyle = rColor.darken(70).toRgbString();
        context.lineWidth = 0.75;
        context.stroke();
    }

    context.fillStyle = gradient;
    context.fill();
};

const drawRibbon = (context) => (sideA, sideB, color, stroke = false, thickness = 1) => {
    const segmentGap = 1; // randomWholeBetween(1, 4);
    const segments = randomWholeBetween(1, 3);
    // const segmentsStep = Math.ceil((sideA.length - segmentGap * (segments - 1)) / segments);
    const segmentData = [];

    let left = sideA.length;
    let start = 0;

    for (let i = 0; i < segments; i++) {
        const len = randomWholeBetween(1, left / 2);
        // const start = i * segmentsStep + segmentGap * i;
        // const len = segmentsStep;
        segmentData.push({
            sideA: sideA.slice(start, start + len),
            sideB: sideB.slice(start, start + len).reverse(),
        });
        start += len + segmentGap;
        left -= len + segmentGap;
    }
    segmentData.forEach((s) => {
        drawRibbonSegment(context, s.sideA, s.sideB, color, stroke, thickness);
    });

    // drawRibbonSegment(context, segmentStart, segmentLen, sideA, sideB, color, stroke, thickness);
};

export const flowFieldRibbons2 = () => {
    const config = {
        name: 'flowFieldRibbons',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasMidX;
    let canvasMidY;
    const palette = palettes['80s_pop'];
    const backgroundColor = tinycolor('white');

    let time = 0;

    const createRibbon = (fieldFn, startX, startY, length, vlimit = 1) => {
        const props = {
            x: startX,
            y: startY,
            velocityX: 0,
            velocityY: 0,
            mass: 1,
        };
        const particle = new Particle(props);
        const coords = [];
        for (let i = 0; i < length; i++) {
            const theta = fieldFn(particle.x, particle.y);
            // theta = quantize(4, theta);
            const force = uvFromAngle(theta);
            applyForce(force, particle);
            particle.vVector = particle.vVector.limit(vlimit);
            updatePosWithVelocity(particle);
            coords.push([particle.x, particle.y]);
            particle.aVector = new Vector(0, 0);
        }
        return coords;
    };

    const simplex2d = (x, y) => simplexNoise2d(x, y, 0.0001);
    const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
    const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
    const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);
    const noise = randomBoolean() ? clifford : jong;

    let maxRadius;

    const setup = ({ canvas, context }) => {
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        maxRadius = canvas.width * 0.4;

        background(canvas, context)(backgroundColor);

        // renderField(
        //     canvas,
        //     context,
        //     noise,
        //     tinycolor(oneOf(palette)).lighten(30),
        //     canvas.width / 10,
        //     canvas.width / 20
        // );
    };

    const ribbonLen = randomWholeBetween(200, 500);
    const ribbonThickness = randomWholeBetween(100, 300);

    const maxItterations = randomWholeBetween(10, 30);
    let currentItteration = 0;

    const draw = ({ canvas, context }) => {
        const color = oneOf(palette);
        const len = ribbonLen;

        // const rpoint = random.onCircle(maxRadius); // randomPointAround(maxRadius * 0.4);
        const rpoint = [randomWholeBetween(0, canvas.width), randomWholeBetween(0, canvas.height)];

        const x = rpoint[0];
        const y = rpoint[1];
        const x2 = x + 2;
        const y2 = y;

        const sideA = createRibbon(noise, x, y, len, 1);
        const sideB = createRibbon(noise, x2, y2, len, 1);

        drawRibbon(context)(sideA, sideB, color, false, ribbonThickness);

        time += 0.01;

        if (++currentItteration > maxItterations) return -1;
    };

    return {
        config,
        setup,
        draw,
    };
};
