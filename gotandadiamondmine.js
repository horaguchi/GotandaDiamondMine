var PF = require("pathfinding");

var GotandaDiamondMine = function () {
  this.finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never
  });

  this.state = GotandaDiamondMine.STATE_TITLE;
  this.mapSymbol = [
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
  ];
  this.mapColor = this.mapSymbol.map(function (row) { return row.map(function (value) { return "gray"; }); });
  this.items = [];
  this.points = [ [15, 20], [20, 15], [5, 5], [13, 13] ];
  this.mapSymbol[20][15] = '>';
  this.mapSymbol[15][20] = '1';
  this.mapSymbol[5][5]   = '2';
  this.mapSymbol[13][13] = '@';
  this.path = [];
  this.calculatePath();
  this.wave = 0;
  this.waves = [
    [ '*', 0, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'B', 1, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'C', 2, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'D', 3, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'E', 4, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'F', 5, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'G', 6, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'H', 7, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'I', 8, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'J', 9, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ],
    [ 'K',10, [ null, null ], [ 'HP', parseInt(Math.random() * 100) ] ]
  ];
};

GotandaDiamondMine.STATE_TITLE        = 0;
GotandaDiamondMine.STATE_CHOOSE_CLASS = 1;
GotandaDiamondMine.STATE_CHOOSE_ITEM  = 2;
GotandaDiamondMine.STATE_PLACE        = 3;
GotandaDiamondMine.STATE_CONFIRM      = 4;
GotandaDiamondMine.STATE_ANIMATION    = 5;

// for node.js, not for CommonJS
if (typeof module === "object" && module) {
  module.exports = GotandaDiamondMine;
}

GotandaDiamondMine.prototype.calculatePath = function () {
  var matrix = this.mapSymbol.map(function (row) {
    return row.map(function (value) {
      return value != '.' && value != '1' && value != '2' && value != '>' && value != '@';
    });
  });
  var grid = new PF.Grid(27, 27, matrix);
  var finder = this.finder;
  var points = this.points;
  var all_path = [];
  for (var i = 1; i < points.length; ++i) {
    var path = finder.findPath(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1], grid.clone());
    path.pop();
    all_path = all_path.concat(path);
  }
  var map_symbol = this.mapSymbol;
  var map_color = this.mapColor;
  for (var i = 0; i < this.path.length; ++i) {
    var path = this.path[i];
    if (map_symbol[path[1]][path[0]] == '.') {
      map_color[path[1]][path[0]] = 'gray';
    }
  }
  for (var i = 0; i < all_path.length; ++i) {
    var path = all_path[i];
    map_color[path[1]][path[0]] = 'yellow';
  }
  this.path = all_path;
};

