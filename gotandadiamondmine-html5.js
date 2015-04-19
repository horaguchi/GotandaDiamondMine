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
    if (gdm.pointHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top)) {
      gdm.draw();
    }
  });
  this.canvasElement.addEventListener('mousedown', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    if (gdm.pointHTML(e.clientX - rect.left, e.clientY - rect.top)) {
      gdm.draw();
    }
  });

  window.addEventListener('resize', function() {
    if (gdm.resizeTimer) {
      clearTimeout(gdm.resizeTimer);
    }
    gdm.resizeTimer = setTimeout(function () {
      gdm.resizeCanvas();
    }, 300);
  });

};

GotandaDiamondMine.prototype.resizeCanvas = function () {
  if (this.maxWidth && this.maxWidth == window.innerWidth) {
    return; // nothing to do
  }
  var max_width = window.innerWidth;
  this.maxWidth = max_width;

  this.fontX = 8; this.fontY = 8;
  this.canvasElement.setAttribute('width',  this.fontX * 27);
  this.canvasElement.setAttribute('height', this.fontY * 48);
  this.canvasElement.parentElement.style.width  = (this.fontX * 27) + 'px';
  this.canvasElement.parentElement.style.height = (this.fontY * 48) + 'px';
  this.canvasElement.style.width  = (this.fontX * 27) + 'px';
  this.canvasElement.style.height = (this.fontY * 48) + 'px';
  this.canvasContext = this.canvasElement.getContext("2d");
  this.canvasContext.fillStyle = 'white';

  // initial drawing
  this.draw(true);
};

GotandaDiamondMine.prototype.pointHTML = function (x, y) {
  var mx = parseInt(x / this.fontX), my = parseInt(y / this.fontY);
  return this.point(mx, my);
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
        if (colors[1] == 'red') {
          //this.tile = this.tile_red;
        } else if (colors[1] == 'yellow') {
          //this.tile = this.tile_yellow;
        }
        str = colors[2];
      }
      var char_code = str.charCodeAt(0);
      var dx = dw * x, dy = dh * y;
      var sx = char_code % GotandaDiamondMine.TILE_IMAGE_8x8_COLS, sy = Math.floor(char_code / GotandaDiamondMine.TILE_IMAGE_8x8_COLS);
      context.fillRect(dx, dy, dw, dh);
      context.drawImage(GotandaDiamondMine.TILE_IMAGE_8x8, sx * dw, sy * dh, dw, dh, dx, dy, dw, dh);
      if (colors) {
        //this.tile = this.tile_white;
      }
    }
  }
  context.fillStyle = 'red';
  context.fillText(this.maxWidth + "," + window.innerHeight, 30, 30);
  context.fillStyle = 'white';
  this.oldScreen = screen.map(function (row) { return row.concat(); });
};
