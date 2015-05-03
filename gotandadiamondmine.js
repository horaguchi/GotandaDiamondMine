var PF = require("pathfinding");

var GotandaDiamondMine = function () {
  this.finder = new PF.AStarFinder({
    heuristic: PF.Heuristic.euclidean,
    diagonalMovement: PF.DiagonalMovement.Never
  });

  this.state = GotandaDiamondMine.STATE_TITLE;
  this.items = [];
  this.createMap(); // mapSymbol, mapColor, points, path are created
  this.status = { HP: 3, AC: 0 };
  this.wave = 0;
  this.waves = [
    [ '*', 0, [ null, null ], { HP: 0 } ],
    [ 'A', 1, [ null, null ], { HP: parseInt(Math.random() * 100) } ],
    [ 'B', 2, [ null, null ], { HP: parseInt(Math.random() * 100) } ],
    [ 'C', 3, [ null, null ], { HP: parseInt(Math.random() * 100) } ],
    [ 'D', 4, [ null, null ], { HP: parseInt(Math.random() * 100) } ],
    [ 'E', 5, [ null, null ], { HP: parseInt(Math.random() * 100) } ]
  ];
};

GotandaDiamondMine.STATE_TITLE        = 0;
GotandaDiamondMine.STATE_CHOOSE_CLASS = 1;
GotandaDiamondMine.STATE_CHOOSE_ITEM  = 2;
GotandaDiamondMine.STATE_PLACE        = 3;
GotandaDiamondMine.STATE_CONFIRM      = 4;
GotandaDiamondMine.STATE_UPGRADE      = 5;
GotandaDiamondMine.STATE_ANIMATION    = 6;
GotandaDiamondMine.STATE_DEFEATED     = 7;
GotandaDiamondMine.STATE_VICTORY      = 8;

// for node.js, not for CommonJS
if (typeof module === "object" && module) {
  module.exports = GotandaDiamondMine;
}

////////////////////////////////////////////////////////////////////////////////
// User Input Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.prototype.point = function (x, y) {
  //console.log('point:', x, y); // for debug
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TITLE) { // TITLE
    return this.pointTitle(x, y);
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_CLASS) { // CHOOSE CLASS
    return this.pointChooseClass(x, y);
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) { // CHOOSE ITEM
    return this.pointChooseItem(x, y);
  } else if (state === GotandaDiamondMine.STATE_PLACE) { // PLACE ITEM
    return this.pointPlace(x, y);
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) { // CONFIRM NEXT WAVE
    return this.pointConfirm(x, y);
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) { // UPGRADE ITEM
    return this.pointUpgrade(x, y);
  } else if (state === GotandaDiamondMine.STATE_ANIMATION) { // WAVE ANIMATION
    return this.pointAnimation(x, y);
  }
};

GotandaDiamondMine.prototype.pointTitle = function (x, y) {
  if (5 <= x && x <= 21 && 34 <= y && y <= 36) { // Start
    this.changeState(GotandaDiamondMine.STATE_CHOOSE_CLASS);
    return true;
  }
};

GotandaDiamondMine.prototype.pointChooseClass = function (x, y) {
  if (0 <= x && x <= 26 && 0 <= y && y <= 8) { // Class 1
    this.selectedClass = 1;
    return true;
  } else if (0 <= x && x <= 26 && 9 <= y && y <= 17) { // Class 2
    this.selectedClass = 2;
    return true;
  } else if (0 <= x && x <= 26 && 18 <= y && y <= 26) { // Class 3
    this.selectedClass = 3;
    return true;
  } else if (0 <= x && x <= 26 && 27 <= y && y <= 35) { // Class 4
    this.selectedClass = 4;
    return true;
  } else if (0 <= x && x <= 26 && 36 <= y && y <= 44) { // Class 5
    this.selectedClass = 5;
    return true;
  } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // Next
    return true;
  } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // OK
    if (this.selectedClass) {
      this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      return true;
    }
  }
};

GotandaDiamondMine.prototype.pointChooseItem = function (x, y) {
  if (0 <= x && x <= 26 && 6 <= y && y <= 14) { // Item 1
    this.selectedItem = 1;
    return true;
  } else if (0 <= x && x <= 26 && 15 <= y && y <= 23) { // Item 2
    this.selectedItem = 2;
    return true;
  } else if (0 <= x && x <= 26 && 24 <= y && y <= 32) { // Item 3
    this.selectedItem = 3;
    return true;
  } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // OK
    if (this.selectedItem) {
      this.items.push(this.itemChoices[this.selectedItem - 1]);
      this.changeState(GotandaDiamondMine.STATE_PLACE);
      return true;
    }
  } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // 
    //
  }
};