GotandaDiamondMine.prototype.point = function (x, y) {
  console.log('point:', x, y); // for debug
  var state = this.state;
  if (state == GotandaDiamondMine.STATE_TITLE) {
    if (5 <= x && x <= 21 && 34 <= y && y <= 36) { // Start
      this.state = GotandaDiamondMine.STATE_CHOOSE_CLASS;
      this.selected_class = null;
      return true;
    }
  } else if (state == GotandaDiamondMine.STATE_CHOOSE_CLASS) {
    if (0 <= x && x <= 26 && 0 <= y && y <= 8) { // Class 1
      this.selected_class = 1;
      return true;
    } else if (0 <= x && x <= 26 && 9 <= y && y <= 17) { // Class 2
      this.selected_class = 2;
      return true;
    } else if (0 <= x && x <= 26 && 18 <= y && y <= 26) { // Class 3
      this.selected_class = 3;
      return true;
    } else if (0 <= x && x <= 26 && 27 <= y && y <= 35) { // Class 4
      this.selected_class = 4;
      return true;
    } else if (0 <= x && x <= 26 && 36 <= y && y <= 44) { // Class 5
      this.selected_class = 5;
      return true;
    } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // Next
      return true;
    } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // OK
      if (this.selected_class) {
        this.state = GotandaDiamondMine.STATE_CONFIRM;
        return true;
      }
    }
  } else if (state == GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    if (0 <= x && x <= 26 && 6 <= y && y <= 14) { // Item 1
      this.selected_item = 1;
      return true;
    } else if (0 <= x && x <= 26 && 15 <= y && y <= 23) { // Item 2
      this.selected_item = 2;
      return true;
    } else if (0 <= x && x <= 26 && 24 <= y && y <= 32) { // Item 3
      this.selected_item = 3;
      return true;
    } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // OK
      if (this.selected_item) {
        this.state = GotandaDiamondMine.STATE_PLACE;
        this.placing_item = this.items.length;
        this.items.push([ '/', 1, [ null, null ], [ 'Physical', parseInt(Math.random() * 100) ] ]);
        this.items.push([ '/', 1, [ null, null ], [ 'Physical', parseInt(Math.random() * 100) ] ]);
        this.items.push([ '/', 1, [ null, null ], [ 'Physical', parseInt(Math.random() * 100) ] ]);
        this.items.push([ '/', 1, [ null, null ], [ 'Physical', parseInt(Math.random() * 100) ] ]);
        this.items.push([ '/', 1, [ null, null ], [ 'Physical', parseInt(Math.random() * 100) ] ]);
        this.selected_place = null;
        return true;
      }
    } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // 
      //
    }
  } else if (state == GotandaDiamondMine.STATE_PLACE) {
    if (0 <= x && x <= 26 && 6 <= y && y <= 32) { // Map
      if (this.mapSymbol[y - 6][x] == '.') {
        if (this.selected_place) { // Cancel place before
          this.mapSymbol[this.selected_place[1]][this.selected_place[0]] = '.';
          this.mapColor[this.selected_place[1]][this.selected_place[0]] = 'gray';
        }
        this.selected_place = [ x, y - 6 ];
        this.mapSymbol[y - 6][x] = '/';
        this.mapColor[y - 6][x] = 'white';
        this.calculatePath();
        return true;
      }

    } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // OK or Undo
      if (this.selected_place) { // OK
        this.items[this.placing_item][2] = this.selected_place;
        ++this.placing_item;
        if (this.placing_item == this.items.length) {
          this.state = GotandaDiamondMine.STATE_CONFIRM;
        } else {
          this.selected_place = null;
        }
        return true;
      } else if (0 < this.placing_item) { // Undo
        --this.placing_item;
        var place = this.items[this.placing_item][2];
        this.mapSymbol[place[1]][place[0]] = '.';
        this.mapColor[place[1]][place[0]] = 'gray';
        this.selected_place = null;
        return true;
      }
    } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // 
      //
    }
  } else if (state == GotandaDiamondMine.STATE_CONFIRM) {
    if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // Undo
      //this.selected_place = this.items[this.items.length - 1][2];
      var place = this.items[this.items.length - 1][2];
      this.mapSymbol[place[1]][place[0]] = '.';
      this.mapColor[place[1]][place[0]] = 'gray';
      this.selected_place = null;
      this.placing_item = this.items.length - 1;
      this.state = GotandaDiamondMine.STATE_PLACE;
      return true;
    } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // Next Wave
      this.state = GotandaDiamondMine.STATE_ANIMATION;
      this.animation_state = 0;
      this.waves[this.wave][2] = this.path[this.animation_state];
      return true;
    }
  } else if (state == GotandaDiamondMine.STATE_ANIMATION) {
    if (this.path.length - 1 == this.animation_state) { // animation end
      this.state = GotandaDiamondMine.STATE_CHOOSE_ITEM;
      this.selected_item = 0;
    } else {
      this.animation_state++;
      this.waves[this.wave][2] = this.path[this.animation_state];
    }
    return true;
  }
};

GotandaDiamondMine.colorScreen = function (arr, color, type, from_x, to_x) {
  var copied = arr.map(function (row) { return row.concat(); });
  if (type == 'x') {
    for (var y = 0; y < copied.length; ++y) {
      var row = copied[y];
      for (var x = 0; x < row.length; ++x) {
        if (from_x <= x && x <= to_x && row[x] && row[x] != ' ') {//{
          row[x] = '{' + color + '-fg}' + row[x] + '{/' + color + '-fg}';
        }
      }
    }
  } else {
    for (var y = 0; y < copied.length; ++y) {
      var row = copied[y];
      for (var x = 0; x < row.length; ++x) {
        if (row[x] && row[x] != ' ') {//{
          row[x] = '{' + color + '-fg}' + row[x] + '{/' + color + '-fg}';
        }
      }
    }
  }
  return copied;
};

