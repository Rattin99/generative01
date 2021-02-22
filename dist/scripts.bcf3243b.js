// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
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
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/normalize.css/normalize.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/tinycolor2/tinycolor.js":[function(require,module,exports) {
var define;
// TinyColor v1.4.2
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

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
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
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
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

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

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
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
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
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
        return fn.apply(null, [this].concat([].slice.call(args)));
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
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
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

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
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
function rgbToRgb(r, g, b){
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

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
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
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
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

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
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
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

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
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

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
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
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
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
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
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
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

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
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
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
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
    switch (wcag2Parms.level + wcag2Parms.size) {
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
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
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
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
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
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

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
})();

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

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);

},{}],"node_modules/seed-random/index.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
var GLOBAL = typeof global === 'undefined' ? window : global;

//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


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
  var use_entropy = (options && options.entropy) || false;
  var key = [];

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    use_entropy ? [seed, tostring(pool)] :
    0 in arguments ? seed : autoseed(), 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  return function() {         // Closure to return a random double:
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer Math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };
};

module.exports.resetGlobal = function () {
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
/** @constructor */
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
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
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */
function autoseed(seed) {
  try {
    GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
    return tostring(seed);
  } catch (e) {
    return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen, tostring(pool)];
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

},{}],"node_modules/simplex-noise/simplex-noise.js":[function(require,module,exports) {
var define;
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
 */
(function() {
  'use strict';

  var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  var F3 = 1.0 / 3.0;
  var G3 = 1.0 / 6.0;
  var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  function SimplexNoise(randomOrSeed) {
    var random;
    if (typeof randomOrSeed == 'function') {
      random = randomOrSeed;
    }
    else if (randomOrSeed) {
      random = alea(randomOrSeed);
    } else {
      random = Math.random;
    }
    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }

  }
  SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
      -1, 1, 0,
      1, -1, 0,

      -1, -1, 0,
      1, 0, 1,
      -1, 0, 1,

      1, 0, -1,
      -1, 0, -1,
      0, 1, 1,

      0, -1, 1,
      0, 1, -1,
      0, -1, -1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
      0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
      1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
      -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
      1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
      -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
      1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
      -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
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
      } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      else {
        i1 = 0;
        j1 = 1;
      } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6
      var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
      var y2 = y0 - 1.0 + 2.0 * G2;
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
      return 70.0 * (n0 + n1 + n2);
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
        } // X Y Z order
        else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // X Z Y order
        else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // Z X Y order
      }
      else { // x0<y0
        if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Z Y X order
        else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Y Z X order
        else {
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
      var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
      var y2 = y0 - j2 + 2.0 * G3;
      var z2 = z0 - k2 + 2.0 * G3;
      var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
      var y3 = y0 - 1.0 + 3.0 * G3;
      var z3 = z0 - 1.0 + 3.0 * G3;
      // Work out the hashed gradient indices of the four simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      // Calculate the contribution from the four corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
        t3 *= t3;
        n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to stay just inside [-1,1]
      return 32.0 * (n0 + n1 + n2 + n3);
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
      var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
      var y2 = y0 - j2 + 2.0 * G4;
      var z2 = z0 - k2 + 2.0 * G4;
      var w2 = w0 - l2 + 2.0 * G4;
      var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
      var y3 = y0 - j3 + 3.0 * G4;
      var z3 = z0 - k3 + 3.0 * G4;
      var w3 = w0 - l3 + 3.0 * G4;
      var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
      var y4 = y0 - 1.0 + 4.0 * G4;
      var z4 = z0 - 1.0 + 4.0 * G4;
      var w4 = w0 - 1.0 + 4.0 * G4;
      // Work out the hashed gradient indices of the five simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      var ll = l & 255;
      // Calculate the contribution from the five corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
        t0 *= t0;
        n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
        t1 *= t1;
        n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
        t2 *= t2;
        n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
        t3 *= t3;
        n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
      }
      var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
      if (t4 < 0) n4 = 0.0;
      else {
        var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
        t4 *= t4;
        n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
      }
      // Sum up and scale the result to cover the range [-1,1]
      return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }
  };

  function buildPermutationTable(random) {
    var i;
    var p = new Uint8Array(256);
    for (i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (i = 0; i < 255; i++) {
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

    for (var i = 0; i < arguments.length; i++) {
      s0 -= mash(arguments[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(arguments[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(arguments[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;
    return function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
  }
  function masher() {
    var n = 0xefc8249d;
    return function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
  }

  // amd
  if (typeof define !== 'undefined' && define.amd) define(function() {return SimplexNoise;});
  // common js
  if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise;
  // browser
  else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
  // nodejs
  if (typeof module !== 'undefined') {
    module.exports = SimplexNoise;
  }

})();

},{}],"node_modules/defined/index.js":[function(require,module,exports) {
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],"node_modules/canvas-sketch-util/random.js":[function(require,module,exports) {
var seedRandom = require('seed-random');
var SimplexNoise = require('simplex-noise');
var defined = require('defined');

function createRandom (defaultSeed) {
  defaultSeed = defined(defaultSeed, null);
  var defaultRandom = Math.random;
  var currentSeed;
  var currentRandom;
  var noiseGenerator;
  var _nextGaussian = null;
  var _hasNextGaussian = false;

  setSeed(defaultSeed);

  return {
    value: value,
    createRandom: function (defaultSeed) {
      return createRandom(defaultSeed);
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

  function setSeed (seed, opt) {
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

  function value () {
    return currentRandom();
  }

  function valueNonZero () {
    var u = 0;
    while (u === 0) u = value();
    return u;
  }

  function getSeed () {
    return currentSeed;
  }

  function getRandomSeed () {
    var seed = String(Math.floor(Math.random() * 1000000));
    return seed;
  }

  function createNoise () {
    return new SimplexNoise(currentRandom);
  }

  function permuteNoise () {
    noiseGenerator = createNoise();
  }

  function noise1D (x, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, 0);
  }

  function noise2D (x, y, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);
  }

  function noise3D (x, y, z, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise3D(
      x * frequency,
      y * frequency,
      z * frequency
    );
  }

  function noise4D (x, y, z, w, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    if (!isFinite(w)) throw new TypeError('w component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise4D(
      x * frequency,
      y * frequency,
      z * frequency,
      w * frequency
    );
  }

  function sign () {
    return boolean() ? 1 : -1;
  }

  function boolean () {
    return value() > 0.5;
  }

  function chance (n) {
    n = defined(n, 0.5);
    if (typeof n !== 'number') throw new TypeError('expected n to be a number');
    return value() < n;
  }

  function range (min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return value() * (max - min) + min;
  }

  function rangeFloor (min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.floor(range(min, max));
  }

  function pick (array) {
    if (array.length === 0) return undefined;
    return array[rangeFloor(0, array.length)];
  }

  function shuffle (arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Expected Array, got ' + typeof arr);
    }

    var rand;
    var tmp;
    var len = arr.length;
    var ret = arr.slice();
    while (len) {
      rand = Math.floor(value() * len--);
      tmp = ret[len];
      ret[len] = ret[rand];
      ret[rand] = tmp;
    }
    return ret;
  }

  function onCircle (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var theta = value() * 2.0 * Math.PI;
    out[0] = radius * Math.cos(theta);
    out[1] = radius * Math.sin(theta);
    return out;
  }

  function insideCircle (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    onCircle(1, out);
    var r = radius * Math.sqrt(value());
    out[0] *= r;
    out[1] *= r;
    return out;
  }

  function onSphere (radius, out) {
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

  function insideSphere (radius, out) {
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

  function quaternion (out) {
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

  function weightedSet (set) {
    set = set || [];
    if (set.length === 0) return null;
    return set[weightedSetIndex(set)].value;
  }

  function weightedSetIndex (set) {
    set = set || [];
    if (set.length === 0) return -1;
    return weighted(set.map(function (s) {
      return s.weight;
    }));
  }

  function weighted (weights) {
    weights = weights || [];
    if (weights.length === 0) return -1;
    var totalWeight = 0;
    var i;

    for (i = 0; i < weights.length; i++) {
      totalWeight += weights[i];
    }

    if (totalWeight <= 0) throw new Error('Weights must sum to > 0');

    var random = value() * totalWeight;
    for (i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        return i;
      }
      random -= weights[i];
    }
    return 0;
  }

  function gaussian (mean, standardDerivation) {
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
      } while (s >= 1 || s === 0);
      var multiplier = Math.sqrt(-2 * Math.log(s) / s);
      _nextGaussian = (v2 * multiplier);
      _hasNextGaussian = true;
      return mean + standardDerivation * (v1 * multiplier);
    }
  }
}

module.exports = createRandom();

},{"seed-random":"node_modules/seed-random/index.js","simplex-noise":"node_modules/simplex-noise/simplex-noise.js","defined":"node_modules/defined/index.js"}],"scripts/lib/Vector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector = Vector;

// Vector class originally from https://evanw.github.io/lightgl.js/docs/vector.html
// Edited and expanded to match p5's vectors
// ref - p5 vector https://p5js.org/reference/#/p5.Vector
// https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/more-vector-math
function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector.prototype = {
  negative: function negative() {
    return new Vector(-this.x, -this.y, -this.z);
  },
  add: function add(v) {
    if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    return new Vector(this.x + v, this.y + v, this.z + v);
  },
  sub: function sub(v) {
    if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    return new Vector(this.x - v, this.y - v, this.z - v);
  },
  mult: function mult(v) {
    if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    return new Vector(this.x * v, this.y * v, this.z * v);
  },
  div: function div(v) {
    if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    return new Vector(this.x / v, this.y / v, this.z / v);
  },
  equals: function equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  },
  dot: function dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross: function cross(v) {
    return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
  },
  length: function length() {
    return Math.sqrt(this.dot(this));
  },
  mag: function mag() {
    return this.length();
  },
  magSq: function magSq() {
    var m = this.length();
    return m * m;
  },
  setMag: function setMag(m) {
    var c = this.mag();
    var r = m / c;
    return this.mult(r);
  },
  normalize: function normalize() {
    var mag = this.mag();
    mag = mag || 1;
    return this.div(mag);
  },
  unit: function unit() {
    return this.divide(this.length());
  },
  min: function min() {
    return Math.min(Math.min(this.x, this.y), this.z);
  },
  max: function max() {
    return Math.max(Math.max(this.x, this.y), this.z);
  },
  limit: function limit(v) {
    var cm = this.mag();

    if (cm > v) {
      return this.setMag(v);
    }

    return this;
  },
  // clamp(min, max) {
  //     // export const clamp = (min = 0, max = 1, a) => Math.min(max, Math.max(min, a));
  // },
  toAngles: function toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length())
    };
  },
  angleTo: function angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray: function toArray(n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  },
  clone: function clone() {
    return new Vector(this.x, this.y, this.z);
  },
  init: function init(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
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
  var length = a.length();
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
},{}],"scripts/lib/math.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGridPointsUV = exports.createGridPointsXY = exports.createCirclePoints = exports.create3dNoise = exports.create2dNoise = exports.scalePointToCanvas = exports.radiansToDegrees = exports.uvFromAngle = exports.aFromVector = exports.pointAngleFromVelocity = exports.pointRotateCoord = exports.pointDistance = exports.marginify = exports.toSinValue = exports.mapRange = exports.invlerp = exports.clamp = exports.lerp = exports.normalizeInverse = exports.normalize = exports.pointOnCircle = exports.pingPontValue = exports.loopingValue = exports.createRandomNumberArray = exports.oneOf = exports.randomSign = exports.randomNumberBetweenMid = exports.randomNumberBetween = exports.setRandomSeed = exports.getRandomSeed = exports.TAU = void 0;

var _random = _interopRequireDefault(require("canvas-sketch-util/random"));

var _Vector = require("./Vector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  // Math aliases
  var π = Math.PI
  var random = Math.random
  var round = Math.round
  var floor = Math.floor
  var abs = Math.abs
  var sin = Math.sin
  var cos = Math.cos
  var tan = Math.tan

  Math Snippets
  https://github.com/terkelg/math
*/
_random.default.setSeed(_random.default.getRandomSeed());

console.log("Using seed ".concat(_random.default.getSeed()));
var TAU = Math.PI * 2;
exports.TAU = TAU;

var getRandomSeed = function getRandomSeed() {
  return _random.default.getSeed();
};

exports.getRandomSeed = getRandomSeed;

var setRandomSeed = function setRandomSeed(s) {
  return _random.default.setRandomSeed(s);
};

exports.setRandomSeed = setRandomSeed;

var randomNumberBetween = function randomNumberBetween(min, max) {
  return _random.default.value() * (max - min) + min;
};

exports.randomNumberBetween = randomNumberBetween;

var randomNumberBetweenMid = function randomNumberBetweenMid(min, max) {
  return randomNumberBetween(min, max) - max / 2;
};

exports.randomNumberBetweenMid = randomNumberBetweenMid;

var randomSign = function randomSign() {
  return Math.round(_random.default.value()) == 1 ? 1 : -1;
};

exports.randomSign = randomSign;

var oneOf = function oneOf(arry) {
  var i = Math.round(randomNumberBetween(0, arry.length - 1));
  return arry[i];
};

exports.oneOf = oneOf;

var createRandomNumberArray = function createRandomNumberArray(len, min, max) {
  return Array.from(new Array(len)).map(function () {
    return randomNumberBetween(min, max);
  });
}; // -> -1 ... 1


exports.createRandomNumberArray = createRandomNumberArray;

var loopingValue = function loopingValue(t) {
  var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
  return Math.sin(t * m);
}; // t is 0-1, -> -1 ... 1


exports.loopingValue = loopingValue;

var pingPontValue = function pingPontValue(t) {
  return Math.sin(t * Math.PI);
}; // x,y offsets for the current circle position


exports.pingPontValue = pingPontValue;

var pointOnCircle = function pointOnCircle(x, y, r, a) {
  return {
    x: r * Math.sin(a) + x,
    y: r * Math.cos(a) + y
  };
}; // returns value between 0-1, 250,500,0 => .5


exports.pointOnCircle = pointOnCircle;

var normalize = function normalize(min, max, val) {
  return (val - min) / (max - min);
};

exports.normalize = normalize;

var normalizeInverse = function normalizeInverse(min, max, val) {
  return 1 - normalize(min, max, val);
}; // https://twitter.com/mattdesl/status/1031305279227478016
// https://www.trysmudford.com/blog/linear-interpolation-functions/
// lerp(20, 80, 0.5) // 40


exports.normalizeInverse = normalizeInverse;

var lerp = function lerp(x, y, a) {
  return x * (1 - a) + y * a;
};

exports.lerp = lerp;

var clamp = function clamp() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var a = arguments.length > 2 ? arguments[2] : undefined;
  return Math.min(max, Math.max(min, a));
}; // invlerp(50, 100, 75)  // 0.5


exports.clamp = clamp;

var invlerp = function invlerp(x, y, a) {
  return clamp(0, 1, (a - x) / (y - x));
}; // p5js map fn is reverse map(a,x2,y2,x1,y1)
// a is point in 1 and converts to point in 2
// range(10, 100, 2000, 20000, 50) // 10000


exports.invlerp = invlerp;

var mapRange = function mapRange(x1, y1, x2, y2, a) {
  return lerp(x2, y2, invlerp(x1, y1, a));
}; // Accepts a value 0-1 and returns a value 0-1 in a sin wave


exports.mapRange = mapRange;

var toSinValue = function toSinValue(value) {
  return Math.abs(Math.sin(value * TAU));
};

exports.toSinValue = toSinValue;

var marginify = function marginify(_ref) {
  var margin = _ref.margin,
      u = _ref.u,
      v = _ref.v,
      width = _ref.width,
      height = _ref.height;
  return {
    x: lerp(margin, width - margin, u),
    y: lerp(margin, height - margin, v)
  };
};

exports.marginify = marginify;

var pointDistance = function pointDistance(pointA, pointB) {
  var dx = pointA.x - pointB.x;
  var dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
}; // https://stackoverflow.com/questions/13043945/how-do-i-calculate-the-position-of-a-point-in-html5-canvas-after-rotation


exports.pointDistance = pointDistance;

var pointRotateCoord = function pointRotateCoord(point, angle) {
  return {
    x: point.x * cos(angle) - point.y * sin(angle),
    y: point.y * cos(angle) + point.x * sin(angle)
  };
}; // https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-angular-movement/a/pointing-towards-movement


exports.pointRotateCoord = pointRotateCoord;

var pointAngleFromVelocity = function pointAngleFromVelocity(_ref2) {
  var velocityX = _ref2.velocityX,
      velocityY = _ref2.velocityY;
  return Math.atan2(velocityY, velocityX);
};

exports.pointAngleFromVelocity = pointAngleFromVelocity;

var aFromVector = function aFromVector(_ref3) {
  var x = _ref3.x,
      y = _ref3.y;
  return Math.atan2(y, x);
};

exports.aFromVector = aFromVector;

var uvFromAngle = function uvFromAngle(a) {
  return new _Vector.Vector(Math.cos(a), Math.sin(a));
};

exports.uvFromAngle = uvFromAngle;

var radiansToDegrees = function radiansToDegrees(rad) {
  return rad * 180 / Math.PI;
}; // Scale up point grid and center in the canvas


exports.radiansToDegrees = radiansToDegrees;

var scalePointToCanvas = function scalePointToCanvas(canvasWidth, canvasHeight, width, height, zoomFactor, x, y) {
  var particleXOffset = canvasWidth / 2 - width * zoomFactor / 2;
  var particleYOffset = canvasHeight / 2 - height * zoomFactor / 2;
  return {
    x: x * zoomFactor + particleXOffset,
    y: y * zoomFactor + particleYOffset
  };
};

exports.scalePointToCanvas = scalePointToCanvas;

var create2dNoise = function create2dNoise(u, v) {
  var amplitude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var frequency = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;
  return Math.abs(_random.default.noise2D(u * frequency, v * frequency)) * amplitude;
};

exports.create2dNoise = create2dNoise;

var create3dNoise = function create3dNoise(u, v, t) {
  var amplitude = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var frequency = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.5;
  return Math.abs(_random.default.noise3D(u * frequency, v * frequency, t * frequency)) * amplitude;
}; // [[x,y], ...]


exports.create3dNoise = create3dNoise;

var createCirclePoints = function createCirclePoints(offsetX, offsetY, diameter, steps) {
  var sx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var sy = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
  var points = [];

  for (var theta = 0; theta < 360; theta += steps) {
    var radius = theta * (Math.PI / 180);
    var x = Math.cos(radius) * diameter + sx + offsetX;
    var y = Math.sin(radius) * diameter + sy + offsetY;
    points.push([x, y]);
  }

  return points;
}; // -> [[x,y], ...]


exports.createCirclePoints = createCirclePoints;

var createGridPointsXY = function createGridPointsXY(width, height, xMargin, yMargin, columns, rows) {
  var gridPoints = [];
  var colStep = (width - xMargin * 2) / (columns - 1);
  var rowStep = (height - yMargin * 2) / (rows - 1);

  for (var col = 0; col < columns; col++) {
    var x = xMargin + col * colStep;

    for (var row = 0; row < rows; row++) {
      var y = yMargin + row * rowStep;
      gridPoints.push([x, y]);
    }
  }

  return gridPoints;
}; // -> [{radius, rotation, position:[u,v]}, ...]


exports.createGridPointsXY = createGridPointsXY;

var createGridPointsUV = function createGridPointsUV(columns, rows) {
  rows = rows || columns;
  var points = [];
  var amplitude = 0.1;
  var frequency = 1;

  for (var x = 0; x < columns; x++) {
    for (var y = 0; y < rows; y++) {
      var u = columns <= 1 ? 0.5 : x / (columns - 1);
      var v = columns <= 1 ? 0.5 : y / (rows - 1); // const radius = Math.abs(random.gaussian() * 0.02);

      var radius = create2dNoise(u, v);
      var rotation = create2dNoise(u, v);
      points.push({
        radius: radius,
        rotation: rotation,
        position: [u, v]
      });
    }
  }

  return points;
};

exports.createGridPointsUV = createGridPointsUV;
},{"canvas-sketch-util/random":"node_modules/canvas-sketch-util/random.js","./Vector":"scripts/lib/Vector.js"}],"scripts/lib/canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImageDataColor = exports.getColorAverageGrey = exports.getImageDataFromImage = exports.drawAttractor = exports.drawMouse = exports.drawParticleVectors = exports.drawTestPoint = exports.drawPointTrail = exports.connectParticles = exports.drawRotatedParticle = exports.drawSpikeCircle = exports.drawRake = exports.drawTextFilled = exports.drawRoundRectFilled = exports.drawQuadRectFilled = exports.drawTriangleFilled = exports.drawSquareFilled = exports.drawRectFilled = exports.drawCircleFilled = exports.drawCircle = exports.drawThickLine = exports.drawLine = exports.drawParticlePoint = exports.resetStyles = exports.background = exports.fillCanvas = exports.clearCanvas = exports.resizeCanvas = void 0;

