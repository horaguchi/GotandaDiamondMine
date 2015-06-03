var GotandaDiamondMine = require('./GotandaDiamondMine');

// for node.js, not for CommonJS
module.exports = GotandaDiamondMine;

GotandaDiamondMine.prototype.initialCanvas = function (element) {
  this.canvasElement = document.createElement('canvas');
  element.appendChild(this.canvasElement);
  this.resizeCanvas();

  GotandaDiamondMine.ins = this;
  var gdm = this;
  this.canvasElement.addEventListener('touchstart', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = gdm.getPointFromHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top, 'start');
    if (gdm.point(point[0], point[1])) {
      if (gdm.state === GotandaDiamondMine.STATE_ANIMATION && !gdm.animationInterval) {
        gdm.startAnimation();
      }
      gdm.draw();
    }
    gdm.touchNow = point;
  });

  this.canvasElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = gdm.getPointFromHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top, 'move');
    if (gdm.touchNow[0] === point[0] && gdm.touchNow[1] === point[1]) {
      // nothing

    } else if (gdm.point(point[0], point[1])) {
      if (gdm.state === GotandaDiamondMine.STATE_ANIMATION && !gdm.animationInterval) {
        gdm.startAnimation();
      }
      gdm.draw();
    }
    gdm.touchNow = point;
  });

  this.canvasElement.addEventListener('mousedown', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = gdm.getPointFromHTML(e.clientX - rect.left, e.clientY - rect.top);
    if (gdm.point(point[0], point[1])) {
      if (gdm.state === GotandaDiamondMine.STATE_ANIMATION && !gdm.animationInterval) {
        gdm.startAnimation();
      }
      gdm.draw();
    }
  });

  window.addEventListener('resize', function() {
    if (gdm.resizeTimer) {
      clearTimeout(gdm.resizeTimer);
    }
    gdm.resizeTimer = setTimeout(function () {
      gdm.resizeCanvas();
    }, 100);
  });

};

GotandaDiamondMine.prototype.resizeCanvas = function () {
  if (this.maxWidth  && this.maxWidth  === window.innerWidth &&
      this.maxHeight && this.maxHeight === window.innerHeight) {
    return; // nothing to do
  }

  var device_pixel_ratio = window.devicePixelRatio || 1;
  this.maxWidth  = window.innerWidth;
  this.maxHeight = window.innerHeight;
  var font_size = Math.min(Math.floor(this.maxWidth * device_pixel_ratio / 27), Math.floor(this.maxHeight * device_pixel_ratio / 48));
  this.fontX = font_size; this.fontY = font_size;
  this.devicePixelRatio = device_pixel_ratio;

  this.canvasElement.setAttribute('width',  this.fontX * 27);
  this.canvasElement.setAttribute('height', this.fontY * 48);
  this.canvasElement.parentElement.style.width  = Math.round(this.fontX * 27 / device_pixel_ratio) + 'px';
  this.canvasElement.parentElement.style.height = Math.round(this.fontY * 48 / device_pixel_ratio) + 'px';
  this.canvasElement.style.width  = Math.round(this.fontX * 27 / device_pixel_ratio) + 'px';
  this.canvasElement.style.height = Math.round(this.fontY * 48 / device_pixel_ratio) + 'px';
  this.canvasContext = this.canvasElement.getContext("2d");
  this.canvasContext.fillStyle = 'black';

  this.fontCanvasElement = document.createElement('canvas');
  this.fontCanvasElement.setAttribute('width',  this.fontX);
  this.fontCanvasElement.setAttribute('height', this.fontY);
  this.fontCanvasContext = this.fontCanvasElement.getContext("2d");
  this.fontCanvasContext.fillStyle = this.fillStyle = 'white';
  this.fontCanvasContext.font = this.fontY + 'px Monospace';
  this.fontCanvasContext.textAlign = 'center';
  this.fontCanvasContext.textBaseline = 'middle';

  // initial drawing
  this.draw(true);
};

GotandaDiamondMine.prototype.getPointFromHTML = function (x, y, mode) {
  var px = x, py = y;
  if (mode === 'start') {
    this.touchStart = [ x, y ];
  } else if (mode === 'move' ) { // swiping is 1/2 speed
    var touch_start = this.touchStart;
    px = (touch_start[0] + x) / 2;
    py = (touch_start[1] + y) / 2;
  }
  var mx = Math.floor(px * this.devicePixelRatio / this.fontX), my = Math.floor(py * this.devicePixelRatio / this.fontY);
  return [ mx, my ];
};

GotandaDiamondMine.COLOR_REGEXP = /^\{([^-]+)-fg\}(.*)\{\/\1-fg\}$/;
GotandaDiamondMine.prototype.draw = function (initial) {
  var screen = this.getScreen();
  var context = this.canvasContext;
  var font_canvas = this.fontCanvasElement;
  var font_context = this.fontCanvasContext;
  var old_screen = initial ? null : this.oldScreen;
  var dw = this.fontX, dh = this.fontY;
  for (var y = 0; y < 48; ++y) {
    for (var x = 0; x < 27; ++x) {
      var str = screen[y][x];
      if (old_screen && str === old_screen[y][x]) {
        continue;
      }

      var colors = GotandaDiamondMine.COLOR_REGEXP.exec(str);
      if (colors) {
        if (this.fillStyle !== colors[1]) {
          font_context.fillStyle = this.fillStyle = colors[1];
        }
        str = colors[2];
      } else {
        if (this.fillStyle !== 'white') {
          font_context.fillStyle = this.fillStyle = 'white';
        }
      }
      var dx = dw * x, dy = dh * y;
      var px = dw * 0.5, py = dh * 0.5;
      context.fillRect(dx, dy, dw, dh);
      font_context.clearRect(0, 0, dw, dh);
      font_context.fillText(str, px, py);
      context.drawImage(font_canvas, dx, dy);
    }
  }
  this.oldScreen = screen.map(function (row) { return row.concat(); });
};

GotandaDiamondMine.prototype.startAnimation = function () {
  var gdm = this;
  this.animationInterval = setInterval(function () {
    gdm.point(0, 0);
    gdm.draw();
    if (gdm.state !== GotandaDiamondMine.STATE_ANIMATION) {
      clearInterval(gdm.animationInterval);
      gdm.animationInterval = null;
    }
  }, 20);
};