GotandaDiamondMine.WAVE_ABBR = {
  'HP': 'HP'
};

GotandaDiamondMine.toWaveInfoString = function (wave) {
  return wave[1] + ')' + wave[0] + ' ' + wave.slice(3).map(function (param) {
    return param[1] + GotandaDiamondMine.WAVE_ABBR[param[0]];
  }).join(',') + '                           ';
};

GotandaDiamondMine.prototype.getWaveInfo = function () {
  var wave_now = [], wave_next = [];
  for (var i = 0; i < 5; ++i) {
    var wave = this.waves[this.wave + i];
    if (i == 0) {
      wave_now.push(GotandaDiamondMine.toWaveInfoString(wave).split(''));
    } else {
      wave_next.push(GotandaDiamondMine.toWaveInfoString(wave).split(''));
    }
  }
  return wave_now.concat(GotandaDiamondMine.colorScreen(wave_next, 'gray'));
};

GotandaDiamondMine.prototype.getMap = function () {
  var state = this.state;
  var map_symbol = this.mapSymbol;
  var map_color = this.mapColor;
  var map = [];
  var wave = this.waves[this.wave];
  for (var y = 0; y < 27; ++y) {
    var row = [];
    for (var x = 0; x < 27; ++x) {
      if (state == GotandaDiamondMine.STATE_ANIMATION && wave[2][0] == x && wave[2][1] == y) {
        row.push('{red-fg}' + wave[0] + '{/red-fg}');
      } else {
        row.push(map_color[y][x] ? '{' + map_color[y][x] + '-fg}' + map_symbol[y][x] + '{/' + map_color[y][x] + '-fg}' : map_symbol[y][x]);
      }
    }
    map.push(row);
  }
  return map;
};

GotandaDiamondMine.EMPTY_LINE = [
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "]
];
GotandaDiamondMine.prototype.getLog = function () {
  var state = this.state;
  if (state == GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return [
      ["C","h","o","o","s","e"," ","a","n"," ","i","t","e","m",":"," "," "," "," "," "," "," "," "," "," "," "," "]
    ];
  } else if (state == GotandaDiamondMine.STATE_PLACE) {
    return [
      ["P","l","a","c","e"," ","a","n"," ","i","t","e","m",":"," "," "," "," "," "," "," "," "," "," "," "," "," "]
    ];
  } else if (state == GotandaDiamondMine.STATE_CONFIRM) {
    return [
      ["G","o"," ","t","o"," ","n","e","x","t"," ","w","a","v","e",":"," "," "," "," "," "," "," "," "," "," "," "]
    ];
  } else {
    return GotandaDiamondMine.EMPTY_LINE;
  }
};

GotandaDiamondMine.ITEM_ABBR = {
  'Physical': 'Phys'
};

GotandaDiamondMine.toItemInfoString = function (item) {
  return item[0] + item[1] + ' ' + item.slice(3).map(function (param) {
    return param[1] + GotandaDiamondMine.ITEM_ABBR[param[0]];
  }).join(',') + '                           ';
};
GotandaDiamondMine.prototype.getItemInfo = function () {
  var state = this.state;
  var info = [];
  for (var i = 0; i < 12; ++i) {
    var index = Math.min(this.items.length > 12 ? this.items.length - 12 + i : i);
    if (state == GotandaDiamondMine.STATE_PLACE) {
      index = Math.min(index, this.placing_item + i); // for many undos
      if (index == this.placing_item) {
        info = GotandaDiamondMine.colorScreen(info, 'gray');
      }
    }
    info.push(this.items.length <= index ? GotandaDiamondMine.EMPTY_LINE[0] : GotandaDiamondMine.toItemInfoString(this.items[index]).split(""));
  }

  if (state != GotandaDiamondMine.STATE_PLACE) {
    info = GotandaDiamondMine.colorScreen(info, 'gray');
  }
  return info;
};

