// Vector class originally from https://evanw.github.io/lightgl.js/docs/vector.html
// Edited and expanded as required

// ref - p5 vector https://p5js.org/reference/#/p5.Vector
// https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/more-vector-math

/*

    const getVMagnitude = ({ x, y }) => Math.sqrt(x * x + y * y);

    const getVNormalize = (vector) => {
        let mag = getVMagnitude(vector);
        mag = mag || 1;
        return {
            x: vector.x / mag,
            y: vector.y / mag,
        };
    };

    const vMagnitude = (m, vector) => {
        const c = getVMagnitude(vector);
        const r = m / c;
        return {
            x: vector.x * r,
            y: vector.y * r,
        };
    };
 */

export function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Vector.prototype = {
    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    },
    add(v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        return new Vector(this.x + v, this.y + v, this.z + v);
    },
    sub(v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        return new Vector(this.x - v, this.y - v, this.z - v);
    },
    mult(v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        return new Vector(this.x * v, this.y * v, this.z * v);
    },
    div(v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        return new Vector(this.x / v, this.y / v, this.z / v);
    },
    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    },
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    },
    length() {
        return Math.sqrt(this.dot(this));
    },
    getMag() {
        return this.length();
    },
    normalize() {
        let mag = this.getMag();
        mag = mag || 1;
        return this.div(mag);
    },
    mag(m) {
        const c = this.getMag();
        const r = m / c;
        return this.mult(r);
    },
    unit() {
        return this.divide(this.length());
    },
    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    },
    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    },
    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length()),
        };
    },
    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    },
    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    },
    clone() {
        return new Vector(this.x, this.y, this.z);
    },
    init(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
};
Vector.negative = function (a, b) {
    b.x = -a.x;
    b.y = -a.y;
    b.z = -a.z;
    return b;
};
Vector.add = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        c.z = a.z + b.z;
    } else {
        c.x = a.x + b;
        c.y = a.y + b;
        c.z = a.z + b;
    }
    return c;
};
Vector.subtract = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x - b.x;
        c.y = a.y - b.y;
        c.z = a.z - b.z;
    } else {
        c.x = a.x - b;
        c.y = a.y - b;
        c.z = a.z - b;
    }
    return c;
};
Vector.multiply = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x * b.x;
        c.y = a.y * b.y;
        c.z = a.z * b.z;
    } else {
        c.x = a.x * b;
        c.y = a.y * b;
        c.z = a.z * b;
    }
    return c;
};
Vector.divide = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x / b.x;
        c.y = a.y / b.y;
        c.z = a.z / b.z;
    } else {
        c.x = a.x / b;
        c.y = a.y / b;
        c.z = a.z / b;
    }
    return c;
};
Vector.cross = function (a, b, c) {
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;
    return c;
};
Vector.unit = function (a, b) {
    const length = a.length();
    b.x = a.x / length;
    b.y = a.y / length;
    b.z = a.z / length;
    return b;
};
Vector.fromAngles = function (theta, phi) {
    return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};
Vector.randomDirection = function () {
    return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};
Vector.min = function (a, b) {
    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function (a, b) {
    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function (a, b, fraction) {
    return b.subtract(a).multiply(fraction).add(a);
};
Vector.fromArray = function (a) {
    return new Vector(a[0], a[1], a[2]);
};
Vector.angleBetween = function (a, b) {
    return a.angleTo(b);
};