var _tinycolor = _interopRequireDefault(require("tinycolor2"));

var _math = require("./math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resizeCanvas = function resizeCanvas(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
};

exports.resizeCanvas = resizeCanvas;

var clearCanvas = function clearCanvas(canvas, context) {
  return function (_) {
    return context.clearRect(0, 0, canvas.width, canvas.height);
  };
};

exports.clearCanvas = clearCanvas;

var fillCanvas = function fillCanvas(canvas, context) {
  return function () {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0,0,0';
    context.fillStyle = "rgba(".concat(color, ",").concat(opacity, ")");
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
};

exports.fillCanvas = fillCanvas;

var background = function background(canvas, context) {
  return function () {
    var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'black';
    context.fillStyle = (0, _tinycolor.default)(color).toRgbString();
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
}; // context.save() and context.restore() may be slow, just reset what i'm using


exports.background = background;

var resetStyles = function resetStyles(context) {
  context.strokeStyle = '#000';
  context.fillStyle = '#fff';
  context.lineWidth = 1;
  context.setLineDash([]);
  context.lineCap = 'butt';
}; //----------------------------------------------------------------------------------------------------------------------
// PRIMITIVES
//----------------------------------------------------------------------------------------------------------------------
// TODO use circle?


exports.resetStyles = resetStyles;

var drawParticlePoint = function drawParticlePoint(context) {
  return function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        radius = _ref.radius,
        color = _ref.color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color.toRgbString();
    context.fill();
  };
};

exports.drawParticlePoint = drawParticlePoint;

var drawLine = function drawLine(context) {
  return function (x1, y1, x2, y2, strokeWidth) {
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };
};

exports.drawLine = drawLine;

var drawThickLine = function drawThickLine(context) {
  return function (x1, y1, x2, y2, strokeWidth) {
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };
};

exports.drawThickLine = drawThickLine;

var drawCircle = function drawCircle(context) {
  return function (strokeWidth, x, y, radius) {
    // context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false); // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();

    context.stroke();
  };
};

exports.drawCircle = drawCircle;

var drawCircleFilled = function drawCircleFilled(context) {
  return function (x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color;
    context.fill();
  };
};

exports.drawCircleFilled = drawCircleFilled;

var drawRectFilled = function drawRectFilled(context) {
  return function (x, y, w, h) {
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'white';
    context.fillStyle = (0, _tinycolor.default)(color).toRgbString();
    context.fillRect(x, y, w, h);
  };
};

exports.drawRectFilled = drawRectFilled;

var drawSquareFilled = function drawSquareFilled(context) {
  return function (x, y, size, color) {
    drawRectFilled(context)(x, y, size, size, color);
  };
};

exports.drawSquareFilled = drawSquareFilled;

var drawTriangleFilled = function drawTriangleFilled(context) {
  return function (x, y, size, color) {
    var half = size / 2;
    context.beginPath();
    context.moveTo(x - half, y - half);
    context.lineTo(x + half, y);
    context.lineTo(x - half, y + half);
    context.fillStyle = color.toRgbString();
    context.fill();
  };
}; // https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y


exports.drawTriangleFilled = drawTriangleFilled;

var drawQuadRectFilled = function drawQuadRectFilled(context) {
  return function (x, y, w, h, color) {
    var mx = x + w / 2;
    var my = y + h / 2;
    context.beginPath(); // context.strokeStyle = 'green';
    // context.lineWidth = '4';

    context.fillStyle = (0, _tinycolor.default)(color).toRgbString();
    context.moveTo(x, my);
    context.quadraticCurveTo(x, y, mx, y);
    context.quadraticCurveTo(x + w, y, x + w, my);
    context.quadraticCurveTo(x + w, y + h, mx, y + h);
    context.quadraticCurveTo(x, y + h, x, my); // context.stroke();

    context.fill();
  };
}; // https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y


exports.drawQuadRectFilled = drawQuadRectFilled;

var drawRoundRectFilled = function drawRoundRectFilled(context) {
  return function (x, y, w, h, corner, color) {
    if (w < corner || h < corner) {
      corner = Math.min(w, h);
    }

    var r = x + w;
    var b = y + h;
    context.beginPath(); // context.strokeStyle = 'green';
    // context.lineWidth = '4';

    context.fillStyle = (0, _tinycolor.default)(color).toRgbString();
    context.moveTo(x + corner, y);
    context.lineTo(r - corner, y);
    context.quadraticCurveTo(r, y, r, y + corner);
    context.lineTo(r, y + h - corner);
    context.quadraticCurveTo(r, b, r - corner, b);
    context.lineTo(x + corner, b);
    context.quadraticCurveTo(x, b, x, b - corner);
    context.lineTo(x, y + corner);
    context.quadraticCurveTo(x, y, x + corner, y); // context.stroke();

    context.fill();
  };
};

exports.drawRoundRectFilled = drawRoundRectFilled;

var drawTextFilled = function drawTextFilled(context) {
  return function (text, x, y, color, style) {
    context.fillStyle = (0, _tinycolor.default)(color).toRgbString();
    context.font = style || '1rem "Helvetica Neue",Helvetica,Arial,sans-serif';
    context.fillText(text, x, y);
  };
}; //----------------------------------------------------------------------------------------------------------------------
// COMPLEX SHAPES
//----------------------------------------------------------------------------------------------------------------------
// TODO center it


exports.drawTextFilled = drawTextFilled;

var drawRake = function drawRake(context) {
  return function (_ref2, spacing) {
    var x = _ref2.x,
        y = _ref2.y,
        radius = _ref2.radius,
        color = _ref2.color;
    var points = 5;
    spacing |= radius * 3;

    for (var i = 0; i < points; i++) {
      drawParticlePoint(context)({
        x: x + spacing * i,
        y: y,
        radius: radius,
        color: color
      });
    }
  };
}; // Spikes is an array of angles


exports.drawRake = drawRake;

var drawSpikeCircle = function drawSpikeCircle(context) {
  return function (_ref3, spikes) {
    var x = _ref3.x,
        y = _ref3.y,
        radius = _ref3.radius,
        color = _ref3.color;
    var spikeLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    var circleStroke = 1;
    var spikeStroke = 2;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = circleStroke;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false); // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();

    context.stroke();

    for (var s = 0; s < spikes.length; s++) {
      var pointA = (0, _math.pointOnCircle)(x, y, radius, spikes[s]);
      var pointB = (0, _math.pointOnCircle)(x, y, radius + spikeLength, spikes[s]);
      context.strokeStyle = color.toRgbString();
      drawLine(context)(pointA.x, pointA.y, pointB.x, pointB.y, spikeStroke);
    }
  };
}; //----------------------------------------------------------------------------------------------------------------------
// PARTICLE INTERACTIVITY AND FANCY STUFF
//----------------------------------------------------------------------------------------------------------------------


