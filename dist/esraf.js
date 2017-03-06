'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var frameDuration;
var id;
var last;
var queue;
var ref;
var ref1;
var root;

frameDuration = 1000 / 60;

id = 0;

last = 0;

queue = [];

var raf = function(callback) {
  var next, now;
  if (queue.length === 0) {
    now = Date.now();
    next = Math.max(0, frameDuration - (now - last));
    last = next + now;
    setTimeout(function() {
      var cp, err, i, len, x;
      cp = queue.slice(0);
      queue.length = 0;
      for (i = 0, len = cp.length; i < len; i++) {
        x = cp[i];
        if (!x.cancelled) {
          try {
            x.callback(last);
          } catch (error) {
            err = error;
            setTimeout(function() {
              throw err;
            }, 0);
          }
        }
      }
    }, Math.round(next));
  }
  queue.push({
    handle: ++id,
    callback: callback,
    cancelled: false
  });
  return id;
};

var caf = function(handle) {
  var i, len, x;
  for (i = 0, len = queue.length; i < len; i++) {
    x = queue[i];
    if (x.handle === handle) {
      x.cancelled = true;
    }
  }
};

root = typeof window === 'undefined' ? global : window;

var requestAnimationFrame = (ref = root.requestAnimationFrame) != null ? ref : raf;

var cancelAnimationFrame = (ref1 = root.cancelAnimationFrame) != null ? ref1 : caf;

exports.raf = raf;
exports.caf = caf;
exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;
