import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
} from './lib/particle';
import {clearCanvas, connectParticles, drawCircle, drawPoint, drawPointTrail, fillCanvas} from './lib/canvas';
import {randomNumberBetween} from "./lib/math";


export const variation5 = () => {
    const config = {
        numParticles: 50,
    };

    const particlesArray = [];
    const circles = [];

    const setup = (canvas, context) => {
        for (let i = 0; i < config.numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.x = canvas.width / 2;
            props.y = canvas.height / 2;
            props.color = {r:0,g:0,b:0}
            props.radius = .5;
            particlesArray.push(new Particle(props));
        }
        const centerX = canvas.width/2;
        const centerY = canvas.height/2;
        const diameter = canvas.height/4;
        const steps = 30;
        for(let theta = 0; theta < 360; theta += steps) {
            const rad = theta*(Math.PI/180);
            const x = (Math.cos(rad)*diameter)+centerX;
            const y = (Math.sin(rad)*diameter)+centerY;
            circles.push([x, y, randomNumberBetween(20,100)]);
        }
        fillCanvas(canvas, context)(1,'255,255,255');
    };

    const draw = (canvas, context, mouse) => {
        // fillCanvas(canvas, context)(.005,'255,255,255');
        for (let i = 0; i < config.numParticles; i++) {
            updatePosWithVelocity(particlesArray[i]);
            edgeBounce(canvas, particlesArray[i]);
            for(let c=0;c<circles.length; c++) {
                avoidPoint({ radius: circles[c][2],  x:circles[c][0],y:circles[c][1]}, particlesArray[i], 4);
            }
            drawPoint(context)(particlesArray[i]);
        }
        connectParticles(context)(particlesArray, 50);
    };

    return {
        config,
        setup,
        draw,
    };
};
