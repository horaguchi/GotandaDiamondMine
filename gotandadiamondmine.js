var PF = require('pathfinding');
var Chance = require('chance');
var __ = require('./__');

var GotandaDiamondMine = function () {
  this.finder = new PF.AStarFinder({
    heuristic: PF.Heuristic.euclidean,
    diagonalMovement: PF.DiagonalMovement.Never
  });
  this.chance = new Chance();
  this.__ = __;
  this.__.setLang('ja');

  this.state = GotandaDiamondMine.STATE_TITLE;

};

// for node.js, not for CommonJS
module.exports = GotandaDiamondMine;

////////////////////////////////////////////////////////////////////////////////
// Common Definitions
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.STATE_TITLE       = 'title';
GotandaDiamondMine.STATE_CHOOSE_HERO = 'choose_hero';
//GotandaDiamondMine.STATE_TOWN_SHOP   = 'town_shop';
GotandaDiamondMine.STATE_CHOOSE_MINE = 'choose_mine';
GotandaDiamondMine.STATE_CONFIRM     = 'confirm';
GotandaDiamondMine.STATE_CHOOSE_HAND = 'choose_hand';
GotandaDiamondMine.STATE_PLACE       = 'place';
GotandaDiamondMine.STATE_UPGRADE     = 'upgrade';
GotandaDiamondMine.STATE_ANIMATION   = 'animation';
GotandaDiamondMine.STATE_CHOOSE_ITEM = 'choose_item';
GotandaDiamondMine.STATE_DEFEATED    = 'defeated';
GotandaDiamondMine.STATE_VICTORY     = 'victory';

GotandaDiamondMine.CLASSES = [
  { 'HP': 10, 'STR': 3, "Luck": 2, "Items": '||||////%%' }
];

