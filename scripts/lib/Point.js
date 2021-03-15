export class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get toArray() {
        return [this.x, this.y, this.z];
    }

    get toObject() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        };
    }

    clone() {
        return new Point(this.x, this.y, this.z);
    }
}