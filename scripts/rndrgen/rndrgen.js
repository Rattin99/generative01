import { sketch } from './sketch';
import Timeline from './animation/Timeline';
import { Bitmap } from './canvas/Bitmap';
import * as cntx from './canvas/canvas';
import * as primatives from './canvas/primatives';
import * as texture from './canvas/textures';
import * as text from './canvas/text';
import * as palette from './color/palettes';
import * as utils from './utils';

const version = '0.1.0';

const animation = { Timeline };
const canvas = { Bitmap, cntx, primatives, texture, text };
const color = { palette };

export { version, utils, sketch, animation, canvas, color };
