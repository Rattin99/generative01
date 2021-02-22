/*
Canvas animation timeline based on Canvas Sketch time keeping methods
https://github.com/mattdesl/canvas-sketch/blob/master/docs/animated-sketches.md
 */

export class Timeline {
    constructor(fps, loop, duration) {
        this.fps = fps || 30;
        this.loop = loop || 0; // total loops
        this.duration = duration || 1; // duration of each loop in seconds
        this.totalLoopFrames = this.duration ? this.duration * this.fps : 1;
        this.drawLoopIterations = 0; // number of times drawn
        this.time = 0; // elapsed time in seconds
        this.playhead = 0; // current progress of the loop between 0 and 1
        this.frame = 1; // frame of the loop
        this.elapsedLoops = 0;
    }

    onFrame() {
        this.drawLoopIterations++;
        // one frame
        this.frame++;
        this.playhead = this.frame / this.totalLoopFrames;
        if (this.drawLoopIterations % this.fps === 0) {
            // a second elapsed
            this.time++;
            if (this.frame >= this.totalLoopFrames) {
                // one loop duration passed
                this.elapsedLoops++;
                this.playhead = 0;
                this.frame = 0;
                if (this.loop && this.elapsedLoops >= this.loop) {
                    console.log('End of loops');
                    return -1;
                }
            }
        }
        return 1;
    }
}