GotandaDiamondMine.prototype.getButton = function () {
  var state = this.state;
  if (state == GotandaDiamondMine.STATE_CHOOSE_CLASS) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," "," ","N","e","x","t"," "," "," "," ","|"," ","|"," "," "," "," ","O","K"," "," "," "," "," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], 'gray', 'x', 0, this.selected_class ? 12 : 26);
  } else if (state == GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," "," "," ","O","K"," "," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], 'gray', 'x', this.selected_item ? 14 : 0, 26);
  } else if (state == GotandaDiamondMine.STATE_PLACE) {
    if (this.selected_place) {
      return GotandaDiamondMine.colorScreen([
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
        ["|"," "," "," "," ","O","K"," "," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
      ], 'gray', 'x', 14, 26);
    } else {
      return GotandaDiamondMine.colorScreen([
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
        ["|"," "," "," ","U","n","d","o"," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
      ], 'gray', 'x', 14, 26);
    }
  } else if (state == GotandaDiamondMine.STATE_CONFIRM) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," "," ","U","n","d","o"," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], this.items.length ? 'white' : 'gray', 'x', 0, 12);
  } else if (state == GotandaDiamondMine.STATE_ANIMATION) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," "," ","U","n","d","o"," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], 'gray');
  } else {
    return [].concat(GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE);
  }
};

GotandaDiamondMine.TITLE_SCREEN = [
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  ["G","o","t","a","n","d","a"," ","D","i","a","m","o","n","d"," ","M","i","n","e"," ","v","0",".","0",".","0"],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," ","+","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","+"," "," "," "," "," "],
  [" "," "," "," "," ","|"," "," "," "," "," ","S","t","a","r","t"," "," "," "," "," ","|"," "," "," "," "," "],
  [" "," "," "," "," ","+","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","+"," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "]
];

GotandaDiamondMine.prototype.getScreen = function () {
  var state = this.state;
  if (state == GotandaDiamondMine.STATE_TITLE) {
    return GotandaDiamondMine.TITLE_SCREEN;
  } else if (state == GotandaDiamondMine.STATE_CHOOSE_CLASS) {
    return this.getScreenToChooseClass();
  } else if (state == GotandaDiamondMine.STATE_CHOOSE_ITEM){
    return this.getScreenToChooseItem();
  } else if (state == GotandaDiamondMine.STATE_PLACE) {
    return this.getScreenToPlace();
  } else if (state == GotandaDiamondMine.STATE_CONFIRM) {
    return this.getScreenToConfirm();
  } else if (state == GotandaDiamondMine.STATE_ANIMATION) {
    return this.getScreenToAnimation();
  }
};

GotandaDiamondMine.EMPTY_BOX = [
  ["+","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","+"],
  ["|"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
  ["|"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
  ["|"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
  ["|"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
  ["|"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
  ["|"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
  ["|"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
  ["+","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","+"]
];

GotandaDiamondMine.prototype.getScreenToChooseClass = function () {
  var classes = [];
  for (var i = 1; i <= 5; ++i) {
    classes = classes.concat(i == this.selected_class ? GotandaDiamondMine.EMPTY_BOX : GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_BOX, 'gray') );
  }
  return [].concat(classes, this.getButton());
};

GotandaDiamondMine.prototype.getScreenToChooseItem = function () {
  var items = [];
  for (var i = 1; i <= 3; ++i) {
    items = items.concat(i == this.selected_item ? GotandaDiamondMine.EMPTY_BOX : GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_BOX, 'gray') );
  }
  return [].concat(this.getWaveInfo(), this.getLog(), items, this.getItemInfo(), this.getButton());
};

GotandaDiamondMine.prototype.getScreenToPlace = function () {
  return [].concat(this.getWaveInfo(), this.getLog(), this.getMap(), this.getItemInfo(), this.getButton());
};

GotandaDiamondMine.prototype.getScreenToConfirm = function () {
  return [].concat(this.getWaveInfo(), this.getLog(), this.getMap(), this.getItemInfo(), this.getButton());
};

GotandaDiamondMine.prototype.getScreenToAnimation = function () {
  return [].concat(this.getWaveInfo(), this.getLog(), this.getMap(), this.getItemInfo(), this.getButton());
};