exports.drawSpikeCircle = drawSpikeCircle;

var drawRotatedParticle = function drawRotatedParticle(ctx, drawFn, particle) {
  var pSaveX = particle.x;
  var pSaveY = particle.y;
  particle.x = 0;
  particle.y = 0;
  ctx.save();
  ctx.translate(pSaveX, pSaveY);
  ctx.rotate(particle.heading);

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  drawFn(ctx)(particle, args);
  ctx.restore();
  particle.x = pSaveX;
  particle.y = pSaveY;
};

exports.drawRotatedParticle = drawRotatedParticle;

var connectParticles = function connectParticles(context) {
  return function (pArray, proximity) {
    var useAlpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var len = pArray.length;

    for (var a = 0; a < len; a++) {
      // all consecutive particles
      for (var b = a; b < len; b++) {
        var pA = pArray[a];
        var pB = pArray[b];
        var distance = (0, _math.pointDistance)(pA, pB);

        if (distance < proximity) {
          var pColor = pA.color;

          if (useAlpha) {
            pColor.setAlpha((0, _math.normalizeInverse)(0, proximity, distance));
          }

          context.strokeStyle = pColor.toHslString();
          drawLine(context)(pA.x, pA.y, pB.x, pB.y, 0.5);
        }
      }
    }

    resetStyles(context);
  };
};

exports.connectParticles = connectParticles;

var drawPointTrail = function drawPointTrail(context) {
  return function (particle) {
    var trailLen = particle.xHistory.length;
    context.lineWidth = particle.radius;
    var pColor = particle.color;
    var aFade = 100 / trailLen * 0.01;
    var alpha = 1;
    var sFade = particle.radius * 2 / trailLen;
    var stroke = particle.radius * 2;

    for (var i = 0; i < trailLen; i++) {
      var startX = i === 0 ? particle.x : particle.xHistory[i - 1];
      var startY = i === 0 ? particle.y : particle.yHistory[i - 1];
      drawLine(context)(startX, startY, particle.xHistory[i], particle.yHistory[i], stroke);
      pColor.setAlpha(alpha);
      context.strokeStyle = pColor.toRgbString();
      alpha -= aFade;
      stroke -= sFade;
    }
  };
}; //----------------------------------------------------------------------------------------------------------------------
// DEBUG
//----------------------------------------------------------------------------------------------------------------------


exports.drawPointTrail = drawPointTrail;

var drawTestPoint = function drawTestPoint(context) {
  return function (_ref4) {
    var x = _ref4.x,
        y = _ref4.y,
        radius = _ref4.radius,
        color = _ref4.color;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
    drawLine(context)(x, y, x + radius, y, 1);
  };
};

exports.drawTestPoint = drawTestPoint;

var drawParticleVectors = function drawParticleVectors(context) {
  return function (particle) {
    var vmult = 5;
    var amult = 100;
    var vel = 'green';
    var acc = 'yellow';
    var vVector = particle.vVector;
    var aVector = particle.aVector;
    context.strokeStyle = (0, _tinycolor.default)(vel).toRgbString();
    drawLine(context)(particle.x, particle.y, particle.x + vVector.x * vmult, particle.y + vVector.y * vmult, 1);
    context.strokeStyle = (0, _tinycolor.default)(acc).toRgbString();
    drawLine(context)(particle.x, particle.y, particle.x + aVector.x * amult, particle.y + aVector.y * amult, 1);
  };
};

exports.drawParticleVectors = drawParticleVectors;

var drawMouse = function drawMouse(context) {
  return function (_ref5) {
    var x = _ref5.x,
        y = _ref5.y,
        radius = _ref5.radius;
    if (x === undefined || y === undefined) return;
    context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
  };
};

exports.drawMouse = drawMouse;

var drawAttractor = function drawAttractor(context) {
  return function (_ref6, mode, radius) {
    var x = _ref6.x,
        y = _ref6.y,
        mass = _ref6.mass,
        g = _ref6.g;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(0,0,0,.1)';
    context.fill();
    context.beginPath();
    context.arc(x, y, Math.sqrt(mass) * g, 0, Math.PI * 2, false);
    context.fillStyle = mode === 1 ? 'rgba(0,255,0,.25)' : 'rgba(255,0,0,.25)';
    context.fill();
  };
}; //----------------------------------------------------------------------------------------------------------------------
// IMAGE DATA / PIXELS
//----------------------------------------------------------------------------------------------------------------------


exports.drawAttractor = drawAttractor;

var getImageDataFromImage = function getImageDataFromImage(context) {
  return function (image) {
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.width);
  };
};
/*
Gray = 0.21R + 0.72G + 0.07B // Luminosity
Gray = (R + G + B) ÷ 3 // Average Brightness
Gray = 0.299R + 0.587G + 0.114B // rec601 standard
Gray = 0.2126R + 0.7152G + 0.0722B // ITU-R BT.709 standard
Gray = 0.2627R + 0.6780G + 0.0593B // ITU-R BT.2100 standard
 */
// https://sighack.com/post/averaging-rgb-colors-the-right-way


exports.getImageDataFromImage = getImageDataFromImage;

var getColorAverageGrey = function getColorAverageGrey(_ref7) {
  var r = _ref7.r,
      g = _ref7.g,
      b = _ref7.b;
  return Math.sqrt((r * r + g * g + b * b) / 3);
}; // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas


exports.getColorAverageGrey = getColorAverageGrey;

var getImageDataColor = function getImageDataColor(imageData, x, y) {
  return {
    r: imageData.data[y * 4 * imageData.width + x * 4],
    g: imageData.data[y * 4 * imageData.width + x * 4 + 1],
    b: imageData.data[y * 4 * imageData.width + x * 4 + 2],
    a: imageData.data[y * 4 * imageData.width + x * 4 + 3]
  };
};

exports.getImageDataColor = getImageDataColor;
},{"tinycolor2":"node_modules/tinycolor2/tinycolor.js","./math":"scripts/lib/math.js"}],"scripts/lib/sketch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sketch = void 0;

var _canvas = require("./canvas");

/*
Convenience canvas sketch runner. Based on p5js


const variation = () => {
    const config = {};

    const setup = (canvas, context) => {
        // create initial state
    };

    // will run every frame
    const draw = (canvas, context, mouse) => {
        // draw on every frame
        return 1; // -1 to exit animation loop
    };

    return {
        config,
        setup,
        draw,
    };
};
*/
var sketch = function sketch() {
  var mouse = {
    x: undefined,
    y: undefined,
    isDown: false,
    radius: 100
  };
  var fps = 0;
  var currentVariation;
  var canvasSizeFraction = 0.85;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  canvas.width = window.innerWidth * canvasSizeFraction;
  canvas.height = window.innerHeight * canvasSizeFraction;

  var getCanvas = function getCanvas(_) {
    return canvas;
  };

  var getContext = function getContext(_) {
    return context;
  };

  var getMouse = function getMouse(_) {
    return mouse;
  };

  var mouseDown = function mouseDown(evt) {
    mouse.isDown = true;
  };

  var mouseMove = function mouseMove(evt) {
    var canvasFrame = canvas.getBoundingClientRect();
    mouse.x = evt.x - canvasFrame.x;
    mouse.y = evt.y - canvasFrame.y;
  };

  var mouseUp = function mouseUp(evt) {
    mouse.isDown = false;
  };

  var mouseOut = function mouseOut(evt) {
    mouse.x = undefined;
    mouse.y = undefined;
    mouse.isDown = false;
  };

  var windowResize = function windowResize(evt) {
    return (0, _canvas.resizeCanvas)(canvas, window.innerWidth * canvasSizeFraction, window.innerHeight * canvasSizeFraction);
  };

  window.addEventListener('mousedown', mouseDown);
  window.addEventListener('touchstart', mouseDown);
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('touchmove', mouseMove);
  window.addEventListener('mouseup', mouseUp);
  window.addEventListener('touchend', mouseUp);
  window.addEventListener('mouseout', mouseOut);
  window.addEventListener('touchcancel', mouseOut);
  window.addEventListener('resize', windowResize);

  var run = function run(variation) {
    currentVariation = variation;
    var backgroundColor = '0,0,0';

    if (variation.hasOwnProperty('config')) {
      var config = variation.config;
      console.log('Sketch config:', variation.config);

      if (config.width && config.height) {
        window.removeEventListener('resize', windowResize);
        (0, _canvas.resizeCanvas)(canvas, config.width, config.height);
      }

      if (config.background) {
        backgroundColor = config.background;
      }

      if (config.fps) {
        fps = config.fps;
      }
    }

    var rendering = true;
    var targetFpsInterval = 1000 / fps;
    var lastAnimationFrameTime;

    var startSketch = function startSketch() {
      window.removeEventListener('load', startSketch);
      variation.setup(canvas, context); // fillCanvas(canvas, context)(1,backgroundColor);

      var render = function render() {
        var result = variation.draw(canvas, context, mouse);

        if (result !== -1) {
          requestAnimationFrame(render);
        }
      }; // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe


      var renderAtFps = function renderAtFps() {
        if (rendering) {
          requestAnimationFrame(renderAtFps);
        }

        var now = Date.now();
        var elapsed = now - lastAnimationFrameTime;

        if (elapsed > targetFpsInterval) {
          lastAnimationFrameTime = now - elapsed % targetFpsInterval;
          var result = variation.draw(canvas, context, mouse);

          if (result === -1) {
            rendering = false;
          }
        }
      };

      if (!fps) {
        requestAnimationFrame(render);
      } else {
        lastAnimationFrameTime = Date.now();
        requestAnimationFrame(renderAtFps);
      }
    };

    window.addEventListener('load', startSketch);
  };

  return {
    canvas: getCanvas,
    context: getContext,
    mouse: getMouse,
    run: run
  };
};

exports.sketch = sketch;
},{"./canvas":"scripts/lib/canvas.js"}],"scripts/lib/Particle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointPush = exports.attractPoint = exports.avoidPoint = exports.gravityPoint = exports.edgeWrap = exports.edgeBounce = exports.attract = exports.drag = exports.friction = exports.applyForce = exports.updatePosWithVelocity = exports.createRandomParticleValues = exports.psCanvasRandom = exports.pixel = exports.Particle = void 0;

var _tinycolor = _interopRequireDefault(require("tinycolor2"));

var _math = require("./math");

