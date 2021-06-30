/*
SVG syntax based renderer for Canvas

<rect width="200" height="100" fill="#BBC42A" />
<circleOld cx="75" cy="75" r="75" fill="#ED6E46" />
<ellipse cx="100" cy="100" rx="100" ry="50" fill="#7AA20D" />
<line x1="5" y1="5" x2="100" y2="100" stroke="#765373" stroke-width="8"/>
<polyline points="0,40 40,40 40,80 80,80 80,120 120,120 120,160" fill="white" stroke="#BBC42A" stroke-width="6" />
<polygon points="50,5 100,5 125,30 125,80 100,105 50,105 25,80 25,30" fill="#ED6E46" />
<path fill="#7AA20D" stroke="#7AA20D" stroke-width="9" stroke-linejoin="round" d=".."/>
<text x="30" y="90" fill="#ED6E46" font-size="100" font-family="'Leckerli One', cursive">Watermelon</text>


 */

import tinycolor from 'tinycolor2';

const defaultState = {
    fillColor: '',
    strokeColor: '',
    strokeWidth: 1,
    strokeDash: [],
    strokeCap: 'butt',
    strokeJoin: 'miter',
    contextScale: 1,
    blendMode: 'source-over',
    filter: '',
};

export class rndrCanvas {
    constructor(c, m = 0) {
        this.canvas = c;
        this.context = this.canvas.getContext('2d');
        this.history = [];
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.marginPct = m;
        this.startX = 0;
        this.startY = 0;
        this.endX = this.width;
        this.endY = this.height;
        this.currentCanvasState = defaultState;
    }
}