// [ symbol, item_name, level_number, [ x, y ], parameter_object, status_object ]
GotandaDiamondMine.ITEMS = [
  [ '|', "a dagger",            1, [ null, null ], { "Physical Damage":  '1d4',     "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            3, [ null, null ], { "Physical Damage":  '2d4',     "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            2, [ null, null ], { "Physical Damage":  '1d4+2',   "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            4, [ null, null ], { "Physical Damage":  '2d4+2',   "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            5, [ null, null ], { "Physical Damage":  '3d4',     "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            6, [ null, null ], { "Physical Damage":  '3d4+2',   "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            7, [ null, null ], { "Physical Damage":  '4d4',     "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            8, [ null, null ], { "Physical Damage":  '4d4+2',   "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",            9, [ null, null ], { "Physical Damage":  '5d4',     "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a dagger",           10, [ null, null ], { "Physical Damage":  '5d4+2',   "Upgrade": '-5|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a short sword",       1, [ null, null ], { "Physical Damage":  '1d6',     "Upgrade": '+0|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a short sword",       2, [ null, null ], { "Physical Damage":  '2d6',     "Upgrade": '+0|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a short sword",       3, [ null, null ], { "Physical Damage":  '5d6',     "Upgrade": '+0|', "Target Depth": 10, "Price": 10 }, null ],
  [ '|', "a short sword",       4, [ null, null ], { "Physical Damage": '15d6',     "Upgrade": '+0|', "Target Depth": 10, "Price": 10 }, null ],
  [ '/', "a pole axe",          1, [ null, null ], { "Physical Damage":  '1d8',     "Upgrade": '+0/', "Target Depth": 10, "Price": 10 }, null ],
  [ '/', "a pole axe",          2, [ null, null ], { "Physical Damage":  '2d8',     "Upgrade": '+0/', "Target Depth": 10, "Price": 10 }, null ],
  [ '/', "a pole axe",          3, [ null, null ], { "Physical Damage":  '5d8',     "Upgrade": '+0/', "Target Depth": 10, "Price": 10 }, null ],
  [ '/', "a pole axe",          4, [ null, null ], { "Physical Damage": '15d8',     "Upgrade": '+0/', "Target Depth": 10, "Price": 10 }, null ],
  [ '%', "an apple",            1, [ null, null ], { "Energy": '^15',               "Upgrade": '+0%', "Target Depth": 10, "Price": 10 }, null ],
  [ '"', "an amulet of damage", 1, [ null, null ], { "Physical Damage Buff": '1.5', "Upgrade": '+0%', "Target Depth": 10, "Price": 10 }, null ],
  [ '[', "a ring armour",       1, [ null, null ], { "Armor Class": '+10', "\\ Luck Bonus": '+25', "Upgrade": '+0[', "Target Depth": 10, "Price": 10 }, null ],
  [ '`', "a rock",              1, [ null, null ], { "Upgrade": '+0`' }, null ]
];

GotandaDiamondMine.ITEMS_MAP = (function (items) { // ex. { 'a dagger': [ undefined, 0, 1, 2 ], ... }
  var result = {};
  for (var i = 0; i < items.length; ++i) {
    var item = items[i];
    result[item[1]] = result[item[1]] || [];
    result[item[1]][item[2]] = i;
  }
  return result;
})(GotandaDiamondMine.ITEMS);

GotandaDiamondMine.ITEM_ABBR = {
  '|': "An edged weapon",
  '\\': "A hafted weapon",
  '/': "A pole weapon",
  "Upgrade": 'UG',
  "Physical Damage": 'PD',
  "Fire Damage": 'FD',
  "Cold Damage": 'CD',
  "Lightning Damage": 'LD',
  "Poison Damage": 'PD',
  "Armor Class": 'AC',
  "All Resistance": 'AR',
  "Fire Resistance": 'FR',
  "Cold Resistance": 'CR',
  "Lightning Resistance": 'LR',
  "Poison Resistance": 'PR',
  "Physical Damage Buff": 'PDB',
  "Energy": '%',
  "\\ Luck Bonus": '%LB',
  "HP": 'HP',
  "*": '*'
};

GotandaDiamondMine.MAPS = {
  "Small": [
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '         ....................................         '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
  ],
  "Flats": [
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split(''),
    '......................................................'.split('')
  ],
  "Paddy": [
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '   ................................................   '.split(''),
    '   ................................................   '.split(''),
    '   ................................................   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ................................................   '.split(''),
    '   ................................................   '.split(''),
    '   ................................................   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ...      ...      ...      ...      ...      ...   '.split(''),
    '   ................................................   '.split(''),
    '   ................................................   '.split(''),
    '   ................................................   '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split('')
  ]
};

GotandaDiamondMine.TITLE_SCREEN = [
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '             Gotanda Diamond Mine  v0.0.1             '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split(''),
    '                                                      '.split('')
];

////////////////////////////////////////////////////////////////////////////////
// Common Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.REGEXP_DICE = /^([-+^])?(\d+)?(d\d+)?$/;
GotandaDiamondMine.prototype.roll = function (param) {
  if (typeof param === 'number') {
    return param;
  } else if (typeof param !== 'string') {
    return 0; // invalid param
  }
  var sum = 0;
  var values = param.split(/\+/); // ex. 2d6 + 2d12
  for (var i = 0, l = values.length; i < l; ++i) {
    var value = values[i];
    var matches = value.match(GotandaDiamondMine.REGEXP_DICE);
    // ex. 20
    if (matches[2] && !matches[3]) {
      sum += Math.floor(matches[2]);

    // ex. d20
    } else if (!matches[2] && matches[3]) {
      sum += this.chance.rpg('1' + value, { sum: true });

    // ex. 2d20
    } else if (matches[2] && matches[3]) {
      sum += this.chance.rpg(value, { sum: true });
    }
  }
  return sum;
};

GotandaDiamondMine.center = function (str, size) {
  var left_space = Math.floor((size - str.length) / 2);
  var right_space = Math.ceil((size - str.length) / 2);
  var output = '';
  for (var i = 0; i < left_space; ++i) {
    output += ' ';
  }
  output += str;
  for (var i = 0; i < right_space; ++i) {
    output += ' ';
  }
  return output;
};

GotandaDiamondMine.paste = function (array_a, array_b) {
  var out = [];
  for (var i = 0, al = array_a.length, bl = array_b.length, l = Math.max(al, bl); i < l; ++i) {
    var add = [];
    if (i < al) {
      add = add.concat(array_a[i]);
    }
    if (i < bl) {
      add = add.concat(array_b[i]);
    }
    out.push(add);
  }
  return out;
};

GotandaDiamondMine.prototype.changeState = function (state) {
  if (state === GotandaDiamondMine.STATE_TITLE) { // TITLE
    //

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) { // CHOOSE HERO
    this.itemsInOriginalDeck = [];
    this.itemsInShop = [];
    this.itemChoices = [];
    this.heroParameter = {}; // updated when choose hero
    this.heroStatus = { 'Damage': 0, '%': 100, '*': 0 };
    this.createHeroChoices();
    this.selectedHero = -1;
    this.depth = 0;
/*
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) { // TOWN SHOP
    this.createShopChoices();
    this.selectedItem = -1;
*/
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_MINE) { // CHOOSE MINE
    this.createMineChoices();
    this.selectedMine = -1;

  } else if (state === GotandaDiamondMine.STATE_CONFIRM) { // CONFIRM NEXT WAVE
    this.confirmingItem = -1;
    this.selectedItem = -1;

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HAND) { // CHOOSE HAND
    //this.selectedItem = -1; don't reset selectedItem because the item is set on "STATE_CONFIRM" phase

  } else if (state === GotandaDiamondMine.STATE_PLACE) { // PLACE ITEM
    this.placingItem = this.itemsOnMap.filter(function (item) { return item[3][0] !== null && item[3][1] !== null; }).length; // filter is for undo
    this.selectedPlace = null;
    this.placeBlocked = false;
  
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) { // UPGRADE ITEM
    this.sacrificingItem = -1;
    this.canSacrifice = false;

  } else if (state === GotandaDiamondMine.STATE_ANIMATION) { // WAVE ANIMATION
    var wave = this.waves[this.wave];
    this.units = [];
    this.unitsWait = [];
    for (var i = 0; i < wave[2]; ++i) {
      this.units.push([ wave[0], wave[1], -1, [ null, null ], wave[4], { 'Damage': 0 } ]); // 0 is '>', so starts from -1
      this.unitsWait.push(i * 16);
    }
    this.itemsWait = [];

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) { // CHOOSE ITEM
    this.createItemChoices();
    this.selectedItem = -1;

  }
  console.log(this.state + ' -> ' + state);
  this.state = state;
};

GotandaDiamondMine.prototype.calculatePath = function () {
  var matrix = this.mapSymbol.map(function (row) {
    return row.map(function (value) {
      return /^[^1-9.>]$/.test(value);
    });
  });
  var grid = new PF.Grid(54, 27, matrix);
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
    var before_path = this.path[i];
    if (map_symbol[before_path[1]][before_path[0]] === '.') {
      map_color[before_path[1]][before_path[0]] = 'gray';
    }
  }
  for (var i = 0; i < all_path.length; ++i) {
    var next_path = all_path[i];
    map_color[next_path[1]][next_path[0]] = 'yellow';
  }
  this.path = all_path;
  return true;
};

GotandaDiamondMine.getIndexNearPoint = function (items, x, y) {
  var near_item_index = -1;
  var near_distance = 9999;
  for (var i = 0; i < items.length; ++i) {
    var item = items[i];
    var item_x = item[3][0], item_y = item[3][1];
    var distance = Math.pow(x - item_x, 2) + Math.pow(y - item_y, 2);
    if (distance < near_distance) {
      near_item_index = i;
      near_distance = distance;
    }
  }
  return near_item_index;
};

GotandaDiamondMine.colorScreen = function (arr, color, mode, from_x, to_x) {
  var copied = arr.map(function (row) { return row.concat(); });
  if (mode === 'x') {
    for (var y = 0; y < copied.length; ++y) {
      var row_x = copied[y];
      for (var x = 0; x < row_x.length; ++x) {
        if (from_x <= x && x <= to_x && row_x[x] && row_x[x] !== ' ') {
          row_x[x] = '{' + color + '-fg}' + row_x[x] + '{/' + color + '-fg}';
        }
      }
    }
  } else {
    for (var y = 0; y < copied.length; ++y) {
      var row_all = copied[y];
      for (var x = 0; x < row_all.length; ++x) {
        if (row_all[x] && row_all[x] !== ' ') {
          row_all[x] = '{' + color + '-fg}' + row_all[x] + '{/' + color + '-fg}';
        }
      }
    }
  }
  return copied;
};

GotandaDiamondMine.EMPTY_LINE = [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '];

GotandaDiamondMine.EMPTY_BOX = [
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']
];

GotandaDiamondMine.EMPTY_LINED_BOX = [
  ['+','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','+'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['+','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','+']
];

////////////////////////////////////////////////////////////////////////////////
// User Input Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.prototype.point = function (x, y) {
  //console.log('point:', x, y); // for debug
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TITLE) {
    return this.pointTitle(x, y);
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) {
    return this.pointChooseHero(x, y);
/*  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    return this.pointTownShop(x, y);*/
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_MINE) {
    return this.pointChooseMine(x, y);
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) {
    return this.pointConfirm(x, y);
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HAND) {
    return this.pointChooseHand(x, y);
  } else if (state === GotandaDiamondMine.STATE_PLACE) {
    return this.pointPlace(x, y);
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    return this.pointUpgrade(x, y);
  } else if (state === GotandaDiamondMine.STATE_ANIMATION) {
    return this.pointAnimation(x, y);
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return this.pointChooseItem(x, y);
  } else if (state === GotandaDiamondMine.STATE_DEFEATED) {
    return this.pointDefeated(x, y);
  } else if (state === GotandaDiamondMine.STATE_VICTORY) {
    return this.pointVictory(x, y);
  }
};

GotandaDiamondMine.prototype.pointTitle = function (x, y) {
  if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Start
    this.changeState(GotandaDiamondMine.STATE_CHOOSE_HERO);
    return true;
  }
};

GotandaDiamondMine.prototype.pointChooseHero = function (x, y) {
  if (0 <= x && x <= 53 && 3 <= y && y <= 11 && 1 <= this.heroChoices.length) { // Hero 1
    this.selectedHero = 0;
    return true;
  } else if (0 <= x && x <= 53 && 12 <= y && y <= 20 && 2 <= this.heroChoices.length) { // Hero 2
    this.selectedHero = 1;
    return true;
  } else if (0 <= x && x <= 53 && 21 <= y && y <= 29 && 3 <= this.heroChoices.length) { // Hero 3
    this.selectedHero = 2;
    return true;
  } else if (0 <= x && x <= 53 && 30 <= y && y <= 38 && 4 <= this.heroChoices.length) { // Hero 4
    this.selectedHero = 3;
    return true;
  } else if (0 <= x && x <= 53 && 39 <= y && y <= 47 && 5 <= this.heroChoices.length) { // Hero 5
    this.selectedHero = 4;
    return true;
  } else if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Choose a hero
    if (this.selectedHero !== -1) {
      var selected_hero = this.heroChoices[this.selectedHero];
      for (var key in selected_hero) {
        this.heroParameter[key] = selected_hero[key];
      }
      this.createDeckFromTemplate();

      this.createMineChoices();
      var selected_mine = this.mineChoices[0];
      this.createMap(selected_mine); // mapSymbol, mapColor, points, path are created
      this.createWaves(selected_mine); // wave, waves are created
      this.itemsOnMap = [];
      this.itemsOnHand = [];
      this.itemsInDeck = [];
      this.createItemsOnHand(true);
      this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      return true;
    }
  }
};

/*

GotandaDiamondMine.prototype.pointTownShop = function (x, y) {
  if (0 <= x && x <= 8 && 3 <= y && y <= 5) { // Town Items
    this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
    return true;
  } else if (9 <= x && x <= 17 && 3 <= y && y <= 5) { // Town Shop
    this.changeState(GotandaDiamondMine.STATE_TOWN_SHOP);
    return true;
  } else if (18 <= x && x <= 26 && 3 <= y && y <= 5) { // Town Mine
    this.changeState(GotandaDiamondMine.STATE_TOWN_MINE);
    return true;
  } else if (0 <= x && x <= 26 && 16 <= y && y <= 47) { // Item Select
    var index = y - 16;
    if (this.selectedItem === index) {
      this.selectedItem = -1;
      return true;
    } else if (this.itemsInShop[index]) {
      this.selectedItem = index;
      return true;
    }
  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Buy
    
  }
};
*/
GotandaDiamondMine.prototype.pointChooseMine = function (x, y) {
  if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Choose a mine
    if (this.selectedMine !== -1) {
      var selected_mine = this.mineChoices[this.selectedMine];
      this.createMap(selected_mine); // mapSymbol, mapColor, points, path are created
      this.createWaves(selected_mine); // wave, waves are created
      this.itemsOnMap = [];
      this.itemsOnHand = [];
      this.itemsInDeck = [];
      this.createItemsOnHand(true);
      this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      return true;
    }
  } else if (0 <= x && x <= 53 && 10 <= y && y <= 18 && 1 <= this.mineChoices.length) { // Mine 1
    this.selectedMine = 0;
    return true;
  } else if (0 <= x && x <= 53 && 19 <= y && y <= 27 && 2 <= this.mineChoices.length) { // Mine 2
    this.selectedMine = 1;
    return true;
  } else if (0 <= x && x <= 53 && 28 <= y && y <= 36 && 3 <= this.mineChoices.length) { // Mine 3
    this.selectedMine = 2;
    return true;
  }
};

GotandaDiamondMine.prototype.pointConfirm = function (x, y) {
  if (0 <= x && x <= 53 && 10 <= y && y <= 36) { // Map
    return this.pointConfirmItem(GotandaDiamondMine.getIndexNearPoint(this.itemsOnMap, x, y - 10));

  } else if (0 <= x && x <= 27 && 37 <= y && y <= 47) { // Hand list
    var selected_item = (y - 37 < this.itemsOnHand.length ? y - 37 : -1);
    if (selected_item !== -1) {
      this.selectedItem = selected_item;
      this.changeState(GotandaDiamondMine.STATE_CHOOSE_HAND);
      return true;
    }

  } else if (28 <= x && x <= 53 && 37 <= y && y <= 47) { // Item list 
    return this.pointConfirmItem(this.indexesToPoint[y - 37]);

  } else if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Next Wave
    this.heroStatus['%'] -= this.wave === 0 ? 0 : 1;
    if (0 < this.heroStatus['%']) {
      this.changeState(GotandaDiamondMine.STATE_ANIMATION);
    } else {
      this.changeState(GotandaDiamondMine.STATE_DEFEATED);
    }
    return true;
  }
};

GotandaDiamondMine.prototype.pointConfirmItem = function (pointed_item) {
  if (pointed_item === -1) {
    return false;
  }
  var item_pos = this.itemsOnMap[pointed_item][3];
  this.mapColor[item_pos[1]][item_pos[0]] = 'aqua';
  this.confirmingItem = pointed_item;
  this.changeState(GotandaDiamondMine.STATE_UPGRADE);
  return true;
};

GotandaDiamondMine.prototype.pointChooseHand = function (x, y) {
  if (0 <= x && x <= 53 && 10 <= y && y <= 36) { // Map is cancel
    this.changeState(GotandaDiamondMine.STATE_CONFIRM);
    return true;
  } else if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Choose an item
    if (this.selectedItem !== -1) {
      this.itemsOnMap.push(this.itemsOnHand[this.selectedItem].concat());
      this.itemsOnHand.splice(this.selectedItem, 1);
      this.heroStatus['%'] -= Math.pow(2, this.itemsOnMap[this.itemsOnMap.length - 1][2]); // L1: 2, L2: 4, L3: 8, ...
      if (0 < this.heroStatus['%']) {
        this.changeState(GotandaDiamondMine.STATE_PLACE);
      } else {
        this.changeState(GotandaDiamondMine.STATE_DEFEATED);
      }
      return true;
    }
  } else if (0 <= x && x <= 27 && 37 <= y && y <= 47) { // Hand list
    var selected_item = (y - 37 < this.itemsOnHand.length ? y - 37 : -1);
    if (selected_item !== -1) {
      if (this.selectedItem !== selected_item) { // Choose different item
        this.selectedItem = selected_item;
        return true;
      } else if (this.selectedItem === selected_item) { // Choose same item => cancel
        this.changeState(GotandaDiamondMine.STATE_CONFIRM);
        return true;
      }
    }
  } else if (28 <= x && x <= 53 && 37 <= y && y <= 47) { // Item list 
    this.changeState(GotandaDiamondMine.STATE_CONFIRM);
    return true;
  }
};