var _Vector = require("./Vector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MAX_COORD_HISTORY = 30;

var limitArrayLen = function limitArrayLen(arr) {
  var arrLength = arr.length;

  if (arrLength > MAX_COORD_HISTORY) {
    arr.splice(0, arrLength - MAX_COORD_HISTORY);
  }

  return arr;
};

var Particle = /*#__PURE__*/function () {
  function Particle(values) {
    _classCallCheck(this, Particle);

    this.initValues(values);
  }

  _createClass(Particle, [{
    key: "initValues",
    value: function initValues(_ref) {
      var index = _ref.index,
          x = _ref.x,
          y = _ref.y,
          velocityX = _ref.velocityX,
          velocityY = _ref.velocityY,
          accelerationX = _ref.accelerationX,
          accelerationY = _ref.accelerationY,
          radius = _ref.radius,
          mass = _ref.mass,
          color = _ref.color,
          alpha = _ref.alpha,
          rotation = _ref.rotation,
          lifetime = _ref.lifetime,
          drawFn = _ref.drawFn,
          updateFn = _ref.updateFn,
          colorFn = _ref.colorFn,
          rest = _objectWithoutProperties(_ref, ["index", "x", "y", "velocityX", "velocityY", "accelerationX", "accelerationY", "radius", "mass", "color", "alpha", "rotation", "lifetime", "drawFn", "updateFn", "colorFn"]);

      this.props = rest;
      this.index = index || 0;
      this._x = x || 0;
      this._y = y || 0;
      this.xHistory = [x];
      this.yHistory = [y];
      this.oX = x || this.oX;
      this.oY = y || this.oY;
      this.velocityX = velocityX || 0;
      this.velocityY = velocityY || 0;
      this.accelerationX = accelerationX || 0;
      this.accelerationY = accelerationY || 0; // this.oVelocityX = velocityX || 0;
      // this.oVelocityY = velocityY || 0;

      this.mass = mass || 1;
      this.radius = radius || 1;
      this._color = color ? (0, _tinycolor.default)(color) : (0, _tinycolor.default)({
        r: 255,
        g: 255,
        b: 255
      });
      this.rotation = rotation || 0;
      this.lifetime = lifetime || 1;
      this.drawFn = drawFn;
      this.updateFn = updateFn; // always return a string

      this.colorFn = colorFn;
    }
  }, {
    key: "draw",
    value: function draw() {
      this.drawFn(this);
    }
  }, {
    key: "update",
    value: function update() {
      this.updateFn(this);
      this.draw(this);
    }
  }, {
    key: "color",
    get: function get() {
      if (this.colorFn) {
        return (0, _tinycolor.default)(this.colorFn(this));
      }

      return this._color;
    },
    set: function set(value) {
      this._color = (0, _tinycolor.default)(value);
    }
  }, {
    key: "colorStr",
    get: function get() {
      if (this.colorFn) {
        return this.colorFn(this);
      }

      return this._color.toRgbString();
    }
  }, {
    key: "x",
    get: function get() {
      return this._x;
    },
    set: function set(value) {
      this._x = value;
      this.xHistory.unshift(value);

      if (this.xHistory.length > MAX_COORD_HISTORY) {
        this.xHistory = this.xHistory.slice(0, MAX_COORD_HISTORY);
      }
    }
  }, {
    key: "y",
    get: function get() {
      return this._y;
    },
    set: function set(value) {
      this._y = value;
      this.yHistory.unshift(value);

      if (this.yHistory.length > MAX_COORD_HISTORY) {
        this.yHistory = this.yHistory.slice(0, MAX_COORD_HISTORY);
      }
    }
  }, {
    key: "vVector",
    get: function get() {
      return new _Vector.Vector(this.velocityX, this.velocityY, 0);
    },
    set: function set(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;
      this.velocityX = x;
      this.velocityY = y;
    }
  }, {
    key: "aVector",
    get: function get() {
      return new _Vector.Vector(this.accelerationX, this.accelerationY, 0);
    },
    set: function set(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;
      this.accelerationX = x;
      this.accelerationY = y;
    } // Rotation angle to point in direction of velocity

  }, {
    key: "heading",
    get: function get() {
      return (0, _math.pointAngleFromVelocity)(this);
    }
  }]);

  return Particle;
}();

exports.Particle = Particle;

var pixel = function pixel(x, y, color, radius) {
  return new Particle({
    x: x,
    y: y,
    color: color,
    radius: radius
  });
};

exports.pixel = pixel;

var psCanvasRandom = function psCanvasRandom(canvas) {
  return {
    x: (0, _math.randomNumberBetween)(0, canvas.width),
    y: (0, _math.randomNumberBetween)(0, canvas.height)
  };
};

exports.psCanvasRandom = psCanvasRandom;

var createRandomParticleValues = function createRandomParticleValues(canvas) {
  var vel = 2;
  var radius = (0, _math.randomNumberBetween)(5, 10);
  var coords = psCanvasRandom(canvas);
  return {
    radius: radius,
    x: coords.x,
    y: coords.y,
    mass: (0, _math.randomNumberBetween)(1, 10),
    velocityX: (0, _math.randomNumberBetween)(-vel, vel),
    velocityY: (0, _math.randomNumberBetween)(-vel, vel),
    accelerationX: 0,
    accelerationY: 0,
    rotation: (0, _math.randomNumberBetween)(-180, 180),
    // color: { r: randomNumberBetween(100, 255), g: randomNumberBetween(100, 255), b: randomNumberBetween(100, 255) },
    color: {
      r: (0, _math.lerp)(0, 255, coords.x / canvas.width),
      g: (0, _math.randomNumberBetween)(100, 255),
      b: (0, _math.lerp)(0, 255, coords.y / canvas.height)
    }
  };
};

exports.createRandomParticleValues = createRandomParticleValues;

var updatePosWithVelocity = function updatePosWithVelocity(particle) {
  particle.x += particle.vVector.x;
  particle.y += particle.vVector.y;
}; // https://www.youtube.com/watch?v=L7CECWLdTmo


exports.updatePosWithVelocity = updatePosWithVelocity;

var applyForce = function applyForce(fVect, particle) {
  var fV = fVect.div(particle.mass);
  var aV = particle.aVector.add(fV);
  var pV = particle.vVector.add(aV);
  particle.aVector = aV;
  particle.vVector = pV;
}; // https://www.youtube.com/watch?v=WBdhAuWS6X8


exports.applyForce = applyForce;

var friction = function friction(particle) {
  var mu = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
  var normal = particle.mass;
  var vfriction = particle.vVector.normalize().mult(-1).setMag(mu * normal);
  applyForce(vfriction, particle);
}; // https://www.youtube.com/watch?v=DxFDgOYEoy8


exports.friction = friction;

var drag = function drag(particle) {
  var coefficent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
  var area = 1; // particle.radius;

  var velUnit = particle.vVector.normalize().mult(-1);
  var speed = particle.vVector.magSq() * area * coefficent;
  var vdrag = velUnit.setMag(speed);
  applyForce(vdrag, particle);
}; // https://www.youtube.com/watch?v=EpgB3cNhKPM
// mode 1 is attract, -1 is repel
// const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 50, g: 1 };


exports.drag = drag;

var attract = function attract(_ref4, particle) {
  var x = _ref4.x,
      y = _ref4.y,
      mass = _ref4.mass,
      g = _ref4.g;
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var affectDist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

  if ((0, _math.pointDistance)({
    x: x,
    y: y
  }, {
    x: particle.x,
    y: particle.y
  }) < affectDist) {
    g = g || 1;
    var dir = new _Vector.Vector(x, y).sub(new _Vector.Vector(particle.x, particle.y));
    var distanceSq = (0, _math.clamp)(50, 5000, dir.magSq());
    var strength = mode * (g * (mass * particle.mass)) / distanceSq;
    var force = dir.setMag(strength);
    applyForce(force, particle);
  }
};

exports.attract = attract;

var edgeBounce = function edgeBounce(_ref5, particle) {
  var width = _ref5.width,
      height = _ref5.height;

  // if (particle.x + particle.radius > width || particle.x - particle.radius < 0) {
  //     particle.velocityX *= -1;
  // }
  // if (particle.y + particle.radius > height || particle.y - particle.radius < 0) {
  //     particle.velocityY *= -1;
  // }
  if (particle.x + particle.radius > width) {
    particle.velocityX *= -1;
    particle.x = width - particle.radius;
  }

  if (particle.x - particle.radius < 0) {
    particle.velocityX *= -1;
    particle.x = particle.radius;
  }

  if (particle.y + particle.radius > height) {
    particle.velocityY *= -1;
    particle.y = height - particle.radius;
  }

  if (particle.y - particle.radius < 0) {
    particle.velocityY *= -1;
    particle.y = particle.radius;
  }
};

exports.edgeBounce = edgeBounce;

var edgeWrap = function edgeWrap(_ref6, particle) {
  var width = _ref6.width,
      height = _ref6.height;

  if (particle.x + particle.radius > width) {
    particle.x = 0 + particle.radius;
  } else if (particle.x - particle.radius < 0) {
    particle.x = width - particle.radius;
  }

  if (particle.y + particle.radius > height) {
    particle.y = 0 + particle.radius;
  } else if (particle.y - particle.radius < 0) {
    particle.y = height - particle.radius;
  }
};

exports.edgeWrap = edgeWrap;

var gravityPoint = function gravityPoint() {
  var mult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.2;
  var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return function (x, y, radius, particle) {
    var distance = (0, _math.pointDistance)({
      x: x,
      y: y
    }, particle);

    if (distance < radius) {
      var dx = x - particle.x;
      var dy = y - particle.y;
      var forceDirectionX = dx / distance;
      var forceDirectionY = dy / distance;
      var force = (0, _math.normalizeInverse)(0, radius, distance) * f * mult;
      var tempX = forceDirectionX * force * particle.radius * 2;
      var tempY = forceDirectionY * force * particle.radius * 2;
      particle.x += tempX;
      particle.y += tempY;
    }
  };
}; // for moving points, push away/around from point


exports.gravityPoint = gravityPoint;

var avoidPoint = function avoidPoint(point, particle) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  gravityPoint(1, f *= -1)(point.x, point.y, point.radius, particle);
}; // for moving points, pull towards point


exports.avoidPoint = avoidPoint;

var attractPoint = function attractPoint(point, particle) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  gravityPoint(1, f)(point.x, point.y, point.radius, particle);
}; // for moving static, push away/outward from point


exports.attractPoint = attractPoint;

var pointPush = function pointPush(point, particle) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var dx = point.x - particle.x;
  var dy = point.y - particle.y;
  var distance = (0, _math.pointDistance)(point, particle);
  var forceDirectionX = dx / distance;
  var forceDirectionY = dy / distance;
  var force = (0, _math.normalizeInverse)(0, point.radius, distance) * f;
  particle.velocityX = forceDirectionX * force * particle.mass * 0.8;
  particle.velocityY = forceDirectionY * force * particle.mass * 0.8;

  if (distance < point.radius) {
    particle.x -= particle.velocityX;
    particle.y -= particle.velocityY;
  } else {
    // TODO if < 1 then snap to 0
    if (particle.x !== particle.oX) {
      particle.x -= (particle.x - particle.oX) * 0.1;
    }

    if (particle.y !== particle.oY) {
      particle.y -= (particle.y - particle.oY) * 0.1;
    }
  }
};

exports.pointPush = pointPush;
},{"tinycolor2":"node_modules/tinycolor2/tinycolor.js","./math":"scripts/lib/math.js","./Vector":"scripts/lib/Vector.js"}],"scripts/forcesDev.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forcesDev = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

var _Vector = require("./lib/Vector");