GotandaDiamondMine.prototype.pointPlace = function (x, y) {
  if (0 <= x && x <= 26 && 6 <= y && y <= 32) { // Map
    if (this.mapSymbol[y - 6][x] == '.') {
      if (this.selectedPlace) { // Cancel post-place before
        this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = '.';
        this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'gray';
      }
      this.mapSymbol[y - 6][x] = this.items[this.placingItem][0];
      if (this.calculatePath()) {
        this.selectedPlace = [ x, y - 6 ];
        this.mapColor[y - 6][x] = 'white'; // do after "calculatePath", for save yellow color if cannot place
        this.placeBlocked = false;
      } else { // blocking, cannot place
        if (this.selectedPlace) { // Re-place
          this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = this.items[this.placingItem][0];
          this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'white';
        }
        this.mapSymbol[y - 6][x] = '.';
        this.placeBlocked = true;
      }
      return true;
    }

  } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // OK or Undo
    if (this.selectedPlace) { // OK
      this.items[this.placingItem][2] = this.selectedPlace;
      ++this.placingItem;
      if (this.placingItem === this.items.length) {
        this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      } else {
        this.selectedPlace = null;
      }
      return true;
    } else if (0 < this.placingItem) { // Undo
      --this.placingItem;
      var place = this.items[this.placingItem][2];
      this.mapSymbol[place[1]][place[0]] = '.';
      this.mapColor[place[1]][place[0]] = 'gray';
      this.selectedPlace = null;
      return true;
    }
  } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // 
    //
  }
};

GotandaDiamondMine.prototype.pointConfirm = function (x, y) {
  if (0 <= x && x <= 26 && 6 <= y && y <= 32) { // Map
    var pointed_item = GotandaDiamondMine.getIndexNearPoint(this.items, x, y - 6);
    if (pointed_item !== -1) {
      var item_pos = this.items[pointed_item][2];
      this.mapColor[item_pos[1]][item_pos[0]] = 'aqua';
      this.confirmingItem = pointed_item;
      this.changeState(GotandaDiamondMine.STATE_UPGRADE);
      return true;
    }

  } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // Undo or Upgrade
    var place = this.items[this.items.length - 1][2];
    this.mapSymbol[place[1]][place[0]] = '.';
    this.mapColor[place[1]][place[0]] = 'gray';
    this.changeState(GotandaDiamondMine.STATE_PLACE);
    return true;

  } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // Next Wave
    this.changeState(GotandaDiamondMine.STATE_ANIMATION);
    return true;
  }
};

GotandaDiamondMine.prototype.pointUpgrade = function (x, y) {
  if (0 <= x && x <= 26 && 6 <= y && y <= 32) { // Map
    var pointed_item = GotandaDiamondMine.getIndexNearPoint(this.items, x, y - 6);
    if (-1 < this.sacrificingItem) {
      var before_item_pos = this.items[this.sacrificingItem][2];
      this.mapColor[before_item_pos[1]][before_item_pos[0]] = '';
    }
    if (pointed_item === this.confirmingItem) { // same item is to cancel confirming
      var before_item_pos = this.items[this.confirmingItem][2];
      this.mapColor[before_item_pos[1]][before_item_pos[0]] = '';
      this.changeState(GotandaDiamondMine.STATE_CONFIRM);
    } else if (pointed_item === this.sacrificingItem) {
      var before_item_pos = this.items[this.sacrificingItem][2];
      this.mapColor[before_item_pos[1]][before_item_pos[0]] = '';
      this.sacrificingItem = -1;
    } else {
      var item_pos = this.items[pointed_item][2];
      this.mapColor[item_pos[1]][item_pos[0]] = 'fuchsia';
      this.sacrificingItem = pointed_item;
    }
    return true;

  } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // Combine

  } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // Next Wave
    //
  }
};