GotandaDiamondMine.prototype.pointPlace = function (x, y) {
  if (0 <= x && x <= 53 && 10 <= y && y <= 36) { // Map
    if (this.mapSymbol[y - 10][x] === '.') {
      if (this.selectedPlace) { // Cancel post-place before
        this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = '.';
        this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'gray';
      }
      this.mapSymbol[y - 10][x] = this.itemsOnMap[this.placingItem][0];
      if (this.calculatePath()) {
        this.selectedPlace = [ x, y - 10 ];
        this.mapColor[y - 10][x] = 'white'; // do after "calculatePath", for save yellow color if cannot place
        this.placeBlocked = false;
      } else { // blocking, cannot place
        if (this.selectedPlace) { // Re-place
          this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = this.itemsOnMap[this.placingItem][0];
          this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'white';
        }
        this.mapSymbol[y - 10][x] = '.';
        this.placeBlocked = true;
      }
      return true;
    }

  } else if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // OK
    if (this.selectedPlace) { // OK
      this.itemsOnMap[this.placingItem][3] = this.selectedPlace;
      this.addItemToMap(this.itemsOnMap[this.placingItem]);
      ++this.placingItem;
      if (this.placingItem === this.itemsOnMap.length) {
        this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      } else {
        this.selectedPlace = null;
      }
      return true;
    }
  }
};