var forcesDev = function forcesDev() {
  var config = {
    width: 700,
    height: 700 // fps: 30,

  };
  var numParticles = 10;
  var particlesArray = [];
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas); // props.color = 'white';
      // props.mass = 1;

      props.radius = Math.sqrt(props.mass) * 10;
      props.y = 0;
      props.velocityX = 0;
      props.velocityY = 0;
      particlesArray.push(new _Particle.Particle(props));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 0,
      g: 0,
      b: 50,
      a: 0.5
    });
    (0, _canvas.drawRectFilled)(context)(0, canvas.height / 2, canvas.width, canvas.height / 2, 'rgba(255,255,255,.1');

    for (var i = 0; i < numParticles; i++) {
      var gravity = new _Vector.Vector(0, 0.25);
      var wind = new _Vector.Vector(1, 0);
      var weight = gravity.mult(particlesArray[i].mass);

      if (mouse.isDown) {
        (0, _Particle.applyForce)(wind, particlesArray[i]);
      }

      (0, _Particle.applyForce)(weight, particlesArray[i]);

      if (particlesArray[i].y + particlesArray[i].radius >= canvas.height) {
        (0, _Particle.friction)(particlesArray[i]);
      }

      if (particlesArray[i].y + particlesArray[i].radius >= canvas.height / 2) {
        (0, _Particle.drag)(particlesArray[i]);
      }

      (0, _Particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _Particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _canvas.drawRotatedParticle)(context, _canvas.drawTestPoint, particlesArray[i]);
      (0, _canvas.drawParticleVectors)(context)(particlesArray[i]);
      particlesArray[i].aVector = {
        x: 0,
        y: 0
      };
    }
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.forcesDev = forcesDev;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js","./lib/Vector":"scripts/lib/Vector.js"}],"scripts/forcesDevGravity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forcesDevGravity = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var forcesDevGravity = function forcesDevGravity() {
  var config = {// width: 700,
    // height: 700,
    // fps: 30,
  };
  var numParticles = 50;
  var particlesArray = [];
  var attractor = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    mass: 100,
    g: 20
  };
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.radius = Math.sqrt(props.mass);
      particlesArray.push(new _Particle.Particle(props));
    }
  }; // const targetX = mouse.x ? mouse.x : canvas.width / 2;
  // const targetY = mouse.y ? mouse.y : canvas.height / 2;
  // accelerateToPoint(targetX, targetY, particlesArray[i]);
  // https://www.youtube.com/watch?v=T84AWnntxZA
  // const accelerateToPoint = (targetX, targetY, particle) => {
  //     const magnitude = 0.001;
  //     const vLimit = 5;
  //     const accX = ((targetX - particle.x) * magnitude) / particle.mass;
  //     const accY = ((targetY - particle.y) * magnitude) / particle.mass;
  //     particle.velocityX += accX;
  //     particle.velocityY += accY;
  //     particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
  //     particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
  // };


  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 0,
      g: 0,
      b: 50,
      a: 0.01
    });
    var mode = 1;
    attractor.x = mouse.x ? mouse.x : canvasCenterX;
    attractor.y = mouse.y ? mouse.y : canvasCenterY;

    for (var i = 0; i < numParticles; i++) {
      if (mouse.isDown) {
        mode = -1;
      } else {
        mode = 1;
      }

      (0, _Particle.attract)(attractor, particlesArray[i], mode, 2000);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(20);
      (0, _Particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _Particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _canvas.drawRotatedParticle)(context, _canvas.drawRake, particlesArray[i]);
      particlesArray[i].aVector = {
        x: 0,
        y: 0
      };
    }
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.forcesDevGravity = forcesDevGravity;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/test-grid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testGrid = void 0;

var _math = require("./lib/math");

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var testGrid = function testGrid() {
  var config = {// width: 500,
    // height: 500,
    // fps: 24,
  };
  var numParticles;
  var particlesArray = [];
  var gridPoints = [];
  var hue = 0;
  var attractorDist;
  var leftattractor;
  var midattractor;
  var rightattractor;
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
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
    gridPoints = (0, _math.createGridPointsXY)(canvas.width, canvas.height, 100, 100, canvas.width / 50, canvas.height / 50);
    numParticles = gridPoints.length;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.x = gridPoints[i][0];
      props.y = gridPoints[i][1];
      props.velocityX = 0;
      props.velocityY = 0;
      props.mass = 1;
      props.radius = 1; // randomNumberBetween(10, 30);

      props.spikes = (0, _math.createRandomNumberArray)(20, 0, 360);
      var h = (0, _math.mapRange)(0, canvas.width, 0, 90, props.x);
      var s = 100; // lerpRange(0,10,0,100,prop.radius);

      var l = 50; // lerpRange(0,10,25,75,prop.radius);

      props.color = "hsla(".concat(h, ",").concat(s, "%,").concat(l, "%,0.1)"); // props.color = { r: 0, g: 0, b: 0, a: 0.1 };

      particlesArray.push(new _Particle.Particle(props));
    }

    (0, _canvas.background)(canvas, context)('white');
  };

  var draw = function draw(canvas, context, mouse) {
    // background(canvas, context)({ r: 255, g: 255, b: 255, a: 0.001 });
    // let mode = 1;
    // attractor.x = mouse.x ? mouse.x : canvasCenterX;
    // attractor.y = mouse.y ? mouse.y : canvasCenterY;
    for (var i = 0; i < numParticles; i++) {
      // if (mouse.isDown) {
      //     mode = -1;
      // } else {
      //     mode = 1;
      // }
      (0, _Particle.attract)(leftattractor, particlesArray[i], -1, attractorDist);
      (0, _Particle.attract)(midattractor, particlesArray[i], 1, attractorDist);
      (0, _Particle.attract)(rightattractor, particlesArray[i], -1, attractorDist);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(10);
      (0, _Particle.updatePosWithVelocity)(particlesArray[i]); // edgeBounce(canvas, particlesArray[i]);
      // edgeWrap(canvas, particlesArray[i]);

      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]); // drawSpikeCircle(context)(particlesArray[i], particlesArray[i].props.spikes);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 50, false); // drawAttractor(context)(leftattractor, -1, attractorDist);
    // drawAttractor(context)(midattractor, 1, attractorDist);
    // drawAttractor(context)(rightattractor, -1, attractorDist);
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.testGrid = testGrid;
},{"./lib/math":"scripts/lib/math.js","./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"node_modules/nice-color-palettes/100.json":[function(require,module,exports) {
module.exports = [["#69d2e7","#a7dbd8","#e0e4cc","#f38630","#fa6900"],["#fe4365","#fc9d9a","#f9cdad","#c8c8a9","#83af9b"],["#ecd078","#d95b43","#c02942","#542437","#53777a"],["#556270","#4ecdc4","#c7f464","#ff6b6b","#c44d58"],["#774f38","#e08e79","#f1d4af","#ece5ce","#c5e0dc"],["#e8ddcb","#cdb380","#036564","#033649","#031634"],["#490a3d","#bd1550","#e97f02","#f8ca00","#8a9b0f"],["#594f4f","#547980","#45ada8","#9de0ad","#e5fcc2"],["#00a0b0","#6a4a3c","#cc333f","#eb6841","#edc951"],["#e94e77","#d68189","#c6a49a","#c6e5d9","#f4ead5"],["#3fb8af","#7fc7af","#dad8a7","#ff9e9d","#ff3d7f"],["#d9ceb2","#948c75","#d5ded9","#7a6a53","#99b2b7"],["#ffffff","#cbe86b","#f2e9e1","#1c140d","#cbe86b"],["#efffcd","#dce9be","#555152","#2e2633","#99173c"],["#343838","#005f6b","#008c9e","#00b4cc","#00dffc"],["#413e4a","#73626e","#b38184","#f0b49e","#f7e4be"],["#ff4e50","#fc913a","#f9d423","#ede574","#e1f5c4"],["#99b898","#fecea8","#ff847c","#e84a5f","#2a363b"],["#655643","#80bca3","#f6f7bd","#e6ac27","#bf4d28"],["#00a8c6","#40c0cb","#f9f2e7","#aee239","#8fbe00"],["#351330","#424254","#64908a","#e8caa4","#cc2a41"],["#554236","#f77825","#d3ce3d","#f1efa5","#60b99a"],["#5d4157","#838689","#a8caba","#cad7b2","#ebe3aa"],["#8c2318","#5e8c6a","#88a65e","#bfb35a","#f2c45a"],["#fad089","#ff9c5b","#f5634a","#ed303c","#3b8183"],["#ff4242","#f4fad2","#d4ee5e","#e1edb9","#f0f2eb"],["#f8b195","#f67280","#c06c84","#6c5b7b","#355c7d"],["#d1e751","#ffffff","#000000","#4dbce9","#26ade4"],["#1b676b","#519548","#88c425","#bef202","#eafde6"],["#5e412f","#fcebb6","#78c0a8","#f07818","#f0a830"],["#bcbdac","#cfbe27","#f27435","#f02475","#3b2d38"],["#452632","#91204d","#e4844a","#e8bf56","#e2f7ce"],["#eee6ab","#c5bc8e","#696758","#45484b","#36393b"],["#f0d8a8","#3d1c00","#86b8b1","#f2d694","#fa2a00"],["#2a044a","#0b2e59","#0d6759","#7ab317","#a0c55f"],["#f04155","#ff823a","#f2f26f","#fff7bd","#95cfb7"],["#b9d7d9","#668284","#2a2829","#493736","#7b3b3b"],["#bbbb88","#ccc68d","#eedd99","#eec290","#eeaa88"],["#b3cc57","#ecf081","#ffbe40","#ef746f","#ab3e5b"],["#a3a948","#edb92e","#f85931","#ce1836","#009989"],["#300030","#480048","#601848","#c04848","#f07241"],["#67917a","#170409","#b8af03","#ccbf82","#e33258"],["#aab3ab","#c4cbb7","#ebefc9","#eee0b7","#e8caaf"],["#e8d5b7","#0e2430","#fc3a51","#f5b349","#e8d5b9"],["#ab526b","#bca297","#c5ceae","#f0e2a4","#f4ebc3"],["#607848","#789048","#c0d860","#f0f0d8","#604848"],["#b6d8c0","#c8d9bf","#dadabd","#ecdbbc","#fedcba"],["#a8e6ce","#dcedc2","#ffd3b5","#ffaaa6","#ff8c94"],["#3e4147","#fffedf","#dfba69","#5a2e2e","#2a2c31"],["#fc354c","#29221f","#13747d","#0abfbc","#fcf7c5"],["#cc0c39","#e6781e","#c8cf02","#f8fcc1","#1693a7"],["#1c2130","#028f76","#b3e099","#ffeaad","#d14334"],["#a7c5bd","#e5ddcb","#eb7b59","#cf4647","#524656"],["#dad6ca","#1bb0ce","#4f8699","#6a5e72","#563444"],["#5c323e","#a82743","#e15e32","#c0d23e","#e5f04c"],["#edebe6","#d6e1c7","#94c7b6","#403b33","#d3643b"],["#fdf1cc","#c6d6b8","#987f69","#e3ad40","#fcd036"],["#230f2b","#f21d41","#ebebbc","#bce3c5","#82b3ae"],["#b9d3b0","#81bda4","#b28774","#f88f79","#f6aa93"],["#3a111c","#574951","#83988e","#bcdea5","#e6f9bc"],["#5e3929","#cd8c52","#b7d1a3","#dee8be","#fcf7d3"],["#1c0113","#6b0103","#a30006","#c21a01","#f03c02"],["#000000","#9f111b","#b11623","#292c37","#cccccc"],["#382f32","#ffeaf2","#fcd9e5","#fbc5d8","#f1396d"],["#e3dfba","#c8d6bf","#93ccc6","#6cbdb5","#1a1f1e"],["#f6f6f6","#e8e8e8","#333333","#990100","#b90504"],["#1b325f","#9cc4e4","#e9f2f9","#3a89c9","#f26c4f"],["#a1dbb2","#fee5ad","#faca66","#f7a541","#f45d4c"],["#c1b398","#605951","#fbeec2","#61a6ab","#accec0"],["#5e9fa3","#dcd1b4","#fab87f","#f87e7b","#b05574"],["#951f2b","#f5f4d7","#e0dfb1","#a5a36c","#535233"],["#8dccad","#988864","#fea6a2","#f9d6ac","#ffe9af"],["#2d2d29","#215a6d","#3ca2a2","#92c7a3","#dfece6"],["#413d3d","#040004","#c8ff00","#fa023c","#4b000f"],["#eff3cd","#b2d5ba","#61ada0","#248f8d","#605063"],["#ffefd3","#fffee4","#d0ecea","#9fd6d2","#8b7a5e"],["#cfffdd","#b4dec1","#5c5863","#a85163","#ff1f4c"],["#9dc9ac","#fffec7","#f56218","#ff9d2e","#919167"],["#4e395d","#827085","#8ebe94","#ccfc8e","#dc5b3e"],["#a8a7a7","#cc527a","#e8175d","#474747","#363636"],["#f8edd1","#d88a8a","#474843","#9d9d93","#c5cfc6"],["#046d8b","#309292","#2fb8ac","#93a42a","#ecbe13"],["#f38a8a","#55443d","#a0cab5","#cde9ca","#f1edd0"],["#a70267","#f10c49","#fb6b41","#f6d86b","#339194"],["#ff003c","#ff8a00","#fabe28","#88c100","#00c176"],["#ffedbf","#f7803c","#f54828","#2e0d23","#f8e4c1"],["#4e4d4a","#353432","#94ba65","#2790b0","#2b4e72"],["#0ca5b0","#4e3f30","#fefeeb","#f8f4e4","#a5b3aa"],["#4d3b3b","#de6262","#ffb88c","#ffd0b3","#f5e0d3"],["#fffbb7","#a6f6af","#66b6ab","#5b7c8d","#4f2958"],["#edf6ee","#d1c089","#b3204d","#412e28","#151101"],["#9d7e79","#ccac95","#9a947c","#748b83","#5b756c"],["#fcfef5","#e9ffe1","#cdcfb7","#d6e6c3","#fafbe3"],["#9cddc8","#bfd8ad","#ddd9ab","#f7af63","#633d2e"],["#30261c","#403831","#36544f","#1f5f61","#0b8185"],["#aaff00","#ffaa00","#ff00aa","#aa00ff","#00aaff"],["#d1313d","#e5625c","#f9bf76","#8eb2c5","#615375"],["#ffe181","#eee9e5","#fad3b2","#ffba7f","#ff9c97"],["#73c8a9","#dee1b6","#e1b866","#bd5532","#373b44"],["#805841","#dcf7f3","#fffcdd","#ffd8d8","#f5a2a2"]];
},{}],"scripts/lib/palettes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.palette = exports.nicePalette = exports.palettes = void 0;

