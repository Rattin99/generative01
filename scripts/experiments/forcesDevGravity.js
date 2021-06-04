import { edgeBounce, Particle, createRandomParticleValues } from '../systems/Particle';
import { background, drawRake } from '../rndrgen/canvas/canvas';
import { drawRotatedParticle } from '../rndrgen/canvas/canvas-particles';

export const forcesDevGravity = () => {
    const config = {
        // width: 700,
        // height: 700,
        // fps: 30,
    };

    const numParticles = 50;
    const particlesArray = [];

    const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 100, g: 20 };

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.radius = Math.sqrt(props.mass);
            particlesArray.push(new Particle(props));
        }
    };

    // const targetX = mouse.x ? mouse.x : canvas.width / 2;
    // const targetY = mouse.y ? mouse.y : canvas.height / 2;
    // accelerateToPoint(targetX, targetY, particlesArray[i]);
    // https://www.youtube.com/watch?v=T84AWnntxZA
    // const accelerateToPoint = (targetX, targetY, particle) => {
    //     const magnitude = 0.001;
    //     const vLimit = 5;
    //     const accX = ((targetX - particle.x) * magnitude) / particle.mass;
    //     const accY = ((targetY - particle.y) * magnitude) / particle.mass;
    //     particle.velocityX += accX;
    //     particle.velocityY += accY;
    //     particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
    //     particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
    // };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)({ r: 0, g: 0, b: 50, a: 0.01 });

        let mode = 1;

        attractor.x = mouse.x ? mouse.x : canvasCenterX;
        attractor.y = mouse.y ? mouse.y : canvasCenterY;

        for (let i = 0; i < numParticles; i++) {
            if (mouse.isDown) {
                mode = -1;
            } else {
                mode = 1;
            }
            particlesArray[i].attract(attractor, mode, 2000);
            particlesArray[i].velocity = particlesArray[i].velocity.limit(20);
            particlesArray[i].updatePosWithVelocity();
            edgeBounce(canvas, particlesArray[i]);
            drawRotatedParticle(context, drawRake, particlesArray[i]);
            particlesArray[i].acceleration = { x: 0, y: 0 };
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