GotandaDiamondMine.prototype.pointUpgrade = function (x, y) {
  if (0 <= x && x <= 53 && 10 <= y && y <= 36) { // Map
    return this.pointUpgradeItem(GotandaDiamondMine.getIndexNearPoint(this.itemsOnMap, x, y - 10));

  } else if (0 <= x && x <= 27 && 37 <= y && y <= 47) { // Hand list is cancel
    if (-1 < this.sacrificingItem) {
      this.pointUpgradeItem(this.sacrificingItem);
    }
    return this.pointUpgradeItem(this.confirmingItem);
    
  } else if (28 <= x && x <= 53 && 37 <= y && y <= 47) { // Item list 
    return this.pointUpgradeItem(this.indexesToPoint[y - 37]);

  } else if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Replace or Combine
    if (this.sacrificingItem === -1) { // Replace
      // delete confirming item
      this.removeItemFromMap(this.itemsOnMap[this.confirmingItem]);
      var before_con_pos = this.itemsOnMap[this.confirmingItem][3];
      this.mapSymbol[before_con_pos[1]][before_con_pos[0]] = '.';
      this.mapColor[before_con_pos[1]][before_con_pos[0]] = 'gray';
      var item = this.itemsOnMap.splice(this.confirmingItem, 1)[0];
      item[3] = [null, null];
      this.itemsOnMap.push(item);
      this.calculatePath();
      this.changeState(GotandaDiamondMine.STATE_PLACE);
      return true;

    } else if (this.canSacrifice) { // Combine
      // level up confirming item
      var confirming_item = this.itemsOnMap[this.confirmingItem];
      this.removeItemFromMap(confirming_item);
      var next_item = GotandaDiamondMine.ITEMS[GotandaDiamondMine.ITEMS_MAP[confirming_item[1]][confirming_item[2] + 1]].concat();
      confirming_item[2] = next_item[2]; // level
      confirming_item[4] = next_item[4]; // status
      this.mapColor[confirming_item[3][1]][confirming_item[3][0]] = '';
      this.addItemToMap(confirming_item);
      this.confirmingItem = -1;

      // delete sacrificed item -> become rock
      this.removeItemFromMap(this.itemsOnMap[this.sacrificingItem]);
      var before_sac_pos = this.itemsOnMap[this.sacrificingItem][3];
      this.mapSymbol[before_sac_pos[1]][before_sac_pos[0]] = '`';
      this.mapColor[before_sac_pos[1]][before_sac_pos[0]] = '';
      this.itemsOnMap.splice(this.sacrificingItem, 1, GotandaDiamondMine.ITEMS[GotandaDiamondMine.ITEMS_MAP['a rock'][1]].concat());
      this.itemsOnMap[this.sacrificingItem][3] = before_sac_pos;
      this.sacrificingItem = -1;
      this.calculatePath();

      this.heroStatus['%'] -= Math.pow(2, confirming_item[2]); // L1: 2, L2: 4, L3: 8, ...
      if (0 < this.heroStatus['%']) {
        this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      } else {
        this.changeState(GotandaDiamondMine.STATE_DEFEATED);
      }
      return true;
    }
  }
};

GotandaDiamondMine.prototype.pointUpgradeItem = function (pointed_item) {
  if (pointed_item === -1) {
    return false;
  }
  if (-1 < this.sacrificingItem) {
    var before_sac_pos = this.itemsOnMap[this.sacrificingItem][3];
    this.mapColor[before_sac_pos[1]][before_sac_pos[0]] = '';
  }
  if (pointed_item === this.confirmingItem) { // same item is to cancel confirming
    var before_con_pos = this.itemsOnMap[this.confirmingItem][3];
    this.mapColor[before_con_pos[1]][before_con_pos[0]] = '';
    this.changeState(GotandaDiamondMine.STATE_CONFIRM);
  } else if (pointed_item === this.sacrificingItem) { // same item is to cancel sacrificing
    this.sacrificingItem = -1;
  } else {
    var item_pos = this.itemsOnMap[pointed_item][3];
    this.mapColor[item_pos[1]][item_pos[0]] = 'fuchsia';
    this.sacrificingItem = pointed_item;
    this.canSacrifice = this.checkSacrifice(this.itemsOnMap[this.confirmingItem], this.itemsOnMap[this.sacrificingItem]);
  }
  return true;
};

GotandaDiamondMine.REGEXP_UPGRADE = /^([-+])(\d)(.)$/;
GotandaDiamondMine.prototype.checkSacrifice = function (confirming_item, sacrificing_item) {
  var upgrade = confirming_item[4]['Upgrade'];
  if (!upgrade) {
    return false;
  }
  var matches = upgrade.match(GotandaDiamondMine.REGEXP_UPGRADE); // ex. (+)(1)(?)
  if (sacrificing_item[0] !== matches[3]) {
    return false;
  }
  var target_level = Math.max(confirming_item[2] + Math.floor(matches[1] === '+' ? matches[2] : -1 * matches[2]), 1);
  if (sacrificing_item[2] < target_level) {
    return false;
  }
  if (!GotandaDiamondMine.ITEMS_MAP[confirming_item[1]][confirming_item[2] + 1]) {
    return false;
  }
  return true;
};

