// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this,
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"1JC1Z":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "a3e28b36bb0fefbe344f5a88824b0574"; // @flow
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets/*: {|[string]: boolean|} */ , acceptedAssets/*: {|[string]: boolean|} */ , assetsToAccept/*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
    // $FlowFixMe
    ws.onmessage = function(event/*: {data: string, ...} */ ) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH
            );
            // Handle HMR Update
            var handled = false;
            assets.forEach((asset)=>{
                var didAccept = asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
                if (didAccept) handled = true;
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
            }
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function(e) {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
        errorHTML += `\n      <div>\n        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">\n          🚨 ${diagnostic.message}\n        </div>\n        <pre>\n          ${stack}\n        </pre>\n        <div>\n          ${diagnostic.hints.map((hint)=>'<div>' + hint + '</div>'
        ).join('')}\n        </div>\n      </div>\n    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    link.getAttribute('href').split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle/*: ParcelRequire */ , asset/*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') {
        reloadCSS();
        return;
    }
    let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
    if (deps) {
        var fn = new Function('require', 'module', 'exports', asset.output);
        modules[asset.id] = [
            fn,
            deps
        ];
    } else if (bundle.parent) hmrApply(bundle.parent, asset);
}
function hmrAcceptCheck(bundle/*: ParcelRequire */ , id/*: string */ , depsByBundle/*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    return getParents(module.bundle.root, id).some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle/*: ParcelRequire */ , id/*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"39pCf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
/*
Explorations with generative code
*/ var _normalizeCss = require("normalize.css");
var _normalizeCssDefault = parcelHelpers.interopDefault(_normalizeCss);
var _variationsIndex = require("./variationsIndex");
var _rndrgen = require("./rndrgen/rndrgen");
var _brushShape = require("./experiments/brush-shape");
var _circles = require("./experiments/circles");
var _circlesPacking = require("./experiments/circles-packing");
var _circlesPacking2 = require("./experiments/circles-packing-2");
var _bitmapTest01 = require("./experiments/bitmap-test-01");
var _voronoi01 = require("./experiments/voronoi-01");
const debug = true;
const s = _rndrgen.sketch('canvas', 0, debug);
// const experimentalVariation = undefined;
const experimentalVariation = _voronoi01.voronoi01;
const setNote = (note)=>document.getElementById('note').innerText = note
;
const runVariation = (v)=>{
    setNote(v.note);
    s.run(v.sketch, s);
};
const variationMapKeys = Object.keys(_variationsIndex.variationsIndex);
const urlKey = _rndrgen.utils.getQueryVariable('variation') || variationMapKeys[variationMapKeys.length - 1];
if (experimentalVariation !== undefined) runVariation({
    sketch: experimentalVariation,
    note: 'Current experiment ...'
});
else if (urlKey && _variationsIndex.variationsIndex.hasOwnProperty(urlKey)) {
    console.log(urlKey, _variationsIndex.variationsIndex.hasOwnProperty(urlKey));
    runVariation(_variationsIndex.variationsIndex[urlKey]);
} else runVariation(_variationsIndex.variationsIndex[variationMapKeys[variationMapKeys.length - 1]]);
document.getElementById('download').addEventListener('click', s.saveCanvasCapture);
document.getElementById('record').addEventListener('click', s.saveCanvasRecording);

},{"normalize.css":"5i1nu","./variationsIndex":"7sXnx","./rndrgen/rndrgen":"7oc4r","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","./experiments/brush-shape":"RkIkf","./experiments/circles":"4o64S","./experiments/circles-packing":"5F9hs","./experiments/circles-packing-2":"1jzcE","./experiments/bitmap-test-01":"7Izx5","./experiments/voronoi-01":"6BMKU"}],"5i1nu":[function() {},{}],"7sXnx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "variationsIndex", ()=>variationsIndex
);
var _variation5 = require("./released/variation5");
var _threeAttractors = require("./released/threeAttractors");
var _hiImage01 = require("./released/hiImage01");
var _waves01B = require("./released/waves01b");
var _lissajous01 = require("./released/lissajous01");
var _flowFieldParticles = require("./released/flow-field-particles");
var _flowFieldArcs = require("./released/flow-field-arcs");
var _flowFieldImage = require("./released/flow-field-image");
var _radialNoise = require("./released/radial-noise");
var _flowFieldRibbons = require("./released/flow-field-ribbons");
var _flowFieldRibbons2 = require("./released/flow-field-ribbons-2");
var _shadedBoxes = require("./released/shaded-boxes");
var _larrycarlson02 = require("./released/larrycarlson02");
var _meanderingRiver02 = require("./released/meandering-river-02");
var _meanderingRiver01 = require("./released/meandering-river-01");
var _truchetTiles = require("./released/truchet-tiles");
var _truchetTiles02 = require("./released/truchet-tiles-02");
var _meanderingRiver03 = require("./released/meandering-river-03");
const variationsIndex = {
    5: {
        note: 'Like spider webs',
        sketch: _variation5.variation5
    },
    8: {
        note: 'One attractor in the center, two on the sides.',
        sketch: _threeAttractors.threeAttractors
    },
    9: {
        note: 'Say Hi',
        sketch: _hiImage01.hiImage01
    },
    11: {
        note: 'Inspired by Churn, Kenny Vaden https://www.reddit.com/r/generative/comments/lq8r11/churn_r_code/',
        sketch: _waves01B.waves01b
    },
    12: {
        note: 'Experimenting with rose shapes. Refresh for new randomized set.',
        sketch: _lissajous01.lissajous01
    },
    13: {
        note: 'Particles and fibers flowing with 3d simplex noise.',
        sketch: _flowFieldParticles.flowFieldParticles
    },
    14: {
        note: 'Arcs flowing with 3d simplex noise.',
        sketch: _flowFieldArcs.flowFieldArcs
    },
    15: {
        note: 'Rendering an image with flow fields. Photo by Francesca Zama https://unsplash.com/photos/OFjnQOf1pPA',
        sketch: _flowFieldImage.flowFieldImage
    },
    16: {
        note: 'Simplex noise going around ...',
        sketch: _radialNoise.radialNoise
    },
    17: {
        note: 'Ribbons attracted to an attractor',
        sketch: _flowFieldRibbons.flowFieldRibbons
    },
    18: {
        note: 'Ribbons attracted to an attractor',
        sketch: _flowFieldRibbons2.flowFieldRibbons2
    },
    19: {
        note: 'Shaded boxes with flow field particles.',
        sketch: _shadedBoxes.shadedBoxes
    },
    20: {
        note: 'Render an image in the wavy art style of Larry Carlson',
        sketch: _larrycarlson02.larrycarlson02
    },
    21: {
        note: 'Based on "Meander" by Robert Hodgin and an implementation by Eric on Reddit',
        sketch: _meanderingRiver02.meanderingRiver02
    },
    22: {
        note: 'Meandering river over landscape. Refresh for new terrain. Based on "Meander" by Robert Hodgin.',
        sketch: _meanderingRiver01.meanderingRiver01
    },
    23: {
        note: 'Multiscale Truchet Tiles',
        sketch: _truchetTiles.truchetTiles
    },
    24: {
        note: 'Interlaced Truchet Tiles',
        sketch: _truchetTiles02.truchetTiles02
    },
    25: {
        note: 'Chaotic meander',
        sketch: _meanderingRiver03.meanderingRiver03
    }
};

},{"./released/variation5":"1i6Vo","./released/threeAttractors":"4FjQ0","./released/hiImage01":"7fBhq","./released/waves01b":"3wlBH","./released/lissajous01":"2CMm3","./released/flow-field-particles":"omRBU","./released/flow-field-arcs":"3Q1u4","./released/flow-field-image":"5P1Ch","./released/radial-noise":"3Qctl","./released/flow-field-ribbons":"3hmlu","./released/flow-field-ribbons-2":"2IsLg","./released/shaded-boxes":"1wwAx","./released/larrycarlson02":"3xaAe","./released/meandering-river-02":"6SHt4","./released/meandering-river-01":"2elLt","./released/truchet-tiles":"3y6eB","./released/truchet-tiles-02":"ysufc","./released/meandering-river-03":"5ZhYB","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"1i6Vo":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "variation5", ()=>variation5
);
var _particle = require("../rndrgen/systems/Particle");
var _canvas = require("../rndrgen/canvas/canvas");
var _math = require("../rndrgen/math/math");
var _particles = require("../rndrgen/canvas/particles");
var _random = require("../rndrgen/math/random");
var _points = require("../rndrgen/math/points");
const gravityPoint = (mult = 0.2, f = 1)=>(x, y, radius, particle)=>{
        const distance = _points.pointDistance({
            x,
            y
        }, particle);
        if (distance < radius) {
            const dx = x - particle.x;
            const dy = y - particle.y;
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = _math.normalizeInverse(0, radius, distance) * f * mult;
            const tempX = forceDirectionX * force * particle.radius * 2;
            const tempY = forceDirectionY * force * particle.radius * 2;
            particle.x += tempX;
            particle.y += tempY;
        }
    }
;
// for moving points, push away/around from point
const avoidPoint = (point, particle, f = 1)=>{
    gravityPoint(1, f *= -1)(point.x, point.y, point.radius, particle);
};
const variation5 = ()=>{
    const config = {
        numParticles: 50
    };
    const particlesArray = [];
    const circles = [];
    const setup = ({ canvas , context  })=>{
        for(let i = 0; i < config.numParticles; i++){
            const props = _particle.createRandomParticleValues(canvas);
            props.x = canvas.width / 2;
            props.y = canvas.height / 2;
            props.color = {
                r: 0,
                g: 0,
                b: 0
            };
            props.radius = 0.5;
            particlesArray.push(new _particle.Particle(props));
        }
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const diameter = canvas.height / 4;
        const steps = 30;
        for(let theta = 0; theta < 360; theta += steps){
            const rad = theta * (Math.PI / 180);
            const x = Math.cos(rad) * diameter + centerX;
            const y = Math.sin(rad) * diameter + centerY;
            circles.push([
                x,
                y,
                _random.randomNumberBetween(20, 100)
            ]);
        }
        _canvas.background(canvas, context)('white');
    };
    const draw = ({ canvas , context , mouse  })=>{
        for(let i = 0; i < config.numParticles; i++){
            particlesArray[i].updatePosWithVelocity();
            _particle.edgeBounce(canvas, particlesArray[i]);
            for(let c = 0; c < circles.length; c++)avoidPoint({
                radius: circles[c][2],
                x: circles[c][0],
                y: circles[c][1]
            }, particlesArray[i], 4);
            _particles.particlePoint(context)(particlesArray[i]);
        }
        _particles.connectParticles(context)(particlesArray, 50);
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/systems/Particle":"344El","../rndrgen/canvas/canvas":"73Br1","../rndrgen/math/math":"4t0bw","../rndrgen/canvas/particles":"33yaF","../rndrgen/math/random":"1SLuP","../rndrgen/math/points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"344El":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Particle", ()=>Particle
);
parcelHelpers.export(exports, "createRandomParticleValues", ()=>createRandomParticleValues
);
parcelHelpers.export(exports, "createRandomStaticParticle", ()=>createRandomStaticParticle
);
parcelHelpers.export(exports, "edgeBounce", ()=>edgeBounce
);
parcelHelpers.export(exports, "edgeWrap", ()=>edgeWrap
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../math/math");
var _vector = require("../math/Vector");
var _random = require("../math/random");
var _points = require("../math/points");
/*
This class is a mess 😅
 */ const maxParticleHistory = 30;
class Particle {
    #x;
    #y;
    #color;
    constructor({ index , x: x1 , y: y1 , velocityX , velocityY , accelerationX , accelerationY , radius , mass: mass1 , color , alpha , rotation , drawFn , updateFn , colorFn , ...rest }){
        this.props = rest;
        this.index = index || 0;
        // TODO remove separate x/y and just use a vector
        this.#x = x1 || 0;
        this.#y = y1 || 0;
        this.xHistory = [
            x1
        ];
        this.yHistory = [
            y1
        ];
        this.oX = x1 || this.oX;
        this.oY = y1 || this.oY;
        this.velocityX = velocityX || 0;
        this.velocityY = velocityY || 0;
        this.accelerationX = accelerationX || 0;
        this.accelerationY = accelerationY || 0;
        this.mass = mass1 || 1;
        this.radius = radius || 1;
        this.#color = color ? _tinycolor2Default.default(color) : _tinycolor2Default.default({
            r: 255,
            g: 255,
            b: 255
        });
        this.rotation = rotation || 0;
        this.colorFn = colorFn;
    }
    get color() {
        if (this.colorFn) // TODO type check to enforce string?
        return _tinycolor2Default.default(this.colorFn(this));
        return this.#color;
    }
    set color(value) {
        this.#color = _tinycolor2Default.default(value);
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
        if (this.xHistory.length > maxParticleHistory) this.xHistory = this.xHistory.slice(0, maxParticleHistory);
    }
    get y() {
        return this.#y;
    }
    set y(value) {
        this.#y = value;
        this.yHistory.unshift(value);
        if (this.yHistory.length > maxParticleHistory) this.yHistory = this.yHistory.slice(0, maxParticleHistory);
    }
    get velocity() {
        return new _vector.Vector(this.velocityX, this.velocityY, 0);
    }
    set velocity({ x , y  }) {
        this.velocityX = x;
        this.velocityY = y;
    }
    get acceleration() {
        return new _vector.Vector(this.accelerationX, this.accelerationY, 0);
    }
    set acceleration({ x , y  }) {
        this.accelerationX = x;
        this.accelerationY = y;
    }
    // Rotation angle to point in direction of velocity
    get heading() {
        return _points.pointAngleFromVelocity(this);
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
        const vfriction = this.velocity.normalize().mult(-1).setMag(mu * normal);
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
    attract({ x , y , mass , g  }, mode = 1, affectDist = 1000) {
        if (_points.pointDistance({
            x,
            y
        }, {
            x: this.x,
            y: this.y
        }) < affectDist) {
            g = g || 1;
            const dir = new _vector.Vector(x, y).sub(new _vector.Vector(this.x, this.y));
            const distanceSq = _math.clamp(50, 5000, dir.magSq());
            const strength = mode * (g * (mass * this.mass)) / distanceSq;
            const force = dir.setMag(strength);
            this.applyForce(force);
        }
    }
}
const createRandomParticleValues = ({ width , height  })=>{
    const vel = 2;
    const radius1 = _random.randomNumberBetween(5, 10);
    return {
        radius: radius1,
        x: _random.randomNumberBetween(0, width),
        y: _random.randomNumberBetween(0, height),
        mass: _random.randomNumberBetween(1, 10),
        velocityX: _random.randomNumberBetween(-vel, vel),
        velocityY: _random.randomNumberBetween(-vel, vel),
        accelerationX: 0,
        accelerationY: 0,
        rotation: _random.randomNumberBetween(-180, 180),
        color: {
            r: _random.randomNumberBetween(100, 255),
            g: _random.randomNumberBetween(100, 255),
            b: _random.randomNumberBetween(100, 255)
        }
    };
};
const createRandomStaticParticle = ({ width , height  })=>{
    const props = createRandomParticleValues({
        width,
        height
    });
    props.x = _random.randomWholeBetween(0, width);
    props.y = _random.randomWholeBetween(0, height);
    props.velocityX = 0;
    props.velocityY = 0;
    return new Particle(props);
};
const edgeBounce = ({ width , height  }, particle)=>{
    if (particle.x + particle.radius > width) {
        particle.reverseVelocityX();
        particle.x = width - particle.radius;
    }
    if (particle.x - particle.radius < 0) {
        particle.reverseVelocityX();
        particle.x = particle.radius;
    }
    if (particle.y + particle.radius > height) {
        particle.reverseVelocityY();
        particle.y = height - particle.radius;
    }
    if (particle.y - particle.radius < 0) {
        particle.reverseVelocityY();
        particle.y = particle.radius;
    }
};
const edgeWrap = ({ width , height  }, particle)=>{
    if (particle.x + particle.radius > width) particle.x = 0 + particle.radius;
    else if (particle.x - particle.radius < 0) particle.x = width - particle.radius;
    if (particle.y + particle.radius > height) particle.y = 0 + particle.radius;
    else if (particle.y - particle.radius < 0) particle.y = height - particle.radius;
};

},{"tinycolor2":"101FG","../math/math":"4t0bw","../math/Vector":"1MSqh","../math/random":"1SLuP","../math/points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"101FG":[function(require,module,exports) {
// TinyColor v1.4.2
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License
(function(Math1) {
    var trimLeft = /^\s+/, trimRight = /\s+$/, tinyCounter = 0, mathRound = Math1.round, mathMin = Math1.min, mathMax = Math1.max, mathRandom = Math1.random;
    function tinycolor(color, opts) {
        color = color ? color : '';
        opts = opts || {
        };
        // If input is already a tinycolor, return itself
        if (color instanceof tinycolor) return color;
        // If we are called as a function, call using new instead
        if (!(this instanceof tinycolor)) return new tinycolor(color, opts);
        var rgb = inputToRGB(color);
        this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;
        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1) this._r = mathRound(this._r);
        if (this._g < 1) this._g = mathRound(this._g);
        if (this._b < 1) this._b = mathRound(this._b);
        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    }
    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getOriginalInput: function() {
            return this._originalInput;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            //http://www.w3.org/TR/AERT#color-contrast
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },
        getLuminance: function() {
            //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
            var rgb = this.toRgb();
            var RsRGB, GsRGB, BsRGB, R, G, B;
            RsRGB = rgb.r / 255;
            GsRGB = rgb.g / 255;
            BsRGB = rgb.b / 255;
            if (RsRGB <= 0.03928) R = RsRGB / 12.92;
            else R = Math1.pow((RsRGB + 0.055) / 1.055, 2.4);
            if (GsRGB <= 0.03928) G = GsRGB / 12.92;
            else G = Math1.pow((GsRGB + 0.055) / 1.055, 2.4);
            if (BsRGB <= 0.03928) B = BsRGB / 12.92;
            else B = Math1.pow((BsRGB + 0.055) / 1.055, 2.4);
            return 0.2126 * R + 0.7152 * G + 0.0722 * B;
        },
        setAlpha: function(value) {
            this._a = boundAlpha(value);
            this._roundA = mathRound(100 * this._a) / 100;
            return this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return {
                h: hsv.h * 360,
                s: hsv.s,
                v: hsv.v,
                a: this._a
            };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
            return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return {
                h: hsl.h * 360,
                s: hsl.s,
                l: hsl.l,
                a: this._a
            };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
            return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return '#' + this.toHex(allow3Char);
        },
        toHex8: function(allow4Char) {
            return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
        },
        toHex8String: function(allow4Char) {
            return '#' + this.toHex8(allow4Char);
        },
        toRgb: function() {
            return {
                r: mathRound(this._r),
                g: mathRound(this._g),
                b: mathRound(this._b),
                a: this._a
            };
        },
        toRgbString: function() {
            return this._a == 1 ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return {
                r: mathRound(bound01(this._r, 255) * 100) + "%",
                g: mathRound(bound01(this._g, 255) * 100) + "%",
                b: mathRound(bound01(this._b, 255) * 100) + "%",
                a: this._a
            };
        },
        toPercentageRgbString: function() {
            return this._a == 1 ? "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" : "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
            if (this._a === 0) return "transparent";
            if (this._a < 1) return false;
            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(secondColor) {
            var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
            var secondHex8String = hex8String;
            var gradientType = this._gradientType ? "GradientType = 1, " : "";
            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
            }
            return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;
            var formattedString = false;
            var hasAlpha = this._a < 1 && this._a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" && this._a === 0) return this.toName();
                return this.toRgbString();
            }
            if (format === "rgb") formattedString = this.toRgbString();
            if (format === "prgb") formattedString = this.toPercentageRgbString();
            if (format === "hex" || format === "hex6") formattedString = this.toHexString();
            if (format === "hex3") formattedString = this.toHexString(true);
            if (format === "hex4") formattedString = this.toHex8String(true);
            if (format === "hex8") formattedString = this.toHex8String();
            if (format === "name") formattedString = this.toName();
            if (format === "hsl") formattedString = this.toHslString();
            if (format === "hsv") formattedString = this.toHsvString();
            return formattedString || this.toHexString();
        },
        clone: function() {
            return tinycolor(this.toString());
        },
        _applyModification: function(fn, args) {
            var color = fn.apply(null, [
                this
            ].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },
        _applyCombination: function(fn, args) {
            return fn.apply(null, [
                this
            ].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    };
    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {
            };
            for(var i in color)if (color.hasOwnProperty(i)) {
                if (i === "a") newColor[i] = color[i];
                else newColor[i] = convertToPercentage(color[i]);
            }
            color = newColor;
        }
        return tinycolor(color, opts);
    };
    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {
        var rgb = {
            r: 0,
            g: 0,
            b: 0
        };
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format = false;
        if (typeof color == "string") color = stringInputToObject(color);
        if (typeof color == "object") {
            if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
                s = convertToPercentage(color.s);
                v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, s, v);
                ok = true;
                format = "hsv";
            } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
                s = convertToPercentage(color.s);
                l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, s, l);
                ok = true;
                format = "hsl";
            }
            if (color.hasOwnProperty("a")) a = color.a;
        }
        a = boundAlpha(a);
        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }
    // Conversion Functions
    // --------------------
    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b) {
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }
    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) h = s = 0; // achromatic
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            l: l
        };
    }
    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;
        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 0.5) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        if (s === 0) r = g = b = l; // achromatic
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return {
            r: r * 255,
            g: g * 255,
            b: b * 255
        };
    }
    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;
        var d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max == min) h = 0; // achromatic
        else {
            switch(max){
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            v: v
        };
    }
    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hsvToRgb(h, s, v) {
        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math1.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [
            v,
            q,
            p,
            p,
            t,
            v
        ][mod], g = [
            t,
            v,
            v,
            q,
            p,
            p
        ][mod], b = [
            p,
            p,
            t,
            v,
            v,
            q
        ][mod];
        return {
            r: r * 255,
            g: g * 255,
            b: b * 255
        };
    }
    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {
        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];
        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        return hex.join("");
    }
    // `rgbaToHex`
    // Converts an RGBA color plus alpha transparency to hex
    // Assumes r, g, b are contained in the set [0, 255] and
    // a in [0, 1]. Returns a 4 or 8 character rgba hex
    function rgbaToHex(r, g, b, a, allow4Char) {
        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16)),
            pad2(convertDecimalToHex(a))
        ];
        // Return a 4 character hex if possible
        if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
        return hex.join("");
    }
    // `rgbaToArgbHex`
    // Converts an RGBA color to an ARGB Hex8 string
    // Rarely used, but required for "toFilter()"
    function rgbaToArgbHex(r, g, b, a) {
        var hex = [
            pad2(convertDecimalToHex(a)),
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];
        return hex.join("");
    }
    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function(color1, color2) {
        if (!color1 || !color2) return false;
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };
    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };
    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>
    function desaturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }
    function saturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }
    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }
    function lighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }
    function brighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
        return tinycolor(rgb);
    }
    function darken(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }
    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
    }
    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    }
    function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({
                h: (h + 120) % 360,
                s: hsl.s,
                l: hsl.l
            }),
            tinycolor({
                h: (h + 240) % 360,
                s: hsl.s,
                l: hsl.l
            })
        ];
    }
    function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({
                h: (h + 90) % 360,
                s: hsl.s,
                l: hsl.l
            }),
            tinycolor({
                h: (h + 180) % 360,
                s: hsl.s,
                l: hsl.l
            }),
            tinycolor({
                h: (h + 270) % 360,
                s: hsl.s,
                l: hsl.l
            })
        ];
    }
    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({
                h: (h + 72) % 360,
                s: hsl.s,
                l: hsl.l
            }),
            tinycolor({
                h: (h + 216) % 360,
                s: hsl.s,
                l: hsl.l
            })
        ];
    }
    function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;
        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [
            tinycolor(color)
        ];
        for(hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;){
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    }
    function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;
        while(results--){
            ret.push(tinycolor({
                h: h,
                s: s,
                v: v
            }));
            v = (v + modification) % 1;
        }
        return ret;
    }
    // Utility Functions
    // ---------------------
    tinycolor.mix = function(color1, color2, amount) {
        amount = amount === 0 ? 0 : amount || 50;
        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();
        var p = amount / 100;
        var rgba = {
            r: (rgb2.r - rgb1.r) * p + rgb1.r,
            g: (rgb2.g - rgb1.g) * p + rgb1.g,
            b: (rgb2.b - rgb1.b) * p + rgb1.b,
            a: (rgb2.a - rgb1.a) * p + rgb1.a
        };
        return tinycolor(rgba);
    };
    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
    // `contrast`
    // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
    tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        return (Math1.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math1.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
    };
    // `isReadable`
    // Ensure that foreground and background color combinations meet WCAG2 guidelines.
    // The third argument is an optional Object.
    //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
    //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
    // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
    tinycolor.isReadable = function(color1, color2, wcag2) {
        var readability = tinycolor.readability(color1, color2);
        var wcag2Parms, out;
        out = false;
        wcag2Parms = validateWCAG2Parms(wcag2);
        switch(wcag2Parms.level + wcag2Parms.size){
            case "AAsmall":
            case "AAAlarge":
                out = readability >= 4.5;
                break;
            case "AAlarge":
                out = readability >= 3;
                break;
            case "AAAsmall":
                out = readability >= 7;
                break;
        }
        return out;
    };
    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // Optionally returns Black or White if the most readable color is unreadable.
    // *Example*
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
    tinycolor.mostReadable = function(baseColor, colorList, args) {
        var bestColor = null;
        var bestScore = 0;
        var readability;
        var includeFallbackColors, level, size;
        args = args || {
        };
        includeFallbackColors = args.includeFallbackColors;
        level = args.level;
        size = args.size;
        for(var i = 0; i < colorList.length; i++){
            readability = tinycolor.readability(baseColor, colorList[i]);
            if (readability > bestScore) {
                bestScore = readability;
                bestColor = tinycolor(colorList[i]);
            }
        }
        if (tinycolor.isReadable(baseColor, bestColor, {
            "level": level,
            "size": size
        }) || !includeFallbackColors) return bestColor;
        else {
            args.includeFallbackColors = false;
            return tinycolor.mostReadable(baseColor, [
                "#fff",
                "#000"
            ], args);
        }
    };
    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };
    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);
    // Utilities
    // ---------
    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = {
        };
        for(var i in o)if (o.hasOwnProperty(i)) flipped[o[i]] = i;
        return flipped;
    }
    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);
        if (isNaN(a) || a < 0 || a > 1) a = 1;
        return a;
    }
    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) n = "100%";
        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));
        // Automatically convert percentage into number
        if (processPercent) n = parseInt(n * max, 10) / 100;
        // Handle floating point rounding errors
        if (Math1.abs(n - max) < 0.000001) return 1;
        // Convert into [0, 1] range if it isn't already
        return n % max / parseFloat(max);
    }
    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }
    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }
    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }
    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }
    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }
    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) n = n * 100 + "%";
        return n;
    }
    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
        return Math1.round(parseFloat(d) * 255).toString(16);
    }
    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
    }
    var matchers = function() {
        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";
        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        return {
            CSS_UNIT: new RegExp(CSS_UNIT),
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    }();
    // `isValidCSSUnit`
    // Take in a single string / number and check to see if it looks like a CSS unit
    // (see `matchers` above for definition).
    function isValidCSSUnit(color) {
        return !!matchers.CSS_UNIT.exec(color);
    }
    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {
        color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        } else if (color == 'transparent') return {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            format: "name"
        };
        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if (match = matchers.rgb.exec(color)) return {
            r: match[1],
            g: match[2],
            b: match[3]
        };
        if (match = matchers.rgba.exec(color)) return {
            r: match[1],
            g: match[2],
            b: match[3],
            a: match[4]
        };
        if (match = matchers.hsl.exec(color)) return {
            h: match[1],
            s: match[2],
            l: match[3]
        };
        if (match = matchers.hsla.exec(color)) return {
            h: match[1],
            s: match[2],
            l: match[3],
            a: match[4]
        };
        if (match = matchers.hsv.exec(color)) return {
            h: match[1],
            s: match[2],
            v: match[3]
        };
        if (match = matchers.hsva.exec(color)) return {
            h: match[1],
            s: match[2],
            v: match[3],
            a: match[4]
        };
        if (match = matchers.hex8.exec(color)) return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
        if (match = matchers.hex6.exec(color)) return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
        if (match = matchers.hex4.exec(color)) return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
        if (match = matchers.hex3.exec(color)) return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
        return false;
    }
    function validateWCAG2Parms(parms) {
        // return valid WCAG2 parms for isReadable.
        // If input parms are invalid, return {"level":"AA", "size":"small"}
        var level, size;
        parms = parms || {
            "level": "AA",
            "size": "small"
        };
        level = (parms.level || "AA").toUpperCase();
        size = (parms.size || "small").toLowerCase();
        if (level !== "AA" && level !== "AAA") level = "AA";
        if (size !== "small" && size !== "large") size = "small";
        return {
            "level": level,
            "size": size
        };
    }
    // Node: Export function
    if (typeof module !== "undefined" && module.exports) module.exports = tinycolor;
    else if (typeof define === 'function' && define.amd) define(function() {
        return tinycolor;
    });
    else window.tinycolor = tinycolor;
})(Math);

},{}],"4t0bw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "\u{3c0}", ()=>π
);
parcelHelpers.export(exports, "PI", ()=>PI
);
parcelHelpers.export(exports, "TAU", ()=>TAU
);
parcelHelpers.export(exports, "E", ()=>E
);
parcelHelpers.export(exports, "abs", ()=>abs
);
parcelHelpers.export(exports, "sin", ()=>sin
);
parcelHelpers.export(exports, "cos", ()=>cos
);
parcelHelpers.export(exports, "tan", ()=>tan
);
parcelHelpers.export(exports, "pow", ()=>pow
);
parcelHelpers.export(exports, "round", ()=>round
);
parcelHelpers.export(exports, "floor", ()=>floor
);
parcelHelpers.export(exports, "golden", ()=>golden
);
parcelHelpers.export(exports, "fibonacci", ()=>fibonacci
);
parcelHelpers.export(exports, "checkBoundsLeft", ()=>checkBoundsLeft
);
parcelHelpers.export(exports, "checkBoundsRight", ()=>checkBoundsRight
);
parcelHelpers.export(exports, "clamp", ()=>clamp
);
parcelHelpers.export(exports, "snapNumber", ()=>snapNumber
);
parcelHelpers.export(exports, "percentage", ()=>percentage
);
parcelHelpers.export(exports, "percentageFloor", ()=>percentageFloor
);
parcelHelpers.export(exports, "houghQuantize", ()=>houghQuantize
);
parcelHelpers.export(exports, "quantize", ()=>quantize
);
parcelHelpers.export(exports, "round2", ()=>round2
);
parcelHelpers.export(exports, "roundToNearest", ()=>roundToNearest
);
parcelHelpers.export(exports, "loopingValue", ()=>loopingValue
);
parcelHelpers.export(exports, "pingPontValue", ()=>pingPontValue
);
parcelHelpers.export(exports, "pointOnCircle", ()=>pointOnCircle
);
parcelHelpers.export(exports, "normalize", ()=>normalize
);
parcelHelpers.export(exports, "normalizeInverse", ()=>normalizeInverse
);
parcelHelpers.export(exports, "lerp", ()=>lerp
);
parcelHelpers.export(exports, "invlerp", ()=>invlerp
);
parcelHelpers.export(exports, "mapRange", ()=>mapRange
);
parcelHelpers.export(exports, "isValueInRange", ()=>isValueInRange
);
parcelHelpers.export(exports, "mapToTau", ()=>mapToTau
);
parcelHelpers.export(exports, "logInterval", ()=>logInterval
);
parcelHelpers.export(exports, "angleFromVector", ()=>angleFromVector
);
parcelHelpers.export(exports, "uvFromAngle", ()=>uvFromAngle
);
parcelHelpers.export(exports, "toSinValue", ()=>toSinValue
);
parcelHelpers.export(exports, "radiansToDegrees", ()=>radiansToDegrees
);
parcelHelpers.export(exports, "degreesToRadians", ()=>degreesToRadians
);
parcelHelpers.export(exports, "circleX", ()=>circleX
);
parcelHelpers.export(exports, "circleY", ()=>circleY
);
/*
  Math Snippets
  https://github.com/terkelg/math
*/ var _vector = require("./Vector");
const π = Math.PI;
const { PI  } = Math;
const TAU = Math.PI * 2;
const E = 2.718; // Euler's number rounded of to 3 places
const { abs  } = Math;
const { sin  } = Math;
const { cos  } = Math;
const { tan  } = Math;
const { pow  } = Math;
const { round  } = Math;
const { floor  } = Math;
const golden = 1.618;
const fibonacci = [
    0,
    1,
    1,
    2,
    3,
    5,
    8,
    13,
    21,
    34,
    55,
    89,
    144,
    233,
    377,
    610,
    987,
    1597,
    2584,
    4181,
    6765,
    10946,
    17711,
    28657,
    46368,
    75025,
    121393,
    196418,
    317811, 
];
const checkBoundsLeft = (b, v)=>v < b ? b : v
;
const checkBoundsRight = (b, v)=>v > b ? b : v
;
const clamp = (min = 0, max = 1, a)=>Math.min(max, Math.max(min, a))
;
const snapNumber = (snap, n)=>Math.floor(n / snap) * snap
;
const percentage = (total, num)=>Math.round(num * (total / 100))
;
const percentageFloor = (total, num)=>Math.floor(num * (total / 100))
;
const houghQuantize = (numAngles, theta)=>Math.floor(numAngles * theta / TAU + 0.5)
;
const quantize = (numAngles, theta)=>(Math.round(theta * (numAngles / Math.PI)) + numAngles) % numAngles
;
const round2 = (num)=>Math.round((num + Number.EPSILON) * 100) / 100
;
const roundToNearest = (near, num)=>Math.round(num / near) * near
;
const loopingValue = (t, m = 0.5)=>Math.sin(t * m)
;
const pingPontValue = (t)=>Math.sin(t * Math.PI)
;
const pointOnCircle = (x, y, r, a)=>({
        x: r * Math.sin(a) + x,
        y: r * Math.cos(a) + y
    })
;
const normalize = (min, max, val)=>(val - min) / (max - min)
;
const normalizeInverse = (min, max, val)=>1 - normalize(min, max, val)
;
const lerp = (x, y, a)=>x * (1 - a) + y * a
;
const invlerp = (x, y, a)=>clamp(0, 1, (a - x) / (y - x))
;
const mapRange = (x1, y1, x2, y2, a)=>lerp(x2, y2, invlerp(x1, y1, a))
;
const isValueInRange = (testVal, val, range)=>val === testVal || val - range < testVal && val + range > testVal
;
const mapToTau = (start, end, value)=>mapRange(start, end, 0, TAU, value)
;
const logInterval = (total_intervals, start, end)=>{
    const startInterVal = 1;
    const endInterval = total_intervals;
    const minLog = Math.log(start);
    const maxLog = Math.log(end);
    const scale = (maxLog - minLog) / (endInterval - startInterVal);
    const result = [];
    for(let i = 1; i < total_intervals; i++)result.push(Math.exp(minLog + scale * (i - startInterVal)));
    result.push(end);
    return result;
};
const angleFromVector = ({ x , y  })=>Math.atan2(y, x)
;
const uvFromAngle = (a)=>new _vector.Vector(Math.cos(a), Math.sin(a))
;
const toSinValue = (value)=>Math.abs(Math.sin(value * TAU))
;
const radiansToDegrees = (rad)=>rad * 180 / Math.PI
;
const degreesToRadians = (deg)=>deg * Math.PI / 180
;
const circleX = (theta, amp, freq)=>Math.cos(theta / freq) * amp
;
const circleY = (theta, amp, freq)=>Math.sin(theta / freq) * amp
;

},{"./Vector":"1MSqh","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"1MSqh":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Vector", ()=>Vector
);
// Vector class originally from https://evanw.github.io/lightgl.js/docs/vector.html
// Edited and expanded to match p5's vectors
// ref - p5 vector https://p5js.org/reference/#/p5.Vector
// https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/more-vector-math
const fromAngles = (theta, phi)=>new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi))
;
const randomDirection = ()=>fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1))
;
const min = (a, b)=>new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z))
;
const max = (a, b)=>new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z))
;
const lerp = (a, b, fraction)=>b.sub(a).mult(fraction).add(a)
;
const fromArray = (a)=>new Vector(a[0], a[1], a[2])
;
const angleBetween = (a, b)=>a.angleTo(b)
;
class Vector {
    constructor(x, y, z){
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    toString() {
        return `${this.x}, ${this.y}`;
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
        if (cm > v) return this.setMag(v);
        return this;
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length())
        };
    }
    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }
    toArray(n) {
        return [
            this.x,
            this.y,
            this.z
        ].slice(0, n || 3);
    }
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    ceil() {
        return new Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }
    floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }
    round() {
        return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }
}
const negative = (a, b)=>{
    b.x = -a.x;
    b.y = -a.y;
    b.z = -a.z;
    return b;
};
const add = (a, b, c)=>{
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
const subtract = (a, b, c)=>{
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
const multiply = (a, b, c)=>{
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
const divide = (a, b, c)=>{
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
const cross = (a, b, c)=>{
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;
    return c;
};
const unit = (a, b)=>{
    const length = a.length();
    b.x = a.x / length;
    b.y = a.y / length;
    b.z = a.z / length;
    return b;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"367CR":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule') return;
        // Skip duplicate re-exports when they have the same value.
        if (key in dest && dest[key] === source[key]) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"1SLuP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getRandomSeed", ()=>getRandomSeed
);
parcelHelpers.export(exports, "setRandomSeed", ()=>setRandomSeed
);
parcelHelpers.export(exports, "randomNormalBM", ()=>randomNormalBM
);
parcelHelpers.export(exports, "randomNormalBM2", ()=>randomNormalBM2
);
parcelHelpers.export(exports, "randomNormalNumberBetween", ()=>randomNormalNumberBetween
);
parcelHelpers.export(exports, "randomNormalWholeBetween", ()=>randomNormalWholeBetween
);
parcelHelpers.export(exports, "randomNumberBetween", ()=>randomNumberBetween
);
parcelHelpers.export(exports, "randomWholeBetween", ()=>randomWholeBetween
);
parcelHelpers.export(exports, "randomNumberBetweenMid", ()=>randomNumberBetweenMid
);
parcelHelpers.export(exports, "random", ()=>random
);
parcelHelpers.export(exports, "randomN", ()=>randomN
);
parcelHelpers.export(exports, "randomSign", ()=>randomSign
);
parcelHelpers.export(exports, "randomBoolean", ()=>randomBoolean
);
parcelHelpers.export(exports, "randomChance", ()=>randomChance
);
parcelHelpers.export(exports, "oneOf", ()=>oneOf
);
parcelHelpers.export(exports, "createRandomNumberArray", ()=>createRandomNumberArray
);
parcelHelpers.export(exports, "create2dNoise", ()=>create2dNoise
);
parcelHelpers.export(exports, "create2dNoiseAbs", ()=>create2dNoiseAbs
);
parcelHelpers.export(exports, "create3dNoise", ()=>create3dNoise
);
parcelHelpers.export(exports, "create3dNoiseAbs", ()=>create3dNoiseAbs
);
parcelHelpers.export(exports, "randomPointAround", ()=>randomPointAround
);
var _random = require("canvas-sketch-util/random");
var _randomDefault = parcelHelpers.interopDefault(_random);
var _math = require("./math");
_randomDefault.default.setSeed(_randomDefault.default.getRandomSeed());
console.log(`Using seed ${_randomDefault.default.getSeed()}`);
const getRandomSeed = ()=>_randomDefault.default.getSeed()
;
const setRandomSeed = (s)=>_randomDefault.default.setRandomSeed(s)
;
const randomNormalBM = ()=>{
    let u = 0;
    let v = 0;
    while(u === 0)u = _randomDefault.default.value(); // Converting [0,1) to (0,1)
    while(v === 0)v = _randomDefault.default.value();
    let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    num = num / 10 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randomNormalBM(); // resample between 0 and 1
    return num;
};
const randomNormalBM2 = (min = 0, max = 1, skew = 1)=>{
    let u = 0;
    let v = 0;
    while(u === 0)u = _randomDefault.default.value(); // Converting [0,1) to (0,1)
    while(v === 0)v = _randomDefault.default.value();
    let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    num = num / 10 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) // // resample between 0 and 1 if out of range
    num = randomNormalBM2(min, max, skew);
    else {
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
    }
    return num;
};
const randomNormalNumberBetween = (min, max)=>randomNormalBM() * (max - min) + min
;
const randomNormalWholeBetween = (min, max)=>Math.round(randomNormalBM() * (max - min) + min)
;
const randomNumberBetween = (min, max)=>_randomDefault.default.valueNonZero() * (max - min) + min
;
const randomWholeBetween = (min, max)=>Math.floor(_randomDefault.default.value() * (max - min) + min)
;
const randomNumberBetweenMid = (min, max)=>randomNumberBetween(min, max) - max / 2
;
const random = (max)=>max > 0 ? randomWholeBetween(0, max) : randomWholeBetween(max, 0)
;
const randomN = (max)=>max > 0 ? randomNormalWholeBetween(0, max) : randomNormalWholeBetween(max, 0)
;
const randomSign = ()=>Math.round(_randomDefault.default.value()) === 1 ? 1 : -1
;
const randomBoolean = ()=>Math.round(_randomDefault.default.value()) === 1
;
const randomChance = (chance = 0.5)=>_randomDefault.default.chance(chance)
;
const oneOf = (arry)=>{
    const i = randomWholeBetween(0, arry.length - 1);
    return arry[i];
};
const createRandomNumberArray = (len, min, max)=>Array.from(new Array(len)).map(()=>randomNumberBetween(min, max)
    )
;
const create2dNoise = (u, v, amplitude = 1, frequency = 0.5)=>_randomDefault.default.noise2D(u * frequency, v * frequency) * amplitude
;
const create2dNoiseAbs = (u, v, amplitude = 1, frequency = 0.5)=>Math.abs(_randomDefault.default.noise2D(u * frequency, v * frequency)) * amplitude
;
const create3dNoise = (u, v, t, amplitude = 1, frequency = 0.5)=>_randomDefault.default.noise3D(u * frequency, v * frequency, t * frequency) * amplitude
;
const create3dNoiseAbs = (u, v, t, amplitude = 1, frequency = 0.5)=>Math.abs(_randomDefault.default.noise3D(u * frequency, v * frequency, t * frequency)) * amplitude
;
const randomPointAround = (range = 20)=>{
    const radius = randomWholeBetween(0, range);
    const angle = randomNumberBetween(0, _math.TAU);
    return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
    };
};

},{"canvas-sketch-util/random":"5RUiF","./math":"4t0bw","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"5RUiF":[function(require,module,exports) {
var seedRandom = require('seed-random');
var SimplexNoise = require('simplex-noise');
var defined = require('defined');
function createRandom(defaultSeed) {
    defaultSeed = defined(defaultSeed, null);
    var defaultRandom = Math.random;
    var currentSeed;
    var currentRandom;
    var noiseGenerator;
    var _nextGaussian = null;
    var _hasNextGaussian = false;
    setSeed(defaultSeed);
    function setSeed(seed, opt) {
        if (typeof seed === 'number' || typeof seed === 'string') {
            currentSeed = seed;
            currentRandom = seedRandom(currentSeed, opt);
        } else {
            currentSeed = undefined;
            currentRandom = defaultRandom;
        }
        noiseGenerator = createNoise();
        _nextGaussian = null;
        _hasNextGaussian = false;
    }
    function value() {
        return currentRandom();
    }
    function valueNonZero() {
        var u = 0;
        while(u === 0)u = value();
        return u;
    }
    function getSeed() {
        return currentSeed;
    }
    function getRandomSeed() {
        var seed = String(Math.floor(Math.random() * 1000000));
        return seed;
    }
    function createNoise() {
        return new SimplexNoise(currentRandom);
    }
    function permuteNoise() {
        noiseGenerator = createNoise();
    }
    function noise1D(x, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise2D(x * frequency, 0);
    }
    function noise2D(x, y, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);
    }
    function noise3D(x, y, z, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
        if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise3D(x * frequency, y * frequency, z * frequency);
    }
    function noise4D(x, y, z, w, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
        if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
        if (!isFinite(w)) throw new TypeError('w component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise4D(x * frequency, y * frequency, z * frequency, w * frequency);
    }
    function sign() {
        return boolean() ? 1 : -1;
    }
    function boolean() {
        return value() > 0.5;
    }
    function chance(n) {
        n = defined(n, 0.5);
        if (typeof n !== 'number') throw new TypeError('expected n to be a number');
        return value() < n;
    }
    function range(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new TypeError('Expected all arguments to be numbers');
        }
        return value() * (max - min) + min;
    }
    function rangeFloor(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new TypeError('Expected all arguments to be numbers');
        }
        return Math.floor(range(min, max));
    }
    function pick(array) {
        if (array.length === 0) return undefined;
        return array[rangeFloor(0, array.length)];
    }
    function shuffle(arr) {
        if (!Array.isArray(arr)) {
            throw new TypeError('Expected Array, got ' + typeof arr);
        }
        var rand;
        var tmp;
        var len = arr.length;
        var ret = arr.slice();
        while(len){
            rand = Math.floor(value() * len--);
            tmp = ret[len];
            ret[len] = ret[rand];
            ret[rand] = tmp;
        }
        return ret;
    }
    function onCircle(radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        var theta = value() * 2 * Math.PI;
        out[0] = radius * Math.cos(theta);
        out[1] = radius * Math.sin(theta);
        return out;
    }
    function insideCircle(radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        onCircle(1, out);
        var r = radius * Math.sqrt(value());
        out[0] *= r;
        out[1] *= r;
        return out;
    }
    function onSphere(radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        var u = value() * Math.PI * 2;
        var v = value() * 2 - 1;
        var phi = u;
        var theta = Math.acos(v);
        out[0] = radius * Math.sin(theta) * Math.cos(phi);
        out[1] = radius * Math.sin(theta) * Math.sin(phi);
        out[2] = radius * Math.cos(theta);
        return out;
    }
    function insideSphere(radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        var u = value() * Math.PI * 2;
        var v = value() * 2 - 1;
        var k = value();
        var phi = u;
        var theta = Math.acos(v);
        var r = radius * Math.cbrt(k);
        out[0] = r * Math.sin(theta) * Math.cos(phi);
        out[1] = r * Math.sin(theta) * Math.sin(phi);
        out[2] = r * Math.cos(theta);
        return out;
    }
    function quaternion(out) {
        out = out || [];
        var u1 = value();
        var u2 = value();
        var u3 = value();
        var sq1 = Math.sqrt(1 - u1);
        var sq2 = Math.sqrt(u1);
        var theta1 = Math.PI * 2 * u2;
        var theta2 = Math.PI * 2 * u3;
        var x = Math.sin(theta1) * sq1;
        var y = Math.cos(theta1) * sq1;
        var z = Math.sin(theta2) * sq2;
        var w = Math.cos(theta2) * sq2;
        out[0] = x;
        out[1] = y;
        out[2] = z;
        out[3] = w;
        return out;
    }
    function weightedSet(set) {
        set = set || [];
        if (set.length === 0) return null;
        return set[weightedSetIndex(set)].value;
    }
    function weightedSetIndex(set) {
        set = set || [];
        if (set.length === 0) return -1;
        return weighted(set.map(function(s) {
            return s.weight;
        }));
    }
    function weighted(weights) {
        weights = weights || [];
        if (weights.length === 0) return -1;
        var totalWeight = 0;
        var i;
        for(i = 0; i < weights.length; i++){
            totalWeight += weights[i];
        }
        if (totalWeight <= 0) throw new Error('Weights must sum to > 0');
        var random = value() * totalWeight;
        for(i = 0; i < weights.length; i++){
            if (random < weights[i]) {
                return i;
            }
            random -= weights[i];
        }
        return 0;
    }
    function gaussian(mean, standardDerivation) {
        mean = defined(mean, 0);
        standardDerivation = defined(standardDerivation, 1);
        // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/Random.java#L496
        if (_hasNextGaussian) {
            _hasNextGaussian = false;
            var result = _nextGaussian;
            _nextGaussian = null;
            return mean + standardDerivation * result;
        } else {
            var v1 = 0;
            var v2 = 0;
            var s = 0;
            do {
                v1 = value() * 2 - 1; // between -1 and 1
                v2 = value() * 2 - 1; // between -1 and 1
                s = v1 * v1 + v2 * v2;
            }while (s >= 1 || s === 0)
            var multiplier = Math.sqrt(-2 * Math.log(s) / s);
            _nextGaussian = v2 * multiplier;
            _hasNextGaussian = true;
            return mean + standardDerivation * (v1 * multiplier);
        }
    }
    return {
        value: value,
        createRandom: function(defaultSeed1) {
            return createRandom(defaultSeed1);
        },
        setSeed: setSeed,
        getSeed: getSeed,
        getRandomSeed: getRandomSeed,
        valueNonZero: valueNonZero,
        permuteNoise: permuteNoise,
        noise1D: noise1D,
        noise2D: noise2D,
        noise3D: noise3D,
        noise4D: noise4D,
        sign: sign,
        boolean: boolean,
        chance: chance,
        range: range,
        rangeFloor: rangeFloor,
        pick: pick,
        shuffle: shuffle,
        onCircle: onCircle,
        insideCircle: insideCircle,
        onSphere: onSphere,
        insideSphere: insideSphere,
        quaternion: quaternion,
        weighted: weighted,
        weightedSet: weightedSet,
        weightedSetIndex: weightedSetIndex,
        gaussian: gaussian
    };
}
module.exports = createRandom();

},{"seed-random":"6XvHO","simplex-noise":"3HhyW","defined":"aqK2o"}],"6XvHO":[function(require,module,exports) {
var global = arguments[3];
'use strict';
var width = 256; // each RC4 output is 0 <= x < 256
var chunks = 6; // at least six RC4 outputs for each double
var digits = 52; // there are 52 significant digits in a double
var pool = []; // pool: entropy pool starts empty
var GLOBAL = typeof global === 'undefined' ? window : global;
//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks), significance = Math.pow(2, digits), overflow = significance * 2, mask = width - 1;
var oldRandom = Math.random;
//
// seedrandom()
// This is the seedrandom function described above.
//
module.exports = function(seed, options) {
    if (options && options.global === true) {
        options.global = false;
        Math.random = module.exports(seed, options);
        options.global = true;
        return Math.random;
    }
    var use_entropy = options && options.entropy || false;
    var key = [];
    // Flatten the seed string or build one from local entropy if needed.
    var shortseed = mixkey(flatten(use_entropy ? [
        seed,
        tostring(pool)
    ] : 0 in arguments ? seed : autoseed(), 3), key);
    // Use the seed to initialize an ARC4 generator.
    var arc4 = new ARC4(key);
    // Mix the randomness into accumulated entropy.
    mixkey(tostring(arc4.S), pool);
    // Override Math.random
    // This function returns a random double in [0, 1) that contains
    // randomness in every bit of the mantissa of the IEEE 754 value.
    return function() {
        var n = arc4.g(chunks), d = startdenom, x = 0; //   and no 'extra last byte'.
        while(n < significance){
            n = (n + x) * width; //   shifting numerator and
            d *= width; //   denominator and generating a
            x = arc4.g(1); //   new least-significant-byte.
        }
        while(n >= overflow){
            n /= 2; //   last byte, shift everything
            d /= 2; //   right using integer Math until
            x >>>= 1; //   we have exactly the desired bits.
        }
        return (n + x) / d; // Form the number within [0, 1).
    };
};
module.exports.resetGlobal = function() {
    Math.random = oldRandom;
};
//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */ function ARC4(key) {
    var t, keylen = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
    // The empty key [] is treated as [0].
    if (!keylen) key = [
        keylen++
    ];
    // Set up S using the standard key scheduling algorithm.
    while(i < width)s[i] = i++;
    for(i = 0; i < width; i++){
        s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
        s[j] = t;
    }
    // The "g" method returns the next (count) outputs as one number.
    (me.g = function(count) {
        // Using instance members instead of closure state nearly doubles speed.
        var t1, r = 0, i1 = me.i, j1 = me.j, s1 = me.S;
        while(count--){
            t1 = s1[i1 = mask & i1 + 1];
            r = r * width + s1[mask & (s1[i1] = s1[j1 = mask & j1 + t1]) + (s1[j1] = t1)];
        }
        me.i = i1;
        me.j = j1;
        return r;
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
    })(width);
}
//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
    var result = [], typ = (typeof obj)[0], prop;
    if (depth && typ == 'o') {
        for(prop in obj)try {
            result.push(flatten(obj[prop], depth - 1));
        } catch (e) {
        }
    }
    return result.length ? result : typ == 's' ? obj : obj + '\0';
}
//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
    var stringseed = seed + '', smear, j = 0;
    while(j < stringseed.length)key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
    return tostring(key);
}
//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */ function autoseed(seed) {
    try {
        GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
        return tostring(seed);
    } catch (e) {
        return [
            +new Date,
            GLOBAL,
            GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen,
            tostring(pool)
        ];
    }
}
//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
    return String.fromCharCode.apply(0, a);
}
//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);

},{}],"3HhyW":[function(require,module,exports) {
/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.


 Copyright (c) 2018 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */ (function() {
    var F2 = 0.5 * (Math.sqrt(3) - 1);
    var G2 = (3 - Math.sqrt(3)) / 6;
    var F3 = 1 / 3;
    var G3 = 1 / 6;
    var F4 = (Math.sqrt(5) - 1) / 4;
    var G4 = (5 - Math.sqrt(5)) / 20;
    function SimplexNoise(randomOrSeed) {
        var random;
        if (typeof randomOrSeed == 'function') random = randomOrSeed;
        else if (randomOrSeed) random = alea(randomOrSeed);
        else random = Math.random;
        this.p = buildPermutationTable(random);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for(var i = 0; i < 512; i++){
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }
    SimplexNoise.prototype = {
        grad3: new Float32Array([
            1,
            1,
            0,
            -1,
            1,
            0,
            1,
            -1,
            0,
            -1,
            -1,
            0,
            1,
            0,
            1,
            -1,
            0,
            1,
            1,
            0,
            -1,
            -1,
            0,
            -1,
            0,
            1,
            1,
            0,
            -1,
            1,
            0,
            1,
            -1,
            0,
            -1,
            -1
        ]),
        grad4: new Float32Array([
            0,
            1,
            1,
            1,
            0,
            1,
            1,
            -1,
            0,
            1,
            -1,
            1,
            0,
            1,
            -1,
            -1,
            0,
            -1,
            1,
            1,
            0,
            -1,
            1,
            -1,
            0,
            -1,
            -1,
            1,
            0,
            -1,
            -1,
            -1,
            1,
            0,
            1,
            1,
            1,
            0,
            1,
            -1,
            1,
            0,
            -1,
            1,
            1,
            0,
            -1,
            -1,
            -1,
            0,
            1,
            1,
            -1,
            0,
            1,
            -1,
            -1,
            0,
            -1,
            1,
            -1,
            0,
            -1,
            -1,
            1,
            1,
            0,
            1,
            1,
            1,
            0,
            -1,
            1,
            -1,
            0,
            1,
            1,
            -1,
            0,
            -1,
            -1,
            1,
            0,
            1,
            -1,
            1,
            0,
            -1,
            -1,
            -1,
            0,
            1,
            -1,
            -1,
            0,
            -1,
            1,
            1,
            1,
            0,
            1,
            1,
            -1,
            0,
            1,
            -1,
            1,
            0,
            1,
            -1,
            -1,
            0,
            -1,
            1,
            1,
            0,
            -1,
            1,
            -1,
            0,
            -1,
            -1,
            1,
            0,
            -1,
            -1,
            -1,
            0
        ]),
        noise2D: function(xin, yin) {
            var permMod12 = this.permMod12;
            var perm = this.perm;
            var grad3 = this.grad3;
            var n0 = 0; // Noise contributions from the three corners
            var n1 = 0;
            var n2 = 0;
            // Skew the input space to determine which simplex cell we're in
            var s = (xin + yin) * F2; // Hairy factor for 2D
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var t = (i + j) * G2;
            var X0 = i - t; // Unskew the cell origin back to (x,y) space
            var Y0 = j - t;
            var x0 = xin - X0; // The x,y distances from the cell origin
            var y0 = yin - Y0;
            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we are in.
            var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
            if (x0 > y0) {
                i1 = 1;
                j1 = 0;
            } else {
                i1 = 0;
                j1 = 1;
            } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
            // c = (3-sqrt(3))/6
            var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
            var y1 = y0 - j1 + G2;
            var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
            var y2 = y0 - 1 + 2 * G2;
            // Work out the hashed gradient indices of the three simplex corners
            var ii = i & 255;
            var jj = j & 255;
            // Calculate the contribution from the three corners
            var t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 >= 0) {
                var gi0 = permMod12[ii + perm[jj]] * 3;
                t0 *= t0;
                n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
            }
            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 >= 0) {
                var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
                t1 *= t1;
                n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
            }
            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 >= 0) {
                var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
                t2 *= t2;
                n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
            }
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            return 70 * (n0 + n1 + n2);
        },
        // 3D simplex noise
        noise3D: function(xin, yin, zin) {
            var permMod12 = this.permMod12;
            var perm = this.perm;
            var grad3 = this.grad3;
            var n0, n1, n2, n3; // Noise contributions from the four corners
            // Skew the input space to determine which simplex cell we're in
            var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var k = Math.floor(zin + s);
            var t = (i + j + k) * G3;
            var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
            var Y0 = j - t;
            var Z0 = k - t;
            var x0 = xin - X0; // The x,y,z distances from the cell origin
            var y0 = yin - Y0;
            var z0 = zin - Z0;
            // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
            // Determine which simplex we are in.
            var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
            var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
            if (x0 >= y0) {
                if (y0 >= z0) {
                    i1 = 1;
                    j1 = 0;
                    k1 = 0;
                    i2 = 1;
                    j2 = 1;
                    k2 = 0;
                } else if (x0 >= z0) {
                    i1 = 1;
                    j1 = 0;
                    k1 = 0;
                    i2 = 1;
                    j2 = 0;
                    k2 = 1;
                } else {
                    i1 = 0;
                    j1 = 0;
                    k1 = 1;
                    i2 = 1;
                    j2 = 0;
                    k2 = 1;
                } // Z X Y order
            } else {
                if (y0 < z0) {
                    i1 = 0;
                    j1 = 0;
                    k1 = 1;
                    i2 = 0;
                    j2 = 1;
                    k2 = 1;
                } else if (x0 < z0) {
                    i1 = 0;
                    j1 = 1;
                    k1 = 0;
                    i2 = 0;
                    j2 = 1;
                    k2 = 1;
                } else {
                    i1 = 0;
                    j1 = 1;
                    k1 = 0;
                    i2 = 1;
                    j2 = 1;
                    k2 = 0;
                } // Y X Z order
            }
            // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
            // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
            // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
            // c = 1/6.
            var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
            var y1 = y0 - j1 + G3;
            var z1 = z0 - k1 + G3;
            var x2 = x0 - i2 + 2 * G3; // Offsets for third corner in (x,y,z) coords
            var y2 = y0 - j2 + 2 * G3;
            var z2 = z0 - k2 + 2 * G3;
            var x3 = x0 - 1 + 3 * G3; // Offsets for last corner in (x,y,z) coords
            var y3 = y0 - 1 + 3 * G3;
            var z3 = z0 - 1 + 3 * G3;
            // Work out the hashed gradient indices of the four simplex corners
            var ii = i & 255;
            var jj = j & 255;
            var kk = k & 255;
            // Calculate the contribution from the four corners
            var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
            if (t0 < 0) n0 = 0;
            else {
                var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
                t0 *= t0;
                n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
            }
            var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
            if (t1 < 0) n1 = 0;
            else {
                var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
                t1 *= t1;
                n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
            }
            var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
            if (t2 < 0) n2 = 0;
            else {
                var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
                t2 *= t2;
                n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
            }
            var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
            if (t3 < 0) n3 = 0;
            else {
                var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
                t3 *= t3;
                n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
            }
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to stay just inside [-1,1]
            return 32 * (n0 + n1 + n2 + n3);
        },
        // 4D simplex noise, better simplex rank ordering method 2012-03-09
        noise4D: function(x, y, z, w) {
            var perm = this.perm;
            var grad4 = this.grad4;
            var n0, n1, n2, n3, n4; // Noise contributions from the five corners
            // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
            var s = (x + y + z + w) * F4; // Factor for 4D skewing
            var i = Math.floor(x + s);
            var j = Math.floor(y + s);
            var k = Math.floor(z + s);
            var l = Math.floor(w + s);
            var t = (i + j + k + l) * G4; // Factor for 4D unskewing
            var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
            var Y0 = j - t;
            var Z0 = k - t;
            var W0 = l - t;
            var x0 = x - X0; // The x,y,z,w distances from the cell origin
            var y0 = y - Y0;
            var z0 = z - Z0;
            var w0 = w - W0;
            // For the 4D case, the simplex is a 4D shape I won't even try to describe.
            // To find out which of the 24 possible simplices we're in, we need to
            // determine the magnitude ordering of x0, y0, z0 and w0.
            // Six pair-wise comparisons are performed between each possible pair
            // of the four coordinates, and the results are used to rank the numbers.
            var rankx = 0;
            var ranky = 0;
            var rankz = 0;
            var rankw = 0;
            if (x0 > y0) rankx++;
            else ranky++;
            if (x0 > z0) rankx++;
            else rankz++;
            if (x0 > w0) rankx++;
            else rankw++;
            if (y0 > z0) ranky++;
            else rankz++;
            if (y0 > w0) ranky++;
            else rankw++;
            if (z0 > w0) rankz++;
            else rankw++;
            var i1, j1, k1, l1; // The integer offsets for the second simplex corner
            var i2, j2, k2, l2; // The integer offsets for the third simplex corner
            var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
            // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
            // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
            // impossible. Only the 24 indices which have non-zero entries make any sense.
            // We use a thresholding to set the coordinates in turn from the largest magnitude.
            // Rank 3 denotes the largest coordinate.
            i1 = rankx >= 3 ? 1 : 0;
            j1 = ranky >= 3 ? 1 : 0;
            k1 = rankz >= 3 ? 1 : 0;
            l1 = rankw >= 3 ? 1 : 0;
            // Rank 2 denotes the second largest coordinate.
            i2 = rankx >= 2 ? 1 : 0;
            j2 = ranky >= 2 ? 1 : 0;
            k2 = rankz >= 2 ? 1 : 0;
            l2 = rankw >= 2 ? 1 : 0;
            // Rank 1 denotes the second smallest coordinate.
            i3 = rankx >= 1 ? 1 : 0;
            j3 = ranky >= 1 ? 1 : 0;
            k3 = rankz >= 1 ? 1 : 0;
            l3 = rankw >= 1 ? 1 : 0;
            // The fifth corner has all coordinate offsets = 1, so no need to compute that.
            var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
            var y1 = y0 - j1 + G4;
            var z1 = z0 - k1 + G4;
            var w1 = w0 - l1 + G4;
            var x2 = x0 - i2 + 2 * G4; // Offsets for third corner in (x,y,z,w) coords
            var y2 = y0 - j2 + 2 * G4;
            var z2 = z0 - k2 + 2 * G4;
            var w2 = w0 - l2 + 2 * G4;
            var x3 = x0 - i3 + 3 * G4; // Offsets for fourth corner in (x,y,z,w) coords
            var y3 = y0 - j3 + 3 * G4;
            var z3 = z0 - k3 + 3 * G4;
            var w3 = w0 - l3 + 3 * G4;
            var x4 = x0 - 1 + 4 * G4; // Offsets for last corner in (x,y,z,w) coords
            var y4 = y0 - 1 + 4 * G4;
            var z4 = z0 - 1 + 4 * G4;
            var w4 = w0 - 1 + 4 * G4;
            // Work out the hashed gradient indices of the five simplex corners
            var ii = i & 255;
            var jj = j & 255;
            var kk = k & 255;
            var ll = l & 255;
            // Calculate the contribution from the five corners
            var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
            if (t0 < 0) n0 = 0;
            else {
                var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
                t0 *= t0;
                n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
            }
            var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
            if (t1 < 0) n1 = 0;
            else {
                var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
                t1 *= t1;
                n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
            }
            var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
            if (t2 < 0) n2 = 0;
            else {
                var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
                t2 *= t2;
                n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
            }
            var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
            if (t3 < 0) n3 = 0;
            else {
                var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
                t3 *= t3;
                n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
            }
            var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
            if (t4 < 0) n4 = 0;
            else {
                var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
                t4 *= t4;
                n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
            }
            // Sum up and scale the result to cover the range [-1,1]
            return 27 * (n0 + n1 + n2 + n3 + n4);
        }
    };
    function buildPermutationTable(random) {
        var i;
        var p = new Uint8Array(256);
        for(i = 0; i < 256; i++)p[i] = i;
        for(i = 0; i < 255; i++){
            var r = i + ~~(random() * (256 - i));
            var aux = p[i];
            p[i] = p[r];
            p[r] = aux;
        }
        return p;
    }
    SimplexNoise._buildPermutationTable = buildPermutationTable;
    function alea() {
        // Johannes Baagøe <baagoe@baagoe.com>, 2010
        var s0 = 0;
        var s1 = 0;
        var s2 = 0;
        var c = 1;
        var mash = masher();
        s0 = mash(' ');
        s1 = mash(' ');
        s2 = mash(' ');
        for(var i = 0; i < arguments.length; i++){
            s0 -= mash(arguments[i]);
            if (s0 < 0) s0 += 1;
            s1 -= mash(arguments[i]);
            if (s1 < 0) s1 += 1;
            s2 -= mash(arguments[i]);
            if (s2 < 0) s2 += 1;
        }
        mash = null;
        return function() {
            var t = 2091639 * s0 + c * 0.00000000023283064365386963; // 2^-32
            s0 = s1;
            s1 = s2;
            return s2 = t - (c = t | 0);
        };
    }
    function masher() {
        var n = 4022871197;
        return function(data) {
            data = data.toString();
            for(var i = 0; i < data.length; i++){
                n += data.charCodeAt(i);
                var h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 4294967296; // 2^32
            }
            return (n >>> 0) * 0.00000000023283064365386963; // 2^-32
        };
    }
    // amd
    if (typeof define !== 'undefined' && define.amd) define(function() {
        return SimplexNoise;
    });
    // common js
    if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise;
    else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
    // nodejs
    if (typeof module !== 'undefined') module.exports = SimplexNoise;
})();

},{}],"aqK2o":[function(require,module,exports) {
module.exports = function() {
    for(var i = 0; i < arguments.length; i++){
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],"4RQVg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "point", ()=>point
);
parcelHelpers.export(exports, "pointA", ()=>pointA
);
parcelHelpers.export(exports, "midPoint", ()=>midPoint
);
parcelHelpers.export(exports, "pointObjectToPointArray", ()=>pointObjectToPointArray
);
parcelHelpers.export(exports, "pointArrayToPointObject", ()=>pointArrayToPointObject
);
parcelHelpers.export(exports, "pointArrayToVector", ()=>pointArrayToVector
);
parcelHelpers.export(exports, "vectorToPointArray", ()=>vectorToPointArray
);
parcelHelpers.export(exports, "arrayPointArrayToObjectArray", ()=>arrayPointArrayToObjectArray
);
parcelHelpers.export(exports, "arrayPointArrayToVectorArray", ()=>arrayPointArrayToVectorArray
);
parcelHelpers.export(exports, "arrayVectorToPointArray", ()=>arrayVectorToPointArray
);
parcelHelpers.export(exports, "flattenPointArray", ()=>flattenPointArray
);
parcelHelpers.export(exports, "unflattenPointArray", ()=>unflattenPointArray
);
parcelHelpers.export(exports, "uvPointToCanvas", ()=>uvPointToCanvas
);
parcelHelpers.export(exports, "pointDistance", ()=>pointDistance
);
parcelHelpers.export(exports, "midpoint", ()=>midpoint
);
parcelHelpers.export(exports, "pointRotateCoord", ()=>pointRotateCoord
);
parcelHelpers.export(exports, "pointAngleFromVelocity", ()=>pointAngleFromVelocity
);
parcelHelpers.export(exports, "scalePointToCanvas", ()=>scalePointToCanvas
);
parcelHelpers.export(exports, "pointsOrientation", ()=>pointsOrientation
);
parcelHelpers.export(exports, "pointsFromSegment", ()=>pointsFromSegment
);
parcelHelpers.export(exports, "trimPointArray", ()=>trimPointArray
);
parcelHelpers.export(exports, "createSplineFromPointArray", ()=>createSplineFromPointArray
);
var _vector = require("./Vector");
var _math = require("./math");
var _curveCalc = require("./curve-calc");
const point = (x, y)=>({
        x,
        y
    })
;
const pointA = (x, y)=>[
        x,
        y
    ]
;
const midPoint = (a, b)=>Math.round((b - a) / 2) + a
;
const pointObjectToPointArray = (p)=>[
        p.x,
        p.y
    ]
;
const pointArrayToPointObject = (a)=>({
        x: a[0],
        y: a[1]
    })
;
const pointArrayToVector = (a)=>new _vector.Vector(a[0], a[1])
;
const vectorToPointArray = (v)=>[
        v.x,
        v.y
    ]
;
const arrayPointArrayToObjectArray = (arry)=>arry.map((a)=>pointArrayToPointObject(a)
    )
;
const arrayPointArrayToVectorArray = (arry)=>arry.map((a)=>pointArrayToVector(a)
    )
;
const arrayVectorToPointArray = (arry)=>arry.map((a)=>vectorToPointArray(a)
    )
;
const flattenPointArray = (arry)=>arry.reduce((acc, p)=>{
        if (p) {
            acc.push(p[0]);
            acc.push(p[1]);
        }
        return acc;
    }, [])
;
const unflattenPointArray = (arry)=>{
    const points = [];
    for(let i = 0; i < arry.length; i += 2)points.push([
        arry[i],
        arry[i + 1]
    ]);
    return points;
};
const uvPointToCanvas = ({ margin =0 , u , v , width , height  })=>({
        x: _math.lerp(margin, width - margin, u),
        y: _math.lerp(margin, height - margin, v)
    })
;
const pointDistance = (pointA1, pointB)=>{
    const dx = pointA1.x - pointB.x;
    const dy = pointA1.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
};
const midpoint = (pointA1, pointB)=>({
        x: (pointA1.x + pointB.x) / 2,
        y: (pointA1.y + pointB.y) / 2
    })
;
const pointRotateCoord = (point1, angle)=>({
        x: point1.x * _math.cos(angle) - point1.y * _math.sin(angle),
        y: point1.y * _math.cos(angle) + point1.x * _math.sin(angle)
    })
;
const pointAngleFromVelocity = ({ velocityX , velocityY  })=>Math.atan2(velocityY, velocityX)
;
const scalePointToCanvas = (canvasWidth, canvasHeight, width, height, zoomFactor, x, y)=>{
    const particleXOffset = canvasWidth / 2 - width * zoomFactor / 2;
    const particleYOffset = canvasHeight / 2 - height * zoomFactor / 2;
    return {
        x: x * zoomFactor + particleXOffset,
        y: y * zoomFactor + particleYOffset
    };
};
const pointsOrientation = (a, b)=>Math.atan2(b.y - a.y, b.x - a.x)
;
const pointsFromSegment = (seg)=>{
    const points = [];
    for(let i = 0; i < seg.length; i++){
        points.push([
            seg[i].start.x,
            seg[i].start.y
        ]);
        points.push([
            seg[i].end.x,
            seg[i].end.y
        ]);
    }
    return points;
};
const trimPointArray = (points, skip = 2)=>points.reduce((acc, s, i)=>{
        if (i === 0 || i === points.length - 1) acc.push(s);
        else if (i % skip === 0) acc.push(s);
        return acc;
    }, [])
;
const createSplineFromPointArray = (points)=>unflattenPointArray(_curveCalc.getCurvePoints(flattenPointArray(points)))
; // // For array of points from segments, take only the first start
 // export const startPointsOnly = (points) => {
 //     const p = [];
 //     for (let i = 0; i < points.length; i += 2) {
 //         p.push(points[i]);
 //     }
 //     // last end point
 //     p.push(last(points));
 //     return p;
 // };
 // Using https://github.com/gdenisov/cardinal-spline-js

},{"./Vector":"1MSqh","./math":"4t0bw","./curve-calc":"4EuBm","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"4EuBm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getCurvePoints", ()=>getCurvePoints
);
const getCurvePoints = (points, tension, numOfSeg, close)=>{
    // options or defaults
    tension = typeof tension === 'number' ? tension : 0.5;
    numOfSeg = numOfSeg || 25;
    let pts; // for cloning point array
    let i = 1;
    let l = points.length;
    let rPos = 0;
    const rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0);
    if (rLen < 0) return [];
    const res = new Float32Array(rLen);
    const cache = new Float32Array((numOfSeg + 2) * 4);
    let cachePtr = 4;
    pts = points.slice(0);
    if (close) {
        pts.unshift(points[l - 1]); // insert end point as first point
        pts.unshift(points[l - 2]);
        pts.push(points[0], points[1]); // first point as last point
    } else {
        pts.unshift(points[1]); // copy 1. point and insert at beginning
        pts.unshift(points[0]);
        pts.push(points[l - 2], points[l - 1]); // duplicate end-points
    }
    // cache inner-loop calculations as they are based on t alone
    cache[0] = 1; // 1,0,0,0
    for(; i < numOfSeg; i++){
        const st = i / numOfSeg;
        const st2 = st * st;
        const st3 = st2 * st;
        const st23 = st3 * 2;
        const st32 = st2 * 3;
        cache[cachePtr++] = st23 - st32 + 1; // c1
        cache[cachePtr++] = st32 - st23; // c2
        cache[cachePtr++] = st3 - 2 * st2 + st; // c3
        cache[cachePtr++] = st3 - st2; // c4
    }
    cache[++cachePtr] = 1; // 0,1,0,0
    // calc. points
    parse(pts, cache, l);
    if (close) {
        // l = points.length;
        pts = [];
        pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]); // second last and last
        pts.push(points[0], points[1], points[2], points[3]); // first and second
        parse(pts, cache, 4);
    }
    function parse(pts1, cache1, l1) {
        for(var i1 = 2, t; i1 < l1; i1 += 2){
            const pt1 = pts1[i1];
            const pt2 = pts1[i1 + 1];
            const pt3 = pts1[i1 + 2];
            const pt4 = pts1[i1 + 3];
            const t1x = (pt3 - pts1[i1 - 2]) * tension;
            const t1y = (pt4 - pts1[i1 - 1]) * tension;
            const t2x = (pts1[i1 + 4] - pt1) * tension;
            const t2y = (pts1[i1 + 5] - pt2) * tension;
            for(t = 0; t < numOfSeg; t++){
                const c = t << 2; // t * 4;
                const c1 = cache1[c];
                const c2 = cache1[c + 1];
                const c3 = cache1[c + 2];
                const c4 = cache1[c + 3];
                res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
            }
        }
    }
    // add last point
    l = close ? 0 : points.length - 2;
    res[rPos++] = points[l];
    res[rPos] = points[l + 1];
    return res;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"73Br1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "isHiDPICanvas", ()=>isHiDPICanvas
);
parcelHelpers.export(exports, "currentContextScale", ()=>currentContextScale
);
parcelHelpers.export(exports, "resizeCanvas", ()=>resizeCanvas
);
parcelHelpers.export(exports, "setContext", ()=>setContext
);
parcelHelpers.export(exports, "resetContext", ()=>resetContext
);
parcelHelpers.export(exports, "roundLines", ()=>roundLines
);
parcelHelpers.export(exports, "squareLines", ()=>squareLines
);
parcelHelpers.export(exports, "sharpLines", ()=>sharpLines
);
parcelHelpers.export(exports, "blendMode", ()=>blendMode
);
parcelHelpers.export(exports, "filter", ()=>filter
);
parcelHelpers.export(exports, "strokeWeight", ()=>strokeWeight
);
parcelHelpers.export(exports, "strokeColor", ()=>strokeColor
);
parcelHelpers.export(exports, "strokeDash", ()=>strokeDash
);
parcelHelpers.export(exports, "fillColor", ()=>fillColor
);
parcelHelpers.export(exports, "clear", ()=>clear
);
parcelHelpers.export(exports, "background", ()=>background
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
let isHiDPI = false;
let contextScale = 1;
const contextHistory = [];
const isHiDPICanvas = (_)=>isHiDPI
;
const currentContextScale = (_)=>contextScale
;
const resizeCanvas = (canvas, context, width, height, scale)=>{
    contextScale = scale || window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * contextScale);
    canvas.height = Math.floor(height * contextScale);
    if (contextScale === 2) {
        isHiDPI = true;
        context.scale(1, 1);
    // context.scale(2, 2); // not working
    } else context.scale(contextScale, contextScale);
};
const contextDefaults = {
    strokeStyle: '#000',
    fillStyle: '#000',
    globalAlpha: 1,
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    textAlign: 'left',
    textBaseline: 'top',
    globalCompositeOperation: 'source-over'
};
const setContext = (context)=>(settings)=>{
        contextHistory.push(settings);
        Object.keys(settings).forEach((k)=>{
            context[k] = settings[k];
        });
    }
;
const resetContext = (context)=>{
    setContext(context)(contextDefaults);
    context.setLineDash([]);
};
const roundLines = (context)=>(width, color)=>{
        setContext(context)({
            lineWidth: width || context.lineWidth,
            strokeStyle: color ? _tinycolor2Default.default(color).toRgbString() : context.strokeStyle,
            lineCap: 'round',
            lineJoin: 'round'
        });
    }
;
const squareLines = (context)=>(width, color)=>setContext(context)({
            lineWidth: width || context.lineWidth,
            strokeStyle: color ? _tinycolor2Default.default(color).toRgbString() : context.strokeStyle,
            lineCap: 'butt',
            lineJoin: 'miter'
        })
;
const sharpLines = (context)=>context.translate(0.5, 0.5)
;
const blendMode = (context)=>(mode = 'source-over')=>setContext(context)({
            globalCompositeOperation: mode
        })
;
const filter = (context)=>(f = '')=>setContext(context)({
            filter: f
        })
;
const strokeWeight = (context)=>(w = 1)=>setContext(context)({
            lineWidth: w
        })
;
const strokeColor = (context)=>(color = '#000')=>setContext(context)({
            strokeStyle: _tinycolor2Default.default(color).toRgbString()
        })
;
const strokeDash = (context)=>(dash = [])=>context.setLineDash(dash)
;
const fillColor = (context)=>(color = '#000')=>setContext(context)({
            fillStyle: _tinycolor2Default.default(color).toRgbString()
        })
;
const clear = ({ width , height  }, context)=>(_)=>context.clearRect(0, 0, width, height)
;
const background = ({ width , height  }, context)=>(color = 'black')=>{
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        context.fillRect(0, 0, width, height);
    }
;

},{"tinycolor2":"101FG","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"33yaF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "particlePoint", ()=>particlePoint
);
parcelHelpers.export(exports, "particleRotated", ()=>particleRotated
);
parcelHelpers.export(exports, "particleHistoryTrail", ()=>particleHistoryTrail
);
parcelHelpers.export(exports, "connectParticles", ()=>connectParticles
);
var _math = require("../math/math");
var _canvas = require("./canvas");
var _primatives = require("./primatives");
var _points = require("../math/points");
const particlePoint = (context)=>({ x , y , radius , color  })=>{
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fillStyle = color.toRgbString();
        context.fill();
    }
;
const particleRotated = (ctx, drawFn, particle, ...args)=>{
    const pSaveX = particle.x;
    const pSaveY = particle.y;
    particle.x = 0;
    particle.y = 0;
    ctx.save();
    ctx.translate(pSaveX, pSaveY);
    ctx.rotate(particle.heading);
    drawFn(ctx)(particle, args);
    ctx.restore();
    particle.x = pSaveX;
    particle.y = pSaveY;
};
const particleHistoryTrail = (context)=>(particle)=>{
        const trailLen = particle.xHistory.length;
        context.lineWidth = particle.radius;
        const pColor = particle.color;
        const aFade = 100 / trailLen * 0.01;
        let alpha = 1;
        const sFade = particle.radius * 2 / trailLen;
        let stroke = particle.radius * 2;
        for(let i = 0; i < trailLen; i++){
            const startX = i === 0 ? particle.x : particle.xHistory[i - 1];
            const startY = i === 0 ? particle.y : particle.yHistory[i - 1];
            _primatives.line(context)(startX, startY, particle.xHistory[i], particle.yHistory[i], stroke);
            pColor.setAlpha(alpha);
            context.strokeStyle = pColor.toRgbString();
            alpha -= aFade;
            stroke -= sFade;
        }
    }
;
const connectParticles = (context)=>(pArray, proximity, useAlpha = true)=>{
        const len = pArray.length;
        for(let a = 0; a < len; a++)// all consecutive particles
        for(let b = a; b < len; b++){
            const pA = pArray[a];
            const pB = pArray[b];
            const distance = _points.pointDistance(pA, pB);
            if (distance < proximity) {
                const pColor = pA.color;
                if (useAlpha) pColor.setAlpha(_math.normalizeInverse(0, proximity, distance));
                context.strokeStyle = pColor.toHslString();
                _primatives.line(context)(pA.x, pA.y, pB.x, pB.y, 0.5);
            }
        }
        _canvas.resetContext(context);
    }
;

},{"../math/math":"4t0bw","./canvas":"73Br1","./primatives":"6MM7x","../math/points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"6MM7x":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "pixel", ()=>pixel
);
parcelHelpers.export(exports, "line", ()=>line
);
parcelHelpers.export(exports, "lineAtAngle", ()=>lineAtAngle
);
parcelHelpers.export(exports, "circleOld", ()=>circleOld
);
parcelHelpers.export(exports, "circle", ()=>circle
);
parcelHelpers.export(exports, "circleFilled", ()=>circleFilled
);
parcelHelpers.export(exports, "rect", ()=>rect
);
parcelHelpers.export(exports, "rectFilled", ()=>rectFilled
);
parcelHelpers.export(exports, "squareFilled", ()=>squareFilled
);
parcelHelpers.export(exports, "drawTriangleFilled", ()=>drawTriangleFilled
);
parcelHelpers.export(exports, "quadRectFilled", ()=>quadRectFilled
);
parcelHelpers.export(exports, "roundRectFilled", ()=>roundRectFilled
);
parcelHelpers.export(exports, "pixelAtPoints", ()=>pixelAtPoints
);
parcelHelpers.export(exports, "pointPathPA", ()=>pointPathPA
);
parcelHelpers.export(exports, "polygonPA", ()=>polygonPA
);
parcelHelpers.export(exports, "pointPathPO", ()=>pointPathPO
);
parcelHelpers.export(exports, "arcQuarter", ()=>arcQuarter
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _canvas = require("./canvas");
var _math = require("../math/math");
const pixel = (context)=>(x, y, color = 'black', mode = 'square', size)=>{
        size = size || _canvas.currentContextScale();
        context.beginPath();
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        if (mode === 'circle') {
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2, false);
            context.fill();
        } else context.fillRect(x, y, size, size);
        context.closePath();
    }
;
const line = (context)=>(x1, y1, x2, y2, strokeWidth, linecap)=>{
        context.beginPath();
        // color = 'black',
        // context.strokeStyle = tinycolor(color).toRgbString();
        if (strokeWidth) context.lineWidth = strokeWidth;
        if (linecap) context.lineCap = linecap;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }
;
const lineAtAngle = (context)=>(x1, y1, angle, length, strokeWidth, linecap)=>{
        const theta = Math.PI * angle / 180;
        const x2 = x1 + length * Math.cos(theta);
        const y2 = y1 + length * Math.sin(theta);
        line(context)(x1, y1, x2, y2, strokeWidth, linecap);
    }
;
const circleOld = (context)=>(strokeWidth, x, y, radius, color)=>{
        context.beginPath();
        if (color) context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
        context.lineWidth = strokeWidth;
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        // context.fillStyle = 'rgba(255,255,255,.1)';
        // context.fill();
        context.stroke();
        context.closePath();
    }
;
const circle = (context)=>(x, y, radius, color)=>{
        context.beginPath();
        if (color) context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
        context.arc(x, y, radius, 0, _math.TAU, false);
        context.stroke();
        context.closePath();
    }
;
const circleFilled = (context)=>(x, y, radius, color)=>{
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        context.fill();
        context.closePath();
    }
;
const rect = (context)=>(x, y, w, h, strokeWidth, color)=>{
        context.beginPath();
        if (color) context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
        if (strokeWidth) context.lineWidth = strokeWidth;
        context.rect(x, y, w, h);
        context.stroke();
        context.closePath();
    }
;
const rectFilled = (context)=>(x, y, w, h, color = 'white')=>{
        context.beginPath();
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        context.fillRect(x, y, w, h);
        context.closePath();
    }
;
const squareFilled = (context)=>(x, y, size, color)=>{
        rectFilled(context)(x, y, size, size, color);
    }
;
const drawTriangleFilled = (context)=>(x, y, size, color)=>{
        const half = size / 2;
        context.beginPath();
        context.moveTo(x - half, y - half);
        context.lineTo(x + half, y);
        context.lineTo(x - half, y + half);
        context.fillStyle = color.toRgbString();
        context.fill();
        context.closePath();
    }
;
const quadRectFilled = (context)=>(x, y, w, h, color)=>{
        const mx = x + w / 2;
        const my = y + h / 2;
        context.beginPath();
        // context.strokeStyle = 'green';
        // context.lineWidth = '4';
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        context.moveTo(x, my);
        context.quadraticCurveTo(x, y, mx, y);
        context.quadraticCurveTo(x + w, y, x + w, my);
        context.quadraticCurveTo(x + w, y + h, mx, y + h);
        context.quadraticCurveTo(x, y + h, x, my);
        // context.stroke();
        context.fill();
        context.closePath();
    }
;
const roundRectFilled = (context)=>(x, y, w, h, corner, color)=>{
        if (w < corner || h < corner) corner = Math.min(w, h);
        const r = x + w;
        const b = y + h;
        context.beginPath();
        // context.strokeStyle = 'green';
        // context.lineWidth = '4';
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        context.moveTo(x + corner, y);
        context.lineTo(r - corner, y);
        context.quadraticCurveTo(r, y, r, y + corner);
        context.lineTo(r, y + h - corner);
        context.quadraticCurveTo(r, b, r - corner, b);
        context.lineTo(x + corner, b);
        context.quadraticCurveTo(x, b, x, b - corner);
        context.lineTo(x, y + corner);
        context.quadraticCurveTo(x, y, x + corner, y);
        // context.stroke();
        context.fill();
        context.closePath();
    }
;
const pixelAtPoints = (context)=>(points, color = 'black', width = 1)=>{
        points.forEach((coords, i)=>{
            pixel(context)(coords[0], coords[1], color, 'circleOld', width);
        });
    }
;
const pointPathPA = (context)=>(points, color = 'black', width = 1, close = false, drawPoint = false)=>{
        context.beginPath();
        context.strokeStyle = _tinycolor2Default.default(color).clone().toRgbString();
        context.lineWidth = width;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        points.forEach((coords, i)=>{
            if (i === 0) context.moveTo(coords[0], coords[1]);
            else context.lineTo(coords[0], coords[1]);
        });
        if (close) context.lineTo(points[0][0], points[0][1]);
        context.stroke();
        context.closePath();
        if (drawPoint) points.forEach((coords, i)=>{
            if (drawPoint) circleFilled(context)(coords[0], coords[1], 3, 'red');
        });
    }
;
const polygonPA = (context)=>(points, color = 'black', close = false, drawPoint = false)=>{
        context.beginPath();
        context.fillStyle = _tinycolor2Default.default(color).clone().toRgbString();
        points.forEach((coords, i)=>{
            if (i === 0) context.moveTo(coords[0], coords[1]);
            else context.lineTo(coords[0], coords[1]);
        });
        if (close) context.lineTo(points[0][0], points[0][1]);
        context.fill();
        context.closePath();
        if (drawPoint) points.forEach((coords, i)=>{
            if (drawPoint) circleFilled(context)(coords[0], coords[1], 3, 'red');
        });
    }
;
const pointPathPO = (context)=>(points, color = 'black', width = 1, close = false, drawPoint = false)=>{
        context.beginPath();
        context.strokeStyle = _tinycolor2Default.default(color).clone().toRgbString();
        context.lineWidth = width;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        points.forEach((coords, i)=>{
            if (i === 0) context.moveTo(coords.x, coords.y);
            else context.lineTo(coords.x, coords.y);
        });
        if (close) context.lineTo(points[0].x, points[0].y);
        context.stroke();
        context.closePath();
        if (drawPoint) points.forEach((coords, i)=>{
            if (drawPoint) circleFilled(context)(coords.x, coords.y, 3, 'red');
        });
    }
;
const arcQuarter = (context)=>(x, y, radius, startRadians, clockWise = false)=>{
        // context.strokeStyle = tinycolor(color).toRgbString();
        // context.lineCap = 'butt';
        // context.lineWidth = thickness;
        const startR = _math.snapNumber(Math.PI / 2, startRadians);
        const endR = startR + Math.PI / 2;
        context.beginPath();
        context.arc(x, y, radius, startR, endR, clockWise);
        context.stroke();
        context.closePath();
    }
;

},{"tinycolor2":"101FG","./canvas":"73Br1","../math/math":"4t0bw","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"4FjQ0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "threeAttractors", ()=>threeAttractors
);
var _math = require("../rndrgen/math/math");
var _particle = require("../rndrgen/systems/Particle");
var _canvas = require("../rndrgen/canvas/canvas");
var _particles = require("../rndrgen/canvas/particles");
var _random = require("../rndrgen/math/random");
const createGridPointsXY = (width, height, xMargin, yMargin, columns, rows)=>{
    const gridPoints = [];
    const colStep = Math.round((width - xMargin * 2) / (columns - 1));
    const rowStep = Math.round((height - yMargin * 2) / (rows - 1));
    for(let col = 0; col < columns; col++){
        const x = xMargin + col * colStep;
        for(let row = 0; row < rows; row++){
            const y = yMargin + row * rowStep;
            gridPoints.push([
                x,
                y
            ]);
        }
    }
    return {
        points: gridPoints,
        columnWidth: colStep,
        rowHeight: rowStep
    };
};
const threeAttractors = ()=>{
    const config = {
    };
    let numParticles;
    const particlesArray = [];
    let gridPoints = [];
    const hue = 0;
    let attractorDist;
    let leftattractor;
    let midattractor;
    let rightattractor;
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    const setup = ({ canvas , context  })=>{
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;
        attractorDist = canvas.width / 0.7;
        leftattractor = {
            x: 0,
            y: canvas.height / 2,
            mass: 10,
            g: 3
        };
        midattractor = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            mass: 50,
            g: 10
        };
        rightattractor = {
            x: canvas.width,
            y: canvas.height / 2,
            mass: 10,
            g: 3
        };
        gridPoints = createGridPointsXY(canvas.width, canvas.height, 100, 100, canvas.width / 50, canvas.height / 50).points;
        numParticles = gridPoints.length;
        for(let i = 0; i < numParticles; i++){
            const props = _particle.createRandomParticleValues(canvas);
            props.x = gridPoints[i][0];
            props.y = gridPoints[i][1];
            props.velocityX = 0;
            props.velocityY = 0;
            props.mass = 1;
            props.radius = 1; // randomNumberBetween(10, 30);
            props.spikes = _random.createRandomNumberArray(20, 0, 360);
            const h = _math.mapRange(0, canvas.width, 0, 90, props.x);
            const s = 100; // lerpRange(0,10,0,100,prop.radius);
            const l = 50; // lerpRange(0,10,25,75,prop.radius);
            props.color = `hsla(${h},${s}%,${l}%,0.1)`;
            // props.color = { r: 0, g: 0, b: 0, a: 0.1 };
            particlesArray.push(new _particle.Particle(props));
        }
        _canvas.background(canvas, context)('white');
    };
    const draw = ({ canvas , context , mouse  })=>{
        // background(canvas, context)({ r: 255, g: 255, b: 255, a: 0.001 });
        for(let i = 0; i < numParticles; i++){
            particlesArray[i].attract(leftattractor, -1, attractorDist);
            particlesArray[i].attract(midattractor, 1, attractorDist);
            particlesArray[i].attract(rightattractor, -1, attractorDist);
            particlesArray[i].velocity = particlesArray[i].velocity.limit(10);
            particlesArray[i].updatePosWithVelocity();
            // edgeBounce(canvas, particlesArray[i]);
            _particles.particlePoint(context)(particlesArray[i]);
        }
        _particles.connectParticles(context)(particlesArray, 50, false);
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/math/math":"4t0bw","../rndrgen/systems/Particle":"344El","../rndrgen/canvas/canvas":"73Br1","../rndrgen/canvas/particles":"33yaF","../rndrgen/math/random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"7fBhq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "hiImage01", ()=>hiImage01
);
var _hi1Png = require("../../media/images/hi1.png");
var _hi1PngDefault = parcelHelpers.interopDefault(_hi1Png);
var _canvas = require("../rndrgen/canvas/canvas");
var _particle = require("../rndrgen/systems/Particle");
var _particles = require("../rndrgen/canvas/particles");
var _random = require("../rndrgen/math/random");
const getImageDataFromImage = (context)=>(image)=>{
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.width);
    }
;
const getImageDataColor = (imageData, x, y)=>({
        r: imageData.data[y * 4 * imageData.width + x * 4],
        g: imageData.data[y * 4 * imageData.width + x * 4 + 1],
        b: imageData.data[y * 4 * imageData.width + x * 4 + 2],
        a: imageData.data[y * 4 * imageData.width + x * 4 + 3]
    })
;
const hiImage01 = (_)=>{
    const config = {
        width: 600,
        height: 600
    };
    let imageZoomFactor;
    const png = new Image();
    png.src = _hi1PngDefault.default;
    let imageData;
    const numParticles = 500;
    const particlesArray = [];
    const particleColor = {
        r: 252,
        g: 3,
        b: 152
    };
    const setup = ({ canvas , context  })=>{
        imageData = getImageDataFromImage(context)(png);
        _canvas.clear(canvas, context)();
        imageZoomFactor = canvas.width / imageData.width;
        for(let i = 0; i < numParticles; i++){
            const props = _particle.createRandomParticleValues(canvas);
            props.radius = _random.randomNumberBetween(1, 5);
            props.color = particleColor;
            if (i % 2) props.x = 0;
            else props.x = canvas.width;
            particlesArray.push(new _particle.Particle(props));
        }
        _canvas.background(canvas, context)({
            r: 255,
            g: 255,
            b: 0
        });
    };
    const draw = ({ canvas , context , mouse  })=>{
        _canvas.background(canvas, context)({
            r: 255,
            g: 255,
            b: 0,
            a: 0.004
        });
        for(let i = 0; i < numParticles; i++){
            particlesArray[i].updatePosWithVelocity();
            _particle.edgeWrap(canvas, particlesArray[i]);
            const pxColor = getImageDataColor(imageData, Math.round(particlesArray[i].x / imageZoomFactor), Math.round(particlesArray[i].y / imageZoomFactor));
            if (pxColor.r > 250) {
                particlesArray[i].drag(0.001);
                particlesArray[i].color = {
                    r: 3,
                    g: 227,
                    b: 252
                };
            } else particlesArray[i].color = particleColor;
            _particles.particlePoint(context)(particlesArray[i]);
        }
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../../media/images/hi1.png":"2Mkol","../rndrgen/canvas/canvas":"73Br1","../rndrgen/systems/Particle":"344El","../rndrgen/canvas/particles":"33yaF","../rndrgen/math/random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"2Mkol":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + "hi1.b86a235f.png";

},{"./bundle-url":"3seVR"}],"3seVR":[function(require,module,exports) {
"use strict";
/* globals document:readonly */ var bundleURL = null;
function getBundleURLCached() {
    if (!bundleURL) bundleURL = getBundleURL();
    return bundleURL;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
        if (matches) return getBaseURL(matches[0]);
    }
    return '/';
}
function getBaseURL(url) {
    return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    let matches = ('' + url).match(/(https?|file|ftp):\/\/[^/]+/);
    if (!matches) throw new Error('Origin not found');
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"3wlBH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "waves01b", ()=>waves01b
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _math = require("../rndrgen/math/math");
var _random = require("../rndrgen/math/random");
var _ribbon = require("../rndrgen/canvas/ribbon");
var _shapes = require("../scratch/shapes");
var _attractors = require("../rndrgen/math/attractors");
var _palettes = require("../rndrgen/color/palettes");
/*
Original inspiration
Churn by Kenny Vaden
https://www.reddit.com/r/generative/comments/lq8r11/churn_r_code/
 */ const drawDots = (context, path, yorigin, sourceColor, scale, stroke = false)=>{
    let color = sourceColor.clone();
    path.forEach((point)=>{
        const rnd = _random.randomNumberBetween(0, yorigin);
        if (rnd < 2) {
            let radius = _random.randomNumberBetween(1, 2 * scale);
            let quantity = 3;
            if (rnd < 0.005) {
                radius = _random.randomNumberBetween(25 * scale, 50 * scale);
                quantity = 1;
                color = color.clone().darken(10);
            } else color = color.clone().lighten(5).saturate(10);
            // x, y, color, size, amount = 3, range = 20
            _shapes.splatter(context)(point[0], point[1], color.toRgbString(), radius, quantity, 35 * scale);
        }
    });
};
const waves01b = ()=>{
    const config = {
        name: 'waves01b',
        orientation: _sketch.orientation.landscape,
        // ratio: ratio.a3,
        ratio: _sketch.ratio.square,
        // scale: scale.hidpi,
        scale: _sketch.scale.standard
    };
    let canvasWidth;
    let canvasHeight;
    let canvasMiddle;
    const renderScale = config.scale; // 1 or 2
    const colorBackground = 'hsl(46, 75%, 70%)';
    const colorTop = 'hsl(185, 100%, 18%)'; // 'hsl(350, 65%, 46%)';
    const colorBottom = 'hsl(182, 100%, 29%)'; // 'hsl(185, 19%, 40%)';
    const waveYValues = [];
    let numWaveXPoints;
    const waveDensity = renderScale;
    let numWaveRows;
    const startX = 0;
    let maxX;
    let startY = 0;
    let maxY;
    let time = 0;
    const createNoiseValues = (idx, distance, frequency, amplitude)=>{
        const points = [];
        for(let i = 0; i < numWaveXPoints; i++){
            const n = _attractors.simplexNoise3d(i, distance, idx, frequency) * amplitude;
            // const n = simplexNoise3d(i, idx, time, frequency) * amplitude;
            // const n = simplexNoise2d(i, idx * 2, frequency) * amplitude;
            points.push(n);
        }
        return points;
    };
    const createRow = (idx)=>{
        time += 1;
        const mid = numWaveRows / 2;
        const distFromCenter = Math.abs(mid - idx);
        const frequency = _math.mapRange(0, mid, 1.25, 0.5, distFromCenter + _random.randomNumberBetween(-5, 5)) * (_random.randomNumberBetween(9, 12) * 0.001);
        const amplitude = _math.mapRange(0, mid, 10, 20, distFromCenter * _random.randomNumberBetween(0, 2));
        return {
            top: createNoiseValues(idx, distFromCenter, frequency, amplitude),
            bottom: createNoiseValues(idx, distFromCenter, frequency, amplitude)
        };
    };
    const setup = ({ canvas , context  })=>{
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        maxX = canvas.width;
        numWaveXPoints = canvas.width / 5;
        canvasMiddle = canvas.height / 2;
        numWaveRows = canvasHeight / waveDensity;
        const yBufferSpace = canvasHeight / 7;
        startY = yBufferSpace;
        maxY = canvasHeight - yBufferSpace * 1.25;
        for(let i = 0; i < numWaveRows; i++)waveYValues.push(createRow(i + 1));
        _canvas.background(canvas, context)(_tinycolor2Default.default(colorBackground).lighten(20));
    };
    const draw = ({ canvas , context  })=>{
        let currentY = startY;
        const incrementX = Math.ceil((maxX - startX) / numWaveXPoints) + 1;
        const incrementY = (maxY - startY) / numWaveRows;
        const canvasFocal = canvasHeight / 3 * 2;
        const focalRange = canvasFocal * 0.75;
        const maxWaveHeight = 40 * renderScale;
        const minWaveHeight = 3;
        const palette = _palettes.nicePalette();
        for(let i = 0; i < waveYValues.length; i++){
            const color = _tinycolor2Default.default.mix(colorTop, colorBottom, _math.mapRange(startY, maxY, 0, 100, currentY)).brighten(15).spin(_random.randomNumberBetween(-10, 10));
            const distFromMiddle = Math.abs(canvasFocal - currentY);
            color.spin(_math.mapRange(0, focalRange, 20, -20, distFromMiddle));
            color.brighten(_math.mapRange(0, focalRange, 50, 0, distFromMiddle + _random.randomNumberBetween(0, 100)));
            color.darken(_math.mapRange(0, canvasFocal, 0, 15, distFromMiddle + _random.randomNumberBetween(0, 50)));
            // color.saturate(mapRange(0, focalRange, 10, 0, distFromMiddle + randomNumberBetween(0, 100)));
            const waveheight = _math.mapRange(startY, maxY, maxWaveHeight, minWaveHeight, currentY);
            const waveTop = [];
            const waveBottom = [];
            let currentX = 0;
            for(let j = 0; j < numWaveXPoints; j++){
                waveTop.push([
                    currentX,
                    currentY + waveYValues[i].top[j]
                ]);
                waveBottom.push([
                    currentX,
                    currentY + waveYValues[i].bottom[j] + waveheight
                ]);
                currentX += incrementX;
            }
            context.strokeStyle = color.clone().darken(60).toRgbString();
            context.lineWidth = renderScale;
            _ribbon.ribbonSegment(context)(waveTop, waveBottom.reverse(), color, true, 0);
            drawDots(context, waveTop, currentY, color, renderScale, false);
            // ribbonSegmented(context)(waveTop, waveBottom, color, { segments: 15, gap: 0, colors: palette });
            currentY += incrementY;
        }
        return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/canvas/canvas":"73Br1","../rndrgen/math/math":"4t0bw","../rndrgen/math/random":"1SLuP","../rndrgen/canvas/ribbon":"4jM8A","../scratch/shapes":"7F0mj","../rndrgen/math/attractors":"BodqP","../rndrgen/color/palettes":"3qayM","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"4jM8A":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "lowestYPA", ()=>lowestYPA
);
parcelHelpers.export(exports, "highestYPA", ()=>highestYPA
);
parcelHelpers.export(exports, "ribbonSegment", ()=>ribbonSegment
);
parcelHelpers.export(exports, "ribbonSegmented", ()=>ribbonSegmented
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _random = require("../math/random");
var _utils = require("../utils");
var _math = require("../math/math");
const lowestYPA = (arry)=>arry.reduce((acc, p)=>{
        if (p[1] < acc) acc = p[1];
        return acc;
    }, 0)
;
const highestYPA = (arry)=>arry.reduce((acc, p)=>{
        if (p[1] > acc) acc = p[1];
        return acc;
    }, 0)
;
const ribbonSegment = (context)=>(sideA, sideB, sourceColor, stroke = false, thickness = 1)=>{
        const segStartX = sideA[0][0];
        const segStartY = sideA[0][1];
        const segEndX = sideB[0][0] + thickness;
        const segEndY = sideB[0][1] + thickness;
        const color = sourceColor.clone();
        const gradient = context.createLinearGradient(0, lowestYPA(sideA), 0, highestYPA(sideB) + thickness);
        // const gradient = context.createLinearGradient(0, segStartY - thickness, 0, segEndY + thickness);
        // gradient.addColorStop(0, color.toRgbString());
        gradient.addColorStop(0.5, color.toRgbString());
        gradient.addColorStop(1, color.clone().darken(5).saturate(10).toRgbString());
        context.beginPath();
        context.moveTo(segStartX, segStartY);
        sideA.forEach((point)=>{
            context.lineTo(point[0], point[1]);
        });
        sideB.forEach((point)=>{
            context.lineTo(point[0], point[1] + thickness);
        });
        context.lineTo(segStartX, segStartY);
        if (stroke) // context.strokeStyle = color.darken(70).toRgbString();
        // context.lineWidth = 1;
        context.stroke();
        context.fillStyle = gradient;
        context.fill();
        context.closePath();
    }
;
const ribbonSegmented = (context)=>(sideA, sideB, color, { segments , gap , colors  }, stroke = false, thickness = 0)=>{
        if (segments === 1) {
            ribbonSegment(context)(sideA, sideB.reverse(), color, stroke, thickness);
            return;
        }
        // calculate segment sizes based on random percentages of the line length
        const segmentGap = gap || 0;
        const minSegPct = 5;
        const minSegLength = segmentGap + minSegPct;
        const segmentLengths = [];
        let lenPctLeft = 100 - minSegLength;
        for(let k = 0; k < segments - 1; k++)if (lenPctLeft > minSegPct) {
            const pct = _random.randomWholeBetween(minSegLength, lenPctLeft / 2);
            segmentLengths.push(_math.percentage(sideA.length, pct));
            lenPctLeft -= pct;
        }
        // add whatever is left to the end
        segmentLengths.push(sideA.length - _utils.sumArray(segmentLengths));
        // break up the sides in to points based on segment lengths
        let pos = 0;
        for(let i = 0; i < segmentLengths.length; i++){
            let end = pos + segmentLengths[i];
            if (i < segmentLengths.length - 1) end -= segmentGap;
            // TODO color is a random pick from segment colors
            let rcolor = color;
            if (colors) rcolor = _tinycolor2Default.default(_random.oneOf(colors));
            ribbonSegment(context)(sideA.slice(pos, end), sideB.slice(pos, end).reverse(), rcolor, stroke, thickness);
            pos += segmentLengths[i];
        }
    }
;

},{"tinycolor2":"101FG","../math/random":"1SLuP","../utils":"1kIwI","../math/math":"4t0bw","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"1kIwI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "defaultValue", ()=>defaultValue
);
parcelHelpers.export(exports, "first", ()=>first
);
parcelHelpers.export(exports, "middle", ()=>middle
);
parcelHelpers.export(exports, "last", ()=>last
);
parcelHelpers.export(exports, "limitArrayLen", ()=>limitArrayLen
);
parcelHelpers.export(exports, "getArrayValuesFromStart", ()=>getArrayValuesFromStart
);
parcelHelpers.export(exports, "getArrayValuesFromEnd", ()=>getArrayValuesFromEnd
);
parcelHelpers.export(exports, "sumArray", ()=>sumArray
);
parcelHelpers.export(exports, "averageNumArray", ()=>averageNumArray
);
parcelHelpers.export(exports, "lowest", ()=>lowest
);
parcelHelpers.export(exports, "highest", ()=>highest
);
parcelHelpers.export(exports, "getQueryVariable", ()=>getQueryVariable
);
const defaultValue = (obj, key, value)=>obj.hasOwnProperty(key) ? obj[key] : value
;
const first = (arry)=>arry[0]
;
const middle = (arry)=>arry.slice(1, arry.length - 2)
;
const last = (arry)=>arry[arry.length - 1]
;
const limitArrayLen = (max, arr)=>{
    const arrLength = arr.length;
    if (arrLength > max) arr.splice(0, arrLength - max);
    return arr;
};
const getArrayValuesFromStart = (arr, start, len)=>{
    const values = [];
    let index = start;
    for(let i = 0; i < len; i++){
        values.push(arr[index--]);
        if (index < 0) index = arr.length - 1;
    }
    return values;
};
const getArrayValuesFromEnd = (arr, start, len)=>{
    const values = [];
    let index = start;
    for(let i = 0; i < len; i++){
        values.push(arr[index++]);
        if (index === arr.length) index = 0;
    }
    return values;
};
const sumArray = (arry)=>arry.reduce((a, b)=>a + b
    )
;
const averageNumArray = (arry)=>arry.reduce((a, b)=>a + b
    ) / arry.length
;
const lowest = (arry)=>arry.reduce((acc, v)=>{
        if (v < acc) acc = v;
        return acc;
    }, 0)
;
const highest = (arry)=>arry.reduce((acc, v)=>{
        if (v > acc) acc = v;
        return acc;
    }, 0)
;
const getQueryVariable = (variable)=>{
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for(let i = 0; i < vars.length; i++){
        const pair = vars[i].split('=');
        if (pair[0] === variable) return pair[1];
    }
    return false;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"7F0mj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "spikedCircle", ()=>spikedCircle
);
parcelHelpers.export(exports, "DONTUSETHISpathRibbon", ()=>DONTUSETHISpathRibbon
);
parcelHelpers.export(exports, "splatter", ()=>splatter
);
parcelHelpers.export(exports, "turtleLineMode", ()=>turtleLineMode
);
parcelHelpers.export(exports, "drawPointsTaper", ()=>drawPointsTaper
);
parcelHelpers.export(exports, "circleAtPoint", ()=>circleAtPoint
);
parcelHelpers.export(exports, "variableCircleAtPoint", ()=>variableCircleAtPoint
);
parcelHelpers.export(exports, "drawSegment", ()=>drawSegment
);
parcelHelpers.export(exports, "drawSegmentTaper", ()=>drawSegmentTaper
);
parcelHelpers.export(exports, "debugShowAttractor", ()=>debugShowAttractor
);
parcelHelpers.export(exports, "createFFParticleCoords", ()=>createFFParticleCoords
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../rndrgen/math/math");
var _primatives = require("../rndrgen/canvas/primatives");
var _random = require("../rndrgen/math/random");
const spikedCircle = (context)=>({ x , y , radius , color  }, spikes, spikeLength = 5)=>{
        const circleStroke = 1;
        const spikeStroke = 2;
        context.strokeStyle = color.toRgbString();
        context.lineWidth = circleStroke;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        // context.fillStyle = 'rgba(255,255,255,.1)';
        // context.fill();
        context.stroke();
        for(let s = 0; s < spikes.length; s++){
            const pointA = _math.pointOnCircle(x, y, radius, spikes[s]);
            const pointB = _math.pointOnCircle(x, y, radius + spikeLength, spikes[s]);
            context.strokeStyle = color.toRgbString();
            _primatives.line(context)(pointA.x, pointA.y, pointB.x, pointB.y, spikeStroke);
        }
    }
;
const DONTUSETHISpathRibbon = (context)=>(path, color, thickness = 1, stroke = false)=>{
        // const rColor = tinycolor(color).clone();
        // const gradient = context.createLinearGradient(0, startY, 0, maxY);
        // gradient.addColorStop(0, colorLinesTop.toRgbString());
        // gradient.addColorStop(1, colorLinesBottom.toRgbString());
        context.beginPath();
        context.moveTo(path[0], path[0]);
        path.forEach((point, i)=>{
            const x = point[0];
            const y = point[1];
            context.lineTo(x, y);
        });
        path.reverse().forEach((point, i)=>{
            const x = point[0];
            const y = point[1];
            const distFromCenter = Math.abs(path.length / 2 - i);
            const size = _math.mapRange(0, path.length / 2, 1, thickness, distFromCenter);
            context.lineTo(x + size, y + size);
        });
        context.closePath();
        // if (stroke) {
        //     context.strokeStyle = rColor.darken(70).toRgbString();
        //     context.lineWidth = 0.75;
        //     context.stroke();
        // }
        // context.fillStyle = gradient;
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        context.fill();
    }
;
const splatter = (context)=>(x, y, color, size, amount = 3, range = 20)=>{
        for(let i = 0; i < amount; i++){
            const s = _random.randomWholeBetween(size * 0.25, size * 3);
            // circleOld dist
            const radius = _random.randomWholeBetween(0, range);
            const angle = _random.randomNumberBetween(0, _math.TAU);
            const xoff = radius * Math.cos(angle);
            const yoff = radius * Math.sin(angle);
            // square dist
            // const xoff = randomWholeBetween(-range, range);
            // const yoff = randomWholeBetween(-range, range);
            _primatives.circleFilled(context)(x + xoff, y + yoff, s, color);
        }
    }
;
const lineCap = 'butt';
const lineJoin = 'miter';
const turtleLineMode = (m = 'butt')=>{
    if (m === 'butt') {
        lineCap = 'butt';
        lineJoin = 'miter';
    } else if (m === 'round') {
        lineCap = 'round';
        lineJoin = 'round';
    }
};
const drawPointsTaper = (ctx)=>(points, color = 'black', width = 1)=>{
        ctx.strokeStyle = _tinycolor2Default.default(color).clone().toRgbString();
        const mid = points.length / 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        points.forEach((coords, i)=>{
            const dist = Math.abs(mid - i);
            const w = _math.mapRange(0, mid, width, 1, dist);
            ctx.lineWidth = w;
            ctx.beginPath();
            ctx.moveTo(coords[0], coords[1]);
            ctx.lineTo(coords[0], coords[1]);
            ctx.stroke();
        });
    }
;
const circleAtPoint = (context)=>(points, color = 'black', radius = 5)=>{
        points.forEach((coords)=>{
            _primatives.circleFilled(context)(coords[0], coords[1], radius, color);
        });
    }
;
const variableCircleAtPoint = (context)=>(points, color = 'black', radius = 5, freq = 10, amp = 2)=>{
        points.forEach((coords)=>{
            const v = Math.sin(coords[0] / freq) * amp;
            _primatives.circleFilled(context)(coords[0], coords[1], Math.abs(radius - v), color);
        });
    }
;
const drawSegment = (ctx)=>(segments, color, weight, points = false)=>{
        ctx.lineCap = 'round';
        // ctx.lineJoin = 'round';
        ctx.strokeStyle = _tinycolor2Default.default(color).clone().toRgbString();
        ctx.lineWidth = weight;
        ctx.beginPath();
        segments.forEach((seg, i)=>{
            if (i === 0) ctx.moveTo(seg.start.x, seg.start.y);
            else ctx.lineTo(seg.start.x, seg.start.y);
            ctx.lineTo(seg.end.x, seg.end.y);
        });
        ctx.stroke();
        if (points) segments.forEach((seg, i)=>{
            const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
            _primatives.circleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
            _primatives.circleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
        });
    }
;
const drawSegmentTaper = (ctx)=>(segments, color, maxWeight, minWeight = 1, points = false)=>{
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = _tinycolor2Default.default(color).clone().toRgbString();
        const mid = segments.length / 2;
        segments.forEach((seg, i)=>{
            const dist = Math.abs(mid - i);
            const w = _math.mapRange(0, mid, maxWeight, minWeight, dist);
            ctx.beginPath();
            ctx.lineWidth = w;
            if (i === 0) ctx.moveTo(seg.start.x, seg.start.y);
            else ctx.lineTo(seg.start.x, seg.start.y);
            ctx.lineTo(seg.end.x, seg.end.y);
            ctx.stroke();
        });
        if (points) segments.forEach((seg, i)=>{
            const rad = i === 0 || i === segments.length - 1 ? 3 : 1;
            _primatives.circleFilled(ctx)(seg.start.x, seg.start.y, rad, 'green');
            _primatives.circleFilled(ctx)(seg.end.x, seg.end.y, rad, 'red');
        });
    }
;
const horizontalSinWave = (ctx, startX, maxX, yoffset, pixelColor)=>{
    const freq = 5;
    const amp = 15;
    const step = 2;
    let theta = 0;
    for(let x = startX; x < maxX; x += step){
        const y = _math.circleY(theta, amp, freq) + yoffset;
        _primatives.pixel(ctx)(x, y, pixelColor, 'circle', 2);
        theta++;
    }
};
const verticalSinWave = (ctx, startX, maxX, yoffset, pixelColor)=>{
    const freq = 5;
    const amp = 15;
    const step = 2;
    let theta = 0;
    for(let y = startY; y < maxY; y += step){
        const x = _math.circleY(theta, amp, freq) + xoffset;
        _primatives.pixel(ctx)(x, y, pixelColor, 'circle', 2);
        theta++;
    }
};
const fullScreenSin = (xoffset, yoffset)=>{
    const freq = 30;
    const amp = 5;
    const step = 5;
    let theta = 0;
    for(let sx = startX; sx < maxX; sx += step)for(let sy = startY; sy < maxY; sy += step){
        const x = _math.circleX(theta, amp, freq) + xoffset + sx;
        const y = _math.circleY(theta, amp, freq) + yoffset + sy;
        plot(x + xoffset, y + yoffset);
        theta++;
    }
};
/*
    https://www.desmos.com/calculator/rzwar3xxpy
    y-x = amp * Math.sin((y+x)/freq)
     */ const plotDiagSinWave = (xoffset, yoffset)=>{
    const freq = 30; // 30
    const amp = 5; // 5
    let y = 0;
    const a = Math.PI / 3; // angle of the wave, 1 is 45
    for(let x = 0; x < canvasWidth + 10; x++){
        const b = Math.sin(x / Math.PI) * 5;
        // x = y - Math.sin(y+x)
        y = amp * Math.sin((y + b) / freq) + x * a;
        plot(x + xoffset, y + yoffset);
    }
};
const debugShowAttractor = (context)=>({ x , y , mass , g  }, mode, radius)=>{
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fillStyle = 'rgba(0,0,0,.1)';
        context.fill();
        context.beginPath();
        context.arc(x, y, Math.sqrt(mass) * g, 0, Math.PI * 2, false);
        context.fillStyle = mode === 1 ? 'rgba(0,255,0,.25)' : 'rgba(255,0,0,.25)';
        context.fill();
    }
;
const plotFFPointLines = (num)=>{
    for(let i = 0; i < num; i++){
        const coords = createFFParticleCoords(noise, 0, _random.randomWholeBetween(0, canvasMidY * 2), 2000, 1);
        pointPathPA(ctx)(coords, _tinycolor2Default.default('rgba(0,0,0,.5'), 1);
    }
};
const createFFParticleCoords = (fieldFn, startX, startY, length, fMag = 1, vlimit = 1)=>{
    const props = {
        x: startX,
        y: startY,
        velocityX: 0,
        velocityY: 0,
        mass: 1
    };
    const particle = new Particle(props);
    const coords = [];
    for(let i = 0; i < length; i++){
        const theta = fieldFn(particle.x, particle.y);
        // theta = quantize(4, theta);
        const force = uvFromAngle(theta).setMag(fMag);
        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(vlimit);
        particle.updatePosWithVelocity();
        coords.push([
            particle.x,
            particle.y
        ]);
        particle.acceleration = new Vector(0, 0);
    }
    return coords;
};

},{"tinycolor2":"101FG","../rndrgen/math/math":"4t0bw","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"BodqP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "simplexNoise2d", ()=>simplexNoise2d
);
parcelHelpers.export(exports, "simplexNoise3d", ()=>simplexNoise3d
);
parcelHelpers.export(exports, "diagLines", ()=>diagLines
);
parcelHelpers.export(exports, "sinField", ()=>sinField
);
parcelHelpers.export(exports, "cliffordAttractor", ()=>cliffordAttractor
);
parcelHelpers.export(exports, "jongAttractor", ()=>jongAttractor
);
var _math = require("./math");
var _random = require("./random");
const simplexNoise2d = (x, y, f = 0.0005)=>_random.create2dNoise(x, y, 1, f) * _math.TAU
;
const simplexNoise3d = (x, y, t, f = 0.002)=>_random.create3dNoise(x, y, t, 1, f) * _math.TAU
;
const diagLines = (x, y)=>(x + y) * 0.01 * _math.TAU
;
const sinField = (x, y)=>(Math.sin(x * 0.01) + Math.sin(y * 0.01)) * _math.TAU
;
const attractorScale = 0.01;
const attractorVarA = _random.randomNumberBetween(-2, 2);
const attractorVarB = _random.randomNumberBetween(-2, 2);
const attractorVarC = _random.randomNumberBetween(-2, 2);
const attractorVarD = _random.randomNumberBetween(-2, 2);
const cliffordAttractor = (width, height, x, y, scale)=>{
    scale = scale || attractorScale;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(attractorVarA * y) + attractorVarC * Math.cos(attractorVarA * x);
    const y1 = Math.sin(attractorVarB * x) + attractorVarD * Math.cos(attractorVarB * y);
    return Math.atan2(y1 - y, x1 - x);
};
const jongAttractor = (width, height, x, y, scale)=>{
    scale = scale || attractorScale;
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    const x1 = Math.sin(attractorVarA * y) - Math.cos(attractorVarB * x);
    const y1 = Math.sin(attractorVarC * x) - Math.cos(attractorVarD * y);
    return Math.atan2(y1 - y, x1 - x);
};
const simplex2d = (x, y)=>simplexNoise2d(x, y, 0.002)
;
const simplex3d = (x, y)=>simplexNoise3d(x, y, time, 0.0005)
;
const clifford = (x, y, scale)=>cliffordAttractor(canvas.width, canvas.height, x, y, scale)
;
const jong = (x, y, scale)=>jongAttractor(canvas.width, canvas.height, x, y, scale)
;

},{"./math":"4t0bw","./random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"3qayM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "arrayToTinyColor", ()=>arrayToTinyColor
);
parcelHelpers.export(exports, "hslFromRange", ()=>hslFromRange
);
parcelHelpers.export(exports, "brightest", ()=>brightest
);
parcelHelpers.export(exports, "darkest", ()=>darkest
);
parcelHelpers.export(exports, "bicPenBlue", ()=>bicPenBlue
);
parcelHelpers.export(exports, "paperWhite", ()=>paperWhite
);
parcelHelpers.export(exports, "warmWhite", ()=>warmWhite
);
parcelHelpers.export(exports, "warmPink", ()=>warmPink
);
parcelHelpers.export(exports, "coolGreyDark", ()=>coolGreyDark
);
parcelHelpers.export(exports, "warmGreyDark", ()=>warmGreyDark
);
parcelHelpers.export(exports, "palettes", ()=>palettes
);
parcelHelpers.export(exports, "nicePalette", ()=>nicePalette
);
parcelHelpers.export(exports, "palette", ()=>palette
);
parcelHelpers.export(exports, "get2Tone", ()=>get2Tone
);
// Original implementation idea from Sebastian @void43544164
// https://twitter.com/void43544164/status/1408133809384591366
// Returns Tinycolors https://github.com/bgrins/TinyColor
parcelHelpers.export(exports, "Palette", ()=>Palette
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _niceColorPalettes = require("nice-color-palettes");
var _math = require("../math/math");
var _random = require("../math/random");
const arrayToTinyColor = (arry)=>arry.map((c)=>_tinycolor2Default.default(c)
    )
;
const hslFromRange = (y1, x2, y2, v)=>{
    const h = _math.mapRange(0, y1, x2, y2, v);
    const s = 100;
    const l = 50;
    return _tinycolor2Default.default(`hsl(${h},${s}%,${l}%)`);
};
const brightest = (arry)=>{
    const colors = arrayToTinyColor(arry);
    return colors.reduce((acc, c)=>{
        if (c.getBrightness() > acc.getBrightness()) acc = c;
        return acc;
    }, colors[0]);
};
const darkest = (arry)=>{
    const colors = arrayToTinyColor(arry);
    return colors.reduce((acc, c)=>{
        if (c.getBrightness() < acc.getBrightness()) acc = c;
        return acc;
    }, colors[0]);
};
const bicPenBlue = _tinycolor2Default.default('hsl(250,79,29)').clone();
const paperWhite = _tinycolor2Default.default('hsl(53,3,100)').clone();
const warmWhite = _tinycolor2Default.default('hsl(42, 14%, 86%)').clone();
const warmPink = _tinycolor2Default.default('hsl(29, 42%, 86%)').clone();
const coolGreyDark = _tinycolor2Default.default('#1f2933').clone();
const warmGreyDark = _tinycolor2Default.default('#27241d').clone();
const palettes = {
    greyWarm: [
        '#faf97f',
        '#e8e6e1',
        '#d3cec4',
        '#b8b2a7',
        '#a39e93',
        '#857f72',
        '#625d52',
        '#504a40',
        '#423d33',
        '#27241d', 
    ],
    greyCool: [
        '#f5f7fa',
        '#e4e7eb',
        '#cbd2d9',
        '#9aa5b1',
        '#7b8794',
        '#616e7c',
        '#52606d',
        '#3e4c59',
        '#323f4b',
        '#1f2933', 
    ],
    pop: [
        '#ed3441',
        '#ffd630',
        '#329fe3',
        '#154296',
        '#303030'
    ],
    '60s_psyc': [
        '#ffeb00',
        '#fc0019',
        '#01ff4f',
        '#ff01d7',
        '#5600cc',
        '#00edf5'
    ],
    '70s': [
        '#73BFA3',
        '#F2DBAE',
        '#F29829',
        '#D9631E',
        '#593C2C'
    ],
    '80s_pastells': [
        '#FF3F3F',
        '#FF48C4',
        '#F3EA5F',
        '#C04DF9',
        '#2BD1FC',
        '#38CEF6'
    ],
    '80s_pop': [
        '#FF82E2',
        '#70BAFF',
        '#FED715',
        '#0037B3',
        '#FE0879'
    ],
    '90s': [
        '#42C8B0',
        '#4575F3',
        '#6933B0',
        '#D36F88',
        '#FC8D45'
    ],
    retro_sunset: [
        '#FFD319',
        '#FF2975',
        '#F222FF',
        '#8C1EFF',
        '#FF901F'
    ],
    vapor_wave: [
        '#F6A3EF',
        '#50D8EC',
        '#DD6DFB',
        '#EECD69',
        '#6FEAE6'
    ],
    // https://www.colourlovers.com/palette/694737/Thought_Provoking
    thought_provoking: [
        'hsl(46, 75%, 70%)',
        'hsl(10, 66%, 56%)',
        'hsl(350, 65%, 46%)',
        'hsl(336, 40%, 24%)',
        'hsl(185, 19%, 40%)', 
    ]
};
const nicePalette = (_)=>_niceColorPalettes[_random.randomWholeBetween(0, 99)]
;
const palette = (_)=>palettes[_random.oneOf(Object.keys(palettes))]
;
const get2Tone = (l = 10, d = 25)=>{
    const pal = nicePalette();
    const light = brightest(pal).clone().lighten(l);
    const dark = darkest(pal).clone().darken(d);
    const text = light.clone().darken(15).desaturate(20);
    return {
        palette,
        light,
        dark,
        text
    };
};
class Palette {
    constructor(colorsArray){
        this.colors = arrayToTinyColor(colorsArray || nicePalette());
    }
    get brightest() {
        return brightest(this.colors);
    }
    get darkest() {
        return darkest(this.colors);
    }
    get length() {
        return this.colors.length;
    }
    // TODO weighted random
    oneOf() {
        return _random.oneOf(this.colors);
    }
    getAtIndex(index) {
        const n = Math.abs(Math.round(index)) % this.colors.length;
        return this.colors[n].clone();
    }
    get(index, variance = 0, alpha = 1) {
        const c = this.getAtIndex(index);
        if (variance > 0) c.spin(_random.randomNormalNumberBetween(variance * -1, variance));
        // TODO if a > 255 => a/255 ?
        if (alpha < 1) c.setAlpha(alpha);
        return c;
    }
}

},{"tinycolor2":"101FG","nice-color-palettes":"3CNWv","../math/math":"4t0bw","../math/random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"3CNWv":[function(require,module,exports) {
module.exports = JSON.parse("[[\"#69d2e7\",\"#a7dbd8\",\"#e0e4cc\",\"#f38630\",\"#fa6900\"],[\"#fe4365\",\"#fc9d9a\",\"#f9cdad\",\"#c8c8a9\",\"#83af9b\"],[\"#ecd078\",\"#d95b43\",\"#c02942\",\"#542437\",\"#53777a\"],[\"#556270\",\"#4ecdc4\",\"#c7f464\",\"#ff6b6b\",\"#c44d58\"],[\"#774f38\",\"#e08e79\",\"#f1d4af\",\"#ece5ce\",\"#c5e0dc\"],[\"#e8ddcb\",\"#cdb380\",\"#036564\",\"#033649\",\"#031634\"],[\"#490a3d\",\"#bd1550\",\"#e97f02\",\"#f8ca00\",\"#8a9b0f\"],[\"#594f4f\",\"#547980\",\"#45ada8\",\"#9de0ad\",\"#e5fcc2\"],[\"#00a0b0\",\"#6a4a3c\",\"#cc333f\",\"#eb6841\",\"#edc951\"],[\"#e94e77\",\"#d68189\",\"#c6a49a\",\"#c6e5d9\",\"#f4ead5\"],[\"#3fb8af\",\"#7fc7af\",\"#dad8a7\",\"#ff9e9d\",\"#ff3d7f\"],[\"#d9ceb2\",\"#948c75\",\"#d5ded9\",\"#7a6a53\",\"#99b2b7\"],[\"#ffffff\",\"#cbe86b\",\"#f2e9e1\",\"#1c140d\",\"#cbe86b\"],[\"#efffcd\",\"#dce9be\",\"#555152\",\"#2e2633\",\"#99173c\"],[\"#343838\",\"#005f6b\",\"#008c9e\",\"#00b4cc\",\"#00dffc\"],[\"#413e4a\",\"#73626e\",\"#b38184\",\"#f0b49e\",\"#f7e4be\"],[\"#ff4e50\",\"#fc913a\",\"#f9d423\",\"#ede574\",\"#e1f5c4\"],[\"#99b898\",\"#fecea8\",\"#ff847c\",\"#e84a5f\",\"#2a363b\"],[\"#655643\",\"#80bca3\",\"#f6f7bd\",\"#e6ac27\",\"#bf4d28\"],[\"#00a8c6\",\"#40c0cb\",\"#f9f2e7\",\"#aee239\",\"#8fbe00\"],[\"#351330\",\"#424254\",\"#64908a\",\"#e8caa4\",\"#cc2a41\"],[\"#554236\",\"#f77825\",\"#d3ce3d\",\"#f1efa5\",\"#60b99a\"],[\"#5d4157\",\"#838689\",\"#a8caba\",\"#cad7b2\",\"#ebe3aa\"],[\"#8c2318\",\"#5e8c6a\",\"#88a65e\",\"#bfb35a\",\"#f2c45a\"],[\"#fad089\",\"#ff9c5b\",\"#f5634a\",\"#ed303c\",\"#3b8183\"],[\"#ff4242\",\"#f4fad2\",\"#d4ee5e\",\"#e1edb9\",\"#f0f2eb\"],[\"#f8b195\",\"#f67280\",\"#c06c84\",\"#6c5b7b\",\"#355c7d\"],[\"#d1e751\",\"#ffffff\",\"#000000\",\"#4dbce9\",\"#26ade4\"],[\"#1b676b\",\"#519548\",\"#88c425\",\"#bef202\",\"#eafde6\"],[\"#5e412f\",\"#fcebb6\",\"#78c0a8\",\"#f07818\",\"#f0a830\"],[\"#bcbdac\",\"#cfbe27\",\"#f27435\",\"#f02475\",\"#3b2d38\"],[\"#452632\",\"#91204d\",\"#e4844a\",\"#e8bf56\",\"#e2f7ce\"],[\"#eee6ab\",\"#c5bc8e\",\"#696758\",\"#45484b\",\"#36393b\"],[\"#f0d8a8\",\"#3d1c00\",\"#86b8b1\",\"#f2d694\",\"#fa2a00\"],[\"#2a044a\",\"#0b2e59\",\"#0d6759\",\"#7ab317\",\"#a0c55f\"],[\"#f04155\",\"#ff823a\",\"#f2f26f\",\"#fff7bd\",\"#95cfb7\"],[\"#b9d7d9\",\"#668284\",\"#2a2829\",\"#493736\",\"#7b3b3b\"],[\"#bbbb88\",\"#ccc68d\",\"#eedd99\",\"#eec290\",\"#eeaa88\"],[\"#b3cc57\",\"#ecf081\",\"#ffbe40\",\"#ef746f\",\"#ab3e5b\"],[\"#a3a948\",\"#edb92e\",\"#f85931\",\"#ce1836\",\"#009989\"],[\"#300030\",\"#480048\",\"#601848\",\"#c04848\",\"#f07241\"],[\"#67917a\",\"#170409\",\"#b8af03\",\"#ccbf82\",\"#e33258\"],[\"#aab3ab\",\"#c4cbb7\",\"#ebefc9\",\"#eee0b7\",\"#e8caaf\"],[\"#e8d5b7\",\"#0e2430\",\"#fc3a51\",\"#f5b349\",\"#e8d5b9\"],[\"#ab526b\",\"#bca297\",\"#c5ceae\",\"#f0e2a4\",\"#f4ebc3\"],[\"#607848\",\"#789048\",\"#c0d860\",\"#f0f0d8\",\"#604848\"],[\"#b6d8c0\",\"#c8d9bf\",\"#dadabd\",\"#ecdbbc\",\"#fedcba\"],[\"#a8e6ce\",\"#dcedc2\",\"#ffd3b5\",\"#ffaaa6\",\"#ff8c94\"],[\"#3e4147\",\"#fffedf\",\"#dfba69\",\"#5a2e2e\",\"#2a2c31\"],[\"#fc354c\",\"#29221f\",\"#13747d\",\"#0abfbc\",\"#fcf7c5\"],[\"#cc0c39\",\"#e6781e\",\"#c8cf02\",\"#f8fcc1\",\"#1693a7\"],[\"#1c2130\",\"#028f76\",\"#b3e099\",\"#ffeaad\",\"#d14334\"],[\"#a7c5bd\",\"#e5ddcb\",\"#eb7b59\",\"#cf4647\",\"#524656\"],[\"#dad6ca\",\"#1bb0ce\",\"#4f8699\",\"#6a5e72\",\"#563444\"],[\"#5c323e\",\"#a82743\",\"#e15e32\",\"#c0d23e\",\"#e5f04c\"],[\"#edebe6\",\"#d6e1c7\",\"#94c7b6\",\"#403b33\",\"#d3643b\"],[\"#fdf1cc\",\"#c6d6b8\",\"#987f69\",\"#e3ad40\",\"#fcd036\"],[\"#230f2b\",\"#f21d41\",\"#ebebbc\",\"#bce3c5\",\"#82b3ae\"],[\"#b9d3b0\",\"#81bda4\",\"#b28774\",\"#f88f79\",\"#f6aa93\"],[\"#3a111c\",\"#574951\",\"#83988e\",\"#bcdea5\",\"#e6f9bc\"],[\"#5e3929\",\"#cd8c52\",\"#b7d1a3\",\"#dee8be\",\"#fcf7d3\"],[\"#1c0113\",\"#6b0103\",\"#a30006\",\"#c21a01\",\"#f03c02\"],[\"#000000\",\"#9f111b\",\"#b11623\",\"#292c37\",\"#cccccc\"],[\"#382f32\",\"#ffeaf2\",\"#fcd9e5\",\"#fbc5d8\",\"#f1396d\"],[\"#e3dfba\",\"#c8d6bf\",\"#93ccc6\",\"#6cbdb5\",\"#1a1f1e\"],[\"#f6f6f6\",\"#e8e8e8\",\"#333333\",\"#990100\",\"#b90504\"],[\"#1b325f\",\"#9cc4e4\",\"#e9f2f9\",\"#3a89c9\",\"#f26c4f\"],[\"#a1dbb2\",\"#fee5ad\",\"#faca66\",\"#f7a541\",\"#f45d4c\"],[\"#c1b398\",\"#605951\",\"#fbeec2\",\"#61a6ab\",\"#accec0\"],[\"#5e9fa3\",\"#dcd1b4\",\"#fab87f\",\"#f87e7b\",\"#b05574\"],[\"#951f2b\",\"#f5f4d7\",\"#e0dfb1\",\"#a5a36c\",\"#535233\"],[\"#8dccad\",\"#988864\",\"#fea6a2\",\"#f9d6ac\",\"#ffe9af\"],[\"#2d2d29\",\"#215a6d\",\"#3ca2a2\",\"#92c7a3\",\"#dfece6\"],[\"#413d3d\",\"#040004\",\"#c8ff00\",\"#fa023c\",\"#4b000f\"],[\"#eff3cd\",\"#b2d5ba\",\"#61ada0\",\"#248f8d\",\"#605063\"],[\"#ffefd3\",\"#fffee4\",\"#d0ecea\",\"#9fd6d2\",\"#8b7a5e\"],[\"#cfffdd\",\"#b4dec1\",\"#5c5863\",\"#a85163\",\"#ff1f4c\"],[\"#9dc9ac\",\"#fffec7\",\"#f56218\",\"#ff9d2e\",\"#919167\"],[\"#4e395d\",\"#827085\",\"#8ebe94\",\"#ccfc8e\",\"#dc5b3e\"],[\"#a8a7a7\",\"#cc527a\",\"#e8175d\",\"#474747\",\"#363636\"],[\"#f8edd1\",\"#d88a8a\",\"#474843\",\"#9d9d93\",\"#c5cfc6\"],[\"#046d8b\",\"#309292\",\"#2fb8ac\",\"#93a42a\",\"#ecbe13\"],[\"#f38a8a\",\"#55443d\",\"#a0cab5\",\"#cde9ca\",\"#f1edd0\"],[\"#a70267\",\"#f10c49\",\"#fb6b41\",\"#f6d86b\",\"#339194\"],[\"#ff003c\",\"#ff8a00\",\"#fabe28\",\"#88c100\",\"#00c176\"],[\"#ffedbf\",\"#f7803c\",\"#f54828\",\"#2e0d23\",\"#f8e4c1\"],[\"#4e4d4a\",\"#353432\",\"#94ba65\",\"#2790b0\",\"#2b4e72\"],[\"#0ca5b0\",\"#4e3f30\",\"#fefeeb\",\"#f8f4e4\",\"#a5b3aa\"],[\"#4d3b3b\",\"#de6262\",\"#ffb88c\",\"#ffd0b3\",\"#f5e0d3\"],[\"#fffbb7\",\"#a6f6af\",\"#66b6ab\",\"#5b7c8d\",\"#4f2958\"],[\"#edf6ee\",\"#d1c089\",\"#b3204d\",\"#412e28\",\"#151101\"],[\"#9d7e79\",\"#ccac95\",\"#9a947c\",\"#748b83\",\"#5b756c\"],[\"#fcfef5\",\"#e9ffe1\",\"#cdcfb7\",\"#d6e6c3\",\"#fafbe3\"],[\"#9cddc8\",\"#bfd8ad\",\"#ddd9ab\",\"#f7af63\",\"#633d2e\"],[\"#30261c\",\"#403831\",\"#36544f\",\"#1f5f61\",\"#0b8185\"],[\"#aaff00\",\"#ffaa00\",\"#ff00aa\",\"#aa00ff\",\"#00aaff\"],[\"#d1313d\",\"#e5625c\",\"#f9bf76\",\"#8eb2c5\",\"#615375\"],[\"#ffe181\",\"#eee9e5\",\"#fad3b2\",\"#ffba7f\",\"#ff9c97\"],[\"#73c8a9\",\"#dee1b6\",\"#e1b866\",\"#bd5532\",\"#373b44\"],[\"#805841\",\"#dcf7f3\",\"#fffcdd\",\"#ffd8d8\",\"#f5a2a2\"]]");

},{}],"2OcGA":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "orientation", ()=>orientation
);
parcelHelpers.export(exports, "ratio", ()=>ratio
);
parcelHelpers.export(exports, "scale", ()=>scale
);
parcelHelpers.export(exports, "sketchSizeMode", ()=>sketchSizeMode
);
parcelHelpers.export(exports, "largePrint", ()=>largePrint
);
parcelHelpers.export(exports, "instagram", ()=>instagram
);
parcelHelpers.export(exports, "sketch", ()=>sketch
);
/*
Convenience canvas sketch runner. Based on p5js


const variation = () => {
    const config = {};

    const setup = ({canvas, context}) => {
        // create initial state
    };

    // will run every frame
    const draw = ({canvas, context, mouse}) => {
        // draw on every frame
        return 1; // -1 to exit animation loop
    };

    return {
        config,
        setup,
        draw,
    };
};

TODO
- [ ] merge screen shot code
- [ ] Canvas Recorder  https://xosh.org/canvas-recorder/
- [ ] coords of a mouse down to variation?
- [ ] better touch input
- [ ] svg https://github.com/canvg/canvg
- [ ] great ideas here http://paperjs.org/features/
*/ var _statsJs = require("stats.js");
var _statsJsDefault = parcelHelpers.interopDefault(_statsJs);
var _canvas = require("./canvas/canvas");
var _utils = require("./utils");
var _random = require("./math/random");
var _math = require("./math/math");
var _canvasRecorder = require("./canvas/CanvasRecorder");
const orientation = {
    portrait: 0,
    landscape: 1
};
const ratio = {
    a4: 0.773,
    a3: 11 / 17,
    a3plus: 13 / 19,
    archd: 24 / 36,
    golden: 0.6180339887498949,
    square: -1,
    auto: 1
};
const scale = {
    standard: 1,
    hidpi: 2
};
const sketchSizeMode = {
    js: 0,
    css: 1,
    sketch: 2
};
const largePrint = {
    ratio: ratio.a3plus,
    scale: scale.hidpi,
    multiplier: 1,
    orientation: orientation.landscape
};
const instagram = {
    ratio: ratio.square,
    scale: scale.standard
};
const sketch = (canvasElId, smode = 0, debug)=>{
    const mouse = {
        x: undefined,
        y: undefined,
        isDown: false,
        radius: 100
    };
    const sizeMode = smode;
    const debugMode = debug;
    let statsJS = null;
    let hasStarted = false;
    let fps = 0;
    let drawRuns = 0;
    let currentVariationFn;
    let currentVariationRes;
    let animationId;
    let canvasRecorder;
    let isRecording = false;
    const pauseOnWindowBlur = true;
    let isPaused = false;
    const canvasSizeMultiple = 2;
    const canvasSizeMultiplier = 0.9;
    const canvas = document.getElementById(canvasElId);
    const context = canvas.getContext('2d');
    const getCanvas = (_)=>canvas
    ;
    const getContext = (_)=>context
    ;
    const getMouse = (_)=>mouse
    ;
    const mouseDown = (evt)=>{
        mouse.isDown = true;
    };
    const mouseMove = (evt)=>{
        const mult = _canvas.isHiDPICanvas() ? 2 : 1;
        const canvasFrame = canvas.getBoundingClientRect();
        mouse.x = (evt.x - canvasFrame.x) * mult;
        mouse.y = (evt.y - canvasFrame.y) * mult;
    };
    const mouseUp = (evt)=>{
        mouse.isDown = false;
    };
    const mouseOut = (evt)=>{
        mouse.x = undefined;
        mouse.y = undefined;
        mouse.isDown = false;
    };
    const applyCanvasSize = (config, fraction)=>{
        if (sizeMode === sketchSizeMode.css) // const s = canvas.getBoundingClientRect();
        // resizeCanvas(canvas, context, s.width, s.height, 1);
        return;
        if (sizeMode === sketchSizeMode.sketch) return;
        const width = _utils.defaultValue(config, 'width', window.innerWidth);
        const height = _utils.defaultValue(config, 'height', window.innerHeight);
        let finalWidth = width;
        let finalHeight = height;
        const cfgMultiplier = _utils.defaultValue(config, 'multiplier', fraction);
        const cfgOrientation = _utils.defaultValue(config, 'orientation', orientation.landscape);
        const cfgRatio = _utils.defaultValue(config, 'ratio', ratio.auto);
        const cfgScale = _utils.defaultValue(config, 'scale', scale.standard);
        if (cfgRatio === ratio.auto) {
            finalWidth = width;
            finalHeight = height;
        } else if (cfgRatio === ratio.square) {
            const smallestWindowSize = Math.min(width, height) * cfgMultiplier;
            finalWidth = smallestWindowSize;
            finalHeight = smallestWindowSize;
        } else if (cfgOrientation === orientation.landscape) {
            let w = width;
            let h = Math.round(cfgRatio * width);
            const delta = h - height;
            if (delta > 0) {
                w -= delta;
                h -= delta;
            }
            finalWidth = w * cfgMultiplier;
            finalHeight = h * cfgMultiplier;
        } else if (cfgOrientation === orientation.portrait) {
            let w = Math.round(cfgRatio * height);
            let h = height;
            const delta = w - width;
            if (delta > 0) {
                w -= delta;
                h -= delta;
            }
            finalWidth = w * cfgMultiplier;
            finalHeight = h * cfgMultiplier;
        }
        finalWidth = _math.roundToNearest(canvasSizeMultiple, finalWidth);
        finalHeight = _math.roundToNearest(canvasSizeMultiple, finalHeight);
        _canvas.resizeCanvas(canvas, context, finalWidth, finalHeight, cfgScale);
        console.log(`Canvas size ${finalWidth} x ${finalHeight} at ${window.devicePixelRatio}dpr`);
    };
    /*
    Passing in the sketch instance is jank. Refactor this to a class and just pass this
     */ const run = (variation, sinstance)=>{
        currentVariationFn = variation;
        currentVariationRes = currentVariationFn();
        const sketchInstance = sinstance;
        if (!statsJS && debugMode) {
            statsJS = new _statsJsDefault.default();
            statsJS.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(statsJS.dom);
        }
        addEvents();
        drawRuns = 0;
        let currentDrawLimit;
        let rendering = true;
        let targetFpsInterval = 1000 / fps;
        let lastAnimationFrameTime;
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (currentVariationRes.hasOwnProperty('config')) {
            const { config  } = currentVariationRes;
            applyCanvasSize(config, canvasSizeMultiplier);
            if (config.fps) {
                fps = config.fps;
                targetFpsInterval = 1000 / fps;
            }
            if (config.drawLimit > 0) currentDrawLimit = config.drawLimit;
        } else // TODO check for sizeMode
        _canvas.resizeCanvas(canvas, context, window.innerWidth, window.innerHeight);
        const checkDrawLimit = ()=>{
            if (currentDrawLimit) return drawRuns < currentDrawLimit;
            return true;
        };
        const startSketch = ()=>{
            window.removeEventListener('load', startSketch);
            hasStarted = true;
            // default 1080p bps, 30fps
            canvasRecorder = new _canvasRecorder.CanvasRecorder(canvas);
            currentVariationRes.setup({
                canvas,
                context,
                sketchInstance
            });
            const drawFrame = ()=>{
                if (pauseOnWindowBlur && isPaused) return 1;
                drawRuns++;
                if (statsJS) statsJS.begin();
                const res = currentVariationRes.draw({
                    canvas,
                    context,
                    mouse
                });
                if (statsJS) statsJS.end();
                return res;
            };
            const render = ()=>{
                const result = drawFrame();
                if (result !== -1 && checkDrawLimit()) animationId = requestAnimationFrame(render);
            };
            const renderAtFps = ()=>{
                if (rendering) animationId = window.requestAnimationFrame(renderAtFps);
                const now = Date.now();
                const elapsed = now - lastAnimationFrameTime;
                if (elapsed > targetFpsInterval) {
                    lastAnimationFrameTime = now - elapsed % targetFpsInterval;
                    const result = drawFrame();
                    if (result === -1 || currentDrawLimit && drawRuns >= currentDrawLimit) rendering = false;
                }
            };
            if (!fps) animationId = window.requestAnimationFrame(render);
            else {
                lastAnimationFrameTime = Date.now();
                animationId = window.requestAnimationFrame(renderAtFps);
            }
        };
        if (!hasStarted) window.addEventListener('load', startSketch);
        else startSketch();
    };
    const stop = ()=>{
        removeEvents();
        window.cancelAnimationFrame(animationId);
    };
    const windowResize = (evt)=>{
        // clear and rerun to avoid artifacts
        if (animationId) {
            stop();
            run(currentVariationFn);
        }
    };
    const windowFocus = (evt)=>{
        if (pauseOnWindowBlur) isPaused = false;
    };
    const windowBlur = (evt)=>{
        if (pauseOnWindowBlur) isPaused = true;
    };
    const addEvents = (_)=>{
        window.addEventListener('mousedown', mouseDown);
        window.addEventListener('touchstart', mouseDown);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('touchend', mouseUp);
        window.addEventListener('mouseout', mouseOut);
        window.addEventListener('touchcancel', mouseOut);
        window.addEventListener('resize', windowResize);
        window.addEventListener('blur', windowBlur);
        window.addEventListener('focus', windowFocus);
    };
    const removeEvents = (_)=>{
        window.removeEventListener('mousedown', mouseDown);
        window.removeEventListener('touchstart', mouseDown);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('touchend', mouseUp);
        window.removeEventListener('mouseout', mouseOut);
        window.removeEventListener('touchcancel', mouseOut);
        window.removeEventListener('resize', windowResize);
        window.removeEventListener('blur', windowBlur);
        window.removeEventListener('focus', windowFocus);
    };
    const getVariationName = ()=>{
        const seed = _random.getRandomSeed();
        let name = 'untitled';
        if (currentVariationRes && currentVariationRes.hasOwnProperty('config') && currentVariationRes.config.hasOwnProperty('name')) name = currentVariationRes.config.name;
        return `sketch-${name}-${seed}`;
    };
    const saveCanvasCapture = (evt)=>{
        console.log('Saving capture', evt);
        const imageURI = canvas.toDataURL('image/png');
        evt.target.setAttribute('download', `${getVariationName()}.png`);
        evt.target.href = imageURI;
        evt.stopPropagation();
        return false;
    };
    // https://xosh.org/canvas-recorder/
    const saveCanvasRecording = (evt)=>{
        if (!canvasRecorder) {
            console.error('No canvas recorder defined!');
            return false;
        }
        if (isRecording) {
            isRecording = false;
            canvasRecorder.stop();
            canvasRecorder.save(`${getVariationName()}.webm`);
            console.log('Stopping recording');
        } else {
            isRecording = true;
            canvasRecorder.start();
            console.log('Starting recording');
        }
        evt.stopPropagation();
        return false;
    };
    const onCanvasDragOver = (evt)=>{
        evt.preventDefault();
    };
    const onCanvasDragDrop = (imageDataHandler)=>(evt)=>{
            evt.preventDefault();
            evt.stopPropagation();
            // console.log('drag drop', evt);
            const dt = evt.dataTransfer;
            const src = dt.files[0];
            // loadImage(files[0], imageDataHandler);
            //	Prevent any non-image file type from being read.
            if (!src.type.match(/image.*/)) {
                console.error('The dropped file is not an image: ', src.type);
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                imageDataHandler(e.target.result);
            };
            reader.readAsDataURL(src);
        }
    ;
    const enableDragUpload = (imageDataHandler)=>{
        console.log('enabling drag upload!');
        if (!canvas) {
            console.warn('You need to init with a canvas el first!');
            return;
        }
        // handling drag over is required to prevent browser from displaying dropped image
        canvas.addEventListener('dragover', onCanvasDragOver, true);
        canvas.addEventListener('drop', onCanvasDragDrop(imageDataHandler), true);
    };
    const disableDragUpload = (_)=>{
        canvas.removeEventListener('dragover', onCanvasDragOver);
        canvas.removeEventListener('drop', onCanvasDragDrop(imageDataHandler));
    };
    return {
        variationName: getVariationName,
        canvas: getCanvas,
        context: getContext,
        mouse: getMouse,
        run,
        stop,
        saveCanvasCapture,
        saveCanvasRecording,
        enableDragUpload,
        disableDragUpload
    };
};

},{"stats.js":"6aCCi","./canvas/canvas":"73Br1","./utils":"1kIwI","./math/random":"1SLuP","./math/math":"4t0bw","./canvas/CanvasRecorder":"1XROr","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"6aCCi":[function(require,module,exports) {
// stats.js - http://github.com/mrdoob/stats.js
(function(f, e) {
    "object" === typeof exports && "undefined" !== typeof module ? module.exports = e() : "function" === typeof define && define.amd ? define(e) : f.Stats = e();
})(this, function() {
    var f = function() {
        function e(a) {
            c.appendChild(a.dom);
            return a;
        }
        function u(a) {
            for(var d = 0; d < c.children.length; d++)c.children[d].style.display = d === a ? "block" : "none";
            l = a;
        }
        var l = 0, c = document.createElement("div");
        c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
        c.addEventListener("click", function(a) {
            a.preventDefault();
            u((++l) % c.children.length);
        }, false);
        var k = (performance || Date).now(), g = k, a = 0, r = e(new f.Panel("FPS", "#0ff", "#002")), h = e(new f.Panel("MS", "#0f0", "#020"));
        if (self.performance && self.performance.memory) var t = e(new f.Panel("MB", "#f08", "#201"));
        u(0);
        return {
            REVISION: 16,
            dom: c,
            addPanel: e,
            showPanel: u,
            begin: function() {
                k = (performance || Date).now();
            },
            end: function() {
                a++;
                var c1 = (performance || Date).now();
                h.update(c1 - k, 200);
                if (c1 > g + 1000 && (r.update(1000 * a / (c1 - g), 100), g = c1, a = 0, t)) {
                    var d = performance.memory;
                    t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
                }
                return c1;
            },
            update: function() {
                k = this.end();
            },
            domElement: c,
            setMode: u
        };
    };
    f.Panel = function(e, f1, l) {
        var c = Infinity, k = 0, g = Math.round, a = g(window.devicePixelRatio || 1), r = 80 * a, h = 48 * a, t = 3 * a, v = 2 * a, d = 3 * a, m = 15 * a, n = 74 * a, p = 30 * a, q = document.createElement("canvas");
        q.width = r;
        q.height = h;
        q.style.cssText = "width:80px;height:48px";
        var b = q.getContext("2d");
        b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";
        b.textBaseline = "top";
        b.fillStyle = l;
        b.fillRect(0, 0, r, h);
        b.fillStyle = f1;
        b.fillText(e, t, v);
        b.fillRect(d, m, n, p);
        b.fillStyle = l;
        b.globalAlpha = 0.9;
        b.fillRect(d, m, n, p);
        return {
            dom: q,
            update: function(h1, w) {
                c = Math.min(c, h1);
                k = Math.max(k, h1);
                b.fillStyle = l;
                b.globalAlpha = 1;
                b.fillRect(0, 0, r, m);
                b.fillStyle = f1;
                b.fillText(g(h1) + " " + e + " (" + g(c) + "-" + g(k) + ")", t, v);
                b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);
                b.fillRect(d + n - a, m, a, p);
                b.fillStyle = l;
                b.globalAlpha = 0.9;
                b.fillRect(d + n - a, m, a, g((1 - h1 / w) * p));
            }
        };
    };
    return f;
});

},{}],"1XROr":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "bps", ()=>bps
);
// BITRATE = SCREEN_SIZE_VERTICAL x SCREEN_SIZE_HORIZONTAL X FPS X PIXEL_COLOR_DEPTH
parcelHelpers.export(exports, "CanvasRecorder", ()=>CanvasRecorder
);
const bps = {
    '4k': 40000000,
    '2k': 16000000,
    '1080p': 8000000,
    '720p': 5000000,
    '480p': 2500000,
    '360p': 1000000
};
function CanvasRecorder(canvas, fps, video_bits_per_sec) {
    this.start = startRecording;
    this.stop = stopRecording;
    this.save = download;
    let recordedBlobs = [];
    let supportedType = null;
    let mediaRecorder = null;
    const captureFPS = fps || 30;
    const captureBPS = video_bits_per_sec || bps['1080p'];
    const actualBPS = canvas.width * canvas.height * captureFPS * screen.colorDepth;
    const stream = canvas.captureStream(captureFPS);
    if (!stream) return;
    const video = document.createElement('video');
    video.style.display = 'none';
    // console.log(`Canvas record, full ${actualBPS / 1000}kbps`);
    function startRecording() {
        const types = [
            'video/webm',
            'video/webm,codecs=vp9',
            'video/vp8',
            'video/webm;codecs=vp8',
            'video/webm;codecs=daala',
            'video/webm;codecs=h264',
            'video/mpeg', 
        ];
        for(const i in types)if (MediaRecorder.isTypeSupported(types[i])) {
            supportedType = types[i];
            break;
        }
        if (supportedType == null) console.log('No supported type found for MediaRecorder');
        // https://w3c.github.io/mediacapture-record/MediaRecorder.html#mediarecorderoptions-section
        const options = {
            mimeType: supportedType,
            videoBitsPerSecond: captureBPS
        };
        recordedBlobs = [];
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            console.error('MediaRecorder is not supported by this browser.');
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }
        // console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(100); // collect 100ms of data blobs
        console.log(`MediaRecorder started at ${captureBPS / 1000}kbps, ${captureFPS}fps`);
    }
    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) recordedBlobs.push(event.data);
    }
    function handleStop(event) {
        // console.log('Recorder stopped: ', event);
        const superBuffer = new Blob(recordedBlobs, {
            type: supportedType
        });
        video.src = window.URL.createObjectURL(superBuffer);
    }
    function stopRecording() {
        mediaRecorder.stop();
        // console.log('Recorded Blobs: ', recordedBlobs);
        video.controls = true;
    }
    function download(file_name) {
        const name = file_name || 'recording.webm';
        const blob = new Blob(recordedBlobs, {
            type: supportedType
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"2CMm3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "lissajous01", ()=>lissajous01
);
var _canvas = require("../rndrgen/canvas/canvas");
var _math = require("../rndrgen/math/math");
var _palettes = require("../rndrgen/color/palettes");
var _sketch = require("../rndrgen/sketch");
var _text = require("../rndrgen/canvas/text");
var _grids = require("../rndrgen/math/grids");
var _random = require("../rndrgen/math/random");
var _primatives = require("../rndrgen/canvas/primatives");
var _points = require("../rndrgen/math/points");
class Curve {
    constructor(x, y, radius, angle, speed, noise){
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.radius = radius;
        this.speed = speed || 1;
        this.angle = angle || 0;
        this.noise = noise;
        // Randomize some noise possibilities
        this.xa = _random.oneOf([
            _random.randomWholeBetween(1, 5),
            _math.round2(this.noise)
        ]);
        this.xb = _random.oneOf([
            _random.randomWholeBetween(1, 5),
            _math.round2(this.noise)
        ]);
        this.ya = _random.oneOf([
            _random.randomWholeBetween(1, 5),
            _math.round2(this.noise)
        ]);
        this.yb = _random.oneOf([
            _random.randomWholeBetween(1, 5),
            _math.round2(this.noise)
        ]);
    }
    get size() {
        return this.radius * 2;
    }
    get centerX() {
        return this.originX + this.radius;
    }
    get centerY() {
        return this.originY + this.radius;
    }
    get distFromCenter() {
        return _points.pointDistance({
            x: this.centerX,
            y: this.centerY
        }, {
            x: this.x,
            y: this.y
        });
    }
}
const lissajous01 = ()=>{
    const config = {
        name: 'lissajous01',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.hidpi
    };
    const renderBatch = 10;
    const curves = [];
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    const columns = 3;
    let margin;
    const palette = _palettes.nicePalette();
    const colorBackground = _palettes.brightest(palette).clone().lighten(10);
    const colorCurve = _palettes.darkest(palette).clone().darken(25);
    const colorText = colorBackground.clone().darken(15).desaturate(20);
    let tick = 0;
    let grid;
    const setup = ({ canvas , context  })=>{
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;
        margin = 50 * _canvas.currentContextScale();
        if (columns === 1) curves.push(new Curve(canvasCenterX, canvasCenterY, centerRadius, 0, 0.05));
        else {
            grid = _grids.getGridCells(canvas.width, canvas.width, columns, columns, margin, margin / 2);
            grid.points.forEach((point)=>{
                const x1 = point[0];
                const y1 = point[1];
                curves.push(new Curve(x1, y1, grid.columnWidth / 2, 0, 0.05, _random.create2dNoiseAbs(x1, y1)));
            });
        }
        _canvas.background(canvas, context)(colorBackground);
    };
    // k is # of petals
    // https://en.wikipedia.org/wiki/Rose_(mathematics)
    // http://xahlee.info/SpecialPlaneCurves_dir/Rose_dir/rose.html
    const roseX = (curve, k = 1, a = 1, b = 1)=>curve.radius * Math.cos(k * curve.angle * a) * Math.cos(curve.angle * b)
    ;
    const roseY = (curve, k = 1, a = 1, b = 1)=>curve.radius * Math.cos(k * curve.angle * a) * Math.sin(curve.angle * b)
    ;
    const linearYDown = (curve)=>{
        let { y: y1  } = curve;
        if ((++y1) > curve.size) y1 = 0;
        return y1;
    };
    const draw = ({ context  })=>{
        grid.points.forEach((point)=>{
            _primatives.rect(context)(point[0], point[1], grid.columnWidth, grid.rowHeight, 1, colorText);
        });
        for(let b = 0; b < renderBatch; b++){
            for(let i = 0; i < curves.length; i++){
                // const idx = i + 1;
                // const pointRad = 1;
                const c = curves[i];
                const k = _math.round2((i + 1) * 2 / 9);
                const { xa  } = c;
                const { xb  } = c;
                const { ya  } = c;
                const { yb  } = c;
                // c.x = circleX(c);
                // c.y = circleY(c);
                c.x = roseX(c, k, xa, xb);
                c.y = roseY(c, k, ya, yb);
                // c.y = linearYDown(c);
                // TODO, put a/b on the canvas so i can remember them!
                c.angle += c.speed;
                // const h = mapRange(0, c.radius, 180, 270, c.distFromCenter);
                // const s = 100;
                // const l = 30;
                // const a = 0.75;
                // const color = `hsla(${h},${s}%,${l}%,${a})`;
                _primatives.pixel(context)(c.x + c.centerX, c.y + c.centerY, colorCurve);
                _text.setTextAlignLeftTop(context);
                _text.textFilled(context)(`k=${k}, ${xa}, ${xb}, ${ya}, ${yb}`, c.originX, c.originY + c.size + 10, colorText, _text.textStyles.size(10));
            }
            tick++;
        }
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/math/math":"4t0bw","../rndrgen/color/palettes":"3qayM","../rndrgen/canvas/text":"3weRL","../rndrgen/math/grids":"2Wgq0","../rndrgen/math/random":"1SLuP","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"3weRL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setTextAlignLeftTop", ()=>setTextAlignLeftTop
);
parcelHelpers.export(exports, "setTextAlignAllCenter", ()=>setTextAlignAllCenter
);
parcelHelpers.export(exports, "textStyles", ()=>textStyles
);
parcelHelpers.export(exports, "textFilled", ()=>textFilled
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _canvas = require("./canvas");
const setTextAlignLeftTop = (context)=>{
    context.textAlign = 'left';
    context.textBaseline = 'top';
};
const setTextAlignAllCenter = (context)=>{
    context.textAlign = 'center';
    context.textBaseline = 'middle';
};
const textStyles = {
    size: (s)=>`${s * _canvas.currentContextScale()}px "Helvetica Neue",Helvetica,Arial,sans-serif`
    ,
    sansHelvetica: (s)=>`${s * _canvas.currentContextScale()}px "Helvetica Neue",Helvetica,Arial,sans-serif`
    ,
    monoCourier: (s)=>`${s * _canvas.currentContextScale()}px "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`
    ,
    monoLucidia: (s)=>`${s * _canvas.currentContextScale()}px "Lucida Sans Typewriter", "Lucida Console", monaco, "Bitstream Vera Sans Mono", monospace`
    ,
    serifGeorgia: (s)=>`${s * _canvas.currentContextScale()}px Georgia, Times, "Times New Roman", serif`
    ,
    default: '16px "Helvetica Neue",Helvetica,Arial,sans-serif',
    small: '12px "Helvetica Neue",Helvetica,Arial,sans-serif'
};
const textFilled = (context)=>(text, x, y, color, style)=>{
        context.fillStyle = _tinycolor2Default.default(color).toRgbString();
        context.font = style || textStyles.sansHelvetica(16);
        context.fillText(text, x, y);
        // https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
        return context.measureText(text);
    }
;

},{"tinycolor2":"101FG","./canvas":"73Br1","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"2Wgq0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "circlePointsPA", ()=>circlePointsPA
);
parcelHelpers.export(exports, "getPointsOnCircleOld", ()=>getPointsOnCircleOld
);
parcelHelpers.export(exports, "getGridCells", ()=>getGridCells
);
parcelHelpers.export(exports, "getPointGrid", ()=>getPointGrid
);
// [[x,y], ...]
var _points = require("./points");
var _math = require("./math");
const circlePointsPA = (cx, cy, radius, step, startRot = 0, close = false)=>{
    step = step || Math.PI / 20;
    const points = [];
    for(let r = 0; r < _math.TAU; r += step){
        const x = Math.cos(r + startRot) * radius + cx;
        const y = Math.sin(r + startRot) * radius + cy;
        points.push([
            x,
            y
        ]);
    }
    if (close) {
        const x = Math.cos(startRot) * radius + cx;
        const y = Math.sin(startRot) * radius + cy;
        points.push([
            x,
            y
        ]);
    }
    return points;
};
const getPointsOnCircleOld = (offsetX, offsetY, radius, steps, close = false)=>{
    const startAngle = 270;
    const maxAngle = 360 + startAngle;
    const points = [];
    for(let angle = startAngle; angle < maxAngle; angle += steps){
        const theta = angle * (Math.PI / 180);
        const x = Math.cos(theta) * radius + offsetX;
        const y = Math.sin(theta) * radius + offsetY;
        points.push([
            x,
            y
        ]);
    }
    if (close) {
        const theta = maxAngle - 1 * (Math.PI / 180);
        const x = Math.cos(theta) * radius + offsetX;
        const y = Math.sin(theta) * radius + offsetY;
        points.push([
            x,
            y
        ]);
    }
    return points;
};
const getGridCells = (width, height, columns, rows, margin = 0, gutter = 0)=>{
    const points = [];
    const colStep = Math.ceil((width - margin * 2 - gutter * (columns - 1)) / columns);
    const rowStep = Math.ceil((height - margin * 2 - gutter * (rows - 1)) / rows);
    for(let row = 0; row < rows; row++){
        const y = margin + row * rowStep + gutter * row;
        for(let col = 0; col < columns; col++){
            const x = margin + col * colStep + gutter * col;
            points.push([
                x,
                y
            ]);
        }
    }
    return {
        points,
        columnWidth: colStep,
        rowHeight: rowStep
    };
};
const getPointGrid = (x, y, w, h, cols = 2, rows = 2)=>{
    const points = [];
    const colw = Math.round(w / (cols - 1));
    const rowh = Math.round(h / (rows - 1));
    for(let i = 0; i < cols; i++)for(let j = 0; j < rows; j++){
        const rx = i * colw + x;
        const ry = j * rowh + y;
        points.push(_points.point(rx, ry));
    }
    return points;
};

},{"./points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","./math":"4t0bw"}],"omRBU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "flowFieldParticles", ()=>flowFieldParticles
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../rndrgen/math/math");
var _particle = require("../rndrgen/systems/Particle");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _vector = require("../rndrgen/math/Vector");
var _attractors = require("../rndrgen/math/attractors");
var _palettes = require("../rndrgen/color/palettes");
var _random = require("../rndrgen/math/random");
var _primatives = require("../rndrgen/canvas/primatives");
const flowFieldParticles = ()=>{
    const config = {
        name: 'flowFieldParticles',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    const numParticles = 400;
    const particlesArray = [];
    const maxSize = 3;
    let time = 0;
    const createRandomParticle = (canvas)=>{
        const props = _particle.createRandomParticleValues(canvas);
        props.x = _random.randomWholeBetween(0, canvas.width);
        props.y = _random.randomWholeBetween(0, canvas.height);
        props.velocityX = 0;
        props.velocityY = 0;
        return new _particle.Particle(props);
    };
    const setup = ({ canvas , context  })=>{
        for(let i = 0; i < numParticles; i++)particlesArray.push(createRandomParticle(canvas));
        _canvas.background(canvas, context)('rgba(50,50,50,1)');
    };
    const drawPixel = (canvas, context, force, particle, color, rad = 1)=>{
        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(1);
        particle.updatePosWithVelocity();
        _particle.edgeWrap(canvas, particle);
        const pcolor = color || particle.color;
        const x = _math.snapNumber(maxSize * 2, particle.x);
        const y = _math.snapNumber(maxSize * 2, particle.y);
        _primatives.circleFilled(context)(x, y, rad, pcolor);
        return true;
    };
    const drawParticles = ({ canvas , context  })=>{
        for(let i = 0; i < numParticles; i++){
            const particle = particlesArray[i];
            const sNoise3d = _attractors.simplexNoise3d(particle.x, particle.y, time, 0.002);
            const theta = _math.quantize(3, sNoise3d);
            const force = _math.uvFromAngle(theta);
            const clr = _palettes.hslFromRange(5, 270, 360, Math.abs(theta)).setAlpha(0.25);
            const size = _math.mapRange(0, 5, 1, maxSize, Math.abs(theta));
            drawPixel(canvas, context, force, particle, clr, size);
            particle.acceleration = new _vector.Vector(0, 0);
        }
    };
    const drawFibers = ({ canvas , context  })=>{
        const particle = createRandomParticle(canvas);
        const length = 200;
        for(let i = 0; i < length; i++){
            const sNoise3d = _attractors.simplexNoise3d(particle.x, particle.y, time, 0.002);
            const theta = sNoise3d;
            const force = _math.uvFromAngle(theta);
            const clr = 'rgba(0,0,0,.05)';
            drawPixel(canvas, context, force, particle, clr, 1);
            particle.acceleration = new _vector.Vector(0, 0);
        }
    };
    const draw = ({ canvas , context  })=>{
        drawFibers({
            canvas,
            context
        });
        drawParticles({
            canvas,
            context
        });
        time += 0.01;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/math/math":"4t0bw","../rndrgen/systems/Particle":"344El","../rndrgen/canvas/canvas":"73Br1","../rndrgen/math/Vector":"1MSqh","../rndrgen/math/attractors":"BodqP","../rndrgen/color/palettes":"3qayM","../rndrgen/math/random":"1SLuP","../rndrgen/canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"3Q1u4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "flowFieldArcs", ()=>flowFieldArcs
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _attractors = require("../rndrgen/math/attractors");
var _math = require("../rndrgen/math/math");
var _primatives = require("../rndrgen/canvas/primatives");
const TAU = Math.PI * 2;
const arc = (context, x, y, size, thick, color, theta)=>{
    const startR = _math.snapNumber(Math.PI / 2, theta);
    const endR = startR + Math.PI / 2;
    const clockWise = true;
    context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
    context.lineCap = 'round';
    context.lineWidth = thick;
    context.beginPath();
    context.arc(x + size, y + size, size, startR, endR, clockWise);
    context.stroke();
};
const circle = (context, x, y, size, color, theta)=>{
    const startR = 0; // snapNumber(Math.PI / 2, theta);
    const endR = TAU; // startR + Math.PI / 2;
    const clockWise = true;
    const rad = _math.mapRange(0, 5, size * 0.2, size * 0.6, Math.abs(theta));
    context.beginPath();
    context.arc(x + size, y + size, rad, startR, endR, clockWise);
    context.fillStyle = _tinycolor2Default.default(color).toRgbString();
    context.fill();
};
const line = (context, x, y, size, thick, color, theta)=>{
    const startR = _math.snapNumber(Math.PI / 2, theta) + Math.PI / 2;
    context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
    _primatives.lineAtAngle(context)(x + size, y + size, startR, size * 2, thick, 'round');
};
const flowFieldArcs = ()=>{
    const config = {
        name: 'flowFieldArcs',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    let time = 0;
    const palette = _palettes.nicePalette();
    const colorBackground = _tinycolor2Default.default('rgba(50,50,50,1)');
    const setup = ({ canvas , context  })=>{
        _canvas.background(canvas, context)(colorBackground);
    };
    const renderField = ({ width , height  }, context, fn, cell)=>{
        const mid = cell / 2;
        for(let x = 0; x < width; x += cell)for(let y = 0; y < height; y += cell){
            const theta = fn(x, y);
            const arcColor = _palettes.hslFromRange(5, 270, 360, Math.abs(theta));
            const lineColor = _palettes.hslFromRange(5, 180, 270, Math.abs(theta)).darken(10);
            line(context, x, y, mid, mid * 0.5, lineColor, theta);
            circle(context, x, y, mid, lineColor, theta);
            arc(context, x, y, mid, mid * 0.5, arcColor, theta);
            arc(context, x, y, mid, mid * 0.1, 'yellow', theta);
        }
    };
    const draw = ({ canvas , context  })=>{
        _canvas.background(canvas, context)(colorBackground.setAlpha(0.1));
        // const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
        // const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);
        const noise = (x, y)=>_attractors.simplexNoise3d(x, y, time, 0.001)
        ;
        renderField(canvas, context, noise, Math.round(canvas.width / 20));
        time += 0.25;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/math/attractors":"BodqP","../rndrgen/math/math":"4t0bw","../rndrgen/canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"5P1Ch":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "flowFieldImage", ()=>flowFieldImage
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../rndrgen/math/math");
var _particle = require("../rndrgen/systems/Particle");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _vector = require("../rndrgen/math/Vector");
var _palettes = require("../rndrgen/color/palettes");
var _bitmap = require("../rndrgen/canvas/Bitmap");
var _kristijanArsovWoman400Png = require("../../media/images/kristijan-arsov-woman-400.png");
var _kristijanArsovWoman400PngDefault = parcelHelpers.interopDefault(_kristijanArsovWoman400Png);
var _fields = require("../rndrgen/canvas/fields");
var _random = require("../rndrgen/math/random");
var _primatives = require("../rndrgen/canvas/primatives");
var _points = require("../rndrgen/math/points");
/*
https://marcteyssier.com/projects/flowfield/
https://larrycarlson.com/collections/wavy-art-prints
 */ const TAU = Math.PI * 2;
const splatter = (context)=>(x, y, color, size, amount = 3, range = 20)=>{
        for(let i = 0; i < amount; i++){
            const s = _random.randomWholeBetween(size * 0.25, size * 3);
            // circleOld dist
            const radius = _random.randomWholeBetween(0, range);
            const angle = _random.randomNumberBetween(0, TAU);
            const xoff = radius * Math.cos(angle);
            const yoff = radius * Math.sin(angle);
            // square dist
            // const xoff = randomWholeBetween(-range, range);
            // const yoff = randomWholeBetween(-range, range);
            _primatives.circleFilled(context)(x + xoff, y + yoff, s, color);
        }
    }
;
const createRandomParticle = (canvas)=>{
    const props = _particle.createRandomParticleValues(canvas);
    props.x = _random.randomWholeBetween(0, canvas.width);
    props.y = _random.randomWholeBetween(0, canvas.height);
    props.velocityX = 0;
    props.velocityY = 0;
    return new _particle.Particle(props);
};
const flowFieldImage = ()=>{
    const config = {
        name: 'flowFieldImage',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    const maxSize = 5;
    let time = 0;
    const backgroundColor = _palettes.warmWhite;
    const image = new _bitmap.Bitmap(_kristijanArsovWoman400PngDefault.default);
    const imageFlow = (x, y)=>image.pixelThetaFromCanvas(x, y) * TAU
    ;
    const setup = ({ canvas , context  })=>{
        image.init(canvas, context);
        _canvas.background(canvas, context)(backgroundColor);
        _fields.renderField(canvas, context, imageFlow, 'rgba(0,0,0,.15)', 50, 10);
    };
    const drawPixel = (canvas, context, particle, color, rad = 1)=>{
        const pcolor = color || particle.color;
        const { x  } = particle;
        const { y  } = particle;
        _primatives.circleFilled(context)(x, y, rad, pcolor);
        return true;
    };
    const drawParticle = ({ canvas , context  }, particle)=>{
        const theta = imageFlow(particle.x, particle.y);
        const force = _math.uvFromAngle(theta);
        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(3);
        particle.updatePosWithVelocity();
        const fromCenter = _points.pointDistance(particle, {
            x: canvas.width / 2,
            y: canvas.height / 2
        });
        const imagePixelColor = image.pixelColorFromCanvas(particle.x, particle.y);
        const imagePixelBrightness = 256 - imagePixelColor.getBrightness();
        const hslColor = _palettes.hslFromRange(canvas.width, 90, 270, particle.x).spin(time);
        const particleColor = _tinycolor2Default.default.mix(hslColor, imagePixelColor, 90);
        particleColor.desaturate(_math.mapRange(canvas.width / 3, canvas.width / 2, 0, 10, fromCenter));
        const size = _math.mapRange(0, 255, 0, maxSize, imagePixelBrightness);
        const sizeMult = _math.mapRange(canvas.width / 3, canvas.width / 2, 1, 5, fromCenter);
        drawPixel(canvas, context, particle, particleColor, size * sizeMult);
        if (Math.abs(theta) >= 5.7) splatter(context)(particle.x, particle.y, particleColor.brighten(10), 1, 3, 100);
        particle.acceleration = new _vector.Vector(0, 0);
    };
    const drawFibers = ({ canvas , context  })=>{
        const particle = createRandomParticle(canvas);
        const length = _random.randomWholeBetween(50, 1000);
        for(let i = 0; i < length; i++)drawParticle({
            canvas,
            context
        }, particle);
    };
    const draw = ({ canvas , context  })=>{
        drawFibers({
            canvas,
            context
        });
        time += 0.05;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/math/math":"4t0bw","../rndrgen/systems/Particle":"344El","../rndrgen/canvas/canvas":"73Br1","../rndrgen/math/Vector":"1MSqh","../rndrgen/color/palettes":"3qayM","../rndrgen/canvas/Bitmap":"17J8Q","../../media/images/kristijan-arsov-woman-400.png":"2bj6J","../rndrgen/canvas/fields":"1QEow","../rndrgen/math/random":"1SLuP","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"17J8Q":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Bitmap", ()=>Bitmap
); // scratch
 /*
const createColorArrayFromImageData = (imageData) => {
    const data = [];
    for (let y = 0, { height } = imageData; y < height; y++) {
        for (let x = 0, { width } = imageData; x < width; x++) {
            data.push({ x, y, ...getImageColor(imageData, x, y) });
        }
    }
    return data;
};

const renderImage = () => {
    for (let x = startX; x < maxX; x++) {
        for (let y = startY; y < maxY; y++) {
            const color = image.pixelColorFromCanvas(x, y);
            pixel(ctx)(x, y, color, 'square', 1);
        }
    }
};
*/ 
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _canvas = require("./canvas");
var _math = require("../math/math");
var _points = require("../math/points");
var _utils = require("../utils");
var _primatives = require("./primatives");
var _matrix = require("../math/Matrix");
/*
import sourcePng from '../../media/images/kristijan-arsov-woman-400.png';
import { Bitmap } from '../rndrgen/canvas/Bitmap';

const image = new Bitmap(sourcePng);

image.init(canvas, context); // in setup

 */ // from https://github.com/cmisenas/cabbage.js/blob/master/cabbage.js
// const pixelDirections = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
// const pixelColorValues = ['r', 'g', 'b', 'a'];
//
// export class Pixel {
//     constructor(x, y, vals) {
//         this.x = x;
//         this.y = y;
//         this.neighbors = {};
//
//         // wat?
//         if (vals) {
//             pixelColorValues.forEach((d) => {
//                 this[d] = vals.shift();
//             });
//         }
//
//         pixelDirections.forEach((d) => {
//             this.neighbors[d] = this[d]();
//         });
//     }
//
//     n() {
//         return { x: this.x, y: this.y - 1 };
//     }
//
//     e() {
//         return { x: this.x + 1, y: this.y };
//     }
//
//     s() {
//         return { x: this.x, y: this.y + 1 };
//     }
//
//     w() {
//         return { x: this.x - 1, y: this.y };
//     }
//
//     ne() {
//         return { x: this.x + 1, y: this.y - 1 };
//     }
//
//     nw() {
//         return { x: this.x - 1, y: this.y - 1 };
//     }
//
//     se() {
//         return { x: this.x + 1, y: this.y - 1 };
//     }
//
//     sw() {
//         return { x: this.x + 1, y: this.y - 1 };
//     }
// }
// from https://github.com/cmisenas/canny-edge-detection
// const generateGausianKernel = function (sigma, size) {
//     const kernel = [];
//     const E = 2.718; // Euler's number rounded of to 3 places
//     for (let y = -(size - 1) / 2, i = 0; i < size; y++, i++) {
//         kernel[i] = [];
//         for (let x = -(size - 1) / 2, j = 0; j < size; x++, j++) {
//             // create kernel round to 3 decimal places
//             kernel[i][j] =
//                 (1 / (2 * Math.PI * Math.pow(sigma, 2))) *
//                 Math.pow(E, -(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)) / (2 * Math.pow(sigma, 2)));
//         }
//     }
//     // normalize the kernel to make its sum 1
//     // const normalize = 1 / Matrix.sum(kernel);
//     // for (let k = 0; k < kernel.length; k++) {
//     //     for (let l = 0; l < kernel[k].length; l++) {
//     //         kernel[k][l] = Math.round(normalize * kernel[k][l] * 1000) / 1000;
//     //     }
//     // }
//     return kernel;
// };
//
// Matrix.fromArray2(generateGausianKernel(1, 10)).log();
//----------------------------------------------------------------------------------------------------------------------
const colorChannels = [
    'r',
    'g',
    'b'
];
class Bitmap {
    constructor(src1){
        this.scaleX = 1;
        this.scaleY = 1;
        this.image = new Image();
        this.image.src = src1;
        this.imageData = undefined;
    }
    get width() {
        return this.imageData.width;
    }
    get height() {
        return this.imageData.height;
    }
    get data() {
        return this.imageData;
    }
    toCanvasX(x) {
        return Math.round(x * this.scaleX);
    }
    toCanvasY(y) {
        return Math.round(y * this.scaleY);
    }
    init(canvas, context, wipe = true) {
        this.canvas = canvas;
        this.context = context;
        this.context.drawImage(this.image, 0, 0);
        this.imageWidth = this.image.width || this.canvas.width;
        this.imageHeight = this.image.height || this.canvas.height;
        this.rawImageData = this.context.getImageData(0, 0, this.imageWidth, this.imageHeight);
        this.refreshImageData();
        this.scaleX = this.canvas.width / this.imageWidth;
        this.scaleY = this.canvas.height / this.imageHeight;
        if (wipe) _canvas.clear(this.canvas, this.context);
    }
    getImageData() {
        return this.context.getImageData(0, 0, this.imageWidth, this.imageHeight);
    }
    refreshImageData() {
        this.imageData = this.context.getImageData(0, 0, this.imageWidth, this.imageHeight);
    }
    resetImageData() {
        this.context.putImageData(this.rawImageData, 0, 0);
        this.refreshImageData();
    }
    pixelIsBorder(x, y) {
        return x === 0 && y < this.height && y >= 0 || y === 0 && x < this.width && x >= 0 || x === this.width - 1 && y < this.height && y >= 0 || y === this.height - 1 && x < this.width && x >= 0;
    }
    pixelIsOutOfBounds(x, y) {
        return x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1;
    }
    pixelIndexValue(x, y) {
        return y * this.imageData.width + x * 4;
    }
    pixelColorFromImageData(imagedata, x, y) {
        const { data , width  } = imagedata;
        return {
            r: data[y * 4 * width + x * 4],
            g: data[y * 4 * width + x * 4 + 1],
            b: data[y * 4 * width + x * 4 + 2],
            a: data[y * 4 * width + x * 4 + 3]
        };
    }
    // Possible faster way https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
    // TODO: implement bounds wrapping
    pixelColorRaw(x, y) {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x >= this.width) x = this.width - 1;
        if (y >= this.height) y = this.height - 1;
        return {
            r: this.imageData.data[y * 4 * this.imageData.width + x * 4],
            g: this.imageData.data[y * 4 * this.imageData.width + x * 4 + 1],
            b: this.imageData.data[y * 4 * this.imageData.width + x * 4 + 2],
            a: this.imageData.data[y * 4 * this.imageData.width + x * 4 + 3]
        };
    }
    pixelColor(x, y) {
        return _tinycolor2Default.default(this.pixelColorRaw(x, y));
    }
    // 0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b;
    /*
    Gray = 0.21R + 0.72G + 0.07B // Luminosity
    Gray = (R + G + B) ÷ 3 // Average Brightness
    Gray = 0.299R + 0.587G + 0.114B // rec601 standard
    Gray = 0.2126R + 0.7152G + 0.0722B // ITU-R BT.709 standard
    Gray = 0.2627R + 0.6780G + 0.0593B // ITU-R BT.2100 standard
     */ // https://sighack.com/post/averaging-rgb-colors-the-right-way
    pixelAverageGrey(x, y) {
        const color = this.pixelColorRaw(x, y);
        return Math.sqrt((color.r * color.r + color.g * color.g + color.b * color.b) / 3);
    }
    pixelTheta(x, y) {
        // return this.pixelColor(x, y).getBrightness() / 256;
        return this.pixelAverageGrey(x, y) / 256;
    }
    pixelColorFromCanvas(x, y) {
        return this.pixelColor(Math.round(x / this.scaleX), Math.round(y / this.scaleY));
    }
    pixelAverageGreyFromCanvas(x, y) {
        return this.pixelAverageGrey(Math.round(x / this.scaleX), Math.round(y / this.scaleY));
    }
    pixelThetaFromCanvas(x, y) {
        return this.pixelTheta(Math.round(x / this.scaleX), Math.round(y / this.scaleY));
    }
    sizeFromPixelBrightness(x, y, size = 5, low = 0, max = 255) {
        const pixelColor = this.pixelColorFromCanvas(x, y);
        const brightness = 256 - pixelColor.getBrightness();
        return _math.mapRange(low, max, 0, size, brightness);
    }
    averageGreyFromCell(x, y, w, h, res = 2) {
        const points = [];
        for(let i = x; i < x + w; i += res)for(let k = y; k < y + h; k += res)points.push(this.pixelAverageGrey(Math.round(i / this.scaleX), Math.round(k / this.scaleY)));
        return _utils.averageNumArray(points);
    }
    showToCanvas(res) {
        const { width , height  } = this.canvas;
        res = res || width / 4;
        const colw = width / res;
        const rowh = height / res;
        for(let i = 0; i < res; i++)for(let j = 0; j < res; j++){
            const x = i * colw;
            const y = j * rowh;
            _primatives.rectFilled(this.context)(x, y, colw, rowh, this.pixelColorFromCanvas(x, y));
        }
    }
    thresholdAsPoints(res, threshold = 128, inv = false) {
        const testFn = (g)=>inv ? g < threshold : g > threshold
        ;
        const points = [];
        const { width , height  } = this.canvas;
        const colw = width / res;
        const rowh = height / res;
        for(let i = 0; i < res; i++)for(let j = 0; j < res; j++){
            const x = i * colw;
            const y = j * rowh;
            if (testFn(this.pixelAverageGreyFromCanvas(x, y))) points.push(_points.point(x, y));
        }
        return points;
    }
    // TODO Optimize this
    // create a NxN matrix of x,y coords centered around px and py and map a fn
    // const logPos = (x, y) => `${x}, ${y}`;
    // const colorChannel = (channel) => (x, y) => this.pixelColorRaw(x, y)[channel];
    mapPixelPositionMatrix(mapper, px, py, range = 1) {
        const defaultMapper = (x, y)=>({
                x,
                y
            })
        ;
        mapper = mapper || defaultMapper;
        const size = range * 2 + 1;
        const startside = range * -1;
        const sidelen = range * 2 - (range - 1);
        const m = new _matrix.Matrix(size, size);
        for(let r = startside; r < sidelen; r++)for(let c = startside; c < sidelen; c++){
            const x = px + c;
            const y = py + r;
            m.data[r + range][c + range] = mapper(x, y);
        }
        return m;
    }
    // passes mapper current x,y and then sets the pixel to the returned color value
    map(mapper) {
        for(let x = 0; x < this.imageData.width; x++)for(let y = 0; y < this.imageData.height; y++){
            const result = mapper(x, y);
            _primatives.pixel(this.context)(x, y, result);
        }
    }
    greyscale() {
        this.map((x, y)=>{
            const grey = this.pixelAverageGrey(x, y);
            return _tinycolor2Default.default({
                r: grey,
                g: grey,
                b: grey
            });
        });
        this.refreshImageData();
    }
    invert() {
        this.map((x, y)=>{
            const color = this.pixelColorRaw(x, y);
            return _tinycolor2Default.default({
                r: 255 - color.r,
                g: 255 - color.g,
                b: 255 - color.b
            });
        });
        this.refreshImageData();
    }
    // https://www.codingame.com/playgrounds/2524/basic-image-manipulation/filtering
    // TODO optimize w/ seperable filters https://www.youtube.com/watch?v=SiJpkucGa1o
    convolveColorChannels(kernel) {
        // Needs to be odd
        const kernelSize = kernel.size;
        const pxMatrixSize = (kernelSize - 1) / 2;
        let kernelSum = _matrix.Matrix.sum(kernel);
        if (kernelSum === 0) kernelSum = 1;
        const colorChannel = (channel)=>(x, y)=>this.pixelColorRaw(x, y)[channel]
        ;
        this.map((x, y)=>{
            const newColors = [];
            colorChannels.forEach((c)=>{
                // get a matrix around the pixel
                const colorMatrix = this.mapPixelPositionMatrix(colorChannel(c), x, y, pxMatrixSize);
                // for each color channel multiply by the matrix
                colorMatrix.multiply(kernel);
                // sum both, div by the boxBlur matrix
                newColors.push(_matrix.Matrix.sum(colorMatrix) / kernelSum);
            });
            // averaged color value of the pixel, set the color channel to that value
            return _tinycolor2Default.default({
                r: newColors[0],
                g: newColors[1],
                b: newColors[2]
            });
        });
    }
    boxBlur(size = 1) {
        const kernelSize = size * 2 + 1;
        const kernel = new _matrix.Matrix(kernelSize, kernelSize);
        kernel.fill(1);
        this.convolveColorChannels(kernel);
        this.refreshImageData();
    }
    sharpen(amount = 1) {
        const sharpenKernel = _matrix.Matrix.fromArray2([
            [
                0,
                -0.5,
                0
            ],
            [
                -0.5,
                3,
                -0.5
            ],
            [
                0,
                -0.5,
                0
            ], 
        ]);
        for(let i = 0; i < amount; i++)this.convolveColorChannels(sharpenKernel);
        this.refreshImageData();
    }
    findEdges(threshold = 30, edgeColor = 'white', backColor = 'black', edgeStrength = 255) {
        this.map((x, y)=>{
            let diff = 0;
            const current = this.pixelAverageGrey(x, y);
            const left = this.pixelAverageGrey(x - 1, y);
            const right = this.pixelAverageGrey(x + 1, y);
            const top = this.pixelAverageGrey(x, y - 1);
            const bottom = this.pixelAverageGrey(x, y + 1);
            if (current > left + threshold || current < left - threshold) diff = Math.abs(current - left);
            else if (current > right + threshold || current < right - threshold) diff = Math.abs(current - right);
            else if (current > top + threshold || current < top - threshold) diff = Math.abs(current - top);
            else if (current > bottom + threshold || current < bottom - threshold) diff = Math.abs(current - bottom);
            return _tinycolor2Default.default.mix(backColor, edgeColor, _math.mapRange(0, edgeStrength, 0, 100, diff));
        });
    }
    getValueInFlatArray(array, width, x, y) {
        return array[y * width + x];
    }
    convolveGrey(kernel, minValue = -255, maxValue = 255, channel = 'r') {
        // Needs to be odd
        const kernelSize = kernel.size;
        const pxMatrixSize = (kernelSize - 1) / 2;
        let kernelSum = _matrix.Matrix.sum(kernel);
        if (kernelSum === 0) kernelSum = 1;
        const colorChannel = (x, y)=>this.pixelColorRaw(x, y)[channel]
        ;
        // const result = [];
        // let max = 0;
        // let min = 0;
        this.map((x, y)=>{
            // get a matrix around the pixel
            const colorMatrix = this.mapPixelPositionMatrix(colorChannel, x, y, pxMatrixSize);
            // for each color channel multiply by the matrix
            colorMatrix.multiply(kernel);
            // sum both, div by the boxBlur matrix
            const colorValue = _matrix.Matrix.sum(colorMatrix) / kernelSum;
            // if (colorValue > max) max = colorValue;
            // if (colorValue < min) min = colorValue;
            // result.push(colorValue);
            const colorValueMapped = _math.mapRange(minValue, maxValue, 0, 255, colorValue);
            // averaged color value of the pixel, set the color channel to that value
            return _tinycolor2Default.default({
                r: colorValueMapped,
                g: colorValueMapped,
                b: colorValueMapped
            });
        });
    // console.log(`min ${min}, max ${max}`);
    // return result;
    }
    convolveXYKernels(xkernel, ykernel) {
        const minValue = -255;
        const maxValue = 255;
        this.convolveGrey(xkernel, minValue, maxValue);
        const xgradient = this.getImageData();
        this.convolveGrey(ykernel, minValue, maxValue);
        const ygradient = this.getImageData();
        this.map((x, y)=>{
            const xg = _math.mapRange(0, 255, minValue, maxValue, this.pixelColorFromImageData(xgradient, x, y).r);
            const yg = _math.mapRange(0, 255, minValue, maxValue, this.pixelColorFromImageData(ygradient, x, y).r);
            const fg = Math.hypot(xg, yg);
            const colorValueMapped = _math.mapRange(0, 255, 0, 255, fg);
            return _tinycolor2Default.default({
                r: colorValueMapped,
                g: colorValueMapped,
                b: colorValueMapped
            });
        });
    }
    sobelEdges() {
        const sobelXKernel = _matrix.Matrix.fromArray2([
            [
                -1,
                0,
                1
            ],
            [
                -2,
                0,
                2
            ],
            [
                -1,
                0,
                1
            ], 
        ]);
        const sobelYKernel = _matrix.Matrix.fromArray2([
            [
                1,
                2,
                1
            ],
            [
                0,
                0,
                0
            ],
            [
                -1,
                -2,
                -1
            ], 
        ]);
        this.convolveXYKernels(sobelXKernel, sobelYKernel);
        this.refreshImageData();
    }
    robertsEdges() {
        // current implementation won't work with matricies smaller than 3x3
        // const robertsXKernel = Matrix.fromArray2([
        //     [1, 0],
        //     [0, -1],
        // ]);
        // const robertsYKernel = Matrix.fromArray2([
        //     [0, 1],
        //     [-1, 0],
        // ]);
        const robertsXKernel = _matrix.Matrix.fromArray2([
            [
                1,
                0,
                0
            ],
            [
                0,
                0,
                0
            ],
            [
                0,
                0,
                -1
            ], 
        ]);
        const robertsYKernel = _matrix.Matrix.fromArray2([
            [
                0,
                0,
                1
            ],
            [
                0,
                0,
                0
            ],
            [
                -1,
                0,
                0
            ], 
        ]);
        this.convolveXYKernels(robertsXKernel, robertsYKernel);
        this.refreshImageData();
    }
    prewittEdges() {
        const prewittXKernel = _matrix.Matrix.fromArray2([
            [
                -1,
                0,
                1
            ],
            [
                -1,
                0,
                1
            ],
            [
                -1,
                0,
                1
            ], 
        ]);
        const prewittYKernel = _matrix.Matrix.fromArray2([
            [
                -1,
                -1,
                -1
            ],
            [
                0,
                0,
                0
            ],
            [
                1,
                1,
                1
            ], 
        ]);
        this.convolveXYKernels(prewittXKernel, prewittYKernel);
        this.refreshImageData();
    }
    // IN DEV - loading a new image that's been dropped onto the canvas
    loadImageData(src, wipe = true) {
        // const MAX_HEIGHT = 100;
        this.image = new Image();
        this.image.onload = function() {
            console.log(this, this.context);
            this.context.drawImage(this.image, 0, 0);
            // TODO update raw as well
            this.imageData = this.context.getImageData(0, 0, this.image.width, this.image.width);
            this.scaleX = this.canvas.width / this.imageData.width;
            this.scaleY = this.canvas.height / this.imageData.height;
            if (wipe) _canvas.clear(this.canvas, this.context);
        // const canvas = document.getElementById('myCanvas');
        // if (dropImage.height > MAX_HEIGHT) {
        //     dropImage.width *= MAX_HEIGHT / dropImage.height;
        //     dropImage.height = MAX_HEIGHT;
        // }
        // const ctx = canvas.getContext('2d');
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // canvas.width = dropImage.width;
        // canvas.height = dropImage.height;
        // ctx.drawImage(dropImage, 0, 0, dropImage.width, dropImage.height);
        };
        this.image.src = src;
    }
}

},{"tinycolor2":"101FG","./canvas":"73Br1","../math/math":"4t0bw","../math/points":"4RQVg","../utils":"1kIwI","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","./primatives":"6MM7x","../math/Matrix":"FKKRL"}],"FKKRL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/*
10.6: Neural Networks: Matrix Math Part 1 - The Nature of Code
https://www.youtube.com/watch?v=uSzGdfdOoG8&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh&index=6
https://github.com/CodingTrain/website/blob/main/Courses/natureofcode/10.18-toy_neural_network/lib/matrix.js

Alternativly use math.js or gpu.js + others
*/ parcelHelpers.export(exports, "Matrix", ()=>Matrix
);
class Matrix {
    constructor(rows, cols){
        if (rows === undefined || cols === undefined) {
            console.error('Must init Matrix with rows and cols');
            return;
        }
        this.rows = rows;
        this.cols = cols;
        this.data = [];
        this.fill(0);
    }
    get size() {
        return Math.max(this.rows, this.cols);
    }
    // Initialize and fill array
    fill(v = 0) {
        for(let r = 0; r < this.rows; r++){
            this.data[r] = [];
            for(let c = 0; c < this.cols; c++)this.data[r][c] = v;
        }
    }
    log() {
        console.table(this.data);
    }
    isCompatibleMatrix(m) {
        return m instanceof Matrix && m.rows === this.rows && m.cols === this.cols;
    }
    map(fn) {
        for(let r = 0; r < this.rows; r++)for(let c = 0; c < this.cols; c++)this.data[r][c] = fn(this.data[r][c], r, c);
    }
    static map(m1, fn) {
        const result = new Matrix(m1.rows, m1.cols);
        for(let r = 0; r < m1.rows; r++)for(let c = 0; c < m1.cols; c++)result.data[r][c] = fn(m1.data[r][c], r, c);
        return result;
    }
    // Flat array to a single row matrix
    static fromArray(arr) {
        const m = new Matrix(arr.length, 1);
        for(let i = 0; i < arr.length; i++)m.data[i][0] = arr[i];
        return m;
    }
    // Nested/2d array to a 2d array [[a,b,c],[d,e,f],[g,h,i]] -> Matrix 3x3
    static fromArray2(arr) {
        const rows1 = arr.length;
        const cols1 = arr[0].length;
        const m = new Matrix(rows1, cols1);
        for(let r = 0; r < rows1; r++)for(let c = 0; c < cols1; c++)m.data[r][c] = arr[r][c];
        return m;
    }
    toArray() {
        const arr = [];
        for(let c = 0; c < this.cols; c++)for(let r = 0; r < this.rows; r++)arr.push(this.data[r][c]);
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
        this.map((x)=>Math.random() * 2 - 1
        );
    }
    // rows, cols -> cols, rows
    static transpose(m) {
        const result = new Matrix(m.cols, m.rows);
        for(let r = 0; r < m.rows; r++)for(let c = 0; c < m.cols; c++)result.data[c][r] = m.data[r][c];
        return result;
    }
    static add(m1, m2) {
        const result = new Matrix(m1.rows, m1.cols);
        for(let r = 0; r < m1.rows; r++)for(let c = 0; c < m1.cols; c++)result.data[r][c] = m1.data[r][c] + m2.data[r][c];
        return result;
    }
    // sum all of the values
    static sum(m) {
        let result = 0;
        for(let r = 0; r < m.rows; r++)for(let c = 0; c < m.cols; c++)result += m.data[r][c];
        return result;
    }
    add(v) {
        if (v instanceof Matrix) {
            for(let r = 0; r < this.rows; r++)for(let c = 0; c < this.cols; c++)this.data[r][c] += v.data[r][c];
        } else {
            for(let r = 0; r < this.rows; r++)for(let c = 0; c < this.cols; c++)this.data[r][c] += v;
        }
    }
    static subtract(m1, m2) {
        const result = new Matrix(m1.rows, m1.cols);
        for(let r = 0; r < m1.rows; r++)for(let c = 0; c < m1.cols; c++)result.data[r][c] = m1.data[r][c] - m2.data[r][c];
        return result;
    }
    subtract(v) {
        for(let r = 0; r < this.rows; r++)for(let c = 0; c < this.cols; c++)this.data[r][c] -= v;
    }
    // Matrix product
    static multiply(m1, m2) {
        if (m1.cols !== m2.rows) return null; // can't do the op
        const result = new Matrix(m1.rows, m2.cols);
        for(let i = 0; i < result.rows; i++)for(let j = 0; j < result.cols; j++){
            let sum = 0;
            for(let k = 0; k < m1.cols; k++)sum += m1.data[i][k] * m2.data[k][j];
            result.data[i][j] = sum;
        }
        return result;
    }
    multiply(v) {
        if (v instanceof Matrix) {
            // Element wise, Hadamard product
            for(let r = 0; r < this.rows; r++)for(let c = 0; c < this.cols; c++)this.data[r][c] *= v.data[r][c];
        } else {
            for(let r = 0; r < this.rows; r++)for(let c = 0; c < this.cols; c++)this.data[r][c] *= v;
        }
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"2bj6J":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + "kristijan-arsov-woman-400.56b3ea5d.png";

},{"./bundle-url":"3seVR"}],"1QEow":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "renderField", ()=>renderField
);
parcelHelpers.export(exports, "renderFieldColor", ()=>renderFieldColor
);
parcelHelpers.export(exports, "renderFieldContour", ()=>renderFieldContour
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../math/math");
var _random = require("../math/random");
var _primatives = require("./primatives");
const renderField = ({ width , height  }, context, fn, color = 'black', resolution = '50', length = 10)=>{
    const xStep = Math.round(width / resolution);
    const yStep = Math.round(height / resolution);
    const xMid = xStep / 2;
    const yMid = yStep / 2;
    for(let x = 0; x < width; x += xStep)for(let y = 0; y < height; y += yStep){
        const theta = fn(x, y);
        const vect = _math.uvFromAngle(theta).setMag(length || xMid);
        const x1 = x + xMid;
        const y1 = y + yMid;
        const x2 = x1 + vect.x;
        const y2 = y1 + vect.y;
        context.strokeStyle = _tinycolor2Default.default(color);
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
};
const renderFieldColor = ({ width , height  }, context, fn, resolution = '50', lowColor, highColor, noiseMax = 5)=>{
    const xStep = Math.round(width / resolution);
    const yStep = Math.round(height / resolution);
    for(let x = 0; x < width; x += xStep)for(let y = 0; y < height; y += yStep){
        const theta = fn(x, y);
        const colorMix = _math.mapRange(0, noiseMax * 2, 0, 100, theta + noiseMax);
        const fillColor = _tinycolor2Default.default.mix(lowColor, highColor, colorMix);
        context.fillStyle = _tinycolor2Default.default(fillColor).toRgbString();
        context.fillRect(x, y, x + xStep, y + yStep);
    }
};
const renderFieldContour = ({ width , height  }, context, fn, min = -8, max = 8, steps = 30, lowColor = 'black', highColor = 'white', varience = 0.025)=>{
    const nsteps = (max - min) / steps;
    const rpoints = 100000;
    for(let n = min; n < max; n += nsteps){
        const lowPoints = [];
        const highPoints = [];
        for(let i = 0; i < rpoints; i++){
            const px = _random.randomWholeBetween(0, width);
            const py = _random.randomWholeBetween(0, height);
            const nheight = fn(px, py);
            if (_math.isValueInRange(n, nheight, varience)) {
                if (nheight <= 0) lowPoints.push([
                    px,
                    py
                ]);
                else highPoints.push([
                    px,
                    py
                ]);
            }
        }
        _primatives.pixelAtPoints(context)(lowPoints, lowColor, 1);
        _primatives.pixelAtPoints(context)(highPoints, highColor, 1);
    }
}; // https://thingonitsown.blogspot.com/2019/02/finding-perlin-contours.html
 /*
function renderNoiseContour(startX, startY, borderVal, fn) {
    const lookRad = 2;
    let nextX = startX;
    let nextY = startY;
    const coords = [];
    // set color
    // start shape

    let distance = 0;
    for (let i = 0; i < 50000; i++) {
        const lastDistance = distance;
        const lastX = nextX;
        const lastY = nextY;
        for (
            distance = lastDistance + Math.PI / 2;
            (distance > lastDistance - Math.PI / 2 && !isValueInRange(borderVal, fn(startX, startY), 0.0035)) ||
            distance === lastDistance + Math.PI / 2;
            distance -= 0.17
        ) {
            nextX = lastX + lookRad * Math.cos(distance);
            nextY = lastY - lookRad * Math.sin(distance);
        }
        coords.push([nextX, nextY]);
        // vertex(nextX - mx + windowWidth / 2, nextY - my + windowHeight / 2)

        if (pointDistance({ x: nextX, y: nextY }, { x: startX, y: startY }) < lookRad && i > 1) {
            if (i > 4) {
                // endShape(CLOSE)
                return coords;
            }
            break;
        }
    }
}
*/ 

},{"tinycolor2":"101FG","../math/math":"4t0bw","../math/random":"1SLuP","./primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"3Qctl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "radialNoise", ()=>radialNoise
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../rndrgen/math/math");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _attractors = require("../rndrgen/math/attractors");
var _random = require("../rndrgen/math/random");
var _primatives = require("../rndrgen/canvas/primatives");
/*
Started here but took a detour
https://www.reddit.com/r/creativecoding/comments/lx9prx/audiovisual_sound_of_space_solar_system_david/
 */ const TAU = Math.PI * 2;
const radialNoise = ()=>{
    const config = {
        name: 'radialNoise',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    let canvasMidX;
    let canvasMidY;
    let maxRadius;
    let radiusScale;
    let currentRadiusSize = 360;
    let originX;
    let originY;
    let time = 0;
    let angle = 0;
    const history = {
    };
    const palette = _palettes.nicePalette();
    const backgroundColor = _palettes.brightest(palette).clone().lighten(10);
    const imageColor = _palettes.darkest(palette).clone();
    // let imageZoomFactor;
    // const png = new Image();
    // png.src = sourcePng;
    // let imageData;
    const setup = ({ canvas , context  })=>{
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        maxRadius = canvas.width * 0.4;
        radiusScale = currentRadiusSize / maxRadius;
        originX = canvasMidX;
        originY = canvasMidY;
        // imageData = getImageDataFromImage(context)(png);
        // clear(canvas, context)();
        // imageZoomFactor = 360 / imageData.width;
        _canvas.background(canvas, context)(backgroundColor);
    };
    const drawPixel = (context, x, y, color, size = 1, heading = 0)=>{
        _primatives.circleFilled(context)(x, y, size, color);
    };
    const drawLine = (context, x1, y1, x2, y2, color, strokeWidth = 1)=>{
        context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
        context.lineWidth = strokeWidth;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    };
    const circleX = (r, a, v = 1)=>r * Math.cos(a * v)
    ;
    const circleY = (r, a, v = 1)=>r * Math.sin(a * v)
    ;
    const draw = ({ canvas , context  })=>{
        for(let radius = 0; radius < currentRadiusSize; radius++){
            let ox;
            let oy;
            if (history.hasOwnProperty(radius)) {
                ox = history[radius].x;
                oy = history[radius].y;
            }
            const radScaled = radius / radiusScale;
            const a = 1;
            const b = 1;
            const radians = _math.degreesToRadians(angle) - Math.PI / 8;
            let x = originX + circleX(radScaled, radians, a);
            let y = originY + circleY(radScaled, radians, b);
            const noise = _attractors.simplexNoise3d(x, y, time, 0.02);
            x += noise;
            y += noise;
            const monoColor = imageColor.clone().spin(time * 0.1);
            if (ox !== undefined && oy !== undefined) drawLine(context, ox, oy, x, y, monoColor, 0.5);
            history[radius] = {
                x,
                y
            };
            time += 0.01;
        }
        angle += 3;
        if (angle > 360) {
            angle = 0;
            currentRadiusSize = _random.randomWholeBetween(100, 360);
            radiusScale = 1; // currentRadiusSize / maxRadius;
            const offs = _random.randomPointAround((canvas.width - maxRadius) * 0.75);
            originX = canvasMidX + offs.x;
            originY = canvasMidY + offs.y;
            _canvas.background(canvas, context)(backgroundColor.setAlpha(0.25));
        }
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/math/math":"4t0bw","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/math/attractors":"BodqP","../rndrgen/math/random":"1SLuP","../rndrgen/canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"3hmlu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "flowFieldRibbons", ()=>flowFieldRibbons
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _random = require("canvas-sketch-util/random");
var _randomDefault = parcelHelpers.interopDefault(_random);
var _math = require("../rndrgen/math/math");
var _particle = require("../rndrgen/systems/Particle");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _vector = require("../rndrgen/math/Vector");
var _attractors = require("../rndrgen/math/attractors");
var _fields = require("../rndrgen/canvas/fields");
var _random1 = require("../rndrgen/math/random");
/*
Based on
https://tylerxhobbs.com/essays/2020/flow-fields
 */ const drawRibbonPoint = (context, point, i, thickness = 0, height = 0)=>{
    const x = point[0];
    const y = point[1];
    context.lineTo(x + thickness, y + thickness);
};
const drawRibbon = (context)=>(sideA, sideB, color, stroke = false, thickness = 1)=>{
        const startx = sideA[0][0];
        const starty = sideA[0][1];
        const endx = sideB[0][0] + thickness;
        const endy = sideB[0][1] + thickness;
        const rColor = _tinycolor2Default.default(color).clone();
        const gradient = context.createLinearGradient(0, starty - thickness, 0, endy + thickness);
        gradient.addColorStop(0, rColor.toRgbString());
        gradient.addColorStop(1, rColor.clone().darken(20).toRgbString());
        context.beginPath();
        context.moveTo(startx, starty);
        sideA.forEach((w, i)=>{
            drawRibbonPoint(context, w, i, 0, thickness * 0.1);
        });
        sideB.forEach((w, i)=>{
            drawRibbonPoint(context, w, i, thickness, thickness * 0.1);
        });
        context.lineTo(startx, starty);
        if (stroke) {
            context.strokeStyle = rColor.darken(70).toRgbString();
            context.lineWidth = 0.75;
            context.stroke();
        }
        context.fillStyle = gradient;
        context.fill();
    }
;
const flowFieldRibbons = ()=>{
    const config = {
        name: 'flowFieldRibbons',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    let canvasWidth;
    let canvasHeight;
    let canvasMidX;
    let canvasMidY;
    const palette = _palettes.palettes.pop;
    const backgroundColor = _tinycolor2Default.default('white');
    let time = 0;
    const createRibbon = (fieldFn, startX, startY, length, vlimit = 1)=>{
        const props = {
            x: startX,
            y: startY,
            velocityX: 0,
            velocityY: 0,
            mass: 1
        };
        const particle = new _particle.Particle(props);
        const coords = [];
        for(let i = 0; i < length; i++){
            const theta = fieldFn(particle.x, particle.y);
            // theta = quantize(360, theta);
            const force = _math.uvFromAngle(theta);
            particle.applyForce(force);
            particle.velocity = particle.velocity.limit(vlimit);
            particle.updatePosWithVelocity();
            coords.push([
                particle.x,
                particle.y
            ]);
            particle.acceleration = new _vector.Vector(0, 0);
        }
        return coords;
    };
    const simplex2d = (x, y)=>_attractors.simplexNoise2d(x, y, 0.0005)
    ;
    const simplex3d = (x, y)=>_attractors.simplexNoise3d(x, y, time, 0.0005)
    ;
    const clifford = (x, y)=>_attractors.cliffordAttractor(canvasWidth, canvasHeight, x, y)
    ;
    const jong = (x, y)=>_attractors.jongAttractor(canvasWidth, canvasHeight, x, y)
    ;
    const noise = _random1.randomBoolean() ? clifford : jong;
    let maxRadius;
    const setup = ({ canvas , context  })=>{
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        maxRadius = canvas.width * 0.4;
        _canvas.background(canvas, context)(backgroundColor);
        _fields.renderField(canvas, context, noise, 'rgba(0,0,0,.15)', canvas.width / 10, 5);
    };
    const ribbonLen = _random1.randomWholeBetween(50, 1000);
    const ribbonThickness = _random1.randomWholeBetween(3, 30);
    const draw = ({ canvas , context  })=>{
        const color = _random1.oneOf(palette);
        const len = maxRadius * 2; // ribbonLen;
        const rpoint = _randomDefault.default.onCircle(maxRadius); // randomPointAround(maxRadius * 0.4);
        const x = rpoint[0] + canvasMidX;
        const y = rpoint[1] + canvasMidY;
        const x2 = x + 2;
        const y2 = y;
        const sideA = createRibbon(noise, x, y, len, 1);
        const sideB = createRibbon(noise, x2, y2, len, 1).reverse();
        drawRibbon(context)(sideA, sideB, color, false, ribbonThickness);
        time += 0.01;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","canvas-sketch-util/random":"5RUiF","../rndrgen/math/math":"4t0bw","../rndrgen/systems/Particle":"344El","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/math/Vector":"1MSqh","../rndrgen/math/attractors":"BodqP","../rndrgen/canvas/fields":"1QEow","../rndrgen/math/random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"2IsLg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "flowFieldRibbons2", ()=>flowFieldRibbons2
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _random = require("canvas-sketch-util/random");
var _randomDefault = parcelHelpers.interopDefault(_random);
var _math = require("../rndrgen/math/math");
var _particle = require("../rndrgen/systems/Particle");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _vector = require("../rndrgen/math/Vector");
var _attractors = require("../rndrgen/math/attractors");
var _fields = require("../rndrgen/canvas/fields");
var _random1 = require("../rndrgen/math/random");
/*
Based on
https://tylerxhobbs.com/essays/2020/flow-fields
 */ const drawRibbonPoint = (context, point, i, thickness = 0, height = 0)=>{
    const x = point[0];
    const y = point[1];
    const jitterX = 0; // Math.cos(i * 0.05) * height;
    const jitterY = 0; // Math.sin(i * 0.05) * height;
    context.lineTo(x + thickness + jitterX, y + thickness + jitterY);
};
const drawRibbonSegment = (context, sideA, sideB, color, stroke = false, thickness = 1)=>{
    const segStartX = sideA[0][0];
    const segStartY = sideA[0][1];
    const segEndX = sideB[0][0] + thickness;
    const segEndY = sideB[0][1] + thickness;
    const rColor = _tinycolor2Default.default(color).clone();
    const gradient = context.createLinearGradient(0, segStartY - thickness, 0, segEndY + thickness);
    gradient.addColorStop(0, rColor.toRgbString());
    gradient.addColorStop(0.5, rColor.toRgbString());
    gradient.addColorStop(1, rColor.clone().darken(20).saturate(50).toRgbString());
    context.beginPath();
    context.moveTo(segStartX, segStartY);
    sideA.forEach((w, i)=>{
        drawRibbonPoint(context, w, i, 0, thickness * 0.1);
    });
    sideB.forEach((w, i)=>{
        drawRibbonPoint(context, w, i, thickness, thickness * 0.1);
    });
    context.lineTo(segStartX, segStartY);
    if (stroke) {
        context.strokeStyle = rColor.darken(70).toRgbString();
        context.lineWidth = 0.75;
        context.stroke();
    }
    context.fillStyle = gradient;
    context.fill();
};
const drawRibbon = (context)=>(sideA, sideB, color, stroke = false, thickness = 1)=>{
        const segmentGap = 1; // randomWholeBetween(1, 4);
        const segments = _random1.randomWholeBetween(1, 3);
        // const segmentsStep = Math.ceil((sideA.length - segmentGap * (segments - 1)) / segments);
        const segmentData = [];
        let left = sideA.length;
        let start = 0;
        for(let i = 0; i < segments; i++){
            const len = _random1.randomWholeBetween(1, left / 2);
            // const start = i * segmentsStep + segmentGap * i;
            // const len = segmentsStep;
            segmentData.push({
                sideA: sideA.slice(start, start + len),
                sideB: sideB.slice(start, start + len).reverse()
            });
            start += len + segmentGap;
            left -= len + segmentGap;
        }
        segmentData.forEach((s)=>{
            drawRibbonSegment(context, s.sideA, s.sideB, color, stroke, thickness);
        });
    // drawRibbonSegment(context, segmentStart, segmentLen, sideA, sideB, color, stroke, thickness);
    }
;
const flowFieldRibbons2 = ()=>{
    const config = {
        name: 'flowFieldRibbons',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    let canvasMidX;
    let canvasMidY;
    const palette = _palettes.palettes['80s_pop'];
    const backgroundColor = _tinycolor2Default.default('white');
    let time = 0;
    const createRibbon = (fieldFn, startX, startY, length, vlimit = 1)=>{
        const props = {
            x: startX,
            y: startY,
            velocityX: 0,
            velocityY: 0,
            mass: 1
        };
        const particle = new _particle.Particle(props);
        const coords = [];
        for(let i = 0; i < length; i++){
            const theta = fieldFn(particle.x, particle.y);
            // theta = quantize(4, theta);
            const force = _math.uvFromAngle(theta);
            particle.applyForce(force);
            particle.velocity = particle.velocity.limit(vlimit);
            particle.updatePosWithVelocity();
            coords.push([
                particle.x,
                particle.y
            ]);
            particle.acceleration = new _vector.Vector(0, 0);
        }
        return coords;
    };
    const simplex2d = (x, y)=>_attractors.simplexNoise2d(x, y, 0.0001)
    ;
    const simplex3d = (x, y)=>_attractors.simplexNoise3d(x, y, time, 0.0005)
    ;
    const clifford = (x, y)=>_attractors.cliffordAttractor(canvas.width, canvas.height, x, y)
    ;
    const jong = (x, y)=>_attractors.jongAttractor(canvas.width, canvas.height, x, y)
    ;
    const noise = _random1.randomBoolean() ? clifford : jong;
    let maxRadius;
    const setup = ({ canvas , context  })=>{
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        maxRadius = canvas.width * 0.4;
        _canvas.background(canvas, context)(backgroundColor);
    // renderField(
    //     canvas,
    //     context,
    //     noise,
    //     tinycolor(oneOf(palette)).lighten(30),
    //     canvas.width / 10,
    //     canvas.width / 20
    // );
    };
    const ribbonLen = _random1.randomWholeBetween(200, 500);
    const ribbonThickness = _random1.randomWholeBetween(100, 300);
    const maxItterations = _random1.randomWholeBetween(10, 30);
    let currentItteration = 0;
    const draw = ({ canvas , context  })=>{
        const color = _random1.oneOf(palette);
        const len = ribbonLen;
        // const rpoint = random.onCircle(maxRadius); // randomPointAround(maxRadius * 0.4);
        const rpoint = [
            _random1.randomWholeBetween(0, canvas.width),
            _random1.randomWholeBetween(0, canvas.height)
        ];
        const x = rpoint[0];
        const y = rpoint[1];
        const x2 = x + 2;
        const y2 = y;
        const sideA = createRibbon(noise, x, y, len, 1);
        const sideB = createRibbon(noise, x2, y2, len, 1);
        drawRibbon(context)(sideA, sideB, color, false, ribbonThickness);
        time += 0.01;
        if ((++currentItteration) > maxItterations) return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","canvas-sketch-util/random":"5RUiF","../rndrgen/math/math":"4t0bw","../rndrgen/systems/Particle":"344El","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/math/Vector":"1MSqh","../rndrgen/math/attractors":"BodqP","../rndrgen/canvas/fields":"1QEow","../rndrgen/math/random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"1wwAx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "shadedBoxes", ()=>shadedBoxes
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _particle = require("../rndrgen/systems/Particle");
var _canvas = require("../rndrgen/canvas/canvas");
var _math = require("../rndrgen/math/math");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _box = require("../rndrgen/systems/Box");
var _attractors = require("../rndrgen/math/attractors");
var _vector = require("../rndrgen/math/Vector");
var _textures = require("../rndrgen/canvas/textures");
var _particles = require("../rndrgen/canvas/particles");
var _grids = require("../rndrgen/math/grids");
var _random = require("../rndrgen/math/random");
var _primatives = require("../rndrgen/canvas/primatives");
const shadedBoxes = ()=>{
    const config = {
        name: 'shadedBoxes',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    const numParticles = 30;
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let grid;
    const boxes = [];
    const palette = _palettes.palettes.pop;
    let time = 0;
    const setup = ({ canvas , context  })=>{
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;
        _canvas.background(canvas, context)(_palettes.paperWhite);
        const boxwhite = _palettes.paperWhite.clone().darken(10).saturate(10);
        const boxbg = [
            boxwhite, _palettes.bicPenBlue];
        const boxfg = [_palettes.bicPenBlue, boxwhite
        ];
        const gridMargin = Math.round(canvas.width / 10);
        const gridGutter = Math.round(gridMargin / 4);
        grid = _grids.getGridCells(canvas.width, canvas.height, 1, 10, gridMargin, gridGutter);
        grid.points.forEach((p, i)=>{
            boxes.push(new _box.Box({
                canvas,
                context,
                x: p[0],
                y: p[1],
                width: grid.columnWidth,
                height: grid.rowHeight
            }));
        });
        let freq = 0.0001;
        boxes.forEach((b, bidx)=>{
            const particles = [];
            const clr = bidx % 2 === 0 ? 0 : 1;
            b.backgroundColor = _palettes.bicPenBlue.clone(); // boxbg[clr];
            b.flowField = (x, y, t)=>_attractors.simplexNoise3d(x, y, t, freq)
            ;
            freq += 0.0005;
            for(let i = 0; i < numParticles; i++){
                const props = _particle.createRandomParticleValues(canvas);
                const coords = b.translateInto(b.randomPointInside('normal'));
                props.x = coords.x;
                props.y = coords.y;
                props.velocityX = 0;
                props.velocityY = 0;
                props.radius = 1;
                props.color = bidx <= 4 ? _palettes.bicPenBlue.clone() : _palettes.paperWhite.clone(); // tinycolor(boxfg[clr]).clone().setAlpha(0.5);
                particles.push(new _particle.Particle(props));
            }
            b.children = particles;
            _textures.textureRectStipple(context)(b.x, b.y, b.width, b.height, b.backgroundColor, bidx + 1);
        });
        // boxes.forEach((b) => {
        //     b.fill();
        // });
        return -1;
    };
    const draw = ({ canvas , context  })=>{
        boxes.forEach((box)=>{
            box.createClip();
            box.children.forEach((particle)=>{
                const theta = box.flowField(particle.x, particle.y, time);
                const force = _math.uvFromAngle(theta);
                particle.applyForce(force);
                particle.velocity = particle.velocity.limit(1);
                particle.updatePosWithVelocity();
                particle.acceleration = new _vector.Vector(0, 0);
                box.particleEdgeWrap(particle);
                _primatives.pixel(context)(particle.x, particle.y, particle.color, 'circle', 0.5);
            });
            box.removeClip();
        });
        time += 0.1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/systems/Particle":"344El","../rndrgen/canvas/canvas":"73Br1","../rndrgen/math/math":"4t0bw","../rndrgen/color/palettes":"3qayM","../rndrgen/systems/Box":"5o59H","../rndrgen/math/attractors":"BodqP","../rndrgen/math/Vector":"1MSqh","../rndrgen/canvas/textures":"73mfQ","../rndrgen/canvas/particles":"33yaF","../rndrgen/math/grids":"2Wgq0","../rndrgen/math/random":"1SLuP","../rndrgen/canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"5o59H":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Box", ()=>Box
);
/*
Flow field inside?
Particle physics inside
Border
Clip to no overflow?
 */ var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _utils = require("../utils");
var _random = require("../math/random");
var _primatives = require("../canvas/primatives");
const defaultMP = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};
const defaultFlow = (x, y)=>0
;
let boxIndex = 0;
class Point {
    constructor(x1, y1, z){
        this.x = x1;
        this.y = y1;
        this.z = z;
    }
    get toArray() {
        return [
            this.x,
            this.y,
            this.z
        ];
    }
    get toObject() {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    }
    clone() {
        return new Point(this.x, this.y, this.z);
    }
}
class Box {
    #backgroundColor;
    constructor(props, children = []){
        this.name = `box${boxIndex++}`;
        this.canvas = props.canvas;
        this.context = props.context;
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.rotation = _utils.defaultValue(props, 'rotation', 0);
        this.#backgroundColor = _tinycolor2Default.default(_utils.defaultValue(props, 'backgroundColor', 'white'));
        this.padding = _utils.defaultValue(props, 'padding', defaultMP);
        this.clip = _utils.defaultValue(props, 'clip', true);
        this.flowField = _utils.defaultValue(props, 'flowField', defaultFlow);
        this.children = children;
    }
    get x2() {
        return this.x + this.width;
    }
    get y2() {
        return this.y + this.height;
    }
    get innerWidth() {
        return this.width - this.padding.left - this.padding.right;
    }
    get innerHeight() {
        return this.height - this.padding.top - this.padding.bottom;
    }
    get centerPoint() {
        return new Point(this.x + Math.round(this.width / 2), this.y + Math.round(this.height / 2));
    }
    get backgroundColor() {
        return this.#backgroundColor.clone();
    }
    set backgroundColor(c) {
        this.#backgroundColor = _tinycolor2Default.default(c);
    }
    fill(color) {
        color = color || this.backgroundColor;
        _primatives.rectFilled(this.context)(this.x, this.y, this.width, this.height, color);
    }
    erase() {
        this.context.clearRect(this.x, this.y, this.width, this.height);
    }
    outline(thickness, color) {
        this.context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
        this.context.lineWidth = thickness;
        this.context.rect(this.x, this.y, this.width, this.height);
        this.context.stroke();
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip
    // https://dustinpfister.github.io/2019/08/14/canvas-save/
    // https://dustinpfister.github.io/2019/10/08/canvas-clip/
    createClip() {
        this.context.save();
        const region = new Path2D();
        region.rect(this.x, this.y, this.width, this.height);
        this.context.clip(region);
    }
    removeClip() {
        this.context.restore();
    }
    translateX(x) {
        return this.x + x;
    }
    translateY(y) {
        return this.y + y;
    }
    translateInto(point) {
        return new Point(this.translateX(point.x), this.translateY(point.y));
    }
    translateOut(point) {
        return new Point(point.x - this.x, point.y - this.y);
    }
    randomPointInside(distribution = 'whole') {
        const edgeBuffer = 10;
        let point = new Point(_random.randomWholeBetween(edgeBuffer, this.width - edgeBuffer), _random.randomWholeBetween(edgeBuffer, this.height - edgeBuffer));
        if (distribution === 'normal') point = new Point(_random.randomNormalWholeBetween(edgeBuffer, this.width - edgeBuffer), _random.randomNormalWholeBetween(edgeBuffer, this.height - edgeBuffer));
        return point;
    }
    isInside(point) {
        return point.x >= this.x && point.x <= this.x2 && point.y >= this.y && point.y <= this.y2;
    }
    isOutside(point) {
        return !this.isInside(point);
    }
    clipPoint(point) {
        const np = new Point(point.x, point.y);
        if (point.x < this.x) np.x = this.x;
        if (point.x > this.x2) np.x = this.x2;
        if (point.y < this.y) np.y = this.y;
        if (point.y > this.y2) np.y = this.y2;
        return np;
    }
    wrapPoint(point) {
        const np = new Point(point.x, point.y);
        if (point.x < this.x) np.x = this.x2;
        if (point.x > this.x2) np.x = this.x;
        if (point.y < this.y) np.y = this.y2;
        if (point.y > this.y2) np.y = this.y;
        return np;
    }
    particleEdgeBounce = (particle)=>{
        const psize = particle.radius;
        if (particle.x + psize > this.x2) {
            particle.x = this.x2 - psize;
            particle.reverseVelocityX();
        }
        if (particle.x - psize < this.x) {
            particle.x = this.x + psize;
            particle.reverseVelocityX();
        }
        if (particle.y + psize > this.y2) {
            particle.y = this.y2 - psize;
            particle.reverseVelocityY();
        }
        if (particle.y - psize < this.y) {
            particle.y = this.y + psize;
            particle.reverseVelocityY();
        }
    };
    particleEdgeWrap = (particle)=>{
        const psize = particle.radius;
        if (particle.x + psize > this.x2) particle.x = this.x + psize;
        if (particle.x - psize < this.x) particle.x = this.x2 - psize;
        if (particle.y + psize > this.y2) particle.y = this.y + psize;
        if (particle.y - psize < this.y) particle.y = this.y2 - psize;
    };
}

},{"tinycolor2":"101FG","../utils":"1kIwI","../math/random":"1SLuP","../canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"73mfQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setTextureClippingMaskEnabled", ()=>setTextureClippingMaskEnabled
);
parcelHelpers.export(exports, "textureRect", ()=>textureRect
);
parcelHelpers.export(exports, "textureRectSprials", ()=>textureRectSprials
);
parcelHelpers.export(exports, "textureRectStipple", ()=>textureRectStipple
);
parcelHelpers.export(exports, "textureRectZigZag", ()=>textureRectZigZag
);
// More detailed implementation https://blog.wolfram.com/2016/05/06/computational-stippling-can-machines-do-as-well-as-humans/
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../math/math");
var _utils = require("../utils");
var _random = require("../math/random");
const intervals = _math.logInterval(10, 1, 10);
let clipping = true;
const setTextureClippingMaskEnabled = (v = true)=>{
    clipping = v;
};
const getRotatedXYCoords = (x, y, length, theta)=>({
        x1: x,
        y1: y,
        x2: x + length * Math.cos(theta),
        y2: y + length * Math.sin(theta)
    })
;
const getRotatedYCoords = (x, y, length, theta)=>({
        x1: x,
        y1: y,
        x2: x + length,
        y2: y + length * Math.sin(theta)
    })
;
const pointLine = (context)=>(points, color = 'black', width = 1)=>{
        context.beginPath();
        context.strokeStyle = _tinycolor2Default.default(color).toRgbString();
        context.lineWidth = width;
        context.lineCap = 'butt';
        context.lineJoin = 'miter';
        points.forEach((coords, i)=>{
            if (i === 0) context.moveTo(coords[0], coords[1]);
            else context.lineTo(coords[0], coords[1]);
        });
        context.stroke();
    }
;
const textureRect = (context)=>(x, y, width, height, color = 'black', amount = 5, mode = 'circles2', mult = 1)=>{
        if (amount <= 0) return;
        if (clipping) {
            context.save();
            const region = new Path2D();
            region.rect(x, y, width, height);
            context.clip(region);
        }
        const quarter = width / 4;
        const strokeColor = _tinycolor2Default.default(color).toRgbString();
        const lineWidth = 1;
        // const numIttr = mapRange(1, 10, 2, 200, amount) * mult;
        const endValue = mode === 'xhatch' ? 100 : 25;
        const numIttr = intervals[Math.round(amount) - 1] * _math.mapRange(1, 10, 1, endValue, amount) * mult;
        const maxDim = Math.max(width, height);
        const maxRadius = maxDim * 0.7;
        for(let i = 0; i < numIttr; i++){
            let tx = _random.randomWholeBetween(x, x + width);
            let ty = _random.randomWholeBetween(y, y + height);
            let size = _random.randomWholeBetween(quarter, width);
            context.strokeStyle = strokeColor;
            context.lineWidth = lineWidth;
            context.beginPath();
            if (mode === 'circles') context.arc(tx, ty, size, 0, Math.PI * 2, false);
            else if (mode === 'circles2') {
                tx = _random.randomNormalWholeBetween(x, x + width);
                ty = _random.randomNormalWholeBetween(y, y + height);
                size = _random.randomWholeBetween(1, maxRadius);
                context.arc(tx, ty, size, 0, Math.PI * 2, false);
            } else if (mode === 'xhatch') {
                const tx2 = tx + size * _random.randomSign();
                const ty2 = ty + size * _random.randomSign();
                context.moveTo(tx, ty);
                context.lineTo(tx2, ty2);
            }
            context.stroke();
        }
        if (clipping) context.restore();
    }
;
const textureRectSprials = (context)=>(x, y, width, height, color = 'black', amount = 5, mult = 1)=>{
        if (amount <= 0) return;
        const maxDim = Math.max(width, height);
        const maxRadius = maxDim * 0.7;
        const fillamount = _math.mapRange(1, 10, 30, 150, amount) * mult;
        const numIttr = fillamount; // maxDim * (amount * 0.8);
        const radIncr = maxRadius / numIttr;
        const thetaIncr = _math.TAU / 50; // Math.floor(amount) * 0.05; // TAU / (Math.floor(amount) * 0.05);
        if (clipping) {
            context.save();
            const region = new Path2D();
            region.rect(x, y, width, height);
            context.clip(region);
        }
        const strokeColor = _tinycolor2Default.default(color).toRgbString();
        const lineWidth = 1;
        context.strokeStyle = strokeColor;
        context.lineWidth = lineWidth;
        const spirals = intervals[Math.round(amount) - 1] * _math.mapRange(1, 10, 1, 15, amount) * mult;
        for(let s = 0; s < spirals; s++){
            const ox = _random.randomNormalWholeBetween(x, x + width);
            const oy = _random.randomNormalWholeBetween(y, y + height);
            let theta = _random.randomNumberBetween(0, _math.TAU);
            let radius = 0;
            context.beginPath();
            context.moveTo(ox, oy);
            for(let i = 0; i < numIttr; i++){
                radius += radIncr; // + Math.sin(i / 2);
                theta += thetaIncr;
                const px = ox + radius * Math.cos(theta);
                const py = oy + radius * Math.sin(theta);
                context.lineTo(px, py);
            }
            context.stroke();
        }
        if (clipping) context.restore();
    }
;
const textureRectStipple = (context)=>(x, y, width, height, color = 'black', amount = 5, theta)=>{
        if (amount <= 0) return;
        // amount = Math.min(amount, 10);
        if (clipping) {
            context.save();
            const region = new Path2D();
            region.rect(x, y, width, height);
            context.clip(region);
        }
        const strokeColor = _tinycolor2Default.default(color).toRgbString();
        const size = 3;
        const colStep = width / _math.mapRange(1, 10, 3, width / 3, amount);
        const rowStep = height / _math.mapRange(1, 10, 3, height / 3, amount);
        context.strokeStyle = strokeColor;
        context.lineWidth = 2;
        context.lineCap = 'round';
        theta = theta === undefined ? Math.PI / 3 : theta;
        for(let i = 0; i < width; i += colStep)for(let j = 0; j < height; j += rowStep){
            // about the middle of the cell
            const tx = x + _random.randomNormalWholeBetween(i, i + colStep);
            const ty = y + _random.randomNormalWholeBetween(j, j + rowStep);
            const coords = getRotatedYCoords(tx, ty, size, theta);
            const tx2 = coords.x2; // tx + size;
            const ty2 = coords.y2; // ty + size * -1;
            context.beginPath();
            context.moveTo(tx, ty);
            context.lineTo(tx2, ty2);
            context.stroke();
        }
        if (clipping) context.restore();
    }
;
const textureRectZigZag = (context)=>(x, y, width, height, color = 'black', amount = 5, theta = 0, mult = 1)=>{
        if (amount <= 0) return;
        if (clipping) {
            context.save();
            const region = new Path2D();
            region.rect(x, y, width, height);
            context.clip(region);
        }
        const points = [];
        const strokeColor = _tinycolor2Default.default(color).toRgbString();
        const lineWidth = 1;
        const yDelta = width * Math.sin(theta); // height of angle line
        const yIncrement = height / amount / 2;
        let yincr = 0;
        const loops = height / yIncrement;
        // keep centered
        const yOff = yIncrement / 2 - yDelta / 2;
        let connectSide = 1;
        let coords = {
            x1: x,
            y1: y,
            x2: x,
            y2: y
        };
        let lastCoords = {
            x1: x,
            y1: Math.min(y, y + yOff),
            x2: x,
            y2: Math.min(y, y + yOff)
        };
        // rectFilled(context)(x, y, width, height, '#ddd');
        for(let i = 0; i < loops; i++){
            coords = getRotatedYCoords(x, yOff + y + yincr, width, theta);
            // draw bar
            if (yincr === 0) {
                // line to the top
                if (coords.y1 > y) points.push([
                    coords.x1,
                    y
                ]);
                points.push([
                    coords.x1,
                    coords.y1
                ]);
            }
            if (connectSide === 1) {
                // right
                points.push([
                    coords.x2,
                    coords.y2
                ]);
                points.push([
                    coords.x2,
                    coords.y2 + yIncrement
                ]);
            } else {
                // left
                points.push([
                    coords.x1,
                    coords.y1
                ]);
                points.push([
                    coords.x1,
                    coords.y1 + yIncrement
                ]);
            }
            yincr += yIncrement;
            connectSide *= -1;
            lastCoords = coords;
        }
        // line to the bottom
        if (_utils.last(points)[1] < y + height) _utils.last(points)[1] = y + height;
        pointLine(context)(points, strokeColor, lineWidth);
        if (clipping) context.restore();
    }
;

},{"tinycolor2":"101FG","../math/math":"4t0bw","../utils":"1kIwI","../math/random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"3xaAe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "larrycarlson02", ()=>larrycarlson02
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../rndrgen/math/math");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _bitmap = require("../rndrgen/canvas/Bitmap");
var _alexanderKrivitskiy2WOEPBkaH7OUnsplashPng = require("../../media/images/alexander-krivitskiy-2wOEPBkaH7o-unsplash.png");
var _alexanderKrivitskiy2WOEPBkaH7OUnsplashPngDefault = parcelHelpers.interopDefault(_alexanderKrivitskiy2WOEPBkaH7OUnsplashPng);
var _primatives = require("../rndrgen/canvas/primatives");
const larrycarlson02 = ()=>{
    const config = {
        name: 'larrycarlson2',
        ratio: _sketch.ratio.square,
        // orientation: orientation.portrait,
        scale: _sketch.scale.standard
    };
    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;
    let imageWidth;
    let imageHeight;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    const ribbonThickness = 10;
    const backgroundColor = _palettes.paperWhite.clone();
    const image = new _bitmap.Bitmap(_alexanderKrivitskiy2WOEPBkaH7OUnsplashPngDefault.default);
    const colorImageTop = _tinycolor2Default.default('#ffeb00');
    const colorImageBottom = _tinycolor2Default.default('#01ff4f');
    const colorLinesTop = _tinycolor2Default.default('#ff01d7');
    const colorLinesBottom = _tinycolor2Default.default('#5600cc');
    const setup = ({ canvas , context  })=>{
        image.init(canvas, context);
        ctx = context;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;
        imageWidth = canvas.width - margin * 2;
        imageHeight = canvas.height - margin * 2;
        startX = margin;
        maxX = canvas.width - margin;
        startY = margin;
        maxY = canvas.height - margin;
        _canvas.background(canvas, context)(backgroundColor);
    };
    // const circleX = (theta, amp, freq) => Math.cos(theta / freq) * amp;
    // const circleY = (theta, amp, freq) => Math.sin(theta / freq) * amp;
    const renderImage = ()=>{
        const resolution = ribbonThickness / 2;
        const border = margin / -2;
        // const freq = 30;
        // const amp = 1;
        // let theta = 0;
        for(let x = startX + border; x < maxX - border; x += resolution)for(let y = startY + border; y < maxY - border; y += resolution){
            const pxcolor = image.pixelColorFromCanvas(x, y);
            const pxbrightness = pxcolor.getBrightness();
            const bright = _math.mapRange(128, 255, 0, 50, pxbrightness);
            const color = _tinycolor2Default.default.mix(colorImageTop, colorImageBottom, _math.mapRange(startY, maxY, 0, 100, y));
            const size = resolution;
            if (pxbrightness > 128) color.brighten(bright);
            if (pxbrightness >= 70 && pxbrightness <= 100) color.spin(30);
            // const ox = circleX(theta, amp, freq) + x;
            // const oy = circleY(theta, amp, freq) + y;
            _primatives.pixel(ctx)(x, y, color, 'circle', size);
        // theta += 0.25;
        }
    };
    const drawRibbonPoint = (point, isOtherSide)=>{
        const x = point[0];
        const y = point[1];
        // -2 +1 to keep from overlapping other ribbons and give it a min thickness of 1
        const size = image.sizeFromPixelBrightness(x, y, ribbonThickness - 2, 128, 255) + 0.75;
        let jitterX = 0; // size;
        // let jitterY = 0;
        if (isOtherSide) jitterX = size * -1;
        ctx.lineTo(x + jitterX, y);
    };
    const drawRibbon = (sideA, color, stroke = false)=>{
        const rColor = _tinycolor2Default.default(color).clone();
        const gradient = ctx.createLinearGradient(0, startY, 0, maxY);
        gradient.addColorStop(0, colorLinesTop.toRgbString());
        gradient.addColorStop(1, colorLinesBottom.toRgbString());
        ctx.beginPath();
        ctx.moveTo(sideA[0], sideA[0]);
        sideA.forEach((w)=>{
            drawRibbonPoint(w, false);
        });
        sideA.reverse().forEach((w)=>{
            drawRibbonPoint(w, true);
        });
        ctx.closePath();
        if (stroke) {
            ctx.strokeStyle = rColor.darken(70).toRgbString();
            ctx.lineWidth = 0.75;
            ctx.stroke();
        }
        ctx.fillStyle = gradient;
        ctx.fill();
    };
    const renderPoints = (points)=>{
        points.forEach((line)=>{
            if (line.length) drawRibbon(line, 'red', false, 0);
        });
    };
    /*
    https://www.desmos.com/calculator/rzwar3xxpy
    y-x = amp * Math.sin((y+x)/freq)
     */ const getPointsDiagSinWave = (xoffset, yoffset)=>{
        const freq = 40; // 30
        const amp = 15; // 5
        let y = 0;
        const a = Math.PI / 3; // angle of the wave, 1 is 45
        const points = [];
        for(let x = 0; x < canvasWidth; x++){
            const b = x; // Math.sin(x / Math.PI) * 2;
            // y = amp * Math.sin((y + b) / freq) + x * a;
            y = amp * Math.sin((y * a + b) / freq) + x * a;
            const px = x + xoffset;
            const py = y + yoffset;
            if (px > startX && px < maxX && py > startY && py < maxY) points.push([
                px,
                py
            ]);
        }
        return points;
    };
    const draw = ({ canvas , context  })=>{
        const points = [];
        renderImage();
        for(let x = (imageWidth + 100) * -1; x < imageWidth * 2; x += ribbonThickness)points.push(getPointsDiagSinWave(x, 0));
        renderPoints(points);
        return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/math/math":"4t0bw","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/canvas/Bitmap":"17J8Q","../../media/images/alexander-krivitskiy-2wOEPBkaH7o-unsplash.png":"5WOur","../rndrgen/canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"5WOur":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + "alexander-krivitskiy-2wOEPBkaH7o-unsplash.c33afb25.png";

},{"./bundle-url":"3seVR"}],"6SHt4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "meanderingRiver02", ()=>meanderingRiver02
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _meanderingRiver = require("../rndrgen/systems/MeanderingRiver");
var _segments = require("../rndrgen/math/segments");
var _attractors = require("../rndrgen/math/attractors");
var _grids = require("../rndrgen/math/grids");
var _random = require("../rndrgen/math/random");
var _points = require("../rndrgen/math/points");
var _primatives = require("../rndrgen/canvas/primatives");
/*
Meandering River class at ../rndrgen/MeanderingRiver
 */ const createHorizontalPath = ({ width , height  }, startX, startY, steps = 20)=>{
    const coords = [];
    const incr = Math.round(width / steps);
    const midx = width / 2;
    for(let i = startX; i < width; i += incr){
        // greater variation in the middle
        const midDist = Math.round(midx - Math.abs(i - midx));
        const y = _random.randomNormalWholeBetween(startY - midDist, startY + midDist);
        coords.push([
            i,
            y
        ]);
    }
    coords.push([
        width,
        startY
    ]);
    return coords;
};
const createVerticalPath = ({ width , height  }, startX, startY, steps = 20)=>{
    const coords = [];
    const incr = Math.round(height / steps);
    const midy = height / 2;
    for(let i = startY; i < height; i += incr){
        // greater variation in the middle
        const midDist = Math.round(midy - Math.abs(i - midy));
        const x = _random.randomNormalWholeBetween(startX - midDist, startX + midDist);
        coords.push([
            x,
            i
        ]);
    }
    coords.push([
        startX,
        height
    ]);
    return coords;
};
const meanderingRiver02 = ()=>{
    const config = {
        name: 'meandering-river-02',
        ratio: _sketch.ratio.a3plus,
        scale: _sketch.scale.hidpi,
        orientation: _sketch.orientation.portrait
    };
    let ctx;
    let canvasMidX;
    let canvasMidY;
    const renderScale = config.scale; // 1 or 2
    const rivers = [];
    let time = 0;
    const backgroundColor = _palettes.warmWhite;
    // const simplex2d = (x, y) => simplexNoise2d(x, y, 0.002);
    // const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
    // const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
    // const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);
    const noise = (x, y)=>_attractors.simplexNoise2d(x, y, 0.002)
    ;
    const maxHistory = 10;
    const historyStep = 25;
    const wrapped = false;
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        _canvas.background(canvas, context)(backgroundColor);
        const horizontal = _points.createSplineFromPointArray(createHorizontalPath(canvas, 0, canvasMidY, 40));
        const vertical = _points.createSplineFromPointArray(createVerticalPath(canvas, canvasMidX, 0, 40));
        const circle = _grids.getPointsOnCircleOld(canvasMidX, canvasMidY, canvasMidX / 2, Math.PI * 4, false);
        const cs = {
            mixTangentRatio: 0.45,
            mixMagnitude: 1.25,
            curvemeasure: 4,
            curvesize: 5,
            pointremove: 5,
            oxbowProx: 2.5
        };
        const circleRiver = new _meanderingRiver.MeanderingRiver(circle, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,
            wrapEnd: true,
            handleOxbows: true,
            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,
            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),
            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3
        });
        const verticalRiver = new _meanderingRiver.MeanderingRiver(vertical, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,
            wrapEnd: wrapped,
            handleOxbows: true,
            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,
            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),
            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3
        });
        const horizontalRiver = new _meanderingRiver.MeanderingRiver(horizontal, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,
            wrapEnd: wrapped,
            handleOxbows: true,
            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,
            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),
            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3
        });
        rivers.push(circleRiver, horizontalRiver);
    };
    const draw = ({ canvas , context  })=>{
        // background(canvas, context)(backgroundColor.clone().setAlpha(0.005));
        // renderField(canvas, context, noise, 'rgba(0,0,0,.5)', 30, 15);
        // https://colorhunt.co/palette/264684
        const riverColor = [_palettes.bicPenBlue, _tinycolor2Default.default('#fed049')
        ];
        const closed = [
            true,
            false
        ];
        // step
        rivers.forEach((r)=>{
            for(let i = 0; i < renderScale; i++)r.step();
        });
        // main
        rivers.forEach((r, i)=>{
            const c = riverColor[i].clone().setAlpha(0.15); // tinycolor(`hsl(${time},70,50)`);
            // r.oxbows.forEach((o) => {
            //     // const w = Math.abs(mapRange(0, o.startLength, riverWeight[i] / 2, riverWeight[i], o.points.length));
            //     pointPathPA(ctx)(o.points, c, 1);
            // });
            const points = _segments.chaikinSmooth(r.points, 4);
            if (points.length) _primatives.pointPathPA(ctx)(points, c, 2, closed[i]);
        });
        time += 0.25;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/systems/MeanderingRiver":"7Bn1Y","../rndrgen/math/segments":"5KdqE","../rndrgen/math/attractors":"BodqP","../rndrgen/math/grids":"2Wgq0","../rndrgen/math/random":"1SLuP","../rndrgen/math/points":"4RQVg","../rndrgen/canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"7Bn1Y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/*
Based on Meander by Robert Hodgin
http://roberthodgin.com/project/meander

And Eric's recreations
https://www.reddit.com/r/generative/comments/lfsl8t/pop_art_meandering_river/
 */ /*
The settings for the effect are very particular.  Too many points tends to result in "mushrooming" of the flow and
on the extreme, oxbows everywhere. But this can be very interesting! Too too few will cause the flow to flatten.

    - Curve measure larger will create larger bubbles
    - Curve size, even larger bubbles
    - Seg curve multiplier should be <1
    - If point remove prox is too low line will create mushrooms. Should be curve size or a few decimal points under
    - If insertion factor is > 1, then the line will just be straight
    - Mix mag should be incr in small sizes
*/ /*
Settings for a nice medium high turbulence river

// Convenience settings object
const cs = {
    mixTangentRatio: 0.45,
    mixMagnitude: 1.75,
    curvemeasure: 4,
    curvesize: 5,
    pointremove: 5,
    oxbowProx: 2.5,
};

const mediumRiver = new MeanderingRiver(points, {
    maxHistory,
    storeHistoryEvery: historyStep,
    fixedEndPoints: 3,
    influenceLimit: 0,

    mixTangentRatio: cs.mixTangentRatio,
    mixMagnitude: cs.mixMagnitude,
    oxbowProx: cs.oxbowProx,
    oxbowPointIndexProx: cs.curvemeasure,
    measureCurveAdjacent: cs.curvemeasure,
    curveSize: cs.curvesize,
    pointRemoveProx: cs.pointremove,

    pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

    noiseFn: noise,
    noiseMode: 'mix',
    noiseStrengthAffect: 0,
    mixNoiseRatio: 0.3,
});

// history
rivers.forEach((r, i) => {
    for (let h = r.history.length - 1; h >= 0; h--) {
        // const a = mapRange(0, maxHistory, 0.35, 0.1, h);
        const b = mapRange(0, maxHistory, 5, 20, h);
        const hcolor = tinycolor.mix(riverColor, backgroundColor, mapRange(0, maxHistory, 0, 100, h)).darken(b);
        // const hcolor = riverColor.clone().darken(b);
        const hpoints = r.history[h].channel; // smoothPoints(r.history[h].channel, 8, 3);
        pointPathPA(ctx)(hpoints, hcolor, riverWeight[i] * 2);
    }
});

 */ parcelHelpers.export(exports, "MeanderingRiver", ()=>MeanderingRiver
);
parcelHelpers.export(exports, "flowRight", ()=>flowRight
);
parcelHelpers.export(exports, "flowDown", ()=>flowDown
);
parcelHelpers.export(exports, "flowRightToMiddle", ()=>flowRightToMiddle
);
var _segments = require("../math/segments");
var _utils = require("../utils");
var _math = require("../math/math");
var _vector = require("../math/Vector");
var _points = require("../math/points");
class MeanderingRiver {
    constructor(initPoints, props){
        this.startingPoints = initPoints;
        this.pointVectors = _points.arrayPointArrayToVectorArray(initPoints);
        this.oxbows = [];
        // Toggle oxbow checking
        this.handleOxbows = _utils.defaultValue(props, 'handleOxbows', true);
        // Wrap around end points circles/closed shapes
        this.wrapEnd = _utils.defaultValue(props, 'wrapEnd', false);
        // %age of line length to fix at each end. Must be >= 1
        // Setting to 1 will be fixing the first 1 point only, not percentage
        this.fixedEndPoints = _utils.defaultValue(props, 'fixedEndPoints', 1);
        // how many adjacent points to use to measure the average curvature
        this.measureCurveAdjacent = _utils.defaultValue(props, 'measureCurveAdjacent', 30);
        // Ineffective multiply the measured curvature vector magnitude to enhance effect
        this.segCurveMultiplier = _utils.defaultValue(props, 'segCurveMultiplier', 1);
        // How much to blend tangent and bitangent, 0 = tangent, 1 = bitangent
        this.mixTangentRatio = _utils.defaultValue(props, 'mixTangentRatio', 0.5);
        // Magnitude of the mixed vector, increase the effect, < slower
        this.mixMagnitude = _utils.defaultValue(props, 'mixMagnitude', 0);
        // Limit the influence vector,  less than 1, slower. > 1 no affect
        this.influenceLimit = _utils.defaultValue(props, 'influenceLimit', 0);
        // Additional vector to push the flow in a direction
        this.pushFlowVectorFn = _utils.defaultValue(props, 'pushFlowVectorFn', undefined);
        // Add new points if the distance between is larger
        this.curveSize = _utils.defaultValue(props, 'curveSize', 2);
        // Multiplier for the amount of new points to add
        this.insertionFactor = _utils.defaultValue(props, 'insertionFactor', 1);
        // Remove points closer than this
        this.pointRemoveProx = _utils.defaultValue(props, 'pointRemoveProx', this.curveSize * 0.8);
        // Point proximity to create a new oxbow and ...
        this.oxbowProx = _utils.defaultValue(props, 'oxbowProx', this.curveSize);
        // If points are not this close than create oxbow
        this.oxbowPointIndexProx = Math.ceil(this.measureCurveAdjacent * 1.5);
        // this.oxbowShrinkRate = defaultValue(props, 'oxbowShrinkRate', 25);
        // Additional flow influence. mix, only, scaleMag, flowInTo
        this.noiseMode = _utils.defaultValue(props, 'noiseMode', 'mix'); // mix or only (mix and exclude less than strength)
        // Passed x,y returns a small -/+ value
        this.noiseFn = _utils.defaultValue(props, 'noiseFn', undefined);
        // Values returned from noise fn less than this will be ignored
        this.noiseStrengthAffect = _utils.defaultValue(props, 'noiseStrengthAffect', 3); // only noise theta > will cause drift
        // Ratio to mix in noise with the calculated influence vector. Best kept less than .3
        this.mixNoiseRatio = _utils.defaultValue(props, 'mixNoiseRatio', 0.1);
        // Store history of the past flows
        this.steps = 0;
        this.maxHistory = _utils.defaultValue(props, 'maxHistory', 10);
        this.storeHistoryEvery = _utils.defaultValue(props, 'storeHistoryEvery', 2);
        this.history = [];
        this.running = true;
    }
    get points() {
        return _points.arrayVectorToPointArray(this.pointVectors);
    }
    addToHistory(ox, channel) {
        if (this.steps % this.storeHistoryEvery === 0) {
            this.history.unshift({
                oxbows: ox,
                channel
            });
            if (this.history.length > this.maxHistory) this.history = this.history.slice(0, this.maxHistory);
        }
    }
    // Average Menger curvature of the segments
    averageMCurvature(points) {
        const sum = points.reduce((diffs, point, i)=>{
            const prev = i - 1;
            const next = i + 1;
            if (prev >= 0 && next < points.length) diffs += _segments.mengerCurvature(points[prev], point, points[next]);
            return diffs;
        }, 0);
        return _math.degreesToRadians(sum / points.length);
    }
    // get x# of points on either side of the given point
    getPointsToMeasure(i, points) {
        const len = this.measureCurveAdjacent;
        let min = 0;
        let max = points.length;
        // if (this.wrapEnd) {
        //     // Circular - resulting in poor curve values
        //     const start = getArrayValuesFromStart(points, i, len);
        //     const end = getArrayValuesFromEnd(points, i, len);
        //     return start.concat(end);
        // }
        min = i < len ? 0 : i - len;
        max = i > points.length - len ? points.length : i + len;
        return points.slice(min, max);
    }
    // The main part of the effect - most important parts
    // 1. The curvature of a portion of the points is measured and averaged
    // 2. The angle/tangent of the current and next points is measured
    // 3. A perpendicular bitangent is calculated and it's magnitude set to the curvature
    // 4. A mix vector is created from a blend of the tangent and bitangent
    curvatureInfluence(point, i, allPoints) {
        const curvature = this.averageMCurvature(this.getPointsToMeasure(i, allPoints)) * this.segCurveMultiplier;
        const curveDirection = curvature < 0 ? 1 : -1;
        let nextPoint = allPoints[i + 1];
        if (!nextPoint && this.wrapEnd) // If wrapped, the next point at the end is the start
        nextPoint = allPoints[0];
        const tangent = nextPoint.sub(point);
        const biangle = tangent.angle() + 1.5708 * curveDirection;
        const bitangent = _math.uvFromAngle(biangle).setMag(Math.abs(curvature));
        const a = tangent.normalize();
        const b = bitangent.normalize();
        let mVector = a.mix(b, this.mixTangentRatio);
        // Noise to add interesting extra flows
        if (this.noiseFn) {
            const t = this.noiseFn(point.x, point.y);
            if (this.noiseMode === 'mix' && Math.abs(t) > this.noiseStrengthAffect) {
                // Mix the strength of the noise
                const n = _math.uvFromAngle(t);
                mVector = mVector.mix(n, this.mixNoiseRatio);
            } else if (this.noiseMode === 'flowInTo') {
                // "Flow" into lower areas, zero out high areas
                if (t < 0) {
                    const n = _math.uvFromAngle(t);
                    mVector = mVector.mix(n, this.mixNoiseRatio);
                } else // TODO scale down based on noise, not zero
                mVector = new _vector.Vector(0, 0);
            } else if (this.noiseMode === 'scaleMag') {
                const nscale = _math.mapRange(0, this.noiseStrengthAffect, 5, 1, 3, Math.abs(t));
                mVector = mVector.setMag(nscale);
            }
        }
        // Increase the strength
        if (this.mixMagnitude) mVector = mVector.setMag(this.mixMagnitude);
        // Limit the length
        if (this.influenceLimit > 0) mVector = mVector.limit(this.influenceLimit);
        return mVector;
    }
    // Move the points
    meanderLinear(points) {
        // Slice the array in to points to affect (mid) and to not (start and end)
        const pct = this.fixedEndPoints === 1 ? 1 : Math.max(_math.percentage(points.length, this.fixedEndPoints), 1);
        const fixedPointsPct = pct;
        const startIndex = fixedPointsPct;
        const startIndexPoints = points.slice(0, startIndex);
        const endIndex = points.length - fixedPointsPct;
        const endIndexPoints = points.slice(endIndex, points.length);
        const middlePoints = points.slice(startIndex, endIndex);
        const influencedPoints = middlePoints.map((point, i)=>{
            const mixVector = this.curvatureInfluence(point, i + startIndex, points);
            let infPoint = point.add(mixVector);
            // Additional motion to the point vectors to push around the screen, sim flows in directions, keep towards
            // the center of the screen, etc.
            if (this.pushFlowVectorFn) {
                const pushVector = this.pushFlowVectorFn(point, mixVector);
                infPoint = infPoint.add(pushVector);
            }
            return infPoint;
        });
        return startIndexPoints.concat(influencedPoints).concat(endIndexPoints);
    }
    meanderWrapped(points) {
        let influencedPoints = [];
        if (points.length > 3) influencedPoints = points.map((point, i)=>{
            const mixVector = this.curvatureInfluence(point, i, points);
            let infPoint = point.add(mixVector);
            // Additional motion to the point vectors to push around the screen, sim flows in directions, keep towards
            // the center of the screen, etc.
            if (this.pushFlowVectorFn) {
                const pushVector = this.pushFlowVectorFn(point, mixVector);
                infPoint = infPoint.add(pushVector);
            }
            return infPoint;
        });
        else {
            // Lines crossed and there were cut off/oxbowed
            this.running = false;
            console.log('Meander crossed, stopping');
        }
        return influencedPoints;
    }
    canRemovePoint(i, points) {
        this.wrapEnd;
        const fixed = this.fixedEndPoints || 1;
        return i > fixed && i < points.length - fixed;
    }
    // If points are too far apart, add extra points to allow for expansion
    // If they're too close, remove them to remove uneccessary information
    // Too many points too close together will trash performance and cause many many oxbows to form w/ short segments
    adjustPointsSpacing(points) {
        return points.reduce((acc, point, i)=>{
            if (i === 0 || i === points.length - 1 && !this.wrapEnd) {
                acc.push(point);
                return acc;
            }
            let next = points[i + 1];
            if (this.wrapEnd && !next) next = points[0];
            const distance = _points.pointDistance(point, next);
            if (distance > this.curveSize) {
                // Add points
                const numInsertPoints = Math.round(distance / this.curveSize * this.insertionFactor) + 1;
                for(let k = 0; k < numInsertPoints; k++){
                    const ratio = 1 / numInsertPoints * k;
                    const nx = _math.lerp(point.x, next.x, ratio);
                    const ny = _math.lerp(point.y, next.y, ratio);
                    acc.push(new _vector.Vector(nx, ny));
                }
            } else if (this.canRemovePoint(i, points) && distance < this.pointRemoveProx) ;
            else acc.push(point);
            return acc;
        }, []);
    }
    checkForOxbows(points) {
        const newPoints = [];
        for(let i = 0; i < points.length; i++){
            const point = points[i];
            newPoints.push(point);
            for(let j = i; j < points.length; j++){
                // exclude first and last if it's wrapping
                if (this.wrapEnd && i === 0 || j === 0 || i === points.length - 1 || j === points.length - 1) continue;
                const next = points[j];
                const dist = _points.pointDistance(point, next);
                // Check the proximity of the points on the screen and their proximity in the points array
                if (dist < this.oxbowProx && Math.abs(i - j) > this.oxbowPointIndexProx) {
                    newPoints.push(next);
                    let oxpoints = _points.arrayVectorToPointArray(points.slice(i, j));
                    oxpoints = _segments.chaikinSmooth(_points.trimPointArray(oxpoints, 3), 3);
                    this.oxbows.push({
                        points: oxpoints,
                        startLength: oxpoints.length
                    });
                    // Skip i ahead to j since these points were removed
                    i = j;
                }
            }
        }
        return newPoints;
    }
    // Shrink the oxbows so the "evaporate"
    // TODO - shrink distance between points not just cut off of the end
    shrinkOxbows(oxbowArr) {
        return oxbowArr.reduce((oxacc, oxbow)=>{
            const oxpoints = oxbow.points;
            if (oxpoints.length > 1) {
                const shrinkPct = 1; // Math.ceil(this.oxbowShrinkRate / oxpoints.length);
                oxbow.points = oxpoints.reduce((ptacc, point, i)=>{
                    // Check check each channel segment for intersection with an oxbow segment
                    // If it intersects, remove it
                    const intersect = this.pointVectors.reduce((acc, cp, k)=>{
                        if (!acc) {
                            const np = this.pointVectors[k + 1];
                            const nop = oxpoints[i + 1];
                            if (np && nop) acc = _segments.linesIntersect(cp.x, cp.y, np.x, np.y, point[0], point[1], nop[0], nop[1]);
                        }
                        return acc;
                    }, false);
                    if (!intersect) // remove the first and last point
                    {
                        if (i > shrinkPct && i < oxbow.points.length - shrinkPct) ptacc.push(point);
                    }
                    return ptacc;
                }, []);
                oxacc.push(oxbow);
            }
            return oxacc;
        }, []);
    }
    // Execute one step
    step() {
        // Running stops if the line crosses it self at the ends and the whole segment is cut ad becomes an oxbow
        if (this.running) {
            // influence segments to sim flow and process points
            let newPoints = this.wrapEnd ? this.meanderWrapped(this.pointVectors) : this.meanderLinear(this.pointVectors);
            newPoints = this.adjustPointsSpacing(newPoints);
            if (this.handleOxbows) newPoints = this.checkForOxbows(newPoints);
            this.pointVectors = newPoints;
            if (this.handleOxbows) this.oxbows = this.shrinkOxbows(this.oxbows);
            // Record history
            this.addToHistory(this.oxbows, _points.arrayVectorToPointArray(this.pointVectors));
            this.steps++;
        } else if (this.handleOxbows) this.oxbows = this.shrinkOxbows(this.oxbows);
    }
}
const flowRight = (p, m)=>new _vector.Vector(1, 0)
;
const flowDown = (p, m)=>new _vector.Vector(0, 1)
;
const flowRightToMiddle = (f, mid)=>(p, m)=>{
        const dist = Math.abs(mid - p.y);
        let y = _math.mapRange(0, mid / 2, 0, f, dist);
        if (p.y > mid) y *= -1;
        return new _vector.Vector(1, y);
    }
;

},{"../math/segments":"5KdqE","../utils":"1kIwI","../math/math":"4t0bw","../math/Vector":"1MSqh","../math/points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"5KdqE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "reduceLineFromStart", ()=>reduceLineFromStart
);
parcelHelpers.export(exports, "reduceLineFromEnd", ()=>reduceLineFromEnd
);
parcelHelpers.export(exports, "reduceLineEqually", ()=>reduceLineEqually
);
parcelHelpers.export(exports, "lineSlope", ()=>lineSlope
);
parcelHelpers.export(exports, "chaikinSmooth", ()=>chaikinSmooth
);
parcelHelpers.export(exports, "chaikinSmooth2", ()=>chaikinSmooth2
);
parcelHelpers.export(exports, "linesIntersect", ()=>linesIntersect
);
parcelHelpers.export(exports, "getLineIntersectPoint", ()=>getLineIntersectPoint
);
parcelHelpers.export(exports, "mengerCurvature", ()=>mengerCurvature
);
parcelHelpers.export(exports, "segment", ()=>segment
);
parcelHelpers.export(exports, "segmentOrientation", ()=>segmentOrientation
);
parcelHelpers.export(exports, "segmentFromPoint", ()=>segmentFromPoint
);
parcelHelpers.export(exports, "segmentsFromPoints", ()=>segmentsFromPoints
);
parcelHelpers.export(exports, "segArrayToPointsArray", ()=>segArrayToPointsArray
);
parcelHelpers.export(exports, "segmentsIntersect", ()=>segmentsIntersect
);
parcelHelpers.export(exports, "trimSegments", ()=>trimSegments
);
var _vector = require("./Vector");
var _points = require("./points");
const reduceLineFromStart = (p1, p2, r)=>{
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    return {
        x: p1.x + r * dx / mag,
        y: p1.y + r * dy / mag
    };
};
const reduceLineFromEnd = (p1, p2, r)=>{
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    return {
        x: p2.x - r * dx / mag,
        y: p2.y - r * dy / mag
    };
};
const reduceLineEqually = (p1, p2, r)=>{
    const r2 = r / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    return [
        {
            x: p1.x + r2 * dx / mag,
            y: p1.y + r2 * dy / mag
        },
        {
            x: p2.x - r2 * dx / mag,
            y: p2.y - r2 * dy / mag
        }, 
    ];
};
const lineSlope = (p1, p2)=>(p2.y - p1.y) / (p2.x - p1.x)
;
const chaikinSmooth = (input, itr = 1)=>{
    if (itr === 0) return input;
    const output = [];
    for(let i = 0; i < input.length - 1; i++){
        const p0 = input[i];
        const p1 = input[i + 1];
        const p0x = p0[0];
        const p0y = p0[1];
        const p1x = p1[0];
        const p1y = p1[1];
        const Q = [
            0.75 * p0x + 0.25 * p1x,
            0.75 * p0y + 0.25 * p1y
        ];
        const R = [
            0.25 * p0x + 0.75 * p1x,
            0.25 * p0y + 0.75 * p1y
        ];
        output.push(Q);
        output.push(R);
    }
    return itr === 1 ? output : chaikinSmooth(output, itr - 1);
};
const chaikinSmooth2 = (input, itr = 1, endOffs = 1)=>{
    if (itr === 0) return input;
    const output = [];
    for(let i = 0; i < input.length; i++){
        const p0 = input[i];
        let p1;
        if (i === input.length - 1) p1 = input[endOffs];
        else p1 = input[i + 1];
        const p0x = p0[0];
        const p0y = p0[1];
        const p1x = p1[0];
        const p1y = p1[1];
        const Q = [
            0.75 * p0x + 0.25 * p1x,
            0.75 * p0y + 0.25 * p1y
        ];
        const R = [
            0.25 * p0x + 0.75 * p1x,
            0.25 * p0y + 0.75 * p1y
        ];
        output.push(Q);
        output.push(R);
    }
    return itr === 1 ? output : chaikinSmooth(output, itr - 1, endOffs);
};
const linesIntersect = (a, b, c, d, p, q, r, s)=>{
    const det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) return false;
    const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1;
};
const getLineIntersectPoint = (x1, y1, x2, y2, x3, y3, x4, y4)=>{
    // Check if none of the lines are of length 0
    if (x1 === x2 && y1 === y2 || x3 === x4 && y3 === y4) return false;
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    // Lines are parallel
    if (denominator === 0) return false;
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;
    // Return a object with the x and y coordinates of the intersection
    const x = x1 + ua * (x2 - x1);
    const y = y1 + ua * (y2 - y1);
    return {
        x,
        y
    };
};
const mengerCurvature = (p1, p2, p3)=>{
    // https://stackoverflow.com/questions/41144224/calculate-curvature-for-3-points-x-y
    // possible alternate https://www.mathsisfun.com/geometry/herons-formula.html
    const triangleArea2 = (a, b, c)=>(b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
    ;
    const t4 = 2 * triangleArea2(p1, p2, p3);
    const la = _points.pointDistance(p1, p2);
    const lb = _points.pointDistance(p2, p3);
    const lc = _points.pointDistance(p3, p1);
    return t4 / (la * lb * lc);
};
const segment = (x1, y1, x2, y2)=>{
    const start = new _vector.Vector(x1, y1);
    const end = new _vector.Vector(x2, y2);
    const mp = _points.midpoint(start, end);
    const mid = new _vector.Vector(mp.x, mp.y);
    const orientation = _points.pointsOrientation(start, end);
    const length = _points.pointDistance(start, end);
    return {
        start,
        end,
        orientation,
        mid,
        length
    };
};
const segmentOrientation = ({ start , end  })=>_points.pointsOrientation(start, end)
;
const segmentFromPoint = (p1, p2)=>segment(p1.x, p1.y, p2.x, p2.y)
;
const segmentsFromPoints = (points)=>{
    const seg = [];
    for(let i = 0; i < points.length - 1; i++){
        const next = i + 1;
        seg.push(segment(points[i][0], points[i][1], points[next][0], points[next][1]));
    }
    return seg;
};
const segArrayToPointsArray = (segs)=>segs.reduce((acc, s)=>{
        const p = [
            [
                s.start.x,
                s.start.y
            ],
            [
                s.end.x,
                s.end.y
            ], 
        ];
        acc = acc.concat(p);
        return acc;
    }, [])
;
const segmentsIntersect = (a, b)=>linesIntersect(a.start.x, a.start.y, a.end.x, a.end.y, b.start.x, b.start.y, b.end.x, b.end.y)
;
const trimSegments = (segs, skip = 2)=>segs.reduce((acc, s, i)=>{
        if (i === 0 || i === segs.length - 1) acc.push(s);
        else if (i % skip === 0) acc.push(s);
        return acc;
    }, [])
; // export const connectSegments = (segs) =>
 //     segs.map((s, i) => {
 //         if (i === segs.length - 1) {
 //             return s;
 //         }
 //         const next = segs[i + 1];
 //
 //         const distance = pointDistance({ x: s.end.x, y: s.end.y }, { x: next.start.x, y: s.start.y });
 //         if (distance > 1) {
 //             s.end = new Vector(next.start.x, next.start.y);
 //         }
 //         return s;
 //     });
 // For array of points from segments, return the mid point of the segment
 // export const getSegPointsMid = (points) => {
 //     const p = [];
 //     for (let i = 0; i < points.length; i += 2) {
 //         const s = points[i];
 //         const e = points[i + 1];
 //         if (e) {
 //             const midX = s[0] + (e[0] - s[0]) * 0.5;
 //             const midY = s[1] + (e[1] - s[1]) * 0.5;
 //             p.push([midX, midY]);
 //         } else {
 //             p.push(s);
 //         }
 //     }
 //     // last end point
 //     p.push(last(points));
 //     return p;
 // };

},{"./Vector":"1MSqh","./points":"4RQVg","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"2elLt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "meanderingRiver01", ()=>meanderingRiver01
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../rndrgen/math/math");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _meanderingRiver = require("../rndrgen/systems/MeanderingRiver");
var _segments = require("../rndrgen/math/segments");
var _attractors = require("../rndrgen/math/attractors");
var _grids = require("../rndrgen/math/grids");
var _fields = require("../rndrgen/canvas/fields");
var _random = require("../rndrgen/math/random");
var _points = require("../rndrgen/math/points");
var _primatives = require("../rndrgen/canvas/primatives");
var _marchingSquares = require("../rndrgen/systems/marchingSquares");
/*
Meandering River class at ../rndrgen/MeanderingRiver
 */ const createHorizontalPath = ({ width , height  }, startX, startY, steps = 20)=>{
    const coords = [];
    const incr = Math.round(width / steps);
    const midx = width / 2;
    for(let i = startX; i < width; i += incr){
        // greater variation in the middle
        const midDist = Math.round(midx - Math.abs(i - midx));
        const y = _random.randomNormalWholeBetween(startY - midDist, startY + midDist);
        coords.push([
            i,
            y
        ]);
    }
    coords.push([
        width,
        startY
    ]);
    return coords;
};
const meanderingRiver01 = ()=>{
    const config = {
        name: 'meandering-river-01',
        ratio: _sketch.ratio.a3plus,
        scale: _sketch.scale.hidpi,
        orientation: _sketch.orientation.landscape
    };
    let ctx;
    let canvasMidX;
    let canvasMidY;
    const renderScale = config.scale; // 1 or 2
    const rivers = [];
    let time = 0;
    const backgroundColor = _palettes.warmWhite;
    const riverColor = _palettes.warmWhite.clone().brighten(20);
    const oxbowColor = riverColor.clone();
    const flatColor = backgroundColor.clone().darken(10);
    const isolowColor = flatColor.clone().darken(2);
    const isohighColor = backgroundColor.clone().brighten(10);
    const tintingColor = _tinycolor2Default.default('hsl(38, 38%, 64%)');
    const palette = [
        _tinycolor2Default.default('hsl(97, 9%, 73%)'),
        _tinycolor2Default.default('hsl(51, 7%, 38%)'),
        _tinycolor2Default.default('hsl(19, 39%, 47%)'),
        _tinycolor2Default.default('hsl(166, 39%, 59%)'),
        _tinycolor2Default.default.mix('hsl(97, 9%, 73%)', tintingColor, 25),
        _tinycolor2Default.default.mix('hsl(51, 7%, 38%)', tintingColor, 25),
        _tinycolor2Default.default.mix('hsl(19, 39%, 47%)', tintingColor, 25),
        _tinycolor2Default.default.mix('hsl(166, 39%, 59%)', tintingColor, 25),
        _tinycolor2Default.default.mix('hsl(97, 9%, 73%)', tintingColor, 55),
        _tinycolor2Default.default.mix('hsl(51, 7%, 38%)', tintingColor, 55),
        _tinycolor2Default.default.mix('hsl(19, 39%, 47%)', tintingColor, 55),
        _tinycolor2Default.default.mix('hsl(166, 39%, 59%)', tintingColor, 55),
        _tinycolor2Default.default.mix('hsl(97, 9%, 73%)', tintingColor, 75),
        _tinycolor2Default.default.mix('hsl(51, 7%, 38%)', tintingColor, 75),
        _tinycolor2Default.default.mix('hsl(19, 39%, 47%)', tintingColor, 75),
        _tinycolor2Default.default.mix('hsl(166, 39%, 59%)', tintingColor, 75), 
    ].reverse();
    let noiseScale = 0.001 / renderScale;
    const noise = (x, y)=>_attractors.simplexNoise2d(x, y, noiseScale)
    ;
    const maxHistory = 15;
    const historyStep = 15;
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        const horizpoints = _points.createSplineFromPointArray(createHorizontalPath(canvas, 0, canvasMidY, 15));
        const riverScale = 1.25;
        noiseScale /= riverScale * 2;
        const horizontal = new _meanderingRiver.MeanderingRiver(horizpoints, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 2,
            oxbowProx: 3 * renderScale,
            oxbowPointIndexProx: 4 * renderScale,
            mixTangentRatio: 0.7,
            mixMagnitude: 1.5 * riverScale,
            measureCurveAdjacent: 6 * renderScale * riverScale,
            curveSize: 4 * renderScale * riverScale,
            pointRemoveProx: 4 * renderScale * riverScale,
            pushFlowVectorFn: _meanderingRiver.flowRightToMiddle(0.6, canvasMidY),
            noiseFn: noise,
            noiseMode: 'flowInTo',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3
        });
        rivers.push(horizontal);
        // Run some steps before render to smooth lines
        for(let i = 0; i < 50; i++)rivers.forEach((r)=>{
            r.step();
        });
        _canvas.background(canvas, context)(backgroundColor);
        // renderFieldColor(canvas, context, noise, 100, flatColor, backgroundColor, 4);
        const slices = [
            {
                nmin: -7,
                nmax: 7,
                omin: -1,
                omax: 1,
                color: isohighColor
            },
            {
                nmin: -6,
                nmax: -4,
                omin: -1,
                omax: 1,
                color: isolowColor
            },
            {
                nmin: -4,
                nmax: -2,
                omin: -1,
                omax: 1,
                color: isolowColor
            },
            {
                nmin: -2,
                nmax: 0,
                omin: -1,
                omax: 1,
                color: isolowColor
            },
            {
                nmin: 0,
                nmax: 2,
                omin: -1,
                omax: 1,
                color: isohighColor
            },
            {
                nmin: 2,
                nmax: 4,
                omin: -1,
                omax: 1,
                color: isohighColor
            },
            {
                nmin: 4,
                nmax: 6,
                omin: -1,
                omax: 1,
                color: isohighColor
            }, 
        ];
        _marchingSquares.renderIsolines(context, canvas, noise, 50 * renderScale, 100 * renderScale, true, slices);
    };
    const outlineThickness = 3 * renderScale;
    const riverSmoothing = 4;
    const riverWeight = 20 * renderScale;
    const draw = ({ canvas , context  })=>{
        // step
        rivers.forEach((r)=>{
            for(let i = 0; i < renderScale; i++)r.step();
        });
        const outlineColor = palette[Math.round(time * 0.03) % palette.length]; // .clone().setAlpha(0.75);
        // outline
        rivers.forEach((r, i)=>{
            r.oxbows.forEach((o)=>{
                const w = Math.abs(_math.mapRange(0, o.startLength, 1, riverWeight, o.points.length));
                _primatives.pointPathPA(ctx)(o.points, outlineColor, w + outlineThickness / 2);
            });
            const points = _segments.chaikinSmooth(r.points, riverSmoothing);
            _primatives.pointPathPA(ctx)(points, outlineColor, riverWeight + outlineThickness);
        });
        // main
        rivers.forEach((r, i)=>{
            r.oxbows.forEach((o)=>{
                const w = Math.abs(_math.mapRange(0, o.startLength, riverWeight / 2, riverWeight, o.points.length));
                _primatives.pointPathPA(ctx)(o.points, oxbowColor, w);
            });
            const points = _segments.chaikinSmooth(r.points, riverSmoothing);
            _primatives.pointPathPA(ctx)(points, riverColor, riverWeight, false, false);
        });
        time++;
        return 1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/math/math":"4t0bw","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/systems/MeanderingRiver":"7Bn1Y","../rndrgen/math/segments":"5KdqE","../rndrgen/math/attractors":"BodqP","../rndrgen/math/grids":"2Wgq0","../rndrgen/canvas/fields":"1QEow","../rndrgen/math/random":"1SLuP","../rndrgen/math/points":"4RQVg","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/systems/marchingSquares":"5BOkN","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"5BOkN":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "isoline", ()=>isoline
);
parcelHelpers.export(exports, "renderIsolines", ()=>renderIsolines
);
// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://editor.p5js.org/codingtrain/sketches/18cjVoAX1
// http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
// https://en.wikipedia.org/wiki/Marching_squares#/media/File:Marching_squares_algorithm.svg
var _canvas = require("../canvas/canvas");
var _primatives = require("../canvas/primatives");
var _rectangle = require("../math/Rectangle");
var _math = require("../math/math");
const isoline = (context, rect, smooth = false)=>{
    const drawLine = (p1, p2)=>_primatives.line(context)(p1.x, p1.y, p2.x, p2.y)
    ;
    const sides = rect.getSides(smooth);
    switch(rect.cornerState){
        case 1:
        case 14:
            drawLine(sides.left, sides.bottom);
            break;
        case 2:
        case 13:
            drawLine(sides.bottom, sides.right);
            break;
        case 3:
        case 12:
            drawLine(sides.left, sides.right);
            break;
        case 4:
            drawLine(sides.top, sides.right);
            break;
        case 5:
            drawLine(sides.left, sides.top);
            drawLine(sides.bottom, sides.right);
            break;
        case 6:
        case 9:
            drawLine(sides.top, sides.bottom);
            break;
        case 7:
        case 8:
            drawLine(sides.left, sides.top);
            break;
        case 10:
            drawLine(sides.left, sides.bottom);
            drawLine(sides.top, sides.right);
            break;
        case 11:
            drawLine(sides.top, sides.right);
            break;
        case 0:
        case 15:
        default:
            break;
    }
};
const renderIsolines = (context, { width , height  }, noiseFn2d, margin = 0, resolution = 50, smoothing = true, slices)=>{
    const squares = _rectangle.createRectGrid(margin, margin, width - margin * 2, height - margin * 2, resolution, resolution);
    slices = slices || [
        {
            nmin: -7,
            nmax: 7,
            omin: -1,
            omax: 1
        }
    ];
    squares.forEach((s)=>{
        slices.forEach((slice)=>{
            s.corners = [
                s.cornerAPx,
                s.cornerBPx,
                s.cornerCPx,
                s.cornerDPx
            ].map((c)=>{
                const noise = noiseFn2d(c.x, c.y);
                return _math.mapRange(slice.nmin, slice.nmax, slice.omin, slice.omax, noise);
            });
            if (slice.color) _canvas.strokeColor(context)(slice.color);
            isoline(context, s, smoothing);
        });
    });
};

},{"../canvas/canvas":"73Br1","../canvas/primatives":"6MM7x","../math/Rectangle":"1Uf2J","../math/math":"4t0bw","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"1Uf2J":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/*
Corners and lerps are for marching squares

Corners
  a---b
  |   |
  d---c
 */ parcelHelpers.export(exports, "Rectangle", ()=>Rectangle
);
parcelHelpers.export(exports, "Square", ()=>Square
);
parcelHelpers.export(exports, "createRectGrid", ()=>createRectGrid
);
var _math = require("./math");
var _points = require("./points");
var _random = require("./random");
// a...d are 0 or 1
const getStateFromCorners = (a, b, c, d)=>a * 8 + b * 4 + c * 2 + d * 1
;
// a and b are -1 to 1
const lerpAmt = (a, b)=>(1 - (a + 1)) / (b + 1 - (a + 1))
;
class Rectangle {
    constructor(x, y, width, height, corners){
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.x2 = x + width;
        this.y2 = y + height;
        this.mx = _points.midPoint(this.x, this.x2);
        this.my = _points.midPoint(this.y, this.y2);
        // -1 to 1 noise values
        this.corners = corners || [
            0,
            0,
            0,
            0
        ];
        // array of subdivisions, [rect]
        this.children = [];
        // 1 or -1
        this.phase = 1;
        this.depth = 0;
    }
    // 0 to 15
    get cornerState() {
        return getStateFromCorners(Math.ceil(this.corners[0]), Math.ceil(this.corners[1]), Math.ceil(this.corners[2]), Math.ceil(this.corners[3]));
    }
    get cornerAverage() {
        return this.average = (this.corners[0] + this.corners[2] + this.corners[2] + this.corners[3]) / 4;
    }
    get center() {
        return _points.point(this.mx, this.my);
    }
    get midTop() {
        return _points.point(this.mx, this.y);
    }
    get midRight() {
        return _points.point(this.x2, this.my);
    }
    get midBottom() {
        return _points.point(this.mx, this.y2);
    }
    get midLeft() {
        return _points.point(this.x, this.my);
    }
    get lerpTop() {
        return _points.point(_math.lerp(this.x, this.x2, lerpAmt(this.corners[0], this.corners[1])), this.y);
    }
    get lerpRight() {
        return _points.point(this.x2, _math.lerp(this.y, this.y2, lerpAmt(this.corners[1], this.corners[2])));
    }
    get lerpBottom() {
        return _points.point(_math.lerp(this.x, this.x2, lerpAmt(this.corners[3], this.corners[2])), this.y2);
    }
    get lerpLeft() {
        return _points.point(this.x, _math.lerp(this.y, this.y2, lerpAmt(this.corners[0], this.corners[3])));
    }
    get cornerAPx() {
        return _points.point(this.x, this.y);
    }
    get cornerBPx() {
        return _points.point(this.x2, this.y);
    }
    get cornerCPx() {
        return _points.point(this.x2, this.y2);
    }
    get cornerDPx() {
        return _points.point(this.x, this.y2);
    }
    getSides(smooth) {
        return {
            top: smooth ? this.lerpTop : this.midTop,
            right: smooth ? this.lerpRight : this.midRight,
            bottom: smooth ? this.lerpBottom : this.midBottom,
            left: smooth ? this.lerpLeft : this.midLeft
        };
    }
    randomPointInside() {
        const x1 = _random.randomNormalWholeBetween(0, this.w) + this.x;
        const y1 = _random.randomNormalWholeBetween(0, this.h) + this.y;
        return _points.point(x1, y1);
    }
    contains(p) {
        // return p.x >= this.x - this.w && p.x < this.x + this.w && p.y >= this.y - this.h && p.y < this.y + this.h;
        return p.x >= this.x && p.x < this.x + this.w && p.y >= this.y && p.y < this.y + this.h;
    }
    intersects(rect) {
        return !(rect.x - rect.w > this.x + this.w || rect.x + rect.w < this.x - this.w || rect.y - rect.h > this.y + this.h || rect.y + rect.h < this.y - this.h);
    }
    subdivide() {
        const halfW = this.w / 2;
        const halfH = this.h / 2;
        this.children.push(new Rectangle(this.x, this.y, halfW, halfH));
        this.children.push(new Rectangle(this.x + halfW, this.y, halfW, halfH));
        this.children.push(new Rectangle(this.x, this.y + halfH, halfW, halfH));
        this.children.push(new Rectangle(this.x + halfW, this.y + halfH, halfW, halfH));
        this.children.forEach((c)=>{
            c.phase *= -1;
            c.parent = this;
            c.depth = this.depth + 1;
        });
    }
}
class Square extends Rectangle {
    constructor(x1, y1, size, corners1 = [
        0,
        0,
        0,
        0
    ]){
        super(x1, y1, size, size, corners1);
        this.size = size;
    }
}
const createRectGrid = (x2, y2, w, h, cols = 2, rows = 2, colgap = 0, rowgap = 0)=>{
    const rects = [];
    const colw = Math.round((w - (cols - 1) * colgap) / cols);
    const rowh = Math.round((h - (rows - 1) * rowgap) / rows);
    for(let i = 0; i < cols; i++)for(let j = 0; j < rows; j++){
        const rx = i * (colw + colgap) + x2;
        const ry = j * (rowh + rowgap) + y2;
        rects.push(new Rectangle(rx, ry, colw, rowh));
    }
    return rects;
};

},{"./math":"4t0bw","./random":"1SLuP","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","./points":"4RQVg"}],"3y6eB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "truchetTiles", ()=>truchetTiles
);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _truchetTiles = require("../rndrgen/systems/truchetTiles");
var _rectangle = require("../rndrgen/math/Rectangle");
var _random = require("../rndrgen/math/random");
var _points = require("../rndrgen/math/points");
var _quadTree = require("../rndrgen/math/QuadTree");
var _bitmap = require("../rndrgen/canvas/Bitmap");
var _hi1Png = require("../../media/images/hi1.png");
var _hi1PngDefault = parcelHelpers.interopDefault(_hi1Png);
const truchetTiles = ()=>{
    const config = {
        name: 'multiscale-truchet-tiles',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.hidpi
    };
    let canvasWidth;
    let canvasHeight;
    let margin = 100;
    let quadtree;
    const colors = _palettes.get2Tone(5, 15);
    const image = new _bitmap.Bitmap(_hi1PngDefault.default);
    const setup = ({ canvas , context  })=>{
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        image.init(canvas, context);
        margin = canvasWidth / 10;
        const boundary = new _rectangle.Rectangle(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2);
        // const points = [...Array(1000)].map((_) => point(randomN(canvasWidth), randomN(canvasHeight)));
        // quadtree = quadTreeFromPoints(boundary, 4, points);
        const points = image.thresholdAsPoints(150, 128);
        quadtree = _quadTree.quadTreeFromPoints(boundary, 1, points);
    // background(canvas, context)('white');
    };
    const draw = ({ canvas , context  })=>{
        _canvas.background(canvas, context)(colors.light);
        const max = _random.randomWholeBetween(0, 15);
        _quadTree.flatDepthSortedAsc(quadtree).forEach((q)=>{
            // assign a random pattern
            q.boundary.motif = _random.randomWholeBetween(0, max); // randomWholeBetween(0, 15);
            // draw it
            _truchetTiles.truchet(context, q.boundary, colors.dark, colors.light);
        });
        return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/sketch":"2OcGA","../rndrgen/color/palettes":"3qayM","../rndrgen/systems/truchetTiles":"6w7Yv","../rndrgen/math/Rectangle":"1Uf2J","../rndrgen/math/random":"1SLuP","../rndrgen/math/points":"4RQVg","../rndrgen/math/QuadTree":"652jH","../rndrgen/canvas/Bitmap":"17J8Q","../../media/images/hi1.png":"2Mkol","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"6w7Yv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "motifList", ()=>motifList
);
parcelHelpers.export(exports, "truchet", ()=>truchet
);
parcelHelpers.export(exports, "motifListInterlaced", ()=>motifListInterlaced
);
parcelHelpers.export(exports, "truchetInterlaced", ()=>truchetInterlaced
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _primatives = require("../canvas/primatives");
var _canvas = require("../canvas/canvas");
const motifList = [
    '\\',
    '/',
    '-',
    '|',
    '+',
    '+.',
    'x.',
    'fnw',
    'fne',
    'fsw',
    'fse',
    'tn',
    'ts',
    'te',
    'tw'
];
const truchet = (context, rectangle, fore = 'black', back = 'white')=>{
    const half = rectangle.w / 2;
    const third = rectangle.w / 3;
    const twoThirds = third * 2;
    const sixth = rectangle.w / 6;
    let foreColor = fore;
    let backColor = back;
    if (rectangle.phase < 0) {
        foreColor = back;
        backColor = fore;
    }
    context.beginPath();
    _canvas.setContext(context)({
        strokeStyle: _tinycolor2Default.default(foreColor).toRgbString(),
        fillStyle: _tinycolor2Default.default(foreColor).toRgbString(),
        lineCap: 'butt',
        lineWidth: third,
        lineJoin: 'round'
    });
    _primatives.rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, backColor);
    const motif = motifList[rectangle.motif];
    switch(motif){
        case '\\':
            _primatives.arcQuarter(context)(rectangle.x2, rectangle.y, half, Math.PI / 2);
            _primatives.arcQuarter(context)(rectangle.x, rectangle.y2, half, Math.PI * 1.5);
            break;
        case '/':
            _primatives.arcQuarter(context)(rectangle.x, rectangle.y, half, 0);
            _primatives.arcQuarter(context)(rectangle.x2, rectangle.y2, half, Math.PI);
            break;
        case '-':
            _primatives.line(context)(rectangle.x, rectangle.my, rectangle.x2, rectangle.my);
            break;
        case '|':
            _primatives.line(context)(rectangle.mx, rectangle.y, rectangle.mx, rectangle.y2);
            break;
        case '+':
            _primatives.line(context)(rectangle.x, rectangle.my, rectangle.x2, rectangle.my);
            _primatives.line(context)(rectangle.mx, rectangle.y, rectangle.mx, rectangle.y2);
            break;
        case '+.':
            break;
        case 'x.':
            _primatives.rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, foreColor);
            break;
        case 'fnw':
            _primatives.arcQuarter(context)(rectangle.x, rectangle.y, half, 0);
            break;
        case 'fne':
            _primatives.arcQuarter(context)(rectangle.x2, rectangle.y, half, Math.PI / 2);
            break;
        case 'fsw':
            _primatives.arcQuarter(context)(rectangle.x, rectangle.y2, half, Math.PI * 1.5);
            break;
        case 'fse':
            _primatives.arcQuarter(context)(rectangle.x2, rectangle.y2, half, Math.PI);
            break;
        case 'tn':
            _primatives.rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, twoThirds, foreColor);
            break;
        case 'ts':
            _primatives.rectFilled(context)(rectangle.x, rectangle.y + third, rectangle.w, twoThirds, foreColor);
            break;
        case 'te':
            _primatives.rectFilled(context)(rectangle.x + third, rectangle.y, twoThirds, rectangle.w, foreColor);
            break;
        case 'tw':
            _primatives.rectFilled(context)(rectangle.x, rectangle.y, twoThirds, rectangle.w, foreColor);
            break;
        case 15:
        default:
            // "x."
            _primatives.rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, foreColor);
            break;
    }
    _primatives.circleFilled(context)(rectangle.x, rectangle.y, third, backColor);
    _primatives.circleFilled(context)(rectangle.x2, rectangle.y, third, backColor);
    _primatives.circleFilled(context)(rectangle.x2, rectangle.y2, third, backColor);
    _primatives.circleFilled(context)(rectangle.x, rectangle.y2, third, backColor);
    _primatives.circleFilled(context)(rectangle.mx, rectangle.y, sixth, foreColor);
    _primatives.circleFilled(context)(rectangle.x2, rectangle.my, sixth, foreColor);
    _primatives.circleFilled(context)(rectangle.mx, rectangle.y2, sixth, foreColor);
    _primatives.circleFilled(context)(rectangle.x, rectangle.my, sixth, foreColor);
    // rect(context)(rectangle.x + 1, rectangle.y + 1, rectangle.w - 2, rectangle.h - 2, 1, 'green');
    context.closePath();
};
const endLineMult = 1.25;
const sqTileLinesHorizontal = (context)=>(x, y, w, h, lineWidth, num = 5, margin = 0, foreColor = 'black', backColor = 'white')=>{
        context.save();
        const region = new Path2D();
        region.rect(x, y, w, h);
        context.clip(region);
        y += margin;
        h -= margin * 2;
        const x2 = x + w;
        const gap = h / num;
        context.strokeStyle = _tinycolor2Default.default(foreColor).toRgbString();
        _primatives.rectFilled(context)(x, y, w, h, backColor);
        for(let i = 0; i < num + 1; i++){
            let iy = y + i * gap;
            if (i === 0 || i === num) {
                context.lineWidth = lineWidth * endLineMult;
                if (i === 0) iy += lineWidth * endLineMult;
                else iy -= lineWidth * endLineMult;
            } else context.lineWidth = lineWidth;
            _primatives.line(context)(x, iy, x2, iy);
        }
        context.restore();
    }
;
const sqTileLinesVertical = (context)=>(x, y, w, h, lineWidth, num = 5, margin = 0, foreColor = 'black', backColor = 'white')=>{
        if (margin) sqTileLinesHorizontal(x, y, w, h, lineWidth, num, margin, foreColor, backColor);
        context.save();
        const region = new Path2D();
        region.rect(x, y, w, h);
        context.clip(region);
        x += margin;
        w -= margin * 2;
        const y2 = y + h;
        const gap = w / num;
        context.strokeStyle = _tinycolor2Default.default(foreColor).toRgbString();
        _primatives.rectFilled(context)(x, y, w, h, backColor);
        for(let i = 0; i < num + 1; i++){
            let ix = x + i * gap;
            if (i === 0 || i === num) {
                context.lineWidth = lineWidth * endLineMult;
                if (i === 0) ix += lineWidth * endLineMult;
                else ix -= lineWidth * endLineMult;
            } else context.lineWidth = lineWidth;
            _primatives.line(context)(ix, y, ix, y2);
        }
        context.restore();
    }
;
const rings = (context)=>(x, y, r, lineWidth, num = 5, margin = 0, foreColor = 'black', backColor = 'white')=>{
        r -= margin * 2;
        const gap = r / num;
        context.strokeStyle = _tinycolor2Default.default(foreColor).toRgbString();
        if (backColor) _primatives.circleFilled(context)(x, y, r + margin, backColor);
        for(let i = 0; i < num + 1; i++){
            let ir = i * gap + margin;
            if (i === 0 || i === num) {
                context.lineWidth = lineWidth * endLineMult;
                if (i === 0) ir += lineWidth * endLineMult;
                else ir -= lineWidth * endLineMult;
            } else context.lineWidth = lineWidth;
            _primatives.circle(context)(x, y, ir, foreColor);
        }
    }
;
const sqTileCornerArc = (context)=>(x, y, r, lineWidth, c = 0, num = 5, margin = 0, foreColor = 'black', backColor = 'white')=>{
        context.save();
        const region = new Path2D();
        region.rect(x, y, r, r);
        context.clip(region);
        context.strokeStyle = _tinycolor2Default.default(foreColor).toRgbString();
        _primatives.rectFilled(context)(x, y, r, r, backColor);
        const x2 = x + r;
        const y2 = y + r;
        if (c === 0) {
            // top left
            rings(context)(x2, y2, r, lineWidth, num, margin, foreColor, null);
            rings(context)(x, y, r, lineWidth, num, margin, foreColor, backColor);
        } else if (c === 1) {
            // top right
            rings(context)(x, y2, r, lineWidth, num, margin, foreColor, null);
            rings(context)(x2, y, r, lineWidth, num, margin, foreColor, backColor);
        } else if (c === 2) {
            // bottom left
            rings(context)(x, y2, r, lineWidth, num, margin, foreColor, null);
            rings(context)(x2, y, r, lineWidth, num, margin, foreColor, backColor);
        } else {
            // bottom right
            rings(context)(x, y, r, lineWidth, num, margin, foreColor, null);
            rings(context)(x2, y2, r, lineWidth, num, margin, foreColor, backColor);
        }
        context.restore();
    }
;
const motifListInterlaced = [
    '-',
    '|',
    'fnw',
    'fne',
    'fsw',
    'fse'
];
const truchetInterlaced = (context, rectangle, lines = 3, lineWidth = 1, margin = 0, fore = 'black', back = 'white')=>{
    let foreColor = fore;
    let backColor = back;
    if (rectangle.phase < 0) {
        foreColor = back;
        backColor = fore;
    }
    context.beginPath();
    _canvas.setContext(context)({
        strokeStyle: _tinycolor2Default.default(foreColor).toRgbString(),
        fillStyle: _tinycolor2Default.default(foreColor).toRgbString(),
        lineCap: 'butt',
        lineWidth,
        lineJoin: 'bevel'
    });
    _primatives.rectFilled(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, backColor);
    const motif = motifListInterlaced[rectangle.motif];
    switch(motif){
        case '-':
            sqTileLinesVertical(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, lineWidth, lines, margin, foreColor, back);
            sqTileLinesHorizontal(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, lineWidth, lines, margin, foreColor, back);
            break;
        case '|':
            sqTileLinesHorizontal(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, lineWidth, lines, margin, foreColor, back);
            sqTileLinesVertical(context)(rectangle.x, rectangle.y, rectangle.w, rectangle.w, lineWidth, lines, margin, foreColor, back);
            break;
        case 'fnw':
            sqTileCornerArc(context)(rectangle.x, rectangle.y, rectangle.w, lineWidth, 0, lines, margin, foreColor, back);
            break;
        case 'fne':
            sqTileCornerArc(context)(rectangle.x, rectangle.y, rectangle.w, lineWidth, 1, lines, margin, foreColor, back);
            break;
        case 'fsw':
            sqTileCornerArc(context)(rectangle.x, rectangle.y, rectangle.w, lineWidth, 2, lines, margin, foreColor, back);
            break;
        case 'fse':
            sqTileCornerArc(context)(rectangle.x, rectangle.y, rectangle.w, lineWidth, 3, lines, margin, foreColor, back);
            break;
        default:
            break;
    }
    context.closePath();
};

},{"tinycolor2":"101FG","../canvas/primatives":"6MM7x","../canvas/canvas":"73Br1","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"652jH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/*
TODO
- [ ] Max depth
- [ ] margin between subdivisions


Corners
nw---ne
|     |
sw---se

Rect, corners
  a---b
  |   |
  d---c
*/ parcelHelpers.export(exports, "QuadTree", ()=>QuadTree
);
parcelHelpers.export(exports, "flatDepthSortedAsc", ()=>flatDepthSortedAsc
);
parcelHelpers.export(exports, "quadTreeFromPoints", ()=>quadTreeFromPoints
);
parcelHelpers.export(exports, "show", ()=>show
);
/*
Originally from Coding Train https://www.youtube.com/watch?v=OJxEcs0w_kE&t=0s parts 1 and 2
Community version - https://github.com/CodingTrain/QuadTree/blob/main/quadtree.js
https://georgefrancis.dev/writing/generative-grid-layouts-with-quadtrees/
 */ var _rectangle = require("./Rectangle");
var _primatives = require("../canvas/primatives");
var _random = require("./random");
var _truchetTiles = require("../systems/truchetTiles");
class QuadTree {
    constructor(boundary, capacity = 4, margin = 0, maxd = 0){
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
        this.maxDepth = maxd;
        this.margin = margin;
        // 1 or -1
        this.phase = 1;
        this.depth = 0;
        this.northwest = undefined;
        this.northeast = undefined;
        this.southwest = undefined;
        this.southeast = undefined;
    }
    get subdivisions() {
        return this.divided ? [
            this.northwest,
            this.northeast,
            this.southeast,
            this.southwest
        ] : [];
    }
    subdivide() {
        const { x , y , w , h  } = this.boundary;
        const halfW = w / 2 + this.margin;
        const halfH = h / 2 + this.margin;
        const divWidth = w / 2 - this.margin;
        const divHeight = h / 2 - this.margin;
        const nw = new _rectangle.Rectangle(x, y, divWidth, divHeight);
        const ne = new _rectangle.Rectangle(x + halfW, y, divWidth, divHeight);
        const sw = new _rectangle.Rectangle(x, y + halfH, divWidth, divHeight);
        const se = new _rectangle.Rectangle(x + halfW, y + halfH, divWidth, divHeight);
        this.northwest = new QuadTree(nw, this.capacity, this.margin, this.maxDepth);
        this.northeast = new QuadTree(ne, this.capacity, this.margin, this.maxDepth);
        this.southwest = new QuadTree(sw, this.capacity, this.margin, this.maxDepth);
        this.southeast = new QuadTree(se, this.capacity, this.margin, this.maxDepth);
        this.divided = true;
        this.subdivisions.forEach((s)=>{
            s.phase = this.phase * -1;
            s.depth = this.depth + 1;
        });
    }
    insert(p) {
        if (!this.boundary.contains(p)) return false;
        if (this.points.length < this.capacity) {
            this.points.push(p);
            return true;
        }
        // if (this.maxDepth && this.depth === this.maxDepth) return;
        if (!this.divided) this.subdivide();
        return this.northwest.insert(p) || this.northeast.insert(p) || this.southwest.insert(p) || this.southeast.insert(p);
    }
    query(rectangle, arry = []) {
        if (!this.boundary.intersects(rectangle)) return;
        this.points.forEach((p)=>{
            if (rectangle.contains(p)) arry.push(p);
        });
        if (this.divided) this.subdivisions.forEach((s)=>{
            s.query(rectangle, arry);
        });
        return arry;
    }
    flatten(arry = []) {
        if (this.divided) this.subdivisions.forEach((s)=>{
            s.flatten(arry);
        });
        else arry.push(this);
        return arry;
    }
}
const flatDepthSortedAsc = (qt)=>qt.flatten().sort((a, b)=>a.depth - b.depth
    )
;
const quadTreeFromPoints = (boundary1, capacity1, points, margin1 = 0, maxd1 = 0)=>{
    const quadtree = new QuadTree(boundary1, capacity1, margin1, maxd1);
    points.forEach((p)=>quadtree.insert(p)
    );
    return quadtree;
};
const show = (context)=>(qt, showParents = false, pointColor = 'blue', p1color = 'red', p2color = 'red')=>{
        qt.points.forEach((p)=>{
            _primatives.pixel(context)(p.x, p.y, pointColor, 'circle', 1);
        });
        const { x , y , w , h  } = qt.boundary;
        if (qt.divided) {
            if (showParents) {
                if (qt.phase === -1) _primatives.rect(context)(x, y, w, h, 1, p1color);
                else _primatives.rect(context)(x, y, w, h, 1, p2color);
            }
            qt.subdivisions.forEach((s)=>{
                show(context)(s, showParents, pointColor, p1color, p2color);
            });
        } else if (qt.phase === -1) _primatives.rect(context)(x, y, w, h, 1, p1color);
        else _primatives.rect(context)(x, y, w, h, 1, p2color);
    }
;

},{"./Rectangle":"1Uf2J","../canvas/primatives":"6MM7x","./random":"1SLuP","../systems/truchetTiles":"6w7Yv","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"ysufc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "truchetTiles02", ()=>truchetTiles02
);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _truchetTiles = require("../rndrgen/systems/truchetTiles");
var _rectangle = require("../rndrgen/math/Rectangle");
var _random = require("../rndrgen/math/random");
var _points = require("../rndrgen/math/points");
var _quadTree = require("../rndrgen/math/QuadTree");
var _primatives = require("../rndrgen/canvas/primatives");
const truchetTiles02 = ()=>{
    const config = {
        name: 'interlaced-truchet-tiles',
        ..._sketch.instagram
    };
    let canvasWidth;
    let canvasHeight;
    let margin = 100;
    let rectangles;
    const colors = _palettes.get2Tone(5, 15);
    const tiles = _random.randomWholeBetween(5, 30) * 2;
    const lines = _random.randomWholeBetween(2, 8);
    const gap = _random.randomWholeBetween(0, 8);
    const setup = ({ canvas , context  })=>{
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        margin = Math.round(canvasWidth / 18);
        // 35x21 for a3plus
        rectangles = _rectangle.createRectGrid(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2, tiles, tiles);
    };
    let motif = 0;
    const nextMotif = (_)=>{
        const n = motif++;
        if (motif === 6) motif = 0;
        return n;
    };
    const draw = ({ canvas , context  })=>{
        _canvas.background(canvas, context)(colors.light);
        rectangles.forEach((r)=>{
            r.motif = _random.randomWholeBetween(0, 6);
            _truchetTiles.truchetInterlaced(context, r, lines, 0.5, gap, colors.dark, colors.light);
        });
        return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/sketch":"2OcGA","../rndrgen/color/palettes":"3qayM","../rndrgen/systems/truchetTiles":"6w7Yv","../rndrgen/math/Rectangle":"1Uf2J","../rndrgen/math/random":"1SLuP","../rndrgen/math/points":"4RQVg","../rndrgen/math/QuadTree":"652jH","../rndrgen/canvas/primatives":"6MM7x","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"5ZhYB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "meanderingRiver03", ()=>meanderingRiver03
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _math = require("../rndrgen/math/math");
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _meanderingRiver = require("../rndrgen/systems/MeanderingRiver");
var _segments = require("../rndrgen/math/segments");
var _attractors = require("../rndrgen/math/attractors");
var _random = require("../rndrgen/math/random");
var _points = require("../rndrgen/math/points");
var _primatives = require("../rndrgen/canvas/primatives");
var _marchingSquares = require("../rndrgen/systems/marchingSquares");
/*
Meandering River class at ../rndrgen/MeanderingRiver
 */ const createHorizontalPath = ({ width , height  }, startX, startY, steps = 20)=>{
    const coords = [];
    const incr = Math.round(width / steps);
    const midx = width / 2;
    for(let i = startX; i < width; i += incr){
        // greater variation in the middle
        const midDist = Math.round(midx - Math.abs(i - midx));
        const y = _random.randomNormalWholeBetween(startY - midDist, startY + midDist);
        coords.push([
            i,
            y
        ]);
    }
    coords.push([
        width,
        startY
    ]);
    return coords;
};
const meanderingRiver03 = ()=>{
    const config = {
        name: 'meandering-river-03',
        ..._sketch.instagram
    };
    let ctx;
    let canvasMidX;
    let canvasMidY;
    const renderScale = config.scale; // 1 or 2
    const renderSteps = renderScale * 4;
    const outlineThickness = 3 * renderScale;
    const riverSmoothing = 0;
    const riverWeight = 10 * renderScale;
    const rivers = [];
    let time = 0;
    const backgroundColor = _palettes.warmPink;
    const riverColor = _palettes.warmPink.clone().brighten(10);
    const oxbowColor = riverColor;
    const outlineColor = _palettes.bicPenBlue.clone().setAlpha(0.3);
    const riverScale = 2;
    let noiseScale = 0.006 / renderScale;
    const noise = (x, y)=>_attractors.simplexNoise3d(x, y, time, noiseScale)
    ;
    // const noise = (x, y) => simplexNoise2d(x, y, noiseScale);
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        const horizpoints = _points.createSplineFromPointArray(createHorizontalPath(canvas, 0, canvasMidY, 15));
        noiseScale /= riverScale * 2;
        const horizontal = new _meanderingRiver.MeanderingRiver(horizpoints, {
            maxHistory: 15,
            storeHistoryEvery: 15,
            fixedEndPoints: 2,
            oxbowProx: 3 * renderScale,
            oxbowPointIndexProx: 3 * renderScale,
            mixTangentRatio: 0.55,
            mixMagnitude: 1 * riverScale,
            measureCurveAdjacent: 4 * renderScale * riverScale,
            curveSize: 2 * renderScale * riverScale,
            pointRemoveProx: 3 * renderScale * riverScale
        });
        rivers.push(horizontal);
        // Run some steps before render to smooth lines
        for(let i = 0; i < 50; i++)rivers.forEach((r)=>{
            r.step();
        });
        _canvas.background(canvas, context)(backgroundColor);
    };
    const draw = ({ canvas , context  })=>{
        // step
        rivers.forEach((r)=>{
            for(let i = 0; i < renderSteps; i++)r.step();
        });
        // outline
        rivers.forEach((r, i)=>{
            r.oxbows.forEach((o)=>{
                const w = Math.abs(_math.mapRange(0, o.startLength, 1, riverWeight, o.points.length));
                _primatives.pointPathPA(ctx)(o.points, outlineColor, w + outlineThickness / 2);
            });
            const points = _segments.chaikinSmooth(r.points, riverSmoothing);
            _primatives.pointPathPA(ctx)(points, outlineColor, riverWeight + outlineThickness);
        });
        // main
        rivers.forEach((r, i)=>{
            r.oxbows.forEach((o)=>{
                const w = Math.abs(_math.mapRange(0, o.startLength, riverWeight / 2, riverWeight, o.points.length));
                _primatives.pointPathPA(ctx)(o.points, oxbowColor, w);
            });
            const points = _segments.chaikinSmooth(r.points, riverSmoothing);
            _primatives.pointPathPA(ctx)(points, riverColor, riverWeight, false, false);
        });
        time += 0.1;
        return 1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"tinycolor2":"101FG","../rndrgen/math/math":"4t0bw","../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","../rndrgen/systems/MeanderingRiver":"7Bn1Y","../rndrgen/math/segments":"5KdqE","../rndrgen/math/attractors":"BodqP","../rndrgen/math/random":"1SLuP","../rndrgen/math/points":"4RQVg","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/systems/marchingSquares":"5BOkN","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/sketch":"2OcGA"}],"7oc4r":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "version", ()=>version
);
parcelHelpers.export(exports, "utils", ()=>_utils
);
parcelHelpers.export(exports, "sketch", ()=>_sketch.sketch
);
parcelHelpers.export(exports, "animation", ()=>animation
);
parcelHelpers.export(exports, "canvas", ()=>canvas
);
parcelHelpers.export(exports, "color", ()=>color
);
var _sketch = require("./sketch");
var _timeline = require("./animation/Timeline");
var _bitmap = require("./canvas/Bitmap");
var _canvas = require("./canvas/canvas");
var _primatives = require("./canvas/primatives");
var _textures = require("./canvas/textures");
var _text = require("./canvas/text");
var _palettes = require("./color/palettes");
var _utils = require("./utils");
const version = '0.1.0';
const animation = {
    Timeline: _timeline.Timeline
};
const canvas = {
    Bitmap: _bitmap.Bitmap,
    cntx: _canvas,
    primatives: _primatives,
    texture: _textures,
    text: _text
};
const color = {
    palette: _palettes
};

},{"./sketch":"2OcGA","./animation/Timeline":"6ohNr","./canvas/Bitmap":"17J8Q","./canvas/canvas":"73Br1","./canvas/primatives":"6MM7x","./canvas/textures":"73mfQ","./canvas/text":"3weRL","./color/palettes":"3qayM","./utils":"1kIwI","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"6ohNr":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/*
Canvas animation timeline based on Canvas Sketch time keeping methods
https://github.com/mattdesl/canvas-sketch/blob/master/docs/animated-sketches.md

Usage:

const timeline = new Timeline(config.fps, 0, 5);
const t = toSinValue(timeline.playhead) * 0.1;
// -1 if loops exceeded
draw -> return timeline.onFrame();

 */ parcelHelpers.export(exports, "Timeline", ()=>Timeline
);
class Timeline {
    constructor(fps, loop, duration){
        this.fps = fps || 30;
        this.loop = loop || 0; // total loops
        this.duration = duration || 1; // duration of each loop in seconds
        this.totalLoopFrames = this.duration ? this.duration * this.fps : 1;
        this.iterations = 0; // number of times drawn
        this.time = 0; // elapsed time in seconds
        this.playhead = 0; // current progress of the loop between 0 and 1
        this.frame = 1; // frame of the loop
        this.elapsedLoops = 0;
        this.startTime = Date.now();
    }
    get elapsed() {
        return Date.now() - this.startTime;
    }
    onFrame() {
        this.iterations++;
        // one frame
        this.frame++;
        this.playhead = this.frame / this.totalLoopFrames;
        if (this.iterations % this.fps === 0) {
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"RkIkf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "brushShape", ()=>brushShape
);
var _tinycolor2 = require("tinycolor2");
var _tinycolor2Default = parcelHelpers.interopDefault(_tinycolor2);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _grids = require("../rndrgen/math/grids");
var _primatives = require("../rndrgen/canvas/primatives");
var _segments = require("../rndrgen/math/segments");
var _points = require("../rndrgen/math/points");
var _math = require("../rndrgen/math/math");
var _random = require("../rndrgen/math/random");
var _kristijanArsovWoman400Png = require("../../media/images/kristijan-arsov-woman-400.png");
var _kristijanArsovWoman400PngDefault = parcelHelpers.interopDefault(_kristijanArsovWoman400Png);
var _bitmap = require("../rndrgen/canvas/Bitmap");
var _rectangle = require("../rndrgen/math/Rectangle");
// Tyler Hobbs how to hack a painting
// https://youtu.be/5R9eywArFTE?t=789
const roughenPoly = (segPoly, detail = 3, maxV = 0.5, spread = 1)=>{
    const roughSegment = (seg)=>{
        const rMix = _random.randomNormalNumberBetween(0.1, 1.9) + 0.1;
        const rMag = _random.randomNormalNumberBetween(0, seg.length * seg.variance) * spread;
        // Technique from meander
        const tangent = seg.start.sub(seg.end);
        const biangle = tangent.angle() + 1.5708; // + 90 deg
        const bitangent = _math.uvFromAngle(biangle).setMag(1);
        const a = tangent.normalize();
        const b = bitangent.normalize();
        const mVector = a.mix(b, rMix).setMag(rMag);
        const newMid = seg.mid.add(mVector);
        const sa = _segments.segmentFromPoint(seg.start, newMid);
        const sb = _segments.segmentFromPoint(newMid, seg.end);
        sa.variance = seg.variance * 1.1;
        sb.variance = seg.variance * 1.1;
        return [
            sa,
            sb
        ];
    };
    const roughPolySegments = (segments, ittrs, step = 0)=>{
        let res = [];
        for(let i = 0; i < segments.length; i++){
            const s = segments[i];
            // Greater max variance = more spread
            s.variance = s.variance || _random.randomNumberBetween(0.1, maxV);
            res = res.concat(roughSegment(s));
        }
        if ((++step) > ittrs) return res;
        return roughPolySegments(res, ittrs, step);
    };
    return roughPolySegments(segPoly, detail);
};
const waterColorBrush = (context)=>(x, y, size = 50, color = 'black', polySteps = 4, layers = 10, detail = 2, spreadIncr = 0)=>{
        const maxVariance = 1.1;
        const poly = _grids.circlePointsPA(x, y, size, Math.PI / polySteps, 0, true);
        const segpoly = _segments.segmentsFromPoints(poly);
        const startingPoly = roughenPoly(segpoly, detail, maxVariance);
        const alphas = _math.logInterval(layers, 1, 100).reverse();
        color = _tinycolor2Default.default(color);
        const strength = 1;
        let spread = 1;
        const alphaDiv = layers / 2;
        let rough;
        let points;
        let currentColor;
        for(let i = 0; i < layers; i++){
            rough = roughenPoly(startingPoly, detail, maxVariance, spread);
            points = _segments.segArrayToPointsArray(rough);
            currentColor = color.clone().setAlpha(alphas[i] * 0.01 / alphaDiv);
            for(let s = 0; s < strength; s++)_primatives.polygonPA(context)(points, currentColor);
            spread += spreadIncr;
        }
    // pointPathPA(context)(points, color, 1);
    // polygonPA(context)(segArrayToPointsArray(startingPoly), 'blue');
    // polygonPA(context)(segArrayToPointsArray(segpoly), 'green');
    }
;
const brushShape = ()=>{
    const config = {
        name: 'brush-shape',
        ..._sketch.instagram
    };
    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 25;
    const renderScale = config.scale; // 1 or 2
    const backgroundColor = _palettes.paperWhite.clone();
    const palette = new _palettes.Palette();
    const image = new _bitmap.Bitmap(_kristijanArsovWoman400PngDefault.default);
    let rectangles;
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;
        image.init(canvas, context);
        // rectangles = createRectGrid(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2, tiles, tiles);
        rectangles = _rectangle.createRectGrid(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2, 3, 3, margin, margin);
        _canvas.background(canvas, context)(backgroundColor.darken(10));
    };
    const draw = ({ canvas , context  })=>{
        // background(canvas, context)(backgroundColor);
        // const brushColor = palette.oneOf().clone();
        rectangles.forEach((r)=>{
            const x = r.mx;
            const y = r.my;
            const s = r.w * 0.4;
            const brushColor = _tinycolor2Default.default.random(); // palette.oneOf();
            // rect(context)(r.x, r.y, r.w, r.h, 1, tinycolor(`rgba(0,0,0,.1)`));
            waterColorBrush(context)(x, y, s, brushColor, 6, 40, 2, 0.1);
        });
        // const x = randomNumberBetween(0, canvasWidth);
        // const y = randomNumberBetween(0, canvasHeight);
        // const s = randomNormalNumberBetween(5, 50);
        // const brushColor = image.pixelColorFromCanvas(x, y);
        // waterColorBrush(context)(x, y, s, brushColor, 4,10, 2);
        return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/color/palettes":"3qayM","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/math/grids":"2Wgq0","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/segments":"5KdqE","../rndrgen/math/points":"4RQVg","../rndrgen/math/math":"4t0bw","../rndrgen/math/random":"1SLuP","tinycolor2":"101FG","../../media/images/kristijan-arsov-woman-400.png":"2bj6J","../rndrgen/canvas/Bitmap":"17J8Q","../rndrgen/math/Rectangle":"1Uf2J","../rndrgen/sketch":"2OcGA"}],"4o64S":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "circles01", ()=>circles01
);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _primatives = require("../rndrgen/canvas/primatives");
var _circle = require("../rndrgen/math/Circle");
const drawCircle = (context)=>({ x , y , radius  }, color = 'black')=>{
        _primatives.circle(context)(x, y, radius, color);
    }
;
const circles01 = ()=>{
    const config = {
        name: 'circles-01',
        ..._sketch.instagram
    };
    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    const renderScale = config.scale; // 1 or 2
    const backgroundColor = _palettes.paperWhite.clone();
    const foreColor = _palettes.bicPenBlue.clone();
    let c;
    let r = 0;
    const maxDepth = 3;
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;
        c = new _circle.Circle(canvasCenterX, canvasCenterY, canvasCenterX * 0.75);
        _canvas.background(canvas, context)(backgroundColor);
    // drawCircle(context)(c, foreColor);
    };
    const subdiv = (c1, depth = 0)=>{
        if ((depth++) > maxDepth) return;
        c1.subdivide(r);
        r += Math.PI / 8;
        c1.children.forEach((s)=>{
            subdiv(s, depth);
        });
    };
    const drawSubdiv = (c1)=>{
        drawCircle(ctx)(c1, foreColor);
        c1.children.forEach((s)=>{
            drawSubdiv(s);
        });
    };
    const draw = ({ canvas , context  })=>{
        // background(canvas, context)(backgroundColor);
        // c.subdivide(2);
        subdiv(c);
        drawSubdiv(c);
        // console.log(c);
        // c.children.forEach((s) => {
        //     drawCircle(context)(s);
        // });
        // const p = c.randomPointInside();
        // pixel(context)(p.x, p.y, foreColor);
        return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/sketch":"2OcGA","../rndrgen/color/palettes":"3qayM","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/Circle":"2UK2m"}],"2UK2m":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Circle", ()=>Circle
);
// For circle packing
// https://www.youtube.com/watch?v=QHEQuoIKgNE&t=1s
parcelHelpers.export(exports, "PackCircle", ()=>PackCircle
);
var _points = require("./points");
var _random = require("./random");
var _math = require("./math");
class Circle {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.diameter = radius * 2;
        // array of subdivisions
        this.children = [];
        // 1 or -1
        this.phase = 1;
        this.depth = 0;
    }
    get center() {
        return _points.point(this.x, this.y);
    }
    get midTop() {
        return _points.point(this.x, this.y - this.radius);
    }
    get midRight() {
        return _points.point(this.x + this.radius, this.y);
    }
    get midBottom() {
        return _points.point(this.x, this.y + this.radius);
    }
    get midLeft() {
        return _points.point(this.x - this.radius, this.y);
    }
    get bounds() {
        return {
            top: this.y - this.radius,
            right: this.x + this.radius,
            bottom: this.y + this.radius,
            left: this.x - this.radius
        };
    }
    randomPointInside() {
        const radius1 = _random.randomWholeBetween(0, this.radius);
        const angle = _random.randomNumberBetween(0, _math.TAU);
        const x1 = radius1 * Math.cos(angle) + this.x;
        const y1 = radius1 * Math.sin(angle) + this.y;
        return _points.point(x1, y1);
    }
    contains(p, buffer = 0, onEdge = false) {
        const dist = Math.abs(_points.pointDistance(p, this.center));
        return onEdge ? dist <= this.radius + buffer : dist < this.radius + buffer;
    }
    intersects(circ, buffer = 0) {
        const dist = Math.abs(_points.pointDistance(this.center, circ.center));
        const rads = this.radius + circ.radius;
        return dist - buffer < rads;
    }
    // https://en.wikipedia.org/wiki/Circle_packing_in_a_circle
    subdivide(radian = 0) {
        const pos = this.radius * (2 / 3);
        const radius1 = this.radius * (1 / 3);
        const step = 1.5708; // 90 degrees
        let center = radian;
        this.children.push(new Circle(this.x, this.y, radius1));
        for(let i = 0; i < 4; i++){
            const x1 = pos * Math.cos(center) + this.x;
            const y1 = pos * Math.sin(center) + this.y;
            this.children.push(new Circle(x1, y1, radius1));
            center += step;
        }
        this.children.forEach((c)=>{
            c.phase *= -1;
            c.parent = this;
            c.depth = this.depth + 1;
        });
    }
}
class PackCircle extends Circle {
    constructor(x1, y1, r, maxr){
        super(x1, y1, r);
        this.growing = true;
        this.maxRadius = maxr;
    }
    grow() {
        if (this.growing) {
            this.radius += 1;
            if (this.maxRadius && this.radius >= this.maxRadius) this.growing = false;
        }
    }
    edges(rect) {
        const b = this.bounds;
        return b.left < rect.x || b.right > rect.x2 || b.top < rect.y || b.bottom > rect.y2;
    }
}

},{"./points":"4RQVg","./random":"1SLuP","./math":"4t0bw","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"5F9hs":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "circlePacking01", ()=>circlePacking01
);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _primatives = require("../rndrgen/canvas/primatives");
var _circle = require("../rndrgen/math/Circle");
var _rectangle = require("../rndrgen/math/Rectangle");
var _circlePackingRandom = require("../rndrgen/systems/CirclePackingRandom");
const drawCircle = (context)=>({ x , y , radius  }, color = 'black')=>{
        _primatives.circle(context)(x, y, radius, color);
    }
;
const circlePacking01 = ()=>{
    const config = {
        name: 'circle-packing-01',
        ..._sketch.instagram
    };
    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    const renderScale = config.scale; // 1 or 2
    const backgroundColor = _palettes.paperWhite.clone();
    const foreColor = _palettes.bicPenBlue.clone();
    let canvasBounds;
    let canvasCircle;
    const fill = _circlePackingRandom.randomCircleFill(500);
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        canvasBounds = new _rectangle.Rectangle(0, 0, canvasWidth, canvasHeight);
        canvasCircle = new _circle.PackCircle(canvasCenterX, canvasCenterY, canvasCenterX * 0.75);
        _canvas.background(canvas, context)(backgroundColor);
    };
    const randomNewPoint = (_)=>canvasCircle.randomPointInside()
    ;
    const draw = ({ canvas , context  })=>{
        const result = fill.insert(randomNewPoint);
        _canvas.background(canvas, context)(backgroundColor);
        fill.grow(canvasBounds);
        fill.getCircles().forEach((c)=>drawCircle(ctx)(c, foreColor)
        );
        return result;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/sketch":"2OcGA","../rndrgen/color/palettes":"3qayM","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/Circle":"2UK2m","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/math/Rectangle":"1Uf2J","../rndrgen/systems/CirclePackingRandom":"7MyN6"}],"7MyN6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "randomCircleFill", ()=>randomCircleFill
);
var _circle = require("../math/Circle");
const randomCircleFill = (maxCircles = 100, maxAttempts = 10, newPerFrame = 10)=>{
    let circles = [];
    // const newPerFrame = 10;
    let newPlacementAttempts = 0;
    // const maxAttempts = 10;
    // const maxCircles = 300;
    const getCircles = (_)=>circles
    ;
    const setCircles = (c)=>circles = c
    ;
    const attemptNewCircle = (pointGenFn)=>{
        // const x = randomNumberBetween(0, canvasWidth);
        // const y = randomNumberBetween(0, canvasHeight);
        const p = pointGenFn();
        let inside = false;
        // no new circle inside of an existing one
        circles.forEach((c)=>{
            if (c.contains(p, 5)) inside = true;
        });
        if (!inside) return new _circle.PackCircle(p.x, p.y, 2);
        return null;
    };
    const insert = (pointGenFn)=>{
        for(let i = 0; i < newPerFrame; i++){
            const newc = attemptNewCircle(pointGenFn);
            if (newc) {
                circles.push(newc);
                if (circles.length > maxCircles) {
                    console.log('Max circles');
                    return -1;
                }
                newPlacementAttempts = 0;
            } else if ((++newPlacementAttempts) > maxAttempts) {
                console.log('Max attempts exceeded');
                return -1;
            }
        }
        return 1;
    };
    const grow = (edges)=>{
        circles.forEach((c)=>{
            if (c.growing) {
                if (c.edges(edges)) c.growing = false;
                else circles.forEach((other)=>{
                    if (c.growing && c !== other) {
                        if (c.intersects(other, 2)) c.growing = false;
                    }
                });
            }
            c.grow();
        });
    };
    return {
        insert,
        grow,
        getCircles,
        setCircles
    };
};

},{"../math/Circle":"2UK2m","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"1jzcE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "circlePacking02", ()=>circlePacking02
);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _primatives = require("../rndrgen/canvas/primatives");
var _circle = require("../rndrgen/math/Circle");
var _rectangle = require("../rndrgen/math/Rectangle");
var _circlePackingRandom = require("../rndrgen/systems/CirclePackingRandom");
var _kristijanArsovWoman400Png = require("../../media/images/kristijan-arsov-woman-400.png");
var _kristijanArsovWoman400PngDefault = parcelHelpers.interopDefault(_kristijanArsovWoman400Png);
var _bitmap = require("../rndrgen/canvas/Bitmap");
var _quadTree = require("../rndrgen/math/QuadTree");
var _random = require("../rndrgen/math/random");
const drawCircle = (context)=>({ x , y , radius  }, color = 'black')=>{
        _primatives.circleFilled(context)(x, y, radius, color);
    }
;
const circlePacking02 = ()=>{
    const config = {
        name: 'circle-packing-02',
        ..._sketch.instagram
    };
    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 50;
    const renderScale = config.scale; // 1 or 2
    const backgroundColor = _palettes.paperWhite.clone().darken(80);
    const foreColor = _palettes.bicPenBlue.clone();
    const image = new _bitmap.Bitmap(_kristijanArsovWoman400PngDefault.default);
    let canvasBounds;
    let canvasCircle;
    let quadtree;
    const fill = _circlePackingRandom.randomCircleFill(10000, 500);
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        canvasBounds = new _rectangle.Rectangle(0, 0, canvasWidth, canvasHeight);
        canvasCircle = new _circle.PackCircle(canvasCenterX, canvasCenterY, canvasCenterX * 0.75);
        image.init(canvas, context);
        // const points = image.thresholdAsPoints(200, 130);
        // quadtree = quadTreeFromPoints(canvasBounds, 10, points);
        const res = canvasWidth / 5;
        image.boxBlur(1);
        // image.sharpen();
        image.findEdges(20, 'white', 'black', 64);
        const points = image.thresholdAsPoints(res, 20, false);
        image.resetImageData();
        quadtree = _quadTree.quadTreeFromPoints(canvasBounds, 1, points);
        image.showToCanvas(res);
        // show(context)(quadtree);
        const startingCircles = [];
        _quadTree.flatDepthSortedAsc(quadtree).forEach((q)=>{
            const rad = q.boundary.w / 3; // Math.max(q.boundary.w / 3, 1);
            const radDif = q.boundary.w / 2 - rad;
            const x = q.boundary.mx + _random.randomNormalNumberBetween(-1 * radDif, radDif);
            const y = q.boundary.my + _random.randomNormalNumberBetween(-1 * radDif, radDif);
            startingCircles.push(new _circle.PackCircle(x, y, rad, q.boundary.w / 2));
        });
        fill.setCircles(startingCircles);
        _canvas.background(canvas, context)(backgroundColor.setAlpha(0.8));
    };
    const randomNewPointInCircle = (_)=>canvasCircle.randomPointInside()
    ;
    const randomNewPointInCanvas = (_)=>({
            x: _random.randomNumberBetween(0, canvasWidth),
            y: _random.randomNumberBetween(0, canvasHeight)
        })
    ;
    const draw = ({ canvas , context  })=>{
        const result = fill.insert(randomNewPointInCanvas);
        // background(canvas, context)(backgroundColor);
        fill.grow(canvasBounds);
        fill.getCircles().forEach((c)=>{
            if (c.growing) drawCircle(ctx)(c, image.pixelColorFromCanvas(c.x, c.y));
        });
        return result;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/sketch":"2OcGA","../rndrgen/color/palettes":"3qayM","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/Circle":"2UK2m","../rndrgen/math/Rectangle":"1Uf2J","../rndrgen/systems/CirclePackingRandom":"7MyN6","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/canvas/Bitmap":"17J8Q","../rndrgen/math/QuadTree":"652jH","../rndrgen/math/random":"1SLuP","../../media/images/kristijan-arsov-woman-400.png":"2bj6J"}],"7Izx5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "bitmapTest01", ()=>bitmapTest01
);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _rectangle = require("../rndrgen/math/Rectangle");
var _primatives = require("../rndrgen/canvas/primatives");
var _quadTree = require("../rndrgen/math/QuadTree");
var _bitmap = require("../rndrgen/canvas/Bitmap");
var _edgeDetect = require("../scratch/EdgeDetect");
var _kristijanArsovWoman400Png = require("../../media/images/kristijan-arsov-woman-400.png");
var _kristijanArsovWoman400PngDefault = parcelHelpers.interopDefault(_kristijanArsovWoman400Png);
const bitmapTest01 = ()=>{
    const config = {
        name: 'bitmapTest01',
        ratio: _sketch.ratio.square,
        scale: _sketch.scale.standard
    };
    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    const backgroundColor = _palettes.paperWhite.clone();
    const foreColor = _palettes.bicPenBlue.clone();
    let quadtree;
    const image = new _bitmap.Bitmap(_kristijanArsovWoman400PngDefault.default);
    let imageThresholdPoints;
    let boundary;
    const showPoints = (points, color = 'red')=>points.forEach((p)=>{
            _primatives.pixel(ctx)(p.x, p.y, color, 'circle', 1);
        })
    ;
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        image.init(canvas, context, false);
        boundary = new _rectangle.Rectangle(0, 0, canvasWidth, canvasHeight);
    // imageThresholdPoints = image.thresholdAsPoints(100, 128, true);
    // quadtree = quadTreeFromPoints(boundary, 4, imageThresholdPoints);
    // background(canvas, context)(backgroundColor);
    };
    const draw = ({ canvas , context  })=>{
        // background(canvas, context)(backgroundColor);
        const res = canvasWidth / 5;
        // image.invert();
        image.greyscale();
        image.boxBlur();
        // image.sharpen();
        // image.prewittEdges();
        // image.sobelEdges();
        image.robertsEdges();
        // image.findEdges(30, 'white', 'black', 64);
        const t = image.thresholdAsPoints(res, 30, false);
        // background(canvas, context)(backgroundColor);
        // image.resetImageData();
        // image.showToCanvas(res);
        // quadtree = quadTreeFromPoints(boundary, 1, t);
        // if (quadtree) show(context)(quadtree);
        if (t) showPoints(t);
        return -1;
    };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/sketch":"2OcGA","../rndrgen/color/palettes":"3qayM","../rndrgen/math/Rectangle":"1Uf2J","../rndrgen/canvas/primatives":"6MM7x","../rndrgen/math/QuadTree":"652jH","../rndrgen/canvas/Bitmap":"17J8Q","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../../media/images/kristijan-arsov-woman-400.png":"2bj6J","../scratch/EdgeDetect":"4L3D0"}],"4L3D0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Filters", ()=>Filters
);
parcelHelpers.export(exports, "EdgeDetect", ()=>EdgeDetect
);
parcelHelpers.export(exports, "initialize", ()=>initialize
);
/*

Originally from https://github.com/cmisenas/canny-edge-detection
Demo http://canny-edge-detection.herokuapp.com/

Works the following way:
1. Convert the canvas image to grayscale
2. Smooth the image to reduce noise as much as possible. In this implementation, Gaussian filter can be applied
    (max kernel size is 21).
3. Determine the gradient intensity (amount of change) and direction for each pixel. This is done by convolving image
    with the chosen filter. Currently, there are 3 operators you may choose from: Sobel, Prewitts, Cross
4. Thin the resulting edges with non-maximum suppression.
5. Remove weak/false edges. A process called hysteresis is used where there are two thresholds--high and low--to be
    compared to each pixel.

Modifications from 7/15/21, Matt Perkins
* Merged to one file
* conversion to ES6 classes
* bootstrap functions (bottom of file)
 */ var _cabbage = require("./Cabbage");
// helpers.js
const sumArr = function(arr) {
    // receives an array and returns sum
    let result = 0;
    arr.map(function(el, idx) {
        result += /^\s*function Array/.test(String(el.constructor)) ? sumArr(el) : el;
    });
    return result;
};
const COLORS = {
    RED: {
        r: 255,
        g: 0,
        b: 0
    },
    GREEN: {
        r: 0,
        g: 255,
        b: 0
    },
    BLUE: {
        r: 0,
        g: 0,
        b: 255
    },
    YELLOW: {
        r: 255,
        g: 255,
        b: 0
    },
    PINK: {
        r: 255,
        g: 0,
        b: 255
    },
    AQUA: {
        r: 0,
        g: 255,
        b: 255
    }
};
const roundDir = function(deg) {
    // rounds degrees to 4 possible orientations: horizontal, vertical, and 2 diagonals
    var deg = deg < 0 ? deg + 180 : deg;
    if (deg >= 0 && deg <= 22.5 || deg > 157.5 && deg <= 180) return 0;
    if (deg > 22.5 && deg <= 67.5) return 45;
    if (deg > 67.5 && deg <= 112.5) return 90;
    if (deg > 112.5 && deg <= 157.5) return 135;
};
const getPixelNeighbors = function(dir) {
    const degrees = {
        0: [
            {
                x: 1,
                y: 2
            },
            {
                x: 1,
                y: 0
            }, 
        ],
        45: [
            {
                x: 0,
                y: 2
            },
            {
                x: 2,
                y: 0
            }, 
        ],
        90: [
            {
                x: 0,
                y: 1
            },
            {
                x: 2,
                y: 1
            }, 
        ],
        135: [
            {
                x: 0,
                y: 0
            },
            {
                x: 2,
                y: 2
            }, 
        ]
    };
    return degrees[dir];
};
const getEdgeNeighbors = function(i, imgData, threshold, includedEdges) {
    const neighbors = [];
    const pixel = new Pixel(i, imgData.width, imgData.height);
    for(let j = 0; j < pixel.neighbors.length; j++)if (imgData.data[pixel.neighbors[j]] >= threshold && (includedEdges === undefined || includedEdges.indexOf(pixel.neighbors[j]) === -1)) neighbors.push(pixel.neighbors[j]);
    return neighbors;
};
const createHistogram = function(cvs) {
    const histogram = {
        g: []
    };
    let size = 256;
    let total = 0;
    const imgData = cvs.getCurrentImg();
    while(size--)histogram.g[size] = 0;
    cvs.map(function(x, y, pixelIndex, cvsIndex) {
        histogram.g[imgData.data[cvsIndex]]++;
        total++;
    });
    histogram.length = total;
    return histogram;
};
// mean threshold works better than median threshold
// however is sensitive to noise
// works best when Gaussian boxBlur is applied first
const calcMeanThreshold = function(cvs) {
    const histogram = createHistogram(cvs);
    let sum = 0;
    const total = histogram.length;
    histogram.g.forEach(function(e, i) {
        sum += e * (i + 1);
    });
    return sum / total;
};
// does not work that well
// median value is almost always 0 (black)
// if background is bigger than foreground
const calcMedianThreshold = function(cvs) {
    const histogram = createHistogram(cvs);
    const m = Math.round(histogram.length / 2);
    let n = 0;
    let median;
    histogram.g.some(function(e, i) {
        n += e;
        if (n >= m) {
            median = i;
            return true;
        }
        return false;
    });
    return median;
};
const calcWeight = function(histogram, s, e) {
    const total = histogram.reduce(function(i, j) {
        return i + j;
    }, 0);
    const partHist = s === e ? [
        histogram[s]
    ] : histogram.slice(s, e);
    const part = partHist.reduce(function(i, j) {
        return i + j;
    }, 0);
    return parseFloat(part, 10) / total;
};
const calcMean = function(histogram, s, e) {
    const partHist = s === e ? [
        histogram[s]
    ] : histogram.slice(s, e);
    let val = total = 0;
    partHist.forEach(function(el, i) {
        val += (s + i) * el;
        total += el;
    });
    return parseFloat(val, 10) / total;
};
const calcBetweenClassVariance = function(weight1, mean1, weight2, mean2) {
    return weight1 * weight2 * (mean1 - mean2) * (mean1 - mean2);
};
const fastOtsu = function(canvas) {
    const histogram = createHistogram(canvas);
    const start = 0;
    const end = histogram.g.length - 1;
    let leftWeight;
    let rightWeight;
    let leftMean;
    let rightMean;
    const betweenClassVariances = [];
    let max = -Infinity;
    let threshold;
    histogram.g.forEach(function(el, i) {
        leftWeight = calcWeight(histogram.g, start, i);
        rightWeight = calcWeight(histogram.g, i, end + 1);
        leftMean = calcMean(histogram.g, start, i);
        rightMean = calcMean(histogram.g, i, end + 1);
        betweenClassVariances[i] = calcBetweenClassVariance(leftWeight, leftMean, rightWeight, rightMean);
        if (betweenClassVariances[i] > max) {
            max = betweenClassVariances[i];
            threshold = i;
        }
    });
    return threshold;
};
// filters.js
const calculateGray = function(pixel) {
    return 0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b;
};
const generateKernel = function(sigma, size) {
    const kernel = [];
    const E = 2.718; // Euler's number rounded of to 3 places
    for(let y = -(size - 1) / 2, i = 0; i < size; y++, i++){
        kernel[i] = [];
        for(let x = -(size - 1) / 2, j = 0; j < size; x++, j++)// create kernel round to 3 decimal places
        kernel[i][j] = 1 / (2 * Math.PI * Math.pow(sigma, 2)) * Math.pow(E, -(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)) / (2 * Math.pow(sigma, 2)));
    }
    // normalize the kernel to make its sum 1
    const normalize = 1 / sumArr(kernel);
    for(let k = 0; k < kernel.length; k++)for(let l = 0; l < kernel[k].length; l++)kernel[k][l] = Math.round(normalize * kernel[k][l] * 1000) / 1000;
    return kernel;
};
class Filters {
    constructor(cvs){
        this.cabbageCnvs = cvs;
    }
    grayscale() {
        const that = this;
        let grayLevel;
        console.time('Grayscale Time');
        this.cabbageCnvs.map(function(x, y, pixelIndex, cvsIndex) {
            grayLevel = calculateGray(that.cabbageCnvs.getPixel(cvsIndex));
            that.cabbageCnvs.setPixel({
                x,
                y
            }, grayLevel);
        });
        this.cabbageCnvs.setImg();
        console.timeEnd('Grayscale Time');
    }
    gaussianBlur(sigma, size) {
        const that = this;
        const kernel = generateKernel(sigma, size);
        console.time('Blur Time');
        this.cabbageCnvs.convolve(function(neighbors, x, y, pixelIndex, cvsIndex) {
            // ignore edges
            // TODO: make this faster!
            if (x !== 0 && y !== 0 && x !== that.cabbageCnvs.width - 1 && y !== that.cabbageCnvs.height - 1) {
                let resultR = 0;
                let resultG = 0;
                let resultB = 0;
                let pixel;
                for(let i = 0; i < size; i++)for(let j = 0; j < size; j++){
                    pixel = that.cabbageCnvs.getPixel(neighbors[i][j]);
                    // return the existing pixel value multiplied by the kernel
                    resultR += pixel.r * kernel[i][j];
                    resultG += pixel.g * kernel[i][j];
                    resultB += pixel.b * kernel[i][j];
                }
                that.cabbageCnvs.setPixel({
                    x,
                    y
                }, {
                    r: resultR,
                    g: resultG,
                    b: resultB
                });
            }
        }, size);
        this.cabbageCnvs.setImg();
        console.timeEnd('Blur Time');
    }
    invertColors() {
        const that = this;
        let pixel;
        console.time('Invert Colors Time');
        this.cabbageCnvs.map(function(x, y, pixelIndex, cvsIndex) {
            pixel = that.cabbageCnvs.getPixel(cvsIndex);
            that.cabbageCnvs.setPixel({
                x,
                y
            }, {
                r: 255 - pixel.r,
                g: 255 - pixel.g,
                b: 255 - pixel.b
            });
        });
        this.cabbageCnvs.setImg();
        console.timeEnd('Invert Colors Time');
    }
}
// canny.js
const SOBEL_X_FILTER = [
    [
        -1,
        0,
        1
    ],
    [
        -2,
        0,
        2
    ],
    [
        -1,
        0,
        1
    ], 
];
const SOBEL_Y_FILTER = [
    [
        1,
        2,
        1
    ],
    [
        0,
        0,
        0
    ],
    [
        -1,
        -2,
        -1
    ], 
];
const ROBERTS_X_FILTER = [
    [
        1,
        0
    ],
    [
        0,
        -1
    ], 
];
const ROBERTS_Y_FILTER = [
    [
        0,
        1
    ],
    [
        -1,
        0
    ], 
];
const PREWITT_X_FILTER = [
    [
        -1,
        0,
        1
    ],
    [
        -1,
        0,
        1
    ],
    [
        -1,
        0,
        1
    ], 
];
const PREWITT_Y_FILTER = [
    [
        -1,
        -1,
        -1
    ],
    [
        0,
        0,
        0
    ],
    [
        1,
        1,
        1
    ], 
];
const OPERATORS = {
    sobel: {
        x: SOBEL_X_FILTER,
        y: SOBEL_Y_FILTER,
        len: SOBEL_X_FILTER.length
    },
    roberts: {
        x: ROBERTS_X_FILTER,
        y: ROBERTS_Y_FILTER,
        len: ROBERTS_Y_FILTER.length
    },
    prewitt: {
        x: PREWITT_X_FILTER,
        y: PREWITT_Y_FILTER,
        len: PREWITT_Y_FILTER.length
    }
};
class EdgeDetect {
    constructor(canvElem){
        this.cabbageCnvs = canvElem;
    }
    // find intensity gradient of image
    gradient(op) {
        const imgDataCopy = this.cabbageCnvs.getCurrentImg();
        const dirMap = [];
        const gradMap = [];
        const that = this;
        console.time('Sobel Filter Time');
        this.cabbageCnvs.convolve(function(neighbors, x, y, pixelIndex, cvsIndex) {
            let edgeX = 0;
            let edgeY = 0;
            if (!that.cabbageCnvs.isBorder({
                x,
                y
            })) {
                for(let i = 0; i < OPERATORS[op].len; i++)for(let j = 0; j < OPERATORS[op].len; j++){
                    if (!neighbors[i][j]) continue;
                    edgeX += imgDataCopy.data[neighbors[i][j]] * OPERATORS[op].x[i][j];
                    edgeY += imgDataCopy.data[neighbors[i][j]] * OPERATORS[op].y[i][j];
                }
            }
            dirMap[cvsIndex] = roundDir(Math.atan2(edgeY, edgeX) * (180 / Math.PI));
            gradMap[cvsIndex] = Math.round(Math.sqrt(edgeX * edgeX + edgeY * edgeY));
            that.cabbageCnvs.setPixel({
                x,
                y
            }, gradMap[cvsIndex]);
        }, 3);
        this.cabbageCnvs.setImg();
        console.timeEnd('Sobel Filter Time');
        this.cabbageCnvs.dirMap = dirMap;
        this.cabbageCnvs.gradMap = gradMap;
    }
    nonMaximumSuppress() {
        const that = this;
        console.time('NMS Time');
        this.cabbageCnvs.convolve(function(neighbors, x, y, pixelIndex, cvsIndex) {
            const pixNeighbors = getPixelNeighbors(that.cabbageCnvs.dirMap[cvsIndex]);
            // pixel neighbors to compare
            const pix1 = that.cabbageCnvs.gradMap[neighbors[pixNeighbors[0].x][pixNeighbors[0].y]];
            const pix2 = that.cabbageCnvs.gradMap[neighbors[pixNeighbors[1].x][pixNeighbors[1].y]];
            if (pix1 > that.cabbageCnvs.gradMap[cvsIndex] || pix2 > that.cabbageCnvs.gradMap[cvsIndex] || pix2 === that.cabbageCnvs.gradMap[cvsIndex] && pix1 < that.cabbageCnvs.gradMap[cvsIndex]) that.cabbageCnvs.setPixel({
                x,
                y
            }, 0);
        }, 3);
        this.cabbageCnvs.setImg();
        console.timeEnd('NMS Time');
    }
    // TODO: Do not use sparse array for storing real edges
    // mark strong and weak edges, discard others as false edges; only keep weak edges that are connected to strong edges
    hysteresis() {
        const that = this;
        const imgDataCopy = this.cabbageCnvs.getCurrentImg();
        const realEdges = []; // where real edges will be stored with the 1st pass
        const t1 = fastOtsu(this.cabbageCnvs); // high threshold value
        const t2 = t1 / 2; // low threshold value
        // first pass
        console.time('Hysteresis Time');
        this.cabbageCnvs.map(function(x, y, pixelIndex, cvsIndex) {
            if (imgDataCopy.data[cvsIndex] > t1 && realEdges[cvsIndex] === undefined) {
                // accept as a definite edge
                const group = that._traverseEdge(cvsIndex, imgDataCopy, t2, []);
                for(let i = 0; i < group.length; i++)realEdges[group[i]] = true;
            }
        });
        // second pass
        this.cabbageCnvs.map(function(x, y, pixelIndex, cvsIndex) {
            if (realEdges[cvsIndex] === undefined) that.cabbageCnvs.setPixel({
                x,
                y
            }, 0);
            else that.cabbageCnvs.setPixel({
                x,
                y
            }, 255);
        });
        this.cabbageCnvs.setImg();
        console.timeEnd('Hysteresis Time');
    }
    // just a quick function to look at the direction results
    showDirMap() {
        const that = this;
        this.cabbageCnvs.map(function(x, y, pixelIndex, cvsIndex) {
            switch(that.cabbageCnvs.dirMap[cvsIndex]){
                case 0:
                    that.cabbageCnvs.setPixel({
                        x,
                        y
                    }, COLORS.RED);
                    break;
                case 45:
                    that.cabbageCnvs.setPixel({
                        x,
                        y
                    }, COLORS.GREEN);
                    break;
                case 90:
                    that.cabbageCnvs.setPixel({
                        x,
                        y
                    }, COLORS.BLUE);
                    break;
                case 135:
                    that.cabbageCnvs.setPixel({
                        x,
                        y
                    }, COLORS.YELLOW);
                    break;
                default:
                    that.cabbageCnvs.setPixel({
                        x,
                        y
                    }, COLORS.PINK);
            }
        });
        this.cabbageCnvs.setImg();
    }
    // TODO: Evaluate function use/fulness
    showGradMap() {
        const that = this;
        this.cabbageCnvs.map(function(x, y, pixelIndex, cvsIndex) {
            if (that.cabbageCnvs.gradMap[cvsIndex] < 0) that.cabbageCnvs.setPixel({
                x,
                y
            }, COLORS.RED);
            else if (that.cabbageCnvs.gradMap[cvsIndex] < 200) that.cabbageCnvs.setPixel({
                x,
                y
            }, COLORS.GREEN);
            else if (that.cabbageCnvs.gradMap[cvsIndex] < 400) that.cabbageCnvs.setPixel({
                x,
                y
            }, COLORS.BLUE);
            else if (that.cabbageCnvs.gradMap[cvsIndex] < 600) that.cabbageCnvs.setPixel({
                x,
                y
            }, COLORS.YELLOW);
            else if (that.cabbageCnvs.gradMap[cvsIndex] < 800) that.cabbageCnvs.setPixel({
                x,
                y
            }, COLORS.AQUA);
            else that.cabbageCnvs.setPixel({
                x,
                y
            }, COLORS.PINK);
        });
        this.cabbageCnvs.setImg();
    }
    // TODO: Optimize prime!
    // traverses the current pixel until a length has been reached
    _traverseEdge(current, imgData, threshold, traversed) {
        // initialize the group from the current pixel's perspective
        let group = [
            current
        ];
        // pass the traversed group to the getEdgeNeighbors so that it will not include those anymore
        const neighbors = getEdgeNeighbors(current, imgData, threshold, traversed);
        for(let i = 0; i < neighbors.length; i++)// recursively get the other edges connected
        group = group.concat(this._traverseEdge(neighbors[i], imgData, threshold, traversed.concat(group)));
        return group;
    // if the pixel group is not above max length,
    // it will return the pixels included in that small pixel group
    }
}
const initialize = (canvas, sz = 3, sg = 1.5)=>{
    const cabbageCanvas = new _cabbage.Cabbage(canvas);
    const edgeDetect = new EdgeDetect(cabbageCanvas);
    const filters = new Filters(cabbageCanvas);
    cabbageCanvas.setImg();
    let size;
    let sigma;
    const setSize = (s)=>size = s <= 1 || s > 21 ? 3 : s % 2 === 0 ? s - 1 : s
    ;
    const setSigma = (s)=>sigma = s < 1 || s > 10 ? 1.5 : s
    ;
    size = setSize(sz);
    sigma = setSigma(sg);
    const resetImage = (_)=>cabbageCanvas.resetImageData()
    ;
    const greyScale = (_)=>filters.grayscale()
    ;
    const blur = (_)=>filters.gaussianBlur(sigma, size)
    ;
    const invert = (_)=>filters.invertColors()
    ;
    const sobel = (_)=>edgeDetect.gradient('sobel')
    ;
    const roberts = (_)=>edgeDetect.gradient('roberts')
    ;
    const prewitt = (_)=>edgeDetect.gradient('prewitt')
    ;
    /*
    edgeDetect.nonMaximumSuppress();
    edgeDetect.hysteresis();
    edgeDetect.showDirMap();
    edgeDetect.showGradMap();
     */ return {
        setSize,
        setSigma,
        greyScale,
        blur,
        invert,
        resetImage,
        sobel,
        roberts,
        prewitt
    };
};

},{"./Cabbage":"6nrg3","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"6nrg3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Cabbage", ()=>Cabbage
);
/* Used by edge detect

Originally from https://github.com/cmisenas/cabbage.js/blob/master/cabbage.js

Modifications from 7/15/21, Matt Perkins
* conversion to ES6 classes
* Change constructor to use passed canvas element
*/ const pixelDirections = [
    'n',
    'e',
    's',
    'w',
    'ne',
    'nw',
    'se',
    'sw'
];
const pixelColorValues = [
    'r',
    'g',
    'b',
    'a'
];
// Pixel is a dumb object that does not know about image data
// It is only meant to be used by Cabbage directly for:
// manipulating canvas values, storing and easy retrieval of rgba
class Pixel {
    constructor(x1, y1, vals){
        const self = this;
        this.x = x1;
        this.y = y1;
        this.neighbors = {
        };
        // TODO ?
        if (vals) pixelColorValues.forEach(function(d) {
            this[d] = vals.shift();
        });
        pixelDirections.forEach(function(d) {
            this.neighbors[d] = self[d]();
        });
    }
    n() {
        return {
            x: this.x,
            y: this.y - 1
        };
    }
    e() {
        return {
            x: this.x + 1,
            y: this.y
        };
    }
    s() {
        return {
            x: this.x,
            y: this.y + 1
        };
    }
    w() {
        return {
            x: this.x - 1,
            y: this.y
        };
    }
    ne() {
        return {
            x: this.x + 1,
            y: this.y - 1
        };
    }
    nw() {
        return {
            x: this.x - 1,
            y: this.y - 1
        };
    }
    se() {
        return {
            x: this.x + 1,
            y: this.y - 1
        };
    }
    sw() {
        return {
            x: this.x + 1,
            y: this.y - 1
        };
    }
}
const doc = window.document;
const COORDS = 'coordinate';
const PIXIDX = 'pixel index';
const IDIDX = 'image data index';
class Cabbage {
    // Original
    // constructor(id, w, h, doc) {
    //     doc = doc || doc;
    //     this.width = w || 600;
    //     this.height = h || 400;
    //     this.elem = doc.getElementById(id) || this._createCanvas(id);
    //     this.ctx = this.elem.getContext('2d');
    //     this.origImg = {};
    //     this.currImg = {};
    // }
    constructor(canvas){
        this.width = canvas.width;
        this.height = canvas.height;
        this.elem = canvas;
        this.ctx = this.elem.getContext('2d');
        this.origImg = this.getCurrentImg();
        this.currImg = this.getCurrentImg();
        this.setImg();
    }
    loadImg(img, sx, sy) {
        const self1 = this;
        if (typeof img === 'string') this._createImage(img, function(usrImg) {
            self1._img = usrImg;
            if (usrImg.width !== self1.width || usrImg.height !== self1.height) {
                self1.width = usrImg.width;
                self1.height = usrImg.height;
                self1.elem.width = self1.width;
                self1.elem.height = self1.height;
            }
            self1.drawImage(sx, sy);
        });
        else if (/HTMLImageElement/.test(img.constructor)) {
            this._img = img;
            this.drawImage(sx, sy);
        }
        return this;
    }
    _createImage(imgSrc, fn) {
        const self1 = this;
        usrImg = new Image();
        usrImg.onload = function() {
            fn(usrImg);
        };
        usrImg.src = imgSrc;
    }
    _createCanvas(id) {
        let elem;
        elem = doc.createElement('canvas');
        elem.id = id;
        elem.width = this.width;
        elem.height = this.height;
        doc.body.insertBefore(elem, doc.body.firstChild);
        return elem;
    }
    drawImage(sx, sy) {
        this.ctx.drawImage(this._img, sx || 0, sy || 0);
        this.refreshCurrImageData();
        this.origImg = this.getCurrentImg();
    }
    // TODO: This looks sort of confusing
    // rethink its use/name
    setImg() {
        this.putImageData(this.currImg, 0, 0);
    }
    /*
        // Delete image data; leave canvas blank
        deleteImg = function() {
        };
        */ // Reset to original data
    resetImageData() {
        // put back the original image to the canvas
        this.putImageData(this.origImg);
    }
    // returns the actual current image data
    getCurrentImg() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    }
    // returns a copy of original image data
    originalImg() {
        return this.ctx.createImageData(this.origImg);
    }
    map(fn) {
        let x1;
        let y1;
        let cvsIndex;
        let pixelIndex;
        for(y1 = 0; y1 < this.height; y1++)for(x1 = 0; x1 < this.width; x1++){
            pixelIndex = y1 * this.width + x1;
            cvsIndex = x1 * 4 + y1 * this.width * 4;
            fn(x1, y1, pixelIndex, cvsIndex);
        }
    }
    convolve(fn, size) {
        let x1;
        let y1;
        let cvsIndex;
        let pixelIndex;
        let matrix;
        size = size || 3;
        for(y1 = 0; y1 < this.height; y1++)for(x1 = 0; x1 < this.width; x1++){
            pixelIndex = y1 * this.width + x1;
            cvsIndex = x1 * 4 + y1 * this.width * 4;
            matrix = this._buildMatrix(x1, y1, size);
            fn(matrix, x1, y1, pixelIndex, cvsIndex);
        }
    }
    // returns the pixel object if it exists
    // otherwise throws an error
    getPixel(loc) {
        let index;
        let coords;
        let rgba;
        if (typeof loc === 'number') {
            if (!this._checkValidIDIndex(loc)) this._throwValidationError(IDIDX, COORDS);
            index = loc;
            coords = this._convertIDIndexToCoords(loc);
        } else {
            if (!this._checkValidCoords(loc)) this._throwValidationError(COORDS, IDIDX);
            index = this._convertCoordsToIDIndex(loc);
            coords = loc;
        }
        rgba = Array.prototype.slice.call(this.currImg.data, index, index + 4);
        return new Pixel(coords.x, coords.y, rgba);
    }
    // Modifies the current image data pixels
    // Does not modify the canvas image
    // That is the job of setImg
    setPixel(pixel, val) {
        const i = this._convertCoordsToIDIndex(pixel);
        if (typeof val === 'number') {
            this.currImg.data[i] = val;
            this.currImg.data[i + 1] = val;
            this.currImg.data[i + 2] = val;
        } else {
            this.currImg.data[i] = val.r;
            this.currImg.data[i + 1] = val.g;
            this.currImg.data[i + 2] = val.b;
            this.currImg.data[i + 3] = val.a || 255;
        }
    // this._drawPixel(pixel, r, g, b, a);
    }
    _drawPixel(pixel, r, g, b, a) {
        this.ctx.fillStyle = `rgba(${[
            r,
            g,
            b,
            a
        ].join(', ')})`;
        this.ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
    isBorder(coords) {
        return coords.x === 0 && coords.y < this.height && coords.y >= 0 || coords.y === 0 && coords.x < this.width && coords.x >= 0 || coords.x === this.width - 1 && coords.y < this.height && coords.y >= 0 || coords.y === this.height - 1 && coords.x < this.width && coords.x >= 0;
    }
    isOutOfBounds(coords) {
        return coords.x < 0 || coords.x > this.width - 1 || coords.y < 0 || coords.y > this.height - 1;
    }
    // Every putImageData done via object
    // stores current image for faster access later
    putImageData(id, x, y) {
        this.ctx.putImageData(id, x || 0, y || 0);
        this.refreshCurrImageData();
    }
    refreshCurrImageData() {
        this.currImg = this.getCurrentImg();
    }
    _buildMatrix(cx, cy, size) {
        const matrix = [];
        let nx;
        let ny;
        const min = 3;
        const max = Math.max(this.width, this.height); // temp max value
        size = size || 3;
        size = size % 2 === 0 ? size + 1 : size;
        // TODO make it so that max size is dictated by the dimensions of the image
        if (size < min || size > max) size = min;
        for(let i = 0, y2 = -(size - 1) / 2; i < size; i++, y2++){
            matrix[i] = [];
            for(let j = 0, x2 = -(size - 1) / 2; j < size; j++, x2++){
                nx = cx + x2;
                ny = cy + y2;
                if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) matrix[i][j] = undefined;
                else matrix[i][j] = this._convertCoordsToIDIndex({
                    x: nx,
                    y: ny
                });
            }
        }
        return matrix;
    }
    _convertCoordsToIDIndex(coords) {
        const m = 4;
        return (coords.y * this.width + coords.x) * m;
    }
    _convertCoordsToPixIndex(coords) {
        return coords.y * this.width + coords.x;
    }
    _checkValidCoords(coords) {
        return !!coords && coords.x === parseInt(coords.x, 10) && coords.y === parseInt(coords.y, 10) && coords.x >= 0 && coords.x < this.width && coords.y >= 0 && coords.y < this.height;
    }
    _checkValidPIndex(pIdx) {
        return pIdx === parseInt(pIdx, 10) && pIdx >= 0 && pIdx < this.width * this.height;
    }
    _checkValidIDIndex(pIdx) {
        return pIdx === parseInt(pIdx, 10) && pIdx >= 0 && pIdx < this.width * this.height * 4;
    }
    _convertIDIndexToCoords(idIdx) {
        const m = 4;
        if (idIdx % 4 > 0) idIdx -= idIdx % 4;
        return {
            x: idIdx % (this.width * m) / m,
            y: Math.floor(idIdx / (this.width * m))
        };
    }
    _convertIDIndexToPixIndex(idIdx) {
        const m = 4;
        return Math.floor(idIdx / m);
    }
    _convertPixIndexToCoords(pIdx) {
        return {
            x: pIdx % this.width,
            y: Math.floor(pIdx / this.width)
        };
    }
    _convertPixIndexToIDIndex(pIdx) {
        return pIdx * 4;
    }
    _throwValidationError(from, to) {
        const msg = `Invalid ${from}. Unable to convert to ${to}`;
        throw new Error(msg);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"6BMKU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "voronoi01", ()=>voronoi01
);
var _canvas = require("../rndrgen/canvas/canvas");
var _sketch = require("../rndrgen/sketch");
var _palettes = require("../rndrgen/color/palettes");
var _d3Delaunay = require("../rndrgen/systems/d3Delaunay");
var _random = require("../rndrgen/math/random");
var _grids = require("../rndrgen/math/grids");
/*
Using https://github.com/d3/d3-delaunay
Examples https://observablehq.com/@mbostock/the-delaunays-dual
 */ const randomPointPA = (xmin, ymin, xmax, ymax)=>[
        _random.randomWholeBetween(xmin, xmax),
        _random.randomWholeBetween(ymin, ymax)
    ]
;
const getRandomPointsPA = (len, xmin, ymin, xmax, ymax)=>{
    const points = [];
    for(let i = 0; i < len; i++)points.push(randomPointPA(xmin, ymin, xmax, ymax));
    return points;
};
const voronoi01 = ()=>{
    const config = {
        name: 'voronoi-01',
        ..._sketch.instagram
    };
    let ctx;
    let canvasWidth;
    let canvasHeight;
    let canvasCenterX;
    let canvasCenterY;
    let startX;
    let maxX;
    let startY;
    let maxY;
    const margin = 0;
    const renderScale = config.scale; // 1 or 2
    const backgroundColor = _palettes.bicPenBlue.clone();
    const foreColor = _palettes.paperWhite.clone();
    let points;
    let delaunay;
    let voronoi;
    const render = (context)=>{
        // context.fillStyle = foreColor.toRgbString();
        // context.beginPath();
        // delaunay.renderPoints(context);
        // context.fill();
        // context.stroke();
        // context.closePath();
        // context.strokeStyle = foreColor.clone().setAlpha(0.25).toRgbString();
        // context.beginPath();
        // delaunay.render(context);
        // context.stroke();
        // context.closePath();
        context.strokeStyle = foreColor.toRgbString();
        context.beginPath();
        voronoi.render(context);
        context.stroke();
        context.closePath();
    };
    const setup = ({ canvas , context  })=>{
        ctx = context;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        startX = margin;
        maxX = canvas.width - margin * 2;
        startY = margin;
        maxY = canvas.height - margin * 2;
        points = getRandomPointsPA(50, startX, startY, maxX, maxY);
        points = points.concat(_grids.circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 3, Math.PI / 40));
        points = points.concat(_grids.circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 4, Math.PI / 20));
        points = points.concat(_grids.circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 5, Math.PI / 10));
        points = points.concat(_grids.circlePointsPA(canvasCenterX, canvasCenterY, canvasWidth / 6, Math.PI / 5));
        delaunay = _d3Delaunay.Delaunay.from(points);
        voronoi = delaunay.voronoi([
            startX,
            startY,
            maxX,
            maxY
        ]);
        _canvas.background(canvas, context)(backgroundColor);
        render(context);
    };
    const draw = ({ canvas , context , mouse  })=>{
        if (mouse.x && mouse.y) {
            _canvas.background(canvas, context)(backgroundColor);
            points.push([
                mouse.x,
                mouse.y
            ]);
            delaunay = _d3Delaunay.Delaunay.from(points);
            voronoi = delaunay.voronoi([
                startX,
                startY,
                maxX,
                maxY
            ]);
            render(context);
        }
        return -1;
    };
    // const draw = ({ canvas, context, mouse }) => {
    //     if (mouse.x && mouse.y) {
    //         background(canvas, context)(backgroundColor);
    //         points.push([mouse.x, mouse.y]);
    //         delaunay = Delaunay.from(points);
    //         voronoi = delaunay.voronoi([startX, startY, maxX, maxY]);
    //         render(context);
    //     }
    //     return 1;
    // };
    return {
        config,
        setup,
        draw
    };
};

},{"../rndrgen/canvas/canvas":"73Br1","../rndrgen/sketch":"2OcGA","../rndrgen/color/palettes":"3qayM","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","../rndrgen/systems/d3Delaunay":"31Nue","../rndrgen/math/random":"1SLuP","../rndrgen/math/grids":"2Wgq0"}],"31Nue":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Delaunay", ()=>_delaunayJsDefault.default
);
parcelHelpers.export(exports, "Voronoi", ()=>_voronoiJsDefault.default
);
var _delaunayJs = require("./delaunay.js");
var _delaunayJsDefault = parcelHelpers.interopDefault(_delaunayJs);
var _voronoiJs = require("./voronoi.js");
var _voronoiJsDefault = parcelHelpers.interopDefault(_voronoiJs);

},{"./delaunay.js":"564Gp","./voronoi.js":"5Jiby","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"564Gp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _delaunator = require("delaunator");
var _delaunatorDefault = parcelHelpers.interopDefault(_delaunator);
var _pathJs = require("./path.js");
var _pathJsDefault = parcelHelpers.interopDefault(_pathJs);
var _polygonJs = require("./polygon.js");
var _polygonJsDefault = parcelHelpers.interopDefault(_polygonJs);
var _voronoiJs = require("./voronoi.js");
var _voronoiJsDefault = parcelHelpers.interopDefault(_voronoiJs);
const tau = 2 * Math.PI;
const { pow  } = Math;
function pointX(p) {
    return p[0];
}
function pointY(p) {
    return p[1];
}
// A triangulation is collinear if all its triangles have a non-null area
function collinear(d) {
    const { triangles , coords  } = d;
    for(let i = 0; i < triangles.length; i += 3){
        const a = 2 * triangles[i];
        const b = 2 * triangles[i + 1];
        const c = 2 * triangles[i + 2];
        const cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1]) - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
        if (cross > 0.0000000001) return false;
    }
    return true;
}
function jitter(x, y, r) {
    return [
        x + Math.sin(x + y) * r,
        y + Math.cos(x - y) * r
    ];
}
class Delaunay {
    static from(points, fx = pointX, fy = pointY, that) {
        return new Delaunay('length' in points ? flatArray(points, fx, fy, that) : Float64Array.from(flatIterable(points, fx, fy, that)));
    }
    constructor(points1){
        this._delaunator = new _delaunatorDefault.default(points1);
        this.inedges = new Int32Array(points1.length / 2);
        this._hullIndex = new Int32Array(points1.length / 2);
        this.points = this._delaunator.coords;
        this._init();
    }
    update() {
        this._delaunator.update();
        this._init();
        return this;
    }
    // Added Matt Perkins
    updatePoints(points) {
        this.points = flatArray(points, pointX, pointY);
        return this.update();
    }
    _init() {
        const d = this._delaunator;
        const { points: points2  } = this;
        // check for collinear
        if (d.hull && d.hull.length > 2 && collinear(d)) {
            this.collinear = Int32Array.from({
                length: points2.length / 2
            }, (_, i)=>i
            ).sort((i, j)=>points2[2 * i] - points2[2 * j] || points2[2 * i + 1] - points2[2 * j + 1]
            ); // for exact neighbors
            const e = this.collinear[0];
            const f = this.collinear[this.collinear.length - 1];
            const bounds = [
                points2[2 * e],
                points2[2 * e + 1],
                points2[2 * f],
                points2[2 * f + 1]
            ];
            const r = 0.00000001 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
            for(let i = 0, n = points2.length / 2; i < n; ++i){
                const p = jitter(points2[2 * i], points2[2 * i + 1], r);
                points2[2 * i] = p[0];
                points2[2 * i + 1] = p[1];
            }
            this._delaunator = new _delaunatorDefault.default(points2);
        } else delete this.collinear;
        const halfedges = this.halfedges = this._delaunator.halfedges;
        const hull = this.hull = this._delaunator.hull;
        const triangles = this.triangles = this._delaunator.triangles;
        const inedges = this.inedges.fill(-1);
        const hullIndex = this._hullIndex.fill(-1);
        // Compute an index from each point to an (arbitrary) incoming halfedge
        // Used to give the first neighbor of each point; for this reason,
        // on the hull we give priority to exterior halfedges
        for(let e = 0, n = halfedges.length; e < n; ++e){
            const p = triangles[e % 3 === 2 ? e - 2 : e + 1];
            if (halfedges[e] === -1 || inedges[p] === -1) inedges[p] = e;
        }
        for(let i = 0, n1 = hull.length; i < n1; ++i)hullIndex[hull[i]] = i;
        // degenerate case: 1 or 2 (distinct) points
        if (hull.length <= 2 && hull.length > 0) {
            this.triangles = new Int32Array(3).fill(-1);
            this.halfedges = new Int32Array(3).fill(-1);
            this.triangles[0] = hull[0];
            inedges[hull[0]] = 1;
            if (hull.length === 2) {
                inedges[hull[1]] = 0;
                this.triangles[1] = hull[1];
                this.triangles[2] = hull[1];
            }
        }
    }
    voronoi(bounds) {
        return new _voronoiJsDefault.default(this, bounds);
    }
    *neighbors(i) {
        const { inedges , hull , _hullIndex , halfedges , triangles , collinear: collinear1  } = this;
        // degenerate case with several collinear points
        if (collinear1) {
            const l = collinear1.indexOf(i);
            if (l > 0) yield collinear1[l - 1];
            if (l < collinear1.length - 1) yield collinear1[l + 1];
            return;
        }
        const e0 = inedges[i];
        if (e0 === -1) return; // coincident point
        let e = e0;
        let p0 = -1;
        do {
            yield p0 = triangles[e];
            e = e % 3 === 2 ? e - 2 : e + 1;
            if (triangles[e] !== i) return; // bad triangulation
            e = halfedges[e];
            if (e === -1) {
                const p = hull[(_hullIndex[i] + 1) % hull.length];
                if (p !== p0) yield p;
                return;
            }
        }while (e !== e0)
    }
    find(x, y, i = 0) {
        if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;
        const i0 = i;
        let c;
        while((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0)i = c;
        return c;
    }
    _step(i, x, y) {
        const { inedges , hull , _hullIndex , halfedges , triangles , points: points2  } = this;
        if (inedges[i] === -1 || !points2.length) return (i + 1) % (points2.length >> 1);
        let c = i;
        let dc = pow(x - points2[i * 2], 2) + pow(y - points2[i * 2 + 1], 2);
        const e0 = inedges[i];
        let e = e0;
        do {
            const t = triangles[e];
            const dt = pow(x - points2[t * 2], 2) + pow(y - points2[t * 2 + 1], 2);
            if (dt < dc) dc = dt, c = t;
            e = e % 3 === 2 ? e - 2 : e + 1;
            if (triangles[e] !== i) break; // bad triangulation
            e = halfedges[e];
            if (e === -1) {
                e = hull[(_hullIndex[i] + 1) % hull.length];
                if (e !== t) {
                    if (pow(x - points2[e * 2], 2) + pow(y - points2[e * 2 + 1], 2) < dc) return e;
                }
                break;
            }
        }while (e !== e0)
        return c;
    }
    render(context) {
        const buffer = context == null ? context = new _pathJsDefault.default() : undefined;
        const { points: points2 , halfedges , triangles  } = this;
        for(let i = 0, n = halfedges.length; i < n; ++i){
            const j = halfedges[i];
            if (j < i) continue;
            const ti = triangles[i] * 2;
            const tj = triangles[j] * 2;
            context.moveTo(points2[ti], points2[ti + 1]);
            context.lineTo(points2[tj], points2[tj + 1]);
        }
        this.renderHull(context);
        return buffer && buffer.value();
    }
    renderPoints(context, r) {
        if (r === undefined && (!context || typeof context.moveTo !== 'function')) r = context, context = null;
        r = r == undefined ? 2 : +r;
        const buffer = context == null ? context = new _pathJsDefault.default() : undefined;
        const { points: points2  } = this;
        for(let i = 0, n = points2.length; i < n; i += 2){
            const x = points2[i];
            const y = points2[i + 1];
            context.moveTo(x + r, y);
            context.arc(x, y, r, 0, tau);
        }
        return buffer && buffer.value();
    }
    renderHull(context) {
        const buffer = context == null ? context = new _pathJsDefault.default() : undefined;
        const { hull , points: points2  } = this;
        const h = hull[0] * 2;
        const n = hull.length;
        context.moveTo(points2[h], points2[h + 1]);
        for(let i = 1; i < n; ++i){
            const h1 = 2 * hull[i];
            context.lineTo(points2[h1], points2[h1 + 1]);
        }
        context.closePath();
        return buffer && buffer.value();
    }
    hullPolygon() {
        const polygon = new _polygonJsDefault.default();
        this.renderHull(polygon);
        return polygon.value();
    }
    renderTriangle(i, context) {
        const buffer = context == null ? context = new _pathJsDefault.default() : undefined;
        const { points: points2 , triangles  } = this;
        const t0 = triangles[i *= 3] * 2;
        const t1 = triangles[i + 1] * 2;
        const t2 = triangles[i + 2] * 2;
        context.moveTo(points2[t0], points2[t0 + 1]);
        context.lineTo(points2[t1], points2[t1 + 1]);
        context.lineTo(points2[t2], points2[t2 + 1]);
        context.closePath();
        return buffer && buffer.value();
    }
    *trianglePolygons() {
        const { triangles  } = this;
        for(let i = 0, n = triangles.length / 3; i < n; ++i)yield this.trianglePolygon(i);
    }
    trianglePolygon(i) {
        const polygon = new _polygonJsDefault.default();
        this.renderTriangle(i, polygon);
        return polygon.value();
    }
}
exports.default = Delaunay;
function flatArray(points2, fx, fy, that) {
    const n = points2.length;
    const array = new Float64Array(n * 2);
    for(let i = 0; i < n; ++i){
        const p = points2[i];
        array[i * 2] = fx.call(that, p, i, points2);
        array[i * 2 + 1] = fy.call(that, p, i, points2);
    }
    return array;
}
function* flatIterable(points2, fx, fy, that) {
    let i = 0;
    for (const p of points2){
        yield fx.call(that, p, i, points2);
        yield fy.call(that, p, i, points2);
        ++i;
    }
}

},{"delaunator":"6LXhx","@parcel/transformer-js/src/esmodule-helpers.js":"367CR","./path.js":"2XWhB","./polygon.js":"1mzRd","./voronoi.js":"5Jiby"}],"6LXhx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _robustPredicates = require("robust-predicates");
const EPSILON = Math.pow(2, -52);
const EDGE_STACK = new Uint32Array(512);
class Delaunator {
    static from(points, getX = defaultGetX, getY = defaultGetY) {
        const n = points.length;
        const coords = new Float64Array(n * 2);
        for(let i = 0; i < n; i++){
            const p = points[i];
            coords[2 * i] = getX(p);
            coords[2 * i + 1] = getY(p);
        }
        return new Delaunator(coords);
    }
    constructor(coords){
        const n = coords.length >> 1;
        if (n > 0 && typeof coords[0] !== 'number') throw new Error('Expected coords to contain numbers.');
        this.coords = coords;
        // arrays that will store the triangulation graph
        const maxTriangles = Math.max(2 * n - 5, 0);
        this._triangles = new Uint32Array(maxTriangles * 3);
        this._halfedges = new Int32Array(maxTriangles * 3);
        // temporary arrays for tracking the edges of the advancing convex hull
        this._hashSize = Math.ceil(Math.sqrt(n));
        this._hullPrev = new Uint32Array(n); // edge to prev edge
        this._hullNext = new Uint32Array(n); // edge to next edge
        this._hullTri = new Uint32Array(n); // edge to adjacent triangle
        this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash
        // temporary arrays for sorting points
        this._ids = new Uint32Array(n);
        this._dists = new Float64Array(n);
        this.update();
    }
    update() {
        const { coords: coords1 , _hullPrev: hullPrev , _hullNext: hullNext , _hullTri: hullTri , _hullHash: hullHash  } = this;
        const n1 = coords1.length >> 1;
        // populate an array of point indices; calculate input data bbox
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for(let i = 0; i < n1; i++){
            const x = coords1[2 * i];
            const y = coords1[2 * i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            this._ids[i] = i;
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        let minDist = Infinity;
        let i0, i1, i2;
        // pick a seed point close to the center
        for(let i3 = 0; i3 < n1; i3++){
            const d = dist(cx, cy, coords1[2 * i3], coords1[2 * i3 + 1]);
            if (d < minDist) {
                i0 = i3;
                minDist = d;
            }
        }
        const i0x = coords1[2 * i0];
        const i0y = coords1[2 * i0 + 1];
        minDist = Infinity;
        // find the point closest to the seed
        for(let i4 = 0; i4 < n1; i4++){
            if (i4 === i0) continue;
            const d = dist(i0x, i0y, coords1[2 * i4], coords1[2 * i4 + 1]);
            if (d < minDist && d > 0) {
                i1 = i4;
                minDist = d;
            }
        }
        let i1x = coords1[2 * i1];
        let i1y = coords1[2 * i1 + 1];
        let minRadius = Infinity;
        // find the third point which forms the smallest circumcircle with the first two
        for(let i5 = 0; i5 < n1; i5++){
            if (i5 === i0 || i5 === i1) continue;
            const r = circumradius(i0x, i0y, i1x, i1y, coords1[2 * i5], coords1[2 * i5 + 1]);
            if (r < minRadius) {
                i2 = i5;
                minRadius = r;
            }
        }
        let i2x = coords1[2 * i2];
        let i2y = coords1[2 * i2 + 1];
        if (minRadius === Infinity) {
            // order collinear points by dx (or dy if all x are identical)
            // and return the list as a hull
            for(let i6 = 0; i6 < n1; i6++)this._dists[i6] = coords1[2 * i6] - coords1[0] || coords1[2 * i6 + 1] - coords1[1];
            quicksort(this._ids, this._dists, 0, n1 - 1);
            const hull = new Uint32Array(n1);
            let j = 0;
            for(let i7 = 0, d0 = -Infinity; i7 < n1; i7++){
                const id = this._ids[i7];
                if (this._dists[id] > d0) {
                    hull[j++] = id;
                    d0 = this._dists[id];
                }
            }
            this.hull = hull.subarray(0, j);
            this.triangles = new Uint32Array(0);
            this.halfedges = new Uint32Array(0);
            return;
        }
        // swap the order of the seed points for counter-clockwise orientation
        if (_robustPredicates.orient2d(i0x, i0y, i1x, i1y, i2x, i2y) < 0) {
            const i6 = i1;
            const x = i1x;
            const y = i1y;
            i1 = i2;
            i1x = i2x;
            i1y = i2y;
            i2 = i6;
            i2x = x;
            i2y = y;
        }
        const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
        this._cx = center.x;
        this._cy = center.y;
        for(let i6 = 0; i6 < n1; i6++)this._dists[i6] = dist(coords1[2 * i6], coords1[2 * i6 + 1], center.x, center.y);
        // sort the points by distance from the seed triangle circumcenter
        quicksort(this._ids, this._dists, 0, n1 - 1);
        // set up the seed triangle as the starting hull
        this._hullStart = i0;
        let hullSize = 3;
        hullNext[i0] = hullPrev[i2] = i1;
        hullNext[i1] = hullPrev[i0] = i2;
        hullNext[i2] = hullPrev[i1] = i0;
        hullTri[i0] = 0;
        hullTri[i1] = 1;
        hullTri[i2] = 2;
        hullHash.fill(-1);
        hullHash[this._hashKey(i0x, i0y)] = i0;
        hullHash[this._hashKey(i1x, i1y)] = i1;
        hullHash[this._hashKey(i2x, i2y)] = i2;
        this.trianglesLen = 0;
        this._addTriangle(i0, i1, i2, -1, -1, -1);
        for(let k = 0, xp, yp; k < this._ids.length; k++){
            const i7 = this._ids[k];
            const x = coords1[2 * i7];
            const y = coords1[2 * i7 + 1];
            // skip near-duplicate points
            if (k > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
            xp = x;
            yp = y;
            // skip seed triangle points
            if (i7 === i0 || i7 === i1 || i7 === i2) continue;
            // find a visible edge on the convex hull using edge hash
            let start = 0;
            for(let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++){
                start = hullHash[(key + j) % this._hashSize];
                if (start !== -1 && start !== hullNext[start]) break;
            }
            start = hullPrev[start];
            let e = start, q;
            while(q = hullNext[e], _robustPredicates.orient2d(x, y, coords1[2 * e], coords1[2 * e + 1], coords1[2 * q], coords1[2 * q + 1]) >= 0){
                e = q;
                if (e === start) {
                    e = -1;
                    break;
                }
            }
            if (e === -1) continue; // likely a near-duplicate point; skip it
            // add the first triangle from the point
            let t = this._addTriangle(e, i7, hullNext[e], -1, -1, hullTri[e]);
            // recursively flip triangles from the point until they satisfy the Delaunay condition
            hullTri[i7] = this._legalize(t + 2);
            hullTri[e] = t; // keep track of boundary triangles on the hull
            hullSize++;
            // walk forward through the hull, adding more triangles and flipping recursively
            let n2 = hullNext[e];
            while(q = hullNext[n2], _robustPredicates.orient2d(x, y, coords1[2 * n2], coords1[2 * n2 + 1], coords1[2 * q], coords1[2 * q + 1]) < 0){
                t = this._addTriangle(n2, i7, q, hullTri[i7], -1, hullTri[n2]);
                hullTri[i7] = this._legalize(t + 2);
                hullNext[n2] = n2; // mark as removed
                hullSize--;
                n2 = q;
            }
            // walk backward from the other side, adding more triangles and flipping
            if (e === start) while(q = hullPrev[e], _robustPredicates.orient2d(x, y, coords1[2 * q], coords1[2 * q + 1], coords1[2 * e], coords1[2 * e + 1]) < 0){
                t = this._addTriangle(q, i7, e, -1, hullTri[e], hullTri[q]);
                this._legalize(t + 2);
                hullTri[q] = t;
                hullNext[e] = e; // mark as removed
                hullSize--;
                e = q;
            }
            // update the hull indices
            this._hullStart = hullPrev[i7] = e;
            hullNext[e] = hullPrev[n2] = i7;
            hullNext[i7] = n2;
            // save the two new edges in the hash table
            hullHash[this._hashKey(x, y)] = i7;
            hullHash[this._hashKey(coords1[2 * e], coords1[2 * e + 1])] = e;
        }
        this.hull = new Uint32Array(hullSize);
        for(let i7 = 0, e = this._hullStart; i7 < hullSize; i7++){
            this.hull[i7] = e;
            e = hullNext[e];
        }
        // trim typed triangle mesh arrays
        this.triangles = this._triangles.subarray(0, this.trianglesLen);
        this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
    }
    _hashKey(x, y) {
        return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
    }
    _legalize(a) {
        const { _triangles: triangles , _halfedges: halfedges , coords: coords1  } = this;
        let i = 0;
        let ar = 0;
        // recursion eliminated with a fixed-size stack
        while(true){
            const b = halfedges[a];
            /* if the pair of triangles doesn't satisfy the Delaunay condition
             * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
             * then do the same check/flip recursively for the new pair of triangles
             *
             *           pl                    pl
             *          /||\                  /  \
             *       al/ || \bl            al/    \a
             *        /  ||  \              /      \
             *       /  a||b  \    flip    /___ar___\
             *     p0\   ||   /p1   =>   p0\---bl---/p1
             *        \  ||  /              \      /
             *       ar\ || /br             b\    /br
             *          \||/                  \  /
             *           pr                    pr
             */ const a0 = a - a % 3;
            ar = a0 + (a + 2) % 3;
            if (b === -1) {
                if (i === 0) break;
                a = EDGE_STACK[--i];
                continue;
            }
            const b0 = b - b % 3;
            const al = a0 + (a + 1) % 3;
            const bl = b0 + (b + 2) % 3;
            const p0 = triangles[ar];
            const pr = triangles[a];
            const pl = triangles[al];
            const p1 = triangles[bl];
            const illegal = inCircle(coords1[2 * p0], coords1[2 * p0 + 1], coords1[2 * pr], coords1[2 * pr + 1], coords1[2 * pl], coords1[2 * pl + 1], coords1[2 * p1], coords1[2 * p1 + 1]);
            if (illegal) {
                triangles[a] = p1;
                triangles[b] = p0;
                const hbl = halfedges[bl];
                // edge swapped on the other side of the hull (rare); fix the halfedge reference
                if (hbl === -1) {
                    let e = this._hullStart;
                    do {
                        if (this._hullTri[e] === bl) {
                            this._hullTri[e] = a;
                            break;
                        }
                        e = this._hullPrev[e];
                    }while (e !== this._hullStart)
                }
                this._link(a, hbl);
                this._link(b, halfedges[ar]);
                this._link(ar, bl);
                const br = b0 + (b + 1) % 3;
                // don't worry about hitting the cap: it can only happen on extremely degenerate input
                if (i < EDGE_STACK.length) EDGE_STACK[i++] = br;
            } else {
                if (i === 0) break;
                a = EDGE_STACK[--i];
            }
        }
        return ar;
    }
    _link(a, b) {
        this._halfedges[a] = b;
        if (b !== -1) this._halfedges[b] = a;
    }
    // add a new triangle given vertex indices and adjacent half-edge ids
    _addTriangle(i0, i1, i2, a, b, c) {
        const t = this.trianglesLen;
        this._triangles[t] = i0;
        this._triangles[t + 1] = i1;
        this._triangles[t + 2] = i2;
        this._link(t, a);
        this._link(t + 1, b);
        this._link(t + 2, c);
        this.trianglesLen += 3;
        return t;
    }
}
exports.default = Delaunator;
// monotonically increases with real angle, but doesn't need expensive trigonometry
function pseudoAngle(dx, dy) {
    const p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
}
function dist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
}
function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    const dx = ax - px;
    const dy = ay - py;
    const ex = bx - px;
    const ey = by - py;
    const fx = cx - px;
    const fy = cy - py;
    const ap = dx * dx + dy * dy;
    const bp = ex * ex + ey * ey;
    const cp = fx * fx + fy * fy;
    return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
}
function circumradius(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;
    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);
    const x = (ey * bl - dy * cl) * d;
    const y = (dx * cl - ex * bl) * d;
    return x * x + y * y;
}
function circumcenter(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;
    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);
    const x = ax + (ey * bl - dy * cl) * d;
    const y = ay + (dx * cl - ex * bl) * d;
    return {
        x,
        y
    };
}
function quicksort(ids, dists, left, right) {
    if (right - left <= 20) for(let i = left + 1; i <= right; i++){
        const temp = ids[i];
        const tempDist = dists[temp];
        let j = i - 1;
        while(j >= left && dists[ids[j]] > tempDist)ids[j + 1] = ids[j--];
        ids[j + 1] = temp;
    }
    else {
        const median = left + right >> 1;
        let i1 = left + 1;
        let j = right;
        swap(ids, median, i1);
        if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
        if (dists[ids[i1]] > dists[ids[right]]) swap(ids, i1, right);
        if (dists[ids[left]] > dists[ids[i1]]) swap(ids, left, i1);
        const temp = ids[i1];
        const tempDist = dists[temp];
        while(true){
            do i1++;
            while (dists[ids[i1]] < tempDist)
            do j--;
            while (dists[ids[j]] > tempDist)
            if (j < i1) break;
            swap(ids, i1, j);
        }
        ids[left + 1] = ids[j];
        ids[j] = temp;
        if (right - i1 + 1 >= j - left) {
            quicksort(ids, dists, i1, right);
            quicksort(ids, dists, left, j - 1);
        } else {
            quicksort(ids, dists, left, j - 1);
            quicksort(ids, dists, i1, right);
        }
    }
}
function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
function defaultGetX(p) {
    return p[0];
}
function defaultGetY(p) {
    return p[1];
}

},{"robust-predicates":"ZPZIe","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"ZPZIe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "orient2d", ()=>_orient2DJs.orient2d
);
parcelHelpers.export(exports, "orient2dfast", ()=>_orient2DJs.orient2dfast
);
parcelHelpers.export(exports, "orient3d", ()=>_orient3DJs.orient3d
);
parcelHelpers.export(exports, "orient3dfast", ()=>_orient3DJs.orient3dfast
);
parcelHelpers.export(exports, "incircle", ()=>_incircleJs.incircle
);
parcelHelpers.export(exports, "incirclefast", ()=>_incircleJs.incirclefast
);
parcelHelpers.export(exports, "insphere", ()=>_insphereJs.insphere
);
parcelHelpers.export(exports, "inspherefast", ()=>_insphereJs.inspherefast
);
var _orient2DJs = require("./esm/orient2d.js");
var _orient3DJs = require("./esm/orient3d.js");
var _incircleJs = require("./esm/incircle.js");
var _insphereJs = require("./esm/insphere.js");

},{"./esm/orient2d.js":"NF2ZZ","./esm/orient3d.js":"44J5y","./esm/incircle.js":"3bEpT","./esm/insphere.js":"26r8a","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"NF2ZZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "orient2d", ()=>orient2d
);
parcelHelpers.export(exports, "orient2dfast", ()=>orient2dfast
);
var _utilJs = require("./util.js");
const ccwerrboundA = (3 + 16 * _utilJs.epsilon) * _utilJs.epsilon;
const ccwerrboundB = (2 + 12 * _utilJs.epsilon) * _utilJs.epsilon;
const ccwerrboundC = (9 + 64 * _utilJs.epsilon) * _utilJs.epsilon * _utilJs.epsilon;
const B = _utilJs.vec(4);
const C1 = _utilJs.vec(8);
const C2 = _utilJs.vec(12);
const D = _utilJs.vec(16);
const u = _utilJs.vec(4);
function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
    let acxtail, acytail, bcxtail, bcytail;
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;
    const acx = ax - cx;
    const bcx = bx - cx;
    const acy = ay - cy;
    const bcy = by - cy;
    s1 = acx * bcy;
    c = _utilJs.splitter * acx;
    ahi = c - (c - acx);
    alo = acx - ahi;
    c = _utilJs.splitter * bcy;
    bhi = c - (c - bcy);
    blo = bcy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = acy * bcx;
    c = _utilJs.splitter * acy;
    ahi = c - (c - acy);
    alo = acy - ahi;
    c = _utilJs.splitter * bcx;
    bhi = c - (c - bcx);
    blo = bcx - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    B[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    B[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    B[2] = _j - (u3 - bvirt) + (_i - bvirt);
    B[3] = u3;
    let det = _utilJs.estimate(4, B);
    let errbound = ccwerrboundB * detsum;
    if (det >= errbound || -det >= errbound) return det;
    bvirt = ax - acx;
    acxtail = ax - (acx + bvirt) + (bvirt - cx);
    bvirt = bx - bcx;
    bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
    bvirt = ay - acy;
    acytail = ay - (acy + bvirt) + (bvirt - cy);
    bvirt = by - bcy;
    bcytail = by - (bcy + bvirt) + (bvirt - cy);
    if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) return det;
    errbound = ccwerrboundC * detsum + _utilJs.resulterrbound * Math.abs(det);
    det += acx * bcytail + bcy * acxtail - (acy * bcxtail + bcx * acytail);
    if (det >= errbound || -det >= errbound) return det;
    s1 = acxtail * bcy;
    c = _utilJs.splitter * acxtail;
    ahi = c - (c - acxtail);
    alo = acxtail - ahi;
    c = _utilJs.splitter * bcy;
    bhi = c - (c - bcy);
    blo = bcy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = acytail * bcx;
    c = _utilJs.splitter * acytail;
    ahi = c - (c - acytail);
    alo = acytail - ahi;
    c = _utilJs.splitter * bcx;
    bhi = c - (c - bcx);
    blo = bcx - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    u[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    u[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    u[2] = _j - (u3 - bvirt) + (_i - bvirt);
    u[3] = u3;
    const C1len = _utilJs.sum(4, B, 4, u, C1);
    s1 = acx * bcytail;
    c = _utilJs.splitter * acx;
    ahi = c - (c - acx);
    alo = acx - ahi;
    c = _utilJs.splitter * bcytail;
    bhi = c - (c - bcytail);
    blo = bcytail - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = acy * bcxtail;
    c = _utilJs.splitter * acy;
    ahi = c - (c - acy);
    alo = acy - ahi;
    c = _utilJs.splitter * bcxtail;
    bhi = c - (c - bcxtail);
    blo = bcxtail - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    u[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    u[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    u[2] = _j - (u3 - bvirt) + (_i - bvirt);
    u[3] = u3;
    const C2len = _utilJs.sum(C1len, C1, 4, u, C2);
    s1 = acxtail * bcytail;
    c = _utilJs.splitter * acxtail;
    ahi = c - (c - acxtail);
    alo = acxtail - ahi;
    c = _utilJs.splitter * bcytail;
    bhi = c - (c - bcytail);
    blo = bcytail - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = acytail * bcxtail;
    c = _utilJs.splitter * acytail;
    ahi = c - (c - acytail);
    alo = acytail - ahi;
    c = _utilJs.splitter * bcxtail;
    bhi = c - (c - bcxtail);
    blo = bcxtail - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    u[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    u[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    u[2] = _j - (u3 - bvirt) + (_i - bvirt);
    u[3] = u3;
    const Dlen = _utilJs.sum(C2len, C2, 4, u, D);
    return D[Dlen - 1];
}
function orient2d(ax, ay, bx, by, cx, cy) {
    const detleft = (ay - cy) * (bx - cx);
    const detright = (ax - cx) * (by - cy);
    const det = detleft - detright;
    if (detleft === 0 || detright === 0 || detleft > 0 !== detright > 0) return det;
    const detsum = Math.abs(detleft + detright);
    if (Math.abs(det) >= ccwerrboundA * detsum) return det;
    return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
}
function orient2dfast(ax, ay, bx, by, cx, cy) {
    return (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);
}

},{"./util.js":"2IKZk","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"2IKZk":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "epsilon", ()=>epsilon
);
parcelHelpers.export(exports, "splitter", ()=>splitter
);
parcelHelpers.export(exports, "resulterrbound", ()=>resulterrbound
);
// fast_expansion_sum_zeroelim routine from oritinal code
parcelHelpers.export(exports, "sum", ()=>sum
);
parcelHelpers.export(exports, "sum_three", ()=>sum_three
);
// scale_expansion_zeroelim routine from oritinal code
parcelHelpers.export(exports, "scale", ()=>scale
);
parcelHelpers.export(exports, "negate", ()=>negate
);
parcelHelpers.export(exports, "estimate", ()=>estimate
);
parcelHelpers.export(exports, "vec", ()=>vec
);
const epsilon = 0.00000000000000011102230246251565;
const splitter = 134217729;
const resulterrbound = (3 + 8 * epsilon) * epsilon;
function sum(elen, e, flen, f, h) {
    let Q, Qnew, hh, bvirt;
    let enow = e[0];
    let fnow = f[0];
    let eindex = 0;
    let findex = 0;
    if (fnow > enow === fnow > -enow) {
        Q = enow;
        enow = e[++eindex];
    } else {
        Q = fnow;
        fnow = f[++findex];
    }
    let hindex = 0;
    if (eindex < elen && findex < flen) {
        if (fnow > enow === fnow > -enow) {
            Qnew = enow + Q;
            hh = Q - (Qnew - enow);
            enow = e[++eindex];
        } else {
            Qnew = fnow + Q;
            hh = Q - (Qnew - fnow);
            fnow = f[++findex];
        }
        Q = Qnew;
        if (hh !== 0) h[hindex++] = hh;
        while(eindex < elen && findex < flen){
            if (fnow > enow === fnow > -enow) {
                Qnew = Q + enow;
                bvirt = Qnew - Q;
                hh = Q - (Qnew - bvirt) + (enow - bvirt);
                enow = e[++eindex];
            } else {
                Qnew = Q + fnow;
                bvirt = Qnew - Q;
                hh = Q - (Qnew - bvirt) + (fnow - bvirt);
                fnow = f[++findex];
            }
            Q = Qnew;
            if (hh !== 0) h[hindex++] = hh;
        }
    }
    while(eindex < elen){
        Qnew = Q + enow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (enow - bvirt);
        enow = e[++eindex];
        Q = Qnew;
        if (hh !== 0) h[hindex++] = hh;
    }
    while(findex < flen){
        Qnew = Q + fnow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (fnow - bvirt);
        fnow = f[++findex];
        Q = Qnew;
        if (hh !== 0) h[hindex++] = hh;
    }
    if (Q !== 0 || hindex === 0) h[hindex++] = Q;
    return hindex;
}
function sum_three(alen, a, blen, b, clen, c, tmp, out) {
    return sum(sum(alen, a, blen, b, tmp), tmp, clen, c, out);
}
function scale(elen, e, b, h) {
    let Q, sum1, hh, product1, product0;
    let bvirt, c, ahi, alo, bhi, blo;
    c = splitter * b;
    bhi = c - (c - b);
    blo = b - bhi;
    let enow = e[0];
    Q = enow * b;
    c = splitter * enow;
    ahi = c - (c - enow);
    alo = enow - ahi;
    hh = alo * blo - (Q - ahi * bhi - alo * bhi - ahi * blo);
    let hindex = 0;
    if (hh !== 0) h[hindex++] = hh;
    for(let i = 1; i < elen; i++){
        enow = e[i];
        product1 = enow * b;
        c = splitter * enow;
        ahi = c - (c - enow);
        alo = enow - ahi;
        product0 = alo * blo - (product1 - ahi * bhi - alo * bhi - ahi * blo);
        sum1 = Q + product0;
        bvirt = sum1 - Q;
        hh = Q - (sum1 - bvirt) + (product0 - bvirt);
        if (hh !== 0) h[hindex++] = hh;
        Q = product1 + sum1;
        hh = sum1 - (Q - product1);
        if (hh !== 0) h[hindex++] = hh;
    }
    if (Q !== 0 || hindex === 0) h[hindex++] = Q;
    return hindex;
}
function negate(elen, e) {
    for(let i = 0; i < elen; i++)e[i] = -e[i];
    return elen;
}
function estimate(elen, e) {
    let Q = e[0];
    for(let i = 1; i < elen; i++)Q += e[i];
    return Q;
}
function vec(n) {
    return new Float64Array(n);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"44J5y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "orient3d", ()=>orient3d
);
parcelHelpers.export(exports, "orient3dfast", ()=>orient3dfast
);
var _utilJs = require("./util.js");
const o3derrboundA = (7 + 56 * _utilJs.epsilon) * _utilJs.epsilon;
const o3derrboundB = (3 + 28 * _utilJs.epsilon) * _utilJs.epsilon;
const o3derrboundC = (26 + 288 * _utilJs.epsilon) * _utilJs.epsilon * _utilJs.epsilon;
const bc = _utilJs.vec(4);
const ca = _utilJs.vec(4);
const ab = _utilJs.vec(4);
const at_b = _utilJs.vec(4);
const at_c = _utilJs.vec(4);
const bt_c = _utilJs.vec(4);
const bt_a = _utilJs.vec(4);
const ct_a = _utilJs.vec(4);
const ct_b = _utilJs.vec(4);
const bct = _utilJs.vec(8);
const cat = _utilJs.vec(8);
const abt = _utilJs.vec(8);
const u = _utilJs.vec(4);
const _8 = _utilJs.vec(8);
const _8b = _utilJs.vec(8);
const _16 = _utilJs.vec(8);
const _12 = _utilJs.vec(12);
let fin = _utilJs.vec(192);
let fin2 = _utilJs.vec(192);
function finadd(finlen, alen, a) {
    finlen = _utilJs.sum(finlen, fin, alen, a, fin2);
    const tmp = fin;
    fin = fin2;
    fin2 = tmp;
    return finlen;
}
function tailinit(xtail, ytail, ax, ay, bx, by, a, b) {
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, t1, t0, u3, negate;
    if (xtail === 0) {
        if (ytail === 0) {
            a[0] = 0;
            b[0] = 0;
            return 1;
        } else {
            negate = -ytail;
            s1 = negate * ax;
            c = _utilJs.splitter * negate;
            ahi = c - (c - negate);
            alo = negate - ahi;
            c = _utilJs.splitter * ax;
            bhi = c - (c - ax);
            blo = ax - bhi;
            a[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            a[1] = s1;
            s1 = ytail * bx;
            c = _utilJs.splitter * ytail;
            ahi = c - (c - ytail);
            alo = ytail - ahi;
            c = _utilJs.splitter * bx;
            bhi = c - (c - bx);
            blo = bx - bhi;
            b[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            b[1] = s1;
            return 2;
        }
    } else if (ytail === 0) {
        s1 = xtail * ay;
        c = _utilJs.splitter * xtail;
        ahi = c - (c - xtail);
        alo = xtail - ahi;
        c = _utilJs.splitter * ay;
        bhi = c - (c - ay);
        blo = ay - bhi;
        a[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        a[1] = s1;
        negate = -xtail;
        s1 = negate * by;
        c = _utilJs.splitter * negate;
        ahi = c - (c - negate);
        alo = negate - ahi;
        c = _utilJs.splitter * by;
        bhi = c - (c - by);
        blo = by - bhi;
        b[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        b[1] = s1;
        return 2;
    } else {
        s1 = xtail * ay;
        c = _utilJs.splitter * xtail;
        ahi = c - (c - xtail);
        alo = xtail - ahi;
        c = _utilJs.splitter * ay;
        bhi = c - (c - ay);
        blo = ay - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = ytail * ax;
        c = _utilJs.splitter * ytail;
        ahi = c - (c - ytail);
        alo = ytail - ahi;
        c = _utilJs.splitter * ax;
        bhi = c - (c - ax);
        blo = ax - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        a[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        a[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        a[2] = _j - (u3 - bvirt) + (_i - bvirt);
        a[3] = u3;
        s1 = ytail * bx;
        c = _utilJs.splitter * ytail;
        ahi = c - (c - ytail);
        alo = ytail - ahi;
        c = _utilJs.splitter * bx;
        bhi = c - (c - bx);
        blo = bx - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = xtail * by;
        c = _utilJs.splitter * xtail;
        ahi = c - (c - xtail);
        alo = xtail - ahi;
        c = _utilJs.splitter * by;
        bhi = c - (c - by);
        blo = by - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        b[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        b[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        b[2] = _j - (u3 - bvirt) + (_i - bvirt);
        b[3] = u3;
        return 4;
    }
}
function tailadd(finlen, a, b, k, z) {
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, u3;
    s1 = a * b;
    c = _utilJs.splitter * a;
    ahi = c - (c - a);
    alo = a - ahi;
    c = _utilJs.splitter * b;
    bhi = c - (c - b);
    blo = b - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    c = _utilJs.splitter * k;
    bhi = c - (c - k);
    blo = k - bhi;
    _i = s0 * k;
    c = _utilJs.splitter * s0;
    ahi = c - (c - s0);
    alo = s0 - ahi;
    u[0] = alo * blo - (_i - ahi * bhi - alo * bhi - ahi * blo);
    _j = s1 * k;
    c = _utilJs.splitter * s1;
    ahi = c - (c - s1);
    alo = s1 - ahi;
    _0 = alo * blo - (_j - ahi * bhi - alo * bhi - ahi * blo);
    _k = _i + _0;
    bvirt = _k - _i;
    u[1] = _i - (_k - bvirt) + (_0 - bvirt);
    u3 = _j + _k;
    u[2] = _k - (u3 - _j);
    u[3] = u3;
    finlen = finadd(finlen, 4, u);
    if (z !== 0) {
        c = _utilJs.splitter * z;
        bhi = c - (c - z);
        blo = z - bhi;
        _i = s0 * z;
        c = _utilJs.splitter * s0;
        ahi = c - (c - s0);
        alo = s0 - ahi;
        u[0] = alo * blo - (_i - ahi * bhi - alo * bhi - ahi * blo);
        _j = s1 * z;
        c = _utilJs.splitter * s1;
        ahi = c - (c - s1);
        alo = s1 - ahi;
        _0 = alo * blo - (_j - ahi * bhi - alo * bhi - ahi * blo);
        _k = _i + _0;
        bvirt = _k - _i;
        u[1] = _i - (_k - bvirt) + (_0 - bvirt);
        u3 = _j + _k;
        u[2] = _k - (u3 - _j);
        u[3] = u3;
        finlen = finadd(finlen, 4, u);
    }
    return finlen;
}
function orient3dadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, permanent) {
    let finlen;
    let adxtail, bdxtail, cdxtail;
    let adytail, bdytail, cdytail;
    let adztail, bdztail, cdztail;
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, t1, t0, u3;
    const adx = ax - dx;
    const bdx = bx - dx;
    const cdx = cx - dx;
    const ady = ay - dy;
    const bdy = by - dy;
    const cdy = cy - dy;
    const adz = az - dz;
    const bdz = bz - dz;
    const cdz = cz - dz;
    s1 = bdx * cdy;
    c = _utilJs.splitter * bdx;
    ahi = c - (c - bdx);
    alo = bdx - ahi;
    c = _utilJs.splitter * cdy;
    bhi = c - (c - cdy);
    blo = cdy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = cdx * bdy;
    c = _utilJs.splitter * cdx;
    ahi = c - (c - cdx);
    alo = cdx - ahi;
    c = _utilJs.splitter * bdy;
    bhi = c - (c - bdy);
    blo = bdy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    bc[2] = _j - (u3 - bvirt) + (_i - bvirt);
    bc[3] = u3;
    s1 = cdx * ady;
    c = _utilJs.splitter * cdx;
    ahi = c - (c - cdx);
    alo = cdx - ahi;
    c = _utilJs.splitter * ady;
    bhi = c - (c - ady);
    blo = ady - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = adx * cdy;
    c = _utilJs.splitter * adx;
    ahi = c - (c - adx);
    alo = adx - ahi;
    c = _utilJs.splitter * cdy;
    bhi = c - (c - cdy);
    blo = cdy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ca[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ca[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ca[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ca[3] = u3;
    s1 = adx * bdy;
    c = _utilJs.splitter * adx;
    ahi = c - (c - adx);
    alo = adx - ahi;
    c = _utilJs.splitter * bdy;
    bhi = c - (c - bdy);
    blo = bdy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = bdx * ady;
    c = _utilJs.splitter * bdx;
    ahi = c - (c - bdx);
    alo = bdx - ahi;
    c = _utilJs.splitter * ady;
    bhi = c - (c - ady);
    blo = ady - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ab[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ab[3] = u3;
    finlen = _utilJs.sum(_utilJs.sum(_utilJs.scale(4, bc, adz, _8), _8, _utilJs.scale(4, ca, bdz, _8b), _8b, _16), _16, _utilJs.scale(4, ab, cdz, _8), _8, fin);
    let det = _utilJs.estimate(finlen, fin);
    let errbound = o3derrboundB * permanent;
    if (det >= errbound || -det >= errbound) return det;
    bvirt = ax - adx;
    adxtail = ax - (adx + bvirt) + (bvirt - dx);
    bvirt = bx - bdx;
    bdxtail = bx - (bdx + bvirt) + (bvirt - dx);
    bvirt = cx - cdx;
    cdxtail = cx - (cdx + bvirt) + (bvirt - dx);
    bvirt = ay - ady;
    adytail = ay - (ady + bvirt) + (bvirt - dy);
    bvirt = by - bdy;
    bdytail = by - (bdy + bvirt) + (bvirt - dy);
    bvirt = cy - cdy;
    cdytail = cy - (cdy + bvirt) + (bvirt - dy);
    bvirt = az - adz;
    adztail = az - (adz + bvirt) + (bvirt - dz);
    bvirt = bz - bdz;
    bdztail = bz - (bdz + bvirt) + (bvirt - dz);
    bvirt = cz - cdz;
    cdztail = cz - (cdz + bvirt) + (bvirt - dz);
    if (adxtail === 0 && bdxtail === 0 && cdxtail === 0 && adytail === 0 && bdytail === 0 && cdytail === 0 && adztail === 0 && bdztail === 0 && cdztail === 0) return det;
    errbound = o3derrboundC * permanent + _utilJs.resulterrbound * Math.abs(det);
    det += adz * (bdx * cdytail + cdy * bdxtail - (bdy * cdxtail + cdx * bdytail)) + adztail * (bdx * cdy - bdy * cdx) + bdz * (cdx * adytail + ady * cdxtail - (cdy * adxtail + adx * cdytail)) + bdztail * (cdx * ady - cdy * adx) + cdz * (adx * bdytail + bdy * adxtail - (ady * bdxtail + bdx * adytail)) + cdztail * (adx * bdy - ady * bdx);
    if (det >= errbound || -det >= errbound) return det;
    const at_len = tailinit(adxtail, adytail, bdx, bdy, cdx, cdy, at_b, at_c);
    const bt_len = tailinit(bdxtail, bdytail, cdx, cdy, adx, ady, bt_c, bt_a);
    const ct_len = tailinit(cdxtail, cdytail, adx, ady, bdx, bdy, ct_a, ct_b);
    const bctlen = _utilJs.sum(bt_len, bt_c, ct_len, ct_b, bct);
    finlen = finadd(finlen, _utilJs.scale(bctlen, bct, adz, _16), _16);
    const catlen = _utilJs.sum(ct_len, ct_a, at_len, at_c, cat);
    finlen = finadd(finlen, _utilJs.scale(catlen, cat, bdz, _16), _16);
    const abtlen = _utilJs.sum(at_len, at_b, bt_len, bt_a, abt);
    finlen = finadd(finlen, _utilJs.scale(abtlen, abt, cdz, _16), _16);
    if (adztail !== 0) {
        finlen = finadd(finlen, _utilJs.scale(4, bc, adztail, _12), _12);
        finlen = finadd(finlen, _utilJs.scale(bctlen, bct, adztail, _16), _16);
    }
    if (bdztail !== 0) {
        finlen = finadd(finlen, _utilJs.scale(4, ca, bdztail, _12), _12);
        finlen = finadd(finlen, _utilJs.scale(catlen, cat, bdztail, _16), _16);
    }
    if (cdztail !== 0) {
        finlen = finadd(finlen, _utilJs.scale(4, ab, cdztail, _12), _12);
        finlen = finadd(finlen, _utilJs.scale(abtlen, abt, cdztail, _16), _16);
    }
    if (adxtail !== 0) {
        if (bdytail !== 0) finlen = tailadd(finlen, adxtail, bdytail, cdz, cdztail);
        if (cdytail !== 0) finlen = tailadd(finlen, -adxtail, cdytail, bdz, bdztail);
    }
    if (bdxtail !== 0) {
        if (cdytail !== 0) finlen = tailadd(finlen, bdxtail, cdytail, adz, adztail);
        if (adytail !== 0) finlen = tailadd(finlen, -bdxtail, adytail, cdz, cdztail);
    }
    if (cdxtail !== 0) {
        if (adytail !== 0) finlen = tailadd(finlen, cdxtail, adytail, bdz, bdztail);
        if (bdytail !== 0) finlen = tailadd(finlen, -cdxtail, bdytail, adz, adztail);
    }
    return fin[finlen - 1];
}
function orient3d(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) {
    const adx = ax - dx;
    const bdx = bx - dx;
    const cdx = cx - dx;
    const ady = ay - dy;
    const bdy = by - dy;
    const cdy = cy - dy;
    const adz = az - dz;
    const bdz = bz - dz;
    const cdz = cz - dz;
    const bdxcdy = bdx * cdy;
    const cdxbdy = cdx * bdy;
    const cdxady = cdx * ady;
    const adxcdy = adx * cdy;
    const adxbdy = adx * bdy;
    const bdxady = bdx * ady;
    const det = adz * (bdxcdy - cdxbdy) + bdz * (cdxady - adxcdy) + cdz * (adxbdy - bdxady);
    const permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz) + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz) + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
    const errbound = o3derrboundA * permanent;
    if (det > errbound || -det > errbound) return det;
    return orient3dadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, permanent);
}
function orient3dfast(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) {
    const adx = ax - dx;
    const bdx = bx - dx;
    const cdx = cx - dx;
    const ady = ay - dy;
    const bdy = by - dy;
    const cdy = cy - dy;
    const adz = az - dz;
    const bdz = bz - dz;
    const cdz = cz - dz;
    return adx * (bdy * cdz - bdz * cdy) + bdx * (cdy * adz - cdz * ady) + cdx * (ady * bdz - adz * bdy);
}

},{"./util.js":"2IKZk","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"3bEpT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "incircle", ()=>incircle
);
parcelHelpers.export(exports, "incirclefast", ()=>incirclefast
);
var _utilJs = require("./util.js");
const iccerrboundA = (10 + 96 * _utilJs.epsilon) * _utilJs.epsilon;
const iccerrboundB = (4 + 48 * _utilJs.epsilon) * _utilJs.epsilon;
const iccerrboundC = (44 + 576 * _utilJs.epsilon) * _utilJs.epsilon * _utilJs.epsilon;
const bc = _utilJs.vec(4);
const ca = _utilJs.vec(4);
const ab = _utilJs.vec(4);
const aa = _utilJs.vec(4);
const bb = _utilJs.vec(4);
const cc = _utilJs.vec(4);
const u = _utilJs.vec(4);
const v = _utilJs.vec(4);
const axtbc = _utilJs.vec(8);
const aytbc = _utilJs.vec(8);
const bxtca = _utilJs.vec(8);
const bytca = _utilJs.vec(8);
const cxtab = _utilJs.vec(8);
const cytab = _utilJs.vec(8);
const abt = _utilJs.vec(8);
const bct = _utilJs.vec(8);
const cat = _utilJs.vec(8);
const abtt = _utilJs.vec(4);
const bctt = _utilJs.vec(4);
const catt = _utilJs.vec(4);
const _8 = _utilJs.vec(8);
const _16 = _utilJs.vec(16);
const _16b = _utilJs.vec(16);
const _16c = _utilJs.vec(16);
const _32 = _utilJs.vec(32);
const _32b = _utilJs.vec(32);
const _48 = _utilJs.vec(48);
const _64 = _utilJs.vec(64);
let fin = _utilJs.vec(1152);
let fin2 = _utilJs.vec(1152);
function finadd(finlen, a, alen) {
    finlen = _utilJs.sum(finlen, fin, a, alen, fin2);
    const tmp = fin;
    fin = fin2;
    fin2 = tmp;
    return finlen;
}
function incircleadapt(ax, ay, bx, by, cx, cy, dx, dy, permanent) {
    let finlen;
    let adxtail, bdxtail, cdxtail, adytail, bdytail, cdytail;
    let axtbclen, aytbclen, bxtcalen, bytcalen, cxtablen, cytablen;
    let abtlen, bctlen, catlen;
    let abttlen, bcttlen, cattlen;
    let n1, n0;
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;
    const adx = ax - dx;
    const bdx = bx - dx;
    const cdx = cx - dx;
    const ady = ay - dy;
    const bdy = by - dy;
    const cdy = cy - dy;
    s1 = bdx * cdy;
    c = _utilJs.splitter * bdx;
    ahi = c - (c - bdx);
    alo = bdx - ahi;
    c = _utilJs.splitter * cdy;
    bhi = c - (c - cdy);
    blo = cdy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = cdx * bdy;
    c = _utilJs.splitter * cdx;
    ahi = c - (c - cdx);
    alo = cdx - ahi;
    c = _utilJs.splitter * bdy;
    bhi = c - (c - bdy);
    blo = bdy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    bc[2] = _j - (u3 - bvirt) + (_i - bvirt);
    bc[3] = u3;
    s1 = cdx * ady;
    c = _utilJs.splitter * cdx;
    ahi = c - (c - cdx);
    alo = cdx - ahi;
    c = _utilJs.splitter * ady;
    bhi = c - (c - ady);
    blo = ady - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = adx * cdy;
    c = _utilJs.splitter * adx;
    ahi = c - (c - adx);
    alo = adx - ahi;
    c = _utilJs.splitter * cdy;
    bhi = c - (c - cdy);
    blo = cdy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ca[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ca[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ca[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ca[3] = u3;
    s1 = adx * bdy;
    c = _utilJs.splitter * adx;
    ahi = c - (c - adx);
    alo = adx - ahi;
    c = _utilJs.splitter * bdy;
    bhi = c - (c - bdy);
    blo = bdy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = bdx * ady;
    c = _utilJs.splitter * bdx;
    ahi = c - (c - bdx);
    alo = bdx - ahi;
    c = _utilJs.splitter * ady;
    bhi = c - (c - ady);
    blo = ady - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ab[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ab[3] = u3;
    finlen = _utilJs.sum(_utilJs.sum(_utilJs.sum(_utilJs.scale(_utilJs.scale(4, bc, adx, _8), _8, adx, _16), _16, _utilJs.scale(_utilJs.scale(4, bc, ady, _8), _8, ady, _16b), _16b, _32), _32, _utilJs.sum(_utilJs.scale(_utilJs.scale(4, ca, bdx, _8), _8, bdx, _16), _16, _utilJs.scale(_utilJs.scale(4, ca, bdy, _8), _8, bdy, _16b), _16b, _32b), _32b, _64), _64, _utilJs.sum(_utilJs.scale(_utilJs.scale(4, ab, cdx, _8), _8, cdx, _16), _16, _utilJs.scale(_utilJs.scale(4, ab, cdy, _8), _8, cdy, _16b), _16b, _32), _32, fin);
    let det = _utilJs.estimate(finlen, fin);
    let errbound = iccerrboundB * permanent;
    if (det >= errbound || -det >= errbound) return det;
    bvirt = ax - adx;
    adxtail = ax - (adx + bvirt) + (bvirt - dx);
    bvirt = ay - ady;
    adytail = ay - (ady + bvirt) + (bvirt - dy);
    bvirt = bx - bdx;
    bdxtail = bx - (bdx + bvirt) + (bvirt - dx);
    bvirt = by - bdy;
    bdytail = by - (bdy + bvirt) + (bvirt - dy);
    bvirt = cx - cdx;
    cdxtail = cx - (cdx + bvirt) + (bvirt - dx);
    bvirt = cy - cdy;
    cdytail = cy - (cdy + bvirt) + (bvirt - dy);
    if (adxtail === 0 && bdxtail === 0 && cdxtail === 0 && adytail === 0 && bdytail === 0 && cdytail === 0) return det;
    errbound = iccerrboundC * permanent + _utilJs.resulterrbound * Math.abs(det);
    det += (adx * adx + ady * ady) * (bdx * cdytail + cdy * bdxtail - (bdy * cdxtail + cdx * bdytail)) + 2 * (adx * adxtail + ady * adytail) * (bdx * cdy - bdy * cdx) + ((bdx * bdx + bdy * bdy) * (cdx * adytail + ady * cdxtail - (cdy * adxtail + adx * cdytail)) + 2 * (bdx * bdxtail + bdy * bdytail) * (cdx * ady - cdy * adx)) + ((cdx * cdx + cdy * cdy) * (adx * bdytail + bdy * adxtail - (ady * bdxtail + bdx * adytail)) + 2 * (cdx * cdxtail + cdy * cdytail) * (adx * bdy - ady * bdx));
    if (det >= errbound || -det >= errbound) return det;
    if (bdxtail !== 0 || bdytail !== 0 || cdxtail !== 0 || cdytail !== 0) {
        s1 = adx * adx;
        c = _utilJs.splitter * adx;
        ahi = c - (c - adx);
        alo = adx - ahi;
        s0 = alo * alo - (s1 - ahi * ahi - (ahi + ahi) * alo);
        t1 = ady * ady;
        c = _utilJs.splitter * ady;
        ahi = c - (c - ady);
        alo = ady - ahi;
        t0 = alo * alo - (t1 - ahi * ahi - (ahi + ahi) * alo);
        _i = s0 + t0;
        bvirt = _i - s0;
        aa[0] = s0 - (_i - bvirt) + (t0 - bvirt);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 + t1;
        bvirt = _i - _0;
        aa[1] = _0 - (_i - bvirt) + (t1 - bvirt);
        u3 = _j + _i;
        bvirt = u3 - _j;
        aa[2] = _j - (u3 - bvirt) + (_i - bvirt);
        aa[3] = u3;
    }
    if (cdxtail !== 0 || cdytail !== 0 || adxtail !== 0 || adytail !== 0) {
        s1 = bdx * bdx;
        c = _utilJs.splitter * bdx;
        ahi = c - (c - bdx);
        alo = bdx - ahi;
        s0 = alo * alo - (s1 - ahi * ahi - (ahi + ahi) * alo);
        t1 = bdy * bdy;
        c = _utilJs.splitter * bdy;
        ahi = c - (c - bdy);
        alo = bdy - ahi;
        t0 = alo * alo - (t1 - ahi * ahi - (ahi + ahi) * alo);
        _i = s0 + t0;
        bvirt = _i - s0;
        bb[0] = s0 - (_i - bvirt) + (t0 - bvirt);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 + t1;
        bvirt = _i - _0;
        bb[1] = _0 - (_i - bvirt) + (t1 - bvirt);
        u3 = _j + _i;
        bvirt = u3 - _j;
        bb[2] = _j - (u3 - bvirt) + (_i - bvirt);
        bb[3] = u3;
    }
    if (adxtail !== 0 || adytail !== 0 || bdxtail !== 0 || bdytail !== 0) {
        s1 = cdx * cdx;
        c = _utilJs.splitter * cdx;
        ahi = c - (c - cdx);
        alo = cdx - ahi;
        s0 = alo * alo - (s1 - ahi * ahi - (ahi + ahi) * alo);
        t1 = cdy * cdy;
        c = _utilJs.splitter * cdy;
        ahi = c - (c - cdy);
        alo = cdy - ahi;
        t0 = alo * alo - (t1 - ahi * ahi - (ahi + ahi) * alo);
        _i = s0 + t0;
        bvirt = _i - s0;
        cc[0] = s0 - (_i - bvirt) + (t0 - bvirt);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 + t1;
        bvirt = _i - _0;
        cc[1] = _0 - (_i - bvirt) + (t1 - bvirt);
        u3 = _j + _i;
        bvirt = u3 - _j;
        cc[2] = _j - (u3 - bvirt) + (_i - bvirt);
        cc[3] = u3;
    }
    if (adxtail !== 0) {
        axtbclen = _utilJs.scale(4, bc, adxtail, axtbc);
        finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(axtbclen, axtbc, 2 * adx, _16), _16, _utilJs.scale(_utilJs.scale(4, cc, adxtail, _8), _8, bdy, _16b), _16b, _utilJs.scale(_utilJs.scale(4, bb, adxtail, _8), _8, -cdy, _16c), _16c, _32, _48), _48);
    }
    if (adytail !== 0) {
        aytbclen = _utilJs.scale(4, bc, adytail, aytbc);
        finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(aytbclen, aytbc, 2 * ady, _16), _16, _utilJs.scale(_utilJs.scale(4, bb, adytail, _8), _8, cdx, _16b), _16b, _utilJs.scale(_utilJs.scale(4, cc, adytail, _8), _8, -bdx, _16c), _16c, _32, _48), _48);
    }
    if (bdxtail !== 0) {
        bxtcalen = _utilJs.scale(4, ca, bdxtail, bxtca);
        finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(bxtcalen, bxtca, 2 * bdx, _16), _16, _utilJs.scale(_utilJs.scale(4, aa, bdxtail, _8), _8, cdy, _16b), _16b, _utilJs.scale(_utilJs.scale(4, cc, bdxtail, _8), _8, -ady, _16c), _16c, _32, _48), _48);
    }
    if (bdytail !== 0) {
        bytcalen = _utilJs.scale(4, ca, bdytail, bytca);
        finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(bytcalen, bytca, 2 * bdy, _16), _16, _utilJs.scale(_utilJs.scale(4, cc, bdytail, _8), _8, adx, _16b), _16b, _utilJs.scale(_utilJs.scale(4, aa, bdytail, _8), _8, -cdx, _16c), _16c, _32, _48), _48);
    }
    if (cdxtail !== 0) {
        cxtablen = _utilJs.scale(4, ab, cdxtail, cxtab);
        finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(cxtablen, cxtab, 2 * cdx, _16), _16, _utilJs.scale(_utilJs.scale(4, bb, cdxtail, _8), _8, ady, _16b), _16b, _utilJs.scale(_utilJs.scale(4, aa, cdxtail, _8), _8, -bdy, _16c), _16c, _32, _48), _48);
    }
    if (cdytail !== 0) {
        cytablen = _utilJs.scale(4, ab, cdytail, cytab);
        finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(cytablen, cytab, 2 * cdy, _16), _16, _utilJs.scale(_utilJs.scale(4, aa, cdytail, _8), _8, bdx, _16b), _16b, _utilJs.scale(_utilJs.scale(4, bb, cdytail, _8), _8, -adx, _16c), _16c, _32, _48), _48);
    }
    if (adxtail !== 0 || adytail !== 0) {
        if (bdxtail !== 0 || bdytail !== 0 || cdxtail !== 0 || cdytail !== 0) {
            s1 = bdxtail * cdy;
            c = _utilJs.splitter * bdxtail;
            ahi = c - (c - bdxtail);
            alo = bdxtail - ahi;
            c = _utilJs.splitter * cdy;
            bhi = c - (c - cdy);
            blo = cdy - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = bdx * cdytail;
            c = _utilJs.splitter * bdx;
            ahi = c - (c - bdx);
            alo = bdx - ahi;
            c = _utilJs.splitter * cdytail;
            bhi = c - (c - cdytail);
            blo = cdytail - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 + t0;
            bvirt = _i - s0;
            u[0] = s0 - (_i - bvirt) + (t0 - bvirt);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 + t1;
            bvirt = _i - _0;
            u[1] = _0 - (_i - bvirt) + (t1 - bvirt);
            u3 = _j + _i;
            bvirt = u3 - _j;
            u[2] = _j - (u3 - bvirt) + (_i - bvirt);
            u[3] = u3;
            s1 = cdxtail * -bdy;
            c = _utilJs.splitter * cdxtail;
            ahi = c - (c - cdxtail);
            alo = cdxtail - ahi;
            c = _utilJs.splitter * -bdy;
            bhi = c - (c - -bdy);
            blo = -bdy - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = cdx * -bdytail;
            c = _utilJs.splitter * cdx;
            ahi = c - (c - cdx);
            alo = cdx - ahi;
            c = _utilJs.splitter * -bdytail;
            bhi = c - (c - -bdytail);
            blo = -bdytail - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 + t0;
            bvirt = _i - s0;
            v[0] = s0 - (_i - bvirt) + (t0 - bvirt);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 + t1;
            bvirt = _i - _0;
            v[1] = _0 - (_i - bvirt) + (t1 - bvirt);
            u3 = _j + _i;
            bvirt = u3 - _j;
            v[2] = _j - (u3 - bvirt) + (_i - bvirt);
            v[3] = u3;
            bctlen = _utilJs.sum(4, u, 4, v, bct);
            s1 = bdxtail * cdytail;
            c = _utilJs.splitter * bdxtail;
            ahi = c - (c - bdxtail);
            alo = bdxtail - ahi;
            c = _utilJs.splitter * cdytail;
            bhi = c - (c - cdytail);
            blo = cdytail - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = cdxtail * bdytail;
            c = _utilJs.splitter * cdxtail;
            ahi = c - (c - cdxtail);
            alo = cdxtail - ahi;
            c = _utilJs.splitter * bdytail;
            bhi = c - (c - bdytail);
            blo = bdytail - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 - t0;
            bvirt = s0 - _i;
            bctt[0] = s0 - (_i + bvirt) + (bvirt - t0);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 - t1;
            bvirt = _0 - _i;
            bctt[1] = _0 - (_i + bvirt) + (bvirt - t1);
            u3 = _j + _i;
            bvirt = u3 - _j;
            bctt[2] = _j - (u3 - bvirt) + (_i - bvirt);
            bctt[3] = u3;
            bcttlen = 4;
        } else {
            bct[0] = 0;
            bctlen = 1;
            bctt[0] = 0;
            bcttlen = 1;
        }
        if (adxtail !== 0) {
            const len = _utilJs.scale(bctlen, bct, adxtail, _16c);
            finlen = finadd(finlen, _utilJs.sum(_utilJs.scale(axtbclen, axtbc, adxtail, _16), _16, _utilJs.scale(len, _16c, 2 * adx, _32), _32, _48), _48);
            const len2 = _utilJs.scale(bcttlen, bctt, adxtail, _8);
            finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(len2, _8, 2 * adx, _16), _16, _utilJs.scale(len2, _8, adxtail, _16b), _16b, _utilJs.scale(len, _16c, adxtail, _32), _32, _32b, _64), _64);
            if (bdytail !== 0) finlen = finadd(finlen, _utilJs.scale(_utilJs.scale(4, cc, adxtail, _8), _8, bdytail, _16), _16);
            if (cdytail !== 0) finlen = finadd(finlen, _utilJs.scale(_utilJs.scale(4, bb, -adxtail, _8), _8, cdytail, _16), _16);
        }
        if (adytail !== 0) {
            const len = _utilJs.scale(bctlen, bct, adytail, _16c);
            finlen = finadd(finlen, _utilJs.sum(_utilJs.scale(aytbclen, aytbc, adytail, _16), _16, _utilJs.scale(len, _16c, 2 * ady, _32), _32, _48), _48);
            const len2 = _utilJs.scale(bcttlen, bctt, adytail, _8);
            finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(len2, _8, 2 * ady, _16), _16, _utilJs.scale(len2, _8, adytail, _16b), _16b, _utilJs.scale(len, _16c, adytail, _32), _32, _32b, _64), _64);
        }
    }
    if (bdxtail !== 0 || bdytail !== 0) {
        if (cdxtail !== 0 || cdytail !== 0 || adxtail !== 0 || adytail !== 0) {
            s1 = cdxtail * ady;
            c = _utilJs.splitter * cdxtail;
            ahi = c - (c - cdxtail);
            alo = cdxtail - ahi;
            c = _utilJs.splitter * ady;
            bhi = c - (c - ady);
            blo = ady - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = cdx * adytail;
            c = _utilJs.splitter * cdx;
            ahi = c - (c - cdx);
            alo = cdx - ahi;
            c = _utilJs.splitter * adytail;
            bhi = c - (c - adytail);
            blo = adytail - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 + t0;
            bvirt = _i - s0;
            u[0] = s0 - (_i - bvirt) + (t0 - bvirt);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 + t1;
            bvirt = _i - _0;
            u[1] = _0 - (_i - bvirt) + (t1 - bvirt);
            u3 = _j + _i;
            bvirt = u3 - _j;
            u[2] = _j - (u3 - bvirt) + (_i - bvirt);
            u[3] = u3;
            n1 = -cdy;
            n0 = -cdytail;
            s1 = adxtail * n1;
            c = _utilJs.splitter * adxtail;
            ahi = c - (c - adxtail);
            alo = adxtail - ahi;
            c = _utilJs.splitter * n1;
            bhi = c - (c - n1);
            blo = n1 - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = adx * n0;
            c = _utilJs.splitter * adx;
            ahi = c - (c - adx);
            alo = adx - ahi;
            c = _utilJs.splitter * n0;
            bhi = c - (c - n0);
            blo = n0 - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 + t0;
            bvirt = _i - s0;
            v[0] = s0 - (_i - bvirt) + (t0 - bvirt);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 + t1;
            bvirt = _i - _0;
            v[1] = _0 - (_i - bvirt) + (t1 - bvirt);
            u3 = _j + _i;
            bvirt = u3 - _j;
            v[2] = _j - (u3 - bvirt) + (_i - bvirt);
            v[3] = u3;
            catlen = _utilJs.sum(4, u, 4, v, cat);
            s1 = cdxtail * adytail;
            c = _utilJs.splitter * cdxtail;
            ahi = c - (c - cdxtail);
            alo = cdxtail - ahi;
            c = _utilJs.splitter * adytail;
            bhi = c - (c - adytail);
            blo = adytail - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = adxtail * cdytail;
            c = _utilJs.splitter * adxtail;
            ahi = c - (c - adxtail);
            alo = adxtail - ahi;
            c = _utilJs.splitter * cdytail;
            bhi = c - (c - cdytail);
            blo = cdytail - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 - t0;
            bvirt = s0 - _i;
            catt[0] = s0 - (_i + bvirt) + (bvirt - t0);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 - t1;
            bvirt = _0 - _i;
            catt[1] = _0 - (_i + bvirt) + (bvirt - t1);
            u3 = _j + _i;
            bvirt = u3 - _j;
            catt[2] = _j - (u3 - bvirt) + (_i - bvirt);
            catt[3] = u3;
            cattlen = 4;
        } else {
            cat[0] = 0;
            catlen = 1;
            catt[0] = 0;
            cattlen = 1;
        }
        if (bdxtail !== 0) {
            const len = _utilJs.scale(catlen, cat, bdxtail, _16c);
            finlen = finadd(finlen, _utilJs.sum(_utilJs.scale(bxtcalen, bxtca, bdxtail, _16), _16, _utilJs.scale(len, _16c, 2 * bdx, _32), _32, _48), _48);
            const len2 = _utilJs.scale(cattlen, catt, bdxtail, _8);
            finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(len2, _8, 2 * bdx, _16), _16, _utilJs.scale(len2, _8, bdxtail, _16b), _16b, _utilJs.scale(len, _16c, bdxtail, _32), _32, _32b, _64), _64);
            if (cdytail !== 0) finlen = finadd(finlen, _utilJs.scale(_utilJs.scale(4, aa, bdxtail, _8), _8, cdytail, _16), _16);
            if (adytail !== 0) finlen = finadd(finlen, _utilJs.scale(_utilJs.scale(4, cc, -bdxtail, _8), _8, adytail, _16), _16);
        }
        if (bdytail !== 0) {
            const len = _utilJs.scale(catlen, cat, bdytail, _16c);
            finlen = finadd(finlen, _utilJs.sum(_utilJs.scale(bytcalen, bytca, bdytail, _16), _16, _utilJs.scale(len, _16c, 2 * bdy, _32), _32, _48), _48);
            const len2 = _utilJs.scale(cattlen, catt, bdytail, _8);
            finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(len2, _8, 2 * bdy, _16), _16, _utilJs.scale(len2, _8, bdytail, _16b), _16b, _utilJs.scale(len, _16c, bdytail, _32), _32, _32b, _64), _64);
        }
    }
    if (cdxtail !== 0 || cdytail !== 0) {
        if (adxtail !== 0 || adytail !== 0 || bdxtail !== 0 || bdytail !== 0) {
            s1 = adxtail * bdy;
            c = _utilJs.splitter * adxtail;
            ahi = c - (c - adxtail);
            alo = adxtail - ahi;
            c = _utilJs.splitter * bdy;
            bhi = c - (c - bdy);
            blo = bdy - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = adx * bdytail;
            c = _utilJs.splitter * adx;
            ahi = c - (c - adx);
            alo = adx - ahi;
            c = _utilJs.splitter * bdytail;
            bhi = c - (c - bdytail);
            blo = bdytail - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 + t0;
            bvirt = _i - s0;
            u[0] = s0 - (_i - bvirt) + (t0 - bvirt);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 + t1;
            bvirt = _i - _0;
            u[1] = _0 - (_i - bvirt) + (t1 - bvirt);
            u3 = _j + _i;
            bvirt = u3 - _j;
            u[2] = _j - (u3 - bvirt) + (_i - bvirt);
            u[3] = u3;
            n1 = -ady;
            n0 = -adytail;
            s1 = bdxtail * n1;
            c = _utilJs.splitter * bdxtail;
            ahi = c - (c - bdxtail);
            alo = bdxtail - ahi;
            c = _utilJs.splitter * n1;
            bhi = c - (c - n1);
            blo = n1 - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = bdx * n0;
            c = _utilJs.splitter * bdx;
            ahi = c - (c - bdx);
            alo = bdx - ahi;
            c = _utilJs.splitter * n0;
            bhi = c - (c - n0);
            blo = n0 - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 + t0;
            bvirt = _i - s0;
            v[0] = s0 - (_i - bvirt) + (t0 - bvirt);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 + t1;
            bvirt = _i - _0;
            v[1] = _0 - (_i - bvirt) + (t1 - bvirt);
            u3 = _j + _i;
            bvirt = u3 - _j;
            v[2] = _j - (u3 - bvirt) + (_i - bvirt);
            v[3] = u3;
            abtlen = _utilJs.sum(4, u, 4, v, abt);
            s1 = adxtail * bdytail;
            c = _utilJs.splitter * adxtail;
            ahi = c - (c - adxtail);
            alo = adxtail - ahi;
            c = _utilJs.splitter * bdytail;
            bhi = c - (c - bdytail);
            blo = bdytail - bhi;
            s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
            t1 = bdxtail * adytail;
            c = _utilJs.splitter * bdxtail;
            ahi = c - (c - bdxtail);
            alo = bdxtail - ahi;
            c = _utilJs.splitter * adytail;
            bhi = c - (c - adytail);
            blo = adytail - bhi;
            t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
            _i = s0 - t0;
            bvirt = s0 - _i;
            abtt[0] = s0 - (_i + bvirt) + (bvirt - t0);
            _j = s1 + _i;
            bvirt = _j - s1;
            _0 = s1 - (_j - bvirt) + (_i - bvirt);
            _i = _0 - t1;
            bvirt = _0 - _i;
            abtt[1] = _0 - (_i + bvirt) + (bvirt - t1);
            u3 = _j + _i;
            bvirt = u3 - _j;
            abtt[2] = _j - (u3 - bvirt) + (_i - bvirt);
            abtt[3] = u3;
            abttlen = 4;
        } else {
            abt[0] = 0;
            abtlen = 1;
            abtt[0] = 0;
            abttlen = 1;
        }
        if (cdxtail !== 0) {
            const len = _utilJs.scale(abtlen, abt, cdxtail, _16c);
            finlen = finadd(finlen, _utilJs.sum(_utilJs.scale(cxtablen, cxtab, cdxtail, _16), _16, _utilJs.scale(len, _16c, 2 * cdx, _32), _32, _48), _48);
            const len2 = _utilJs.scale(abttlen, abtt, cdxtail, _8);
            finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(len2, _8, 2 * cdx, _16), _16, _utilJs.scale(len2, _8, cdxtail, _16b), _16b, _utilJs.scale(len, _16c, cdxtail, _32), _32, _32b, _64), _64);
            if (adytail !== 0) finlen = finadd(finlen, _utilJs.scale(_utilJs.scale(4, bb, cdxtail, _8), _8, adytail, _16), _16);
            if (bdytail !== 0) finlen = finadd(finlen, _utilJs.scale(_utilJs.scale(4, aa, -cdxtail, _8), _8, bdytail, _16), _16);
        }
        if (cdytail !== 0) {
            const len = _utilJs.scale(abtlen, abt, cdytail, _16c);
            finlen = finadd(finlen, _utilJs.sum(_utilJs.scale(cytablen, cytab, cdytail, _16), _16, _utilJs.scale(len, _16c, 2 * cdy, _32), _32, _48), _48);
            const len2 = _utilJs.scale(abttlen, abtt, cdytail, _8);
            finlen = finadd(finlen, _utilJs.sum_three(_utilJs.scale(len2, _8, 2 * cdy, _16), _16, _utilJs.scale(len2, _8, cdytail, _16b), _16b, _utilJs.scale(len, _16c, cdytail, _32), _32, _32b, _64), _64);
        }
    }
    return fin[finlen - 1];
}
function incircle(ax, ay, bx, by, cx, cy, dx, dy) {
    const adx = ax - dx;
    const bdx = bx - dx;
    const cdx = cx - dx;
    const ady = ay - dy;
    const bdy = by - dy;
    const cdy = cy - dy;
    const bdxcdy = bdx * cdy;
    const cdxbdy = cdx * bdy;
    const alift = adx * adx + ady * ady;
    const cdxady = cdx * ady;
    const adxcdy = adx * cdy;
    const blift = bdx * bdx + bdy * bdy;
    const adxbdy = adx * bdy;
    const bdxady = bdx * ady;
    const clift = cdx * cdx + cdy * cdy;
    const det = alift * (bdxcdy - cdxbdy) + blift * (cdxady - adxcdy) + clift * (adxbdy - bdxady);
    const permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * alift + (Math.abs(cdxady) + Math.abs(adxcdy)) * blift + (Math.abs(adxbdy) + Math.abs(bdxady)) * clift;
    const errbound = iccerrboundA * permanent;
    if (det > errbound || -det > errbound) return det;
    return incircleadapt(ax, ay, bx, by, cx, cy, dx, dy, permanent);
}
function incirclefast(ax, ay, bx, by, cx, cy, dx, dy) {
    const adx = ax - dx;
    const ady = ay - dy;
    const bdx = bx - dx;
    const bdy = by - dy;
    const cdx = cx - dx;
    const cdy = cy - dy;
    const abdet = adx * bdy - bdx * ady;
    const bcdet = bdx * cdy - cdx * bdy;
    const cadet = cdx * ady - adx * cdy;
    const alift = adx * adx + ady * ady;
    const blift = bdx * bdx + bdy * bdy;
    const clift = cdx * cdx + cdy * cdy;
    return alift * bcdet + blift * cadet + clift * abdet;
}

},{"./util.js":"2IKZk","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"26r8a":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "insphere", ()=>insphere
);
parcelHelpers.export(exports, "inspherefast", ()=>inspherefast
);
var _utilJs = require("./util.js");
const isperrboundA = (16 + 224 * _utilJs.epsilon) * _utilJs.epsilon;
const isperrboundB = (5 + 72 * _utilJs.epsilon) * _utilJs.epsilon;
const isperrboundC = (71 + 1408 * _utilJs.epsilon) * _utilJs.epsilon * _utilJs.epsilon;
const ab = _utilJs.vec(4);
const bc = _utilJs.vec(4);
const cd = _utilJs.vec(4);
const de = _utilJs.vec(4);
const ea = _utilJs.vec(4);
const ac = _utilJs.vec(4);
const bd = _utilJs.vec(4);
const ce = _utilJs.vec(4);
const da = _utilJs.vec(4);
const eb = _utilJs.vec(4);
const abc = _utilJs.vec(24);
const bcd = _utilJs.vec(24);
const cde = _utilJs.vec(24);
const dea = _utilJs.vec(24);
const eab = _utilJs.vec(24);
const abd = _utilJs.vec(24);
const bce = _utilJs.vec(24);
const cda = _utilJs.vec(24);
const deb = _utilJs.vec(24);
const eac = _utilJs.vec(24);
const adet = _utilJs.vec(1152);
const bdet = _utilJs.vec(1152);
const cdet = _utilJs.vec(1152);
const ddet = _utilJs.vec(1152);
const edet = _utilJs.vec(1152);
const abdet = _utilJs.vec(2304);
const cddet = _utilJs.vec(2304);
const cdedet = _utilJs.vec(3456);
const deter = _utilJs.vec(5760);
const _8 = _utilJs.vec(8);
const _8b = _utilJs.vec(8);
const _8c = _utilJs.vec(8);
const _16 = _utilJs.vec(16);
const _24 = _utilJs.vec(24);
const _48 = _utilJs.vec(48);
const _48b = _utilJs.vec(48);
const _96 = _utilJs.vec(96);
const _192 = _utilJs.vec(192);
const _384x = _utilJs.vec(384);
const _384y = _utilJs.vec(384);
const _384z = _utilJs.vec(384);
const _768 = _utilJs.vec(768);
function sum_three_scale(a, b, c, az, bz, cz, out) {
    return _utilJs.sum_three(_utilJs.scale(4, a, az, _8), _8, _utilJs.scale(4, b, bz, _8b), _8b, _utilJs.scale(4, c, cz, _8c), _8c, _16, out);
}
function liftexact(alen, a, blen, b, clen, c, dlen, d, x, y, z, out) {
    const len = _utilJs.sum(_utilJs.sum(alen, a, blen, b, _48), _48, _utilJs.negate(_utilJs.sum(clen, c, dlen, d, _48b), _48b), _48b, _96);
    return _utilJs.sum_three(_utilJs.scale(_utilJs.scale(len, _96, x, _192), _192, x, _384x), _384x, _utilJs.scale(_utilJs.scale(len, _96, y, _192), _192, y, _384y), _384y, _utilJs.scale(_utilJs.scale(len, _96, z, _192), _192, z, _384z), _384z, _768, out);
}
function insphereexact(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez) {
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;
    s1 = ax * by;
    c = _utilJs.splitter * ax;
    ahi = c - (c - ax);
    alo = ax - ahi;
    c = _utilJs.splitter * by;
    bhi = c - (c - by);
    blo = by - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = bx * ay;
    c = _utilJs.splitter * bx;
    ahi = c - (c - bx);
    alo = bx - ahi;
    c = _utilJs.splitter * ay;
    bhi = c - (c - ay);
    blo = ay - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ab[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ab[3] = u3;
    s1 = bx * cy;
    c = _utilJs.splitter * bx;
    ahi = c - (c - bx);
    alo = bx - ahi;
    c = _utilJs.splitter * cy;
    bhi = c - (c - cy);
    blo = cy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = cx * by;
    c = _utilJs.splitter * cx;
    ahi = c - (c - cx);
    alo = cx - ahi;
    c = _utilJs.splitter * by;
    bhi = c - (c - by);
    blo = by - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    bc[2] = _j - (u3 - bvirt) + (_i - bvirt);
    bc[3] = u3;
    s1 = cx * dy;
    c = _utilJs.splitter * cx;
    ahi = c - (c - cx);
    alo = cx - ahi;
    c = _utilJs.splitter * dy;
    bhi = c - (c - dy);
    blo = dy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = dx * cy;
    c = _utilJs.splitter * dx;
    ahi = c - (c - dx);
    alo = dx - ahi;
    c = _utilJs.splitter * cy;
    bhi = c - (c - cy);
    blo = cy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    cd[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    cd[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    cd[2] = _j - (u3 - bvirt) + (_i - bvirt);
    cd[3] = u3;
    s1 = dx * ey;
    c = _utilJs.splitter * dx;
    ahi = c - (c - dx);
    alo = dx - ahi;
    c = _utilJs.splitter * ey;
    bhi = c - (c - ey);
    blo = ey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = ex * dy;
    c = _utilJs.splitter * ex;
    ahi = c - (c - ex);
    alo = ex - ahi;
    c = _utilJs.splitter * dy;
    bhi = c - (c - dy);
    blo = dy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    de[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    de[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    de[2] = _j - (u3 - bvirt) + (_i - bvirt);
    de[3] = u3;
    s1 = ex * ay;
    c = _utilJs.splitter * ex;
    ahi = c - (c - ex);
    alo = ex - ahi;
    c = _utilJs.splitter * ay;
    bhi = c - (c - ay);
    blo = ay - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = ax * ey;
    c = _utilJs.splitter * ax;
    ahi = c - (c - ax);
    alo = ax - ahi;
    c = _utilJs.splitter * ey;
    bhi = c - (c - ey);
    blo = ey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ea[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ea[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ea[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ea[3] = u3;
    s1 = ax * cy;
    c = _utilJs.splitter * ax;
    ahi = c - (c - ax);
    alo = ax - ahi;
    c = _utilJs.splitter * cy;
    bhi = c - (c - cy);
    blo = cy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = cx * ay;
    c = _utilJs.splitter * cx;
    ahi = c - (c - cx);
    alo = cx - ahi;
    c = _utilJs.splitter * ay;
    bhi = c - (c - ay);
    blo = ay - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ac[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ac[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ac[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ac[3] = u3;
    s1 = bx * dy;
    c = _utilJs.splitter * bx;
    ahi = c - (c - bx);
    alo = bx - ahi;
    c = _utilJs.splitter * dy;
    bhi = c - (c - dy);
    blo = dy - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = dx * by;
    c = _utilJs.splitter * dx;
    ahi = c - (c - dx);
    alo = dx - ahi;
    c = _utilJs.splitter * by;
    bhi = c - (c - by);
    blo = by - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    bd[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    bd[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    bd[2] = _j - (u3 - bvirt) + (_i - bvirt);
    bd[3] = u3;
    s1 = cx * ey;
    c = _utilJs.splitter * cx;
    ahi = c - (c - cx);
    alo = cx - ahi;
    c = _utilJs.splitter * ey;
    bhi = c - (c - ey);
    blo = ey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = ex * cy;
    c = _utilJs.splitter * ex;
    ahi = c - (c - ex);
    alo = ex - ahi;
    c = _utilJs.splitter * cy;
    bhi = c - (c - cy);
    blo = cy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ce[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ce[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    ce[2] = _j - (u3 - bvirt) + (_i - bvirt);
    ce[3] = u3;
    s1 = dx * ay;
    c = _utilJs.splitter * dx;
    ahi = c - (c - dx);
    alo = dx - ahi;
    c = _utilJs.splitter * ay;
    bhi = c - (c - ay);
    blo = ay - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = ax * dy;
    c = _utilJs.splitter * ax;
    ahi = c - (c - ax);
    alo = ax - ahi;
    c = _utilJs.splitter * dy;
    bhi = c - (c - dy);
    blo = dy - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    da[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    da[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    da[2] = _j - (u3 - bvirt) + (_i - bvirt);
    da[3] = u3;
    s1 = ex * by;
    c = _utilJs.splitter * ex;
    ahi = c - (c - ex);
    alo = ex - ahi;
    c = _utilJs.splitter * by;
    bhi = c - (c - by);
    blo = by - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = bx * ey;
    c = _utilJs.splitter * bx;
    ahi = c - (c - bx);
    alo = bx - ahi;
    c = _utilJs.splitter * ey;
    bhi = c - (c - ey);
    blo = ey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    eb[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    eb[1] = _0 - (_i + bvirt) + (bvirt - t1);
    u3 = _j + _i;
    bvirt = u3 - _j;
    eb[2] = _j - (u3 - bvirt) + (_i - bvirt);
    eb[3] = u3;
    const abclen = sum_three_scale(ab, bc, ac, cz, az, -bz, abc);
    const bcdlen = sum_three_scale(bc, cd, bd, dz, bz, -cz, bcd);
    const cdelen = sum_three_scale(cd, de, ce, ez, cz, -dz, cde);
    const dealen = sum_three_scale(de, ea, da, az, dz, -ez, dea);
    const eablen = sum_three_scale(ea, ab, eb, bz, ez, -az, eab);
    const abdlen = sum_three_scale(ab, bd, da, dz, az, bz, abd);
    const bcelen = sum_three_scale(bc, ce, eb, ez, bz, cz, bce);
    const cdalen = sum_three_scale(cd, da, ac, az, cz, dz, cda);
    const deblen = sum_three_scale(de, eb, bd, bz, dz, ez, deb);
    const eaclen = sum_three_scale(ea, ac, ce, cz, ez, az, eac);
    const deterlen = _utilJs.sum_three(liftexact(cdelen, cde, bcelen, bce, deblen, deb, bcdlen, bcd, ax, ay, az, adet), adet, liftexact(dealen, dea, cdalen, cda, eaclen, eac, cdelen, cde, bx, by, bz, bdet), bdet, _utilJs.sum_three(liftexact(eablen, eab, deblen, deb, abdlen, abd, dealen, dea, cx, cy, cz, cdet), cdet, liftexact(abclen, abc, eaclen, eac, bcelen, bce, eablen, eab, dx, dy, dz, ddet), ddet, liftexact(bcdlen, bcd, abdlen, abd, cdalen, cda, abclen, abc, ex, ey, ez, edet), edet, cddet, cdedet), cdedet, abdet, deter);
    return deter[deterlen - 1];
}
const xdet = _utilJs.vec(96);
const ydet = _utilJs.vec(96);
const zdet = _utilJs.vec(96);
const fin = _utilJs.vec(1152);
function liftadapt(a, b, c, az, bz, cz, x, y, z, out) {
    const len = sum_three_scale(a, b, c, az, bz, cz, _24);
    return _utilJs.sum_three(_utilJs.scale(_utilJs.scale(len, _24, x, _48), _48, x, xdet), xdet, _utilJs.scale(_utilJs.scale(len, _24, y, _48), _48, y, ydet), ydet, _utilJs.scale(_utilJs.scale(len, _24, z, _48), _48, z, zdet), zdet, _192, out);
}
function insphereadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez, permanent) {
    let ab3, bc3, cd3, da3, ac3, bd3;
    let aextail, bextail, cextail, dextail;
    let aeytail, beytail, ceytail, deytail;
    let aeztail, beztail, ceztail, deztail;
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0;
    const aex = ax - ex;
    const bex = bx - ex;
    const cex = cx - ex;
    const dex = dx - ex;
    const aey = ay - ey;
    const bey = by - ey;
    const cey = cy - ey;
    const dey = dy - ey;
    const aez = az - ez;
    const bez = bz - ez;
    const cez = cz - ez;
    const dez = dz - ez;
    s1 = aex * bey;
    c = _utilJs.splitter * aex;
    ahi = c - (c - aex);
    alo = aex - ahi;
    c = _utilJs.splitter * bey;
    bhi = c - (c - bey);
    blo = bey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = bex * aey;
    c = _utilJs.splitter * bex;
    ahi = c - (c - bex);
    alo = bex - ahi;
    c = _utilJs.splitter * aey;
    bhi = c - (c - aey);
    blo = aey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
    ab3 = _j + _i;
    bvirt = ab3 - _j;
    ab[2] = _j - (ab3 - bvirt) + (_i - bvirt);
    ab[3] = ab3;
    s1 = bex * cey;
    c = _utilJs.splitter * bex;
    ahi = c - (c - bex);
    alo = bex - ahi;
    c = _utilJs.splitter * cey;
    bhi = c - (c - cey);
    blo = cey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = cex * bey;
    c = _utilJs.splitter * cex;
    ahi = c - (c - cex);
    alo = cex - ahi;
    c = _utilJs.splitter * bey;
    bhi = c - (c - bey);
    blo = bey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
    bc3 = _j + _i;
    bvirt = bc3 - _j;
    bc[2] = _j - (bc3 - bvirt) + (_i - bvirt);
    bc[3] = bc3;
    s1 = cex * dey;
    c = _utilJs.splitter * cex;
    ahi = c - (c - cex);
    alo = cex - ahi;
    c = _utilJs.splitter * dey;
    bhi = c - (c - dey);
    blo = dey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = dex * cey;
    c = _utilJs.splitter * dex;
    ahi = c - (c - dex);
    alo = dex - ahi;
    c = _utilJs.splitter * cey;
    bhi = c - (c - cey);
    blo = cey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    cd[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    cd[1] = _0 - (_i + bvirt) + (bvirt - t1);
    cd3 = _j + _i;
    bvirt = cd3 - _j;
    cd[2] = _j - (cd3 - bvirt) + (_i - bvirt);
    cd[3] = cd3;
    s1 = dex * aey;
    c = _utilJs.splitter * dex;
    ahi = c - (c - dex);
    alo = dex - ahi;
    c = _utilJs.splitter * aey;
    bhi = c - (c - aey);
    blo = aey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = aex * dey;
    c = _utilJs.splitter * aex;
    ahi = c - (c - aex);
    alo = aex - ahi;
    c = _utilJs.splitter * dey;
    bhi = c - (c - dey);
    blo = dey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    da[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    da[1] = _0 - (_i + bvirt) + (bvirt - t1);
    da3 = _j + _i;
    bvirt = da3 - _j;
    da[2] = _j - (da3 - bvirt) + (_i - bvirt);
    da[3] = da3;
    s1 = aex * cey;
    c = _utilJs.splitter * aex;
    ahi = c - (c - aex);
    alo = aex - ahi;
    c = _utilJs.splitter * cey;
    bhi = c - (c - cey);
    blo = cey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = cex * aey;
    c = _utilJs.splitter * cex;
    ahi = c - (c - cex);
    alo = cex - ahi;
    c = _utilJs.splitter * aey;
    bhi = c - (c - aey);
    blo = aey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    ac[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    ac[1] = _0 - (_i + bvirt) + (bvirt - t1);
    ac3 = _j + _i;
    bvirt = ac3 - _j;
    ac[2] = _j - (ac3 - bvirt) + (_i - bvirt);
    ac[3] = ac3;
    s1 = bex * dey;
    c = _utilJs.splitter * bex;
    ahi = c - (c - bex);
    alo = bex - ahi;
    c = _utilJs.splitter * dey;
    bhi = c - (c - dey);
    blo = dey - bhi;
    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
    t1 = dex * bey;
    c = _utilJs.splitter * dex;
    ahi = c - (c - dex);
    alo = dex - ahi;
    c = _utilJs.splitter * bey;
    bhi = c - (c - bey);
    blo = bey - bhi;
    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
    _i = s0 - t0;
    bvirt = s0 - _i;
    bd[0] = s0 - (_i + bvirt) + (bvirt - t0);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 - t1;
    bvirt = _0 - _i;
    bd[1] = _0 - (_i + bvirt) + (bvirt - t1);
    bd3 = _j + _i;
    bvirt = bd3 - _j;
    bd[2] = _j - (bd3 - bvirt) + (_i - bvirt);
    bd[3] = bd3;
    const finlen = _utilJs.sum(_utilJs.sum(_utilJs.negate(liftadapt(bc, cd, bd, dez, bez, -cez, aex, aey, aez, adet), adet), adet, liftadapt(cd, da, ac, aez, cez, dez, bex, bey, bez, bdet), bdet, abdet), abdet, _utilJs.sum(_utilJs.negate(liftadapt(da, ab, bd, bez, dez, aez, cex, cey, cez, cdet), cdet), cdet, liftadapt(ab, bc, ac, cez, aez, -bez, dex, dey, dez, ddet), ddet, cddet), cddet, fin);
    let det = _utilJs.estimate(finlen, fin);
    let errbound = isperrboundB * permanent;
    if (det >= errbound || -det >= errbound) return det;
    bvirt = ax - aex;
    aextail = ax - (aex + bvirt) + (bvirt - ex);
    bvirt = ay - aey;
    aeytail = ay - (aey + bvirt) + (bvirt - ey);
    bvirt = az - aez;
    aeztail = az - (aez + bvirt) + (bvirt - ez);
    bvirt = bx - bex;
    bextail = bx - (bex + bvirt) + (bvirt - ex);
    bvirt = by - bey;
    beytail = by - (bey + bvirt) + (bvirt - ey);
    bvirt = bz - bez;
    beztail = bz - (bez + bvirt) + (bvirt - ez);
    bvirt = cx - cex;
    cextail = cx - (cex + bvirt) + (bvirt - ex);
    bvirt = cy - cey;
    ceytail = cy - (cey + bvirt) + (bvirt - ey);
    bvirt = cz - cez;
    ceztail = cz - (cez + bvirt) + (bvirt - ez);
    bvirt = dx - dex;
    dextail = dx - (dex + bvirt) + (bvirt - ex);
    bvirt = dy - dey;
    deytail = dy - (dey + bvirt) + (bvirt - ey);
    bvirt = dz - dez;
    deztail = dz - (dez + bvirt) + (bvirt - ez);
    if (aextail === 0 && aeytail === 0 && aeztail === 0 && bextail === 0 && beytail === 0 && beztail === 0 && cextail === 0 && ceytail === 0 && ceztail === 0 && dextail === 0 && deytail === 0 && deztail === 0) return det;
    errbound = isperrboundC * permanent + _utilJs.resulterrbound * Math.abs(det);
    const abeps = aex * beytail + bey * aextail - (aey * bextail + bex * aeytail);
    const bceps = bex * ceytail + cey * bextail - (bey * cextail + cex * beytail);
    const cdeps = cex * deytail + dey * cextail - (cey * dextail + dex * ceytail);
    const daeps = dex * aeytail + aey * dextail - (dey * aextail + aex * deytail);
    const aceps = aex * ceytail + cey * aextail - (aey * cextail + cex * aeytail);
    const bdeps = bex * deytail + dey * bextail - (bey * dextail + dex * beytail);
    det += (bex * bex + bey * bey + bez * bez) * (cez * daeps + dez * aceps + aez * cdeps + (ceztail * da3 + deztail * ac3 + aeztail * cd3)) + (dex * dex + dey * dey + dez * dez) * (aez * bceps - bez * aceps + cez * abeps + (aeztail * bc3 - beztail * ac3 + ceztail * ab3)) - ((aex * aex + aey * aey + aez * aez) * (bez * cdeps - cez * bdeps + dez * bceps + (beztail * cd3 - ceztail * bd3 + deztail * bc3)) + (cex * cex + cey * cey + cez * cez) * (dez * abeps + aez * bdeps + bez * daeps + (deztail * ab3 + aeztail * bd3 + beztail * da3))) + 2 * ((bex * bextail + bey * beytail + bez * beztail) * (cez * da3 + dez * ac3 + aez * cd3) + (dex * dextail + dey * deytail + dez * deztail) * (aez * bc3 - bez * ac3 + cez * ab3) - ((aex * aextail + aey * aeytail + aez * aeztail) * (bez * cd3 - cez * bd3 + dez * bc3) + (cex * cextail + cey * ceytail + cez * ceztail) * (dez * ab3 + aez * bd3 + bez * da3)));
    if (det >= errbound || -det >= errbound) return det;
    return insphereexact(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez);
}
function insphere(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez) {
    const aex = ax - ex;
    const bex = bx - ex;
    const cex = cx - ex;
    const dex = dx - ex;
    const aey = ay - ey;
    const bey = by - ey;
    const cey = cy - ey;
    const dey = dy - ey;
    const aez = az - ez;
    const bez = bz - ez;
    const cez = cz - ez;
    const dez = dz - ez;
    const aexbey = aex * bey;
    const bexaey = bex * aey;
    const ab1 = aexbey - bexaey;
    const bexcey = bex * cey;
    const cexbey = cex * bey;
    const bc1 = bexcey - cexbey;
    const cexdey = cex * dey;
    const dexcey = dex * cey;
    const cd1 = cexdey - dexcey;
    const dexaey = dex * aey;
    const aexdey = aex * dey;
    const da1 = dexaey - aexdey;
    const aexcey = aex * cey;
    const cexaey = cex * aey;
    const ac1 = aexcey - cexaey;
    const bexdey = bex * dey;
    const dexbey = dex * bey;
    const bd1 = bexdey - dexbey;
    const abc1 = aez * bc1 - bez * ac1 + cez * ab1;
    const bcd1 = bez * cd1 - cez * bd1 + dez * bc1;
    const cda1 = cez * da1 + dez * ac1 + aez * cd1;
    const dab = dez * ab1 + aez * bd1 + bez * da1;
    const alift = aex * aex + aey * aey + aez * aez;
    const blift = bex * bex + bey * bey + bez * bez;
    const clift = cex * cex + cey * cey + cez * cez;
    const dlift = dex * dex + dey * dey + dez * dez;
    const det = clift * dab - dlift * abc1 + (alift * bcd1 - blift * cda1);
    const aezplus = Math.abs(aez);
    const bezplus = Math.abs(bez);
    const cezplus = Math.abs(cez);
    const dezplus = Math.abs(dez);
    const aexbeyplus = Math.abs(aexbey);
    const bexaeyplus = Math.abs(bexaey);
    const bexceyplus = Math.abs(bexcey);
    const cexbeyplus = Math.abs(cexbey);
    const cexdeyplus = Math.abs(cexdey);
    const dexceyplus = Math.abs(dexcey);
    const dexaeyplus = Math.abs(dexaey);
    const aexdeyplus = Math.abs(aexdey);
    const aexceyplus = Math.abs(aexcey);
    const cexaeyplus = Math.abs(cexaey);
    const bexdeyplus = Math.abs(bexdey);
    const dexbeyplus = Math.abs(dexbey);
    const permanent = ((cexdeyplus + dexceyplus) * bezplus + (dexbeyplus + bexdeyplus) * cezplus + (bexceyplus + cexbeyplus) * dezplus) * alift + ((dexaeyplus + aexdeyplus) * cezplus + (aexceyplus + cexaeyplus) * dezplus + (cexdeyplus + dexceyplus) * aezplus) * blift + ((aexbeyplus + bexaeyplus) * dezplus + (bexdeyplus + dexbeyplus) * aezplus + (dexaeyplus + aexdeyplus) * bezplus) * clift + ((bexceyplus + cexbeyplus) * aezplus + (cexaeyplus + aexceyplus) * bezplus + (aexbeyplus + bexaeyplus) * cezplus) * dlift;
    const errbound = isperrboundA * permanent;
    if (det > errbound || -det > errbound) return det;
    return -insphereadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez, permanent);
}
function inspherefast(pax, pay, paz, pbx, pby, pbz, pcx, pcy, pcz, pdx, pdy, pdz, pex, pey, pez) {
    const aex = pax - pex;
    const bex = pbx - pex;
    const cex = pcx - pex;
    const dex = pdx - pex;
    const aey = pay - pey;
    const bey = pby - pey;
    const cey = pcy - pey;
    const dey = pdy - pey;
    const aez = paz - pez;
    const bez = pbz - pez;
    const cez = pcz - pez;
    const dez = pdz - pez;
    const ab1 = aex * bey - bex * aey;
    const bc1 = bex * cey - cex * bey;
    const cd1 = cex * dey - dex * cey;
    const da1 = dex * aey - aex * dey;
    const ac1 = aex * cey - cex * aey;
    const bd1 = bex * dey - dex * bey;
    const abc1 = aez * bc1 - bez * ac1 + cez * ab1;
    const bcd1 = bez * cd1 - cez * bd1 + dez * bc1;
    const cda1 = cez * da1 + dez * ac1 + aez * cd1;
    const dab = dez * ab1 + aez * bd1 + bez * da1;
    const alift = aex * aex + aey * aey + aez * aez;
    const blift = bex * bex + bey * bey + bez * bez;
    const clift = cex * cex + cey * cey + cez * cez;
    const dlift = dex * dex + dey * dey + dez * dez;
    return clift * dab - dlift * abc1 + (alift * bcd1 - blift * cda1);
}

},{"./util.js":"2IKZk","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"2XWhB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const epsilon = 0.000001;
class Path {
    constructor(){
        this._x0 = this._y0 = this._x1 = this._y1 = null; // end of current subpath
        this._ = "";
    }
    moveTo(x, y) {
        this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
    }
    closePath() {
        if (this._x1 !== null) {
            this._x1 = this._x0, this._y1 = this._y0;
            this._ += "Z";
        }
    }
    lineTo(x, y) {
        this._ += `L${this._x1 = +x},${this._y1 = +y}`;
    }
    arc(x, y, r) {
        x = +x, y = +y, r = +r;
        const x0 = x + r;
        const y0 = y;
        if (r < 0) throw new Error("negative radius");
        if (this._x1 === null) this._ += `M${x0},${y0}`;
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) this._ += "L" + x0 + "," + y0;
        if (!r) return;
        this._ += `A${r},${r},0,1,1,${x - r},${y}A${r},${r},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
    }
    rect(x, y, w, h) {
        this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${+w}v${+h}h${-w}Z`;
    }
    value() {
        return this._ || null;
    }
}
exports.default = Path;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"1mzRd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Polygon {
    constructor(){
        this._ = [];
    }
    moveTo(x, y) {
        this._.push([
            x,
            y
        ]);
    }
    closePath() {
        this._.push(this._[0].slice());
    }
    lineTo(x, y) {
        this._.push([
            x,
            y
        ]);
    }
    value() {
        return this._.length ? this._ : null;
    }
}
exports.default = Polygon;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}],"5Jiby":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _pathJs = require("./path.js");
var _pathJsDefault = parcelHelpers.interopDefault(_pathJs);
var _polygonJs = require("./polygon.js");
var _polygonJsDefault = parcelHelpers.interopDefault(_polygonJs);
class Voronoi {
    constructor(delaunay, [xmin, ymin, xmax, ymax] = [
        0,
        0,
        960,
        500
    ]){
        if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
        this.delaunay = delaunay;
        this._circumcenters = new Float64Array(delaunay.points.length * 2);
        this.vectors = new Float64Array(delaunay.points.length * 2);
        this.xmax = xmax, this.xmin = xmin;
        this.ymax = ymax, this.ymin = ymin;
        this._init();
    }
    update() {
        this.delaunay.update();
        this._init();
        return this;
    }
    _init() {
        const { delaunay: { points , hull , triangles  } , vectors  } = this;
        // Compute circumcenters.
        const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
        for(let i = 0, j = 0, n = triangles.length, x, y; i < n; i += 3, j += 2){
            const t1 = triangles[i] * 2;
            const t2 = triangles[i + 1] * 2;
            const t3 = triangles[i + 2] * 2;
            const x1 = points[t1];
            const y1 = points[t1 + 1];
            const x2 = points[t2];
            const y2 = points[t2 + 1];
            const x3 = points[t3];
            const y3 = points[t3 + 1];
            const dx = x2 - x1;
            const dy = y2 - y1;
            const ex = x3 - x1;
            const ey = y3 - y1;
            const ab = (dx * ey - dy * ex) * 2;
            if (Math.abs(ab) < 0.000000001) {
                // degenerate case (collinear diagram)
                // almost equal points (degenerate triangle)
                // the circumcenter is at the infinity, in a
                // direction that is:
                // 1. orthogonal to the halfedge.
                let a = 1000000000;
                // 2. points away from the center; since the list of triangles starts
                // in the center, the first point of the first triangle
                // will be our reference
                const r = triangles[0] * 2;
                a *= Math.sign((points[r] - x1) * ey - (points[r + 1] - y1) * ex);
                x = (x1 + x3) / 2 - a * ey;
                y = (y1 + y3) / 2 + a * ex;
            } else {
                const d = 1 / ab;
                const bl = dx * dx + dy * dy;
                const cl = ex * ex + ey * ey;
                x = x1 + (ey * bl - dy * cl) * d;
                y = y1 + (dx * cl - ex * bl) * d;
            }
            circumcenters[j] = x;
            circumcenters[j + 1] = y;
        }
        // Compute exterior cell rays.
        let h = hull[hull.length - 1];
        let p0, p1 = h * 4;
        let x0, x1 = points[2 * h];
        let y0, y1 = points[2 * h + 1];
        vectors.fill(0);
        for(let i1 = 0; i1 < hull.length; ++i1){
            h = hull[i1];
            p0 = p1, x0 = x1, y0 = y1;
            p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
            vectors[p0 + 2] = vectors[p1] = y0 - y1;
            vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
        }
    }
    render(context) {
        const buffer = context == null ? context = new _pathJsDefault.default : undefined;
        const { delaunay: { halfedges , inedges , hull  } , circumcenters , vectors  } = this;
        if (hull.length <= 1) return null;
        for(let i = 0, n = halfedges.length; i < n; ++i){
            const j = halfedges[i];
            if (j < i) continue;
            const ti = Math.floor(i / 3) * 2;
            const tj = Math.floor(j / 3) * 2;
            const xi = circumcenters[ti];
            const yi = circumcenters[ti + 1];
            const xj = circumcenters[tj];
            const yj = circumcenters[tj + 1];
            this._renderSegment(xi, yi, xj, yj, context);
        }
        let h0, h1 = hull[hull.length - 1];
        for(let i1 = 0; i1 < hull.length; ++i1){
            h0 = h1, h1 = hull[i1];
            const t = Math.floor(inedges[h1] / 3) * 2;
            const x = circumcenters[t];
            const y = circumcenters[t + 1];
            const v = h0 * 4;
            const p = this._project(x, y, vectors[v + 2], vectors[v + 3]);
            if (p) this._renderSegment(x, y, p[0], p[1], context);
        }
        return buffer && buffer.value();
    }
    renderBounds(context) {
        const buffer = context == null ? context = new _pathJsDefault.default : undefined;
        context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
        return buffer && buffer.value();
    }
    renderCell(i, context) {
        const buffer = context == null ? context = new _pathJsDefault.default : undefined;
        const points = this._clip(i);
        if (points === null || !points.length) return;
        context.moveTo(points[0], points[1]);
        let n = points.length;
        while(points[0] === points[n - 2] && points[1] === points[n - 1] && n > 1)n -= 2;
        for(let i = 2; i < n; i += 2)if (points[i] !== points[i - 2] || points[i + 1] !== points[i - 1]) context.lineTo(points[i], points[i + 1]);
        context.closePath();
        return buffer && buffer.value();
    }
    *cellPolygons() {
        const { delaunay: { points  }  } = this;
        for(let i = 0, n = points.length / 2; i < n; ++i){
            const cell = this.cellPolygon(i);
            if (cell) cell.index = i, yield cell;
        }
    }
    cellPolygon(i) {
        const polygon = new _polygonJsDefault.default;
        this.renderCell(i, polygon);
        return polygon.value();
    }
    _renderSegment(x0, y0, x1, y1, context) {
        let S;
        const c0 = this._regioncode(x0, y0);
        const c1 = this._regioncode(x1, y1);
        if (c0 === 0 && c1 === 0) {
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
        } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
            context.moveTo(S[0], S[1]);
            context.lineTo(S[2], S[3]);
        }
    }
    contains(i, x, y) {
        if ((x = +x, x !== x) || (y = +y, y !== y)) return false;
        return this.delaunay._step(i, x, y) === i;
    }
    *neighbors(i) {
        const ci = this._clip(i);
        if (ci) for (const j of this.delaunay.neighbors(i)){
            const cj = this._clip(j);
            // find the common edge
            if (cj) loop: for(let ai = 0, li = ci.length; ai < li; ai += 2){
                for(let aj = 0, lj = cj.length; aj < lj; aj += 2)if (ci[ai] == cj[aj] && ci[ai + 1] == cj[aj + 1] && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj]) {
                    yield j;
                    break loop;
                }
            }
        }
    }
    _cell(i) {
        const { circumcenters , delaunay: { inedges , halfedges , triangles  }  } = this;
        const e0 = inedges[i];
        if (e0 === -1) return null; // coincident point
        const points = [];
        let e = e0;
        do {
            const t = Math.floor(e / 3);
            points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
            e = e % 3 === 2 ? e - 2 : e + 1;
            if (triangles[e] !== i) break; // bad triangulation
            e = halfedges[e];
        }while (e !== e0 && e !== -1)
        return points;
    }
    _clip(i) {
        // degenerate case (1 valid point: return the box)
        if (i === 0 && this.delaunay.hull.length === 1) return [
            this.xmax,
            this.ymin,
            this.xmax,
            this.ymax,
            this.xmin,
            this.ymax,
            this.xmin,
            this.ymin
        ];
        const points = this._cell(i);
        if (points === null) return null;
        const { vectors: V  } = this;
        const v = i * 4;
        return V[v] || V[v + 1] ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3]) : this._clipFinite(i, points);
    }
    _clipFinite(i, points) {
        const n = points.length;
        let P = null;
        let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
        let c0, c1 = this._regioncode(x1, y1);
        let e0, e1 = 0;
        for(let j = 0; j < n; j += 2){
            x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
            c0 = c1, c1 = this._regioncode(x1, y1);
            if (c0 === 0 && c1 === 0) {
                e0 = e1, e1 = 0;
                if (P) P.push(x1, y1);
                else P = [
                    x1,
                    y1
                ];
            } else {
                let S, sx0, sy0, sx1, sy1;
                if (c0 === 0) {
                    if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
                    [sx0, sy0, sx1, sy1] = S;
                } else {
                    if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
                    [sx1, sy1, sx0, sy0] = S;
                    e0 = e1, e1 = this._edgecode(sx0, sy0);
                    if (e0 && e1) this._edge(i, e0, e1, P, P.length);
                    if (P) P.push(sx0, sy0);
                    else P = [
                        sx0,
                        sy0
                    ];
                }
                e0 = e1, e1 = this._edgecode(sx1, sy1);
                if (e0 && e1) this._edge(i, e0, e1, P, P.length);
                if (P) P.push(sx1, sy1);
                else P = [
                    sx1,
                    sy1
                ];
            }
        }
        if (P) {
            e0 = e1, e1 = this._edgecode(P[0], P[1]);
            if (e0 && e1) this._edge(i, e0, e1, P, P.length);
        } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) return [
            this.xmax,
            this.ymin,
            this.xmax,
            this.ymax,
            this.xmin,
            this.ymax,
            this.xmin,
            this.ymin
        ];
        return P;
    }
    _clipSegment(x0, y0, x1, y1, c0, c1) {
        while(true){
            if (c0 === 0 && c1 === 0) return [
                x0,
                y0,
                x1,
                y1
            ];
            if (c0 & c1) return null;
            let x, y, c = c0 || c1;
            if (c & 8) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
            else if (c & 4) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
            else if (c & 2) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
            else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
            if (c0) x0 = x, y0 = y, c0 = this._regioncode(x0, y0);
            else x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
        }
    }
    _clipInfinite(i, points, vx0, vy0, vxn, vyn) {
        let P = Array.from(points), p;
        if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
        if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);
        if (P = this._clipFinite(i, P)) for(let j = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2){
            c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
            if (c0 && c1) j = this._edge(i, c0, c1, P, j), n = P.length;
        }
        else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) P = [
            this.xmin,
            this.ymin,
            this.xmax,
            this.ymin,
            this.xmax,
            this.ymax,
            this.xmin,
            this.ymax
        ];
        return P;
    }
    _edge(i, e0, e1, P, j) {
        while(e0 !== e1){
            let x, y;
            switch(e0){
                case 5:
                    e0 = 4;
                    continue; // top-left
                case 4:
                    e0 = 6, x = this.xmax, y = this.ymin;
                    break; // top
                case 6:
                    e0 = 2;
                    continue; // top-right
                case 2:
                    e0 = 10, x = this.xmax, y = this.ymax;
                    break; // right
                case 10:
                    e0 = 8;
                    continue; // bottom-right
                case 8:
                    e0 = 9, x = this.xmin, y = this.ymax;
                    break; // bottom
                case 9:
                    e0 = 1;
                    continue; // bottom-left
                case 1:
                    e0 = 5, x = this.xmin, y = this.ymin;
                    break; // left
            }
            // Note: this implicitly checks for out of bounds: if P[j] or P[j+1] are
            // undefined, the conditional statement will be executed.
            if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) P.splice(j, 0, x, y), j += 2;
        }
        if (P.length > 4) for(let i = 0; i < P.length; i += 2){
            const j = (i + 2) % P.length, k = (i + 4) % P.length;
            if (P[i] === P[j] && P[j] === P[k] || P[i + 1] === P[j + 1] && P[j + 1] === P[k + 1]) P.splice(j, 2), i -= 2;
        }
        return j;
    }
    _project(x0, y0, vx, vy) {
        let t = Infinity, c, x, y;
        if (vy < 0) {
            if (y0 <= this.ymin) return null;
            if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
        } else if (vy > 0) {
            if (y0 >= this.ymax) return null;
            if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
        }
        if (vx > 0) {
            if (x0 >= this.xmax) return null;
            if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
        } else if (vx < 0) {
            if (x0 <= this.xmin) return null;
            if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
        }
        return [
            x,
            y
        ];
    }
    _edgecode(x, y) {
        return (x === this.xmin ? 1 : x === this.xmax ? 2 : 0) | (y === this.ymin ? 4 : y === this.ymax ? 8 : 0);
    }
    _regioncode(x, y) {
        return (x < this.xmin ? 1 : x > this.xmax ? 2 : 0) | (y < this.ymin ? 4 : y > this.ymax ? 8 : 0);
    }
}
exports.default = Voronoi;

},{"./path.js":"2XWhB","./polygon.js":"1mzRd","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["1JC1Z","39pCf"], "39pCf", "parcelRequiref51f")

//# sourceMappingURL=index.824b0574.js.map
