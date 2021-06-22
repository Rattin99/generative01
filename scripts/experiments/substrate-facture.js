import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale, orientation } from '../rndrgen/Sketch';
import { bicPenBlue, paperWhite } from '../rndrgen/color/palettes';
import { randomNormalNumberBetween, randomNumberBetween, randomWholeBetween } from '../rndrgen/math/random';
import { Vector } from '../rndrgen/math/Vector';
import { pixel, line, pointPathPO } from '../rndrgen/canvas/primatives';
import { simplexNoise3d } from '../rndrgen/math/attractors';
import { mapRange, TAU, uvFromAngle } from '../rndrgen/math/math';

/*
Jared Tarbell
http://www.complexification.net/gallery/machines/substrate/index.php

Robert Hodgin Meader
http://roberthodgin.com/project/meander
The system begins with some randomly placed points. Each point is given a directional growth vector. The point moves
along this growth vector and draws a line as it goes. If the point encounters another line, it stops. As the point moves,
 the directional vector rotates slowly. I found that if I mix curving vectors with non-curving vectors, the result ended
  up resembling intersecting roads. I emphasized this result by making the thickness of the lines be directly
  proportional its length.
 */

class SPoint {
    constructor(start, vector) {
        this.reset(start, vector);
    }

    get x() {
        return Math.round(this.current.x);
    }

    get y() {
        return Math.round(this.current.y);
    }

    reset(start, vector) {
        this.start = start;
        this.vector = vector;
        this.last = start;
        this.current = start;
        this.history = [start];
        this.forceDamping = randomWholeBetween(1, 10) * 0.01;
    }

    move(noise) {
        if (noise) {
            this.vector = this.vector.add(noise.mult(this.forceDamping)); // .limit(10);
        }

        this.last = this.current.clone();
        this.current = this.current.add(this.vector);
        this.history.push(this.current.clone());
    }
}

const areColorsEqual = (c1, c2) => c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;

const getPixelColor = (context, x, y) => {
    const { data } = context.getImageData(x, y, 1, 1);
    return tinycolor(`rgb(${data[0]}, ${data[1]}, ${data[2]}})`); // alpha ${data[3] / 255})
};

const noiseFn = (x, y, time = 0) => simplexNoise3d(x, y, time, 0.01);

export const substrateFacture = () => {
    const config = {
        name: 'substrate-facture',
        ratio: ratio.letter,
        scale: scale.standard,
        orientation: orientation.portrait,
    };

    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    let time = 0;

    const backgroundColor = paperWhite.clone();
    const foreColor = bicPenBlue.clone();

    const maxPoints = 10;
    const points = [];
    const minLength = 5;

    const getVector = (_) => (randomWholeBetween(0, 2) === 0 ? -1 : 1);
    const getStartingPoint = (_) => new Vector(randomWholeBetween(startX, maxX), randomWholeBetween(startY, maxY));
    // const getMovementVector = (_) => new Vector(getVector(), getVector());
    // const getMovementVector = (_) => uvFromAngle(randomWholeBetween(0, 360));
    const getMovementVector = (_) => uvFromAngle(randomNumberBetween(0, TAU));

    const isOutOfBounds = (p) => p.x > maxX || p.x < startX || p.y > maxY || p.y < startY;

    const isIntersect = (context, p) =>
        !areColorsEqual(getPixelColor(context, p.x, p.y).toRgb(), backgroundColor.toRgb());

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        startX = margin;
        maxX = canvas.width - margin;
        startY = margin;
        maxY = canvas.height - margin;

        for (let i = 0; i < maxPoints; i++) {
            const p = new SPoint(getStartingPoint(), getMovementVector());
            points.push(p);
        }

        background(canvas, context)(backgroundColor);
    };

    const draw = ({ canvas, context }) => {
        points.forEach((p) => {
            const force = uvFromAngle(noiseFn(p.x, p.y, time));
            p.move();
            if (isOutOfBounds(p) || isIntersect(context, p)) {
                if (p.history.length > minLength) {
                    const width = mapRange(minLength, 500, 0.5, 3, p.history.length);
                    pointPathPO(context)(p.history, 'black', width);
                }
                p.reset(getStartingPoint(), getMovementVector());
            } else {
                context.lineWidth = 0.25;
                context.strokeStyle = tinycolor(foreColor);
                if (p.history.length > minLength) line(context)(p.last.x, p.last.y, p.current.x, p.current.y);
            }
        });

        time += 0.1;

        return 1;
    };

    return {
        config,
        setup,
        draw,
    };
};
