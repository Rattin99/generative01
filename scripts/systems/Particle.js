import tinycolor from 'tinycolor2';
import { lerp, clamp } from '../rndrgen/math/math';
import { Vector } from '../rndrgen/math/Vector';
import { randomNumberBetween } from '../rndrgen/math/random';
import { pointAngleFromVelocity, pointDistance } from '../rndrgen/math/points';

const MAX_COORD_HISTORY = 30;

export class Particle {
    #x;

    #y;

    #color;

    constructor(values) {
        this.initValues(values);
    }

    initValues({
        index,
        x,
        y,
        velocityX,
        velocityY,
        accelerationX,
        accelerationY,
        radius,
        mass,
        color,
        alpha,
        rotation,
        lifetime,
        drawFn,
        updateFn,
        colorFn,
        ...rest
    }) {
        this.props = rest;
        this.index = index || 0;
        this.#x = x || 0;
        this.#y = y || 0;
        this.xHistory = [x];
        this.yHistory = [y];
        this.oX = x || this.oX;
        this.oY = y || this.oY;
        this.velocityX = velocityX || 0;
        this.velocityY = velocityY || 0;
        this.accelerationX = accelerationX || 0;
        this.accelerationY = accelerationY || 0;
        this.mass = mass || 1;
        this.radius = radius || 1;
        this.#color = color ? tinycolor(color) : tinycolor({ r: 255, g: 255, b: 255 });
        this.rotation = rotation || 0;
        this.lifetime = lifetime || 1;
        // this.drawFn = drawFn;
        // this.updateFn = updateFn;
        // must always return a string
        this.colorFn = colorFn;
    }

    get color() {
        if (this.colorFn) {
            return tinycolor(this.colorFn(this));
        }
        return this.#color;
    }

    set color(value) {
        this.#color = tinycolor(value);
    }

    get colorStr() {
        if (this.colorFn) {
            const res = this.colorFn(this);
            if (typeof res !== 'string') {
                console.warn('Particle color fn must return a string!');
                return '#ff0000';
            }
            return res;
        }
        return this.#color.toRgbString();
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = value;
        this.xHistory.unshift(value);
        if (this.xHistory.length > MAX_COORD_HISTORY) {
            this.xHistory = this.xHistory.slice(0, MAX_COORD_HISTORY);
        }
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = value;
        this.yHistory.unshift(value);
        if (this.yHistory.length > MAX_COORD_HISTORY) {
            this.yHistory = this.yHistory.slice(0, MAX_COORD_HISTORY);
        }
    }

    get velocity() {
        return new Vector(this.velocityX, this.velocityY, 0);
    }

    set velocity({ x, y }) {
        this.velocityX = x;
        this.velocityY = y;
    }

    get acceleration() {
        return new Vector(this.accelerationX, this.accelerationY, 0);
    }

    set acceleration({ x, y }) {
        this.accelerationX = x;
        this.accelerationY = y;
    }

    // Rotation angle to point in direction of velocity
    get heading() {
        return pointAngleFromVelocity(this);
    }

    reverseVelocityX() {
        this.velocityX *= -1;
    }

    reverseVelocityY() {
        this.velocityY *= -1;
    }

    updatePosWithVelocity() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    applyForce(fVect) {
        const fV = fVect.div(this.mass);
        const aV = this.acceleration.add(fV);
        const pV = this.velocity.add(aV);
        this.acceleration = aV;
        this.velocity = pV;
    }

    // https://www.youtube.com/watch?v=WBdhAuWS6X8
    friction(mu = 0.1) {
        const normal = this.mass;
        const vfriction = this.velocity
            .normalize()
            .mult(-1)
            .setMag(mu * normal);
        this.applyForce(vfriction);
    }

    // https://www.youtube.com/watch?v=DxFDgOYEoy8
    drag(coefficent = 0.1) {
        const area = 1; // this.radius;
        const velUnit = this.velocity.normalize().mult(-1);
        const speed = this.velocity.magSq() * area * coefficent;
        const vdrag = velUnit.setMag(speed);
        this.applyForce(vdrag);
    }

    // https://www.youtube.com/watch?v=EpgB3cNhKPM
    // mode 1 is attract, -1 is repel
    // const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 50, g: 1 };
    attract({ x, y, mass, g }, mode = 1, affectDist = 1000) {
        if (pointDistance({ x, y }, { x: this.x, y: this.y }) < affectDist) {
            g = g || 1;
            const dir = new Vector(x, y).sub(new Vector(this.x, this.y));
            const distanceSq = clamp(50, 5000, dir.magSq());
            const strength = (mode * (g * (mass * this.mass))) / distanceSq;
            const force = dir.setMag(strength);
            this.applyForce(force);
        }
    }

    // draw() {
    //     this.drawFn(this);
    // }
    //
    // update() {
    //     this.updateFn(this);
    //     this.draw(this);
    // }
}

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

export const createRandomParticleValues = ({ width, height }) => {
    const vel = 2;
    const radius = randomNumberBetween(5, 10);
    return {
        radius,
        x: randomNumberBetween(0, width),
        y: randomNumberBetween(0, height),
        mass: randomNumberBetween(1, 10),
        velocityX: randomNumberBetween(-vel, vel),
        velocityY: randomNumberBetween(-vel, vel),
        accelerationX: 0,
        accelerationY: 0,
        rotation: randomNumberBetween(-180, 180),
        color: { r: randomNumberBetween(100, 255), g: randomNumberBetween(100, 255), b: randomNumberBetween(100, 255) },
    };
};

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

export const edgeBounce = ({ width, height }, particle) => {
    if (particle.x + particle.radius > width) {
        particle.reverseVelocityX();
        particle.x = width - particle.radius;
    }
    if (particle.x - particle.radius < 0) {
        particle.reverseVelocityX();
        particle.x = particle.radius;
    }
    if (particle.y + particle.radius > height) {
        particle.reverseVelocityY();
        particle.y = height - particle.radius;
    }
    if (particle.y - particle.radius < 0) {
        particle.reverseVelocityY();
        particle.y = particle.radius;
    }
};

export const edgeWrap = ({ width, height }, particle) => {
    if (particle.x + particle.radius > width) {
        particle.x = 0 + particle.radius;
    } else if (particle.x - particle.radius < 0) {
        particle.x = width - particle.radius;
    }
    if (particle.y + particle.radius > height) {
        particle.y = 0 + particle.radius;
    } else if (particle.y - particle.radius < 0) {
        particle.y = height - particle.radius;
    }
};
