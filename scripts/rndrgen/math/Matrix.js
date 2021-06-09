/*
10.6: Neural Networks: Matrix Math Part 1 - The Nature of Code
https://www.youtube.com/watch?v=uSzGdfdOoG8&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh&index=6
https://github.com/CodingTrain/website/blob/main/Courses/natureofcode/10.18-toy_neural_network/lib/matrix.js

Alternativly use math.js or gpu.js + others
*/

export class Matrix {
    constructor(rows, cols) {
        if (rows === undefined || cols === undefined) {
            console.error('Must init Matrix with rows and cols');
            return;
        }
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        this.fill(0);
    }

    // Initialize and fill array
    fill(v = 0) {
        for (let r = 0; r < this.rows; r++) {
            this.data[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] = v;
            }
        }
    }

    log() {
        console.table(this.data);
    }

    isCompatibleMatrix(m) {
        return m instanceof Matrix && m.rows === this.rows && m.cols === this.cols;
    }

    map(fn) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] = fn(this.data[r][c], r, c);
            }
        }
    }

    static map(m1, fn) {
        const result = new Matrix(m1.rows, m1.cols);
        for (let r = 0; r < m1.rows; r++) {
            for (let c = 0; c < m1.cols; c++) {
                result.data[r][c] = fn(m1.data[r][c], r, c);
            }
        }
        return result;
    }

    static fromArray(arr) {
        const m = new Matrix(arr.length, 1);
        for (let i = 0; i < arr.length; i++) {
            m.data[i][0] = arr[i];
        }
        return m;
    }

    toArray() {
        const arr = [];
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                arr.push(this.data[r][c]);
            }
        }
        return arr;
    }

    randomize() {
        // for (let r = 0; r < this.rows; r++) {
        //     this.data[r] = [];
        //     for (let c = 0; c < this.cols; c++) {
        //         this.data[r][c] = Math.floor(Math.random() * 10);
        //     }
        // }
        // this.map((x) => Math.floor(Math.random() * 10));
        this.map((x) => Math.random() * 2 - 1);
    }

    // rows, cols -> cols, rows
    static transpose(m) {
        const result = new Matrix(m.cols, m.rows);
        for (let r = 0; r < m.rows; r++) {
            for (let c = 0; c < m.cols; c++) {
                result.data[c][r] = m.data[r][c];
            }
        }
        return result;
    }

    static add(m1, m2) {
        const result = new Matrix(m1.rows, m1.cols);
        for (let r = 0; r < m1.rows; r++) {
            for (let c = 0; c < m1.cols; c++) {
                result.data[r][c] = m1.data[r][c] + m2.data[r][c];
            }
        }
        return result;
    }

    add(v) {
        if (v instanceof Matrix) {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.data[r][c] += v.data[r][c];
                }
            }
        } else {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.data[r][c] += v;
                }
            }
        }
    }

    static subtract(m1, m2) {
        const result = new Matrix(m1.rows, m1.cols);
        for (let r = 0; r < m1.rows; r++) {
            for (let c = 0; c < m1.cols; c++) {
                result.data[r][c] = m1.data[r][c] - m2.data[r][c];
            }
        }
        return result;
    }

    subtract(v) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] -= v;
            }
        }
    }

    // Matrix product
    static multiply(m1, m2) {
        if (m1.cols !== m2.rows) return null; // can't do the op
        const result = new Matrix(m1.rows, m2.cols);
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                let sum = 0;
                for (let k = 0; k < m1.cols; k++) {
                    sum += m1.data[i][k] * m2.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }
        return result;
    }

    multiply(v) {
        if (v instanceof Matrix) {
            // Element wise, Hadamard product
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.data[r][c] *= v.data[r][c];
                }
            }
        } else {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.data[r][c] *= v;
                }
            }
        }
    }
}