var nicepalettes = _interopRequireWildcard(require("nice-color-palettes"));

var _math = require("./math");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var palettes = {
  pop: ['#ed3441', '#ffd630', '#329fe3', '#154296', '#ffffff', '#303030'],
  '70s': ['#73BFA3', '#F2DBAE', '#F29829', '#D9631E', '#593C2C'],
  '80s_pastells': ['#FF3F3F', '#FF48C4', '#F3EA5F', '#C04DF9', '#2BD1FC', '#38CEF6'],
  '80s_pop': ['#FF82E2', '#70BAFF', '#FED715', '#0037B3', '#FE0879'],
  '90s': ['#42C8B0', '#4575F3', '#6933B0', '#D36F88', '#FC8D45'],
  retro_sunset: ['#FFD319', '#FF2975', '#F222FF', '#8C1EFF', '#FF901F'],
  vapor_wave: ['#F6A3EF', '#50D8EC', '#DD6DFB', '#EECD69', '#6FEAE6']
};
exports.palettes = palettes;

var nicePalette = function nicePalette(_) {
  return nicepalettes[(0, _math.oneOf)(Object.keys(nicepalettes))];
};

exports.nicePalette = nicePalette;

var palette = function palette(_) {
  return palettes[(0, _math.oneOf)(Object.keys(palettes))];
};

exports.palette = palette;
},{"nice-color-palettes":"node_modules/nice-color-palettes/100.json","./math":"scripts/lib/math.js"}],"scripts/lib/Timeline.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timeline = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
Canvas animation timeline based on Canvas Sketch time keeping methods
https://github.com/mattdesl/canvas-sketch/blob/master/docs/animated-sketches.md
 */
var Timeline = /*#__PURE__*/function () {
  function Timeline(fps, loop, duration) {
    _classCallCheck(this, Timeline);

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

  _createClass(Timeline, [{
    key: "onFrame",
    value: function onFrame() {
      this.drawLoopIterations++; // one frame

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
  }]);

  return Timeline;
}();

exports.Timeline = Timeline;
},{}],"scripts/timebased-template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timebasedTemplate = void 0;

var _random = _interopRequireDefault(require("canvas-sketch-util/random"));

var _canvas = require("./lib/canvas");

var _palettes = require("./lib/palettes");

var _math = require("./lib/math");

var _Timeline = require("./lib/Timeline");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var timebasedTemplate = function timebasedTemplate() {
  var config = {
    width: 600,
    height: 600,
    fps: 60
  };
  var counter = 0;
  var grid = (0, _math.createGridPointsUV)(15, 15);
  var timeline = new _Timeline.Timeline(config.fps, 0, 5);

  var setup = function setup(canvas, context) {
    var colors = (0, _palettes.nicePalette)();
    grid = grid.map(function (g) {
      g.color = (0, _math.oneOf)(colors);
      return g;
    });
    (0, _canvas.background)(canvas, context)('rgba(255,255,255,1');
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)('rgba(255,255,255,1'); // drawTextFilled(context)(timeline.playhead, 25, 25, 'red');

    grid.forEach(function (_ref) {
      var position = _ref.position,
          color = _ref.color;

      var _position = _slicedToArray(position, 2),
          u = _position[0],
          v = _position[1];

      var _marginify = (0, _math.marginify)({
        margin: 100,
        u: u,
        v: v,
        width: canvas.width,
        height: canvas.height
      }),
          x = _marginify.x,
          y = _marginify.y;

      var t = (0, _math.toSinValue)(timeline.playhead) * 0.1;
      var radius = (0, _math.create3dNoise)(u, v, counter, 3 * t) * 100; // drawCircleFilled(context)(x, y, radius, color);

      (0, _canvas.drawQuadRectFilled)(context)(x, y, radius, radius, color);
      (0, _canvas.drawRoundRectFilled)(context)(x, y, radius, radius, 5, color);
    });
    counter += 0.01; // returns -1 if number of loops exceeded

    return timeline.onFrame();
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.timebasedTemplate = timebasedTemplate;
},{"canvas-sketch-util/random":"node_modules/canvas-sketch-util/random.js","./lib/canvas":"scripts/lib/canvas.js","./lib/palettes":"scripts/lib/palettes.js","./lib/math":"scripts/lib/math.js","./lib/Timeline":"scripts/lib/Timeline.js"}],"hi1.png":[function(require,module,exports) {
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAAACXBIWXMAAAsTAAALEwEAmpwYAAALImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NjQ4LCAyMDIxLzAxLzEyLTE1OjUyOjI5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDItMThUMDg6MzY6NDEtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDItMThUMTU6Mzg6NTAtMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAyLTE4VDE1OjM4OjUwLTA1OjAwIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIwYjRjZTFjLWNkNjgtNDY0Mi05MDEzLWRmODI4MDkxZDgzMCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmUxMjY0ODcyLThjYjMtYjY0MS1hODcxLWQyZmVjNzM5ZmMwMiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmYyODI4NWFlLTMwNmItNDkwYy1iOTg3LTg1NDg3NDRiYmFiNCIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpYUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjEwMCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjEwMCI+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iSGkiIHBob3Rvc2hvcDpMYXllclRleHQ9IkhpIi8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjgyODVhZS0zMDZiLTQ5MGMtYjk4Ny04NTQ4NzQ0YmJhYjQiIHN0RXZ0OndoZW49IjIwMjEtMDItMThUMDg6MzY6NDEtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4yIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkMDFhMjJkOC1mNGVlLTQ5YzEtYTFhZC1jYzA4MTU4NTM3MDUiIHN0RXZ0OndoZW49IjIwMjEtMDItMThUMTU6Mzg6MjYtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4yIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMjAyYTRkZC0yYjk5LTQxMDQtOGVkNC03MDUxZTE0MjgwMWIiIHN0RXZ0OndoZW49IjIwMjEtMDItMThUMTU6Mzg6NTAtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4yIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMGI0Y2UxYy1jZDY4LTQ2NDItOTAxMy1kZjgyODA5MWQ4MzAiIHN0RXZ0OndoZW49IjIwMjEtMDItMThUMTU6Mzg6NTAtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4yIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMjAyYTRkZC0yYjk5LTQxMDQtOGVkNC03MDUxZTE0MjgwMWIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0YzNlZmQyMy00M2EwLTkzNDItYjdjNS1kOWMwOTdiMTQwYjgiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMjgyODVhZS0zMDZiLTQ5MGMtYjk4Ny04NTQ4NzQ0YmJhYjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5nqDTFAAAOp0lEQVR4nO3df0wT9x/H8ePnUDYZI1Pj8Af4YxlMNFummUJgRDL+MWZZMk3gj22OZSSS/cgyNUyC02k2suiMoMl0cTqzsD8W5pg60SrOH4DTBWW64QDrjw5R/FFavNqWfv/w+8OvthTa672v8Hz8pdf2Pq9rebV3veudogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFEVRlAjpABjuoqKiMjIyUlJSkpOTR44cGR8fHx0drSiKw+FQVdVqtZrN5o6OjrNnz0onDRVKCL3FxMQsWLAgNzc3PT19woQJ48aNi42N9fsoVVUvXbpkNpubm5tNJtPu3bt1iAoMKXFxce+++25dXZ3NZvME7caNGz/99NPixYsjIyOllwwwvClTpmzZsqW7uzv47j3sypUr69evHzt2rPRSAoY0atSozZs32+32UNTvfjdv3qyoqIiLi5NeYsBICgoKLBZLqOt3v/b29gULFkgvN2AAkZGRW7dudbvdejbwHqfT+eWXX0o/AYCoUaNGHTx4UP/63e/nn3+OiYmRfiYACTExMQ0NDbINvKe+vp4eYjjav3+/dPv+p7a2Vvr5APRVUVEh3bsHrV27VvpZAfSSm5vrcDikS/cgh8ORk5Mj/dwAujh69Kh047w7evSo9HMDhN5rr70m3bX+LFq0SPoZAkJs37590kXrz/79+6WfISCUkpKSVFWVLlp/HA6HkQ8u5Qh0BGvRokWPPPKIdIr+xMbGGnmNlBIiWFlZWdIR/DNyyGg9B0tLS1u+fPmkSZMG8iNOY3K5XD09PZ2dnSdOnNi8ebPb7R7IoyIjI19//fW5c+c+9dRT8fHxBll8j8fT09PT3d3d0tKybdu2y5cvBzaflJQUbYOFQliE1MPvv/8uvXWgpatXry5ZssTvUhcWFl68eFE6rB92u33Tpk2BvaxXrlyRju/f1atXA1u6oaanp0f6tdCYy+UqKCjoZ5Hz8/MN/qXF/QLr4e3bt6WD+2e32wP9sw05Xc8xY7fbR44cqeeIOmhubp45c6avWw8dOpSdna1jnKCoqjp58mSLxTKoRzkcDoOsYPcvIsKgZ1Tii5lgZWRkPPvss15vSkxMnDt3rs55ghEXF7d48WLpFMOOriW8e/eunsPpIyIiIjc31+tNeXl5987eF0ZmzJgx2IeoqhqKJNrq7e2VjuCTriWsqanRczjdTJgwwev01NRUnZMEL4Cd2kbe3Povm80mHcEnXUv4xhtvrFq1ysjvSYGJj4/3Oj0hIUHnJMEbMWLEYB8S8L4NPRk5pN7bhGVlZS+//PIQO5vyo48+Kh1BMwGcsMxsNociibY6OjqkI/gk8MXMkSNHMjIytmzZ4nK59B8dmjty5Ih0BP8OHz4sHcEnmW9H3W53UVFRQUFBV1eXSABo6LvvvnM6ndIp+qOq6s6dO6VT+CS5i+L777/Pzs4+ffq0YAYEr6ury+AfhiaTqbu7WzqFT8L7Cf/888+srCwjrypgILZu3SodwSdPoEcC6UZ+Z73Vap03b96xY8ekgyBwO3fubGpqkk7h3b59+wx+2jX5EiqK4nQ6Fy5c+M8//0gHQeBKS0sNuGVos9mWLl0qncIPQ5RQUZTLly+vXr1aOgUCt3///o0bN0qn+D8ej6e0tLS5uVk6iB9GKaGiKFVVVa2trdIpELgPPvjAZDJJp/ifLVu2bNiwQTqFfwYqoaIoXH413OXn5x8/flw6haIoSnV19dtvvy2dYkCMVcK9e/dKR0BQnE5nXl7eL7/8IpjB4/FUVlYa+aQyDzBWCU0m0wBPGAHDstvt+fn5GzduFDki6vbt2++9995AznhgHMYqodPp5DQEQ0NJScmrr77a3t6u56BHjx6dM2dOWGwH3s9YJVSM/ZMTDMquXbumTZu2Zs0aHY5W+fvvv996663MzMxw/G2A4UpotVqlI0Azbre7tLQ0NTX1008/bWtr03z+Ho/nxIkTxcXFU6dONfJRO/0zXAn7+vqkI0BjVqv1448/njJlyiuvvLJjx44LFy54PJ5gZuhyuc6cObNu3boXXnhh1qxZmzdv1iqqCMOdfCEszpWAwNTU1Nw7u8K0adPmz58/c+bM1NTU5OTkJ598sv8fE1ut1mvXrpnN5ra2tsbGxpqaGiMfkD1YhishPzIcDlpbW7/44ov7pyQlJT399NOjR4+Ojo5+7LHH3G53b2+vqqqdnZ0tLS1D+63ZcCXE8NTd3T1sD+I33DYhMNxQQkAYJQSEUUJAGCUEhFFCQBglBISxnxD+zZo1q7y8PDk5OSoqSjrLQDmdTrvd3t7eXl9f//XXXxv5cEhKCP+++uqrjIwM6RSBmDNnTmFhYVlZWUlJyY8//igdxztWR+FfuF/wffz48du3b09LS5MO4h0lhH9htBbqy6hRo5YtWyadwjtKiOEiKytLOoJ3lBD+DY1LSk6YMMGYH+mUEP7t27dPOoIGIiMjp06dKp3CC0oI/woKCj7//PMh8Hk4ZswY6QheUEIMyNKlS7Ozsw171ZewRgkxUL/99tvs2bPLy8uHwEeioVBCDM7KlSvnz59/8eJF6SBDByXEoJlMptzc3JaWFukgQwQlRCDa2try8vL++usv6SBDASVEgDo7OxcuXHjjxg3pIGGPEiJwzc3NK1askE4R9ighglJVVcV+iyBRQgSrsrJSOkJ4o4QI1vbt2y0Wi3SKMEYJoYGGhgbpCGGMEkIDBrlOfZiihNDAsL2MhCYoITTQ2NjI5bQCRgmhAbfbff36dekU4YoSQhscOhMwSght2Gw26QjhihJCG2wTBowSQhtD+4rWIUUJAWGUEBBGCQFhXBBGA5MmTfJ6ivX09HT9wyDsUEINZGZmZmZmSqdAuGJ1FBBGCQFhlBAQRgkBYZQQEEYJAWGUEBBGCQFhlBAQxhEzGmhqajKZTA9Pf/755/Py8vTPg/BCCTXQ2tq6fPnyh6evXbuWEsIvVkcBYZQQEEYJAWGUEBBGCQFhlBAQRgkBYZQQEEYJAWGUEBBGCQFhlBAQRgkBYZQQEEYJAWGUEBBGCQFhlBAQRgkBYZQQEEYJAWGUEBBGCQFhlBAQRgkBYZQQEEYJAWGUEMNdZGTkwYMHHQ6H5z9cLlddXV1UVJROAfQZBjCswsLCnJyc2NjY/06JioqaN2/e+++/r08ASojh7sUXX/Q6PTs7W58AlBDD3fjx4wc1XXOUEMOdr7KNHDlSnwCUEMNdcnKy1+n3byWGFCWENvr6+qQjBCItLe2JJ57welN8fLw+GSghtGG326UjBCInJ8fXTS6XS58MlBDa0O1PVlszZszwdZPD4dAnAyWENu7cuSMdwb/Ro0c/MOWZZ57xdee7d++GOM6/UUJoQ7c/2WA8/EXo9OnTfd3Z6XSGOM6/UUJo4+rVq9IR/MvIyLj/v4WFhY8//rivO9+6dSvUee6hhNCGxWKRjuBffn7+2LFj7/07Li7uww8/7OfO165d0yWUEq3PMBjyOjo6pCP4N2bMmIaGhj179sTGxr700kspKSn93Lmzs1OfVJQQ2mhpaZGOMCATJ0585513BnJP3T7bWR2FNsxm8/Xr16VTaEm3txVKCM20t7dLR9CM0+ncvXu3PmNRQmimtbVVOoJmLly4oKqqPmNRQmjm1KlT0hE0c/78ed3GooTQTHV1dZgevPawQ4cO6TYWJYRmLBbLuXPnpFNowOVy7dixQ7fhKCG0dPz4cekIGjhz5oxuOwkVSghtffvtt9IRNFBXV6fncJQQWvr111//+OMP6RRBUVW1qqpKzxEpITRWXV0tHSEoBw4cMJvNeo5ICaGxioqKrq4u6RQB6uvrW7dunc6DUkJoTFXV8N0yNJlMBw4c0HlQSgjtlZaWhsUvmx6gqmppaan+41JCaE9V1TVr1kinGLRvvvmmqalJ/3EpIUKisrJS//W6YLS2tpaUlIgMTQkRKkVFReHyDU1vb+/ixYt1O6nMAyghQqWjo6O4uNj4J4Dq6+v76KOPjhw5IhWAEmrA+H9nA+d2uzWc2w8//FBWVubxeDScp+YqKioqKysFAxiuhLr9iEtDPT09Xqf39vbqnCR4mmf+7LPPVq9ebdgerl+/ftmyZbIZDFfC27dvS0cYtO7u7kFNN7KbN29qPs+ysrJPPvlE28/Y4Lnd7lWrVul2JdB+GK6EZ8+elY4waCdPnvQ6/fDhwzonCV6Ifh1fXl6+ZMkSm80WipkH4NatW0VFRWVlZdJBDGnatGlOp9MTPjo7OyMjfb6XnT9/Xjrg4OTm5obuxc3MzDx37pz0InpOnjzZzyUooCiKsnfvXumXaRA2bNjQz7KsWLFCOuAgNDQ0hPrFjYmJ2bRp0507d0QW8ObNmytXrgz1Mg4F48aNO336tMiLNFh1dXX9fAzeU11dLR1zQNra2tLS0vR5iWfPnr137163263b0tnt9h07dvi6Hii8iIqKWrZs2bFjx65du2a0tVOHw2GxWEwm05tvvjnAxVm0aNGePXsuXbrkcDik4/8fl8vV3d3d1NRUXl4eFxcX0tf0YdnZ2bt27ert7Q3pMloslqqqqokTJ+q8dAMXIR1gQJKSkhITE6VTKIqidHV1Wa3WYOYQFxdnkPdjm82m50kcfBk7dmxxcfG8efOee+45Dd8ILl++3NjYWFtbu23bNq3mGSLhUUIMB4mJiYWFhbNmzUpLS5s8eXJCQsKgHu50Oi9cuNDa2nru3Lna2tr6+voQ5dQcJYRBTZ8+PT09fdKkScnJyQkJCSNGjIiOjo6Pj4+IiLDZbG63u7e31263WywWs9l8/vz5U6dOheORHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDu/gUSrmsbhFlcMgAAAABJRU5ErkJggg==";
},{}],"scripts/hiImage01.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hiImage01 = void 0;

