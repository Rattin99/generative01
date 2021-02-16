import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
    edgeWrap,
} from './lib/particle';
import {
    clearCanvas,
    connectParticles,
    drawMouse,
    drawPoint,
    drawPointTrail,
    drawRotatedParticle,
    drawTriangle,
    background,
    drawRake,
} from './lib/canvas';
import { clamp } from './lib/math';

export const debugDev = () => {
    const config = {
        width: 700,
        height: 700,
        // fps: 30,
    };

    const numParticles = 100;
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
            props.radius = 1;
            // props.color = 'white';
            // props.mass = 1;
            props.velocityX = 0;
            props.velocityY = 0;
            particlesArray.push(new Particle(props));
        }
    };

    const accelerateToPoint = (targetX, targetY, particle) => {
        const magnitude = 0.001;
        const vLimit = 5;
        const accX = ((targetX - particle.x) * magnitude) / particle.mass;
        const accY = ((targetY - particle.y) * magnitude) / particle.mass;
        particle.velocityX += accX;
        particle.velocityY += accY;
        particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
        particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
    };

    const applyForce = (forceX, forceY, particle) => {
        const vLimit = 15;
        particle.accelerationX += forceX / particle.mass;
        particle.accelerationY += forceY / particle.mass;
        particle.velocityX += particle.accelerationX;
        particle.velocityY += particle.accelerationY;
        // particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
        // particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 0, g: 0, b: 50, a: 0.1 });
        for (let i = 0; i < numParticles; i++) {
            const targetX = mouse.x ? mouse.x : canvas.width / 2;
            const targetY = mouse.y ? mouse.y : canvas.height / 2;
            accelerateToPoint(targetX, targetY, particlesArray[i]);

            // if (mouse.isDown) {
            //     applyForce(0.01, 0, particlesArray[i]);
            // }
            //
            // applyForce(0, 0.01, particlesArray[i]);
            //
            particlesArray[i].x += particlesArray[i].velocityX;
            particlesArray[i].y += particlesArray[i].velocityY;
            // edgeBounce(canvas, particlesArray[i]);
            // edgeWrap(canvas, particle);
            // drawPoint(context)(particle);
            // drawTriangle(context)(particle);
            // drawRake(context)(particlesArray[i]);
            drawRotatedParticle(context, drawRake, particlesArray[i], 20);
            // drawRotatedParticle(context, drawTriangle, particlesArray[i]);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
