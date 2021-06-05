import { Particle, createRandomParticleValues } from '../systems/Particle';
import { background } from '../rndrgen/canvas/canvas';
import { clamp, mapRange } from '../rndrgen/math/math';
import { Vector } from '../rndrgen/math/Vector';
import { drawParticlePoint, drawPointTrail } from '../rndrgen/canvas/particles';
import { randomNumberBetween } from '../rndrgen/math/random';
import { circleFilled } from '../rndrgen/canvas/primatives';
import { pointDistance } from '../rndrgen/math/points';

// Based on Coding Train https://www.youtube.com/watch?v=Iaz9TqYWUmA
// But it didn't work like his, idk the error - just making it "pretty"

const c = 33;
const G = 6;

class Blackhole {
    constructor(x, y, m) {
        this.pos = new Vector(x, y);
        this.mass = m;
        this.rs = (2 * G * this.mass) / (c * c);
    }

    // Better algorithm https://youtu.be/Iaz9TqYWUmA
    pull(particle, mode) {
        const dir = this.pos.sub(new Vector(particle.x, particle.y));
        const r = dir.mag();
        // const distanceSq = clamp(50, 5000, dir.magSq());
        // const strength = (mode * (g * (mass * particle.mass))) / distanceSq;
        // const force = dir.setMag(strength);
        // particle.applyForce(force);
        const fg = (mode * ((G * this.mass) / 2)) / (r * r);
        const force = dir.setMag(fg);
        particle.velocity = particle.velocity.add(force).limit(c);
    }
}

export const blackhole = () => {
    const config = {
        width: 700,
        height: 700,
        fps: 60,
    };

    const numParticles = 100;
    const particlesArray = [];

    let hole;

    let canvasCenterX;
    let canvasCenterY;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        hole = new Blackhole(canvasCenterX, canvasCenterY, 3000);

        console.log(hole.rs);

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            if (i % 2) {
                props.y = canvas.height;
            } else {
                props.y = 0;
            }
            // props.x = 0;
            // props.velocityX = 0;
            // props.velocityY = 0;
            // props.mass = randomNumberBetween(1, 20);
            props.radius = Math.sqrt(props.mass) * 1;
            particlesArray.push(new Particle(props));
        }

        background(canvas, context)({ r: 10, g: 25, b: 80, a: 1 });
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)({ r: 10, g: 25, b: 80, a: 0.005 });

        let mode = 1;

        circleFilled(context)(hole.pos.x, hole.pos.y, hole.rs * 5, 'rgba(20,0,0,.05)');
        circleFilled(context)(hole.pos.x, hole.pos.y, hole.rs * 2, 'rgba(30,0,0,.2)');
        circleFilled(context)(hole.pos.x, hole.pos.y, hole.rs, 'black');

        for (let i = 0; i < numParticles; i++) {
            if (mouse.isDown) {
                mode = -0.1;
            } else {
                mode = 1;
            }
            hole.pull(particlesArray[i], mode);
            particlesArray[i].x += particlesArray[i].velocity.x;
            particlesArray[i].y += particlesArray[i].velocity.y;

            const distFromCenter = pointDistance(
                { x: canvasCenterX, y: canvasCenterY },
                { x: particlesArray[i].x, y: particlesArray[i].y }
            );
            const h = mapRange(0, canvasCenterX, 0, 60, distFromCenter);
            const s = 100;
            const l = 50;
            const a = mapRange(hole.rs, hole.rs * 1.5, 0.1, 1, distFromCenter); // 50;
            particlesArray[i].color = `hsla(${h},${s}%,${l}%,${a})`;

            // drawPointTrail(context)(particlesArray[i]);
            drawParticlePoint(context)(particlesArray[i]);
            particlesArray[i].acceleration = { x: 0, y: 0 };
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