GotandaDiamondMine.prototype.pointAnimation = function (x, y) {
  // wave move
  if (!this.waveWait) {
    if (this.path.length - 1 === this.waveState) { // animation end
      if (0 < this.waves[this.wave][3].HP) {
        --this.status.HP;
      }
      ++this.wave;
      if (this.status.HP <= 0) {
        this.changeState(GotandaDiamondMine.STATE_DEFEATED);
      } else if (this.wave === this.waves.length) {
        this.changeState(GotandaDiamondMine.STATE_VICTORY);
      } else {
        this.changeState(GotandaDiamondMine.STATE_CHOOSE_ITEM);
      }
      return true;
    } else {
      this.waves[this.wave][2] = this.path[++this.waveState];
      this.waveWait = 4;
    }
  }
  // items attack
  var wave_x = this.waves[this.wave][2][0], wave_y = this.waves[this.wave][2][1];
  var items = this.items;
  var items_wait = this.itemsWait;
  for (var i = 0; i < items.length; ++i) {
    var item = items[i];
    if (!items_wait[i]) {
      var item_x = item[2][0], item_y = item[2][1];
      if (Math.abs(wave_x - item_x) < 2 && Math.abs(wave_y - item_y) < 2) { // attack
        this.waves[this.wave][3].HP -= 10;
        items_wait[i] = 4;
      } else { // no-attack, wait
        items_wait[i] = 1;
      }
    }
    --items_wait[i];
  }
  --this.waveWait;
  return true;
};

////////////////////////////////////////////////////////////////////////////////
// Procedural create Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.prototype.createMap = function () {
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

  var points_num = Math.floor(Math.random() * 3) + 2; // 1 ~ 3
  var points = [ ];
  for (var i = 0; i < points_num; ++i) {
    var point = [ ];
    var point_ng = true;
    while (point_ng) {
      point = [ Math.floor(Math.random() * 27), Math.floor(Math.random() * 27) ];
      if (point[0] === 13 && point[1] === 13) { // @ position
        continue;
      }
      point_ng = false;
      for (var j = 0; j < points.length; ++j) {
        if (points[j][0] === point[0] && points[j][0] === point[0]) {
          point_ng = true;
        }
      }
    }
    points.push(point);
    if (i === 0) {
      this.mapSymbol[point[1]][point[0]] = '>';
    } else {
      this.mapSymbol[point[1]][point[0]] = String(i);
    }
  }
  this.mapSymbol[13][13] = '@';
  this.mapColor[13][13] = 'white';
  points.push([ 13, 13 ]);
  this.points = points;
  this.path = [];
  this.calculatePath();
};

GotandaDiamondMine.prototype.createItemChoices = function () {
  this.itemChoices = [
    [ '|', 1, [ null, null ], { "Physical Damage": parseInt(Math.random() * 3 + 1) + "d" + parseInt(Math.random() * 12 + 1) } ],
    [ '\\', 1, [ null, null ], { "Physical Damage": parseInt(Math.random() * 3 + 1) + "d" + parseInt(Math.random() * 12 + 1) } ],
    [ '/', 1, [ null, null ], { "Physical Damage": parseInt(Math.random() * 3 + 1) + "d" + parseInt(Math.random() * 12 + 1) } ]
 ];
};

////////////////////////////////////////////////////////////////////////////////
// Common Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.prototype.changeState = function (state) {
  if (state === GotandaDiamondMine.STATE_TITLE) { // TITLE

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_CLASS) { // CHOOSE CLASS
    this.selectedClass = null;

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) { // CHOOSE ITEM
    this.createItemChoices();
    this.selectedItem = 0;

  } else if (state === GotandaDiamondMine.STATE_PLACE) { // PLACE ITEM
    this.placingItem = this.items.length - 1;
    this.selectedPlace = null;
    this.placeBlocked = false;
  
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) { // CONFIRM NEXT WAVE
    this.confirmingItem = -1;

  } else if (state === GotandaDiamondMine.STATE_UPGRADE) { // UPGRADE ITEM
    this.sacrificingItem = -1;

  } else if (state === GotandaDiamondMine.STATE_ANIMATION) { // WAVE ANIMATION
    this.itemsWait = [];
    this.waveWait = 0;
    this.waveState = 0;
    this.waves[this.wave][2] = this.path[this.waveState];
  }
  this.state = state;
};

