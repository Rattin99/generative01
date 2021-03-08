import tinycolor from 'tinycolor2';
import { Particle, updatePosWithVelocity, createRandomParticleValues } from '../lib/Particle';
import { background, connectParticles, drawParticlePoint, pixel, resetStyles } from '../lib/canvas';
import { createGridCellsXY, mapRange, oneOf } from '../lib/math';
import { ratio, scale } from '../lib/sketch';
import { palettes, warmGreyDark, warmWhite, warmPink } from '../lib/palettes';
import { Box } from '../lib/Box';

export const boxTest = () => {
    const config = {
        name: 'box-test',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 50;

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let grid;
    const boxes = [];
    const palette = palettes.pop;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        const boxbg = [warmWhite, warmGreyDark];
        const boxfg = [warmGreyDark, warmWhite];
        const boxrnd = ['whole', 'normal'];

        grid = createGridCellsXY(canvas.width, canvas.height, 2, 1, 100, 50);

        grid.points.forEach((p, i) => {
            boxes.push(
                new Box({
                    canvas,
                    context,
                    x: p[0],
                    y: p[1],
                    width: grid.columnWidth,
                    height: grid.rowHeight,
                    backgroundColor: boxbg[i],
                })
            );
        });

        boxes.forEach((b, bidx) => {
            const particles = [];
            for (let i = 0; i < numParticles; i++) {
                const props = createRandomParticleValues(canvas);
                const coords = b.translateInto(b.randomPointInside(boxrnd[bidx]));
                props.x = coords.x;
                props.y = coords.y;
                props.radius = 1;
                props.color = tinycolor(boxfg[bidx]).clone().setAlpha(0.1);

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
                updatePosWithVelocity(particle);
                box.particleEdgeBounce(particle);
                pixel(context)(particle.x, particle.y, particle.color);
            });
            // connectParticles(context)(box.children, 100, true);
            // box.fill(box.backgroundColor.setAlpha(0.1));
            box.removeClip();
        });
    };

    return {
        config,
        setup,
        draw,
    };
};
