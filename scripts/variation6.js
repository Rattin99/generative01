import {avoidPoint, Particle, createRandomParticleValues, updatePosWithVelocity, edgeBounce, gravityPoint} from './lib/particle';
import { fillCanvas, connectParticles, drawCircle, drawPoint } from './lib/canvas';
import { lerpRange } from './lib/math';

// Based on https://www.youtube.com/watch?v=j_BgnpMPxzM
export const variation6 = () => {

    const numParticles = 200;
    const particlesArray = [];
    let hue=0;

    const setup = (canvas, context) => {
        for (let i = 0; i < numParticles; i++) {
            const initValues = createRandomParticleValues(canvas);
            initValues.color = {r:255,g:255,b:255};
            particlesArray.push(new Particle(initValues));
        }
    };

    const draw = (canvas, context, mouse) => {
        fillCanvas(canvas, context)(.1);
        hue++;
        for (let i = 0; i < numParticles; i++) {
            particlesArray[i].radius -= 0.05;
            if (particlesArray[i].radius <= 0) {
                const initValues = createRandomParticleValues(canvas);
                initValues.x = mouse.x ? mouse.x : canvas.width/2;
                initValues.y = mouse.y ? mouse.y : canvas.height/2;
                let h = lerpRange(0,canvas.width,100,200,initValues.x);
                let s = lerpRange(0,10,0,100,initValues.radius);
                let l = lerpRange(0,10,25,75,initValues.radius);
                initValues.colorFn = () => `hsl(${hue},${s}%,${l}%)`;
                particlesArray[i].initValues(initValues);
            }
            updatePosWithVelocity(particlesArray[i]);
            edgeBounce(canvas, particlesArray[i]);

            gravityPoint({x:canvas.width/2, y:canvas.height}, particlesArray[i])
            drawPoint(context)(particlesArray[i]);
        }
        // connectParticles(context)(particlesArray, 100);
        return 1;
    };

    return {
        setup,
        draw,
    };
};
