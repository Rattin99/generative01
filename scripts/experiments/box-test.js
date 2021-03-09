import tinycolor from 'tinycolor2';
import { Particle, updatePosWithVelocity, createRandomParticleValues, applyForce } from '../lib/Particle';
import { background, connectParticles, drawParticlePoint, pixel, resetStyles } from '../lib/canvas';
import { createGridCellsXY, mapRange, oneOf, uvFromAngle } from '../lib/math';
import { ratio, scale } from '../lib/sketch';
import { palettes, warmGreyDark, warmWhite, warmPink, paperWhite, bicPenBlue } from '../lib/palettes';
import { Box } from '../lib/Box';
import { simplexNoise3d } from '../lib/attractors';
import { Vector } from '../lib/Vector';

export const boxTest = () => {
    const config = {
        name: 'box-test',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 10;

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let grid;
    const boxes = [];
    const palette = palettes.pop;
    let time = 0;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        // const boxbg = [warmWhite, warmGreyDark];
        // const boxbg = [warmWhite, warmGreyDark];
        const boxbg = [paperWhite, bicPenBlue];
        const boxfg = [bicPenBlue, paperWhite];
        const boxrnd = ['normal', 'normal'];

        grid = createGridCellsXY(canvas.width, canvas.height, 3, 3, 80, 20);

        grid.points.forEach((p, i) => {
            boxes.push(
                new Box({
                    canvas,
                    context,
                    x: p[0],
                    y: p[1],
                    width: grid.columnWidth,
                    height: grid.rowHeight,
                })
            );
        });

        let freq = 0.0001;

        boxes.forEach((b, bidx) => {
            const particles = [];
            const clr = bidx % 2 === 0 ? 0 : 1;
            b.backgroundColor = boxbg[clr];
            b.flowField = (x, y, t) => simplexNoise3d(x, y, t, freq);
            freq += 0.0005;
            for (let i = 0; i < numParticles; i++) {
                const props = createRandomParticleValues(canvas);
                const coords = b.translateInto(b.randomPointInside(boxrnd[clr]));
                props.x = coords.x;
                props.y = coords.y;
                props.velocityX = 0;
                props.velocityY = 0;
                props.radius = 1;
                props.color = tinycolor(boxfg[clr]).clone().setAlpha(0.5);
                particles.push(new Particle(props));
            }
            b.children = particles;
        });

        background(canvas, context)(warmWhite);
        boxes.forEach((b) => {
            b.fill();
        });
        return -1;
    };

    const draw = ({ canvas, context }) => {
        boxes.forEach((box) => {
            box.createClip();
            box.children.forEach((particle) => {
                // updatePosWithVelocity(particle);
                const theta = box.flowField(particle.x, particle.y, time);
                const force = uvFromAngle(theta);
                applyForce(force, particle);
                particle.vVector = particle.vVector.limit(1);
                updatePosWithVelocity(particle);
                particle.aVector = new Vector(0, 0);
                // box.particleEdgeBounce(particle);
                box.particleEdgeWrap(particle);
                pixel(context)(particle.x, particle.y, particle.color, 'circle', 0.75);
            });
            // connectParticles(context)(box.children, 30, true);
            // box.fill(box.backgroundColor.setAlpha(0.1));
            box.removeClip();
        });
        time += 0.1;
    };

    return {
        config,
        setup,
        draw,
    };
};
