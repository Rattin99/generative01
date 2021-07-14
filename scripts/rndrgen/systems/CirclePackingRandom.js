import { PackCircle } from '../math/Circle';

// https://www.youtube.com/watch?v=QHEQuoIKgNE&t=1s

/*
Random space filling
 */

export const randomCircleFill = (maxCircles = 100, newPerFrame = 10, maxAttempts = 10) => {
    const circles = [];
    // const newPerFrame = 10;
    let newPlacementAttempts = 0;
    // const maxAttempts = 10;
    // const maxCircles = 300;

    const getCircles = (_) => circles;

    const attemptNewCircle = (pointGenFn) => {
        // const x = randomNumberBetween(0, canvasWidth);
        // const y = randomNumberBetween(0, canvasHeight);

        const p = pointGenFn();

        let inside = false;

        // no new circle inside of an existing one
        circles.forEach((c) => {
            if (c.contains(p, 5)) inside = true;
        });

        if (!inside) return new PackCircle(p.x, p.y, 2);
        return null;
    };

    const insert = (pointGenFn) => {
        for (let i = 0; i < newPerFrame; i++) {
            const newc = attemptNewCircle(pointGenFn);
            if (newc) {
                circles.push(newc);
                if (circles.length > maxCircles) {
                    console.log('Max circles');
                    return -1;
                }
                newPlacementAttempts = 0;
            } else if (++newPlacementAttempts > maxAttempts) {
                console.log('Max attempts exceeded');
                return -1;
            }
        }
        return 1;
    };

    const grow = (edges) => {
        circles.forEach((c) => {
            if (c.growing) {
                if (c.edges(edges)) {
                    c.growing = false;
                } else {
                    circles.forEach((other) => {
                        if (c.growing && c !== other) {
                            if (c.intersects(other, 2)) {
                                c.growing = false;
                            }
                        }
                    });
                }
            }
            c.grow();
        });
    };

    return {
        insert,
        grow,
        getCircles,
    };
};
