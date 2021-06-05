import tinycolor from 'tinycolor2';
import random from 'canvas-sketch-util/random';

import domokunPng from '../../media/images/domokun.png';

// Vector class originally from https://evanw.github.io/lightgl.js/docs/vector.html
const lerp = (a, b, fraction) => b.sub(a).mult(fraction).add(a);

class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    }

    add(v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        return new Vector(this.x + v, this.y + v, this.z + v);
    }

    sub(v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        return new Vector(this.x - v, this.y - v, this.z - v);
    }

    mult(v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        return new Vector(this.x * v, this.y * v, this.z * v);
    }

    // https://github.com/openrndr/openrndr/blob/master/openrndr-math/src/main/kotlin/org/openrndr/math/Vector2.kt
    mix(b, fraction) {
        // return this.mult(1 - mix).add(o.mult(mix));
        return lerp(this, b, fraction);
    }

    div(v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        return new Vector(this.x / v, this.y / v, this.z / v);
    }

    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    mag() {
        return this.length();
    }

    magSq() {
        const m = this.length();
        return m * m;
    }

    setMag(m) {
        const c = this.mag();
        const r = m / c;
        return this.mult(r);
    }

    normalize() {
        let mag = this.mag();
        mag = mag || 1;
        return this.div(mag);
    }

    unit() {
        return this.div(this.length());
    }

    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    limit(v) {
        const cm = this.mag();
        if (cm > v) {
            return this.setMag(v);
        }
        return this;
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length()),
        };
    }

    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }
}

/*
  Math Snippets
  https://github.com/terkelg/math
*/

random.setSeed(random.getRandomSeed());
console.log(`Using seed ${random.getSeed()}`);

const randomNumberBetween = (min, max) => random.valueNonZero() * (max - min) + min;

// returns value between 0-1, 250,500,0 => .5
const normalize = (min, max, val) => (val - min) / (max - min);
const normalizeInverse = (min, max, val) => 1 - normalize(min, max, val);

const clamp = (min = 0, max = 1, a) => Math.min(max, Math.max(min, a));

const pointDistance = (pointA, pointB) => {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
};

// https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-angular-movement/a/pointing-towards-movement
const pointAngleFromVelocity = ({ velocityX, velocityY }) => Math.atan2(velocityY, velocityX);

// Scale up point grid and center in the canvas
const scalePointToCanvas = (canvasWidth, canvasHeight, width, height, zoomFactor, x, y) => {
    const particleXOffset = canvasWidth / 2 - (width * zoomFactor) / 2;
    const particleYOffset = canvasHeight / 2 - (height * zoomFactor) / 2;
    return {
        x: x * zoomFactor + particleXOffset,
        y: y * zoomFactor + particleYOffset,
    };
};

const clearCanvas = (canvas, context) => (_) => context.clearRect(0, 0, canvas.width, canvas.height);

const background = (canvas, context) => (color = 'black') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(0, 0, canvas.width, canvas.height);
};

const drawRectFilled = (context) => (x, y, w, h, color = 'white') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(x, y, w, h);
};

const drawSquareFilled = (context) => (x, y, size, color) => {
    drawRectFilled(context)(x, y, size, size, color);
};

const MAX_COORD_HISTORY = 30;

class Particle {
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

const pointPush = (point, particle, f = 1) => {
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

const getImageDataFromImage = (context) => (image) => {
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.width);
};

const getImageDataColor = (imageData, x, y) => ({
    r: imageData.data[y * 4 * imageData.width + x * 4],
    g: imageData.data[y * 4 * imageData.width + x * 4 + 1],
    b: imageData.data[y * 4 * imageData.width + x * 4 + 2],
    a: imageData.data[y * 4 * imageData.width + x * 4 + 3],
});

// Based on https://www.youtube.com/watch?v=afdHgwn1XCY
const domokun = (_) => {
    const config = {
        width: 600,
        height: 600,
    };

    let numParticles;
    const imageSize = 100; // square
    const png = new Image();
    png.src = domokunPng;
    const particlesArray = [];

    const setup = ({ canvas, context }) => {
        const imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();

        const imageZoomFactor = canvas.width / imageSize;
        const cropColor = 255 / 2;

        for (let y = 0, { height } = imageData; y < height; y++) {
            for (let x = 0, { width } = imageData; x < width; x++) {
                const pxColor = getImageDataColor(imageData, x, y);
                if (pxColor.a > cropColor) {
                    const points = scalePointToCanvas(
                        canvas.width,
                        canvas.height,
                        imageData.width,
                        imageData.height,
                        imageZoomFactor,
                        x,
                        y
                    );
                    const pX = points.x;
                    const pY = points.y;
                    const mass = randomNumberBetween(2, 12);
                    const color = pxColor;
                    const radius = imageZoomFactor;
                    particlesArray.push(new Particle({ x: pX, y: pY, mass, color, radius }));
                }
            }
        }

        numParticles = particlesArray.length;
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)('yellow');

        for (let i = 0; i < numParticles; i++) {
            pointPush(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
            drawSquareFilled(context)(
                particlesArray[i].x,
                particlesArray[i].y,
                particlesArray[i].radius,
                particlesArray[i].color
            );
        }
        // debugShowMouse(context)(mouse);
    };

    return {
        config,
        setup,
        draw,
    };
};

export { domokun };
