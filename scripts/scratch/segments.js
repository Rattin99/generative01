const lineCap = 'butt';
const lineJoin = 'miter';

// export const turtleLineMode = (m = 'butt') => {
//     if (m === 'butt') {
//         lineCap = 'butt';
//         lineJoin = 'miter';
//     } else if (m === 'round') {
//         lineCap = 'round';
//         lineJoin = 'round';
//     }
// };

// export const drawPointsTaper = (ctx) => (points, color = 'black', width = 1) => {
//     ctx.strokeStyle = tinycolor(color).clone().toRgbString();
//
//     const mid = points.length / 2;
//
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//
//     points.forEach((coords, i) => {
//         const dist = Math.abs(mid - i);
//         const w = mapRange(0, mid, width, 1, dist);
//         ctx.lineWidth = w;
//         ctx.beginPath();
//         ctx.moveTo(coords[0], coords[1]);
//         ctx.lineTo(coords[0], coords[1]);
//         ctx.stroke();
//     });
// };

// export const circleAtPoint = (context) => (points, color = 'black', radius = 5) => {
//     points.forEach((coords) => {
//         circleFilled(context)(coords[0], coords[1], radius, color);
//     });
// };

// export const variableCircleAtPoint = (context) => (points, color = 'black', radius = 5, freq = 10, amp = 2) => {
//     points.forEach((coords) => {
//         const v = Math.sin(coords[0] / freq) * amp;
//         circleFilled(context)(coords[0], coords[1], Math.abs(radius - v), color);
//     });
// };

// export const drawSegment = (ctx) => (segments, color, weight, points = false) => {
//     ctx.lineCap = 'round';
//     // ctx.lineJoin = 'round';
//     ctx.strokeStyle = tinycolor(color).clone().toRgbString();
//     ctx.lineWidth = weight;
//     ctx.beginPath();
//     segments.forEach((seg, i) => {
//         if (i === 0) {
//             ctx.moveTo(seg.start.x, seg.start.y);
//         } else {
//             ctx.lineTo(seg.start.x, seg.start.y);
//         }
//         ctx.lineTo(seg.end.x, seg.end.y);
//     });
//     ctx.stroke();
//     if (points) {
//         segments.forEach((seg, i) => {
//             const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
//             circleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
//             circleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
//         });
//     }
// };

// export const drawSegmentTaper = (ctx) => (segments, color, maxWeight, minWeight = 1, points = false) => {
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//     ctx.strokeStyle = tinycolor(color).clone().toRgbString();
//
//     const mid = segments.length / 2;
//
//     segments.forEach((seg, i) => {
//         const dist = Math.abs(mid - i);
//         const w = mapRange(0, mid, maxWeight, minWeight, dist);
//
//         ctx.beginPath();
//         ctx.lineWidth = w;
//         if (i === 0) {
//             ctx.moveTo(seg.start.x, seg.start.y);
//         } else {
//             ctx.lineTo(seg.start.x, seg.start.y);
//         }
//         ctx.lineTo(seg.end.x, seg.end.y);
//         ctx.stroke();
//     });
//
//     if (points) {
//         segments.forEach((seg, i) => {
//             const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
//             circleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
//             circleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
//         });
//     }
// };