GotandaDiamondMine.prototype.pointAnimation = function (x, y) {
  // wave move
  var units = this.units;
  var units_wait = this.unitsWait;
  var wave_moving = this.units.length;
  var path = this.path;
  var pre_unit_pos = 9999; // 1st unit is not restricted
  for (var i = 0; i < units.length; ++i) {
    var unit = units[i];
    if (unit[2] === path.length) {
      --wave_moving;
    } else if (!units_wait[i]) {
      ++unit[2];
      if (unit[2] < path.length) {
        if (pre_unit_pos <= unit[2]) {
          --unit[2];
          units_wait[i] += 1;
        } else {
          unit[3] = path[unit[2]];
          units_wait[i] += 4;
        }
      } else { // arrive to @
        unit[3] = [ null, null ];
        if(unit[5]['Damage'] < unit[4]['HP']) { // unit alive
          this.heroStatus['Damage'] += this.roll(unit[4]['Physical Damage']);
        } else { // unit die
          this.heroStatus['*'] += unit[4]['*'] || 0;
        }
      }
    }
    pre_unit_pos = unit[2];
    --units_wait[i];
  }
  if (!wave_moving) { // animation end
    this.depth += this.wave === 0 ? 0 : 1;
    ++this.wave;
    if (this.heroParameter['HP'] <= this.heroStatus['Damage']) {
      this.changeState(GotandaDiamondMine.STATE_DEFEATED);
    } else if (this.wave === this.waves.length) {
      this.changeState(GotandaDiamondMine.STATE_VICTORY);
    } else if (Math.random() < this.heroParameter['Luck']) { // TODO: consider formula
      this.changeState(GotandaDiamondMine.STATE_CHOOSE_ITEM);
    } else {
      this.createItemsOnHand();
      this.changeState(GotandaDiamondMine.STATE_CONFIRM);
    }
    return true;
  }
  
  // items attack
  var items_on_map = this.itemsOnMap;
  var items_wait = this.itemsWait;
  for (var i = 0; i < items_on_map.length; ++i) {
    if (!items_wait[i]) { // undefined or 0
      items_wait[i] += this.actionItem(items_on_map[i], units);
    }
    --items_wait[i];
  }
  return true;
};

GotandaDiamondMine.prototype.actionItem = function (item, units) {
  var item_x = item[3][0], item_y = item[3][1];
  var item_param = item[4];
  var result = 1;
  for (var i = 0; i < units.length; ++i) {
    var unit = units[i];
    var unit_x = unit[3][0], unit_y = unit[3][1];
    var unit_param = unit[4];
    var unit_status = unit[5];
    if (Math.abs(unit_x - item_x) < 2 && Math.abs(unit_y - item_y) < 2) {
      if (item_param['Physical Damage']) {
        unit_status['Damage'] += this.roll(item_param['Physical Damage']) - (unit_param['AC'] || 0);
      }
      result = item_param['Speed'] || 4;
      break;
    }
  }
};

// Add the power to status
GotandaDiamondMine.prototype.addItemToMap = function (item) {
  if (!item[5]) {
    item[5] = {};
  }
  var item_param = item[4];
  var item_status = item[5];
  if (item_param['Energy'] && !item_status['Added']) {
    this.heroStatus['%'] = Math.min(this.heroStatus['%'] + this.roll(item_param['Energy']), 100);
  }
  item_status['Added'] = true;
};

// Remove the power from status
GotandaDiamondMine.prototype.removeItemFromMap = function (item) {
  
};

GotandaDiamondMine.prototype.pointChooseItem = function (x, y) {
  if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Choose a item
    if (this.selectedItem !== -1) {
      /*
      var selected_mine = this.mineChoices[this.selectedMine];
      this.createMap(selected_mine); // mapSymbol, mapColor, points, path are created
      this.createWaves(selected_mine); // wave, waves are created
      this.itemsOnMap = [];
      this.itemsOnHand = [];
      this.itemsInDeck = [];
      this.createItemsOnHand(true);
      */
      this.createItemsOnHand();
      this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      return true;
    }
  } else if (0 <= x && x <= 53 && 10 <= y && y <= 18 && 1 <= this.itemChoices.length) { // Item 1
    this.selectedItem = 0;
    return true;
  } else if (0 <= x && x <= 53 && 19 <= y && y <= 27 && 2 <= this.itemChoices.length) { // Item 2
    this.selectedItem = 1;
    return true;
  } else if (0 <= x && x <= 53 && 28 <= y && y <= 36 && 3 <= this.itemChoices.length) { // Item 3
    this.selectedItem = 2;
    return true;
  }
};

GotandaDiamondMine.prototype.pointDefeated = function (x, y) {
  if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // You died
    this.changeState(GotandaDiamondMine.STATE_TITLE);
    return true;
  }
};

GotandaDiamondMine.prototype.pointVictory = function (x, y) {
  if (0 <= x && x <= 53 && 0 <= y && y <= 2) { // Back to the town
    this.changeState(GotandaDiamondMine.STATE_CHOOSE_MINE);
    return true;
  }
};
////////////////////////////////////////////////////////////////////////////////
// Procedural create Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.prototype.createMap = function (mine) {
  this.mapSymbol = GotandaDiamondMine.MAPS[mine['map']].map(function (row) { return row.concat(); });
  this.mapColor = this.mapSymbol.map(function (row) { return row.map(function (value) { return value === ' ' ? '' : 'gray'; }); });

  var points_num = Math.floor(Math.random() * 3) + 2; // 1 ~ 3
  var points = [ ];
  for (var i = 0; i < points_num; ++i) {
    var point = [ ];
    var point_ng = true;
    while (point_ng) {
      point = [ Math.floor(Math.random() * 54), Math.floor(Math.random() * 27) ];
      if (point[0] === 13 && point[1] === 13) { // @ position
        continue;
      } else if (this.mapSymbol[point[1]][point[0]] !== '.') {
        continue;
      }
      point_ng = false;
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

GotandaDiamondMine.prototype.createWaves = function (mine) {
  this.wave = 0;
  var depth = (mine['depth'] + 1000) / 1000;
  var waves = this.waves = [
    [ '*', 'gem', 1, [ null, null ], { HP: 0 } ]
  ];
  for (var i = 1; i <= mine['waves']; ++i) {
    waves.push([ 'A', 'monster A', Math.ceil(Math.random() * 3), [ null, null ], { 'HP': Math.round(10 * Math.pow(i, depth)), 'Physical Damage': '1d4', '*': 1 } ]);
  }
};

GotandaDiamondMine.prototype.createHeroChoices = function () {
  this.heroChoices = GotandaDiamondMine.CLASSES.concat(); // TODO
};

GotandaDiamondMine.prototype.createMineChoices = function () {
  // TODO
  this.mineChoices = [
    { depth: this.depth + 100, map: 'Small', waves:2 },
    { depth: this.depth + 200, map: 'Flats', waves:20 },
    { depth: this.depth + 300, map: 'Paddy', waves:30 }
  ];
};

GotandaDiamondMine.prototype.createDeckFromTemplate = function () {
  var array = this.heroParameter['Items'].split('');
  var deck = [];
  var check_symbol = function (symbol) {
    return function (item) {
      return item[0] === symbol && item[2] === 1; // Level 1
    };
  };
  for (var i = 0; i < array.length; ++i) {
    deck.push(this.chance.shuffle(GotandaDiamondMine.ITEMS.filter(check_symbol(array[i])))[0]);
  }
  this.itemsInOriginalDeck = deck;
};

GotandaDiamondMine.prototype.createShopChoices = function () {
  var max = 4; // TODO
  var array = this.heroParameter['Items'].split('');
  var check_symbol = function (symbol) {
    return function (item) {
      return item[0] === symbol && item[2] === 1; // Level 1
    };
  };
  for (var i = this.itemsInShop.length; i < max; ++i) {
    this.itemsInShop.push(this.chance.shuffle(GotandaDiamondMine.ITEMS.filter(check_symbol(this.chance.shuffle(array)[0])))[0]);
  }
};

GotandaDiamondMine.prototype.createItemChoices = function () {
  var max = 3; // TODO
  var array = this.heroParameter['Items'].split('');
  var check_symbol = function (symbol) {
    return function (item) {
      return item[0] === symbol && item[2] === 1; // Level 1
    };
  };
  for (var i = this.itemChoices.length; i < max; ++i) {
    this.itemChoices.push(this.chance.shuffle(GotandaDiamondMine.ITEMS.filter(check_symbol(this.chance.shuffle(array)[0])))[0]);
  }
};

GotandaDiamondMine.prototype.createItemsOnHand = function (reset_ok) {
  if (reset_ok && this.itemsOnHand.length === 0 && this.itemsInDeck.length === 0) { // reset deck
    this.itemsInDeck = this.chance.shuffle(this.itemsInOriginalDeck);

  } else if (this.itemsOnHand.length <= 10 && this.itemsInDeck.length !== 0) { // draw deck
    var draw_num = 2;
    while (this.itemsInDeck.length !== 0 && this.itemsOnHand.length <= 10 && 0 <= --draw_num) {
      this.itemsOnHand.push(this.itemsInDeck.pop());
    }
  }
};

////////////////////////////////////////////////////////////////////////////////
// Game Display Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.prototype.getScreen = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TITLE) {
    return this.getScreenTitle();
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) {
    return this.getScreenToChooseHero();
  } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    return this.getScreenAtTownItems();
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    return this.getScreenAtTownShop();
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_MINE) {
    return this.getScreenToChooseMine();
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    return this.getScreenToUpgrade();
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return this.getScreenToChooseItem();
  } else {
    return this.getScreenDefault();
  }
};

