import tinycolor from 'tinycolor2';
import {pointDistance, normalizeInverse, randomNumberBetween, lerp} from './math';

const MAX_COORD_HISTORY = 30;

const limitArrayLen = (arr) => {
    const arrLength = arr.length;
    if (arrLength > MAX_COORD_HISTORY) {
        arr.splice(0, arrLength - MAX_COORD_HISTORY);
    }
    return arr;
};

export class Particle {
    constructor(values) {
        this.initValues(values);
    }

    initValues({
                   index,
                   x,
                   y,
                   velocityX,
                   velocityY,
                   radius,
                   mass,
                   color,
                   alpha,
                   rotation,
                   lifetime,
                   drawFn,
                   updateFn,
                   colorFn
               }) {
        this.index = index || 0;
        this._x = x || 0;
        this._y = y || 0;
        this.xHistory = [x];
        this.yHistory = [y];
        this.oX = x || this.oX;
        this.oY = y || this.oY;
        this.velocityX = velocityX || 0;
        this.velocityY = velocityY || 0;
        this.oVelocityX = velocityX || 0;
        this.oVelocityY = velocityY || 0;
        this.mass = mass || 1;
        this.radius = radius || 1;
        this._color = color ? tinycolor(color) : tinycolor({r: 255, g: 255, b: 255});
        this.rotation = rotation || 0;
        this.lifetime = lifetime || 1;
        this.drawFn = drawFn;
        this.updateFn = updateFn;
        // always return a string
        this.colorFn = colorFn;
    }

    get color() {
        if (this.colorFn) {
            return tinycolor(this.colorFn(this));
        }
        return this._color;
    }

    set color(value) {
        this._color = tinycolor(value);
    }

    get colorStr() {
        if (this.colorFn) {
            return this.colorFn(this);
        }
        return this._color.toRgbString();
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
        this.xHistory.unshift(value);
        if (this.xHistory.length > MAX_COORD_HISTORY) {
            this.xHistory = this.xHistory.slice(0, MAX_COORD_HISTORY);
        }
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.yHistory.unshift(value);
        if (this.yHistory.length > MAX_COORD_HISTORY) {
            this.yHistory = this.yHistory.slice(0, MAX_COORD_HISTORY);
        }
    }

    draw() {
        // drawPoint(this);
        this.drawFn(this);
    }

    update() {
        this.updateFn(this);
        this.draw(this);
    }
}

export const pixel = (x, y, color, radius) => new Particle({x, y, color, radius});

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
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;
};

export const edgeBounce = ({width, height}, particle) => {
    if (particle.x + particle.radius > width || particle.x - particle.radius < 0) {
        particle.velocityX *= -1;
    }
    if (particle.y + particle.radius > height || particle.y - particle.radius < 0) {
        particle.velocityY *= -1;
    }
};

export const edgeWrap = ({width, height}, particle) => {
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

export const gravityPoint = (mult = .2, f = 1) => (x, y, radius, particle) => {
    const distance = pointDistance({x, y}, particle);
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
    gravityPoint(1, f *= -1)(point.x, point.y, point.radius, particle);
};

// for moving points, pull towards point
export const attractPoint = (point, particle, f = 1) => {
    gravityPoint(1, f )(point.x, point.y, point.radius, particle);
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

