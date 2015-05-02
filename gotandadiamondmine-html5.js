GotandaDiamondMine.TILE_IMAGE_8x8 = new Image();
GotandaDiamondMine.TILE_IMAGE_8x8.src = "img/8x8.png";
GotandaDiamondMine.TILE_IMAGE_8x8_COLS = 16;
GotandaDiamondMine.prototype.initialCanvas = function (element) {
  this.canvasElement = document.createElement('canvas');
  element.appendChild(this.canvasElement);
  this.resizeCanvas();

  GotandaDiamondMine.ins = this;
  var gdm = this;
  this.canvasElement.addEventListener('touchstart', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = gdm.getPointFromHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    if (gdm.point(point[0], point[1])) {
      if (gdm.state == GotandaDiamondMine.STATE_ANIMATION && !gdm.animationInterval) {
        gdm.startAnimation();
      }
      gdm.draw();
    }
    gdm.touchNow = point;
  });

  this.canvasElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = gdm.getPointFromHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    if (gdm.touchNow[0] === point[0] && gdm.touchNow[1] === point[1]) {
      // nothing

    } else if (gdm.point(point[0], point[1])) {
      if (gdm.state == GotandaDiamondMine.STATE_ANIMATION && !gdm.animationInterval) {
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
      if (gdm.state == GotandaDiamondMine.STATE_ANIMATION && !gdm.animationInterval) {
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
  if (this.maxWidth  && this.maxWidth  == window.innerWidth &&
      this.maxHeight && this.maxHeight == window.innerHeight) {
    return; // nothing to do
  }

  this.fontX = 8; this.fontY = 8;
  this.canvasElement.setAttribute('width',  this.fontX * 27);
  this.canvasElement.setAttribute('height', this.fontY * 48);
  this.canvasElement.parentElement.style.width  = (this.fontX * 27) + 'px';
  this.canvasElement.parentElement.style.height = (this.fontY * 48) + 'px';
  this.canvasElement.style.width  = (this.fontX * 27) + 'px';
  this.canvasElement.style.height = (this.fontY * 48) + 'px';
  this.canvasContext = this.canvasElement.getContext("2d");
  this.canvasContext.fillStyle = this.fillStyle = 'white';

  var viewport = document.querySelector("meta[name=viewport]");
  var new_width = Math.round(this.fontY * 48 * window.innerWidth / window.innerHeight);
  viewport.setAttribute('content', 'width=' + (new_width - new_width % 10 + 10));
  this.maxWidth  = window.innerWidth;
  this.maxHeight = window.innerHeight;

  // initial drawing
  this.draw(true);
};

GotandaDiamondMine.prototype.pointHTML = function (x, y) {
  var mx = parseInt(x / this.fontX), my = parseInt(y / this.fontY);
  return this.point(mx, my);
};

GotandaDiamondMine.prototype.getPointFromHTML = function (x, y) {
  var mx = parseInt(x / this.fontX), my = parseInt(y / this.fontY);
  return [ mx, my ];
};

GotandaDiamondMine.COLOR_REGEXP = /^\{([^-]+)-fg\}(.*)\{\/\1-fg\}$/;
GotandaDiamondMine.prototype.draw = function (initial) {
  var screen = this.getScreen();
  var context = this.canvasContext;
  var old_screen = initial ? null : this.oldScreen;
  var dw = this.fontX, dh = this.fontY;
  for (var y = 0; y < 48; ++y) {
    for (var x = 0; x < 27; ++x) {
      var str = screen[y][x];
      if (old_screen && str == old_screen[y][x]) {
        continue;
      }

      var colors = GotandaDiamondMine.COLOR_REGEXP.exec(str);
      if (colors) {
        if (this.fillStyle != colors[1]) {
          context.fillStyle = this.fillStyle = colors[1];
        }
        str = colors[2];
      } else {
        if (this.fillStyle != 'white') {
          context.fillStyle = this.fillStyle = 'white';
        }
      }
      var char_code = str.charCodeAt(0);
      var dx = dw * x, dy = dh * y;
      var sx = char_code % GotandaDiamondMine.TILE_IMAGE_8x8_COLS;
      var sy = Math.floor(char_code / GotandaDiamondMine.TILE_IMAGE_8x8_COLS);
      context.fillRect(dx, dy, dw, dh);
      context.drawImage(GotandaDiamondMine.TILE_IMAGE_8x8, sx * dw, sy * dh, dw, dh, dx, dy, dw, dh);
    }
  }
  // for debug
  //context.fillStyle = 'red';
  //context.fillText(this.maxWidth + "," + this.maxHeight + ',' + window.devicePixelRatio, 30, 350);
  //context.fillStyle = 'white';
  this.oldScreen = screen.map(function (row) { return row.concat(); });
};

GotandaDiamondMine.prototype.startAnimation = function () {
  var gdm = this;
  this.animationInterval = setInterval(function () {
    gdm.point(0, 0);
    gdm.draw();
    if (gdm.state != GotandaDiamondMine.STATE_ANIMATION) {
      clearInterval(gdm.animationInterval);
      gdm.animationInterval = null;
    }
  }, 20);
};