GotandaDiamondMine.prototype.getButtonBox = function (str, color) {
  return GotandaDiamondMine.colorScreen([
    '+----------------------------------------------------+'.split(''),
    ('|' + GotandaDiamondMine.center(this.__(str), 52) + '|').split(''),
    '+----------------------------------------------------+'.split('')
  ], color);
};

GotandaDiamondMine.prototype.getButton = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TITLE) {
    return this.getButtonBox("Play", 'lime');
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) {
    if (this.selectedHero === -1) {
      return this.getButtonBox("Choose a hero", 'gray');
    } else {
      return this.getButtonBox("Choose this hero", 'lime');
    }
/*  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    if (this.selectedItem === -1) {
      return this.getButtonBox("Which items to buy?", 'gray');
    } else {
      return this.getButtonBox("Buy this item", 'lime');
    }*/
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_MINE) {
    if (this.selectedMine === -1) {
      return this.getButtonBox("Choose a mine", 'gray');
    } else {
      return this.getButtonBox("Choose this mine", 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HAND) {
    if (this.selectedItem === -1) {
      return this.getButtonBox("Which items to place?", 'gray');
    } else {
      return this.getButtonBox("Choose this item", 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_PLACE) {
    if (this.selectedPlace === null) {
      return this.getButtonBox(this.placeBlocked ? "Blocking!" : "Choose a place", 'gray');
    } else {
      return this.getButtonBox(this.placeBlocked ? "Blocking!" : "Choose this place", 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) {
    if (this.wave === 0) {
      return this.getButtonBox("Preview the path", 'lime');
    } else {
      return this.getButtonBox("Go to next wave", 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    if (this.sacrificingItem === -1) {
      return this.getButtonBox("Replace this item", 'lime');
    } else if (this.canSacrifice) {
      return this.getButtonBox("Combine these items", 'lime');
    } else {
      return this.getButtonBox("Cannot combine!", 'gray');
    }
  } else if (state === GotandaDiamondMine.STATE_ANIMATION) {
    return this.getButtonBox("Now progressing", 'gray');
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    if (this.selectedItem === -1) {
      return this.getButtonBox("Which item to gain?", 'gray');
    } else {
      return this.getButtonBox("Choose this item", 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_DEFEATED) {
    return this.getButtonBox("You died", 'lime');
  } else if (state === GotandaDiamondMine.STATE_VICTORY) {
    return this.getButtonBox("Back to the town", 'lime');
  } else {
    return [ GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE ];
  }
};

GotandaDiamondMine.prototype.getScreenTitle = function () {
  return [].concat(this.getButton(), GotandaDiamondMine.TITLE_SCREEN);
};

GotandaDiamondMine.prototype.getDetailHeroInfo = function (hero_info) { // 54 x 9
  var output = [ '+----------------------------------------------------+'.split('') ];
  output.push( ('|@                                                   |').split('') );
  var i = 0;
  for (var key in hero_info ) {
    output.push( ('|' + hero_info[key] + ' ' + this.__(key) + '                                                      ').split('') );
    ++i;
  }
  for (i; i < 6; ++i) {
    output.push('|                                                    |'.split(''));
  }
  for (var i = 1; i < 8; ++i) {
    output[i][53] = '|';
  }
  output.push('+----------------------------------------------------+'.split(''));
  return output;
};

GotandaDiamondMine.prototype.getScreenToChooseHero = function () {
  var heroes = [];
  for (var i = 0; i < 5; ++i) {
    var display_hero = this.heroChoices[i] ? this.getDetailHeroInfo(this.heroChoices[i]) : GotandaDiamondMine.EMPTY_BOX;
    heroes = heroes.concat(i === this.selectedHero ? display_hero : GotandaDiamondMine.colorScreen(display_hero, 'green'));
  }
  return [].concat(this.getButton(), heroes);
};
/*
GotandaDiamondMine.prototype.getScreenAtTownShop = function () {
  var selected_item = this.selectedItem === -1 ? GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_LINED_BOX, 'gray') : this.getDetailItemInfo(this.itemsInShop[this.selectedItem], true);
  return [].concat(this.getButton(), this.getStatus(), this.getTownTab(), selected_item, this.getItemInfo(true));
};
*/
GotandaDiamondMine.prototype.getDetailMineInfo = function (mine_info) { // 54 x 9
  var output = [ '+----------------------------------------------------+'.split('') ];
  var i = 0;
  for (var key in mine_info ) {
    output.push( ('|' + mine_info[key] + ' ' + this.__(key) + '                                                      ').split('') );
    ++i;
  }
  for (i; i < 7; ++i) {
    output.push('|                                                    |'.split(''));
  }
  for (var i = 1; i <= 7; ++i) {
    output[i][53] = '|';
  }
  output.push('+----------------------------------------------------+'.split(''));
  return output;
};

GotandaDiamondMine.prototype.getScreenToChooseMine = function () {
  var mines = [];
  for (var i = 0; i < 3; ++i) {
    var display_mine = this.mineChoices[i] ? this.getDetailMineInfo(this.mineChoices[i]) : GotandaDiamondMine.EMPTY_LINED_BOX;
    mines = mines.concat(i === this.selectedMine ? display_mine : GotandaDiamondMine.colorScreen(display_mine, 'green'));
  }
  return [].concat(this.getButton(), this.getStatus(), this.getWaveInfo(), mines, GotandaDiamondMine.paste(this.getHandInfo(), this.getItemInfo2()));
};


GotandaDiamondMine.prototype.getDetailItemInfo = function (item, in_shop) { // 54 x 9
  var output = [ '+----------------------------------------------------+'.split('') ];
  output.push( ('|' + item[0] + item[2] + ' ' + this.__(item[1]) + '                                                      ').split('') );
  var i = 0;
  for (var key in item[4] ) {
    if (key !== 'Target Depth' && key !== 'Price') {
      output.push( ('|' + item[4][key] + ' ' + this.__(key) + '                                                      ').split('') );
      ++i;
    }
  }
  for (i; i < 6; ++i) {
    output.push('|                                                    |'.split(''));
  }
  for (var i = 1; i < 8; ++i) {
    output[i][53] = '|';
  }
  output.push('+----------------------------------------------------+'.split(''));
  
  if (in_shop) {
    var price_str_arr = (' ' + item[4]['Price'] + '*').split('');
    for (var x = 53 - price_str_arr.length; x < 53; ++x) {
      output[7][x] = price_str_arr[x - 53 + price_str_arr.length];
    }
  }
  return output;
};

GotandaDiamondMine.prototype.getScreenToChooseItem = function () {
  var items = [];
  for (var i = 0; i < 3; ++i) {
    var item = this.itemChoices[i] ? this.getDetailItemInfo(this.itemChoices[i]) : GotandaDiamondMine.EMPTY_BOX;
    items = items.concat(i === this.selectedItem ? item : GotandaDiamondMine.colorScreen(item, 'green'));
  }
  return [].concat(this.getButton(), this.getStatus(), this.getWaveInfo(), items, GotandaDiamondMine.paste(this.getHandInfo(), this.getItemInfo2()));
};

GotandaDiamondMine.prototype.getScreenToUpgrade = function () {
  return [].concat(this.getButton(), this.getStatus(), this.getWaveInfo(), this.getMap(), GotandaDiamondMine.paste(this.getHandInfo(), this.getUpgradeItemInfo()));
};

GotandaDiamondMine.prototype.getScreenDefault = function () {
  return [].concat(this.getButton(), this.getStatus(), this.getWaveInfo(), this.getMap(), GotandaDiamondMine.paste(this.getHandInfo(), this.getItemInfo2()));
};

GotandaDiamondMine.getWaveInfoString = function (wave, num) {
  var info_str = num + ')' + wave[2] + wave[0];
  for (var key in wave[4]) {
    info_str += ' ' + wave[4][key] + GotandaDiamondMine.ITEM_ABBR[key];
  }
  return info_str + '                                                      ';
};

GotandaDiamondMine.prototype.getUnitsInfoString = function (wave, num) {
  var live_units = this.units.filter(function (unit) {
    return unit[5]['Damage'] < unit[4]['HP'];
  });
  var unit = live_units.length === 0 ? this.units[this.units.length - 1] : live_units[0];
  var info_str = num + ')' + live_units.length + wave[0] + ' ' + (unit[4]['HP'] - unit[5]['Damage']) + '/' + unit[4]['HP'] + 'HP';
  for (var key in wave[4]) {
    if (key !== 'HP') {
      info_str += ' ' + wave[4][key] + GotandaDiamondMine.ITEM_ABBR[key];
    }
  }
  return info_str + '                                                      ';
};

GotandaDiamondMine.prototype.getWaveInfo = function () {
  var state = this.state;
  var wave_now = [], wave_next = [];
  for (var i = 0; i < 6; ++i) {
    var wave_num = this.wave + i;
    var wave = this.waves[wave_num];
    if (wave) {
      if (i === 0) {
        if (state === GotandaDiamondMine.STATE_ANIMATION) {
          wave_now.push(this.getUnitsInfoString(wave, wave_num).split(''));
        } else {
          wave_now.push(GotandaDiamondMine.getWaveInfoString(wave, wave_num).split(''));
        }
      } else {
        wave_next.push(GotandaDiamondMine.getWaveInfoString(wave, wave_num).split(''));
      }
    } else {
      wave_next.push(GotandaDiamondMine.EMPTY_LINE);
    }
  }
  return wave_now.concat(GotandaDiamondMine.colorScreen(wave_next, 'gray'));
};

GotandaDiamondMine.prototype.getMap = function () {
  var state = this.state;
  var map_symbol = this.mapSymbol;
  var map_color = this.mapColor;
  var map = [];
  var unit_map = {};
  var units = this.units || [];
  for (var i = 0; i < units.length; ++i) {
    var unit = units[i];
    unit_map[unit[3][0] + ',' + unit[3][1]] = unit[4]['HP'] <= unit[5]['Damage'] ? '{yellow-fg}*{/yellow-fg}' : '{red-fg}' + unit[0] + '{/red-fg}';
  }
  for (var y = 0; y < 27; ++y) {
    var row = [];
    for (var x = 0; x < 54; ++x) {
      var symbol = map_symbol[y][x];
      var color = map_color[y][x];
      if (state === GotandaDiamondMine.STATE_ANIMATION && unit_map[x + ',' + y]) {
        row.push(unit_map[x + ',' + y]);
      } else if (state === GotandaDiamondMine.STATE_PLACE && symbol === '.' && color === 'gray') {
        row.push('{green-fg}' + symbol + '{/green-fg}');
      } else {
        row.push(color ? '{' + color + '-fg}' + symbol + '{/' + color + '-fg}' : symbol);
      }
    }
    map.push(row);
  }
  return map;
};

GotandaDiamondMine.prototype.getStatus = function () {
  var state = this.state;
  var hero_param = this.heroParameter;
  var hero_status = this.heroStatus;
  var info_str = (hero_param['HP'] - hero_status['Damage']) + '/' + hero_param['HP'] + 'HP ' + hero_status['%'] + '% ' + hero_status['*'] + '* ';
  if (state === GotandaDiamondMine.STATE_TOWN_ITEMS || state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    info_str += this.itemsInOriginalDeck.length + 'ITEMS ';
  } else {
    info_str += this.itemsOnHand.length + '+' + this.itemsInDeck.length + 'Items ';  
  }
  for (var key in hero_param) {
    if (key !== 'HP') {
      info_str += hero_param[key] + key + ' ';
    }
  }
  return GotandaDiamondMine.colorScreen([ (info_str + '                           ').split('') ], 'gray');
};
/*
GotandaDiamondMine.getItemInfoLine = function (item, in_shop) {
  var info_str = item[0] + item[2];
  for (var key in item[4]) {
    if (key !== 'Target Depth' && key !== 'Price') {
      info_str += ' ' + item[4][key] + GotandaDiamondMine.ITEM_ABBR[key];
    }
  }
  var output = (info_str + '                           ').split('');
  if (in_shop) {
    var price_str_arr = (' ' + item[4]['Price'] + '*').split('');
    for (var x = 54 - price_str_arr.length; x < 54; ++x) {
      output[x] = price_str_arr[x - 54 + price_str_arr.length];
    }
  }
  return [ output ];
};

GotandaDiamondMine.prototype.getItemInfo = function () {
  var state = this.state;
  var info = [];
  var indexes = this.indexesToPoint = []; // using to point
  var items_to_display = (state === GotandaDiamondMine.STATE_TOWN_ITEMS
    ? this.itemsInOriginalDeck
    : state === GotandaDiamondMine.STATE_TOWN_SHOP ? this.itemsInShop : this.itemsOnMap);
  var display_num = state === GotandaDiamondMine.STATE_TOWN_ITEMS || state === GotandaDiamondMine.STATE_TOWN_SHOP ? 32 : 11;
  for (var i = 0; i < display_num; ++i) { 
    var index = Math.min(items_to_display.length > display_num ? items_to_display.length - display_num + i : i);
    if (items_to_display.length <= index) {
      info.push(GotandaDiamondMine.EMPTY_LINE);
      indexes.push(-1);
    } else {
      var info_line = GotandaDiamondMine.getItemInfoLine(items_to_display[index], state === GotandaDiamondMine.STATE_TOWN_SHOP);
      if (state === GotandaDiamondMine.STATE_PLACE && index !== this.placingItem) {
        info_line = GotandaDiamondMine.colorScreen(info_line, 'gray');
      } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS || state === GotandaDiamondMine.STATE_TOWN_SHOP) {
        info_line = GotandaDiamondMine.colorScreen(info_line, index !== this.selectedItem ? 'green' : 'aqua');
      }
      info.push(info_line[0]);
      indexes.push(index);
    }
  }

  if (state === GotandaDiamondMine.STATE_CONFIRM) {
    info = GotandaDiamondMine.colorScreen(info, 'green');
  } else if (state !== GotandaDiamondMine.STATE_TOWN_ITEMS && state !== GotandaDiamondMine.STATE_TOWN_SHOP && state !== GotandaDiamondMine.STATE_PLACE) {
    info = GotandaDiamondMine.colorScreen(info, 'gray');
  }
  return info;
};
*/

GotandaDiamondMine.getItemInfoLine2 = function (item) {
  var info_str = item[0] + item[2];
  for (var key in item[4]) {
    if (key !== 'Target Depth' && key !== 'Price') {
      info_str += ' ' + item[4][key] + GotandaDiamondMine.ITEM_ABBR[key];
    }
  }
  var output = (info_str + '                           ').split('');
  output.length = 27;
  return [ output ];
};

GotandaDiamondMine.prototype.getHandInfo = function (is_hand) {
  var state = this.state;
  var info = [];
  var indexes = this.indexesToPoint = []; // using to point
  var items_on_hand = this.itemsOnHand;
  var display_num = 11;
  for (var i = 0; i < display_num; ++i) {
    var index = Math.min(items_on_hand.length > display_num ? items_on_hand.length - display_num + i : i);
    if (items_on_hand.length <= index) {
      info.push(GotandaDiamondMine.EMPTY_LINE);
      indexes.push(-1);
    } else {
      var info_line = GotandaDiamondMine.getItemInfoLine2(items_on_hand[index]);
      if (state === GotandaDiamondMine.STATE_CHOOSE_HAND && this.selectedItem === index) {
        info_line = GotandaDiamondMine.colorScreen(info_line, 'aqua');
      } else if (state === GotandaDiamondMine.STATE_CONFIRM || state === GotandaDiamondMine.STATE_CHOOSE_HAND) {
        info_line = GotandaDiamondMine.colorScreen(info_line, 'green');
      } else {
        info_line = GotandaDiamondMine.colorScreen(info_line, 'gray');
      }
      info.push(info_line[0]);
      indexes.push(index);
    }
  }

  return info;
};

GotandaDiamondMine.prototype.getItemInfo2 = function (is_hand) {
  var state = this.state;
  var info = [];
  var indexes = this.indexesToPoint = []; // using to point
  var items_on_map = this.itemsOnMap;
  var display_num = 11;
  for (var i = 0; i < display_num; ++i) {
    var index = Math.min(items_on_map.length > display_num ? items_on_map.length - display_num + i : i);
    if (items_on_map.length <= index) {
      info.push(GotandaDiamondMine.EMPTY_LINE);
      indexes.push(-1);
    } else {
      var info_line = GotandaDiamondMine.getItemInfoLine2(items_on_map[index]);
      if (state === GotandaDiamondMine.STATE_PLACE && index !== this.placingItem) {
        info_line = GotandaDiamondMine.colorScreen(info_line, 'gray');
      }
      info.push(info_line[0]);
      indexes.push(index);
    }
  }

  if (state === GotandaDiamondMine.STATE_CONFIRM) {
    info = GotandaDiamondMine.colorScreen(info, 'green');
  } else if (state !== GotandaDiamondMine.STATE_PLACE) {
    info = GotandaDiamondMine.colorScreen(info, 'gray');
  }
  return info;
};

GotandaDiamondMine.prototype.getUpgradeItemInfo = function () {
  var info = [];
  var second_offset = 0;
  var indexes = this.indexesToPoint = []; // using to point
  var items_on_map = this.itemsOnMap;
  var display_num = 11;
  if (-1 < this.sacrificingItem && display_num <= Math.abs(this.confirmingItem - this.sacrificingItem)) {
    second_offset = Math.abs(this.confirmingItem - this.sacrificingItem) - display_num + 1;
  }
  for (var i = 0; i < display_num; ++i) {
    var index = Math.min(display_num < items_on_map.length ? items_on_map.length - display_num + i : i);    
    index = Math.min(index, this.confirmingItem + i);
    if (-1 < this.sacrificingItem) {
      index = Math.min(index, this.sacrificingItem + i);
    }
    if (second_offset && 5 < i) {
      index += second_offset;
    }
    
    if (second_offset && i === 5) {
      info.push('---------------------------'.split(''));
    } else if (items_on_map.length <= index) {
      info.push(GotandaDiamondMine.EMPTY_LINE);
    } else if (index === this.confirmingItem) {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.getItemInfoLine2(items_on_map[index]), 'aqua')[0]);
    } else if (index === this.sacrificingItem) {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.getItemInfoLine2(items_on_map[index]), 'fuchsia')[0]);
    } else {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.getItemInfoLine2(items_on_map[index]), 'green')[0]);
    }
    indexes.push(second_offset && i === 5 || items_on_map.length <= index ? -1 : index);
  }
  return info;
};
