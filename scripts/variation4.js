import { createRandomParticleValues, Particle, pointPush } from './lib/Particle';
import { connectParticles, drawParticlePoint, fillCanvas } from './lib/canvas';

export const variation4 = () => {
    const config = {
        numParticles: 0,
    };

    const particlesArray = [];
    const circles = [];

    const setup = (canvas, context) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const diameter = canvas.height / 4;
        const steps = 10;

        for (let theta = 0; theta < 360; theta += steps) {
            const rad = theta * (Math.PI / 180);
            const x = Math.cos(rad) * diameter + centerX;
            const y = Math.sin(rad) * diameter + centerY;
            circles.push([x, y]);
            const props = createRandomParticleValues(canvas);
            props.x = x;
            props.y = y;
            props.radius = 1;
            props.color = { r: 0, g: 0, b: 0 };
            props.index = circles.length - 1;
            particlesArray.push(new Particle(props));
        }
        config.numParticles = particlesArray.length;
        fillCanvas(canvas, context)(1, '255,255,255');
    };

    // will run every frame
    const draw = (canvas, context, mouse) => {
        fillCanvas(canvas, context)(0.005, '255,255,255');
        for (let i = 0; i < config.numParticles; i++) {
            pointPush(mouse, particlesArray[i], mouse.isDown ? -1 : 5);
            drawParticlePoint(context)(particlesArray[i]);
            // let index = particlesArray[i].index + 1;
            // if(index === circles.length) {
            //     index = 0;
            // }
            // particlesArray[i].x = circles[index][0];
            // particlesArray[i].y = circles[index][1];
            // particlesArray.index = index;
        }
        connectParticles(context)(particlesArray, 200);
        return 1; // -1 to exit animation loop
    };

    return {
        config,
        setup,
        draw,
    };
};
