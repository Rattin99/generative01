import { pointOnCircle } from './math';
import { drawLine } from './canvas';

// Spikes is an array of angles
export const drawSpikeCircle = (context) => ({ x, y, radius, color }, spikes, spikeLength = 5) => {
    const circleStroke = 1;
    const spikeStroke = 2;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = circleStroke;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
    for (let s = 0; s < spikes.length; s++) {
        const pointA = pointOnCircle(x, y, radius, spikes[s]);
        const pointB = pointOnCircle(x, y, radius + spikeLength, spikes[s]);
        context.strokeStyle = color.toRgbString();
        drawLine(context)(pointA.x, pointA.y, pointB.x, pointB.y, spikeStroke);
    }
};
