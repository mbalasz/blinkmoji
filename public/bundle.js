(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * @license
 * Getting Started with Web Serial Codelab (https://todo)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
"use strict";

require("regenerator-runtime/runtime");

var _gifuctJs = require("gifuct-js");

var _dropzone = require("dropzone");

var _marked = /*#__PURE__*/regeneratorRuntime.mark(fillRowIterator),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(bitmapRowIterator),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(digitRowIterator),
    _marked4 = /*#__PURE__*/regeneratorRuntime.mark(digitalClockIterator);

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var port;
var reader;
var inputDone;
var outputDone;
var inputStream;
var outputStream;
var gammaTable;
var currentImage;
var COLS = 16;
var ROWS = COLS;
var MIN_GAMMA = 0.5;
var MAX_GAMMA = 3.0;
var DEFAULT_GAMMA = 2.0;
var gammaSlider = document.getElementById('gammaSlider');
var gammaDisplay = document.getElementById('gammaDisplay');
var pixelArtContainer = document.getElementById('pixelArtContainer');
_dropzone.Dropzone.options.gifDropzone = {
  autoProcessQueue: false,
  autoQueue: false,
  createImageThumbnails: false,
  accept: function accept(file, done) {
    var fr = new FileReader();

    fr.onload = function () {
      var img = document.createElement("img");
      img.src = fr.result;
      var oReq = new XMLHttpRequest();
      oReq.open("GET", img.src, true);
      oReq.responseType = "arraybuffer";

      oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response;

        if (arrayBuffer) {
          var gif = (0, _gifuctJs.parseGIF)(arrayBuffer);

          if (gif.lsd.width != ROWS || gif.lsd.height != COLS) {
            console.log(file.name + ": only " + ROWS + "x" + COLS + " GIF supported");
            return;
          }

          img.className = "pixelArt";
          initPixelArtImage(img);
          pixelArtContainer.appendChild(img);
        }
      };

      oReq.send(null);
    };

    fr.readAsDataURL(file);

    _dropzone.Dropzone.forElement("#gif-dropzone").removeFile(file);

    done();
  },
  init: function init() {
    console.log("Dropzone init!");
  }
};
document.addEventListener("DOMContentLoaded", function () {
  butConnect.addEventListener('click', clickConnect); // butSend.addEventListener('click', clickSend);
  // const notSupported = document.getElementById('notSupported');
  // notSupported.classList.toggle('hidden', 'serial' in navigator);
  // document.querySelectorAll('img.pixelArt').forEach(initPixelArtImage);

  initGamma(DEFAULT_GAMMA); // debugButton.onclick = function() { if (port) writeToStream('DBG'); };
  // clockButton.onclick = function() { drawClockMinute([0xff, 0xff, 0xff], [0x00, 0x00, 0x00], [0x00, 0x00, 0xff]); };
});

module.exports.showGif = function (fileSrc) {
  var img = document.createElement("img");
  img.src = fileSrc;
  var oReq = new XMLHttpRequest();
  oReq.open("GET", fileSrc, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response;

    if (arrayBuffer) {
      var gif = (0, _gifuctJs.parseGIF)(arrayBuffer);

      if (gif.lsd.width != ROWS || gif.lsd.height != COLS) {
        console.log(file.name + ": only " + ROWS + "x" + COLS + " GIF supported");
        return;
      }

      img.className = "pixelArt";
      currentImage = img;
      if (port) sendGifAnimation(img);
    }
  };

  oReq.send(null);
};
/**
 * @name paddedHex
 * Return the hex string representation of `number`, padded to `width` places.
 */


function paddedHex(number, width) {
  return number.toString(16).padStart(width, "0").toUpperCase();
}
/**
 * @name connect
 * Opens a Web Serial connection to the board and sets up the input and
 * output stream.
 */


function connect() {
  return _connect.apply(this, arguments);
}
/**
 * @name disconnect
 * Closes the Web Serial connection.
 */


function _connect() {
  _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var ports, encoder, decoder;
    return regeneratorRuntime.wrap(function _callee$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return navigator.serial.getPorts();

          case 2:
            ports = _context5.sent;
            _context5.prev = 3;

            if (!(ports.length == 1)) {
              _context5.next = 8;
              break;
            }

            port = ports[0];
            _context5.next = 11;
            break;

          case 8:
            _context5.next = 10;
            return navigator.serial.requestPort();

          case 10:
            port = _context5.sent;

          case 11:
            _context5.next = 13;
            return port.open({
              baudRate: 115200
            });

          case 13:
            _context5.next = 18;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return");

          case 18:
            encoder = new TextEncoderStream();
            outputDone = encoder.readable.pipeTo(port.writable);
            outputStream = encoder.writable;
            writeToStream("", "RST", "VER", "PWR");
            decoder = new TextDecoderStream();
            inputDone = port.readable.pipeTo(decoder.writable);
            inputStream = decoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer()));
            reader = inputStream.getReader();
            readLoop();

          case 27:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee, null, [[3, 15]]);
  }));
  return _connect.apply(this, arguments);
}

function disconnect() {
  return _disconnect.apply(this, arguments);
}
/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */


function _disconnect() {
  _disconnect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            writeToStream("RST");

            if (!reader) {
              _context6.next = 8;
              break;
            }

            _context6.next = 4;
            return reader.cancel();

          case 4:
            _context6.next = 6;
            return inputDone["catch"](function () {});

          case 6:
            reader = null;
            inputDone = null;

          case 8:
            if (!outputStream) {
              _context6.next = 15;
              break;
            }

            _context6.next = 11;
            return outputStream.getWriter().close();

          case 11:
            _context6.next = 13;
            return outputDone;

          case 13:
            outputStream = null;
            outputDone = null;

          case 15:
            _context6.next = 17;
            return port.close();

          case 17:
            port = null;

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee2);
  }));
  return _disconnect.apply(this, arguments);
}

function clickConnect() {
  return _clickConnect.apply(this, arguments);
}
/**
 * @name clickSend
 * Opens Send a command to the board
 */


function _clickConnect() {
  _clickConnect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!port) {
              _context7.next = 5;
              break;
            }

            _context7.next = 3;
            return disconnect();

          case 3:
            toggleUIConnected(false);
            return _context7.abrupt("return");

          case 5:
            _context7.next = 7;
            return connect();

          case 7:
            toggleUIConnected(true);
            if (currentImage) sendGifAnimation(currentImage);

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee3);
  }));
  return _clickConnect.apply(this, arguments);
}

function clickSend() {
  return _clickSend.apply(this, arguments);
}
/**
 * @name readLoop
 * Reads data from the input stream and displays it on screen.
 */


function _clickSend() {
  _clickSend = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (port) {
              _context8.next = 2;
              break;
            }

            return _context8.abrupt("return");

          case 2:
            writeToStream(commandTextInput.value);

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee4);
  }));
  return _clickSend.apply(this, arguments);
}

function readLoop() {
  return _readLoop.apply(this, arguments);
}

function _readLoop() {
  _readLoop = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var _yield$reader$read, value, done;

    return regeneratorRuntime.wrap(function _callee5$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (!true) {
              _context9.next = 13;
              break;
            }

            _context9.next = 3;
            return reader.read();

          case 3:
            _yield$reader$read = _context9.sent;
            value = _yield$reader$read.value;
            done = _yield$reader$read.done;

            if (value) {
              console.log("[RECV]" + value + "\n");
            }

            if (!done) {
              _context9.next = 11;
              break;
            }

            console.log("[readLoop] DONE", done);
            reader.releaseLock();
            return _context9.abrupt("break", 13);

          case 11:
            _context9.next = 0;
            break;

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee5);
  }));
  return _readLoop.apply(this, arguments);
}

var Frame = function Frame(ms, pixels) {
  _classCallCheck(this, Frame);

  this.duration = ms;
  this.rows = Array.from(pixels, function (row) {
    return Array.from(row, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          r = _ref2[0],
          g = _ref2[1],
          b = _ref2[2];

      return paddedHex(gammaTable[r] << 16 | gammaTable[g] << 8 | gammaTable[b], 6);
    }).join("");
  });
};

var Animation = /*#__PURE__*/function () {
  function Animation(ms) {
    _classCallCheck(this, Animation);

    this.duration = ms;
    this.frames = [];
  }

  _createClass(Animation, [{
    key: "addFrame",
    value: function addFrame(f) {
      this.frames.push(f);
    }
  }]);

  return Animation;
}();

function sendAnimation(anim) {
  writeToStream("ANM " + anim.duration);
  anim.frames.forEach(function (frame) {
    writeToStream("FRM " + frame.duration);
    frame.rows.forEach(function (row) {
      return writeToStream("RGB " + row);
    });
  });
  writeToStream("DON", "NXT");
}
/**
 * @name sendGifAnimation
 * Sends a GIF animation to the display
 */


function sendGifAnimation(img) {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", img.src, true);
  oReq.responseType = "arraybuffer";
  console.log("Sending gif animation");

  oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response;

    if (arrayBuffer) {
      var gif = (0, _gifuctJs.parseGIF)(arrayBuffer);
      if (gif.lsd.width != ROWS || gif.lsd.height != COLS) return;
      var frames = (0, _gifuctJs.decompressFrames)(gif, true);

      if (frames) {
        var animation = new Animation(600000);
        var pixels = Array(ROWS).fill().map(function () {
          return Array(COLS);
        });
        frames.forEach(function (gifFrame) {
          pixels.forEach(function (row) {
            return row.fill(0);
          });
          var bitmap = gifFrame.patch;
          var row_offset = gifFrame.dims.top;
          var col_offset = gifFrame.dims.left;

          for (var r = 0; r < gifFrame.dims.height; r++) {
            for (var c = 0; c < gifFrame.dims.width; c++) {
              var offset = (r * gifFrame.dims.width + c) * 4;
              pixels[r + row_offset][c + col_offset] = [bitmap[offset], bitmap[offset + 1], bitmap[offset + 2]];
            }
          }

          animation.addFrame(new Frame("delay" in gifFrame ? gifFrame.delay : 1000, pixels));
        });
        console.log("Sending animation");
        sendAnimation(animation);
      }
    }
  };

  oReq.send(null);
}
/**
 * @name writeToStream
 * Gets a writer from the output stream and send the lines to the micro:bit.
 * @param  {...string} lines lines to send to the micro:bit
 */


function writeToStream() {
  var writer = outputStream.getWriter();

  for (var _len = arguments.length, lines = new Array(_len), _key = 0; _key < _len; _key++) {
    lines[_key] = arguments[_key];
  }

  lines.forEach(function (line) {
    console.log("[SEND]", line);
    writer.write(line + "\n");
  });
  writer.releaseLock();
}
/**
 * @name LineBreakTransformer
 * TransformStream to parse the stream into lines.
 */


var LineBreakTransformer = /*#__PURE__*/function () {
  function LineBreakTransformer() {
    _classCallCheck(this, LineBreakTransformer);

    // A container for holding stream data until a new line.
    this.container = "";
  }

  _createClass(LineBreakTransformer, [{
    key: "transform",
    value: function transform(chunk, controller) {
      this.container += chunk;
      var lines = this.container.split("\n");
      this.container = lines.pop();
      lines.forEach(function (line) {
        return controller.enqueue(line);
      });
    }
  }, {
    key: "flush",
    value: function flush(controller) {
      controller.enqueue(this.container);
    }
  }]);

  return LineBreakTransformer;
}();

function initPixelArtImage(img) {
  img.crossOrigin = "Anonymous";

  img.onclick = function () {
    console.log("image clicked");
    if (port) sendGifAnimation(img);
    currentImage = img;
  };
}

function gammaValueFromSlider(v) {
  return MIN_GAMMA + v * (MAX_GAMMA - MIN_GAMMA) / 100.0;
}

function sliderValueFromGamma(g) {
  return (g - MIN_GAMMA) * 100.0 / (MAX_GAMMA - MIN_GAMMA);
}

function updateSliderDisplay(slider, display) {
  gammaDisplay.innerHTML = gammaValueFromSlider(gammaSlider.value).toFixed(2);
}

function updateGamma() {
  var gamma = gammaValueFromSlider(gammaSlider.value);
  var i = 0;
  gammaTable = Array.from(Array(256), function () {
    return Math.round(255 * Math.pow(i++ / 255.0, gamma));
  });

  if (currentImage) {
    sendGifAnimation(currentImage);
  }
}

function initGamma(g) {
  gammaSlider.value = sliderValueFromGamma(g);

  gammaSlider.oninput = function () {
    updateSliderDisplay(gammaSlider, gammaDisplay);
  };

  gammaSlider.oninput();
  gammaSlider.onchange = updateGamma;
  updateGamma();
}

function toggleUIConnected(connected) {
  var lbl = "Connect";

  if (connected) {
    lbl = "Disconnect";
  }

  butConnect.textContent = lbl;
}

var DIGIT_ROWS = 5;
var CLOCK_VERTICAL_OFFSET = 5;
var Digits = [[[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]], [[0, 1, 0], [1, 1, 0], [0, 1, 0], [0, 1, 0], [1, 1, 1]], [[1, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 1]], [[1, 1, 1], [0, 0, 1], [0, 1, 1], [0, 0, 1], [1, 1, 1]], [[1, 0, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [0, 0, 1]], [[1, 1, 1], [1, 0, 0], [1, 1, 0], [0, 0, 1], [1, 1, 0]], [[1, 1, 1], [1, 0, 0], [1, 1, 1], [1, 0, 1], [1, 1, 1]], [[1, 1, 1], [0, 0, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0]], [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 1, 1]], [[1, 1, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]]];

function fillRowIterator(color) {
  var c;
  return regeneratorRuntime.wrap(function fillRowIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          c = 0;

        case 1:
          if (!(c < COLS)) {
            _context.next = 7;
            break;
          }

          _context.next = 4;
          return color;

        case 4:
          c++;
          _context.next = 1;
          break;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function bitmapRowIterator(row, fg, bg) {
  var i;
  return regeneratorRuntime.wrap(function bitmapRowIterator$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i < row.length)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 4;
          return row[i] ? fg : bg;

        case 4:
          i++;
          _context2.next = 1;
          break;

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2);
}

function digitRowIterator(row, h10, h1, m10, m1, fg, bg, colon) {
  var center;
  return regeneratorRuntime.wrap(function digitRowIterator$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.delegateYield(bitmapRowIterator(Digits[h10][row], fg, bg), "t0", 1);

        case 1:
          _context3.next = 3;
          return bg;

        case 3:
          return _context3.delegateYield(bitmapRowIterator(Digits[h1][row], fg, bg), "t1", 4);

        case 4:
          center = row % 2 ? colon : bg;
          _context3.next = 7;
          return center;

        case 7:
          _context3.next = 9;
          return center;

        case 9:
          return _context3.delegateYield(bitmapRowIterator(Digits[m10][row], fg, bg), "t2", 10);

        case 10:
          _context3.next = 12;
          return bg;

        case 12:
          return _context3.delegateYield(bitmapRowIterator(Digits[m1][row], fg, bg), "t3", 13);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3);
}

function digitalClockIterator(h10, h1, m10, m1, fg, bg, colon) {
  var r;
  return regeneratorRuntime.wrap(function digitalClockIterator$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          r = 0;

        case 1:
          if (!(r < CLOCK_VERTICAL_OFFSET)) {
            _context4.next = 7;
            break;
          }

          _context4.next = 4;
          return fillRowIterator(bg);

        case 4:
          r++;
          _context4.next = 1;
          break;

        case 7:
          r = 0;

        case 8:
          if (!(r < DIGIT_ROWS)) {
            _context4.next = 14;
            break;
          }

          _context4.next = 11;
          return digitRowIterator(r, h10, h1, m10, m1, fg, bg, colon);

        case 11:
          r++;
          _context4.next = 8;
          break;

        case 14:
          r = 0;

        case 15:
          if (!(r < ROWS - (CLOCK_VERTICAL_OFFSET + DIGIT_ROWS))) {
            _context4.next = 21;
            break;
          }

          _context4.next = 18;
          return fillRowIterator(bg);

        case 18:
          r++;
          _context4.next = 15;
          break;

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4);
}

function drawClockMinute(fg, bg, colon) {
  var t = new Date();
  var hours = t.getHours();
  var minutes = t.getMinutes();
  var animation = new Animation(60000);
  animation.addFrame(new Frame(500, digitalClockIterator(Math.floor(hours / 10), hours % 10, Math.floor(minutes / 10), minutes % 10, fg, bg, colon)));
  animation.addFrame(new Frame(500, digitalClockIterator(Math.floor(hours / 10), hours % 10, Math.floor(minutes / 10), minutes % 10, fg, bg, bg)));
  sendAnimation(animation);
}

},{"dropzone":4,"gifuct-js":6,"regenerator-runtime/runtime":12}],2:[function(require,module,exports){
"use strict";

var _emojiButton = require("@joeattardi/emoji-button");

var _require = require("./blinken"),
    showGif = _require.showGif;

var socket = io(); // let messages = document.getElementById("messages");
// var form = document.getElementById("form");
// var input = document.getElementById("input");
// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit("chat message", input.value);
//     input.value = "";
//   }
// });
// socket.on("chat message", (msg) => {
//   let item = document.createElement("li");
//   item.textContent = msg;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });

socket.on("show gif", function (gifSrc) {
  showGif(gifSrc);
});
var picker = new _emojiButton.EmojiButton({
  theme: "dark"
});
var trigger = document.getElementById("emoji-trigger");
picker.on("emoji", function (selection) {
  trigger.innerHTML = selection.emoji;
  socket.emit('chat message', selection.emoji);
});
trigger.addEventListener("click", function () {
  return picker.togglePicker(trigger);
});

},{"./blinken":1,"@joeattardi/emoji-button":3}],3:[function(require,module,exports){
(function (global,setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmojiButton = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function e(e, o, n, i) {
  return new (n || (n = Promise))(function (a, r) {
    function t(e) {
      try {
        m(i.next(e));
      } catch (e) {
        r(e);
      }
    }

    function s(e) {
      try {
        m(i["throw"](e));
      } catch (e) {
        r(e);
      }
    }

    function m(e) {
      var o;
      e.done ? a(e.value) : (o = e.value, o instanceof n ? o : new n(function (e) {
        e(o);
      })).then(t, s);
    }

    m((i = i.apply(e, o || [])).next());
  });
}

!function (e, o) {
  void 0 === o && (o = {});
  var n = o.insertAt;

  if (e && "undefined" != typeof document) {
    var i = document.head || document.getElementsByTagName("head")[0],
        a = document.createElement("style");
    a.type = "text/css", "top" === n && i.firstChild ? i.insertBefore(a, i.firstChild) : i.appendChild(a), a.styleSheet ? a.styleSheet.cssText = e : a.appendChild(document.createTextNode(e));
  }
}('@keyframes show {\n  0% {\n    opacity: 0;\n    transform: scale3d(0.8, 0.8, 0.8);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  100% {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes hide {\n  0% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale3d(0.8, 0.8, 0.8);\n  }\n}\n\n@keyframes grow {\n  0% {\n    opacity: 0;\n    transform: scale3d(0.8, 0.8, 0.8); \n  }\n\n  100% { \n    opacity: 1;\n    transform: scale3d(1, 1, 1); \n  }\n}\n\n@keyframes shrink {\n  0% { \n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n\n  100% { \n    opacity: 0;\n    transform: scale3d(0.8, 0.8, 0.8); \n  }\n}\n\n@keyframes fade-in {\n  0% { opacity: 0; }\n  100% { opacity: 1; }\n}\n\n@keyframes fade-out {\n  0% { opacity: 1; }\n  100% { opacity: 0; }\n}\n\n.emoji-picker {\n  --animation-duration: 0.2s;\n  --animation-easing: ease-in-out;\n\n  --emoji-size: 1.8em;\n  --emoji-size-multiplier: 1.5;\n  --emoji-preview-size: 2em;\n  --emoji-per-row: 8;\n  --row-count: 6;\n\n  --content-height: calc((var(--emoji-size) * var(--emoji-size-multiplier)) * var(--row-count) + var(--category-name-size) + var(--category-button-height) + 0.5em);\n\n  --category-name-size: 0.85em;\n\n  --category-button-height: 2em;\n  --category-button-size: 1.1em;\n  --category-border-bottom-size: 4px;\n\n  --focus-indicator-color: #999999;\n\n  --search-height: 2em;\n\n  --blue-color: #4F81E5;\n\n  --border-color: #CCCCCC;\n  --background-color: #FFFFFF;\n  --text-color: #000000;\n  --secondary-text-color: #666666;\n  --hover-color: #E8F4F9;\n  --search-focus-border-color: var(--blue-color);\n  --search-icon-color: #CCCCCC;\n  --overlay-background-color: rgba(0, 0, 0, 0.8);\n  --popup-background-color: #FFFFFF;\n  --category-button-color: #666666;\n  --category-button-active-color: var(--blue-color);\n\n  --dark-border-color: #666666;\n  --dark-background-color: #333333;\n  --dark-text-color: #FFFFFF;\n  --dark-secondary-text-color: #999999;\n  --dark-hover-color: #666666;\n  --dark-search-background-color: #666666;\n  --dark-search-border-color: #999999;\n  --dark-search-placeholder-color: #999999;\n  --dark-search-focus-border-color: #DBE5F9;\n  --dark-popup-background-color: #333333;\n  --dark-category-button-color: #FFFFFF;\n\n  --font: Arial, Helvetica, sans-serif;\n  --font-size: 16px;\n}\n\n.emoji-picker {\n  font-size: var(--font-size);\n  border: 1px solid var(--border-color);\n  border-radius: 5px;\n  background: var(--background-color);\n  width: calc(var(--emoji-per-row) * var(--emoji-size) * var(--emoji-size-multiplier) + 1em + 1.5rem);\n  font-family: var(--font);\n  overflow: hidden;\n  animation: show var(--animation-duration) var(--animation-easing);\n}\n\n.emoji-picker * {\n  font-family: var(--font);\n  box-sizing: content-box;\n}\n\n.emoji-picker__overlay {\n  background: rgba(0, 0, 0, 0.75);\n  z-index: 1000;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.emoji-picker.hiding {\n  animation: hide var(--animation-duration) var(--animation-easing);\n}\n\n.emoji-picker.dark {\n  background: var(--dark-background-color);\n  color: var(--dark-text-color);\n  border-color: var(--dark-border-color);\n}\n\n.emoji-picker__content {\n  padding: 0.5em;\n  height: var(--content-height);\n  position: relative;\n}\n\n.emoji-picker__preview {\n  height: var(--emoji-preview-size);\n  padding: 0.5em;\n  border-top: 1px solid var(--border-color);\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n.emoji-picker.dark .emoji-picker__preview {\n  border-top-color: var(--dark-border-color);\n}\n\n.emoji-picker__preview-emoji {\n  font-size: var(--emoji-preview-size);\n  margin-right: 0.25em;\n  font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji";\n}\n\n.emoji-picker__preview-emoji img.emoji {\n  height: 1em;\n  width: 1em;\n  margin: 0 .05em 0 .1em;\n  vertical-align: -0.1em;\n}\n\n.emoji-picker__preview-name {\n  color: var(--text-color);\n  font-size: 0.85em;\n  overflow-wrap: break-word;\n  word-break: break-all;\n}\n\n.emoji-picker.dark .emoji-picker__preview-name {\n  color: var(--dark-text-color);\n}\n\n.emoji-picker__container {\n  display: grid;\n  justify-content: center;\n  grid-template-columns: repeat(var(--emoji-per-row), calc(var(--emoji-size) * var(--emoji-size-multiplier)));\n  grid-auto-rows: calc(var(--emoji-size) * var(--emoji-size-multiplier));\n}\n\n.emoji-picker__container.search-results {\n  height: var(--content-height);\n  overflow-y: auto;\n}\n\n.emoji-picker__custom-emoji {\n  width: 1em;\n  height: 1em;\n}\n\n.emoji-picker__emoji {\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  overflow: hidden;\n  font-size: var(--emoji-size);\n  width: 1.5em;\n  height: 1.5em;\n  padding: 0;\n  margin: 0;\n  outline: none;\n  font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji";\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.emoji-picker__emoji img.emoji {\n  height: 1em;\n  width: 1em;\n  margin: 0 .05em 0 .1em;\n  vertical-align: -0.1em;\n}\n\n.emoji-picker__emoji:focus, .emoji-picker__emoji:hover {\n  background: var(--hover-color);\n}\n\n.emoji-picker__emoji:focus {\n  outline: 1px dotted var(--focus-indicator-color);\n}\n\n.emoji-picker.dark .emoji-picker__emoji:focus, .emoji-picker.dark .emoji-picker__emoji:hover {\n  background: var(--dark-hover-color);\n}\n\n.emoji-picker__plugin-container {\n  margin: 0.5em;\n  display: flex;\n  flex-direction: row;\n}\n\n.emoji-picker__search-container {\n  margin: 0.5em;\n  position: relative;\n  height: var(--search-height);\n  display: flex;\n}\n\n.emoji-picker__search {\n  box-sizing: border-box;\n  width: 100%;\n  border-radius: 3px;\n  border: 1px solid var(--border-color);\n  padding-right: 2em;\n  padding: 0.5em 2.25em 0.5em 0.5em;\n  font-size: 0.85em;\n  outline: none;\n}\n\n.emoji-picker.dark .emoji-picker__search {\n  background: var(--dark-search-background-color);\n  color: var(--dark-text-color);\n  border-color: var(--dark-search-border-color);\n}\n\n.emoji-picker.dark .emoji-picker__search::placeholder {\n  color: var(--dark-search-placeholder-color);\n}\n\n.emoji-picker__search:focus {\n  border: 1px solid var(--search-focus-border-color);\n}\n\n.emoji-picker.dark .emoji-picker__search:focus {\n  border-color: var(--dark-search-focus-border-color);\n}\n\n.emoji-picker__search-icon {\n  position: absolute;\n  color: var(--search-icon-color);\n  width: 1em;\n  height: 1em;\n  right: 0.75em;\n  top: calc(50% - 0.5em);\n}\n\n.emoji-picker__search-icon img {\n  width: 1em;\n  height: 1em;\n}\n\n.emoji-picker__search-not-found {\n  color: var(--secondary-text-color);\n  text-align: center;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.emoji-picker__search-not-found h2 {\n  color: var(--secondary-text-color);\n}\n\n.emoji-picker.dark .emoji-picker__search-not-found {\n  color: var(--dark-secondary-text-color);\n}\n\n.emoji-picker.dark .emoji-picker__search-not-found h2 {\n  color: var(--dark-secondary-text-color);\n}\n\n.emoji-picker__search-not-found-icon {\n  font-size: 3em;\n}\n\n.emoji-picker__search-not-found-icon img {\n  width: 1em;\n  height: 1em;\n}\n\n.emoji-picker__search-not-found h2 {\n  margin: 0.5em 0;\n  font-size: 1em;\n}\n\n.emoji-picker__variant-overlay {\n  background: var(--overlay-background-color);\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 5px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  animation: fade-in var(--animation-duration) var(--animation-easing);\n}\n\n.emoji-picker__variant-overlay.hiding {\n  animation: fade-out var(--animation-duration) var(--animation-easing);\n}\n\n.emoji-picker__variant-popup {\n  background: var(--popup-background-color);\n  margin: 0.5em;\n  padding: 0.5em;\n  text-align: center;\n  border-radius: 5px;\n  animation: grow var(--animation-duration) var(--animation-easing);\n  user-select: none;\n}\n\n.emoji-picker__variant-overlay.hiding .emoji-picker__variant-popup {\n  animation: shrink var(--animation-duration) var(--animation-easing);\n}\n\n.emoji-picker.dark .emoji-picker__variant-popup {\n  background: var(--dark-popup-background-color);\n}\n\n.emoji-picker__emojis {\n  overflow-y: auto;\n  position: relative;\n  height: calc((var(--emoji-size) * var(--emoji-size-multiplier)) * var(--row-count) + var(--category-name-size));\n}\n\n.emoji-picker__emojis.hiding {\n  animation: fade-out 0.05s var(--animation-easing);\n}\n\n.emoji-picker__emojis h2.emoji-picker__category-name {\n  font-size: 0.85em;\n  color: var(--secondary-text-color);\n  text-transform: uppercase;\n  margin: 0.25em 0;\n  text-align: left;\n}\n\n.emoji-picker.dark h2.emoji-picker__category-name {\n  color: var(--dark-secondary-text-color);\n}\n\n.emoji-picker__category-buttons {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-around;\n  height: var(--category-button-height);\n  margin-bottom: 0.5em;\n}\n\nbutton.emoji-picker__category-button {\n  flex-grow: 1;\n  background: transparent;\n  padding: 0;\n  border: none;\n  cursor: pointer;\n  font-size: var(--category-button-size);\n  vertical-align: middle;\n  color: var(--category-button-color);\n  border-bottom: var(--category-border-bottom-size) solid transparent;\n  outline: none;\n}\n\nbutton.emoji-picker__category-button img {\n  width: var(--category-button-size);\n  height: var(--category-button-size);\n}\n\n.emoji-picker.keyboard button.emoji-picker__category-button:focus {\n  outline: 1px dotted var(--focus-indicator-color);\n}\n\n.emoji-picker.dark button.emoji-picker__category-button.active {\n  color: var(--category-button-active-color);\n}\n\n.emoji-picker.dark button.emoji-picker__category-button {\n  color: var(--dark-category-button-color);\n}\n\nbutton.emoji-picker__category-button.active {\n  color: var(--category-button-active-color);\n  border-bottom: var(--category-border-bottom-size) solid var(--category-button-active-color);\n}\n\n@media (prefers-color-scheme: dark) {\n  .emoji-picker.auto {\n    background: var(--dark-background-color);\n    color: var(--dark-text-color);\n    border-color: var(--dark-border-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__preview {\n    border-top-color: var(--dark-border-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__preview-name {\n    color: var(--dark-text-color);\n  }\n\n  .emoji-picker.auto button.emoji-picker__category-button {\n    color: var(--dark-category-button-color);\n  }\n\n  .emoji-picker.auto button.emoji-picker__category-button.active {\n    color: var(--category-button-active-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__emoji:focus, .emoji-picker.auto .emoji-picker__emoji:hover {\n    background: var(--dark-hover-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__search {\n    background: var(--dark-search-background-color);\n    color: var(--dark-text-color);\n    border-color: var(--dark-search-border-color);\n  }\n \n  .emoji-picker.auto h2.emoji-picker__category-name {\n    color: var(--dark-secondary-text-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__search::placeholder {\n    color: var(--dark-search-placeholder-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__search:focus {\n    border-color: var(--dark-search-focus-border-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__search-not-found {\n    color: var(--dark-secondary-text-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__search-not-found h2 {\n    color: var(--dark-secondary-text-color);\n  }\n\n  .emoji-picker.auto .emoji-picker__variant-popup {\n    background: var(--dark-popup-background-color);\n  }\n}');
var o = ["input", "select", "textarea", "a[href]", "button", "[tabindex]", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])'],
    n = o.join(","),
    i = "undefined" == typeof Element ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

function a(e, o) {
  o = o || {};
  var a,
      t,
      s,
      d = [],
      g = [],
      u = e.querySelectorAll(n);

  for (o.includeContainer && i.call(e, n) && (u = Array.prototype.slice.apply(u)).unshift(e), a = 0; a < u.length; a++) {
    r(t = u[a]) && (0 === (s = m(t)) ? d.push(t) : g.push({
      documentOrder: a,
      tabIndex: s,
      node: t
    }));
  }

  return g.sort(c).map(function (e) {
    return e.node;
  }).concat(d);
}

function r(e) {
  return !(!t(e) || function (e) {
    return function (e) {
      return d(e) && "radio" === e.type;
    }(e) && !function (e) {
      if (!e.name) return !0;

      var o = function (e) {
        for (var o = 0; o < e.length; o++) {
          if (e[o].checked) return e[o];
        }
      }(e.ownerDocument.querySelectorAll('input[type="radio"][name="' + e.name + '"]'));

      return !o || o === e;
    }(e);
  }(e) || m(e) < 0);
}

function t(e) {
  return !(e.disabled || function (e) {
    return d(e) && "hidden" === e.type;
  }(e) || function (e) {
    return null === e.offsetParent || "hidden" === getComputedStyle(e).visibility;
  }(e));
}

a.isTabbable = function (e) {
  if (!e) throw new Error("No node provided");
  return !1 !== i.call(e, n) && r(e);
}, a.isFocusable = function (e) {
  if (!e) throw new Error("No node provided");
  return !1 !== i.call(e, s) && t(e);
};
var s = o.concat("iframe").join(",");

function m(e) {
  var o = parseInt(e.getAttribute("tabindex"), 10);
  return isNaN(o) ? function (e) {
    return "true" === e.contentEditable;
  }(e) ? 0 : e.tabIndex : o;
}

function c(e, o) {
  return e.tabIndex === o.tabIndex ? e.documentOrder - o.documentOrder : e.tabIndex - o.tabIndex;
}

function d(e) {
  return "INPUT" === e.tagName;
}

var g,
    u = a,
    l = function l() {
  for (var e = {}, o = 0; o < arguments.length; o++) {
    var n = arguments[o];

    for (var i in n) {
      v.call(n, i) && (e[i] = n[i]);
    }
  }

  return e;
},
    v = Object.prototype.hasOwnProperty;

var f,
    y = (f = [], {
  activateTrap: function activateTrap(e) {
    if (f.length > 0) {
      var o = f[f.length - 1];
      o !== e && o.pause();
    }

    var n = f.indexOf(e);
    -1 === n || f.splice(n, 1), f.push(e);
  },
  deactivateTrap: function deactivateTrap(e) {
    var o = f.indexOf(e);
    -1 !== o && f.splice(o, 1), f.length > 0 && f[f.length - 1].unpause();
  }
});

function j(e) {
  return setTimeout(e, 0);
}

var h = function h(e, o) {
  var n = document,
      i = "string" == typeof e ? n.querySelector(e) : e,
      a = l({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0
  }, o),
      r = {
    firstTabbableNode: null,
    lastTabbableNode: null,
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: !1,
    paused: !1
  },
      t = {
    activate: function activate(e) {
      if (r.active) return;
      w(), r.active = !0, r.paused = !1, r.nodeFocusedBeforeActivation = n.activeElement;
      var o = e && e.onActivate ? e.onActivate : a.onActivate;
      o && o();
      return m(), t;
    },
    deactivate: s,
    pause: function pause() {
      if (r.paused || !r.active) return;
      r.paused = !0, c();
    },
    unpause: function unpause() {
      if (!r.paused || !r.active) return;
      r.paused = !1, w(), m();
    }
  };
  return t;

  function s(e) {
    if (r.active) {
      clearTimeout(g), c(), r.active = !1, r.paused = !1, y.deactivateTrap(t);
      var o = e && void 0 !== e.onDeactivate ? e.onDeactivate : a.onDeactivate;
      return o && o(), (e && void 0 !== e.returnFocus ? e.returnFocus : a.returnFocusOnDeactivate) && j(function () {
        var e;
        k((e = r.nodeFocusedBeforeActivation, d("setReturnFocus") || e));
      }), t;
    }
  }

  function m() {
    if (r.active) return y.activateTrap(t), g = j(function () {
      k(v());
    }), n.addEventListener("focusin", h, !0), n.addEventListener("mousedown", f, {
      capture: !0,
      passive: !1
    }), n.addEventListener("touchstart", f, {
      capture: !0,
      passive: !1
    }), n.addEventListener("click", b, {
      capture: !0,
      passive: !1
    }), n.addEventListener("keydown", p, {
      capture: !0,
      passive: !1
    }), t;
  }

  function c() {
    if (r.active) return n.removeEventListener("focusin", h, !0), n.removeEventListener("mousedown", f, !0), n.removeEventListener("touchstart", f, !0), n.removeEventListener("click", b, !0), n.removeEventListener("keydown", p, !0), t;
  }

  function d(e) {
    var o = a[e],
        i = o;
    if (!o) return null;
    if ("string" == typeof o && !(i = n.querySelector(o))) throw new Error("`" + e + "` refers to no known node");
    if ("function" == typeof o && !(i = o())) throw new Error("`" + e + "` did not return a node");
    return i;
  }

  function v() {
    var e;
    if (!(e = null !== d("initialFocus") ? d("initialFocus") : i.contains(n.activeElement) ? n.activeElement : r.firstTabbableNode || d("fallbackFocus"))) throw new Error("Your focus-trap needs to have at least one focusable element");
    return e;
  }

  function f(e) {
    i.contains(e.target) || (a.clickOutsideDeactivates ? s({
      returnFocus: !u.isFocusable(e.target)
    }) : a.allowOutsideClick && a.allowOutsideClick(e) || e.preventDefault());
  }

  function h(e) {
    i.contains(e.target) || e.target instanceof Document || (e.stopImmediatePropagation(), k(r.mostRecentlyFocusedNode || v()));
  }

  function p(e) {
    if (!1 !== a.escapeDeactivates && function (e) {
      return "Escape" === e.key || "Esc" === e.key || 27 === e.keyCode;
    }(e)) return e.preventDefault(), void s();
    (function (e) {
      return "Tab" === e.key || 9 === e.keyCode;
    })(e) && function (e) {
      if (w(), e.shiftKey && e.target === r.firstTabbableNode) return e.preventDefault(), void k(r.lastTabbableNode);
      if (!e.shiftKey && e.target === r.lastTabbableNode) e.preventDefault(), k(r.firstTabbableNode);
    }(e);
  }

  function b(e) {
    a.clickOutsideDeactivates || i.contains(e.target) || a.allowOutsideClick && a.allowOutsideClick(e) || (e.preventDefault(), e.stopImmediatePropagation());
  }

  function w() {
    var e = u(i);
    r.firstTabbableNode = e[0] || v(), r.lastTabbableNode = e[e.length - 1] || v();
  }

  function k(e) {
    e !== n.activeElement && (e && e.focus ? (e.focus(), r.mostRecentlyFocusedNode = e, function (e) {
      return e.tagName && "input" === e.tagName.toLowerCase() && "function" == typeof e.select;
    }(e) && e.select()) : k(v()));
  }
};

function p() {}

p.prototype = {
  on: function on(e, o, n) {
    var i = this.e || (this.e = {});
    return (i[e] || (i[e] = [])).push({
      fn: o,
      ctx: n
    }), this;
  },
  once: function once(e, o, n) {
    var i = this;

    function a() {
      i.off(e, a), o.apply(n, arguments);
    }

    return a._ = o, this.on(e, a, n);
  },
  emit: function emit(e) {
    for (var o = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[e] || []).slice(), i = 0, a = n.length; i < a; i++) {
      n[i].fn.apply(n[i].ctx, o);
    }

    return this;
  },
  off: function off(e, o) {
    var n = this.e || (this.e = {}),
        i = n[e],
        a = [];
    if (i && o) for (var r = 0, t = i.length; r < t; r++) {
      i[r].fn !== o && i[r].fn._ !== o && a.push(i[r]);
    }
    return a.length ? n[e] = a : delete n[e], this;
  }
};
var b = p;

function w(e) {
  var o = e.getBoundingClientRect();
  return {
    width: o.width,
    height: o.height,
    top: o.top,
    right: o.right,
    bottom: o.bottom,
    left: o.left,
    x: o.left,
    y: o.top
  };
}

function k(e) {
  if ("[object Window]" !== e.toString()) {
    var o = e.ownerDocument;
    return o ? o.defaultView : window;
  }

  return e;
}

function x(e) {
  var o = k(e);
  return {
    scrollLeft: o.pageXOffset,
    scrollTop: o.pageYOffset
  };
}

function C(e) {
  return e instanceof k(e).Element || e instanceof Element;
}

function E(e) {
  return e instanceof k(e).HTMLElement || e instanceof HTMLElement;
}

function _(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}

function z(e) {
  return (C(e) ? e.ownerDocument : e.document).documentElement;
}

function O(e) {
  return w(z(e)).left + x(e).scrollLeft;
}

function I(e) {
  return k(e).getComputedStyle(e);
}

function S(e) {
  var o = I(e),
      n = o.overflow,
      i = o.overflowX,
      a = o.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + a + i);
}

function P(e, o, n) {
  void 0 === n && (n = !1);
  var i,
      a,
      r = z(o),
      t = w(e),
      s = {
    scrollLeft: 0,
    scrollTop: 0
  },
      m = {
    x: 0,
    y: 0
  };
  return n || (("body" !== _(o) || S(r)) && (s = (i = o) !== k(i) && E(i) ? {
    scrollLeft: (a = i).scrollLeft,
    scrollTop: a.scrollTop
  } : x(i)), E(o) ? ((m = w(o)).x += o.clientLeft, m.y += o.clientTop) : r && (m.x = O(r))), {
    x: t.left + s.scrollLeft - m.x,
    y: t.top + s.scrollTop - m.y,
    width: t.width,
    height: t.height
  };
}

function M(e) {
  return {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}

function A(e) {
  return "html" === _(e) ? e : e.assignedSlot || e.parentNode || e.host || z(e);
}

function L(e) {
  return ["html", "body", "#document"].indexOf(_(e)) >= 0 ? e.ownerDocument.body : E(e) && S(e) ? e : L(A(e));
}

function T(e, o) {
  void 0 === o && (o = []);

  var n = L(e),
      i = "body" === _(n),
      a = k(n),
      r = i ? [a].concat(a.visualViewport || [], S(n) ? n : []) : n,
      t = o.concat(r);

  return i ? t : t.concat(T(A(r)));
}

function N(e) {
  return ["table", "td", "th"].indexOf(_(e)) >= 0;
}

function F(e) {
  return E(e) && "fixed" !== I(e).position ? e.offsetParent : null;
}

function B(e) {
  for (var o = k(e), n = F(e); n && N(n);) {
    n = F(n);
  }

  return n && "body" === _(n) && "static" === I(n).position ? o : n || o;
}

p.TinyEmitter = b;
var D = "top",
    R = "bottom",
    q = "right",
    V = "left",
    H = [D, R, q, V],
    U = H.reduce(function (e, o) {
  return e.concat([o + "-start", o + "-end"]);
}, []),
    W = [].concat(H, ["auto"]).reduce(function (e, o) {
  return e.concat([o, o + "-start", o + "-end"]);
}, []),
    K = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];

function J(e) {
  var o = new Map(),
      n = new Set(),
      i = [];

  function a(e) {
    n.add(e.name), [].concat(e.requires || [], e.requiresIfExists || []).forEach(function (e) {
      if (!n.has(e)) {
        var i = o.get(e);
        i && a(i);
      }
    }), i.push(e);
  }

  return e.forEach(function (e) {
    o.set(e.name, e);
  }), e.forEach(function (e) {
    n.has(e.name) || a(e);
  }), i;
}

function G(e) {
  return e.split("-")[0];
}

var X = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};

function Y() {
  for (var e = arguments.length, o = new Array(e), n = 0; n < e; n++) {
    o[n] = arguments[n];
  }

  return !o.some(function (e) {
    return !(e && "function" == typeof e.getBoundingClientRect);
  });
}

function $(e) {
  void 0 === e && (e = {});
  var o = e,
      n = o.defaultModifiers,
      i = void 0 === n ? [] : n,
      a = o.defaultOptions,
      r = void 0 === a ? X : a;
  return function (e, o, n) {
    void 0 === n && (n = r);
    var a,
        t,
        s = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, X, {}, r),
      modifiersData: {},
      elements: {
        reference: e,
        popper: o
      },
      attributes: {},
      styles: {}
    },
        m = [],
        c = !1,
        d = {
      state: s,
      setOptions: function setOptions(n) {
        g(), s.options = Object.assign({}, r, {}, s.options, {}, n), s.scrollParents = {
          reference: C(e) ? T(e) : e.contextElement ? T(e.contextElement) : [],
          popper: T(o)
        };

        var a,
            t,
            c = function (e) {
          var o = J(e);
          return K.reduce(function (e, n) {
            return e.concat(o.filter(function (e) {
              return e.phase === n;
            }));
          }, []);
        }((a = [].concat(i, s.options.modifiers), t = a.reduce(function (e, o) {
          var n = e[o.name];
          return e[o.name] = n ? Object.assign({}, n, {}, o, {
            options: Object.assign({}, n.options, {}, o.options),
            data: Object.assign({}, n.data, {}, o.data)
          }) : o, e;
        }, {}), Object.keys(t).map(function (e) {
          return t[e];
        })));

        return s.orderedModifiers = c.filter(function (e) {
          return e.enabled;
        }), s.orderedModifiers.forEach(function (e) {
          var o = e.name,
              n = e.options,
              i = void 0 === n ? {} : n,
              a = e.effect;

          if ("function" == typeof a) {
            var r = a({
              state: s,
              name: o,
              instance: d,
              options: i
            }),
                t = function t() {};

            m.push(r || t);
          }
        }), d.update();
      },
      forceUpdate: function forceUpdate() {
        if (!c) {
          var e = s.elements,
              o = e.reference,
              n = e.popper;

          if (Y(o, n)) {
            s.rects = {
              reference: P(o, B(n), "fixed" === s.options.strategy),
              popper: M(n)
            }, s.reset = !1, s.placement = s.options.placement, s.orderedModifiers.forEach(function (e) {
              return s.modifiersData[e.name] = Object.assign({}, e.data);
            });

            for (var i = 0; i < s.orderedModifiers.length; i++) {
              if (!0 !== s.reset) {
                var a = s.orderedModifiers[i],
                    r = a.fn,
                    t = a.options,
                    m = void 0 === t ? {} : t,
                    g = a.name;
                "function" == typeof r && (s = r({
                  state: s,
                  options: m,
                  name: g,
                  instance: d
                }) || s);
              } else s.reset = !1, i = -1;
            }
          }
        }
      },
      update: (a = function a() {
        return new Promise(function (e) {
          d.forceUpdate(), e(s);
        });
      }, function () {
        return t || (t = new Promise(function (e) {
          Promise.resolve().then(function () {
            t = void 0, e(a());
          });
        })), t;
      }),
      destroy: function destroy() {
        g(), c = !0;
      }
    };
    if (!Y(e, o)) return d;

    function g() {
      m.forEach(function (e) {
        return e();
      }), m = [];
    }

    return d.setOptions(n).then(function (e) {
      !c && n.onFirstUpdate && n.onFirstUpdate(e);
    }), d;
  };
}

var Z = {
  passive: !0
};

function Q(e) {
  return e.split("-")[1];
}

function ee(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}

function oe(e) {
  var o,
      n = e.reference,
      i = e.element,
      a = e.placement,
      r = a ? G(a) : null,
      t = a ? Q(a) : null,
      s = n.x + n.width / 2 - i.width / 2,
      m = n.y + n.height / 2 - i.height / 2;

  switch (r) {
    case D:
      o = {
        x: s,
        y: n.y - i.height
      };
      break;

    case R:
      o = {
        x: s,
        y: n.y + n.height
      };
      break;

    case q:
      o = {
        x: n.x + n.width,
        y: m
      };
      break;

    case V:
      o = {
        x: n.x - i.width,
        y: m
      };
      break;

    default:
      o = {
        x: n.x,
        y: n.y
      };
  }

  var c = r ? ee(r) : null;

  if (null != c) {
    var d = "y" === c ? "height" : "width";

    switch (t) {
      case "start":
        o[c] = Math.floor(o[c]) - Math.floor(n[d] / 2 - i[d] / 2);
        break;

      case "end":
        o[c] = Math.floor(o[c]) + Math.ceil(n[d] / 2 - i[d] / 2);
    }
  }

  return o;
}

var ne = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};

function ie(e) {
  var o,
      n = e.popper,
      i = e.popperRect,
      a = e.placement,
      r = e.offsets,
      t = e.position,
      s = e.gpuAcceleration,
      m = e.adaptive,
      c = function (e) {
    var o = e.x,
        n = e.y,
        i = window.devicePixelRatio || 1;
    return {
      x: Math.round(o * i) / i || 0,
      y: Math.round(n * i) / i || 0
    };
  }(r),
      d = c.x,
      g = c.y,
      u = r.hasOwnProperty("x"),
      l = r.hasOwnProperty("y"),
      v = V,
      f = D,
      y = window;

  if (m) {
    var j = B(n);
    j === k(n) && (j = z(n)), a === D && (f = R, g -= j.clientHeight - i.height, g *= s ? 1 : -1), a === V && (v = q, d -= j.clientWidth - i.width, d *= s ? 1 : -1);
  }

  var h,
      p = Object.assign({
    position: t
  }, m && ne);
  return s ? Object.assign({}, p, ((h = {})[f] = l ? "0" : "", h[v] = u ? "0" : "", h.transform = (y.devicePixelRatio || 1) < 2 ? "translate(" + d + "px, " + g + "px)" : "translate3d(" + d + "px, " + g + "px, 0)", h)) : Object.assign({}, p, ((o = {})[f] = l ? g + "px" : "", o[v] = u ? d + "px" : "", o.transform = "", o));
}

var ae = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};

function re(e) {
  return e.replace(/left|right|bottom|top/g, function (e) {
    return ae[e];
  });
}

var te = {
  start: "end",
  end: "start"
};

function se(e) {
  return e.replace(/start|end/g, function (e) {
    return te[e];
  });
}

function me(e) {
  return parseFloat(e) || 0;
}

function ce(e) {
  var o = k(e),
      n = function (e) {
    var o = E(e) ? I(e) : {};
    return {
      top: me(o.borderTopWidth),
      right: me(o.borderRightWidth),
      bottom: me(o.borderBottomWidth),
      left: me(o.borderLeftWidth)
    };
  }(e),
      i = "html" === _(e),
      a = O(e),
      r = e.clientWidth + n.right,
      t = e.clientHeight + n.bottom;

  return i && o.innerHeight - e.clientHeight > 50 && (t = o.innerHeight - n.bottom), {
    top: i ? 0 : e.clientTop,
    right: e.clientLeft > n.left ? n.right : i ? o.innerWidth - r - a : e.offsetWidth - r,
    bottom: i ? o.innerHeight - t : e.offsetHeight - t,
    left: i ? a : e.clientLeft
  };
}

function de(e, o) {
  var n = Boolean(o.getRootNode && o.getRootNode().host);
  if (e.contains(o)) return !0;

  if (n) {
    var i = o;

    do {
      if (i && e.isSameNode(i)) return !0;
      i = i.parentNode || i.host;
    } while (i);
  }

  return !1;
}

function ge(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height
  });
}

function ue(e, o) {
  return "viewport" === o ? ge(function (e) {
    var o = k(e),
        n = o.visualViewport,
        i = o.innerWidth,
        a = o.innerHeight;
    return n && /iPhone|iPod|iPad/.test(navigator.platform) && (i = n.width, a = n.height), {
      width: i,
      height: a,
      x: 0,
      y: 0
    };
  }(e)) : E(o) ? w(o) : ge(function (e) {
    var o = k(e),
        n = x(e),
        i = P(z(e), o);
    return i.height = Math.max(i.height, o.innerHeight), i.width = Math.max(i.width, o.innerWidth), i.x = -n.scrollLeft, i.y = -n.scrollTop, i;
  }(z(e)));
}

function le(e, o, n) {
  var i = "clippingParents" === o ? function (e) {
    var o = T(e),
        n = ["absolute", "fixed"].indexOf(I(e).position) >= 0 && E(e) ? B(e) : e;
    return C(n) ? o.filter(function (e) {
      return C(e) && de(e, n);
    }) : [];
  }(e) : [].concat(o),
      a = [].concat(i, [n]),
      r = a[0],
      t = a.reduce(function (o, n) {
    var i = ue(e, n),
        a = ce(E(n) ? n : z(e));
    return o.top = Math.max(i.top + a.top, o.top), o.right = Math.min(i.right - a.right, o.right), o.bottom = Math.min(i.bottom - a.bottom, o.bottom), o.left = Math.max(i.left + a.left, o.left), o;
  }, ue(e, r));
  return t.width = t.right - t.left, t.height = t.bottom - t.top, t.x = t.left, t.y = t.top, t;
}

function ve(e) {
  return Object.assign({}, {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, {}, e);
}

function fe(e, o) {
  return o.reduce(function (o, n) {
    return o[n] = e, o;
  }, {});
}

function ye(e, o) {
  void 0 === o && (o = {});

  var n = o,
      i = n.placement,
      a = void 0 === i ? e.placement : i,
      r = n.boundary,
      t = void 0 === r ? "clippingParents" : r,
      s = n.rootBoundary,
      m = void 0 === s ? "viewport" : s,
      c = n.elementContext,
      d = void 0 === c ? "popper" : c,
      g = n.altBoundary,
      u = void 0 !== g && g,
      l = n.padding,
      v = void 0 === l ? 0 : l,
      f = ve("number" != typeof v ? v : fe(v, H)),
      y = "popper" === d ? "reference" : "popper",
      j = e.elements.reference,
      h = e.rects.popper,
      p = e.elements[u ? y : d],
      b = le(C(p) ? p : p.contextElement || z(e.elements.popper), t, m),
      k = w(j),
      x = oe({
    reference: k,
    element: h,
    strategy: "absolute",
    placement: a
  }),
      E = ge(Object.assign({}, h, {}, x)),
      _ = "popper" === d ? E : k,
      O = {
    top: b.top - _.top + f.top,
    bottom: _.bottom - b.bottom + f.bottom,
    left: b.left - _.left + f.left,
    right: _.right - b.right + f.right
  },
      I = e.modifiersData.offset;

  if ("popper" === d && I) {
    var S = I[a];
    Object.keys(O).forEach(function (e) {
      var o = [q, R].indexOf(e) >= 0 ? 1 : -1,
          n = [D, R].indexOf(e) >= 0 ? "y" : "x";
      O[e] += S[n] * o;
    });
  }

  return O;
}

function je(e, o) {
  void 0 === o && (o = {});
  var n = o,
      i = n.placement,
      a = n.boundary,
      r = n.rootBoundary,
      t = n.padding,
      s = n.flipVariations,
      m = n.allowedAutoPlacements,
      c = void 0 === m ? W : m,
      d = Q(i),
      g = (d ? s ? U : U.filter(function (e) {
    return Q(e) === d;
  }) : H).filter(function (e) {
    return c.indexOf(e) >= 0;
  }).reduce(function (o, n) {
    return o[n] = ye(e, {
      placement: n,
      boundary: a,
      rootBoundary: r,
      padding: t
    })[G(n)], o;
  }, {});
  return Object.keys(g).sort(function (e, o) {
    return g[e] - g[o];
  });
}

function he(e, o, n) {
  return Math.max(e, Math.min(o, n));
}

function pe(e, o, n) {
  return void 0 === n && (n = {
    x: 0,
    y: 0
  }), {
    top: e.top - o.height - n.y,
    right: e.right - o.width + n.x,
    bottom: e.bottom - o.height + n.y,
    left: e.left - o.width - n.x
  };
}

function be(e) {
  return [D, q, R, V].some(function (o) {
    return e[o] >= 0;
  });
}

var we = $({
  defaultModifiers: [{
    name: "eventListeners",
    enabled: !0,
    phase: "write",
    fn: function fn() {},
    effect: function effect(e) {
      var o = e.state,
          n = e.instance,
          i = e.options,
          a = i.scroll,
          r = void 0 === a || a,
          t = i.resize,
          s = void 0 === t || t,
          m = k(o.elements.popper),
          c = [].concat(o.scrollParents.reference, o.scrollParents.popper);
      return r && c.forEach(function (e) {
        e.addEventListener("scroll", n.update, Z);
      }), s && m.addEventListener("resize", n.update, Z), function () {
        r && c.forEach(function (e) {
          e.removeEventListener("scroll", n.update, Z);
        }), s && m.removeEventListener("resize", n.update, Z);
      };
    },
    data: {}
  }, {
    name: "popperOffsets",
    enabled: !0,
    phase: "read",
    fn: function fn(e) {
      var o = e.state,
          n = e.name;
      o.modifiersData[n] = oe({
        reference: o.rects.reference,
        element: o.rects.popper,
        strategy: "absolute",
        placement: o.placement
      });
    },
    data: {}
  }, {
    name: "computeStyles",
    enabled: !0,
    phase: "beforeWrite",
    fn: function fn(e) {
      var o = e.state,
          n = e.options,
          i = n.gpuAcceleration,
          a = void 0 === i || i,
          r = n.adaptive,
          t = void 0 === r || r,
          s = {
        placement: G(o.placement),
        popper: o.elements.popper,
        popperRect: o.rects.popper,
        gpuAcceleration: a
      };
      null != o.modifiersData.popperOffsets && (o.styles.popper = Object.assign({}, o.styles.popper, {}, ie(Object.assign({}, s, {
        offsets: o.modifiersData.popperOffsets,
        position: o.options.strategy,
        adaptive: t
      })))), null != o.modifiersData.arrow && (o.styles.arrow = Object.assign({}, o.styles.arrow, {}, ie(Object.assign({}, s, {
        offsets: o.modifiersData.arrow,
        position: "absolute",
        adaptive: !1
      })))), o.attributes.popper = Object.assign({}, o.attributes.popper, {
        "data-popper-placement": o.placement
      });
    },
    data: {}
  }, {
    name: "applyStyles",
    enabled: !0,
    phase: "write",
    fn: function fn(e) {
      var o = e.state;
      Object.keys(o.elements).forEach(function (e) {
        var n = o.styles[e] || {},
            i = o.attributes[e] || {},
            a = o.elements[e];
        E(a) && _(a) && (Object.assign(a.style, n), Object.keys(i).forEach(function (e) {
          var o = i[e];
          !1 === o ? a.removeAttribute(e) : a.setAttribute(e, !0 === o ? "" : o);
        }));
      });
    },
    effect: function effect(e) {
      var o = e.state,
          n = {
        popper: {
          position: o.options.strategy,
          left: "0",
          top: "0",
          margin: "0"
        },
        arrow: {
          position: "absolute"
        },
        reference: {}
      };
      return Object.assign(o.elements.popper.style, n.popper), o.elements.arrow && Object.assign(o.elements.arrow.style, n.arrow), function () {
        Object.keys(o.elements).forEach(function (e) {
          var i = o.elements[e],
              a = o.attributes[e] || {},
              r = Object.keys(o.styles.hasOwnProperty(e) ? o.styles[e] : n[e]).reduce(function (e, o) {
            return e[o] = "", e;
          }, {});
          E(i) && _(i) && (Object.assign(i.style, r), Object.keys(a).forEach(function (e) {
            i.removeAttribute(e);
          }));
        });
      };
    },
    requires: ["computeStyles"]
  }, {
    name: "offset",
    enabled: !0,
    phase: "main",
    requires: ["popperOffsets"],
    fn: function fn(e) {
      var o = e.state,
          n = e.options,
          i = e.name,
          a = n.offset,
          r = void 0 === a ? [0, 0] : a,
          t = W.reduce(function (e, n) {
        return e[n] = function (e, o, n) {
          var i = G(e),
              a = [V, D].indexOf(i) >= 0 ? -1 : 1,
              r = "function" == typeof n ? n(Object.assign({}, o, {
            placement: e
          })) : n,
              t = r[0],
              s = r[1];
          return t = t || 0, s = (s || 0) * a, [V, q].indexOf(i) >= 0 ? {
            x: s,
            y: t
          } : {
            x: t,
            y: s
          };
        }(n, o.rects, r), e;
      }, {}),
          s = t[o.placement],
          m = s.x,
          c = s.y;
      null != o.modifiersData.popperOffsets && (o.modifiersData.popperOffsets.x += m, o.modifiersData.popperOffsets.y += c), o.modifiersData[i] = t;
    }
  }, {
    name: "flip",
    enabled: !0,
    phase: "main",
    fn: function fn(e) {
      var o = e.state,
          n = e.options,
          i = e.name;

      if (!o.modifiersData[i]._skip) {
        for (var a = n.mainAxis, r = void 0 === a || a, t = n.altAxis, s = void 0 === t || t, m = n.fallbackPlacements, c = n.padding, d = n.boundary, g = n.rootBoundary, u = n.altBoundary, l = n.flipVariations, v = void 0 === l || l, f = n.allowedAutoPlacements, y = o.options.placement, j = G(y), h = m || (j === y || !v ? [re(y)] : function (e) {
          if ("auto" === G(e)) return [];
          var o = re(e);
          return [se(e), o, se(o)];
        }(y)), p = [y].concat(h).reduce(function (e, n) {
          return e.concat("auto" === G(n) ? je(o, {
            placement: n,
            boundary: d,
            rootBoundary: g,
            padding: c,
            flipVariations: v,
            allowedAutoPlacements: f
          }) : n);
        }, []), b = o.rects.reference, w = o.rects.popper, k = new Map(), x = !0, C = p[0], E = 0; E < p.length; E++) {
          var _ = p[E],
              z = G(_),
              O = "start" === Q(_),
              I = [D, R].indexOf(z) >= 0,
              S = I ? "width" : "height",
              P = ye(o, {
            placement: _,
            boundary: d,
            rootBoundary: g,
            altBoundary: u,
            padding: c
          }),
              M = I ? O ? q : V : O ? R : D;
          b[S] > w[S] && (M = re(M));
          var A = re(M),
              L = [];

          if (r && L.push(P[z] <= 0), s && L.push(P[M] <= 0, P[A] <= 0), L.every(function (e) {
            return e;
          })) {
            C = _, x = !1;
            break;
          }

          k.set(_, L);
        }

        if (x) for (var T = function T(e) {
          var o = p.find(function (o) {
            var n = k.get(o);
            if (n) return n.slice(0, e).every(function (e) {
              return e;
            });
          });
          if (o) return C = o, "break";
        }, N = v ? 3 : 1; N > 0; N--) {
          if ("break" === T(N)) break;
        }
        o.placement !== C && (o.modifiersData[i]._skip = !0, o.placement = C, o.reset = !0);
      }
    },
    requiresIfExists: ["offset"],
    data: {
      _skip: !1
    }
  }, {
    name: "preventOverflow",
    enabled: !0,
    phase: "main",
    fn: function fn(e) {
      var o = e.state,
          n = e.options,
          i = e.name,
          a = n.mainAxis,
          r = void 0 === a || a,
          t = n.altAxis,
          s = void 0 !== t && t,
          m = n.boundary,
          c = n.rootBoundary,
          d = n.altBoundary,
          g = n.padding,
          u = n.tether,
          l = void 0 === u || u,
          v = n.tetherOffset,
          f = void 0 === v ? 0 : v,
          y = ye(o, {
        boundary: m,
        rootBoundary: c,
        padding: g,
        altBoundary: d
      }),
          j = G(o.placement),
          h = Q(o.placement),
          p = !h,
          b = ee(j),
          w = "x" === b ? "y" : "x",
          k = o.modifiersData.popperOffsets,
          x = o.rects.reference,
          C = o.rects.popper,
          E = "function" == typeof f ? f(Object.assign({}, o.rects, {
        placement: o.placement
      })) : f,
          _ = {
        x: 0,
        y: 0
      };

      if (k) {
        if (r) {
          var z = "y" === b ? D : V,
              O = "y" === b ? R : q,
              I = "y" === b ? "height" : "width",
              S = k[b],
              P = k[b] + y[z],
              A = k[b] - y[O],
              L = l ? -C[I] / 2 : 0,
              T = "start" === h ? x[I] : C[I],
              N = "start" === h ? -C[I] : -x[I],
              F = o.elements.arrow,
              H = l && F ? M(F) : {
            width: 0,
            height: 0
          },
              U = o.modifiersData["arrow#persistent"] ? o.modifiersData["arrow#persistent"].padding : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
              W = U[z],
              K = U[O],
              J = he(0, x[I], H[I]),
              X = p ? x[I] / 2 - L - J - W - E : T - J - W - E,
              Y = p ? -x[I] / 2 + L + J + K + E : N + J + K + E,
              $ = o.elements.arrow && B(o.elements.arrow),
              Z = $ ? "y" === b ? $.clientTop || 0 : $.clientLeft || 0 : 0,
              oe = o.modifiersData.offset ? o.modifiersData.offset[o.placement][b] : 0,
              ne = k[b] + X - oe - Z,
              ie = k[b] + Y - oe,
              ae = he(l ? Math.min(P, ne) : P, S, l ? Math.max(A, ie) : A);
          k[b] = ae, _[b] = ae - S;
        }

        if (s) {
          var re = "x" === b ? D : V,
              te = "x" === b ? R : q,
              se = k[w],
              me = he(se + y[re], se, se - y[te]);
          k[w] = me, _[w] = me - se;
        }

        o.modifiersData[i] = _;
      }
    },
    requiresIfExists: ["offset"]
  }, {
    name: "arrow",
    enabled: !0,
    phase: "main",
    fn: function fn(e) {
      var o,
          n = e.state,
          i = e.name,
          a = n.elements.arrow,
          r = n.modifiersData.popperOffsets,
          t = G(n.placement),
          s = ee(t),
          m = [V, q].indexOf(t) >= 0 ? "height" : "width";

      if (a && r) {
        var c = n.modifiersData[i + "#persistent"].padding,
            d = M(a),
            g = "y" === s ? D : V,
            u = "y" === s ? R : q,
            l = n.rects.reference[m] + n.rects.reference[s] - r[s] - n.rects.popper[m],
            v = r[s] - n.rects.reference[s],
            f = B(a),
            y = f ? "y" === s ? f.clientHeight || 0 : f.clientWidth || 0 : 0,
            j = l / 2 - v / 2,
            h = c[g],
            p = y - d[m] - c[u],
            b = y / 2 - d[m] / 2 + j,
            w = he(h, b, p),
            k = s;
        n.modifiersData[i] = ((o = {})[k] = w, o.centerOffset = w - b, o);
      }
    },
    effect: function effect(e) {
      var o = e.state,
          n = e.options,
          i = e.name,
          a = n.element,
          r = void 0 === a ? "[data-popper-arrow]" : a,
          t = n.padding,
          s = void 0 === t ? 0 : t;
      null != r && ("string" != typeof r || (r = o.elements.popper.querySelector(r))) && de(o.elements.popper, r) && (o.elements.arrow = r, o.modifiersData[i + "#persistent"] = {
        padding: ve("number" != typeof s ? s : fe(s, H))
      });
    },
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  }, {
    name: "hide",
    enabled: !0,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: function fn(e) {
      var o = e.state,
          n = e.name,
          i = o.rects.reference,
          a = o.rects.popper,
          r = o.modifiersData.preventOverflow,
          t = ye(o, {
        elementContext: "reference"
      }),
          s = ye(o, {
        altBoundary: !0
      }),
          m = pe(t, i),
          c = pe(s, a, r),
          d = be(m),
          g = be(c);
      o.modifiersData[n] = {
        referenceClippingOffsets: m,
        popperEscapeOffsets: c,
        isReferenceHidden: d,
        hasPopperEscaped: g
      }, o.attributes.popper = Object.assign({}, o.attributes.popper, {
        "data-popper-reference-hidden": d,
        "data-popper-escaped": g
      });
    }
  }]
}),
    ke = function () {
  var e = {
    base: "https://twemoji.maxcdn.com/v/13.0.0/",
    ext: ".png",
    size: "72x72",
    className: "emoji",
    convert: {
      fromCodePoint: function fromCodePoint(e) {
        var o = "string" == typeof e ? parseInt(e, 16) : e;
        if (o < 65536) return s(o);
        return s(55296 + ((o -= 65536) >> 10), 56320 + (1023 & o));
      },
      toCodePoint: j
    },
    onerror: function onerror() {
      this.parentNode && this.parentNode.replaceChild(m(this.alt, !1), this);
    },
    parse: function parse(o, n) {
      n && "function" != typeof n || (n = {
        callback: n
      });
      return ("string" == typeof o ? l : u)(o, {
        callback: n.callback || c,
        attributes: "function" == typeof n.attributes ? n.attributes : f,
        base: "string" == typeof n.base ? n.base : e.base,
        ext: n.ext || e.ext,
        size: n.folder || (i = n.size || e.size, "number" == typeof i ? i + "x" + i : i),
        className: n.className || e.className,
        onerror: n.onerror || e.onerror
      });
      var i;
    },
    replace: y,
    test: function test(e) {
      n.lastIndex = 0;
      var o = n.test(e);
      return n.lastIndex = 0, o;
    }
  },
      o = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  },
      n = /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,
      i = /\uFE0F/g,
      a = String.fromCharCode(8205),
      r = /[&<>'"]/g,
      t = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,
      s = String.fromCharCode;
  return e;

  function m(e, o) {
    return document.createTextNode(o ? e.replace(i, "") : e);
  }

  function c(e, o) {
    return "".concat(o.base, o.size, "/", e, o.ext);
  }

  function d(e, o) {
    for (var n, i, a = e.childNodes, r = a.length; r--;) {
      3 === (i = (n = a[r]).nodeType) ? o.push(n) : 1 !== i || "ownerSVGElement" in n || t.test(n.nodeName.toLowerCase()) || d(n, o);
    }

    return o;
  }

  function g(e) {
    return j(e.indexOf(a) < 0 ? e.replace(i, "") : e);
  }

  function u(e, o) {
    for (var i, a, r, t, s, c, u, l, v, f, y, j, h, p = d(e, []), b = p.length; b--;) {
      for (r = !1, t = document.createDocumentFragment(), c = (s = p[b]).nodeValue, l = 0; u = n.exec(c);) {
        if ((v = u.index) !== l && t.appendChild(m(c.slice(l, v), !0)), j = g(y = u[0]), l = v + y.length, h = o.callback(j, o), j && h) {
          for (a in (f = new Image()).onerror = o.onerror, f.setAttribute("draggable", "false"), i = o.attributes(y, j)) {
            i.hasOwnProperty(a) && 0 !== a.indexOf("on") && !f.hasAttribute(a) && f.setAttribute(a, i[a]);
          }

          f.className = o.className, f.alt = y, f.src = h, r = !0, t.appendChild(f);
        }

        f || t.appendChild(m(y, !1)), f = null;
      }

      r && (l < c.length && t.appendChild(m(c.slice(l), !0)), s.parentNode.replaceChild(t, s));
    }

    return e;
  }

  function l(e, o) {
    return y(e, function (e) {
      var n,
          i,
          a = e,
          t = g(e),
          s = o.callback(t, o);

      if (t && s) {
        for (i in a = "<img ".concat('class="', o.className, '" ', 'draggable="false" ', 'alt="', e, '"', ' src="', s, '"'), n = o.attributes(e, t)) {
          n.hasOwnProperty(i) && 0 !== i.indexOf("on") && -1 === a.indexOf(" " + i + "=") && (a = a.concat(" ", i, '="', n[i].replace(r, v), '"'));
        }

        a = a.concat("/>");
      }

      return a;
    });
  }

  function v(e) {
    return o[e];
  }

  function f() {
    return null;
  }

  function y(e, o) {
    return String(e).replace(n, o);
  }

  function j(e, o) {
    for (var n = [], i = 0, a = 0, r = 0; r < e.length;) {
      i = e.charCodeAt(r++), a ? (n.push((65536 + (a - 55296 << 10) + (i - 56320)).toString(16)), a = 0) : 55296 <= i && i <= 56319 ? a = i : n.push(i.toString(16));
    }

    return n.join(o || "-");
  }
}(),
    xe = {
  categories: ["smileys", "people", "animals", "food", "travel", "activities", "objects", "symbols", "flags"],
  emoji: [{
    emoji: "😀",
    category: 0,
    name: "grinning face",
    version: "1.0"
  }, {
    emoji: "😃",
    category: 0,
    name: "grinning face with big eyes",
    version: "1.0"
  }, {
    emoji: "😄",
    category: 0,
    name: "grinning face with smiling eyes",
    version: "1.0"
  }, {
    emoji: "😁",
    category: 0,
    name: "beaming face with smiling eyes",
    version: "1.0"
  }, {
    emoji: "😆",
    category: 0,
    name: "grinning squinting face",
    version: "1.0"
  }, {
    emoji: "😅",
    category: 0,
    name: "grinning face with sweat",
    version: "1.0"
  }, {
    emoji: "🤣",
    category: 0,
    name: "rolling on the floor laughing",
    version: "3.0"
  }, {
    emoji: "😂",
    category: 0,
    name: "face with tears of joy",
    version: "1.0"
  }, {
    emoji: "🙂",
    category: 0,
    name: "slightly smiling face",
    version: "1.0"
  }, {
    emoji: "🙃",
    category: 0,
    name: "upside-down face",
    version: "1.0"
  }, {
    emoji: "😉",
    category: 0,
    name: "winking face",
    version: "1.0"
  }, {
    emoji: "😊",
    category: 0,
    name: "smiling face with smiling eyes",
    version: "1.0"
  }, {
    emoji: "😇",
    category: 0,
    name: "smiling face with halo",
    version: "1.0"
  }, {
    emoji: "🥰",
    category: 0,
    name: "smiling face with hearts",
    version: "11.0"
  }, {
    emoji: "😍",
    category: 0,
    name: "smiling face with heart-eyes",
    version: "1.0"
  }, {
    emoji: "🤩",
    category: 0,
    name: "star-struck",
    version: "5.0"
  }, {
    emoji: "😘",
    category: 0,
    name: "face blowing a kiss",
    version: "1.0"
  }, {
    emoji: "😗",
    category: 0,
    name: "kissing face",
    version: "1.0"
  }, {
    emoji: "☺️",
    category: 0,
    name: "smiling face",
    version: "1.0"
  }, {
    emoji: "😚",
    category: 0,
    name: "kissing face with closed eyes",
    version: "1.0"
  }, {
    emoji: "😙",
    category: 0,
    name: "kissing face with smiling eyes",
    version: "1.0"
  }, {
    emoji: "🥲",
    category: 0,
    name: "smiling face with tear",
    version: "13.0"
  }, {
    emoji: "😋",
    category: 0,
    name: "face savoring food",
    version: "1.0"
  }, {
    emoji: "😛",
    category: 0,
    name: "face with tongue",
    version: "1.0"
  }, {
    emoji: "😜",
    category: 0,
    name: "winking face with tongue",
    version: "1.0"
  }, {
    emoji: "🤪",
    category: 0,
    name: "zany face",
    version: "5.0"
  }, {
    emoji: "😝",
    category: 0,
    name: "squinting face with tongue",
    version: "1.0"
  }, {
    emoji: "🤑",
    category: 0,
    name: "money-mouth face",
    version: "1.0"
  }, {
    emoji: "🤗",
    category: 0,
    name: "hugging face",
    version: "1.0"
  }, {
    emoji: "🤭",
    category: 0,
    name: "face with hand over mouth",
    version: "5.0"
  }, {
    emoji: "🤫",
    category: 0,
    name: "shushing face",
    version: "5.0"
  }, {
    emoji: "🤔",
    category: 0,
    name: "thinking face",
    version: "1.0"
  }, {
    emoji: "🤐",
    category: 0,
    name: "zipper-mouth face",
    version: "1.0"
  }, {
    emoji: "🤨",
    category: 0,
    name: "face with raised eyebrow",
    version: "5.0"
  }, {
    emoji: "😐",
    category: 0,
    name: "neutral face",
    version: "1.0"
  }, {
    emoji: "😑",
    category: 0,
    name: "expressionless face",
    version: "1.0"
  }, {
    emoji: "😶",
    category: 0,
    name: "face without mouth",
    version: "1.0"
  }, {
    emoji: "😏",
    category: 0,
    name: "smirking face",
    version: "1.0"
  }, {
    emoji: "😒",
    category: 0,
    name: "unamused face",
    version: "1.0"
  }, {
    emoji: "🙄",
    category: 0,
    name: "face with rolling eyes",
    version: "1.0"
  }, {
    emoji: "😬",
    category: 0,
    name: "grimacing face",
    version: "1.0"
  }, {
    emoji: "🤥",
    category: 0,
    name: "lying face",
    version: "3.0"
  }, {
    emoji: "😌",
    category: 0,
    name: "relieved face",
    version: "1.0"
  }, {
    emoji: "😔",
    category: 0,
    name: "pensive face",
    version: "1.0"
  }, {
    emoji: "😪",
    category: 0,
    name: "sleepy face",
    version: "1.0"
  }, {
    emoji: "🤤",
    category: 0,
    name: "drooling face",
    version: "3.0"
  }, {
    emoji: "😴",
    category: 0,
    name: "sleeping face",
    version: "1.0"
  }, {
    emoji: "😷",
    category: 0,
    name: "face with medical mask",
    version: "1.0"
  }, {
    emoji: "🤒",
    category: 0,
    name: "face with thermometer",
    version: "1.0"
  }, {
    emoji: "🤕",
    category: 0,
    name: "face with head-bandage",
    version: "1.0"
  }, {
    emoji: "🤢",
    category: 0,
    name: "nauseated face",
    version: "3.0"
  }, {
    emoji: "🤮",
    category: 0,
    name: "face vomiting",
    version: "5.0"
  }, {
    emoji: "🤧",
    category: 0,
    name: "sneezing face",
    version: "3.0"
  }, {
    emoji: "🥵",
    category: 0,
    name: "hot face",
    version: "11.0"
  }, {
    emoji: "🥶",
    category: 0,
    name: "cold face",
    version: "11.0"
  }, {
    emoji: "🥴",
    category: 0,
    name: "woozy face",
    version: "11.0"
  }, {
    emoji: "😵",
    category: 0,
    name: "dizzy face",
    version: "1.0"
  }, {
    emoji: "🤯",
    category: 0,
    name: "exploding head",
    version: "5.0"
  }, {
    emoji: "🤠",
    category: 0,
    name: "cowboy hat face",
    version: "3.0"
  }, {
    emoji: "🥳",
    category: 0,
    name: "partying face",
    version: "11.0"
  }, {
    emoji: "🥸",
    category: 0,
    name: "disguised face",
    version: "13.0"
  }, {
    emoji: "😎",
    category: 0,
    name: "smiling face with sunglasses",
    version: "1.0"
  }, {
    emoji: "🤓",
    category: 0,
    name: "nerd face",
    version: "1.0"
  }, {
    emoji: "🧐",
    category: 0,
    name: "face with monocle",
    version: "5.0"
  }, {
    emoji: "😕",
    category: 0,
    name: "confused face",
    version: "1.0"
  }, {
    emoji: "😟",
    category: 0,
    name: "worried face",
    version: "1.0"
  }, {
    emoji: "🙁",
    category: 0,
    name: "slightly frowning face",
    version: "1.0"
  }, {
    emoji: "☹️",
    category: 0,
    name: "frowning face",
    version: "1.0"
  }, {
    emoji: "😮",
    category: 0,
    name: "face with open mouth",
    version: "1.0"
  }, {
    emoji: "😯",
    category: 0,
    name: "hushed face",
    version: "1.0"
  }, {
    emoji: "😲",
    category: 0,
    name: "astonished face",
    version: "1.0"
  }, {
    emoji: "😳",
    category: 0,
    name: "flushed face",
    version: "1.0"
  }, {
    emoji: "🥺",
    category: 0,
    name: "pleading face",
    version: "11.0"
  }, {
    emoji: "😦",
    category: 0,
    name: "frowning face with open mouth",
    version: "1.0"
  }, {
    emoji: "😧",
    category: 0,
    name: "anguished face",
    version: "1.0"
  }, {
    emoji: "😨",
    category: 0,
    name: "fearful face",
    version: "1.0"
  }, {
    emoji: "😰",
    category: 0,
    name: "anxious face with sweat",
    version: "1.0"
  }, {
    emoji: "😥",
    category: 0,
    name: "sad but relieved face",
    version: "1.0"
  }, {
    emoji: "😢",
    category: 0,
    name: "crying face",
    version: "1.0"
  }, {
    emoji: "😭",
    category: 0,
    name: "loudly crying face",
    version: "1.0"
  }, {
    emoji: "😱",
    category: 0,
    name: "face screaming in fear",
    version: "1.0"
  }, {
    emoji: "😖",
    category: 0,
    name: "confounded face",
    version: "1.0"
  }, {
    emoji: "😣",
    category: 0,
    name: "persevering face",
    version: "1.0"
  }, {
    emoji: "😞",
    category: 0,
    name: "disappointed face",
    version: "1.0"
  }, {
    emoji: "😓",
    category: 0,
    name: "downcast face with sweat",
    version: "1.0"
  }, {
    emoji: "😩",
    category: 0,
    name: "weary face",
    version: "1.0"
  }, {
    emoji: "😫",
    category: 0,
    name: "tired face",
    version: "1.0"
  }, {
    emoji: "🥱",
    category: 0,
    name: "yawning face",
    version: "12.0"
  }, {
    emoji: "😤",
    category: 0,
    name: "face with steam from nose",
    version: "1.0"
  }, {
    emoji: "😡",
    category: 0,
    name: "pouting face",
    version: "1.0"
  }, {
    emoji: "😠",
    category: 0,
    name: "angry face",
    version: "1.0"
  }, {
    emoji: "🤬",
    category: 0,
    name: "face with symbols on mouth",
    version: "5.0"
  }, {
    emoji: "😈",
    category: 0,
    name: "smiling face with horns",
    version: "1.0"
  }, {
    emoji: "👿",
    category: 0,
    name: "angry face with horns",
    version: "1.0"
  }, {
    emoji: "💀",
    category: 0,
    name: "skull",
    version: "1.0"
  }, {
    emoji: "☠️",
    category: 0,
    name: "skull and crossbones",
    version: "1.0"
  }, {
    emoji: "💩",
    category: 0,
    name: "pile of poo",
    version: "1.0"
  }, {
    emoji: "🤡",
    category: 0,
    name: "clown face",
    version: "3.0"
  }, {
    emoji: "👹",
    category: 0,
    name: "ogre",
    version: "1.0"
  }, {
    emoji: "👺",
    category: 0,
    name: "goblin",
    version: "1.0"
  }, {
    emoji: "👻",
    category: 0,
    name: "ghost",
    version: "1.0"
  }, {
    emoji: "👽",
    category: 0,
    name: "alien",
    version: "1.0"
  }, {
    emoji: "👾",
    category: 0,
    name: "alien monster",
    version: "1.0"
  }, {
    emoji: "🤖",
    category: 0,
    name: "robot",
    version: "1.0"
  }, {
    emoji: "😺",
    category: 0,
    name: "grinning cat",
    version: "1.0"
  }, {
    emoji: "😸",
    category: 0,
    name: "grinning cat with smiling eyes",
    version: "1.0"
  }, {
    emoji: "😹",
    category: 0,
    name: "cat with tears of joy",
    version: "1.0"
  }, {
    emoji: "😻",
    category: 0,
    name: "smiling cat with heart-eyes",
    version: "1.0"
  }, {
    emoji: "😼",
    category: 0,
    name: "cat with wry smile",
    version: "1.0"
  }, {
    emoji: "😽",
    category: 0,
    name: "kissing cat",
    version: "1.0"
  }, {
    emoji: "🙀",
    category: 0,
    name: "weary cat",
    version: "1.0"
  }, {
    emoji: "😿",
    category: 0,
    name: "crying cat",
    version: "1.0"
  }, {
    emoji: "😾",
    category: 0,
    name: "pouting cat",
    version: "1.0"
  }, {
    emoji: "🙈",
    category: 0,
    name: "see-no-evil monkey",
    version: "1.0"
  }, {
    emoji: "🙉",
    category: 0,
    name: "hear-no-evil monkey",
    version: "1.0"
  }, {
    emoji: "🙊",
    category: 0,
    name: "speak-no-evil monkey",
    version: "1.0"
  }, {
    emoji: "💋",
    category: 0,
    name: "kiss mark",
    version: "1.0"
  }, {
    emoji: "💌",
    category: 0,
    name: "love letter",
    version: "1.0"
  }, {
    emoji: "💘",
    category: 0,
    name: "heart with arrow",
    version: "1.0"
  }, {
    emoji: "💝",
    category: 0,
    name: "heart with ribbon",
    version: "1.0"
  }, {
    emoji: "💖",
    category: 0,
    name: "sparkling heart",
    version: "1.0"
  }, {
    emoji: "💗",
    category: 0,
    name: "growing heart",
    version: "1.0"
  }, {
    emoji: "💓",
    category: 0,
    name: "beating heart",
    version: "1.0"
  }, {
    emoji: "💞",
    category: 0,
    name: "revolving hearts",
    version: "1.0"
  }, {
    emoji: "💕",
    category: 0,
    name: "two hearts",
    version: "1.0"
  }, {
    emoji: "💟",
    category: 0,
    name: "heart decoration",
    version: "1.0"
  }, {
    emoji: "❣️",
    category: 0,
    name: "heart exclamation",
    version: "1.0"
  }, {
    emoji: "💔",
    category: 0,
    name: "broken heart",
    version: "1.0"
  }, {
    emoji: "❤️",
    category: 0,
    name: "red heart",
    version: "1.0"
  }, {
    emoji: "🧡",
    category: 0,
    name: "orange heart",
    version: "5.0"
  }, {
    emoji: "💛",
    category: 0,
    name: "yellow heart",
    version: "1.0"
  }, {
    emoji: "💚",
    category: 0,
    name: "green heart",
    version: "1.0"
  }, {
    emoji: "💙",
    category: 0,
    name: "blue heart",
    version: "1.0"
  }, {
    emoji: "💜",
    category: 0,
    name: "purple heart",
    version: "1.0"
  }, {
    emoji: "🤎",
    category: 0,
    name: "brown heart",
    version: "12.0"
  }, {
    emoji: "🖤",
    category: 0,
    name: "black heart",
    version: "3.0"
  }, {
    emoji: "🤍",
    category: 0,
    name: "white heart",
    version: "12.0"
  }, {
    emoji: "💯",
    category: 0,
    name: "hundred points",
    version: "1.0"
  }, {
    emoji: "💢",
    category: 0,
    name: "anger symbol",
    version: "1.0"
  }, {
    emoji: "💥",
    category: 0,
    name: "collision",
    version: "1.0"
  }, {
    emoji: "💫",
    category: 0,
    name: "dizzy",
    version: "1.0"
  }, {
    emoji: "💦",
    category: 0,
    name: "sweat droplets",
    version: "1.0"
  }, {
    emoji: "💨",
    category: 0,
    name: "dashing away",
    version: "1.0"
  }, {
    emoji: "🕳️",
    category: 0,
    name: "hole",
    version: "1.0"
  }, {
    emoji: "💣",
    category: 0,
    name: "bomb",
    version: "1.0"
  }, {
    emoji: "💬",
    category: 0,
    name: "speech balloon",
    version: "1.0"
  }, {
    emoji: "👁️‍🗨️",
    category: 0,
    name: "eye in speech bubble",
    version: "2.0"
  }, {
    emoji: "🗨️",
    category: 0,
    name: "left speech bubble",
    version: "2.0"
  }, {
    emoji: "🗯️",
    category: 0,
    name: "right anger bubble",
    version: "1.0"
  }, {
    emoji: "💭",
    category: 0,
    name: "thought balloon",
    version: "1.0"
  }, {
    emoji: "💤",
    category: 0,
    name: "zzz",
    version: "1.0"
  }, {
    emoji: "👋",
    category: 1,
    name: "waving hand",
    variations: ["👋🏻", "👋🏼", "👋🏽", "👋🏾", "👋🏿"],
    version: "1.0"
  }, {
    emoji: "🤚",
    category: 1,
    name: "raised back of hand",
    variations: ["🤚🏻", "🤚🏼", "🤚🏽", "🤚🏾", "🤚🏿"],
    version: "3.0"
  }, {
    emoji: "🖐️",
    category: 1,
    name: "hand with fingers splayed",
    variations: ["🖐🏻", "🖐🏼", "🖐🏽", "🖐🏾", "🖐🏿"],
    version: "1.0"
  }, {
    emoji: "✋",
    category: 1,
    name: "raised hand",
    variations: ["✋🏻", "✋🏼", "✋🏽", "✋🏾", "✋🏿"],
    version: "1.0"
  }, {
    emoji: "🖖",
    category: 1,
    name: "vulcan salute",
    variations: ["🖖🏻", "🖖🏼", "🖖🏽", "🖖🏾", "🖖🏿"],
    version: "1.0"
  }, {
    emoji: "👌",
    category: 1,
    name: "OK hand",
    variations: ["👌🏻", "👌🏼", "👌🏽", "👌🏾", "👌🏿"],
    version: "1.0"
  }, {
    emoji: "🤌",
    category: 1,
    name: "pinched fingers",
    variations: ["🤌🏻", "🤌🏼", "🤌🏽", "🤌🏾", "🤌🏿"],
    version: "13.0"
  }, {
    emoji: "🤏",
    category: 1,
    name: "pinching hand",
    variations: ["🤏🏻", "🤏🏼", "🤏🏽", "🤏🏾", "🤏🏿"],
    version: "12.0"
  }, {
    emoji: "✌️",
    category: 1,
    name: "victory hand",
    variations: ["✌🏻", "✌🏼", "✌🏽", "✌🏾", "✌🏿"],
    version: "1.0"
  }, {
    emoji: "🤞",
    category: 1,
    name: "crossed fingers",
    variations: ["🤞🏻", "🤞🏼", "🤞🏽", "🤞🏾", "🤞🏿"],
    version: "3.0"
  }, {
    emoji: "🤟",
    category: 1,
    name: "love-you gesture",
    variations: ["🤟🏻", "🤟🏼", "🤟🏽", "🤟🏾", "🤟🏿"],
    version: "5.0"
  }, {
    emoji: "🤘",
    category: 1,
    name: "sign of the horns",
    variations: ["🤘🏻", "🤘🏼", "🤘🏽", "🤘🏾", "🤘🏿"],
    version: "1.0"
  }, {
    emoji: "🤙",
    category: 1,
    name: "call me hand",
    variations: ["🤙🏻", "🤙🏼", "🤙🏽", "🤙🏾", "🤙🏿"],
    version: "3.0"
  }, {
    emoji: "👈",
    category: 1,
    name: "backhand index pointing left",
    variations: ["👈🏻", "👈🏼", "👈🏽", "👈🏾", "👈🏿"],
    version: "1.0"
  }, {
    emoji: "👉",
    category: 1,
    name: "backhand index pointing right",
    variations: ["👉🏻", "👉🏼", "👉🏽", "👉🏾", "👉🏿"],
    version: "1.0"
  }, {
    emoji: "👆",
    category: 1,
    name: "backhand index pointing up",
    variations: ["👆🏻", "👆🏼", "👆🏽", "👆🏾", "👆🏿"],
    version: "1.0"
  }, {
    emoji: "🖕",
    category: 1,
    name: "middle finger",
    variations: ["🖕🏻", "🖕🏼", "🖕🏽", "🖕🏾", "🖕🏿"],
    version: "1.0"
  }, {
    emoji: "👇",
    category: 1,
    name: "backhand index pointing down",
    variations: ["👇🏻", "👇🏼", "👇🏽", "👇🏾", "👇🏿"],
    version: "1.0"
  }, {
    emoji: "☝️",
    category: 1,
    name: "index pointing up",
    variations: ["☝🏻", "☝🏼", "☝🏽", "☝🏾", "☝🏿"],
    version: "1.0"
  }, {
    emoji: "👍",
    category: 1,
    name: "thumbs up",
    variations: ["👍🏻", "👍🏼", "👍🏽", "👍🏾", "👍🏿"],
    version: "1.0"
  }, {
    emoji: "👎",
    category: 1,
    name: "thumbs down",
    variations: ["👎🏻", "👎🏼", "👎🏽", "👎🏾", "👎🏿"],
    version: "1.0"
  }, {
    emoji: "✊",
    category: 1,
    name: "raised fist",
    variations: ["✊🏻", "✊🏼", "✊🏽", "✊🏾", "✊🏿"],
    version: "1.0"
  }, {
    emoji: "👊",
    category: 1,
    name: "oncoming fist",
    variations: ["👊🏻", "👊🏼", "👊🏽", "👊🏾", "👊🏿"],
    version: "1.0"
  }, {
    emoji: "🤛",
    category: 1,
    name: "left-facing fist",
    variations: ["🤛🏻", "🤛🏼", "🤛🏽", "🤛🏾", "🤛🏿"],
    version: "3.0"
  }, {
    emoji: "🤜",
    category: 1,
    name: "right-facing fist",
    variations: ["🤜🏻", "🤜🏼", "🤜🏽", "🤜🏾", "🤜🏿"],
    version: "3.0"
  }, {
    emoji: "👏",
    category: 1,
    name: "clapping hands",
    variations: ["👏🏻", "👏🏼", "👏🏽", "👏🏾", "👏🏿"],
    version: "1.0"
  }, {
    emoji: "🙌",
    category: 1,
    name: "raising hands",
    variations: ["🙌🏻", "🙌🏼", "🙌🏽", "🙌🏾", "🙌🏿"],
    version: "1.0"
  }, {
    emoji: "👐",
    category: 1,
    name: "open hands",
    variations: ["👐🏻", "👐🏼", "👐🏽", "👐🏾", "👐🏿"],
    version: "1.0"
  }, {
    emoji: "🤲",
    category: 1,
    name: "palms up together",
    variations: ["🤲🏻", "🤲🏼", "🤲🏽", "🤲🏾", "🤲🏿"],
    version: "5.0"
  }, {
    emoji: "🤝",
    category: 1,
    name: "handshake",
    version: "3.0"
  }, {
    emoji: "🙏",
    category: 1,
    name: "folded hands",
    variations: ["🙏🏻", "🙏🏼", "🙏🏽", "🙏🏾", "🙏🏿"],
    version: "1.0"
  }, {
    emoji: "✍️",
    category: 1,
    name: "writing hand",
    variations: ["✍🏻", "✍🏼", "✍🏽", "✍🏾", "✍🏿"],
    version: "1.0"
  }, {
    emoji: "💅",
    category: 1,
    name: "nail polish",
    variations: ["💅🏻", "💅🏼", "💅🏽", "💅🏾", "💅🏿"],
    version: "1.0"
  }, {
    emoji: "🤳",
    category: 1,
    name: "selfie",
    variations: ["🤳🏻", "🤳🏼", "🤳🏽", "🤳🏾", "🤳🏿"],
    version: "3.0"
  }, {
    emoji: "💪",
    category: 1,
    name: "flexed biceps",
    variations: ["💪🏻", "💪🏼", "💪🏽", "💪🏾", "💪🏿"],
    version: "1.0"
  }, {
    emoji: "🦾",
    category: 1,
    name: "mechanical arm",
    version: "12.0"
  }, {
    emoji: "🦿",
    category: 1,
    name: "mechanical leg",
    version: "12.0"
  }, {
    emoji: "🦵",
    category: 1,
    name: "leg",
    variations: ["🦵🏻", "🦵🏼", "🦵🏽", "🦵🏾", "🦵🏿"],
    version: "11.0"
  }, {
    emoji: "🦶",
    category: 1,
    name: "foot",
    variations: ["🦶🏻", "🦶🏼", "🦶🏽", "🦶🏾", "🦶🏿"],
    version: "11.0"
  }, {
    emoji: "👂",
    category: 1,
    name: "ear",
    variations: ["👂🏻", "👂🏼", "👂🏽", "👂🏾", "👂🏿"],
    version: "1.0"
  }, {
    emoji: "🦻",
    category: 1,
    name: "ear with hearing aid",
    variations: ["🦻🏻", "🦻🏼", "🦻🏽", "🦻🏾", "🦻🏿"],
    version: "12.0"
  }, {
    emoji: "👃",
    category: 1,
    name: "nose",
    variations: ["👃🏻", "👃🏼", "👃🏽", "👃🏾", "👃🏿"],
    version: "1.0"
  }, {
    emoji: "🧠",
    category: 1,
    name: "brain",
    version: "5.0"
  }, {
    emoji: "🫀",
    category: 1,
    name: "anatomical heart",
    version: "13.0"
  }, {
    emoji: "🫁",
    category: 1,
    name: "lungs",
    version: "13.0"
  }, {
    emoji: "🦷",
    category: 1,
    name: "tooth",
    version: "11.0"
  }, {
    emoji: "🦴",
    category: 1,
    name: "bone",
    version: "11.0"
  }, {
    emoji: "👀",
    category: 1,
    name: "eyes",
    version: "1.0"
  }, {
    emoji: "👁️",
    category: 1,
    name: "eye",
    version: "1.0"
  }, {
    emoji: "👅",
    category: 1,
    name: "tongue",
    version: "1.0"
  }, {
    emoji: "👄",
    category: 1,
    name: "mouth",
    version: "1.0"
  }, {
    emoji: "👶",
    category: 1,
    name: "baby",
    variations: ["👶🏻", "👶🏼", "👶🏽", "👶🏾", "👶🏿"],
    version: "1.0"
  }, {
    emoji: "🧒",
    category: 1,
    name: "child",
    variations: ["🧒🏻", "🧒🏼", "🧒🏽", "🧒🏾", "🧒🏿"],
    version: "5.0"
  }, {
    emoji: "👦",
    category: 1,
    name: "boy",
    variations: ["👦🏻", "👦🏼", "👦🏽", "👦🏾", "👦🏿"],
    version: "1.0"
  }, {
    emoji: "👧",
    category: 1,
    name: "girl",
    variations: ["👧🏻", "👧🏼", "👧🏽", "👧🏾", "👧🏿"],
    version: "1.0"
  }, {
    emoji: "🧑",
    category: 1,
    name: "person",
    variations: ["🧑🏻", "🧑🏼", "🧑🏽", "🧑🏾", "🧑🏿"],
    version: "5.0"
  }, {
    emoji: "👱",
    category: 1,
    name: "person with blond hair",
    variations: ["👱🏻", "👱🏼", "👱🏽", "👱🏾", "👱🏿"],
    version: "1.0"
  }, {
    emoji: "👨",
    category: 1,
    name: "man",
    variations: ["👨🏻", "👨🏼", "👨🏽", "👨🏾", "👨🏿"],
    version: "1.0"
  }, {
    emoji: "🧔",
    category: 1,
    name: "man with beard",
    variations: ["🧔🏻", "🧔🏼", "🧔🏽", "🧔🏾", "🧔🏿"],
    version: "5.0"
  }, {
    emoji: "👨‍🦰",
    category: 1,
    name: "man with red hair",
    variations: ["👨🏻‍🦰", "👨🏼‍🦰", "👨🏽‍🦰", "👨🏾‍🦰", "👨🏿‍🦰"],
    version: "11.0"
  }, {
    emoji: "👨‍🦱",
    category: 1,
    name: "man with curly hair",
    variations: ["👨🏻‍🦱", "👨🏼‍🦱", "👨🏽‍🦱", "👨🏾‍🦱", "👨🏿‍🦱"],
    version: "11.0"
  }, {
    emoji: "👨‍🦳",
    category: 1,
    name: "man with white hair",
    variations: ["👨🏻‍🦳", "👨🏼‍🦳", "👨🏽‍🦳", "👨🏾‍🦳", "👨🏿‍🦳"],
    version: "11.0"
  }, {
    emoji: "👨‍🦲",
    category: 1,
    name: "man with no hair",
    variations: ["👨🏻‍🦲", "👨🏼‍🦲", "👨🏽‍🦲", "👨🏾‍🦲", "👨🏿‍🦲"],
    version: "11.0"
  }, {
    emoji: "👩",
    category: 1,
    name: "woman",
    variations: ["👩🏻", "👩🏼", "👩🏽", "👩🏾", "👩🏿"],
    version: "1.0"
  }, {
    emoji: "👩‍🦰",
    category: 1,
    name: "woman with red hair",
    variations: ["👩🏻‍🦰", "👩🏼‍🦰", "👩🏽‍🦰", "👩🏾‍🦰", "👩🏿‍🦰"],
    version: "11.0"
  }, {
    emoji: "🧑‍🦰",
    category: 1,
    name: "person with red hair",
    variations: ["🧑🏻‍🦰", "🧑🏼‍🦰", "🧑🏽‍🦰", "🧑🏾‍🦰", "🧑🏿‍🦰"],
    version: "12.1"
  }, {
    emoji: "👩‍🦱",
    category: 1,
    name: "woman with curly hair",
    variations: ["👩🏻‍🦱", "👩🏼‍🦱", "👩🏽‍🦱", "👩🏾‍🦱", "👩🏿‍🦱"],
    version: "11.0"
  }, {
    emoji: "🧑‍🦱",
    category: 1,
    name: "person with curly hair",
    variations: ["🧑🏻‍🦱", "🧑🏼‍🦱", "🧑🏽‍🦱", "🧑🏾‍🦱", "🧑🏿‍🦱"],
    version: "12.1"
  }, {
    emoji: "👩‍🦳",
    category: 1,
    name: "woman with white hair",
    variations: ["👩🏻‍🦳", "👩🏼‍🦳", "👩🏽‍🦳", "👩🏾‍🦳", "👩🏿‍🦳"],
    version: "11.0"
  }, {
    emoji: "🧑‍🦳",
    category: 1,
    name: "person with white hair",
    variations: ["🧑🏻‍🦳", "🧑🏼‍🦳", "🧑🏽‍🦳", "🧑🏾‍🦳", "🧑🏿‍🦳"],
    version: "12.1"
  }, {
    emoji: "👩‍🦲",
    category: 1,
    name: "woman with no hair",
    variations: ["👩🏻‍🦲", "👩🏼‍🦲", "👩🏽‍🦲", "👩🏾‍🦲", "👩🏿‍🦲"],
    version: "11.0"
  }, {
    emoji: "🧑‍🦲",
    category: 1,
    name: "person with no hair",
    variations: ["🧑🏻‍🦲", "🧑🏼‍🦲", "🧑🏽‍🦲", "🧑🏾‍🦲", "🧑🏿‍🦲"],
    version: "12.1"
  }, {
    emoji: "👱‍♀️",
    category: 1,
    name: "woman with blond hair",
    variations: ["👱🏻‍♀️", "👱🏼‍♀️", "👱🏽‍♀️", "👱🏾‍♀️", "👱🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "👱‍♂️",
    category: 1,
    name: "man with blond hair",
    variations: ["👱🏻‍♂️", "👱🏼‍♂️", "👱🏽‍♂️", "👱🏾‍♂️", "👱🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🧓",
    category: 1,
    name: "older person",
    variations: ["🧓🏻", "🧓🏼", "🧓🏽", "🧓🏾", "🧓🏿"],
    version: "5.0"
  }, {
    emoji: "👴",
    category: 1,
    name: "old man",
    variations: ["👴🏻", "👴🏼", "👴🏽", "👴🏾", "👴🏿"],
    version: "1.0"
  }, {
    emoji: "👵",
    category: 1,
    name: "old woman",
    variations: ["👵🏻", "👵🏼", "👵🏽", "👵🏾", "👵🏿"],
    version: "1.0"
  }, {
    emoji: "🙍",
    category: 1,
    name: "person frowning",
    variations: ["🙍🏻", "🙍🏼", "🙍🏽", "🙍🏾", "🙍🏿"],
    version: "1.0"
  }, {
    emoji: "🙍‍♂️",
    category: 1,
    name: "man frowning",
    variations: ["🙍🏻‍♂️", "🙍🏼‍♂️", "🙍🏽‍♂️", "🙍🏾‍♂️", "🙍🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🙍‍♀️",
    category: 1,
    name: "woman frowning",
    variations: ["🙍🏻‍♀️", "🙍🏼‍♀️", "🙍🏽‍♀️", "🙍🏾‍♀️", "🙍🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🙎",
    category: 1,
    name: "person pouting",
    variations: ["🙎🏻", "🙎🏼", "🙎🏽", "🙎🏾", "🙎🏿"],
    version: "1.0"
  }, {
    emoji: "🙎‍♂️",
    category: 1,
    name: "man pouting",
    variations: ["🙎🏻‍♂️", "🙎🏼‍♂️", "🙎🏽‍♂️", "🙎🏾‍♂️", "🙎🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🙎‍♀️",
    category: 1,
    name: "woman pouting",
    variations: ["🙎🏻‍♀️", "🙎🏼‍♀️", "🙎🏽‍♀️", "🙎🏾‍♀️", "🙎🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🙅",
    category: 1,
    name: "person gesturing NO",
    variations: ["🙅🏻", "🙅🏼", "🙅🏽", "🙅🏾", "🙅🏿"],
    version: "1.0"
  }, {
    emoji: "🙅‍♂️",
    category: 1,
    name: "man gesturing NO",
    variations: ["🙅🏻‍♂️", "🙅🏼‍♂️", "🙅🏽‍♂️", "🙅🏾‍♂️", "🙅🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🙅‍♀️",
    category: 1,
    name: "woman gesturing NO",
    variations: ["🙅🏻‍♀️", "🙅🏼‍♀️", "🙅🏽‍♀️", "🙅🏾‍♀️", "🙅🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🙆",
    category: 1,
    name: "person gesturing OK",
    variations: ["🙆🏻", "🙆🏼", "🙆🏽", "🙆🏾", "🙆🏿"],
    version: "1.0"
  }, {
    emoji: "🙆‍♂️",
    category: 1,
    name: "man gesturing OK",
    variations: ["🙆🏻‍♂️", "🙆🏼‍♂️", "🙆🏽‍♂️", "🙆🏾‍♂️", "🙆🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🙆‍♀️",
    category: 1,
    name: "woman gesturing OK",
    variations: ["🙆🏻‍♀️", "🙆🏼‍♀️", "🙆🏽‍♀️", "🙆🏾‍♀️", "🙆🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "💁",
    category: 1,
    name: "person tipping hand",
    variations: ["💁🏻", "💁🏼", "💁🏽", "💁🏾", "💁🏿"],
    version: "1.0"
  }, {
    emoji: "💁‍♂️",
    category: 1,
    name: "man tipping hand",
    variations: ["💁🏻‍♂️", "💁🏼‍♂️", "💁🏽‍♂️", "💁🏾‍♂️", "💁🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "💁‍♀️",
    category: 1,
    name: "woman tipping hand",
    variations: ["💁🏻‍♀️", "💁🏼‍♀️", "💁🏽‍♀️", "💁🏾‍♀️", "💁🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🙋",
    category: 1,
    name: "person raising hand",
    variations: ["🙋🏻", "🙋🏼", "🙋🏽", "🙋🏾", "🙋🏿"],
    version: "1.0"
  }, {
    emoji: "🙋‍♂️",
    category: 1,
    name: "man raising hand",
    variations: ["🙋🏻‍♂️", "🙋🏼‍♂️", "🙋🏽‍♂️", "🙋🏾‍♂️", "🙋🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🙋‍♀️",
    category: 1,
    name: "woman raising hand",
    variations: ["🙋🏻‍♀️", "🙋🏼‍♀️", "🙋🏽‍♀️", "🙋🏾‍♀️", "🙋🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🧏",
    category: 1,
    name: "deaf person",
    variations: ["🧏🏻", "🧏🏼", "🧏🏽", "🧏🏾", "🧏🏿"],
    version: "12.0"
  }, {
    emoji: "🧏‍♂️",
    category: 1,
    name: "deaf man",
    variations: ["🧏🏻‍♂️", "🧏🏼‍♂️", "🧏🏽‍♂️", "🧏🏾‍♂️", "🧏🏿‍♂️"],
    version: "12.0"
  }, {
    emoji: "🧏‍♀️",
    category: 1,
    name: "deaf woman",
    variations: ["🧏🏻‍♀️", "🧏🏼‍♀️", "🧏🏽‍♀️", "🧏🏾‍♀️", "🧏🏿‍♀️"],
    version: "12.0"
  }, {
    emoji: "🙇",
    category: 1,
    name: "person bowing",
    variations: ["🙇🏻", "🙇🏼", "🙇🏽", "🙇🏾", "🙇🏿"],
    version: "1.0"
  }, {
    emoji: "🙇‍♂️",
    category: 1,
    name: "man bowing",
    variations: ["🙇🏻‍♂️", "🙇🏼‍♂️", "🙇🏽‍♂️", "🙇🏾‍♂️", "🙇🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🙇‍♀️",
    category: 1,
    name: "woman bowing",
    variations: ["🙇🏻‍♀️", "🙇🏼‍♀️", "🙇🏽‍♀️", "🙇🏾‍♀️", "🙇🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🤦",
    category: 1,
    name: "person facepalming",
    variations: ["🤦🏻", "🤦🏼", "🤦🏽", "🤦🏾", "🤦🏿"],
    version: "3.0"
  }, {
    emoji: "🤦‍♂️",
    category: 1,
    name: "man facepalming",
    variations: ["🤦🏻‍♂️", "🤦🏼‍♂️", "🤦🏽‍♂️", "🤦🏾‍♂️", "🤦🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🤦‍♀️",
    category: 1,
    name: "woman facepalming",
    variations: ["🤦🏻‍♀️", "🤦🏼‍♀️", "🤦🏽‍♀️", "🤦🏾‍♀️", "🤦🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🤷",
    category: 1,
    name: "person shrugging",
    variations: ["🤷🏻", "🤷🏼", "🤷🏽", "🤷🏾", "🤷🏿"],
    version: "3.0"
  }, {
    emoji: "🤷‍♂️",
    category: 1,
    name: "man shrugging",
    variations: ["🤷🏻‍♂️", "🤷🏼‍♂️", "🤷🏽‍♂️", "🤷🏾‍♂️", "🤷🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🤷‍♀️",
    category: 1,
    name: "woman shrugging",
    variations: ["🤷🏻‍♀️", "🤷🏼‍♀️", "🤷🏽‍♀️", "🤷🏾‍♀️", "🤷🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🧑‍⚕️",
    category: 1,
    name: "health worker",
    variations: ["🧑🏻‍⚕️", "🧑🏼‍⚕️", "🧑🏽‍⚕️", "🧑🏾‍⚕️", "🧑🏿‍⚕️"],
    version: "12.1"
  }, {
    emoji: "👨‍⚕️",
    category: 1,
    name: "man health worker",
    variations: ["👨🏻‍⚕️", "👨🏼‍⚕️", "👨🏽‍⚕️", "👨🏾‍⚕️", "👨🏿‍⚕️"],
    version: "4.0"
  }, {
    emoji: "👩‍⚕️",
    category: 1,
    name: "woman health worker",
    variations: ["👩🏻‍⚕️", "👩🏼‍⚕️", "👩🏽‍⚕️", "👩🏾‍⚕️", "👩🏿‍⚕️"],
    version: "4.0"
  }, {
    emoji: "🧑‍🎓",
    category: 1,
    name: "student",
    variations: ["🧑🏻‍🎓", "🧑🏼‍🎓", "🧑🏽‍🎓", "🧑🏾‍🎓", "🧑🏿‍🎓"],
    version: "12.1"
  }, {
    emoji: "👨‍🎓",
    category: 1,
    name: "man student",
    variations: ["👨🏻‍🎓", "👨🏼‍🎓", "👨🏽‍🎓", "👨🏾‍🎓", "👨🏿‍🎓"],
    version: "4.0"
  }, {
    emoji: "👩‍🎓",
    category: 1,
    name: "woman student",
    variations: ["👩🏻‍🎓", "👩🏼‍🎓", "👩🏽‍🎓", "👩🏾‍🎓", "👩🏿‍🎓"],
    version: "4.0"
  }, {
    emoji: "🧑‍🏫",
    category: 1,
    name: "teacher",
    variations: ["🧑🏻‍🏫", "🧑🏼‍🏫", "🧑🏽‍🏫", "🧑🏾‍🏫", "🧑🏿‍🏫"],
    version: "12.1"
  }, {
    emoji: "👨‍🏫",
    category: 1,
    name: "man teacher",
    variations: ["👨🏻‍🏫", "👨🏼‍🏫", "👨🏽‍🏫", "👨🏾‍🏫", "👨🏿‍🏫"],
    version: "4.0"
  }, {
    emoji: "👩‍🏫",
    category: 1,
    name: "woman teacher",
    variations: ["👩🏻‍🏫", "👩🏼‍🏫", "👩🏽‍🏫", "👩🏾‍🏫", "👩🏿‍🏫"],
    version: "4.0"
  }, {
    emoji: "🧑‍⚖️",
    category: 1,
    name: "judge",
    variations: ["🧑🏻‍⚖️", "🧑🏼‍⚖️", "🧑🏽‍⚖️", "🧑🏾‍⚖️", "🧑🏿‍⚖️"],
    version: "12.1"
  }, {
    emoji: "👨‍⚖️",
    category: 1,
    name: "man judge",
    variations: ["👨🏻‍⚖️", "👨🏼‍⚖️", "👨🏽‍⚖️", "👨🏾‍⚖️", "👨🏿‍⚖️"],
    version: "4.0"
  }, {
    emoji: "👩‍⚖️",
    category: 1,
    name: "woman judge",
    variations: ["👩🏻‍⚖️", "👩🏼‍⚖️", "👩🏽‍⚖️", "👩🏾‍⚖️", "👩🏿‍⚖️"],
    version: "4.0"
  }, {
    emoji: "🧑‍🌾",
    category: 1,
    name: "farmer",
    variations: ["🧑🏻‍🌾", "🧑🏼‍🌾", "🧑🏽‍🌾", "🧑🏾‍🌾", "🧑🏿‍🌾"],
    version: "12.1"
  }, {
    emoji: "👨‍🌾",
    category: 1,
    name: "man farmer",
    variations: ["👨🏻‍🌾", "👨🏼‍🌾", "👨🏽‍🌾", "👨🏾‍🌾", "👨🏿‍🌾"],
    version: "4.0"
  }, {
    emoji: "👩‍🌾",
    category: 1,
    name: "woman farmer",
    variations: ["👩🏻‍🌾", "👩🏼‍🌾", "👩🏽‍🌾", "👩🏾‍🌾", "👩🏿‍🌾"],
    version: "4.0"
  }, {
    emoji: "🧑‍🍳",
    category: 1,
    name: "cook",
    variations: ["🧑🏻‍🍳", "🧑🏼‍🍳", "🧑🏽‍🍳", "🧑🏾‍🍳", "🧑🏿‍🍳"],
    version: "12.1"
  }, {
    emoji: "👨‍🍳",
    category: 1,
    name: "man cook",
    variations: ["👨🏻‍🍳", "👨🏼‍🍳", "👨🏽‍🍳", "👨🏾‍🍳", "👨🏿‍🍳"],
    version: "4.0"
  }, {
    emoji: "👩‍🍳",
    category: 1,
    name: "woman cook",
    variations: ["👩🏻‍🍳", "👩🏼‍🍳", "👩🏽‍🍳", "👩🏾‍🍳", "👩🏿‍🍳"],
    version: "4.0"
  }, {
    emoji: "🧑‍🔧",
    category: 1,
    name: "mechanic",
    variations: ["🧑🏻‍🔧", "🧑🏼‍🔧", "🧑🏽‍🔧", "🧑🏾‍🔧", "🧑🏿‍🔧"],
    version: "12.1"
  }, {
    emoji: "👨‍🔧",
    category: 1,
    name: "man mechanic",
    variations: ["👨🏻‍🔧", "👨🏼‍🔧", "👨🏽‍🔧", "👨🏾‍🔧", "👨🏿‍🔧"],
    version: "4.0"
  }, {
    emoji: "👩‍🔧",
    category: 1,
    name: "woman mechanic",
    variations: ["👩🏻‍🔧", "👩🏼‍🔧", "👩🏽‍🔧", "👩🏾‍🔧", "👩🏿‍🔧"],
    version: "4.0"
  }, {
    emoji: "🧑‍🏭",
    category: 1,
    name: "factory worker",
    variations: ["🧑🏻‍🏭", "🧑🏼‍🏭", "🧑🏽‍🏭", "🧑🏾‍🏭", "🧑🏿‍🏭"],
    version: "12.1"
  }, {
    emoji: "👨‍🏭",
    category: 1,
    name: "man factory worker",
    variations: ["👨🏻‍🏭", "👨🏼‍🏭", "👨🏽‍🏭", "👨🏾‍🏭", "👨🏿‍🏭"],
    version: "4.0"
  }, {
    emoji: "👩‍🏭",
    category: 1,
    name: "woman factory worker",
    variations: ["👩🏻‍🏭", "👩🏼‍🏭", "👩🏽‍🏭", "👩🏾‍🏭", "👩🏿‍🏭"],
    version: "4.0"
  }, {
    emoji: "🧑‍💼",
    category: 1,
    name: "office worker",
    variations: ["🧑🏻‍💼", "🧑🏼‍💼", "🧑🏽‍💼", "🧑🏾‍💼", "🧑🏿‍💼"],
    version: "12.1"
  }, {
    emoji: "👨‍💼",
    category: 1,
    name: "man office worker",
    variations: ["👨🏻‍💼", "👨🏼‍💼", "👨🏽‍💼", "👨🏾‍💼", "👨🏿‍💼"],
    version: "4.0"
  }, {
    emoji: "👩‍💼",
    category: 1,
    name: "woman office worker",
    variations: ["👩🏻‍💼", "👩🏼‍💼", "👩🏽‍💼", "👩🏾‍💼", "👩🏿‍💼"],
    version: "4.0"
  }, {
    emoji: "🧑‍🔬",
    category: 1,
    name: "scientist",
    variations: ["🧑🏻‍🔬", "🧑🏼‍🔬", "🧑🏽‍🔬", "🧑🏾‍🔬", "🧑🏿‍🔬"],
    version: "12.1"
  }, {
    emoji: "👨‍🔬",
    category: 1,
    name: "man scientist",
    variations: ["👨🏻‍🔬", "👨🏼‍🔬", "👨🏽‍🔬", "👨🏾‍🔬", "👨🏿‍🔬"],
    version: "4.0"
  }, {
    emoji: "👩‍🔬",
    category: 1,
    name: "woman scientist",
    variations: ["👩🏻‍🔬", "👩🏼‍🔬", "👩🏽‍🔬", "👩🏾‍🔬", "👩🏿‍🔬"],
    version: "4.0"
  }, {
    emoji: "🧑‍💻",
    category: 1,
    name: "technologist",
    variations: ["🧑🏻‍💻", "🧑🏼‍💻", "🧑🏽‍💻", "🧑🏾‍💻", "🧑🏿‍💻"],
    version: "12.1"
  }, {
    emoji: "👨‍💻",
    category: 1,
    name: "man technologist",
    variations: ["👨🏻‍💻", "👨🏼‍💻", "👨🏽‍💻", "👨🏾‍💻", "👨🏿‍💻"],
    version: "4.0"
  }, {
    emoji: "👩‍💻",
    category: 1,
    name: "woman technologist",
    variations: ["👩🏻‍💻", "👩🏼‍💻", "👩🏽‍💻", "👩🏾‍💻", "👩🏿‍💻"],
    version: "4.0"
  }, {
    emoji: "🧑‍🎤",
    category: 1,
    name: "singer",
    variations: ["🧑🏻‍🎤", "🧑🏼‍🎤", "🧑🏽‍🎤", "🧑🏾‍🎤", "🧑🏿‍🎤"],
    version: "12.1"
  }, {
    emoji: "👨‍🎤",
    category: 1,
    name: "man singer",
    variations: ["👨🏻‍🎤", "👨🏼‍🎤", "👨🏽‍🎤", "👨🏾‍🎤", "👨🏿‍🎤"],
    version: "4.0"
  }, {
    emoji: "👩‍🎤",
    category: 1,
    name: "woman singer",
    variations: ["👩🏻‍🎤", "👩🏼‍🎤", "👩🏽‍🎤", "👩🏾‍🎤", "👩🏿‍🎤"],
    version: "4.0"
  }, {
    emoji: "🧑‍🎨",
    category: 1,
    name: "artist",
    variations: ["🧑🏻‍🎨", "🧑🏼‍🎨", "🧑🏽‍🎨", "🧑🏾‍🎨", "🧑🏿‍🎨"],
    version: "12.1"
  }, {
    emoji: "👨‍🎨",
    category: 1,
    name: "man artist",
    variations: ["👨🏻‍🎨", "👨🏼‍🎨", "👨🏽‍🎨", "👨🏾‍🎨", "👨🏿‍🎨"],
    version: "4.0"
  }, {
    emoji: "👩‍🎨",
    category: 1,
    name: "woman artist",
    variations: ["👩🏻‍🎨", "👩🏼‍🎨", "👩🏽‍🎨", "👩🏾‍🎨", "👩🏿‍🎨"],
    version: "4.0"
  }, {
    emoji: "🧑‍✈️",
    category: 1,
    name: "pilot",
    variations: ["🧑🏻‍✈️", "🧑🏼‍✈️", "🧑🏽‍✈️", "🧑🏾‍✈️", "🧑🏿‍✈️"],
    version: "12.1"
  }, {
    emoji: "👨‍✈️",
    category: 1,
    name: "man pilot",
    variations: ["👨🏻‍✈️", "👨🏼‍✈️", "👨🏽‍✈️", "👨🏾‍✈️", "👨🏿‍✈️"],
    version: "4.0"
  }, {
    emoji: "👩‍✈️",
    category: 1,
    name: "woman pilot",
    variations: ["👩🏻‍✈️", "👩🏼‍✈️", "👩🏽‍✈️", "👩🏾‍✈️", "👩🏿‍✈️"],
    version: "4.0"
  }, {
    emoji: "🧑‍🚀",
    category: 1,
    name: "astronaut",
    variations: ["🧑🏻‍🚀", "🧑🏼‍🚀", "🧑🏽‍🚀", "🧑🏾‍🚀", "🧑🏿‍🚀"],
    version: "12.1"
  }, {
    emoji: "👨‍🚀",
    category: 1,
    name: "man astronaut",
    variations: ["👨🏻‍🚀", "👨🏼‍🚀", "👨🏽‍🚀", "👨🏾‍🚀", "👨🏿‍🚀"],
    version: "4.0"
  }, {
    emoji: "👩‍🚀",
    category: 1,
    name: "woman astronaut",
    variations: ["👩🏻‍🚀", "👩🏼‍🚀", "👩🏽‍🚀", "👩🏾‍🚀", "👩🏿‍🚀"],
    version: "4.0"
  }, {
    emoji: "🧑‍🚒",
    category: 1,
    name: "firefighter",
    variations: ["🧑🏻‍🚒", "🧑🏼‍🚒", "🧑🏽‍🚒", "🧑🏾‍🚒", "🧑🏿‍🚒"],
    version: "12.1"
  }, {
    emoji: "👨‍🚒",
    category: 1,
    name: "man firefighter",
    variations: ["👨🏻‍🚒", "👨🏼‍🚒", "👨🏽‍🚒", "👨🏾‍🚒", "👨🏿‍🚒"],
    version: "4.0"
  }, {
    emoji: "👩‍🚒",
    category: 1,
    name: "woman firefighter",
    variations: ["👩🏻‍🚒", "👩🏼‍🚒", "👩🏽‍🚒", "👩🏾‍🚒", "👩🏿‍🚒"],
    version: "4.0"
  }, {
    emoji: "👮",
    category: 1,
    name: "police officer",
    variations: ["👮🏻", "👮🏼", "👮🏽", "👮🏾", "👮🏿"],
    version: "1.0"
  }, {
    emoji: "👮‍♂️",
    category: 1,
    name: "man police officer",
    variations: ["👮🏻‍♂️", "👮🏼‍♂️", "👮🏽‍♂️", "👮🏾‍♂️", "👮🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "👮‍♀️",
    category: 1,
    name: "woman police officer",
    variations: ["👮🏻‍♀️", "👮🏼‍♀️", "👮🏽‍♀️", "👮🏾‍♀️", "👮🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🕵️",
    category: 1,
    name: "detective",
    variations: ["🕵🏻", "🕵🏼", "🕵🏽", "🕵🏾", "🕵🏿"],
    version: "1.0"
  }, {
    emoji: "🕵️‍♂️",
    category: 1,
    name: "man detective",
    variations: ["🕵🏻‍♂️", "🕵🏼‍♂️", "🕵🏽‍♂️", "🕵🏾‍♂️", "🕵🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🕵️‍♀️",
    category: 1,
    name: "woman detective",
    variations: ["🕵🏻‍♀️", "🕵🏼‍♀️", "🕵🏽‍♀️", "🕵🏾‍♀️", "🕵🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "💂",
    category: 1,
    name: "guard",
    variations: ["💂🏻", "💂🏼", "💂🏽", "💂🏾", "💂🏿"],
    version: "1.0"
  }, {
    emoji: "💂‍♂️",
    category: 1,
    name: "man guard",
    variations: ["💂🏻‍♂️", "💂🏼‍♂️", "💂🏽‍♂️", "💂🏾‍♂️", "💂🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "💂‍♀️",
    category: 1,
    name: "woman guard",
    variations: ["💂🏻‍♀️", "💂🏼‍♀️", "💂🏽‍♀️", "💂🏾‍♀️", "💂🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🥷",
    category: 1,
    name: "ninja",
    variations: ["🥷🏻", "🥷🏼", "🥷🏽", "🥷🏾", "🥷🏿"],
    version: "13.0"
  }, {
    emoji: "👷",
    category: 1,
    name: "construction worker",
    variations: ["👷🏻", "👷🏼", "👷🏽", "👷🏾", "👷🏿"],
    version: "1.0"
  }, {
    emoji: "👷‍♂️",
    category: 1,
    name: "man construction worker",
    variations: ["👷🏻‍♂️", "👷🏼‍♂️", "👷🏽‍♂️", "👷🏾‍♂️", "👷🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "👷‍♀️",
    category: 1,
    name: "woman construction worker",
    variations: ["👷🏻‍♀️", "👷🏼‍♀️", "👷🏽‍♀️", "👷🏾‍♀️", "👷🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🤴",
    category: 1,
    name: "prince",
    variations: ["🤴🏻", "🤴🏼", "🤴🏽", "🤴🏾", "🤴🏿"],
    version: "3.0"
  }, {
    emoji: "👸",
    category: 1,
    name: "princess",
    variations: ["👸🏻", "👸🏼", "👸🏽", "👸🏾", "👸🏿"],
    version: "1.0"
  }, {
    emoji: "👳",
    category: 1,
    name: "person wearing turban",
    variations: ["👳🏻", "👳🏼", "👳🏽", "👳🏾", "👳🏿"],
    version: "1.0"
  }, {
    emoji: "👳‍♂️",
    category: 1,
    name: "man wearing turban",
    variations: ["👳🏻‍♂️", "👳🏼‍♂️", "👳🏽‍♂️", "👳🏾‍♂️", "👳🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "👳‍♀️",
    category: 1,
    name: "woman wearing turban",
    variations: ["👳🏻‍♀️", "👳🏼‍♀️", "👳🏽‍♀️", "👳🏾‍♀️", "👳🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "👲",
    category: 1,
    name: "person with skullcap",
    variations: ["👲🏻", "👲🏼", "👲🏽", "👲🏾", "👲🏿"],
    version: "1.0"
  }, {
    emoji: "🧕",
    category: 1,
    name: "woman with headscarf",
    variations: ["🧕🏻", "🧕🏼", "🧕🏽", "🧕🏾", "🧕🏿"],
    version: "5.0"
  }, {
    emoji: "🤵",
    category: 1,
    name: "person in tuxedo",
    variations: ["🤵🏻", "🤵🏼", "🤵🏽", "🤵🏾", "🤵🏿"],
    version: "3.0"
  }, {
    emoji: "🤵‍♂️",
    category: 1,
    name: "man in tuxedo",
    variations: ["🤵🏻‍♂️", "🤵🏼‍♂️", "🤵🏽‍♂️", "🤵🏾‍♂️", "🤵🏿‍♂️"],
    version: "13.0"
  }, {
    emoji: "🤵‍♀️",
    category: 1,
    name: "woman in tuxedo",
    variations: ["🤵🏻‍♀️", "🤵🏼‍♀️", "🤵🏽‍♀️", "🤵🏾‍♀️", "🤵🏿‍♀️"],
    version: "13.0"
  }, {
    emoji: "👰",
    category: 1,
    name: "person with veil",
    variations: ["👰🏻", "👰🏼", "👰🏽", "👰🏾", "👰🏿"],
    version: "1.0"
  }, {
    emoji: "👰‍♂️",
    category: 1,
    name: "man with veil",
    variations: ["👰🏻‍♂️", "👰🏼‍♂️", "👰🏽‍♂️", "👰🏾‍♂️", "👰🏿‍♂️"],
    version: "13.0"
  }, {
    emoji: "👰‍♀️",
    category: 1,
    name: "woman with veil",
    variations: ["👰🏻‍♀️", "👰🏼‍♀️", "👰🏽‍♀️", "👰🏾‍♀️", "👰🏿‍♀️"],
    version: "13.0"
  }, {
    emoji: "🤰",
    category: 1,
    name: "pregnant woman",
    variations: ["🤰🏻", "🤰🏼", "🤰🏽", "🤰🏾", "🤰🏿"],
    version: "3.0"
  }, {
    emoji: "🤱",
    category: 1,
    name: "breast-feeding",
    variations: ["🤱🏻", "🤱🏼", "🤱🏽", "🤱🏾", "🤱🏿"],
    version: "5.0"
  }, {
    emoji: "👩‍🍼",
    category: 1,
    name: "woman feeding baby",
    variations: ["👩🏻‍🍼", "👩🏼‍🍼", "👩🏽‍🍼", "👩🏾‍🍼", "👩🏿‍🍼"],
    version: "13.0"
  }, {
    emoji: "👨‍🍼",
    category: 1,
    name: "man feeding baby",
    variations: ["👨🏻‍🍼", "👨🏼‍🍼", "👨🏽‍🍼", "👨🏾‍🍼", "👨🏿‍🍼"],
    version: "13.0"
  }, {
    emoji: "🧑‍🍼",
    category: 1,
    name: "person feeding baby",
    variations: ["🧑🏻‍🍼", "🧑🏼‍🍼", "🧑🏽‍🍼", "🧑🏾‍🍼", "🧑🏿‍🍼"],
    version: "13.0"
  }, {
    emoji: "👼",
    category: 1,
    name: "baby angel",
    variations: ["👼🏻", "👼🏼", "👼🏽", "👼🏾", "👼🏿"],
    version: "1.0"
  }, {
    emoji: "🎅",
    category: 1,
    name: "Santa Claus",
    variations: ["🎅🏻", "🎅🏼", "🎅🏽", "🎅🏾", "🎅🏿"],
    version: "1.0"
  }, {
    emoji: "🤶",
    category: 1,
    name: "Mrs. Claus",
    variations: ["🤶🏻", "🤶🏼", "🤶🏽", "🤶🏾", "🤶🏿"],
    version: "3.0"
  }, {
    emoji: "🧑‍🎄",
    category: 1,
    name: "mx claus",
    variations: ["🧑🏻‍🎄", "🧑🏼‍🎄", "🧑🏽‍🎄", "🧑🏾‍🎄", "🧑🏿‍🎄"],
    version: "13.0"
  }, {
    emoji: "🦸",
    category: 1,
    name: "superhero",
    variations: ["🦸🏻", "🦸🏼", "🦸🏽", "🦸🏾", "🦸🏿"],
    version: "11.0"
  }, {
    emoji: "🦸‍♂️",
    category: 1,
    name: "man superhero",
    variations: ["🦸🏻‍♂️", "🦸🏼‍♂️", "🦸🏽‍♂️", "🦸🏾‍♂️", "🦸🏿‍♂️"],
    version: "11.0"
  }, {
    emoji: "🦸‍♀️",
    category: 1,
    name: "woman superhero",
    variations: ["🦸🏻‍♀️", "🦸🏼‍♀️", "🦸🏽‍♀️", "🦸🏾‍♀️", "🦸🏿‍♀️"],
    version: "11.0"
  }, {
    emoji: "🦹",
    category: 1,
    name: "supervillain",
    variations: ["🦹🏻", "🦹🏼", "🦹🏽", "🦹🏾", "🦹🏿"],
    version: "11.0"
  }, {
    emoji: "🦹‍♂️",
    category: 1,
    name: "man supervillain",
    variations: ["🦹🏻‍♂️", "🦹🏼‍♂️", "🦹🏽‍♂️", "🦹🏾‍♂️", "🦹🏿‍♂️"],
    version: "11.0"
  }, {
    emoji: "🦹‍♀️",
    category: 1,
    name: "woman supervillain",
    variations: ["🦹🏻‍♀️", "🦹🏼‍♀️", "🦹🏽‍♀️", "🦹🏾‍♀️", "🦹🏿‍♀️"],
    version: "11.0"
  }, {
    emoji: "🧙",
    category: 1,
    name: "mage",
    variations: ["🧙🏻", "🧙🏼", "🧙🏽", "🧙🏾", "🧙🏿"],
    version: "5.0"
  }, {
    emoji: "🧙‍♂️",
    category: 1,
    name: "man mage",
    variations: ["🧙🏻‍♂️", "🧙🏼‍♂️", "🧙🏽‍♂️", "🧙🏾‍♂️", "🧙🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧙‍♀️",
    category: 1,
    name: "woman mage",
    variations: ["🧙🏻‍♀️", "🧙🏼‍♀️", "🧙🏽‍♀️", "🧙🏾‍♀️", "🧙🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🧚",
    category: 1,
    name: "fairy",
    variations: ["🧚🏻", "🧚🏼", "🧚🏽", "🧚🏾", "🧚🏿"],
    version: "5.0"
  }, {
    emoji: "🧚‍♂️",
    category: 1,
    name: "man fairy",
    variations: ["🧚🏻‍♂️", "🧚🏼‍♂️", "🧚🏽‍♂️", "🧚🏾‍♂️", "🧚🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧚‍♀️",
    category: 1,
    name: "woman fairy",
    variations: ["🧚🏻‍♀️", "🧚🏼‍♀️", "🧚🏽‍♀️", "🧚🏾‍♀️", "🧚🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🧛",
    category: 1,
    name: "vampire",
    variations: ["🧛🏻", "🧛🏼", "🧛🏽", "🧛🏾", "🧛🏿"],
    version: "5.0"
  }, {
    emoji: "🧛‍♂️",
    category: 1,
    name: "man vampire",
    variations: ["🧛🏻‍♂️", "🧛🏼‍♂️", "🧛🏽‍♂️", "🧛🏾‍♂️", "🧛🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧛‍♀️",
    category: 1,
    name: "woman vampire",
    variations: ["🧛🏻‍♀️", "🧛🏼‍♀️", "🧛🏽‍♀️", "🧛🏾‍♀️", "🧛🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🧜",
    category: 1,
    name: "merperson",
    variations: ["🧜🏻", "🧜🏼", "🧜🏽", "🧜🏾", "🧜🏿"],
    version: "5.0"
  }, {
    emoji: "🧜‍♂️",
    category: 1,
    name: "merman",
    variations: ["🧜🏻‍♂️", "🧜🏼‍♂️", "🧜🏽‍♂️", "🧜🏾‍♂️", "🧜🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧜‍♀️",
    category: 1,
    name: "mermaid",
    variations: ["🧜🏻‍♀️", "🧜🏼‍♀️", "🧜🏽‍♀️", "🧜🏾‍♀️", "🧜🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🧝",
    category: 1,
    name: "elf",
    variations: ["🧝🏻", "🧝🏼", "🧝🏽", "🧝🏾", "🧝🏿"],
    version: "5.0"
  }, {
    emoji: "🧝‍♂️",
    category: 1,
    name: "man elf",
    variations: ["🧝🏻‍♂️", "🧝🏼‍♂️", "🧝🏽‍♂️", "🧝🏾‍♂️", "🧝🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧝‍♀️",
    category: 1,
    name: "woman elf",
    variations: ["🧝🏻‍♀️", "🧝🏼‍♀️", "🧝🏽‍♀️", "🧝🏾‍♀️", "🧝🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🧞",
    category: 1,
    name: "genie",
    version: "5.0"
  }, {
    emoji: "🧞‍♂️",
    category: 1,
    name: "man genie",
    version: "5.0"
  }, {
    emoji: "🧞‍♀️",
    category: 1,
    name: "woman genie",
    version: "5.0"
  }, {
    emoji: "🧟",
    category: 1,
    name: "zombie",
    version: "5.0"
  }, {
    emoji: "🧟‍♂️",
    category: 1,
    name: "man zombie",
    version: "5.0"
  }, {
    emoji: "🧟‍♀️",
    category: 1,
    name: "woman zombie",
    version: "5.0"
  }, {
    emoji: "💆",
    category: 1,
    name: "person getting massage",
    variations: ["💆🏻", "💆🏼", "💆🏽", "💆🏾", "💆🏿"],
    version: "1.0"
  }, {
    emoji: "💆‍♂️",
    category: 1,
    name: "man getting massage",
    variations: ["💆🏻‍♂️", "💆🏼‍♂️", "💆🏽‍♂️", "💆🏾‍♂️", "💆🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "💆‍♀️",
    category: 1,
    name: "woman getting massage",
    variations: ["💆🏻‍♀️", "💆🏼‍♀️", "💆🏽‍♀️", "💆🏾‍♀️", "💆🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "💇",
    category: 1,
    name: "person getting haircut",
    variations: ["💇🏻", "💇🏼", "💇🏽", "💇🏾", "💇🏿"],
    version: "1.0"
  }, {
    emoji: "💇‍♂️",
    category: 1,
    name: "man getting haircut",
    variations: ["💇🏻‍♂️", "💇🏼‍♂️", "💇🏽‍♂️", "💇🏾‍♂️", "💇🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "💇‍♀️",
    category: 1,
    name: "woman getting haircut",
    variations: ["💇🏻‍♀️", "💇🏼‍♀️", "💇🏽‍♀️", "💇🏾‍♀️", "💇🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🚶",
    category: 1,
    name: "person walking",
    variations: ["🚶🏻", "🚶🏼", "🚶🏽", "🚶🏾", "🚶🏿"],
    version: "1.0"
  }, {
    emoji: "🚶‍♂️",
    category: 1,
    name: "man walking",
    variations: ["🚶🏻‍♂️", "🚶🏼‍♂️", "🚶🏽‍♂️", "🚶🏾‍♂️", "🚶🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🚶‍♀️",
    category: 1,
    name: "woman walking",
    variations: ["🚶🏻‍♀️", "🚶🏼‍♀️", "🚶🏽‍♀️", "🚶🏾‍♀️", "🚶🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🧍",
    category: 1,
    name: "person standing",
    variations: ["🧍🏻", "🧍🏼", "🧍🏽", "🧍🏾", "🧍🏿"],
    version: "12.0"
  }, {
    emoji: "🧍‍♂️",
    category: 1,
    name: "man standing",
    variations: ["🧍🏻‍♂️", "🧍🏼‍♂️", "🧍🏽‍♂️", "🧍🏾‍♂️", "🧍🏿‍♂️"],
    version: "12.0"
  }, {
    emoji: "🧍‍♀️",
    category: 1,
    name: "woman standing",
    variations: ["🧍🏻‍♀️", "🧍🏼‍♀️", "🧍🏽‍♀️", "🧍🏾‍♀️", "🧍🏿‍♀️"],
    version: "12.0"
  }, {
    emoji: "🧎",
    category: 1,
    name: "person kneeling",
    variations: ["🧎🏻", "🧎🏼", "🧎🏽", "🧎🏾", "🧎🏿"],
    version: "12.0"
  }, {
    emoji: "🧎‍♂️",
    category: 1,
    name: "man kneeling",
    variations: ["🧎🏻‍♂️", "🧎🏼‍♂️", "🧎🏽‍♂️", "🧎🏾‍♂️", "🧎🏿‍♂️"],
    version: "12.0"
  }, {
    emoji: "🧎‍♀️",
    category: 1,
    name: "woman kneeling",
    variations: ["🧎🏻‍♀️", "🧎🏼‍♀️", "🧎🏽‍♀️", "🧎🏾‍♀️", "🧎🏿‍♀️"],
    version: "12.0"
  }, {
    emoji: "🧑‍🦯",
    category: 1,
    name: "person with white cane",
    variations: ["🧑🏻‍🦯", "🧑🏼‍🦯", "🧑🏽‍🦯", "🧑🏾‍🦯", "🧑🏿‍🦯"],
    version: "12.1"
  }, {
    emoji: "👨‍🦯",
    category: 1,
    name: "man with white cane",
    variations: ["👨🏻‍🦯", "👨🏼‍🦯", "👨🏽‍🦯", "👨🏾‍🦯", "👨🏿‍🦯"],
    version: "12.0"
  }, {
    emoji: "👩‍🦯",
    category: 1,
    name: "woman with white cane",
    variations: ["👩🏻‍🦯", "👩🏼‍🦯", "👩🏽‍🦯", "👩🏾‍🦯", "👩🏿‍🦯"],
    version: "12.0"
  }, {
    emoji: "🧑‍🦼",
    category: 1,
    name: "person in motorized wheelchair",
    variations: ["🧑🏻‍🦼", "🧑🏼‍🦼", "🧑🏽‍🦼", "🧑🏾‍🦼", "🧑🏿‍🦼"],
    version: "12.1"
  }, {
    emoji: "👨‍🦼",
    category: 1,
    name: "man in motorized wheelchair",
    variations: ["👨🏻‍🦼", "👨🏼‍🦼", "👨🏽‍🦼", "👨🏾‍🦼", "👨🏿‍🦼"],
    version: "12.0"
  }, {
    emoji: "👩‍🦼",
    category: 1,
    name: "woman in motorized wheelchair",
    variations: ["👩🏻‍🦼", "👩🏼‍🦼", "👩🏽‍🦼", "👩🏾‍🦼", "👩🏿‍🦼"],
    version: "12.0"
  }, {
    emoji: "🧑‍🦽",
    category: 1,
    name: "person in manual wheelchair",
    variations: ["🧑🏻‍🦽", "🧑🏼‍🦽", "🧑🏽‍🦽", "🧑🏾‍🦽", "🧑🏿‍🦽"],
    version: "12.1"
  }, {
    emoji: "👨‍🦽",
    category: 1,
    name: "man in manual wheelchair",
    variations: ["👨🏻‍🦽", "👨🏼‍🦽", "👨🏽‍🦽", "👨🏾‍🦽", "👨🏿‍🦽"],
    version: "12.0"
  }, {
    emoji: "👩‍🦽",
    category: 1,
    name: "woman in manual wheelchair",
    variations: ["👩🏻‍🦽", "👩🏼‍🦽", "👩🏽‍🦽", "👩🏾‍🦽", "👩🏿‍🦽"],
    version: "12.0"
  }, {
    emoji: "🏃",
    category: 1,
    name: "person running",
    variations: ["🏃🏻", "🏃🏼", "🏃🏽", "🏃🏾", "🏃🏿"],
    version: "1.0"
  }, {
    emoji: "🏃‍♂️",
    category: 1,
    name: "man running",
    variations: ["🏃🏻‍♂️", "🏃🏼‍♂️", "🏃🏽‍♂️", "🏃🏾‍♂️", "🏃🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🏃‍♀️",
    category: 1,
    name: "woman running",
    variations: ["🏃🏻‍♀️", "🏃🏼‍♀️", "🏃🏽‍♀️", "🏃🏾‍♀️", "🏃🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "💃",
    category: 1,
    name: "woman dancing",
    variations: ["💃🏻", "💃🏼", "💃🏽", "💃🏾", "💃🏿"],
    version: "1.0"
  }, {
    emoji: "🕺",
    category: 1,
    name: "man dancing",
    variations: ["🕺🏻", "🕺🏼", "🕺🏽", "🕺🏾", "🕺🏿"],
    version: "3.0"
  }, {
    emoji: "🕴️",
    category: 1,
    name: "person in suit levitating",
    variations: ["🕴🏻", "🕴🏼", "🕴🏽", "🕴🏾", "🕴🏿"],
    version: "1.0"
  }, {
    emoji: "👯",
    category: 1,
    name: "people with bunny ears",
    version: "1.0"
  }, {
    emoji: "👯‍♂️",
    category: 1,
    name: "men with bunny ears",
    version: "4.0"
  }, {
    emoji: "👯‍♀️",
    category: 1,
    name: "women with bunny ears",
    version: "4.0"
  }, {
    emoji: "🧖",
    category: 1,
    name: "person in steamy room",
    variations: ["🧖🏻", "🧖🏼", "🧖🏽", "🧖🏾", "🧖🏿"],
    version: "5.0"
  }, {
    emoji: "🧖‍♂️",
    category: 1,
    name: "man in steamy room",
    variations: ["🧖🏻‍♂️", "🧖🏼‍♂️", "🧖🏽‍♂️", "🧖🏾‍♂️", "🧖🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧖‍♀️",
    category: 1,
    name: "woman in steamy room",
    variations: ["🧖🏻‍♀️", "🧖🏼‍♀️", "🧖🏽‍♀️", "🧖🏾‍♀️", "🧖🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🧗",
    category: 1,
    name: "person climbing",
    variations: ["🧗🏻", "🧗🏼", "🧗🏽", "🧗🏾", "🧗🏿"],
    version: "5.0"
  }, {
    emoji: "🧗‍♂️",
    category: 1,
    name: "man climbing",
    variations: ["🧗🏻‍♂️", "🧗🏼‍♂️", "🧗🏽‍♂️", "🧗🏾‍♂️", "🧗🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧗‍♀️",
    category: 1,
    name: "woman climbing",
    variations: ["🧗🏻‍♀️", "🧗🏼‍♀️", "🧗🏽‍♀️", "🧗🏾‍♀️", "🧗🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🤺",
    category: 1,
    name: "person fencing",
    version: "3.0"
  }, {
    emoji: "🏇",
    category: 1,
    name: "horse racing",
    variations: ["🏇🏻", "🏇🏼", "🏇🏽", "🏇🏾", "🏇🏿"],
    version: "1.0"
  }, {
    emoji: "⛷️",
    category: 1,
    name: "skier",
    version: "1.0"
  }, {
    emoji: "🏂",
    category: 1,
    name: "snowboarder",
    variations: ["🏂🏻", "🏂🏼", "🏂🏽", "🏂🏾", "🏂🏿"],
    version: "1.0"
  }, {
    emoji: "🏌️",
    category: 1,
    name: "person golfing",
    variations: ["🏌🏻", "🏌🏼", "🏌🏽", "🏌🏾", "🏌🏿"],
    version: "1.0"
  }, {
    emoji: "🏌️‍♂️",
    category: 1,
    name: "man golfing",
    variations: ["🏌🏻‍♂️", "🏌🏼‍♂️", "🏌🏽‍♂️", "🏌🏾‍♂️", "🏌🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🏌️‍♀️",
    category: 1,
    name: "woman golfing",
    variations: ["🏌🏻‍♀️", "🏌🏼‍♀️", "🏌🏽‍♀️", "🏌🏾‍♀️", "🏌🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🏄",
    category: 1,
    name: "person surfing",
    variations: ["🏄🏻", "🏄🏼", "🏄🏽", "🏄🏾", "🏄🏿"],
    version: "1.0"
  }, {
    emoji: "🏄‍♂️",
    category: 1,
    name: "man surfing",
    variations: ["🏄🏻‍♂️", "🏄🏼‍♂️", "🏄🏽‍♂️", "🏄🏾‍♂️", "🏄🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🏄‍♀️",
    category: 1,
    name: "woman surfing",
    variations: ["🏄🏻‍♀️", "🏄🏼‍♀️", "🏄🏽‍♀️", "🏄🏾‍♀️", "🏄🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🚣",
    category: 1,
    name: "person rowing boat",
    variations: ["🚣🏻", "🚣🏼", "🚣🏽", "🚣🏾", "🚣🏿"],
    version: "1.0"
  }, {
    emoji: "🚣‍♂️",
    category: 1,
    name: "man rowing boat",
    variations: ["🚣🏻‍♂️", "🚣🏼‍♂️", "🚣🏽‍♂️", "🚣🏾‍♂️", "🚣🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🚣‍♀️",
    category: 1,
    name: "woman rowing boat",
    variations: ["🚣🏻‍♀️", "🚣🏼‍♀️", "🚣🏽‍♀️", "🚣🏾‍♀️", "🚣🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🏊",
    category: 1,
    name: "person swimming",
    variations: ["🏊🏻", "🏊🏼", "🏊🏽", "🏊🏾", "🏊🏿"],
    version: "1.0"
  }, {
    emoji: "🏊‍♂️",
    category: 1,
    name: "man swimming",
    variations: ["🏊🏻‍♂️", "🏊🏼‍♂️", "🏊🏽‍♂️", "🏊🏾‍♂️", "🏊🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🏊‍♀️",
    category: 1,
    name: "woman swimming",
    variations: ["🏊🏻‍♀️", "🏊🏼‍♀️", "🏊🏽‍♀️", "🏊🏾‍♀️", "🏊🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "⛹️",
    category: 1,
    name: "person bouncing ball",
    variations: ["⛹🏻", "⛹🏼", "⛹🏽", "⛹🏾", "⛹🏿"],
    version: "1.0"
  }, {
    emoji: "⛹️‍♂️",
    category: 1,
    name: "man bouncing ball",
    variations: ["⛹🏻‍♂️", "⛹🏼‍♂️", "⛹🏽‍♂️", "⛹🏾‍♂️", "⛹🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "⛹️‍♀️",
    category: 1,
    name: "woman bouncing ball",
    variations: ["⛹🏻‍♀️", "⛹🏼‍♀️", "⛹🏽‍♀️", "⛹🏾‍♀️", "⛹🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🏋️",
    category: 1,
    name: "person lifting weights",
    variations: ["🏋🏻", "🏋🏼", "🏋🏽", "🏋🏾", "🏋🏿"],
    version: "1.0"
  }, {
    emoji: "🏋️‍♂️",
    category: 1,
    name: "man lifting weights",
    variations: ["🏋🏻‍♂️", "🏋🏼‍♂️", "🏋🏽‍♂️", "🏋🏾‍♂️", "🏋🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🏋️‍♀️",
    category: 1,
    name: "woman lifting weights",
    variations: ["🏋🏻‍♀️", "🏋🏼‍♀️", "🏋🏽‍♀️", "🏋🏾‍♀️", "🏋🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🚴",
    category: 1,
    name: "person biking",
    variations: ["🚴🏻", "🚴🏼", "🚴🏽", "🚴🏾", "🚴🏿"],
    version: "1.0"
  }, {
    emoji: "🚴‍♂️",
    category: 1,
    name: "man biking",
    variations: ["🚴🏻‍♂️", "🚴🏼‍♂️", "🚴🏽‍♂️", "🚴🏾‍♂️", "🚴🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🚴‍♀️",
    category: 1,
    name: "woman biking",
    variations: ["🚴🏻‍♀️", "🚴🏼‍♀️", "🚴🏽‍♀️", "🚴🏾‍♀️", "🚴🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🚵",
    category: 1,
    name: "person mountain biking",
    variations: ["🚵🏻", "🚵🏼", "🚵🏽", "🚵🏾", "🚵🏿"],
    version: "1.0"
  }, {
    emoji: "🚵‍♂️",
    category: 1,
    name: "man mountain biking",
    variations: ["🚵🏻‍♂️", "🚵🏼‍♂️", "🚵🏽‍♂️", "🚵🏾‍♂️", "🚵🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🚵‍♀️",
    category: 1,
    name: "woman mountain biking",
    variations: ["🚵🏻‍♀️", "🚵🏼‍♀️", "🚵🏽‍♀️", "🚵🏾‍♀️", "🚵🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🤸",
    category: 1,
    name: "person cartwheeling",
    variations: ["🤸🏻", "🤸🏼", "🤸🏽", "🤸🏾", "🤸🏿"],
    version: "3.0"
  }, {
    emoji: "🤸‍♂️",
    category: 1,
    name: "man cartwheeling",
    variations: ["🤸🏻‍♂️", "🤸🏼‍♂️", "🤸🏽‍♂️", "🤸🏾‍♂️", "🤸🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🤸‍♀️",
    category: 1,
    name: "woman cartwheeling",
    variations: ["🤸🏻‍♀️", "🤸🏼‍♀️", "🤸🏽‍♀️", "🤸🏾‍♀️", "🤸🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🤼",
    category: 1,
    name: "people wrestling",
    version: "3.0"
  }, {
    emoji: "🤼‍♂️",
    category: 1,
    name: "men wrestling",
    version: "4.0"
  }, {
    emoji: "🤼‍♀️",
    category: 1,
    name: "women wrestling",
    version: "4.0"
  }, {
    emoji: "🤽",
    category: 1,
    name: "person playing water polo",
    variations: ["🤽🏻", "🤽🏼", "🤽🏽", "🤽🏾", "🤽🏿"],
    version: "3.0"
  }, {
    emoji: "🤽‍♂️",
    category: 1,
    name: "man playing water polo",
    variations: ["🤽🏻‍♂️", "🤽🏼‍♂️", "🤽🏽‍♂️", "🤽🏾‍♂️", "🤽🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🤽‍♀️",
    category: 1,
    name: "woman playing water polo",
    variations: ["🤽🏻‍♀️", "🤽🏼‍♀️", "🤽🏽‍♀️", "🤽🏾‍♀️", "🤽🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🤾",
    category: 1,
    name: "person playing handball",
    variations: ["🤾🏻", "🤾🏼", "🤾🏽", "🤾🏾", "🤾🏿"],
    version: "3.0"
  }, {
    emoji: "🤾‍♂️",
    category: 1,
    name: "man playing handball",
    variations: ["🤾🏻‍♂️", "🤾🏼‍♂️", "🤾🏽‍♂️", "🤾🏾‍♂️", "🤾🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🤾‍♀️",
    category: 1,
    name: "woman playing handball",
    variations: ["🤾🏻‍♀️", "🤾🏼‍♀️", "🤾🏽‍♀️", "🤾🏾‍♀️", "🤾🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🤹",
    category: 1,
    name: "person juggling",
    variations: ["🤹🏻", "🤹🏼", "🤹🏽", "🤹🏾", "🤹🏿"],
    version: "3.0"
  }, {
    emoji: "🤹‍♂️",
    category: 1,
    name: "man juggling",
    variations: ["🤹🏻‍♂️", "🤹🏼‍♂️", "🤹🏽‍♂️", "🤹🏾‍♂️", "🤹🏿‍♂️"],
    version: "4.0"
  }, {
    emoji: "🤹‍♀️",
    category: 1,
    name: "woman juggling",
    variations: ["🤹🏻‍♀️", "🤹🏼‍♀️", "🤹🏽‍♀️", "🤹🏾‍♀️", "🤹🏿‍♀️"],
    version: "4.0"
  }, {
    emoji: "🧘",
    category: 1,
    name: "person in lotus position",
    variations: ["🧘🏻", "🧘🏼", "🧘🏽", "🧘🏾", "🧘🏿"],
    version: "5.0"
  }, {
    emoji: "🧘‍♂️",
    category: 1,
    name: "man in lotus position",
    variations: ["🧘🏻‍♂️", "🧘🏼‍♂️", "🧘🏽‍♂️", "🧘🏾‍♂️", "🧘🏿‍♂️"],
    version: "5.0"
  }, {
    emoji: "🧘‍♀️",
    category: 1,
    name: "woman in lotus position",
    variations: ["🧘🏻‍♀️", "🧘🏼‍♀️", "🧘🏽‍♀️", "🧘🏾‍♀️", "🧘🏿‍♀️"],
    version: "5.0"
  }, {
    emoji: "🛀",
    category: 1,
    name: "person taking bath",
    variations: ["🛀🏻", "🛀🏼", "🛀🏽", "🛀🏾", "🛀🏿"],
    version: "1.0"
  }, {
    emoji: "🛌",
    category: 1,
    name: "person in bed",
    variations: ["🛌🏻", "🛌🏼", "🛌🏽", "🛌🏾", "🛌🏿"],
    version: "1.0"
  }, {
    emoji: "🧑‍🤝‍🧑",
    category: 1,
    name: "people holding hands",
    variations: ["🧑🏻‍🤝‍🧑🏻", "🧑🏻‍🤝‍🧑🏼", "🧑🏻‍🤝‍🧑🏽", "🧑🏻‍🤝‍🧑🏾", "🧑🏻‍🤝‍🧑🏿", "🧑🏼‍🤝‍🧑🏻", "🧑🏼‍🤝‍🧑🏼", "🧑🏼‍🤝‍🧑🏽", "🧑🏼‍🤝‍🧑🏾", "🧑🏼‍🤝‍🧑🏿", "🧑🏽‍🤝‍🧑🏻", "🧑🏽‍🤝‍🧑🏼", "🧑🏽‍🤝‍🧑🏽", "🧑🏽‍🤝‍🧑🏾", "🧑🏽‍🤝‍🧑🏿", "🧑🏾‍🤝‍🧑🏻", "🧑🏾‍🤝‍🧑🏼", "🧑🏾‍🤝‍🧑🏽", "🧑🏾‍🤝‍🧑🏾", "🧑🏾‍🤝‍🧑🏿", "🧑🏿‍🤝‍🧑🏻", "🧑🏿‍🤝‍🧑🏼", "🧑🏿‍🤝‍🧑🏽", "🧑🏿‍🤝‍🧑🏾", "🧑🏿‍🤝‍🧑🏿"],
    version: "12.0"
  }, {
    emoji: "👭",
    category: 1,
    name: "women holding hands",
    variations: ["👭🏻", "👩🏻‍🤝‍👩🏼", "👩🏻‍🤝‍👩🏽", "👩🏻‍🤝‍👩🏾", "👩🏻‍🤝‍👩🏿", "👩🏼‍🤝‍👩🏻", "👭🏼", "👩🏼‍🤝‍👩🏽", "👩🏼‍🤝‍👩🏾", "👩🏼‍🤝‍👩🏿", "👩🏽‍🤝‍👩🏻", "👩🏽‍🤝‍👩🏼", "👭🏽", "👩🏽‍🤝‍👩🏾", "👩🏽‍🤝‍👩🏿", "👩🏾‍🤝‍👩🏻", "👩🏾‍🤝‍👩🏼", "👩🏾‍🤝‍👩🏽", "👭🏾", "👩🏾‍🤝‍👩🏿", "👩🏿‍🤝‍👩🏻", "👩🏿‍🤝‍👩🏼", "👩🏿‍🤝‍👩🏽", "👩🏿‍🤝‍👩🏾", "👭🏿"],
    version: "1.0"
  }, {
    emoji: "👫",
    category: 1,
    name: "woman and man holding hands",
    variations: ["👫🏻", "👩🏻‍🤝‍👨🏼", "👩🏻‍🤝‍👨🏽", "👩🏻‍🤝‍👨🏾", "👩🏻‍🤝‍👨🏿", "👩🏼‍🤝‍👨🏻", "👫🏼", "👩🏼‍🤝‍👨🏽", "👩🏼‍🤝‍👨🏾", "👩🏼‍🤝‍👨🏿", "👩🏽‍🤝‍👨🏻", "👩🏽‍🤝‍👨🏼", "👫🏽", "👩🏽‍🤝‍👨🏾", "👩🏽‍🤝‍👨🏿", "👩🏾‍🤝‍👨🏻", "👩🏾‍🤝‍👨🏼", "👩🏾‍🤝‍👨🏽", "👫🏾", "👩🏾‍🤝‍👨🏿", "👩🏿‍🤝‍👨🏻", "👩🏿‍🤝‍👨🏼", "👩🏿‍🤝‍👨🏽", "👩🏿‍🤝‍👨🏾", "👫🏿"],
    version: "1.0"
  }, {
    emoji: "👬",
    category: 1,
    name: "men holding hands",
    variations: ["👬🏻", "👨🏻‍🤝‍👨🏼", "👨🏻‍🤝‍👨🏽", "👨🏻‍🤝‍👨🏾", "👨🏻‍🤝‍👨🏿", "👨🏼‍🤝‍👨🏻", "👬🏼", "👨🏼‍🤝‍👨🏽", "👨🏼‍🤝‍👨🏾", "👨🏼‍🤝‍👨🏿", "👨🏽‍🤝‍👨🏻", "👨🏽‍🤝‍👨🏼", "👬🏽", "👨🏽‍🤝‍👨🏾", "👨🏽‍🤝‍👨🏿", "👨🏾‍🤝‍👨🏻", "👨🏾‍🤝‍👨🏼", "👨🏾‍🤝‍👨🏽", "👬🏾", "👨🏾‍🤝‍👨🏿", "👨🏿‍🤝‍👨🏻", "👨🏿‍🤝‍👨🏼", "👨🏿‍🤝‍👨🏽", "👨🏿‍🤝‍👨🏾", "👬🏿"],
    version: "1.0"
  }, {
    emoji: "💏",
    category: 1,
    name: "kiss",
    variations: ["👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩"],
    version: "1.0"
  }, {
    emoji: "💑",
    category: 1,
    name: "couple with heart",
    variations: ["👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩"],
    version: "1.0"
  }, {
    emoji: "👪",
    category: 1,
    name: "family",
    version: "1.0"
  }, {
    emoji: "👨‍👩‍👦",
    category: 1,
    name: "family: man, woman, boy",
    version: "2.0"
  }, {
    emoji: "👨‍👩‍👧",
    category: 1,
    name: "family: man, woman, girl",
    version: "2.0"
  }, {
    emoji: "👨‍👩‍👧‍👦",
    category: 1,
    name: "family: man, woman, girl, boy",
    version: "2.0"
  }, {
    emoji: "👨‍👩‍👦‍👦",
    category: 1,
    name: "family: man, woman, boy, boy",
    version: "2.0"
  }, {
    emoji: "👨‍👩‍👧‍👧",
    category: 1,
    name: "family: man, woman, girl, girl",
    version: "2.0"
  }, {
    emoji: "👨‍👨‍👦",
    category: 1,
    name: "family: man, man, boy",
    version: "2.0"
  }, {
    emoji: "👨‍👨‍👧",
    category: 1,
    name: "family: man, man, girl",
    version: "2.0"
  }, {
    emoji: "👨‍👨‍👧‍👦",
    category: 1,
    name: "family: man, man, girl, boy",
    version: "2.0"
  }, {
    emoji: "👨‍👨‍👦‍👦",
    category: 1,
    name: "family: man, man, boy, boy",
    version: "2.0"
  }, {
    emoji: "👨‍👨‍👧‍👧",
    category: 1,
    name: "family: man, man, girl, girl",
    version: "2.0"
  }, {
    emoji: "👩‍👩‍👦",
    category: 1,
    name: "family: woman, woman, boy",
    version: "2.0"
  }, {
    emoji: "👩‍👩‍👧",
    category: 1,
    name: "family: woman, woman, girl",
    version: "2.0"
  }, {
    emoji: "👩‍👩‍👧‍👦",
    category: 1,
    name: "family: woman, woman, girl, boy",
    version: "2.0"
  }, {
    emoji: "👩‍👩‍👦‍👦",
    category: 1,
    name: "family: woman, woman, boy, boy",
    version: "2.0"
  }, {
    emoji: "👩‍👩‍👧‍👧",
    category: 1,
    name: "family: woman, woman, girl, girl",
    version: "2.0"
  }, {
    emoji: "👨‍👦",
    category: 1,
    name: "family: man, boy",
    version: "4.0"
  }, {
    emoji: "👨‍👦‍👦",
    category: 1,
    name: "family: man, boy, boy",
    version: "4.0"
  }, {
    emoji: "👨‍👧",
    category: 1,
    name: "family: man, girl",
    version: "4.0"
  }, {
    emoji: "👨‍👧‍👦",
    category: 1,
    name: "family: man, girl, boy",
    version: "4.0"
  }, {
    emoji: "👨‍👧‍👧",
    category: 1,
    name: "family: man, girl, girl",
    version: "4.0"
  }, {
    emoji: "👩‍👦",
    category: 1,
    name: "family: woman, boy",
    version: "4.0"
  }, {
    emoji: "👩‍👦‍👦",
    category: 1,
    name: "family: woman, boy, boy",
    version: "4.0"
  }, {
    emoji: "👩‍👧",
    category: 1,
    name: "family: woman, girl",
    version: "4.0"
  }, {
    emoji: "👩‍👧‍👦",
    category: 1,
    name: "family: woman, girl, boy",
    version: "4.0"
  }, {
    emoji: "👩‍👧‍👧",
    category: 1,
    name: "family: woman, girl, girl",
    version: "4.0"
  }, {
    emoji: "🗣️",
    category: 1,
    name: "speaking head",
    version: "1.0"
  }, {
    emoji: "👤",
    category: 1,
    name: "bust in silhouette",
    version: "1.0"
  }, {
    emoji: "👥",
    category: 1,
    name: "busts in silhouette",
    version: "1.0"
  }, {
    emoji: "🫂",
    category: 1,
    name: "people hugging",
    version: "13.0"
  }, {
    emoji: "👣",
    category: 1,
    name: "footprints",
    version: "1.0"
  }, {
    emoji: "🐵",
    category: 2,
    name: "monkey face",
    version: "1.0"
  }, {
    emoji: "🐒",
    category: 2,
    name: "monkey",
    version: "1.0"
  }, {
    emoji: "🦍",
    category: 2,
    name: "gorilla",
    version: "3.0"
  }, {
    emoji: "🦧",
    category: 2,
    name: "orangutan",
    version: "12.0"
  }, {
    emoji: "🐶",
    category: 2,
    name: "dog face",
    version: "1.0"
  }, {
    emoji: "🐕",
    category: 2,
    name: "dog",
    version: "1.0"
  }, {
    emoji: "🦮",
    category: 2,
    name: "guide dog",
    version: "12.0"
  }, {
    emoji: "🐕‍🦺",
    category: 2,
    name: "service dog",
    version: "12.0"
  }, {
    emoji: "🐩",
    category: 2,
    name: "poodle",
    version: "1.0"
  }, {
    emoji: "🐺",
    category: 2,
    name: "wolf",
    version: "1.0"
  }, {
    emoji: "🦊",
    category: 2,
    name: "fox",
    version: "3.0"
  }, {
    emoji: "🦝",
    category: 2,
    name: "raccoon",
    version: "11.0"
  }, {
    emoji: "🐱",
    category: 2,
    name: "cat face",
    version: "1.0"
  }, {
    emoji: "🐈",
    category: 2,
    name: "cat",
    version: "1.0"
  }, {
    emoji: "🐈‍⬛",
    category: 2,
    name: "black cat",
    version: "13.0"
  }, {
    emoji: "🦁",
    category: 2,
    name: "lion",
    version: "1.0"
  }, {
    emoji: "🐯",
    category: 2,
    name: "tiger face",
    version: "1.0"
  }, {
    emoji: "🐅",
    category: 2,
    name: "tiger",
    version: "1.0"
  }, {
    emoji: "🐆",
    category: 2,
    name: "leopard",
    version: "1.0"
  }, {
    emoji: "🐴",
    category: 2,
    name: "horse face",
    version: "1.0"
  }, {
    emoji: "🐎",
    category: 2,
    name: "horse",
    version: "1.0"
  }, {
    emoji: "🦄",
    category: 2,
    name: "unicorn",
    version: "1.0"
  }, {
    emoji: "🦓",
    category: 2,
    name: "zebra",
    version: "5.0"
  }, {
    emoji: "🦌",
    category: 2,
    name: "deer",
    version: "3.0"
  }, {
    emoji: "🦬",
    category: 2,
    name: "bison",
    version: "13.0"
  }, {
    emoji: "🐮",
    category: 2,
    name: "cow face",
    version: "1.0"
  }, {
    emoji: "🐂",
    category: 2,
    name: "ox",
    version: "1.0"
  }, {
    emoji: "🐃",
    category: 2,
    name: "water buffalo",
    version: "1.0"
  }, {
    emoji: "🐄",
    category: 2,
    name: "cow",
    version: "1.0"
  }, {
    emoji: "🐷",
    category: 2,
    name: "pig face",
    version: "1.0"
  }, {
    emoji: "🐖",
    category: 2,
    name: "pig",
    version: "1.0"
  }, {
    emoji: "🐗",
    category: 2,
    name: "boar",
    version: "1.0"
  }, {
    emoji: "🐽",
    category: 2,
    name: "pig nose",
    version: "1.0"
  }, {
    emoji: "🐏",
    category: 2,
    name: "ram",
    version: "1.0"
  }, {
    emoji: "🐑",
    category: 2,
    name: "ewe",
    version: "1.0"
  }, {
    emoji: "🐐",
    category: 2,
    name: "goat",
    version: "1.0"
  }, {
    emoji: "🐪",
    category: 2,
    name: "camel",
    version: "1.0"
  }, {
    emoji: "🐫",
    category: 2,
    name: "two-hump camel",
    version: "1.0"
  }, {
    emoji: "🦙",
    category: 2,
    name: "llama",
    version: "11.0"
  }, {
    emoji: "🦒",
    category: 2,
    name: "giraffe",
    version: "5.0"
  }, {
    emoji: "🐘",
    category: 2,
    name: "elephant",
    version: "1.0"
  }, {
    emoji: "🦣",
    category: 2,
    name: "mammoth",
    version: "13.0"
  }, {
    emoji: "🦏",
    category: 2,
    name: "rhinoceros",
    version: "3.0"
  }, {
    emoji: "🦛",
    category: 2,
    name: "hippopotamus",
    version: "11.0"
  }, {
    emoji: "🐭",
    category: 2,
    name: "mouse face",
    version: "1.0"
  }, {
    emoji: "🐁",
    category: 2,
    name: "mouse",
    version: "1.0"
  }, {
    emoji: "🐀",
    category: 2,
    name: "rat",
    version: "1.0"
  }, {
    emoji: "🐹",
    category: 2,
    name: "hamster",
    version: "1.0"
  }, {
    emoji: "🐰",
    category: 2,
    name: "rabbit face",
    version: "1.0"
  }, {
    emoji: "🐇",
    category: 2,
    name: "rabbit",
    version: "1.0"
  }, {
    emoji: "🐿️",
    category: 2,
    name: "chipmunk",
    version: "1.0"
  }, {
    emoji: "🦫",
    category: 2,
    name: "beaver",
    version: "13.0"
  }, {
    emoji: "🦔",
    category: 2,
    name: "hedgehog",
    version: "5.0"
  }, {
    emoji: "🦇",
    category: 2,
    name: "bat",
    version: "3.0"
  }, {
    emoji: "🐻",
    category: 2,
    name: "bear",
    version: "1.0"
  }, {
    emoji: "🐻‍❄️",
    category: 2,
    name: "polar bear",
    version: "13.0"
  }, {
    emoji: "🐨",
    category: 2,
    name: "koala",
    version: "1.0"
  }, {
    emoji: "🐼",
    category: 2,
    name: "panda",
    version: "1.0"
  }, {
    emoji: "🦥",
    category: 2,
    name: "sloth",
    version: "12.0"
  }, {
    emoji: "🦦",
    category: 2,
    name: "otter",
    version: "12.0"
  }, {
    emoji: "🦨",
    category: 2,
    name: "skunk",
    version: "12.0"
  }, {
    emoji: "🦘",
    category: 2,
    name: "kangaroo",
    version: "11.0"
  }, {
    emoji: "🦡",
    category: 2,
    name: "badger",
    version: "11.0"
  }, {
    emoji: "🐾",
    category: 2,
    name: "paw prints",
    version: "1.0"
  }, {
    emoji: "🦃",
    category: 2,
    name: "turkey",
    version: "1.0"
  }, {
    emoji: "🐔",
    category: 2,
    name: "chicken",
    version: "1.0"
  }, {
    emoji: "🐓",
    category: 2,
    name: "rooster",
    version: "1.0"
  }, {
    emoji: "🐣",
    category: 2,
    name: "hatching chick",
    version: "1.0"
  }, {
    emoji: "🐤",
    category: 2,
    name: "baby chick",
    version: "1.0"
  }, {
    emoji: "🐥",
    category: 2,
    name: "front-facing baby chick",
    version: "1.0"
  }, {
    emoji: "🐦",
    category: 2,
    name: "bird",
    version: "1.0"
  }, {
    emoji: "🐧",
    category: 2,
    name: "penguin",
    version: "1.0"
  }, {
    emoji: "🕊️",
    category: 2,
    name: "dove",
    version: "1.0"
  }, {
    emoji: "🦅",
    category: 2,
    name: "eagle",
    version: "3.0"
  }, {
    emoji: "🦆",
    category: 2,
    name: "duck",
    version: "3.0"
  }, {
    emoji: "🦢",
    category: 2,
    name: "swan",
    version: "11.0"
  }, {
    emoji: "🦉",
    category: 2,
    name: "owl",
    version: "3.0"
  }, {
    emoji: "🦤",
    category: 2,
    name: "dodo",
    version: "13.0"
  }, {
    emoji: "🪶",
    category: 2,
    name: "feather",
    version: "13.0"
  }, {
    emoji: "🦩",
    category: 2,
    name: "flamingo",
    version: "12.0"
  }, {
    emoji: "🦚",
    category: 2,
    name: "peacock",
    version: "11.0"
  }, {
    emoji: "🦜",
    category: 2,
    name: "parrot",
    version: "11.0"
  }, {
    emoji: "🐸",
    category: 2,
    name: "frog",
    version: "1.0"
  }, {
    emoji: "🐊",
    category: 2,
    name: "crocodile",
    version: "1.0"
  }, {
    emoji: "🐢",
    category: 2,
    name: "turtle",
    version: "1.0"
  }, {
    emoji: "🦎",
    category: 2,
    name: "lizard",
    version: "3.0"
  }, {
    emoji: "🐍",
    category: 2,
    name: "snake",
    version: "1.0"
  }, {
    emoji: "🐲",
    category: 2,
    name: "dragon face",
    version: "1.0"
  }, {
    emoji: "🐉",
    category: 2,
    name: "dragon",
    version: "1.0"
  }, {
    emoji: "🦕",
    category: 2,
    name: "sauropod",
    version: "5.0"
  }, {
    emoji: "🦖",
    category: 2,
    name: "T-Rex",
    version: "5.0"
  }, {
    emoji: "🐳",
    category: 2,
    name: "spouting whale",
    version: "1.0"
  }, {
    emoji: "🐋",
    category: 2,
    name: "whale",
    version: "1.0"
  }, {
    emoji: "🐬",
    category: 2,
    name: "dolphin",
    version: "1.0"
  }, {
    emoji: "🦭",
    category: 2,
    name: "seal",
    version: "13.0"
  }, {
    emoji: "🐟",
    category: 2,
    name: "fish",
    version: "1.0"
  }, {
    emoji: "🐠",
    category: 2,
    name: "tropical fish",
    version: "1.0"
  }, {
    emoji: "🐡",
    category: 2,
    name: "blowfish",
    version: "1.0"
  }, {
    emoji: "🦈",
    category: 2,
    name: "shark",
    version: "3.0"
  }, {
    emoji: "🐙",
    category: 2,
    name: "octopus",
    version: "1.0"
  }, {
    emoji: "🐚",
    category: 2,
    name: "spiral shell",
    version: "1.0"
  }, {
    emoji: "🐌",
    category: 2,
    name: "snail",
    version: "1.0"
  }, {
    emoji: "🦋",
    category: 2,
    name: "butterfly",
    version: "3.0"
  }, {
    emoji: "🐛",
    category: 2,
    name: "bug",
    version: "1.0"
  }, {
    emoji: "🐜",
    category: 2,
    name: "ant",
    version: "1.0"
  }, {
    emoji: "🐝",
    category: 2,
    name: "honeybee",
    version: "1.0"
  }, {
    emoji: "🪲",
    category: 2,
    name: "beetle",
    version: "13.0"
  }, {
    emoji: "🐞",
    category: 2,
    name: "lady beetle",
    version: "1.0"
  }, {
    emoji: "🦗",
    category: 2,
    name: "cricket",
    version: "5.0"
  }, {
    emoji: "🪳",
    category: 2,
    name: "cockroach",
    version: "13.0"
  }, {
    emoji: "🕷️",
    category: 2,
    name: "spider",
    version: "1.0"
  }, {
    emoji: "🕸️",
    category: 2,
    name: "spider web",
    version: "1.0"
  }, {
    emoji: "🦂",
    category: 2,
    name: "scorpion",
    version: "1.0"
  }, {
    emoji: "🦟",
    category: 2,
    name: "mosquito",
    version: "11.0"
  }, {
    emoji: "🪰",
    category: 2,
    name: "fly",
    version: "13.0"
  }, {
    emoji: "🪱",
    category: 2,
    name: "worm",
    version: "13.0"
  }, {
    emoji: "🦠",
    category: 2,
    name: "microbe",
    version: "11.0"
  }, {
    emoji: "💐",
    category: 2,
    name: "bouquet",
    version: "1.0"
  }, {
    emoji: "🌸",
    category: 2,
    name: "cherry blossom",
    version: "1.0"
  }, {
    emoji: "💮",
    category: 2,
    name: "white flower",
    version: "1.0"
  }, {
    emoji: "🏵️",
    category: 2,
    name: "rosette",
    version: "1.0"
  }, {
    emoji: "🌹",
    category: 2,
    name: "rose",
    version: "1.0"
  }, {
    emoji: "🥀",
    category: 2,
    name: "wilted flower",
    version: "3.0"
  }, {
    emoji: "🌺",
    category: 2,
    name: "hibiscus",
    version: "1.0"
  }, {
    emoji: "🌻",
    category: 2,
    name: "sunflower",
    version: "1.0"
  }, {
    emoji: "🌼",
    category: 2,
    name: "blossom",
    version: "1.0"
  }, {
    emoji: "🌷",
    category: 2,
    name: "tulip",
    version: "1.0"
  }, {
    emoji: "🌱",
    category: 2,
    name: "seedling",
    version: "1.0"
  }, {
    emoji: "🪴",
    category: 2,
    name: "potted plant",
    version: "13.0"
  }, {
    emoji: "🌲",
    category: 2,
    name: "evergreen tree",
    version: "1.0"
  }, {
    emoji: "🌳",
    category: 2,
    name: "deciduous tree",
    version: "1.0"
  }, {
    emoji: "🌴",
    category: 2,
    name: "palm tree",
    version: "1.0"
  }, {
    emoji: "🌵",
    category: 2,
    name: "cactus",
    version: "1.0"
  }, {
    emoji: "🌾",
    category: 2,
    name: "sheaf of rice",
    version: "1.0"
  }, {
    emoji: "🌿",
    category: 2,
    name: "herb",
    version: "1.0"
  }, {
    emoji: "☘️",
    category: 2,
    name: "shamrock",
    version: "1.0"
  }, {
    emoji: "🍀",
    category: 2,
    name: "four leaf clover",
    version: "1.0"
  }, {
    emoji: "🍁",
    category: 2,
    name: "maple leaf",
    version: "1.0"
  }, {
    emoji: "🍂",
    category: 2,
    name: "fallen leaf",
    version: "1.0"
  }, {
    emoji: "🍃",
    category: 2,
    name: "leaf fluttering in wind",
    version: "1.0"
  }, {
    emoji: "🍇",
    category: 3,
    name: "grapes",
    version: "1.0"
  }, {
    emoji: "🍈",
    category: 3,
    name: "melon",
    version: "1.0"
  }, {
    emoji: "🍉",
    category: 3,
    name: "watermelon",
    version: "1.0"
  }, {
    emoji: "🍊",
    category: 3,
    name: "tangerine",
    version: "1.0"
  }, {
    emoji: "🍋",
    category: 3,
    name: "lemon",
    version: "1.0"
  }, {
    emoji: "🍌",
    category: 3,
    name: "banana",
    version: "1.0"
  }, {
    emoji: "🍍",
    category: 3,
    name: "pineapple",
    version: "1.0"
  }, {
    emoji: "🥭",
    category: 3,
    name: "mango",
    version: "11.0"
  }, {
    emoji: "🍎",
    category: 3,
    name: "red apple",
    version: "1.0"
  }, {
    emoji: "🍏",
    category: 3,
    name: "green apple",
    version: "1.0"
  }, {
    emoji: "🍐",
    category: 3,
    name: "pear",
    version: "1.0"
  }, {
    emoji: "🍑",
    category: 3,
    name: "peach",
    version: "1.0"
  }, {
    emoji: "🍒",
    category: 3,
    name: "cherries",
    version: "1.0"
  }, {
    emoji: "🍓",
    category: 3,
    name: "strawberry",
    version: "1.0"
  }, {
    emoji: "🫐",
    category: 3,
    name: "blueberries",
    version: "13.0"
  }, {
    emoji: "🥝",
    category: 3,
    name: "kiwi fruit",
    version: "3.0"
  }, {
    emoji: "🍅",
    category: 3,
    name: "tomato",
    version: "1.0"
  }, {
    emoji: "🫒",
    category: 3,
    name: "olive",
    version: "13.0"
  }, {
    emoji: "🥥",
    category: 3,
    name: "coconut",
    version: "5.0"
  }, {
    emoji: "🥑",
    category: 3,
    name: "avocado",
    version: "3.0"
  }, {
    emoji: "🍆",
    category: 3,
    name: "eggplant",
    version: "1.0"
  }, {
    emoji: "🥔",
    category: 3,
    name: "potato",
    version: "3.0"
  }, {
    emoji: "🥕",
    category: 3,
    name: "carrot",
    version: "3.0"
  }, {
    emoji: "🌽",
    category: 3,
    name: "ear of corn",
    version: "1.0"
  }, {
    emoji: "🌶️",
    category: 3,
    name: "hot pepper",
    version: "1.0"
  }, {
    emoji: "🫑",
    category: 3,
    name: "bell pepper",
    version: "13.0"
  }, {
    emoji: "🥒",
    category: 3,
    name: "cucumber",
    version: "3.0"
  }, {
    emoji: "🥬",
    category: 3,
    name: "leafy green",
    version: "11.0"
  }, {
    emoji: "🥦",
    category: 3,
    name: "broccoli",
    version: "5.0"
  }, {
    emoji: "🧄",
    category: 3,
    name: "garlic",
    version: "12.0"
  }, {
    emoji: "🧅",
    category: 3,
    name: "onion",
    version: "12.0"
  }, {
    emoji: "🍄",
    category: 3,
    name: "mushroom",
    version: "1.0"
  }, {
    emoji: "🥜",
    category: 3,
    name: "peanuts",
    version: "3.0"
  }, {
    emoji: "🌰",
    category: 3,
    name: "chestnut",
    version: "1.0"
  }, {
    emoji: "🍞",
    category: 3,
    name: "bread",
    version: "1.0"
  }, {
    emoji: "🥐",
    category: 3,
    name: "croissant",
    version: "3.0"
  }, {
    emoji: "🥖",
    category: 3,
    name: "baguette bread",
    version: "3.0"
  }, {
    emoji: "🫓",
    category: 3,
    name: "flatbread",
    version: "13.0"
  }, {
    emoji: "🥨",
    category: 3,
    name: "pretzel",
    version: "5.0"
  }, {
    emoji: "🥯",
    category: 3,
    name: "bagel",
    version: "11.0"
  }, {
    emoji: "🥞",
    category: 3,
    name: "pancakes",
    version: "3.0"
  }, {
    emoji: "🧇",
    category: 3,
    name: "waffle",
    version: "12.0"
  }, {
    emoji: "🧀",
    category: 3,
    name: "cheese wedge",
    version: "1.0"
  }, {
    emoji: "🍖",
    category: 3,
    name: "meat on bone",
    version: "1.0"
  }, {
    emoji: "🍗",
    category: 3,
    name: "poultry leg",
    version: "1.0"
  }, {
    emoji: "🥩",
    category: 3,
    name: "cut of meat",
    version: "5.0"
  }, {
    emoji: "🥓",
    category: 3,
    name: "bacon",
    version: "3.0"
  }, {
    emoji: "🍔",
    category: 3,
    name: "hamburger",
    version: "1.0"
  }, {
    emoji: "🍟",
    category: 3,
    name: "french fries",
    version: "1.0"
  }, {
    emoji: "🍕",
    category: 3,
    name: "pizza",
    version: "1.0"
  }, {
    emoji: "🌭",
    category: 3,
    name: "hot dog",
    version: "1.0"
  }, {
    emoji: "🥪",
    category: 3,
    name: "sandwich",
    version: "5.0"
  }, {
    emoji: "🌮",
    category: 3,
    name: "taco",
    version: "1.0"
  }, {
    emoji: "🌯",
    category: 3,
    name: "burrito",
    version: "1.0"
  }, {
    emoji: "🫔",
    category: 3,
    name: "tamale",
    version: "13.0"
  }, {
    emoji: "🥙",
    category: 3,
    name: "stuffed flatbread",
    version: "3.0"
  }, {
    emoji: "🧆",
    category: 3,
    name: "falafel",
    version: "12.0"
  }, {
    emoji: "🥚",
    category: 3,
    name: "egg",
    version: "3.0"
  }, {
    emoji: "🍳",
    category: 3,
    name: "cooking",
    version: "1.0"
  }, {
    emoji: "🥘",
    category: 3,
    name: "shallow pan of food",
    version: "3.0"
  }, {
    emoji: "🍲",
    category: 3,
    name: "pot of food",
    version: "1.0"
  }, {
    emoji: "🫕",
    category: 3,
    name: "fondue",
    version: "13.0"
  }, {
    emoji: "🥣",
    category: 3,
    name: "bowl with spoon",
    version: "5.0"
  }, {
    emoji: "🥗",
    category: 3,
    name: "green salad",
    version: "3.0"
  }, {
    emoji: "🍿",
    category: 3,
    name: "popcorn",
    version: "1.0"
  }, {
    emoji: "🧈",
    category: 3,
    name: "butter",
    version: "12.0"
  }, {
    emoji: "🧂",
    category: 3,
    name: "salt",
    version: "11.0"
  }, {
    emoji: "🥫",
    category: 3,
    name: "canned food",
    version: "5.0"
  }, {
    emoji: "🍱",
    category: 3,
    name: "bento box",
    version: "1.0"
  }, {
    emoji: "🍘",
    category: 3,
    name: "rice cracker",
    version: "1.0"
  }, {
    emoji: "🍙",
    category: 3,
    name: "rice ball",
    version: "1.0"
  }, {
    emoji: "🍚",
    category: 3,
    name: "cooked rice",
    version: "1.0"
  }, {
    emoji: "🍛",
    category: 3,
    name: "curry rice",
    version: "1.0"
  }, {
    emoji: "🍜",
    category: 3,
    name: "steaming bowl",
    version: "1.0"
  }, {
    emoji: "🍝",
    category: 3,
    name: "spaghetti",
    version: "1.0"
  }, {
    emoji: "🍠",
    category: 3,
    name: "roasted sweet potato",
    version: "1.0"
  }, {
    emoji: "🍢",
    category: 3,
    name: "oden",
    version: "1.0"
  }, {
    emoji: "🍣",
    category: 3,
    name: "sushi",
    version: "1.0"
  }, {
    emoji: "🍤",
    category: 3,
    name: "fried shrimp",
    version: "1.0"
  }, {
    emoji: "🍥",
    category: 3,
    name: "fish cake with swirl",
    version: "1.0"
  }, {
    emoji: "🥮",
    category: 3,
    name: "moon cake",
    version: "11.0"
  }, {
    emoji: "🍡",
    category: 3,
    name: "dango",
    version: "1.0"
  }, {
    emoji: "🥟",
    category: 3,
    name: "dumpling",
    version: "5.0"
  }, {
    emoji: "🥠",
    category: 3,
    name: "fortune cookie",
    version: "5.0"
  }, {
    emoji: "🥡",
    category: 3,
    name: "takeout box",
    version: "5.0"
  }, {
    emoji: "🦀",
    category: 3,
    name: "crab",
    version: "1.0"
  }, {
    emoji: "🦞",
    category: 3,
    name: "lobster",
    version: "11.0"
  }, {
    emoji: "🦐",
    category: 3,
    name: "shrimp",
    version: "3.0"
  }, {
    emoji: "🦑",
    category: 3,
    name: "squid",
    version: "3.0"
  }, {
    emoji: "🦪",
    category: 3,
    name: "oyster",
    version: "12.0"
  }, {
    emoji: "🍦",
    category: 3,
    name: "soft ice cream",
    version: "1.0"
  }, {
    emoji: "🍧",
    category: 3,
    name: "shaved ice",
    version: "1.0"
  }, {
    emoji: "🍨",
    category: 3,
    name: "ice cream",
    version: "1.0"
  }, {
    emoji: "🍩",
    category: 3,
    name: "doughnut",
    version: "1.0"
  }, {
    emoji: "🍪",
    category: 3,
    name: "cookie",
    version: "1.0"
  }, {
    emoji: "🎂",
    category: 3,
    name: "birthday cake",
    version: "1.0"
  }, {
    emoji: "🍰",
    category: 3,
    name: "shortcake",
    version: "1.0"
  }, {
    emoji: "🧁",
    category: 3,
    name: "cupcake",
    version: "11.0"
  }, {
    emoji: "🥧",
    category: 3,
    name: "pie",
    version: "5.0"
  }, {
    emoji: "🍫",
    category: 3,
    name: "chocolate bar",
    version: "1.0"
  }, {
    emoji: "🍬",
    category: 3,
    name: "candy",
    version: "1.0"
  }, {
    emoji: "🍭",
    category: 3,
    name: "lollipop",
    version: "1.0"
  }, {
    emoji: "🍮",
    category: 3,
    name: "custard",
    version: "1.0"
  }, {
    emoji: "🍯",
    category: 3,
    name: "honey pot",
    version: "1.0"
  }, {
    emoji: "🍼",
    category: 3,
    name: "baby bottle",
    version: "1.0"
  }, {
    emoji: "🥛",
    category: 3,
    name: "glass of milk",
    version: "3.0"
  }, {
    emoji: "☕",
    category: 3,
    name: "hot beverage",
    version: "1.0"
  }, {
    emoji: "🫖",
    category: 3,
    name: "teapot",
    version: "13.0"
  }, {
    emoji: "🍵",
    category: 3,
    name: "teacup without handle",
    version: "1.0"
  }, {
    emoji: "🍶",
    category: 3,
    name: "sake",
    version: "1.0"
  }, {
    emoji: "🍾",
    category: 3,
    name: "bottle with popping cork",
    version: "1.0"
  }, {
    emoji: "🍷",
    category: 3,
    name: "wine glass",
    version: "1.0"
  }, {
    emoji: "🍸",
    category: 3,
    name: "cocktail glass",
    version: "1.0"
  }, {
    emoji: "🍹",
    category: 3,
    name: "tropical drink",
    version: "1.0"
  }, {
    emoji: "🍺",
    category: 3,
    name: "beer mug",
    version: "1.0"
  }, {
    emoji: "🍻",
    category: 3,
    name: "clinking beer mugs",
    version: "1.0"
  }, {
    emoji: "🥂",
    category: 3,
    name: "clinking glasses",
    version: "3.0"
  }, {
    emoji: "🥃",
    category: 3,
    name: "tumbler glass",
    version: "3.0"
  }, {
    emoji: "🥤",
    category: 3,
    name: "cup with straw",
    version: "5.0"
  }, {
    emoji: "🧋",
    category: 3,
    name: "bubble tea",
    version: "13.0"
  }, {
    emoji: "🧃",
    category: 3,
    name: "beverage box",
    version: "12.0"
  }, {
    emoji: "🧉",
    category: 3,
    name: "mate",
    version: "12.0"
  }, {
    emoji: "🧊",
    category: 3,
    name: "ice",
    version: "12.0"
  }, {
    emoji: "🥢",
    category: 3,
    name: "chopsticks",
    version: "5.0"
  }, {
    emoji: "🍽️",
    category: 3,
    name: "fork and knife with plate",
    version: "1.0"
  }, {
    emoji: "🍴",
    category: 3,
    name: "fork and knife",
    version: "1.0"
  }, {
    emoji: "🥄",
    category: 3,
    name: "spoon",
    version: "3.0"
  }, {
    emoji: "🔪",
    category: 3,
    name: "kitchen knife",
    version: "1.0"
  }, {
    emoji: "🏺",
    category: 3,
    name: "amphora",
    version: "1.0"
  }, {
    emoji: "🌍",
    category: 4,
    name: "globe showing Europe-Africa",
    version: "1.0"
  }, {
    emoji: "🌎",
    category: 4,
    name: "globe showing Americas",
    version: "1.0"
  }, {
    emoji: "🌏",
    category: 4,
    name: "globe showing Asia-Australia",
    version: "1.0"
  }, {
    emoji: "🌐",
    category: 4,
    name: "globe with meridians",
    version: "1.0"
  }, {
    emoji: "🗺️",
    category: 4,
    name: "world map",
    version: "1.0"
  }, {
    emoji: "🗾",
    category: 4,
    name: "map of Japan",
    version: "1.0"
  }, {
    emoji: "🧭",
    category: 4,
    name: "compass",
    version: "11.0"
  }, {
    emoji: "🏔️",
    category: 4,
    name: "snow-capped mountain",
    version: "1.0"
  }, {
    emoji: "⛰️",
    category: 4,
    name: "mountain",
    version: "1.0"
  }, {
    emoji: "🌋",
    category: 4,
    name: "volcano",
    version: "1.0"
  }, {
    emoji: "🗻",
    category: 4,
    name: "mount fuji",
    version: "1.0"
  }, {
    emoji: "🏕️",
    category: 4,
    name: "camping",
    version: "1.0"
  }, {
    emoji: "🏖️",
    category: 4,
    name: "beach with umbrella",
    version: "1.0"
  }, {
    emoji: "🏜️",
    category: 4,
    name: "desert",
    version: "1.0"
  }, {
    emoji: "🏝️",
    category: 4,
    name: "desert island",
    version: "1.0"
  }, {
    emoji: "🏞️",
    category: 4,
    name: "national park",
    version: "1.0"
  }, {
    emoji: "🏟️",
    category: 4,
    name: "stadium",
    version: "1.0"
  }, {
    emoji: "🏛️",
    category: 4,
    name: "classical building",
    version: "1.0"
  }, {
    emoji: "🏗️",
    category: 4,
    name: "building construction",
    version: "1.0"
  }, {
    emoji: "🧱",
    category: 4,
    name: "brick",
    version: "11.0"
  }, {
    emoji: "🪨",
    category: 4,
    name: "rock",
    version: "13.0"
  }, {
    emoji: "🪵",
    category: 4,
    name: "wood",
    version: "13.0"
  }, {
    emoji: "🛖",
    category: 4,
    name: "hut",
    version: "13.0"
  }, {
    emoji: "🏘️",
    category: 4,
    name: "houses",
    version: "1.0"
  }, {
    emoji: "🏚️",
    category: 4,
    name: "derelict house",
    version: "1.0"
  }, {
    emoji: "🏠",
    category: 4,
    name: "house",
    version: "1.0"
  }, {
    emoji: "🏡",
    category: 4,
    name: "house with garden",
    version: "1.0"
  }, {
    emoji: "🏢",
    category: 4,
    name: "office building",
    version: "1.0"
  }, {
    emoji: "🏣",
    category: 4,
    name: "Japanese post office",
    version: "1.0"
  }, {
    emoji: "🏤",
    category: 4,
    name: "post office",
    version: "1.0"
  }, {
    emoji: "🏥",
    category: 4,
    name: "hospital",
    version: "1.0"
  }, {
    emoji: "🏦",
    category: 4,
    name: "bank",
    version: "1.0"
  }, {
    emoji: "🏨",
    category: 4,
    name: "hotel",
    version: "1.0"
  }, {
    emoji: "🏩",
    category: 4,
    name: "love hotel",
    version: "1.0"
  }, {
    emoji: "🏪",
    category: 4,
    name: "convenience store",
    version: "1.0"
  }, {
    emoji: "🏫",
    category: 4,
    name: "school",
    version: "1.0"
  }, {
    emoji: "🏬",
    category: 4,
    name: "department store",
    version: "1.0"
  }, {
    emoji: "🏭",
    category: 4,
    name: "factory",
    version: "1.0"
  }, {
    emoji: "🏯",
    category: 4,
    name: "Japanese castle",
    version: "1.0"
  }, {
    emoji: "🏰",
    category: 4,
    name: "castle",
    version: "1.0"
  }, {
    emoji: "💒",
    category: 4,
    name: "wedding",
    version: "1.0"
  }, {
    emoji: "🗼",
    category: 4,
    name: "Tokyo tower",
    version: "1.0"
  }, {
    emoji: "🗽",
    category: 4,
    name: "Statue of Liberty",
    version: "1.0"
  }, {
    emoji: "⛪",
    category: 4,
    name: "church",
    version: "1.0"
  }, {
    emoji: "🕌",
    category: 4,
    name: "mosque",
    version: "1.0"
  }, {
    emoji: "🛕",
    category: 4,
    name: "hindu temple",
    version: "12.0"
  }, {
    emoji: "🕍",
    category: 4,
    name: "synagogue",
    version: "1.0"
  }, {
    emoji: "⛩️",
    category: 4,
    name: "shinto shrine",
    version: "1.0"
  }, {
    emoji: "🕋",
    category: 4,
    name: "kaaba",
    version: "1.0"
  }, {
    emoji: "⛲",
    category: 4,
    name: "fountain",
    version: "1.0"
  }, {
    emoji: "⛺",
    category: 4,
    name: "tent",
    version: "1.0"
  }, {
    emoji: "🌁",
    category: 4,
    name: "foggy",
    version: "1.0"
  }, {
    emoji: "🌃",
    category: 4,
    name: "night with stars",
    version: "1.0"
  }, {
    emoji: "🏙️",
    category: 4,
    name: "cityscape",
    version: "1.0"
  }, {
    emoji: "🌄",
    category: 4,
    name: "sunrise over mountains",
    version: "1.0"
  }, {
    emoji: "🌅",
    category: 4,
    name: "sunrise",
    version: "1.0"
  }, {
    emoji: "🌆",
    category: 4,
    name: "cityscape at dusk",
    version: "1.0"
  }, {
    emoji: "🌇",
    category: 4,
    name: "sunset",
    version: "1.0"
  }, {
    emoji: "🌉",
    category: 4,
    name: "bridge at night",
    version: "1.0"
  }, {
    emoji: "♨️",
    category: 4,
    name: "hot springs",
    version: "1.0"
  }, {
    emoji: "🎠",
    category: 4,
    name: "carousel horse",
    version: "1.0"
  }, {
    emoji: "🎡",
    category: 4,
    name: "ferris wheel",
    version: "1.0"
  }, {
    emoji: "🎢",
    category: 4,
    name: "roller coaster",
    version: "1.0"
  }, {
    emoji: "💈",
    category: 4,
    name: "barber pole",
    version: "1.0"
  }, {
    emoji: "🎪",
    category: 4,
    name: "circus tent",
    version: "1.0"
  }, {
    emoji: "🚂",
    category: 4,
    name: "locomotive",
    version: "1.0"
  }, {
    emoji: "🚃",
    category: 4,
    name: "railway car",
    version: "1.0"
  }, {
    emoji: "🚄",
    category: 4,
    name: "high-speed train",
    version: "1.0"
  }, {
    emoji: "🚅",
    category: 4,
    name: "bullet train",
    version: "1.0"
  }, {
    emoji: "🚆",
    category: 4,
    name: "train",
    version: "1.0"
  }, {
    emoji: "🚇",
    category: 4,
    name: "metro",
    version: "1.0"
  }, {
    emoji: "🚈",
    category: 4,
    name: "light rail",
    version: "1.0"
  }, {
    emoji: "🚉",
    category: 4,
    name: "station",
    version: "1.0"
  }, {
    emoji: "🚊",
    category: 4,
    name: "tram",
    version: "1.0"
  }, {
    emoji: "🚝",
    category: 4,
    name: "monorail",
    version: "1.0"
  }, {
    emoji: "🚞",
    category: 4,
    name: "mountain railway",
    version: "1.0"
  }, {
    emoji: "🚋",
    category: 4,
    name: "tram car",
    version: "1.0"
  }, {
    emoji: "🚌",
    category: 4,
    name: "bus",
    version: "1.0"
  }, {
    emoji: "🚍",
    category: 4,
    name: "oncoming bus",
    version: "1.0"
  }, {
    emoji: "🚎",
    category: 4,
    name: "trolleybus",
    version: "1.0"
  }, {
    emoji: "🚐",
    category: 4,
    name: "minibus",
    version: "1.0"
  }, {
    emoji: "🚑",
    category: 4,
    name: "ambulance",
    version: "1.0"
  }, {
    emoji: "🚒",
    category: 4,
    name: "fire engine",
    version: "1.0"
  }, {
    emoji: "🚓",
    category: 4,
    name: "police car",
    version: "1.0"
  }, {
    emoji: "🚔",
    category: 4,
    name: "oncoming police car",
    version: "1.0"
  }, {
    emoji: "🚕",
    category: 4,
    name: "taxi",
    version: "1.0"
  }, {
    emoji: "🚖",
    category: 4,
    name: "oncoming taxi",
    version: "1.0"
  }, {
    emoji: "🚗",
    category: 4,
    name: "automobile",
    version: "1.0"
  }, {
    emoji: "🚘",
    category: 4,
    name: "oncoming automobile",
    version: "1.0"
  }, {
    emoji: "🚙",
    category: 4,
    name: "sport utility vehicle",
    version: "1.0"
  }, {
    emoji: "🛻",
    category: 4,
    name: "pickup truck",
    version: "13.0"
  }, {
    emoji: "🚚",
    category: 4,
    name: "delivery truck",
    version: "1.0"
  }, {
    emoji: "🚛",
    category: 4,
    name: "articulated lorry",
    version: "1.0"
  }, {
    emoji: "🚜",
    category: 4,
    name: "tractor",
    version: "1.0"
  }, {
    emoji: "🏎️",
    category: 4,
    name: "racing car",
    version: "1.0"
  }, {
    emoji: "🏍️",
    category: 4,
    name: "motorcycle",
    version: "1.0"
  }, {
    emoji: "🛵",
    category: 4,
    name: "motor scooter",
    version: "3.0"
  }, {
    emoji: "🦽",
    category: 4,
    name: "manual wheelchair",
    version: "12.0"
  }, {
    emoji: "🦼",
    category: 4,
    name: "motorized wheelchair",
    version: "12.0"
  }, {
    emoji: "🛺",
    category: 4,
    name: "auto rickshaw",
    version: "12.0"
  }, {
    emoji: "🚲",
    category: 4,
    name: "bicycle",
    version: "1.0"
  }, {
    emoji: "🛴",
    category: 4,
    name: "kick scooter",
    version: "3.0"
  }, {
    emoji: "🛹",
    category: 4,
    name: "skateboard",
    version: "11.0"
  }, {
    emoji: "🛼",
    category: 4,
    name: "roller skate",
    version: "13.0"
  }, {
    emoji: "🚏",
    category: 4,
    name: "bus stop",
    version: "1.0"
  }, {
    emoji: "🛣️",
    category: 4,
    name: "motorway",
    version: "1.0"
  }, {
    emoji: "🛤️",
    category: 4,
    name: "railway track",
    version: "1.0"
  }, {
    emoji: "🛢️",
    category: 4,
    name: "oil drum",
    version: "1.0"
  }, {
    emoji: "⛽",
    category: 4,
    name: "fuel pump",
    version: "1.0"
  }, {
    emoji: "🚨",
    category: 4,
    name: "police car light",
    version: "1.0"
  }, {
    emoji: "🚥",
    category: 4,
    name: "horizontal traffic light",
    version: "1.0"
  }, {
    emoji: "🚦",
    category: 4,
    name: "vertical traffic light",
    version: "1.0"
  }, {
    emoji: "🛑",
    category: 4,
    name: "stop sign",
    version: "3.0"
  }, {
    emoji: "🚧",
    category: 4,
    name: "construction",
    version: "1.0"
  }, {
    emoji: "⚓",
    category: 4,
    name: "anchor",
    version: "1.0"
  }, {
    emoji: "⛵",
    category: 4,
    name: "sailboat",
    version: "1.0"
  }, {
    emoji: "🛶",
    category: 4,
    name: "canoe",
    version: "3.0"
  }, {
    emoji: "🚤",
    category: 4,
    name: "speedboat",
    version: "1.0"
  }, {
    emoji: "🛳️",
    category: 4,
    name: "passenger ship",
    version: "1.0"
  }, {
    emoji: "⛴️",
    category: 4,
    name: "ferry",
    version: "1.0"
  }, {
    emoji: "🛥️",
    category: 4,
    name: "motor boat",
    version: "1.0"
  }, {
    emoji: "🚢",
    category: 4,
    name: "ship",
    version: "1.0"
  }, {
    emoji: "✈️",
    category: 4,
    name: "airplane",
    version: "1.0"
  }, {
    emoji: "🛩️",
    category: 4,
    name: "small airplane",
    version: "1.0"
  }, {
    emoji: "🛫",
    category: 4,
    name: "airplane departure",
    version: "1.0"
  }, {
    emoji: "🛬",
    category: 4,
    name: "airplane arrival",
    version: "1.0"
  }, {
    emoji: "🪂",
    category: 4,
    name: "parachute",
    version: "12.0"
  }, {
    emoji: "💺",
    category: 4,
    name: "seat",
    version: "1.0"
  }, {
    emoji: "🚁",
    category: 4,
    name: "helicopter",
    version: "1.0"
  }, {
    emoji: "🚟",
    category: 4,
    name: "suspension railway",
    version: "1.0"
  }, {
    emoji: "🚠",
    category: 4,
    name: "mountain cableway",
    version: "1.0"
  }, {
    emoji: "🚡",
    category: 4,
    name: "aerial tramway",
    version: "1.0"
  }, {
    emoji: "🛰️",
    category: 4,
    name: "satellite",
    version: "1.0"
  }, {
    emoji: "🚀",
    category: 4,
    name: "rocket",
    version: "1.0"
  }, {
    emoji: "🛸",
    category: 4,
    name: "flying saucer",
    version: "5.0"
  }, {
    emoji: "🛎️",
    category: 4,
    name: "bellhop bell",
    version: "1.0"
  }, {
    emoji: "🧳",
    category: 4,
    name: "luggage",
    version: "11.0"
  }, {
    emoji: "⌛",
    category: 4,
    name: "hourglass done",
    version: "1.0"
  }, {
    emoji: "⏳",
    category: 4,
    name: "hourglass not done",
    version: "1.0"
  }, {
    emoji: "⌚",
    category: 4,
    name: "watch",
    version: "1.0"
  }, {
    emoji: "⏰",
    category: 4,
    name: "alarm clock",
    version: "1.0"
  }, {
    emoji: "⏱️",
    category: 4,
    name: "stopwatch",
    version: "1.0"
  }, {
    emoji: "⏲️",
    category: 4,
    name: "timer clock",
    version: "1.0"
  }, {
    emoji: "🕰️",
    category: 4,
    name: "mantelpiece clock",
    version: "1.0"
  }, {
    emoji: "🕛",
    category: 4,
    name: "twelve o’clock",
    version: "1.0"
  }, {
    emoji: "🕧",
    category: 4,
    name: "twelve-thirty",
    version: "1.0"
  }, {
    emoji: "🕐",
    category: 4,
    name: "one o’clock",
    version: "1.0"
  }, {
    emoji: "🕜",
    category: 4,
    name: "one-thirty",
    version: "1.0"
  }, {
    emoji: "🕑",
    category: 4,
    name: "two o’clock",
    version: "1.0"
  }, {
    emoji: "🕝",
    category: 4,
    name: "two-thirty",
    version: "1.0"
  }, {
    emoji: "🕒",
    category: 4,
    name: "three o’clock",
    version: "1.0"
  }, {
    emoji: "🕞",
    category: 4,
    name: "three-thirty",
    version: "1.0"
  }, {
    emoji: "🕓",
    category: 4,
    name: "four o’clock",
    version: "1.0"
  }, {
    emoji: "🕟",
    category: 4,
    name: "four-thirty",
    version: "1.0"
  }, {
    emoji: "🕔",
    category: 4,
    name: "five o’clock",
    version: "1.0"
  }, {
    emoji: "🕠",
    category: 4,
    name: "five-thirty",
    version: "1.0"
  }, {
    emoji: "🕕",
    category: 4,
    name: "six o’clock",
    version: "1.0"
  }, {
    emoji: "🕡",
    category: 4,
    name: "six-thirty",
    version: "1.0"
  }, {
    emoji: "🕖",
    category: 4,
    name: "seven o’clock",
    version: "1.0"
  }, {
    emoji: "🕢",
    category: 4,
    name: "seven-thirty",
    version: "1.0"
  }, {
    emoji: "🕗",
    category: 4,
    name: "eight o’clock",
    version: "1.0"
  }, {
    emoji: "🕣",
    category: 4,
    name: "eight-thirty",
    version: "1.0"
  }, {
    emoji: "🕘",
    category: 4,
    name: "nine o’clock",
    version: "1.0"
  }, {
    emoji: "🕤",
    category: 4,
    name: "nine-thirty",
    version: "1.0"
  }, {
    emoji: "🕙",
    category: 4,
    name: "ten o’clock",
    version: "1.0"
  }, {
    emoji: "🕥",
    category: 4,
    name: "ten-thirty",
    version: "1.0"
  }, {
    emoji: "🕚",
    category: 4,
    name: "eleven o’clock",
    version: "1.0"
  }, {
    emoji: "🕦",
    category: 4,
    name: "eleven-thirty",
    version: "1.0"
  }, {
    emoji: "🌑",
    category: 4,
    name: "new moon",
    version: "1.0"
  }, {
    emoji: "🌒",
    category: 4,
    name: "waxing crescent moon",
    version: "1.0"
  }, {
    emoji: "🌓",
    category: 4,
    name: "first quarter moon",
    version: "1.0"
  }, {
    emoji: "🌔",
    category: 4,
    name: "waxing gibbous moon",
    version: "1.0"
  }, {
    emoji: "🌕",
    category: 4,
    name: "full moon",
    version: "1.0"
  }, {
    emoji: "🌖",
    category: 4,
    name: "waning gibbous moon",
    version: "1.0"
  }, {
    emoji: "🌗",
    category: 4,
    name: "last quarter moon",
    version: "1.0"
  }, {
    emoji: "🌘",
    category: 4,
    name: "waning crescent moon",
    version: "1.0"
  }, {
    emoji: "🌙",
    category: 4,
    name: "crescent moon",
    version: "1.0"
  }, {
    emoji: "🌚",
    category: 4,
    name: "new moon face",
    version: "1.0"
  }, {
    emoji: "🌛",
    category: 4,
    name: "first quarter moon face",
    version: "1.0"
  }, {
    emoji: "🌜",
    category: 4,
    name: "last quarter moon face",
    version: "1.0"
  }, {
    emoji: "🌡️",
    category: 4,
    name: "thermometer",
    version: "1.0"
  }, {
    emoji: "☀️",
    category: 4,
    name: "sun",
    version: "1.0"
  }, {
    emoji: "🌝",
    category: 4,
    name: "full moon face",
    version: "1.0"
  }, {
    emoji: "🌞",
    category: 4,
    name: "sun with face",
    version: "1.0"
  }, {
    emoji: "🪐",
    category: 4,
    name: "ringed planet",
    version: "12.0"
  }, {
    emoji: "⭐",
    category: 4,
    name: "star",
    version: "1.0"
  }, {
    emoji: "🌟",
    category: 4,
    name: "glowing star",
    version: "1.0"
  }, {
    emoji: "🌠",
    category: 4,
    name: "shooting star",
    version: "1.0"
  }, {
    emoji: "🌌",
    category: 4,
    name: "milky way",
    version: "1.0"
  }, {
    emoji: "☁️",
    category: 4,
    name: "cloud",
    version: "1.0"
  }, {
    emoji: "⛅",
    category: 4,
    name: "sun behind cloud",
    version: "1.0"
  }, {
    emoji: "⛈️",
    category: 4,
    name: "cloud with lightning and rain",
    version: "1.0"
  }, {
    emoji: "🌤️",
    category: 4,
    name: "sun behind small cloud",
    version: "1.0"
  }, {
    emoji: "🌥️",
    category: 4,
    name: "sun behind large cloud",
    version: "1.0"
  }, {
    emoji: "🌦️",
    category: 4,
    name: "sun behind rain cloud",
    version: "1.0"
  }, {
    emoji: "🌧️",
    category: 4,
    name: "cloud with rain",
    version: "1.0"
  }, {
    emoji: "🌨️",
    category: 4,
    name: "cloud with snow",
    version: "1.0"
  }, {
    emoji: "🌩️",
    category: 4,
    name: "cloud with lightning",
    version: "1.0"
  }, {
    emoji: "🌪️",
    category: 4,
    name: "tornado",
    version: "1.0"
  }, {
    emoji: "🌫️",
    category: 4,
    name: "fog",
    version: "1.0"
  }, {
    emoji: "🌬️",
    category: 4,
    name: "wind face",
    version: "1.0"
  }, {
    emoji: "🌀",
    category: 4,
    name: "cyclone",
    version: "1.0"
  }, {
    emoji: "🌈",
    category: 4,
    name: "rainbow",
    version: "1.0"
  }, {
    emoji: "🌂",
    category: 4,
    name: "closed umbrella",
    version: "1.0"
  }, {
    emoji: "☂️",
    category: 4,
    name: "umbrella",
    version: "1.0"
  }, {
    emoji: "☔",
    category: 4,
    name: "umbrella with rain drops",
    version: "1.0"
  }, {
    emoji: "⛱️",
    category: 4,
    name: "umbrella on ground",
    version: "1.0"
  }, {
    emoji: "⚡",
    category: 4,
    name: "high voltage",
    version: "1.0"
  }, {
    emoji: "❄️",
    category: 4,
    name: "snowflake",
    version: "1.0"
  }, {
    emoji: "☃️",
    category: 4,
    name: "snowman",
    version: "1.0"
  }, {
    emoji: "⛄",
    category: 4,
    name: "snowman without snow",
    version: "1.0"
  }, {
    emoji: "☄️",
    category: 4,
    name: "comet",
    version: "1.0"
  }, {
    emoji: "🔥",
    category: 4,
    name: "fire",
    version: "1.0"
  }, {
    emoji: "💧",
    category: 4,
    name: "droplet",
    version: "1.0"
  }, {
    emoji: "🌊",
    category: 4,
    name: "water wave",
    version: "1.0"
  }, {
    emoji: "🎃",
    category: 5,
    name: "jack-o-lantern",
    version: "1.0"
  }, {
    emoji: "🎄",
    category: 5,
    name: "Christmas tree",
    version: "1.0"
  }, {
    emoji: "🎆",
    category: 5,
    name: "fireworks",
    version: "1.0"
  }, {
    emoji: "🎇",
    category: 5,
    name: "sparkler",
    version: "1.0"
  }, {
    emoji: "🧨",
    category: 5,
    name: "firecracker",
    version: "11.0"
  }, {
    emoji: "✨",
    category: 5,
    name: "sparkles",
    version: "1.0"
  }, {
    emoji: "🎈",
    category: 5,
    name: "balloon",
    version: "1.0"
  }, {
    emoji: "🎉",
    category: 5,
    name: "party popper",
    version: "1.0"
  }, {
    emoji: "🎊",
    category: 5,
    name: "confetti ball",
    version: "1.0"
  }, {
    emoji: "🎋",
    category: 5,
    name: "tanabata tree",
    version: "1.0"
  }, {
    emoji: "🎍",
    category: 5,
    name: "pine decoration",
    version: "1.0"
  }, {
    emoji: "🎎",
    category: 5,
    name: "Japanese dolls",
    version: "1.0"
  }, {
    emoji: "🎏",
    category: 5,
    name: "carp streamer",
    version: "1.0"
  }, {
    emoji: "🎐",
    category: 5,
    name: "wind chime",
    version: "1.0"
  }, {
    emoji: "🎑",
    category: 5,
    name: "moon viewing ceremony",
    version: "1.0"
  }, {
    emoji: "🧧",
    category: 5,
    name: "red envelope",
    version: "11.0"
  }, {
    emoji: "🎀",
    category: 5,
    name: "ribbon",
    version: "1.0"
  }, {
    emoji: "🎁",
    category: 5,
    name: "wrapped gift",
    version: "1.0"
  }, {
    emoji: "🎗️",
    category: 5,
    name: "reminder ribbon",
    version: "1.0"
  }, {
    emoji: "🎟️",
    category: 5,
    name: "admission tickets",
    version: "1.0"
  }, {
    emoji: "🎫",
    category: 5,
    name: "ticket",
    version: "1.0"
  }, {
    emoji: "🎖️",
    category: 5,
    name: "military medal",
    version: "1.0"
  }, {
    emoji: "🏆",
    category: 5,
    name: "trophy",
    version: "1.0"
  }, {
    emoji: "🏅",
    category: 5,
    name: "sports medal",
    version: "1.0"
  }, {
    emoji: "🥇",
    category: 5,
    name: "1st place medal",
    version: "3.0"
  }, {
    emoji: "🥈",
    category: 5,
    name: "2nd place medal",
    version: "3.0"
  }, {
    emoji: "🥉",
    category: 5,
    name: "3rd place medal",
    version: "3.0"
  }, {
    emoji: "⚽",
    category: 5,
    name: "soccer ball",
    version: "1.0"
  }, {
    emoji: "⚾",
    category: 5,
    name: "baseball",
    version: "1.0"
  }, {
    emoji: "🥎",
    category: 5,
    name: "softball",
    version: "11.0"
  }, {
    emoji: "🏀",
    category: 5,
    name: "basketball",
    version: "1.0"
  }, {
    emoji: "🏐",
    category: 5,
    name: "volleyball",
    version: "1.0"
  }, {
    emoji: "🏈",
    category: 5,
    name: "american football",
    version: "1.0"
  }, {
    emoji: "🏉",
    category: 5,
    name: "rugby football",
    version: "1.0"
  }, {
    emoji: "🎾",
    category: 5,
    name: "tennis",
    version: "1.0"
  }, {
    emoji: "🥏",
    category: 5,
    name: "flying disc",
    version: "11.0"
  }, {
    emoji: "🎳",
    category: 5,
    name: "bowling",
    version: "1.0"
  }, {
    emoji: "🏏",
    category: 5,
    name: "cricket game",
    version: "1.0"
  }, {
    emoji: "🏑",
    category: 5,
    name: "field hockey",
    version: "1.0"
  }, {
    emoji: "🏒",
    category: 5,
    name: "ice hockey",
    version: "1.0"
  }, {
    emoji: "🥍",
    category: 5,
    name: "lacrosse",
    version: "11.0"
  }, {
    emoji: "🏓",
    category: 5,
    name: "ping pong",
    version: "1.0"
  }, {
    emoji: "🏸",
    category: 5,
    name: "badminton",
    version: "1.0"
  }, {
    emoji: "🥊",
    category: 5,
    name: "boxing glove",
    version: "3.0"
  }, {
    emoji: "🥋",
    category: 5,
    name: "martial arts uniform",
    version: "3.0"
  }, {
    emoji: "🥅",
    category: 5,
    name: "goal net",
    version: "3.0"
  }, {
    emoji: "⛳",
    category: 5,
    name: "flag in hole",
    version: "1.0"
  }, {
    emoji: "⛸️",
    category: 5,
    name: "ice skate",
    version: "1.0"
  }, {
    emoji: "🎣",
    category: 5,
    name: "fishing pole",
    version: "1.0"
  }, {
    emoji: "🤿",
    category: 5,
    name: "diving mask",
    version: "12.0"
  }, {
    emoji: "🎽",
    category: 5,
    name: "running shirt",
    version: "1.0"
  }, {
    emoji: "🎿",
    category: 5,
    name: "skis",
    version: "1.0"
  }, {
    emoji: "🛷",
    category: 5,
    name: "sled",
    version: "5.0"
  }, {
    emoji: "🥌",
    category: 5,
    name: "curling stone",
    version: "5.0"
  }, {
    emoji: "🎯",
    category: 5,
    name: "direct hit",
    version: "1.0"
  }, {
    emoji: "🪀",
    category: 5,
    name: "yo-yo",
    version: "12.0"
  }, {
    emoji: "🪁",
    category: 5,
    name: "kite",
    version: "12.0"
  }, {
    emoji: "🎱",
    category: 5,
    name: "pool 8 ball",
    version: "1.0"
  }, {
    emoji: "🔮",
    category: 5,
    name: "crystal ball",
    version: "1.0"
  }, {
    emoji: "🪄",
    category: 5,
    name: "magic wand",
    version: "13.0"
  }, {
    emoji: "🧿",
    category: 5,
    name: "nazar amulet",
    version: "11.0"
  }, {
    emoji: "🎮",
    category: 5,
    name: "video game",
    version: "1.0"
  }, {
    emoji: "🕹️",
    category: 5,
    name: "joystick",
    version: "1.0"
  }, {
    emoji: "🎰",
    category: 5,
    name: "slot machine",
    version: "1.0"
  }, {
    emoji: "🎲",
    category: 5,
    name: "game die",
    version: "1.0"
  }, {
    emoji: "🧩",
    category: 5,
    name: "puzzle piece",
    version: "11.0"
  }, {
    emoji: "🧸",
    category: 5,
    name: "teddy bear",
    version: "11.0"
  }, {
    emoji: "🪅",
    category: 5,
    name: "piñata",
    version: "13.0"
  }, {
    emoji: "🪆",
    category: 5,
    name: "nesting dolls",
    version: "13.0"
  }, {
    emoji: "♠️",
    category: 5,
    name: "spade suit",
    version: "1.0"
  }, {
    emoji: "♥️",
    category: 5,
    name: "heart suit",
    version: "1.0"
  }, {
    emoji: "♦️",
    category: 5,
    name: "diamond suit",
    version: "1.0"
  }, {
    emoji: "♣️",
    category: 5,
    name: "club suit",
    version: "1.0"
  }, {
    emoji: "♟️",
    category: 5,
    name: "chess pawn",
    version: "11.0"
  }, {
    emoji: "🃏",
    category: 5,
    name: "joker",
    version: "1.0"
  }, {
    emoji: "🀄",
    category: 5,
    name: "mahjong red dragon",
    version: "1.0"
  }, {
    emoji: "🎴",
    category: 5,
    name: "flower playing cards",
    version: "1.0"
  }, {
    emoji: "🎭",
    category: 5,
    name: "performing arts",
    version: "1.0"
  }, {
    emoji: "🖼️",
    category: 5,
    name: "framed picture",
    version: "1.0"
  }, {
    emoji: "🎨",
    category: 5,
    name: "artist palette",
    version: "1.0"
  }, {
    emoji: "🧵",
    category: 5,
    name: "thread",
    version: "11.0"
  }, {
    emoji: "🪡",
    category: 5,
    name: "sewing needle",
    version: "13.0"
  }, {
    emoji: "🧶",
    category: 5,
    name: "yarn",
    version: "11.0"
  }, {
    emoji: "🪢",
    category: 5,
    name: "knot",
    version: "13.0"
  }, {
    emoji: "👓",
    category: 6,
    name: "glasses",
    version: "1.0"
  }, {
    emoji: "🕶️",
    category: 6,
    name: "sunglasses",
    version: "1.0"
  }, {
    emoji: "🥽",
    category: 6,
    name: "goggles",
    version: "11.0"
  }, {
    emoji: "🥼",
    category: 6,
    name: "lab coat",
    version: "11.0"
  }, {
    emoji: "🦺",
    category: 6,
    name: "safety vest",
    version: "12.0"
  }, {
    emoji: "👔",
    category: 6,
    name: "necktie",
    version: "1.0"
  }, {
    emoji: "👕",
    category: 6,
    name: "t-shirt",
    version: "1.0"
  }, {
    emoji: "👖",
    category: 6,
    name: "jeans",
    version: "1.0"
  }, {
    emoji: "🧣",
    category: 6,
    name: "scarf",
    version: "5.0"
  }, {
    emoji: "🧤",
    category: 6,
    name: "gloves",
    version: "5.0"
  }, {
    emoji: "🧥",
    category: 6,
    name: "coat",
    version: "5.0"
  }, {
    emoji: "🧦",
    category: 6,
    name: "socks",
    version: "5.0"
  }, {
    emoji: "👗",
    category: 6,
    name: "dress",
    version: "1.0"
  }, {
    emoji: "👘",
    category: 6,
    name: "kimono",
    version: "1.0"
  }, {
    emoji: "🥻",
    category: 6,
    name: "sari",
    version: "12.0"
  }, {
    emoji: "🩱",
    category: 6,
    name: "one-piece swimsuit",
    version: "12.0"
  }, {
    emoji: "🩲",
    category: 6,
    name: "briefs",
    version: "12.0"
  }, {
    emoji: "🩳",
    category: 6,
    name: "shorts",
    version: "12.0"
  }, {
    emoji: "👙",
    category: 6,
    name: "bikini",
    version: "1.0"
  }, {
    emoji: "👚",
    category: 6,
    name: "woman’s clothes",
    version: "1.0"
  }, {
    emoji: "👛",
    category: 6,
    name: "purse",
    version: "1.0"
  }, {
    emoji: "👜",
    category: 6,
    name: "handbag",
    version: "1.0"
  }, {
    emoji: "👝",
    category: 6,
    name: "clutch bag",
    version: "1.0"
  }, {
    emoji: "🛍️",
    category: 6,
    name: "shopping bags",
    version: "1.0"
  }, {
    emoji: "🎒",
    category: 6,
    name: "backpack",
    version: "1.0"
  }, {
    emoji: "🩴",
    category: 6,
    name: "thong sandal",
    version: "13.0"
  }, {
    emoji: "👞",
    category: 6,
    name: "man’s shoe",
    version: "1.0"
  }, {
    emoji: "👟",
    category: 6,
    name: "running shoe",
    version: "1.0"
  }, {
    emoji: "🥾",
    category: 6,
    name: "hiking boot",
    version: "11.0"
  }, {
    emoji: "🥿",
    category: 6,
    name: "flat shoe",
    version: "11.0"
  }, {
    emoji: "👠",
    category: 6,
    name: "high-heeled shoe",
    version: "1.0"
  }, {
    emoji: "👡",
    category: 6,
    name: "woman’s sandal",
    version: "1.0"
  }, {
    emoji: "🩰",
    category: 6,
    name: "ballet shoes",
    version: "12.0"
  }, {
    emoji: "👢",
    category: 6,
    name: "woman’s boot",
    version: "1.0"
  }, {
    emoji: "👑",
    category: 6,
    name: "crown",
    version: "1.0"
  }, {
    emoji: "👒",
    category: 6,
    name: "woman’s hat",
    version: "1.0"
  }, {
    emoji: "🎩",
    category: 6,
    name: "top hat",
    version: "1.0"
  }, {
    emoji: "🎓",
    category: 6,
    name: "graduation cap",
    version: "1.0"
  }, {
    emoji: "🧢",
    category: 6,
    name: "billed cap",
    version: "5.0"
  }, {
    emoji: "🪖",
    category: 6,
    name: "military helmet",
    version: "13.0"
  }, {
    emoji: "⛑️",
    category: 6,
    name: "rescue worker’s helmet",
    version: "1.0"
  }, {
    emoji: "📿",
    category: 6,
    name: "prayer beads",
    version: "1.0"
  }, {
    emoji: "💄",
    category: 6,
    name: "lipstick",
    version: "1.0"
  }, {
    emoji: "💍",
    category: 6,
    name: "ring",
    version: "1.0"
  }, {
    emoji: "💎",
    category: 6,
    name: "gem stone",
    version: "1.0"
  }, {
    emoji: "🔇",
    category: 6,
    name: "muted speaker",
    version: "1.0"
  }, {
    emoji: "🔈",
    category: 6,
    name: "speaker low volume",
    version: "1.0"
  }, {
    emoji: "🔉",
    category: 6,
    name: "speaker medium volume",
    version: "1.0"
  }, {
    emoji: "🔊",
    category: 6,
    name: "speaker high volume",
    version: "1.0"
  }, {
    emoji: "📢",
    category: 6,
    name: "loudspeaker",
    version: "1.0"
  }, {
    emoji: "📣",
    category: 6,
    name: "megaphone",
    version: "1.0"
  }, {
    emoji: "📯",
    category: 6,
    name: "postal horn",
    version: "1.0"
  }, {
    emoji: "🔔",
    category: 6,
    name: "bell",
    version: "1.0"
  }, {
    emoji: "🔕",
    category: 6,
    name: "bell with slash",
    version: "1.0"
  }, {
    emoji: "🎼",
    category: 6,
    name: "musical score",
    version: "1.0"
  }, {
    emoji: "🎵",
    category: 6,
    name: "musical note",
    version: "1.0"
  }, {
    emoji: "🎶",
    category: 6,
    name: "musical notes",
    version: "1.0"
  }, {
    emoji: "🎙️",
    category: 6,
    name: "studio microphone",
    version: "1.0"
  }, {
    emoji: "🎚️",
    category: 6,
    name: "level slider",
    version: "1.0"
  }, {
    emoji: "🎛️",
    category: 6,
    name: "control knobs",
    version: "1.0"
  }, {
    emoji: "🎤",
    category: 6,
    name: "microphone",
    version: "1.0"
  }, {
    emoji: "🎧",
    category: 6,
    name: "headphone",
    version: "1.0"
  }, {
    emoji: "📻",
    category: 6,
    name: "radio",
    version: "1.0"
  }, {
    emoji: "🎷",
    category: 6,
    name: "saxophone",
    version: "1.0"
  }, {
    emoji: "🪗",
    category: 6,
    name: "accordion",
    version: "13.0"
  }, {
    emoji: "🎸",
    category: 6,
    name: "guitar",
    version: "1.0"
  }, {
    emoji: "🎹",
    category: 6,
    name: "musical keyboard",
    version: "1.0"
  }, {
    emoji: "🎺",
    category: 6,
    name: "trumpet",
    version: "1.0"
  }, {
    emoji: "🎻",
    category: 6,
    name: "violin",
    version: "1.0"
  }, {
    emoji: "🪕",
    category: 6,
    name: "banjo",
    version: "12.0"
  }, {
    emoji: "🥁",
    category: 6,
    name: "drum",
    version: "3.0"
  }, {
    emoji: "🪘",
    category: 6,
    name: "long drum",
    version: "13.0"
  }, {
    emoji: "📱",
    category: 6,
    name: "mobile phone",
    version: "1.0"
  }, {
    emoji: "📲",
    category: 6,
    name: "mobile phone with arrow",
    version: "1.0"
  }, {
    emoji: "☎️",
    category: 6,
    name: "telephone",
    version: "1.0"
  }, {
    emoji: "📞",
    category: 6,
    name: "telephone receiver",
    version: "1.0"
  }, {
    emoji: "📟",
    category: 6,
    name: "pager",
    version: "1.0"
  }, {
    emoji: "📠",
    category: 6,
    name: "fax machine",
    version: "1.0"
  }, {
    emoji: "🔋",
    category: 6,
    name: "battery",
    version: "1.0"
  }, {
    emoji: "🔌",
    category: 6,
    name: "electric plug",
    version: "1.0"
  }, {
    emoji: "💻",
    category: 6,
    name: "laptop",
    version: "1.0"
  }, {
    emoji: "🖥️",
    category: 6,
    name: "desktop computer",
    version: "1.0"
  }, {
    emoji: "🖨️",
    category: 6,
    name: "printer",
    version: "1.0"
  }, {
    emoji: "⌨️",
    category: 6,
    name: "keyboard",
    version: "1.0"
  }, {
    emoji: "🖱️",
    category: 6,
    name: "computer mouse",
    version: "1.0"
  }, {
    emoji: "🖲️",
    category: 6,
    name: "trackball",
    version: "1.0"
  }, {
    emoji: "💽",
    category: 6,
    name: "computer disk",
    version: "1.0"
  }, {
    emoji: "💾",
    category: 6,
    name: "floppy disk",
    version: "1.0"
  }, {
    emoji: "💿",
    category: 6,
    name: "optical disk",
    version: "1.0"
  }, {
    emoji: "📀",
    category: 6,
    name: "dvd",
    version: "1.0"
  }, {
    emoji: "🧮",
    category: 6,
    name: "abacus",
    version: "11.0"
  }, {
    emoji: "🎥",
    category: 6,
    name: "movie camera",
    version: "1.0"
  }, {
    emoji: "🎞️",
    category: 6,
    name: "film frames",
    version: "1.0"
  }, {
    emoji: "📽️",
    category: 6,
    name: "film projector",
    version: "1.0"
  }, {
    emoji: "🎬",
    category: 6,
    name: "clapper board",
    version: "1.0"
  }, {
    emoji: "📺",
    category: 6,
    name: "television",
    version: "1.0"
  }, {
    emoji: "📷",
    category: 6,
    name: "camera",
    version: "1.0"
  }, {
    emoji: "📸",
    category: 6,
    name: "camera with flash",
    version: "1.0"
  }, {
    emoji: "📹",
    category: 6,
    name: "video camera",
    version: "1.0"
  }, {
    emoji: "📼",
    category: 6,
    name: "videocassette",
    version: "1.0"
  }, {
    emoji: "🔍",
    category: 6,
    name: "magnifying glass tilted left",
    version: "1.0"
  }, {
    emoji: "🔎",
    category: 6,
    name: "magnifying glass tilted right",
    version: "1.0"
  }, {
    emoji: "🕯️",
    category: 6,
    name: "candle",
    version: "1.0"
  }, {
    emoji: "💡",
    category: 6,
    name: "light bulb",
    version: "1.0"
  }, {
    emoji: "🔦",
    category: 6,
    name: "flashlight",
    version: "1.0"
  }, {
    emoji: "🏮",
    category: 6,
    name: "red paper lantern",
    version: "1.0"
  }, {
    emoji: "🪔",
    category: 6,
    name: "diya lamp",
    version: "12.0"
  }, {
    emoji: "📔",
    category: 6,
    name: "notebook with decorative cover",
    version: "1.0"
  }, {
    emoji: "📕",
    category: 6,
    name: "closed book",
    version: "1.0"
  }, {
    emoji: "📖",
    category: 6,
    name: "open book",
    version: "1.0"
  }, {
    emoji: "📗",
    category: 6,
    name: "green book",
    version: "1.0"
  }, {
    emoji: "📘",
    category: 6,
    name: "blue book",
    version: "1.0"
  }, {
    emoji: "📙",
    category: 6,
    name: "orange book",
    version: "1.0"
  }, {
    emoji: "📚",
    category: 6,
    name: "books",
    version: "1.0"
  }, {
    emoji: "📓",
    category: 6,
    name: "notebook",
    version: "1.0"
  }, {
    emoji: "📒",
    category: 6,
    name: "ledger",
    version: "1.0"
  }, {
    emoji: "📃",
    category: 6,
    name: "page with curl",
    version: "1.0"
  }, {
    emoji: "📜",
    category: 6,
    name: "scroll",
    version: "1.0"
  }, {
    emoji: "📄",
    category: 6,
    name: "page facing up",
    version: "1.0"
  }, {
    emoji: "📰",
    category: 6,
    name: "newspaper",
    version: "1.0"
  }, {
    emoji: "🗞️",
    category: 6,
    name: "rolled-up newspaper",
    version: "1.0"
  }, {
    emoji: "📑",
    category: 6,
    name: "bookmark tabs",
    version: "1.0"
  }, {
    emoji: "🔖",
    category: 6,
    name: "bookmark",
    version: "1.0"
  }, {
    emoji: "🏷️",
    category: 6,
    name: "label",
    version: "1.0"
  }, {
    emoji: "💰",
    category: 6,
    name: "money bag",
    version: "1.0"
  }, {
    emoji: "🪙",
    category: 6,
    name: "coin",
    version: "13.0"
  }, {
    emoji: "💴",
    category: 6,
    name: "yen banknote",
    version: "1.0"
  }, {
    emoji: "💵",
    category: 6,
    name: "dollar banknote",
    version: "1.0"
  }, {
    emoji: "💶",
    category: 6,
    name: "euro banknote",
    version: "1.0"
  }, {
    emoji: "💷",
    category: 6,
    name: "pound banknote",
    version: "1.0"
  }, {
    emoji: "💸",
    category: 6,
    name: "money with wings",
    version: "1.0"
  }, {
    emoji: "💳",
    category: 6,
    name: "credit card",
    version: "1.0"
  }, {
    emoji: "🧾",
    category: 6,
    name: "receipt",
    version: "11.0"
  }, {
    emoji: "💹",
    category: 6,
    name: "chart increasing with yen",
    version: "1.0"
  }, {
    emoji: "✉️",
    category: 6,
    name: "envelope",
    version: "1.0"
  }, {
    emoji: "📧",
    category: 6,
    name: "e-mail",
    version: "1.0"
  }, {
    emoji: "📨",
    category: 6,
    name: "incoming envelope",
    version: "1.0"
  }, {
    emoji: "📩",
    category: 6,
    name: "envelope with arrow",
    version: "1.0"
  }, {
    emoji: "📤",
    category: 6,
    name: "outbox tray",
    version: "1.0"
  }, {
    emoji: "📥",
    category: 6,
    name: "inbox tray",
    version: "1.0"
  }, {
    emoji: "📦",
    category: 6,
    name: "package",
    version: "1.0"
  }, {
    emoji: "📫",
    category: 6,
    name: "closed mailbox with raised flag",
    version: "1.0"
  }, {
    emoji: "📪",
    category: 6,
    name: "closed mailbox with lowered flag",
    version: "1.0"
  }, {
    emoji: "📬",
    category: 6,
    name: "open mailbox with raised flag",
    version: "1.0"
  }, {
    emoji: "📭",
    category: 6,
    name: "open mailbox with lowered flag",
    version: "1.0"
  }, {
    emoji: "📮",
    category: 6,
    name: "postbox",
    version: "1.0"
  }, {
    emoji: "🗳️",
    category: 6,
    name: "ballot box with ballot",
    version: "1.0"
  }, {
    emoji: "✏️",
    category: 6,
    name: "pencil",
    version: "1.0"
  }, {
    emoji: "✒️",
    category: 6,
    name: "black nib",
    version: "1.0"
  }, {
    emoji: "🖋️",
    category: 6,
    name: "fountain pen",
    version: "1.0"
  }, {
    emoji: "🖊️",
    category: 6,
    name: "pen",
    version: "1.0"
  }, {
    emoji: "🖌️",
    category: 6,
    name: "paintbrush",
    version: "1.0"
  }, {
    emoji: "🖍️",
    category: 6,
    name: "crayon",
    version: "1.0"
  }, {
    emoji: "📝",
    category: 6,
    name: "memo",
    version: "1.0"
  }, {
    emoji: "💼",
    category: 6,
    name: "briefcase",
    version: "1.0"
  }, {
    emoji: "📁",
    category: 6,
    name: "file folder",
    version: "1.0"
  }, {
    emoji: "📂",
    category: 6,
    name: "open file folder",
    version: "1.0"
  }, {
    emoji: "🗂️",
    category: 6,
    name: "card index dividers",
    version: "1.0"
  }, {
    emoji: "📅",
    category: 6,
    name: "calendar",
    version: "1.0"
  }, {
    emoji: "📆",
    category: 6,
    name: "tear-off calendar",
    version: "1.0"
  }, {
    emoji: "🗒️",
    category: 6,
    name: "spiral notepad",
    version: "1.0"
  }, {
    emoji: "🗓️",
    category: 6,
    name: "spiral calendar",
    version: "1.0"
  }, {
    emoji: "📇",
    category: 6,
    name: "card index",
    version: "1.0"
  }, {
    emoji: "📈",
    category: 6,
    name: "chart increasing",
    version: "1.0"
  }, {
    emoji: "📉",
    category: 6,
    name: "chart decreasing",
    version: "1.0"
  }, {
    emoji: "📊",
    category: 6,
    name: "bar chart",
    version: "1.0"
  }, {
    emoji: "📋",
    category: 6,
    name: "clipboard",
    version: "1.0"
  }, {
    emoji: "📌",
    category: 6,
    name: "pushpin",
    version: "1.0"
  }, {
    emoji: "📍",
    category: 6,
    name: "round pushpin",
    version: "1.0"
  }, {
    emoji: "📎",
    category: 6,
    name: "paperclip",
    version: "1.0"
  }, {
    emoji: "🖇️",
    category: 6,
    name: "linked paperclips",
    version: "1.0"
  }, {
    emoji: "📏",
    category: 6,
    name: "straight ruler",
    version: "1.0"
  }, {
    emoji: "📐",
    category: 6,
    name: "triangular ruler",
    version: "1.0"
  }, {
    emoji: "✂️",
    category: 6,
    name: "scissors",
    version: "1.0"
  }, {
    emoji: "🗃️",
    category: 6,
    name: "card file box",
    version: "1.0"
  }, {
    emoji: "🗄️",
    category: 6,
    name: "file cabinet",
    version: "1.0"
  }, {
    emoji: "🗑️",
    category: 6,
    name: "wastebasket",
    version: "1.0"
  }, {
    emoji: "🔒",
    category: 6,
    name: "locked",
    version: "1.0"
  }, {
    emoji: "🔓",
    category: 6,
    name: "unlocked",
    version: "1.0"
  }, {
    emoji: "🔏",
    category: 6,
    name: "locked with pen",
    version: "1.0"
  }, {
    emoji: "🔐",
    category: 6,
    name: "locked with key",
    version: "1.0"
  }, {
    emoji: "🔑",
    category: 6,
    name: "key",
    version: "1.0"
  }, {
    emoji: "🗝️",
    category: 6,
    name: "old key",
    version: "1.0"
  }, {
    emoji: "🔨",
    category: 6,
    name: "hammer",
    version: "1.0"
  }, {
    emoji: "🪓",
    category: 6,
    name: "axe",
    version: "12.0"
  }, {
    emoji: "⛏️",
    category: 6,
    name: "pick",
    version: "1.0"
  }, {
    emoji: "⚒️",
    category: 6,
    name: "hammer and pick",
    version: "1.0"
  }, {
    emoji: "🛠️",
    category: 6,
    name: "hammer and wrench",
    version: "1.0"
  }, {
    emoji: "🗡️",
    category: 6,
    name: "dagger",
    version: "1.0"
  }, {
    emoji: "⚔️",
    category: 6,
    name: "crossed swords",
    version: "1.0"
  }, {
    emoji: "🔫",
    category: 6,
    name: "pistol",
    version: "1.0"
  }, {
    emoji: "🪃",
    category: 6,
    name: "boomerang",
    version: "13.0"
  }, {
    emoji: "🏹",
    category: 6,
    name: "bow and arrow",
    version: "1.0"
  }, {
    emoji: "🛡️",
    category: 6,
    name: "shield",
    version: "1.0"
  }, {
    emoji: "🪚",
    category: 6,
    name: "carpentry saw",
    version: "13.0"
  }, {
    emoji: "🔧",
    category: 6,
    name: "wrench",
    version: "1.0"
  }, {
    emoji: "🪛",
    category: 6,
    name: "screwdriver",
    version: "13.0"
  }, {
    emoji: "🔩",
    category: 6,
    name: "nut and bolt",
    version: "1.0"
  }, {
    emoji: "⚙️",
    category: 6,
    name: "gear",
    version: "1.0"
  }, {
    emoji: "🗜️",
    category: 6,
    name: "clamp",
    version: "1.0"
  }, {
    emoji: "⚖️",
    category: 6,
    name: "balance scale",
    version: "1.0"
  }, {
    emoji: "🦯",
    category: 6,
    name: "white cane",
    version: "12.0"
  }, {
    emoji: "🔗",
    category: 6,
    name: "link",
    version: "1.0"
  }, {
    emoji: "⛓️",
    category: 6,
    name: "chains",
    version: "1.0"
  }, {
    emoji: "🪝",
    category: 6,
    name: "hook",
    version: "13.0"
  }, {
    emoji: "🧰",
    category: 6,
    name: "toolbox",
    version: "11.0"
  }, {
    emoji: "🧲",
    category: 6,
    name: "magnet",
    version: "11.0"
  }, {
    emoji: "🪜",
    category: 6,
    name: "ladder",
    version: "13.0"
  }, {
    emoji: "⚗️",
    category: 6,
    name: "alembic",
    version: "1.0"
  }, {
    emoji: "🧪",
    category: 6,
    name: "test tube",
    version: "11.0"
  }, {
    emoji: "🧫",
    category: 6,
    name: "petri dish",
    version: "11.0"
  }, {
    emoji: "🧬",
    category: 6,
    name: "dna",
    version: "11.0"
  }, {
    emoji: "🔬",
    category: 6,
    name: "microscope",
    version: "1.0"
  }, {
    emoji: "🔭",
    category: 6,
    name: "telescope",
    version: "1.0"
  }, {
    emoji: "📡",
    category: 6,
    name: "satellite antenna",
    version: "1.0"
  }, {
    emoji: "💉",
    category: 6,
    name: "syringe",
    version: "1.0"
  }, {
    emoji: "🩸",
    category: 6,
    name: "drop of blood",
    version: "12.0"
  }, {
    emoji: "💊",
    category: 6,
    name: "pill",
    version: "1.0"
  }, {
    emoji: "🩹",
    category: 6,
    name: "adhesive bandage",
    version: "12.0"
  }, {
    emoji: "🩺",
    category: 6,
    name: "stethoscope",
    version: "12.0"
  }, {
    emoji: "🚪",
    category: 6,
    name: "door",
    version: "1.0"
  }, {
    emoji: "🛗",
    category: 6,
    name: "elevator",
    version: "13.0"
  }, {
    emoji: "🪞",
    category: 6,
    name: "mirror",
    version: "13.0"
  }, {
    emoji: "🪟",
    category: 6,
    name: "window",
    version: "13.0"
  }, {
    emoji: "🛏️",
    category: 6,
    name: "bed",
    version: "1.0"
  }, {
    emoji: "🛋️",
    category: 6,
    name: "couch and lamp",
    version: "1.0"
  }, {
    emoji: "🪑",
    category: 6,
    name: "chair",
    version: "12.0"
  }, {
    emoji: "🚽",
    category: 6,
    name: "toilet",
    version: "1.0"
  }, {
    emoji: "🪠",
    category: 6,
    name: "plunger",
    version: "13.0"
  }, {
    emoji: "🚿",
    category: 6,
    name: "shower",
    version: "1.0"
  }, {
    emoji: "🛁",
    category: 6,
    name: "bathtub",
    version: "1.0"
  }, {
    emoji: "🪤",
    category: 6,
    name: "mouse trap",
    version: "13.0"
  }, {
    emoji: "🪒",
    category: 6,
    name: "razor",
    version: "12.0"
  }, {
    emoji: "🧴",
    category: 6,
    name: "lotion bottle",
    version: "11.0"
  }, {
    emoji: "🧷",
    category: 6,
    name: "safety pin",
    version: "11.0"
  }, {
    emoji: "🧹",
    category: 6,
    name: "broom",
    version: "11.0"
  }, {
    emoji: "🧺",
    category: 6,
    name: "basket",
    version: "11.0"
  }, {
    emoji: "🧻",
    category: 6,
    name: "roll of paper",
    version: "11.0"
  }, {
    emoji: "🪣",
    category: 6,
    name: "bucket",
    version: "13.0"
  }, {
    emoji: "🧼",
    category: 6,
    name: "soap",
    version: "11.0"
  }, {
    emoji: "🪥",
    category: 6,
    name: "toothbrush",
    version: "13.0"
  }, {
    emoji: "🧽",
    category: 6,
    name: "sponge",
    version: "11.0"
  }, {
    emoji: "🧯",
    category: 6,
    name: "fire extinguisher",
    version: "11.0"
  }, {
    emoji: "🛒",
    category: 6,
    name: "shopping cart",
    version: "3.0"
  }, {
    emoji: "🚬",
    category: 6,
    name: "cigarette",
    version: "1.0"
  }, {
    emoji: "⚰️",
    category: 6,
    name: "coffin",
    version: "1.0"
  }, {
    emoji: "🪦",
    category: 6,
    name: "headstone",
    version: "13.0"
  }, {
    emoji: "⚱️",
    category: 6,
    name: "funeral urn",
    version: "1.0"
  }, {
    emoji: "🗿",
    category: 6,
    name: "moai",
    version: "1.0"
  }, {
    emoji: "🪧",
    category: 6,
    name: "placard",
    version: "13.0"
  }, {
    emoji: "🏧",
    category: 7,
    name: "ATM sign",
    version: "1.0"
  }, {
    emoji: "🚮",
    category: 7,
    name: "litter in bin sign",
    version: "1.0"
  }, {
    emoji: "🚰",
    category: 7,
    name: "potable water",
    version: "1.0"
  }, {
    emoji: "♿",
    category: 7,
    name: "wheelchair symbol",
    version: "1.0"
  }, {
    emoji: "🚹",
    category: 7,
    name: "men’s room",
    version: "1.0"
  }, {
    emoji: "🚺",
    category: 7,
    name: "women’s room",
    version: "1.0"
  }, {
    emoji: "🚻",
    category: 7,
    name: "restroom",
    version: "1.0"
  }, {
    emoji: "🚼",
    category: 7,
    name: "baby symbol",
    version: "1.0"
  }, {
    emoji: "🚾",
    category: 7,
    name: "water closet",
    version: "1.0"
  }, {
    emoji: "🛂",
    category: 7,
    name: "passport control",
    version: "1.0"
  }, {
    emoji: "🛃",
    category: 7,
    name: "customs",
    version: "1.0"
  }, {
    emoji: "🛄",
    category: 7,
    name: "baggage claim",
    version: "1.0"
  }, {
    emoji: "🛅",
    category: 7,
    name: "left luggage",
    version: "1.0"
  }, {
    emoji: "⚠️",
    category: 7,
    name: "warning",
    version: "1.0"
  }, {
    emoji: "🚸",
    category: 7,
    name: "children crossing",
    version: "1.0"
  }, {
    emoji: "⛔",
    category: 7,
    name: "no entry",
    version: "1.0"
  }, {
    emoji: "🚫",
    category: 7,
    name: "prohibited",
    version: "1.0"
  }, {
    emoji: "🚳",
    category: 7,
    name: "no bicycles",
    version: "1.0"
  }, {
    emoji: "🚭",
    category: 7,
    name: "no smoking",
    version: "1.0"
  }, {
    emoji: "🚯",
    category: 7,
    name: "no littering",
    version: "1.0"
  }, {
    emoji: "🚱",
    category: 7,
    name: "non-potable water",
    version: "1.0"
  }, {
    emoji: "🚷",
    category: 7,
    name: "no pedestrians",
    version: "1.0"
  }, {
    emoji: "📵",
    category: 7,
    name: "no mobile phones",
    version: "1.0"
  }, {
    emoji: "🔞",
    category: 7,
    name: "no one under eighteen",
    version: "1.0"
  }, {
    emoji: "☢️",
    category: 7,
    name: "radioactive",
    version: "1.0"
  }, {
    emoji: "☣️",
    category: 7,
    name: "biohazard",
    version: "1.0"
  }, {
    emoji: "⬆️",
    category: 7,
    name: "up arrow",
    version: "1.0"
  }, {
    emoji: "↗️",
    category: 7,
    name: "up-right arrow",
    version: "1.0"
  }, {
    emoji: "➡️",
    category: 7,
    name: "right arrow",
    version: "1.0"
  }, {
    emoji: "↘️",
    category: 7,
    name: "down-right arrow",
    version: "1.0"
  }, {
    emoji: "⬇️",
    category: 7,
    name: "down arrow",
    version: "1.0"
  }, {
    emoji: "↙️",
    category: 7,
    name: "down-left arrow",
    version: "1.0"
  }, {
    emoji: "⬅️",
    category: 7,
    name: "left arrow",
    version: "1.0"
  }, {
    emoji: "↖️",
    category: 7,
    name: "up-left arrow",
    version: "1.0"
  }, {
    emoji: "↕️",
    category: 7,
    name: "up-down arrow",
    version: "1.0"
  }, {
    emoji: "↔️",
    category: 7,
    name: "left-right arrow",
    version: "1.0"
  }, {
    emoji: "↩️",
    category: 7,
    name: "right arrow curving left",
    version: "1.0"
  }, {
    emoji: "↪️",
    category: 7,
    name: "left arrow curving right",
    version: "1.0"
  }, {
    emoji: "⤴️",
    category: 7,
    name: "right arrow curving up",
    version: "1.0"
  }, {
    emoji: "⤵️",
    category: 7,
    name: "right arrow curving down",
    version: "1.0"
  }, {
    emoji: "🔃",
    category: 7,
    name: "clockwise vertical arrows",
    version: "1.0"
  }, {
    emoji: "🔄",
    category: 7,
    name: "counterclockwise arrows button",
    version: "1.0"
  }, {
    emoji: "🔙",
    category: 7,
    name: "BACK arrow",
    version: "1.0"
  }, {
    emoji: "🔚",
    category: 7,
    name: "END arrow",
    version: "1.0"
  }, {
    emoji: "🔛",
    category: 7,
    name: "ON! arrow",
    version: "1.0"
  }, {
    emoji: "🔜",
    category: 7,
    name: "SOON arrow",
    version: "1.0"
  }, {
    emoji: "🔝",
    category: 7,
    name: "TOP arrow",
    version: "1.0"
  }, {
    emoji: "🛐",
    category: 7,
    name: "place of worship",
    version: "1.0"
  }, {
    emoji: "⚛️",
    category: 7,
    name: "atom symbol",
    version: "1.0"
  }, {
    emoji: "🕉️",
    category: 7,
    name: "om",
    version: "1.0"
  }, {
    emoji: "✡️",
    category: 7,
    name: "star of David",
    version: "1.0"
  }, {
    emoji: "☸️",
    category: 7,
    name: "wheel of dharma",
    version: "1.0"
  }, {
    emoji: "☯️",
    category: 7,
    name: "yin yang",
    version: "1.0"
  }, {
    emoji: "✝️",
    category: 7,
    name: "latin cross",
    version: "1.0"
  }, {
    emoji: "☦️",
    category: 7,
    name: "orthodox cross",
    version: "1.0"
  }, {
    emoji: "☪️",
    category: 7,
    name: "star and crescent",
    version: "1.0"
  }, {
    emoji: "☮️",
    category: 7,
    name: "peace symbol",
    version: "1.0"
  }, {
    emoji: "🕎",
    category: 7,
    name: "menorah",
    version: "1.0"
  }, {
    emoji: "🔯",
    category: 7,
    name: "dotted six-pointed star",
    version: "1.0"
  }, {
    emoji: "♈",
    category: 7,
    name: "Aries",
    version: "1.0"
  }, {
    emoji: "♉",
    category: 7,
    name: "Taurus",
    version: "1.0"
  }, {
    emoji: "♊",
    category: 7,
    name: "Gemini",
    version: "1.0"
  }, {
    emoji: "♋",
    category: 7,
    name: "Cancer",
    version: "1.0"
  }, {
    emoji: "♌",
    category: 7,
    name: "Leo",
    version: "1.0"
  }, {
    emoji: "♍",
    category: 7,
    name: "Virgo",
    version: "1.0"
  }, {
    emoji: "♎",
    category: 7,
    name: "Libra",
    version: "1.0"
  }, {
    emoji: "♏",
    category: 7,
    name: "Scorpio",
    version: "1.0"
  }, {
    emoji: "♐",
    category: 7,
    name: "Sagittarius",
    version: "1.0"
  }, {
    emoji: "♑",
    category: 7,
    name: "Capricorn",
    version: "1.0"
  }, {
    emoji: "♒",
    category: 7,
    name: "Aquarius",
    version: "1.0"
  }, {
    emoji: "♓",
    category: 7,
    name: "Pisces",
    version: "1.0"
  }, {
    emoji: "⛎",
    category: 7,
    name: "Ophiuchus",
    version: "1.0"
  }, {
    emoji: "🔀",
    category: 7,
    name: "shuffle tracks button",
    version: "1.0"
  }, {
    emoji: "🔁",
    category: 7,
    name: "repeat button",
    version: "1.0"
  }, {
    emoji: "🔂",
    category: 7,
    name: "repeat single button",
    version: "1.0"
  }, {
    emoji: "▶️",
    category: 7,
    name: "play button",
    version: "1.0"
  }, {
    emoji: "⏩",
    category: 7,
    name: "fast-forward button",
    version: "1.0"
  }, {
    emoji: "⏭️",
    category: 7,
    name: "next track button",
    version: "1.0"
  }, {
    emoji: "⏯️",
    category: 7,
    name: "play or pause button",
    version: "1.0"
  }, {
    emoji: "◀️",
    category: 7,
    name: "reverse button",
    version: "1.0"
  }, {
    emoji: "⏪",
    category: 7,
    name: "fast reverse button",
    version: "1.0"
  }, {
    emoji: "⏮️",
    category: 7,
    name: "last track button",
    version: "1.0"
  }, {
    emoji: "🔼",
    category: 7,
    name: "upwards button",
    version: "1.0"
  }, {
    emoji: "⏫",
    category: 7,
    name: "fast up button",
    version: "1.0"
  }, {
    emoji: "🔽",
    category: 7,
    name: "downwards button",
    version: "1.0"
  }, {
    emoji: "⏬",
    category: 7,
    name: "fast down button",
    version: "1.0"
  }, {
    emoji: "⏸️",
    category: 7,
    name: "pause button",
    version: "1.0"
  }, {
    emoji: "⏹️",
    category: 7,
    name: "stop button",
    version: "1.0"
  }, {
    emoji: "⏺️",
    category: 7,
    name: "record button",
    version: "1.0"
  }, {
    emoji: "⏏️",
    category: 7,
    name: "eject button",
    version: "1.0"
  }, {
    emoji: "🎦",
    category: 7,
    name: "cinema",
    version: "1.0"
  }, {
    emoji: "🔅",
    category: 7,
    name: "dim button",
    version: "1.0"
  }, {
    emoji: "🔆",
    category: 7,
    name: "bright button",
    version: "1.0"
  }, {
    emoji: "📶",
    category: 7,
    name: "antenna bars",
    version: "1.0"
  }, {
    emoji: "📳",
    category: 7,
    name: "vibration mode",
    version: "1.0"
  }, {
    emoji: "📴",
    category: 7,
    name: "mobile phone off",
    version: "1.0"
  }, {
    emoji: "♀️",
    category: 7,
    name: "female sign",
    version: "4.0"
  }, {
    emoji: "♂️",
    category: 7,
    name: "male sign",
    version: "4.0"
  }, {
    emoji: "⚧️",
    category: 7,
    name: "transgender symbol",
    version: "13.0"
  }, {
    emoji: "✖️",
    category: 7,
    name: "multiply",
    version: "1.0"
  }, {
    emoji: "➕",
    category: 7,
    name: "plus",
    version: "1.0"
  }, {
    emoji: "➖",
    category: 7,
    name: "minus",
    version: "1.0"
  }, {
    emoji: "➗",
    category: 7,
    name: "divide",
    version: "1.0"
  }, {
    emoji: "♾️",
    category: 7,
    name: "infinity",
    version: "11.0"
  }, {
    emoji: "‼️",
    category: 7,
    name: "double exclamation mark",
    version: "1.0"
  }, {
    emoji: "⁉️",
    category: 7,
    name: "exclamation question mark",
    version: "1.0"
  }, {
    emoji: "❓",
    category: 7,
    name: "question mark",
    version: "1.0"
  }, {
    emoji: "❔",
    category: 7,
    name: "white question mark",
    version: "1.0"
  }, {
    emoji: "❕",
    category: 7,
    name: "white exclamation mark",
    version: "1.0"
  }, {
    emoji: "❗",
    category: 7,
    name: "exclamation mark",
    version: "1.0"
  }, {
    emoji: "〰️",
    category: 7,
    name: "wavy dash",
    version: "1.0"
  }, {
    emoji: "💱",
    category: 7,
    name: "currency exchange",
    version: "1.0"
  }, {
    emoji: "💲",
    category: 7,
    name: "heavy dollar sign",
    version: "1.0"
  }, {
    emoji: "⚕️",
    category: 7,
    name: "medical symbol",
    version: "4.0"
  }, {
    emoji: "♻️",
    category: 7,
    name: "recycling symbol",
    version: "1.0"
  }, {
    emoji: "⚜️",
    category: 7,
    name: "fleur-de-lis",
    version: "1.0"
  }, {
    emoji: "🔱",
    category: 7,
    name: "trident emblem",
    version: "1.0"
  }, {
    emoji: "📛",
    category: 7,
    name: "name badge",
    version: "1.0"
  }, {
    emoji: "🔰",
    category: 7,
    name: "Japanese symbol for beginner",
    version: "1.0"
  }, {
    emoji: "⭕",
    category: 7,
    name: "hollow red circle",
    version: "1.0"
  }, {
    emoji: "✅",
    category: 7,
    name: "check mark button",
    version: "1.0"
  }, {
    emoji: "☑️",
    category: 7,
    name: "check box with check",
    version: "1.0"
  }, {
    emoji: "✔️",
    category: 7,
    name: "check mark",
    version: "1.0"
  }, {
    emoji: "❌",
    category: 7,
    name: "cross mark",
    version: "1.0"
  }, {
    emoji: "❎",
    category: 7,
    name: "cross mark button",
    version: "1.0"
  }, {
    emoji: "➰",
    category: 7,
    name: "curly loop",
    version: "1.0"
  }, {
    emoji: "➿",
    category: 7,
    name: "double curly loop",
    version: "1.0"
  }, {
    emoji: "〽️",
    category: 7,
    name: "part alternation mark",
    version: "1.0"
  }, {
    emoji: "✳️",
    category: 7,
    name: "eight-spoked asterisk",
    version: "1.0"
  }, {
    emoji: "✴️",
    category: 7,
    name: "eight-pointed star",
    version: "1.0"
  }, {
    emoji: "❇️",
    category: 7,
    name: "sparkle",
    version: "1.0"
  }, {
    emoji: "©️",
    category: 7,
    name: "copyright",
    version: "1.0"
  }, {
    emoji: "®️",
    category: 7,
    name: "registered",
    version: "1.0"
  }, {
    emoji: "™️",
    category: 7,
    name: "trade mark",
    version: "1.0"
  }, {
    emoji: "#️⃣",
    category: 7,
    name: "keycap: #",
    version: "1.0"
  }, {
    emoji: "*️⃣",
    category: 7,
    name: "keycap: *",
    version: "2.0"
  }, {
    emoji: "0️⃣",
    category: 7,
    name: "keycap: 0",
    version: "1.0"
  }, {
    emoji: "1️⃣",
    category: 7,
    name: "keycap: 1",
    version: "1.0"
  }, {
    emoji: "2️⃣",
    category: 7,
    name: "keycap: 2",
    version: "1.0"
  }, {
    emoji: "3️⃣",
    category: 7,
    name: "keycap: 3",
    version: "1.0"
  }, {
    emoji: "4️⃣",
    category: 7,
    name: "keycap: 4",
    version: "1.0"
  }, {
    emoji: "5️⃣",
    category: 7,
    name: "keycap: 5",
    version: "1.0"
  }, {
    emoji: "6️⃣",
    category: 7,
    name: "keycap: 6",
    version: "1.0"
  }, {
    emoji: "7️⃣",
    category: 7,
    name: "keycap: 7",
    version: "1.0"
  }, {
    emoji: "8️⃣",
    category: 7,
    name: "keycap: 8",
    version: "1.0"
  }, {
    emoji: "9️⃣",
    category: 7,
    name: "keycap: 9",
    version: "1.0"
  }, {
    emoji: "🔟",
    category: 7,
    name: "keycap: 10",
    version: "1.0"
  }, {
    emoji: "🔠",
    category: 7,
    name: "input latin uppercase",
    version: "1.0"
  }, {
    emoji: "🔡",
    category: 7,
    name: "input latin lowercase",
    version: "1.0"
  }, {
    emoji: "🔢",
    category: 7,
    name: "input numbers",
    version: "1.0"
  }, {
    emoji: "🔣",
    category: 7,
    name: "input symbols",
    version: "1.0"
  }, {
    emoji: "🔤",
    category: 7,
    name: "input latin letters",
    version: "1.0"
  }, {
    emoji: "🅰️",
    category: 7,
    name: "A button (blood type)",
    version: "1.0"
  }, {
    emoji: "🆎",
    category: 7,
    name: "AB button (blood type)",
    version: "1.0"
  }, {
    emoji: "🅱️",
    category: 7,
    name: "B button (blood type)",
    version: "1.0"
  }, {
    emoji: "🆑",
    category: 7,
    name: "CL button",
    version: "1.0"
  }, {
    emoji: "🆒",
    category: 7,
    name: "COOL button",
    version: "1.0"
  }, {
    emoji: "🆓",
    category: 7,
    name: "FREE button",
    version: "1.0"
  }, {
    emoji: "ℹ️",
    category: 7,
    name: "information",
    version: "1.0"
  }, {
    emoji: "🆔",
    category: 7,
    name: "ID button",
    version: "1.0"
  }, {
    emoji: "Ⓜ️",
    category: 7,
    name: "circled M",
    version: "1.0"
  }, {
    emoji: "🆕",
    category: 7,
    name: "NEW button",
    version: "1.0"
  }, {
    emoji: "🆖",
    category: 7,
    name: "NG button",
    version: "1.0"
  }, {
    emoji: "🅾️",
    category: 7,
    name: "O button (blood type)",
    version: "1.0"
  }, {
    emoji: "🆗",
    category: 7,
    name: "OK button",
    version: "1.0"
  }, {
    emoji: "🅿️",
    category: 7,
    name: "P button",
    version: "1.0"
  }, {
    emoji: "🆘",
    category: 7,
    name: "SOS button",
    version: "1.0"
  }, {
    emoji: "🆙",
    category: 7,
    name: "UP! button",
    version: "1.0"
  }, {
    emoji: "🆚",
    category: 7,
    name: "VS button",
    version: "1.0"
  }, {
    emoji: "🈁",
    category: 7,
    name: "Japanese “here” button",
    version: "1.0"
  }, {
    emoji: "🈂️",
    category: 7,
    name: "Japanese “service charge” button",
    version: "1.0"
  }, {
    emoji: "🈷️",
    category: 7,
    name: "Japanese “monthly amount” button",
    version: "1.0"
  }, {
    emoji: "🈶",
    category: 7,
    name: "Japanese “not free of charge” button",
    version: "1.0"
  }, {
    emoji: "🈯",
    category: 7,
    name: "Japanese “reserved” button",
    version: "1.0"
  }, {
    emoji: "🉐",
    category: 7,
    name: "Japanese “bargain” button",
    version: "1.0"
  }, {
    emoji: "🈹",
    category: 7,
    name: "Japanese “discount” button",
    version: "1.0"
  }, {
    emoji: "🈚",
    category: 7,
    name: "Japanese “free of charge” button",
    version: "1.0"
  }, {
    emoji: "🈲",
    category: 7,
    name: "Japanese “prohibited” button",
    version: "1.0"
  }, {
    emoji: "🉑",
    category: 7,
    name: "Japanese “acceptable” button",
    version: "1.0"
  }, {
    emoji: "🈸",
    category: 7,
    name: "Japanese “application” button",
    version: "1.0"
  }, {
    emoji: "🈴",
    category: 7,
    name: "Japanese “passing grade” button",
    version: "1.0"
  }, {
    emoji: "🈳",
    category: 7,
    name: "Japanese “vacancy” button",
    version: "1.0"
  }, {
    emoji: "㊗️",
    category: 7,
    name: "Japanese “congratulations” button",
    version: "1.0"
  }, {
    emoji: "㊙️",
    category: 7,
    name: "Japanese “secret” button",
    version: "1.0"
  }, {
    emoji: "🈺",
    category: 7,
    name: "Japanese “open for business” button",
    version: "1.0"
  }, {
    emoji: "🈵",
    category: 7,
    name: "Japanese “no vacancy” button",
    version: "1.0"
  }, {
    emoji: "🔴",
    category: 7,
    name: "red circle",
    version: "1.0"
  }, {
    emoji: "🟠",
    category: 7,
    name: "orange circle",
    version: "12.0"
  }, {
    emoji: "🟡",
    category: 7,
    name: "yellow circle",
    version: "12.0"
  }, {
    emoji: "🟢",
    category: 7,
    name: "green circle",
    version: "12.0"
  }, {
    emoji: "🔵",
    category: 7,
    name: "blue circle",
    version: "1.0"
  }, {
    emoji: "🟣",
    category: 7,
    name: "purple circle",
    version: "12.0"
  }, {
    emoji: "🟤",
    category: 7,
    name: "brown circle",
    version: "12.0"
  }, {
    emoji: "⚫",
    category: 7,
    name: "black circle",
    version: "1.0"
  }, {
    emoji: "⚪",
    category: 7,
    name: "white circle",
    version: "1.0"
  }, {
    emoji: "🟥",
    category: 7,
    name: "red square",
    version: "12.0"
  }, {
    emoji: "🟧",
    category: 7,
    name: "orange square",
    version: "12.0"
  }, {
    emoji: "🟨",
    category: 7,
    name: "yellow square",
    version: "12.0"
  }, {
    emoji: "🟩",
    category: 7,
    name: "green square",
    version: "12.0"
  }, {
    emoji: "🟦",
    category: 7,
    name: "blue square",
    version: "12.0"
  }, {
    emoji: "🟪",
    category: 7,
    name: "purple square",
    version: "12.0"
  }, {
    emoji: "🟫",
    category: 7,
    name: "brown square",
    version: "12.0"
  }, {
    emoji: "⬛",
    category: 7,
    name: "black large square",
    version: "1.0"
  }, {
    emoji: "⬜",
    category: 7,
    name: "white large square",
    version: "1.0"
  }, {
    emoji: "◼️",
    category: 7,
    name: "black medium square",
    version: "1.0"
  }, {
    emoji: "◻️",
    category: 7,
    name: "white medium square",
    version: "1.0"
  }, {
    emoji: "◾",
    category: 7,
    name: "black medium-small square",
    version: "1.0"
  }, {
    emoji: "◽",
    category: 7,
    name: "white medium-small square",
    version: "1.0"
  }, {
    emoji: "▪️",
    category: 7,
    name: "black small square",
    version: "1.0"
  }, {
    emoji: "▫️",
    category: 7,
    name: "white small square",
    version: "1.0"
  }, {
    emoji: "🔶",
    category: 7,
    name: "large orange diamond",
    version: "1.0"
  }, {
    emoji: "🔷",
    category: 7,
    name: "large blue diamond",
    version: "1.0"
  }, {
    emoji: "🔸",
    category: 7,
    name: "small orange diamond",
    version: "1.0"
  }, {
    emoji: "🔹",
    category: 7,
    name: "small blue diamond",
    version: "1.0"
  }, {
    emoji: "🔺",
    category: 7,
    name: "red triangle pointed up",
    version: "1.0"
  }, {
    emoji: "🔻",
    category: 7,
    name: "red triangle pointed down",
    version: "1.0"
  }, {
    emoji: "💠",
    category: 7,
    name: "diamond with a dot",
    version: "1.0"
  }, {
    emoji: "🔘",
    category: 7,
    name: "radio button",
    version: "1.0"
  }, {
    emoji: "🔳",
    category: 7,
    name: "white square button",
    version: "1.0"
  }, {
    emoji: "🔲",
    category: 7,
    name: "black square button",
    version: "1.0"
  }, {
    emoji: "🏁",
    category: 8,
    name: "chequered flag",
    version: "1.0"
  }, {
    emoji: "🚩",
    category: 8,
    name: "triangular flag",
    version: "1.0"
  }, {
    emoji: "🎌",
    category: 8,
    name: "crossed flags",
    version: "1.0"
  }, {
    emoji: "🏴",
    category: 8,
    name: "black flag",
    version: "1.0"
  }, {
    emoji: "🏳️",
    category: 8,
    name: "white flag",
    version: "1.0"
  }, {
    emoji: "🏳️‍🌈",
    category: 8,
    name: "rainbow flag",
    version: "4.0"
  }, {
    emoji: "🏳️‍⚧️",
    category: 8,
    name: "transgender flag",
    version: "13.0"
  }, {
    emoji: "🏴‍☠️",
    category: 8,
    name: "pirate flag",
    version: "11.0"
  }, {
    emoji: "🇦🇨",
    category: 8,
    name: "flag: Ascension Island",
    version: "2.0"
  }, {
    emoji: "🇦🇩",
    category: 8,
    name: "flag: Andorra",
    version: "2.0"
  }, {
    emoji: "🇦🇪",
    category: 8,
    name: "flag: United Arab Emirates",
    version: "2.0"
  }, {
    emoji: "🇦🇫",
    category: 8,
    name: "flag: Afghanistan",
    version: "2.0"
  }, {
    emoji: "🇦🇬",
    category: 8,
    name: "flag: Antigua & Barbuda",
    version: "2.0"
  }, {
    emoji: "🇦🇮",
    category: 8,
    name: "flag: Anguilla",
    version: "2.0"
  }, {
    emoji: "🇦🇱",
    category: 8,
    name: "flag: Albania",
    version: "2.0"
  }, {
    emoji: "🇦🇲",
    category: 8,
    name: "flag: Armenia",
    version: "2.0"
  }, {
    emoji: "🇦🇴",
    category: 8,
    name: "flag: Angola",
    version: "2.0"
  }, {
    emoji: "🇦🇶",
    category: 8,
    name: "flag: Antarctica",
    version: "2.0"
  }, {
    emoji: "🇦🇷",
    category: 8,
    name: "flag: Argentina",
    version: "2.0"
  }, {
    emoji: "🇦🇸",
    category: 8,
    name: "flag: American Samoa",
    version: "2.0"
  }, {
    emoji: "🇦🇹",
    category: 8,
    name: "flag: Austria",
    version: "2.0"
  }, {
    emoji: "🇦🇺",
    category: 8,
    name: "flag: Australia",
    version: "2.0"
  }, {
    emoji: "🇦🇼",
    category: 8,
    name: "flag: Aruba",
    version: "2.0"
  }, {
    emoji: "🇦🇽",
    category: 8,
    name: "flag: Åland Islands",
    version: "2.0"
  }, {
    emoji: "🇦🇿",
    category: 8,
    name: "flag: Azerbaijan",
    version: "2.0"
  }, {
    emoji: "🇧🇦",
    category: 8,
    name: "flag: Bosnia & Herzegovina",
    version: "2.0"
  }, {
    emoji: "🇧🇧",
    category: 8,
    name: "flag: Barbados",
    version: "2.0"
  }, {
    emoji: "🇧🇩",
    category: 8,
    name: "flag: Bangladesh",
    version: "2.0"
  }, {
    emoji: "🇧🇪",
    category: 8,
    name: "flag: Belgium",
    version: "2.0"
  }, {
    emoji: "🇧🇫",
    category: 8,
    name: "flag: Burkina Faso",
    version: "2.0"
  }, {
    emoji: "🇧🇬",
    category: 8,
    name: "flag: Bulgaria",
    version: "2.0"
  }, {
    emoji: "🇧🇭",
    category: 8,
    name: "flag: Bahrain",
    version: "2.0"
  }, {
    emoji: "🇧🇮",
    category: 8,
    name: "flag: Burundi",
    version: "2.0"
  }, {
    emoji: "🇧🇯",
    category: 8,
    name: "flag: Benin",
    version: "2.0"
  }, {
    emoji: "🇧🇱",
    category: 8,
    name: "flag: St. Barthélemy",
    version: "2.0"
  }, {
    emoji: "🇧🇲",
    category: 8,
    name: "flag: Bermuda",
    version: "2.0"
  }, {
    emoji: "🇧🇳",
    category: 8,
    name: "flag: Brunei",
    version: "2.0"
  }, {
    emoji: "🇧🇴",
    category: 8,
    name: "flag: Bolivia",
    version: "2.0"
  }, {
    emoji: "🇧🇶",
    category: 8,
    name: "flag: Caribbean Netherlands",
    version: "2.0"
  }, {
    emoji: "🇧🇷",
    category: 8,
    name: "flag: Brazil",
    version: "2.0"
  }, {
    emoji: "🇧🇸",
    category: 8,
    name: "flag: Bahamas",
    version: "2.0"
  }, {
    emoji: "🇧🇹",
    category: 8,
    name: "flag: Bhutan",
    version: "2.0"
  }, {
    emoji: "🇧🇻",
    category: 8,
    name: "flag: Bouvet Island",
    version: "2.0"
  }, {
    emoji: "🇧🇼",
    category: 8,
    name: "flag: Botswana",
    version: "2.0"
  }, {
    emoji: "🇧🇾",
    category: 8,
    name: "flag: Belarus",
    version: "2.0"
  }, {
    emoji: "🇧🇿",
    category: 8,
    name: "flag: Belize",
    version: "2.0"
  }, {
    emoji: "🇨🇦",
    category: 8,
    name: "flag: Canada",
    version: "2.0"
  }, {
    emoji: "🇨🇨",
    category: 8,
    name: "flag: Cocos (Keeling) Islands",
    version: "2.0"
  }, {
    emoji: "🇨🇩",
    category: 8,
    name: "flag: Congo - Kinshasa",
    version: "2.0"
  }, {
    emoji: "🇨🇫",
    category: 8,
    name: "flag: Central African Republic",
    version: "2.0"
  }, {
    emoji: "🇨🇬",
    category: 8,
    name: "flag: Congo - Brazzaville",
    version: "2.0"
  }, {
    emoji: "🇨🇭",
    category: 8,
    name: "flag: Switzerland",
    version: "2.0"
  }, {
    emoji: "🇨🇮",
    category: 8,
    name: "flag: Côte d’Ivoire",
    version: "2.0"
  }, {
    emoji: "🇨🇰",
    category: 8,
    name: "flag: Cook Islands",
    version: "2.0"
  }, {
    emoji: "🇨🇱",
    category: 8,
    name: "flag: Chile",
    version: "2.0"
  }, {
    emoji: "🇨🇲",
    category: 8,
    name: "flag: Cameroon",
    version: "2.0"
  }, {
    emoji: "🇨🇳",
    category: 8,
    name: "flag: China",
    version: "1.0"
  }, {
    emoji: "🇨🇴",
    category: 8,
    name: "flag: Colombia",
    version: "2.0"
  }, {
    emoji: "🇨🇵",
    category: 8,
    name: "flag: Clipperton Island",
    version: "2.0"
  }, {
    emoji: "🇨🇷",
    category: 8,
    name: "flag: Costa Rica",
    version: "2.0"
  }, {
    emoji: "🇨🇺",
    category: 8,
    name: "flag: Cuba",
    version: "2.0"
  }, {
    emoji: "🇨🇻",
    category: 8,
    name: "flag: Cape Verde",
    version: "2.0"
  }, {
    emoji: "🇨🇼",
    category: 8,
    name: "flag: Curaçao",
    version: "2.0"
  }, {
    emoji: "🇨🇽",
    category: 8,
    name: "flag: Christmas Island",
    version: "2.0"
  }, {
    emoji: "🇨🇾",
    category: 8,
    name: "flag: Cyprus",
    version: "2.0"
  }, {
    emoji: "🇨🇿",
    category: 8,
    name: "flag: Czechia",
    version: "2.0"
  }, {
    emoji: "🇩🇪",
    category: 8,
    name: "flag: Germany",
    version: "1.0"
  }, {
    emoji: "🇩🇬",
    category: 8,
    name: "flag: Diego Garcia",
    version: "2.0"
  }, {
    emoji: "🇩🇯",
    category: 8,
    name: "flag: Djibouti",
    version: "2.0"
  }, {
    emoji: "🇩🇰",
    category: 8,
    name: "flag: Denmark",
    version: "2.0"
  }, {
    emoji: "🇩🇲",
    category: 8,
    name: "flag: Dominica",
    version: "2.0"
  }, {
    emoji: "🇩🇴",
    category: 8,
    name: "flag: Dominican Republic",
    version: "2.0"
  }, {
    emoji: "🇩🇿",
    category: 8,
    name: "flag: Algeria",
    version: "2.0"
  }, {
    emoji: "🇪🇦",
    category: 8,
    name: "flag: Ceuta & Melilla",
    version: "2.0"
  }, {
    emoji: "🇪🇨",
    category: 8,
    name: "flag: Ecuador",
    version: "2.0"
  }, {
    emoji: "🇪🇪",
    category: 8,
    name: "flag: Estonia",
    version: "2.0"
  }, {
    emoji: "🇪🇬",
    category: 8,
    name: "flag: Egypt",
    version: "2.0"
  }, {
    emoji: "🇪🇭",
    category: 8,
    name: "flag: Western Sahara",
    version: "2.0"
  }, {
    emoji: "🇪🇷",
    category: 8,
    name: "flag: Eritrea",
    version: "2.0"
  }, {
    emoji: "🇪🇸",
    category: 8,
    name: "flag: Spain",
    version: "1.0"
  }, {
    emoji: "🇪🇹",
    category: 8,
    name: "flag: Ethiopia",
    version: "2.0"
  }, {
    emoji: "🇪🇺",
    category: 8,
    name: "flag: European Union",
    version: "2.0"
  }, {
    emoji: "🇫🇮",
    category: 8,
    name: "flag: Finland",
    version: "2.0"
  }, {
    emoji: "🇫🇯",
    category: 8,
    name: "flag: Fiji",
    version: "2.0"
  }, {
    emoji: "🇫🇰",
    category: 8,
    name: "flag: Falkland Islands",
    version: "2.0"
  }, {
    emoji: "🇫🇲",
    category: 8,
    name: "flag: Micronesia",
    version: "2.0"
  }, {
    emoji: "🇫🇴",
    category: 8,
    name: "flag: Faroe Islands",
    version: "2.0"
  }, {
    emoji: "🇫🇷",
    category: 8,
    name: "flag: France",
    version: "1.0"
  }, {
    emoji: "🇬🇦",
    category: 8,
    name: "flag: Gabon",
    version: "2.0"
  }, {
    emoji: "🇬🇧",
    category: 8,
    name: "flag: United Kingdom",
    version: "1.0"
  }, {
    emoji: "🇬🇩",
    category: 8,
    name: "flag: Grenada",
    version: "2.0"
  }, {
    emoji: "🇬🇪",
    category: 8,
    name: "flag: Georgia",
    version: "2.0"
  }, {
    emoji: "🇬🇫",
    category: 8,
    name: "flag: French Guiana",
    version: "2.0"
  }, {
    emoji: "🇬🇬",
    category: 8,
    name: "flag: Guernsey",
    version: "2.0"
  }, {
    emoji: "🇬🇭",
    category: 8,
    name: "flag: Ghana",
    version: "2.0"
  }, {
    emoji: "🇬🇮",
    category: 8,
    name: "flag: Gibraltar",
    version: "2.0"
  }, {
    emoji: "🇬🇱",
    category: 8,
    name: "flag: Greenland",
    version: "2.0"
  }, {
    emoji: "🇬🇲",
    category: 8,
    name: "flag: Gambia",
    version: "2.0"
  }, {
    emoji: "🇬🇳",
    category: 8,
    name: "flag: Guinea",
    version: "2.0"
  }, {
    emoji: "🇬🇵",
    category: 8,
    name: "flag: Guadeloupe",
    version: "2.0"
  }, {
    emoji: "🇬🇶",
    category: 8,
    name: "flag: Equatorial Guinea",
    version: "2.0"
  }, {
    emoji: "🇬🇷",
    category: 8,
    name: "flag: Greece",
    version: "2.0"
  }, {
    emoji: "🇬🇸",
    category: 8,
    name: "flag: South Georgia & South Sandwich Islands",
    version: "2.0"
  }, {
    emoji: "🇬🇹",
    category: 8,
    name: "flag: Guatemala",
    version: "2.0"
  }, {
    emoji: "🇬🇺",
    category: 8,
    name: "flag: Guam",
    version: "2.0"
  }, {
    emoji: "🇬🇼",
    category: 8,
    name: "flag: Guinea-Bissau",
    version: "2.0"
  }, {
    emoji: "🇬🇾",
    category: 8,
    name: "flag: Guyana",
    version: "2.0"
  }, {
    emoji: "🇭🇰",
    category: 8,
    name: "flag: Hong Kong SAR China",
    version: "2.0"
  }, {
    emoji: "🇭🇲",
    category: 8,
    name: "flag: Heard & McDonald Islands",
    version: "2.0"
  }, {
    emoji: "🇭🇳",
    category: 8,
    name: "flag: Honduras",
    version: "2.0"
  }, {
    emoji: "🇭🇷",
    category: 8,
    name: "flag: Croatia",
    version: "2.0"
  }, {
    emoji: "🇭🇹",
    category: 8,
    name: "flag: Haiti",
    version: "2.0"
  }, {
    emoji: "🇭🇺",
    category: 8,
    name: "flag: Hungary",
    version: "2.0"
  }, {
    emoji: "🇮🇨",
    category: 8,
    name: "flag: Canary Islands",
    version: "2.0"
  }, {
    emoji: "🇮🇩",
    category: 8,
    name: "flag: Indonesia",
    version: "2.0"
  }, {
    emoji: "🇮🇪",
    category: 8,
    name: "flag: Ireland",
    version: "2.0"
  }, {
    emoji: "🇮🇱",
    category: 8,
    name: "flag: Israel",
    version: "2.0"
  }, {
    emoji: "🇮🇲",
    category: 8,
    name: "flag: Isle of Man",
    version: "2.0"
  }, {
    emoji: "🇮🇳",
    category: 8,
    name: "flag: India",
    version: "2.0"
  }, {
    emoji: "🇮🇴",
    category: 8,
    name: "flag: British Indian Ocean Territory",
    version: "2.0"
  }, {
    emoji: "🇮🇶",
    category: 8,
    name: "flag: Iraq",
    version: "2.0"
  }, {
    emoji: "🇮🇷",
    category: 8,
    name: "flag: Iran",
    version: "2.0"
  }, {
    emoji: "🇮🇸",
    category: 8,
    name: "flag: Iceland",
    version: "2.0"
  }, {
    emoji: "🇮🇹",
    category: 8,
    name: "flag: Italy",
    version: "1.0"
  }, {
    emoji: "🇯🇪",
    category: 8,
    name: "flag: Jersey",
    version: "2.0"
  }, {
    emoji: "🇯🇲",
    category: 8,
    name: "flag: Jamaica",
    version: "2.0"
  }, {
    emoji: "🇯🇴",
    category: 8,
    name: "flag: Jordan",
    version: "2.0"
  }, {
    emoji: "🇯🇵",
    category: 8,
    name: "flag: Japan",
    version: "1.0"
  }, {
    emoji: "🇰🇪",
    category: 8,
    name: "flag: Kenya",
    version: "2.0"
  }, {
    emoji: "🇰🇬",
    category: 8,
    name: "flag: Kyrgyzstan",
    version: "2.0"
  }, {
    emoji: "🇰🇭",
    category: 8,
    name: "flag: Cambodia",
    version: "2.0"
  }, {
    emoji: "🇰🇮",
    category: 8,
    name: "flag: Kiribati",
    version: "2.0"
  }, {
    emoji: "🇰🇲",
    category: 8,
    name: "flag: Comoros",
    version: "2.0"
  }, {
    emoji: "🇰🇳",
    category: 8,
    name: "flag: St. Kitts & Nevis",
    version: "2.0"
  }, {
    emoji: "🇰🇵",
    category: 8,
    name: "flag: North Korea",
    version: "2.0"
  }, {
    emoji: "🇰🇷",
    category: 8,
    name: "flag: South Korea",
    version: "1.0"
  }, {
    emoji: "🇰🇼",
    category: 8,
    name: "flag: Kuwait",
    version: "2.0"
  }, {
    emoji: "🇰🇾",
    category: 8,
    name: "flag: Cayman Islands",
    version: "2.0"
  }, {
    emoji: "🇰🇿",
    category: 8,
    name: "flag: Kazakhstan",
    version: "2.0"
  }, {
    emoji: "🇱🇦",
    category: 8,
    name: "flag: Laos",
    version: "2.0"
  }, {
    emoji: "🇱🇧",
    category: 8,
    name: "flag: Lebanon",
    version: "2.0"
  }, {
    emoji: "🇱🇨",
    category: 8,
    name: "flag: St. Lucia",
    version: "2.0"
  }, {
    emoji: "🇱🇮",
    category: 8,
    name: "flag: Liechtenstein",
    version: "2.0"
  }, {
    emoji: "🇱🇰",
    category: 8,
    name: "flag: Sri Lanka",
    version: "2.0"
  }, {
    emoji: "🇱🇷",
    category: 8,
    name: "flag: Liberia",
    version: "2.0"
  }, {
    emoji: "🇱🇸",
    category: 8,
    name: "flag: Lesotho",
    version: "2.0"
  }, {
    emoji: "🇱🇹",
    category: 8,
    name: "flag: Lithuania",
    version: "2.0"
  }, {
    emoji: "🇱🇺",
    category: 8,
    name: "flag: Luxembourg",
    version: "2.0"
  }, {
    emoji: "🇱🇻",
    category: 8,
    name: "flag: Latvia",
    version: "2.0"
  }, {
    emoji: "🇱🇾",
    category: 8,
    name: "flag: Libya",
    version: "2.0"
  }, {
    emoji: "🇲🇦",
    category: 8,
    name: "flag: Morocco",
    version: "2.0"
  }, {
    emoji: "🇲🇨",
    category: 8,
    name: "flag: Monaco",
    version: "2.0"
  }, {
    emoji: "🇲🇩",
    category: 8,
    name: "flag: Moldova",
    version: "2.0"
  }, {
    emoji: "🇲🇪",
    category: 8,
    name: "flag: Montenegro",
    version: "2.0"
  }, {
    emoji: "🇲🇫",
    category: 8,
    name: "flag: St. Martin",
    version: "2.0"
  }, {
    emoji: "🇲🇬",
    category: 8,
    name: "flag: Madagascar",
    version: "2.0"
  }, {
    emoji: "🇲🇭",
    category: 8,
    name: "flag: Marshall Islands",
    version: "2.0"
  }, {
    emoji: "🇲🇰",
    category: 8,
    name: "flag: North Macedonia",
    version: "2.0"
  }, {
    emoji: "🇲🇱",
    category: 8,
    name: "flag: Mali",
    version: "2.0"
  }, {
    emoji: "🇲🇲",
    category: 8,
    name: "flag: Myanmar (Burma)",
    version: "2.0"
  }, {
    emoji: "🇲🇳",
    category: 8,
    name: "flag: Mongolia",
    version: "2.0"
  }, {
    emoji: "🇲🇴",
    category: 8,
    name: "flag: Macao SAR China",
    version: "2.0"
  }, {
    emoji: "🇲🇵",
    category: 8,
    name: "flag: Northern Mariana Islands",
    version: "2.0"
  }, {
    emoji: "🇲🇶",
    category: 8,
    name: "flag: Martinique",
    version: "2.0"
  }, {
    emoji: "🇲🇷",
    category: 8,
    name: "flag: Mauritania",
    version: "2.0"
  }, {
    emoji: "🇲🇸",
    category: 8,
    name: "flag: Montserrat",
    version: "2.0"
  }, {
    emoji: "🇲🇹",
    category: 8,
    name: "flag: Malta",
    version: "2.0"
  }, {
    emoji: "🇲🇺",
    category: 8,
    name: "flag: Mauritius",
    version: "2.0"
  }, {
    emoji: "🇲🇻",
    category: 8,
    name: "flag: Maldives",
    version: "2.0"
  }, {
    emoji: "🇲🇼",
    category: 8,
    name: "flag: Malawi",
    version: "2.0"
  }, {
    emoji: "🇲🇽",
    category: 8,
    name: "flag: Mexico",
    version: "2.0"
  }, {
    emoji: "🇲🇾",
    category: 8,
    name: "flag: Malaysia",
    version: "2.0"
  }, {
    emoji: "🇲🇿",
    category: 8,
    name: "flag: Mozambique",
    version: "2.0"
  }, {
    emoji: "🇳🇦",
    category: 8,
    name: "flag: Namibia",
    version: "2.0"
  }, {
    emoji: "🇳🇨",
    category: 8,
    name: "flag: New Caledonia",
    version: "2.0"
  }, {
    emoji: "🇳🇪",
    category: 8,
    name: "flag: Niger",
    version: "2.0"
  }, {
    emoji: "🇳🇫",
    category: 8,
    name: "flag: Norfolk Island",
    version: "2.0"
  }, {
    emoji: "🇳🇬",
    category: 8,
    name: "flag: Nigeria",
    version: "2.0"
  }, {
    emoji: "🇳🇮",
    category: 8,
    name: "flag: Nicaragua",
    version: "2.0"
  }, {
    emoji: "🇳🇱",
    category: 8,
    name: "flag: Netherlands",
    version: "2.0"
  }, {
    emoji: "🇳🇴",
    category: 8,
    name: "flag: Norway",
    version: "2.0"
  }, {
    emoji: "🇳🇵",
    category: 8,
    name: "flag: Nepal",
    version: "2.0"
  }, {
    emoji: "🇳🇷",
    category: 8,
    name: "flag: Nauru",
    version: "2.0"
  }, {
    emoji: "🇳🇺",
    category: 8,
    name: "flag: Niue",
    version: "2.0"
  }, {
    emoji: "🇳🇿",
    category: 8,
    name: "flag: New Zealand",
    version: "2.0"
  }, {
    emoji: "🇴🇲",
    category: 8,
    name: "flag: Oman",
    version: "2.0"
  }, {
    emoji: "🇵🇦",
    category: 8,
    name: "flag: Panama",
    version: "2.0"
  }, {
    emoji: "🇵🇪",
    category: 8,
    name: "flag: Peru",
    version: "2.0"
  }, {
    emoji: "🇵🇫",
    category: 8,
    name: "flag: French Polynesia",
    version: "2.0"
  }, {
    emoji: "🇵🇬",
    category: 8,
    name: "flag: Papua New Guinea",
    version: "2.0"
  }, {
    emoji: "🇵🇭",
    category: 8,
    name: "flag: Philippines",
    version: "2.0"
  }, {
    emoji: "🇵🇰",
    category: 8,
    name: "flag: Pakistan",
    version: "2.0"
  }, {
    emoji: "🇵🇱",
    category: 8,
    name: "flag: Poland",
    version: "2.0"
  }, {
    emoji: "🇵🇲",
    category: 8,
    name: "flag: St. Pierre & Miquelon",
    version: "2.0"
  }, {
    emoji: "🇵🇳",
    category: 8,
    name: "flag: Pitcairn Islands",
    version: "2.0"
  }, {
    emoji: "🇵🇷",
    category: 8,
    name: "flag: Puerto Rico",
    version: "2.0"
  }, {
    emoji: "🇵🇸",
    category: 8,
    name: "flag: Palestinian Territories",
    version: "2.0"
  }, {
    emoji: "🇵🇹",
    category: 8,
    name: "flag: Portugal",
    version: "2.0"
  }, {
    emoji: "🇵🇼",
    category: 8,
    name: "flag: Palau",
    version: "2.0"
  }, {
    emoji: "🇵🇾",
    category: 8,
    name: "flag: Paraguay",
    version: "2.0"
  }, {
    emoji: "🇶🇦",
    category: 8,
    name: "flag: Qatar",
    version: "2.0"
  }, {
    emoji: "🇷🇪",
    category: 8,
    name: "flag: Réunion",
    version: "2.0"
  }, {
    emoji: "🇷🇴",
    category: 8,
    name: "flag: Romania",
    version: "2.0"
  }, {
    emoji: "🇷🇸",
    category: 8,
    name: "flag: Serbia",
    version: "2.0"
  }, {
    emoji: "🇷🇺",
    category: 8,
    name: "flag: Russia",
    version: "1.0"
  }, {
    emoji: "🇷🇼",
    category: 8,
    name: "flag: Rwanda",
    version: "2.0"
  }, {
    emoji: "🇸🇦",
    category: 8,
    name: "flag: Saudi Arabia",
    version: "2.0"
  }, {
    emoji: "🇸🇧",
    category: 8,
    name: "flag: Solomon Islands",
    version: "2.0"
  }, {
    emoji: "🇸🇨",
    category: 8,
    name: "flag: Seychelles",
    version: "2.0"
  }, {
    emoji: "🇸🇩",
    category: 8,
    name: "flag: Sudan",
    version: "2.0"
  }, {
    emoji: "🇸🇪",
    category: 8,
    name: "flag: Sweden",
    version: "2.0"
  }, {
    emoji: "🇸🇬",
    category: 8,
    name: "flag: Singapore",
    version: "2.0"
  }, {
    emoji: "🇸🇭",
    category: 8,
    name: "flag: St. Helena",
    version: "2.0"
  }, {
    emoji: "🇸🇮",
    category: 8,
    name: "flag: Slovenia",
    version: "2.0"
  }, {
    emoji: "🇸🇯",
    category: 8,
    name: "flag: Svalbard & Jan Mayen",
    version: "2.0"
  }, {
    emoji: "🇸🇰",
    category: 8,
    name: "flag: Slovakia",
    version: "2.0"
  }, {
    emoji: "🇸🇱",
    category: 8,
    name: "flag: Sierra Leone",
    version: "2.0"
  }, {
    emoji: "🇸🇲",
    category: 8,
    name: "flag: San Marino",
    version: "2.0"
  }, {
    emoji: "🇸🇳",
    category: 8,
    name: "flag: Senegal",
    version: "2.0"
  }, {
    emoji: "🇸🇴",
    category: 8,
    name: "flag: Somalia",
    version: "2.0"
  }, {
    emoji: "🇸🇷",
    category: 8,
    name: "flag: Suriname",
    version: "2.0"
  }, {
    emoji: "🇸🇸",
    category: 8,
    name: "flag: South Sudan",
    version: "2.0"
  }, {
    emoji: "🇸🇹",
    category: 8,
    name: "flag: São Tomé & Príncipe",
    version: "2.0"
  }, {
    emoji: "🇸🇻",
    category: 8,
    name: "flag: El Salvador",
    version: "2.0"
  }, {
    emoji: "🇸🇽",
    category: 8,
    name: "flag: Sint Maarten",
    version: "2.0"
  }, {
    emoji: "🇸🇾",
    category: 8,
    name: "flag: Syria",
    version: "2.0"
  }, {
    emoji: "🇸🇿",
    category: 8,
    name: "flag: Eswatini",
    version: "2.0"
  }, {
    emoji: "🇹🇦",
    category: 8,
    name: "flag: Tristan da Cunha",
    version: "2.0"
  }, {
    emoji: "🇹🇨",
    category: 8,
    name: "flag: Turks & Caicos Islands",
    version: "2.0"
  }, {
    emoji: "🇹🇩",
    category: 8,
    name: "flag: Chad",
    version: "2.0"
  }, {
    emoji: "🇹🇫",
    category: 8,
    name: "flag: French Southern Territories",
    version: "2.0"
  }, {
    emoji: "🇹🇬",
    category: 8,
    name: "flag: Togo",
    version: "2.0"
  }, {
    emoji: "🇹🇭",
    category: 8,
    name: "flag: Thailand",
    version: "2.0"
  }, {
    emoji: "🇹🇯",
    category: 8,
    name: "flag: Tajikistan",
    version: "2.0"
  }, {
    emoji: "🇹🇰",
    category: 8,
    name: "flag: Tokelau",
    version: "2.0"
  }, {
    emoji: "🇹🇱",
    category: 8,
    name: "flag: Timor-Leste",
    version: "2.0"
  }, {
    emoji: "🇹🇲",
    category: 8,
    name: "flag: Turkmenistan",
    version: "2.0"
  }, {
    emoji: "🇹🇳",
    category: 8,
    name: "flag: Tunisia",
    version: "2.0"
  }, {
    emoji: "🇹🇴",
    category: 8,
    name: "flag: Tonga",
    version: "2.0"
  }, {
    emoji: "🇹🇷",
    category: 8,
    name: "flag: Turkey",
    version: "2.0"
  }, {
    emoji: "🇹🇹",
    category: 8,
    name: "flag: Trinidad & Tobago",
    version: "2.0"
  }, {
    emoji: "🇹🇻",
    category: 8,
    name: "flag: Tuvalu",
    version: "2.0"
  }, {
    emoji: "🇹🇼",
    category: 8,
    name: "flag: Taiwan",
    version: "2.0"
  }, {
    emoji: "🇹🇿",
    category: 8,
    name: "flag: Tanzania",
    version: "2.0"
  }, {
    emoji: "🇺🇦",
    category: 8,
    name: "flag: Ukraine",
    version: "2.0"
  }, {
    emoji: "🇺🇬",
    category: 8,
    name: "flag: Uganda",
    version: "2.0"
  }, {
    emoji: "🇺🇲",
    category: 8,
    name: "flag: U.S. Outlying Islands",
    version: "2.0"
  }, {
    emoji: "🇺🇳",
    category: 8,
    name: "flag: United Nations",
    version: "4.0"
  }, {
    emoji: "🇺🇸",
    category: 8,
    name: "flag: United States",
    version: "1.0"
  }, {
    emoji: "🇺🇾",
    category: 8,
    name: "flag: Uruguay",
    version: "2.0"
  }, {
    emoji: "🇺🇿",
    category: 8,
    name: "flag: Uzbekistan",
    version: "2.0"
  }, {
    emoji: "🇻🇦",
    category: 8,
    name: "flag: Vatican City",
    version: "2.0"
  }, {
    emoji: "🇻🇨",
    category: 8,
    name: "flag: St. Vincent & Grenadines",
    version: "2.0"
  }, {
    emoji: "🇻🇪",
    category: 8,
    name: "flag: Venezuela",
    version: "2.0"
  }, {
    emoji: "🇻🇬",
    category: 8,
    name: "flag: British Virgin Islands",
    version: "2.0"
  }, {
    emoji: "🇻🇮",
    category: 8,
    name: "flag: U.S. Virgin Islands",
    version: "2.0"
  }, {
    emoji: "🇻🇳",
    category: 8,
    name: "flag: Vietnam",
    version: "2.0"
  }, {
    emoji: "🇻🇺",
    category: 8,
    name: "flag: Vanuatu",
    version: "2.0"
  }, {
    emoji: "🇼🇫",
    category: 8,
    name: "flag: Wallis & Futuna",
    version: "2.0"
  }, {
    emoji: "🇼🇸",
    category: 8,
    name: "flag: Samoa",
    version: "2.0"
  }, {
    emoji: "🇽🇰",
    category: 8,
    name: "flag: Kosovo",
    version: "2.0"
  }, {
    emoji: "🇾🇪",
    category: 8,
    name: "flag: Yemen",
    version: "2.0"
  }, {
    emoji: "🇾🇹",
    category: 8,
    name: "flag: Mayotte",
    version: "2.0"
  }, {
    emoji: "🇿🇦",
    category: 8,
    name: "flag: South Africa",
    version: "2.0"
  }, {
    emoji: "🇿🇲",
    category: 8,
    name: "flag: Zambia",
    version: "2.0"
  }, {
    emoji: "🇿🇼",
    category: 8,
    name: "flag: Zimbabwe",
    version: "2.0"
  }, {
    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    category: 8,
    name: "flag: England",
    version: "5.0"
  }, {
    emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    category: 8,
    name: "flag: Scotland",
    version: "5.0"
  }, {
    emoji: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    category: 8,
    name: "flag: Wales",
    version: "5.0"
  }]
};

var Ce = "emoji-picker__emoji";

function Ee(e, o) {
  var n = document.createElement(e);
  return o && (n.className = o), n;
}

function _e(e) {
  for (; e.firstChild;) {
    e.removeChild(e.firstChild);
  }
}

function ze(e, o) {
  e.dataset.loaded || (e.dataset.custom ? function (e) {
    var o = Ee("img", "emoji-picker__custom-emoji");
    e.dataset.emoji && (o.src = e.dataset.emoji, e.innerText = "", e.appendChild(o));
  }(e) : "twemoji" === o.style && function (e, o) {
    e.dataset.emoji && (e.innerHTML = ke.parse(e.dataset.emoji, o.twemojiOptions));
  }(e, o), e.dataset.loaded = "true", e.style.opacity = "1");
}

var Oe = /*#__PURE__*/function () {
  function Oe(e, o) {
    _classCallCheck(this, Oe);

    this.events = e, this.options = o;
  }

  _createClass(Oe, [{
    key: "render",
    value: function render() {
      var _this = this;

      var e = Ee("div", "emoji-picker__preview");
      return this.emoji = Ee("div", "emoji-picker__preview-emoji"), e.appendChild(this.emoji), this.name = Ee("div", "emoji-picker__preview-name"), e.appendChild(this.name), this.events.on("showPreview", function (e) {
        return _this.showPreview(e);
      }), this.events.on("hidePreview", function () {
        return _this.hidePreview();
      }), e;
    }
  }, {
    key: "showPreview",
    value: function showPreview(e) {
      var o = e.emoji;
      e.custom ? o = "<img class=\"emoji-picker__custom-emoji\" src=\"".concat(e.emoji, "\">") : "twemoji" === this.options.style && (o = ke.parse(e.emoji, this.options.twemojiOptions)), this.emoji.innerHTML = o, this.name.innerHTML = e.name;
    }
  }, {
    key: "hidePreview",
    value: function hidePreview() {
      this.emoji.innerHTML = "", this.name.innerHTML = "";
    }
  }]);

  return Oe;
}();

function Ie(e, o) {
  for (var n = 0; n < o.length; n++) {
    var i = o[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}

function Se(e, o, n) {
  return o in e ? Object.defineProperty(e, o, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[o] = n, e;
}

function Pe(e) {
  for (var o = 1; o < arguments.length; o++) {
    var n = null != arguments[o] ? arguments[o] : {},
        i = Object.keys(n);
    "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter(function (e) {
      return Object.getOwnPropertyDescriptor(n, e).enumerable;
    }))), i.forEach(function (o) {
      Se(e, o, n[o]);
    });
  }

  return e;
}

function Me(e, o) {
  return function (e) {
    if (Array.isArray(e)) return e;
  }(e) || function (e, o) {
    var n = [],
        i = !0,
        a = !1,
        r = void 0;

    try {
      for (var t, s = e[Symbol.iterator](); !(i = (t = s.next()).done) && (n.push(t.value), !o || n.length !== o); i = !0) {
        ;
      }
    } catch (e) {
      a = !0, r = e;
    } finally {
      try {
        i || null == s["return"] || s["return"]();
      } finally {
        if (a) throw r;
      }
    }

    return n;
  }(e, o) || function () {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }();
}

var Ae = function Ae() {},
    Le = {},
    Te = {},
    Ne = {
  mark: Ae,
  measure: Ae
};

try {
  "undefined" != typeof window && (Le = window), "undefined" != typeof document && (Te = document), "undefined" != typeof MutationObserver && MutationObserver, "undefined" != typeof performance && (Ne = performance);
} catch (e) {}

var Fe = (Le.navigator || {}).userAgent,
    Be = void 0 === Fe ? "" : Fe,
    De = Le,
    Re = Te,
    qe = Ne,
    Ve = (De.document, !!Re.documentElement && !!Re.head && "function" == typeof Re.addEventListener && "function" == typeof Re.createElement),
    He = (~Be.indexOf("MSIE") || Be.indexOf("Trident/"), function () {
  try {} catch (e) {
    return !1;
  }
}(), "group"),
    Ue = "primary",
    We = "secondary",
    Ke = De.FontAwesomeConfig || {};

if (Re && "function" == typeof Re.querySelector) {
  [["data-family-prefix", "familyPrefix"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-auto-a11y", "autoA11y"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]].forEach(function (e) {
    var o = Me(e, 2),
        n = o[0],
        i = o[1],
        a = function (e) {
      return "" === e || "false" !== e && ("true" === e || e);
    }(function (e) {
      var o = Re.querySelector("script[" + e + "]");
      if (o) return o.getAttribute(e);
    }(n));

    null != a && (Ke[i] = a);
  });
}

var Je = Pe({}, {
  familyPrefix: "fa",
  replacementClass: "svg-inline--fa",
  autoReplaceSvg: !0,
  autoAddCss: !0,
  autoA11y: !0,
  searchPseudoElements: !1,
  observeMutations: !0,
  mutateApproach: "async",
  keepOriginalSource: !0,
  measurePerformance: !1,
  showMissingIcons: !0
}, Ke);
Je.autoReplaceSvg || (Je.observeMutations = !1);
var Ge = Pe({}, Je);
De.FontAwesomeConfig = Ge;
var Xe = De || {};
Xe.___FONT_AWESOME___ || (Xe.___FONT_AWESOME___ = {}), Xe.___FONT_AWESOME___.styles || (Xe.___FONT_AWESOME___.styles = {}), Xe.___FONT_AWESOME___.hooks || (Xe.___FONT_AWESOME___.hooks = {}), Xe.___FONT_AWESOME___.shims || (Xe.___FONT_AWESOME___.shims = []);
var Ye = Xe.___FONT_AWESOME___,
    $e = [];
Ve && ((Re.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(Re.readyState) || Re.addEventListener("DOMContentLoaded", function e() {
  Re.removeEventListener("DOMContentLoaded", e), 1, $e.map(function (e) {
    return e();
  });
}));
"undefined" != typeof global && void 0 !== global.process && global.process.emit, "undefined" == typeof setImmediate ? setTimeout : setImmediate;
var Ze = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: !1,
  flipY: !1
};

function Qe() {
  for (var e = 12, o = ""; e-- > 0;) {
    o += "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[62 * Math.random() | 0];
  }

  return o;
}

function eo(e) {
  return "".concat(e).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function oo(e) {
  return Object.keys(e || {}).reduce(function (o, n) {
    return o + "".concat(n, ": ").concat(e[n], ";");
  }, "");
}

function no(e) {
  return e.size !== Ze.size || e.x !== Ze.x || e.y !== Ze.y || e.rotate !== Ze.rotate || e.flipX || e.flipY;
}

function io(e) {
  var o = e.transform,
      n = e.containerWidth,
      i = e.iconWidth,
      a = {
    transform: "translate(".concat(n / 2, " 256)")
  },
      r = "translate(".concat(32 * o.x, ", ").concat(32 * o.y, ") "),
      t = "scale(".concat(o.size / 16 * (o.flipX ? -1 : 1), ", ").concat(o.size / 16 * (o.flipY ? -1 : 1), ") "),
      s = "rotate(".concat(o.rotate, " 0 0)");
  return {
    outer: a,
    inner: {
      transform: "".concat(r, " ").concat(t, " ").concat(s)
    },
    path: {
      transform: "translate(".concat(i / 2 * -1, " -256)")
    }
  };
}

var ao = {
  x: 0,
  y: 0,
  width: "100%",
  height: "100%"
};

function ro(e) {
  var o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
  return e.attributes && (e.attributes.fill || o) && (e.attributes.fill = "black"), e;
}

function to(e) {
  var o = e.icons,
      n = o.main,
      i = o.mask,
      a = e.prefix,
      r = e.iconName,
      t = e.transform,
      s = e.symbol,
      m = e.title,
      c = e.maskId,
      d = e.titleId,
      g = e.extra,
      u = e.watchable,
      l = void 0 !== u && u,
      v = i.found ? i : n,
      f = v.width,
      y = v.height,
      j = "fa-w-".concat(Math.ceil(f / y * 16)),
      h = [Ge.replacementClass, r ? "".concat(Ge.familyPrefix, "-").concat(r) : "", j].filter(function (e) {
    return -1 === g.classes.indexOf(e);
  }).concat(g.classes).join(" "),
      p = {
    children: [],
    attributes: Pe({}, g.attributes, {
      "data-prefix": a,
      "data-icon": r,
      "class": h,
      role: g.attributes.role || "img",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 ".concat(f, " ").concat(y)
    })
  };
  l && (p.attributes["data-fa-i2svg"] = ""), m && p.children.push({
    tag: "title",
    attributes: {
      id: p.attributes["aria-labelledby"] || "title-".concat(d || Qe())
    },
    children: [m]
  });
  var b = Pe({}, p, {
    prefix: a,
    iconName: r,
    main: n,
    mask: i,
    maskId: c,
    transform: t,
    symbol: s,
    styles: g.styles
  }),
      w = i.found && n.found ? function (e) {
    var o,
        n = e.children,
        i = e.attributes,
        a = e.main,
        r = e.mask,
        t = e.maskId,
        s = e.transform,
        m = a.width,
        c = a.icon,
        d = r.width,
        g = r.icon,
        u = io({
      transform: s,
      containerWidth: d,
      iconWidth: m
    }),
        l = {
      tag: "rect",
      attributes: Pe({}, ao, {
        fill: "white"
      })
    },
        v = c.children ? {
      children: c.children.map(ro)
    } : {},
        f = {
      tag: "g",
      attributes: Pe({}, u.inner),
      children: [ro(Pe({
        tag: c.tag,
        attributes: Pe({}, c.attributes, u.path)
      }, v))]
    },
        y = {
      tag: "g",
      attributes: Pe({}, u.outer),
      children: [f]
    },
        j = "mask-".concat(t || Qe()),
        h = "clip-".concat(t || Qe()),
        p = {
      tag: "mask",
      attributes: Pe({}, ao, {
        id: j,
        maskUnits: "userSpaceOnUse",
        maskContentUnits: "userSpaceOnUse"
      }),
      children: [l, y]
    },
        b = {
      tag: "defs",
      children: [{
        tag: "clipPath",
        attributes: {
          id: h
        },
        children: (o = g, "g" === o.tag ? o.children : [o])
      }, p]
    };
    return n.push(b, {
      tag: "rect",
      attributes: Pe({
        fill: "currentColor",
        "clip-path": "url(#".concat(h, ")"),
        mask: "url(#".concat(j, ")")
      }, ao)
    }), {
      children: n,
      attributes: i
    };
  }(b) : function (e) {
    var o = e.children,
        n = e.attributes,
        i = e.main,
        a = e.transform,
        r = oo(e.styles);

    if (r.length > 0 && (n.style = r), no(a)) {
      var t = io({
        transform: a,
        containerWidth: i.width,
        iconWidth: i.width
      });
      o.push({
        tag: "g",
        attributes: Pe({}, t.outer),
        children: [{
          tag: "g",
          attributes: Pe({}, t.inner),
          children: [{
            tag: i.icon.tag,
            children: i.icon.children,
            attributes: Pe({}, i.icon.attributes, t.path)
          }]
        }]
      });
    } else o.push(i.icon);

    return {
      children: o,
      attributes: n
    };
  }(b),
      k = w.children,
      x = w.attributes;
  return b.children = k, b.attributes = x, s ? function (e) {
    var o = e.prefix,
        n = e.iconName,
        i = e.children,
        a = e.attributes,
        r = e.symbol;
    return [{
      tag: "svg",
      attributes: {
        style: "display: none;"
      },
      children: [{
        tag: "symbol",
        attributes: Pe({}, a, {
          id: !0 === r ? "".concat(o, "-").concat(Ge.familyPrefix, "-").concat(n) : r
        }),
        children: i
      }]
    }];
  }(b) : function (e) {
    var o = e.children,
        n = e.main,
        i = e.mask,
        a = e.attributes,
        r = e.styles,
        t = e.transform;

    if (no(t) && n.found && !i.found) {
      var s = {
        x: n.width / n.height / 2,
        y: .5
      };
      a.style = oo(Pe({}, r, {
        "transform-origin": "".concat(s.x + t.x / 16, "em ").concat(s.y + t.y / 16, "em")
      }));
    }

    return [{
      tag: "svg",
      attributes: a,
      children: o
    }];
  }(b);
}

var so = function so() {},
    mo = (Ge.measurePerformance && qe && qe.mark && qe.measure, function (e, o, n, i) {
  var a,
      r,
      t,
      s = Object.keys(e),
      m = s.length,
      c = void 0 !== i ? function (e, o) {
    return function (n, i, a, r) {
      return e.call(o, n, i, a, r);
    };
  }(o, i) : o;

  for (void 0 === n ? (a = 1, t = e[s[0]]) : (a = 0, t = n); a < m; a++) {
    t = c(t, e[r = s[a]], r, e);
  }

  return t;
});

function co(e, o) {
  var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      i = n.skipHooks,
      a = void 0 !== i && i,
      r = Object.keys(o).reduce(function (e, n) {
    var i = o[n];
    return !!i.icon ? e[i.iconName] = i.icon : e[n] = i, e;
  }, {});
  "function" != typeof Ye.hooks.addPack || a ? Ye.styles[e] = Pe({}, Ye.styles[e] || {}, r) : Ye.hooks.addPack(e, r), "fas" === e && co("fa", o);
}

var go = Ye.styles,
    uo = Ye.shims,
    lo = function lo() {
  var e = function e(_e2) {
    return mo(go, function (o, n, i) {
      return o[i] = mo(n, _e2, {}), o;
    }, {});
  };

  e(function (e, o, n) {
    return o[3] && (e[o[3]] = n), e;
  }), e(function (e, o, n) {
    var i = o[2];
    return e[n] = n, i.forEach(function (o) {
      e[o] = n;
    }), e;
  });
  var o = ("far" in go);
  mo(uo, function (e, n) {
    var i = n[0],
        a = n[1],
        r = n[2];
    return "far" !== a || o || (a = "fas"), e[i] = {
      prefix: a,
      iconName: r
    }, e;
  }, {});
};

lo();
Ye.styles;

function vo(e, o, n) {
  if (e && e[o] && e[o][n]) return {
    prefix: o,
    iconName: n,
    icon: e[o][n]
  };
}

function fo(e) {
  var o = e.tag,
      n = e.attributes,
      i = void 0 === n ? {} : n,
      a = e.children,
      r = void 0 === a ? [] : a;
  return "string" == typeof e ? eo(e) : "<".concat(o, " ").concat(function (e) {
    return Object.keys(e || {}).reduce(function (o, n) {
      return o + "".concat(n, '="').concat(eo(e[n]), '" ');
    }, "").trim();
  }(i), ">").concat(r.map(fo).join(""), "</").concat(o, ">");
}

function yo(e) {
  this.name = "MissingIcon", this.message = e || "Icon unavailable", this.stack = new Error().stack;
}

yo.prototype = Object.create(Error.prototype), yo.prototype.constructor = yo;
var jo = {
  fill: "currentColor"
},
    ho = {
  attributeType: "XML",
  repeatCount: "indefinite",
  dur: "2s"
},
    po = (Pe({}, jo, {
  d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
}), Pe({}, ho, {
  attributeName: "opacity"
}));
Pe({}, jo, {
  cx: "256",
  cy: "364",
  r: "28"
}), Pe({}, ho, {
  attributeName: "r",
  values: "28;14;28;28;14;28;"
}), Pe({}, po, {
  values: "1;0;1;1;0;1;"
}), Pe({}, jo, {
  opacity: "1",
  d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
}), Pe({}, po, {
  values: "1;0;0;0;0;1;"
}), Pe({}, jo, {
  opacity: "0",
  d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
}), Pe({}, po, {
  values: "0;0;1;1;0;0;"
}), Ye.styles;

function bo(e) {
  var o = e[0],
      n = e[1],
      i = Me(e.slice(4), 1)[0];
  return {
    found: !0,
    width: o,
    height: n,
    icon: Array.isArray(i) ? {
      tag: "g",
      attributes: {
        "class": "".concat(Ge.familyPrefix, "-").concat(He)
      },
      children: [{
        tag: "path",
        attributes: {
          "class": "".concat(Ge.familyPrefix, "-").concat(We),
          fill: "currentColor",
          d: i[0]
        }
      }, {
        tag: "path",
        attributes: {
          "class": "".concat(Ge.familyPrefix, "-").concat(Ue),
          fill: "currentColor",
          d: i[1]
        }
      }]
    } : {
      tag: "path",
      attributes: {
        fill: "currentColor",
        d: i
      }
    }
  };
}

Ye.styles;

function wo() {
  Ge.autoAddCss && !_o && (!function (e) {
    if (e && Ve) {
      var o = Re.createElement("style");
      o.setAttribute("type", "text/css"), o.innerHTML = e;

      for (var n = Re.head.childNodes, i = null, a = n.length - 1; a > -1; a--) {
        var r = n[a],
            t = (r.tagName || "").toUpperCase();
        ["STYLE", "LINK"].indexOf(t) > -1 && (i = r);
      }

      Re.head.insertBefore(o, i);
    }
  }(function () {
    var e = "fa",
        o = "svg-inline--fa",
        n = Ge.familyPrefix,
        i = Ge.replacementClass,
        a = 'svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}';

    if (n !== e || i !== o) {
      var r = new RegExp("\\.".concat(e, "\\-"), "g"),
          t = new RegExp("\\--".concat(e, "\\-"), "g"),
          s = new RegExp("\\.".concat(o), "g");
      a = a.replace(r, ".".concat(n, "-")).replace(t, "--".concat(n, "-")).replace(s, ".".concat(i));
    }

    return a;
  }()), _o = !0);
}

function ko(e, o) {
  return Object.defineProperty(e, "abstract", {
    get: o
  }), Object.defineProperty(e, "html", {
    get: function get() {
      return e["abstract"].map(function (e) {
        return fo(e);
      });
    }
  }), Object.defineProperty(e, "node", {
    get: function get() {
      if (Ve) {
        var o = Re.createElement("div");
        return o.innerHTML = e.html, o.children;
      }
    }
  }), e;
}

function xo(e) {
  var o = e.prefix,
      n = void 0 === o ? "fa" : o,
      i = e.iconName;
  if (i) return vo(Eo.definitions, n, i) || vo(Ye.styles, n, i);
}

var Co,
    Eo = new (function () {
  function e() {
    !function (e, o) {
      if (!(e instanceof o)) throw new TypeError("Cannot call a class as a function");
    }(this, e), this.definitions = {};
  }

  var o, n, i;
  return o = e, (n = [{
    key: "add",
    value: function value() {
      for (var e = this, o = arguments.length, n = new Array(o), i = 0; i < o; i++) {
        n[i] = arguments[i];
      }

      var a = n.reduce(this._pullDefinitions, {});
      Object.keys(a).forEach(function (o) {
        e.definitions[o] = Pe({}, e.definitions[o] || {}, a[o]), co(o, a[o]), lo();
      });
    }
  }, {
    key: "reset",
    value: function value() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function value(e, o) {
      var n = o.prefix && o.iconName && o.icon ? {
        0: o
      } : o;
      return Object.keys(n).map(function (o) {
        var i = n[o],
            a = i.prefix,
            r = i.iconName,
            t = i.icon;
        e[a] || (e[a] = {}), e[a][r] = t;
      }), e;
    }
  }]) && Ie(o.prototype, n), i && Ie(o, i), e;
}())(),
    _o = !1,
    zo = (Co = function Co(e) {
  var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      n = o.transform,
      i = void 0 === n ? Ze : n,
      a = o.symbol,
      r = void 0 !== a && a,
      t = o.mask,
      s = void 0 === t ? null : t,
      m = o.maskId,
      c = void 0 === m ? null : m,
      d = o.title,
      g = void 0 === d ? null : d,
      u = o.titleId,
      l = void 0 === u ? null : u,
      v = o.classes,
      f = void 0 === v ? [] : v,
      y = o.attributes,
      j = void 0 === y ? {} : y,
      h = o.styles,
      p = void 0 === h ? {} : h;

  if (e) {
    var b = e.prefix,
        w = e.iconName,
        k = e.icon;
    return ko(Pe({
      type: "icon"
    }, e), function () {
      return wo(), Ge.autoA11y && (g ? j["aria-labelledby"] = "".concat(Ge.replacementClass, "-title-").concat(l || Qe()) : (j["aria-hidden"] = "true", j.focusable = "false")), to({
        icons: {
          main: bo(k),
          mask: s ? bo(s.icon) : {
            found: !1,
            width: null,
            height: null,
            icon: {}
          }
        },
        prefix: b,
        iconName: w,
        transform: Pe({}, Ze, i),
        symbol: r,
        title: g,
        maskId: c,
        titleId: l,
        extra: {
          attributes: j,
          styles: p,
          classes: f
        }
      });
    });
  }
}, function (e) {
  var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      n = (e || {}).icon ? e : xo(e || {}),
      i = o.mask;
  return i && (i = (i || {}).icon ? i : xo(i || {})), Co(n, Pe({}, o, {
    mask: i
  }));
});

Eo.add({
  prefix: "far",
  iconName: "building",
  icon: [448, 512, [], "f1ad", "M128 148v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12zm140 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-128 96h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm128 0h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-76 84v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm76 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm180 124v36H0v-36c0-6.6 5.4-12 12-12h19.5V24c0-13.3 10.7-24 24-24h337c13.3 0 24 10.7 24 24v440H436c6.6 0 12 5.4 12 12zM79.5 463H192v-67c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v67h112.5V49L80 48l-.5 415z"]
}, {
  prefix: "fas",
  iconName: "cat",
  icon: [512, 512, [], "f6be", "M290.59 192c-20.18 0-106.82 1.98-162.59 85.95V192c0-52.94-43.06-96-96-96-17.67 0-32 14.33-32 32s14.33 32 32 32c17.64 0 32 14.36 32 32v256c0 35.3 28.7 64 64 64h176c8.84 0 16-7.16 16-16v-16c0-17.67-14.33-32-32-32h-32l128-96v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V289.86c-10.29 2.67-20.89 4.54-32 4.54-61.81 0-113.52-44.05-125.41-102.4zM448 96h-64l-64-64v134.4c0 53.02 42.98 96 96 96s96-42.98 96-96V32l-64 64zm-72 80c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zm80 0c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16z"]
}, {
  prefix: "fas",
  iconName: "coffee",
  icon: [640, 512, [], "f0f4", "M192 384h192c53 0 96-43 96-96h32c70.6 0 128-57.4 128-128S582.6 32 512 32H120c-13.3 0-24 10.7-24 24v232c0 53 43 96 96 96zM512 96c35.3 0 64 28.7 64 64s-28.7 64-64 64h-32V96h32zm47.7 384H48.3c-47.6 0-61-64-36-64h583.3c25 0 11.8 64-35.9 64z"]
}, {
  prefix: "far",
  iconName: "flag",
  icon: [512, 512, [], "f024", "M336.174 80c-49.132 0-93.305-32-161.913-32-31.301 0-58.303 6.482-80.721 15.168a48.04 48.04 0 0 0 2.142-20.727C93.067 19.575 74.167 1.594 51.201.104 23.242-1.71 0 20.431 0 48c0 17.764 9.657 33.262 24 41.562V496c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-83.443C109.869 395.28 143.259 384 199.826 384c49.132 0 93.305 32 161.913 32 58.479 0 101.972-22.617 128.548-39.981C503.846 367.161 512 352.051 512 335.855V95.937c0-34.459-35.264-57.768-66.904-44.117C409.193 67.309 371.641 80 336.174 80zM464 336c-21.783 15.412-60.824 32-102.261 32-59.945 0-102.002-32-161.913-32-43.361 0-96.379 9.403-127.826 24V128c21.784-15.412 60.824-32 102.261-32 59.945 0 102.002 32 161.913 32 43.271 0 96.32-17.366 127.826-32v240z"]
}, {
  prefix: "far",
  iconName: "frown",
  icon: [496, 512, [], "f119", "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"]
}, {
  prefix: "fas",
  iconName: "futbol",
  icon: [512, 512, [], "f1e3", "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-48 0l-.003-.282-26.064 22.741-62.679-58.5 16.454-84.355 34.303 3.072c-24.889-34.216-60.004-60.089-100.709-73.141l13.651 31.939L256 139l-74.953-41.525 13.651-31.939c-40.631 13.028-75.78 38.87-100.709 73.141l34.565-3.073 16.192 84.355-62.678 58.5-26.064-22.741-.003.282c0 43.015 13.497 83.952 38.472 117.991l7.704-33.897 85.138 10.447 36.301 77.826-29.902 17.786c40.202 13.122 84.29 13.148 124.572 0l-29.902-17.786 36.301-77.826 85.138-10.447 7.704 33.897C442.503 339.952 456 299.015 456 256zm-248.102 69.571l-29.894-91.312L256 177.732l77.996 56.527-29.622 91.312h-96.476z"]
}, {
  prefix: "fas",
  iconName: "history",
  icon: [512, 512, [], "f1da", "M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z"]
}, {
  prefix: "fas",
  iconName: "icons",
  icon: [512, 512, [], "f86d", "M116.65 219.35a15.68 15.68 0 0 0 22.65 0l96.75-99.83c28.15-29 26.5-77.1-4.91-103.88C203.75-7.7 163-3.5 137.86 22.44L128 32.58l-9.85-10.14C93.05-3.5 52.25-7.7 24.86 15.64c-31.41 26.78-33 74.85-5 103.88zm143.92 100.49h-48l-7.08-14.24a27.39 27.39 0 0 0-25.66-17.78h-71.71a27.39 27.39 0 0 0-25.66 17.78l-7 14.24h-48A27.45 27.45 0 0 0 0 347.3v137.25A27.44 27.44 0 0 0 27.43 512h233.14A27.45 27.45 0 0 0 288 484.55V347.3a27.45 27.45 0 0 0-27.43-27.46zM144 468a52 52 0 1 1 52-52 52 52 0 0 1-52 52zm355.4-115.9h-60.58l22.36-50.75c2.1-6.65-3.93-13.21-12.18-13.21h-75.59c-6.3 0-11.66 3.9-12.5 9.1l-16.8 106.93c-1 6.3 4.88 11.89 12.5 11.89h62.31l-24.2 83c-1.89 6.65 4.2 12.9 12.23 12.9a13.26 13.26 0 0 0 10.92-5.25l92.4-138.91c4.88-6.91-1.16-15.7-10.87-15.7zM478.08.33L329.51 23.17C314.87 25.42 304 38.92 304 54.83V161.6a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V99.66l112-17.22v47.18a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V32c0-19.48-16-34.42-33.92-31.67z"]
}, {
  prefix: "far",
  iconName: "lightbulb",
  icon: [352, 512, [], "f0eb", "M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"]
}, {
  prefix: "fas",
  iconName: "music",
  icon: [512, 512, [], "f001", "M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z"]
}, {
  prefix: "fas",
  iconName: "search",
  icon: [512, 512, [], "f002", "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"]
}, {
  prefix: "far",
  iconName: "smile",
  icon: [496, 512, [], "f118", "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"]
}, {
  prefix: "fas",
  iconName: "times",
  icon: [352, 512, [], "f00d", "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"]
}, {
  prefix: "fas",
  iconName: "user",
  icon: [448, 512, [], "f007", "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"]
});
var Oo = zo({
  prefix: "far",
  iconName: "building"
}).html[0],
    Io = zo({
  prefix: "fas",
  iconName: "cat"
}).html[0],
    So = zo({
  prefix: "fas",
  iconName: "coffee"
}).html[0],
    Po = zo({
  prefix: "far",
  iconName: "flag"
}).html[0],
    Mo = zo({
  prefix: "fas",
  iconName: "futbol"
}).html[0],
    Ao = zo({
  prefix: "far",
  iconName: "frown"
}).html[0],
    Lo = zo({
  prefix: "fas",
  iconName: "history"
}).html[0],
    To = zo({
  prefix: "fas",
  iconName: "icons"
}).html[0],
    No = zo({
  prefix: "far",
  iconName: "lightbulb"
}).html[0],
    Fo = zo({
  prefix: "fas",
  iconName: "music"
}).html[0],
    Bo = zo({
  prefix: "fas",
  iconName: "search"
}).html[0],
    Do = zo({
  prefix: "far",
  iconName: "smile"
}).html[0],
    Ro = zo({
  prefix: "fas",
  iconName: "times"
}).html[0],
    qo = zo({
  prefix: "fas",
  iconName: "user"
}).html[0];

function Vo(e) {
  var o = document.createElement("img");
  return o.src = e, o;
}

function Ho() {
  var e = localStorage.getItem("emojiPicker.recent");
  return (e ? JSON.parse(e) : []).filter(function (e) {
    return !!e.emoji;
  });
}

var Uo = /*#__PURE__*/function () {
  function Uo(e, o, n, i, a) {
    var r = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : !0;

    _classCallCheck(this, Uo);

    this.emoji = e, this.showVariants = o, this.showPreview = n, this.events = i, this.options = a, this.lazy = r;
  }

  _createClass(Uo, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      this.emojiButton = Ee("button", Ce);
      var e = this.emoji.emoji;
      return this.emoji.custom ? e = this.lazy ? Do : "<img class=\"emoji-picker__custom-emoji\" src=\"".concat(this.emoji.emoji, "\">") : "twemoji" === this.options.style && (e = this.lazy ? Do : ke.parse(this.emoji.emoji, this.options.twemojiOptions)), this.emojiButton.innerHTML = e, this.emojiButton.tabIndex = -1, this.emojiButton.dataset.emoji = this.emoji.emoji, this.emoji.custom && (this.emojiButton.dataset.custom = "true"), this.emojiButton.title = this.emoji.name, this.emojiButton.addEventListener("focus", function () {
        return _this2.onEmojiHover();
      }), this.emojiButton.addEventListener("blur", function () {
        return _this2.onEmojiLeave();
      }), this.emojiButton.addEventListener("click", function () {
        return _this2.onEmojiClick();
      }), this.emojiButton.addEventListener("mouseover", function () {
        return _this2.onEmojiHover();
      }), this.emojiButton.addEventListener("mouseout", function () {
        return _this2.onEmojiLeave();
      }), "twemoji" === this.options.style && this.lazy && (this.emojiButton.style.opacity = "0.25"), this.emojiButton;
    }
  }, {
    key: "onEmojiClick",
    value: function onEmojiClick() {
      this.emoji.variations && this.showVariants && this.options.showVariants || !this.options.showRecents || function (e, o) {
        var n = Ho(),
            i = {
          emoji: e.emoji,
          name: e.name,
          key: e.key || e.name,
          custom: e.custom
        };
        localStorage.setItem("emojiPicker.recent", JSON.stringify([i].concat(_toConsumableArray(n.filter(function (e) {
          return !!e.emoji && e.key !== i.key;
        }))).slice(0, o.recentsCount)));
      }(this.emoji, this.options), this.events.emit("emoji", {
        emoji: this.emoji,
        showVariants: this.showVariants,
        button: this.emojiButton
      });
    }
  }, {
    key: "onEmojiHover",
    value: function onEmojiHover() {
      this.showPreview && this.events.emit("showPreview", this.emoji);
    }
  }, {
    key: "onEmojiLeave",
    value: function onEmojiLeave() {
      this.showPreview && this.events.emit("hidePreview");
    }
  }]);

  return Uo;
}();

var Wo = /*#__PURE__*/function () {
  function Wo(e, o, n, i) {
    var a = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : !0;

    _classCallCheck(this, Wo);

    this.showVariants = o, this.events = n, this.options = i, this.lazy = a, this.emojis = e.filter(function (e) {
      return !e.version || parseFloat(e.version) <= parseFloat(i.emojiVersion);
    });
  }

  _createClass(Wo, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      var e = Ee("div", "emoji-picker__container");
      return this.emojis.forEach(function (o) {
        return e.appendChild(new Uo(o, _this3.showVariants, !0, _this3.events, _this3.options, _this3.lazy).render());
      }), e;
    }
  }]);

  return Wo;
}();

var Ko = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
var Jo,
    Go = (function (e) {
  var o, n;
  o = Ko, n = function n() {
    var e = "undefined" == typeof window,
        o = new Map(),
        n = new Map(),
        i = [];
    i.total = 0;
    var a = [],
        r = [];

    function t() {
      o.clear(), n.clear(), a = [], r = [];
    }

    function s(e) {
      for (var o = -9007199254740991, n = e.length - 1; n >= 0; --n) {
        var i = e[n];

        if (null !== i) {
          var a = i.score;
          a > o && (o = a);
        }
      }

      return -9007199254740991 === o ? null : o;
    }

    function m(e, o) {
      var n = e[o];
      if (void 0 !== n) return n;
      var i = o;
      Array.isArray(o) || (i = o.split("."));

      for (var a = i.length, r = -1; e && ++r < a;) {
        e = e[i[r]];
      }

      return e;
    }

    function c(e) {
      return "object" == _typeof(e);
    }

    var d = function d() {
      var e = [],
          o = 0,
          n = {};

      function i() {
        for (var n = 0, i = e[n], a = 1; a < o;) {
          var r = a + 1;
          n = a, r < o && e[r].score < e[a].score && (n = r), e[n - 1 >> 1] = e[n], a = 1 + (n << 1);
        }

        for (var t = n - 1 >> 1; n > 0 && i.score < e[t].score; t = (n = t) - 1 >> 1) {
          e[n] = e[t];
        }

        e[n] = i;
      }

      return n.add = function (n) {
        var i = o;
        e[o++] = n;

        for (var a = i - 1 >> 1; i > 0 && n.score < e[a].score; a = (i = a) - 1 >> 1) {
          e[i] = e[a];
        }

        e[i] = n;
      }, n.poll = function () {
        if (0 !== o) {
          var n = e[0];
          return e[0] = e[--o], i(), n;
        }
      }, n.peek = function (n) {
        if (0 !== o) return e[0];
      }, n.replaceTop = function (o) {
        e[0] = o, i();
      }, n;
    },
        g = d();

    return function u(l) {
      var v = {
        single: function single(e, o, n) {
          return e ? (c(e) || (e = v.getPreparedSearch(e)), o ? (c(o) || (o = v.getPrepared(o)), ((n && void 0 !== n.allowTypo ? n.allowTypo : !l || void 0 === l.allowTypo || l.allowTypo) ? v.algorithm : v.algorithmNoTypo)(e, o, e[0])) : null) : null;
        },
        go: function go(e, o, n) {
          if (!e) return i;
          var a = (e = v.prepareSearch(e))[0],
              r = n && n.threshold || l && l.threshold || -9007199254740991,
              t = n && n.limit || l && l.limit || 9007199254740991,
              d = (n && void 0 !== n.allowTypo ? n.allowTypo : !l || void 0 === l.allowTypo || l.allowTypo) ? v.algorithm : v.algorithmNoTypo,
              u = 0,
              f = 0,
              y = o.length;
          if (n && n.keys) for (var j = n.scoreFn || s, h = n.keys, p = h.length, b = y - 1; b >= 0; --b) {
            for (var w = o[b], k = new Array(p), x = p - 1; x >= 0; --x) {
              (_ = m(w, E = h[x])) ? (c(_) || (_ = v.getPrepared(_)), k[x] = d(e, _, a)) : k[x] = null;
            }

            k.obj = w;
            var C = j(k);
            null !== C && (C < r || (k.score = C, u < t ? (g.add(k), ++u) : (++f, C > g.peek().score && g.replaceTop(k))));
          } else if (n && n.key) {
            var E = n.key;

            for (b = y - 1; b >= 0; --b) {
              (_ = m(w = o[b], E)) && (c(_) || (_ = v.getPrepared(_)), null !== (z = d(e, _, a)) && (z.score < r || (z = {
                target: z.target,
                _targetLowerCodes: null,
                _nextBeginningIndexes: null,
                score: z.score,
                indexes: z.indexes,
                obj: w
              }, u < t ? (g.add(z), ++u) : (++f, z.score > g.peek().score && g.replaceTop(z)))));
            }
          } else for (b = y - 1; b >= 0; --b) {
            var _, z;

            (_ = o[b]) && (c(_) || (_ = v.getPrepared(_)), null !== (z = d(e, _, a)) && (z.score < r || (u < t ? (g.add(z), ++u) : (++f, z.score > g.peek().score && g.replaceTop(z)))));
          }
          if (0 === u) return i;
          var O = new Array(u);

          for (b = u - 1; b >= 0; --b) {
            O[b] = g.poll();
          }

          return O.total = u + f, O;
        },
        goAsync: function goAsync(o, n, a) {
          var r = !1,
              t = new Promise(function (t, g) {
            if (!o) return t(i);
            var u = (o = v.prepareSearch(o))[0],
                f = d(),
                y = n.length - 1,
                j = a && a.threshold || l && l.threshold || -9007199254740991,
                h = a && a.limit || l && l.limit || 9007199254740991,
                p = (a && void 0 !== a.allowTypo ? a.allowTypo : !l || void 0 === l.allowTypo || l.allowTypo) ? v.algorithm : v.algorithmNoTypo,
                b = 0,
                w = 0;

            function k() {
              if (r) return g("canceled");
              var d = Date.now();
              if (a && a.keys) for (var l = a.scoreFn || s, x = a.keys, C = x.length; y >= 0; --y) {
                for (var E = n[y], _ = new Array(C), z = C - 1; z >= 0; --z) {
                  (S = m(E, I = x[z])) ? (c(S) || (S = v.getPrepared(S)), _[z] = p(o, S, u)) : _[z] = null;
                }

                _.obj = E;
                var O = l(_);
                if (null !== O && !(O < j) && (_.score = O, b < h ? (f.add(_), ++b) : (++w, O > f.peek().score && f.replaceTop(_)), y % 1e3 == 0 && Date.now() - d >= 10)) return void (e ? setImmediate(k) : setTimeout(k));
              } else if (a && a.key) {
                for (var I = a.key; y >= 0; --y) {
                  if ((S = m(E = n[y], I)) && (c(S) || (S = v.getPrepared(S)), null !== (P = p(o, S, u)) && !(P.score < j) && (P = {
                    target: P.target,
                    _targetLowerCodes: null,
                    _nextBeginningIndexes: null,
                    score: P.score,
                    indexes: P.indexes,
                    obj: E
                  }, b < h ? (f.add(P), ++b) : (++w, P.score > f.peek().score && f.replaceTop(P)), y % 1e3 == 0 && Date.now() - d >= 10))) return void (e ? setImmediate(k) : setTimeout(k));
                }
              } else for (; y >= 0; --y) {
                var S, P;
                if ((S = n[y]) && (c(S) || (S = v.getPrepared(S)), null !== (P = p(o, S, u)) && !(P.score < j) && (b < h ? (f.add(P), ++b) : (++w, P.score > f.peek().score && f.replaceTop(P)), y % 1e3 == 0 && Date.now() - d >= 10))) return void (e ? setImmediate(k) : setTimeout(k));
              }
              if (0 === b) return t(i);

              for (var M = new Array(b), A = b - 1; A >= 0; --A) {
                M[A] = f.poll();
              }

              M.total = b + w, t(M);
            }

            e ? setImmediate(k) : k();
          });
          return t.cancel = function () {
            r = !0;
          }, t;
        },
        highlight: function highlight(e, o, n) {
          if (null === e) return null;
          void 0 === o && (o = "<b>"), void 0 === n && (n = "</b>");

          for (var i = "", a = 0, r = !1, t = e.target, s = t.length, m = e.indexes, c = 0; c < s; ++c) {
            var d = t[c];

            if (m[a] === c) {
              if (r || (r = !0, i += o), ++a === m.length) {
                i += d + n + t.substr(c + 1);
                break;
              }
            } else r && (r = !1, i += n);

            i += d;
          }

          return i;
        },
        prepare: function prepare(e) {
          if (e) return {
            target: e,
            _targetLowerCodes: v.prepareLowerCodes(e),
            _nextBeginningIndexes: null,
            score: null,
            indexes: null,
            obj: null
          };
        },
        prepareSlow: function prepareSlow(e) {
          if (e) return {
            target: e,
            _targetLowerCodes: v.prepareLowerCodes(e),
            _nextBeginningIndexes: v.prepareNextBeginningIndexes(e),
            score: null,
            indexes: null,
            obj: null
          };
        },
        prepareSearch: function prepareSearch(e) {
          if (e) return v.prepareLowerCodes(e);
        },
        getPrepared: function getPrepared(e) {
          if (e.length > 999) return v.prepare(e);
          var n = o.get(e);
          return void 0 !== n || (n = v.prepare(e), o.set(e, n)), n;
        },
        getPreparedSearch: function getPreparedSearch(e) {
          if (e.length > 999) return v.prepareSearch(e);
          var o = n.get(e);
          return void 0 !== o || (o = v.prepareSearch(e), n.set(e, o)), o;
        },
        algorithm: function algorithm(e, o, n) {
          for (var i = o._targetLowerCodes, t = e.length, s = i.length, m = 0, c = 0, d = 0, g = 0;;) {
            if (n === i[c]) {
              if (a[g++] = c, ++m === t) break;
              n = e[0 === d ? m : d === m ? m + 1 : d === m - 1 ? m - 1 : m];
            }

            if (++c >= s) for (;;) {
              if (m <= 1) return null;

              if (0 === d) {
                if (n === e[--m]) continue;
                d = m;
              } else {
                if (1 === d) return null;
                if ((n = e[1 + (m = --d)]) === e[m]) continue;
              }

              c = a[(g = m) - 1] + 1;
              break;
            }
          }

          m = 0;
          var u = 0,
              l = !1,
              f = 0,
              y = o._nextBeginningIndexes;
          null === y && (y = o._nextBeginningIndexes = v.prepareNextBeginningIndexes(o.target));
          var j = c = 0 === a[0] ? 0 : y[a[0] - 1];
          if (c !== s) for (;;) {
            if (c >= s) {
              if (m <= 0) {
                if (++u > t - 2) break;
                if (e[u] === e[u + 1]) continue;
                c = j;
                continue;
              }

              --m, c = y[r[--f]];
            } else if (e[0 === u ? m : u === m ? m + 1 : u === m - 1 ? m - 1 : m] === i[c]) {
              if (r[f++] = c, ++m === t) {
                l = !0;
                break;
              }

              ++c;
            } else c = y[c];
          }
          if (l) var h = r,
              p = f;else h = a, p = g;

          for (var b = 0, w = -1, k = 0; k < t; ++k) {
            w !== (c = h[k]) - 1 && (b -= c), w = c;
          }

          for (l ? 0 !== u && (b += -20) : (b *= 1e3, 0 !== d && (b += -20)), b -= s - t, o.score = b, o.indexes = new Array(p), k = p - 1; k >= 0; --k) {
            o.indexes[k] = h[k];
          }

          return o;
        },
        algorithmNoTypo: function algorithmNoTypo(e, o, n) {
          for (var i = o._targetLowerCodes, t = e.length, s = i.length, m = 0, c = 0, d = 0;;) {
            if (n === i[c]) {
              if (a[d++] = c, ++m === t) break;
              n = e[m];
            }

            if (++c >= s) return null;
          }

          m = 0;
          var g = !1,
              u = 0,
              l = o._nextBeginningIndexes;
          if (null === l && (l = o._nextBeginningIndexes = v.prepareNextBeginningIndexes(o.target)), (c = 0 === a[0] ? 0 : l[a[0] - 1]) !== s) for (;;) {
            if (c >= s) {
              if (m <= 0) break;
              --m, c = l[r[--u]];
            } else if (e[m] === i[c]) {
              if (r[u++] = c, ++m === t) {
                g = !0;
                break;
              }

              ++c;
            } else c = l[c];
          }
          if (g) var f = r,
              y = u;else f = a, y = d;

          for (var j = 0, h = -1, p = 0; p < t; ++p) {
            h !== (c = f[p]) - 1 && (j -= c), h = c;
          }

          for (g || (j *= 1e3), j -= s - t, o.score = j, o.indexes = new Array(y), p = y - 1; p >= 0; --p) {
            o.indexes[p] = f[p];
          }

          return o;
        },
        prepareLowerCodes: function prepareLowerCodes(e) {
          for (var o = e.length, n = [], i = e.toLowerCase(), a = 0; a < o; ++a) {
            n[a] = i.charCodeAt(a);
          }

          return n;
        },
        prepareBeginningIndexes: function prepareBeginningIndexes(e) {
          for (var o = e.length, n = [], i = 0, a = !1, r = !1, t = 0; t < o; ++t) {
            var s = e.charCodeAt(t),
                m = s >= 65 && s <= 90,
                c = m || s >= 97 && s <= 122 || s >= 48 && s <= 57,
                d = m && !a || !r || !c;
            a = m, r = c, d && (n[i++] = t);
          }

          return n;
        },
        prepareNextBeginningIndexes: function prepareNextBeginningIndexes(e) {
          for (var o = e.length, n = v.prepareBeginningIndexes(e), i = [], a = n[0], r = 0, t = 0; t < o; ++t) {
            a > t ? i[t] = a : (a = n[++r], i[t] = void 0 === a ? o : a);
          }

          return i;
        },
        cleanup: t,
        "new": u
      };
      return v;
    }();
  }, e.exports ? e.exports = n() : o.fuzzysort = n();
}(Jo = {
  exports: {}
}, Jo.exports), Jo.exports);

var Xo = /*#__PURE__*/function () {
  function Xo(e, o) {
    _classCallCheck(this, Xo);

    this.message = e, this.iconUrl = o;
  }

  _createClass(Xo, [{
    key: "render",
    value: function render() {
      var e = Ee("div", "emoji-picker__search-not-found"),
          o = Ee("div", "emoji-picker__search-not-found-icon");
      this.iconUrl ? o.appendChild(Vo(this.iconUrl)) : o.innerHTML = Ao, e.appendChild(o);
      var n = Ee("h2");
      return n.innerHTML = this.message, e.appendChild(n), e;
    }
  }]);

  return Xo;
}();

var Yo = /*#__PURE__*/function () {
  function Yo(e, o, n, i, a) {
    var _this4 = this;

    _classCallCheck(this, Yo);

    if (this.events = e, this.i18n = o, this.options = n, this.focusedEmojiIndex = 0, this.emojisPerRow = this.options.emojisPerRow || 8, this.emojiData = i.filter(function (e) {
      return e.version && parseFloat(e.version) <= parseFloat(n.emojiVersion) && void 0 !== e.category && a.indexOf(e.category) >= 0;
    }), this.options.custom) {
      var _e3 = this.options.custom.map(function (e) {
        return Object.assign(Object.assign({}, e), {
          custom: !0
        });
      });

      this.emojiData = [].concat(_toConsumableArray(this.emojiData), _toConsumableArray(_e3));
    }

    this.events.on("hideVariantPopup", function () {
      setTimeout(function () {
        return _this4.setFocusedEmoji(_this4.focusedEmojiIndex);
      });
    });
  }

  _createClass(Yo, [{
    key: "render",
    value: function render() {
      var _this5 = this;

      return this.searchContainer = Ee("div", "emoji-picker__search-container"), this.searchField = Ee("input", "emoji-picker__search"), this.searchField.placeholder = this.i18n.search, this.searchContainer.appendChild(this.searchField), this.searchIcon = Ee("span", "emoji-picker__search-icon"), this.options.icons && this.options.icons.search ? this.searchIcon.appendChild(Vo(this.options.icons.search)) : this.searchIcon.innerHTML = Bo, this.searchIcon.addEventListener("click", function (e) {
        return _this5.onClearSearch(e);
      }), this.searchContainer.appendChild(this.searchIcon), this.searchField.addEventListener("keydown", function (e) {
        return _this5.onKeyDown(e);
      }), this.searchField.addEventListener("keyup", function (e) {
        return _this5.onKeyUp(e);
      }), this.searchContainer;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.searchField.value = "";
    }
  }, {
    key: "focus",
    value: function focus() {
      this.searchField.focus();
    }
  }, {
    key: "onClearSearch",
    value: function onClearSearch(e) {
      var _this6 = this;

      e.stopPropagation(), this.searchField.value && (this.searchField.value = "", this.resultsContainer = null, this.options.icons && this.options.icons.search ? (_e(this.searchIcon), this.searchIcon.appendChild(Vo(this.options.icons.search))) : this.searchIcon.innerHTML = Bo, this.searchIcon.style.cursor = "default", this.events.emit("hideSearchResults"), setTimeout(function () {
        return _this6.searchField.focus();
      }));
    }
  }, {
    key: "setFocusedEmoji",
    value: function setFocusedEmoji(e) {
      if (this.resultsContainer) {
        var _o2 = this.resultsContainer.querySelectorAll("." + Ce);

        _o2[this.focusedEmojiIndex].tabIndex = -1, this.focusedEmojiIndex = e;
        var _n = _o2[this.focusedEmojiIndex];
        _n.tabIndex = 0, _n.focus();
      }
    }
  }, {
    key: "handleResultsKeydown",
    value: function handleResultsKeydown(e) {
      if (this.resultsContainer) {
        var _o3 = this.resultsContainer.querySelectorAll("." + Ce);

        "ArrowRight" === e.key ? this.setFocusedEmoji(Math.min(this.focusedEmojiIndex + 1, _o3.length - 1)) : "ArrowLeft" === e.key ? this.setFocusedEmoji(Math.max(0, this.focusedEmojiIndex - 1)) : "ArrowDown" === e.key ? (e.preventDefault(), this.focusedEmojiIndex < _o3.length - this.emojisPerRow && this.setFocusedEmoji(this.focusedEmojiIndex + this.emojisPerRow)) : "ArrowUp" === e.key ? (e.preventDefault(), this.focusedEmojiIndex >= this.emojisPerRow && this.setFocusedEmoji(this.focusedEmojiIndex - this.emojisPerRow)) : "Escape" === e.key && this.onClearSearch(e);
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      "Escape" === e.key && this.searchField.value && this.onClearSearch(e);
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      var _this7 = this;

      if ("Tab" !== e.key && "Shift" !== e.key) if (this.searchField.value) {
        this.options.icons && this.options.icons.clearSearch ? (_e(this.searchIcon), this.searchIcon.appendChild(Vo(this.options.icons.clearSearch))) : this.searchIcon.innerHTML = Ro, this.searchIcon.style.cursor = "pointer";

        var _e4 = Go.go(this.searchField.value, this.emojiData, {
          allowTypo: !0,
          limit: 100,
          key: "name"
        }).map(function (e) {
          return e.obj;
        });

        this.events.emit("hidePreview"), _e4.length ? (this.resultsContainer = new Wo(_e4, !0, this.events, this.options, !1).render(), this.resultsContainer && (this.resultsContainer.querySelector("." + Ce).tabIndex = 0, this.focusedEmojiIndex = 0, this.resultsContainer.addEventListener("keydown", function (e) {
          return _this7.handleResultsKeydown(e);
        }), this.events.emit("showSearchResults", this.resultsContainer))) : this.events.emit("showSearchResults", new Xo(this.i18n.notFound, this.options.icons && this.options.icons.notFound).render());
      } else this.options.icons && this.options.icons.search ? (_e(this.searchIcon), this.searchIcon.appendChild(Vo(this.options.icons.search))) : this.searchIcon.innerHTML = Bo, this.searchIcon.style.cursor = "default", this.events.emit("hideSearchResults");
    }
  }]);

  return Yo;
}();

var $o = /*#__PURE__*/function () {
  function $o(e, o, n) {
    _classCallCheck(this, $o);

    this.events = e, this.emoji = o, this.options = n, this.focusedEmojiIndex = 0;
  }

  _createClass($o, [{
    key: "getEmoji",
    value: function getEmoji(e) {
      return this.popup.querySelectorAll("." + Ce)[e];
    }
  }, {
    key: "setFocusedEmoji",
    value: function setFocusedEmoji(e) {
      this.getEmoji(this.focusedEmojiIndex).tabIndex = -1, this.focusedEmojiIndex = e;
      var o = this.getEmoji(this.focusedEmojiIndex);
      o.tabIndex = 0, o.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      this.popup = Ee("div", "emoji-picker__variant-popup");
      var e = Ee("div", "emoji-picker__variant-overlay");
      e.addEventListener("click", function (e) {
        e.stopPropagation(), _this8.popup.contains(e.target) || _this8.events.emit("hideVariantPopup");
      }), this.popup.appendChild(new Uo(this.emoji, !1, !1, this.events, this.options, !1).render()), (this.emoji.variations || []).forEach(function (e, o) {
        return _this8.popup.appendChild(new Uo({
          name: _this8.emoji.name,
          emoji: e,
          key: _this8.emoji.name + o
        }, !1, !1, _this8.events, _this8.options, !1).render());
      });
      var o = this.popup.querySelector("." + Ce);
      return this.focusedEmojiIndex = 0, o.tabIndex = 0, setTimeout(function () {
        return o.focus();
      }), this.popup.addEventListener("keydown", function (e) {
        "ArrowRight" === e.key ? _this8.setFocusedEmoji(Math.min(_this8.focusedEmojiIndex + 1, _this8.popup.querySelectorAll("." + Ce).length - 1)) : "ArrowLeft" === e.key ? _this8.setFocusedEmoji(Math.max(_this8.focusedEmojiIndex - 1, 0)) : "Escape" === e.key && (e.stopPropagation(), _this8.events.emit("hideVariantPopup"));
      }), e.appendChild(this.popup), e;
    }
  }]);

  return $o;
}();

var Zo = {
  search: "Search emojis...",
  categories: {
    recents: "Recent Emojis",
    smileys: "Smileys & Emotion",
    people: "People & Body",
    animals: "Animals & Nature",
    food: "Food & Drink",
    activities: "Activities",
    travel: "Travel & Places",
    objects: "Objects",
    symbols: "Symbols",
    flags: "Flags",
    custom: "Custom"
  },
  notFound: "No emojis found"
},
    Qo = {
  recents: Lo,
  smileys: Do,
  people: qo,
  animals: Io,
  food: So,
  activities: Mo,
  travel: Oo,
  objects: No,
  symbols: Fo,
  flags: Po,
  custom: To
};

var en = /*#__PURE__*/function () {
  function en(e, o, n) {
    _classCallCheck(this, en);

    this.options = e, this.events = o, this.i18n = n, this.activeButton = 0, this.buttons = [];
  }

  _createClass(en, [{
    key: "render",
    value: function render() {
      var _this9 = this;

      var e;
      var o = Ee("div", "emoji-picker__category-buttons"),
          n = this.options.categories || (null === (e = this.options.emojiData) || void 0 === e ? void 0 : e.categories) || xe.categories;
      var i = this.options.showRecents ? ["recents"].concat(_toConsumableArray(n)) : n;
      return this.options.custom && (i = [].concat(_toConsumableArray(i), ["custom"])), i.forEach(function (e) {
        var n = Ee("button", "emoji-picker__category-button");
        _this9.options.icons && _this9.options.icons.categories && _this9.options.icons.categories[e] ? n.appendChild(Vo(_this9.options.icons.categories[e])) : n.innerHTML = Qo[e], n.tabIndex = -1, n.title = _this9.i18n.categories[e], o.appendChild(n), _this9.buttons.push(n), n.addEventListener("click", function () {
          _this9.events.emit("categoryClicked", e);
        });
      }), o.addEventListener("keydown", function (e) {
        switch (e.key) {
          case "ArrowRight":
            _this9.events.emit("categoryClicked", i[(_this9.activeButton + 1) % _this9.buttons.length]);

            break;

          case "ArrowLeft":
            _this9.events.emit("categoryClicked", i[0 === _this9.activeButton ? _this9.buttons.length - 1 : _this9.activeButton - 1]);

            break;

          case "ArrowUp":
          case "ArrowDown":
            e.stopPropagation(), e.preventDefault();
        }
      }), o;
    }
  }, {
    key: "setActiveButton",
    value: function setActiveButton(e) {
      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !0;
      var n = this.buttons[this.activeButton];
      n.classList.remove("active"), n.tabIndex = -1, this.activeButton = e, n = this.buttons[this.activeButton], n.classList.add("active"), n.tabIndex = 0, o && n.focus();
    }
  }]);

  return en;
}();

var on = ["recents", "smileys", "people", "animals", "food", "activities", "travel", "objects", "symbols", "flags", "custom"];

var nn = /*#__PURE__*/function () {
  function nn(e, o, n, i) {
    var _this10 = this;

    _classCallCheck(this, nn);

    var a;
    this.events = e, this.i18n = o, this.options = n, this.emojiCategories = i, this.currentCategory = 0, this.headers = [], this.focusedIndex = 0, this.handleKeyDown = function (e) {
      switch (_this10.emojis.removeEventListener("scroll", _this10.highlightCategory), e.key) {
        case "ArrowRight":
          _this10.focusedEmoji.tabIndex = -1, _this10.focusedIndex === _this10.currentEmojiCount - 1 && _this10.currentCategory < _this10.categories.length - 1 ? (_this10.options.showCategoryButtons && _this10.categoryButtons.setActiveButton(++_this10.currentCategory), _this10.setFocusedEmoji(0)) : _this10.focusedIndex < _this10.currentEmojiCount - 1 && _this10.setFocusedEmoji(_this10.focusedIndex + 1);
          break;

        case "ArrowLeft":
          _this10.focusedEmoji.tabIndex = -1, 0 === _this10.focusedIndex && _this10.currentCategory > 0 ? (_this10.options.showCategoryButtons && _this10.categoryButtons.setActiveButton(--_this10.currentCategory), _this10.setFocusedEmoji(_this10.currentEmojiCount - 1)) : _this10.setFocusedEmoji(Math.max(0, _this10.focusedIndex - 1));
          break;

        case "ArrowDown":
          e.preventDefault(), _this10.focusedEmoji.tabIndex = -1, _this10.focusedIndex + _this10.emojisPerRow >= _this10.currentEmojiCount && _this10.currentCategory < _this10.categories.length - 1 ? (_this10.currentCategory++, _this10.options.showCategoryButtons && _this10.categoryButtons.setActiveButton(_this10.currentCategory), _this10.setFocusedEmoji(Math.min(_this10.focusedIndex % _this10.emojisPerRow, _this10.currentEmojiCount - 1))) : _this10.currentEmojiCount - _this10.focusedIndex > _this10.emojisPerRow && _this10.setFocusedEmoji(_this10.focusedIndex + _this10.emojisPerRow);
          break;

        case "ArrowUp":
          if (e.preventDefault(), _this10.focusedEmoji.tabIndex = -1, _this10.focusedIndex < _this10.emojisPerRow && _this10.currentCategory > 0) {
            var _e5 = _this10.getEmojiCount(_this10.currentCategory - 1);

            var _o4 = _e5 % _this10.emojisPerRow;

            0 === _o4 && (_o4 = _this10.emojisPerRow);

            var _n2 = _this10.focusedIndex,
                _i = _n2 > _o4 - 1 ? _e5 - 1 : _e5 - _o4 + _n2;

            _this10.currentCategory--, _this10.options.showCategoryButtons && _this10.categoryButtons.setActiveButton(_this10.currentCategory), _this10.setFocusedEmoji(_i);
          } else _this10.setFocusedEmoji(_this10.focusedIndex >= _this10.emojisPerRow ? _this10.focusedIndex - _this10.emojisPerRow : _this10.focusedIndex);

      }

      requestAnimationFrame(function () {
        return _this10.emojis.addEventListener("scroll", _this10.highlightCategory);
      });
    }, this.addCategory = function (e, o) {
      var n = Ee("h2", "emoji-picker__category-name");
      n.innerHTML = _this10.i18n.categories[e] || Zo.categories[e], _this10.emojis.appendChild(n), _this10.headers.push(n), _this10.emojis.appendChild(new Wo(o, !0, _this10.events, _this10.options, "recents" !== e).render());
    }, this.selectCategory = function (e) {
      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !0;
      _this10.emojis.removeEventListener("scroll", _this10.highlightCategory), _this10.focusedEmoji && (_this10.focusedEmoji.tabIndex = -1);

      var n = _this10.categories.indexOf(e);

      _this10.currentCategory = n, _this10.setFocusedEmoji(0, !1), _this10.options.showCategoryButtons && _this10.categoryButtons.setActiveButton(_this10.currentCategory, o);
      var i = _this10.headerOffsets[n];
      _this10.emojis.scrollTop = i, requestAnimationFrame(function () {
        return _this10.emojis.addEventListener("scroll", _this10.highlightCategory);
      });
    }, this.highlightCategory = function () {
      if (document.activeElement && document.activeElement.classList.contains("emoji-picker__emoji")) return;

      var e = _this10.headerOffsets.findIndex(function (e) {
        return e >= Math.round(_this10.emojis.scrollTop);
      });

      _this10.emojis.scrollTop + _this10.emojis.offsetHeight === _this10.emojis.scrollHeight && (e = -1), 0 === e ? e = 1 : e < 0 && (e = _this10.headerOffsets.length), _this10.headerOffsets[e] === _this10.emojis.scrollTop && e++, _this10.currentCategory = e - 1, _this10.options.showCategoryButtons && _this10.categoryButtons.setActiveButton(_this10.currentCategory);
    }, this.emojisPerRow = n.emojisPerRow || 8, this.categories = (null === (a = n.emojiData) || void 0 === a ? void 0 : a.categories) || n.categories || xe.categories, n.showRecents && (this.categories = ["recents"].concat(_toConsumableArray(this.categories))), n.custom && (this.categories = [].concat(_toConsumableArray(this.categories), ["custom"])), this.categories.sort(function (e, o) {
      return on.indexOf(e) - on.indexOf(o);
    });
  }

  _createClass(nn, [{
    key: "updateRecents",
    value: function updateRecents() {
      if (this.options.showRecents) {
        this.emojiCategories.recents = Ho();

        var _e6 = this.emojis.querySelector(".emoji-picker__container");

        _e6 && _e6.parentNode && _e6.parentNode.replaceChild(new Wo(this.emojiCategories.recents, !0, this.events, this.options, !1).render(), _e6);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this11 = this;

      this.container = Ee("div", "emoji-picker__emoji-area"), this.options.showCategoryButtons && (this.categoryButtons = new en(this.options, this.events, this.i18n), this.container.appendChild(this.categoryButtons.render())), this.emojis = Ee("div", "emoji-picker__emojis"), this.options.showRecents && (this.emojiCategories.recents = Ho()), this.options.custom && (this.emojiCategories.custom = this.options.custom.map(function (e) {
        return Object.assign(Object.assign({}, e), {
          custom: !0
        });
      })), this.categories.forEach(function (e) {
        return _this11.addCategory(e, _this11.emojiCategories[e]);
      }), requestAnimationFrame(function () {
        setTimeout(function () {
          setTimeout(function () {
            return _this11.emojis.addEventListener("scroll", _this11.highlightCategory);
          });
        });
      }), this.emojis.addEventListener("keydown", this.handleKeyDown), this.events.on("categoryClicked", this.selectCategory), this.container.appendChild(this.emojis);
      return this.container.querySelectorAll("." + Ce)[0].tabIndex = 0, this.container;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.headerOffsets = Array.prototype.map.call(this.headers, function (e) {
        return e.offsetTop;
      }), this.selectCategory(this.options.initialCategory || "smileys", !1), this.currentCategory = this.categories.indexOf(this.options.initialCategory || "smileys"), this.options.showCategoryButtons && this.categoryButtons.setActiveButton(this.currentCategory, !1);
    }
  }, {
    key: "currentCategoryEl",
    get: function get() {
      return this.emojis.querySelectorAll(".emoji-picker__container")[this.currentCategory];
    }
  }, {
    key: "focusedEmoji",
    get: function get() {
      return this.currentCategoryEl.querySelectorAll("." + Ce)[this.focusedIndex];
    }
  }, {
    key: "currentEmojiCount",
    get: function get() {
      return this.currentCategoryEl.querySelectorAll("." + Ce).length;
    }
  }, {
    key: "getEmojiCount",
    value: function getEmojiCount(e) {
      return this.emojis.querySelectorAll(".emoji-picker__container")[e].querySelectorAll("." + Ce).length;
    }
  }, {
    key: "setFocusedEmoji",
    value: function setFocusedEmoji(e) {
      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !0;
      this.focusedIndex = e, this.focusedEmoji && (this.focusedEmoji.tabIndex = 0, o && this.focusedEmoji.focus());
    }
  }]);

  return nn;
}();

var an = {
  position: "auto",
  autoHide: !0,
  autoFocusSearch: !0,
  showAnimation: !0,
  showPreview: !0,
  showSearch: !0,
  showRecents: !0,
  showVariants: !0,
  showCategoryButtons: !0,
  recentsCount: 50,
  emojiData: xe,
  emojiVersion: "12.1",
  theme: "light",
  categories: ["smileys", "people", "animals", "food", "activities", "travel", "objects", "symbols", "flags"],
  style: "native",
  twemojiOptions: {
    ext: ".svg",
    folder: "svg"
  },
  emojisPerRow: 8,
  rows: 6,
  emojiSize: "1.8em",
  initialCategory: "smileys"
};

var rn = /*#__PURE__*/function () {
  function rn() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, rn);

    this.events = new b(), this.publicEvents = new b(), this.pickerVisible = !1, this.options = Object.assign(Object.assign({}, an), e), this.options.rootElement || (this.options.rootElement = document.body), this.i18n = Object.assign(Object.assign({}, Zo), e.i18n), this.onDocumentClick = this.onDocumentClick.bind(this), this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.theme = this.options.theme || "light", this.emojiCategories = function (e) {
      var o = {};
      return e.emoji.forEach(function (n) {
        var i = o[e.categories[n.category || 0]];
        i || (i = o[e.categories[n.category || 0]] = []), i.push(n);
      }), o;
    }(this.options.emojiData || xe), this.buildPicker();
  }

  _createClass(rn, [{
    key: "on",
    value: function on(e, o) {
      this.publicEvents.on(e, o);
    }
  }, {
    key: "off",
    value: function off(e, o) {
      this.publicEvents.off(e, o);
    }
  }, {
    key: "setStyleProperties",
    value: function setStyleProperties() {
      var _this12 = this;

      this.options.showAnimation || this.pickerEl.style.setProperty("--animation-duration", "0s"), this.options.emojisPerRow && this.pickerEl.style.setProperty("--emoji-per-row", this.options.emojisPerRow.toString()), this.options.rows && this.pickerEl.style.setProperty("--row-count", this.options.rows.toString()), this.options.emojiSize && this.pickerEl.style.setProperty("--emoji-size", this.options.emojiSize), this.options.showCategoryButtons || this.pickerEl.style.setProperty("--category-button-height", "0"), this.options.styleProperties && Object.keys(this.options.styleProperties).forEach(function (e) {
        _this12.options.styleProperties && _this12.pickerEl.style.setProperty(e, _this12.options.styleProperties[e]);
      });
    }
  }, {
    key: "showSearchResults",
    value: function showSearchResults(e) {
      _e(this.pickerContent), e.classList.add("search-results"), this.pickerContent.appendChild(e);
    }
  }, {
    key: "hideSearchResults",
    value: function hideSearchResults() {
      this.pickerContent.firstChild !== this.emojiArea.container && (_e(this.pickerContent), this.pickerContent.appendChild(this.emojiArea.container)), this.emojiArea.reset();
    }
  }, {
    key: "emitEmoji",
    value: function emitEmoji(_ref) {
      var o = _ref.emoji,
          n = _ref.showVariants;
      return e(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this13 = this;

        var _e7;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(o.variations && n && this.options.showVariants)) {
                  _context.next = 4;
                  break;
                }

                this.showVariantPopup(o);
                _context.next = 20;
                break;

              case 4:
                setTimeout(function () {
                  return _this13.emojiArea.updateRecents();
                });

                if (!o.custom) {
                  _context.next = 9;
                  break;
                }

                _context.t0 = this.emitCustomEmoji(o);
                _context.next = 17;
                break;

              case 9:
                if (!("twemoji" === this.options.style)) {
                  _context.next = 15;
                  break;
                }

                _context.next = 12;
                return this.emitTwemoji(o);

              case 12:
                _context.t1 = _context.sent;
                _context.next = 16;
                break;

              case 15:
                _context.t1 = this.emitNativeEmoji(o);

              case 16:
                _context.t0 = _context.t1;

              case 17:
                _e7 = _context.t0;
                this.publicEvents.emit("emoji", _e7);
                this.options.autoHide && this.hidePicker();

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "emitNativeEmoji",
    value: function emitNativeEmoji(e) {
      return {
        emoji: e.emoji,
        name: e.name
      };
    }
  }, {
    key: "emitCustomEmoji",
    value: function emitCustomEmoji(e) {
      return {
        url: e.emoji,
        name: e.name,
        custom: !0
      };
    }
  }, {
    key: "emitTwemoji",
    value: function emitTwemoji(e) {
      var _this14 = this;

      return new Promise(function (o) {
        ke.parse(e.emoji, Object.assign(Object.assign({}, _this14.options.twemojiOptions), {
          callback: function callback(n, _ref2) {
            var i = _ref2.base,
                a = _ref2.size,
                r = _ref2.ext;
            var t = "".concat(i).concat(a, "/").concat(n).concat(r);
            return o({
              url: t,
              emoji: e.emoji,
              name: e.name
            }), t;
          }
        }));
      });
    }
  }, {
    key: "buildSearch",
    value: function buildSearch() {
      var _this15 = this;

      var e;
      this.options.showSearch && (this.search = new Yo(this.events, this.i18n, this.options, (null === (e = this.options.emojiData) || void 0 === e ? void 0 : e.emoji) || xe.emoji, (this.options.categories || []).map(function (e) {
        return (_this15.options.emojiData || xe).categories.indexOf(e);
      })), this.pickerEl.appendChild(this.search.render()));
    }
  }, {
    key: "buildPreview",
    value: function buildPreview() {
      this.options.showPreview && this.pickerEl.appendChild(new Oe(this.events, this.options).render());
    }
  }, {
    key: "initPlugins",
    value: function initPlugins() {
      var _this16 = this;

      if (this.options.plugins) {
        var _e8 = Ee("div", "emoji-picker__plugin-container");

        this.options.plugins.forEach(function (o) {
          if (!o.render) throw new Error('Emoji Button plugins must have a "render" function.');

          _e8.appendChild(o.render(_this16));
        }), this.pickerEl.appendChild(_e8);
      }
    }
  }, {
    key: "initFocusTrap",
    value: function initFocusTrap() {
      this.focusTrap = h(this.pickerEl, {
        clickOutsideDeactivates: !0,
        initialFocus: this.options.showSearch && this.options.autoFocusSearch ? ".emoji-picker__search" : '.emoji-picker__emoji[tabindex="0"]'
      });
    }
  }, {
    key: "buildPicker",
    value: function buildPicker() {
      this.pickerEl = Ee("div", "emoji-picker"), this.pickerEl.classList.add(this.theme), this.setStyleProperties(), this.initFocusTrap(), this.pickerContent = Ee("div", "emoji-picker__content"), this.initPlugins(), this.buildSearch(), this.pickerEl.appendChild(this.pickerContent), this.emojiArea = new nn(this.events, this.i18n, this.options, this.emojiCategories), this.pickerContent.appendChild(this.emojiArea.render()), this.events.on("showSearchResults", this.showSearchResults.bind(this)), this.events.on("hideSearchResults", this.hideSearchResults.bind(this)), this.events.on("emoji", this.emitEmoji.bind(this)), this.buildPreview(), this.wrapper = Ee("div", "emoji-picker__wrapper"), this.wrapper.appendChild(this.pickerEl), this.wrapper.style.display = "none", this.options.zIndex && (this.wrapper.style.zIndex = this.options.zIndex + ""), this.options.rootElement && this.options.rootElement.appendChild(this.wrapper), this.observeForLazyLoad();
    }
  }, {
    key: "showVariantPopup",
    value: function showVariantPopup(e) {
      var _this17 = this;

      var o = new $o(this.events, e, this.options).render();
      o && this.pickerEl.appendChild(o), this.events.on("hideVariantPopup", function () {
        o && (o.classList.add("hiding"), setTimeout(function () {
          o && _this17.pickerEl.removeChild(o);
        }, 175)), _this17.events.off("hideVariantPopup");
      });
    }
  }, {
    key: "observeForLazyLoad",
    value: function observeForLazyLoad() {
      var _this18 = this;

      this.observer = new IntersectionObserver(this.handleIntersectionChange.bind(this), {
        root: this.emojiArea.emojis
      }), this.emojiArea.emojis.querySelectorAll("." + Ce).forEach(function (e) {
        _this18.shouldLazyLoad(e) && _this18.observer.observe(e);
      });
    }
  }, {
    key: "handleIntersectionChange",
    value: function handleIntersectionChange(e) {
      var _this19 = this;

      Array.prototype.filter.call(e, function (e) {
        return e.intersectionRatio > 0;
      }).map(function (e) {
        return e.target;
      }).forEach(function (e) {
        ze(e, _this19.options);
      });
    }
  }, {
    key: "shouldLazyLoad",
    value: function shouldLazyLoad(e) {
      return "twemoji" === this.options.style || "true" === e.dataset.custom;
    }
  }, {
    key: "onDocumentClick",
    value: function onDocumentClick(e) {
      this.pickerEl.contains(e.target) || this.hidePicker();
    }
  }, {
    key: "destroyPicker",
    value: function destroyPicker() {
      this.events.off("emoji"), this.events.off("hideVariantPopup"), this.options.rootElement && (this.options.rootElement.removeChild(this.wrapper), this.popper && this.popper.destroy()), this.observer && this.observer.disconnect(), this.options.plugins && this.options.plugins.forEach(function (e) {
        e.destroy && e.destroy();
      });
    }
  }, {
    key: "hidePicker",
    value: function hidePicker() {
      var _this20 = this;

      this.hideInProgress = !0, this.focusTrap.deactivate(), this.pickerVisible = !1, this.overlay && (document.body.removeChild(this.overlay), this.overlay = void 0), this.emojiArea.emojis.removeEventListener("scroll", this.emojiArea.highlightCategory), this.pickerEl.classList.add("hiding"), setTimeout(function () {
        _this20.wrapper.style.display = "none", _this20.pickerEl.classList.remove("hiding"), _this20.pickerContent.firstChild !== _this20.emojiArea.container && (_e(_this20.pickerContent), _this20.pickerContent.appendChild(_this20.emojiArea.container)), _this20.search && _this20.search.clear(), _this20.events.emit("hideVariantPopup"), _this20.hideInProgress = !1, _this20.popper && _this20.popper.destroy(), _this20.publicEvents.emit("hidden");
      }, this.options.showAnimation ? 170 : 0), setTimeout(function () {
        document.removeEventListener("click", _this20.onDocumentClick), document.removeEventListener("keydown", _this20.onDocumentKeydown);
      });
    }
  }, {
    key: "showPicker",
    value: function showPicker(e) {
      var _this21 = this;

      this.hideInProgress ? setTimeout(function () {
        return _this21.showPicker(e);
      }, 100) : (this.pickerVisible = !0, this.wrapper.style.display = "block", this.determineDisplay(e), this.focusTrap.activate(), setTimeout(function () {
        _this21.addEventListeners(), _this21.setInitialFocus();
      }), this.emojiArea.reset());
    }
  }, {
    key: "determineDisplay",
    value: function determineDisplay(e) {
      window.matchMedia("screen and (max-width: 450px)").matches ? this.showMobileView() : "string" == typeof this.options.position ? this.setRelativePosition(e) : this.setFixedPosition();
    }
  }, {
    key: "setInitialFocus",
    value: function setInitialFocus() {
      this.pickerEl.querySelector(this.options.showSearch && this.options.autoFocusSearch ? ".emoji-picker__search" : ".".concat(Ce, "[tabindex=\"0\"]")).focus();
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      document.addEventListener("click", this.onDocumentClick), document.addEventListener("keydown", this.onDocumentKeydown);
    }
  }, {
    key: "setRelativePosition",
    value: function setRelativePosition(e) {
      this.popper = we(e, this.wrapper, {
        placement: this.options.position
      });
    }
  }, {
    key: "setFixedPosition",
    value: function setFixedPosition() {
      var _this22 = this;

      var e;

      if (null === (e = this.options) || void 0 === e ? void 0 : e.position) {
        this.wrapper.style.position = "fixed";
        var _e9 = this.options.position;
        Object.keys(_e9).forEach(function (o) {
          _this22.wrapper.style[o] = _e9[o];
        });
      }
    }
  }, {
    key: "showMobileView",
    value: function showMobileView() {
      var e = window.getComputedStyle(this.pickerEl),
          o = document.querySelector("html"),
          n = o && o.clientHeight,
          i = o && o.clientWidth,
          a = parseInt(e.height),
          r = n ? n / 2 - a / 2 : 0,
          t = parseInt(e.width),
          s = i ? i / 2 - t / 2 : 0;
      this.wrapper.style.position = "fixed", this.wrapper.style.top = r + "px", this.wrapper.style.left = s + "px", this.wrapper.style.zIndex = "5000", this.overlay = Ee("div", "emoji-picker__overlay"), document.body.appendChild(this.overlay);
    }
  }, {
    key: "togglePicker",
    value: function togglePicker(e) {
      this.pickerVisible ? this.hidePicker() : this.showPicker(e);
    }
  }, {
    key: "isPickerVisible",
    value: function isPickerVisible() {
      return this.pickerVisible;
    }
  }, {
    key: "onDocumentKeydown",
    value: function onDocumentKeydown(e) {
      "Escape" === e.key ? this.hidePicker() : "Tab" === e.key ? this.pickerEl.classList.add("keyboard") : e.key.match(/^[\w]$/) && this.search && this.search.focus();
    }
  }, {
    key: "setTheme",
    value: function setTheme(e) {
      e !== this.theme && (this.pickerEl.classList.remove(this.theme), this.theme = e, this.pickerEl.classList.add(e));
    }
  }]);

  return rn;
}();

exports.EmojiButton = rn;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":13}],4:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3099:
/***/ (function(module) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ 6077:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),

/***/ 1223:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);
var create = __webpack_require__(30);
var definePropertyModule = __webpack_require__(3070);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 1530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(8710).charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ 5787:
/***/ (function(module) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),

/***/ 9670:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),

/***/ 4019:
/***/ (function(module) {

module.exports = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';


/***/ }),

/***/ 260:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(4019);
var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);
var has = __webpack_require__(6656);
var classof = __webpack_require__(648);
var createNonEnumerableProperty = __webpack_require__(8880);
var redefine = __webpack_require__(1320);
var defineProperty = __webpack_require__(3070).f;
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var wellKnownSymbol = __webpack_require__(5112);
var uid = __webpack_require__(9711);

var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var isPrototypeOf = ObjectPrototype.isPrototypeOf;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || has(TypedArrayConstructorsList, klass)
    || has(BigIntArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return has(TypedArrayConstructorsList, klass)
    || has(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (setPrototypeOf) {
    if (isPrototypeOf.call(TypedArray, C)) return C;
  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
      return C;
    }
  } throw TypeError('Target is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
      delete TypedArrayConstructor.prototype[KEY];
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
        delete TypedArrayConstructor[KEY];
      }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ 3331:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(7854);
var DESCRIPTORS = __webpack_require__(9781);
var NATIVE_ARRAY_BUFFER = __webpack_require__(4019);
var createNonEnumerableProperty = __webpack_require__(8880);
var redefineAll = __webpack_require__(2248);
var fails = __webpack_require__(7293);
var anInstance = __webpack_require__(5787);
var toInteger = __webpack_require__(9958);
var toLength = __webpack_require__(7466);
var toIndex = __webpack_require__(7067);
var IEEE754 = __webpack_require__(1179);
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var getOwnPropertyNames = __webpack_require__(8006).f;
var defineProperty = __webpack_require__(3070).f;
var arrayFill = __webpack_require__(1285);
var setToStringTag = __webpack_require__(8003);
var InternalStateModule = __webpack_require__(9909);

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global[DATA_VIEW];
var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype = Object.prototype;
var RangeError = global.RangeError;

var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
  /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new NativeArrayBuffer(toIndex(length));
    };
    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];
    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (setPrototypeOf && getPrototypeOf($DataViewPrototype) !== ObjectPrototype) {
    setPrototypeOf($DataViewPrototype, ObjectPrototype);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var nativeSetInt8 = $DataViewPrototype.setInt8;
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

module.exports = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};


/***/ }),

/***/ 1048:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(7908);
var toAbsoluteIndex = __webpack_require__(1400);
var toLength = __webpack_require__(7466);

var min = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),

/***/ 1285:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(7908);
var toAbsoluteIndex = __webpack_require__(1400);
var toLength = __webpack_require__(7466);

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ 8533:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(2092).forEach;
var arrayMethodIsStrict = __webpack_require__(9341);

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),

/***/ 8457:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(9974);
var toObject = __webpack_require__(7908);
var callWithSafeIterationClosing = __webpack_require__(3411);
var isArrayIteratorMethod = __webpack_require__(7659);
var toLength = __webpack_require__(7466);
var createProperty = __webpack_require__(6135);
var getIteratorMethod = __webpack_require__(1246);

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(5656);
var toLength = __webpack_require__(7466);
var toAbsoluteIndex = __webpack_require__(1400);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 2092:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(9974);
var IndexedObject = __webpack_require__(8361);
var toObject = __webpack_require__(7908);
var toLength = __webpack_require__(7466);
var arraySpeciesCreate = __webpack_require__(5417);

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_OUT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterOut
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterOut` method
  // https://github.com/tc39/proposal-array-filtering
  filterOut: createMethod(7)
};


/***/ }),

/***/ 6583:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(5656);
var toInteger = __webpack_require__(9958);
var toLength = __webpack_require__(7466);
var arrayMethodIsStrict = __webpack_require__(9341);

var min = Math.min;
var nativeLastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('lastIndexOf');
var FORCED = NEGATIVE_ZERO || !STRICT_METHOD;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
module.exports = FORCED ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = toLength(O.length);
  var index = length - 1;
  if (arguments.length > 1) index = min(index, toInteger(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : nativeLastIndexOf;


/***/ }),

/***/ 1194:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var V8_VERSION = __webpack_require__(7392);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ 9341:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(7293);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),

/***/ 3671:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aFunction = __webpack_require__(3099);
var toObject = __webpack_require__(7908);
var IndexedObject = __webpack_require__(8361);
var toLength = __webpack_require__(7466);

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ 5417:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);
var isArray = __webpack_require__(3157);
var wellKnownSymbol = __webpack_require__(5112);

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),

/***/ 3411:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);
var iteratorClose = __webpack_require__(9212);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};


/***/ }),

/***/ 7072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ 4326:
/***/ (function(module) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 648:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var classofRaw = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),

/***/ 9920:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var has = __webpack_require__(6656);
var ownKeys = __webpack_require__(3887);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),

/***/ 8544:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 4994:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__(3383).IteratorPrototype;
var create = __webpack_require__(30);
var createPropertyDescriptor = __webpack_require__(9114);
var setToStringTag = __webpack_require__(8003);
var Iterators = __webpack_require__(7497);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ 8880:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 9114:
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 6135:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(7593);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ 654:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var createIteratorConstructor = __webpack_require__(4994);
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var setToStringTag = __webpack_require__(8003);
var createNonEnumerableProperty = __webpack_require__(8880);
var redefine = __webpack_require__(1320);
var wellKnownSymbol = __webpack_require__(5112);
var IS_PURE = __webpack_require__(1913);
var Iterators = __webpack_require__(7497);
var IteratorsCore = __webpack_require__(3383);

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),

/***/ 9781:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ 317:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 8324:
/***/ (function(module) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ 8113:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ 7392:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var userAgent = __webpack_require__(8113);

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),

/***/ 748:
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 2109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = __webpack_require__(1236).f;
var createNonEnumerableProperty = __webpack_require__(8880);
var redefine = __webpack_require__(1320);
var setGlobal = __webpack_require__(3505);
var copyConstructorProperties = __webpack_require__(9920);
var isForced = __webpack_require__(4705);

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7293:
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 7007:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(4916);
var redefine = __webpack_require__(1320);
var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var regexpExec = __webpack_require__(2261);
var createNonEnumerableProperty = __webpack_require__(8880);

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};


/***/ }),

/***/ 9974:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aFunction = __webpack_require__(3099);

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 5005:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var path = __webpack_require__(857);
var global = __webpack_require__(7854);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 1246:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(648);
var Iterators = __webpack_require__(7497);
var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ 8554:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);
var getIteratorMethod = __webpack_require__(1246);

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};


/***/ }),

/***/ 647:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toObject = __webpack_require__(7908);

var floor = Math.floor;
var replace = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace.call(replacement, symbols, function (match, ch) {
    var capture;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ }),

/***/ 7854:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  /* global globalThis -- safe */
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 6656:
/***/ (function(module) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 3501:
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ 490:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 4664:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var createElement = __webpack_require__(317);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ 1179:
/***/ (function(module) {

// IEEE754 conversions based on https://github.com/feross/ieee754
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = new Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor(log(number) / LN2);
    if (number * (c = pow(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};

module.exports = {
  pack: pack,
  unpack: unpack
};


/***/ }),

/***/ 8361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var classof = __webpack_require__(4326);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),

/***/ 9587:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);
var setPrototypeOf = __webpack_require__(7674);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 2788:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var store = __webpack_require__(5465);

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 9909:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(8536);
var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);
var createNonEnumerableProperty = __webpack_require__(8880);
var objectHas = __webpack_require__(6656);
var shared = __webpack_require__(5465);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 7659:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);
var Iterators = __webpack_require__(7497);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 3157:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(4326);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),

/***/ 4705:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 111:
/***/ (function(module) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 1913:
/***/ (function(module) {

module.exports = false;


/***/ }),

/***/ 7850:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);
var classof = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),

/***/ 9212:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);

module.exports = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};


/***/ }),

/***/ 3383:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(7293);
var getPrototypeOf = __webpack_require__(9518);
var createNonEnumerableProperty = __webpack_require__(8880);
var has = __webpack_require__(6656);
var wellKnownSymbol = __webpack_require__(5112);
var IS_PURE = __webpack_require__(1913);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ((!IS_PURE || NEW_ITERATOR_PROTOTYPE) && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ 7497:
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ 133:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  /* global Symbol -- required for testing */
  return !String(Symbol());
});


/***/ }),

/***/ 590:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var IS_PURE = __webpack_require__(1913);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (IS_PURE && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});


/***/ }),

/***/ 8536:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var inspectSource = __webpack_require__(2788);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ 1574:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var objectKeys = __webpack_require__(1956);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var propertyIsEnumerableModule = __webpack_require__(5296);
var toObject = __webpack_require__(7908);
var IndexedObject = __webpack_require__(8361);

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  /* global Symbol -- required for testing */
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;


/***/ }),

/***/ 30:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);
var defineProperties = __webpack_require__(6048);
var enumBugKeys = __webpack_require__(748);
var hiddenKeys = __webpack_require__(3501);
var html = __webpack_require__(490);
var documentCreateElement = __webpack_require__(317);
var sharedKey = __webpack_require__(6200);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject -- old IE */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),

/***/ 6048:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var anObject = __webpack_require__(9670);
var objectKeys = __webpack_require__(1956);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),

/***/ 3070:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var IE8_DOM_DEFINE = __webpack_require__(4664);
var anObject = __webpack_require__(9670);
var toPrimitive = __webpack_require__(7593);

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 1236:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createPropertyDescriptor = __webpack_require__(9114);
var toIndexedObject = __webpack_require__(5656);
var toPrimitive = __webpack_require__(7593);
var has = __webpack_require__(6656);
var IE8_DOM_DEFINE = __webpack_require__(4664);

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),

/***/ 8006:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 5181:
/***/ (function(__unused_webpack_module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 9518:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var has = __webpack_require__(6656);
var toObject = __webpack_require__(7908);
var sharedKey = __webpack_require__(6200);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 6324:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var has = __webpack_require__(6656);
var toIndexedObject = __webpack_require__(5656);
var indexOf = __webpack_require__(1318).indexOf;
var hiddenKeys = __webpack_require__(3501);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 1956:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 5296:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),

/***/ 7674:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var anObject = __webpack_require__(9670);
var aPossiblePrototype = __webpack_require__(6077);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 288:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var classof = __webpack_require__(648);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ 3887:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var anObject = __webpack_require__(9670);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 857:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

module.exports = global;


/***/ }),

/***/ 2248:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var redefine = __webpack_require__(1320);

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ 1320:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var createNonEnumerableProperty = __webpack_require__(8880);
var has = __webpack_require__(6656);
var setGlobal = __webpack_require__(3505);
var inspectSource = __webpack_require__(2788);
var InternalStateModule = __webpack_require__(9909);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});


/***/ }),

/***/ 7651:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(4326);
var regexpExec = __webpack_require__(2261);

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),

/***/ 2261:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var regexpFlags = __webpack_require__(7066);
var stickyHelpers = __webpack_require__(2999);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
// eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ 7066:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(9670);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ 2999:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(7293);

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

exports.UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});


/***/ }),

/***/ 4488:
/***/ (function(module) {

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 3505:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var createNonEnumerableProperty = __webpack_require__(8880);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 6340:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(5005);
var definePropertyModule = __webpack_require__(3070);
var wellKnownSymbol = __webpack_require__(5112);
var DESCRIPTORS = __webpack_require__(9781);

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ 8003:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = __webpack_require__(3070).f;
var has = __webpack_require__(6656);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ 6200:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(2309);
var uid = __webpack_require__(9711);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 5465:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var setGlobal = __webpack_require__(3505);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),

/***/ 2309:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(1913);
var store = __webpack_require__(5465);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.9.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ 6707:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);
var aFunction = __webpack_require__(3099);
var wellKnownSymbol = __webpack_require__(5112);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),

/***/ 8710:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toInteger = __webpack_require__(9958);
var requireObjectCoercible = __webpack_require__(4488);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ 3197:
/***/ (function(module) {

"use strict";

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line max-statements -- TODO
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

module.exports = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};


/***/ }),

/***/ 6091:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var whitespaces = __webpack_require__(1361);

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};


/***/ }),

/***/ 3111:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(4488);
var whitespaces = __webpack_require__(1361);

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),

/***/ 1400:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toInteger = __webpack_require__(9958);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 7067:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toInteger = __webpack_require__(9958);
var toLength = __webpack_require__(7466);

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};


/***/ }),

/***/ 5656:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(8361);
var requireObjectCoercible = __webpack_require__(4488);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 9958:
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),

/***/ 7466:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toInteger = __webpack_require__(9958);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 7908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(4488);

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 4590:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPositiveInteger = __webpack_require__(3002);

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ 3002:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toInteger = __webpack_require__(9958);

module.exports = function (it) {
  var result = toInteger(it);
  if (result < 0) throw RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ 7593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 1694:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 9843:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var global = __webpack_require__(7854);
var DESCRIPTORS = __webpack_require__(9781);
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = __webpack_require__(3832);
var ArrayBufferViewCore = __webpack_require__(260);
var ArrayBufferModule = __webpack_require__(3331);
var anInstance = __webpack_require__(5787);
var createPropertyDescriptor = __webpack_require__(9114);
var createNonEnumerableProperty = __webpack_require__(8880);
var toLength = __webpack_require__(7466);
var toIndex = __webpack_require__(7067);
var toOffset = __webpack_require__(4590);
var toPrimitive = __webpack_require__(7593);
var has = __webpack_require__(6656);
var classof = __webpack_require__(648);
var isObject = __webpack_require__(111);
var create = __webpack_require__(30);
var setPrototypeOf = __webpack_require__(7674);
var getOwnPropertyNames = __webpack_require__(8006).f;
var typedArrayFrom = __webpack_require__(7321);
var forEach = __webpack_require__(2092).forEach;
var setSpecies = __webpack_require__(6340);
var definePropertyModule = __webpack_require__(3070);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var InternalStateModule = __webpack_require__(9909);
var inheritIfRequired = __webpack_require__(9587);

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var round = Math.round;
var RangeError = global.RangeError;
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = ArrayBufferViewCore.TypedArray;
var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = ArrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && typeof key != 'symbol'
    && key in target
    && String(+key) == String(key);
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  return isTypedArrayIndex(target, key = toPrimitive(key, true))
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
    && isObject(descriptor)
    && has(descriptor, 'value')
    && !has(descriptor, 'get')
    && !has(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!has(descriptor, 'writable') || descriptor.writable)
    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (DESCRIPTORS) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  $({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    $({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };


/***/ }),

/***/ 3832:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-new -- required for testing */
var global = __webpack_require__(7854);
var fails = __webpack_require__(7293);
var checkCorrectnessOfIteration = __webpack_require__(7072);
var NATIVE_ARRAY_BUFFER_VIEWS = __webpack_require__(260).NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer = global.ArrayBuffer;
var Int8Array = global.Int8Array;

module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});


/***/ }),

/***/ 3074:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aTypedArrayConstructor = __webpack_require__(260).aTypedArrayConstructor;
var speciesConstructor = __webpack_require__(6707);

module.exports = function (instance, list) {
  var C = speciesConstructor(instance, instance.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
};


/***/ }),

/***/ 7321:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toObject = __webpack_require__(7908);
var toLength = __webpack_require__(7466);
var getIteratorMethod = __webpack_require__(1246);
var isArrayIteratorMethod = __webpack_require__(7659);
var bind = __webpack_require__(9974);
var aTypedArrayConstructor = __webpack_require__(260).aTypedArrayConstructor;

module.exports = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    O = [];
    while (!(step = next.call(iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2], 2);
  }
  length = toLength(O.length);
  result = new (aTypedArrayConstructor(this))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};


/***/ }),

/***/ 9711:
/***/ (function(module) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),

/***/ 3307:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(133);

module.exports = NATIVE_SYMBOL
  /* global Symbol -- safe */
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 5112:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var shared = __webpack_require__(2309);
var has = __webpack_require__(6656);
var uid = __webpack_require__(9711);
var NATIVE_SYMBOL = __webpack_require__(133);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 1361:
/***/ (function(module) {

// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ 8264:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var global = __webpack_require__(7854);
var arrayBufferModule = __webpack_require__(3331);
var setSpecies = __webpack_require__(6340);

var ARRAY_BUFFER = 'ArrayBuffer';
var ArrayBuffer = arrayBufferModule[ARRAY_BUFFER];
var NativeArrayBuffer = global[ARRAY_BUFFER];

// `ArrayBuffer` constructor
// https://tc39.es/ecma262/#sec-arraybuffer-constructor
$({ global: true, forced: NativeArrayBuffer !== ArrayBuffer }, {
  ArrayBuffer: ArrayBuffer
});

setSpecies(ARRAY_BUFFER);


/***/ }),

/***/ 2222:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var isArray = __webpack_require__(3157);
var isObject = __webpack_require__(111);
var toObject = __webpack_require__(7908);
var toLength = __webpack_require__(7466);
var createProperty = __webpack_require__(6135);
var arraySpeciesCreate = __webpack_require__(5417);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);
var wellKnownSymbol = __webpack_require__(5112);
var V8_VERSION = __webpack_require__(7392);

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ 7327:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $filter = __webpack_require__(2092).filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 2772:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $indexOf = __webpack_require__(1318).indexOf;
var arrayMethodIsStrict = __webpack_require__(9341);

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 6992:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(5656);
var addToUnscopables = __webpack_require__(1223);
var Iterators = __webpack_require__(7497);
var InternalStateModule = __webpack_require__(9909);
var defineIterator = __webpack_require__(654);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ 1249:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $map = __webpack_require__(2092).map;
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 7042:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var isObject = __webpack_require__(111);
var isArray = __webpack_require__(3157);
var toAbsoluteIndex = __webpack_require__(1400);
var toLength = __webpack_require__(7466);
var toIndexedObject = __webpack_require__(5656);
var createProperty = __webpack_require__(6135);
var wellKnownSymbol = __webpack_require__(5112);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ 561:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var toAbsoluteIndex = __webpack_require__(1400);
var toInteger = __webpack_require__(9958);
var toLength = __webpack_require__(7466);
var toObject = __webpack_require__(7908);
var arraySpeciesCreate = __webpack_require__(5417);
var createProperty = __webpack_require__(6135);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ 8309:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var defineProperty = __webpack_require__(3070).f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ 489:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var toObject = __webpack_require__(7908);
var nativeGetPrototypeOf = __webpack_require__(9518);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});



/***/ }),

/***/ 1539:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var redefine = __webpack_require__(1320);
var toString = __webpack_require__(288);

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ 4916:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var exec = __webpack_require__(2261);

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ 9714:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__(1320);
var anObject = __webpack_require__(9670);
var fails = __webpack_require__(7293);
var flags = __webpack_require__(7066);

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),

/***/ 8783:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(8710).charAt;
var InternalStateModule = __webpack_require__(9909);
var defineIterator = __webpack_require__(654);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ 4723:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(7007);
var anObject = __webpack_require__(9670);
var toLength = __webpack_require__(7466);
var requireObjectCoercible = __webpack_require__(4488);
var advanceStringIndex = __webpack_require__(1530);
var regExpExec = __webpack_require__(7651);

// @@match logic
fixRegExpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ 5306:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(7007);
var anObject = __webpack_require__(9670);
var toLength = __webpack_require__(7466);
var toInteger = __webpack_require__(9958);
var requireObjectCoercible = __webpack_require__(4488);
var advanceStringIndex = __webpack_require__(1530);
var getSubstitution = __webpack_require__(647);
var regExpExec = __webpack_require__(7651);

var max = Math.max;
var min = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
});


/***/ }),

/***/ 3123:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(7007);
var isRegExp = __webpack_require__(7850);
var anObject = __webpack_require__(9670);
var requireObjectCoercible = __webpack_require__(4488);
var speciesConstructor = __webpack_require__(6707);
var advanceStringIndex = __webpack_require__(1530);
var toLength = __webpack_require__(7466);
var callRegExpExec = __webpack_require__(7651);
var regexpExec = __webpack_require__(2261);
var fails = __webpack_require__(7293);

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);


/***/ }),

/***/ 3210:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $trim = __webpack_require__(3111).trim;
var forcedStringTrimMethod = __webpack_require__(6091);

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ }),

/***/ 2990:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $copyWithin = __webpack_require__(1048);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod('copyWithin', function copyWithin(target, start /* , end */) {
  return $copyWithin.call(aTypedArray(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});


/***/ }),

/***/ 8927:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $every = __webpack_require__(2092).every;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod('every', function every(callbackfn /* , thisArg */) {
  return $every(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 3105:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $fill = __webpack_require__(1285);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
// eslint-disable-next-line no-unused-vars -- required for `.length`
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  return $fill.apply(aTypedArray(this), arguments);
});


/***/ }),

/***/ 5035:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $filter = __webpack_require__(2092).filter;
var fromSpeciesAndList = __webpack_require__(3074);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return fromSpeciesAndList(this, list);
});


/***/ }),

/***/ 7174:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $findIndex = __webpack_require__(2092).findIndex;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 4345:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $find = __webpack_require__(2092).find;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod('find', function find(predicate /* , thisArg */) {
  return $find(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 2846:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $forEach = __webpack_require__(2092).forEach;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 4731:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $includes = __webpack_require__(1318).includes;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod('includes', function includes(searchElement /* , fromIndex */) {
  return $includes(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 7209:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $indexOf = __webpack_require__(1318).indexOf;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 6319:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(7854);
var ArrayBufferViewCore = __webpack_require__(260);
var ArrayIterators = __webpack_require__(6992);
var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');
var Uint8Array = global.Uint8Array;
var arrayValues = ArrayIterators.values;
var arrayKeys = ArrayIterators.keys;
var arrayEntries = ArrayIterators.entries;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR];

var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

var typedArrayValues = function values() {
  return arrayValues.call(aTypedArray(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod('entries', function entries() {
  return arrayEntries.call(aTypedArray(this));
});
// `%TypedArray%.prototype.keys` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod('keys', function keys() {
  return arrayKeys.call(aTypedArray(this));
});
// `%TypedArray%.prototype.values` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod('values', typedArrayValues, !CORRECT_ITER_NAME);
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod(ITERATOR, typedArrayValues, !CORRECT_ITER_NAME);


/***/ }),

/***/ 8867:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $join = [].join;

// `%TypedArray%.prototype.join` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
// eslint-disable-next-line no-unused-vars -- required for `.length`
exportTypedArrayMethod('join', function join(separator) {
  return $join.apply(aTypedArray(this), arguments);
});


/***/ }),

/***/ 7789:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $lastIndexOf = __webpack_require__(6583);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
// eslint-disable-next-line no-unused-vars -- required for `.length`
exportTypedArrayMethod('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  return $lastIndexOf.apply(aTypedArray(this), arguments);
});


/***/ }),

/***/ 3739:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $map = __webpack_require__(2092).map;
var speciesConstructor = __webpack_require__(6707);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod('map', function map(mapfn /* , thisArg */) {
  return $map(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (aTypedArrayConstructor(speciesConstructor(O, O.constructor)))(length);
  });
});


/***/ }),

/***/ 4483:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $reduceRight = __webpack_require__(3671).right;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRicht` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  return $reduceRight(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 9368:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $reduce = __webpack_require__(3671).left;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod('reduce', function reduce(callbackfn /* , initialValue */) {
  return $reduce(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 2056:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var floor = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod('reverse', function reverse() {
  var that = this;
  var length = aTypedArray(that).length;
  var middle = floor(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});


/***/ }),

/***/ 3462:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var toLength = __webpack_require__(7466);
var toOffset = __webpack_require__(4590);
var toObject = __webpack_require__(7908);
var fails = __webpack_require__(7293);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var FORCED = fails(function () {
  /* global Int8Array -- safe */
  new Int8Array(1).set({});
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var length = this.length;
  var src = toObject(arrayLike);
  var len = toLength(src.length);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, FORCED);


/***/ }),

/***/ 678:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var speciesConstructor = __webpack_require__(6707);
var fails = __webpack_require__(7293);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $slice = [].slice;

var FORCED = fails(function () {
  /* global Int8Array -- safe */
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod('slice', function slice(start, end) {
  var list = $slice.call(aTypedArray(this), start, end);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED);


/***/ }),

/***/ 7462:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var $some = __webpack_require__(2092).some;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod('some', function some(callbackfn /* , thisArg */) {
  return $some(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 3824:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $sort = [].sort;

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  return $sort.call(aTypedArray(this), comparefn);
});


/***/ }),

/***/ 5021:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var toLength = __webpack_require__(7466);
var toAbsoluteIndex = __webpack_require__(1400);
var speciesConstructor = __webpack_require__(6707);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod('subarray', function subarray(begin, end) {
  var O = aTypedArray(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  return new (speciesConstructor(O, O.constructor))(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
  );
});


/***/ }),

/***/ 2974:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(7854);
var ArrayBufferViewCore = __webpack_require__(260);
var fails = __webpack_require__(7293);

var Int8Array = global.Int8Array;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;
var $slice = [].slice;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array && fails(function () {
  $toLocaleString.call(new Int8Array(1));
});

var FORCED = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod('toLocaleString', function toLocaleString() {
  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice.call(aTypedArray(this)) : aTypedArray(this), arguments);
}, FORCED);


/***/ }),

/***/ 5016:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var exportTypedArrayMethod = __webpack_require__(260).exportTypedArrayMethod;
var fails = __webpack_require__(7293);
var global = __webpack_require__(7854);

var Uint8Array = global.Uint8Array;
var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {};
var arrayToString = [].toString;
var arrayJoin = [].join;

if (fails(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return arrayJoin.call(this);
  };
}

var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);


/***/ }),

/***/ 2472:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var createTypedArrayConstructor = __webpack_require__(9843);

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),

/***/ 4747:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var DOMIterables = __webpack_require__(8324);
var forEach = __webpack_require__(8533);
var createNonEnumerableProperty = __webpack_require__(8880);

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),

/***/ 3948:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var DOMIterables = __webpack_require__(8324);
var ArrayIteratorMethods = __webpack_require__(6992);
var createNonEnumerableProperty = __webpack_require__(8880);
var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ }),

/***/ 1637:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(6992);
var $ = __webpack_require__(2109);
var getBuiltIn = __webpack_require__(5005);
var USE_NATIVE_URL = __webpack_require__(590);
var redefine = __webpack_require__(1320);
var redefineAll = __webpack_require__(2248);
var setToStringTag = __webpack_require__(8003);
var createIteratorConstructor = __webpack_require__(4994);
var InternalStateModule = __webpack_require__(9909);
var anInstance = __webpack_require__(5787);
var hasOwn = __webpack_require__(6656);
var bind = __webpack_require__(9974);
var classof = __webpack_require__(648);
var anObject = __webpack_require__(9670);
var isObject = __webpack_require__(111);
var create = __webpack_require__(30);
var createPropertyDescriptor = __webpack_require__(9114);
var getIterator = __webpack_require__(8554);
var getIteratorMethod = __webpack_require__(1246);
var wellKnownSymbol = __webpack_require__(5112);

var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (hasOwn(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!USE_NATIVE_URL && typeof $fetch == 'function' && typeof Headers == 'function') {
  $({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = create(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};


/***/ }),

/***/ 285:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(8783);
var $ = __webpack_require__(2109);
var DESCRIPTORS = __webpack_require__(9781);
var USE_NATIVE_URL = __webpack_require__(590);
var global = __webpack_require__(7854);
var defineProperties = __webpack_require__(6048);
var redefine = __webpack_require__(1320);
var anInstance = __webpack_require__(5787);
var has = __webpack_require__(6656);
var assign = __webpack_require__(1574);
var arrayFrom = __webpack_require__(8457);
var codeAt = __webpack_require__(8710).codeAt;
var toASCII = __webpack_require__(3197);
var setToStringTag = __webpack_require__(8003);
var URLSearchParamsModule = __webpack_require__(1637);
var InternalStateModule = __webpack_require__(9909);

var NativeURL = global.URL;
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
/* eslint-disable no-control-regex -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\t\u000A\u000D #%/:?@[\\]]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\t\u000A\u000D #/:?@[\\]]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
var TAB_AND_NEW_LINE = /[\t\u000A\u000D]/g;
/* eslint-enable no-control-regex -- safe */
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = toASCII(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements -- TODO
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!DESCRIPTORS) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (DESCRIPTORS) {
  defineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Dropzone": function() { return /* reexport */ Dropzone; },
  "default": function() { return /* binding */ dropzone_dist; }
});

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js
var es_array_concat = __webpack_require__(2222);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__(7327);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.index-of.js
var es_array_index_of = __webpack_require__(2772);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__(6992);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.map.js
var es_array_map = __webpack_require__(1249);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js
var es_array_slice = __webpack_require__(7042);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.splice.js
var es_array_splice = __webpack_require__(561);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.constructor.js
var es_array_buffer_constructor = __webpack_require__(8264);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__(8309);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-prototype-of.js
var es_object_get_prototype_of = __webpack_require__(489);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__(1539);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__(4916);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
var es_regexp_to_string = __webpack_require__(9714);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__(8783);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.match.js
var es_string_match = __webpack_require__(4723);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__(5306);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.split.js
var es_string_split = __webpack_require__(3123);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.trim.js
var es_string_trim = __webpack_require__(3210);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.uint8-array.js
var es_typed_array_uint8_array = __webpack_require__(2472);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.copy-within.js
var es_typed_array_copy_within = __webpack_require__(2990);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.every.js
var es_typed_array_every = __webpack_require__(8927);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.fill.js
var es_typed_array_fill = __webpack_require__(3105);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.filter.js
var es_typed_array_filter = __webpack_require__(5035);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find.js
var es_typed_array_find = __webpack_require__(4345);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find-index.js
var es_typed_array_find_index = __webpack_require__(7174);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.for-each.js
var es_typed_array_for_each = __webpack_require__(2846);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.includes.js
var es_typed_array_includes = __webpack_require__(4731);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.index-of.js
var es_typed_array_index_of = __webpack_require__(7209);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.iterator.js
var es_typed_array_iterator = __webpack_require__(6319);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.join.js
var es_typed_array_join = __webpack_require__(8867);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.last-index-of.js
var es_typed_array_last_index_of = __webpack_require__(7789);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.map.js
var es_typed_array_map = __webpack_require__(3739);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.reduce.js
var es_typed_array_reduce = __webpack_require__(9368);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.reduce-right.js
var es_typed_array_reduce_right = __webpack_require__(4483);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.reverse.js
var es_typed_array_reverse = __webpack_require__(2056);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__(3462);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.slice.js
var es_typed_array_slice = __webpack_require__(678);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.some.js
var es_typed_array_some = __webpack_require__(7462);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.sort.js
var es_typed_array_sort = __webpack_require__(3824);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.subarray.js
var es_typed_array_subarray = __webpack_require__(5021);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.to-locale-string.js
var es_typed_array_to_locale_string = __webpack_require__(2974);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.to-string.js
var es_typed_array_to_string = __webpack_require__(5016);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__(4747);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__(3948);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url.js
var web_url = __webpack_require__(285);
;// CONCATENATED MODULE: ./src/emitter.js


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.
var Emitter = /*#__PURE__*/function () {
  function Emitter() {
    _classCallCheck(this, Emitter);
  }

  _createClass(Emitter, [{
    key: "on",
    value: // Add an event listener for given event
    function on(event, fn) {
      this._callbacks = this._callbacks || {}; // Create namespace for this event

      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }

      this._callbacks[event].push(fn);

      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      this._callbacks = this._callbacks || {};
      var callbacks = this._callbacks[event];

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (callbacks) {
        var _iterator = _createForOfIteratorHelper(callbacks, true),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var callback = _step.value;
            callback.apply(this, args);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } // trigger a corresponding DOM event


      if (this.element) {
        this.element.dispatchEvent(this.makeEvent("dropzone:" + event, {
          args: args
        }));
      }

      return this;
    }
  }, {
    key: "makeEvent",
    value: function makeEvent(eventName, detail) {
      var params = {
        bubbles: true,
        cancelable: true,
        detail: detail
      };

      if (typeof window.CustomEvent === "function") {
        return new CustomEvent(eventName, params);
      } else {
        // IE 11 support
        // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
    } // Remove event listener for given event. If fn is not provided, all event
    // listeners for that event will be removed. If neither is provided, all
    // event listeners will be removed.

  }, {
    key: "off",
    value: function off(event, fn) {
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      } // specific event


      var callbacks = this._callbacks[event];

      if (!callbacks) {
        return this;
      } // remove all handlers


      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      } // remove specific handler


      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];

        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      return this;
    }
  }]);

  return Emitter;
}();


;// CONCATENATED MODULE: ./src/preview-template.html
// Module
var code = "<div class=\"dz-preview dz-file-preview\"> <div class=\"dz-image\"><img data-dz-thumbnail/></div> <div class=\"dz-details\"> <div class=\"dz-size\"><span data-dz-size></span></div> <div class=\"dz-filename\"><span data-dz-name></span></div> </div> <div class=\"dz-progress\"> <span class=\"dz-upload\" data-dz-uploadprogress></span> </div> <div class=\"dz-error-message\"><span data-dz-errormessage></span></div> <div class=\"dz-success-mark\"> <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>Check</title> <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\"></path> </g> </svg> </div> <div class=\"dz-error-mark\"> <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>Error</title> <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\"> <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\"></path> </g> </g> </svg> </div> </div> ";
// Exports
/* harmony default export */ var preview_template = (code);
;// CONCATENATED MODULE: ./src/options.js





function options_createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = options_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function options_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return options_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return options_arrayLikeToArray(o, minLen); }

function options_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var defaultOptions = {
  /**
   * Has to be specified on elements other than form (or when the form
   * doesn't have an `action` attribute). You can also
   * provide a function that will be called with `files` and
   * must return the url (since `v3.12.0`)
   */
  url: null,

  /**
   * Can be changed to `"put"` if necessary. You can also provide a function
   * that will be called with `files` and must return the method (since `v3.12.0`).
   */
  method: "post",

  /**
   * Will be set on the XHRequest.
   */
  withCredentials: false,

  /**
   * The timeout for the XHR requests in milliseconds (since `v4.4.0`).
   * If set to null or 0, no timeout is going to be set.
   */
  timeout: null,

  /**
   * How many file uploads to process in parallel (See the
   * Enqueuing file uploads documentation section for more info)
   */
  parallelUploads: 2,

  /**
   * Whether to send multiple files in one request. If
   * this it set to true, then the fallback file input element will
   * have the `multiple` attribute as well. This option will
   * also trigger additional events (like `processingmultiple`). See the events
   * documentation section for more information.
   */
  uploadMultiple: false,

  /**
   * Whether you want files to be uploaded in chunks to your server. This can't be
   * used in combination with `uploadMultiple`.
   *
   * See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
   */
  chunking: false,

  /**
   * If `chunking` is enabled, this defines whether **every** file should be chunked,
   * even if the file size is below chunkSize. This means, that the additional chunk
   * form data will be submitted and the `chunksUploaded` callback will be invoked.
   */
  forceChunking: false,

  /**
   * If `chunking` is `true`, then this defines the chunk size in bytes.
   */
  chunkSize: 2000000,

  /**
   * If `true`, the individual chunks of a file are being uploaded simultaneously.
   */
  parallelChunkUploads: false,

  /**
   * Whether a chunk should be retried if it fails.
   */
  retryChunks: false,

  /**
   * If `retryChunks` is true, how many times should it be retried.
   */
  retryChunksLimit: 3,

  /**
   * The maximum filesize (in bytes) that is allowed to be uploaded.
   */
  maxFilesize: 256,

  /**
   * The name of the file param that gets transferred.
   * **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
   * Dropzone will append `[]` to the name.
   */
  paramName: "file",

  /**
   * Whether thumbnails for images should be generated
   */
  createImageThumbnails: true,

  /**
   * In MB. When the filename exceeds this limit, the thumbnail will not be generated.
   */
  maxThumbnailFilesize: 10,

  /**
   * If `null`, the ratio of the image will be used to calculate it.
   */
  thumbnailWidth: 120,

  /**
   * The same as `thumbnailWidth`. If both are null, images will not be resized.
   */
  thumbnailHeight: 120,

  /**
   * How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
   * Can be either `contain` or `crop`.
   */
  thumbnailMethod: "crop",

  /**
   * If set, images will be resized to these dimensions before being **uploaded**.
   * If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
   * ratio of the file will be preserved.
   *
   * The `options.transformFile` function uses these options, so if the `transformFile` function
   * is overridden, these options don't do anything.
   */
  resizeWidth: null,

  /**
   * See `resizeWidth`.
   */
  resizeHeight: null,

  /**
   * The mime type of the resized image (before it gets uploaded to the server).
   * If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
   * See `resizeWidth` for more information.
   */
  resizeMimeType: null,

  /**
   * The quality of the resized images. See `resizeWidth`.
   */
  resizeQuality: 0.8,

  /**
   * How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
   * Can be either `contain` or `crop`.
   */
  resizeMethod: "contain",

  /**
   * The base that is used to calculate the **displayed** filesize. You can
   * change this to 1024 if you would rather display kibibytes, mebibytes,
   * etc... 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte`
   * not `1 kilobyte`. You can change this to `1024` if you don't care about
   * validity.
   */
  filesizeBase: 1000,

  /**
   * If not `null` defines how many files this Dropzone handles. If it exceeds,
   * the event `maxfilesexceeded` will be called. The dropzone element gets the
   * class `dz-max-files-reached` accordingly so you can provide visual
   * feedback.
   */
  maxFiles: null,

  /**
   * An optional object to send additional headers to the server. Eg:
   * `{ "My-Awesome-Header": "header value" }`
   */
  headers: null,

  /**
   * If `true`, the dropzone element itself will be clickable, if `false`
   * nothing will be clickable.
   *
   * You can also pass an HTML element, a CSS selector (for multiple elements)
   * or an array of those. In that case, all of those elements will trigger an
   * upload when clicked.
   */
  clickable: true,

  /**
   * Whether hidden files in directories should be ignored.
   */
  ignoreHiddenFiles: true,

  /**
   * The default implementation of `accept` checks the file's mime type or
   * extension against this list. This is a comma separated list of mime
   * types or file extensions.
   *
   * Eg.: `image/*,application/pdf,.psd`
   *
   * If the Dropzone is `clickable` this option will also be used as
   * [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
   * parameter on the hidden file input as well.
   */
  acceptedFiles: null,

  /**
   * **Deprecated!**
   * Use acceptedFiles instead.
   */
  acceptedMimeTypes: null,

  /**
   * If false, files will be added to the queue but the queue will not be
   * processed automatically.
   * This can be useful if you need some additional user input before sending
   * files (or if you want want all files sent at once).
   * If you're ready to send the file simply call `myDropzone.processQueue()`.
   *
   * See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
   * section for more information.
   */
  autoProcessQueue: true,

  /**
   * If false, files added to the dropzone will not be queued by default.
   * You'll have to call `enqueueFile(file)` manually.
   */
  autoQueue: true,

  /**
   * If `true`, this will add a link to every file preview to remove or cancel (if
   * already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
   * and `dictRemoveFile` options are used for the wording.
   */
  addRemoveLinks: false,

  /**
   * Defines where to display the file previews – if `null` the
   * Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
   * selector. The element should have the `dropzone-previews` class so
   * the previews are displayed properly.
   */
  previewsContainer: null,

  /**
   * Set this to `true` if you don't want previews to be shown.
   */
  disablePreviews: false,

  /**
   * This is the element the hidden input field (which is used when clicking on the
   * dropzone to trigger file selection) will be appended to. This might
   * be important in case you use frameworks to switch the content of your page.
   *
   * Can be a selector string, or an element directly.
   */
  hiddenInputContainer: "body",

  /**
   * If null, no capture type will be specified
   * If camera, mobile devices will skip the file selection and choose camera
   * If microphone, mobile devices will skip the file selection and choose the microphone
   * If camcorder, mobile devices will skip the file selection and choose the camera in video mode
   * On apple devices multiple must be set to false.  AcceptedFiles may need to
   * be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
   */
  capture: null,

  /**
   * **Deprecated**. Use `renameFile` instead.
   */
  renameFilename: null,

  /**
   * A function that is invoked before the file is uploaded to the server and renames the file.
   * This function gets the `File` as argument and can use the `file.name`. The actual name of the
   * file that gets used during the upload can be accessed through `file.upload.filename`.
   */
  renameFile: null,

  /**
   * If `true` the fallback will be forced. This is very useful to test your server
   * implementations first and make sure that everything works as
   * expected without dropzone if you experience problems, and to test
   * how your fallbacks will look.
   */
  forceFallback: false,

  /**
   * The text used before any files are dropped.
   */
  dictDefaultMessage: "Drop files here to upload",

  /**
   * The text that replaces the default message text it the browser is not supported.
   */
  dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",

  /**
   * The text that will be added before the fallback form.
   * If you provide a  fallback element yourself, or if this option is `null` this will
   * be ignored.
   */
  dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",

  /**
   * If the filesize is too big.
   * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
   */
  dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",

  /**
   * If the file doesn't match the file type.
   */
  dictInvalidFileType: "You can't upload files of this type.",

  /**
   * If the server response was invalid.
   * `{{statusCode}}` will be replaced with the servers status code.
   */
  dictResponseError: "Server responded with {{statusCode}} code.",

  /**
   * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
   */
  dictCancelUpload: "Cancel upload",

  /**
   * The text that is displayed if an upload was manually canceled
   */
  dictUploadCanceled: "Upload canceled.",

  /**
   * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
   */
  dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",

  /**
   * If `addRemoveLinks` is true, the text to be used to remove a file.
   */
  dictRemoveFile: "Remove file",

  /**
   * If this is not null, then the user will be prompted before removing a file.
   */
  dictRemoveFileConfirmation: null,

  /**
   * Displayed if `maxFiles` is st and exceeded.
   * The string `{{maxFiles}}` will be replaced by the configuration value.
   */
  dictMaxFilesExceeded: "You can not upload any more files.",

  /**
   * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
   * `b` for bytes.
   */
  dictFileSizeUnits: {
    tb: "TB",
    gb: "GB",
    mb: "MB",
    kb: "KB",
    b: "b"
  },

  /**
   * Called when dropzone initialized
   * You can add event listeners here
   */
  init: function init() {},

  /**
   * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
   * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
   * of a function, this needs to return a map.
   *
   * The default implementation does nothing for normal uploads, but adds relevant information for
   * chunked uploads.
   *
   * This is the same as adding hidden input fields in the form element.
   */
  params: function params(files, xhr, chunk) {
    if (chunk) {
      return {
        dzuuid: chunk.file.upload.uuid,
        dzchunkindex: chunk.index,
        dztotalfilesize: chunk.file.size,
        dzchunksize: this.options.chunkSize,
        dztotalchunkcount: chunk.file.upload.totalChunkCount,
        dzchunkbyteoffset: chunk.index * this.options.chunkSize
      };
    }
  },

  /**
   * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
   * and a `done` function as parameters.
   *
   * If the done function is invoked without arguments, the file is "accepted" and will
   * be processed. If you pass an error message, the file is rejected, and the error
   * message will be displayed.
   * This function will not be called if the file is too big or doesn't match the mime types.
   */
  accept: function accept(file, done) {
    return done();
  },

  /**
   * The callback that will be invoked when all chunks have been uploaded for a file.
   * It gets the file for which the chunks have been uploaded as the first parameter,
   * and the `done` function as second. `done()` needs to be invoked when everything
   * needed to finish the upload process is done.
   */
  chunksUploaded: function chunksUploaded(file, done) {
    done();
  },

  /**
   * Gets called when the browser is not supported.
   * The default implementation shows the fallback input field and adds
   * a text.
   */
  fallback: function fallback() {
    // This code should pass in IE7... :(
    var messageElement;
    this.element.className = "".concat(this.element.className, " dz-browser-not-supported");

    var _iterator = options_createForOfIteratorHelper(this.element.getElementsByTagName("div"), true),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var child = _step.value;

        if (/(^| )dz-message($| )/.test(child.className)) {
          messageElement = child;
          child.className = "dz-message"; // Removes the 'dz-default' class

          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (!messageElement) {
      messageElement = Dropzone.createElement('<div class="dz-message"><span></span></div>');
      this.element.appendChild(messageElement);
    }

    var span = messageElement.getElementsByTagName("span")[0];

    if (span) {
      if (span.textContent != null) {
        span.textContent = this.options.dictFallbackMessage;
      } else if (span.innerText != null) {
        span.innerText = this.options.dictFallbackMessage;
      }
    }

    return this.element.appendChild(this.getFallbackForm());
  },

  /**
   * Gets called to calculate the thumbnail dimensions.
   *
   * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
   *
   *  - `srcWidth` & `srcHeight` (required)
   *  - `trgWidth` & `trgHeight` (required)
   *  - `srcX` & `srcY` (optional, default `0`)
   *  - `trgX` & `trgY` (optional, default `0`)
   *
   * Those values are going to be used by `ctx.drawImage()`.
   */
  resize: function resize(file, width, height, resizeMethod) {
    var info = {
      srcX: 0,
      srcY: 0,
      srcWidth: file.width,
      srcHeight: file.height
    };
    var srcRatio = file.width / file.height; // Automatically calculate dimensions if not specified

    if (width == null && height == null) {
      width = info.srcWidth;
      height = info.srcHeight;
    } else if (width == null) {
      width = height * srcRatio;
    } else if (height == null) {
      height = width / srcRatio;
    } // Make sure images aren't upscaled


    width = Math.min(width, info.srcWidth);
    height = Math.min(height, info.srcHeight);
    var trgRatio = width / height;

    if (info.srcWidth > width || info.srcHeight > height) {
      // Image is bigger and needs rescaling
      if (resizeMethod === "crop") {
        if (srcRatio > trgRatio) {
          info.srcHeight = file.height;
          info.srcWidth = info.srcHeight * trgRatio;
        } else {
          info.srcWidth = file.width;
          info.srcHeight = info.srcWidth / trgRatio;
        }
      } else if (resizeMethod === "contain") {
        // Method 'contain'
        if (srcRatio > trgRatio) {
          height = width / srcRatio;
        } else {
          width = height * srcRatio;
        }
      } else {
        throw new Error("Unknown resizeMethod '".concat(resizeMethod, "'"));
      }
    }

    info.srcX = (file.width - info.srcWidth) / 2;
    info.srcY = (file.height - info.srcHeight) / 2;
    info.trgWidth = width;
    info.trgHeight = height;
    return info;
  },

  /**
   * Can be used to transform the file (for example, resize an image if necessary).
   *
   * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
   * images according to those dimensions.
   *
   * Gets the `file` as the first parameter, and a `done()` function as the second, that needs
   * to be invoked with the file when the transformation is done.
   */
  transformFile: function transformFile(file, done) {
    if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {
      return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
    } else {
      return done(file);
    }
  },

  /**
   * A string that contains the template used for each dropped
   * file. Change it to fulfill your needs but make sure to properly
   * provide all elements.
   *
   * If you want to use an actual HTML element instead of providing a String
   * as a config option, you could create a div with the id `tpl`,
   * put the template inside it and provide the element like this:
   *
   *     document
   *       .querySelector('#tpl')
   *       .innerHTML
   *
   */
  previewTemplate: preview_template,

  /*
   Those functions register themselves to the events on init and handle all
   the user interface specific stuff. Overwriting them won't break the upload
   but can break the way it's displayed.
   You can overwrite them if you don't like the default behavior. If you just
   want to add an additional event handler, register it on the dropzone object
   and don't overwrite those options.
   */
  // Those are self explanatory and simply concern the DragnDrop.
  drop: function drop(e) {
    return this.element.classList.remove("dz-drag-hover");
  },
  dragstart: function dragstart(e) {},
  dragend: function dragend(e) {
    return this.element.classList.remove("dz-drag-hover");
  },
  dragenter: function dragenter(e) {
    return this.element.classList.add("dz-drag-hover");
  },
  dragover: function dragover(e) {
    return this.element.classList.add("dz-drag-hover");
  },
  dragleave: function dragleave(e) {
    return this.element.classList.remove("dz-drag-hover");
  },
  paste: function paste(e) {},
  // Called whenever there are no files left in the dropzone anymore, and the
  // dropzone should be displayed as if in the initial state.
  reset: function reset() {
    return this.element.classList.remove("dz-started");
  },
  // Called when a file is added to the queue
  // Receives `file`
  addedfile: function addedfile(file) {
    var _this = this;

    if (this.element === this.previewsContainer) {
      this.element.classList.add("dz-started");
    }

    if (this.previewsContainer && !this.options.disablePreviews) {
      file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
      file.previewTemplate = file.previewElement; // Backwards compatibility

      this.previewsContainer.appendChild(file.previewElement);

      var _iterator2 = options_createForOfIteratorHelper(file.previewElement.querySelectorAll("[data-dz-name]"), true),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var node = _step2.value;
          node.textContent = file.name;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var _iterator3 = options_createForOfIteratorHelper(file.previewElement.querySelectorAll("[data-dz-size]"), true),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          node = _step3.value;
          node.innerHTML = this.filesize(file.size);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      if (this.options.addRemoveLinks) {
        file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>".concat(this.options.dictRemoveFile, "</a>"));
        file.previewElement.appendChild(file._removeLink);
      }

      var removeFileEvent = function removeFileEvent(e) {
        e.preventDefault();
        e.stopPropagation();

        if (file.status === Dropzone.UPLOADING) {
          return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function () {
            return _this.removeFile(file);
          });
        } else {
          if (_this.options.dictRemoveFileConfirmation) {
            return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function () {
              return _this.removeFile(file);
            });
          } else {
            return _this.removeFile(file);
          }
        }
      };

      var _iterator4 = options_createForOfIteratorHelper(file.previewElement.querySelectorAll("[data-dz-remove]"), true),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var removeLink = _step4.value;
          removeLink.addEventListener("click", removeFileEvent);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  },
  // Called whenever a file is removed.
  removedfile: function removedfile(file) {
    if (file.previewElement != null && file.previewElement.parentNode != null) {
      file.previewElement.parentNode.removeChild(file.previewElement);
    }

    return this._updateMaxFilesReachedClass();
  },
  // Called when a thumbnail has been generated
  // Receives `file` and `dataUrl`
  thumbnail: function thumbnail(file, dataUrl) {
    if (file.previewElement) {
      file.previewElement.classList.remove("dz-file-preview");

      var _iterator5 = options_createForOfIteratorHelper(file.previewElement.querySelectorAll("[data-dz-thumbnail]"), true),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var thumbnailElement = _step5.value;
          thumbnailElement.alt = file.name;
          thumbnailElement.src = dataUrl;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return setTimeout(function () {
        return file.previewElement.classList.add("dz-image-preview");
      }, 1);
    }
  },
  // Called whenever an error occurs
  // Receives `file` and `message`
  error: function error(file, message) {
    if (file.previewElement) {
      file.previewElement.classList.add("dz-error");

      if (typeof message !== "string" && message.error) {
        message = message.error;
      }

      var _iterator6 = options_createForOfIteratorHelper(file.previewElement.querySelectorAll("[data-dz-errormessage]"), true),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var node = _step6.value;
          node.textContent = message;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  },
  errormultiple: function errormultiple() {},
  // Called when a file gets processed. Since there is a cue, not all added
  // files are processed immediately.
  // Receives `file`
  processing: function processing(file) {
    if (file.previewElement) {
      file.previewElement.classList.add("dz-processing");

      if (file._removeLink) {
        return file._removeLink.innerHTML = this.options.dictCancelUpload;
      }
    }
  },
  processingmultiple: function processingmultiple() {},
  // Called whenever the upload progress gets updated.
  // Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
  // To get the total number of bytes of the file, use `file.size`
  uploadprogress: function uploadprogress(file, progress, bytesSent) {
    if (file.previewElement) {
      var _iterator7 = options_createForOfIteratorHelper(file.previewElement.querySelectorAll("[data-dz-uploadprogress]"), true),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var node = _step7.value;
          node.nodeName === "PROGRESS" ? node.value = progress : node.style.width = "".concat(progress, "%");
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  },
  // Called whenever the total upload progress gets updated.
  // Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
  totaluploadprogress: function totaluploadprogress() {},
  // Called just before the file is sent. Gets the `xhr` object as second
  // parameter, so you can modify it (for example to add a CSRF token) and a
  // `formData` object to add additional information.
  sending: function sending() {},
  sendingmultiple: function sendingmultiple() {},
  // When the complete upload is finished and successful
  // Receives `file`
  success: function success(file) {
    if (file.previewElement) {
      return file.previewElement.classList.add("dz-success");
    }
  },
  successmultiple: function successmultiple() {},
  // When the upload is canceled.
  canceled: function canceled(file) {
    return this.emit("error", file, this.options.dictUploadCanceled);
  },
  canceledmultiple: function canceledmultiple() {},
  // When the upload is finished, either with success or an error.
  // Receives `file`
  complete: function complete(file) {
    if (file._removeLink) {
      file._removeLink.innerHTML = this.options.dictRemoveFile;
    }

    if (file.previewElement) {
      return file.previewElement.classList.add("dz-complete");
    }
  },
  completemultiple: function completemultiple() {},
  maxfilesexceeded: function maxfilesexceeded() {},
  maxfilesreached: function maxfilesreached() {},
  queuecomplete: function queuecomplete() {},
  addedfiles: function addedfiles() {}
};
/* harmony default export */ var src_options = (defaultOptions);
;// CONCATENATED MODULE: ./src/dropzone.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }















































function dropzone_createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = dropzone_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function dropzone_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return dropzone_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return dropzone_arrayLikeToArray(o, minLen); }

function dropzone_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function dropzone_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function dropzone_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function dropzone_createClass(Constructor, protoProps, staticProps) { if (protoProps) dropzone_defineProperties(Constructor.prototype, protoProps); if (staticProps) dropzone_defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var Dropzone = /*#__PURE__*/function (_Emitter) {
  _inherits(Dropzone, _Emitter);

  var _super = _createSuper(Dropzone);

  function Dropzone(el, options) {
    var _this;

    dropzone_classCallCheck(this, Dropzone);

    _this = _super.call(this);
    var fallback, left;
    _this.element = el; // For backwards compatibility since the version was in the prototype previously

    _this.version = Dropzone.version;
    _this.clickableElements = [];
    _this.listeners = [];
    _this.files = []; // All files

    if (typeof _this.element === "string") {
      _this.element = document.querySelector(_this.element);
    } // Not checking if instance of HTMLElement or Element since IE9 is extremely weird.


    if (!_this.element || _this.element.nodeType == null) {
      throw new Error("Invalid dropzone element.");
    }

    if (_this.element.dropzone) {
      throw new Error("Dropzone already attached.");
    } // Now add this dropzone to the instances.


    Dropzone.instances.push(_assertThisInitialized(_this)); // Put the dropzone inside the element itself.

    _this.element.dropzone = _assertThisInitialized(_this);
    var elementOptions = (left = Dropzone.optionsForElement(_this.element)) != null ? left : {};
    _this.options = Dropzone.extend({}, src_options, elementOptions, options != null ? options : {});
    _this.options.previewTemplate = _this.options.previewTemplate.replace(/\n*/g, ""); // If the browser failed, just call the fallback and leave

    if (_this.options.forceFallback || !Dropzone.isBrowserSupported()) {
      return _possibleConstructorReturn(_this, _this.options.fallback.call(_assertThisInitialized(_this)));
    } // @options.url = @element.getAttribute "action" unless @options.url?


    if (_this.options.url == null) {
      _this.options.url = _this.element.getAttribute("action");
    }

    if (!_this.options.url) {
      throw new Error("No URL provided.");
    }

    if (_this.options.acceptedFiles && _this.options.acceptedMimeTypes) {
      throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
    }

    if (_this.options.uploadMultiple && _this.options.chunking) {
      throw new Error("You cannot set both: uploadMultiple and chunking.");
    } // Backwards compatibility


    if (_this.options.acceptedMimeTypes) {
      _this.options.acceptedFiles = _this.options.acceptedMimeTypes;
      delete _this.options.acceptedMimeTypes;
    } // Backwards compatibility


    if (_this.options.renameFilename != null) {
      _this.options.renameFile = function (file) {
        return _this.options.renameFilename.call(_assertThisInitialized(_this), file.name, file);
      };
    }

    if (typeof _this.options.method === "string") {
      _this.options.method = _this.options.method.toUpperCase();
    }

    if ((fallback = _this.getExistingFallback()) && fallback.parentNode) {
      // Remove the fallback
      fallback.parentNode.removeChild(fallback);
    } // Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false


    if (_this.options.previewsContainer !== false) {
      if (_this.options.previewsContainer) {
        _this.previewsContainer = Dropzone.getElement(_this.options.previewsContainer, "previewsContainer");
      } else {
        _this.previewsContainer = _this.element;
      }
    }

    if (_this.options.clickable) {
      if (_this.options.clickable === true) {
        _this.clickableElements = [_this.element];
      } else {
        _this.clickableElements = Dropzone.getElements(_this.options.clickable, "clickable");
      }
    }

    _this.init();

    return _this;
  } // Returns all files that have been accepted


  dropzone_createClass(Dropzone, [{
    key: "getAcceptedFiles",
    value: function getAcceptedFiles() {
      return this.files.filter(function (file) {
        return file.accepted;
      }).map(function (file) {
        return file;
      });
    } // Returns all files that have been rejected
    // Not sure when that's going to be useful, but added for completeness.

  }, {
    key: "getRejectedFiles",
    value: function getRejectedFiles() {
      return this.files.filter(function (file) {
        return !file.accepted;
      }).map(function (file) {
        return file;
      });
    }
  }, {
    key: "getFilesWithStatus",
    value: function getFilesWithStatus(status) {
      return this.files.filter(function (file) {
        return file.status === status;
      }).map(function (file) {
        return file;
      });
    } // Returns all files that are in the queue

  }, {
    key: "getQueuedFiles",
    value: function getQueuedFiles() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    }
  }, {
    key: "getUploadingFiles",
    value: function getUploadingFiles() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    }
  }, {
    key: "getAddedFiles",
    value: function getAddedFiles() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    } // Files that are either queued or uploading

  }, {
    key: "getActiveFiles",
    value: function getActiveFiles() {
      return this.files.filter(function (file) {
        return file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED;
      }).map(function (file) {
        return file;
      });
    } // The function that gets called when Dropzone is initialized. You
    // can (and should) setup event listeners inside this function.

  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      // In case it isn't set already
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }

      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><button class=\"dz-button\" type=\"button\">".concat(this.options.dictDefaultMessage, "</button></div>")));
      }

      if (this.clickableElements.length) {
        var setupHiddenFileInput = function setupHiddenFileInput() {
          if (_this2.hiddenFileInput) {
            _this2.hiddenFileInput.parentNode.removeChild(_this2.hiddenFileInput);
          }

          _this2.hiddenFileInput = document.createElement("input");

          _this2.hiddenFileInput.setAttribute("type", "file");

          if (_this2.options.maxFiles === null || _this2.options.maxFiles > 1) {
            _this2.hiddenFileInput.setAttribute("multiple", "multiple");
          }

          _this2.hiddenFileInput.className = "dz-hidden-input";

          if (_this2.options.acceptedFiles !== null) {
            _this2.hiddenFileInput.setAttribute("accept", _this2.options.acceptedFiles);
          }

          if (_this2.options.capture !== null) {
            _this2.hiddenFileInput.setAttribute("capture", _this2.options.capture);
          } // Making sure that no one can "tab" into this field.


          _this2.hiddenFileInput.setAttribute("tabindex", "-1"); // Not setting `display="none"` because some browsers don't accept clicks
          // on elements that aren't displayed.


          _this2.hiddenFileInput.style.visibility = "hidden";
          _this2.hiddenFileInput.style.position = "absolute";
          _this2.hiddenFileInput.style.top = "0";
          _this2.hiddenFileInput.style.left = "0";
          _this2.hiddenFileInput.style.height = "0";
          _this2.hiddenFileInput.style.width = "0";
          Dropzone.getElement(_this2.options.hiddenInputContainer, "hiddenInputContainer").appendChild(_this2.hiddenFileInput);

          _this2.hiddenFileInput.addEventListener("change", function () {
            var files = _this2.hiddenFileInput.files;

            if (files.length) {
              var _iterator = dropzone_createForOfIteratorHelper(files, true),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var file = _step.value;

                  _this2.addFile(file);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }

            _this2.emit("addedfiles", files);

            setupHiddenFileInput();
          });
        };

        setupHiddenFileInput();
      }

      this.URL = window.URL !== null ? window.URL : window.webkitURL; // Setup all event listeners on the Dropzone object itself.
      // They're not in @setupEventListeners() because they shouldn't be removed
      // again when the dropzone gets disabled.

      var _iterator2 = dropzone_createForOfIteratorHelper(this.events, true),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var eventName = _step2.value;
          this.on(eventName, this.options[eventName]);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.on("uploadprogress", function () {
        return _this2.updateTotalUploadProgress();
      });
      this.on("removedfile", function () {
        return _this2.updateTotalUploadProgress();
      });
      this.on("canceled", function (file) {
        return _this2.emit("complete", file);
      }); // Emit a `queuecomplete` event if all files finished uploading.

      this.on("complete", function (file) {
        if (_this2.getAddedFiles().length === 0 && _this2.getUploadingFiles().length === 0 && _this2.getQueuedFiles().length === 0) {
          // This needs to be deferred so that `queuecomplete` really triggers after `complete`
          return setTimeout(function () {
            return _this2.emit("queuecomplete");
          }, 0);
        }
      });

      var containsFiles = function containsFiles(e) {
        if (e.dataTransfer.types) {
          // Because e.dataTransfer.types is an Object in
          // IE, we need to iterate like this instead of
          // using e.dataTransfer.types.some()
          for (var i = 0; i < e.dataTransfer.types.length; i++) {
            if (e.dataTransfer.types[i] === "Files") return true;
          }
        }

        return false;
      };

      var noPropagation = function noPropagation(e) {
        // If there are no files, we don't want to stop
        // propagation so we don't interfere with other
        // drag and drop behaviour.
        if (!containsFiles(e)) return;
        e.stopPropagation();

        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      }; // Create the listeners


      this.listeners = [{
        element: this.element,
        events: {
          dragstart: function dragstart(e) {
            return _this2.emit("dragstart", e);
          },
          dragenter: function dragenter(e) {
            noPropagation(e);
            return _this2.emit("dragenter", e);
          },
          dragover: function dragover(e) {
            // Makes it possible to drag files from chrome's download bar
            // http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
            // Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
            var efct;

            try {
              efct = e.dataTransfer.effectAllowed;
            } catch (error) {}

            e.dataTransfer.dropEffect = "move" === efct || "linkMove" === efct ? "move" : "copy";
            noPropagation(e);
            return _this2.emit("dragover", e);
          },
          dragleave: function dragleave(e) {
            return _this2.emit("dragleave", e);
          },
          drop: function drop(e) {
            noPropagation(e);
            return _this2.drop(e);
          },
          dragend: function dragend(e) {
            return _this2.emit("dragend", e);
          }
        } // This is disabled right now, because the browsers don't implement it properly.
        // "paste": (e) =>
        //   noPropagation e
        //   @paste e

      }];
      this.clickableElements.forEach(function (clickableElement) {
        return _this2.listeners.push({
          element: clickableElement,
          events: {
            click: function click(evt) {
              // Only the actual dropzone or the message element should trigger file selection
              if (clickableElement !== _this2.element || evt.target === _this2.element || Dropzone.elementInside(evt.target, _this2.element.querySelector(".dz-message"))) {
                _this2.hiddenFileInput.click(); // Forward the click

              }

              return true;
            }
          }
        });
      });
      this.enable();
      return this.options.init.call(this);
    } // Not fully tested yet

  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.removeAllFiles(true);

      if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }

      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    }
  }, {
    key: "updateTotalUploadProgress",
    value: function updateTotalUploadProgress() {
      var totalUploadProgress;
      var totalBytesSent = 0;
      var totalBytes = 0;
      var activeFiles = this.getActiveFiles();

      if (activeFiles.length) {
        var _iterator3 = dropzone_createForOfIteratorHelper(this.getActiveFiles(), true),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var file = _step3.value;
            totalBytesSent += file.upload.bytesSent;
            totalBytes += file.upload.total;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }

      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    } // @options.paramName can be a function taking one parameter rather than a string.
    // A parameter name for a file is obtained simply by calling this with an index number.

  }, {
    key: "_getParamName",
    value: function _getParamName(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "".concat(this.options.paramName).concat(this.options.uploadMultiple ? "[".concat(n, "]") : "");
      }
    } // If @options.renameFile is a function,
    // the function will be used to rename the file.name before appending it to the formData

  }, {
    key: "_renameFile",
    value: function _renameFile(file) {
      if (typeof this.options.renameFile !== "function") {
        return file.name;
      }

      return this.options.renameFile(file);
    } // Returns a form that can be used as fallback if the browser does not support DragnDrop
    //
    // If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
    // This code has to pass in IE7 :(

  }, {
    key: "getFallbackForm",
    value: function getFallbackForm() {
      var existingFallback, form;

      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }

      var fieldsString = '<div class="dz-fallback">';

      if (this.options.dictFallbackText) {
        fieldsString += "<p>".concat(this.options.dictFallbackText, "</p>");
      }

      fieldsString += "<input type=\"file\" name=\"".concat(this._getParamName(0), "\" ").concat(this.options.uploadMultiple ? 'multiple="multiple"' : undefined, " /><input type=\"submit\" value=\"Upload!\"></div>");
      var fields = Dropzone.createElement(fieldsString);

      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"".concat(this.options.url, "\" enctype=\"multipart/form-data\" method=\"").concat(this.options.method, "\"></form>"));
        form.appendChild(fields);
      } else {
        // Make sure that the enctype and method attributes are set properly
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }

      return form != null ? form : fields;
    } // Returns the fallback elements if they exist already
    //
    // This code has to pass in IE7 :(

  }, {
    key: "getExistingFallback",
    value: function getExistingFallback() {
      var getFallback = function getFallback(elements) {
        var _iterator4 = dropzone_createForOfIteratorHelper(elements, true),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var el = _step4.value;

            if (/(^| )fallback($| )/.test(el.className)) {
              return el;
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      };

      for (var _i = 0, _arr = ["div", "form"]; _i < _arr.length; _i++) {
        var tagName = _arr[_i];
        var fallback;

        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    } // Activates all listeners stored in @listeners

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];

          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.addEventListener(event, listener, false));
          }

          return result;
        }();
      });
    } // Deactivates all listeners stored in @listeners

  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];

          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.removeEventListener(event, listener, false));
          }

          return result;
        }();
      });
    } // Removes all event listeners and cancels all files in the queue or being processed.

  }, {
    key: "disable",
    value: function disable() {
      var _this3 = this;

      this.clickableElements.forEach(function (element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      this.disabled = true;
      return this.files.map(function (file) {
        return _this3.cancelUpload(file);
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      delete this.disabled;
      this.clickableElements.forEach(function (element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    } // Returns a nicely formatted filesize

  }, {
    key: "filesize",
    value: function filesize(size) {
      var selectedSize = 0;
      var selectedUnit = "b";

      if (size > 0) {
        var units = ["tb", "gb", "mb", "kb", "b"];

        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }

        selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
      }

      return "<strong>".concat(selectedSize, "</strong> ").concat(this.options.dictFileSizeUnits[selectedUnit]);
    } // Adds or removes the `dz-max-files-reached` class from the form.

  }, {
    key: "_updateMaxFilesReachedClass",
    value: function _updateMaxFilesReachedClass() {
      if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit("maxfilesreached", this.files);
        }

        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    }
  }, {
    key: "drop",
    value: function drop(e) {
      if (!e.dataTransfer) {
        return;
      }

      this.emit("drop", e); // Convert the FileList to an Array
      // This is necessary for IE11

      var files = [];

      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        files[i] = e.dataTransfer.files[i];
      } // Even if it's a folder, files.length will contain the folders.


      if (files.length) {
        var items = e.dataTransfer.items;

        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // The browser supports dropping of folders, so handle items instead of files
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }

      this.emit("addedfiles", files);
    }
  }, {
    key: "paste",
    value: function paste(e) {
      if (__guard__(e != null ? e.clipboardData : undefined, function (x) {
        return x.items;
      }) == null) {
        return;
      }

      this.emit("paste", e);
      var items = e.clipboardData.items;

      if (items.length) {
        return this._addFilesFromItems(items);
      }
    }
  }, {
    key: "handleFiles",
    value: function handleFiles(files) {
      var _iterator5 = dropzone_createForOfIteratorHelper(files, true),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var file = _step5.value;
          this.addFile(file);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    } // When a folder is dropped (or files are pasted), items must be handled
    // instead of files.

  }, {
    key: "_addFilesFromItems",
    value: function _addFilesFromItems(items) {
      var _this4 = this;

      return function () {
        var result = [];

        var _iterator6 = dropzone_createForOfIteratorHelper(items, true),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var item = _step6.value;
            var entry;

            if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
              if (entry.isFile) {
                result.push(_this4.addFile(item.getAsFile()));
              } else if (entry.isDirectory) {
                // Append all files from that directory to files
                result.push(_this4._addFilesFromDirectory(entry, entry.name));
              } else {
                result.push(undefined);
              }
            } else if (item.getAsFile != null) {
              if (item.kind == null || item.kind === "file") {
                result.push(_this4.addFile(item.getAsFile()));
              } else {
                result.push(undefined);
              }
            } else {
              result.push(undefined);
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        return result;
      }();
    } // Goes through the directory, and adds each file it finds recursively

  }, {
    key: "_addFilesFromDirectory",
    value: function _addFilesFromDirectory(directory, path) {
      var _this5 = this;

      var dirReader = directory.createReader();

      var errorHandler = function errorHandler(error) {
        return __guardMethod__(console, "log", function (o) {
          return o.log(error);
        });
      };

      var readEntries = function readEntries() {
        return dirReader.readEntries(function (entries) {
          if (entries.length > 0) {
            var _iterator7 = dropzone_createForOfIteratorHelper(entries, true),
                _step7;

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var entry = _step7.value;

                if (entry.isFile) {
                  entry.file(function (file) {
                    if (_this5.options.ignoreHiddenFiles && file.name.substring(0, 1) === ".") {
                      return;
                    }

                    file.fullPath = "".concat(path, "/").concat(file.name);
                    return _this5.addFile(file);
                  });
                } else if (entry.isDirectory) {
                  _this5._addFilesFromDirectory(entry, "".concat(path, "/").concat(entry.name));
                }
              } // Recursively call readEntries() again, since browser only handle
              // the first 100 entries.
              // See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries

            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }

            readEntries();
          }

          return null;
        }, errorHandler);
      };

      return readEntries();
    } // If `done()` is called without argument the file is accepted
    // If you call it with an error message, the file is rejected
    // (This allows for asynchronous validation)
    //
    // This function checks the filesize, and if the file.type passes the
    // `acceptedFiles` check.

  }, {
    key: "accept",
    value: function accept(file, done) {
      if (this.options.maxFilesize && file.size > this.options.maxFilesize * 1024 * 1024) {
        done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        done(this.options.dictInvalidFileType);
      } else if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        this.emit("maxfilesexceeded", file);
      } else {
        this.options.accept.call(this, file, done);
      }
    }
  }, {
    key: "addFile",
    value: function addFile(file) {
      var _this6 = this;

      file.upload = {
        uuid: Dropzone.uuidv4(),
        progress: 0,
        // Setting the total upload size to file.size for the beginning
        // It's actual different than the size to be transmitted.
        total: file.size,
        bytesSent: 0,
        filename: this._renameFile(file) // Not setting chunking information here, because the acutal data — and
        // thus the chunks — might change if `options.transformFile` is set
        // and does something to the data.

      };
      this.files.push(file);
      file.status = Dropzone.ADDED;
      this.emit("addedfile", file);

      this._enqueueThumbnail(file);

      this.accept(file, function (error) {
        if (error) {
          file.accepted = false;

          _this6._errorProcessing([file], error); // Will set the file.status

        } else {
          file.accepted = true;

          if (_this6.options.autoQueue) {
            _this6.enqueueFile(file);
          } // Will set .accepted = true

        }

        _this6._updateMaxFilesReachedClass();
      });
    } // Wrapper for enqueueFile

  }, {
    key: "enqueueFiles",
    value: function enqueueFiles(files) {
      var _iterator8 = dropzone_createForOfIteratorHelper(files, true),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var file = _step8.value;
          this.enqueueFile(file);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      return null;
    }
  }, {
    key: "enqueueFile",
    value: function enqueueFile(file) {
      var _this7 = this;

      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;

        if (this.options.autoProcessQueue) {
          return setTimeout(function () {
            return _this7.processQueue();
          }, 0); // Deferring the call
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    }
  }, {
    key: "_enqueueThumbnail",
    value: function _enqueueThumbnail(file) {
      var _this8 = this;

      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);

        return setTimeout(function () {
          return _this8._processThumbnailQueue();
        }, 0); // Deferring the call
      }
    }
  }, {
    key: "_processThumbnailQueue",
    value: function _processThumbnailQueue() {
      var _this9 = this;

      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }

      this._processingThumbnail = true;

      var file = this._thumbnailQueue.shift();

      return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, function (dataUrl) {
        _this9.emit("thumbnail", file, dataUrl);

        _this9._processingThumbnail = false;
        return _this9._processThumbnailQueue();
      });
    } // Can be called by the user to remove a file

  }, {
    key: "removeFile",
    value: function removeFile(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }

      this.files = without(this.files, file);
      this.emit("removedfile", file);

      if (this.files.length === 0) {
        return this.emit("reset");
      }
    } // Removes all files that aren't currently processed from the list

  }, {
    key: "removeAllFiles",
    value: function removeAllFiles(cancelIfNecessary) {
      // Create a copy of files since removeFile() changes the @files array.
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }

      var _iterator9 = dropzone_createForOfIteratorHelper(this.files.slice(), true),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var file = _step9.value;

          if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
            this.removeFile(file);
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      return null;
    } // Resizes an image before it gets sent to the server. This function is the default behavior of
    // `options.transformFile` if `resizeWidth` or `resizeHeight` are set. The callback is invoked with
    // the resized blob.

  }, {
    key: "resizeImage",
    value: function resizeImage(file, width, height, resizeMethod, callback) {
      var _this10 = this;

      return this.createThumbnail(file, width, height, resizeMethod, true, function (dataUrl, canvas) {
        if (canvas == null) {
          // The image has not been resized
          return callback(file);
        } else {
          var resizeMimeType = _this10.options.resizeMimeType;

          if (resizeMimeType == null) {
            resizeMimeType = file.type;
          }

          var resizedDataURL = canvas.toDataURL(resizeMimeType, _this10.options.resizeQuality);

          if (resizeMimeType === "image/jpeg" || resizeMimeType === "image/jpg") {
            // Now add the original EXIF information
            resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
          }

          return callback(Dropzone.dataURItoBlob(resizedDataURL));
        }
      });
    }
  }, {
    key: "createThumbnail",
    value: function createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
      var _this11 = this;

      var fileReader = new FileReader();

      fileReader.onload = function () {
        file.dataURL = fileReader.result; // Don't bother creating a thumbnail for SVG images since they're vector

        if (file.type === "image/svg+xml") {
          if (callback != null) {
            callback(fileReader.result);
          }

          return;
        }

        _this11.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
      };

      fileReader.readAsDataURL(file);
    } // `mockFile` needs to have these attributes:
    //
    //     { name: 'name', size: 12345, imageUrl: '' }
    //
    // `callback` will be invoked when the image has been downloaded and displayed.
    // `crossOrigin` will be added to the `img` tag when accessing the file.

  }, {
    key: "displayExistingFile",
    value: function displayExistingFile(mockFile, imageUrl, callback, crossOrigin) {
      var _this12 = this;

      var resizeThumbnail = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      this.emit("addedfile", mockFile);
      this.emit("complete", mockFile);

      if (!resizeThumbnail) {
        this.emit("thumbnail", mockFile, imageUrl);
        if (callback) callback();
      } else {
        var onDone = function onDone(thumbnail) {
          _this12.emit("thumbnail", mockFile, thumbnail);

          if (callback) callback();
        };

        mockFile.dataURL = imageUrl;
        this.createThumbnailFromUrl(mockFile, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.resizeMethod, this.options.fixOrientation, onDone, crossOrigin);
      }
    }
  }, {
    key: "createThumbnailFromUrl",
    value: function createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
      var _this13 = this;

      // Not using `new Image` here because of a bug in latest Chrome versions.
      // See https://github.com/enyo/dropzone/pull/226
      var img = document.createElement("img");

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      } // fixOrientation is not needed anymore with browsers handling imageOrientation


      fixOrientation = getComputedStyle(document.body)["imageOrientation"] == "from-image" ? false : fixOrientation;

      img.onload = function () {
        var loadExif = function loadExif(callback) {
          return callback(1);
        };

        if (typeof EXIF !== "undefined" && EXIF !== null && fixOrientation) {
          loadExif = function loadExif(callback) {
            return EXIF.getData(img, function () {
              return callback(EXIF.getTag(this, "Orientation"));
            });
          };
        }

        return loadExif(function (orientation) {
          file.width = img.width;
          file.height = img.height;

          var resizeInfo = _this13.options.resize.call(_this13, file, width, height, resizeMethod);

          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;

          if (orientation > 4) {
            canvas.width = resizeInfo.trgHeight;
            canvas.height = resizeInfo.trgWidth;
          }

          switch (orientation) {
            case 2:
              // horizontal flip
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              break;

            case 3:
              // 180° rotate left
              ctx.translate(canvas.width, canvas.height);
              ctx.rotate(Math.PI);
              break;

            case 4:
              // vertical flip
              ctx.translate(0, canvas.height);
              ctx.scale(1, -1);
              break;

            case 5:
              // vertical flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.scale(1, -1);
              break;

            case 6:
              // 90° rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(0, -canvas.width);
              break;

            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(canvas.height, -canvas.width);
              ctx.scale(-1, 1);
              break;

            case 8:
              // 90° rotate left
              ctx.rotate(-0.5 * Math.PI);
              ctx.translate(-canvas.height, 0);
              break;
          } // This is a bugfix for iOS' scaling bug.


          drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          var thumbnail = canvas.toDataURL("image/png");

          if (callback != null) {
            return callback(thumbnail, canvas);
          }
        });
      };

      if (callback != null) {
        img.onerror = callback;
      }

      return img.src = file.dataURL;
    } // Goes through the queue and processes files if there aren't too many already.

  }, {
    key: "processQueue",
    value: function processQueue() {
      var parallelUploads = this.options.parallelUploads;
      var processingLength = this.getUploadingFiles().length;
      var i = processingLength; // There are already at least as many files uploading than should be

      if (processingLength >= parallelUploads) {
        return;
      }

      var queuedFiles = this.getQueuedFiles();

      if (!(queuedFiles.length > 0)) {
        return;
      }

      if (this.options.uploadMultiple) {
        // The files should be uploaded in one request
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          } // Nothing left to process


          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    } // Wrapper for `processFiles`

  }, {
    key: "processFile",
    value: function processFile(file) {
      return this.processFiles([file]);
    } // Loads the file, then calls finishedLoading()

  }, {
    key: "processFiles",
    value: function processFiles(files) {
      var _iterator10 = dropzone_createForOfIteratorHelper(files, true),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var file = _step10.value;
          file.processing = true; // Backwards compatibility

          file.status = Dropzone.UPLOADING;
          this.emit("processing", file);
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }

      return this.uploadFiles(files);
    }
  }, {
    key: "_getFilesWithXhr",
    value: function _getFilesWithXhr(xhr) {
      var files;
      return files = this.files.filter(function (file) {
        return file.xhr === xhr;
      }).map(function (file) {
        return file;
      });
    } // Cancels the file upload and sets the status to CANCELED
    // **if** the file is actually being uploaded.
    // If it's still in the queue, the file is being removed from it and the status
    // set to CANCELED.

  }, {
    key: "cancelUpload",
    value: function cancelUpload(file) {
      if (file.status === Dropzone.UPLOADING) {
        var groupedFiles = this._getFilesWithXhr(file.xhr);

        var _iterator11 = dropzone_createForOfIteratorHelper(groupedFiles, true),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var groupedFile = _step11.value;
            groupedFile.status = Dropzone.CANCELED;
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        if (typeof file.xhr !== "undefined") {
          file.xhr.abort();
        }

        var _iterator12 = dropzone_createForOfIteratorHelper(groupedFiles, true),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var _groupedFile = _step12.value;
            this.emit("canceled", _groupedFile);
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }

        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);

        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }, {
    key: "resolveOption",
    value: function resolveOption(option) {
      if (typeof option === "function") {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return option.apply(this, args);
      }

      return option;
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(file) {
      return this.uploadFiles([file]);
    }
  }, {
    key: "uploadFiles",
    value: function uploadFiles(files) {
      var _this14 = this;

      this._transformFiles(files, function (transformedFiles) {
        if (_this14.options.chunking) {
          // Chunking is not allowed to be used with `uploadMultiple` so we know
          // that there is only __one__file.
          var transformedFile = transformedFiles[0];
          files[0].upload.chunked = _this14.options.chunking && (_this14.options.forceChunking || transformedFile.size > _this14.options.chunkSize);
          files[0].upload.totalChunkCount = Math.ceil(transformedFile.size / _this14.options.chunkSize);
        }

        if (files[0].upload.chunked) {
          // This file should be sent in chunks!
          // If the chunking option is set, we **know** that there can only be **one** file, since
          // uploadMultiple is not allowed with this option.
          var file = files[0];
          var _transformedFile = transformedFiles[0];
          var startedChunkCount = 0;
          file.upload.chunks = [];

          var handleNextChunk = function handleNextChunk() {
            var chunkIndex = 0; // Find the next item in file.upload.chunks that is not defined yet.

            while (file.upload.chunks[chunkIndex] !== undefined) {
              chunkIndex++;
            } // This means, that all chunks have already been started.


            if (chunkIndex >= file.upload.totalChunkCount) return;
            startedChunkCount++;
            var start = chunkIndex * _this14.options.chunkSize;
            var end = Math.min(start + _this14.options.chunkSize, _transformedFile.size);
            var dataBlock = {
              name: _this14._getParamName(0),
              data: _transformedFile.webkitSlice ? _transformedFile.webkitSlice(start, end) : _transformedFile.slice(start, end),
              filename: file.upload.filename,
              chunkIndex: chunkIndex
            };
            file.upload.chunks[chunkIndex] = {
              file: file,
              index: chunkIndex,
              dataBlock: dataBlock,
              // In case we want to retry.
              status: Dropzone.UPLOADING,
              progress: 0,
              retries: 0 // The number of times this block has been retried.

            };

            _this14._uploadData(files, [dataBlock]);
          };

          file.upload.finishedChunkUpload = function (chunk, response) {
            var allFinished = true;
            chunk.status = Dropzone.SUCCESS; // Clear the data from the chunk

            chunk.dataBlock = null; // Leaving this reference to xhr intact here will cause memory leaks in some browsers

            chunk.xhr = null;

            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              if (file.upload.chunks[i] === undefined) {
                return handleNextChunk();
              }

              if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
                allFinished = false;
              }
            }

            if (allFinished) {
              _this14.options.chunksUploaded(file, function () {
                _this14._finished(files, response, null);
              });
            }
          };

          if (_this14.options.parallelChunkUploads) {
            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              handleNextChunk();
            }
          } else {
            handleNextChunk();
          }
        } else {
          var dataBlocks = [];

          for (var _i2 = 0; _i2 < files.length; _i2++) {
            dataBlocks[_i2] = {
              name: _this14._getParamName(_i2),
              data: transformedFiles[_i2],
              filename: files[_i2].upload.filename
            };
          }

          _this14._uploadData(files, dataBlocks);
        }
      });
    } /// Returns the right chunk for given file and xhr

  }, {
    key: "_getChunk",
    value: function _getChunk(file, xhr) {
      for (var i = 0; i < file.upload.totalChunkCount; i++) {
        if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
          return file.upload.chunks[i];
        }
      }
    } // This function actually uploads the file(s) to the server.
    // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
    // files, or individual chunks for chunked upload).

  }, {
    key: "_uploadData",
    value: function _uploadData(files, dataBlocks) {
      var _this15 = this;

      var xhr = new XMLHttpRequest(); // Put the xhr object in the file objects to be able to reference it later.

      var _iterator13 = dropzone_createForOfIteratorHelper(files, true),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var file = _step13.value;
          file.xhr = xhr;
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      if (files[0].upload.chunked) {
        // Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
        files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
      }

      var method = this.resolveOption(this.options.method, files);
      var url = this.resolveOption(this.options.url, files);
      xhr.open(method, url, true); // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8

      var timeout = this.resolveOption(this.options.timeout, files);
      if (timeout) xhr.timeout = this.resolveOption(this.options.timeout, files); // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179

      xhr.withCredentials = !!this.options.withCredentials;

      xhr.onload = function (e) {
        _this15._finishedUploading(files, xhr, e);
      };

      xhr.ontimeout = function () {
        _this15._handleUploadError(files, xhr, "Request timedout after ".concat(_this15.options.timeout / 1000, " seconds"));
      };

      xhr.onerror = function () {
        _this15._handleUploadError(files, xhr);
      }; // Some browsers do not have the .upload property


      var progressObj = xhr.upload != null ? xhr.upload : xhr;

      progressObj.onprogress = function (e) {
        return _this15._updateFilesUploadProgress(files, xhr, e);
      };

      var headers = {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };

      if (this.options.headers) {
        Dropzone.extend(headers, this.options.headers);
      }

      for (var headerName in headers) {
        var headerValue = headers[headerName];

        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }

      var formData = new FormData(); // Adding all @options parameters

      if (this.options.params) {
        var additionalParams = this.options.params;

        if (typeof additionalParams === "function") {
          additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
        }

        for (var key in additionalParams) {
          var value = additionalParams[key];

          if (Array.isArray(value)) {
            // The additional parameter contains an array,
            // so lets iterate over it to attach each value
            // individually.
            for (var i = 0; i < value.length; i++) {
              formData.append(key, value[i]);
            }
          } else {
            formData.append(key, value);
          }
        }
      } // Let the user add additional data if necessary


      var _iterator14 = dropzone_createForOfIteratorHelper(files, true),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var _file = _step14.value;
          this.emit("sending", _file, xhr, formData);
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }

      this._addFormElementData(formData); // Finally add the files
      // Has to be last because some servers (eg: S3) expect the file to be the last parameter


      for (var _i3 = 0; _i3 < dataBlocks.length; _i3++) {
        var dataBlock = dataBlocks[_i3];
        formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
      }

      this.submitRequest(xhr, formData, files);
    } // Transforms all files with this.options.transformFile and invokes done with the transformed files when done.

  }, {
    key: "_transformFiles",
    value: function _transformFiles(files, done) {
      var _this16 = this;

      var transformedFiles = []; // Clumsy way of handling asynchronous calls, until I get to add a proper Future library.

      var doneCounter = 0;

      var _loop = function _loop(i) {
        _this16.options.transformFile.call(_this16, files[i], function (transformedFile) {
          transformedFiles[i] = transformedFile;

          if (++doneCounter === files.length) {
            done(transformedFiles);
          }
        });
      };

      for (var i = 0; i < files.length; i++) {
        _loop(i);
      }
    } // Takes care of adding other input elements of the form to the AJAX request

  }, {
    key: "_addFormElementData",
    value: function _addFormElementData(formData) {
      // Take care of other input elements
      if (this.element.tagName === "FORM") {
        var _iterator15 = dropzone_createForOfIteratorHelper(this.element.querySelectorAll("input, textarea, select, button"), true),
            _step15;

        try {
          for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
            var input = _step15.value;
            var inputName = input.getAttribute("name");
            var inputType = input.getAttribute("type");
            if (inputType) inputType = inputType.toLowerCase(); // If the input doesn't have a name, we can't use it.

            if (typeof inputName === "undefined" || inputName === null) continue;

            if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
              // Possibly multiple values
              var _iterator16 = dropzone_createForOfIteratorHelper(input.options, true),
                  _step16;

              try {
                for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                  var option = _step16.value;

                  if (option.selected) {
                    formData.append(inputName, option.value);
                  }
                }
              } catch (err) {
                _iterator16.e(err);
              } finally {
                _iterator16.f();
              }
            } else if (!inputType || inputType !== "checkbox" && inputType !== "radio" || input.checked) {
              formData.append(inputName, input.value);
            }
          }
        } catch (err) {
          _iterator15.e(err);
        } finally {
          _iterator15.f();
        }
      }
    } // Invoked when there is new progress information about given files.
    // If e is not provided, it is assumed that the upload is finished.

  }, {
    key: "_updateFilesUploadProgress",
    value: function _updateFilesUploadProgress(files, xhr, e) {
      if (!files[0].upload.chunked) {
        // Handle file uploads without chunking
        var _iterator17 = dropzone_createForOfIteratorHelper(files, true),
            _step17;

        try {
          for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
            var file = _step17.value;

            if (file.upload.total && file.upload.bytesSent && file.upload.bytesSent == file.upload.total) {
              // If both, the `total` and `bytesSent` have already been set, and
              // they are equal (meaning progress is at 100%), we can skip this
              // file, since an upload progress shouldn't go down.
              continue;
            }

            if (e) {
              file.upload.progress = 100 * e.loaded / e.total;
              file.upload.total = e.total;
              file.upload.bytesSent = e.loaded;
            } else {
              // No event, so we're at 100%
              file.upload.progress = 100;
              file.upload.bytesSent = file.upload.total;
            }

            this.emit("uploadprogress", file, file.upload.progress, file.upload.bytesSent);
          }
        } catch (err) {
          _iterator17.e(err);
        } finally {
          _iterator17.f();
        }
      } else {
        // Handle chunked file uploads
        // Chunked upload is not compatible with uploading multiple files in one
        // request, so we know there's only one file.
        var _file2 = files[0]; // Since this is a chunked upload, we need to update the appropriate chunk
        // progress.

        var chunk = this._getChunk(_file2, xhr);

        if (e) {
          chunk.progress = 100 * e.loaded / e.total;
          chunk.total = e.total;
          chunk.bytesSent = e.loaded;
        } else {
          // No event, so we're at 100%
          chunk.progress = 100;
          chunk.bytesSent = chunk.total;
        } // Now tally the *file* upload progress from its individual chunks


        _file2.upload.progress = 0;
        _file2.upload.total = 0;
        _file2.upload.bytesSent = 0;

        for (var i = 0; i < _file2.upload.totalChunkCount; i++) {
          if (_file2.upload.chunks[i] && typeof _file2.upload.chunks[i].progress !== "undefined") {
            _file2.upload.progress += _file2.upload.chunks[i].progress;
            _file2.upload.total += _file2.upload.chunks[i].total;
            _file2.upload.bytesSent += _file2.upload.chunks[i].bytesSent;
          }
        } // Since the process is a percentage, we need to divide by the amount of
        // chunks we've used.


        _file2.upload.progress = _file2.upload.progress / _file2.upload.totalChunkCount;
        this.emit("uploadprogress", _file2, _file2.upload.progress, _file2.upload.bytesSent);
      }
    }
  }, {
    key: "_finishedUploading",
    value: function _finishedUploading(files, xhr, e) {
      var response;

      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.responseType !== "arraybuffer" && xhr.responseType !== "blob") {
        response = xhr.responseText;

        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
          try {
            response = JSON.parse(response);
          } catch (error) {
            e = error;
            response = "Invalid JSON response from server.";
          }
        }
      }

      this._updateFilesUploadProgress(files, xhr);

      if (!(200 <= xhr.status && xhr.status < 300)) {
        this._handleUploadError(files, xhr, response);
      } else {
        if (files[0].upload.chunked) {
          files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr), response);
        } else {
          this._finished(files, response, e);
        }
      }
    }
  }, {
    key: "_handleUploadError",
    value: function _handleUploadError(files, xhr, response) {
      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (files[0].upload.chunked && this.options.retryChunks) {
        var chunk = this._getChunk(files[0], xhr);

        if (chunk.retries++ < this.options.retryChunksLimit) {
          this._uploadData(files, [chunk.dataBlock]);

          return;
        } else {
          console.warn("Retried this chunk too often. Giving up.");
        }
      }

      this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
    }
  }, {
    key: "submitRequest",
    value: function submitRequest(xhr, formData, files) {
      if (xhr.readyState != 1) {
        console.warn("Cannot send this request because the XMLHttpRequest.readyState is not OPENED.");
        return;
      }

      xhr.send(formData);
    } // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_finished",
    value: function _finished(files, responseText, e) {
      var _iterator18 = dropzone_createForOfIteratorHelper(files, true),
          _step18;

      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var file = _step18.value;
          file.status = Dropzone.SUCCESS;
          this.emit("success", file, responseText, e);
          this.emit("complete", file);
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }

      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    } // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_errorProcessing",
    value: function _errorProcessing(files, message, xhr) {
      var _iterator19 = dropzone_createForOfIteratorHelper(files, true),
          _step19;

      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var file = _step19.value;
          file.status = Dropzone.ERROR;
          this.emit("error", file, message, xhr);
          this.emit("complete", file);
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }

      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }], [{
    key: "initClass",
    value: function initClass() {
      // Exposing the emitter class, mainly for tests
      this.prototype.Emitter = Emitter;
      /*
       This is a list of all available events you can register on a dropzone object.
        You can register an event handler like this:
        dropzone.on("dragEnter", function() { });
        */

      this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];
      this.prototype._thumbnailQueue = [];
      this.prototype._processingThumbnail = false;
    } // global utility

  }, {
    key: "extend",
    value: function extend(target) {
      for (var _len2 = arguments.length, objects = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        objects[_key2 - 1] = arguments[_key2];
      }

      for (var _i4 = 0, _objects = objects; _i4 < _objects.length; _i4++) {
        var object = _objects[_i4];

        for (var key in object) {
          var val = object[key];
          target[key] = val;
        }
      }

      return target;
    }
  }, {
    key: "uuidv4",
    value: function uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
  }]);

  return Dropzone;
}(Emitter);


Dropzone.initClass();
Dropzone.version = "5.9.2"; // This is a map of options for your different dropzones. Add configurations
// to this object for your different dropzone elemens.
//
// Example:
//
//     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
//
// To disable autoDiscover for a specific element, you can set `false` as an option:
//
//     Dropzone.options.myDisabledElementId = false;
//
// And in html:
//
//     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>

Dropzone.options = {}; // Returns the options for an element or undefined if none available.

Dropzone.optionsForElement = function (element) {
  // Get the `Dropzone.options.elementId` for this element if it exists
  if (element.getAttribute("id")) {
    return Dropzone.options[camelize(element.getAttribute("id"))];
  } else {
    return undefined;
  }
}; // Holds a list of all dropzone instances


Dropzone.instances = []; // Returns the dropzone for given element if any

Dropzone.forElement = function (element) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }

  if ((element != null ? element.dropzone : undefined) == null) {
    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
  }

  return element.dropzone;
}; // Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.


Dropzone.autoDiscover = true; // Looks for all .dropzone elements and creates a dropzone for them

Dropzone.discover = function () {
  var dropzones;

  if (document.querySelectorAll) {
    dropzones = document.querySelectorAll(".dropzone");
  } else {
    dropzones = []; // IE :(

    var checkElements = function checkElements(elements) {
      return function () {
        var result = [];

        var _iterator20 = dropzone_createForOfIteratorHelper(elements, true),
            _step20;

        try {
          for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
            var el = _step20.value;

            if (/(^| )dropzone($| )/.test(el.className)) {
              result.push(dropzones.push(el));
            } else {
              result.push(undefined);
            }
          }
        } catch (err) {
          _iterator20.e(err);
        } finally {
          _iterator20.f();
        }

        return result;
      }();
    };

    checkElements(document.getElementsByTagName("div"));
    checkElements(document.getElementsByTagName("form"));
  }

  return function () {
    var result = [];

    var _iterator21 = dropzone_createForOfIteratorHelper(dropzones, true),
        _step21;

    try {
      for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
        var dropzone = _step21.value;

        // Create a dropzone unless auto discover has been disabled for specific element
        if (Dropzone.optionsForElement(dropzone) !== false) {
          result.push(new Dropzone(dropzone));
        } else {
          result.push(undefined);
        }
      }
    } catch (err) {
      _iterator21.e(err);
    } finally {
      _iterator21.f();
    }

    return result;
  }();
}; // Some browsers support drag and drog functionality, but not correctly.
//
// So I created a blocklist of userAgents. Yes, yes. Browser sniffing, I know.
// But what to do when browsers *theoretically* support an API, but crash
// when using it.
//
// This is a list of regular expressions tested against navigator.userAgent
//
// ** It should only be used on browser that *do* support the API, but
// incorrectly **


Dropzone.blockedBrowsers = [// The mac os and windows phone version of opera 12 seems to have a problem with the File drag'n'drop API.
/opera.*(Macintosh|Windows Phone).*version\/12/i]; // Checks if the browser is supported

Dropzone.isBrowserSupported = function () {
  var capableBrowser = true;

  if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
    if (!("classList" in document.createElement("a"))) {
      capableBrowser = false;
    } else {
      if (Dropzone.blacklistedBrowsers !== undefined) {
        // Since this has been renamed, this makes sure we don't break older
        // configuration.
        Dropzone.blockedBrowsers = Dropzone.blacklistedBrowsers;
      } // The browser supports the API, but may be blocked.


      var _iterator22 = dropzone_createForOfIteratorHelper(Dropzone.blockedBrowsers, true),
          _step22;

      try {
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          var regex = _step22.value;

          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }
    }
  } else {
    capableBrowser = false;
  }

  return capableBrowser;
};

Dropzone.dataURItoBlob = function (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]); // separate out the mime component

  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]; // write the bytes of the string to an ArrayBuffer

  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    ia[i] = byteString.charCodeAt(i);
  } // write the ArrayBuffer to a blob


  return new Blob([ab], {
    type: mimeString
  });
}; // Returns an array without the rejected item


var without = function without(list, rejectedItem) {
  return list.filter(function (item) {
    return item !== rejectedItem;
  }).map(function (item) {
    return item;
  });
}; // abc-def_ghi -> abcDefGhi


var camelize = function camelize(str) {
  return str.replace(/[\-_](\w)/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
}; // Creates an element from string


Dropzone.createElement = function (string) {
  var div = document.createElement("div");
  div.innerHTML = string;
  return div.childNodes[0];
}; // Tests if given element is inside (or simply is) the container


Dropzone.elementInside = function (element, container) {
  if (element === container) {
    return true;
  } // Coffeescript doesn't support do/while loops


  while (element = element.parentNode) {
    if (element === container) {
      return true;
    }
  }

  return false;
};

Dropzone.getElement = function (el, name) {
  var element;

  if (typeof el === "string") {
    element = document.querySelector(el);
  } else if (el.nodeType != null) {
    element = el;
  }

  if (element == null) {
    throw new Error("Invalid `".concat(name, "` option provided. Please provide a CSS selector or a plain HTML element."));
  }

  return element;
};

Dropzone.getElements = function (els, name) {
  var el, elements;

  if (els instanceof Array) {
    elements = [];

    try {
      var _iterator23 = dropzone_createForOfIteratorHelper(els, true),
          _step23;

      try {
        for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
          el = _step23.value;
          elements.push(this.getElement(el, name));
        }
      } catch (err) {
        _iterator23.e(err);
      } finally {
        _iterator23.f();
      }
    } catch (e) {
      elements = null;
    }
  } else if (typeof els === "string") {
    elements = [];

    var _iterator24 = dropzone_createForOfIteratorHelper(document.querySelectorAll(els), true),
        _step24;

    try {
      for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
        el = _step24.value;
        elements.push(el);
      }
    } catch (err) {
      _iterator24.e(err);
    } finally {
      _iterator24.f();
    }
  } else if (els.nodeType != null) {
    elements = [els];
  }

  if (elements == null || !elements.length) {
    throw new Error("Invalid `".concat(name, "` option provided. Please provide a CSS selector, a plain HTML element or a list of those."));
  }

  return elements;
}; // Asks the user the question and calls accepted or rejected accordingly
//
// The default implementation just uses `window.confirm` and then calls the
// appropriate callback.


Dropzone.confirm = function (question, accepted, rejected) {
  if (window.confirm(question)) {
    return accepted();
  } else if (rejected != null) {
    return rejected();
  }
}; // Validates the mime type like this:
//
// https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept


Dropzone.isValidFile = function (file, acceptedFiles) {
  if (!acceptedFiles) {
    return true;
  } // If there are no accepted mime types, it's OK


  acceptedFiles = acceptedFiles.split(",");
  var mimeType = file.type;
  var baseMimeType = mimeType.replace(/\/.*$/, "");

  var _iterator25 = dropzone_createForOfIteratorHelper(acceptedFiles, true),
      _step25;

  try {
    for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
      var validType = _step25.value;
      validType = validType.trim();

      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        // This is something like a image/* mime type
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
  } catch (err) {
    _iterator25.e(err);
  } finally {
    _iterator25.f();
  }

  return false;
}; // Augment jQuery


if (typeof jQuery !== "undefined" && jQuery !== null) {
  jQuery.fn.dropzone = function (options) {
    return this.each(function () {
      return new Dropzone(this, options);
    });
  };
} // Dropzone file status codes


Dropzone.ADDED = "added";
Dropzone.QUEUED = "queued"; // For backwards compatibility. Now, if a file is accepted, it's either queued
// or uploading.

Dropzone.ACCEPTED = Dropzone.QUEUED;
Dropzone.UPLOADING = "uploading";
Dropzone.PROCESSING = Dropzone.UPLOADING; // alias

Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";
/*

 Bugfix for iOS 6 and 7
 Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
 based on the work of https://github.com/stomita/ios-imagefile-megapixel

 */
// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel

var detectVerticalSquash = function detectVerticalSquash(img) {
  var iw = img.naturalWidth;
  var ih = img.naturalHeight;
  var canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var _ctx$getImageData = ctx.getImageData(1, 0, 1, ih),
      data = _ctx$getImageData.data; // search image edge pixel position in case it is squashed vertically.


  var sy = 0;
  var ey = ih;
  var py = ih;

  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3];

    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }

    py = ey + sy >> 1;
  }

  var ratio = py / ih;

  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
}; // A replacement for context.drawImage
// (args are for source and destination).


var drawImageIOSFix = function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
  var vertSquashRatio = detectVerticalSquash(img);
  return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
}; // Based on MinifyJpeg
// Source: http://www.perry.cz/files/ExifRestorer.js
// http://elicon.blog57.fc2.com/blog-entry-206.html


var ExifRestore = /*#__PURE__*/function () {
  function ExifRestore() {
    dropzone_classCallCheck(this, ExifRestore);
  }

  dropzone_createClass(ExifRestore, null, [{
    key: "initClass",
    value: function initClass() {
      this.KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    }
  }, {
    key: "encode64",
    value: function encode64(input) {
      var output = "";
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = "";
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = "";
      var i = 0;

      while (true) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

        if (!(i < input.length)) {
          break;
        }
      }

      return output;
    }
  }, {
    key: "restore",
    value: function restore(origFileBase64, resizedFileBase64) {
      if (!origFileBase64.match("data:image/jpeg;base64,")) {
        return resizedFileBase64;
      }

      var rawImage = this.decode64(origFileBase64.replace("data:image/jpeg;base64,", ""));
      var segments = this.slice2Segments(rawImage);
      var image = this.exifManipulation(resizedFileBase64, segments);
      return "data:image/jpeg;base64,".concat(this.encode64(image));
    }
  }, {
    key: "exifManipulation",
    value: function exifManipulation(resizedFileBase64, segments) {
      var exifArray = this.getExifArray(segments);
      var newImageArray = this.insertExif(resizedFileBase64, exifArray);
      var aBuffer = new Uint8Array(newImageArray);
      return aBuffer;
    }
  }, {
    key: "getExifArray",
    value: function getExifArray(segments) {
      var seg = undefined;
      var x = 0;

      while (x < segments.length) {
        seg = segments[x];

        if (seg[0] === 255 & seg[1] === 225) {
          return seg;
        }

        x++;
      }

      return [];
    }
  }, {
    key: "insertExif",
    value: function insertExif(resizedFileBase64, exifArray) {
      var imageData = resizedFileBase64.replace("data:image/jpeg;base64,", "");
      var buf = this.decode64(imageData);
      var separatePoint = buf.indexOf(255, 3);
      var mae = buf.slice(0, separatePoint);
      var ato = buf.slice(separatePoint);
      var array = mae;
      array = array.concat(exifArray);
      array = array.concat(ato);
      return array;
    }
  }, {
    key: "slice2Segments",
    value: function slice2Segments(rawImageArray) {
      var head = 0;
      var segments = [];

      while (true) {
        var length;

        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 218) {
          break;
        }

        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 216) {
          head += 2;
        } else {
          length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
          var endPoint = head + length + 2;
          var seg = rawImageArray.slice(head, endPoint);
          segments.push(seg);
          head = endPoint;
        }

        if (head > rawImageArray.length) {
          break;
        }
      }

      return segments;
    }
  }, {
    key: "decode64",
    value: function decode64(input) {
      var output = "";
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = "";
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = "";
      var i = 0;
      var buf = []; // remove all characters that are not A-Z, a-z, 0-9, +, /, or =

      var base64test = /[^A-Za-z0-9\+\/\=]/g;

      if (base64test.exec(input)) {
        console.warn("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding.");
      }

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (true) {
        enc1 = this.KEY_STR.indexOf(input.charAt(i++));
        enc2 = this.KEY_STR.indexOf(input.charAt(i++));
        enc3 = this.KEY_STR.indexOf(input.charAt(i++));
        enc4 = this.KEY_STR.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        buf.push(chr1);

        if (enc3 !== 64) {
          buf.push(chr2);
        }

        if (enc4 !== 64) {
          buf.push(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

        if (!(i < input.length)) {
          break;
        }
      }

      return buf;
    }
  }]);

  return ExifRestore;
}();

ExifRestore.initClass();
/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */
// @win window reference
// @fn function reference

var contentLoaded = function contentLoaded(win, fn) {
  var done = false;
  var top = true;
  var doc = win.document;
  var root = doc.documentElement;
  var add = doc.addEventListener ? "addEventListener" : "attachEvent";
  var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
  var pre = doc.addEventListener ? "" : "on";

  var init = function init(e) {
    if (e.type === "readystatechange" && doc.readyState !== "complete") {
      return;
    }

    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);

    if (!done && (done = true)) {
      return fn.call(win, e.type || e);
    }
  };

  var poll = function poll() {
    try {
      root.doScroll("left");
    } catch (e) {
      setTimeout(poll, 50);
      return;
    }

    return init("poll");
  };

  if (doc.readyState !== "complete") {
    if (doc.createEventObject && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (error) {}

      if (top) {
        poll();
      }
    }

    doc[add](pre + "DOMContentLoaded", init, false);
    doc[add](pre + "readystatechange", init, false);
    return win[add](pre + "load", init, false);
  }
}; // As a single function to be able to write tests.


Dropzone._autoDiscoverFunction = function () {
  if (Dropzone.autoDiscover) {
    return Dropzone.discover();
  }
};

contentLoaded(window, Dropzone._autoDiscoverFunction);

function __guard__(value, transform) {
  return typeof value !== "undefined" && value !== null ? transform(value) : undefined;
}

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== "undefined" && obj !== null && typeof obj[methodName] === "function") {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}


;// CONCATENATED MODULE: ./tool/dropzone.dist.js
 /// Make Dropzone a global variable.

window.Dropzone = Dropzone;
/* harmony default export */ var dropzone_dist = (Dropzone);

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deinterlace = void 0;

/**
 * Deinterlace function from https://github.com/shachaf/jsgif
 */
var deinterlace = function deinterlace(pixels, width) {
  var newPixels = new Array(pixels.length);
  var rows = pixels.length / width;

  var cpRow = function cpRow(toRow, fromRow) {
    var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
    newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
  }; // See appendix E.


  var offsets = [0, 4, 2, 1];
  var steps = [8, 8, 4, 2];
  var fromRow = 0;

  for (var pass = 0; pass < 4; pass++) {
    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
      cpRow(toRow, fromRow);
      fromRow++;
    }
  }

  return newPixels;
};

exports.deinterlace = deinterlace;
},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decompressFrames = exports.decompressFrame = exports.parseGIF = void 0;

var _gif = _interopRequireDefault(require("js-binary-schema-parser/lib/schemas/gif"));

var _jsBinarySchemaParser = require("js-binary-schema-parser");

var _uint = require("js-binary-schema-parser/lib/parsers/uint8");

var _deinterlace = require("./deinterlace");

var _lzw = require("./lzw");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var parseGIF = function parseGIF(arrayBuffer) {
  var byteData = new Uint8Array(arrayBuffer);
  return (0, _jsBinarySchemaParser.parse)((0, _uint.buildStream)(byteData), _gif["default"]);
};

exports.parseGIF = parseGIF;

var generatePatch = function generatePatch(image) {
  var totalPixels = image.pixels.length;
  var patchData = new Uint8ClampedArray(totalPixels * 4);

  for (var i = 0; i < totalPixels; i++) {
    var pos = i * 4;
    var colorIndex = image.pixels[i];
    var color = image.colorTable[colorIndex] || [0, 0, 0];
    patchData[pos] = color[0];
    patchData[pos + 1] = color[1];
    patchData[pos + 2] = color[2];
    patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0;
  }

  return patchData;
};

var decompressFrame = function decompressFrame(frame, gct, buildImagePatch) {
  if (!frame.image) {
    console.warn('gif frame does not have associated image.');
    return;
  }

  var image = frame.image; // get the number of pixels

  var totalPixels = image.descriptor.width * image.descriptor.height; // do lzw decompression

  var pixels = (0, _lzw.lzw)(image.data.minCodeSize, image.data.blocks, totalPixels); // deal with interlacing if necessary

  if (image.descriptor.lct.interlaced) {
    pixels = (0, _deinterlace.deinterlace)(pixels, image.descriptor.width);
  }

  var resultImage = {
    pixels: pixels,
    dims: {
      top: frame.image.descriptor.top,
      left: frame.image.descriptor.left,
      width: frame.image.descriptor.width,
      height: frame.image.descriptor.height
    }
  }; // color table

  if (image.descriptor.lct && image.descriptor.lct.exists) {
    resultImage.colorTable = image.lct;
  } else {
    resultImage.colorTable = gct;
  } // add per frame relevant gce information


  if (frame.gce) {
    resultImage.delay = (frame.gce.delay || 10) * 10; // convert to ms

    resultImage.disposalType = frame.gce.extras.disposal; // transparency

    if (frame.gce.extras.transparentColorGiven) {
      resultImage.transparentIndex = frame.gce.transparentColorIndex;
    }
  } // create canvas usable imagedata if desired


  if (buildImagePatch) {
    resultImage.patch = generatePatch(resultImage);
  }

  return resultImage;
};

exports.decompressFrame = decompressFrame;

var decompressFrames = function decompressFrames(parsedGif, buildImagePatches) {
  return parsedGif.frames.filter(function (f) {
    return f.image;
  }).map(function (f) {
    return decompressFrame(f, parsedGif.gct, buildImagePatches);
  });
};

exports.decompressFrames = decompressFrames;
},{"./deinterlace":5,"./lzw":7,"js-binary-schema-parser":8,"js-binary-schema-parser/lib/parsers/uint8":9,"js-binary-schema-parser/lib/schemas/gif":10}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lzw = void 0;

/**
 * javascript port of java LZW decompression
 * Original java author url: https://gist.github.com/devunwired/4479231
 */
var lzw = function lzw(minCodeSize, data, pixelCount) {
  var MAX_STACK_SIZE = 4096;
  var nullCode = -1;
  var npix = pixelCount;
  var available, clear, code_mask, code_size, end_of_information, in_code, old_code, bits, code, i, datum, data_size, first, top, bi, pi;
  var dstPixels = new Array(pixelCount);
  var prefix = new Array(MAX_STACK_SIZE);
  var suffix = new Array(MAX_STACK_SIZE);
  var pixelStack = new Array(MAX_STACK_SIZE + 1); // Initialize GIF data stream decoder.

  data_size = minCodeSize;
  clear = 1 << data_size;
  end_of_information = clear + 1;
  available = clear + 2;
  old_code = nullCode;
  code_size = data_size + 1;
  code_mask = (1 << code_size) - 1;

  for (code = 0; code < clear; code++) {
    prefix[code] = 0;
    suffix[code] = code;
  } // Decode GIF pixel stream.


  var datum, bits, count, first, top, pi, bi;
  datum = bits = count = first = top = pi = bi = 0;

  for (i = 0; i < npix;) {
    if (top === 0) {
      if (bits < code_size) {
        // get the next byte
        datum += data[bi] << bits;
        bits += 8;
        bi++;
        continue;
      } // Get the next code.


      code = datum & code_mask;
      datum >>= code_size;
      bits -= code_size; // Interpret the code

      if (code > available || code == end_of_information) {
        break;
      }

      if (code == clear) {
        // Reset decoder.
        code_size = data_size + 1;
        code_mask = (1 << code_size) - 1;
        available = clear + 2;
        old_code = nullCode;
        continue;
      }

      if (old_code == nullCode) {
        pixelStack[top++] = suffix[code];
        old_code = code;
        first = code;
        continue;
      }

      in_code = code;

      if (code == available) {
        pixelStack[top++] = first;
        code = old_code;
      }

      while (code > clear) {
        pixelStack[top++] = suffix[code];
        code = prefix[code];
      }

      first = suffix[code] & 0xff;
      pixelStack[top++] = first; // add a new string to the table, but only if space is available
      // if not, just continue with current table until a clear code is found
      // (deferred clear code implementation as per GIF spec)

      if (available < MAX_STACK_SIZE) {
        prefix[available] = old_code;
        suffix[available] = first;
        available++;

        if ((available & code_mask) === 0 && available < MAX_STACK_SIZE) {
          code_size++;
          code_mask += available;
        }
      }

      old_code = in_code;
    } // Pop a pixel off the pixel stack.


    top--;
    dstPixels[pi++] = pixelStack[top];
    i++;
  }

  for (i = pi; i < npix; i++) {
    dstPixels[i] = 0; // clear missing pixels
  }

  return dstPixels;
};

exports.lzw = lzw;
},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loop = exports.conditional = exports.parse = void 0;

var parse = function parse(stream, schema) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : result;

  if (Array.isArray(schema)) {
    schema.forEach(function (partSchema) {
      return parse(stream, partSchema, result, parent);
    });
  } else if (typeof schema === 'function') {
    schema(stream, result, parent, parse);
  } else {
    var key = Object.keys(schema)[0];

    if (Array.isArray(schema[key])) {
      parent[key] = {};
      parse(stream, schema[key], result, parent[key]);
    } else {
      parent[key] = schema[key](stream, result, parent, parse);
    }
  }

  return result;
};

exports.parse = parse;

var conditional = function conditional(schema, conditionFunc) {
  return function (stream, result, parent, parse) {
    if (conditionFunc(stream, result, parent)) {
      parse(stream, schema, result, parent);
    }
  };
};

exports.conditional = conditional;

var loop = function loop(schema, continueFunc) {
  return function (stream, result, parent, parse) {
    var arr = [];

    while (continueFunc(stream, result, parent)) {
      var newParent = {};
      parse(stream, schema, result, newParent);
      arr.push(newParent);
    }

    return arr;
  };
};

exports.loop = loop;
},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readBits = exports.readArray = exports.readUnsigned = exports.readString = exports.peekBytes = exports.readBytes = exports.peekByte = exports.readByte = exports.buildStream = void 0;

// Default stream and parsers for Uint8TypedArray data type
var buildStream = function buildStream(uint8Data) {
  return {
    data: uint8Data,
    pos: 0
  };
};

exports.buildStream = buildStream;

var readByte = function readByte() {
  return function (stream) {
    return stream.data[stream.pos++];
  };
};

exports.readByte = readByte;

var peekByte = function peekByte() {
  var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function (stream) {
    return stream.data[stream.pos + offset];
  };
};

exports.peekByte = peekByte;

var readBytes = function readBytes(length) {
  return function (stream) {
    return stream.data.subarray(stream.pos, stream.pos += length);
  };
};

exports.readBytes = readBytes;

var peekBytes = function peekBytes(length) {
  return function (stream) {
    return stream.data.subarray(stream.pos, stream.pos + length);
  };
};

exports.peekBytes = peekBytes;

var readString = function readString(length) {
  return function (stream) {
    return Array.from(readBytes(length)(stream)).map(function (value) {
      return String.fromCharCode(value);
    }).join('');
  };
};

exports.readString = readString;

var readUnsigned = function readUnsigned(littleEndian) {
  return function (stream) {
    var bytes = readBytes(2)(stream);
    return littleEndian ? (bytes[1] << 8) + bytes[0] : (bytes[0] << 8) + bytes[1];
  };
};

exports.readUnsigned = readUnsigned;

var readArray = function readArray(byteSize, totalOrFunc) {
  return function (stream, result, parent) {
    var total = typeof totalOrFunc === 'function' ? totalOrFunc(stream, result, parent) : totalOrFunc;
    var parser = readBytes(byteSize);
    var arr = new Array(total);

    for (var i = 0; i < total; i++) {
      arr[i] = parser(stream);
    }

    return arr;
  };
};

exports.readArray = readArray;

var subBitsTotal = function subBitsTotal(bits, startIndex, length) {
  var result = 0;

  for (var i = 0; i < length; i++) {
    result += bits[startIndex + i] && Math.pow(2, length - i - 1);
  }

  return result;
};

var readBits = function readBits(schema) {
  return function (stream) {
    var _byte = readByte()(stream); // convert the byte to bit array


    var bits = new Array(8);

    for (var i = 0; i < 8; i++) {
      bits[7 - i] = !!(_byte & 1 << i);
    } // convert the bit array to values based on the schema


    return Object.keys(schema).reduce(function (res, key) {
      var def = schema[key];

      if (def.length) {
        res[key] = subBitsTotal(bits, def.index, def.length);
      } else {
        res[key] = bits[def.index];
      }

      return res;
    }, {});
  };
};

exports.readBits = readBits;
},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ = require("../");

var _uint = require("../parsers/uint8");

// a set of 0x00 terminated subblocks
var subBlocksSchema = {
  blocks: function blocks(stream) {
    var terminator = 0x00;
    var chunks = [];
    var streamSize = stream.data.length;
    var total = 0;

    for (var size = (0, _uint.readByte)()(stream); size !== terminator; size = (0, _uint.readByte)()(stream)) {
      // catch corrupted files with no terminator
      if (stream.pos + size >= streamSize) {
        var availableSize = streamSize - stream.pos;
        chunks.push((0, _uint.readBytes)(availableSize)(stream));
        total += availableSize;
        break;
      }

      chunks.push((0, _uint.readBytes)(size)(stream));
      total += size;
    }

    var result = new Uint8Array(total);
    var offset = 0;

    for (var i = 0; i < chunks.length; i++) {
      result.set(chunks[i], offset);
      offset += chunks[i].length;
    }

    return result;
  }
}; // global control extension

var gceSchema = (0, _.conditional)({
  gce: [{
    codes: (0, _uint.readBytes)(2)
  }, {
    byteSize: (0, _uint.readByte)()
  }, {
    extras: (0, _uint.readBits)({
      future: {
        index: 0,
        length: 3
      },
      disposal: {
        index: 3,
        length: 3
      },
      userInput: {
        index: 6
      },
      transparentColorGiven: {
        index: 7
      }
    })
  }, {
    delay: (0, _uint.readUnsigned)(true)
  }, {
    transparentColorIndex: (0, _uint.readByte)()
  }, {
    terminator: (0, _uint.readByte)()
  }]
}, function (stream) {
  var codes = (0, _uint.peekBytes)(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0xf9;
}); // image pipeline block

var imageSchema = (0, _.conditional)({
  image: [{
    code: (0, _uint.readByte)()
  }, {
    descriptor: [{
      left: (0, _uint.readUnsigned)(true)
    }, {
      top: (0, _uint.readUnsigned)(true)
    }, {
      width: (0, _uint.readUnsigned)(true)
    }, {
      height: (0, _uint.readUnsigned)(true)
    }, {
      lct: (0, _uint.readBits)({
        exists: {
          index: 0
        },
        interlaced: {
          index: 1
        },
        sort: {
          index: 2
        },
        future: {
          index: 3,
          length: 2
        },
        size: {
          index: 5,
          length: 3
        }
      })
    }]
  }, (0, _.conditional)({
    lct: (0, _uint.readArray)(3, function (stream, result, parent) {
      return Math.pow(2, parent.descriptor.lct.size + 1);
    })
  }, function (stream, result, parent) {
    return parent.descriptor.lct.exists;
  }), {
    data: [{
      minCodeSize: (0, _uint.readByte)()
    }, subBlocksSchema]
  }]
}, function (stream) {
  return (0, _uint.peekByte)()(stream) === 0x2c;
}); // plain text block

var textSchema = (0, _.conditional)({
  text: [{
    codes: (0, _uint.readBytes)(2)
  }, {
    blockSize: (0, _uint.readByte)()
  }, {
    preData: function preData(stream, result, parent) {
      return (0, _uint.readBytes)(parent.text.blockSize)(stream);
    }
  }, subBlocksSchema]
}, function (stream) {
  var codes = (0, _uint.peekBytes)(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0x01;
}); // application block

var applicationSchema = (0, _.conditional)({
  application: [{
    codes: (0, _uint.readBytes)(2)
  }, {
    blockSize: (0, _uint.readByte)()
  }, {
    id: function id(stream, result, parent) {
      return (0, _uint.readString)(parent.blockSize)(stream);
    }
  }, subBlocksSchema]
}, function (stream) {
  var codes = (0, _uint.peekBytes)(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0xff;
}); // comment block

var commentSchema = (0, _.conditional)({
  comment: [{
    codes: (0, _uint.readBytes)(2)
  }, subBlocksSchema]
}, function (stream) {
  var codes = (0, _uint.peekBytes)(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0xfe;
});
var schema = [{
  header: [{
    signature: (0, _uint.readString)(3)
  }, {
    version: (0, _uint.readString)(3)
  }]
}, {
  lsd: [{
    width: (0, _uint.readUnsigned)(true)
  }, {
    height: (0, _uint.readUnsigned)(true)
  }, {
    gct: (0, _uint.readBits)({
      exists: {
        index: 0
      },
      resolution: {
        index: 1,
        length: 3
      },
      sort: {
        index: 4
      },
      size: {
        index: 5,
        length: 3
      }
    })
  }, {
    backgroundColorIndex: (0, _uint.readByte)()
  }, {
    pixelAspectRatio: (0, _uint.readByte)()
  }]
}, (0, _.conditional)({
  gct: (0, _uint.readArray)(3, function (stream, result) {
    return Math.pow(2, result.lsd.gct.size + 1);
  })
}, function (stream, result) {
  return result.lsd.gct.exists;
}), // content frames
{
  frames: (0, _.loop)([gceSchema, applicationSchema, commentSchema, imageSchema, textSchema], function (stream) {
    var nextCode = (0, _uint.peekByte)()(stream); // rather than check for a terminator, we should check for the existence
    // of an ext or image block to avoid infinite loops
    //var terminator = 0x3B;
    //return nextCode !== terminator;

    return nextCode === 0x21 || nextCode === 0x2c;
  })
}];
var _default = schema;
exports["default"] = _default;
},{"../":8,"../parsers/uint8":9}],11:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],13:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":11,"timers":13}]},{},[2]);