var _hi = _interopRequireDefault(require("../hi1.png"));

var _canvas = require("./lib/canvas");

var _Particle = require("./lib/Particle");

var _math = require("./lib/math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hiImage01 = function hiImage01(_) {
  var config = {
    width: 600,
    height: 600
  };
  var numParticles = 500;
  var imageZoomFactor;
  var png = new Image();
  png.src = _hi.default;
  var particlesArray = [];
  var imageData;
  var particleColor = {
    r: 252,
    g: 3,
    b: 152
  }; // let imageColorData;
  // const createColorArrayFromImageData = (imageData) => {
  //     const data = [];
  //     for (let y = 0, { height } = imageData; y < height; y++) {
  //         for (let x = 0, { width } = imageData; x < width; x++) {
  //             data.push({ x, y, ...getImageColor(imageData, x, y) });
  //         }
  //     }
  //     return data;
  // };

  var setup = function setup(canvas, context) {
    imageData = (0, _canvas.getImageDataFromImage)(context)(png);
    (0, _canvas.clearCanvas)(canvas, context)();
    imageZoomFactor = canvas.width / imageData.width; // imageColorData = createColorArrayFromImageData(imageData);
    // const gridPoints = createGridPoints(
    //     canvas.width,
    //     canvas.height,
    //     100,
    //     100,
    //     canvas.width / 50,
    //     canvas.height / 50
    // );
    // numParticles = gridPoints.length;
    // for (let i = 0; i < numParticles; i++) {
    //     const props = createRandomParticleValues(canvas);
    //     props.x = gridPoints[i][0];
    //     props.y = gridPoints[i][1];
    //     props.radius = randomNumberBetween(1, 5);
    //     props.color = particleColor;
    //     particlesArray.push(new Particle(props));
    // }

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.radius = (0, _math.randomNumberBetween)(1, 5);
      props.color = particleColor;

      if (i % 2) {
        props.x = 0;
      } else {
        props.x = canvas.width;
      }

      particlesArray.push(new _Particle.Particle(props));
    }

    (0, _canvas.background)(canvas, context)({
      r: 255,
      g: 255,
      b: 0
    });
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 255,
      g: 255,
      b: 0,
      a: 0.004
    });

    for (var i = 0; i < numParticles; i++) {
      (0, _Particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _Particle.edgeWrap)(canvas, particlesArray[i]);
      var pxColor = (0, _canvas.getImageDataColor)(imageData, Math.round(particlesArray[i].x / imageZoomFactor), Math.round(particlesArray[i].y / imageZoomFactor));

      if (pxColor.r > 250) {
        (0, _Particle.drag)(particlesArray[i], 0.001);
        particlesArray[i].color = {
          r: 3,
          g: 227,
          b: 252
        };
      } else {
        particlesArray[i].color = particleColor;
      }

      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]);
    }
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.hiImage01 = hiImage01;
},{"../hi1.png":"hi1.png","./lib/canvas":"scripts/lib/canvas.js","./lib/Particle":"scripts/lib/Particle.js","./lib/math":"scripts/lib/math.js"}],"scripts/variation1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation1 = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

// Based on https://www.youtube.com/watch?v=d620nV6bp0A
var variation1 = function variation1() {
  var numParticles = 100;
  var particlesArray = [];
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.radius = 5;
      particlesArray.push(new _Particle.Particle(props));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.fillCanvas)(canvas, context)();

    for (var i = 0; i < numParticles; i++) {
      (0, _Particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _Particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _Particle.avoidPoint)({
        radius: centerRadius,
        x: canvasCenterX,
        y: canvasCenterY
      }, particlesArray[i], 4);
      (0, _Particle.attractPoint)(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]);
      (0, _canvas.drawPointTrail)(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 200);
    (0, _canvas.drawMouse)(context)(mouse);
  };

  return {
    setup: setup,
    draw: draw
  };
};

exports.variation1 = variation1;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/variation2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation2 = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

// Based on https://www.youtube.com/watch?v=j_BgnpMPxzM
var variation2 = function variation2() {
  var config = {
    friction: 0.8,
    gravity: 1,
    decay: 0.05,
    tweenDamp: 0.1,
    margin: 50,
    intensity: 0,
    numParticles: 200
  };
  var particlesArray = [];

  var setup = function setup(canvas, context) {
    for (var i = 0; i < config.numParticles; i++) {
      particlesArray.push(new _Particle.Particle((0, _Particle.createRandomParticleValues)(canvas)));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.clearCanvas)(canvas, context)();

    for (var i = 0; i < config.numParticles; i++) {
      particlesArray[i].radius -= config.decay;

      if (particlesArray[i].radius <= 0) {
        var newValues = (0, _Particle.createRandomParticleValues)(canvas);
        var newCoords = mouse;
        newValues.x = newCoords.x + (0, _math.randomNumberBetween)(-10, 10);
        newValues.y = newCoords.y + (0, _math.randomNumberBetween)(-10, 10);
        particlesArray[i].initValues(newValues);
      }

      particlesArray[i].y += particlesArray[i].mass * (mouse.isDown ? 1 : 0.2);
      particlesArray[i].mass += 0.2 * config.gravity;

      if (particlesArray[i].y + particlesArray[i].radius > canvas.height || particlesArray[i].y - particlesArray[i].radius < 0) {
        particlesArray[i].mass *= -1;
      }

      (0, _Particle.avoidPoint)(mouse, particlesArray[i]); // attractPoint(psMouseCoords(), particlesArray[i]);

      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]); // drawPointTrail(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 100);
    (0, _canvas.drawMouse)(context)(mouse);
    return 1;
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.variation2 = variation2;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js"}],"domokun.png":[function(require,module,exports) {
module.exports = "/domokun.0afe23b8.png";
},{}],"scripts/domokun.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.domokun = void 0;

var _domokun = _interopRequireDefault(require("../domokun.png"));

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

var _Particle = require("./lib/Particle");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Based on https://www.youtube.com/watch?v=afdHgwn1XCY
var domokun = function domokun(_) {
  var config = {
    width: 600,
    height: 600
  };
  var numParticles;
  var imageSize = 100; // square

  var png = new Image();
  png.src = _domokun.default;
  var particlesArray = [];

  var setup = function setup(canvas, context) {
    var imageData = (0, _canvas.getImageDataFromImage)(context)(png);
    (0, _canvas.clearCanvas)(canvas, context)();
    var imageZoomFactor = canvas.width / imageSize;
    var cropColor = 255 / 2;

    for (var y = 0, height = imageData.height; y < height; y++) {
      for (var x = 0, width = imageData.width; x < width; x++) {
        var pxColor = (0, _canvas.getImageDataColor)(imageData, x, y);

        if (pxColor.a > cropColor) {
          var points = (0, _math.scalePointToCanvas)(canvas.width, canvas.height, imageData.width, imageData.height, imageZoomFactor, x, y);
          var pX = points.x;
          var pY = points.y;
          var mass = (0, _math.randomNumberBetween)(2, 12);
          var color = pxColor;
          var radius = imageZoomFactor;
          particlesArray.push(new _Particle.Particle({
            x: pX,
            y: pY,
            mass: mass,
            color: color,
            radius: radius
          }));
        }
      }
    }

    numParticles = particlesArray.length;
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)('yellow');

    for (var i = 0; i < numParticles; i++) {
      (0, _Particle.pointPush)(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
      (0, _canvas.drawSquareFilled)(context)(particlesArray[i].x, particlesArray[i].y, particlesArray[i].radius, particlesArray[i].color);
    } // drawMouse(context)(mouse);

  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.domokun = domokun;
},{"../domokun.png":"domokun.png","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js","./lib/Particle":"scripts/lib/Particle.js"}],"scripts/variation4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation4 = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var variation4 = function variation4() {
  var config = {
    numParticles: 0
  };
  var particlesArray = [];
  var circles = [];

  var setup = function setup(canvas, context) {
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var diameter = canvas.height / 4;
    var steps = 10;

    for (var theta = 0; theta < 360; theta += steps) {
      var rad = theta * (Math.PI / 180);
      var x = Math.cos(rad) * diameter + centerX;
      var y = Math.sin(rad) * diameter + centerY;
      circles.push([x, y]);
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.x = x;
      props.y = y;
      props.radius = 1;
      props.color = {
        r: 0,
        g: 0,
        b: 0
      };
      props.index = circles.length - 1;
      particlesArray.push(new _Particle.Particle(props));
    }

    config.numParticles = particlesArray.length;
    (0, _canvas.fillCanvas)(canvas, context)(1, '255,255,255');
  }; // will run every frame


  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.fillCanvas)(canvas, context)(0.005, '255,255,255');

    for (var i = 0; i < config.numParticles; i++) {
      (0, _Particle.pointPush)(mouse, particlesArray[i], mouse.isDown ? -1 : 5);
      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]); // let index = particlesArray[i].index + 1;
      // if(index === circles.length) {
      //     index = 0;
      // }
      // particlesArray[i].x = circles[index][0];
      // particlesArray[i].y = circles[index][1];
      // particlesArray.index = index;
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 200);
    return 1; // -1 to exit animation loop
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.variation4 = variation4;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/variation5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation5 = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

