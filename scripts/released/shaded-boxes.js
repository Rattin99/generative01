import tinycolor from 'tinycolor2';
import { Particle, createRandomParticleValues } from '../rndrgen/systems/Particle';
import { background, resetContext } from '../rndrgen/canvas/canvas';
import { mapRange, uvFromAngle } from '../rndrgen/math/math';
import { ratio, scale } from '../rndrgen/sketch';
import { palettes, warmGreyDark, warmWhite, warmPink, paperWhite, bicPenBlue } from '../rndrgen/color/palettes';
import { Box } from '../rndrgen/systems/Box';
import { simplexNoise3d } from '../rndrgen/math/attractors';
import { Vector } from '../rndrgen/math/Vector';
import { textureRectZigZag, textureRectStipple, textureRect } from '../rndrgen/canvas/textures';
import { connectParticles, particlePoint } from '../rndrgen/canvas/particles';
import { getGridCells } from '../rndrgen/math/grids';
import { oneOf } from '../rndrgen/math/random';
import { pixel } from '../rndrgen/canvas/primatives';

export const shadedBoxes = () => {
    const config = {
        name: 'shadedBoxes',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 30;

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

        background(canvas, context)(paperWhite);

        const boxwhite = paperWhite.clone().darken(10).saturate(10);
        const boxbg = [boxwhite, bicPenBlue];
        const boxfg = [bicPenBlue, boxwhite];

        const gridMargin = Math.round(canvas.width / 10);
        const gridGutter = Math.round(gridMargin / 4);

        grid = getGridCells(canvas.width, canvas.height, 1, 10, gridMargin, gridGutter);

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
            b.backgroundColor = bicPenBlue.clone(); // boxbg[clr];
            b.flowField = (x, y, t) => simplexNoise3d(x, y, t, freq);
            freq += 0.0005;
            for (let i = 0; i < numParticles; i++) {
                const props = createRandomParticleValues(canvas);
                const coords = b.translateInto(b.randomPointInside('normal'));
                props.x = coords.x;
                props.y = coords.y;
                props.velocityX = 0;
                props.velocityY = 0;
                props.radius = 1;
                props.color = bidx <= 4 ? bicPenBlue.clone() : paperWhite.clone(); // tinycolor(boxfg[clr]).clone().setAlpha(0.5);
                particles.push(new Particle(props));
            }
            b.children = particles;

            textureRectStipple(context)(b.x, b.y, b.width, b.height, b.backgroundColor, bidx + 1);
        });

        // boxes.forEach((b) => {
        //     b.fill();
        // });

        return -1;
    };

    const draw = ({ canvas, context }) => {
        boxes.forEach((box) => {
            box.createClip();
            box.children.forEach((particle) => {
                const theta = box.flowField(particle.x, particle.y, time);
                const force = uvFromAngle(theta);
                particle.applyForce(force);
                particle.velocity = particle.velocity.limit(1);
                particle.updatePosWithVelocity();
                particle.acceleration = new Vector(0, 0);
                box.particleEdgeWrap(particle);
                pixel(context)(particle.x, particle.y, particle.color, 'circle', 0.5);
            });
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