GotandaDiamondMine.prototype.calculatePath = function () {
  var matrix = this.mapSymbol.map(function (row) {
    return row.map(function (value) {
      return /^[^1-9.>]$/.test(value);
    });
  });
  var grid = new PF.Grid(27, 27, matrix);
  var finder = this.finder;
  var points = this.points;
  var all_path = [];
  for (var i = 1; i < points.length; ++i) {
    if (i === points.length - 1) { // final @ is walkable
      grid.setWalkableAt(points[i][0], points[i][1], true);
    }
    var path = finder.findPath(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1], grid.clone());
    if (path.length === 0) {
      return false; // path is blocking
    }
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
  return true;
};

GotandaDiamondMine.getIndexNearPoint = function (items, x, y) {
  var near_item_index = -1;
  var near_distance = 9999;
  for (var i = 0; i < items.length; ++i) {
    var item = items[i];
    var item_x = item[2][0], item_y = item[2][1];
    var distance = Math.pow(x - item_x, 2) + Math.pow(y - item_y, 2);
    if (distance < near_distance) {
      near_item_index = i;
      near_distance = distance;
    }
  }
  return near_item_index;
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

////////////////////////////////////////////////////////////////////////////////
// Game Display Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.toWaveInfoString = function (wave) {
  return wave[1] + ')' + wave[0] + ' ' + wave[3].HP + 'HP                           ';
};

GotandaDiamondMine.prototype.getWaveInfo = function () {
  var wave_now = [], wave_next = [];
  for (var i = 0; i < 5; ++i) {
    var wave = this.waves[this.wave + i];
    if (wave) {
      if (i === 0) {
        wave_now.push(GotandaDiamondMine.toWaveInfoString(wave).split(''));
      } else {
        wave_next.push(GotandaDiamondMine.toWaveInfoString(wave).split(''));
      }
    } else {
      wave_next.push(GotandaDiamondMine.EMPTY_LINE);
    }
  }
  return wave_now.concat(GotandaDiamondMine.colorScreen(wave_next, 'gray'));
};



GotandaDiamondMine.EMPTY_LINE = [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "];
GotandaDiamondMine.prototype.getLog = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return [ "Choose an item:            ".split("") ];
  } else if (state === GotandaDiamondMine.STATE_PLACE) {
    return [ (this.placeBlocked ? "Blocking!                  " : "Place an item:             ").split("") ];
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) {
    return [ (this.wave ? "Go to next wave:           " : "Preview the path:          ").split("") ];
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    return [ "Choose an item to combine: ".split("") ];
  } else if (state === GotandaDiamondMine.STATE_DEFEATED) {
    return [ "You defeated!              ".split("") ];
  } else if (state === GotandaDiamondMine.STATE_VICTORY) {
    return [ "Victory!                   ".split("") ];
  } else {
    return [ GotandaDiamondMine.EMPTY_LINE ];
  }
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
      if (state === GotandaDiamondMine.STATE_ANIMATION && wave[2][0] === x && wave[2][1] === y) {
        row.push(wave[3].HP <= 0 ? '{yellow-fg}*{/yellow-fg}' : '{red-fg}' +  wave[0] + '{/red-fg}');
      } else {
        row.push(map_color[y][x] ? '{' + map_color[y][x] + '-fg}' + map_symbol[y][x] + '{/' + map_color[y][x] + '-fg}' : map_symbol[y][x]);
      }
    }
    map.push(row);
  }
  return map;
};

GotandaDiamondMine.prototype.getDetailItemInfo = function (item) { // 27 x 9
  var output = [ "+-------------------------+".split("") ];
  output.push( ("| " + item[0] + " Lvl." + item[1] + " " + GotandaDiamondMine.ITEM_ABBR[item[0]] + "                           ").split("") );
  var i = 0;
  for (var key in item[3] ) {
    output.push( ("| " + item[3][key] + " " + key + "                           ").split("") );
    ++i;
  }
  for (i; i < 6; ++i) {
    output.push("|                         |".split(""));
  }
  for (var i = 1; i < 8; ++i) {
    output[i][26] = '|';
  }
  output.push("+-------------------------+".split(""));
  return output;
};

GotandaDiamondMine.prototype.getStatus = function () {
  var info_str = '';
  var status = this.status;
  for (var key in status) {
    info_str += status[key] + key + ' ';
  }
  return [ (info_str + '                           ').split("") ];
};

