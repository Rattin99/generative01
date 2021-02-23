import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
    edgeWrap,
    applyForce,
    friction,
    drag,
} from '../lib/Particle';
import {
    clearCanvas,
    connectParticles,
    drawMouse,
    drawParticlePoint,
    drawPointTrail,
    drawRotatedParticle,
    drawTestPoint,
    drawTriangleFilled,
    background,
    drawRake,
    drawParticleVectors,
    drawRectFilled,
} from '../lib/canvas';
import { clamp } from '../lib/math';
import { Vector } from '../lib/Vector';

export const forcesDev = () => {
    const config = {
        width: 700,
        height: 700,
        // fps: 30,
    };

    const numParticles = 10;
    const particlesArray = [];

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);

            // props.color = 'white';
            // props.mass = 1;
            props.radius = Math.sqrt(props.mass) * 10;
            props.y = 0;
            props.velocityX = 0;
            props.velocityY = 0;
            particlesArray.push(new Particle(props));
        }
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 0, g: 0, b: 50, a: 0.5 });
        drawRectFilled(context)(0, canvas.height / 2, canvas.width, canvas.height / 2, 'rgba(255,255,255,.1');
        for (let i = 0; i < numParticles; i++) {
            const gravity = new Vector(0, 0.25);
            const wind = new Vector(1, 0);

            const weight = gravity.mult(particlesArray[i].mass);

            if (mouse.isDown) {
                applyForce(wind, particlesArray[i]);
            }

            applyForce(weight, particlesArray[i]);

            if (particlesArray[i].y + particlesArray[i].radius >= canvas.height) {
                friction(particlesArray[i]);
            }

            if (particlesArray[i].y + particlesArray[i].radius >= canvas.height / 2) {
                drag(particlesArray[i]);
            }

            updatePosWithVelocity(particlesArray[i]);
            edgeBounce(canvas, particlesArray[i]);
            drawRotatedParticle(context, drawTestPoint, particlesArray[i]);
            drawParticleVectors(context)(particlesArray[i]);
            particlesArray[i].aVector = { x: 0, y: 0 };
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