var variation5 = function variation5() {
  var config = {
    numParticles: 50
  };
  var particlesArray = [];
  var circles = [];

  var setup = function setup(canvas, context) {
    for (var i = 0; i < config.numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.x = canvas.width / 2;
      props.y = canvas.height / 2;
      props.color = {
        r: 0,
        g: 0,
        b: 0
      };
      props.radius = 0.5;
      particlesArray.push(new _Particle.Particle(props));
    }

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var diameter = canvas.height / 4;
    var steps = 30;

    for (var theta = 0; theta < 360; theta += steps) {
      var rad = theta * (Math.PI / 180);
      var x = Math.cos(rad) * diameter + centerX;
      var y = Math.sin(rad) * diameter + centerY;
      circles.push([x, y, (0, _math.randomNumberBetween)(20, 100)]);
    }

    (0, _canvas.fillCanvas)(canvas, context)(1, '255,255,255');
  };

  var draw = function draw(canvas, context, mouse) {
    // fillCanvas(canvas, context)(.005,'255,255,255');
    for (var i = 0; i < config.numParticles; i++) {
      (0, _Particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _Particle.edgeBounce)(canvas, particlesArray[i]);

      for (var c = 0; c < circles.length; c++) {
        (0, _Particle.avoidPoint)({
          radius: circles[c][2],
          x: circles[c][0],
          y: circles[c][1]
        }, particlesArray[i], 4);
      }

      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 50);
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.variation5 = variation5;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js"}],"scripts/variation6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation6 = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

// Based on https://www.youtube.com/watch?v=j_BgnpMPxzM
var variation6 = function variation6() {
  var numParticles = 200;
  var particlesArray = [];
  var hue = 0;

  var setup = function setup(canvas, context) {
    for (var i = 0; i < numParticles; i++) {
      var initValues = (0, _Particle.createRandomParticleValues)(canvas);
      initValues.color = {
        r: 255,
        g: 255,
        b: 255
      };
      particlesArray.push(new _Particle.Particle(initValues));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.fillCanvas)(canvas, context)(0.08);
    if (hue++ > 361) hue = 0;

    for (var i = 0; i < numParticles; i++) {
      particlesArray[i].radius -= 0.05;

      if (particlesArray[i].radius <= 0) {
        var initValues = (0, _Particle.createRandomParticleValues)(canvas);
        initValues.x = mouse.x ? mouse.x : canvas.width / 2;
        initValues.y = mouse.y ? mouse.y : canvas.height / 2; // let h = lerpRange(0,canvas.width,100,200,initValues.x);

        var s = (0, _math.mapRange)(0, 10, 0, 100, initValues.radius);
        var l = (0, _math.mapRange)(0, 10, 25, 75, initValues.radius);
        initValues.color = "hsl(".concat(hue, ",").concat(s, "%,").concat(l, "%)");
        particlesArray[i].initValues(initValues);
      }

      (0, _Particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _Particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _Particle.gravityPoint)()(canvas.width / 2, canvas.height, 2000, particlesArray[i]); // gravityPoint({x:canvas.width/2, y:canvas.height}, particlesArray[i])

      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]);
    } // connectParticles(context)(particlesArray, 100);


    return 1;
  };

  return {
    setup: setup,
    draw: draw
  };
};

exports.variation6 = variation6;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js"}],"scripts/rainbow-rake-orbit-mouse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rainbowRakeOrbit = void 0;

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var rainbowRakeOrbit = function rainbowRakeOrbit() {
  var config = {// width: 700,
    // height: 700,
    // fps: 30,
  };
  var numParticles = 50;
  var particlesArray = [];
  var attractor = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    mass: 100,
    g: 20
  };
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.radius = 1; // Math.sqrt(props.mass);

      particlesArray.push(new _Particle.Particle(props));
    }
  }; // const targetX = mouse.x ? mouse.x : canvas.width / 2;
  // const targetY = mouse.y ? mouse.y : canvas.height / 2;
  // accelerateToPoint(targetX, targetY, particlesArray[i]);
  // https://www.youtube.com/watch?v=T84AWnntxZA
  // const accelerateToPoint = (targetX, targetY, particle) => {
  //     const magnitude = 0.001;
  //     const vLimit = 5;
  //     const accX = ((targetX - particle.x) * magnitude) / particle.mass;
  //     const accY = ((targetY - particle.y) * magnitude) / particle.mass;
  //     particle.velocityX += accX;
  //     particle.velocityY += accY;
  //     particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
  //     particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
  // };


  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 0,
      g: 0,
      b: 50,
      a: 0.01
    });
    var mode = 1;
    attractor.x = mouse.x ? mouse.x : canvasCenterX;
    attractor.y = mouse.y ? mouse.y : canvasCenterY;

    for (var i = 0; i < numParticles; i++) {
      if (mouse.isDown) {
        mode = -1;
      } else {
        mode = 1;
      }

      (0, _Particle.attract)(attractor, particlesArray[i], mode, 2000);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(20);
      (0, _Particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _Particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _canvas.drawRotatedParticle)(context, _canvas.drawRake, particlesArray[i]);
      particlesArray[i].aVector = {
        x: 0,
        y: 0
      };
    }
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.rainbowRakeOrbit = rainbowRakeOrbit;
},{"./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/threeAttractors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.threeAttractors = void 0;

var _math = require("./lib/math");

var _Particle = require("./lib/Particle");

var _canvas = require("./lib/canvas");

var threeAttractors = function threeAttractors() {
  var config = {// width: 500,
    // height: 500,
    // fps: 24,
  };
  var numParticles;
  var particlesArray = [];
  var gridPoints = [];
  var hue = 0;
  var attractorDist;
  var leftattractor;
  var midattractor;
  var rightattractor;
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
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
    gridPoints = (0, _math.createGridPointsXY)(canvas.width, canvas.height, 100, 100, canvas.width / 50, canvas.height / 50);
    numParticles = gridPoints.length;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _Particle.createRandomParticleValues)(canvas);
      props.x = gridPoints[i][0];
      props.y = gridPoints[i][1];
      props.velocityX = 0;
      props.velocityY = 0;
      props.mass = 1;
      props.radius = 1; // randomNumberBetween(10, 30);

      props.spikes = (0, _math.createRandomNumberArray)(20, 0, 360);
      var h = (0, _math.mapRange)(0, canvas.width, 0, 90, props.x);
      var s = 100; // lerpRange(0,10,0,100,prop.radius);

      var l = 50; // lerpRange(0,10,25,75,prop.radius);

      props.color = "hsla(".concat(h, ",").concat(s, "%,").concat(l, "%,0.1)"); // props.color = { r: 0, g: 0, b: 0, a: 0.1 };

      particlesArray.push(new _Particle.Particle(props));
    }

    (0, _canvas.background)(canvas, context)('white');
  };

  var draw = function draw(canvas, context, mouse) {
    // background(canvas, context)({ r: 255, g: 255, b: 255, a: 0.001 });
    for (var i = 0; i < numParticles; i++) {
      (0, _Particle.attract)(leftattractor, particlesArray[i], -1, attractorDist);
      (0, _Particle.attract)(midattractor, particlesArray[i], 1, attractorDist);
      (0, _Particle.attract)(rightattractor, particlesArray[i], -1, attractorDist);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(10);
      (0, _Particle.updatePosWithVelocity)(particlesArray[i]); // edgeBounce(canvas, particlesArray[i]);

      (0, _canvas.drawParticlePoint)(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 50, false);
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.threeAttractors = threeAttractors;
},{"./lib/math":"scripts/lib/math.js","./lib/Particle":"scripts/lib/Particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/index.js":[function(require,module,exports) {
"use strict";

var _normalize = _interopRequireDefault(require("normalize.css"));

var _sketch = require("./lib/sketch");

var _math = require("./lib/math");

var _forcesDev = require("./forcesDev");

var _forcesDevGravity = require("./forcesDevGravity");

var _testGrid = require("./test-grid");

var _timebasedTemplate = require("./timebased-template");

var _hiImage = require("./hiImage01");

var _variation = require("./variation1");

var _variation2 = require("./variation2");

var _domokun = require("./domokun");

var _variation3 = require("./variation4");

var _variation4 = require("./variation5");

var _variation5 = require("./variation6");

var _rainbowRakeOrbitMouse = require("./rainbow-rake-orbit-mouse");

var _threeAttractors = require("./threeAttractors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Explorations with generative code
*/
var s = (0, _sketch.sketch)();
var DEBUG = true; // TODO append random seed value

var saveCanvasCapture = function saveCanvasCapture(_) {
  console.log('Saving capture');
  var imageURI = s.canvas().toDataURL('image/png');
  document.getElementById('download').setAttribute('download', "canvas-".concat((0, _math.getRandomSeed)(), ".png"));
  document.getElementById('download').href = imageURI;
};

document.getElementById('download').addEventListener('click', saveCanvasCapture);
window.addEventListener('keydown', function (e) {
  if (e.key === 's') {
    document.getElementById('download').click();
  }
});

var setNote = function setNote(note) {
  return document.getElementById('note').innerText = note;
};

var getQueryVariable = function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      return pair[1];
    }
  }

  return false;
};

var variationKey = getQueryVariable('variation');
variationKey = variationKey || '1';
var variations = {
  1: {
    note: 'Particles are attracted to the pointer. Press to repel.',
    sketch: _variation.variation1
  },
  2: {
    note: 'Press to increase speed.',
    sketch: _variation2.variation2
  },
  3: {
    note: 'Particles are repelled from the pointer. Press to attract.',
    sketch: _domokun.domokun
  },
  4: {
    note: 'Particles are repelled from the pointer. Press to attract.',
    sketch: _variation3.variation4
  },
  5: {
    note: 'Sit back and watch.',
    sketch: _variation4.variation5
  },
  6: {
    note: 'Move the mouse',
    sketch: _variation5.variation6
  },
  7: {
    note: 'Rakes orbit center and the mouse. Click to repel.',
    sketch: _rainbowRakeOrbitMouse.rainbowRakeOrbit
  },
  8: {
    note: 'One attractor in the center, two on the sides.',
    sketch: _threeAttractors.threeAttractors
  },
  9: {
    note: 'Say Hi',
    sketch: _hiImage.hiImage01
  }
};

if (variations.hasOwnProperty(variationKey) & !DEBUG) {
  var vToRun = variations[variationKey];
  setNote(vToRun.note);
  s.run(vToRun.sketch());
} else {
  setNote('Not a valid variation!');
}

if (DEBUG) {
  // s.run(forcesDev());
  // s.run(testGrid());
  s.run((0, _timebasedTemplate.timebasedTemplate)());
}
},{"normalize.css":"node_modules/normalize.css/normalize.css","./lib/sketch":"scripts/lib/sketch.js","./lib/math":"scripts/lib/math.js","./forcesDev":"scripts/forcesDev.js","./forcesDevGravity":"scripts/forcesDevGravity.js","./test-grid":"scripts/test-grid.js","./timebased-template":"scripts/timebased-template.js","./hiImage01":"scripts/hiImage01.js","./variation1":"scripts/variation1.js","./variation2":"scripts/variation2.js","./domokun":"scripts/domokun.js","./variation4":"scripts/variation4.js","./variation5":"scripts/variation5.js","./variation6":"scripts/variation6.js","./rainbow-rake-orbit-mouse":"scripts/rainbow-rake-orbit-mouse.js","./threeAttractors":"scripts/threeAttractors.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54026" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/index.js"], null)
//# sourceMappingURL=/scripts.bcf3243b.js.map