GotandaDiamondMine.ITEM_ABBR = {
  '|': 'An edged weapon',
  '\\': 'A hafted weapon',
  '/': 'A pole weapon',
  'Physical Damage': 'Phys'
};

GotandaDiamondMine.toItemInfoString = function (item) {
  var info_str = item[0] + item[1];
  for (var key in item[3]) {
    info_str += ' ' + item[3][key] + GotandaDiamondMine.ITEM_ABBR[key];
  }
  return info_str + '                           ';
};

GotandaDiamondMine.prototype.getItemInfo = function () {
  var state = this.state;
  var info = [];
  for (var i = 0; i < 11; ++i) {
    var index = Math.min(this.items.length > 11 ? this.items.length - 11 + i : i);
    if (state === GotandaDiamondMine.STATE_PLACE) {
      index = Math.min(index, this.placingItem + i); // for many undos
      if (index === this.placingItem) {
        info = GotandaDiamondMine.colorScreen(info, 'gray');
      }
    }
    info.push(this.items.length <= index ? GotandaDiamondMine.EMPTY_LINE : GotandaDiamondMine.toItemInfoString(this.items[index]).split(""));
  }

  if (state != GotandaDiamondMine.STATE_PLACE) {
    info = GotandaDiamondMine.colorScreen(info, 'gray');
  }
  return info;
};

GotandaDiamondMine.prototype.getButton = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_CHOOSE_CLASS) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," "," ","N","e","x","t"," "," "," "," ","|"," ","|"," "," "," "," ","O","K"," "," "," "," "," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], 'gray', 'x', 0, this.selectedClass ? 12 : 26);
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," "," "," ","O","K"," "," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], 'gray', 'x', this.selectedItem ? 14 : 0, 26);
  } else if (state === GotandaDiamondMine.STATE_PLACE) {
    if (this.selectedPlace) {
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
      ], 'gray', 'x', this.placingItem ? 14 : 0, 26);
    }
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) {
    if (this.items.length) {
      return [
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
        ["|"," "," "," ","U","n","d","o"," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
      ];
    } else {
      return GotandaDiamondMine.colorScreen([
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
        ["|"," "," "," ","U","n","d","o"," "," "," "," ","|"," ","|"," "," ","P","r","e","v","i","e","w"," "," ","|"],
        ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
      ], 'gray', 'x', 0, 12);
    }
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," ","C","o","m","b","i","n","e"," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], 'gray', 'x', -1 < this.sacrificingItem ? 14 : 0, 26);
  } else if (state === GotandaDiamondMine.STATE_ANIMATION) {
    return GotandaDiamondMine.colorScreen([
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"],
      ["|"," "," "," ","U","n","d","o"," "," "," "," ","|"," ","|"," ","N","e","x","t"," ","W","a","v","e"," ","|"],
      ["+","-","-","-","-","-","-","-","-","-","-","-","+"," ","+","-","-","-","-","-","-","-","-","-","-","-","+"]
    ], 'gray');
  } else {
    return [ GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE ];
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
  ["G","o","t","a","n","d","a"," ","D","i","a","m","o","n","d"," ","M","i","n","e"," ","v","0",".","0",".","1"],
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
  if (state === GotandaDiamondMine.STATE_TITLE) {
    return GotandaDiamondMine.TITLE_SCREEN;
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_CLASS) {
    return this.getScreenToChooseClass();
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM){
    return this.getScreenToChooseItem();
  } else {
    return this.getScreenDefault();
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
    classes = classes.concat(i === this.selectedClass ? GotandaDiamondMine.EMPTY_BOX : GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_BOX, 'gray') );
  }
  return [].concat(classes, this.getButton());
};

GotandaDiamondMine.prototype.getScreenToChooseItem = function () {
  var items = [];
  for (var i = 1; i <= 3; ++i) {
    var item = this.getDetailItemInfo(this.itemChoices[i - 1]);
    items = items.concat(i === this.selectedItem ? item : GotandaDiamondMine.colorScreen(item, 'gray') );
  }
  return [].concat(this.getWaveInfo(), this.getLog(), items, this.getStatus(), this.getItemInfo(), this.getButton());
};

GotandaDiamondMine.prototype.getScreenDefault = function () {
  return [].concat(this.getWaveInfo(), this.getLog(), this.getMap(), this.getStatus(), this.getItemInfo(), this.getButton());
};
