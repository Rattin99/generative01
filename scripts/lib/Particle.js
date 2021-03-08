import tinycolor from 'tinycolor2';
import { pointDistance, normalizeInverse, randomNumberBetween, lerp, pointAngleFromVelocity, clamp } from './math';
import { Vector } from './Vector';

const MAX_COORD_HISTORY = 30;

const limitArrayLen = (arr) => {
    const arrLength = arr.length;
    if (arrLength > MAX_COORD_HISTORY) {
        arr.splice(0, arrLength - MAX_COORD_HISTORY);
    }
    return arr;
};

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
        // this.oVelocityX = velocityX || 0;
        // this.oVelocityY = velocityY || 0;
        this.mass = mass || 1;
        this.radius = radius || 1;
        this.#color = color ? tinycolor(color) : tinycolor({ r: 255, g: 255, b: 255 });
        this.rotation = rotation || 0;
        this.lifetime = lifetime || 1;
        this.drawFn = drawFn;
        this.updateFn = updateFn;
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

    get vVector() {
        return new Vector(this.velocityX, this.velocityY, 0);
    }

    set vVector({ x, y }) {
        this.velocityX = x;
        this.velocityY = y;
    }

    get aVector() {
        return new Vector(this.accelerationX, this.accelerationY, 0);
    }

    set aVector({ x, y }) {
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

    draw() {
        this.drawFn(this);
    }

    update() {
        this.updateFn(this);
        this.draw(this);
    }
}

export const pixel = (x, y, color, radius) => new Particle({ x, y, color, radius });

export const psCanvasRandom = (canvas) => ({
    x: randomNumberBetween(0, canvas.width),
    y: randomNumberBetween(0, canvas.height),
});

export const createRandomParticleValues = (canvas) => {
    const vel = 2;
    const radius = randomNumberBetween(5, 10);
    const coords = psCanvasRandom(canvas);
    return {
        radius,
        x: coords.x,
        y: coords.y,
        mass: randomNumberBetween(1, 10),
        velocityX: randomNumberBetween(-vel, vel),
        velocityY: randomNumberBetween(-vel, vel),
        accelerationX: 0,
        accelerationY: 0,
        rotation: randomNumberBetween(-180, 180),
        // color: { r: randomNumberBetween(100, 255), g: randomNumberBetween(100, 255), b: randomNumberBetween(100, 255) },
        color: {
            r: lerp(0, 255, coords.x / canvas.width),
            g: randomNumberBetween(100, 255),
            b: lerp(0, 255, coords.y / canvas.height),
        },
    };
};

export const updatePosWithVelocity = (particle) => {
    particle.x += particle.vVector.x;
    particle.y += particle.vVector.y;
};

// https://www.youtube.com/watch?v=L7CECWLdTmo
export const applyForce = (fVect, particle) => {
    const fV = fVect.div(particle.mass);
    const aV = particle.aVector.add(fV);
    const pV = particle.vVector.add(aV);
    particle.aVector = aV;
    particle.vVector = pV;
};

// https://www.youtube.com/watch?v=WBdhAuWS6X8
export const friction = (particle, mu = 0.1) => {
    const normal = particle.mass;
    const vfriction = particle.vVector
        .normalize()
        .mult(-1)
        .setMag(mu * normal);
    applyForce(vfriction, particle);
};

// https://www.youtube.com/watch?v=DxFDgOYEoy8
export const drag = (particle, coefficent = 0.1) => {
    const area = 1; // particle.radius;
    const velUnit = particle.vVector.normalize().mult(-1);
    const speed = particle.vVector.magSq() * area * coefficent;
    const vdrag = velUnit.setMag(speed);
    applyForce(vdrag, particle);
};

// https://www.youtube.com/watch?v=EpgB3cNhKPM
// mode 1 is attract, -1 is repel
// const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 50, g: 1 };
export const attract = ({ x, y, mass, g }, particle, mode = 1, affectDist = 1000) => {
    if (pointDistance({ x, y }, { x: particle.x, y: particle.y }) < affectDist) {
        g = g || 1;
        const dir = new Vector(x, y).sub(new Vector(particle.x, particle.y));
        const distanceSq = clamp(50, 5000, dir.magSq());
        const strength = (mode * (g * (mass * particle.mass))) / distanceSq;
        const force = dir.setMag(strength);
        applyForce(force, particle);
    }
};

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

export const gravityPoint = (mult = 0.2, f = 1) => (x, y, radius, particle) => {
    const distance = pointDistance({ x, y }, particle);
    if (distance < radius) {
        const dx = x - particle.x;
        const dy = y - particle.y;
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = normalizeInverse(0, radius, distance) * f * mult;
        const tempX = forceDirectionX * force * particle.radius * 2;
        const tempY = forceDirectionY * force * particle.radius * 2;
        particle.x += tempX;
        particle.y += tempY;
    }
};

// for moving points, push away/around from point
export const avoidPoint = (point, particle, f = 1) => {
    gravityPoint(1, (f *= -1))(point.x, point.y, point.radius, particle);
};

// for moving points, pull towards point
export const attractPoint = (point, particle, f = 1) => {
    gravityPoint(1, f)(point.x, point.y, point.radius, particle);
};

// for moving static, push away/outward from point
export const pointPush = (point, particle, f = 1) => {
    const dx = point.x - particle.x;
    const dy = point.y - particle.y;
    const distance = pointDistance(point, particle);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const force = normalizeInverse(0, point.radius, distance) * f;
    particle.velocityX = forceDirectionX * force * particle.mass * 0.8;
    particle.velocityY = forceDirectionY * force * particle.mass * 0.8;

    if (distance < point.radius) {
        particle.x -= particle.velocityX;
        particle.y -= particle.velocityY;
    } else {
        // TODO if < 1 then snap to 0
        if (particle.x !== particle.oX) {
            particle.x -= (particle.x - particle.oX) * 0.1;
        }
        if (particle.y !== particle.oY) {
            particle.y -= (particle.y - particle.oY) * 0.1;
        }
    }
};
