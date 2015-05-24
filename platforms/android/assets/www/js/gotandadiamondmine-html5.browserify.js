(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GotandaDiamondMine = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
GotandaDiamondMine.STATE_TOWN_ITEMS  = 'town_items';
GotandaDiamondMine.STATE_TOWN_SHOP   = 'town_shop';
GotandaDiamondMine.STATE_TOWN_MINE   = 'town_mine';
GotandaDiamondMine.STATE_CHOOSE_ITEM = 'choose_item';
GotandaDiamondMine.STATE_PLACE       = 'place';
GotandaDiamondMine.STATE_CONFIRM     = 'confirm';
GotandaDiamondMine.STATE_UPGRADE     = 'upgrade';
GotandaDiamondMine.STATE_ANIMATION   = 'animation';
GotandaDiamondMine.STATE_DEFEATED    = 'defeated';
GotandaDiamondMine.STATE_VICTORY     = 'victory';

GotandaDiamondMine.CLASSES = [
  { 'HP': 10, 'STR': 3, "Items": '||||////%%' }
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
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '         .........         '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
  ],
  "Flats": [
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split(''),
    '...........................'.split('')
  ],
  "Paddy": [
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '   .....................   '.split(''),
    '   .....................   '.split(''),
    '   .....................   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   .....................   '.split(''),
    '   .....................   '.split(''),
    '   .....................   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   ...      ...      ...   '.split(''),
    '   .....................   '.split(''),
    '   .....................   '.split(''),
    '   .....................   '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split('')
  ]
};

GotandaDiamondMine.TITLE_SCREEN = [
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    'Gotanda Diamond Mine v0.0.1'.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split(''),
    '                           '.split('')
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

GotandaDiamondMine.prototype.changeState = function (state) {
  if (state === GotandaDiamondMine.STATE_TITLE) { // TITLE
    //

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) { // CHOOSE HERO
    this.itemsInOriginalDeck = [];
    this.itemsInShop = [];
    this.heroParameter = {}; // updated when choose hero
    this.heroStatus = { 'Damage': 0, '%': 100, '*': 0 };
    this.createHeroChoices();
    this.selectedHero = -1;
    this.depth = 0;

  } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) { // TOWN ITEMS
    this.selectedItem = -1;

  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) { // TOWN SHOP
    this.createShopChoices();
    this.selectedItem = -1;

  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) { // TOWN MINE
    this.createMineChoices();
    this.selectedMine = -1;

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) { // CHOOSE ITEM
    this.createItemsOnHand();
    this.selectedItem = -1;

  } else if (state === GotandaDiamondMine.STATE_PLACE) { // PLACE ITEM
    this.placingItem = this.itemsOnMap.filter(function (item) { return item[3][0] !== null && item[3][1] !== null; }).length; // filter is for undo
    this.selectedPlace = null;
    this.placeBlocked = false;
  
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) { // CONFIRM NEXT WAVE
    this.confirmingItem = -1;

  } else if (state === GotandaDiamondMine.STATE_UPGRADE) { // UPGRADE ITEM
    this.sacrificingItem = -1;
    this.canSacrifice = false;

  } else if (state === GotandaDiamondMine.STATE_ANIMATION) { // WAVE ANIMATION
    var wave = this.waves[this.wave];
    this.units = [];
    this.unitsWait = [];
    for (var i = 0; i < wave[2]; ++i) {
      // waves.push([ 'A', 'monster A', 2, [ null, null ], { HP: Math.round(10 * Math.pow(i, level)) } ]);
      this.units.push([ wave[0], wave[1], -1, [ null, null ], wave[4], { 'Damage': 0 } ]); // 0 is '>', so starts from -1
      this.unitsWait.push(i * 16);
    }
    this.itemsWait = [];
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
  if (mode === 'line') {
    for (var x = 0; x < copied.length; ++x) {
      copied[x] = '{' + color + '-fg}' + copied[x] + '{/' + color + '-fg}';
    }
  } else if (mode === 'x') {
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

GotandaDiamondMine.EMPTY_LINE = [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '];

GotandaDiamondMine.EMPTY_BOX = [
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']
];

GotandaDiamondMine.EMPTY_MINE_BOX = [
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']
];

GotandaDiamondMine.EMPTY_LINED_BOX = [
  ['+','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','+'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['|',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','|'],
  ['+','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','+']
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
  } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    return this.pointTownItems(x, y);
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    return this.pointTownShop(x, y);
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    return this.pointTownMine(x, y);
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return this.pointChooseItem(x, y);
  } else if (state === GotandaDiamondMine.STATE_PLACE) {
    return this.pointPlace(x, y);
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) {
    return this.pointConfirm(x, y);
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    return this.pointUpgrade(x, y);
  } else if (state === GotandaDiamondMine.STATE_ANIMATION) {
    return this.pointAnimation(x, y);
  } else if (state === GotandaDiamondMine.STATE_DEFEATED) {
    return this.pointDefeated(x, y);
  } else if (state === GotandaDiamondMine.STATE_VICTORY) {
    return this.pointVictory(x, y);
  }
};

GotandaDiamondMine.prototype.pointTitle = function (x, y) {
  if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Start
    this.changeState(GotandaDiamondMine.STATE_CHOOSE_HERO);
    return true;
  }
};

GotandaDiamondMine.prototype.pointChooseHero = function (x, y) {
  if (0 <= x && x <= 26 && 3 <= y && y <= 11 && 1 <= this.heroChoices.length) { // Hero 1
    this.selectedHero = 0;
    return true;
  } else if (0 <= x && x <= 26 && 12 <= y && y <= 20 && 2 <= this.heroChoices.length) { // Hero 2
    this.selectedHero = 1;
    return true;
  } else if (0 <= x && x <= 26 && 21 <= y && y <= 29 && 3 <= this.heroChoices.length) { // Hero 3
    this.selectedHero = 2;
    return true;
  } else if (0 <= x && x <= 26 && 30 <= y && y <= 38 && 4 <= this.heroChoices.length) { // Hero 4
    this.selectedHero = 3;
    return true;
  } else if (0 <= x && x <= 26 && 39 <= y && y <= 47 && 5 <= this.heroChoices.length) { // Hero 5
    this.selectedHero = 4;
    return true;
  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Choose a hero
    if (this.selectedHero !== -1) {
      var selected_hero = this.heroChoices[this.selectedHero];
      for (var key in selected_hero) {
        this.heroParameter[key] = selected_hero[key];
      }
      this.createDeckFromTemplate();
      this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
      return true;
    }
  }
};

GotandaDiamondMine.prototype.pointTownItems = function (x, y) {
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
    } else if (this.itemsInOriginalDeck[index]) {
      this.selectedItem = index;
      return true;
    }
  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Destroy
    
  }
};

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

GotandaDiamondMine.prototype.pointTownMine = function (x, y) {
  if (0 <= x && x <= 8 && 3 <= y && y <= 5) { // Town Items
    this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
    return true;
  } else if (9 <= x && x <= 17 && 3 <= y && y <= 5) { // Town Shop
    this.changeState(GotandaDiamondMine.STATE_TOWN_SHOP);
    return true;
  } else if (18 <= x && x <= 26 && 3 <= y && y <= 5) { // Town Mine
    this.changeState(GotandaDiamondMine.STATE_TOWN_MINE);
    return true;
  } else if (0 <= x && x <= 26 && 6 <= y && y <= 11 && 1 <= this.mineChoices.length) { // Mine 1
    this.selectedMine = 0;
    return true;
  } else if (0 <= x && x <= 26 && 12 <= y && y <= 17 && 2 <= this.mineChoices.length) { // Mine 2
    this.selectedMine = 1;
    return true;
  } else if (0 <= x && x <= 26 && 18 <= y && y <= 23 && 3 <= this.mineChoices.length) { // Mine 3
    this.selectedMine = 2;
    return true;
  } else if (0 <= x && x <= 26 && 24 <= y && y <= 29 && 4 <= this.mineChoices.length) { // Mine 4
    this.selectedMine = 3;
    return true;
  } else if (0 <= x && x <= 26 && 30 <= y && y <= 35 && 5 <= this.mineChoices.length) { // Mine 5
    this.selectedMine = 4;
    return true;
  } else if (0 <= x && x <= 26 && 36 <= y && y <= 41 && 6 <= this.mineChoices.length) { // Mine 6
    this.selectedMine = 4;
    return true;
  } else if (0 <= x && x <= 26 && 42 <= y && y <= 47 && 7 <= this.mineChoices.length) { // Mine 7
    this.selectedMine = 4;
    return true;
  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Choose a hero
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
  }
};

GotandaDiamondMine.prototype.pointChooseItem = function (x, y) {
  if (0 <= x && x <= 26 && 9 <= y && y <= 17 && 1 <= this.itemsOnHand.length) { // Item 1
    this.selectedItem = 0;
    return true;
  } else if (0 <= x && x <= 26 && 18 <= y && y <= 26 && 2 <= this.itemsOnHand.length) { // Item 2
    this.selectedItem = 1;
    return true;
  } else if (0 <= x && x <= 26 && 27 <= y && y <= 35 && 3 <= this.itemsOnHand.length) { // Item 3
    this.selectedItem = 2;
    return true;
  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Choose an item
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
  }
};

GotandaDiamondMine.prototype.pointPlace = function (x, y) {
  if (0 <= x && x <= 26 && 9 <= y && y <= 35) { // Map
    if (this.mapSymbol[y - 9][x] === '.') {
      if (this.selectedPlace) { // Cancel post-place before
        this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = '.';
        this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'gray';
      }
      this.mapSymbol[y - 9][x] = this.itemsOnMap[this.placingItem][0];
      if (this.calculatePath()) {
        this.selectedPlace = [ x, y - 9 ];
        this.mapColor[y - 9][x] = 'white'; // do after "calculatePath", for save yellow color if cannot place
        this.placeBlocked = false;
      } else { // blocking, cannot place
        if (this.selectedPlace) { // Re-place
          this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = this.itemsOnMap[this.placingItem][0];
          this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'white';
        }
        this.mapSymbol[y - 9][x] = '.';
        this.placeBlocked = true;
      }
      return true;
    }

  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // OK
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

GotandaDiamondMine.prototype.pointConfirm = function (x, y) {
  if (0 <= x && x <= 26 && 9 <= y && y <= 35) { // Map
    return this.pointConfirmItem(GotandaDiamondMine.getIndexNearPoint(this.itemsOnMap, x, y - 9));

  } else if (0 <= x && x <= 26 && 37 <= y && y <= 47) { // Item list 
    return this.pointConfirmItem(this.indexesToPoint[y - 37]);

  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Next Wave
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

GotandaDiamondMine.prototype.pointUpgrade = function (x, y) {
  if (0 <= x && x <= 26 && 9 <= y && y <= 35) { // Map
    return this.pointUpgradeItem(GotandaDiamondMine.getIndexNearPoint(this.itemsOnMap, x, y - 9));

  } else if (0 <= x && x <= 26 && 37 <= y && y <= 47) { // Item list 
    return this.pointUpgradeItem(this.indexesToPoint[y - 37]);

  } else if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Replace or Combine
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

      // delete sacrificed item
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
    } else if (0 < this.itemsOnHand.length) {
      this.changeState(GotandaDiamondMine.STATE_CHOOSE_ITEM);
    } else { // no hand is next wave
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

GotandaDiamondMine.prototype.removeItemFromMap = function (item) {
  
};

GotandaDiamondMine.prototype.pointDefeated = function (x, y) {
  if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // You died
    this.changeState(GotandaDiamondMine.STATE_TITLE);
    return true;
  }
};

GotandaDiamondMine.prototype.pointVictory = function (x, y) {
  if (0 <= x && x <= 26 && 0 <= y && y <= 2) { // Back to the town
    this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
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
      point = [ Math.floor(Math.random() * 27), Math.floor(Math.random() * 27) ];
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
    { name: 'ABCDE', depth: this.depth + 100, map: 'Flats', waves:5 },
    { name: 'ABCDE', depth: this.depth + 200, map: 'Small', waves:20 },
    { name: 'ABCDE', depth: this.depth + 300, map: 'Paddy', waves:30 }
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

GotandaDiamondMine.prototype.createItemsOnHand = function (reset_ok) {
  if (reset_ok && this.itemsOnHand.length === 0 && this.itemsInDeck.length === 0) { // reset deck
    this.itemsInDeck = this.chance.shuffle(this.itemsInOriginalDeck);
  }
  if (this.itemsOnHand.length !== 3 && this.itemsInDeck.length !== 0) { // draw deck
    while (this.itemsInDeck.length !== 0 && this.itemsOnHand.length < 3) {
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
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    return this.getScreenAtTownMine();
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM){
    return this.getScreenToChooseItem();
  } else if (state === GotandaDiamondMine.STATE_UPGRADE){
    return this.getScreenToUpgrade();
  } else {
    return this.getScreenDefault();
  }
};

GotandaDiamondMine.prototype.getButtonBox = function (str, color) {
  return GotandaDiamondMine.colorScreen([
    '+-------------------------+'.split(''),
    ('|' + GotandaDiamondMine.center(this.__(str), 25) + '|').split(''),
    '+-------------------------+'.split('')
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
  } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    if (this.selectedItem === -1) {
      return this.getButtonBox("Which items to see?", 'gray');
    } else {
      return this.getButtonBox("Destroy this item", 'lime');  
    }
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    if (this.selectedItem === -1) {
      return this.getButtonBox("Which items to buy?", 'gray');
    } else {
      return this.getButtonBox("Buy this item", 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    if (this.selectedMine === -1) {
      return this.getButtonBox("Choose a mine", 'gray');
    } else {
      return this.getButtonBox("Choose this mine", 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
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

GotandaDiamondMine.prototype.getDetailHeroInfo = function (hero_info) { // 27 x 9
  var output = [ '+-------------------------+'.split('') ];
  output.push( ('|@                        |').split('') );
  var i = 0;
  for (var key in hero_info ) {
    output.push( ('|' + hero_info[key] + ' ' + this.__(key) + '                           ').split('') );
    ++i;
  }
  for (i; i < 6; ++i) {
    output.push('|                         |'.split(''));
  }
  for (var i = 1; i < 8; ++i) {
    output[i][26] = '|';
  }
  output.push('+-------------------------+'.split(''));
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

GotandaDiamondMine.prototype.getTownTab = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    return GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen([
      '         +-------++-------+'.split(''),
      '  Items  | Shop  || Mine  |'.split(''),
      '         +-------++-------+'.split('')
    ], 'gray', 'x', 0, 8), 'lime', 'x', 9, 17), 'lime', 'x', 18, 26);
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    return GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen([
      '+-------+         +-------+'.split(''),
      '| Items |  Shop   | Mine  |'.split(''),
      '--------+         +-------+'.split('')
    ], 'lime', 'x', 0, 8), 'gray', 'x', 9, 17), 'lime', 'x', 18, 26);
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    return GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen([
      '+-------++-------+         '.split(''),
      '| Items || Shop  |  Mine   '.split(''),
      '--------++-------+         '.split('')
    ], 'lime', 'x', 0, 8), 'lime', 'x', 9, 17), 'gray', 'x', 18, 26);
  }
};

GotandaDiamondMine.prototype.getScreenAtTownItems = function () {
  var selected_item = this.selectedItem === -1 ? GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_LINED_BOX, 'gray') : this.getDetailItemInfo(this.itemsInOriginalDeck[this.selectedItem]);
  return [].concat(this.getButton(), this.getTownTab(), selected_item, this.getStatus(), this.getItemInfo(true));
};

GotandaDiamondMine.prototype.getScreenAtTownShop = function () {
  var selected_item = this.selectedItem === -1 ? GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_LINED_BOX, 'gray') : this.getDetailItemInfo(this.itemsInShop[this.selectedItem], true);
  return [].concat(this.getButton(), this.getTownTab(), selected_item, this.getStatus(), this.getItemInfo(true));
};

GotandaDiamondMine.prototype.getDetailMineInfo = function (mine_info) { // 27 x 6
  var output = [ '+-------------------------+'.split('') ];
  var i = 0;
  for (var key in mine_info ) {
    output.push( ('|' + mine_info[key] + ' ' + this.__(key) + '                           ').split('') );
    ++i;
  }
  for (i; i < 4; ++i) {
    output.push('|                         |'.split(''));
  }
  for (var i = 1; i <= 4; ++i) {
    output[i][26] = '|';
  }
  output.push('+-------------------------+'.split(''));
  return output;
};

GotandaDiamondMine.prototype.getScreenAtTownMine = function () {
  var mines = [];
  for (var i = 0; i < 7; ++i) {
    var display_mine = this.mineChoices[i] ? this.getDetailMineInfo(this.mineChoices[i]) : GotandaDiamondMine.EMPTY_MINE_BOX;
    mines = mines.concat(i === this.selectedMine ? display_mine : GotandaDiamondMine.colorScreen(display_mine, 'green'));
  }
  return [].concat(this.getButton(), this.getTownTab(), mines);
};

GotandaDiamondMine.prototype.getDetailItemInfo = function (item, in_shop) { // 27 x 9
  var output = [ '+-------------------------+'.split('') ];
  output.push( ('|' + item[0] + item[2] + ' ' + this.__(item[1]) + '                           ').split('') );
  var i = 0;
  for (var key in item[4] ) {
    if (key !== 'Target Depth' && key !== 'Price') {
      output.push( ('|' + item[4][key] + ' ' + this.__(key) + '                           ').split('') );
      ++i;
    }
  }
  for (i; i < 6; ++i) {
    output.push('|                         |'.split(''));
  }
  for (var i = 1; i < 8; ++i) {
    output[i][26] = '|';
  }
  output.push('+-------------------------+'.split(''));
  
  if (in_shop) {
    var price_str_arr = (' ' + item[4]['Price'] + '*').split('');
    for (var x = 26 - price_str_arr.length; x < 26; ++x) {
      output[7][x] = price_str_arr[x - 26 + price_str_arr.length];
    }
  }
  return output;
};

GotandaDiamondMine.prototype.getScreenToChooseItem = function () {
  var items = [];
  for (var i = 0; i < 3; ++i) {
    var item = this.itemsOnHand[i] ? this.getDetailItemInfo(this.itemsOnHand[i]) : GotandaDiamondMine.EMPTY_BOX;
    items = items.concat(i === this.selectedItem ? item : GotandaDiamondMine.colorScreen(item, 'green'));
  }
  return [].concat(this.getButton(), this.getWaveInfo(), items, this.getStatus(), this.getItemInfo());
};

GotandaDiamondMine.prototype.getScreenToUpgrade = function () {
  return [].concat(this.getButton(), this.getWaveInfo(), this.getMap(), this.getStatus(), this.getUpgradeItemInfo());
};

GotandaDiamondMine.prototype.getScreenDefault = function () {
  return [].concat(this.getButton(), this.getWaveInfo(), this.getMap(), this.getStatus(), this.getItemInfo());
};

GotandaDiamondMine.getWaveInfoString = function (wave, num) {
  var info_str = num + ')' + wave[2] + wave[0];
  for (var key in wave[4]) {
    info_str += ' ' + wave[4][key] + GotandaDiamondMine.ITEM_ABBR[key];
  }
  return info_str + '                           ';
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
  return info_str + '                           ';
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
    for (var x = 0; x < 27; ++x) {
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
    for (var x = 27 - price_str_arr.length; x < 27; ++x) {
      output[x] = price_str_arr[x - 27 + price_str_arr.length];
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

GotandaDiamondMine.prototype.getUpgradeItemInfo = function () {
  var info = [];
  var second_offset = 0;
  var indexes = this.indexesToPoint = []; // using to point
  var items_on_map = this.itemsOnMap;
  if (-1 < this.sacrificingItem && 11 <= Math.abs(this.confirmingItem - this.sacrificingItem)) {
    second_offset = Math.abs(this.confirmingItem - this.sacrificingItem) - 10;
  }
  for (var i = 0; i < 11; ++i) {
    var index = Math.min(11 < items_on_map.length ? items_on_map.length - 11 + i : i);    
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
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.getItemInfoLine(items_on_map[index]), 'aqua'));
    } else if (index === this.sacrificingItem) {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.getItemInfoLine(items_on_map[index]), 'fuchsia'));
    } else {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.getItemInfoLine(items_on_map[index]), 'green'));
    }
    indexes.push(second_offset && i === 5 || items_on_map.length <= index ? -1 : index);
  }
  return info;
};

},{"./__":2,"chance":9,"pathfinding":10}],2:[function(require,module,exports){
var __ = function (str) {
  return __[__.lang] && __[__.lang][str] || str;
};

__.setLang = function (lang) {
  this.lang = lang;
};

__.getLang = function () {
  return this.lang;
};

__.ja = require('./__ja.po2json.json');
//__.ab = require('__ab');
//__.cd = require('__cd');

module.exports = __;

},{"./__ja.po2json.json":3}],3:[function(require,module,exports){
module.exports={"Items":"","Physical Damage":"物理ダメージ","Upgrade":"でアップグレード","a dagger":"ダガー","a short sword":"短剣","a pole axe":"ポールアックス","Energy":"エネルギー","an apple":"リンゴ","Physical Damage Buff":"物理ダメージUP","an amulet of damage":"ダメージの首飾り","Armor Class":"アーマークラス","\\ Luck Bonus":"\\ 幸運UP","a ring armour":"リングアーマー","a rock":"石","An edged weapon":"","A hafted weapon":"","A pole weapon":"","Fire Damage":"","Cold Damage":"","Lightning Damage":"","Poison Damage":"","All Resistance":"","Fire Resistance":"","Cold Resistance":"","Lightning Resistance":"","Poison Resistance":"","HP":"HP","*":"*","Small":"小部屋","Flats":"平野","Paddy":"田んぼ","Play":"プレイする","Choose a hero":"ヒーローを選んでください","Choose this hero":"このヒーローを選ぶ","Which items to see?":"どのアイテムを見ますか？","Destroy this item":"このアイテムを壊す","Which items to buy?":"どのアイテムを買いますか？","Buy this item":"このアイテムを買う","Choose a mine":"発掘場所を選んでください","Choose this mine":"この場所にする","Which items to place?":"アイテムを選んでください","Choose this item":"このアイテムにする","Blocking!":"経路がありません","Choose a place":"場所を選んでください","Choose this place":"この場所にする","Preview the path":"経路をプレビューする","Go to next wave":"次のウェーブ","Replace this item":"アイテムを再配置する","Combine these items":"アイテムを結合する","Cannot combine!":"その組み合わせは結合できません！","Now progressing":"処理中です…","You died":"あなたは死にました","Back to the town":"町に戻ります"}
},{}],4:[function(require,module,exports){
module.exports={ "　": [ 0, 0 ], "、": [ 8, 0 ], "。": [ 16, 0 ], "，": [ 24, 0 ], "．": [ 32, 0 ], "・": [ 40, 0 ], "：": [ 48, 0 ], "；": [ 56, 0 ], "？": [ 64, 0 ], "！": [ 72, 0 ], "゛": [ 80, 0 ], "゜": [ 88, 0 ], "´": [ 96, 0 ], "｀": [ 104, 0 ], "¨": [ 112, 0 ], "＾": [ 120, 0 ], "￣": [ 128, 0 ], "＿": [ 136, 0 ], "ヽ": [ 144, 0 ], "ヾ": [ 152, 0 ], "ゝ": [ 160, 0 ], "ゞ": [ 168, 0 ], "〃": [ 176, 0 ], "仝": [ 184, 0 ], "々": [ 192, 0 ], "〆": [ 200, 0 ], "〇": [ 208, 0 ], "ー": [ 216, 0 ], "―": [ 224, 0 ], "‐": [ 232, 0 ], "／": [ 240, 0 ], "＼": [ 248, 0 ], "～": [ 256, 0 ], "∥": [ 264, 0 ], "｜": [ 272, 0 ], "…": [ 280, 0 ], "‥": [ 288, 0 ], "‘": [ 296, 0 ], "’": [ 304, 0 ], "“": [ 312, 0 ], "”": [ 320, 0 ], "（": [ 328, 0 ], "）": [ 336, 0 ], "〔": [ 344, 0 ], "〕": [ 352, 0 ], "［": [ 360, 0 ], "］": [ 368, 0 ], "｛": [ 376, 0 ], "｝": [ 384, 0 ], "〈": [ 392, 0 ], "〉": [ 400, 0 ], "《": [ 408, 0 ], "》": [ 416, 0 ], "「": [ 424, 0 ], "」": [ 432, 0 ], "『": [ 440, 0 ], "』": [ 448, 0 ], "【": [ 456, 0 ], "】": [ 464, 0 ], "＋": [ 472, 0 ], "－": [ 480, 0 ], "±": [ 488, 0 ], "×": [ 496, 0 ], "÷": [ 504, 0 ], "＝": [ 512, 0 ], "≠": [ 520, 0 ], "＜": [ 528, 0 ], "＞": [ 536, 0 ], "≦": [ 544, 0 ], "≧": [ 552, 0 ], "∞": [ 560, 0 ], "∴": [ 568, 0 ], "♂": [ 576, 0 ], "♀": [ 584, 0 ], "°": [ 592, 0 ], "′": [ 600, 0 ], "″": [ 608, 0 ], "℃": [ 616, 0 ], "￥": [ 624, 0 ], "＄": [ 632, 0 ], "￠": [ 640, 0 ], "￡": [ 648, 0 ], "％": [ 656, 0 ], "＃": [ 664, 0 ], "＆": [ 672, 0 ], "＊": [ 680, 0 ], "＠": [ 688, 0 ], "§": [ 696, 0 ], "☆": [ 704, 0 ], "★": [ 712, 0 ], "○": [ 720, 0 ], "●": [ 728, 0 ], "◎": [ 736, 0 ], "◇": [ 744, 0 ], "◆": [ 0, 8 ], "□": [ 8, 8 ], "■": [ 16, 8 ], "△": [ 24, 8 ], "▲": [ 32, 8 ], "▽": [ 40, 8 ], "▼": [ 48, 8 ], "※": [ 56, 8 ], "〒": [ 64, 8 ], "→": [ 72, 8 ], "←": [ 80, 8 ], "↑": [ 88, 8 ], "↓": [ 96, 8 ], "〓": [ 104, 8 ], "∈": [ 200, 8 ], "∋": [ 208, 8 ], "⊆": [ 216, 8 ], "⊇": [ 224, 8 ], "⊂": [ 232, 8 ], "⊃": [ 240, 8 ], "∪": [ 248, 8 ], "∩": [ 256, 8 ], "∧": [ 328, 8 ], "∨": [ 336, 8 ], "￢": [ 344, 8 ], "⇒": [ 352, 8 ], "⇔": [ 360, 8 ], "∀": [ 368, 8 ], "∃": [ 376, 8 ], "∠": [ 472, 8 ], "⊥": [ 480, 8 ], "⌒": [ 488, 8 ], "∂": [ 496, 8 ], "∇": [ 504, 8 ], "≡": [ 512, 8 ], "≒": [ 520, 8 ], "≪": [ 528, 8 ], "≫": [ 536, 8 ], "√": [ 544, 8 ], "∽": [ 552, 8 ], "∝": [ 560, 8 ], "∵": [ 568, 8 ], "∫": [ 576, 8 ], "∬": [ 584, 8 ], "Å": [ 648, 8 ], "‰": [ 656, 8 ], "♯": [ 664, 8 ], "♭": [ 672, 8 ], "♪": [ 680, 8 ], "†": [ 688, 8 ], "‡": [ 696, 8 ], "¶": [ 704, 8 ], "◯": [ 744, 8 ], "０": [ 120, 16 ], "１": [ 128, 16 ], "２": [ 136, 16 ], "３": [ 144, 16 ], "４": [ 152, 16 ], "５": [ 160, 16 ], "６": [ 168, 16 ], "７": [ 176, 16 ], "８": [ 184, 16 ], "９": [ 192, 16 ], "Ａ": [ 256, 16 ], "Ｂ": [ 264, 16 ], "Ｃ": [ 272, 16 ], "Ｄ": [ 280, 16 ], "Ｅ": [ 288, 16 ], "Ｆ": [ 296, 16 ], "Ｇ": [ 304, 16 ], "Ｈ": [ 312, 16 ], "Ｉ": [ 320, 16 ], "Ｊ": [ 328, 16 ], "Ｋ": [ 336, 16 ], "Ｌ": [ 344, 16 ], "Ｍ": [ 352, 16 ], "Ｎ": [ 360, 16 ], "Ｏ": [ 368, 16 ], "Ｐ": [ 376, 16 ], "Ｑ": [ 384, 16 ], "Ｒ": [ 392, 16 ], "Ｓ": [ 400, 16 ], "Ｔ": [ 408, 16 ], "Ｕ": [ 416, 16 ], "Ｖ": [ 424, 16 ], "Ｗ": [ 432, 16 ], "Ｘ": [ 440, 16 ], "Ｙ": [ 448, 16 ], "Ｚ": [ 456, 16 ], "ａ": [ 512, 16 ], "ｂ": [ 520, 16 ], "ｃ": [ 528, 16 ], "ｄ": [ 536, 16 ], "ｅ": [ 544, 16 ], "ｆ": [ 552, 16 ], "ｇ": [ 560, 16 ], "ｈ": [ 568, 16 ], "ｉ": [ 576, 16 ], "ｊ": [ 584, 16 ], "ｋ": [ 592, 16 ], "ｌ": [ 600, 16 ], "ｍ": [ 608, 16 ], "ｎ": [ 616, 16 ], "ｏ": [ 624, 16 ], "ｐ": [ 632, 16 ], "ｑ": [ 640, 16 ], "ｒ": [ 648, 16 ], "ｓ": [ 656, 16 ], "ｔ": [ 664, 16 ], "ｕ": [ 672, 16 ], "ｖ": [ 680, 16 ], "ｗ": [ 688, 16 ], "ｘ": [ 696, 16 ], "ｙ": [ 704, 16 ], "ｚ": [ 712, 16 ], "ぁ": [ 0, 24 ], "あ": [ 8, 24 ], "ぃ": [ 16, 24 ], "い": [ 24, 24 ], "ぅ": [ 32, 24 ], "う": [ 40, 24 ], "ぇ": [ 48, 24 ], "え": [ 56, 24 ], "ぉ": [ 64, 24 ], "お": [ 72, 24 ], "か": [ 80, 24 ], "が": [ 88, 24 ], "き": [ 96, 24 ], "ぎ": [ 104, 24 ], "く": [ 112, 24 ], "ぐ": [ 120, 24 ], "け": [ 128, 24 ], "げ": [ 136, 24 ], "こ": [ 144, 24 ], "ご": [ 152, 24 ], "さ": [ 160, 24 ], "ざ": [ 168, 24 ], "し": [ 176, 24 ], "じ": [ 184, 24 ], "す": [ 192, 24 ], "ず": [ 200, 24 ], "せ": [ 208, 24 ], "ぜ": [ 216, 24 ], "そ": [ 224, 24 ], "ぞ": [ 232, 24 ], "た": [ 240, 24 ], "だ": [ 248, 24 ], "ち": [ 256, 24 ], "ぢ": [ 264, 24 ], "っ": [ 272, 24 ], "つ": [ 280, 24 ], "づ": [ 288, 24 ], "て": [ 296, 24 ], "で": [ 304, 24 ], "と": [ 312, 24 ], "ど": [ 320, 24 ], "な": [ 328, 24 ], "に": [ 336, 24 ], "ぬ": [ 344, 24 ], "ね": [ 352, 24 ], "の": [ 360, 24 ], "は": [ 368, 24 ], "ば": [ 376, 24 ], "ぱ": [ 384, 24 ], "ひ": [ 392, 24 ], "び": [ 400, 24 ], "ぴ": [ 408, 24 ], "ふ": [ 416, 24 ], "ぶ": [ 424, 24 ], "ぷ": [ 432, 24 ], "へ": [ 440, 24 ], "べ": [ 448, 24 ], "ぺ": [ 456, 24 ], "ほ": [ 464, 24 ], "ぼ": [ 472, 24 ], "ぽ": [ 480, 24 ], "ま": [ 488, 24 ], "み": [ 496, 24 ], "む": [ 504, 24 ], "め": [ 512, 24 ], "も": [ 520, 24 ], "ゃ": [ 528, 24 ], "や": [ 536, 24 ], "ゅ": [ 544, 24 ], "ゆ": [ 552, 24 ], "ょ": [ 560, 24 ], "よ": [ 568, 24 ], "ら": [ 576, 24 ], "り": [ 584, 24 ], "る": [ 592, 24 ], "れ": [ 600, 24 ], "ろ": [ 608, 24 ], "ゎ": [ 616, 24 ], "わ": [ 624, 24 ], "ゐ": [ 632, 24 ], "ゑ": [ 640, 24 ], "を": [ 648, 24 ], "ん": [ 656, 24 ], "ァ": [ 0, 32 ], "ア": [ 8, 32 ], "ィ": [ 16, 32 ], "イ": [ 24, 32 ], "ゥ": [ 32, 32 ], "ウ": [ 40, 32 ], "ェ": [ 48, 32 ], "エ": [ 56, 32 ], "ォ": [ 64, 32 ], "オ": [ 72, 32 ], "カ": [ 80, 32 ], "ガ": [ 88, 32 ], "キ": [ 96, 32 ], "ギ": [ 104, 32 ], "ク": [ 112, 32 ], "グ": [ 120, 32 ], "ケ": [ 128, 32 ], "ゲ": [ 136, 32 ], "コ": [ 144, 32 ], "ゴ": [ 152, 32 ], "サ": [ 160, 32 ], "ザ": [ 168, 32 ], "シ": [ 176, 32 ], "ジ": [ 184, 32 ], "ス": [ 192, 32 ], "ズ": [ 200, 32 ], "セ": [ 208, 32 ], "ゼ": [ 216, 32 ], "ソ": [ 224, 32 ], "ゾ": [ 232, 32 ], "タ": [ 240, 32 ], "ダ": [ 248, 32 ], "チ": [ 256, 32 ], "ヂ": [ 264, 32 ], "ッ": [ 272, 32 ], "ツ": [ 280, 32 ], "ヅ": [ 288, 32 ], "テ": [ 296, 32 ], "デ": [ 304, 32 ], "ト": [ 312, 32 ], "ド": [ 320, 32 ], "ナ": [ 328, 32 ], "ニ": [ 336, 32 ], "ヌ": [ 344, 32 ], "ネ": [ 352, 32 ], "ノ": [ 360, 32 ], "ハ": [ 368, 32 ], "バ": [ 376, 32 ], "パ": [ 384, 32 ], "ヒ": [ 392, 32 ], "ビ": [ 400, 32 ], "ピ": [ 408, 32 ], "フ": [ 416, 32 ], "ブ": [ 424, 32 ], "プ": [ 432, 32 ], "ヘ": [ 440, 32 ], "ベ": [ 448, 32 ], "ペ": [ 456, 32 ], "ホ": [ 464, 32 ], "ボ": [ 472, 32 ], "ポ": [ 480, 32 ], "マ": [ 488, 32 ], "ミ": [ 496, 32 ], "ム": [ 504, 32 ], "メ": [ 512, 32 ], "モ": [ 520, 32 ], "ャ": [ 528, 32 ], "ヤ": [ 536, 32 ], "ュ": [ 544, 32 ], "ユ": [ 552, 32 ], "ョ": [ 560, 32 ], "ヨ": [ 568, 32 ], "ラ": [ 576, 32 ], "リ": [ 584, 32 ], "ル": [ 592, 32 ], "レ": [ 600, 32 ], "ロ": [ 608, 32 ], "ヮ": [ 616, 32 ], "ワ": [ 624, 32 ], "ヰ": [ 632, 32 ], "ヱ": [ 640, 32 ], "ヲ": [ 648, 32 ], "ン": [ 656, 32 ], "ヴ": [ 664, 32 ], "ヵ": [ 672, 32 ], "ヶ": [ 680, 32 ], "Α": [ 0, 40 ], "Β": [ 8, 40 ], "Γ": [ 16, 40 ], "Δ": [ 24, 40 ], "Ε": [ 32, 40 ], "Ζ": [ 40, 40 ], "Η": [ 48, 40 ], "Θ": [ 56, 40 ], "Ι": [ 64, 40 ], "Κ": [ 72, 40 ], "Λ": [ 80, 40 ], "Μ": [ 88, 40 ], "Ν": [ 96, 40 ], "Ξ": [ 104, 40 ], "Ο": [ 112, 40 ], "Π": [ 120, 40 ], "Ρ": [ 128, 40 ], "Σ": [ 136, 40 ], "Τ": [ 144, 40 ], "Υ": [ 152, 40 ], "Φ": [ 160, 40 ], "Χ": [ 168, 40 ], "Ψ": [ 176, 40 ], "Ω": [ 184, 40 ], "α": [ 256, 40 ], "β": [ 264, 40 ], "γ": [ 272, 40 ], "δ": [ 280, 40 ], "ε": [ 288, 40 ], "ζ": [ 296, 40 ], "η": [ 304, 40 ], "θ": [ 312, 40 ], "ι": [ 320, 40 ], "κ": [ 328, 40 ], "λ": [ 336, 40 ], "μ": [ 344, 40 ], "ν": [ 352, 40 ], "ξ": [ 360, 40 ], "ο": [ 368, 40 ], "π": [ 376, 40 ], "ρ": [ 384, 40 ], "σ": [ 392, 40 ], "τ": [ 400, 40 ], "υ": [ 408, 40 ], "φ": [ 416, 40 ], "χ": [ 424, 40 ], "ψ": [ 432, 40 ], "ω": [ 440, 40 ], "А": [ 0, 48 ], "Б": [ 8, 48 ], "В": [ 16, 48 ], "Г": [ 24, 48 ], "Д": [ 32, 48 ], "Е": [ 40, 48 ], "Ё": [ 48, 48 ], "Ж": [ 56, 48 ], "З": [ 64, 48 ], "И": [ 72, 48 ], "Й": [ 80, 48 ], "К": [ 88, 48 ], "Л": [ 96, 48 ], "М": [ 104, 48 ], "Н": [ 112, 48 ], "О": [ 120, 48 ], "П": [ 128, 48 ], "Р": [ 136, 48 ], "С": [ 144, 48 ], "Т": [ 152, 48 ], "У": [ 160, 48 ], "Ф": [ 168, 48 ], "Х": [ 176, 48 ], "Ц": [ 184, 48 ], "Ч": [ 192, 48 ], "Ш": [ 200, 48 ], "Щ": [ 208, 48 ], "Ъ": [ 216, 48 ], "Ы": [ 224, 48 ], "Ь": [ 232, 48 ], "Э": [ 240, 48 ], "Ю": [ 248, 48 ], "Я": [ 256, 48 ], "а": [ 384, 48 ], "б": [ 392, 48 ], "в": [ 400, 48 ], "г": [ 408, 48 ], "д": [ 416, 48 ], "е": [ 424, 48 ], "ё": [ 432, 48 ], "ж": [ 440, 48 ], "з": [ 448, 48 ], "и": [ 456, 48 ], "й": [ 464, 48 ], "к": [ 472, 48 ], "л": [ 480, 48 ], "м": [ 488, 48 ], "н": [ 496, 48 ], "о": [ 504, 48 ], "п": [ 512, 48 ], "р": [ 520, 48 ], "с": [ 528, 48 ], "т": [ 536, 48 ], "у": [ 544, 48 ], "ф": [ 552, 48 ], "х": [ 560, 48 ], "ц": [ 568, 48 ], "ч": [ 576, 48 ], "ш": [ 584, 48 ], "щ": [ 592, 48 ], "ъ": [ 600, 48 ], "ы": [ 608, 48 ], "ь": [ 616, 48 ], "э": [ 624, 48 ], "ю": [ 632, 48 ], "я": [ 640, 48 ], "─": [ 0, 56 ], "│": [ 8, 56 ], "┌": [ 16, 56 ], "┐": [ 24, 56 ], "┘": [ 32, 56 ], "└": [ 40, 56 ], "├": [ 48, 56 ], "┬": [ 56, 56 ], "┤": [ 64, 56 ], "┴": [ 72, 56 ], "┼": [ 80, 56 ], "━": [ 88, 56 ], "┃": [ 96, 56 ], "┏": [ 104, 56 ], "┓": [ 112, 56 ], "┛": [ 120, 56 ], "┗": [ 128, 56 ], "┣": [ 136, 56 ], "┳": [ 144, 56 ], "┫": [ 152, 56 ], "┻": [ 160, 56 ], "╋": [ 168, 56 ], "┠": [ 176, 56 ], "┯": [ 184, 56 ], "┨": [ 192, 56 ], "┷": [ 200, 56 ], "┿": [ 208, 56 ], "┝": [ 216, 56 ], "┰": [ 224, 56 ], "┥": [ 232, 56 ], "┸": [ 240, 56 ], "╂": [ 248, 56 ], "①": [ 0, 96 ], "②": [ 8, 96 ], "③": [ 16, 96 ], "④": [ 24, 96 ], "⑤": [ 32, 96 ], "⑥": [ 40, 96 ], "⑦": [ 48, 96 ], "⑧": [ 56, 96 ], "⑨": [ 64, 96 ], "⑩": [ 72, 96 ], "⑪": [ 80, 96 ], "⑫": [ 88, 96 ], "⑬": [ 96, 96 ], "⑭": [ 104, 96 ], "⑮": [ 112, 96 ], "⑯": [ 120, 96 ], "⑰": [ 128, 96 ], "⑱": [ 136, 96 ], "⑲": [ 144, 96 ], "⑳": [ 152, 96 ], "Ⅰ": [ 160, 96 ], "Ⅱ": [ 168, 96 ], "Ⅲ": [ 176, 96 ], "Ⅳ": [ 184, 96 ], "Ⅴ": [ 192, 96 ], "Ⅵ": [ 200, 96 ], "Ⅶ": [ 208, 96 ], "Ⅷ": [ 216, 96 ], "Ⅸ": [ 224, 96 ], "Ⅹ": [ 232, 96 ], "㍉": [ 248, 96 ], "㌔": [ 256, 96 ], "㌢": [ 264, 96 ], "㍍": [ 272, 96 ], "㌘": [ 280, 96 ], "㌧": [ 288, 96 ], "㌃": [ 296, 96 ], "㌶": [ 304, 96 ], "㍑": [ 312, 96 ], "㍗": [ 320, 96 ], "㌍": [ 328, 96 ], "㌦": [ 336, 96 ], "㌣": [ 344, 96 ], "㌫": [ 352, 96 ], "㍊": [ 360, 96 ], "㌻": [ 368, 96 ], "㎜": [ 376, 96 ], "㎝": [ 384, 96 ], "㎞": [ 392, 96 ], "㎎": [ 400, 96 ], "㎏": [ 408, 96 ], "㏄": [ 416, 96 ], "㎡": [ 424, 96 ], "㍻": [ 496, 96 ], "〝": [ 504, 96 ], "〟": [ 512, 96 ], "№": [ 520, 96 ], "㏍": [ 528, 96 ], "℡": [ 536, 96 ], "㊤": [ 544, 96 ], "㊥": [ 552, 96 ], "㊦": [ 560, 96 ], "㊧": [ 568, 96 ], "㊨": [ 576, 96 ], "㈱": [ 584, 96 ], "㈲": [ 592, 96 ], "㈹": [ 600, 96 ], "㍾": [ 608, 96 ], "㍽": [ 616, 96 ], "㍼": [ 624, 96 ], "≒": [ 632, 96 ], "≡": [ 640, 96 ], "∫": [ 648, 96 ], "∮": [ 656, 96 ], "∑": [ 664, 96 ], "√": [ 672, 96 ], "⊥": [ 680, 96 ], "∠": [ 688, 96 ], "∟": [ 696, 96 ], "⊿": [ 704, 96 ], "∵": [ 712, 96 ], "∩": [ 720, 96 ], "∪": [ 728, 96 ], "亜": [ 0, 120 ], "唖": [ 8, 120 ], "娃": [ 16, 120 ], "阿": [ 24, 120 ], "哀": [ 32, 120 ], "愛": [ 40, 120 ], "挨": [ 48, 120 ], "姶": [ 56, 120 ], "逢": [ 64, 120 ], "葵": [ 72, 120 ], "茜": [ 80, 120 ], "穐": [ 88, 120 ], "悪": [ 96, 120 ], "握": [ 104, 120 ], "渥": [ 112, 120 ], "旭": [ 120, 120 ], "葦": [ 128, 120 ], "芦": [ 136, 120 ], "鯵": [ 144, 120 ], "梓": [ 152, 120 ], "圧": [ 160, 120 ], "斡": [ 168, 120 ], "扱": [ 176, 120 ], "宛": [ 184, 120 ], "姐": [ 192, 120 ], "虻": [ 200, 120 ], "飴": [ 208, 120 ], "絢": [ 216, 120 ], "綾": [ 224, 120 ], "鮎": [ 232, 120 ], "或": [ 240, 120 ], "粟": [ 248, 120 ], "袷": [ 256, 120 ], "安": [ 264, 120 ], "庵": [ 272, 120 ], "按": [ 280, 120 ], "暗": [ 288, 120 ], "案": [ 296, 120 ], "闇": [ 304, 120 ], "鞍": [ 312, 120 ], "杏": [ 320, 120 ], "以": [ 328, 120 ], "伊": [ 336, 120 ], "位": [ 344, 120 ], "依": [ 352, 120 ], "偉": [ 360, 120 ], "囲": [ 368, 120 ], "夷": [ 376, 120 ], "委": [ 384, 120 ], "威": [ 392, 120 ], "尉": [ 400, 120 ], "惟": [ 408, 120 ], "意": [ 416, 120 ], "慰": [ 424, 120 ], "易": [ 432, 120 ], "椅": [ 440, 120 ], "為": [ 448, 120 ], "畏": [ 456, 120 ], "異": [ 464, 120 ], "移": [ 472, 120 ], "維": [ 480, 120 ], "緯": [ 488, 120 ], "胃": [ 496, 120 ], "萎": [ 504, 120 ], "衣": [ 512, 120 ], "謂": [ 520, 120 ], "違": [ 528, 120 ], "遺": [ 536, 120 ], "医": [ 544, 120 ], "井": [ 552, 120 ], "亥": [ 560, 120 ], "域": [ 568, 120 ], "育": [ 576, 120 ], "郁": [ 584, 120 ], "磯": [ 592, 120 ], "一": [ 600, 120 ], "壱": [ 608, 120 ], "溢": [ 616, 120 ], "逸": [ 624, 120 ], "稲": [ 632, 120 ], "茨": [ 640, 120 ], "芋": [ 648, 120 ], "鰯": [ 656, 120 ], "允": [ 664, 120 ], "印": [ 672, 120 ], "咽": [ 680, 120 ], "員": [ 688, 120 ], "因": [ 696, 120 ], "姻": [ 704, 120 ], "引": [ 712, 120 ], "飲": [ 720, 120 ], "淫": [ 728, 120 ], "胤": [ 736, 120 ], "蔭": [ 744, 120 ], "院": [ 0, 128 ], "陰": [ 8, 128 ], "隠": [ 16, 128 ], "韻": [ 24, 128 ], "吋": [ 32, 128 ], "右": [ 40, 128 ], "宇": [ 48, 128 ], "烏": [ 56, 128 ], "羽": [ 64, 128 ], "迂": [ 72, 128 ], "雨": [ 80, 128 ], "卯": [ 88, 128 ], "鵜": [ 96, 128 ], "窺": [ 104, 128 ], "丑": [ 112, 128 ], "碓": [ 120, 128 ], "臼": [ 128, 128 ], "渦": [ 136, 128 ], "嘘": [ 144, 128 ], "唄": [ 152, 128 ], "欝": [ 160, 128 ], "蔚": [ 168, 128 ], "鰻": [ 176, 128 ], "姥": [ 184, 128 ], "厩": [ 192, 128 ], "浦": [ 200, 128 ], "瓜": [ 208, 128 ], "閏": [ 216, 128 ], "噂": [ 224, 128 ], "云": [ 232, 128 ], "運": [ 240, 128 ], "雲": [ 248, 128 ], "荏": [ 256, 128 ], "餌": [ 264, 128 ], "叡": [ 272, 128 ], "営": [ 280, 128 ], "嬰": [ 288, 128 ], "影": [ 296, 128 ], "映": [ 304, 128 ], "曳": [ 312, 128 ], "栄": [ 320, 128 ], "永": [ 328, 128 ], "泳": [ 336, 128 ], "洩": [ 344, 128 ], "瑛": [ 352, 128 ], "盈": [ 360, 128 ], "穎": [ 368, 128 ], "頴": [ 376, 128 ], "英": [ 384, 128 ], "衛": [ 392, 128 ], "詠": [ 400, 128 ], "鋭": [ 408, 128 ], "液": [ 416, 128 ], "疫": [ 424, 128 ], "益": [ 432, 128 ], "駅": [ 440, 128 ], "悦": [ 448, 128 ], "謁": [ 456, 128 ], "越": [ 464, 128 ], "閲": [ 472, 128 ], "榎": [ 480, 128 ], "厭": [ 488, 128 ], "円": [ 496, 128 ], "園": [ 504, 128 ], "堰": [ 512, 128 ], "奄": [ 520, 128 ], "宴": [ 528, 128 ], "延": [ 536, 128 ], "怨": [ 544, 128 ], "掩": [ 552, 128 ], "援": [ 560, 128 ], "沿": [ 568, 128 ], "演": [ 576, 128 ], "炎": [ 584, 128 ], "焔": [ 592, 128 ], "煙": [ 600, 128 ], "燕": [ 608, 128 ], "猿": [ 616, 128 ], "縁": [ 624, 128 ], "艶": [ 632, 128 ], "苑": [ 640, 128 ], "薗": [ 648, 128 ], "遠": [ 656, 128 ], "鉛": [ 664, 128 ], "鴛": [ 672, 128 ], "塩": [ 680, 128 ], "於": [ 688, 128 ], "汚": [ 696, 128 ], "甥": [ 704, 128 ], "凹": [ 712, 128 ], "央": [ 720, 128 ], "奥": [ 728, 128 ], "往": [ 736, 128 ], "応": [ 744, 128 ], "押": [ 0, 136 ], "旺": [ 8, 136 ], "横": [ 16, 136 ], "欧": [ 24, 136 ], "殴": [ 32, 136 ], "王": [ 40, 136 ], "翁": [ 48, 136 ], "襖": [ 56, 136 ], "鴬": [ 64, 136 ], "鴎": [ 72, 136 ], "黄": [ 80, 136 ], "岡": [ 88, 136 ], "沖": [ 96, 136 ], "荻": [ 104, 136 ], "億": [ 112, 136 ], "屋": [ 120, 136 ], "憶": [ 128, 136 ], "臆": [ 136, 136 ], "桶": [ 144, 136 ], "牡": [ 152, 136 ], "乙": [ 160, 136 ], "俺": [ 168, 136 ], "卸": [ 176, 136 ], "恩": [ 184, 136 ], "温": [ 192, 136 ], "穏": [ 200, 136 ], "音": [ 208, 136 ], "下": [ 216, 136 ], "化": [ 224, 136 ], "仮": [ 232, 136 ], "何": [ 240, 136 ], "伽": [ 248, 136 ], "価": [ 256, 136 ], "佳": [ 264, 136 ], "加": [ 272, 136 ], "可": [ 280, 136 ], "嘉": [ 288, 136 ], "夏": [ 296, 136 ], "嫁": [ 304, 136 ], "家": [ 312, 136 ], "寡": [ 320, 136 ], "科": [ 328, 136 ], "暇": [ 336, 136 ], "果": [ 344, 136 ], "架": [ 352, 136 ], "歌": [ 360, 136 ], "河": [ 368, 136 ], "火": [ 376, 136 ], "珂": [ 384, 136 ], "禍": [ 392, 136 ], "禾": [ 400, 136 ], "稼": [ 408, 136 ], "箇": [ 416, 136 ], "花": [ 424, 136 ], "苛": [ 432, 136 ], "茄": [ 440, 136 ], "荷": [ 448, 136 ], "華": [ 456, 136 ], "菓": [ 464, 136 ], "蝦": [ 472, 136 ], "課": [ 480, 136 ], "嘩": [ 488, 136 ], "貨": [ 496, 136 ], "迦": [ 504, 136 ], "過": [ 512, 136 ], "霞": [ 520, 136 ], "蚊": [ 528, 136 ], "俄": [ 536, 136 ], "峨": [ 544, 136 ], "我": [ 552, 136 ], "牙": [ 560, 136 ], "画": [ 568, 136 ], "臥": [ 576, 136 ], "芽": [ 584, 136 ], "蛾": [ 592, 136 ], "賀": [ 600, 136 ], "雅": [ 608, 136 ], "餓": [ 616, 136 ], "駕": [ 624, 136 ], "介": [ 632, 136 ], "会": [ 640, 136 ], "解": [ 648, 136 ], "回": [ 656, 136 ], "塊": [ 664, 136 ], "壊": [ 672, 136 ], "廻": [ 680, 136 ], "快": [ 688, 136 ], "怪": [ 696, 136 ], "悔": [ 704, 136 ], "恢": [ 712, 136 ], "懐": [ 720, 136 ], "戒": [ 728, 136 ], "拐": [ 736, 136 ], "改": [ 744, 136 ], "魁": [ 0, 144 ], "晦": [ 8, 144 ], "械": [ 16, 144 ], "海": [ 24, 144 ], "灰": [ 32, 144 ], "界": [ 40, 144 ], "皆": [ 48, 144 ], "絵": [ 56, 144 ], "芥": [ 64, 144 ], "蟹": [ 72, 144 ], "開": [ 80, 144 ], "階": [ 88, 144 ], "貝": [ 96, 144 ], "凱": [ 104, 144 ], "劾": [ 112, 144 ], "外": [ 120, 144 ], "咳": [ 128, 144 ], "害": [ 136, 144 ], "崖": [ 144, 144 ], "慨": [ 152, 144 ], "概": [ 160, 144 ], "涯": [ 168, 144 ], "碍": [ 176, 144 ], "蓋": [ 184, 144 ], "街": [ 192, 144 ], "該": [ 200, 144 ], "鎧": [ 208, 144 ], "骸": [ 216, 144 ], "浬": [ 224, 144 ], "馨": [ 232, 144 ], "蛙": [ 240, 144 ], "垣": [ 248, 144 ], "柿": [ 256, 144 ], "蛎": [ 264, 144 ], "鈎": [ 272, 144 ], "劃": [ 280, 144 ], "嚇": [ 288, 144 ], "各": [ 296, 144 ], "廓": [ 304, 144 ], "拡": [ 312, 144 ], "撹": [ 320, 144 ], "格": [ 328, 144 ], "核": [ 336, 144 ], "殻": [ 344, 144 ], "獲": [ 352, 144 ], "確": [ 360, 144 ], "穫": [ 368, 144 ], "覚": [ 376, 144 ], "角": [ 384, 144 ], "赫": [ 392, 144 ], "較": [ 400, 144 ], "郭": [ 408, 144 ], "閣": [ 416, 144 ], "隔": [ 424, 144 ], "革": [ 432, 144 ], "学": [ 440, 144 ], "岳": [ 448, 144 ], "楽": [ 456, 144 ], "額": [ 464, 144 ], "顎": [ 472, 144 ], "掛": [ 480, 144 ], "笠": [ 488, 144 ], "樫": [ 496, 144 ], "橿": [ 504, 144 ], "梶": [ 512, 144 ], "鰍": [ 520, 144 ], "潟": [ 528, 144 ], "割": [ 536, 144 ], "喝": [ 544, 144 ], "恰": [ 552, 144 ], "括": [ 560, 144 ], "活": [ 568, 144 ], "渇": [ 576, 144 ], "滑": [ 584, 144 ], "葛": [ 592, 144 ], "褐": [ 600, 144 ], "轄": [ 608, 144 ], "且": [ 616, 144 ], "鰹": [ 624, 144 ], "叶": [ 632, 144 ], "椛": [ 640, 144 ], "樺": [ 648, 144 ], "鞄": [ 656, 144 ], "株": [ 664, 144 ], "兜": [ 672, 144 ], "竃": [ 680, 144 ], "蒲": [ 688, 144 ], "釜": [ 696, 144 ], "鎌": [ 704, 144 ], "噛": [ 712, 144 ], "鴨": [ 720, 144 ], "栢": [ 728, 144 ], "茅": [ 736, 144 ], "萱": [ 744, 144 ], "粥": [ 0, 152 ], "刈": [ 8, 152 ], "苅": [ 16, 152 ], "瓦": [ 24, 152 ], "乾": [ 32, 152 ], "侃": [ 40, 152 ], "冠": [ 48, 152 ], "寒": [ 56, 152 ], "刊": [ 64, 152 ], "勘": [ 72, 152 ], "勧": [ 80, 152 ], "巻": [ 88, 152 ], "喚": [ 96, 152 ], "堪": [ 104, 152 ], "姦": [ 112, 152 ], "完": [ 120, 152 ], "官": [ 128, 152 ], "寛": [ 136, 152 ], "干": [ 144, 152 ], "幹": [ 152, 152 ], "患": [ 160, 152 ], "感": [ 168, 152 ], "慣": [ 176, 152 ], "憾": [ 184, 152 ], "換": [ 192, 152 ], "敢": [ 200, 152 ], "柑": [ 208, 152 ], "桓": [ 216, 152 ], "棺": [ 224, 152 ], "款": [ 232, 152 ], "歓": [ 240, 152 ], "汗": [ 248, 152 ], "漢": [ 256, 152 ], "澗": [ 264, 152 ], "潅": [ 272, 152 ], "環": [ 280, 152 ], "甘": [ 288, 152 ], "監": [ 296, 152 ], "看": [ 304, 152 ], "竿": [ 312, 152 ], "管": [ 320, 152 ], "簡": [ 328, 152 ], "緩": [ 336, 152 ], "缶": [ 344, 152 ], "翰": [ 352, 152 ], "肝": [ 360, 152 ], "艦": [ 368, 152 ], "莞": [ 376, 152 ], "観": [ 384, 152 ], "諌": [ 392, 152 ], "貫": [ 400, 152 ], "還": [ 408, 152 ], "鑑": [ 416, 152 ], "間": [ 424, 152 ], "閑": [ 432, 152 ], "関": [ 440, 152 ], "陥": [ 448, 152 ], "韓": [ 456, 152 ], "館": [ 464, 152 ], "舘": [ 472, 152 ], "丸": [ 480, 152 ], "含": [ 488, 152 ], "岸": [ 496, 152 ], "巌": [ 504, 152 ], "玩": [ 512, 152 ], "癌": [ 520, 152 ], "眼": [ 528, 152 ], "岩": [ 536, 152 ], "翫": [ 544, 152 ], "贋": [ 552, 152 ], "雁": [ 560, 152 ], "頑": [ 568, 152 ], "顔": [ 576, 152 ], "願": [ 584, 152 ], "企": [ 592, 152 ], "伎": [ 600, 152 ], "危": [ 608, 152 ], "喜": [ 616, 152 ], "器": [ 624, 152 ], "基": [ 632, 152 ], "奇": [ 640, 152 ], "嬉": [ 648, 152 ], "寄": [ 656, 152 ], "岐": [ 664, 152 ], "希": [ 672, 152 ], "幾": [ 680, 152 ], "忌": [ 688, 152 ], "揮": [ 696, 152 ], "机": [ 704, 152 ], "旗": [ 712, 152 ], "既": [ 720, 152 ], "期": [ 728, 152 ], "棋": [ 736, 152 ], "棄": [ 744, 152 ], "機": [ 0, 160 ], "帰": [ 8, 160 ], "毅": [ 16, 160 ], "気": [ 24, 160 ], "汽": [ 32, 160 ], "畿": [ 40, 160 ], "祈": [ 48, 160 ], "季": [ 56, 160 ], "稀": [ 64, 160 ], "紀": [ 72, 160 ], "徽": [ 80, 160 ], "規": [ 88, 160 ], "記": [ 96, 160 ], "貴": [ 104, 160 ], "起": [ 112, 160 ], "軌": [ 120, 160 ], "輝": [ 128, 160 ], "飢": [ 136, 160 ], "騎": [ 144, 160 ], "鬼": [ 152, 160 ], "亀": [ 160, 160 ], "偽": [ 168, 160 ], "儀": [ 176, 160 ], "妓": [ 184, 160 ], "宜": [ 192, 160 ], "戯": [ 200, 160 ], "技": [ 208, 160 ], "擬": [ 216, 160 ], "欺": [ 224, 160 ], "犠": [ 232, 160 ], "疑": [ 240, 160 ], "祇": [ 248, 160 ], "義": [ 256, 160 ], "蟻": [ 264, 160 ], "誼": [ 272, 160 ], "議": [ 280, 160 ], "掬": [ 288, 160 ], "菊": [ 296, 160 ], "鞠": [ 304, 160 ], "吉": [ 312, 160 ], "吃": [ 320, 160 ], "喫": [ 328, 160 ], "桔": [ 336, 160 ], "橘": [ 344, 160 ], "詰": [ 352, 160 ], "砧": [ 360, 160 ], "杵": [ 368, 160 ], "黍": [ 376, 160 ], "却": [ 384, 160 ], "客": [ 392, 160 ], "脚": [ 400, 160 ], "虐": [ 408, 160 ], "逆": [ 416, 160 ], "丘": [ 424, 160 ], "久": [ 432, 160 ], "仇": [ 440, 160 ], "休": [ 448, 160 ], "及": [ 456, 160 ], "吸": [ 464, 160 ], "宮": [ 472, 160 ], "弓": [ 480, 160 ], "急": [ 488, 160 ], "救": [ 496, 160 ], "朽": [ 504, 160 ], "求": [ 512, 160 ], "汲": [ 520, 160 ], "泣": [ 528, 160 ], "灸": [ 536, 160 ], "球": [ 544, 160 ], "究": [ 552, 160 ], "窮": [ 560, 160 ], "笈": [ 568, 160 ], "級": [ 576, 160 ], "糾": [ 584, 160 ], "給": [ 592, 160 ], "旧": [ 600, 160 ], "牛": [ 608, 160 ], "去": [ 616, 160 ], "居": [ 624, 160 ], "巨": [ 632, 160 ], "拒": [ 640, 160 ], "拠": [ 648, 160 ], "挙": [ 656, 160 ], "渠": [ 664, 160 ], "虚": [ 672, 160 ], "許": [ 680, 160 ], "距": [ 688, 160 ], "鋸": [ 696, 160 ], "漁": [ 704, 160 ], "禦": [ 712, 160 ], "魚": [ 720, 160 ], "亨": [ 728, 160 ], "享": [ 736, 160 ], "京": [ 744, 160 ], "供": [ 0, 168 ], "侠": [ 8, 168 ], "僑": [ 16, 168 ], "兇": [ 24, 168 ], "競": [ 32, 168 ], "共": [ 40, 168 ], "凶": [ 48, 168 ], "協": [ 56, 168 ], "匡": [ 64, 168 ], "卿": [ 72, 168 ], "叫": [ 80, 168 ], "喬": [ 88, 168 ], "境": [ 96, 168 ], "峡": [ 104, 168 ], "強": [ 112, 168 ], "彊": [ 120, 168 ], "怯": [ 128, 168 ], "恐": [ 136, 168 ], "恭": [ 144, 168 ], "挟": [ 152, 168 ], "教": [ 160, 168 ], "橋": [ 168, 168 ], "況": [ 176, 168 ], "狂": [ 184, 168 ], "狭": [ 192, 168 ], "矯": [ 200, 168 ], "胸": [ 208, 168 ], "脅": [ 216, 168 ], "興": [ 224, 168 ], "蕎": [ 232, 168 ], "郷": [ 240, 168 ], "鏡": [ 248, 168 ], "響": [ 256, 168 ], "饗": [ 264, 168 ], "驚": [ 272, 168 ], "仰": [ 280, 168 ], "凝": [ 288, 168 ], "尭": [ 296, 168 ], "暁": [ 304, 168 ], "業": [ 312, 168 ], "局": [ 320, 168 ], "曲": [ 328, 168 ], "極": [ 336, 168 ], "玉": [ 344, 168 ], "桐": [ 352, 168 ], "粁": [ 360, 168 ], "僅": [ 368, 168 ], "勤": [ 376, 168 ], "均": [ 384, 168 ], "巾": [ 392, 168 ], "錦": [ 400, 168 ], "斤": [ 408, 168 ], "欣": [ 416, 168 ], "欽": [ 424, 168 ], "琴": [ 432, 168 ], "禁": [ 440, 168 ], "禽": [ 448, 168 ], "筋": [ 456, 168 ], "緊": [ 464, 168 ], "芹": [ 472, 168 ], "菌": [ 480, 168 ], "衿": [ 488, 168 ], "襟": [ 496, 168 ], "謹": [ 504, 168 ], "近": [ 512, 168 ], "金": [ 520, 168 ], "吟": [ 528, 168 ], "銀": [ 536, 168 ], "九": [ 544, 168 ], "倶": [ 552, 168 ], "句": [ 560, 168 ], "区": [ 568, 168 ], "狗": [ 576, 168 ], "玖": [ 584, 168 ], "矩": [ 592, 168 ], "苦": [ 600, 168 ], "躯": [ 608, 168 ], "駆": [ 616, 168 ], "駈": [ 624, 168 ], "駒": [ 632, 168 ], "具": [ 640, 168 ], "愚": [ 648, 168 ], "虞": [ 656, 168 ], "喰": [ 664, 168 ], "空": [ 672, 168 ], "偶": [ 680, 168 ], "寓": [ 688, 168 ], "遇": [ 696, 168 ], "隅": [ 704, 168 ], "串": [ 712, 168 ], "櫛": [ 720, 168 ], "釧": [ 728, 168 ], "屑": [ 736, 168 ], "屈": [ 744, 168 ], "掘": [ 0, 176 ], "窟": [ 8, 176 ], "沓": [ 16, 176 ], "靴": [ 24, 176 ], "轡": [ 32, 176 ], "窪": [ 40, 176 ], "熊": [ 48, 176 ], "隈": [ 56, 176 ], "粂": [ 64, 176 ], "栗": [ 72, 176 ], "繰": [ 80, 176 ], "桑": [ 88, 176 ], "鍬": [ 96, 176 ], "勲": [ 104, 176 ], "君": [ 112, 176 ], "薫": [ 120, 176 ], "訓": [ 128, 176 ], "群": [ 136, 176 ], "軍": [ 144, 176 ], "郡": [ 152, 176 ], "卦": [ 160, 176 ], "袈": [ 168, 176 ], "祁": [ 176, 176 ], "係": [ 184, 176 ], "傾": [ 192, 176 ], "刑": [ 200, 176 ], "兄": [ 208, 176 ], "啓": [ 216, 176 ], "圭": [ 224, 176 ], "珪": [ 232, 176 ], "型": [ 240, 176 ], "契": [ 248, 176 ], "形": [ 256, 176 ], "径": [ 264, 176 ], "恵": [ 272, 176 ], "慶": [ 280, 176 ], "慧": [ 288, 176 ], "憩": [ 296, 176 ], "掲": [ 304, 176 ], "携": [ 312, 176 ], "敬": [ 320, 176 ], "景": [ 328, 176 ], "桂": [ 336, 176 ], "渓": [ 344, 176 ], "畦": [ 352, 176 ], "稽": [ 360, 176 ], "系": [ 368, 176 ], "経": [ 376, 176 ], "継": [ 384, 176 ], "繋": [ 392, 176 ], "罫": [ 400, 176 ], "茎": [ 408, 176 ], "荊": [ 416, 176 ], "蛍": [ 424, 176 ], "計": [ 432, 176 ], "詣": [ 440, 176 ], "警": [ 448, 176 ], "軽": [ 456, 176 ], "頚": [ 464, 176 ], "鶏": [ 472, 176 ], "芸": [ 480, 176 ], "迎": [ 488, 176 ], "鯨": [ 496, 176 ], "劇": [ 504, 176 ], "戟": [ 512, 176 ], "撃": [ 520, 176 ], "激": [ 528, 176 ], "隙": [ 536, 176 ], "桁": [ 544, 176 ], "傑": [ 552, 176 ], "欠": [ 560, 176 ], "決": [ 568, 176 ], "潔": [ 576, 176 ], "穴": [ 584, 176 ], "結": [ 592, 176 ], "血": [ 600, 176 ], "訣": [ 608, 176 ], "月": [ 616, 176 ], "件": [ 624, 176 ], "倹": [ 632, 176 ], "倦": [ 640, 176 ], "健": [ 648, 176 ], "兼": [ 656, 176 ], "券": [ 664, 176 ], "剣": [ 672, 176 ], "喧": [ 680, 176 ], "圏": [ 688, 176 ], "堅": [ 696, 176 ], "嫌": [ 704, 176 ], "建": [ 712, 176 ], "憲": [ 720, 176 ], "懸": [ 728, 176 ], "拳": [ 736, 176 ], "捲": [ 744, 176 ], "検": [ 0, 184 ], "権": [ 8, 184 ], "牽": [ 16, 184 ], "犬": [ 24, 184 ], "献": [ 32, 184 ], "研": [ 40, 184 ], "硯": [ 48, 184 ], "絹": [ 56, 184 ], "県": [ 64, 184 ], "肩": [ 72, 184 ], "見": [ 80, 184 ], "謙": [ 88, 184 ], "賢": [ 96, 184 ], "軒": [ 104, 184 ], "遣": [ 112, 184 ], "鍵": [ 120, 184 ], "険": [ 128, 184 ], "顕": [ 136, 184 ], "験": [ 144, 184 ], "鹸": [ 152, 184 ], "元": [ 160, 184 ], "原": [ 168, 184 ], "厳": [ 176, 184 ], "幻": [ 184, 184 ], "弦": [ 192, 184 ], "減": [ 200, 184 ], "源": [ 208, 184 ], "玄": [ 216, 184 ], "現": [ 224, 184 ], "絃": [ 232, 184 ], "舷": [ 240, 184 ], "言": [ 248, 184 ], "諺": [ 256, 184 ], "限": [ 264, 184 ], "乎": [ 272, 184 ], "個": [ 280, 184 ], "古": [ 288, 184 ], "呼": [ 296, 184 ], "固": [ 304, 184 ], "姑": [ 312, 184 ], "孤": [ 320, 184 ], "己": [ 328, 184 ], "庫": [ 336, 184 ], "弧": [ 344, 184 ], "戸": [ 352, 184 ], "故": [ 360, 184 ], "枯": [ 368, 184 ], "湖": [ 376, 184 ], "狐": [ 384, 184 ], "糊": [ 392, 184 ], "袴": [ 400, 184 ], "股": [ 408, 184 ], "胡": [ 416, 184 ], "菰": [ 424, 184 ], "虎": [ 432, 184 ], "誇": [ 440, 184 ], "跨": [ 448, 184 ], "鈷": [ 456, 184 ], "雇": [ 464, 184 ], "顧": [ 472, 184 ], "鼓": [ 480, 184 ], "五": [ 488, 184 ], "互": [ 496, 184 ], "伍": [ 504, 184 ], "午": [ 512, 184 ], "呉": [ 520, 184 ], "吾": [ 528, 184 ], "娯": [ 536, 184 ], "後": [ 544, 184 ], "御": [ 552, 184 ], "悟": [ 560, 184 ], "梧": [ 568, 184 ], "檎": [ 576, 184 ], "瑚": [ 584, 184 ], "碁": [ 592, 184 ], "語": [ 600, 184 ], "誤": [ 608, 184 ], "護": [ 616, 184 ], "醐": [ 624, 184 ], "乞": [ 632, 184 ], "鯉": [ 640, 184 ], "交": [ 648, 184 ], "佼": [ 656, 184 ], "侯": [ 664, 184 ], "候": [ 672, 184 ], "倖": [ 680, 184 ], "光": [ 688, 184 ], "公": [ 696, 184 ], "功": [ 704, 184 ], "効": [ 712, 184 ], "勾": [ 720, 184 ], "厚": [ 728, 184 ], "口": [ 736, 184 ], "向": [ 744, 184 ], "后": [ 0, 192 ], "喉": [ 8, 192 ], "坑": [ 16, 192 ], "垢": [ 24, 192 ], "好": [ 32, 192 ], "孔": [ 40, 192 ], "孝": [ 48, 192 ], "宏": [ 56, 192 ], "工": [ 64, 192 ], "巧": [ 72, 192 ], "巷": [ 80, 192 ], "幸": [ 88, 192 ], "広": [ 96, 192 ], "庚": [ 104, 192 ], "康": [ 112, 192 ], "弘": [ 120, 192 ], "恒": [ 128, 192 ], "慌": [ 136, 192 ], "抗": [ 144, 192 ], "拘": [ 152, 192 ], "控": [ 160, 192 ], "攻": [ 168, 192 ], "昂": [ 176, 192 ], "晃": [ 184, 192 ], "更": [ 192, 192 ], "杭": [ 200, 192 ], "校": [ 208, 192 ], "梗": [ 216, 192 ], "構": [ 224, 192 ], "江": [ 232, 192 ], "洪": [ 240, 192 ], "浩": [ 248, 192 ], "港": [ 256, 192 ], "溝": [ 264, 192 ], "甲": [ 272, 192 ], "皇": [ 280, 192 ], "硬": [ 288, 192 ], "稿": [ 296, 192 ], "糠": [ 304, 192 ], "紅": [ 312, 192 ], "紘": [ 320, 192 ], "絞": [ 328, 192 ], "綱": [ 336, 192 ], "耕": [ 344, 192 ], "考": [ 352, 192 ], "肯": [ 360, 192 ], "肱": [ 368, 192 ], "腔": [ 376, 192 ], "膏": [ 384, 192 ], "航": [ 392, 192 ], "荒": [ 400, 192 ], "行": [ 408, 192 ], "衡": [ 416, 192 ], "講": [ 424, 192 ], "貢": [ 432, 192 ], "購": [ 440, 192 ], "郊": [ 448, 192 ], "酵": [ 456, 192 ], "鉱": [ 464, 192 ], "砿": [ 472, 192 ], "鋼": [ 480, 192 ], "閤": [ 488, 192 ], "降": [ 496, 192 ], "項": [ 504, 192 ], "香": [ 512, 192 ], "高": [ 520, 192 ], "鴻": [ 528, 192 ], "剛": [ 536, 192 ], "劫": [ 544, 192 ], "号": [ 552, 192 ], "合": [ 560, 192 ], "壕": [ 568, 192 ], "拷": [ 576, 192 ], "濠": [ 584, 192 ], "豪": [ 592, 192 ], "轟": [ 600, 192 ], "麹": [ 608, 192 ], "克": [ 616, 192 ], "刻": [ 624, 192 ], "告": [ 632, 192 ], "国": [ 640, 192 ], "穀": [ 648, 192 ], "酷": [ 656, 192 ], "鵠": [ 664, 192 ], "黒": [ 672, 192 ], "獄": [ 680, 192 ], "漉": [ 688, 192 ], "腰": [ 696, 192 ], "甑": [ 704, 192 ], "忽": [ 712, 192 ], "惚": [ 720, 192 ], "骨": [ 728, 192 ], "狛": [ 736, 192 ], "込": [ 744, 192 ], "此": [ 0, 200 ], "頃": [ 8, 200 ], "今": [ 16, 200 ], "困": [ 24, 200 ], "坤": [ 32, 200 ], "墾": [ 40, 200 ], "婚": [ 48, 200 ], "恨": [ 56, 200 ], "懇": [ 64, 200 ], "昏": [ 72, 200 ], "昆": [ 80, 200 ], "根": [ 88, 200 ], "梱": [ 96, 200 ], "混": [ 104, 200 ], "痕": [ 112, 200 ], "紺": [ 120, 200 ], "艮": [ 128, 200 ], "魂": [ 136, 200 ], "些": [ 144, 200 ], "佐": [ 152, 200 ], "叉": [ 160, 200 ], "唆": [ 168, 200 ], "嵯": [ 176, 200 ], "左": [ 184, 200 ], "差": [ 192, 200 ], "査": [ 200, 200 ], "沙": [ 208, 200 ], "瑳": [ 216, 200 ], "砂": [ 224, 200 ], "詐": [ 232, 200 ], "鎖": [ 240, 200 ], "裟": [ 248, 200 ], "坐": [ 256, 200 ], "座": [ 264, 200 ], "挫": [ 272, 200 ], "債": [ 280, 200 ], "催": [ 288, 200 ], "再": [ 296, 200 ], "最": [ 304, 200 ], "哉": [ 312, 200 ], "塞": [ 320, 200 ], "妻": [ 328, 200 ], "宰": [ 336, 200 ], "彩": [ 344, 200 ], "才": [ 352, 200 ], "採": [ 360, 200 ], "栽": [ 368, 200 ], "歳": [ 376, 200 ], "済": [ 384, 200 ], "災": [ 392, 200 ], "采": [ 400, 200 ], "犀": [ 408, 200 ], "砕": [ 416, 200 ], "砦": [ 424, 200 ], "祭": [ 432, 200 ], "斎": [ 440, 200 ], "細": [ 448, 200 ], "菜": [ 456, 200 ], "裁": [ 464, 200 ], "載": [ 472, 200 ], "際": [ 480, 200 ], "剤": [ 488, 200 ], "在": [ 496, 200 ], "材": [ 504, 200 ], "罪": [ 512, 200 ], "財": [ 520, 200 ], "冴": [ 528, 200 ], "坂": [ 536, 200 ], "阪": [ 544, 200 ], "堺": [ 552, 200 ], "榊": [ 560, 200 ], "肴": [ 568, 200 ], "咲": [ 576, 200 ], "崎": [ 584, 200 ], "埼": [ 592, 200 ], "碕": [ 600, 200 ], "鷺": [ 608, 200 ], "作": [ 616, 200 ], "削": [ 624, 200 ], "咋": [ 632, 200 ], "搾": [ 640, 200 ], "昨": [ 648, 200 ], "朔": [ 656, 200 ], "柵": [ 664, 200 ], "窄": [ 672, 200 ], "策": [ 680, 200 ], "索": [ 688, 200 ], "錯": [ 696, 200 ], "桜": [ 704, 200 ], "鮭": [ 712, 200 ], "笹": [ 720, 200 ], "匙": [ 728, 200 ], "冊": [ 736, 200 ], "刷": [ 744, 200 ], "察": [ 0, 208 ], "拶": [ 8, 208 ], "撮": [ 16, 208 ], "擦": [ 24, 208 ], "札": [ 32, 208 ], "殺": [ 40, 208 ], "薩": [ 48, 208 ], "雑": [ 56, 208 ], "皐": [ 64, 208 ], "鯖": [ 72, 208 ], "捌": [ 80, 208 ], "錆": [ 88, 208 ], "鮫": [ 96, 208 ], "皿": [ 104, 208 ], "晒": [ 112, 208 ], "三": [ 120, 208 ], "傘": [ 128, 208 ], "参": [ 136, 208 ], "山": [ 144, 208 ], "惨": [ 152, 208 ], "撒": [ 160, 208 ], "散": [ 168, 208 ], "桟": [ 176, 208 ], "燦": [ 184, 208 ], "珊": [ 192, 208 ], "産": [ 200, 208 ], "算": [ 208, 208 ], "纂": [ 216, 208 ], "蚕": [ 224, 208 ], "讃": [ 232, 208 ], "賛": [ 240, 208 ], "酸": [ 248, 208 ], "餐": [ 256, 208 ], "斬": [ 264, 208 ], "暫": [ 272, 208 ], "残": [ 280, 208 ], "仕": [ 288, 208 ], "仔": [ 296, 208 ], "伺": [ 304, 208 ], "使": [ 312, 208 ], "刺": [ 320, 208 ], "司": [ 328, 208 ], "史": [ 336, 208 ], "嗣": [ 344, 208 ], "四": [ 352, 208 ], "士": [ 360, 208 ], "始": [ 368, 208 ], "姉": [ 376, 208 ], "姿": [ 384, 208 ], "子": [ 392, 208 ], "屍": [ 400, 208 ], "市": [ 408, 208 ], "師": [ 416, 208 ], "志": [ 424, 208 ], "思": [ 432, 208 ], "指": [ 440, 208 ], "支": [ 448, 208 ], "孜": [ 456, 208 ], "斯": [ 464, 208 ], "施": [ 472, 208 ], "旨": [ 480, 208 ], "枝": [ 488, 208 ], "止": [ 496, 208 ], "死": [ 504, 208 ], "氏": [ 512, 208 ], "獅": [ 520, 208 ], "祉": [ 528, 208 ], "私": [ 536, 208 ], "糸": [ 544, 208 ], "紙": [ 552, 208 ], "紫": [ 560, 208 ], "肢": [ 568, 208 ], "脂": [ 576, 208 ], "至": [ 584, 208 ], "視": [ 592, 208 ], "詞": [ 600, 208 ], "詩": [ 608, 208 ], "試": [ 616, 208 ], "誌": [ 624, 208 ], "諮": [ 632, 208 ], "資": [ 640, 208 ], "賜": [ 648, 208 ], "雌": [ 656, 208 ], "飼": [ 664, 208 ], "歯": [ 672, 208 ], "事": [ 680, 208 ], "似": [ 688, 208 ], "侍": [ 696, 208 ], "児": [ 704, 208 ], "字": [ 712, 208 ], "寺": [ 720, 208 ], "慈": [ 728, 208 ], "持": [ 736, 208 ], "時": [ 744, 208 ], "次": [ 0, 216 ], "滋": [ 8, 216 ], "治": [ 16, 216 ], "爾": [ 24, 216 ], "璽": [ 32, 216 ], "痔": [ 40, 216 ], "磁": [ 48, 216 ], "示": [ 56, 216 ], "而": [ 64, 216 ], "耳": [ 72, 216 ], "自": [ 80, 216 ], "蒔": [ 88, 216 ], "辞": [ 96, 216 ], "汐": [ 104, 216 ], "鹿": [ 112, 216 ], "式": [ 120, 216 ], "識": [ 128, 216 ], "鴫": [ 136, 216 ], "竺": [ 144, 216 ], "軸": [ 152, 216 ], "宍": [ 160, 216 ], "雫": [ 168, 216 ], "七": [ 176, 216 ], "叱": [ 184, 216 ], "執": [ 192, 216 ], "失": [ 200, 216 ], "嫉": [ 208, 216 ], "室": [ 216, 216 ], "悉": [ 224, 216 ], "湿": [ 232, 216 ], "漆": [ 240, 216 ], "疾": [ 248, 216 ], "質": [ 256, 216 ], "実": [ 264, 216 ], "蔀": [ 272, 216 ], "篠": [ 280, 216 ], "偲": [ 288, 216 ], "柴": [ 296, 216 ], "芝": [ 304, 216 ], "屡": [ 312, 216 ], "蕊": [ 320, 216 ], "縞": [ 328, 216 ], "舎": [ 336, 216 ], "写": [ 344, 216 ], "射": [ 352, 216 ], "捨": [ 360, 216 ], "赦": [ 368, 216 ], "斜": [ 376, 216 ], "煮": [ 384, 216 ], "社": [ 392, 216 ], "紗": [ 400, 216 ], "者": [ 408, 216 ], "謝": [ 416, 216 ], "車": [ 424, 216 ], "遮": [ 432, 216 ], "蛇": [ 440, 216 ], "邪": [ 448, 216 ], "借": [ 456, 216 ], "勺": [ 464, 216 ], "尺": [ 472, 216 ], "杓": [ 480, 216 ], "灼": [ 488, 216 ], "爵": [ 496, 216 ], "酌": [ 504, 216 ], "釈": [ 512, 216 ], "錫": [ 520, 216 ], "若": [ 528, 216 ], "寂": [ 536, 216 ], "弱": [ 544, 216 ], "惹": [ 552, 216 ], "主": [ 560, 216 ], "取": [ 568, 216 ], "守": [ 576, 216 ], "手": [ 584, 216 ], "朱": [ 592, 216 ], "殊": [ 600, 216 ], "狩": [ 608, 216 ], "珠": [ 616, 216 ], "種": [ 624, 216 ], "腫": [ 632, 216 ], "趣": [ 640, 216 ], "酒": [ 648, 216 ], "首": [ 656, 216 ], "儒": [ 664, 216 ], "受": [ 672, 216 ], "呪": [ 680, 216 ], "寿": [ 688, 216 ], "授": [ 696, 216 ], "樹": [ 704, 216 ], "綬": [ 712, 216 ], "需": [ 720, 216 ], "囚": [ 728, 216 ], "収": [ 736, 216 ], "周": [ 744, 216 ], "宗": [ 0, 224 ], "就": [ 8, 224 ], "州": [ 16, 224 ], "修": [ 24, 224 ], "愁": [ 32, 224 ], "拾": [ 40, 224 ], "洲": [ 48, 224 ], "秀": [ 56, 224 ], "秋": [ 64, 224 ], "終": [ 72, 224 ], "繍": [ 80, 224 ], "習": [ 88, 224 ], "臭": [ 96, 224 ], "舟": [ 104, 224 ], "蒐": [ 112, 224 ], "衆": [ 120, 224 ], "襲": [ 128, 224 ], "讐": [ 136, 224 ], "蹴": [ 144, 224 ], "輯": [ 152, 224 ], "週": [ 160, 224 ], "酋": [ 168, 224 ], "酬": [ 176, 224 ], "集": [ 184, 224 ], "醜": [ 192, 224 ], "什": [ 200, 224 ], "住": [ 208, 224 ], "充": [ 216, 224 ], "十": [ 224, 224 ], "従": [ 232, 224 ], "戎": [ 240, 224 ], "柔": [ 248, 224 ], "汁": [ 256, 224 ], "渋": [ 264, 224 ], "獣": [ 272, 224 ], "縦": [ 280, 224 ], "重": [ 288, 224 ], "銃": [ 296, 224 ], "叔": [ 304, 224 ], "夙": [ 312, 224 ], "宿": [ 320, 224 ], "淑": [ 328, 224 ], "祝": [ 336, 224 ], "縮": [ 344, 224 ], "粛": [ 352, 224 ], "塾": [ 360, 224 ], "熟": [ 368, 224 ], "出": [ 376, 224 ], "術": [ 384, 224 ], "述": [ 392, 224 ], "俊": [ 400, 224 ], "峻": [ 408, 224 ], "春": [ 416, 224 ], "瞬": [ 424, 224 ], "竣": [ 432, 224 ], "舜": [ 440, 224 ], "駿": [ 448, 224 ], "准": [ 456, 224 ], "循": [ 464, 224 ], "旬": [ 472, 224 ], "楯": [ 480, 224 ], "殉": [ 488, 224 ], "淳": [ 496, 224 ], "準": [ 504, 224 ], "潤": [ 512, 224 ], "盾": [ 520, 224 ], "純": [ 528, 224 ], "巡": [ 536, 224 ], "遵": [ 544, 224 ], "醇": [ 552, 224 ], "順": [ 560, 224 ], "処": [ 568, 224 ], "初": [ 576, 224 ], "所": [ 584, 224 ], "暑": [ 592, 224 ], "曙": [ 600, 224 ], "渚": [ 608, 224 ], "庶": [ 616, 224 ], "緒": [ 624, 224 ], "署": [ 632, 224 ], "書": [ 640, 224 ], "薯": [ 648, 224 ], "藷": [ 656, 224 ], "諸": [ 664, 224 ], "助": [ 672, 224 ], "叙": [ 680, 224 ], "女": [ 688, 224 ], "序": [ 696, 224 ], "徐": [ 704, 224 ], "恕": [ 712, 224 ], "鋤": [ 720, 224 ], "除": [ 728, 224 ], "傷": [ 736, 224 ], "償": [ 744, 224 ], "勝": [ 0, 232 ], "匠": [ 8, 232 ], "升": [ 16, 232 ], "召": [ 24, 232 ], "哨": [ 32, 232 ], "商": [ 40, 232 ], "唱": [ 48, 232 ], "嘗": [ 56, 232 ], "奨": [ 64, 232 ], "妾": [ 72, 232 ], "娼": [ 80, 232 ], "宵": [ 88, 232 ], "将": [ 96, 232 ], "小": [ 104, 232 ], "少": [ 112, 232 ], "尚": [ 120, 232 ], "庄": [ 128, 232 ], "床": [ 136, 232 ], "廠": [ 144, 232 ], "彰": [ 152, 232 ], "承": [ 160, 232 ], "抄": [ 168, 232 ], "招": [ 176, 232 ], "掌": [ 184, 232 ], "捷": [ 192, 232 ], "昇": [ 200, 232 ], "昌": [ 208, 232 ], "昭": [ 216, 232 ], "晶": [ 224, 232 ], "松": [ 232, 232 ], "梢": [ 240, 232 ], "樟": [ 248, 232 ], "樵": [ 256, 232 ], "沼": [ 264, 232 ], "消": [ 272, 232 ], "渉": [ 280, 232 ], "湘": [ 288, 232 ], "焼": [ 296, 232 ], "焦": [ 304, 232 ], "照": [ 312, 232 ], "症": [ 320, 232 ], "省": [ 328, 232 ], "硝": [ 336, 232 ], "礁": [ 344, 232 ], "祥": [ 352, 232 ], "称": [ 360, 232 ], "章": [ 368, 232 ], "笑": [ 376, 232 ], "粧": [ 384, 232 ], "紹": [ 392, 232 ], "肖": [ 400, 232 ], "菖": [ 408, 232 ], "蒋": [ 416, 232 ], "蕉": [ 424, 232 ], "衝": [ 432, 232 ], "裳": [ 440, 232 ], "訟": [ 448, 232 ], "証": [ 456, 232 ], "詔": [ 464, 232 ], "詳": [ 472, 232 ], "象": [ 480, 232 ], "賞": [ 488, 232 ], "醤": [ 496, 232 ], "鉦": [ 504, 232 ], "鍾": [ 512, 232 ], "鐘": [ 520, 232 ], "障": [ 528, 232 ], "鞘": [ 536, 232 ], "上": [ 544, 232 ], "丈": [ 552, 232 ], "丞": [ 560, 232 ], "乗": [ 568, 232 ], "冗": [ 576, 232 ], "剰": [ 584, 232 ], "城": [ 592, 232 ], "場": [ 600, 232 ], "壌": [ 608, 232 ], "嬢": [ 616, 232 ], "常": [ 624, 232 ], "情": [ 632, 232 ], "擾": [ 640, 232 ], "条": [ 648, 232 ], "杖": [ 656, 232 ], "浄": [ 664, 232 ], "状": [ 672, 232 ], "畳": [ 680, 232 ], "穣": [ 688, 232 ], "蒸": [ 696, 232 ], "譲": [ 704, 232 ], "醸": [ 712, 232 ], "錠": [ 720, 232 ], "嘱": [ 728, 232 ], "埴": [ 736, 232 ], "飾": [ 744, 232 ], "拭": [ 0, 240 ], "植": [ 8, 240 ], "殖": [ 16, 240 ], "燭": [ 24, 240 ], "織": [ 32, 240 ], "職": [ 40, 240 ], "色": [ 48, 240 ], "触": [ 56, 240 ], "食": [ 64, 240 ], "蝕": [ 72, 240 ], "辱": [ 80, 240 ], "尻": [ 88, 240 ], "伸": [ 96, 240 ], "信": [ 104, 240 ], "侵": [ 112, 240 ], "唇": [ 120, 240 ], "娠": [ 128, 240 ], "寝": [ 136, 240 ], "審": [ 144, 240 ], "心": [ 152, 240 ], "慎": [ 160, 240 ], "振": [ 168, 240 ], "新": [ 176, 240 ], "晋": [ 184, 240 ], "森": [ 192, 240 ], "榛": [ 200, 240 ], "浸": [ 208, 240 ], "深": [ 216, 240 ], "申": [ 224, 240 ], "疹": [ 232, 240 ], "真": [ 240, 240 ], "神": [ 248, 240 ], "秦": [ 256, 240 ], "紳": [ 264, 240 ], "臣": [ 272, 240 ], "芯": [ 280, 240 ], "薪": [ 288, 240 ], "親": [ 296, 240 ], "診": [ 304, 240 ], "身": [ 312, 240 ], "辛": [ 320, 240 ], "進": [ 328, 240 ], "針": [ 336, 240 ], "震": [ 344, 240 ], "人": [ 352, 240 ], "仁": [ 360, 240 ], "刃": [ 368, 240 ], "塵": [ 376, 240 ], "壬": [ 384, 240 ], "尋": [ 392, 240 ], "甚": [ 400, 240 ], "尽": [ 408, 240 ], "腎": [ 416, 240 ], "訊": [ 424, 240 ], "迅": [ 432, 240 ], "陣": [ 440, 240 ], "靭": [ 448, 240 ], "笥": [ 456, 240 ], "諏": [ 464, 240 ], "須": [ 472, 240 ], "酢": [ 480, 240 ], "図": [ 488, 240 ], "厨": [ 496, 240 ], "逗": [ 504, 240 ], "吹": [ 512, 240 ], "垂": [ 520, 240 ], "帥": [ 528, 240 ], "推": [ 536, 240 ], "水": [ 544, 240 ], "炊": [ 552, 240 ], "睡": [ 560, 240 ], "粋": [ 568, 240 ], "翠": [ 576, 240 ], "衰": [ 584, 240 ], "遂": [ 592, 240 ], "酔": [ 600, 240 ], "錐": [ 608, 240 ], "錘": [ 616, 240 ], "随": [ 624, 240 ], "瑞": [ 632, 240 ], "髄": [ 640, 240 ], "崇": [ 648, 240 ], "嵩": [ 656, 240 ], "数": [ 664, 240 ], "枢": [ 672, 240 ], "趨": [ 680, 240 ], "雛": [ 688, 240 ], "据": [ 696, 240 ], "杉": [ 704, 240 ], "椙": [ 712, 240 ], "菅": [ 720, 240 ], "頗": [ 728, 240 ], "雀": [ 736, 240 ], "裾": [ 744, 240 ], "澄": [ 0, 248 ], "摺": [ 8, 248 ], "寸": [ 16, 248 ], "世": [ 24, 248 ], "瀬": [ 32, 248 ], "畝": [ 40, 248 ], "是": [ 48, 248 ], "凄": [ 56, 248 ], "制": [ 64, 248 ], "勢": [ 72, 248 ], "姓": [ 80, 248 ], "征": [ 88, 248 ], "性": [ 96, 248 ], "成": [ 104, 248 ], "政": [ 112, 248 ], "整": [ 120, 248 ], "星": [ 128, 248 ], "晴": [ 136, 248 ], "棲": [ 144, 248 ], "栖": [ 152, 248 ], "正": [ 160, 248 ], "清": [ 168, 248 ], "牲": [ 176, 248 ], "生": [ 184, 248 ], "盛": [ 192, 248 ], "精": [ 200, 248 ], "聖": [ 208, 248 ], "声": [ 216, 248 ], "製": [ 224, 248 ], "西": [ 232, 248 ], "誠": [ 240, 248 ], "誓": [ 248, 248 ], "請": [ 256, 248 ], "逝": [ 264, 248 ], "醒": [ 272, 248 ], "青": [ 280, 248 ], "静": [ 288, 248 ], "斉": [ 296, 248 ], "税": [ 304, 248 ], "脆": [ 312, 248 ], "隻": [ 320, 248 ], "席": [ 328, 248 ], "惜": [ 336, 248 ], "戚": [ 344, 248 ], "斥": [ 352, 248 ], "昔": [ 360, 248 ], "析": [ 368, 248 ], "石": [ 376, 248 ], "積": [ 384, 248 ], "籍": [ 392, 248 ], "績": [ 400, 248 ], "脊": [ 408, 248 ], "責": [ 416, 248 ], "赤": [ 424, 248 ], "跡": [ 432, 248 ], "蹟": [ 440, 248 ], "碩": [ 448, 248 ], "切": [ 456, 248 ], "拙": [ 464, 248 ], "接": [ 472, 248 ], "摂": [ 480, 248 ], "折": [ 488, 248 ], "設": [ 496, 248 ], "窃": [ 504, 248 ], "節": [ 512, 248 ], "説": [ 520, 248 ], "雪": [ 528, 248 ], "絶": [ 536, 248 ], "舌": [ 544, 248 ], "蝉": [ 552, 248 ], "仙": [ 560, 248 ], "先": [ 568, 248 ], "千": [ 576, 248 ], "占": [ 584, 248 ], "宣": [ 592, 248 ], "専": [ 600, 248 ], "尖": [ 608, 248 ], "川": [ 616, 248 ], "戦": [ 624, 248 ], "扇": [ 632, 248 ], "撰": [ 640, 248 ], "栓": [ 648, 248 ], "栴": [ 656, 248 ], "泉": [ 664, 248 ], "浅": [ 672, 248 ], "洗": [ 680, 248 ], "染": [ 688, 248 ], "潜": [ 696, 248 ], "煎": [ 704, 248 ], "煽": [ 712, 248 ], "旋": [ 720, 248 ], "穿": [ 728, 248 ], "箭": [ 736, 248 ], "線": [ 744, 248 ], "繊": [ 0, 256 ], "羨": [ 8, 256 ], "腺": [ 16, 256 ], "舛": [ 24, 256 ], "船": [ 32, 256 ], "薦": [ 40, 256 ], "詮": [ 48, 256 ], "賎": [ 56, 256 ], "践": [ 64, 256 ], "選": [ 72, 256 ], "遷": [ 80, 256 ], "銭": [ 88, 256 ], "銑": [ 96, 256 ], "閃": [ 104, 256 ], "鮮": [ 112, 256 ], "前": [ 120, 256 ], "善": [ 128, 256 ], "漸": [ 136, 256 ], "然": [ 144, 256 ], "全": [ 152, 256 ], "禅": [ 160, 256 ], "繕": [ 168, 256 ], "膳": [ 176, 256 ], "糎": [ 184, 256 ], "噌": [ 192, 256 ], "塑": [ 200, 256 ], "岨": [ 208, 256 ], "措": [ 216, 256 ], "曾": [ 224, 256 ], "曽": [ 232, 256 ], "楚": [ 240, 256 ], "狙": [ 248, 256 ], "疏": [ 256, 256 ], "疎": [ 264, 256 ], "礎": [ 272, 256 ], "祖": [ 280, 256 ], "租": [ 288, 256 ], "粗": [ 296, 256 ], "素": [ 304, 256 ], "組": [ 312, 256 ], "蘇": [ 320, 256 ], "訴": [ 328, 256 ], "阻": [ 336, 256 ], "遡": [ 344, 256 ], "鼠": [ 352, 256 ], "僧": [ 360, 256 ], "創": [ 368, 256 ], "双": [ 376, 256 ], "叢": [ 384, 256 ], "倉": [ 392, 256 ], "喪": [ 400, 256 ], "壮": [ 408, 256 ], "奏": [ 416, 256 ], "爽": [ 424, 256 ], "宋": [ 432, 256 ], "層": [ 440, 256 ], "匝": [ 448, 256 ], "惣": [ 456, 256 ], "想": [ 464, 256 ], "捜": [ 472, 256 ], "掃": [ 480, 256 ], "挿": [ 488, 256 ], "掻": [ 496, 256 ], "操": [ 504, 256 ], "早": [ 512, 256 ], "曹": [ 520, 256 ], "巣": [ 528, 256 ], "槍": [ 536, 256 ], "槽": [ 544, 256 ], "漕": [ 552, 256 ], "燥": [ 560, 256 ], "争": [ 568, 256 ], "痩": [ 576, 256 ], "相": [ 584, 256 ], "窓": [ 592, 256 ], "糟": [ 600, 256 ], "総": [ 608, 256 ], "綜": [ 616, 256 ], "聡": [ 624, 256 ], "草": [ 632, 256 ], "荘": [ 640, 256 ], "葬": [ 648, 256 ], "蒼": [ 656, 256 ], "藻": [ 664, 256 ], "装": [ 672, 256 ], "走": [ 680, 256 ], "送": [ 688, 256 ], "遭": [ 696, 256 ], "鎗": [ 704, 256 ], "霜": [ 712, 256 ], "騒": [ 720, 256 ], "像": [ 728, 256 ], "増": [ 736, 256 ], "憎": [ 744, 256 ], "臓": [ 0, 264 ], "蔵": [ 8, 264 ], "贈": [ 16, 264 ], "造": [ 24, 264 ], "促": [ 32, 264 ], "側": [ 40, 264 ], "則": [ 48, 264 ], "即": [ 56, 264 ], "息": [ 64, 264 ], "捉": [ 72, 264 ], "束": [ 80, 264 ], "測": [ 88, 264 ], "足": [ 96, 264 ], "速": [ 104, 264 ], "俗": [ 112, 264 ], "属": [ 120, 264 ], "賊": [ 128, 264 ], "族": [ 136, 264 ], "続": [ 144, 264 ], "卒": [ 152, 264 ], "袖": [ 160, 264 ], "其": [ 168, 264 ], "揃": [ 176, 264 ], "存": [ 184, 264 ], "孫": [ 192, 264 ], "尊": [ 200, 264 ], "損": [ 208, 264 ], "村": [ 216, 264 ], "遜": [ 224, 264 ], "他": [ 232, 264 ], "多": [ 240, 264 ], "太": [ 248, 264 ], "汰": [ 256, 264 ], "詑": [ 264, 264 ], "唾": [ 272, 264 ], "堕": [ 280, 264 ], "妥": [ 288, 264 ], "惰": [ 296, 264 ], "打": [ 304, 264 ], "柁": [ 312, 264 ], "舵": [ 320, 264 ], "楕": [ 328, 264 ], "陀": [ 336, 264 ], "駄": [ 344, 264 ], "騨": [ 352, 264 ], "体": [ 360, 264 ], "堆": [ 368, 264 ], "対": [ 376, 264 ], "耐": [ 384, 264 ], "岱": [ 392, 264 ], "帯": [ 400, 264 ], "待": [ 408, 264 ], "怠": [ 416, 264 ], "態": [ 424, 264 ], "戴": [ 432, 264 ], "替": [ 440, 264 ], "泰": [ 448, 264 ], "滞": [ 456, 264 ], "胎": [ 464, 264 ], "腿": [ 472, 264 ], "苔": [ 480, 264 ], "袋": [ 488, 264 ], "貸": [ 496, 264 ], "退": [ 504, 264 ], "逮": [ 512, 264 ], "隊": [ 520, 264 ], "黛": [ 528, 264 ], "鯛": [ 536, 264 ], "代": [ 544, 264 ], "台": [ 552, 264 ], "大": [ 560, 264 ], "第": [ 568, 264 ], "醍": [ 576, 264 ], "題": [ 584, 264 ], "鷹": [ 592, 264 ], "滝": [ 600, 264 ], "瀧": [ 608, 264 ], "卓": [ 616, 264 ], "啄": [ 624, 264 ], "宅": [ 632, 264 ], "托": [ 640, 264 ], "択": [ 648, 264 ], "拓": [ 656, 264 ], "沢": [ 664, 264 ], "濯": [ 672, 264 ], "琢": [ 680, 264 ], "託": [ 688, 264 ], "鐸": [ 696, 264 ], "濁": [ 704, 264 ], "諾": [ 712, 264 ], "茸": [ 720, 264 ], "凧": [ 728, 264 ], "蛸": [ 736, 264 ], "只": [ 744, 264 ], "叩": [ 0, 272 ], "但": [ 8, 272 ], "達": [ 16, 272 ], "辰": [ 24, 272 ], "奪": [ 32, 272 ], "脱": [ 40, 272 ], "巽": [ 48, 272 ], "竪": [ 56, 272 ], "辿": [ 64, 272 ], "棚": [ 72, 272 ], "谷": [ 80, 272 ], "狸": [ 88, 272 ], "鱈": [ 96, 272 ], "樽": [ 104, 272 ], "誰": [ 112, 272 ], "丹": [ 120, 272 ], "単": [ 128, 272 ], "嘆": [ 136, 272 ], "坦": [ 144, 272 ], "担": [ 152, 272 ], "探": [ 160, 272 ], "旦": [ 168, 272 ], "歎": [ 176, 272 ], "淡": [ 184, 272 ], "湛": [ 192, 272 ], "炭": [ 200, 272 ], "短": [ 208, 272 ], "端": [ 216, 272 ], "箪": [ 224, 272 ], "綻": [ 232, 272 ], "耽": [ 240, 272 ], "胆": [ 248, 272 ], "蛋": [ 256, 272 ], "誕": [ 264, 272 ], "鍛": [ 272, 272 ], "団": [ 280, 272 ], "壇": [ 288, 272 ], "弾": [ 296, 272 ], "断": [ 304, 272 ], "暖": [ 312, 272 ], "檀": [ 320, 272 ], "段": [ 328, 272 ], "男": [ 336, 272 ], "談": [ 344, 272 ], "値": [ 352, 272 ], "知": [ 360, 272 ], "地": [ 368, 272 ], "弛": [ 376, 272 ], "恥": [ 384, 272 ], "智": [ 392, 272 ], "池": [ 400, 272 ], "痴": [ 408, 272 ], "稚": [ 416, 272 ], "置": [ 424, 272 ], "致": [ 432, 272 ], "蜘": [ 440, 272 ], "遅": [ 448, 272 ], "馳": [ 456, 272 ], "築": [ 464, 272 ], "畜": [ 472, 272 ], "竹": [ 480, 272 ], "筑": [ 488, 272 ], "蓄": [ 496, 272 ], "逐": [ 504, 272 ], "秩": [ 512, 272 ], "窒": [ 520, 272 ], "茶": [ 528, 272 ], "嫡": [ 536, 272 ], "着": [ 544, 272 ], "中": [ 552, 272 ], "仲": [ 560, 272 ], "宙": [ 568, 272 ], "忠": [ 576, 272 ], "抽": [ 584, 272 ], "昼": [ 592, 272 ], "柱": [ 600, 272 ], "注": [ 608, 272 ], "虫": [ 616, 272 ], "衷": [ 624, 272 ], "註": [ 632, 272 ], "酎": [ 640, 272 ], "鋳": [ 648, 272 ], "駐": [ 656, 272 ], "樗": [ 664, 272 ], "瀦": [ 672, 272 ], "猪": [ 680, 272 ], "苧": [ 688, 272 ], "著": [ 696, 272 ], "貯": [ 704, 272 ], "丁": [ 712, 272 ], "兆": [ 720, 272 ], "凋": [ 728, 272 ], "喋": [ 736, 272 ], "寵": [ 744, 272 ], "帖": [ 0, 280 ], "帳": [ 8, 280 ], "庁": [ 16, 280 ], "弔": [ 24, 280 ], "張": [ 32, 280 ], "彫": [ 40, 280 ], "徴": [ 48, 280 ], "懲": [ 56, 280 ], "挑": [ 64, 280 ], "暢": [ 72, 280 ], "朝": [ 80, 280 ], "潮": [ 88, 280 ], "牒": [ 96, 280 ], "町": [ 104, 280 ], "眺": [ 112, 280 ], "聴": [ 120, 280 ], "脹": [ 128, 280 ], "腸": [ 136, 280 ], "蝶": [ 144, 280 ], "調": [ 152, 280 ], "諜": [ 160, 280 ], "超": [ 168, 280 ], "跳": [ 176, 280 ], "銚": [ 184, 280 ], "長": [ 192, 280 ], "頂": [ 200, 280 ], "鳥": [ 208, 280 ], "勅": [ 216, 280 ], "捗": [ 224, 280 ], "直": [ 232, 280 ], "朕": [ 240, 280 ], "沈": [ 248, 280 ], "珍": [ 256, 280 ], "賃": [ 264, 280 ], "鎮": [ 272, 280 ], "陳": [ 280, 280 ], "津": [ 288, 280 ], "墜": [ 296, 280 ], "椎": [ 304, 280 ], "槌": [ 312, 280 ], "追": [ 320, 280 ], "鎚": [ 328, 280 ], "痛": [ 336, 280 ], "通": [ 344, 280 ], "塚": [ 352, 280 ], "栂": [ 360, 280 ], "掴": [ 368, 280 ], "槻": [ 376, 280 ], "佃": [ 384, 280 ], "漬": [ 392, 280 ], "柘": [ 400, 280 ], "辻": [ 408, 280 ], "蔦": [ 416, 280 ], "綴": [ 424, 280 ], "鍔": [ 432, 280 ], "椿": [ 440, 280 ], "潰": [ 448, 280 ], "坪": [ 456, 280 ], "壷": [ 464, 280 ], "嬬": [ 472, 280 ], "紬": [ 480, 280 ], "爪": [ 488, 280 ], "吊": [ 496, 280 ], "釣": [ 504, 280 ], "鶴": [ 512, 280 ], "亭": [ 520, 280 ], "低": [ 528, 280 ], "停": [ 536, 280 ], "偵": [ 544, 280 ], "剃": [ 552, 280 ], "貞": [ 560, 280 ], "呈": [ 568, 280 ], "堤": [ 576, 280 ], "定": [ 584, 280 ], "帝": [ 592, 280 ], "底": [ 600, 280 ], "庭": [ 608, 280 ], "廷": [ 616, 280 ], "弟": [ 624, 280 ], "悌": [ 632, 280 ], "抵": [ 640, 280 ], "挺": [ 648, 280 ], "提": [ 656, 280 ], "梯": [ 664, 280 ], "汀": [ 672, 280 ], "碇": [ 680, 280 ], "禎": [ 688, 280 ], "程": [ 696, 280 ], "締": [ 704, 280 ], "艇": [ 712, 280 ], "訂": [ 720, 280 ], "諦": [ 728, 280 ], "蹄": [ 736, 280 ], "逓": [ 744, 280 ], "邸": [ 0, 288 ], "鄭": [ 8, 288 ], "釘": [ 16, 288 ], "鼎": [ 24, 288 ], "泥": [ 32, 288 ], "摘": [ 40, 288 ], "擢": [ 48, 288 ], "敵": [ 56, 288 ], "滴": [ 64, 288 ], "的": [ 72, 288 ], "笛": [ 80, 288 ], "適": [ 88, 288 ], "鏑": [ 96, 288 ], "溺": [ 104, 288 ], "哲": [ 112, 288 ], "徹": [ 120, 288 ], "撤": [ 128, 288 ], "轍": [ 136, 288 ], "迭": [ 144, 288 ], "鉄": [ 152, 288 ], "典": [ 160, 288 ], "填": [ 168, 288 ], "天": [ 176, 288 ], "展": [ 184, 288 ], "店": [ 192, 288 ], "添": [ 200, 288 ], "纏": [ 208, 288 ], "甜": [ 216, 288 ], "貼": [ 224, 288 ], "転": [ 232, 288 ], "顛": [ 240, 288 ], "点": [ 248, 288 ], "伝": [ 256, 288 ], "殿": [ 264, 288 ], "澱": [ 272, 288 ], "田": [ 280, 288 ], "電": [ 288, 288 ], "兎": [ 296, 288 ], "吐": [ 304, 288 ], "堵": [ 312, 288 ], "塗": [ 320, 288 ], "妬": [ 328, 288 ], "屠": [ 336, 288 ], "徒": [ 344, 288 ], "斗": [ 352, 288 ], "杜": [ 360, 288 ], "渡": [ 368, 288 ], "登": [ 376, 288 ], "菟": [ 384, 288 ], "賭": [ 392, 288 ], "途": [ 400, 288 ], "都": [ 408, 288 ], "鍍": [ 416, 288 ], "砥": [ 424, 288 ], "砺": [ 432, 288 ], "努": [ 440, 288 ], "度": [ 448, 288 ], "土": [ 456, 288 ], "奴": [ 464, 288 ], "怒": [ 472, 288 ], "倒": [ 480, 288 ], "党": [ 488, 288 ], "冬": [ 496, 288 ], "凍": [ 504, 288 ], "刀": [ 512, 288 ], "唐": [ 520, 288 ], "塔": [ 528, 288 ], "塘": [ 536, 288 ], "套": [ 544, 288 ], "宕": [ 552, 288 ], "島": [ 560, 288 ], "嶋": [ 568, 288 ], "悼": [ 576, 288 ], "投": [ 584, 288 ], "搭": [ 592, 288 ], "東": [ 600, 288 ], "桃": [ 608, 288 ], "梼": [ 616, 288 ], "棟": [ 624, 288 ], "盗": [ 632, 288 ], "淘": [ 640, 288 ], "湯": [ 648, 288 ], "涛": [ 656, 288 ], "灯": [ 664, 288 ], "燈": [ 672, 288 ], "当": [ 680, 288 ], "痘": [ 688, 288 ], "祷": [ 696, 288 ], "等": [ 704, 288 ], "答": [ 712, 288 ], "筒": [ 720, 288 ], "糖": [ 728, 288 ], "統": [ 736, 288 ], "到": [ 744, 288 ], "董": [ 0, 296 ], "蕩": [ 8, 296 ], "藤": [ 16, 296 ], "討": [ 24, 296 ], "謄": [ 32, 296 ], "豆": [ 40, 296 ], "踏": [ 48, 296 ], "逃": [ 56, 296 ], "透": [ 64, 296 ], "鐙": [ 72, 296 ], "陶": [ 80, 296 ], "頭": [ 88, 296 ], "騰": [ 96, 296 ], "闘": [ 104, 296 ], "働": [ 112, 296 ], "動": [ 120, 296 ], "同": [ 128, 296 ], "堂": [ 136, 296 ], "導": [ 144, 296 ], "憧": [ 152, 296 ], "撞": [ 160, 296 ], "洞": [ 168, 296 ], "瞳": [ 176, 296 ], "童": [ 184, 296 ], "胴": [ 192, 296 ], "萄": [ 200, 296 ], "道": [ 208, 296 ], "銅": [ 216, 296 ], "峠": [ 224, 296 ], "鴇": [ 232, 296 ], "匿": [ 240, 296 ], "得": [ 248, 296 ], "徳": [ 256, 296 ], "涜": [ 264, 296 ], "特": [ 272, 296 ], "督": [ 280, 296 ], "禿": [ 288, 296 ], "篤": [ 296, 296 ], "毒": [ 304, 296 ], "独": [ 312, 296 ], "読": [ 320, 296 ], "栃": [ 328, 296 ], "橡": [ 336, 296 ], "凸": [ 344, 296 ], "突": [ 352, 296 ], "椴": [ 360, 296 ], "届": [ 368, 296 ], "鳶": [ 376, 296 ], "苫": [ 384, 296 ], "寅": [ 392, 296 ], "酉": [ 400, 296 ], "瀞": [ 408, 296 ], "噸": [ 416, 296 ], "屯": [ 424, 296 ], "惇": [ 432, 296 ], "敦": [ 440, 296 ], "沌": [ 448, 296 ], "豚": [ 456, 296 ], "遁": [ 464, 296 ], "頓": [ 472, 296 ], "呑": [ 480, 296 ], "曇": [ 488, 296 ], "鈍": [ 496, 296 ], "奈": [ 504, 296 ], "那": [ 512, 296 ], "内": [ 520, 296 ], "乍": [ 528, 296 ], "凪": [ 536, 296 ], "薙": [ 544, 296 ], "謎": [ 552, 296 ], "灘": [ 560, 296 ], "捺": [ 568, 296 ], "鍋": [ 576, 296 ], "楢": [ 584, 296 ], "馴": [ 592, 296 ], "縄": [ 600, 296 ], "畷": [ 608, 296 ], "南": [ 616, 296 ], "楠": [ 624, 296 ], "軟": [ 632, 296 ], "難": [ 640, 296 ], "汝": [ 648, 296 ], "二": [ 656, 296 ], "尼": [ 664, 296 ], "弐": [ 672, 296 ], "迩": [ 680, 296 ], "匂": [ 688, 296 ], "賑": [ 696, 296 ], "肉": [ 704, 296 ], "虹": [ 712, 296 ], "廿": [ 720, 296 ], "日": [ 728, 296 ], "乳": [ 736, 296 ], "入": [ 744, 296 ], "如": [ 0, 304 ], "尿": [ 8, 304 ], "韮": [ 16, 304 ], "任": [ 24, 304 ], "妊": [ 32, 304 ], "忍": [ 40, 304 ], "認": [ 48, 304 ], "濡": [ 56, 304 ], "禰": [ 64, 304 ], "祢": [ 72, 304 ], "寧": [ 80, 304 ], "葱": [ 88, 304 ], "猫": [ 96, 304 ], "熱": [ 104, 304 ], "年": [ 112, 304 ], "念": [ 120, 304 ], "捻": [ 128, 304 ], "撚": [ 136, 304 ], "燃": [ 144, 304 ], "粘": [ 152, 304 ], "乃": [ 160, 304 ], "廼": [ 168, 304 ], "之": [ 176, 304 ], "埜": [ 184, 304 ], "嚢": [ 192, 304 ], "悩": [ 200, 304 ], "濃": [ 208, 304 ], "納": [ 216, 304 ], "能": [ 224, 304 ], "脳": [ 232, 304 ], "膿": [ 240, 304 ], "農": [ 248, 304 ], "覗": [ 256, 304 ], "蚤": [ 264, 304 ], "巴": [ 272, 304 ], "把": [ 280, 304 ], "播": [ 288, 304 ], "覇": [ 296, 304 ], "杷": [ 304, 304 ], "波": [ 312, 304 ], "派": [ 320, 304 ], "琶": [ 328, 304 ], "破": [ 336, 304 ], "婆": [ 344, 304 ], "罵": [ 352, 304 ], "芭": [ 360, 304 ], "馬": [ 368, 304 ], "俳": [ 376, 304 ], "廃": [ 384, 304 ], "拝": [ 392, 304 ], "排": [ 400, 304 ], "敗": [ 408, 304 ], "杯": [ 416, 304 ], "盃": [ 424, 304 ], "牌": [ 432, 304 ], "背": [ 440, 304 ], "肺": [ 448, 304 ], "輩": [ 456, 304 ], "配": [ 464, 304 ], "倍": [ 472, 304 ], "培": [ 480, 304 ], "媒": [ 488, 304 ], "梅": [ 496, 304 ], "楳": [ 504, 304 ], "煤": [ 512, 304 ], "狽": [ 520, 304 ], "買": [ 528, 304 ], "売": [ 536, 304 ], "賠": [ 544, 304 ], "陪": [ 552, 304 ], "這": [ 560, 304 ], "蝿": [ 568, 304 ], "秤": [ 576, 304 ], "矧": [ 584, 304 ], "萩": [ 592, 304 ], "伯": [ 600, 304 ], "剥": [ 608, 304 ], "博": [ 616, 304 ], "拍": [ 624, 304 ], "柏": [ 632, 304 ], "泊": [ 640, 304 ], "白": [ 648, 304 ], "箔": [ 656, 304 ], "粕": [ 664, 304 ], "舶": [ 672, 304 ], "薄": [ 680, 304 ], "迫": [ 688, 304 ], "曝": [ 696, 304 ], "漠": [ 704, 304 ], "爆": [ 712, 304 ], "縛": [ 720, 304 ], "莫": [ 728, 304 ], "駁": [ 736, 304 ], "麦": [ 744, 304 ], "函": [ 0, 312 ], "箱": [ 8, 312 ], "硲": [ 16, 312 ], "箸": [ 24, 312 ], "肇": [ 32, 312 ], "筈": [ 40, 312 ], "櫨": [ 48, 312 ], "幡": [ 56, 312 ], "肌": [ 64, 312 ], "畑": [ 72, 312 ], "畠": [ 80, 312 ], "八": [ 88, 312 ], "鉢": [ 96, 312 ], "溌": [ 104, 312 ], "発": [ 112, 312 ], "醗": [ 120, 312 ], "髪": [ 128, 312 ], "伐": [ 136, 312 ], "罰": [ 144, 312 ], "抜": [ 152, 312 ], "筏": [ 160, 312 ], "閥": [ 168, 312 ], "鳩": [ 176, 312 ], "噺": [ 184, 312 ], "塙": [ 192, 312 ], "蛤": [ 200, 312 ], "隼": [ 208, 312 ], "伴": [ 216, 312 ], "判": [ 224, 312 ], "半": [ 232, 312 ], "反": [ 240, 312 ], "叛": [ 248, 312 ], "帆": [ 256, 312 ], "搬": [ 264, 312 ], "斑": [ 272, 312 ], "板": [ 280, 312 ], "氾": [ 288, 312 ], "汎": [ 296, 312 ], "版": [ 304, 312 ], "犯": [ 312, 312 ], "班": [ 320, 312 ], "畔": [ 328, 312 ], "繁": [ 336, 312 ], "般": [ 344, 312 ], "藩": [ 352, 312 ], "販": [ 360, 312 ], "範": [ 368, 312 ], "釆": [ 376, 312 ], "煩": [ 384, 312 ], "頒": [ 392, 312 ], "飯": [ 400, 312 ], "挽": [ 408, 312 ], "晩": [ 416, 312 ], "番": [ 424, 312 ], "盤": [ 432, 312 ], "磐": [ 440, 312 ], "蕃": [ 448, 312 ], "蛮": [ 456, 312 ], "匪": [ 464, 312 ], "卑": [ 472, 312 ], "否": [ 480, 312 ], "妃": [ 488, 312 ], "庇": [ 496, 312 ], "彼": [ 504, 312 ], "悲": [ 512, 312 ], "扉": [ 520, 312 ], "批": [ 528, 312 ], "披": [ 536, 312 ], "斐": [ 544, 312 ], "比": [ 552, 312 ], "泌": [ 560, 312 ], "疲": [ 568, 312 ], "皮": [ 576, 312 ], "碑": [ 584, 312 ], "秘": [ 592, 312 ], "緋": [ 600, 312 ], "罷": [ 608, 312 ], "肥": [ 616, 312 ], "被": [ 624, 312 ], "誹": [ 632, 312 ], "費": [ 640, 312 ], "避": [ 648, 312 ], "非": [ 656, 312 ], "飛": [ 664, 312 ], "樋": [ 672, 312 ], "簸": [ 680, 312 ], "備": [ 688, 312 ], "尾": [ 696, 312 ], "微": [ 704, 312 ], "枇": [ 712, 312 ], "毘": [ 720, 312 ], "琵": [ 728, 312 ], "眉": [ 736, 312 ], "美": [ 744, 312 ], "鼻": [ 0, 320 ], "柊": [ 8, 320 ], "稗": [ 16, 320 ], "匹": [ 24, 320 ], "疋": [ 32, 320 ], "髭": [ 40, 320 ], "彦": [ 48, 320 ], "膝": [ 56, 320 ], "菱": [ 64, 320 ], "肘": [ 72, 320 ], "弼": [ 80, 320 ], "必": [ 88, 320 ], "畢": [ 96, 320 ], "筆": [ 104, 320 ], "逼": [ 112, 320 ], "桧": [ 120, 320 ], "姫": [ 128, 320 ], "媛": [ 136, 320 ], "紐": [ 144, 320 ], "百": [ 152, 320 ], "謬": [ 160, 320 ], "俵": [ 168, 320 ], "彪": [ 176, 320 ], "標": [ 184, 320 ], "氷": [ 192, 320 ], "漂": [ 200, 320 ], "瓢": [ 208, 320 ], "票": [ 216, 320 ], "表": [ 224, 320 ], "評": [ 232, 320 ], "豹": [ 240, 320 ], "廟": [ 248, 320 ], "描": [ 256, 320 ], "病": [ 264, 320 ], "秒": [ 272, 320 ], "苗": [ 280, 320 ], "錨": [ 288, 320 ], "鋲": [ 296, 320 ], "蒜": [ 304, 320 ], "蛭": [ 312, 320 ], "鰭": [ 320, 320 ], "品": [ 328, 320 ], "彬": [ 336, 320 ], "斌": [ 344, 320 ], "浜": [ 352, 320 ], "瀕": [ 360, 320 ], "貧": [ 368, 320 ], "賓": [ 376, 320 ], "頻": [ 384, 320 ], "敏": [ 392, 320 ], "瓶": [ 400, 320 ], "不": [ 408, 320 ], "付": [ 416, 320 ], "埠": [ 424, 320 ], "夫": [ 432, 320 ], "婦": [ 440, 320 ], "富": [ 448, 320 ], "冨": [ 456, 320 ], "布": [ 464, 320 ], "府": [ 472, 320 ], "怖": [ 480, 320 ], "扶": [ 488, 320 ], "敷": [ 496, 320 ], "斧": [ 504, 320 ], "普": [ 512, 320 ], "浮": [ 520, 320 ], "父": [ 528, 320 ], "符": [ 536, 320 ], "腐": [ 544, 320 ], "膚": [ 552, 320 ], "芙": [ 560, 320 ], "譜": [ 568, 320 ], "負": [ 576, 320 ], "賦": [ 584, 320 ], "赴": [ 592, 320 ], "阜": [ 600, 320 ], "附": [ 608, 320 ], "侮": [ 616, 320 ], "撫": [ 624, 320 ], "武": [ 632, 320 ], "舞": [ 640, 320 ], "葡": [ 648, 320 ], "蕪": [ 656, 320 ], "部": [ 664, 320 ], "封": [ 672, 320 ], "楓": [ 680, 320 ], "風": [ 688, 320 ], "葺": [ 696, 320 ], "蕗": [ 704, 320 ], "伏": [ 712, 320 ], "副": [ 720, 320 ], "復": [ 728, 320 ], "幅": [ 736, 320 ], "服": [ 744, 320 ], "福": [ 0, 328 ], "腹": [ 8, 328 ], "複": [ 16, 328 ], "覆": [ 24, 328 ], "淵": [ 32, 328 ], "弗": [ 40, 328 ], "払": [ 48, 328 ], "沸": [ 56, 328 ], "仏": [ 64, 328 ], "物": [ 72, 328 ], "鮒": [ 80, 328 ], "分": [ 88, 328 ], "吻": [ 96, 328 ], "噴": [ 104, 328 ], "墳": [ 112, 328 ], "憤": [ 120, 328 ], "扮": [ 128, 328 ], "焚": [ 136, 328 ], "奮": [ 144, 328 ], "粉": [ 152, 328 ], "糞": [ 160, 328 ], "紛": [ 168, 328 ], "雰": [ 176, 328 ], "文": [ 184, 328 ], "聞": [ 192, 328 ], "丙": [ 200, 328 ], "併": [ 208, 328 ], "兵": [ 216, 328 ], "塀": [ 224, 328 ], "幣": [ 232, 328 ], "平": [ 240, 328 ], "弊": [ 248, 328 ], "柄": [ 256, 328 ], "並": [ 264, 328 ], "蔽": [ 272, 328 ], "閉": [ 280, 328 ], "陛": [ 288, 328 ], "米": [ 296, 328 ], "頁": [ 304, 328 ], "僻": [ 312, 328 ], "壁": [ 320, 328 ], "癖": [ 328, 328 ], "碧": [ 336, 328 ], "別": [ 344, 328 ], "瞥": [ 352, 328 ], "蔑": [ 360, 328 ], "箆": [ 368, 328 ], "偏": [ 376, 328 ], "変": [ 384, 328 ], "片": [ 392, 328 ], "篇": [ 400, 328 ], "編": [ 408, 328 ], "辺": [ 416, 328 ], "返": [ 424, 328 ], "遍": [ 432, 328 ], "便": [ 440, 328 ], "勉": [ 448, 328 ], "娩": [ 456, 328 ], "弁": [ 464, 328 ], "鞭": [ 472, 328 ], "保": [ 480, 328 ], "舗": [ 488, 328 ], "鋪": [ 496, 328 ], "圃": [ 504, 328 ], "捕": [ 512, 328 ], "歩": [ 520, 328 ], "甫": [ 528, 328 ], "補": [ 536, 328 ], "輔": [ 544, 328 ], "穂": [ 552, 328 ], "募": [ 560, 328 ], "墓": [ 568, 328 ], "慕": [ 576, 328 ], "戊": [ 584, 328 ], "暮": [ 592, 328 ], "母": [ 600, 328 ], "簿": [ 608, 328 ], "菩": [ 616, 328 ], "倣": [ 624, 328 ], "俸": [ 632, 328 ], "包": [ 640, 328 ], "呆": [ 648, 328 ], "報": [ 656, 328 ], "奉": [ 664, 328 ], "宝": [ 672, 328 ], "峰": [ 680, 328 ], "峯": [ 688, 328 ], "崩": [ 696, 328 ], "庖": [ 704, 328 ], "抱": [ 712, 328 ], "捧": [ 720, 328 ], "放": [ 728, 328 ], "方": [ 736, 328 ], "朋": [ 744, 328 ], "法": [ 0, 336 ], "泡": [ 8, 336 ], "烹": [ 16, 336 ], "砲": [ 24, 336 ], "縫": [ 32, 336 ], "胞": [ 40, 336 ], "芳": [ 48, 336 ], "萌": [ 56, 336 ], "蓬": [ 64, 336 ], "蜂": [ 72, 336 ], "褒": [ 80, 336 ], "訪": [ 88, 336 ], "豊": [ 96, 336 ], "邦": [ 104, 336 ], "鋒": [ 112, 336 ], "飽": [ 120, 336 ], "鳳": [ 128, 336 ], "鵬": [ 136, 336 ], "乏": [ 144, 336 ], "亡": [ 152, 336 ], "傍": [ 160, 336 ], "剖": [ 168, 336 ], "坊": [ 176, 336 ], "妨": [ 184, 336 ], "帽": [ 192, 336 ], "忘": [ 200, 336 ], "忙": [ 208, 336 ], "房": [ 216, 336 ], "暴": [ 224, 336 ], "望": [ 232, 336 ], "某": [ 240, 336 ], "棒": [ 248, 336 ], "冒": [ 256, 336 ], "紡": [ 264, 336 ], "肪": [ 272, 336 ], "膨": [ 280, 336 ], "謀": [ 288, 336 ], "貌": [ 296, 336 ], "貿": [ 304, 336 ], "鉾": [ 312, 336 ], "防": [ 320, 336 ], "吠": [ 328, 336 ], "頬": [ 336, 336 ], "北": [ 344, 336 ], "僕": [ 352, 336 ], "卜": [ 360, 336 ], "墨": [ 368, 336 ], "撲": [ 376, 336 ], "朴": [ 384, 336 ], "牧": [ 392, 336 ], "睦": [ 400, 336 ], "穆": [ 408, 336 ], "釦": [ 416, 336 ], "勃": [ 424, 336 ], "没": [ 432, 336 ], "殆": [ 440, 336 ], "堀": [ 448, 336 ], "幌": [ 456, 336 ], "奔": [ 464, 336 ], "本": [ 472, 336 ], "翻": [ 480, 336 ], "凡": [ 488, 336 ], "盆": [ 496, 336 ], "摩": [ 504, 336 ], "磨": [ 512, 336 ], "魔": [ 520, 336 ], "麻": [ 528, 336 ], "埋": [ 536, 336 ], "妹": [ 544, 336 ], "昧": [ 552, 336 ], "枚": [ 560, 336 ], "毎": [ 568, 336 ], "哩": [ 576, 336 ], "槙": [ 584, 336 ], "幕": [ 592, 336 ], "膜": [ 600, 336 ], "枕": [ 608, 336 ], "鮪": [ 616, 336 ], "柾": [ 624, 336 ], "鱒": [ 632, 336 ], "桝": [ 640, 336 ], "亦": [ 648, 336 ], "俣": [ 656, 336 ], "又": [ 664, 336 ], "抹": [ 672, 336 ], "末": [ 680, 336 ], "沫": [ 688, 336 ], "迄": [ 696, 336 ], "侭": [ 704, 336 ], "繭": [ 712, 336 ], "麿": [ 720, 336 ], "万": [ 728, 336 ], "慢": [ 736, 336 ], "満": [ 744, 336 ], "漫": [ 0, 344 ], "蔓": [ 8, 344 ], "味": [ 16, 344 ], "未": [ 24, 344 ], "魅": [ 32, 344 ], "巳": [ 40, 344 ], "箕": [ 48, 344 ], "岬": [ 56, 344 ], "密": [ 64, 344 ], "蜜": [ 72, 344 ], "湊": [ 80, 344 ], "蓑": [ 88, 344 ], "稔": [ 96, 344 ], "脈": [ 104, 344 ], "妙": [ 112, 344 ], "粍": [ 120, 344 ], "民": [ 128, 344 ], "眠": [ 136, 344 ], "務": [ 144, 344 ], "夢": [ 152, 344 ], "無": [ 160, 344 ], "牟": [ 168, 344 ], "矛": [ 176, 344 ], "霧": [ 184, 344 ], "鵡": [ 192, 344 ], "椋": [ 200, 344 ], "婿": [ 208, 344 ], "娘": [ 216, 344 ], "冥": [ 224, 344 ], "名": [ 232, 344 ], "命": [ 240, 344 ], "明": [ 248, 344 ], "盟": [ 256, 344 ], "迷": [ 264, 344 ], "銘": [ 272, 344 ], "鳴": [ 280, 344 ], "姪": [ 288, 344 ], "牝": [ 296, 344 ], "滅": [ 304, 344 ], "免": [ 312, 344 ], "棉": [ 320, 344 ], "綿": [ 328, 344 ], "緬": [ 336, 344 ], "面": [ 344, 344 ], "麺": [ 352, 344 ], "摸": [ 360, 344 ], "模": [ 368, 344 ], "茂": [ 376, 344 ], "妄": [ 384, 344 ], "孟": [ 392, 344 ], "毛": [ 400, 344 ], "猛": [ 408, 344 ], "盲": [ 416, 344 ], "網": [ 424, 344 ], "耗": [ 432, 344 ], "蒙": [ 440, 344 ], "儲": [ 448, 344 ], "木": [ 456, 344 ], "黙": [ 464, 344 ], "目": [ 472, 344 ], "杢": [ 480, 344 ], "勿": [ 488, 344 ], "餅": [ 496, 344 ], "尤": [ 504, 344 ], "戻": [ 512, 344 ], "籾": [ 520, 344 ], "貰": [ 528, 344 ], "問": [ 536, 344 ], "悶": [ 544, 344 ], "紋": [ 552, 344 ], "門": [ 560, 344 ], "匁": [ 568, 344 ], "也": [ 576, 344 ], "冶": [ 584, 344 ], "夜": [ 592, 344 ], "爺": [ 600, 344 ], "耶": [ 608, 344 ], "野": [ 616, 344 ], "弥": [ 624, 344 ], "矢": [ 632, 344 ], "厄": [ 640, 344 ], "役": [ 648, 344 ], "約": [ 656, 344 ], "薬": [ 664, 344 ], "訳": [ 672, 344 ], "躍": [ 680, 344 ], "靖": [ 688, 344 ], "柳": [ 696, 344 ], "薮": [ 704, 344 ], "鑓": [ 712, 344 ], "愉": [ 720, 344 ], "愈": [ 728, 344 ], "油": [ 736, 344 ], "癒": [ 744, 344 ], "諭": [ 0, 352 ], "輸": [ 8, 352 ], "唯": [ 16, 352 ], "佑": [ 24, 352 ], "優": [ 32, 352 ], "勇": [ 40, 352 ], "友": [ 48, 352 ], "宥": [ 56, 352 ], "幽": [ 64, 352 ], "悠": [ 72, 352 ], "憂": [ 80, 352 ], "揖": [ 88, 352 ], "有": [ 96, 352 ], "柚": [ 104, 352 ], "湧": [ 112, 352 ], "涌": [ 120, 352 ], "猶": [ 128, 352 ], "猷": [ 136, 352 ], "由": [ 144, 352 ], "祐": [ 152, 352 ], "裕": [ 160, 352 ], "誘": [ 168, 352 ], "遊": [ 176, 352 ], "邑": [ 184, 352 ], "郵": [ 192, 352 ], "雄": [ 200, 352 ], "融": [ 208, 352 ], "夕": [ 216, 352 ], "予": [ 224, 352 ], "余": [ 232, 352 ], "与": [ 240, 352 ], "誉": [ 248, 352 ], "輿": [ 256, 352 ], "預": [ 264, 352 ], "傭": [ 272, 352 ], "幼": [ 280, 352 ], "妖": [ 288, 352 ], "容": [ 296, 352 ], "庸": [ 304, 352 ], "揚": [ 312, 352 ], "揺": [ 320, 352 ], "擁": [ 328, 352 ], "曜": [ 336, 352 ], "楊": [ 344, 352 ], "様": [ 352, 352 ], "洋": [ 360, 352 ], "溶": [ 368, 352 ], "熔": [ 376, 352 ], "用": [ 384, 352 ], "窯": [ 392, 352 ], "羊": [ 400, 352 ], "耀": [ 408, 352 ], "葉": [ 416, 352 ], "蓉": [ 424, 352 ], "要": [ 432, 352 ], "謡": [ 440, 352 ], "踊": [ 448, 352 ], "遥": [ 456, 352 ], "陽": [ 464, 352 ], "養": [ 472, 352 ], "慾": [ 480, 352 ], "抑": [ 488, 352 ], "欲": [ 496, 352 ], "沃": [ 504, 352 ], "浴": [ 512, 352 ], "翌": [ 520, 352 ], "翼": [ 528, 352 ], "淀": [ 536, 352 ], "羅": [ 544, 352 ], "螺": [ 552, 352 ], "裸": [ 560, 352 ], "来": [ 568, 352 ], "莱": [ 576, 352 ], "頼": [ 584, 352 ], "雷": [ 592, 352 ], "洛": [ 600, 352 ], "絡": [ 608, 352 ], "落": [ 616, 352 ], "酪": [ 624, 352 ], "乱": [ 632, 352 ], "卵": [ 640, 352 ], "嵐": [ 648, 352 ], "欄": [ 656, 352 ], "濫": [ 664, 352 ], "藍": [ 672, 352 ], "蘭": [ 680, 352 ], "覧": [ 688, 352 ], "利": [ 696, 352 ], "吏": [ 704, 352 ], "履": [ 712, 352 ], "李": [ 720, 352 ], "梨": [ 728, 352 ], "理": [ 736, 352 ], "璃": [ 744, 352 ], "痢": [ 0, 360 ], "裏": [ 8, 360 ], "裡": [ 16, 360 ], "里": [ 24, 360 ], "離": [ 32, 360 ], "陸": [ 40, 360 ], "律": [ 48, 360 ], "率": [ 56, 360 ], "立": [ 64, 360 ], "葎": [ 72, 360 ], "掠": [ 80, 360 ], "略": [ 88, 360 ], "劉": [ 96, 360 ], "流": [ 104, 360 ], "溜": [ 112, 360 ], "琉": [ 120, 360 ], "留": [ 128, 360 ], "硫": [ 136, 360 ], "粒": [ 144, 360 ], "隆": [ 152, 360 ], "竜": [ 160, 360 ], "龍": [ 168, 360 ], "侶": [ 176, 360 ], "慮": [ 184, 360 ], "旅": [ 192, 360 ], "虜": [ 200, 360 ], "了": [ 208, 360 ], "亮": [ 216, 360 ], "僚": [ 224, 360 ], "両": [ 232, 360 ], "凌": [ 240, 360 ], "寮": [ 248, 360 ], "料": [ 256, 360 ], "梁": [ 264, 360 ], "涼": [ 272, 360 ], "猟": [ 280, 360 ], "療": [ 288, 360 ], "瞭": [ 296, 360 ], "稜": [ 304, 360 ], "糧": [ 312, 360 ], "良": [ 320, 360 ], "諒": [ 328, 360 ], "遼": [ 336, 360 ], "量": [ 344, 360 ], "陵": [ 352, 360 ], "領": [ 360, 360 ], "力": [ 368, 360 ], "緑": [ 376, 360 ], "倫": [ 384, 360 ], "厘": [ 392, 360 ], "林": [ 400, 360 ], "淋": [ 408, 360 ], "燐": [ 416, 360 ], "琳": [ 424, 360 ], "臨": [ 432, 360 ], "輪": [ 440, 360 ], "隣": [ 448, 360 ], "鱗": [ 456, 360 ], "麟": [ 464, 360 ], "瑠": [ 472, 360 ], "塁": [ 480, 360 ], "涙": [ 488, 360 ], "累": [ 496, 360 ], "類": [ 504, 360 ], "令": [ 512, 360 ], "伶": [ 520, 360 ], "例": [ 528, 360 ], "冷": [ 536, 360 ], "励": [ 544, 360 ], "嶺": [ 552, 360 ], "怜": [ 560, 360 ], "玲": [ 568, 360 ], "礼": [ 576, 360 ], "苓": [ 584, 360 ], "鈴": [ 592, 360 ], "隷": [ 600, 360 ], "零": [ 608, 360 ], "霊": [ 616, 360 ], "麗": [ 624, 360 ], "齢": [ 632, 360 ], "暦": [ 640, 360 ], "歴": [ 648, 360 ], "列": [ 656, 360 ], "劣": [ 664, 360 ], "烈": [ 672, 360 ], "裂": [ 680, 360 ], "廉": [ 688, 360 ], "恋": [ 696, 360 ], "憐": [ 704, 360 ], "漣": [ 712, 360 ], "煉": [ 720, 360 ], "簾": [ 728, 360 ], "練": [ 736, 360 ], "聯": [ 744, 360 ], "蓮": [ 0, 368 ], "連": [ 8, 368 ], "錬": [ 16, 368 ], "呂": [ 24, 368 ], "魯": [ 32, 368 ], "櫓": [ 40, 368 ], "炉": [ 48, 368 ], "賂": [ 56, 368 ], "路": [ 64, 368 ], "露": [ 72, 368 ], "労": [ 80, 368 ], "婁": [ 88, 368 ], "廊": [ 96, 368 ], "弄": [ 104, 368 ], "朗": [ 112, 368 ], "楼": [ 120, 368 ], "榔": [ 128, 368 ], "浪": [ 136, 368 ], "漏": [ 144, 368 ], "牢": [ 152, 368 ], "狼": [ 160, 368 ], "篭": [ 168, 368 ], "老": [ 176, 368 ], "聾": [ 184, 368 ], "蝋": [ 192, 368 ], "郎": [ 200, 368 ], "六": [ 208, 368 ], "麓": [ 216, 368 ], "禄": [ 224, 368 ], "肋": [ 232, 368 ], "録": [ 240, 368 ], "論": [ 248, 368 ], "倭": [ 256, 368 ], "和": [ 264, 368 ], "話": [ 272, 368 ], "歪": [ 280, 368 ], "賄": [ 288, 368 ], "脇": [ 296, 368 ], "惑": [ 304, 368 ], "枠": [ 312, 368 ], "鷲": [ 320, 368 ], "亙": [ 328, 368 ], "亘": [ 336, 368 ], "鰐": [ 344, 368 ], "詫": [ 352, 368 ], "藁": [ 360, 368 ], "蕨": [ 368, 368 ], "椀": [ 376, 368 ], "湾": [ 384, 368 ], "碗": [ 392, 368 ], "腕": [ 400, 368 ], "弌": [ 0, 376 ], "丐": [ 8, 376 ], "丕": [ 16, 376 ], "个": [ 24, 376 ], "丱": [ 32, 376 ], "丶": [ 40, 376 ], "丼": [ 48, 376 ], "丿": [ 56, 376 ], "乂": [ 64, 376 ], "乖": [ 72, 376 ], "乘": [ 80, 376 ], "亂": [ 88, 376 ], "亅": [ 96, 376 ], "豫": [ 104, 376 ], "亊": [ 112, 376 ], "舒": [ 120, 376 ], "弍": [ 128, 376 ], "于": [ 136, 376 ], "亞": [ 144, 376 ], "亟": [ 152, 376 ], "亠": [ 160, 376 ], "亢": [ 168, 376 ], "亰": [ 176, 376 ], "亳": [ 184, 376 ], "亶": [ 192, 376 ], "从": [ 200, 376 ], "仍": [ 208, 376 ], "仄": [ 216, 376 ], "仆": [ 224, 376 ], "仂": [ 232, 376 ], "仗": [ 240, 376 ], "仞": [ 248, 376 ], "仭": [ 256, 376 ], "仟": [ 264, 376 ], "价": [ 272, 376 ], "伉": [ 280, 376 ], "佚": [ 288, 376 ], "估": [ 296, 376 ], "佛": [ 304, 376 ], "佝": [ 312, 376 ], "佗": [ 320, 376 ], "佇": [ 328, 376 ], "佶": [ 336, 376 ], "侈": [ 344, 376 ], "侏": [ 352, 376 ], "侘": [ 360, 376 ], "佻": [ 368, 376 ], "佩": [ 376, 376 ], "佰": [ 384, 376 ], "侑": [ 392, 376 ], "佯": [ 400, 376 ], "來": [ 408, 376 ], "侖": [ 416, 376 ], "儘": [ 424, 376 ], "俔": [ 432, 376 ], "俟": [ 440, 376 ], "俎": [ 448, 376 ], "俘": [ 456, 376 ], "俛": [ 464, 376 ], "俑": [ 472, 376 ], "俚": [ 480, 376 ], "俐": [ 488, 376 ], "俤": [ 496, 376 ], "俥": [ 504, 376 ], "倚": [ 512, 376 ], "倨": [ 520, 376 ], "倔": [ 528, 376 ], "倪": [ 536, 376 ], "倥": [ 544, 376 ], "倅": [ 552, 376 ], "伜": [ 560, 376 ], "俶": [ 568, 376 ], "倡": [ 576, 376 ], "倩": [ 584, 376 ], "倬": [ 592, 376 ], "俾": [ 600, 376 ], "俯": [ 608, 376 ], "們": [ 616, 376 ], "倆": [ 624, 376 ], "偃": [ 632, 376 ], "假": [ 640, 376 ], "會": [ 648, 376 ], "偕": [ 656, 376 ], "偐": [ 664, 376 ], "偈": [ 672, 376 ], "做": [ 680, 376 ], "偖": [ 688, 376 ], "偬": [ 696, 376 ], "偸": [ 704, 376 ], "傀": [ 712, 376 ], "傚": [ 720, 376 ], "傅": [ 728, 376 ], "傴": [ 736, 376 ], "傲": [ 744, 376 ], "僉": [ 0, 384 ], "僊": [ 8, 384 ], "傳": [ 16, 384 ], "僂": [ 24, 384 ], "僖": [ 32, 384 ], "僞": [ 40, 384 ], "僥": [ 48, 384 ], "僭": [ 56, 384 ], "僣": [ 64, 384 ], "僮": [ 72, 384 ], "價": [ 80, 384 ], "僵": [ 88, 384 ], "儉": [ 96, 384 ], "儁": [ 104, 384 ], "儂": [ 112, 384 ], "儖": [ 120, 384 ], "儕": [ 128, 384 ], "儔": [ 136, 384 ], "儚": [ 144, 384 ], "儡": [ 152, 384 ], "儺": [ 160, 384 ], "儷": [ 168, 384 ], "儼": [ 176, 384 ], "儻": [ 184, 384 ], "儿": [ 192, 384 ], "兀": [ 200, 384 ], "兒": [ 208, 384 ], "兌": [ 216, 384 ], "兔": [ 224, 384 ], "兢": [ 232, 384 ], "竸": [ 240, 384 ], "兩": [ 248, 384 ], "兪": [ 256, 384 ], "兮": [ 264, 384 ], "冀": [ 272, 384 ], "冂": [ 280, 384 ], "囘": [ 288, 384 ], "册": [ 296, 384 ], "冉": [ 304, 384 ], "冏": [ 312, 384 ], "冑": [ 320, 384 ], "冓": [ 328, 384 ], "冕": [ 336, 384 ], "冖": [ 344, 384 ], "冤": [ 352, 384 ], "冦": [ 360, 384 ], "冢": [ 368, 384 ], "冩": [ 376, 384 ], "冪": [ 384, 384 ], "冫": [ 392, 384 ], "决": [ 400, 384 ], "冱": [ 408, 384 ], "冲": [ 416, 384 ], "冰": [ 424, 384 ], "况": [ 432, 384 ], "冽": [ 440, 384 ], "凅": [ 448, 384 ], "凉": [ 456, 384 ], "凛": [ 464, 384 ], "几": [ 472, 384 ], "處": [ 480, 384 ], "凩": [ 488, 384 ], "凭": [ 496, 384 ], "凰": [ 504, 384 ], "凵": [ 512, 384 ], "凾": [ 520, 384 ], "刄": [ 528, 384 ], "刋": [ 536, 384 ], "刔": [ 544, 384 ], "刎": [ 552, 384 ], "刧": [ 560, 384 ], "刪": [ 568, 384 ], "刮": [ 576, 384 ], "刳": [ 584, 384 ], "刹": [ 592, 384 ], "剏": [ 600, 384 ], "剄": [ 608, 384 ], "剋": [ 616, 384 ], "剌": [ 624, 384 ], "剞": [ 632, 384 ], "剔": [ 640, 384 ], "剪": [ 648, 384 ], "剴": [ 656, 384 ], "剩": [ 664, 384 ], "剳": [ 672, 384 ], "剿": [ 680, 384 ], "剽": [ 688, 384 ], "劍": [ 696, 384 ], "劔": [ 704, 384 ], "劒": [ 712, 384 ], "剱": [ 720, 384 ], "劈": [ 728, 384 ], "劑": [ 736, 384 ], "辨": [ 744, 384 ], "辧": [ 0, 392 ], "劬": [ 8, 392 ], "劭": [ 16, 392 ], "劼": [ 24, 392 ], "劵": [ 32, 392 ], "勁": [ 40, 392 ], "勍": [ 48, 392 ], "勗": [ 56, 392 ], "勞": [ 64, 392 ], "勣": [ 72, 392 ], "勦": [ 80, 392 ], "飭": [ 88, 392 ], "勠": [ 96, 392 ], "勳": [ 104, 392 ], "勵": [ 112, 392 ], "勸": [ 120, 392 ], "勹": [ 128, 392 ], "匆": [ 136, 392 ], "匈": [ 144, 392 ], "甸": [ 152, 392 ], "匍": [ 160, 392 ], "匐": [ 168, 392 ], "匏": [ 176, 392 ], "匕": [ 184, 392 ], "匚": [ 192, 392 ], "匣": [ 200, 392 ], "匯": [ 208, 392 ], "匱": [ 216, 392 ], "匳": [ 224, 392 ], "匸": [ 232, 392 ], "區": [ 240, 392 ], "卆": [ 248, 392 ], "卅": [ 256, 392 ], "丗": [ 264, 392 ], "卉": [ 272, 392 ], "卍": [ 280, 392 ], "凖": [ 288, 392 ], "卞": [ 296, 392 ], "卩": [ 304, 392 ], "卮": [ 312, 392 ], "夘": [ 320, 392 ], "卻": [ 328, 392 ], "卷": [ 336, 392 ], "厂": [ 344, 392 ], "厖": [ 352, 392 ], "厠": [ 360, 392 ], "厦": [ 368, 392 ], "厥": [ 376, 392 ], "厮": [ 384, 392 ], "厰": [ 392, 392 ], "厶": [ 400, 392 ], "參": [ 408, 392 ], "簒": [ 416, 392 ], "雙": [ 424, 392 ], "叟": [ 432, 392 ], "曼": [ 440, 392 ], "燮": [ 448, 392 ], "叮": [ 456, 392 ], "叨": [ 464, 392 ], "叭": [ 472, 392 ], "叺": [ 480, 392 ], "吁": [ 488, 392 ], "吽": [ 496, 392 ], "呀": [ 504, 392 ], "听": [ 512, 392 ], "吭": [ 520, 392 ], "吼": [ 528, 392 ], "吮": [ 536, 392 ], "吶": [ 544, 392 ], "吩": [ 552, 392 ], "吝": [ 560, 392 ], "呎": [ 568, 392 ], "咏": [ 576, 392 ], "呵": [ 584, 392 ], "咎": [ 592, 392 ], "呟": [ 600, 392 ], "呱": [ 608, 392 ], "呷": [ 616, 392 ], "呰": [ 624, 392 ], "咒": [ 632, 392 ], "呻": [ 640, 392 ], "咀": [ 648, 392 ], "呶": [ 656, 392 ], "咄": [ 664, 392 ], "咐": [ 672, 392 ], "咆": [ 680, 392 ], "哇": [ 688, 392 ], "咢": [ 696, 392 ], "咸": [ 704, 392 ], "咥": [ 712, 392 ], "咬": [ 720, 392 ], "哄": [ 728, 392 ], "哈": [ 736, 392 ], "咨": [ 744, 392 ], "咫": [ 0, 400 ], "哂": [ 8, 400 ], "咤": [ 16, 400 ], "咾": [ 24, 400 ], "咼": [ 32, 400 ], "哘": [ 40, 400 ], "哥": [ 48, 400 ], "哦": [ 56, 400 ], "唏": [ 64, 400 ], "唔": [ 72, 400 ], "哽": [ 80, 400 ], "哮": [ 88, 400 ], "哭": [ 96, 400 ], "哺": [ 104, 400 ], "哢": [ 112, 400 ], "唹": [ 120, 400 ], "啀": [ 128, 400 ], "啣": [ 136, 400 ], "啌": [ 144, 400 ], "售": [ 152, 400 ], "啜": [ 160, 400 ], "啅": [ 168, 400 ], "啖": [ 176, 400 ], "啗": [ 184, 400 ], "唸": [ 192, 400 ], "唳": [ 200, 400 ], "啝": [ 208, 400 ], "喙": [ 216, 400 ], "喀": [ 224, 400 ], "咯": [ 232, 400 ], "喊": [ 240, 400 ], "喟": [ 248, 400 ], "啻": [ 256, 400 ], "啾": [ 264, 400 ], "喘": [ 272, 400 ], "喞": [ 280, 400 ], "單": [ 288, 400 ], "啼": [ 296, 400 ], "喃": [ 304, 400 ], "喩": [ 312, 400 ], "喇": [ 320, 400 ], "喨": [ 328, 400 ], "嗚": [ 336, 400 ], "嗅": [ 344, 400 ], "嗟": [ 352, 400 ], "嗄": [ 360, 400 ], "嗜": [ 368, 400 ], "嗤": [ 376, 400 ], "嗔": [ 384, 400 ], "嘔": [ 392, 400 ], "嗷": [ 400, 400 ], "嘖": [ 408, 400 ], "嗾": [ 416, 400 ], "嗽": [ 424, 400 ], "嘛": [ 432, 400 ], "嗹": [ 440, 400 ], "噎": [ 448, 400 ], "噐": [ 456, 400 ], "營": [ 464, 400 ], "嘴": [ 472, 400 ], "嘶": [ 480, 400 ], "嘲": [ 488, 400 ], "嘸": [ 496, 400 ], "噫": [ 504, 400 ], "噤": [ 512, 400 ], "嘯": [ 520, 400 ], "噬": [ 528, 400 ], "噪": [ 536, 400 ], "嚆": [ 544, 400 ], "嚀": [ 552, 400 ], "嚊": [ 560, 400 ], "嚠": [ 568, 400 ], "嚔": [ 576, 400 ], "嚏": [ 584, 400 ], "嚥": [ 592, 400 ], "嚮": [ 600, 400 ], "嚶": [ 608, 400 ], "嚴": [ 616, 400 ], "囂": [ 624, 400 ], "嚼": [ 632, 400 ], "囁": [ 640, 400 ], "囃": [ 648, 400 ], "囀": [ 656, 400 ], "囈": [ 664, 400 ], "囎": [ 672, 400 ], "囑": [ 680, 400 ], "囓": [ 688, 400 ], "囗": [ 696, 400 ], "囮": [ 704, 400 ], "囹": [ 712, 400 ], "圀": [ 720, 400 ], "囿": [ 728, 400 ], "圄": [ 736, 400 ], "圉": [ 744, 400 ], "圈": [ 0, 408 ], "國": [ 8, 408 ], "圍": [ 16, 408 ], "圓": [ 24, 408 ], "團": [ 32, 408 ], "圖": [ 40, 408 ], "嗇": [ 48, 408 ], "圜": [ 56, 408 ], "圦": [ 64, 408 ], "圷": [ 72, 408 ], "圸": [ 80, 408 ], "坎": [ 88, 408 ], "圻": [ 96, 408 ], "址": [ 104, 408 ], "坏": [ 112, 408 ], "坩": [ 120, 408 ], "埀": [ 128, 408 ], "垈": [ 136, 408 ], "坡": [ 144, 408 ], "坿": [ 152, 408 ], "垉": [ 160, 408 ], "垓": [ 168, 408 ], "垠": [ 176, 408 ], "垳": [ 184, 408 ], "垤": [ 192, 408 ], "垪": [ 200, 408 ], "垰": [ 208, 408 ], "埃": [ 216, 408 ], "埆": [ 224, 408 ], "埔": [ 232, 408 ], "埒": [ 240, 408 ], "埓": [ 248, 408 ], "堊": [ 256, 408 ], "埖": [ 264, 408 ], "埣": [ 272, 408 ], "堋": [ 280, 408 ], "堙": [ 288, 408 ], "堝": [ 296, 408 ], "塲": [ 304, 408 ], "堡": [ 312, 408 ], "塢": [ 320, 408 ], "塋": [ 328, 408 ], "塰": [ 336, 408 ], "毀": [ 344, 408 ], "塒": [ 352, 408 ], "堽": [ 360, 408 ], "塹": [ 368, 408 ], "墅": [ 376, 408 ], "墹": [ 384, 408 ], "墟": [ 392, 408 ], "墫": [ 400, 408 ], "墺": [ 408, 408 ], "壞": [ 416, 408 ], "墻": [ 424, 408 ], "墸": [ 432, 408 ], "墮": [ 440, 408 ], "壅": [ 448, 408 ], "壓": [ 456, 408 ], "壑": [ 464, 408 ], "壗": [ 472, 408 ], "壙": [ 480, 408 ], "壘": [ 488, 408 ], "壥": [ 496, 408 ], "壜": [ 504, 408 ], "壤": [ 512, 408 ], "壟": [ 520, 408 ], "壯": [ 528, 408 ], "壺": [ 536, 408 ], "壹": [ 544, 408 ], "壻": [ 552, 408 ], "壼": [ 560, 408 ], "壽": [ 568, 408 ], "夂": [ 576, 408 ], "夊": [ 584, 408 ], "夐": [ 592, 408 ], "夛": [ 600, 408 ], "梦": [ 608, 408 ], "夥": [ 616, 408 ], "夬": [ 624, 408 ], "夭": [ 632, 408 ], "夲": [ 640, 408 ], "夸": [ 648, 408 ], "夾": [ 656, 408 ], "竒": [ 664, 408 ], "奕": [ 672, 408 ], "奐": [ 680, 408 ], "奎": [ 688, 408 ], "奚": [ 696, 408 ], "奘": [ 704, 408 ], "奢": [ 712, 408 ], "奠": [ 720, 408 ], "奧": [ 728, 408 ], "奬": [ 736, 408 ], "奩": [ 744, 408 ], "奸": [ 0, 416 ], "妁": [ 8, 416 ], "妝": [ 16, 416 ], "佞": [ 24, 416 ], "侫": [ 32, 416 ], "妣": [ 40, 416 ], "妲": [ 48, 416 ], "姆": [ 56, 416 ], "姨": [ 64, 416 ], "姜": [ 72, 416 ], "妍": [ 80, 416 ], "姙": [ 88, 416 ], "姚": [ 96, 416 ], "娥": [ 104, 416 ], "娟": [ 112, 416 ], "娑": [ 120, 416 ], "娜": [ 128, 416 ], "娉": [ 136, 416 ], "娚": [ 144, 416 ], "婀": [ 152, 416 ], "婬": [ 160, 416 ], "婉": [ 168, 416 ], "娵": [ 176, 416 ], "娶": [ 184, 416 ], "婢": [ 192, 416 ], "婪": [ 200, 416 ], "媚": [ 208, 416 ], "媼": [ 216, 416 ], "媾": [ 224, 416 ], "嫋": [ 232, 416 ], "嫂": [ 240, 416 ], "媽": [ 248, 416 ], "嫣": [ 256, 416 ], "嫗": [ 264, 416 ], "嫦": [ 272, 416 ], "嫩": [ 280, 416 ], "嫖": [ 288, 416 ], "嫺": [ 296, 416 ], "嫻": [ 304, 416 ], "嬌": [ 312, 416 ], "嬋": [ 320, 416 ], "嬖": [ 328, 416 ], "嬲": [ 336, 416 ], "嫐": [ 344, 416 ], "嬪": [ 352, 416 ], "嬶": [ 360, 416 ], "嬾": [ 368, 416 ], "孃": [ 376, 416 ], "孅": [ 384, 416 ], "孀": [ 392, 416 ], "孑": [ 400, 416 ], "孕": [ 408, 416 ], "孚": [ 416, 416 ], "孛": [ 424, 416 ], "孥": [ 432, 416 ], "孩": [ 440, 416 ], "孰": [ 448, 416 ], "孳": [ 456, 416 ], "孵": [ 464, 416 ], "學": [ 472, 416 ], "斈": [ 480, 416 ], "孺": [ 488, 416 ], "宀": [ 496, 416 ], "它": [ 504, 416 ], "宦": [ 512, 416 ], "宸": [ 520, 416 ], "寃": [ 528, 416 ], "寇": [ 536, 416 ], "寉": [ 544, 416 ], "寔": [ 552, 416 ], "寐": [ 560, 416 ], "寤": [ 568, 416 ], "實": [ 576, 416 ], "寢": [ 584, 416 ], "寞": [ 592, 416 ], "寥": [ 600, 416 ], "寫": [ 608, 416 ], "寰": [ 616, 416 ], "寶": [ 624, 416 ], "寳": [ 632, 416 ], "尅": [ 640, 416 ], "將": [ 648, 416 ], "專": [ 656, 416 ], "對": [ 664, 416 ], "尓": [ 672, 416 ], "尠": [ 680, 416 ], "尢": [ 688, 416 ], "尨": [ 696, 416 ], "尸": [ 704, 416 ], "尹": [ 712, 416 ], "屁": [ 720, 416 ], "屆": [ 728, 416 ], "屎": [ 736, 416 ], "屓": [ 744, 416 ], "屐": [ 0, 424 ], "屏": [ 8, 424 ], "孱": [ 16, 424 ], "屬": [ 24, 424 ], "屮": [ 32, 424 ], "乢": [ 40, 424 ], "屶": [ 48, 424 ], "屹": [ 56, 424 ], "岌": [ 64, 424 ], "岑": [ 72, 424 ], "岔": [ 80, 424 ], "妛": [ 88, 424 ], "岫": [ 96, 424 ], "岻": [ 104, 424 ], "岶": [ 112, 424 ], "岼": [ 120, 424 ], "岷": [ 128, 424 ], "峅": [ 136, 424 ], "岾": [ 144, 424 ], "峇": [ 152, 424 ], "峙": [ 160, 424 ], "峩": [ 168, 424 ], "峽": [ 176, 424 ], "峺": [ 184, 424 ], "峭": [ 192, 424 ], "嶌": [ 200, 424 ], "峪": [ 208, 424 ], "崋": [ 216, 424 ], "崕": [ 224, 424 ], "崗": [ 232, 424 ], "嵜": [ 240, 424 ], "崟": [ 248, 424 ], "崛": [ 256, 424 ], "崑": [ 264, 424 ], "崔": [ 272, 424 ], "崢": [ 280, 424 ], "崚": [ 288, 424 ], "崙": [ 296, 424 ], "崘": [ 304, 424 ], "嵌": [ 312, 424 ], "嵒": [ 320, 424 ], "嵎": [ 328, 424 ], "嵋": [ 336, 424 ], "嵬": [ 344, 424 ], "嵳": [ 352, 424 ], "嵶": [ 360, 424 ], "嶇": [ 368, 424 ], "嶄": [ 376, 424 ], "嶂": [ 384, 424 ], "嶢": [ 392, 424 ], "嶝": [ 400, 424 ], "嶬": [ 408, 424 ], "嶮": [ 416, 424 ], "嶽": [ 424, 424 ], "嶐": [ 432, 424 ], "嶷": [ 440, 424 ], "嶼": [ 448, 424 ], "巉": [ 456, 424 ], "巍": [ 464, 424 ], "巓": [ 472, 424 ], "巒": [ 480, 424 ], "巖": [ 488, 424 ], "巛": [ 496, 424 ], "巫": [ 504, 424 ], "已": [ 512, 424 ], "巵": [ 520, 424 ], "帋": [ 528, 424 ], "帚": [ 536, 424 ], "帙": [ 544, 424 ], "帑": [ 552, 424 ], "帛": [ 560, 424 ], "帶": [ 568, 424 ], "帷": [ 576, 424 ], "幄": [ 584, 424 ], "幃": [ 592, 424 ], "幀": [ 600, 424 ], "幎": [ 608, 424 ], "幗": [ 616, 424 ], "幔": [ 624, 424 ], "幟": [ 632, 424 ], "幢": [ 640, 424 ], "幤": [ 648, 424 ], "幇": [ 656, 424 ], "幵": [ 664, 424 ], "并": [ 672, 424 ], "幺": [ 680, 424 ], "麼": [ 688, 424 ], "广": [ 696, 424 ], "庠": [ 704, 424 ], "廁": [ 712, 424 ], "廂": [ 720, 424 ], "廈": [ 728, 424 ], "廐": [ 736, 424 ], "廏": [ 744, 424 ], "廖": [ 0, 432 ], "廣": [ 8, 432 ], "廝": [ 16, 432 ], "廚": [ 24, 432 ], "廛": [ 32, 432 ], "廢": [ 40, 432 ], "廡": [ 48, 432 ], "廨": [ 56, 432 ], "廩": [ 64, 432 ], "廬": [ 72, 432 ], "廱": [ 80, 432 ], "廳": [ 88, 432 ], "廰": [ 96, 432 ], "廴": [ 104, 432 ], "廸": [ 112, 432 ], "廾": [ 120, 432 ], "弃": [ 128, 432 ], "弉": [ 136, 432 ], "彝": [ 144, 432 ], "彜": [ 152, 432 ], "弋": [ 160, 432 ], "弑": [ 168, 432 ], "弖": [ 176, 432 ], "弩": [ 184, 432 ], "弭": [ 192, 432 ], "弸": [ 200, 432 ], "彁": [ 208, 432 ], "彈": [ 216, 432 ], "彌": [ 224, 432 ], "彎": [ 232, 432 ], "弯": [ 240, 432 ], "彑": [ 248, 432 ], "彖": [ 256, 432 ], "彗": [ 264, 432 ], "彙": [ 272, 432 ], "彡": [ 280, 432 ], "彭": [ 288, 432 ], "彳": [ 296, 432 ], "彷": [ 304, 432 ], "徃": [ 312, 432 ], "徂": [ 320, 432 ], "彿": [ 328, 432 ], "徊": [ 336, 432 ], "很": [ 344, 432 ], "徑": [ 352, 432 ], "徇": [ 360, 432 ], "從": [ 368, 432 ], "徙": [ 376, 432 ], "徘": [ 384, 432 ], "徠": [ 392, 432 ], "徨": [ 400, 432 ], "徭": [ 408, 432 ], "徼": [ 416, 432 ], "忖": [ 424, 432 ], "忻": [ 432, 432 ], "忤": [ 440, 432 ], "忸": [ 448, 432 ], "忱": [ 456, 432 ], "忝": [ 464, 432 ], "悳": [ 472, 432 ], "忿": [ 480, 432 ], "怡": [ 488, 432 ], "恠": [ 496, 432 ], "怙": [ 504, 432 ], "怐": [ 512, 432 ], "怩": [ 520, 432 ], "怎": [ 528, 432 ], "怱": [ 536, 432 ], "怛": [ 544, 432 ], "怕": [ 552, 432 ], "怫": [ 560, 432 ], "怦": [ 568, 432 ], "怏": [ 576, 432 ], "怺": [ 584, 432 ], "恚": [ 592, 432 ], "恁": [ 600, 432 ], "恪": [ 608, 432 ], "恷": [ 616, 432 ], "恟": [ 624, 432 ], "恊": [ 632, 432 ], "恆": [ 640, 432 ], "恍": [ 648, 432 ], "恣": [ 656, 432 ], "恃": [ 664, 432 ], "恤": [ 672, 432 ], "恂": [ 680, 432 ], "恬": [ 688, 432 ], "恫": [ 696, 432 ], "恙": [ 704, 432 ], "悁": [ 712, 432 ], "悍": [ 720, 432 ], "惧": [ 728, 432 ], "悃": [ 736, 432 ], "悚": [ 744, 432 ], "悄": [ 0, 440 ], "悛": [ 8, 440 ], "悖": [ 16, 440 ], "悗": [ 24, 440 ], "悒": [ 32, 440 ], "悧": [ 40, 440 ], "悋": [ 48, 440 ], "惡": [ 56, 440 ], "悸": [ 64, 440 ], "惠": [ 72, 440 ], "惓": [ 80, 440 ], "悴": [ 88, 440 ], "忰": [ 96, 440 ], "悽": [ 104, 440 ], "惆": [ 112, 440 ], "悵": [ 120, 440 ], "惘": [ 128, 440 ], "慍": [ 136, 440 ], "愕": [ 144, 440 ], "愆": [ 152, 440 ], "惶": [ 160, 440 ], "惷": [ 168, 440 ], "愀": [ 176, 440 ], "惴": [ 184, 440 ], "惺": [ 192, 440 ], "愃": [ 200, 440 ], "愡": [ 208, 440 ], "惻": [ 216, 440 ], "惱": [ 224, 440 ], "愍": [ 232, 440 ], "愎": [ 240, 440 ], "慇": [ 248, 440 ], "愾": [ 256, 440 ], "愨": [ 264, 440 ], "愧": [ 272, 440 ], "慊": [ 280, 440 ], "愿": [ 288, 440 ], "愼": [ 296, 440 ], "愬": [ 304, 440 ], "愴": [ 312, 440 ], "愽": [ 320, 440 ], "慂": [ 328, 440 ], "慄": [ 336, 440 ], "慳": [ 344, 440 ], "慷": [ 352, 440 ], "慘": [ 360, 440 ], "慙": [ 368, 440 ], "慚": [ 376, 440 ], "慫": [ 384, 440 ], "慴": [ 392, 440 ], "慯": [ 400, 440 ], "慥": [ 408, 440 ], "慱": [ 416, 440 ], "慟": [ 424, 440 ], "慝": [ 432, 440 ], "慓": [ 440, 440 ], "慵": [ 448, 440 ], "憙": [ 456, 440 ], "憖": [ 464, 440 ], "憇": [ 472, 440 ], "憬": [ 480, 440 ], "憔": [ 488, 440 ], "憚": [ 496, 440 ], "憊": [ 504, 440 ], "憑": [ 512, 440 ], "憫": [ 520, 440 ], "憮": [ 528, 440 ], "懌": [ 536, 440 ], "懊": [ 544, 440 ], "應": [ 552, 440 ], "懷": [ 560, 440 ], "懈": [ 568, 440 ], "懃": [ 576, 440 ], "懆": [ 584, 440 ], "憺": [ 592, 440 ], "懋": [ 600, 440 ], "罹": [ 608, 440 ], "懍": [ 616, 440 ], "懦": [ 624, 440 ], "懣": [ 632, 440 ], "懶": [ 640, 440 ], "懺": [ 648, 440 ], "懴": [ 656, 440 ], "懿": [ 664, 440 ], "懽": [ 672, 440 ], "懼": [ 680, 440 ], "懾": [ 688, 440 ], "戀": [ 696, 440 ], "戈": [ 704, 440 ], "戉": [ 712, 440 ], "戍": [ 720, 440 ], "戌": [ 728, 440 ], "戔": [ 736, 440 ], "戛": [ 744, 440 ], "戞": [ 0, 448 ], "戡": [ 8, 448 ], "截": [ 16, 448 ], "戮": [ 24, 448 ], "戰": [ 32, 448 ], "戲": [ 40, 448 ], "戳": [ 48, 448 ], "扁": [ 56, 448 ], "扎": [ 64, 448 ], "扞": [ 72, 448 ], "扣": [ 80, 448 ], "扛": [ 88, 448 ], "扠": [ 96, 448 ], "扨": [ 104, 448 ], "扼": [ 112, 448 ], "抂": [ 120, 448 ], "抉": [ 128, 448 ], "找": [ 136, 448 ], "抒": [ 144, 448 ], "抓": [ 152, 448 ], "抖": [ 160, 448 ], "拔": [ 168, 448 ], "抃": [ 176, 448 ], "抔": [ 184, 448 ], "拗": [ 192, 448 ], "拑": [ 200, 448 ], "抻": [ 208, 448 ], "拏": [ 216, 448 ], "拿": [ 224, 448 ], "拆": [ 232, 448 ], "擔": [ 240, 448 ], "拈": [ 248, 448 ], "拜": [ 256, 448 ], "拌": [ 264, 448 ], "拊": [ 272, 448 ], "拂": [ 280, 448 ], "拇": [ 288, 448 ], "抛": [ 296, 448 ], "拉": [ 304, 448 ], "挌": [ 312, 448 ], "拮": [ 320, 448 ], "拱": [ 328, 448 ], "挧": [ 336, 448 ], "挂": [ 344, 448 ], "挈": [ 352, 448 ], "拯": [ 360, 448 ], "拵": [ 368, 448 ], "捐": [ 376, 448 ], "挾": [ 384, 448 ], "捍": [ 392, 448 ], "搜": [ 400, 448 ], "捏": [ 408, 448 ], "掖": [ 416, 448 ], "掎": [ 424, 448 ], "掀": [ 432, 448 ], "掫": [ 440, 448 ], "捶": [ 448, 448 ], "掣": [ 456, 448 ], "掏": [ 464, 448 ], "掉": [ 472, 448 ], "掟": [ 480, 448 ], "掵": [ 488, 448 ], "捫": [ 496, 448 ], "捩": [ 504, 448 ], "掾": [ 512, 448 ], "揩": [ 520, 448 ], "揀": [ 528, 448 ], "揆": [ 536, 448 ], "揣": [ 544, 448 ], "揉": [ 552, 448 ], "插": [ 560, 448 ], "揶": [ 568, 448 ], "揄": [ 576, 448 ], "搖": [ 584, 448 ], "搴": [ 592, 448 ], "搆": [ 600, 448 ], "搓": [ 608, 448 ], "搦": [ 616, 448 ], "搶": [ 624, 448 ], "攝": [ 632, 448 ], "搗": [ 640, 448 ], "搨": [ 648, 448 ], "搏": [ 656, 448 ], "摧": [ 664, 448 ], "摯": [ 672, 448 ], "摶": [ 680, 448 ], "摎": [ 688, 448 ], "攪": [ 696, 448 ], "撕": [ 704, 448 ], "撓": [ 712, 448 ], "撥": [ 720, 448 ], "撩": [ 728, 448 ], "撈": [ 736, 448 ], "撼": [ 744, 448 ], "據": [ 0, 456 ], "擒": [ 8, 456 ], "擅": [ 16, 456 ], "擇": [ 24, 456 ], "撻": [ 32, 456 ], "擘": [ 40, 456 ], "擂": [ 48, 456 ], "擱": [ 56, 456 ], "擧": [ 64, 456 ], "舉": [ 72, 456 ], "擠": [ 80, 456 ], "擡": [ 88, 456 ], "抬": [ 96, 456 ], "擣": [ 104, 456 ], "擯": [ 112, 456 ], "攬": [ 120, 456 ], "擶": [ 128, 456 ], "擴": [ 136, 456 ], "擲": [ 144, 456 ], "擺": [ 152, 456 ], "攀": [ 160, 456 ], "擽": [ 168, 456 ], "攘": [ 176, 456 ], "攜": [ 184, 456 ], "攅": [ 192, 456 ], "攤": [ 200, 456 ], "攣": [ 208, 456 ], "攫": [ 216, 456 ], "攴": [ 224, 456 ], "攵": [ 232, 456 ], "攷": [ 240, 456 ], "收": [ 248, 456 ], "攸": [ 256, 456 ], "畋": [ 264, 456 ], "效": [ 272, 456 ], "敖": [ 280, 456 ], "敕": [ 288, 456 ], "敍": [ 296, 456 ], "敘": [ 304, 456 ], "敞": [ 312, 456 ], "敝": [ 320, 456 ], "敲": [ 328, 456 ], "數": [ 336, 456 ], "斂": [ 344, 456 ], "斃": [ 352, 456 ], "變": [ 360, 456 ], "斛": [ 368, 456 ], "斟": [ 376, 456 ], "斫": [ 384, 456 ], "斷": [ 392, 456 ], "旃": [ 400, 456 ], "旆": [ 408, 456 ], "旁": [ 416, 456 ], "旄": [ 424, 456 ], "旌": [ 432, 456 ], "旒": [ 440, 456 ], "旛": [ 448, 456 ], "旙": [ 456, 456 ], "无": [ 464, 456 ], "旡": [ 472, 456 ], "旱": [ 480, 456 ], "杲": [ 488, 456 ], "昊": [ 496, 456 ], "昃": [ 504, 456 ], "旻": [ 512, 456 ], "杳": [ 520, 456 ], "昵": [ 528, 456 ], "昶": [ 536, 456 ], "昴": [ 544, 456 ], "昜": [ 552, 456 ], "晏": [ 560, 456 ], "晄": [ 568, 456 ], "晉": [ 576, 456 ], "晁": [ 584, 456 ], "晞": [ 592, 456 ], "晝": [ 600, 456 ], "晤": [ 608, 456 ], "晧": [ 616, 456 ], "晨": [ 624, 456 ], "晟": [ 632, 456 ], "晢": [ 640, 456 ], "晰": [ 648, 456 ], "暃": [ 656, 456 ], "暈": [ 664, 456 ], "暎": [ 672, 456 ], "暉": [ 680, 456 ], "暄": [ 688, 456 ], "暘": [ 696, 456 ], "暝": [ 704, 456 ], "曁": [ 712, 456 ], "暹": [ 720, 456 ], "曉": [ 728, 456 ], "暾": [ 736, 456 ], "暼": [ 744, 456 ], "曄": [ 0, 464 ], "暸": [ 8, 464 ], "曖": [ 16, 464 ], "曚": [ 24, 464 ], "曠": [ 32, 464 ], "昿": [ 40, 464 ], "曦": [ 48, 464 ], "曩": [ 56, 464 ], "曰": [ 64, 464 ], "曵": [ 72, 464 ], "曷": [ 80, 464 ], "朏": [ 88, 464 ], "朖": [ 96, 464 ], "朞": [ 104, 464 ], "朦": [ 112, 464 ], "朧": [ 120, 464 ], "霸": [ 128, 464 ], "朮": [ 136, 464 ], "朿": [ 144, 464 ], "朶": [ 152, 464 ], "杁": [ 160, 464 ], "朸": [ 168, 464 ], "朷": [ 176, 464 ], "杆": [ 184, 464 ], "杞": [ 192, 464 ], "杠": [ 200, 464 ], "杙": [ 208, 464 ], "杣": [ 216, 464 ], "杤": [ 224, 464 ], "枉": [ 232, 464 ], "杰": [ 240, 464 ], "枩": [ 248, 464 ], "杼": [ 256, 464 ], "杪": [ 264, 464 ], "枌": [ 272, 464 ], "枋": [ 280, 464 ], "枦": [ 288, 464 ], "枡": [ 296, 464 ], "枅": [ 304, 464 ], "枷": [ 312, 464 ], "柯": [ 320, 464 ], "枴": [ 328, 464 ], "柬": [ 336, 464 ], "枳": [ 344, 464 ], "柩": [ 352, 464 ], "枸": [ 360, 464 ], "柤": [ 368, 464 ], "柞": [ 376, 464 ], "柝": [ 384, 464 ], "柢": [ 392, 464 ], "柮": [ 400, 464 ], "枹": [ 408, 464 ], "柎": [ 416, 464 ], "柆": [ 424, 464 ], "柧": [ 432, 464 ], "檜": [ 440, 464 ], "栞": [ 448, 464 ], "框": [ 456, 464 ], "栩": [ 464, 464 ], "桀": [ 472, 464 ], "桍": [ 480, 464 ], "栲": [ 488, 464 ], "桎": [ 496, 464 ], "梳": [ 504, 464 ], "栫": [ 512, 464 ], "桙": [ 520, 464 ], "档": [ 528, 464 ], "桷": [ 536, 464 ], "桿": [ 544, 464 ], "梟": [ 552, 464 ], "梏": [ 560, 464 ], "梭": [ 568, 464 ], "梔": [ 576, 464 ], "條": [ 584, 464 ], "梛": [ 592, 464 ], "梃": [ 600, 464 ], "檮": [ 608, 464 ], "梹": [ 616, 464 ], "桴": [ 624, 464 ], "梵": [ 632, 464 ], "梠": [ 640, 464 ], "梺": [ 648, 464 ], "椏": [ 656, 464 ], "梍": [ 664, 464 ], "桾": [ 672, 464 ], "椁": [ 680, 464 ], "棊": [ 688, 464 ], "椈": [ 696, 464 ], "棘": [ 704, 464 ], "椢": [ 712, 464 ], "椦": [ 720, 464 ], "棡": [ 728, 464 ], "椌": [ 736, 464 ], "棍": [ 744, 464 ], "棔": [ 0, 472 ], "棧": [ 8, 472 ], "棕": [ 16, 472 ], "椶": [ 24, 472 ], "椒": [ 32, 472 ], "椄": [ 40, 472 ], "棗": [ 48, 472 ], "棣": [ 56, 472 ], "椥": [ 64, 472 ], "棹": [ 72, 472 ], "棠": [ 80, 472 ], "棯": [ 88, 472 ], "椨": [ 96, 472 ], "椪": [ 104, 472 ], "椚": [ 112, 472 ], "椣": [ 120, 472 ], "椡": [ 128, 472 ], "棆": [ 136, 472 ], "楹": [ 144, 472 ], "楷": [ 152, 472 ], "楜": [ 160, 472 ], "楸": [ 168, 472 ], "楫": [ 176, 472 ], "楔": [ 184, 472 ], "楾": [ 192, 472 ], "楮": [ 200, 472 ], "椹": [ 208, 472 ], "楴": [ 216, 472 ], "椽": [ 224, 472 ], "楙": [ 232, 472 ], "椰": [ 240, 472 ], "楡": [ 248, 472 ], "楞": [ 256, 472 ], "楝": [ 264, 472 ], "榁": [ 272, 472 ], "楪": [ 280, 472 ], "榲": [ 288, 472 ], "榮": [ 296, 472 ], "槐": [ 304, 472 ], "榿": [ 312, 472 ], "槁": [ 320, 472 ], "槓": [ 328, 472 ], "榾": [ 336, 472 ], "槎": [ 344, 472 ], "寨": [ 352, 472 ], "槊": [ 360, 472 ], "槝": [ 368, 472 ], "榻": [ 376, 472 ], "槃": [ 384, 472 ], "榧": [ 392, 472 ], "樮": [ 400, 472 ], "榑": [ 408, 472 ], "榠": [ 416, 472 ], "榜": [ 424, 472 ], "榕": [ 432, 472 ], "榴": [ 440, 472 ], "槞": [ 448, 472 ], "槨": [ 456, 472 ], "樂": [ 464, 472 ], "樛": [ 472, 472 ], "槿": [ 480, 472 ], "權": [ 488, 472 ], "槹": [ 496, 472 ], "槲": [ 504, 472 ], "槧": [ 512, 472 ], "樅": [ 520, 472 ], "榱": [ 528, 472 ], "樞": [ 536, 472 ], "槭": [ 544, 472 ], "樔": [ 552, 472 ], "槫": [ 560, 472 ], "樊": [ 568, 472 ], "樒": [ 576, 472 ], "櫁": [ 584, 472 ], "樣": [ 592, 472 ], "樓": [ 600, 472 ], "橄": [ 608, 472 ], "樌": [ 616, 472 ], "橲": [ 624, 472 ], "樶": [ 632, 472 ], "橸": [ 640, 472 ], "橇": [ 648, 472 ], "橢": [ 656, 472 ], "橙": [ 664, 472 ], "橦": [ 672, 472 ], "橈": [ 680, 472 ], "樸": [ 688, 472 ], "樢": [ 696, 472 ], "檐": [ 704, 472 ], "檍": [ 712, 472 ], "檠": [ 720, 472 ], "檄": [ 728, 472 ], "檢": [ 736, 472 ], "檣": [ 744, 472 ], "檗": [ 0, 480 ], "蘗": [ 8, 480 ], "檻": [ 16, 480 ], "櫃": [ 24, 480 ], "櫂": [ 32, 480 ], "檸": [ 40, 480 ], "檳": [ 48, 480 ], "檬": [ 56, 480 ], "櫞": [ 64, 480 ], "櫑": [ 72, 480 ], "櫟": [ 80, 480 ], "檪": [ 88, 480 ], "櫚": [ 96, 480 ], "櫪": [ 104, 480 ], "櫻": [ 112, 480 ], "欅": [ 120, 480 ], "蘖": [ 128, 480 ], "櫺": [ 136, 480 ], "欒": [ 144, 480 ], "欖": [ 152, 480 ], "鬱": [ 160, 480 ], "欟": [ 168, 480 ], "欸": [ 176, 480 ], "欷": [ 184, 480 ], "盜": [ 192, 480 ], "欹": [ 200, 480 ], "飮": [ 208, 480 ], "歇": [ 216, 480 ], "歃": [ 224, 480 ], "歉": [ 232, 480 ], "歐": [ 240, 480 ], "歙": [ 248, 480 ], "歔": [ 256, 480 ], "歛": [ 264, 480 ], "歟": [ 272, 480 ], "歡": [ 280, 480 ], "歸": [ 288, 480 ], "歹": [ 296, 480 ], "歿": [ 304, 480 ], "殀": [ 312, 480 ], "殄": [ 320, 480 ], "殃": [ 328, 480 ], "殍": [ 336, 480 ], "殘": [ 344, 480 ], "殕": [ 352, 480 ], "殞": [ 360, 480 ], "殤": [ 368, 480 ], "殪": [ 376, 480 ], "殫": [ 384, 480 ], "殯": [ 392, 480 ], "殲": [ 400, 480 ], "殱": [ 408, 480 ], "殳": [ 416, 480 ], "殷": [ 424, 480 ], "殼": [ 432, 480 ], "毆": [ 440, 480 ], "毋": [ 448, 480 ], "毓": [ 456, 480 ], "毟": [ 464, 480 ], "毬": [ 472, 480 ], "毫": [ 480, 480 ], "毳": [ 488, 480 ], "毯": [ 496, 480 ], "麾": [ 504, 480 ], "氈": [ 512, 480 ], "氓": [ 520, 480 ], "气": [ 528, 480 ], "氛": [ 536, 480 ], "氤": [ 544, 480 ], "氣": [ 552, 480 ], "汞": [ 560, 480 ], "汕": [ 568, 480 ], "汢": [ 576, 480 ], "汪": [ 584, 480 ], "沂": [ 592, 480 ], "沍": [ 600, 480 ], "沚": [ 608, 480 ], "沁": [ 616, 480 ], "沛": [ 624, 480 ], "汾": [ 632, 480 ], "汨": [ 640, 480 ], "汳": [ 648, 480 ], "沒": [ 656, 480 ], "沐": [ 664, 480 ], "泄": [ 672, 480 ], "泱": [ 680, 480 ], "泓": [ 688, 480 ], "沽": [ 696, 480 ], "泗": [ 704, 480 ], "泅": [ 712, 480 ], "泝": [ 720, 480 ], "沮": [ 728, 480 ], "沱": [ 736, 480 ], "沾": [ 744, 480 ], "沺": [ 0, 488 ], "泛": [ 8, 488 ], "泯": [ 16, 488 ], "泙": [ 24, 488 ], "泪": [ 32, 488 ], "洟": [ 40, 488 ], "衍": [ 48, 488 ], "洶": [ 56, 488 ], "洫": [ 64, 488 ], "洽": [ 72, 488 ], "洸": [ 80, 488 ], "洙": [ 88, 488 ], "洵": [ 96, 488 ], "洳": [ 104, 488 ], "洒": [ 112, 488 ], "洌": [ 120, 488 ], "浣": [ 128, 488 ], "涓": [ 136, 488 ], "浤": [ 144, 488 ], "浚": [ 152, 488 ], "浹": [ 160, 488 ], "浙": [ 168, 488 ], "涎": [ 176, 488 ], "涕": [ 184, 488 ], "濤": [ 192, 488 ], "涅": [ 200, 488 ], "淹": [ 208, 488 ], "渕": [ 216, 488 ], "渊": [ 224, 488 ], "涵": [ 232, 488 ], "淇": [ 240, 488 ], "淦": [ 248, 488 ], "涸": [ 256, 488 ], "淆": [ 264, 488 ], "淬": [ 272, 488 ], "淞": [ 280, 488 ], "淌": [ 288, 488 ], "淨": [ 296, 488 ], "淒": [ 304, 488 ], "淅": [ 312, 488 ], "淺": [ 320, 488 ], "淙": [ 328, 488 ], "淤": [ 336, 488 ], "淕": [ 344, 488 ], "淪": [ 352, 488 ], "淮": [ 360, 488 ], "渭": [ 368, 488 ], "湮": [ 376, 488 ], "渮": [ 384, 488 ], "渙": [ 392, 488 ], "湲": [ 400, 488 ], "湟": [ 408, 488 ], "渾": [ 416, 488 ], "渣": [ 424, 488 ], "湫": [ 432, 488 ], "渫": [ 440, 488 ], "湶": [ 448, 488 ], "湍": [ 456, 488 ], "渟": [ 464, 488 ], "湃": [ 472, 488 ], "渺": [ 480, 488 ], "湎": [ 488, 488 ], "渤": [ 496, 488 ], "滿": [ 504, 488 ], "渝": [ 512, 488 ], "游": [ 520, 488 ], "溂": [ 528, 488 ], "溪": [ 536, 488 ], "溘": [ 544, 488 ], "滉": [ 552, 488 ], "溷": [ 560, 488 ], "滓": [ 568, 488 ], "溽": [ 576, 488 ], "溯": [ 584, 488 ], "滄": [ 592, 488 ], "溲": [ 600, 488 ], "滔": [ 608, 488 ], "滕": [ 616, 488 ], "溏": [ 624, 488 ], "溥": [ 632, 488 ], "滂": [ 640, 488 ], "溟": [ 648, 488 ], "潁": [ 656, 488 ], "漑": [ 664, 488 ], "灌": [ 672, 488 ], "滬": [ 680, 488 ], "滸": [ 688, 488 ], "滾": [ 696, 488 ], "漿": [ 704, 488 ], "滲": [ 712, 488 ], "漱": [ 720, 488 ], "滯": [ 728, 488 ], "漲": [ 736, 488 ], "滌": [ 744, 488 ], "漾": [ 0, 496 ], "漓": [ 8, 496 ], "滷": [ 16, 496 ], "澆": [ 24, 496 ], "潺": [ 32, 496 ], "潸": [ 40, 496 ], "澁": [ 48, 496 ], "澀": [ 56, 496 ], "潯": [ 64, 496 ], "潛": [ 72, 496 ], "濳": [ 80, 496 ], "潭": [ 88, 496 ], "澂": [ 96, 496 ], "潼": [ 104, 496 ], "潘": [ 112, 496 ], "澎": [ 120, 496 ], "澑": [ 128, 496 ], "濂": [ 136, 496 ], "潦": [ 144, 496 ], "澳": [ 152, 496 ], "澣": [ 160, 496 ], "澡": [ 168, 496 ], "澤": [ 176, 496 ], "澹": [ 184, 496 ], "濆": [ 192, 496 ], "澪": [ 200, 496 ], "濟": [ 208, 496 ], "濕": [ 216, 496 ], "濬": [ 224, 496 ], "濔": [ 232, 496 ], "濘": [ 240, 496 ], "濱": [ 248, 496 ], "濮": [ 256, 496 ], "濛": [ 264, 496 ], "瀉": [ 272, 496 ], "瀋": [ 280, 496 ], "濺": [ 288, 496 ], "瀑": [ 296, 496 ], "瀁": [ 304, 496 ], "瀏": [ 312, 496 ], "濾": [ 320, 496 ], "瀛": [ 328, 496 ], "瀚": [ 336, 496 ], "潴": [ 344, 496 ], "瀝": [ 352, 496 ], "瀘": [ 360, 496 ], "瀟": [ 368, 496 ], "瀰": [ 376, 496 ], "瀾": [ 384, 496 ], "瀲": [ 392, 496 ], "灑": [ 400, 496 ], "灣": [ 408, 496 ], "炙": [ 416, 496 ], "炒": [ 424, 496 ], "炯": [ 432, 496 ], "烱": [ 440, 496 ], "炬": [ 448, 496 ], "炸": [ 456, 496 ], "炳": [ 464, 496 ], "炮": [ 472, 496 ], "烟": [ 480, 496 ], "烋": [ 488, 496 ], "烝": [ 496, 496 ], "烙": [ 504, 496 ], "焉": [ 512, 496 ], "烽": [ 520, 496 ], "焜": [ 528, 496 ], "焙": [ 536, 496 ], "煥": [ 544, 496 ], "煕": [ 552, 496 ], "熈": [ 560, 496 ], "煦": [ 568, 496 ], "煢": [ 576, 496 ], "煌": [ 584, 496 ], "煖": [ 592, 496 ], "煬": [ 600, 496 ], "熏": [ 608, 496 ], "燻": [ 616, 496 ], "熄": [ 624, 496 ], "熕": [ 632, 496 ], "熨": [ 640, 496 ], "熬": [ 648, 496 ], "燗": [ 656, 496 ], "熹": [ 664, 496 ], "熾": [ 672, 496 ], "燒": [ 680, 496 ], "燉": [ 688, 496 ], "燔": [ 696, 496 ], "燎": [ 704, 496 ], "燠": [ 712, 496 ], "燬": [ 720, 496 ], "燧": [ 728, 496 ], "燵": [ 736, 496 ], "燼": [ 744, 496 ], "燹": [ 0, 504 ], "燿": [ 8, 504 ], "爍": [ 16, 504 ], "爐": [ 24, 504 ], "爛": [ 32, 504 ], "爨": [ 40, 504 ], "爭": [ 48, 504 ], "爬": [ 56, 504 ], "爰": [ 64, 504 ], "爲": [ 72, 504 ], "爻": [ 80, 504 ], "爼": [ 88, 504 ], "爿": [ 96, 504 ], "牀": [ 104, 504 ], "牆": [ 112, 504 ], "牋": [ 120, 504 ], "牘": [ 128, 504 ], "牴": [ 136, 504 ], "牾": [ 144, 504 ], "犂": [ 152, 504 ], "犁": [ 160, 504 ], "犇": [ 168, 504 ], "犒": [ 176, 504 ], "犖": [ 184, 504 ], "犢": [ 192, 504 ], "犧": [ 200, 504 ], "犹": [ 208, 504 ], "犲": [ 216, 504 ], "狃": [ 224, 504 ], "狆": [ 232, 504 ], "狄": [ 240, 504 ], "狎": [ 248, 504 ], "狒": [ 256, 504 ], "狢": [ 264, 504 ], "狠": [ 272, 504 ], "狡": [ 280, 504 ], "狹": [ 288, 504 ], "狷": [ 296, 504 ], "倏": [ 304, 504 ], "猗": [ 312, 504 ], "猊": [ 320, 504 ], "猜": [ 328, 504 ], "猖": [ 336, 504 ], "猝": [ 344, 504 ], "猴": [ 352, 504 ], "猯": [ 360, 504 ], "猩": [ 368, 504 ], "猥": [ 376, 504 ], "猾": [ 384, 504 ], "獎": [ 392, 504 ], "獏": [ 400, 504 ], "默": [ 408, 504 ], "獗": [ 416, 504 ], "獪": [ 424, 504 ], "獨": [ 432, 504 ], "獰": [ 440, 504 ], "獸": [ 448, 504 ], "獵": [ 456, 504 ], "獻": [ 464, 504 ], "獺": [ 472, 504 ], "珈": [ 480, 504 ], "玳": [ 488, 504 ], "珎": [ 496, 504 ], "玻": [ 504, 504 ], "珀": [ 512, 504 ], "珥": [ 520, 504 ], "珮": [ 528, 504 ], "珞": [ 536, 504 ], "璢": [ 544, 504 ], "琅": [ 552, 504 ], "瑯": [ 560, 504 ], "琥": [ 568, 504 ], "珸": [ 576, 504 ], "琲": [ 584, 504 ], "琺": [ 592, 504 ], "瑕": [ 600, 504 ], "琿": [ 608, 504 ], "瑟": [ 616, 504 ], "瑙": [ 624, 504 ], "瑁": [ 632, 504 ], "瑜": [ 640, 504 ], "瑩": [ 648, 504 ], "瑰": [ 656, 504 ], "瑣": [ 664, 504 ], "瑪": [ 672, 504 ], "瑶": [ 680, 504 ], "瑾": [ 688, 504 ], "璋": [ 696, 504 ], "璞": [ 704, 504 ], "璧": [ 712, 504 ], "瓊": [ 720, 504 ], "瓏": [ 728, 504 ], "瓔": [ 736, 504 ], "珱": [ 744, 504 ], "瓠": [ 0, 512 ], "瓣": [ 8, 512 ], "瓧": [ 16, 512 ], "瓩": [ 24, 512 ], "瓮": [ 32, 512 ], "瓲": [ 40, 512 ], "瓰": [ 48, 512 ], "瓱": [ 56, 512 ], "瓸": [ 64, 512 ], "瓷": [ 72, 512 ], "甄": [ 80, 512 ], "甃": [ 88, 512 ], "甅": [ 96, 512 ], "甌": [ 104, 512 ], "甎": [ 112, 512 ], "甍": [ 120, 512 ], "甕": [ 128, 512 ], "甓": [ 136, 512 ], "甞": [ 144, 512 ], "甦": [ 152, 512 ], "甬": [ 160, 512 ], "甼": [ 168, 512 ], "畄": [ 176, 512 ], "畍": [ 184, 512 ], "畊": [ 192, 512 ], "畉": [ 200, 512 ], "畛": [ 208, 512 ], "畆": [ 216, 512 ], "畚": [ 224, 512 ], "畩": [ 232, 512 ], "畤": [ 240, 512 ], "畧": [ 248, 512 ], "畫": [ 256, 512 ], "畭": [ 264, 512 ], "畸": [ 272, 512 ], "當": [ 280, 512 ], "疆": [ 288, 512 ], "疇": [ 296, 512 ], "畴": [ 304, 512 ], "疊": [ 312, 512 ], "疉": [ 320, 512 ], "疂": [ 328, 512 ], "疔": [ 336, 512 ], "疚": [ 344, 512 ], "疝": [ 352, 512 ], "疥": [ 360, 512 ], "疣": [ 368, 512 ], "痂": [ 376, 512 ], "疳": [ 384, 512 ], "痃": [ 392, 512 ], "疵": [ 400, 512 ], "疽": [ 408, 512 ], "疸": [ 416, 512 ], "疼": [ 424, 512 ], "疱": [ 432, 512 ], "痍": [ 440, 512 ], "痊": [ 448, 512 ], "痒": [ 456, 512 ], "痙": [ 464, 512 ], "痣": [ 472, 512 ], "痞": [ 480, 512 ], "痾": [ 488, 512 ], "痿": [ 496, 512 ], "痼": [ 504, 512 ], "瘁": [ 512, 512 ], "痰": [ 520, 512 ], "痺": [ 528, 512 ], "痲": [ 536, 512 ], "痳": [ 544, 512 ], "瘋": [ 552, 512 ], "瘍": [ 560, 512 ], "瘉": [ 568, 512 ], "瘟": [ 576, 512 ], "瘧": [ 584, 512 ], "瘠": [ 592, 512 ], "瘡": [ 600, 512 ], "瘢": [ 608, 512 ], "瘤": [ 616, 512 ], "瘴": [ 624, 512 ], "瘰": [ 632, 512 ], "瘻": [ 640, 512 ], "癇": [ 648, 512 ], "癈": [ 656, 512 ], "癆": [ 664, 512 ], "癜": [ 672, 512 ], "癘": [ 680, 512 ], "癡": [ 688, 512 ], "癢": [ 696, 512 ], "癨": [ 704, 512 ], "癩": [ 712, 512 ], "癪": [ 720, 512 ], "癧": [ 728, 512 ], "癬": [ 736, 512 ], "癰": [ 744, 512 ], "癲": [ 0, 520 ], "癶": [ 8, 520 ], "癸": [ 16, 520 ], "發": [ 24, 520 ], "皀": [ 32, 520 ], "皃": [ 40, 520 ], "皈": [ 48, 520 ], "皋": [ 56, 520 ], "皎": [ 64, 520 ], "皖": [ 72, 520 ], "皓": [ 80, 520 ], "皙": [ 88, 520 ], "皚": [ 96, 520 ], "皰": [ 104, 520 ], "皴": [ 112, 520 ], "皸": [ 120, 520 ], "皹": [ 128, 520 ], "皺": [ 136, 520 ], "盂": [ 144, 520 ], "盍": [ 152, 520 ], "盖": [ 160, 520 ], "盒": [ 168, 520 ], "盞": [ 176, 520 ], "盡": [ 184, 520 ], "盥": [ 192, 520 ], "盧": [ 200, 520 ], "盪": [ 208, 520 ], "蘯": [ 216, 520 ], "盻": [ 224, 520 ], "眈": [ 232, 520 ], "眇": [ 240, 520 ], "眄": [ 248, 520 ], "眩": [ 256, 520 ], "眤": [ 264, 520 ], "眞": [ 272, 520 ], "眥": [ 280, 520 ], "眦": [ 288, 520 ], "眛": [ 296, 520 ], "眷": [ 304, 520 ], "眸": [ 312, 520 ], "睇": [ 320, 520 ], "睚": [ 328, 520 ], "睨": [ 336, 520 ], "睫": [ 344, 520 ], "睛": [ 352, 520 ], "睥": [ 360, 520 ], "睿": [ 368, 520 ], "睾": [ 376, 520 ], "睹": [ 384, 520 ], "瞎": [ 392, 520 ], "瞋": [ 400, 520 ], "瞑": [ 408, 520 ], "瞠": [ 416, 520 ], "瞞": [ 424, 520 ], "瞰": [ 432, 520 ], "瞶": [ 440, 520 ], "瞹": [ 448, 520 ], "瞿": [ 456, 520 ], "瞼": [ 464, 520 ], "瞽": [ 472, 520 ], "瞻": [ 480, 520 ], "矇": [ 488, 520 ], "矍": [ 496, 520 ], "矗": [ 504, 520 ], "矚": [ 512, 520 ], "矜": [ 520, 520 ], "矣": [ 528, 520 ], "矮": [ 536, 520 ], "矼": [ 544, 520 ], "砌": [ 552, 520 ], "砒": [ 560, 520 ], "礦": [ 568, 520 ], "砠": [ 576, 520 ], "礪": [ 584, 520 ], "硅": [ 592, 520 ], "碎": [ 600, 520 ], "硴": [ 608, 520 ], "碆": [ 616, 520 ], "硼": [ 624, 520 ], "碚": [ 632, 520 ], "碌": [ 640, 520 ], "碣": [ 648, 520 ], "碵": [ 656, 520 ], "碪": [ 664, 520 ], "碯": [ 672, 520 ], "磑": [ 680, 520 ], "磆": [ 688, 520 ], "磋": [ 696, 520 ], "磔": [ 704, 520 ], "碾": [ 712, 520 ], "碼": [ 720, 520 ], "磅": [ 728, 520 ], "磊": [ 736, 520 ], "磬": [ 744, 520 ], "磧": [ 0, 528 ], "磚": [ 8, 528 ], "磽": [ 16, 528 ], "磴": [ 24, 528 ], "礇": [ 32, 528 ], "礒": [ 40, 528 ], "礑": [ 48, 528 ], "礙": [ 56, 528 ], "礬": [ 64, 528 ], "礫": [ 72, 528 ], "祀": [ 80, 528 ], "祠": [ 88, 528 ], "祗": [ 96, 528 ], "祟": [ 104, 528 ], "祚": [ 112, 528 ], "祕": [ 120, 528 ], "祓": [ 128, 528 ], "祺": [ 136, 528 ], "祿": [ 144, 528 ], "禊": [ 152, 528 ], "禝": [ 160, 528 ], "禧": [ 168, 528 ], "齋": [ 176, 528 ], "禪": [ 184, 528 ], "禮": [ 192, 528 ], "禳": [ 200, 528 ], "禹": [ 208, 528 ], "禺": [ 216, 528 ], "秉": [ 224, 528 ], "秕": [ 232, 528 ], "秧": [ 240, 528 ], "秬": [ 248, 528 ], "秡": [ 256, 528 ], "秣": [ 264, 528 ], "稈": [ 272, 528 ], "稍": [ 280, 528 ], "稘": [ 288, 528 ], "稙": [ 296, 528 ], "稠": [ 304, 528 ], "稟": [ 312, 528 ], "禀": [ 320, 528 ], "稱": [ 328, 528 ], "稻": [ 336, 528 ], "稾": [ 344, 528 ], "稷": [ 352, 528 ], "穃": [ 360, 528 ], "穗": [ 368, 528 ], "穉": [ 376, 528 ], "穡": [ 384, 528 ], "穢": [ 392, 528 ], "穩": [ 400, 528 ], "龝": [ 408, 528 ], "穰": [ 416, 528 ], "穹": [ 424, 528 ], "穽": [ 432, 528 ], "窈": [ 440, 528 ], "窗": [ 448, 528 ], "窕": [ 456, 528 ], "窘": [ 464, 528 ], "窖": [ 472, 528 ], "窩": [ 480, 528 ], "竈": [ 488, 528 ], "窰": [ 496, 528 ], "窶": [ 504, 528 ], "竅": [ 512, 528 ], "竄": [ 520, 528 ], "窿": [ 528, 528 ], "邃": [ 536, 528 ], "竇": [ 544, 528 ], "竊": [ 552, 528 ], "竍": [ 560, 528 ], "竏": [ 568, 528 ], "竕": [ 576, 528 ], "竓": [ 584, 528 ], "站": [ 592, 528 ], "竚": [ 600, 528 ], "竝": [ 608, 528 ], "竡": [ 616, 528 ], "竢": [ 624, 528 ], "竦": [ 632, 528 ], "竭": [ 640, 528 ], "竰": [ 648, 528 ], "笂": [ 656, 528 ], "笏": [ 664, 528 ], "笊": [ 672, 528 ], "笆": [ 680, 528 ], "笳": [ 688, 528 ], "笘": [ 696, 528 ], "笙": [ 704, 528 ], "笞": [ 712, 528 ], "笵": [ 720, 528 ], "笨": [ 728, 528 ], "笶": [ 736, 528 ], "筐": [ 744, 528 ], "筺": [ 0, 536 ], "笄": [ 8, 536 ], "筍": [ 16, 536 ], "笋": [ 24, 536 ], "筌": [ 32, 536 ], "筅": [ 40, 536 ], "筵": [ 48, 536 ], "筥": [ 56, 536 ], "筴": [ 64, 536 ], "筧": [ 72, 536 ], "筰": [ 80, 536 ], "筱": [ 88, 536 ], "筬": [ 96, 536 ], "筮": [ 104, 536 ], "箝": [ 112, 536 ], "箘": [ 120, 536 ], "箟": [ 128, 536 ], "箍": [ 136, 536 ], "箜": [ 144, 536 ], "箚": [ 152, 536 ], "箋": [ 160, 536 ], "箒": [ 168, 536 ], "箏": [ 176, 536 ], "筝": [ 184, 536 ], "箙": [ 192, 536 ], "篋": [ 200, 536 ], "篁": [ 208, 536 ], "篌": [ 216, 536 ], "篏": [ 224, 536 ], "箴": [ 232, 536 ], "篆": [ 240, 536 ], "篝": [ 248, 536 ], "篩": [ 256, 536 ], "簑": [ 264, 536 ], "簔": [ 272, 536 ], "篦": [ 280, 536 ], "篥": [ 288, 536 ], "籠": [ 296, 536 ], "簀": [ 304, 536 ], "簇": [ 312, 536 ], "簓": [ 320, 536 ], "篳": [ 328, 536 ], "篷": [ 336, 536 ], "簗": [ 344, 536 ], "簍": [ 352, 536 ], "篶": [ 360, 536 ], "簣": [ 368, 536 ], "簧": [ 376, 536 ], "簪": [ 384, 536 ], "簟": [ 392, 536 ], "簷": [ 400, 536 ], "簫": [ 408, 536 ], "簽": [ 416, 536 ], "籌": [ 424, 536 ], "籃": [ 432, 536 ], "籔": [ 440, 536 ], "籏": [ 448, 536 ], "籀": [ 456, 536 ], "籐": [ 464, 536 ], "籘": [ 472, 536 ], "籟": [ 480, 536 ], "籤": [ 488, 536 ], "籖": [ 496, 536 ], "籥": [ 504, 536 ], "籬": [ 512, 536 ], "籵": [ 520, 536 ], "粃": [ 528, 536 ], "粐": [ 536, 536 ], "粤": [ 544, 536 ], "粭": [ 552, 536 ], "粢": [ 560, 536 ], "粫": [ 568, 536 ], "粡": [ 576, 536 ], "粨": [ 584, 536 ], "粳": [ 592, 536 ], "粲": [ 600, 536 ], "粱": [ 608, 536 ], "粮": [ 616, 536 ], "粹": [ 624, 536 ], "粽": [ 632, 536 ], "糀": [ 640, 536 ], "糅": [ 648, 536 ], "糂": [ 656, 536 ], "糘": [ 664, 536 ], "糒": [ 672, 536 ], "糜": [ 680, 536 ], "糢": [ 688, 536 ], "鬻": [ 696, 536 ], "糯": [ 704, 536 ], "糲": [ 712, 536 ], "糴": [ 720, 536 ], "糶": [ 728, 536 ], "糺": [ 736, 536 ], "紆": [ 744, 536 ], "紂": [ 0, 544 ], "紜": [ 8, 544 ], "紕": [ 16, 544 ], "紊": [ 24, 544 ], "絅": [ 32, 544 ], "絋": [ 40, 544 ], "紮": [ 48, 544 ], "紲": [ 56, 544 ], "紿": [ 64, 544 ], "紵": [ 72, 544 ], "絆": [ 80, 544 ], "絳": [ 88, 544 ], "絖": [ 96, 544 ], "絎": [ 104, 544 ], "絲": [ 112, 544 ], "絨": [ 120, 544 ], "絮": [ 128, 544 ], "絏": [ 136, 544 ], "絣": [ 144, 544 ], "經": [ 152, 544 ], "綉": [ 160, 544 ], "絛": [ 168, 544 ], "綏": [ 176, 544 ], "絽": [ 184, 544 ], "綛": [ 192, 544 ], "綺": [ 200, 544 ], "綮": [ 208, 544 ], "綣": [ 216, 544 ], "綵": [ 224, 544 ], "緇": [ 232, 544 ], "綽": [ 240, 544 ], "綫": [ 248, 544 ], "總": [ 256, 544 ], "綢": [ 264, 544 ], "綯": [ 272, 544 ], "緜": [ 280, 544 ], "綸": [ 288, 544 ], "綟": [ 296, 544 ], "綰": [ 304, 544 ], "緘": [ 312, 544 ], "緝": [ 320, 544 ], "緤": [ 328, 544 ], "緞": [ 336, 544 ], "緻": [ 344, 544 ], "緲": [ 352, 544 ], "緡": [ 360, 544 ], "縅": [ 368, 544 ], "縊": [ 376, 544 ], "縣": [ 384, 544 ], "縡": [ 392, 544 ], "縒": [ 400, 544 ], "縱": [ 408, 544 ], "縟": [ 416, 544 ], "縉": [ 424, 544 ], "縋": [ 432, 544 ], "縢": [ 440, 544 ], "繆": [ 448, 544 ], "繦": [ 456, 544 ], "縻": [ 464, 544 ], "縵": [ 472, 544 ], "縹": [ 480, 544 ], "繃": [ 488, 544 ], "縷": [ 496, 544 ], "縲": [ 504, 544 ], "縺": [ 512, 544 ], "繧": [ 520, 544 ], "繝": [ 528, 544 ], "繖": [ 536, 544 ], "繞": [ 544, 544 ], "繙": [ 552, 544 ], "繚": [ 560, 544 ], "繹": [ 568, 544 ], "繪": [ 576, 544 ], "繩": [ 584, 544 ], "繼": [ 592, 544 ], "繻": [ 600, 544 ], "纃": [ 608, 544 ], "緕": [ 616, 544 ], "繽": [ 624, 544 ], "辮": [ 632, 544 ], "繿": [ 640, 544 ], "纈": [ 648, 544 ], "纉": [ 656, 544 ], "續": [ 664, 544 ], "纒": [ 672, 544 ], "纐": [ 680, 544 ], "纓": [ 688, 544 ], "纔": [ 696, 544 ], "纖": [ 704, 544 ], "纎": [ 712, 544 ], "纛": [ 720, 544 ], "纜": [ 728, 544 ], "缸": [ 736, 544 ], "缺": [ 744, 544 ], "罅": [ 0, 552 ], "罌": [ 8, 552 ], "罍": [ 16, 552 ], "罎": [ 24, 552 ], "罐": [ 32, 552 ], "网": [ 40, 552 ], "罕": [ 48, 552 ], "罔": [ 56, 552 ], "罘": [ 64, 552 ], "罟": [ 72, 552 ], "罠": [ 80, 552 ], "罨": [ 88, 552 ], "罩": [ 96, 552 ], "罧": [ 104, 552 ], "罸": [ 112, 552 ], "羂": [ 120, 552 ], "羆": [ 128, 552 ], "羃": [ 136, 552 ], "羈": [ 144, 552 ], "羇": [ 152, 552 ], "羌": [ 160, 552 ], "羔": [ 168, 552 ], "羞": [ 176, 552 ], "羝": [ 184, 552 ], "羚": [ 192, 552 ], "羣": [ 200, 552 ], "羯": [ 208, 552 ], "羲": [ 216, 552 ], "羹": [ 224, 552 ], "羮": [ 232, 552 ], "羶": [ 240, 552 ], "羸": [ 248, 552 ], "譱": [ 256, 552 ], "翅": [ 264, 552 ], "翆": [ 272, 552 ], "翊": [ 280, 552 ], "翕": [ 288, 552 ], "翔": [ 296, 552 ], "翡": [ 304, 552 ], "翦": [ 312, 552 ], "翩": [ 320, 552 ], "翳": [ 328, 552 ], "翹": [ 336, 552 ], "飜": [ 344, 552 ], "耆": [ 352, 552 ], "耄": [ 360, 552 ], "耋": [ 368, 552 ], "耒": [ 376, 552 ], "耘": [ 384, 552 ], "耙": [ 392, 552 ], "耜": [ 400, 552 ], "耡": [ 408, 552 ], "耨": [ 416, 552 ], "耿": [ 424, 552 ], "耻": [ 432, 552 ], "聊": [ 440, 552 ], "聆": [ 448, 552 ], "聒": [ 456, 552 ], "聘": [ 464, 552 ], "聚": [ 472, 552 ], "聟": [ 480, 552 ], "聢": [ 488, 552 ], "聨": [ 496, 552 ], "聳": [ 504, 552 ], "聲": [ 512, 552 ], "聰": [ 520, 552 ], "聶": [ 528, 552 ], "聹": [ 536, 552 ], "聽": [ 544, 552 ], "聿": [ 552, 552 ], "肄": [ 560, 552 ], "肆": [ 568, 552 ], "肅": [ 576, 552 ], "肛": [ 584, 552 ], "肓": [ 592, 552 ], "肚": [ 600, 552 ], "肭": [ 608, 552 ], "冐": [ 616, 552 ], "肬": [ 624, 552 ], "胛": [ 632, 552 ], "胥": [ 640, 552 ], "胙": [ 648, 552 ], "胝": [ 656, 552 ], "胄": [ 664, 552 ], "胚": [ 672, 552 ], "胖": [ 680, 552 ], "脉": [ 688, 552 ], "胯": [ 696, 552 ], "胱": [ 704, 552 ], "脛": [ 712, 552 ], "脩": [ 720, 552 ], "脣": [ 728, 552 ], "脯": [ 736, 552 ], "腋": [ 744, 552 ], "隋": [ 0, 560 ], "腆": [ 8, 560 ], "脾": [ 16, 560 ], "腓": [ 24, 560 ], "腑": [ 32, 560 ], "胼": [ 40, 560 ], "腱": [ 48, 560 ], "腮": [ 56, 560 ], "腥": [ 64, 560 ], "腦": [ 72, 560 ], "腴": [ 80, 560 ], "膃": [ 88, 560 ], "膈": [ 96, 560 ], "膊": [ 104, 560 ], "膀": [ 112, 560 ], "膂": [ 120, 560 ], "膠": [ 128, 560 ], "膕": [ 136, 560 ], "膤": [ 144, 560 ], "膣": [ 152, 560 ], "腟": [ 160, 560 ], "膓": [ 168, 560 ], "膩": [ 176, 560 ], "膰": [ 184, 560 ], "膵": [ 192, 560 ], "膾": [ 200, 560 ], "膸": [ 208, 560 ], "膽": [ 216, 560 ], "臀": [ 224, 560 ], "臂": [ 232, 560 ], "膺": [ 240, 560 ], "臉": [ 248, 560 ], "臍": [ 256, 560 ], "臑": [ 264, 560 ], "臙": [ 272, 560 ], "臘": [ 280, 560 ], "臈": [ 288, 560 ], "臚": [ 296, 560 ], "臟": [ 304, 560 ], "臠": [ 312, 560 ], "臧": [ 320, 560 ], "臺": [ 328, 560 ], "臻": [ 336, 560 ], "臾": [ 344, 560 ], "舁": [ 352, 560 ], "舂": [ 360, 560 ], "舅": [ 368, 560 ], "與": [ 376, 560 ], "舊": [ 384, 560 ], "舍": [ 392, 560 ], "舐": [ 400, 560 ], "舖": [ 408, 560 ], "舩": [ 416, 560 ], "舫": [ 424, 560 ], "舸": [ 432, 560 ], "舳": [ 440, 560 ], "艀": [ 448, 560 ], "艙": [ 456, 560 ], "艘": [ 464, 560 ], "艝": [ 472, 560 ], "艚": [ 480, 560 ], "艟": [ 488, 560 ], "艤": [ 496, 560 ], "艢": [ 504, 560 ], "艨": [ 512, 560 ], "艪": [ 520, 560 ], "艫": [ 528, 560 ], "舮": [ 536, 560 ], "艱": [ 544, 560 ], "艷": [ 552, 560 ], "艸": [ 560, 560 ], "艾": [ 568, 560 ], "芍": [ 576, 560 ], "芒": [ 584, 560 ], "芫": [ 592, 560 ], "芟": [ 600, 560 ], "芻": [ 608, 560 ], "芬": [ 616, 560 ], "苡": [ 624, 560 ], "苣": [ 632, 560 ], "苟": [ 640, 560 ], "苒": [ 648, 560 ], "苴": [ 656, 560 ], "苳": [ 664, 560 ], "苺": [ 672, 560 ], "莓": [ 680, 560 ], "范": [ 688, 560 ], "苻": [ 696, 560 ], "苹": [ 704, 560 ], "苞": [ 712, 560 ], "茆": [ 720, 560 ], "苜": [ 728, 560 ], "茉": [ 736, 560 ], "苙": [ 744, 560 ], "茵": [ 0, 568 ], "茴": [ 8, 568 ], "茖": [ 16, 568 ], "茲": [ 24, 568 ], "茱": [ 32, 568 ], "荀": [ 40, 568 ], "茹": [ 48, 568 ], "荐": [ 56, 568 ], "荅": [ 64, 568 ], "茯": [ 72, 568 ], "茫": [ 80, 568 ], "茗": [ 88, 568 ], "茘": [ 96, 568 ], "莅": [ 104, 568 ], "莚": [ 112, 568 ], "莪": [ 120, 568 ], "莟": [ 128, 568 ], "莢": [ 136, 568 ], "莖": [ 144, 568 ], "茣": [ 152, 568 ], "莎": [ 160, 568 ], "莇": [ 168, 568 ], "莊": [ 176, 568 ], "荼": [ 184, 568 ], "莵": [ 192, 568 ], "荳": [ 200, 568 ], "荵": [ 208, 568 ], "莠": [ 216, 568 ], "莉": [ 224, 568 ], "莨": [ 232, 568 ], "菴": [ 240, 568 ], "萓": [ 248, 568 ], "菫": [ 256, 568 ], "菎": [ 264, 568 ], "菽": [ 272, 568 ], "萃": [ 280, 568 ], "菘": [ 288, 568 ], "萋": [ 296, 568 ], "菁": [ 304, 568 ], "菷": [ 312, 568 ], "萇": [ 320, 568 ], "菠": [ 328, 568 ], "菲": [ 336, 568 ], "萍": [ 344, 568 ], "萢": [ 352, 568 ], "萠": [ 360, 568 ], "莽": [ 368, 568 ], "萸": [ 376, 568 ], "蔆": [ 384, 568 ], "菻": [ 392, 568 ], "葭": [ 400, 568 ], "萪": [ 408, 568 ], "萼": [ 416, 568 ], "蕚": [ 424, 568 ], "蒄": [ 432, 568 ], "葷": [ 440, 568 ], "葫": [ 448, 568 ], "蒭": [ 456, 568 ], "葮": [ 464, 568 ], "蒂": [ 472, 568 ], "葩": [ 480, 568 ], "葆": [ 488, 568 ], "萬": [ 496, 568 ], "葯": [ 504, 568 ], "葹": [ 512, 568 ], "萵": [ 520, 568 ], "蓊": [ 528, 568 ], "葢": [ 536, 568 ], "蒹": [ 544, 568 ], "蒿": [ 552, 568 ], "蒟": [ 560, 568 ], "蓙": [ 568, 568 ], "蓍": [ 576, 568 ], "蒻": [ 584, 568 ], "蓚": [ 592, 568 ], "蓐": [ 600, 568 ], "蓁": [ 608, 568 ], "蓆": [ 616, 568 ], "蓖": [ 624, 568 ], "蒡": [ 632, 568 ], "蔡": [ 640, 568 ], "蓿": [ 648, 568 ], "蓴": [ 656, 568 ], "蔗": [ 664, 568 ], "蔘": [ 672, 568 ], "蔬": [ 680, 568 ], "蔟": [ 688, 568 ], "蔕": [ 696, 568 ], "蔔": [ 704, 568 ], "蓼": [ 712, 568 ], "蕀": [ 720, 568 ], "蕣": [ 728, 568 ], "蕘": [ 736, 568 ], "蕈": [ 744, 568 ], "蕁": [ 0, 576 ], "蘂": [ 8, 576 ], "蕋": [ 16, 576 ], "蕕": [ 24, 576 ], "薀": [ 32, 576 ], "薤": [ 40, 576 ], "薈": [ 48, 576 ], "薑": [ 56, 576 ], "薊": [ 64, 576 ], "薨": [ 72, 576 ], "蕭": [ 80, 576 ], "薔": [ 88, 576 ], "薛": [ 96, 576 ], "藪": [ 104, 576 ], "薇": [ 112, 576 ], "薜": [ 120, 576 ], "蕷": [ 128, 576 ], "蕾": [ 136, 576 ], "薐": [ 144, 576 ], "藉": [ 152, 576 ], "薺": [ 160, 576 ], "藏": [ 168, 576 ], "薹": [ 176, 576 ], "藐": [ 184, 576 ], "藕": [ 192, 576 ], "藝": [ 200, 576 ], "藥": [ 208, 576 ], "藜": [ 216, 576 ], "藹": [ 224, 576 ], "蘊": [ 232, 576 ], "蘓": [ 240, 576 ], "蘋": [ 248, 576 ], "藾": [ 256, 576 ], "藺": [ 264, 576 ], "蘆": [ 272, 576 ], "蘢": [ 280, 576 ], "蘚": [ 288, 576 ], "蘰": [ 296, 576 ], "蘿": [ 304, 576 ], "虍": [ 312, 576 ], "乕": [ 320, 576 ], "虔": [ 328, 576 ], "號": [ 336, 576 ], "虧": [ 344, 576 ], "虱": [ 352, 576 ], "蚓": [ 360, 576 ], "蚣": [ 368, 576 ], "蚩": [ 376, 576 ], "蚪": [ 384, 576 ], "蚋": [ 392, 576 ], "蚌": [ 400, 576 ], "蚶": [ 408, 576 ], "蚯": [ 416, 576 ], "蛄": [ 424, 576 ], "蛆": [ 432, 576 ], "蚰": [ 440, 576 ], "蛉": [ 448, 576 ], "蠣": [ 456, 576 ], "蚫": [ 464, 576 ], "蛔": [ 472, 576 ], "蛞": [ 480, 576 ], "蛩": [ 488, 576 ], "蛬": [ 496, 576 ], "蛟": [ 504, 576 ], "蛛": [ 512, 576 ], "蛯": [ 520, 576 ], "蜒": [ 528, 576 ], "蜆": [ 536, 576 ], "蜈": [ 544, 576 ], "蜀": [ 552, 576 ], "蜃": [ 560, 576 ], "蛻": [ 568, 576 ], "蜑": [ 576, 576 ], "蜉": [ 584, 576 ], "蜍": [ 592, 576 ], "蛹": [ 600, 576 ], "蜊": [ 608, 576 ], "蜴": [ 616, 576 ], "蜿": [ 624, 576 ], "蜷": [ 632, 576 ], "蜻": [ 640, 576 ], "蜥": [ 648, 576 ], "蜩": [ 656, 576 ], "蜚": [ 664, 576 ], "蝠": [ 672, 576 ], "蝟": [ 680, 576 ], "蝸": [ 688, 576 ], "蝌": [ 696, 576 ], "蝎": [ 704, 576 ], "蝴": [ 712, 576 ], "蝗": [ 720, 576 ], "蝨": [ 728, 576 ], "蝮": [ 736, 576 ], "蝙": [ 744, 576 ], "蝓": [ 0, 584 ], "蝣": [ 8, 584 ], "蝪": [ 16, 584 ], "蠅": [ 24, 584 ], "螢": [ 32, 584 ], "螟": [ 40, 584 ], "螂": [ 48, 584 ], "螯": [ 56, 584 ], "蟋": [ 64, 584 ], "螽": [ 72, 584 ], "蟀": [ 80, 584 ], "蟐": [ 88, 584 ], "雖": [ 96, 584 ], "螫": [ 104, 584 ], "蟄": [ 112, 584 ], "螳": [ 120, 584 ], "蟇": [ 128, 584 ], "蟆": [ 136, 584 ], "螻": [ 144, 584 ], "蟯": [ 152, 584 ], "蟲": [ 160, 584 ], "蟠": [ 168, 584 ], "蠏": [ 176, 584 ], "蠍": [ 184, 584 ], "蟾": [ 192, 584 ], "蟶": [ 200, 584 ], "蟷": [ 208, 584 ], "蠎": [ 216, 584 ], "蟒": [ 224, 584 ], "蠑": [ 232, 584 ], "蠖": [ 240, 584 ], "蠕": [ 248, 584 ], "蠢": [ 256, 584 ], "蠡": [ 264, 584 ], "蠱": [ 272, 584 ], "蠶": [ 280, 584 ], "蠹": [ 288, 584 ], "蠧": [ 296, 584 ], "蠻": [ 304, 584 ], "衄": [ 312, 584 ], "衂": [ 320, 584 ], "衒": [ 328, 584 ], "衙": [ 336, 584 ], "衞": [ 344, 584 ], "衢": [ 352, 584 ], "衫": [ 360, 584 ], "袁": [ 368, 584 ], "衾": [ 376, 584 ], "袞": [ 384, 584 ], "衵": [ 392, 584 ], "衽": [ 400, 584 ], "袵": [ 408, 584 ], "衲": [ 416, 584 ], "袂": [ 424, 584 ], "袗": [ 432, 584 ], "袒": [ 440, 584 ], "袮": [ 448, 584 ], "袙": [ 456, 584 ], "袢": [ 464, 584 ], "袍": [ 472, 584 ], "袤": [ 480, 584 ], "袰": [ 488, 584 ], "袿": [ 496, 584 ], "袱": [ 504, 584 ], "裃": [ 512, 584 ], "裄": [ 520, 584 ], "裔": [ 528, 584 ], "裘": [ 536, 584 ], "裙": [ 544, 584 ], "裝": [ 552, 584 ], "裹": [ 560, 584 ], "褂": [ 568, 584 ], "裼": [ 576, 584 ], "裴": [ 584, 584 ], "裨": [ 592, 584 ], "裲": [ 600, 584 ], "褄": [ 608, 584 ], "褌": [ 616, 584 ], "褊": [ 624, 584 ], "褓": [ 632, 584 ], "襃": [ 640, 584 ], "褞": [ 648, 584 ], "褥": [ 656, 584 ], "褪": [ 664, 584 ], "褫": [ 672, 584 ], "襁": [ 680, 584 ], "襄": [ 688, 584 ], "褻": [ 696, 584 ], "褶": [ 704, 584 ], "褸": [ 712, 584 ], "襌": [ 720, 584 ], "褝": [ 728, 584 ], "襠": [ 736, 584 ], "襞": [ 744, 584 ], "襦": [ 0, 592 ], "襤": [ 8, 592 ], "襭": [ 16, 592 ], "襪": [ 24, 592 ], "襯": [ 32, 592 ], "襴": [ 40, 592 ], "襷": [ 48, 592 ], "襾": [ 56, 592 ], "覃": [ 64, 592 ], "覈": [ 72, 592 ], "覊": [ 80, 592 ], "覓": [ 88, 592 ], "覘": [ 96, 592 ], "覡": [ 104, 592 ], "覩": [ 112, 592 ], "覦": [ 120, 592 ], "覬": [ 128, 592 ], "覯": [ 136, 592 ], "覲": [ 144, 592 ], "覺": [ 152, 592 ], "覽": [ 160, 592 ], "覿": [ 168, 592 ], "觀": [ 176, 592 ], "觚": [ 184, 592 ], "觜": [ 192, 592 ], "觝": [ 200, 592 ], "觧": [ 208, 592 ], "觴": [ 216, 592 ], "觸": [ 224, 592 ], "訃": [ 232, 592 ], "訖": [ 240, 592 ], "訐": [ 248, 592 ], "訌": [ 256, 592 ], "訛": [ 264, 592 ], "訝": [ 272, 592 ], "訥": [ 280, 592 ], "訶": [ 288, 592 ], "詁": [ 296, 592 ], "詛": [ 304, 592 ], "詒": [ 312, 592 ], "詆": [ 320, 592 ], "詈": [ 328, 592 ], "詼": [ 336, 592 ], "詭": [ 344, 592 ], "詬": [ 352, 592 ], "詢": [ 360, 592 ], "誅": [ 368, 592 ], "誂": [ 376, 592 ], "誄": [ 384, 592 ], "誨": [ 392, 592 ], "誡": [ 400, 592 ], "誑": [ 408, 592 ], "誥": [ 416, 592 ], "誦": [ 424, 592 ], "誚": [ 432, 592 ], "誣": [ 440, 592 ], "諄": [ 448, 592 ], "諍": [ 456, 592 ], "諂": [ 464, 592 ], "諚": [ 472, 592 ], "諫": [ 480, 592 ], "諳": [ 488, 592 ], "諧": [ 496, 592 ], "諤": [ 504, 592 ], "諱": [ 512, 592 ], "謔": [ 520, 592 ], "諠": [ 528, 592 ], "諢": [ 536, 592 ], "諷": [ 544, 592 ], "諞": [ 552, 592 ], "諛": [ 560, 592 ], "謌": [ 568, 592 ], "謇": [ 576, 592 ], "謚": [ 584, 592 ], "諡": [ 592, 592 ], "謖": [ 600, 592 ], "謐": [ 608, 592 ], "謗": [ 616, 592 ], "謠": [ 624, 592 ], "謳": [ 632, 592 ], "鞫": [ 640, 592 ], "謦": [ 648, 592 ], "謫": [ 656, 592 ], "謾": [ 664, 592 ], "謨": [ 672, 592 ], "譁": [ 680, 592 ], "譌": [ 688, 592 ], "譏": [ 696, 592 ], "譎": [ 704, 592 ], "證": [ 712, 592 ], "譖": [ 720, 592 ], "譛": [ 728, 592 ], "譚": [ 736, 592 ], "譫": [ 744, 592 ], "譟": [ 0, 600 ], "譬": [ 8, 600 ], "譯": [ 16, 600 ], "譴": [ 24, 600 ], "譽": [ 32, 600 ], "讀": [ 40, 600 ], "讌": [ 48, 600 ], "讎": [ 56, 600 ], "讒": [ 64, 600 ], "讓": [ 72, 600 ], "讖": [ 80, 600 ], "讙": [ 88, 600 ], "讚": [ 96, 600 ], "谺": [ 104, 600 ], "豁": [ 112, 600 ], "谿": [ 120, 600 ], "豈": [ 128, 600 ], "豌": [ 136, 600 ], "豎": [ 144, 600 ], "豐": [ 152, 600 ], "豕": [ 160, 600 ], "豢": [ 168, 600 ], "豬": [ 176, 600 ], "豸": [ 184, 600 ], "豺": [ 192, 600 ], "貂": [ 200, 600 ], "貉": [ 208, 600 ], "貅": [ 216, 600 ], "貊": [ 224, 600 ], "貍": [ 232, 600 ], "貎": [ 240, 600 ], "貔": [ 248, 600 ], "豼": [ 256, 600 ], "貘": [ 264, 600 ], "戝": [ 272, 600 ], "貭": [ 280, 600 ], "貪": [ 288, 600 ], "貽": [ 296, 600 ], "貲": [ 304, 600 ], "貳": [ 312, 600 ], "貮": [ 320, 600 ], "貶": [ 328, 600 ], "賈": [ 336, 600 ], "賁": [ 344, 600 ], "賤": [ 352, 600 ], "賣": [ 360, 600 ], "賚": [ 368, 600 ], "賽": [ 376, 600 ], "賺": [ 384, 600 ], "賻": [ 392, 600 ], "贄": [ 400, 600 ], "贅": [ 408, 600 ], "贊": [ 416, 600 ], "贇": [ 424, 600 ], "贏": [ 432, 600 ], "贍": [ 440, 600 ], "贐": [ 448, 600 ], "齎": [ 456, 600 ], "贓": [ 464, 600 ], "賍": [ 472, 600 ], "贔": [ 480, 600 ], "贖": [ 488, 600 ], "赧": [ 496, 600 ], "赭": [ 504, 600 ], "赱": [ 512, 600 ], "赳": [ 520, 600 ], "趁": [ 528, 600 ], "趙": [ 536, 600 ], "跂": [ 544, 600 ], "趾": [ 552, 600 ], "趺": [ 560, 600 ], "跏": [ 568, 600 ], "跚": [ 576, 600 ], "跖": [ 584, 600 ], "跌": [ 592, 600 ], "跛": [ 600, 600 ], "跋": [ 608, 600 ], "跪": [ 616, 600 ], "跫": [ 624, 600 ], "跟": [ 632, 600 ], "跣": [ 640, 600 ], "跼": [ 648, 600 ], "踈": [ 656, 600 ], "踉": [ 664, 600 ], "跿": [ 672, 600 ], "踝": [ 680, 600 ], "踞": [ 688, 600 ], "踐": [ 696, 600 ], "踟": [ 704, 600 ], "蹂": [ 712, 600 ], "踵": [ 720, 600 ], "踰": [ 728, 600 ], "踴": [ 736, 600 ], "蹊": [ 744, 600 ], "蹇": [ 0, 608 ], "蹉": [ 8, 608 ], "蹌": [ 16, 608 ], "蹐": [ 24, 608 ], "蹈": [ 32, 608 ], "蹙": [ 40, 608 ], "蹤": [ 48, 608 ], "蹠": [ 56, 608 ], "踪": [ 64, 608 ], "蹣": [ 72, 608 ], "蹕": [ 80, 608 ], "蹶": [ 88, 608 ], "蹲": [ 96, 608 ], "蹼": [ 104, 608 ], "躁": [ 112, 608 ], "躇": [ 120, 608 ], "躅": [ 128, 608 ], "躄": [ 136, 608 ], "躋": [ 144, 608 ], "躊": [ 152, 608 ], "躓": [ 160, 608 ], "躑": [ 168, 608 ], "躔": [ 176, 608 ], "躙": [ 184, 608 ], "躪": [ 192, 608 ], "躡": [ 200, 608 ], "躬": [ 208, 608 ], "躰": [ 216, 608 ], "軆": [ 224, 608 ], "躱": [ 232, 608 ], "躾": [ 240, 608 ], "軅": [ 248, 608 ], "軈": [ 256, 608 ], "軋": [ 264, 608 ], "軛": [ 272, 608 ], "軣": [ 280, 608 ], "軼": [ 288, 608 ], "軻": [ 296, 608 ], "軫": [ 304, 608 ], "軾": [ 312, 608 ], "輊": [ 320, 608 ], "輅": [ 328, 608 ], "輕": [ 336, 608 ], "輒": [ 344, 608 ], "輙": [ 352, 608 ], "輓": [ 360, 608 ], "輜": [ 368, 608 ], "輟": [ 376, 608 ], "輛": [ 384, 608 ], "輌": [ 392, 608 ], "輦": [ 400, 608 ], "輳": [ 408, 608 ], "輻": [ 416, 608 ], "輹": [ 424, 608 ], "轅": [ 432, 608 ], "轂": [ 440, 608 ], "輾": [ 448, 608 ], "轌": [ 456, 608 ], "轉": [ 464, 608 ], "轆": [ 472, 608 ], "轎": [ 480, 608 ], "轗": [ 488, 608 ], "轜": [ 496, 608 ], "轢": [ 504, 608 ], "轣": [ 512, 608 ], "轤": [ 520, 608 ], "辜": [ 528, 608 ], "辟": [ 536, 608 ], "辣": [ 544, 608 ], "辭": [ 552, 608 ], "辯": [ 560, 608 ], "辷": [ 568, 608 ], "迚": [ 576, 608 ], "迥": [ 584, 608 ], "迢": [ 592, 608 ], "迪": [ 600, 608 ], "迯": [ 608, 608 ], "邇": [ 616, 608 ], "迴": [ 624, 608 ], "逅": [ 632, 608 ], "迹": [ 640, 608 ], "迺": [ 648, 608 ], "逑": [ 656, 608 ], "逕": [ 664, 608 ], "逡": [ 672, 608 ], "逍": [ 680, 608 ], "逞": [ 688, 608 ], "逖": [ 696, 608 ], "逋": [ 704, 608 ], "逧": [ 712, 608 ], "逶": [ 720, 608 ], "逵": [ 728, 608 ], "逹": [ 736, 608 ], "迸": [ 744, 608 ], "遏": [ 0, 616 ], "遐": [ 8, 616 ], "遑": [ 16, 616 ], "遒": [ 24, 616 ], "逎": [ 32, 616 ], "遉": [ 40, 616 ], "逾": [ 48, 616 ], "遖": [ 56, 616 ], "遘": [ 64, 616 ], "遞": [ 72, 616 ], "遨": [ 80, 616 ], "遯": [ 88, 616 ], "遶": [ 96, 616 ], "隨": [ 104, 616 ], "遲": [ 112, 616 ], "邂": [ 120, 616 ], "遽": [ 128, 616 ], "邁": [ 136, 616 ], "邀": [ 144, 616 ], "邊": [ 152, 616 ], "邉": [ 160, 616 ], "邏": [ 168, 616 ], "邨": [ 176, 616 ], "邯": [ 184, 616 ], "邱": [ 192, 616 ], "邵": [ 200, 616 ], "郢": [ 208, 616 ], "郤": [ 216, 616 ], "扈": [ 224, 616 ], "郛": [ 232, 616 ], "鄂": [ 240, 616 ], "鄒": [ 248, 616 ], "鄙": [ 256, 616 ], "鄲": [ 264, 616 ], "鄰": [ 272, 616 ], "酊": [ 280, 616 ], "酖": [ 288, 616 ], "酘": [ 296, 616 ], "酣": [ 304, 616 ], "酥": [ 312, 616 ], "酩": [ 320, 616 ], "酳": [ 328, 616 ], "酲": [ 336, 616 ], "醋": [ 344, 616 ], "醉": [ 352, 616 ], "醂": [ 360, 616 ], "醢": [ 368, 616 ], "醫": [ 376, 616 ], "醯": [ 384, 616 ], "醪": [ 392, 616 ], "醵": [ 400, 616 ], "醴": [ 408, 616 ], "醺": [ 416, 616 ], "釀": [ 424, 616 ], "釁": [ 432, 616 ], "釉": [ 440, 616 ], "釋": [ 448, 616 ], "釐": [ 456, 616 ], "釖": [ 464, 616 ], "釟": [ 472, 616 ], "釡": [ 480, 616 ], "釛": [ 488, 616 ], "釼": [ 496, 616 ], "釵": [ 504, 616 ], "釶": [ 512, 616 ], "鈞": [ 520, 616 ], "釿": [ 528, 616 ], "鈔": [ 536, 616 ], "鈬": [ 544, 616 ], "鈕": [ 552, 616 ], "鈑": [ 560, 616 ], "鉞": [ 568, 616 ], "鉗": [ 576, 616 ], "鉅": [ 584, 616 ], "鉉": [ 592, 616 ], "鉤": [ 600, 616 ], "鉈": [ 608, 616 ], "銕": [ 616, 616 ], "鈿": [ 624, 616 ], "鉋": [ 632, 616 ], "鉐": [ 640, 616 ], "銜": [ 648, 616 ], "銖": [ 656, 616 ], "銓": [ 664, 616 ], "銛": [ 672, 616 ], "鉚": [ 680, 616 ], "鋏": [ 688, 616 ], "銹": [ 696, 616 ], "銷": [ 704, 616 ], "鋩": [ 712, 616 ], "錏": [ 720, 616 ], "鋺": [ 728, 616 ], "鍄": [ 736, 616 ], "錮": [ 744, 616 ], "錙": [ 0, 624 ], "錢": [ 8, 624 ], "錚": [ 16, 624 ], "錣": [ 24, 624 ], "錺": [ 32, 624 ], "錵": [ 40, 624 ], "錻": [ 48, 624 ], "鍜": [ 56, 624 ], "鍠": [ 64, 624 ], "鍼": [ 72, 624 ], "鍮": [ 80, 624 ], "鍖": [ 88, 624 ], "鎰": [ 96, 624 ], "鎬": [ 104, 624 ], "鎭": [ 112, 624 ], "鎔": [ 120, 624 ], "鎹": [ 128, 624 ], "鏖": [ 136, 624 ], "鏗": [ 144, 624 ], "鏨": [ 152, 624 ], "鏥": [ 160, 624 ], "鏘": [ 168, 624 ], "鏃": [ 176, 624 ], "鏝": [ 184, 624 ], "鏐": [ 192, 624 ], "鏈": [ 200, 624 ], "鏤": [ 208, 624 ], "鐚": [ 216, 624 ], "鐔": [ 224, 624 ], "鐓": [ 232, 624 ], "鐃": [ 240, 624 ], "鐇": [ 248, 624 ], "鐐": [ 256, 624 ], "鐶": [ 264, 624 ], "鐫": [ 272, 624 ], "鐵": [ 280, 624 ], "鐡": [ 288, 624 ], "鐺": [ 296, 624 ], "鑁": [ 304, 624 ], "鑒": [ 312, 624 ], "鑄": [ 320, 624 ], "鑛": [ 328, 624 ], "鑠": [ 336, 624 ], "鑢": [ 344, 624 ], "鑞": [ 352, 624 ], "鑪": [ 360, 624 ], "鈩": [ 368, 624 ], "鑰": [ 376, 624 ], "鑵": [ 384, 624 ], "鑷": [ 392, 624 ], "鑽": [ 400, 624 ], "鑚": [ 408, 624 ], "鑼": [ 416, 624 ], "鑾": [ 424, 624 ], "钁": [ 432, 624 ], "鑿": [ 440, 624 ], "閂": [ 448, 624 ], "閇": [ 456, 624 ], "閊": [ 464, 624 ], "閔": [ 472, 624 ], "閖": [ 480, 624 ], "閘": [ 488, 624 ], "閙": [ 496, 624 ], "閠": [ 504, 624 ], "閨": [ 512, 624 ], "閧": [ 520, 624 ], "閭": [ 528, 624 ], "閼": [ 536, 624 ], "閻": [ 544, 624 ], "閹": [ 552, 624 ], "閾": [ 560, 624 ], "闊": [ 568, 624 ], "濶": [ 576, 624 ], "闃": [ 584, 624 ], "闍": [ 592, 624 ], "闌": [ 600, 624 ], "闕": [ 608, 624 ], "闔": [ 616, 624 ], "闖": [ 624, 624 ], "關": [ 632, 624 ], "闡": [ 640, 624 ], "闥": [ 648, 624 ], "闢": [ 656, 624 ], "阡": [ 664, 624 ], "阨": [ 672, 624 ], "阮": [ 680, 624 ], "阯": [ 688, 624 ], "陂": [ 696, 624 ], "陌": [ 704, 624 ], "陏": [ 712, 624 ], "陋": [ 720, 624 ], "陷": [ 728, 624 ], "陜": [ 736, 624 ], "陞": [ 744, 624 ], "陝": [ 0, 632 ], "陟": [ 8, 632 ], "陦": [ 16, 632 ], "陲": [ 24, 632 ], "陬": [ 32, 632 ], "隍": [ 40, 632 ], "隘": [ 48, 632 ], "隕": [ 56, 632 ], "隗": [ 64, 632 ], "險": [ 72, 632 ], "隧": [ 80, 632 ], "隱": [ 88, 632 ], "隲": [ 96, 632 ], "隰": [ 104, 632 ], "隴": [ 112, 632 ], "隶": [ 120, 632 ], "隸": [ 128, 632 ], "隹": [ 136, 632 ], "雎": [ 144, 632 ], "雋": [ 152, 632 ], "雉": [ 160, 632 ], "雍": [ 168, 632 ], "襍": [ 176, 632 ], "雜": [ 184, 632 ], "霍": [ 192, 632 ], "雕": [ 200, 632 ], "雹": [ 208, 632 ], "霄": [ 216, 632 ], "霆": [ 224, 632 ], "霈": [ 232, 632 ], "霓": [ 240, 632 ], "霎": [ 248, 632 ], "霑": [ 256, 632 ], "霏": [ 264, 632 ], "霖": [ 272, 632 ], "霙": [ 280, 632 ], "霤": [ 288, 632 ], "霪": [ 296, 632 ], "霰": [ 304, 632 ], "霹": [ 312, 632 ], "霽": [ 320, 632 ], "霾": [ 328, 632 ], "靄": [ 336, 632 ], "靆": [ 344, 632 ], "靈": [ 352, 632 ], "靂": [ 360, 632 ], "靉": [ 368, 632 ], "靜": [ 376, 632 ], "靠": [ 384, 632 ], "靤": [ 392, 632 ], "靦": [ 400, 632 ], "靨": [ 408, 632 ], "勒": [ 416, 632 ], "靫": [ 424, 632 ], "靱": [ 432, 632 ], "靹": [ 440, 632 ], "鞅": [ 448, 632 ], "靼": [ 456, 632 ], "鞁": [ 464, 632 ], "靺": [ 472, 632 ], "鞆": [ 480, 632 ], "鞋": [ 488, 632 ], "鞏": [ 496, 632 ], "鞐": [ 504, 632 ], "鞜": [ 512, 632 ], "鞨": [ 520, 632 ], "鞦": [ 528, 632 ], "鞣": [ 536, 632 ], "鞳": [ 544, 632 ], "鞴": [ 552, 632 ], "韃": [ 560, 632 ], "韆": [ 568, 632 ], "韈": [ 576, 632 ], "韋": [ 584, 632 ], "韜": [ 592, 632 ], "韭": [ 600, 632 ], "齏": [ 608, 632 ], "韲": [ 616, 632 ], "竟": [ 624, 632 ], "韶": [ 632, 632 ], "韵": [ 640, 632 ], "頏": [ 648, 632 ], "頌": [ 656, 632 ], "頸": [ 664, 632 ], "頤": [ 672, 632 ], "頡": [ 680, 632 ], "頷": [ 688, 632 ], "頽": [ 696, 632 ], "顆": [ 704, 632 ], "顏": [ 712, 632 ], "顋": [ 720, 632 ], "顫": [ 728, 632 ], "顯": [ 736, 632 ], "顰": [ 744, 632 ], "顱": [ 0, 640 ], "顴": [ 8, 640 ], "顳": [ 16, 640 ], "颪": [ 24, 640 ], "颯": [ 32, 640 ], "颱": [ 40, 640 ], "颶": [ 48, 640 ], "飄": [ 56, 640 ], "飃": [ 64, 640 ], "飆": [ 72, 640 ], "飩": [ 80, 640 ], "飫": [ 88, 640 ], "餃": [ 96, 640 ], "餉": [ 104, 640 ], "餒": [ 112, 640 ], "餔": [ 120, 640 ], "餘": [ 128, 640 ], "餡": [ 136, 640 ], "餝": [ 144, 640 ], "餞": [ 152, 640 ], "餤": [ 160, 640 ], "餠": [ 168, 640 ], "餬": [ 176, 640 ], "餮": [ 184, 640 ], "餽": [ 192, 640 ], "餾": [ 200, 640 ], "饂": [ 208, 640 ], "饉": [ 216, 640 ], "饅": [ 224, 640 ], "饐": [ 232, 640 ], "饋": [ 240, 640 ], "饑": [ 248, 640 ], "饒": [ 256, 640 ], "饌": [ 264, 640 ], "饕": [ 272, 640 ], "馗": [ 280, 640 ], "馘": [ 288, 640 ], "馥": [ 296, 640 ], "馭": [ 304, 640 ], "馮": [ 312, 640 ], "馼": [ 320, 640 ], "駟": [ 328, 640 ], "駛": [ 336, 640 ], "駝": [ 344, 640 ], "駘": [ 352, 640 ], "駑": [ 360, 640 ], "駭": [ 368, 640 ], "駮": [ 376, 640 ], "駱": [ 384, 640 ], "駲": [ 392, 640 ], "駻": [ 400, 640 ], "駸": [ 408, 640 ], "騁": [ 416, 640 ], "騏": [ 424, 640 ], "騅": [ 432, 640 ], "駢": [ 440, 640 ], "騙": [ 448, 640 ], "騫": [ 456, 640 ], "騷": [ 464, 640 ], "驅": [ 472, 640 ], "驂": [ 480, 640 ], "驀": [ 488, 640 ], "驃": [ 496, 640 ], "騾": [ 504, 640 ], "驕": [ 512, 640 ], "驍": [ 520, 640 ], "驛": [ 528, 640 ], "驗": [ 536, 640 ], "驟": [ 544, 640 ], "驢": [ 552, 640 ], "驥": [ 560, 640 ], "驤": [ 568, 640 ], "驩": [ 576, 640 ], "驫": [ 584, 640 ], "驪": [ 592, 640 ], "骭": [ 600, 640 ], "骰": [ 608, 640 ], "骼": [ 616, 640 ], "髀": [ 624, 640 ], "髏": [ 632, 640 ], "髑": [ 640, 640 ], "髓": [ 648, 640 ], "體": [ 656, 640 ], "髞": [ 664, 640 ], "髟": [ 672, 640 ], "髢": [ 680, 640 ], "髣": [ 688, 640 ], "髦": [ 696, 640 ], "髯": [ 704, 640 ], "髫": [ 712, 640 ], "髮": [ 720, 640 ], "髴": [ 728, 640 ], "髱": [ 736, 640 ], "髷": [ 744, 640 ], "髻": [ 0, 648 ], "鬆": [ 8, 648 ], "鬘": [ 16, 648 ], "鬚": [ 24, 648 ], "鬟": [ 32, 648 ], "鬢": [ 40, 648 ], "鬣": [ 48, 648 ], "鬥": [ 56, 648 ], "鬧": [ 64, 648 ], "鬨": [ 72, 648 ], "鬩": [ 80, 648 ], "鬪": [ 88, 648 ], "鬮": [ 96, 648 ], "鬯": [ 104, 648 ], "鬲": [ 112, 648 ], "魄": [ 120, 648 ], "魃": [ 128, 648 ], "魏": [ 136, 648 ], "魍": [ 144, 648 ], "魎": [ 152, 648 ], "魑": [ 160, 648 ], "魘": [ 168, 648 ], "魴": [ 176, 648 ], "鮓": [ 184, 648 ], "鮃": [ 192, 648 ], "鮑": [ 200, 648 ], "鮖": [ 208, 648 ], "鮗": [ 216, 648 ], "鮟": [ 224, 648 ], "鮠": [ 232, 648 ], "鮨": [ 240, 648 ], "鮴": [ 248, 648 ], "鯀": [ 256, 648 ], "鯊": [ 264, 648 ], "鮹": [ 272, 648 ], "鯆": [ 280, 648 ], "鯏": [ 288, 648 ], "鯑": [ 296, 648 ], "鯒": [ 304, 648 ], "鯣": [ 312, 648 ], "鯢": [ 320, 648 ], "鯤": [ 328, 648 ], "鯔": [ 336, 648 ], "鯡": [ 344, 648 ], "鰺": [ 352, 648 ], "鯲": [ 360, 648 ], "鯱": [ 368, 648 ], "鯰": [ 376, 648 ], "鰕": [ 384, 648 ], "鰔": [ 392, 648 ], "鰉": [ 400, 648 ], "鰓": [ 408, 648 ], "鰌": [ 416, 648 ], "鰆": [ 424, 648 ], "鰈": [ 432, 648 ], "鰒": [ 440, 648 ], "鰊": [ 448, 648 ], "鰄": [ 456, 648 ], "鰮": [ 464, 648 ], "鰛": [ 472, 648 ], "鰥": [ 480, 648 ], "鰤": [ 488, 648 ], "鰡": [ 496, 648 ], "鰰": [ 504, 648 ], "鱇": [ 512, 648 ], "鰲": [ 520, 648 ], "鱆": [ 528, 648 ], "鰾": [ 536, 648 ], "鱚": [ 544, 648 ], "鱠": [ 552, 648 ], "鱧": [ 560, 648 ], "鱶": [ 568, 648 ], "鱸": [ 576, 648 ], "鳧": [ 584, 648 ], "鳬": [ 592, 648 ], "鳰": [ 600, 648 ], "鴉": [ 608, 648 ], "鴈": [ 616, 648 ], "鳫": [ 624, 648 ], "鴃": [ 632, 648 ], "鴆": [ 640, 648 ], "鴪": [ 648, 648 ], "鴦": [ 656, 648 ], "鶯": [ 664, 648 ], "鴣": [ 672, 648 ], "鴟": [ 680, 648 ], "鵄": [ 688, 648 ], "鴕": [ 696, 648 ], "鴒": [ 704, 648 ], "鵁": [ 712, 648 ], "鴿": [ 720, 648 ], "鴾": [ 728, 648 ], "鵆": [ 736, 648 ], "鵈": [ 744, 648 ], "鵝": [ 0, 656 ], "鵞": [ 8, 656 ], "鵤": [ 16, 656 ], "鵑": [ 24, 656 ], "鵐": [ 32, 656 ], "鵙": [ 40, 656 ], "鵲": [ 48, 656 ], "鶉": [ 56, 656 ], "鶇": [ 64, 656 ], "鶫": [ 72, 656 ], "鵯": [ 80, 656 ], "鵺": [ 88, 656 ], "鶚": [ 96, 656 ], "鶤": [ 104, 656 ], "鶩": [ 112, 656 ], "鶲": [ 120, 656 ], "鷄": [ 128, 656 ], "鷁": [ 136, 656 ], "鶻": [ 144, 656 ], "鶸": [ 152, 656 ], "鶺": [ 160, 656 ], "鷆": [ 168, 656 ], "鷏": [ 176, 656 ], "鷂": [ 184, 656 ], "鷙": [ 192, 656 ], "鷓": [ 200, 656 ], "鷸": [ 208, 656 ], "鷦": [ 216, 656 ], "鷭": [ 224, 656 ], "鷯": [ 232, 656 ], "鷽": [ 240, 656 ], "鸚": [ 248, 656 ], "鸛": [ 256, 656 ], "鸞": [ 264, 656 ], "鹵": [ 272, 656 ], "鹹": [ 280, 656 ], "鹽": [ 288, 656 ], "麁": [ 296, 656 ], "麈": [ 304, 656 ], "麋": [ 312, 656 ], "麌": [ 320, 656 ], "麒": [ 328, 656 ], "麕": [ 336, 656 ], "麑": [ 344, 656 ], "麝": [ 352, 656 ], "麥": [ 360, 656 ], "麩": [ 368, 656 ], "麸": [ 376, 656 ], "麪": [ 384, 656 ], "麭": [ 392, 656 ], "靡": [ 400, 656 ], "黌": [ 408, 656 ], "黎": [ 416, 656 ], "黏": [ 424, 656 ], "黐": [ 432, 656 ], "黔": [ 440, 656 ], "黜": [ 448, 656 ], "點": [ 456, 656 ], "黝": [ 464, 656 ], "黠": [ 472, 656 ], "黥": [ 480, 656 ], "黨": [ 488, 656 ], "黯": [ 496, 656 ], "黴": [ 504, 656 ], "黶": [ 512, 656 ], "黷": [ 520, 656 ], "黹": [ 528, 656 ], "黻": [ 536, 656 ], "黼": [ 544, 656 ], "黽": [ 552, 656 ], "鼇": [ 560, 656 ], "鼈": [ 568, 656 ], "皷": [ 576, 656 ], "鼕": [ 584, 656 ], "鼡": [ 592, 656 ], "鼬": [ 600, 656 ], "鼾": [ 608, 656 ], "齊": [ 616, 656 ], "齒": [ 624, 656 ], "齔": [ 632, 656 ], "齣": [ 640, 656 ], "齟": [ 648, 656 ], "齠": [ 656, 656 ], "齡": [ 664, 656 ], "齦": [ 672, 656 ], "齧": [ 680, 656 ], "齬": [ 688, 656 ], "齪": [ 696, 656 ], "齷": [ 704, 656 ], "齲": [ 712, 656 ], "齶": [ 720, 656 ], "龕": [ 728, 656 ], "龜": [ 736, 656 ], "龠": [ 744, 656 ], "堯": [ 0, 664 ], "槇": [ 8, 664 ], "遙": [ 16, 664 ], "瑤": [ 24, 664 ], "凜": [ 32, 664 ], "熙": [ 40, 664 ], " ": [ 0, 0 ], "!": [ 72, 0 ], "\"": [ 320, 0 ], "#": [ 664, 0 ], "$": [ 632, 0 ], "%": [ 656, 0 ], "&": [ 672, 0 ], "'": [ 304, 0 ], "(": [ 328, 0 ], ")": [ 336, 0 ], "*": [ 680, 0 ], "+": [ 472, 0 ], ",": [ 24, 0 ], "-": [ 480, 0 ], ".": [ 32, 0 ], "/": [ 240, 0 ], "0": [ 120, 16 ], "1": [ 128, 16 ], "2": [ 136, 16 ], "3": [ 144, 16 ], "4": [ 152, 16 ], "5": [ 160, 16 ], "6": [ 168, 16 ], "7": [ 176, 16 ], "8": [ 184, 16 ], "9": [ 192, 16 ], ":": [ 48, 0 ], ";": [ 56, 0 ], "<": [ 528, 0 ], "=": [ 512, 0 ], ">": [ 536, 0 ], "?": [ 64, 0 ], "@": [ 688, 0 ], "A": [ 256, 16 ], "B": [ 264, 16 ], "C": [ 272, 16 ], "D": [ 280, 16 ], "E": [ 288, 16 ], "F": [ 296, 16 ], "G": [ 304, 16 ], "H": [ 312, 16 ], "I": [ 320, 16 ], "J": [ 328, 16 ], "K": [ 336, 16 ], "L": [ 344, 16 ], "M": [ 352, 16 ], "N": [ 360, 16 ], "O": [ 368, 16 ], "P": [ 376, 16 ], "Q": [ 384, 16 ], "R": [ 392, 16 ], "S": [ 400, 16 ], "T": [ 408, 16 ], "U": [ 416, 16 ], "V": [ 424, 16 ], "W": [ 432, 16 ], "X": [ 440, 16 ], "Y": [ 448, 16 ], "Z": [ 456, 16 ], "[": [ 360, 0 ], "\\": [ 248, 0 ], "]": [ 368, 0 ], "^": [ 120, 0 ], "_": [ 136, 0 ], "`": [ 104, 0 ], "a": [ 512, 16 ], "b": [ 520, 16 ], "c": [ 528, 16 ], "d": [ 536, 16 ], "e": [ 544, 16 ], "f": [ 552, 16 ], "g": [ 560, 16 ], "h": [ 568, 16 ], "i": [ 576, 16 ], "j": [ 584, 16 ], "k": [ 592, 16 ], "l": [ 600, 16 ], "m": [ 608, 16 ], "n": [ 616, 16 ], "o": [ 624, 16 ], "p": [ 632, 16 ], "q": [ 640, 16 ], "r": [ 648, 16 ], "s": [ 656, 16 ], "t": [ 664, 16 ], "u": [ 672, 16 ], "v": [ 680, 16 ], "w": [ 688, 16 ], "x": [ 696, 16 ], "y": [ 704, 16 ], "z": [ 712, 16 ], "{": [ 376, 0 ], "|": [ 272, 0 ], "}": [ 384, 0 ], "~": [ 256, 0 ] };

},{}],5:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff
var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined' && object.buffer instanceof ArrayBuffer) {
    return fromTypedArray(that, object)
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = String(string)

  if (string.length === 0) return 0

  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      return string.length
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return string.length * 2
    case 'hex':
      return string.length >>> 1
    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(string).length
    case 'base64':
      return base64ToBytes(string).length
    default:
      return string.length
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function toString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []
  var i = 0

  for (; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (leadSurrogate) {
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        } else {
          // valid surrogate pair
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        // no lead yet

        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          // valid lead
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":6,"ieee754":7,"is-array":8}],6:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],7:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],9:[function(require,module,exports){
(function (Buffer){
//  Chance.js 0.7.5
//  http://chancejs.com
//  (c) 2013 Victor Quinn
//  Chance may be freely distributed or modified under the MIT license.

(function () {

    // Constants
    var MAX_INT = 9007199254740992;
    var MIN_INT = -MAX_INT;
    var NUMBERS = '0123456789';
    var CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    var CHARS_UPPER = CHARS_LOWER.toUpperCase();
    var HEX_POOL  = NUMBERS + "abcdef";

    // Cached array helpers
    var slice = Array.prototype.slice;

    // Constructor
    function Chance (seed) {
        if (!(this instanceof Chance)) {
            return seed == null ? new Chance() : new Chance(seed);
        }

        // if user has provided a function, use that as the generator
        if (typeof seed === 'function') {
            this.random = seed;
            return this;
        }

        var seedling;

        if (arguments.length) {
            // set a starting value of zero so we can add to it
            this.seed = 0;
        }
        // otherwise, leave this.seed blank so that MT will recieve a blank

        for (var i = 0; i < arguments.length; i++) {
            seedling = 0;
            if (typeof arguments[i] === 'string') {
                for (var j = 0; j < arguments[i].length; j++) {
                    seedling += (arguments[i].length - j) * arguments[i].charCodeAt(j);
                }
            } else {
                seedling = arguments[i];
            }
            this.seed += (arguments.length - i) * seedling;
        }

        // If no generator function was provided, use our MT
        this.mt = this.mersenne_twister(this.seed);
        this.bimd5 = this.blueimp_md5();
        this.random = function () {
            return this.mt.random(this.seed);
        };

        return this;
    }

    Chance.prototype.VERSION = "0.7.5";

    // Random helper functions
    function initOptions(options, defaults) {
        options || (options = {});

        if (defaults) {
            for (var i in defaults) {
                if (typeof options[i] === 'undefined') {
                    options[i] = defaults[i];
                }
            }
        }

        return options;
    }

    function testRange(test, errorMessage) {
        if (test) {
            throw new RangeError(errorMessage);
        }
    }

    /**
     * Encode the input string with Base64.
     */
    var base64 = function() {
        throw new Error('No Base64 encoder available.');
    };

    // Select proper Base64 encoder.
    (function determineBase64Encoder() {
        if (typeof btoa === 'function') {
            base64 = btoa;
        } else if (typeof Buffer === 'function') {
            base64 = function(input) {
                return new Buffer(input).toString('base64');
            };
        }
    })();

    // -- Basics --

    /**
     *  Return a random bool, either true or false
     *
     *  @param {Object} [options={ likelihood: 50 }] alter the likelihood of
     *    receiving a true or false value back.
     *  @throws {RangeError} if the likelihood is out of bounds
     *  @returns {Bool} either true or false
     */
    Chance.prototype.bool = function (options) {
        // likelihood of success (true)
        options = initOptions(options, {likelihood : 50});

        // Note, we could get some minor perf optimizations by checking range
        // prior to initializing defaults, but that makes code a bit messier
        // and the check more complicated as we have to check existence of
        // the object then existence of the key before checking constraints.
        // Since the options initialization should be minor computationally,
        // decision made for code cleanliness intentionally. This is mentioned
        // here as it's the first occurrence, will not be mentioned again.
        testRange(
            options.likelihood < 0 || options.likelihood > 100,
            "Chance: Likelihood accepts values from 0 to 100."
        );

        return this.random() * 100 < options.likelihood;
    };

    /**
     *  Return a random character.
     *
     *  @param {Object} [options={}] can specify a character pool, only alpha,
     *    only symbols, and casing (lower or upper)
     *  @returns {String} a single random character
     *  @throws {RangeError} Can only specify alpha or symbols, not both
     */
    Chance.prototype.character = function (options) {
        options = initOptions(options);
        testRange(
            options.alpha && options.symbols,
            "Chance: Cannot specify both alpha and symbols."
        );

        var symbols = "!@#$%^&*()[]",
            letters, pool;

        if (options.casing === 'lower') {
            letters = CHARS_LOWER;
        } else if (options.casing === 'upper') {
            letters = CHARS_UPPER;
        } else {
            letters = CHARS_LOWER + CHARS_UPPER;
        }

        if (options.pool) {
            pool = options.pool;
        } else if (options.alpha) {
            pool = letters;
        } else if (options.symbols) {
            pool = symbols;
        } else {
            pool = letters + NUMBERS + symbols;
        }

        return pool.charAt(this.natural({max: (pool.length - 1)}));
    };

    // Note, wanted to use "float" or "double" but those are both JS reserved words.

    // Note, fixed means N OR LESS digits after the decimal. This because
    // It could be 14.9000 but in JavaScript, when this is cast as a number,
    // the trailing zeroes are dropped. Left to the consumer if trailing zeroes are
    // needed
    /**
     *  Return a random floating point number
     *
     *  @param {Object} [options={}] can specify a fixed precision, min, max
     *  @returns {Number} a single floating point number
     *  @throws {RangeError} Can only specify fixed or precision, not both. Also
     *    min cannot be greater than max
     */
    Chance.prototype.floating = function (options) {
        options = initOptions(options, {fixed : 4});
        testRange(
            options.fixed && options.precision,
            "Chance: Cannot specify both fixed and precision."
        );

        var num;
        var fixed = Math.pow(10, options.fixed);

        var max = MAX_INT / fixed;
        var min = -max;

        testRange(
            options.min && options.fixed && options.min < min,
            "Chance: Min specified is out of range with fixed. Min should be, at least, " + min
        );
        testRange(
            options.max && options.fixed && options.max > max,
            "Chance: Max specified is out of range with fixed. Max should be, at most, " + max
        );

        options = initOptions(options, { min : min, max : max });

        // Todo - Make this work!
        // options.precision = (typeof options.precision !== "undefined") ? options.precision : false;

        num = this.integer({min: options.min * fixed, max: options.max * fixed});
        var num_fixed = (num / fixed).toFixed(options.fixed);

        return parseFloat(num_fixed);
    };

    /**
     *  Return a random integer
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.integer({min: 1, max: 3});
     *  would return either 1, 2, or 3.
     *
     *  @param {Object} [options={}] can specify a min and/or max
     *  @returns {Number} a single random integer number
     *  @throws {RangeError} min cannot be greater than max
     */
    Chance.prototype.integer = function (options) {
        // 9007199254740992 (2^53) is the max integer number in JavaScript
        // See: http://vq.io/132sa2j
        options = initOptions(options, {min: MIN_INT, max: MAX_INT});
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        return Math.floor(this.random() * (options.max - options.min + 1) + options.min);
    };

    /**
     *  Return a random natural
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.natural({min: 1, max: 3});
     *  would return either 1, 2, or 3.
     *
     *  @param {Object} [options={}] can specify a min and/or max
     *  @returns {Number} a single random integer number
     *  @throws {RangeError} min cannot be greater than max
     */
    Chance.prototype.natural = function (options) {
        options = initOptions(options, {min: 0, max: MAX_INT});
        testRange(options.min < 0, "Chance: Min cannot be less than zero.");
        return this.integer(options);
    };

    /**
     *  Return a random string
     *
     *  @param {Object} [options={}] can specify a length
     *  @returns {String} a string of random length
     *  @throws {RangeError} length cannot be less than zero
     */
    Chance.prototype.string = function (options) {
        options = initOptions(options, { length: this.natural({min: 5, max: 20}) });
        testRange(options.length < 0, "Chance: Length cannot be less than zero.");
        var length = options.length,
            text = this.n(this.character, length, options);

        return text.join("");
    };

    // -- End Basics --

    // -- Helpers --

    Chance.prototype.capitalize = function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1);
    };

    Chance.prototype.mixin = function (obj) {
        for (var func_name in obj) {
            Chance.prototype[func_name] = obj[func_name];
        }
        return this;
    };

    /**
     *  Given a function that generates something random and a number of items to generate,
     *    return an array of items where none repeat.
     *
     *  @param {Function} fn the function that generates something random
     *  @param {Number} num number of terms to generate
     *  @param {Object} options any options to pass on to the generator function
     *  @returns {Array} an array of length `num` with every item generated by `fn` and unique
     *
     *  There can be more parameters after these. All additional parameters are provided to the given function
     */
    Chance.prototype.unique = function(fn, num, options) {
        testRange(
            typeof fn !== "function",
            "Chance: The first argument must be a function."
        );

        options = initOptions(options, {
            // Default comparator to check that val is not already in arr.
            // Should return `false` if item not in array, `true` otherwise
            comparator: function(arr, val) {
                return arr.indexOf(val) !== -1;
            }
        });

        var arr = [], count = 0, result, MAX_DUPLICATES = num * 50, params = slice.call(arguments, 2);

        while (arr.length < num) {
            result = fn.apply(this, params);
            if (!options.comparator(arr, result)) {
                arr.push(result);
                // reset count when unique found
                count = 0;
            }

            if (++count > MAX_DUPLICATES) {
                throw new RangeError("Chance: num is likely too large for sample set");
            }
        }
        return arr;
    };

    /**
     *  Gives an array of n random terms
     *
     *  @param {Function} fn the function that generates something random
     *  @param {Number} n number of terms to generate
     *  @returns {Array} an array of length `n` with items generated by `fn`
     *
     *  There can be more parameters after these. All additional parameters are provided to the given function
     */
    Chance.prototype.n = function(fn, n) {
        testRange(
            typeof fn !== "function",
            "Chance: The first argument must be a function."
        );

        if (typeof n === 'undefined') {
            n = 1;
        }
        var i = n, arr = [], params = slice.call(arguments, 2);

        // Providing a negative count should result in a noop.
        i = Math.max( 0, i );

        for (null; i--; null) {
            arr.push(fn.apply(this, params));
        }

        return arr;
    };

    // H/T to SO for this one: http://vq.io/OtUrZ5
    Chance.prototype.pad = function (number, width, pad) {
        // Default pad to 0 if none provided
        pad = pad || '0';
        // Convert number to a string
        number = number + '';
        return number.length >= width ? number : new Array(width - number.length + 1).join(pad) + number;
    };

    Chance.prototype.pick = function (arr, count) {
        if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pick() from an empty array");
        }
        if (!count || count === 1) {
            return arr[this.natural({max: arr.length - 1})];
        } else {
            return this.shuffle(arr).slice(0, count);
        }
    };

    Chance.prototype.shuffle = function (arr) {
        var old_array = arr.slice(0),
            new_array = [],
            j = 0,
            length = Number(old_array.length);

        for (var i = 0; i < length; i++) {
            // Pick a random index from the array
            j = this.natural({max: old_array.length - 1});
            // Add it to the new array
            new_array[i] = old_array[j];
            // Remove that element from the original array
            old_array.splice(j, 1);
        }

        return new_array;
    };

    // Returns a single item from an array with relative weighting of odds
    Chance.prototype.weighted = function(arr, weights) {
        if (arr.length !== weights.length) {
            throw new RangeError("Chance: length of array and weights must match");
        }

        // Handle weights that are less or equal to zero.
        for (var weightIndex = weights.length - 1; weightIndex >= 0; --weightIndex) {
            // If the weight is less or equal to zero, remove it and the value.
            if (weights[weightIndex] <= 0) {
                arr.splice(weightIndex,1);
                weights.splice(weightIndex,1);
            }
        }

        // If any of the weights are less than 1, we want to scale them up to whole
        //   numbers for the rest of this logic to work
        if (weights.some(function(weight) { return weight < 1; })) {
            var min = weights.reduce(function(min, weight) {
                return (weight < min) ? weight : min;
            }, weights[0]);

            var scaling_factor = 1 / min;

            weights = weights.map(function(weight) {
                return weight * scaling_factor;
            });
        }

        var sum = weights.reduce(function(total, weight) {
            return total + weight;
        }, 0);

        // get an index
        var selected = this.natural({ min: 1, max: sum });

        var total = 0;
        var chosen;
        // Using some() here so we can bail as soon as we get our match
        weights.some(function(weight, index) {
            if (selected <= total + weight) {
                chosen = arr[index];
                return true;
            }
            total += weight;
            return false;
        });

        return chosen;
    };

    // -- End Helpers --

    // -- Text --

    Chance.prototype.paragraph = function (options) {
        options = initOptions(options);

        var sentences = options.sentences || this.natural({min: 3, max: 7}),
            sentence_array = this.n(this.sentence, sentences);

        return sentence_array.join(' ');
    };

    // Could get smarter about this than generating random words and
    // chaining them together. Such as: http://vq.io/1a5ceOh
    Chance.prototype.sentence = function (options) {
        options = initOptions(options);

        var words = options.words || this.natural({min: 12, max: 18}),
            text, word_array = this.n(this.word, words);

        text = word_array.join(' ');

        // Capitalize first letter of sentence, add period at end
        text = this.capitalize(text) + '.';

        return text;
    };

    Chance.prototype.syllable = function (options) {
        options = initOptions(options);

        var length = options.length || this.natural({min: 2, max: 3}),
            consonants = 'bcdfghjklmnprstvwz', // consonants except hard to speak ones
            vowels = 'aeiou', // vowels
            all = consonants + vowels, // all
            text = '',
            chr;

        // I'm sure there's a more elegant way to do this, but this works
        // decently well.
        for (var i = 0; i < length; i++) {
            if (i === 0) {
                // First character can be anything
                chr = this.character({pool: all});
            } else if (consonants.indexOf(chr) === -1) {
                // Last character was a vowel, now we want a consonant
                chr = this.character({pool: consonants});
            } else {
                // Last character was a consonant, now we want a vowel
                chr = this.character({pool: vowels});
            }

            text += chr;
        }

        return text;
    };

    Chance.prototype.word = function (options) {
        options = initOptions(options);

        testRange(
            options.syllables && options.length,
            "Chance: Cannot specify both syllables AND length."
        );

        var syllables = options.syllables || this.natural({min: 1, max: 3}),
            text = '';

        if (options.length) {
            // Either bound word by length
            do {
                text += this.syllable();
            } while (text.length < options.length);
            text = text.substring(0, options.length);
        } else {
            // Or by number of syllables
            for (var i = 0; i < syllables; i++) {
                text += this.syllable();
            }
        }
        return text;
    };

    // -- End Text --

    // -- Person --

    Chance.prototype.age = function (options) {
        options = initOptions(options);
        var ageRange;

        switch (options.type) {
            case 'child':
                ageRange = {min: 1, max: 12};
                break;
            case 'teen':
                ageRange = {min: 13, max: 19};
                break;
            case 'adult':
                ageRange = {min: 18, max: 65};
                break;
            case 'senior':
                ageRange = {min: 65, max: 100};
                break;
            case 'all':
                ageRange = {min: 1, max: 100};
                break;
            default:
                ageRange = {min: 18, max: 65};
                break;
        }

        return this.natural(ageRange);
    };

    Chance.prototype.birthday = function (options) {
        options = initOptions(options, {
            year: (new Date().getFullYear() - this.age(options))
        });

        return this.date(options);
    };

    // CPF; ID to identify taxpayers in Brazil
    Chance.prototype.cpf = function () {
        var n = this.n(this.natural, 9, { max: 9 });
        var d1 = n[8]*2+n[7]*3+n[6]*4+n[5]*5+n[4]*6+n[3]*7+n[2]*8+n[1]*9+n[0]*10;
        d1 = 11 - (d1 % 11);
        if (d1>=10) {
            d1 = 0;
        }
        var d2 = d1*2+n[8]*3+n[7]*4+n[6]*5+n[5]*6+n[4]*7+n[3]*8+n[2]*9+n[1]*10+n[0]*11;
        d2 = 11 - (d2 % 11);
        if (d2>=10) {
            d2 = 0;
        }
        return ''+n[0]+n[1]+n[2]+'.'+n[3]+n[4]+n[5]+'.'+n[6]+n[7]+n[8]+'-'+d1+d2;
    };

    Chance.prototype.first = function (options) {
        options = initOptions(options, {gender: this.gender()});
        return this.pick(this.get("firstNames")[options.gender.toLowerCase()]);
    };

    Chance.prototype.gender = function () {
        return this.pick(['Male', 'Female']);
    };

    Chance.prototype.last = function () {
        return this.pick(this.get("lastNames"));
    };

    Chance.prototype.mrz = function (options) {
        var checkDigit = function (input) {
            var alpha = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(''),
                multipliers = [ 7, 3, 1 ],
                runningTotal = 0;

            if (typeof input !== 'string') {
                input = input.toString();
            }

            input.split('').forEach(function(character, idx) {
                var pos = alpha.indexOf(character);

                if(pos !== -1) {
                    character = pos === 0 ? 0 : pos + 9;
                } else {
                    character = parseInt(character, 10);
                }
                character *= multipliers[idx % multipliers.length];
                runningTotal += character;
            });
            return runningTotal % 10;
        };
        var generate = function (opts) {
            var pad = function (length) {
                return new Array(length + 1).join('<');
            };
            var number = [ 'P<',
                           opts.issuer,
                           opts.last.toUpperCase(),
                           '<<',
                           opts.first.toUpperCase(),
                           pad(39 - (opts.last.length + opts.first.length + 2)),
                           opts.passportNumber,
                           checkDigit(opts.passportNumber),
                           opts.nationality,
                           opts.dob,
                           checkDigit(opts.dob),
                           opts.gender,
                           opts.expiry,
                           checkDigit(opts.expiry),
                           pad(14),
                           checkDigit(pad(14)) ].join('');

            return number +
                (checkDigit(number.substr(44, 10) +
                            number.substr(57, 7) +
                            number.substr(65, 7)));
        };

        var that = this;

        options = initOptions(options, {
            first: this.first(),
            last: this.last(),
            passportNumber: this.integer({min: 100000000, max: 999999999}),
            dob: (function () {
                var date = that.birthday({type: 'adult'});
                return [date.getFullYear().toString().substr(2),
                        that.pad(date.getMonth() + 1, 2),
                        that.pad(date.getDate(), 2)].join('');
            }()),
            expiry: (function () {
                var date = new Date();
                return [(date.getFullYear() + 5).toString().substr(2),
                        that.pad(date.getMonth() + 1, 2),
                        that.pad(date.getDate(), 2)].join('');
            }()),
            gender: this.gender() === 'Female' ? 'F': 'M',
            issuer: 'GBR',
            nationality: 'GBR'
        });
        return generate (options);
    };

    Chance.prototype.name = function (options) {
        options = initOptions(options);

        var first = this.first(options),
            last = this.last(),
            name;

        if (options.middle) {
            name = first + ' ' + this.first(options) + ' ' + last;
        } else if (options.middle_initial) {
            name = first + ' ' + this.character({alpha: true, casing: 'upper'}) + '. ' + last;
        } else {
            name = first + ' ' + last;
        }

        if (options.prefix) {
            name = this.prefix(options) + ' ' + name;
        }

        if (options.suffix) {
            name = name + ' ' + this.suffix(options);
        }

        return name;
    };

    // Return the list of available name prefixes based on supplied gender.
    Chance.prototype.name_prefixes = function (gender) {
        gender = gender || "all";
        gender = gender.toLowerCase();

        var prefixes = [
            { name: 'Doctor', abbreviation: 'Dr.' }
        ];

        if (gender === "male" || gender === "all") {
            prefixes.push({ name: 'Mister', abbreviation: 'Mr.' });
        }

        if (gender === "female" || gender === "all") {
            prefixes.push({ name: 'Miss', abbreviation: 'Miss' });
            prefixes.push({ name: 'Misses', abbreviation: 'Mrs.' });
        }

        return prefixes;
    };

    // Alias for name_prefix
    Chance.prototype.prefix = function (options) {
        return this.name_prefix(options);
    };

    Chance.prototype.name_prefix = function (options) {
        options = initOptions(options, { gender: "all" });
        return options.full ?
            this.pick(this.name_prefixes(options.gender)).name :
            this.pick(this.name_prefixes(options.gender)).abbreviation;
    };

    Chance.prototype.ssn = function (options) {
        options = initOptions(options, {ssnFour: false, dashes: true});
        var ssn_pool = "1234567890",
            ssn,
            dash = options.dashes ? '-' : '';

        if(!options.ssnFour) {
            ssn = this.string({pool: ssn_pool, length: 3}) + dash +
            this.string({pool: ssn_pool, length: 2}) + dash +
            this.string({pool: ssn_pool, length: 4});
        } else {
            ssn = this.string({pool: ssn_pool, length: 4});
        }
        return ssn;
    };

    // Return the list of available name suffixes
    Chance.prototype.name_suffixes = function () {
        var suffixes = [
            { name: 'Doctor of Osteopathic Medicine', abbreviation: 'D.O.' },
            { name: 'Doctor of Philosophy', abbreviation: 'Ph.D.' },
            { name: 'Esquire', abbreviation: 'Esq.' },
            { name: 'Junior', abbreviation: 'Jr.' },
            { name: 'Juris Doctor', abbreviation: 'J.D.' },
            { name: 'Master of Arts', abbreviation: 'M.A.' },
            { name: 'Master of Business Administration', abbreviation: 'M.B.A.' },
            { name: 'Master of Science', abbreviation: 'M.S.' },
            { name: 'Medical Doctor', abbreviation: 'M.D.' },
            { name: 'Senior', abbreviation: 'Sr.' },
            { name: 'The Third', abbreviation: 'III' },
            { name: 'The Fourth', abbreviation: 'IV' },
            { name: 'Bachelor of Engineering', abbreviation: 'B.E' },
            { name: 'Bachelor of Technology', abbreviation: 'B.TECH' }
        ];
        return suffixes;
    };

    // Alias for name_suffix
    Chance.prototype.suffix = function (options) {
        return this.name_suffix(options);
    };

    Chance.prototype.name_suffix = function (options) {
        options = initOptions(options);
        return options.full ?
            this.pick(this.name_suffixes()).name :
            this.pick(this.name_suffixes()).abbreviation;
    };

    // -- End Person --

    // -- Mobile --
    // Android GCM Registration ID
    Chance.prototype.android_id = function () {
        return "APA91" + this.string({ pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_", length: 178 });
    };

    // Apple Push Token
    Chance.prototype.apple_token = function () {
        return this.string({ pool: "abcdef1234567890", length: 64 });
    };

    // Windows Phone 8 ANID2
    Chance.prototype.wp8_anid2 = function () {
        return base64( this.hash( { length : 32 } ) );
    };

    // Windows Phone 7 ANID
    Chance.prototype.wp7_anid = function () {
        return 'A=' + this.guid().replace(/-/g, '').toUpperCase() + '&E=' + this.hash({ length:3 }) + '&W=' + this.integer({ min:0, max:9 });
    };

    // BlackBerry Device PIN
    Chance.prototype.bb_pin = function () {
        return this.hash({ length: 8 });
    };

    // -- End Mobile --

    // -- Web --
    Chance.prototype.avatar = function (options) {
        var url = null;
        var URL_BASE = '//www.gravatar.com/avatar/';
        var PROTOCOLS = {
            http: 'http',
            https: 'https'
        };
        var FILE_TYPES = {
            bmp: 'bmp',
            gif: 'gif',
            jpg: 'jpg',
            png: 'png'
        };
        var FALLBACKS = {
            '404': '404', // Return 404 if not found
            mm: 'mm', // Mystery man
            identicon: 'identicon', // Geometric pattern based on hash
            monsterid: 'monsterid', // A generated monster icon
            wavatar: 'wavatar', // A generated face
            retro: 'retro', // 8-bit icon
            blank: 'blank' // A transparent png
        };
        var RATINGS = {
            g: 'g',
            pg: 'pg',
            r: 'r',
            x: 'x'
        };
        var opts = {
            protocol: null,
            email: null,
            fileExtension: null,
            size: null,
            fallback: null,
            rating: null
        };

        if (!options) {
            // Set to a random email
            opts.email = this.email();
            options = {};
        }
        else if (typeof options === 'string') {
            opts.email = options;
            options = {};
        }
        else if (typeof options !== 'object') {
            return null;
        }
        else if (options.constructor === 'Array') {
            return null;
        }

        opts = initOptions(options, opts);

        if (!opts.email) {
            // Set to a random email
            opts.email = this.email();
        }

        // Safe checking for params
        opts.protocol = PROTOCOLS[opts.protocol] ? opts.protocol + ':' : '';
        opts.size = parseInt(opts.size, 0) ? opts.size : '';
        opts.rating = RATINGS[opts.rating] ? opts.rating : '';
        opts.fallback = FALLBACKS[opts.fallback] ? opts.fallback : '';
        opts.fileExtension = FILE_TYPES[opts.fileExtension] ? opts.fileExtension : '';

        url =
            opts.protocol +
            URL_BASE +
            this.bimd5.md5(opts.email) +
            (opts.fileExtension ? '.' + opts.fileExtension : '') +
            (opts.size || opts.rating || opts.fallback ? '?' : '') +
            (opts.size ? '&s=' + opts.size.toString() : '') +
            (opts.rating ? '&r=' + opts.rating : '') +
            (opts.fallback ? '&d=' + opts.fallback : '')
            ;

        return url;
    };

    Chance.prototype.color = function (options) {
        function gray(value, delimiter) {
            return [value, value, value].join(delimiter || '');
        }

        options = initOptions(options, {
            format: this.pick(['hex', 'shorthex', 'rgb', 'rgba', '0x']),
            grayscale: false,
            casing: 'lower'
        });

        var isGrayscale = options.grayscale;
        var colorValue;

        if (options.format === 'hex') {
            colorValue = '#' + (isGrayscale ? gray(this.hash({length: 2})) : this.hash({length: 6}));

        } else if (options.format === 'shorthex') {
            colorValue = '#' + (isGrayscale ? gray(this.hash({length: 1})) : this.hash({length: 3}));

        } else if (options.format === 'rgb') {
            if (isGrayscale) {
                colorValue = 'rgb(' + gray(this.natural({max: 255}), ',') + ')';
            } else {
                colorValue = 'rgb(' + this.natural({max: 255}) + ',' + this.natural({max: 255}) + ',' + this.natural({max: 255}) + ')';
            }
        } else if (options.format === 'rgba') {
            if (isGrayscale) {
                colorValue = 'rgba(' + gray(this.natural({max: 255}), ',') + ',' + this.floating({min:0, max:1}) + ')';
            } else {
                colorValue = 'rgba(' + this.natural({max: 255}) + ',' + this.natural({max: 255}) + ',' + this.natural({max: 255}) + ',' + this.floating({min:0, max:1}) + ')';
            }
        } else if (options.format === '0x') {
            colorValue = '0x' + (isGrayscale ? gray(this.hash({length: 2})) : this.hash({length: 6}));
        } else {
            throw new RangeError('Invalid format provided. Please provide one of "hex", "shorthex", "rgb", "rgba", or "0x".');
        }

        if (options.casing === 'upper' ) {
            colorValue = colorValue.toUpperCase();
        }

        return colorValue;
    };

    Chance.prototype.domain = function (options) {
        options = initOptions(options);
        return this.word() + '.' + (options.tld || this.tld());
    };

    Chance.prototype.email = function (options) {
        options = initOptions(options);
        return this.word({length: options.length}) + '@' + (options.domain || this.domain());
    };

    Chance.prototype.fbid = function () {
        return parseInt('10000' + this.natural({max: 100000000000}), 10);
    };

    Chance.prototype.google_analytics = function () {
        var account = this.pad(this.natural({max: 999999}), 6);
        var property = this.pad(this.natural({max: 99}), 2);

        return 'UA-' + account + '-' + property;
    };

    Chance.prototype.hashtag = function () {
        return '#' + this.word();
    };

    Chance.prototype.ip = function () {
        // Todo: This could return some reserved IPs. See http://vq.io/137dgYy
        // this should probably be updated to account for that rare as it may be
        return this.natural({max: 255}) + '.' +
               this.natural({max: 255}) + '.' +
               this.natural({max: 255}) + '.' +
               this.natural({max: 255});
    };

    Chance.prototype.ipv6 = function () {
        var ip_addr = this.n(this.hash, 8, {length: 4});

        return ip_addr.join(":");
    };

    Chance.prototype.klout = function () {
        return this.natural({min: 1, max: 99});
    };

    Chance.prototype.tlds = function () {
        return ['com', 'org', 'edu', 'gov', 'co.uk', 'net', 'io'];
    };

    Chance.prototype.tld = function () {
        return this.pick(this.tlds());
    };

    Chance.prototype.twitter = function () {
        return '@' + this.word();
    };

    Chance.prototype.url = function (options) {
        options = initOptions(options, { protocol: "http", domain: this.domain(options), domain_prefix: "", path: this.word(), extensions: []});

        var extension = options.extensions.length > 0 ? "." + this.pick(options.extensions) : "";
        var domain = options.domain_prefix ? options.domain_prefix + "." + options.domain : options.domain;

        return options.protocol + "://" + domain + "/" + options.path + extension;
    };

    // -- End Web --

    // -- Location --

    Chance.prototype.address = function (options) {
        options = initOptions(options);
        return this.natural({min: 5, max: 2000}) + ' ' + this.street(options);
    };

    Chance.prototype.altitude = function (options) {
        options = initOptions(options, {fixed: 5, min: 0, max: 8848});
        return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
        });
    };

    Chance.prototype.areacode = function (options) {
        options = initOptions(options, {parens : true});
        // Don't want area codes to start with 1, or have a 9 as the second digit
        var areacode = this.natural({min: 2, max: 9}).toString() +
                this.natural({min: 0, max: 8}).toString() +
                this.natural({min: 0, max: 9}).toString();

        return options.parens ? '(' + areacode + ')' : areacode;
    };

    Chance.prototype.city = function () {
        return this.capitalize(this.word({syllables: 3}));
    };

    Chance.prototype.coordinates = function (options) {
        return this.latitude(options) + ', ' + this.longitude(options);
    };

    Chance.prototype.countries = function () {
        return this.get("countries");
    };

    Chance.prototype.country = function (options) {
        options = initOptions(options);
        var country = this.pick(this.countries());
        return options.full ? country.name : country.abbreviation;
    };

    Chance.prototype.depth = function (options) {
        options = initOptions(options, {fixed: 5, min: -2550, max: 0});
        return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
        });
    };

    Chance.prototype.geohash = function (options) {
        options = initOptions(options, { length: 7 });
        return this.string({ length: options.length, pool: '0123456789bcdefghjkmnpqrstuvwxyz' });
    };

    Chance.prototype.geojson = function (options) {
        return this.latitude(options) + ', ' + this.longitude(options) + ', ' + this.altitude(options);
    };

    Chance.prototype.latitude = function (options) {
        options = initOptions(options, {fixed: 5, min: -90, max: 90});
        return this.floating({min: options.min, max: options.max, fixed: options.fixed});
    };

    Chance.prototype.longitude = function (options) {
        options = initOptions(options, {fixed: 5, min: -180, max: 180});
        return this.floating({min: options.min, max: options.max, fixed: options.fixed});
    };

    Chance.prototype.phone = function (options) {
        var self = this,
            numPick,
            ukNum = function (parts) {
                var section = [];
                //fills the section part of the phone number with random numbers.
                parts.sections.forEach(function(n) {
                    section.push(self.string({ pool: '0123456789', length: n}));
                });
                return parts.area + section.join(' ');
            };
        options = initOptions(options, {
            formatted: true,
            country: 'us',
            mobile: false
        });
        if (!options.formatted) {
            options.parens = false;
        }
        var phone;
        switch (options.country) {
            case 'fr':
                if (!options.mobile) {
                    numPick = this.pick([
                        // Valid zone and département codes.
                        '01' + this.pick(['30', '34', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '53', '55', '56', '58', '60', '64', '69', '70', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83']) + self.string({ pool: '0123456789', length: 6}),
                        '02' + this.pick(['14', '18', '22', '23', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '40', '41', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '56', '57', '61', '62', '69', '72', '76', '77', '78', '85', '90', '96', '97', '98', '99']) + self.string({ pool: '0123456789', length: 6}),
                        '03' + this.pick(['10', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '39', '44', '45', '51', '52', '54', '55', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90']) + self.string({ pool: '0123456789', length: 6}),
                        '04' + this.pick(['11', '13', '15', '20', '22', '26', '27', '30', '32', '34', '37', '42', '43', '44', '50', '56', '57', '63', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '88', '89', '90', '91', '92', '93', '94', '95', '97', '98']) + self.string({ pool: '0123456789', length: 6}),
                        '05' + this.pick(['08', '16', '17', '19', '24', '31', '32', '33', '34', '35', '40', '45', '46', '47', '49', '53', '55', '56', '57', '58', '59', '61', '62', '63', '64', '65', '67', '79', '81', '82', '86', '87', '90', '94']) + self.string({ pool: '0123456789', length: 6}),
                        '09' + self.string({ pool: '0123456789', length: 8}),
                    ]);
                    phone = options.formatted ? numPick.match(/../g).join(' ') : numPick;
                } else {
                    numPick = this.pick(['06', '07']) + self.string({ pool: '0123456789', length: 8});
                    phone = options.formatted ? numPick.match(/../g).join(' ') : numPick;
                }
                break;
            case 'uk':
                if (!options.mobile) {
                    numPick = this.pick([
                        //valid area codes of major cities/counties followed by random numbers in required format.
                        { area: '01' + this.character({ pool: '234569' }) + '1 ', sections: [3,4] },
                        { area: '020 ' + this.character({ pool: '378' }), sections: [3,4] },
                        { area: '023 ' + this.character({ pool: '89' }), sections: [3,4] },
                        { area: '024 7', sections: [3,4] },
                        { area: '028 ' + this.pick(['25','28','37','71','82','90','92','95']), sections: [2,4] },
                        { area: '012' + this.pick(['04','08','54','76','97','98']) + ' ', sections: [5] },
                        { area: '013' + this.pick(['63','64','84','86']) + ' ', sections: [5] },
                        { area: '014' + this.pick(['04','20','60','61','80','88']) + ' ', sections: [5] },
                        { area: '015' + this.pick(['24','27','62','66']) + ' ', sections: [5] },
                        { area: '016' + this.pick(['06','29','35','47','59','95']) + ' ', sections: [5] },
                        { area: '017' + this.pick(['26','44','50','68']) + ' ', sections: [5] },
                        { area: '018' + this.pick(['27','37','84','97']) + ' ', sections: [5] },
                        { area: '019' + this.pick(['00','05','35','46','49','63','95']) + ' ', sections: [5] }
                    ]);
                    phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(' ', '', 'g');
                } else {
                    numPick = this.pick([
                        { area: '07' + this.pick(['4','5','7','8','9']), sections: [2,6] },
                        { area: '07624 ', sections: [6] }
                    ]);
                    phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(' ', '');
                }
                break;
            case 'us':
                var areacode = this.areacode(options).toString();
                var exchange = this.natural({ min: 2, max: 9 }).toString() +
                    this.natural({ min: 0, max: 9 }).toString() +
                    this.natural({ min: 0, max: 9 }).toString();
                var subscriber = this.natural({ min: 1000, max: 9999 }).toString(); // this could be random [0-9]{4}
                phone = options.formatted ? areacode + ' ' + exchange + '-' + subscriber : areacode + exchange + subscriber;
        }
        return phone;
    };

    Chance.prototype.postal = function () {
        // Postal District
        var pd = this.character({pool: "XVTSRPNKLMHJGECBA"});
        // Forward Sortation Area (FSA)
        var fsa = pd + this.natural({max: 9}) + this.character({alpha: true, casing: "upper"});
        // Local Delivery Unut (LDU)
        var ldu = this.natural({max: 9}) + this.character({alpha: true, casing: "upper"}) + this.natural({max: 9});

        return fsa + " " + ldu;
    };

    Chance.prototype.provinces = function () {
        return this.get("provinces");
    };

    Chance.prototype.province = function (options) {
        return (options && options.full) ?
            this.pick(this.provinces()).name :
            this.pick(this.provinces()).abbreviation;
    };

    Chance.prototype.state = function (options) {
        return (options && options.full) ?
            this.pick(this.states(options)).name :
            this.pick(this.states(options)).abbreviation;
    };

    Chance.prototype.states = function (options) {
        options = initOptions(options);

        var states,
            us_states_and_dc = this.get("us_states_and_dc"),
            territories = this.get("territories"),
            armed_forces = this.get("armed_forces");

        states = us_states_and_dc;

        if (options.territories) {
            states = states.concat(territories);
        }
        if (options.armed_forces) {
            states = states.concat(armed_forces);
        }

        return states;
    };

    Chance.prototype.street = function (options) {
        options = initOptions(options);

        var street = this.word({syllables: 2});
        street = this.capitalize(street);
        street += ' ';
        street += options.short_suffix ?
            this.street_suffix().abbreviation :
            this.street_suffix().name;
        return street;
    };

    Chance.prototype.street_suffix = function () {
        return this.pick(this.street_suffixes());
    };

    Chance.prototype.street_suffixes = function () {
        // These are the most common suffixes.
        return this.get("street_suffixes");
    };

    // Note: only returning US zip codes, internationalization will be a whole
    // other beast to tackle at some point.
    Chance.prototype.zip = function (options) {
        var zip = this.n(this.natural, 5, {max: 9});

        if (options && options.plusfour === true) {
            zip.push('-');
            zip = zip.concat(this.n(this.natural, 4, {max: 9}));
        }

        return zip.join("");
    };

    // -- End Location --

    // -- Time

    Chance.prototype.ampm = function () {
        return this.bool() ? 'am' : 'pm';
    };

    Chance.prototype.date = function (options) {
        var date_string, date;

        // If interval is specified we ignore preset
        if(options && (options.min || options.max)) {
            options = initOptions(options, {
                american: true,
                string: false
            });
            var min = typeof options.min !== "undefined" ? options.min.getTime() : 1;
            // 100,000,000 days measured relative to midnight at the beginning of 01 January, 1970 UTC. http://es5.github.io/#x15.9.1.1
            var max = typeof options.max !== "undefined" ? options.max.getTime() : 8640000000000000;

            date = new Date(this.natural({min: min, max: max}));
        } else {
            var m = this.month({raw: true});
            var daysInMonth = m.days;

            if(options && options.month) {
                // Mod 12 to allow months outside range of 0-11 (not encouraged, but also not prevented).
                daysInMonth = this.get('months')[((options.month % 12) + 12) % 12].days;
            }

            options = initOptions(options, {
                year: parseInt(this.year(), 10),
                // Necessary to subtract 1 because Date() 0-indexes month but not day or year
                // for some reason.
                month: m.numeric - 1,
                day: this.natural({min: 1, max: daysInMonth}),
                hour: this.hour(),
                minute: this.minute(),
                second: this.second(),
                millisecond: this.millisecond(),
                american: true,
                string: false
            });

            date = new Date(options.year, options.month, options.day, options.hour, options.minute, options.second, options.millisecond);
        }

        if (options.american) {
            // Adding 1 to the month is necessary because Date() 0-indexes
            // months but not day for some odd reason.
            date_string = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        } else {
            date_string = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        }

        return options.string ? date_string : date;
    };

    Chance.prototype.hammertime = function (options) {
        return this.date(options).getTime();
    };

    Chance.prototype.hour = function (options) {
        options = initOptions(options, {min: 1, max: options && options.twentyfour ? 24 : 12});

        testRange(options.min < 1, "Chance: Min cannot be less than 1.");
        testRange(options.twentyfour && options.max > 24, "Chance: Max cannot be greater than 24 for twentyfour option.");
        testRange(!options.twentyfour && options.max > 12, "Chance: Max cannot be greater than 12.");
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        return this.natural({min: options.min, max: options.max});
    };

    Chance.prototype.millisecond = function () {
        return this.natural({max: 999});
    };

    Chance.prototype.minute = Chance.prototype.second = function (options) {
        options = initOptions(options, {min: 0, max: 59});

        testRange(options.min < 0, "Chance: Min cannot be less than 0.");
        testRange(options.max > 59, "Chance: Max cannot be greater than 59.");
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        return this.natural({min: options.min, max: options.max});
    };

    Chance.prototype.month = function (options) {
        options = initOptions(options, {min: 1, max: 12});

        testRange(options.min < 1, "Chance: Min cannot be less than 1.");
        testRange(options.max > 12, "Chance: Max cannot be greater than 12.");
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        var month = this.pick(this.months().slice(options.min - 1, options.max));
        return options.raw ? month : month.name;
    };

    Chance.prototype.months = function () {
        return this.get("months");
    };

    Chance.prototype.second = function () {
        return this.natural({max: 59});
    };

    Chance.prototype.timestamp = function () {
        return this.natural({min: 1, max: parseInt(new Date().getTime() / 1000, 10)});
    };

    Chance.prototype.year = function (options) {
        // Default to current year as min if none specified
        options = initOptions(options, {min: new Date().getFullYear()});

        // Default to one century after current year as max if none specified
        options.max = (typeof options.max !== "undefined") ? options.max : options.min + 100;

        return this.natural(options).toString();
    };

    // -- End Time

    // -- Finance --

    Chance.prototype.cc = function (options) {
        options = initOptions(options);

        var type, number, to_generate;

        type = (options.type) ?
                    this.cc_type({ name: options.type, raw: true }) :
                    this.cc_type({ raw: true });

        number = type.prefix.split("");
        to_generate = type.length - type.prefix.length - 1;

        // Generates n - 1 digits
        number = number.concat(this.n(this.integer, to_generate, {min: 0, max: 9}));

        // Generates the last digit according to Luhn algorithm
        number.push(this.luhn_calculate(number.join("")));

        return number.join("");
    };

    Chance.prototype.cc_types = function () {
        // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
        return this.get("cc_types");
    };

    Chance.prototype.cc_type = function (options) {
        options = initOptions(options);
        var types = this.cc_types(),
            type = null;

        if (options.name) {
            for (var i = 0; i < types.length; i++) {
                // Accept either name or short_name to specify card type
                if (types[i].name === options.name || types[i].short_name === options.name) {
                    type = types[i];
                    break;
                }
            }
            if (type === null) {
                throw new RangeError("Credit card type '" + options.name + "'' is not supported");
            }
        } else {
            type = this.pick(types);
        }

        return options.raw ? type : type.name;
    };

    //return all world currency by ISO 4217
    Chance.prototype.currency_types = function () {
        return this.get("currency_types");
    };

    //return random world currency by ISO 4217
    Chance.prototype.currency = function () {
        return this.pick(this.currency_types());
    };

    //Return random correct currency exchange pair (e.g. EUR/USD) or array of currency code
    Chance.prototype.currency_pair = function (returnAsString) {
        var currencies = this.unique(this.currency, 2, {
            comparator: function(arr, val) {

                return arr.reduce(function(acc, item) {
                    // If a match has been found, short circuit check and just return
                    return acc || (item.code === val.code);
                }, false);
            }
        });

        if (returnAsString) {
            return currencies[0].code + '/' + currencies[1].code;
        } else {
            return currencies;
        }
    };

    Chance.prototype.dollar = function (options) {
        // By default, a somewhat more sane max for dollar than all available numbers
        options = initOptions(options, {max : 10000, min : 0});

        var dollar = this.floating({min: options.min, max: options.max, fixed: 2}).toString(),
            cents = dollar.split('.')[1];

        if (cents === undefined) {
            dollar += '.00';
        } else if (cents.length < 2) {
            dollar = dollar + '0';
        }

        if (dollar < 0) {
            return '-$' + dollar.replace('-', '');
        } else {
            return '$' + dollar;
        }
    };

    Chance.prototype.exp = function (options) {
        options = initOptions(options);
        var exp = {};

        exp.year = this.exp_year();

        // If the year is this year, need to ensure month is greater than the
        // current month or this expiration will not be valid
        if (exp.year === (new Date().getFullYear())) {
            exp.month = this.exp_month({future: true});
        } else {
            exp.month = this.exp_month();
        }

        return options.raw ? exp : exp.month + '/' + exp.year;
    };

    Chance.prototype.exp_month = function (options) {
        options = initOptions(options);
        var month, month_int,
            curMonth = new Date().getMonth();

        if (options.future) {
            do {
                month = this.month({raw: true}).numeric;
                month_int = parseInt(month, 10);
            } while (month_int < curMonth);
        } else {
            month = this.month({raw: true}).numeric;
        }

        return month;
    };

    Chance.prototype.exp_year = function () {
        return this.year({max: new Date().getFullYear() + 10});
    };

    // -- End Finance

    // -- Miscellaneous --

    // Dice - For all the board game geeks out there, myself included ;)
    function diceFn (range) {
        return function () {
            return this.natural(range);
        };
    }
    Chance.prototype.d4 = diceFn({min: 1, max: 4});
    Chance.prototype.d6 = diceFn({min: 1, max: 6});
    Chance.prototype.d8 = diceFn({min: 1, max: 8});
    Chance.prototype.d10 = diceFn({min: 1, max: 10});
    Chance.prototype.d12 = diceFn({min: 1, max: 12});
    Chance.prototype.d20 = diceFn({min: 1, max: 20});
    Chance.prototype.d30 = diceFn({min: 1, max: 30});
    Chance.prototype.d100 = diceFn({min: 1, max: 100});

    Chance.prototype.rpg = function (thrown, options) {
        options = initOptions(options);
        if (!thrown) {
            throw new RangeError("A type of die roll must be included");
        } else {
            var bits = thrown.toLowerCase().split("d"),
                rolls = [];

            if (bits.length !== 2 || !parseInt(bits[0], 10) || !parseInt(bits[1], 10)) {
                throw new Error("Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");
            }
            for (var i = bits[0]; i > 0; i--) {
                rolls[i - 1] = this.natural({min: 1, max: bits[1]});
            }
            return (typeof options.sum !== 'undefined' && options.sum) ? rolls.reduce(function (p, c) { return p + c; }) : rolls;
        }
    };

    // Guid
    Chance.prototype.guid = function (options) {
        options = initOptions(options, { version: 5 });

        var guid_pool = "abcdef1234567890",
            variant_pool = "ab89",
            guid = this.string({ pool: guid_pool, length: 8 }) + '-' +
                   this.string({ pool: guid_pool, length: 4 }) + '-' +
                   // The Version
                   options.version +
                   this.string({ pool: guid_pool, length: 3 }) + '-' +
                   // The Variant
                   this.string({ pool: variant_pool, length: 1 }) +
                   this.string({ pool: guid_pool, length: 3 }) + '-' +
                   this.string({ pool: guid_pool, length: 12 });
        return guid;
    };

    // Hash
    Chance.prototype.hash = function (options) {
        options = initOptions(options, {length : 40, casing: 'lower'});
        var pool = options.casing === 'upper' ? HEX_POOL.toUpperCase() : HEX_POOL;
        return this.string({pool: pool, length: options.length});
    };

    Chance.prototype.luhn_check = function (num) {
        var str = num.toString();
        var checkDigit = +str.substring(str.length - 1);
        return checkDigit === this.luhn_calculate(+str.substring(0, str.length - 1));
    };

    Chance.prototype.luhn_calculate = function (num) {
        var digits = num.toString().split("").reverse();
        var sum = 0;
        var digit;

        for (var i = 0, l = digits.length; l > i; ++i) {
            digit = +digits[i];
            if (i % 2 === 0) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
        return (sum * 9) % 10;
    };

    // MD5 Hash
    Chance.prototype.md5 = function(options) {
        var opts = { str: '', key: null, raw: false };

        if (!options) {
            opts.str = this.string();
            options = {};
        }
        else if (typeof options === 'string') {
            opts.str = options;
            options = {};
        }
        else if (typeof options !== 'object') {
            return null;
        }
        else if(options.constructor === 'Array') {
            return null;
        }

        opts = initOptions(options, opts);

        if(!opts.str){
            throw new Error('A parameter is required to return an md5 hash.');
        }

        return this.bimd5.md5(opts.str, opts.key, opts.raw);
    };

    var data = {

        firstNames: {
            "male": ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "Juan", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
            "female": ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "John", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"]
        },

        lastNames: ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson', 'McDonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales', 'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes', 'Burns', 'Gordon', 'Shaw', 'Holmes', 'Rice', 'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer', 'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins', 'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner', 'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll', 'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley', 'Lane', 'Andrews', 'Ruiz', 'Harper', 'Fox', 'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene', 'Lawrence', 'Elliott', 'Chavez', 'Sims', 'Austin', 'Peters', 'Kelley', 'Franklin', 'Lawson', 'Fields', 'Gutierrez', 'Ryan', 'Schmidt', 'Carr', 'Vasquez', 'Castillo', 'Wheeler', 'Chapman', 'Oliver', 'Montgomery', 'Richards', 'Williamson', 'Johnston', 'Banks', 'Meyer', 'Bishop', 'McCoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen', 'Fernandez', 'Garza', 'Harvey', 'Little', 'Burton', 'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid', 'Kim', 'Fuller', 'Lynch', 'Dean', 'Gilbert', 'Garrett', 'Romero', 'Welch', 'Larson', 'Frazier', 'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno', 'Bowman', 'Medina', 'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas', 'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May', 'Terry', 'Herrera', 'Wade', 'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell', 'Lowe', 'Jennings', 'Barnett', 'Graves', 'Jimenez', 'Horton', 'Shelton', 'Barrett', 'Obrien', 'Castro', 'Sutton', 'Gregory', 'McKinney', 'Lucas', 'Miles', 'Craig', 'Rodriquez', 'Chambers', 'Holt', 'Lambert', 'Fletcher', 'Watts', 'Bates', 'Hale', 'Rhodes', 'Pena', 'Beck', 'Newman', 'Haynes', 'McDaniel', 'Mendez', 'Bush', 'Vaughn', 'Parks', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele', 'Curry', 'Powers', 'Schultz', 'Barker', 'Guzman', 'Page', 'Munoz', 'Ball', 'Keller', 'Chandler', 'Weber', 'Leonard', 'Walsh', 'Lyons', 'Ramsey', 'Wolfe', 'Schneider', 'Mullins', 'Benson', 'Sharp', 'Bowen', 'Daniel', 'Barber', 'Cummings', 'Hines', 'Baldwin', 'Griffith', 'Valdez', 'Hubbard', 'Salazar', 'Reeves', 'Warner', 'Stevenson', 'Burgess', 'Santos', 'Tate', 'Cross', 'Garner', 'Mann', 'Mack', 'Moss', 'Thornton', 'Dennis', 'McGee', 'Farmer', 'Delgado', 'Aguilar', 'Vega', 'Glover', 'Manning', 'Cohen', 'Harmon', 'Rodgers', 'Robbins', 'Newton', 'Todd', 'Blair', 'Higgins', 'Ingram', 'Reese', 'Cannon', 'Strickland', 'Townsend', 'Potter', 'Goodwin', 'Walton', 'Rowe', 'Hampton', 'Ortega', 'Patton', 'Swanson', 'Joseph', 'Francis', 'Goodman', 'Maldonado', 'Yates', 'Becker', 'Erickson', 'Hodges', 'Rios', 'Conner', 'Adkins', 'Webster', 'Norman', 'Malone', 'Hammond', 'Flowers', 'Cobb', 'Moody', 'Quinn', 'Blake', 'Maxwell', 'Pope', 'Floyd', 'Osborne', 'Paul', 'McCarthy', 'Guerrero', 'Lindsey', 'Estrada', 'Sandoval', 'Gibbs', 'Tyler', 'Gross', 'Fitzgerald', 'Stokes', 'Doyle', 'Sherman', 'Saunders', 'Wise', 'Colon', 'Gill', 'Alvarado', 'Greer', 'Padilla', 'Simon', 'Waters', 'Nunez', 'Ballard', 'Schwartz', 'McBride', 'Houston', 'Christensen', 'Klein', 'Pratt', 'Briggs', 'Parsons', 'McLaughlin', 'Zimmerman', 'French', 'Buchanan', 'Moran', 'Copeland', 'Roy', 'Pittman', 'Brady', 'McCormick', 'Holloway', 'Brock', 'Poole', 'Frank', 'Logan', 'Owen', 'Bass', 'Marsh', 'Drake', 'Wong', 'Jefferson', 'Park', 'Morton', 'Abbott', 'Sparks', 'Patrick', 'Norton', 'Huff', 'Clayton', 'Massey', 'Lloyd', 'Figueroa', 'Carson', 'Bowers', 'Roberson', 'Barton', 'Tran', 'Lamb', 'Harrington', 'Casey', 'Boone', 'Cortez', 'Clarke', 'Mathis', 'Singleton', 'Wilkins', 'Cain', 'Bryan', 'Underwood', 'Hogan', 'McKenzie', 'Collier', 'Luna', 'Phelps', 'McGuire', 'Allison', 'Bridges', 'Wilkerson', 'Nash', 'Summers', 'Atkins'],

        // Data taken from https://github.com/umpirsky/country-list/blob/master/country/cldr/en_US/country.json
        countries: [{"name":"Afghanistan","abbreviation":"AF"},{"name":"Albania","abbreviation":"AL"},{"name":"Algeria","abbreviation":"DZ"},{"name":"American Samoa","abbreviation":"AS"},{"name":"Andorra","abbreviation":"AD"},{"name":"Angola","abbreviation":"AO"},{"name":"Anguilla","abbreviation":"AI"},{"name":"Antarctica","abbreviation":"AQ"},{"name":"Antigua and Barbuda","abbreviation":"AG"},{"name":"Argentina","abbreviation":"AR"},{"name":"Armenia","abbreviation":"AM"},{"name":"Aruba","abbreviation":"AW"},{"name":"Australia","abbreviation":"AU"},{"name":"Austria","abbreviation":"AT"},{"name":"Azerbaijan","abbreviation":"AZ"},{"name":"Bahamas","abbreviation":"BS"},{"name":"Bahrain","abbreviation":"BH"},{"name":"Bangladesh","abbreviation":"BD"},{"name":"Barbados","abbreviation":"BB"},{"name":"Belarus","abbreviation":"BY"},{"name":"Belgium","abbreviation":"BE"},{"name":"Belize","abbreviation":"BZ"},{"name":"Benin","abbreviation":"BJ"},{"name":"Bermuda","abbreviation":"BM"},{"name":"Bhutan","abbreviation":"BT"},{"name":"Bolivia","abbreviation":"BO"},{"name":"Bosnia and Herzegovina","abbreviation":"BA"},{"name":"Botswana","abbreviation":"BW"},{"name":"Bouvet Island","abbreviation":"BV"},{"name":"Brazil","abbreviation":"BR"},{"name":"British Antarctic Territory","abbreviation":"BQ"},{"name":"British Indian Ocean Territory","abbreviation":"IO"},{"name":"British Virgin Islands","abbreviation":"VG"},{"name":"Brunei","abbreviation":"BN"},{"name":"Bulgaria","abbreviation":"BG"},{"name":"Burkina Faso","abbreviation":"BF"},{"name":"Burundi","abbreviation":"BI"},{"name":"Cambodia","abbreviation":"KH"},{"name":"Cameroon","abbreviation":"CM"},{"name":"Canada","abbreviation":"CA"},{"name":"Canton and Enderbury Islands","abbreviation":"CT"},{"name":"Cape Verde","abbreviation":"CV"},{"name":"Cayman Islands","abbreviation":"KY"},{"name":"Central African Republic","abbreviation":"CF"},{"name":"Chad","abbreviation":"TD"},{"name":"Chile","abbreviation":"CL"},{"name":"China","abbreviation":"CN"},{"name":"Christmas Island","abbreviation":"CX"},{"name":"Cocos [Keeling] Islands","abbreviation":"CC"},{"name":"Colombia","abbreviation":"CO"},{"name":"Comoros","abbreviation":"KM"},{"name":"Congo - Brazzaville","abbreviation":"CG"},{"name":"Congo - Kinshasa","abbreviation":"CD"},{"name":"Cook Islands","abbreviation":"CK"},{"name":"Costa Rica","abbreviation":"CR"},{"name":"Croatia","abbreviation":"HR"},{"name":"Cuba","abbreviation":"CU"},{"name":"Cyprus","abbreviation":"CY"},{"name":"Czech Republic","abbreviation":"CZ"},{"name":"Côte d’Ivoire","abbreviation":"CI"},{"name":"Denmark","abbreviation":"DK"},{"name":"Djibouti","abbreviation":"DJ"},{"name":"Dominica","abbreviation":"DM"},{"name":"Dominican Republic","abbreviation":"DO"},{"name":"Dronning Maud Land","abbreviation":"NQ"},{"name":"East Germany","abbreviation":"DD"},{"name":"Ecuador","abbreviation":"EC"},{"name":"Egypt","abbreviation":"EG"},{"name":"El Salvador","abbreviation":"SV"},{"name":"Equatorial Guinea","abbreviation":"GQ"},{"name":"Eritrea","abbreviation":"ER"},{"name":"Estonia","abbreviation":"EE"},{"name":"Ethiopia","abbreviation":"ET"},{"name":"Falkland Islands","abbreviation":"FK"},{"name":"Faroe Islands","abbreviation":"FO"},{"name":"Fiji","abbreviation":"FJ"},{"name":"Finland","abbreviation":"FI"},{"name":"France","abbreviation":"FR"},{"name":"French Guiana","abbreviation":"GF"},{"name":"French Polynesia","abbreviation":"PF"},{"name":"French Southern Territories","abbreviation":"TF"},{"name":"French Southern and Antarctic Territories","abbreviation":"FQ"},{"name":"Gabon","abbreviation":"GA"},{"name":"Gambia","abbreviation":"GM"},{"name":"Georgia","abbreviation":"GE"},{"name":"Germany","abbreviation":"DE"},{"name":"Ghana","abbreviation":"GH"},{"name":"Gibraltar","abbreviation":"GI"},{"name":"Greece","abbreviation":"GR"},{"name":"Greenland","abbreviation":"GL"},{"name":"Grenada","abbreviation":"GD"},{"name":"Guadeloupe","abbreviation":"GP"},{"name":"Guam","abbreviation":"GU"},{"name":"Guatemala","abbreviation":"GT"},{"name":"Guernsey","abbreviation":"GG"},{"name":"Guinea","abbreviation":"GN"},{"name":"Guinea-Bissau","abbreviation":"GW"},{"name":"Guyana","abbreviation":"GY"},{"name":"Haiti","abbreviation":"HT"},{"name":"Heard Island and McDonald Islands","abbreviation":"HM"},{"name":"Honduras","abbreviation":"HN"},{"name":"Hong Kong SAR China","abbreviation":"HK"},{"name":"Hungary","abbreviation":"HU"},{"name":"Iceland","abbreviation":"IS"},{"name":"India","abbreviation":"IN"},{"name":"Indonesia","abbreviation":"ID"},{"name":"Iran","abbreviation":"IR"},{"name":"Iraq","abbreviation":"IQ"},{"name":"Ireland","abbreviation":"IE"},{"name":"Isle of Man","abbreviation":"IM"},{"name":"Israel","abbreviation":"IL"},{"name":"Italy","abbreviation":"IT"},{"name":"Jamaica","abbreviation":"JM"},{"name":"Japan","abbreviation":"JP"},{"name":"Jersey","abbreviation":"JE"},{"name":"Johnston Island","abbreviation":"JT"},{"name":"Jordan","abbreviation":"JO"},{"name":"Kazakhstan","abbreviation":"KZ"},{"name":"Kenya","abbreviation":"KE"},{"name":"Kiribati","abbreviation":"KI"},{"name":"Kuwait","abbreviation":"KW"},{"name":"Kyrgyzstan","abbreviation":"KG"},{"name":"Laos","abbreviation":"LA"},{"name":"Latvia","abbreviation":"LV"},{"name":"Lebanon","abbreviation":"LB"},{"name":"Lesotho","abbreviation":"LS"},{"name":"Liberia","abbreviation":"LR"},{"name":"Libya","abbreviation":"LY"},{"name":"Liechtenstein","abbreviation":"LI"},{"name":"Lithuania","abbreviation":"LT"},{"name":"Luxembourg","abbreviation":"LU"},{"name":"Macau SAR China","abbreviation":"MO"},{"name":"Macedonia","abbreviation":"MK"},{"name":"Madagascar","abbreviation":"MG"},{"name":"Malawi","abbreviation":"MW"},{"name":"Malaysia","abbreviation":"MY"},{"name":"Maldives","abbreviation":"MV"},{"name":"Mali","abbreviation":"ML"},{"name":"Malta","abbreviation":"MT"},{"name":"Marshall Islands","abbreviation":"MH"},{"name":"Martinique","abbreviation":"MQ"},{"name":"Mauritania","abbreviation":"MR"},{"name":"Mauritius","abbreviation":"MU"},{"name":"Mayotte","abbreviation":"YT"},{"name":"Metropolitan France","abbreviation":"FX"},{"name":"Mexico","abbreviation":"MX"},{"name":"Micronesia","abbreviation":"FM"},{"name":"Midway Islands","abbreviation":"MI"},{"name":"Moldova","abbreviation":"MD"},{"name":"Monaco","abbreviation":"MC"},{"name":"Mongolia","abbreviation":"MN"},{"name":"Montenegro","abbreviation":"ME"},{"name":"Montserrat","abbreviation":"MS"},{"name":"Morocco","abbreviation":"MA"},{"name":"Mozambique","abbreviation":"MZ"},{"name":"Myanmar [Burma]","abbreviation":"MM"},{"name":"Namibia","abbreviation":"NA"},{"name":"Nauru","abbreviation":"NR"},{"name":"Nepal","abbreviation":"NP"},{"name":"Netherlands","abbreviation":"NL"},{"name":"Netherlands Antilles","abbreviation":"AN"},{"name":"Neutral Zone","abbreviation":"NT"},{"name":"New Caledonia","abbreviation":"NC"},{"name":"New Zealand","abbreviation":"NZ"},{"name":"Nicaragua","abbreviation":"NI"},{"name":"Niger","abbreviation":"NE"},{"name":"Nigeria","abbreviation":"NG"},{"name":"Niue","abbreviation":"NU"},{"name":"Norfolk Island","abbreviation":"NF"},{"name":"North Korea","abbreviation":"KP"},{"name":"North Vietnam","abbreviation":"VD"},{"name":"Northern Mariana Islands","abbreviation":"MP"},{"name":"Norway","abbreviation":"NO"},{"name":"Oman","abbreviation":"OM"},{"name":"Pacific Islands Trust Territory","abbreviation":"PC"},{"name":"Pakistan","abbreviation":"PK"},{"name":"Palau","abbreviation":"PW"},{"name":"Palestinian Territories","abbreviation":"PS"},{"name":"Panama","abbreviation":"PA"},{"name":"Panama Canal Zone","abbreviation":"PZ"},{"name":"Papua New Guinea","abbreviation":"PG"},{"name":"Paraguay","abbreviation":"PY"},{"name":"People's Democratic Republic of Yemen","abbreviation":"YD"},{"name":"Peru","abbreviation":"PE"},{"name":"Philippines","abbreviation":"PH"},{"name":"Pitcairn Islands","abbreviation":"PN"},{"name":"Poland","abbreviation":"PL"},{"name":"Portugal","abbreviation":"PT"},{"name":"Puerto Rico","abbreviation":"PR"},{"name":"Qatar","abbreviation":"QA"},{"name":"Romania","abbreviation":"RO"},{"name":"Russia","abbreviation":"RU"},{"name":"Rwanda","abbreviation":"RW"},{"name":"Réunion","abbreviation":"RE"},{"name":"Saint Barthélemy","abbreviation":"BL"},{"name":"Saint Helena","abbreviation":"SH"},{"name":"Saint Kitts and Nevis","abbreviation":"KN"},{"name":"Saint Lucia","abbreviation":"LC"},{"name":"Saint Martin","abbreviation":"MF"},{"name":"Saint Pierre and Miquelon","abbreviation":"PM"},{"name":"Saint Vincent and the Grenadines","abbreviation":"VC"},{"name":"Samoa","abbreviation":"WS"},{"name":"San Marino","abbreviation":"SM"},{"name":"Saudi Arabia","abbreviation":"SA"},{"name":"Senegal","abbreviation":"SN"},{"name":"Serbia","abbreviation":"RS"},{"name":"Serbia and Montenegro","abbreviation":"CS"},{"name":"Seychelles","abbreviation":"SC"},{"name":"Sierra Leone","abbreviation":"SL"},{"name":"Singapore","abbreviation":"SG"},{"name":"Slovakia","abbreviation":"SK"},{"name":"Slovenia","abbreviation":"SI"},{"name":"Solomon Islands","abbreviation":"SB"},{"name":"Somalia","abbreviation":"SO"},{"name":"South Africa","abbreviation":"ZA"},{"name":"South Georgia and the South Sandwich Islands","abbreviation":"GS"},{"name":"South Korea","abbreviation":"KR"},{"name":"Spain","abbreviation":"ES"},{"name":"Sri Lanka","abbreviation":"LK"},{"name":"Sudan","abbreviation":"SD"},{"name":"Suriname","abbreviation":"SR"},{"name":"Svalbard and Jan Mayen","abbreviation":"SJ"},{"name":"Swaziland","abbreviation":"SZ"},{"name":"Sweden","abbreviation":"SE"},{"name":"Switzerland","abbreviation":"CH"},{"name":"Syria","abbreviation":"SY"},{"name":"São Tomé and Príncipe","abbreviation":"ST"},{"name":"Taiwan","abbreviation":"TW"},{"name":"Tajikistan","abbreviation":"TJ"},{"name":"Tanzania","abbreviation":"TZ"},{"name":"Thailand","abbreviation":"TH"},{"name":"Timor-Leste","abbreviation":"TL"},{"name":"Togo","abbreviation":"TG"},{"name":"Tokelau","abbreviation":"TK"},{"name":"Tonga","abbreviation":"TO"},{"name":"Trinidad and Tobago","abbreviation":"TT"},{"name":"Tunisia","abbreviation":"TN"},{"name":"Turkey","abbreviation":"TR"},{"name":"Turkmenistan","abbreviation":"TM"},{"name":"Turks and Caicos Islands","abbreviation":"TC"},{"name":"Tuvalu","abbreviation":"TV"},{"name":"U.S. Minor Outlying Islands","abbreviation":"UM"},{"name":"U.S. Miscellaneous Pacific Islands","abbreviation":"PU"},{"name":"U.S. Virgin Islands","abbreviation":"VI"},{"name":"Uganda","abbreviation":"UG"},{"name":"Ukraine","abbreviation":"UA"},{"name":"Union of Soviet Socialist Republics","abbreviation":"SU"},{"name":"United Arab Emirates","abbreviation":"AE"},{"name":"United Kingdom","abbreviation":"GB"},{"name":"United States","abbreviation":"US"},{"name":"Unknown or Invalid Region","abbreviation":"ZZ"},{"name":"Uruguay","abbreviation":"UY"},{"name":"Uzbekistan","abbreviation":"UZ"},{"name":"Vanuatu","abbreviation":"VU"},{"name":"Vatican City","abbreviation":"VA"},{"name":"Venezuela","abbreviation":"VE"},{"name":"Vietnam","abbreviation":"VN"},{"name":"Wake Island","abbreviation":"WK"},{"name":"Wallis and Futuna","abbreviation":"WF"},{"name":"Western Sahara","abbreviation":"EH"},{"name":"Yemen","abbreviation":"YE"},{"name":"Zambia","abbreviation":"ZM"},{"name":"Zimbabwe","abbreviation":"ZW"},{"name":"Åland Islands","abbreviation":"AX"}],

        provinces: [
            {name: 'Alberta', abbreviation: 'AB'},
            {name: 'British Columbia', abbreviation: 'BC'},
            {name: 'Manitoba', abbreviation: 'MB'},
            {name: 'New Brunswick', abbreviation: 'NB'},
            {name: 'Newfoundland and Labrador', abbreviation: 'NL'},
            {name: 'Nova Scotia', abbreviation: 'NS'},
            {name: 'Ontario', abbreviation: 'ON'},
            {name: 'Prince Edward Island', abbreviation: 'PE'},
            {name: 'Quebec', abbreviation: 'QC'},
            {name: 'Saskatchewan', abbreviation: 'SK'},

            // The case could be made that the following are not actually provinces
            // since they are technically considered "territories" however they all
            // look the same on an envelope!
            {name: 'Northwest Territories', abbreviation: 'NT'},
            {name: 'Nunavut', abbreviation: 'NU'},
            {name: 'Yukon', abbreviation: 'YT'}
        ],

        us_states_and_dc: [
            {name: 'Alabama', abbreviation: 'AL'},
            {name: 'Alaska', abbreviation: 'AK'},
            {name: 'Arizona', abbreviation: 'AZ'},
            {name: 'Arkansas', abbreviation: 'AR'},
            {name: 'California', abbreviation: 'CA'},
            {name: 'Colorado', abbreviation: 'CO'},
            {name: 'Connecticut', abbreviation: 'CT'},
            {name: 'Delaware', abbreviation: 'DE'},
            {name: 'District of Columbia', abbreviation: 'DC'},
            {name: 'Florida', abbreviation: 'FL'},
            {name: 'Georgia', abbreviation: 'GA'},
            {name: 'Hawaii', abbreviation: 'HI'},
            {name: 'Idaho', abbreviation: 'ID'},
            {name: 'Illinois', abbreviation: 'IL'},
            {name: 'Indiana', abbreviation: 'IN'},
            {name: 'Iowa', abbreviation: 'IA'},
            {name: 'Kansas', abbreviation: 'KS'},
            {name: 'Kentucky', abbreviation: 'KY'},
            {name: 'Louisiana', abbreviation: 'LA'},
            {name: 'Maine', abbreviation: 'ME'},
            {name: 'Maryland', abbreviation: 'MD'},
            {name: 'Massachusetts', abbreviation: 'MA'},
            {name: 'Michigan', abbreviation: 'MI'},
            {name: 'Minnesota', abbreviation: 'MN'},
            {name: 'Mississippi', abbreviation: 'MS'},
            {name: 'Missouri', abbreviation: 'MO'},
            {name: 'Montana', abbreviation: 'MT'},
            {name: 'Nebraska', abbreviation: 'NE'},
            {name: 'Nevada', abbreviation: 'NV'},
            {name: 'New Hampshire', abbreviation: 'NH'},
            {name: 'New Jersey', abbreviation: 'NJ'},
            {name: 'New Mexico', abbreviation: 'NM'},
            {name: 'New York', abbreviation: 'NY'},
            {name: 'North Carolina', abbreviation: 'NC'},
            {name: 'North Dakota', abbreviation: 'ND'},
            {name: 'Ohio', abbreviation: 'OH'},
            {name: 'Oklahoma', abbreviation: 'OK'},
            {name: 'Oregon', abbreviation: 'OR'},
            {name: 'Pennsylvania', abbreviation: 'PA'},
            {name: 'Rhode Island', abbreviation: 'RI'},
            {name: 'South Carolina', abbreviation: 'SC'},
            {name: 'South Dakota', abbreviation: 'SD'},
            {name: 'Tennessee', abbreviation: 'TN'},
            {name: 'Texas', abbreviation: 'TX'},
            {name: 'Utah', abbreviation: 'UT'},
            {name: 'Vermont', abbreviation: 'VT'},
            {name: 'Virginia', abbreviation: 'VA'},
            {name: 'Washington', abbreviation: 'WA'},
            {name: 'West Virginia', abbreviation: 'WV'},
            {name: 'Wisconsin', abbreviation: 'WI'},
            {name: 'Wyoming', abbreviation: 'WY'}
        ],

        territories: [
            {name: 'American Samoa', abbreviation: 'AS'},
            {name: 'Federated States of Micronesia', abbreviation: 'FM'},
            {name: 'Guam', abbreviation: 'GU'},
            {name: 'Marshall Islands', abbreviation: 'MH'},
            {name: 'Northern Mariana Islands', abbreviation: 'MP'},
            {name: 'Puerto Rico', abbreviation: 'PR'},
            {name: 'Virgin Islands, U.S.', abbreviation: 'VI'}
        ],

        armed_forces: [
            {name: 'Armed Forces Europe', abbreviation: 'AE'},
            {name: 'Armed Forces Pacific', abbreviation: 'AP'},
            {name: 'Armed Forces the Americas', abbreviation: 'AA'}
        ],

        street_suffixes: [
            {name: 'Avenue', abbreviation: 'Ave'},
            {name: 'Boulevard', abbreviation: 'Blvd'},
            {name: 'Center', abbreviation: 'Ctr'},
            {name: 'Circle', abbreviation: 'Cir'},
            {name: 'Court', abbreviation: 'Ct'},
            {name: 'Drive', abbreviation: 'Dr'},
            {name: 'Extension', abbreviation: 'Ext'},
            {name: 'Glen', abbreviation: 'Gln'},
            {name: 'Grove', abbreviation: 'Grv'},
            {name: 'Heights', abbreviation: 'Hts'},
            {name: 'Highway', abbreviation: 'Hwy'},
            {name: 'Junction', abbreviation: 'Jct'},
            {name: 'Key', abbreviation: 'Key'},
            {name: 'Lane', abbreviation: 'Ln'},
            {name: 'Loop', abbreviation: 'Loop'},
            {name: 'Manor', abbreviation: 'Mnr'},
            {name: 'Mill', abbreviation: 'Mill'},
            {name: 'Park', abbreviation: 'Park'},
            {name: 'Parkway', abbreviation: 'Pkwy'},
            {name: 'Pass', abbreviation: 'Pass'},
            {name: 'Path', abbreviation: 'Path'},
            {name: 'Pike', abbreviation: 'Pike'},
            {name: 'Place', abbreviation: 'Pl'},
            {name: 'Plaza', abbreviation: 'Plz'},
            {name: 'Point', abbreviation: 'Pt'},
            {name: 'Ridge', abbreviation: 'Rdg'},
            {name: 'River', abbreviation: 'Riv'},
            {name: 'Road', abbreviation: 'Rd'},
            {name: 'Square', abbreviation: 'Sq'},
            {name: 'Street', abbreviation: 'St'},
            {name: 'Terrace', abbreviation: 'Ter'},
            {name: 'Trail', abbreviation: 'Trl'},
            {name: 'Turnpike', abbreviation: 'Tpke'},
            {name: 'View', abbreviation: 'Vw'},
            {name: 'Way', abbreviation: 'Way'}
        ],

        months: [
            {name: 'January', short_name: 'Jan', numeric: '01', days: 31},
            // Not messing with leap years...
            {name: 'February', short_name: 'Feb', numeric: '02', days: 28},
            {name: 'March', short_name: 'Mar', numeric: '03', days: 31},
            {name: 'April', short_name: 'Apr', numeric: '04', days: 30},
            {name: 'May', short_name: 'May', numeric: '05', days: 31},
            {name: 'June', short_name: 'Jun', numeric: '06', days: 30},
            {name: 'July', short_name: 'Jul', numeric: '07', days: 31},
            {name: 'August', short_name: 'Aug', numeric: '08', days: 31},
            {name: 'September', short_name: 'Sep', numeric: '09', days: 30},
            {name: 'October', short_name: 'Oct', numeric: '10', days: 31},
            {name: 'November', short_name: 'Nov', numeric: '11', days: 30},
            {name: 'December', short_name: 'Dec', numeric: '12', days: 31}
        ],

        // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
        cc_types: [
            {name: "American Express", short_name: 'amex', prefix: '34', length: 15},
            {name: "Bankcard", short_name: 'bankcard', prefix: '5610', length: 16},
            {name: "China UnionPay", short_name: 'chinaunion', prefix: '62', length: 16},
            {name: "Diners Club Carte Blanche", short_name: 'dccarte', prefix: '300', length: 14},
            {name: "Diners Club enRoute", short_name: 'dcenroute', prefix: '2014', length: 15},
            {name: "Diners Club International", short_name: 'dcintl', prefix: '36', length: 14},
            {name: "Diners Club United States & Canada", short_name: 'dcusc', prefix: '54', length: 16},
            {name: "Discover Card", short_name: 'discover', prefix: '6011', length: 16},
            {name: "InstaPayment", short_name: 'instapay', prefix: '637', length: 16},
            {name: "JCB", short_name: 'jcb', prefix: '3528', length: 16},
            {name: "Laser", short_name: 'laser', prefix: '6304', length: 16},
            {name: "Maestro", short_name: 'maestro', prefix: '5018', length: 16},
            {name: "Mastercard", short_name: 'mc', prefix: '51', length: 16},
            {name: "Solo", short_name: 'solo', prefix: '6334', length: 16},
            {name: "Switch", short_name: 'switch', prefix: '4903', length: 16},
            {name: "Visa", short_name: 'visa', prefix: '4', length: 16},
            {name: "Visa Electron", short_name: 'electron', prefix: '4026', length: 16}
        ],

        //return all world currency by ISO 4217
        currency_types: [
            {'code' : 'AED', 'name' : 'United Arab Emirates Dirham'},
            {'code' : 'AFN', 'name' : 'Afghanistan Afghani'},
            {'code' : 'ALL', 'name' : 'Albania Lek'},
            {'code' : 'AMD', 'name' : 'Armenia Dram'},
            {'code' : 'ANG', 'name' : 'Netherlands Antilles Guilder'},
            {'code' : 'AOA', 'name' : 'Angola Kwanza'},
            {'code' : 'ARS', 'name' : 'Argentina Peso'},
            {'code' : 'AUD', 'name' : 'Australia Dollar'},
            {'code' : 'AWG', 'name' : 'Aruba Guilder'},
            {'code' : 'AZN', 'name' : 'Azerbaijan New Manat'},
            {'code' : 'BAM', 'name' : 'Bosnia and Herzegovina Convertible Marka'},
            {'code' : 'BBD', 'name' : 'Barbados Dollar'},
            {'code' : 'BDT', 'name' : 'Bangladesh Taka'},
            {'code' : 'BGN', 'name' : 'Bulgaria Lev'},
            {'code' : 'BHD', 'name' : 'Bahrain Dinar'},
            {'code' : 'BIF', 'name' : 'Burundi Franc'},
            {'code' : 'BMD', 'name' : 'Bermuda Dollar'},
            {'code' : 'BND', 'name' : 'Brunei Darussalam Dollar'},
            {'code' : 'BOB', 'name' : 'Bolivia Boliviano'},
            {'code' : 'BRL', 'name' : 'Brazil Real'},
            {'code' : 'BSD', 'name' : 'Bahamas Dollar'},
            {'code' : 'BTN', 'name' : 'Bhutan Ngultrum'},
            {'code' : 'BWP', 'name' : 'Botswana Pula'},
            {'code' : 'BYR', 'name' : 'Belarus Ruble'},
            {'code' : 'BZD', 'name' : 'Belize Dollar'},
            {'code' : 'CAD', 'name' : 'Canada Dollar'},
            {'code' : 'CDF', 'name' : 'Congo/Kinshasa Franc'},
            {'code' : 'CHF', 'name' : 'Switzerland Franc'},
            {'code' : 'CLP', 'name' : 'Chile Peso'},
            {'code' : 'CNY', 'name' : 'China Yuan Renminbi'},
            {'code' : 'COP', 'name' : 'Colombia Peso'},
            {'code' : 'CRC', 'name' : 'Costa Rica Colon'},
            {'code' : 'CUC', 'name' : 'Cuba Convertible Peso'},
            {'code' : 'CUP', 'name' : 'Cuba Peso'},
            {'code' : 'CVE', 'name' : 'Cape Verde Escudo'},
            {'code' : 'CZK', 'name' : 'Czech Republic Koruna'},
            {'code' : 'DJF', 'name' : 'Djibouti Franc'},
            {'code' : 'DKK', 'name' : 'Denmark Krone'},
            {'code' : 'DOP', 'name' : 'Dominican Republic Peso'},
            {'code' : 'DZD', 'name' : 'Algeria Dinar'},
            {'code' : 'EGP', 'name' : 'Egypt Pound'},
            {'code' : 'ERN', 'name' : 'Eritrea Nakfa'},
            {'code' : 'ETB', 'name' : 'Ethiopia Birr'},
            {'code' : 'EUR', 'name' : 'Euro Member Countries'},
            {'code' : 'FJD', 'name' : 'Fiji Dollar'},
            {'code' : 'FKP', 'name' : 'Falkland Islands (Malvinas) Pound'},
            {'code' : 'GBP', 'name' : 'United Kingdom Pound'},
            {'code' : 'GEL', 'name' : 'Georgia Lari'},
            {'code' : 'GGP', 'name' : 'Guernsey Pound'},
            {'code' : 'GHS', 'name' : 'Ghana Cedi'},
            {'code' : 'GIP', 'name' : 'Gibraltar Pound'},
            {'code' : 'GMD', 'name' : 'Gambia Dalasi'},
            {'code' : 'GNF', 'name' : 'Guinea Franc'},
            {'code' : 'GTQ', 'name' : 'Guatemala Quetzal'},
            {'code' : 'GYD', 'name' : 'Guyana Dollar'},
            {'code' : 'HKD', 'name' : 'Hong Kong Dollar'},
            {'code' : 'HNL', 'name' : 'Honduras Lempira'},
            {'code' : 'HRK', 'name' : 'Croatia Kuna'},
            {'code' : 'HTG', 'name' : 'Haiti Gourde'},
            {'code' : 'HUF', 'name' : 'Hungary Forint'},
            {'code' : 'IDR', 'name' : 'Indonesia Rupiah'},
            {'code' : 'ILS', 'name' : 'Israel Shekel'},
            {'code' : 'IMP', 'name' : 'Isle of Man Pound'},
            {'code' : 'INR', 'name' : 'India Rupee'},
            {'code' : 'IQD', 'name' : 'Iraq Dinar'},
            {'code' : 'IRR', 'name' : 'Iran Rial'},
            {'code' : 'ISK', 'name' : 'Iceland Krona'},
            {'code' : 'JEP', 'name' : 'Jersey Pound'},
            {'code' : 'JMD', 'name' : 'Jamaica Dollar'},
            {'code' : 'JOD', 'name' : 'Jordan Dinar'},
            {'code' : 'JPY', 'name' : 'Japan Yen'},
            {'code' : 'KES', 'name' : 'Kenya Shilling'},
            {'code' : 'KGS', 'name' : 'Kyrgyzstan Som'},
            {'code' : 'KHR', 'name' : 'Cambodia Riel'},
            {'code' : 'KMF', 'name' : 'Comoros Franc'},
            {'code' : 'KPW', 'name' : 'Korea (North) Won'},
            {'code' : 'KRW', 'name' : 'Korea (South) Won'},
            {'code' : 'KWD', 'name' : 'Kuwait Dinar'},
            {'code' : 'KYD', 'name' : 'Cayman Islands Dollar'},
            {'code' : 'KZT', 'name' : 'Kazakhstan Tenge'},
            {'code' : 'LAK', 'name' : 'Laos Kip'},
            {'code' : 'LBP', 'name' : 'Lebanon Pound'},
            {'code' : 'LKR', 'name' : 'Sri Lanka Rupee'},
            {'code' : 'LRD', 'name' : 'Liberia Dollar'},
            {'code' : 'LSL', 'name' : 'Lesotho Loti'},
            {'code' : 'LTL', 'name' : 'Lithuania Litas'},
            {'code' : 'LYD', 'name' : 'Libya Dinar'},
            {'code' : 'MAD', 'name' : 'Morocco Dirham'},
            {'code' : 'MDL', 'name' : 'Moldova Leu'},
            {'code' : 'MGA', 'name' : 'Madagascar Ariary'},
            {'code' : 'MKD', 'name' : 'Macedonia Denar'},
            {'code' : 'MMK', 'name' : 'Myanmar (Burma) Kyat'},
            {'code' : 'MNT', 'name' : 'Mongolia Tughrik'},
            {'code' : 'MOP', 'name' : 'Macau Pataca'},
            {'code' : 'MRO', 'name' : 'Mauritania Ouguiya'},
            {'code' : 'MUR', 'name' : 'Mauritius Rupee'},
            {'code' : 'MVR', 'name' : 'Maldives (Maldive Islands) Rufiyaa'},
            {'code' : 'MWK', 'name' : 'Malawi Kwacha'},
            {'code' : 'MXN', 'name' : 'Mexico Peso'},
            {'code' : 'MYR', 'name' : 'Malaysia Ringgit'},
            {'code' : 'MZN', 'name' : 'Mozambique Metical'},
            {'code' : 'NAD', 'name' : 'Namibia Dollar'},
            {'code' : 'NGN', 'name' : 'Nigeria Naira'},
            {'code' : 'NIO', 'name' : 'Nicaragua Cordoba'},
            {'code' : 'NOK', 'name' : 'Norway Krone'},
            {'code' : 'NPR', 'name' : 'Nepal Rupee'},
            {'code' : 'NZD', 'name' : 'New Zealand Dollar'},
            {'code' : 'OMR', 'name' : 'Oman Rial'},
            {'code' : 'PAB', 'name' : 'Panama Balboa'},
            {'code' : 'PEN', 'name' : 'Peru Nuevo Sol'},
            {'code' : 'PGK', 'name' : 'Papua New Guinea Kina'},
            {'code' : 'PHP', 'name' : 'Philippines Peso'},
            {'code' : 'PKR', 'name' : 'Pakistan Rupee'},
            {'code' : 'PLN', 'name' : 'Poland Zloty'},
            {'code' : 'PYG', 'name' : 'Paraguay Guarani'},
            {'code' : 'QAR', 'name' : 'Qatar Riyal'},
            {'code' : 'RON', 'name' : 'Romania New Leu'},
            {'code' : 'RSD', 'name' : 'Serbia Dinar'},
            {'code' : 'RUB', 'name' : 'Russia Ruble'},
            {'code' : 'RWF', 'name' : 'Rwanda Franc'},
            {'code' : 'SAR', 'name' : 'Saudi Arabia Riyal'},
            {'code' : 'SBD', 'name' : 'Solomon Islands Dollar'},
            {'code' : 'SCR', 'name' : 'Seychelles Rupee'},
            {'code' : 'SDG', 'name' : 'Sudan Pound'},
            {'code' : 'SEK', 'name' : 'Sweden Krona'},
            {'code' : 'SGD', 'name' : 'Singapore Dollar'},
            {'code' : 'SHP', 'name' : 'Saint Helena Pound'},
            {'code' : 'SLL', 'name' : 'Sierra Leone Leone'},
            {'code' : 'SOS', 'name' : 'Somalia Shilling'},
            {'code' : 'SPL', 'name' : 'Seborga Luigino'},
            {'code' : 'SRD', 'name' : 'Suriname Dollar'},
            {'code' : 'STD', 'name' : 'São Tomé and Príncipe Dobra'},
            {'code' : 'SVC', 'name' : 'El Salvador Colon'},
            {'code' : 'SYP', 'name' : 'Syria Pound'},
            {'code' : 'SZL', 'name' : 'Swaziland Lilangeni'},
            {'code' : 'THB', 'name' : 'Thailand Baht'},
            {'code' : 'TJS', 'name' : 'Tajikistan Somoni'},
            {'code' : 'TMT', 'name' : 'Turkmenistan Manat'},
            {'code' : 'TND', 'name' : 'Tunisia Dinar'},
            {'code' : 'TOP', 'name' : 'Tonga Pa\'anga'},
            {'code' : 'TRY', 'name' : 'Turkey Lira'},
            {'code' : 'TTD', 'name' : 'Trinidad and Tobago Dollar'},
            {'code' : 'TVD', 'name' : 'Tuvalu Dollar'},
            {'code' : 'TWD', 'name' : 'Taiwan New Dollar'},
            {'code' : 'TZS', 'name' : 'Tanzania Shilling'},
            {'code' : 'UAH', 'name' : 'Ukraine Hryvnia'},
            {'code' : 'UGX', 'name' : 'Uganda Shilling'},
            {'code' : 'USD', 'name' : 'United States Dollar'},
            {'code' : 'UYU', 'name' : 'Uruguay Peso'},
            {'code' : 'UZS', 'name' : 'Uzbekistan Som'},
            {'code' : 'VEF', 'name' : 'Venezuela Bolivar'},
            {'code' : 'VND', 'name' : 'Viet Nam Dong'},
            {'code' : 'VUV', 'name' : 'Vanuatu Vatu'},
            {'code' : 'WST', 'name' : 'Samoa Tala'},
            {'code' : 'XAF', 'name' : 'Communauté Financière Africaine (BEAC) CFA Franc BEAC'},
            {'code' : 'XCD', 'name' : 'East Caribbean Dollar'},
            {'code' : 'XDR', 'name' : 'International Monetary Fund (IMF) Special Drawing Rights'},
            {'code' : 'XOF', 'name' : 'Communauté Financière Africaine (BCEAO) Franc'},
            {'code' : 'XPF', 'name' : 'Comptoirs Français du Pacifique (CFP) Franc'},
            {'code' : 'YER', 'name' : 'Yemen Rial'},
            {'code' : 'ZAR', 'name' : 'South Africa Rand'},
            {'code' : 'ZMW', 'name' : 'Zambia Kwacha'},
            {'code' : 'ZWD', 'name' : 'Zimbabwe Dollar'}
        ]
    };

    var o_hasOwnProperty = Object.prototype.hasOwnProperty;
    var o_keys = (Object.keys || function(obj) {
      var result = [];
      for (var key in obj) {
        if (o_hasOwnProperty.call(obj, key)) {
          result.push(key);
        }
      }

      return result;
    });

    function _copyObject(source, target) {
      var keys = o_keys(source);
      var key;

      for (var i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        target[key] = source[key] || target[key];
      }
    }

    function _copyArray(source, target) {
      for (var i = 0, l = source.length; i < l; i++) {
        target[i] = source[i];
      }
    }

    function copyObject(source, _target) {
        var isArray = Array.isArray(source);
        var target = _target || (isArray ? new Array(source.length) : {});

        if (isArray) {
          _copyArray(source, target);
        } else {
          _copyObject(source, target);
        }

        return target;
    }

    /** Get the data based on key**/
    Chance.prototype.get = function (name) {
        return copyObject(data[name]);
    };

    // Mac Address
    Chance.prototype.mac_address = function(options){
        // typically mac addresses are separated by ":"
        // however they can also be separated by "-"
        // the network variant uses a dot every fourth byte

        options = initOptions(options);
        if(!options.separator) {
            options.separator =  options.networkVersion ? "." : ":";
        }

        var mac_pool="ABCDEF1234567890",
            mac = "";
        if(!options.networkVersion) {
            mac = this.n(this.string, 6, { pool: mac_pool, length:2 }).join(options.separator);
        } else {
            mac = this.n(this.string, 3, { pool: mac_pool, length:4 }).join(options.separator);
        }

        return mac;
    };

    Chance.prototype.normal = function (options) {
        options = initOptions(options, {mean : 0, dev : 1});

        // The Marsaglia Polar method
        var s, u, v, norm,
            mean = options.mean,
            dev = options.dev;

        do {
            // U and V are from the uniform distribution on (-1, 1)
            u = this.random() * 2 - 1;
            v = this.random() * 2 - 1;

            s = u * u + v * v;
        } while (s >= 1);

        // Compute the standard normal variate
        norm = u * Math.sqrt(-2 * Math.log(s) / s);

        // Shape and scale
        return dev * norm + mean;
    };

    Chance.prototype.radio = function (options) {
        // Initial Letter (Typically Designated by Side of Mississippi River)
        options = initOptions(options, {side : "?"});
        var fl = "";
        switch (options.side.toLowerCase()) {
        case "east":
        case "e":
            fl = "W";
            break;
        case "west":
        case "w":
            fl = "K";
            break;
        default:
            fl = this.character({pool: "KW"});
            break;
        }

        return fl + this.character({alpha: true, casing: "upper"}) +
                this.character({alpha: true, casing: "upper"}) +
                this.character({alpha: true, casing: "upper"});
    };

    // Set the data as key and data or the data map
    Chance.prototype.set = function (name, values) {
        if (typeof name === "string") {
            data[name] = values;
        } else {
            data = copyObject(name, data);
        }
    };

    Chance.prototype.tv = function (options) {
        return this.radio(options);
    };

    // ID number for Brazil companies
    Chance.prototype.cnpj = function () {
        var n = this.n(this.natural, 8, { max: 9 });
        var d1 = 2+n[7]*6+n[6]*7+n[5]*8+n[4]*9+n[3]*2+n[2]*3+n[1]*4+n[0]*5;
        d1 = 11 - (d1 % 11);
        if (d1>=10){
            d1 = 0;
        }
        var d2 = d1*2+3+n[7]*7+n[6]*8+n[5]*9+n[4]*2+n[3]*3+n[2]*4+n[1]*5+n[0]*6;
        d2 = 11 - (d2 % 11);
        if (d2>=10){
            d2 = 0;
        }
        return ''+n[0]+n[1]+'.'+n[2]+n[3]+n[4]+'.'+n[5]+n[6]+n[7]+'/0001-'+d1+d2;
    };

    // -- End Miscellaneous --

    Chance.prototype.mersenne_twister = function (seed) {
        return new MersenneTwister(seed);
    };

    Chance.prototype.blueimp_md5 = function () {
        return new BlueImpMD5();
    };

    // Mersenne Twister from https://gist.github.com/banksean/300494
    var MersenneTwister = function (seed) {
        if (seed === undefined) {
            // kept random number same size as time used previously to ensure no unexpected results downstream
            seed = Math.floor(Math.random()*Math.pow(10,13));
        }
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;   /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N + 1 means mt[N] is not initialized */

        this.init_genrand(seed);
    };

    /* initializes mt[N] with a seed */
    MersenneTwister.prototype.init_genrand = function (s) {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    };

    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
        var i = 1, j = 0, k, s;
        this.init_genrand(19650218);
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
            if (j >= key_length) { j = 0; }
        }
        for (k = this.N - 1; k; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    };

    /* generates a random number on [0,0xffffffff]-interval */
    MersenneTwister.prototype.genrand_int32 = function () {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

            if (this.mti === this.N + 1) {   /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */
            }
            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk + 1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (;kk < this.N - 1; kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk + 1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    };

    /* generates a random number on [0,0x7fffffff]-interval */
    MersenneTwister.prototype.genrand_int31 = function () {
        return (this.genrand_int32() >>> 1);
    };

    /* generates a random number on [0,1]-real-interval */
    MersenneTwister.prototype.genrand_real1 = function () {
        return this.genrand_int32() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    };

    /* generates a random number on [0,1)-real-interval */
    MersenneTwister.prototype.random = function () {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };

    /* generates a random number on (0,1)-real-interval */
    MersenneTwister.prototype.genrand_real3 = function () {
        return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };

    /* generates a random number on [0,1) with 53-bit resolution*/
    MersenneTwister.prototype.genrand_res53 = function () {
        var a = this.genrand_int32()>>>5, b = this.genrand_int32()>>>6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    };

    // BlueImp MD5 hashing algorithm from https://github.com/blueimp/JavaScript-MD5
    var BlueImpMD5 = function () {};

    BlueImpMD5.prototype.VERSION = '1.0.1';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    BlueImpMD5.prototype.safe_add = function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    BlueImpMD5.prototype.bit_roll = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

    /*
    * These functions implement the five basic operations the algorithm uses.
    */
    BlueImpMD5.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_roll(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    BlueImpMD5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    BlueImpMD5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    BlueImpMD5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    BlueImpMD5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    BlueImpMD5.prototype.binl_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = this.md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = this.md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = this.md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = this.md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = this.md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = this.md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = this.md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = this.md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = this.md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = this.md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = this.md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = this.md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = this.md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = this.md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = this.md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = this.md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    };

    /*
    * Convert an array of little-endian words to a string
    */
    BlueImpMD5.prototype.binl2rstr = function (input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    };

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    BlueImpMD5.prototype.rstr2binl = function (input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    };

    /*
    * Calculate the MD5 of a raw string
    */
    BlueImpMD5.prototype.rstr_md5 = function (s) {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    };

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    BlueImpMD5.prototype.rstr_hmac_md5 = function (key, data) {
        var i,
            bkey = this.rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = this.binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    };

    /*
    * Convert a raw string to a hex string
    */
    BlueImpMD5.prototype.rstr2hex = function (input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    };

    /*
    * Encode a string as utf-8
    */
    BlueImpMD5.prototype.str2rstr_utf8 = function (input) {
        return unescape(encodeURIComponent(input));
    };

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    BlueImpMD5.prototype.raw_md5 = function (s) {
        return this.rstr_md5(this.str2rstr_utf8(s));
    };
    BlueImpMD5.prototype.hex_md5 = function (s) {
        return this.rstr2hex(this.raw_md5(s));
    };
    BlueImpMD5.prototype.raw_hmac_md5 = function (k, d) {
        return this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d));
    };
    BlueImpMD5.prototype.hex_hmac_md5 = function (k, d) {
        return this.rstr2hex(this.raw_hmac_md5(k, d));
    };

    BlueImpMD5.prototype.md5 = function (string, key, raw) {
        if (!key) {
            if (!raw) {
                return this.hex_md5(string);
            }

            return this.raw_md5(string);
        }

        if (!raw) {
            return this.hex_hmac_md5(key, string);
        }

        return this.raw_hmac_md5(key, string);
    };

    // CommonJS module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Chance;
        }
        exports.Chance = Chance;
    }

    // Register as an anonymous AMD module
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return Chance;
        });
    }

    // if there is a importsScrips object define chance for worker
    if (typeof importScripts !== 'undefined') {
        chance = new Chance();
    }

    // If there is a window object, that at least has a document property,
    // instantiate and define chance on the window
    if (typeof window === "object" && typeof window.document === "object") {
        window.Chance = Chance;
        window.chance = new Chance();
    }
})();

}).call(this,require("buffer").Buffer)
},{"buffer":5}],10:[function(require,module,exports){
module.exports = require('./src/PathFinding');

},{"./src/PathFinding":13}],11:[function(require,module,exports){
module.exports = require('./lib/heap');

},{"./lib/heap":12}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = Heap;
  } else {
    window.Heap = Heap;
  }

}).call(this);

},{}],13:[function(require,module,exports){
module.exports = {
    'Heap'                      : require('heap'),
    'Node'                      : require('./core/Node'),
    'Grid'                      : require('./core/Grid'),
    'Util'                      : require('./core/Util'),
	'DiagonalMovement'          : require('./core/DiagonalMovement'),
    'Heuristic'                 : require('./core/Heuristic'),
    'AStarFinder'               : require('./finders/AStarFinder'),
    'BestFirstFinder'           : require('./finders/BestFirstFinder'),
    'BreadthFirstFinder'        : require('./finders/BreadthFirstFinder'),
    'DijkstraFinder'            : require('./finders/DijkstraFinder'),
    'BiAStarFinder'             : require('./finders/BiAStarFinder'),
    'BiBestFirstFinder'         : require('./finders/BiBestFirstFinder'),
    'BiBreadthFirstFinder'      : require('./finders/BiBreadthFirstFinder'),
    'BiDijkstraFinder'          : require('./finders/BiDijkstraFinder'),
    'IDAStarFinder'             : require('./finders/IDAStarFinder'),
    'JumpPointFinder'           : require('./finders/JumpPointFinder'),
};

},{"./core/DiagonalMovement":14,"./core/Grid":15,"./core/Heuristic":16,"./core/Node":17,"./core/Util":18,"./finders/AStarFinder":19,"./finders/BestFirstFinder":20,"./finders/BiAStarFinder":21,"./finders/BiBestFirstFinder":22,"./finders/BiBreadthFirstFinder":23,"./finders/BiDijkstraFinder":24,"./finders/BreadthFirstFinder":25,"./finders/DijkstraFinder":26,"./finders/IDAStarFinder":27,"./finders/JumpPointFinder":32,"heap":11}],14:[function(require,module,exports){
var DiagonalMovement = {
    Always: 1,
    Never: 2,
    IfAtMostOneObstacle: 3,
    OnlyWhenNoObstacles: 4
};

module.exports = DiagonalMovement;
},{}],15:[function(require,module,exports){
var Node = require('./Node');
var DiagonalMovement = require('./DiagonalMovement');

/**
 * The Grid class, which serves as the encapsulation of the layout of the nodes.
 * @constructor
 * @param {number|Array.<Array.<(number|boolean)>>} width_or_matrix Number of columns of the grid, or matrix
 * @param {number} height Number of rows of the grid.
 * @param {Array.<Array.<(number|boolean)>>} [matrix] - A 0-1 matrix
 *     representing the walkable status of the nodes(0 or false for walkable).
 *     If the matrix is not supplied, all the nodes will be walkable.  */
function Grid(width_or_matrix, height, matrix) {
    var width;

    if (typeof width_or_matrix !== 'object') {
        width = width_or_matrix;
    } else {
        height = width_or_matrix.length;
        width = width_or_matrix[0].length;
        matrix = width_or_matrix;
    }

    /**
     * The number of columns of the grid.
     * @type number
     */
    this.width = width;
    /**
     * The number of rows of the grid.
     * @type number
     */
    this.height = height;

    /**
     * A 2D array of nodes.
     */
    this.nodes = this._buildNodes(width, height, matrix);
}

/**
 * Build and return the nodes.
 * @private
 * @param {number} width
 * @param {number} height
 * @param {Array.<Array.<number|boolean>>} [matrix] - A 0-1 matrix representing
 *     the walkable status of the nodes.
 * @see Grid
 */
Grid.prototype._buildNodes = function(width, height, matrix) {
    var i, j,
        nodes = new Array(height),
        row;

    for (i = 0; i < height; ++i) {
        nodes[i] = new Array(width);
        for (j = 0; j < width; ++j) {
            nodes[i][j] = new Node(j, i);
        }
    }


    if (matrix === undefined) {
        return nodes;
    }

    if (matrix.length !== height || matrix[0].length !== width) {
        throw new Error('Matrix size does not fit');
    }

    for (i = 0; i < height; ++i) {
        for (j = 0; j < width; ++j) {
            if (matrix[i][j]) {
                // 0, false, null will be walkable
                // while others will be un-walkable
                nodes[i][j].walkable = false;
            }
        }
    }

    return nodes;
};


Grid.prototype.getNodeAt = function(x, y) {
    return this.nodes[y][x];
};


/**
 * Determine whether the node at the given position is walkable.
 * (Also returns false if the position is outside the grid.)
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {boolean} - The walkability of the node.
 */
Grid.prototype.isWalkableAt = function(x, y) {
    return this.isInside(x, y) && this.nodes[y][x].walkable;
};


/**
 * Determine whether the position is inside the grid.
 * XXX: `grid.isInside(x, y)` is wierd to read.
 * It should be `(x, y) is inside grid`, but I failed to find a better
 * name for this method.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
Grid.prototype.isInside = function(x, y) {
    return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
};


/**
 * Set whether the node on the given position is walkable.
 * NOTE: throws exception if the coordinate is not inside the grid.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {boolean} walkable - Whether the position is walkable.
 */
Grid.prototype.setWalkableAt = function(x, y, walkable) {
    this.nodes[y][x].walkable = walkable;
};


/**
 * Get the neighbors of the given node.
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {DiagonalMovement} diagonalMovement
 */
Grid.prototype.getNeighbors = function(node, diagonalMovement) {
    var x = node.x,
        y = node.y,
        neighbors = [],
        s0 = false, d0 = false,
        s1 = false, d1 = false,
        s2 = false, d2 = false,
        s3 = false, d3 = false,
        nodes = this.nodes;

    // ↑
    if (this.isWalkableAt(x, y - 1)) {
        neighbors.push(nodes[y - 1][x]);
        s0 = true;
    }
    // →
    if (this.isWalkableAt(x + 1, y)) {
        neighbors.push(nodes[y][x + 1]);
        s1 = true;
    }
    // ↓
    if (this.isWalkableAt(x, y + 1)) {
        neighbors.push(nodes[y + 1][x]);
        s2 = true;
    }
    // ←
    if (this.isWalkableAt(x - 1, y)) {
        neighbors.push(nodes[y][x - 1]);
        s3 = true;
    }

    if (diagonalMovement === DiagonalMovement.Never) {
        return neighbors;
    }

    if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        d0 = s3 && s0;
        d1 = s0 && s1;
        d2 = s1 && s2;
        d3 = s2 && s3;
    } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
        d0 = s3 || s0;
        d1 = s0 || s1;
        d2 = s1 || s2;
        d3 = s2 || s3;
    } else if (diagonalMovement === DiagonalMovement.Always) {
        d0 = true;
        d1 = true;
        d2 = true;
        d3 = true;
    } else {
        throw new Error('Incorrect value of diagonalMovement');
    }

    // ↖
    if (d0 && this.isWalkableAt(x - 1, y - 1)) {
        neighbors.push(nodes[y - 1][x - 1]);
    }
    // ↗
    if (d1 && this.isWalkableAt(x + 1, y - 1)) {
        neighbors.push(nodes[y - 1][x + 1]);
    }
    // ↘
    if (d2 && this.isWalkableAt(x + 1, y + 1)) {
        neighbors.push(nodes[y + 1][x + 1]);
    }
    // ↙
    if (d3 && this.isWalkableAt(x - 1, y + 1)) {
        neighbors.push(nodes[y + 1][x - 1]);
    }

    return neighbors;
};


/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */
Grid.prototype.clone = function() {
    var i, j,

        width = this.width,
        height = this.height,
        thisNodes = this.nodes,

        newGrid = new Grid(width, height),
        newNodes = new Array(height),
        row;

    for (i = 0; i < height; ++i) {
        newNodes[i] = new Array(width);
        for (j = 0; j < width; ++j) {
            newNodes[i][j] = new Node(j, i, thisNodes[i][j].walkable);
        }
    }

    newGrid.nodes = newNodes;

    return newGrid;
};

module.exports = Grid;

},{"./DiagonalMovement":14,"./Node":17}],16:[function(require,module,exports){
/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions.
 */
module.exports = {

  /**
   * Manhattan distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} dx + dy
   */
  manhattan: function(dx, dy) {
      return dx + dy;
  },

  /**
   * Euclidean distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy)
   */
  euclidean: function(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Octile distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy) for grids
   */
  octile: function(dx, dy) {
      var F = Math.SQRT2 - 1;
      return (dx < dy) ? F * dx + dy : F * dy + dx;
  },

  /**
   * Chebyshev distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} max(dx, dy)
   */
  chebyshev: function(dx, dy) {
      return Math.max(dx, dy);
  }

};

},{}],17:[function(require,module,exports){
/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 */
function Node(x, y, walkable) {
    /**
     * The x coordinate of the node on the grid.
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type number
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    this.walkable = (walkable === undefined ? true : walkable);
}

module.exports = Node;

},{}],18:[function(require,module,exports){
/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @param {Node} node End node
 * @return {Array.<Array.<number>>} the path
 */
function backtrace(node) {
    var path = [[node.x, node.y]];
    while (node.parent) {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    return path.reverse();
}
exports.backtrace = backtrace;

/**
 * Backtrace from start and end node, and return the path.
 * (including both start and end nodes)
 * @param {Node}
 * @param {Node}
 */
function biBacktrace(nodeA, nodeB) {
    var pathA = backtrace(nodeA),
        pathB = backtrace(nodeB);
    return pathA.concat(pathB.reverse());
}
exports.biBacktrace = biBacktrace;

/**
 * Compute the length of the path.
 * @param {Array.<Array.<number>>} path The path
 * @return {number} The length of the path
 */
function pathLength(path) {
    var i, sum = 0, a, b, dx, dy;
    for (i = 1; i < path.length; ++i) {
        a = path[i - 1];
        b = path[i];
        dx = a[0] - b[0];
        dy = a[1] - b[1];
        sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
}
exports.pathLength = pathLength;


/**
 * Given the start and end coordinates, return all the coordinates lying
 * on the line formed by these coordinates, based on Bresenham's algorithm.
 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
 * @param {number} x0 Start x coordinate
 * @param {number} y0 Start y coordinate
 * @param {number} x1 End x coordinate
 * @param {number} y1 End y coordinate
 * @return {Array.<Array.<number>>} The coordinates on the line
 */
function interpolate(x0, y0, x1, y1) {
    var abs = Math.abs,
        line = [],
        sx, sy, dx, dy, err, e2;

    dx = abs(x1 - x0);
    dy = abs(y1 - y0);

    sx = (x0 < x1) ? 1 : -1;
    sy = (y0 < y1) ? 1 : -1;

    err = dx - dy;

    while (true) {
        line.push([x0, y0]);

        if (x0 === x1 && y0 === y1) {
            break;
        }
        
        e2 = 2 * err;
        if (e2 > -dy) {
            err = err - dy;
            x0 = x0 + sx;
        }
        if (e2 < dx) {
            err = err + dx;
            y0 = y0 + sy;
        }
    }

    return line;
}
exports.interpolate = interpolate;


/**
 * Given a compressed path, return a new path that has all the segments
 * in it interpolated.
 * @param {Array.<Array.<number>>} path The path
 * @return {Array.<Array.<number>>} expanded path
 */
function expandPath(path) {
    var expanded = [],
        len = path.length,
        coord0, coord1,
        interpolated,
        interpolatedLen,
        i, j;

    if (len < 2) {
        return expanded;
    }

    for (i = 0; i < len - 1; ++i) {
        coord0 = path[i];
        coord1 = path[i + 1];

        interpolated = interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
        interpolatedLen = interpolated.length;
        for (j = 0; j < interpolatedLen - 1; ++j) {
            expanded.push(interpolated[j]);
        }
    }
    expanded.push(path[len - 1]);

    return expanded;
}
exports.expandPath = expandPath;


/**
 * Smoothen the give path.
 * The original path will not be modified; a new path will be returned.
 * @param {PF.Grid} grid
 * @param {Array.<Array.<number>>} path The path
 */
function smoothenPath(grid, path) {
    var len = path.length,
        x0 = path[0][0],        // path start x
        y0 = path[0][1],        // path start y
        x1 = path[len - 1][0],  // path end x
        y1 = path[len - 1][1],  // path end y
        sx, sy,                 // current start coordinate
        ex, ey,                 // current end coordinate
        newPath,
        i, j, coord, line, testCoord, blocked;

    sx = x0;
    sy = y0;
    newPath = [[sx, sy]];

    for (i = 2; i < len; ++i) {
        coord = path[i];
        ex = coord[0];
        ey = coord[1];
        line = interpolate(sx, sy, ex, ey);

        blocked = false;
        for (j = 1; j < line.length; ++j) {
            testCoord = line[j];

            if (!grid.isWalkableAt(testCoord[0], testCoord[1])) {
                blocked = true;
                break;
            }
        }
        if (blocked) {
            lastValidCoord = path[i - 1];
            newPath.push(lastValidCoord);
            sx = lastValidCoord[0];
            sy = lastValidCoord[1];
        }
    }
    newPath.push([x1, y1]);

    return newPath;
}
exports.smoothenPath = smoothenPath;


/**
 * Compress a path, remove redundant nodes without altering the shape
 * The original path is not modified
 * @param {Array.<Array.<number>>} path The path
 * @return {Array.<Array.<number>>} The compressed path
 */
function compressPath(path) {

    // nothing to compress
    if(path.length < 3) {
        return path;
    }

    var compressed = [],
        sx = path[0][0], // start x
        sy = path[0][1], // start y
        px = path[1][0], // second point x
        py = path[1][1], // second point y
        dx = px - sx, // direction between the two points
        dy = py - sy, // direction between the two points
        lx, ly,
        ldx, ldy,
        sq, i;

    // normalize the direction
    sq = Math.sqrt(dx*dx + dy*dy);
    dx /= sq;
    dy /= sq;

    // start the new path
    compressed.push([sx,sy]);

    for(i = 2; i < path.length; i++) {

        // store the last point
        lx = px;
        ly = py;

        // store the last direction
        ldx = dx;
        ldy = dy;

        // next point
        px = path[i][0];
        py = path[i][1];

        // next direction
        dx = px - lx;
        dy = py - ly;

        // normalize
        sq = Math.sqrt(dx*dx + dy*dy);
        dx /= sq;
        dy /= sq;

        // if the direction has changed, store the point
        if ( dx !== ldx || dy !== ldy ) {
            compressed.push([lx,ly]);
        }
    }

    // store the last point
    compressed.push([px,py]);

    return compressed;
}
exports.compressPath = compressPath;

},{}],19:[function(require,module,exports){
var Heap       = require('heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * A* path-finder.
 * based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {integer} opt.weight Weight to apply to the heuristic to allow for suboptimal paths, 
 *     in order to speed up the search.
 */
function AStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    //When diagonal movement is allowed the manhattan heuristic is not admissible
    //It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
AStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = AStarFinder;

},{"../core/DiagonalMovement":14,"../core/Heuristic":16,"../core/Util":18,"heap":11}],20:[function(require,module,exports){
var AStarFinder = require('./AStarFinder');

/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */
function BestFirstFinder(opt) {
    AStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
}

BestFirstFinder.prototype = new AStarFinder();
BestFirstFinder.prototype.constructor = BestFirstFinder;

module.exports = BestFirstFinder;

},{"./AStarFinder":19}],21:[function(require,module,exports){
var Heap       = require('heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * A* path-finder.
 * based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {integer} opt.weight Weight to apply to the heuristic to allow for suboptimal paths, 
 *     in order to speed up the search.
 */
function BiAStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    //When diagonal movement is allowed the manhattan heuristic is not admissible
    //It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
BiAStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var cmp = function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        },
        startOpenList = new Heap(cmp),
        endOpenList = new Heap(cmp),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng,
        BY_START = 1, BY_END = 2;

    // set the `g` and `f` value of the start node to be 0
    // and push it into the start open list
    startNode.g = 0;
    startNode.f = 0;
    startOpenList.push(startNode);
    startNode.opened = BY_START;

    // set the `g` and `f` value of the end node to be 0
    // and push it into the open open list
    endNode.g = 0;
    endNode.f = 0;
    endOpenList.push(endNode);
    endNode.opened = BY_END;

    // while both the open lists are not empty
    while (!startOpenList.empty() && !endOpenList.empty()) {

        // pop the position of start node which has the minimum `f` value.
        node = startOpenList.pop();
        node.closed = true;

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened === BY_END) {
                return Util.biBacktrace(node, neighbor);
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    startOpenList.push(neighbor);
                    neighbor.opened = BY_START;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    startOpenList.updateItem(neighbor);
                }
            }
        } // end for each neighbor


        // pop the position of end node which has the minimum `f` value.
        node = endOpenList.pop();
        node.closed = true;

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened === BY_START) {
                return Util.biBacktrace(neighbor, node);
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - startX), abs(y - startY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    endOpenList.push(neighbor);
                    neighbor.opened = BY_END;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    endOpenList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = BiAStarFinder;

},{"../core/DiagonalMovement":14,"../core/Heuristic":16,"../core/Util":18,"heap":11}],22:[function(require,module,exports){
var BiAStarFinder = require('./BiAStarFinder');

/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */
function BiBestFirstFinder(opt) {
    BiAStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
}

BiBestFirstFinder.prototype = new BiAStarFinder();
BiBestFirstFinder.prototype.constructor = BiBestFirstFinder;

module.exports = BiBestFirstFinder;

},{"./BiAStarFinder":21}],23:[function(require,module,exports){
var Util = require('../core/Util');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Bi-directional Breadth-First-Search path finder.
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BiBreadthFirstFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }
}


/**
 * Find and return the the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
BiBreadthFirstFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        startOpenList = [], endOpenList = [],
        neighbors, neighbor, node,
        diagonalMovement = this.diagonalMovement,
        BY_START = 0, BY_END = 1,
        i, l;

    // push the start and end nodes into the queues
    startOpenList.push(startNode);
    startNode.opened = true;
    startNode.by = BY_START;

    endOpenList.push(endNode);
    endNode.opened = true;
    endNode.by = BY_END;

    // while both the queues are not empty
    while (startOpenList.length && endOpenList.length) {

        // expand start open list

        node = startOpenList.shift();
        node.closed = true;

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened) {
                // if this node has been inspected by the reversed search,
                // then a path is found.
                if (neighbor.by === BY_END) {
                    return Util.biBacktrace(node, neighbor);
                }
                continue;
            }
            startOpenList.push(neighbor);
            neighbor.parent = node;
            neighbor.opened = true;
            neighbor.by = BY_START;
        }

        // expand end open list

        node = endOpenList.shift();
        node.closed = true;

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened) {
                if (neighbor.by === BY_START) {
                    return Util.biBacktrace(neighbor, node);
                }
                continue;
            }
            endOpenList.push(neighbor);
            neighbor.parent = node;
            neighbor.opened = true;
            neighbor.by = BY_END;
        }
    }

    // fail to find the path
    return [];
};

module.exports = BiBreadthFirstFinder;

},{"../core/DiagonalMovement":14,"../core/Util":18}],24:[function(require,module,exports){
var BiAStarFinder = require('./BiAStarFinder');

/**
 * Bi-directional Dijkstra path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BiDijkstraFinder(opt) {
    BiAStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
}

BiDijkstraFinder.prototype = new BiAStarFinder();
BiDijkstraFinder.prototype.constructor = BiDijkstraFinder;

module.exports = BiDijkstraFinder;

},{"./BiAStarFinder":21}],25:[function(require,module,exports){
var Util = require('../core/Util');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Breadth-First-Search path finder.
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BreadthFirstFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }
}

/**
 * Find and return the the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
BreadthFirstFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = [],
        diagonalMovement = this.diagonalMovement,
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        neighbors, neighbor, node, i, l;

    // push the start pos into the queue
    openList.push(startNode);
    startNode.opened = true;

    // while the queue is not empty
    while (openList.length) {
        // take the front node from the queue
        node = openList.shift();
        node.closed = true;

        // reached the end position
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            // skip this neighbor if it has been inspected before
            if (neighbor.closed || neighbor.opened) {
                continue;
            }

            openList.push(neighbor);
            neighbor.opened = true;
            neighbor.parent = node;
        }
    }
    
    // fail to find the path
    return [];
};

module.exports = BreadthFirstFinder;

},{"../core/DiagonalMovement":14,"../core/Util":18}],26:[function(require,module,exports){
var AStarFinder = require('./AStarFinder');

/**
 * Dijkstra path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function DijkstraFinder(opt) {
    AStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
}

DijkstraFinder.prototype = new AStarFinder();
DijkstraFinder.prototype.constructor = DijkstraFinder;

module.exports = DijkstraFinder;

},{"./AStarFinder":19}],27:[function(require,module,exports){
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var Node       = require('../core/Node');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Iterative Deeping A Star (IDA*) path-finder.
 *
 * Recursion based on:
 *   http://www.apl.jhu.edu/~hall/AI-Programming/IDA-Star.html
 *
 * Path retracing based on:
 *  V. Nageshwara Rao, Vipin Kumar and K. Ramesh
 *  "A Parallel Implementation of Iterative-Deeping-A*", January 1987.
 *  ftp://ftp.cs.utexas.edu/.snapshot/hourly.1/pub/AI-Lab/tech-reports/UT-AI-TR-87-46.pdf
 *
 * @author Gerard Meier (www.gerardmeier.com)
 *
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed. Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {integer} opt.weight Weight to apply to the heuristic to allow for suboptimal paths,
 *     in order to speed up the search.
 * @param {object} opt.trackRecursion Whether to track recursion for statistical purposes.
 * @param {object} opt.timeLimit Maximum execution time. Use <= 0 for infinite.
 */

function IDAStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.trackRecursion = opt.trackRecursion || false;
    this.timeLimit = opt.timeLimit || Infinity; // Default: no time limit.

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    //When diagonal movement is allowed the manhattan heuristic is not admissible
    //It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path. When an empty array is returned, either
 * no path is possible, or the maximum execution time is reached.
 *
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
IDAStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    // Used for statistics:
    var nodesVisited = 0;

    // Execution time limitation:
    var startTime = new Date().getTime();

    // Heuristic helper:
    var h = function(a, b) {
        return this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    }.bind(this);

    // Step cost from a to b:
    var cost = function(a, b) {
        return (a.x === b.x || a.y === b.y) ? 1 : Math.SQRT2;
    };

    /**
     * IDA* search implementation.
     *
     * @param {Node} The node currently expanding from.
     * @param {number} Cost to reach the given node.
     * @param {number} Maximum search depth (cut-off value).
     * @param {{Array.<[number, number]>}} The found route.
     * @param {number} Recursion depth.
     *
     * @return {Object} either a number with the new optimal cut-off depth,
     * or a valid node instance, in which case a path was found.
     */
    var search = function(node, g, cutoff, route, depth) {
        nodesVisited++;

        // Enforce timelimit:
        if(this.timeLimit > 0 && new Date().getTime() - startTime > this.timeLimit * 1000) {
            // Enforced as "path-not-found".
            return Infinity;
        }

        var f = g + h(node, end) * this.weight;

        // We've searched too deep for this iteration.
        if(f > cutoff) {
            return f;
        }

        if(node == end) {
            route[depth] = [node.x, node.y];
            return node;
        }

        var min, t, k, neighbour;

        var neighbours = grid.getNeighbors(node, this.diagonalMovement);

        // Sort the neighbours, gives nicer paths. But, this deviates
        // from the original algorithm - so I left it out.
        //neighbours.sort(function(a, b){
        //    return h(a, end) - h(b, end);
        //});

        
        /*jshint -W084 *///Disable warning: Expected a conditional expression and instead saw an assignment
        for(k = 0, min = Infinity; neighbour = neighbours[k]; ++k) {
        /*jshint +W084 *///Enable warning: Expected a conditional expression and instead saw an assignment
            if(this.trackRecursion) {
                // Retain a copy for visualisation. Due to recursion, this
                // node may be part of other paths too.
                neighbour.retainCount = neighbour.retainCount + 1 || 1;

                if(neighbour.tested !== true) {
                    neighbour.tested = true;
                }
            }

            t = search(neighbour, g + cost(node, neighbour), cutoff, route, depth + 1);

            if(t instanceof Node) {
                route[depth] = [node.x, node.y];

                // For a typical A* linked list, this would work:
                // neighbour.parent = node;
                return t;
            }

            // Decrement count, then determine whether it's actually closed.
            if(this.trackRecursion && (--neighbour.retainCount) === 0) {
                neighbour.tested = false;
            }

            if(t < min) {
                min = t;
            }
        }

        return min;

    }.bind(this);

    // Node instance lookups:
    var start = grid.getNodeAt(startX, startY);
    var end   = grid.getNodeAt(endX, endY);

    // Initial search depth, given the typical heuristic contraints,
    // there should be no cheaper route possible.
    var cutOff = h(start, end);

    var j, route, t;

    // With an overflow protection.
    for(j = 0; true; ++j) {
        //console.log("Iteration: " + j + ", search cut-off value: " + cutOff + ", nodes visited thus far: " + nodesVisited + ".");

        route = [];

        // Search till cut-off depth:
        t = search(start, 0, cutOff, route, 0);

        // Route not possible, or not found in time limit.
        if(t === Infinity) {
            return [];
        }

        // If t is a node, it's also the end node. Route is now
        // populated with a valid path to the end node.
        if(t instanceof Node) {
            //console.log("Finished at iteration: " + j + ", search cut-off value: " + cutOff + ", nodes visited: " + nodesVisited + ".");
            return route;
        }

        // Try again, this time with a deeper cut-off. The t score
        // is the closest we got to the end node.
        cutOff = t;
    }

    // This _should_ never to be reached.
    return [];
};

module.exports = IDAStarFinder;

},{"../core/DiagonalMovement":14,"../core/Heuristic":16,"../core/Node":17,"../core/Util":18}],28:[function(require,module,exports){
/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = require('./JumpPointFinderBase');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Path finder using the Jump Point Search algorithm which always moves
 * diagonally irrespective of the number of obstacles.
 */
function JPFAlwaysMoveDiagonally(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFAlwaysMoveDiagonally.prototype = new JumpPointFinderBase();
JPFAlwaysMoveDiagonally.prototype.constructor = JPFAlwaysMoveDiagonally;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array.<[number, number]>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFAlwaysMoveDiagonally.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    // check for forced neighbors
    // along the diagonal
    if (dx !== 0 && dy !== 0) {
        if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
            (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            return [x, y];
        }
        // when moving diagonally, must check for vertical/horizontal jump points
        if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
        }
    }
    // horizontally/vertically
    else {
        if( dx !== 0 ) { // moving along x
            if((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) ||
               (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
                return [x, y];
            }
        }
        else {
            if((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) ||
               (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
                return [x, y];
            }
        }
    }

    return this._jump(x + dx, y + dy, x, y);
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array.<[number, number]>} The neighbors found.
 */
JPFAlwaysMoveDiagonally.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        // search diagonally
        if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x + dx, y + dy)) {
                neighbors.push([x + dx, y + dy]);
            }
            if (!grid.isWalkableAt(x - dx, y)) {
                neighbors.push([x - dx, y + dy]);
            }
            if (!grid.isWalkableAt(x, y - dy)) {
                neighbors.push([x + dx, y - dy]);
            }
        }
        // search horizontally/vertically
        else {
            if(dx === 0) {
                if (grid.isWalkableAt(x, y + dy)) {
                    neighbors.push([x, y + dy]);
                }
                if (!grid.isWalkableAt(x + 1, y)) {
                    neighbors.push([x + 1, y + dy]);
                }
                if (!grid.isWalkableAt(x - 1, y)) {
                    neighbors.push([x - 1, y + dy]);
                }
            }
            else {
                if (grid.isWalkableAt(x + dx, y)) {
                    neighbors.push([x + dx, y]);
                }
                if (!grid.isWalkableAt(x, y + 1)) {
                    neighbors.push([x + dx, y + 1]);
                }
                if (!grid.isWalkableAt(x, y - 1)) {
                    neighbors.push([x + dx, y - 1]);
                }
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.Always);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFAlwaysMoveDiagonally;

},{"../core/DiagonalMovement":14,"./JumpPointFinderBase":33}],29:[function(require,module,exports){
/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = require('./JumpPointFinderBase');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there is at most one obstacle.
 */
function JPFMoveDiagonallyIfAtMostOneObstacle(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFMoveDiagonallyIfAtMostOneObstacle.prototype = new JumpPointFinderBase();
JPFMoveDiagonallyIfAtMostOneObstacle.prototype.constructor = JPFMoveDiagonallyIfAtMostOneObstacle;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array.<[number, number]>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFMoveDiagonallyIfAtMostOneObstacle.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    // check for forced neighbors
    // along the diagonal
    if (dx !== 0 && dy !== 0) {
        if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
            (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            return [x, y];
        }
        // when moving diagonally, must check for vertical/horizontal jump points
        if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
        }
    }
    // horizontally/vertically
    else {
        if( dx !== 0 ) { // moving along x
            if((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) ||
               (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
                return [x, y];
            }
        }
        else {
            if((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) ||
               (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
                return [x, y];
            }
        }
    }

    // moving diagonally, must make sure one of the vertical/horizontal
    // neighbors is open to allow the path
    if (grid.isWalkableAt(x + dx, y) || grid.isWalkableAt(x, y + dy)) {
        return this._jump(x + dx, y + dy, x, y);
    } else {
        return null;
    }
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array.<[number, number]>} The neighbors found.
 */
JPFMoveDiagonallyIfAtMostOneObstacle.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        // search diagonally
        if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x, y + dy) || grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y + dy]);
            }
            if (!grid.isWalkableAt(x - dx, y) && grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x - dx, y + dy]);
            }
            if (!grid.isWalkableAt(x, y - dy) && grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y - dy]);
            }
        }
        // search horizontally/vertically
        else {
            if(dx === 0) {
                if (grid.isWalkableAt(x, y + dy)) {
                    neighbors.push([x, y + dy]);
                    if (!grid.isWalkableAt(x + 1, y)) {
                        neighbors.push([x + 1, y + dy]);
                    }
                    if (!grid.isWalkableAt(x - 1, y)) {
                        neighbors.push([x - 1, y + dy]);
                    }
                }
            }
            else {
                if (grid.isWalkableAt(x + dx, y)) {
                    neighbors.push([x + dx, y]);
                    if (!grid.isWalkableAt(x, y + 1)) {
                        neighbors.push([x + dx, y + 1]);
                    }
                    if (!grid.isWalkableAt(x, y - 1)) {
                        neighbors.push([x + dx, y - 1]);
                    }
                }
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.IfAtMostOneObstacle);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFMoveDiagonallyIfAtMostOneObstacle;

},{"../core/DiagonalMovement":14,"./JumpPointFinderBase":33}],30:[function(require,module,exports){
/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = require('./JumpPointFinderBase');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there are no obstacles.
 */
function JPFMoveDiagonallyIfNoObstacles(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFMoveDiagonallyIfNoObstacles.prototype = new JumpPointFinderBase();
JPFMoveDiagonallyIfNoObstacles.prototype.constructor = JPFMoveDiagonallyIfNoObstacles;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array.<[number, number]>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFMoveDiagonallyIfNoObstacles.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    // check for forced neighbors
    // along the diagonal
    if (dx !== 0 && dy !== 0) {
        // if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
            // (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            // return [x, y];
        // }
        // when moving diagonally, must check for vertical/horizontal jump points
        if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
        }
    }
    // horizontally/vertically
    else {
        if (dx !== 0) {
            if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) ||
                (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
                return [x, y];
            }
        }
        else if (dy !== 0) {
            if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) ||
                (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
                return [x, y];
            }
            // When moving vertically, must check for horizontal jump points
            // if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
                // return [x, y];
            // }
        }
    }

    // moving diagonally, must make sure one of the vertical/horizontal
    // neighbors is open to allow the path
    if (grid.isWalkableAt(x + dx, y) && grid.isWalkableAt(x, y + dy)) {
        return this._jump(x + dx, y + dy, x, y);
    } else {
        return null;
    }
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array.<[number, number]>} The neighbors found.
 */
JPFMoveDiagonallyIfNoObstacles.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        // search diagonally
        if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x, y + dy) && grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y + dy]);
            }
        }
        // search horizontally/vertically
        else {
            var isNextWalkable;
            if (dx !== 0) {
                isNextWalkable = grid.isWalkableAt(x + dx, y);
                var isTopWalkable = grid.isWalkableAt(x, y + 1);
                var isBottomWalkable = grid.isWalkableAt(x, y - 1);

                if (isNextWalkable) {
                    neighbors.push([x + dx, y]);
                    if (isTopWalkable) {
                        neighbors.push([x + dx, y + 1]);
                    }
                    if (isBottomWalkable) {
                        neighbors.push([x + dx, y - 1]);
                    }
                }
                if (isTopWalkable) {
                    neighbors.push([x, y + 1]);
                }
                if (isBottomWalkable) {
                    neighbors.push([x, y - 1]);
                }
            }
            else if (dy !== 0) {
                isNextWalkable = grid.isWalkableAt(x, y + dy);
                var isRightWalkable = grid.isWalkableAt(x + 1, y);
                var isLeftWalkable = grid.isWalkableAt(x - 1, y);

                if (isNextWalkable) {
                    neighbors.push([x, y + dy]);
                    if (isRightWalkable) {
                        neighbors.push([x + 1, y + dy]);
                    }
                    if (isLeftWalkable) {
                        neighbors.push([x - 1, y + dy]);
                    }
                }
                if (isRightWalkable) {
                    neighbors.push([x + 1, y]);
                }
                if (isLeftWalkable) {
                    neighbors.push([x - 1, y]);
                }
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFMoveDiagonallyIfNoObstacles;

},{"../core/DiagonalMovement":14,"./JumpPointFinderBase":33}],31:[function(require,module,exports){
/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = require('./JumpPointFinderBase');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Path finder using the Jump Point Search algorithm allowing only horizontal
 * or vertical movements.
 */
function JPFNeverMoveDiagonally(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFNeverMoveDiagonally.prototype = new JumpPointFinderBase();
JPFNeverMoveDiagonally.prototype.constructor = JPFNeverMoveDiagonally;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array.<[number, number]>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFNeverMoveDiagonally.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    if (dx !== 0) {
        if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) ||
            (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
            return [x, y];
        }
    }
    else if (dy !== 0) {
        if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) ||
            (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
            return [x, y];
        }
        //When moving vertically, must check for horizontal jump points
        if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
            return [x, y];
        }
    }
    else {
        throw new Error("Only horizontal and vertical movements are allowed");
    }

    return this._jump(x + dx, y + dy, x, y);
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array.<[number, number]>} The neighbors found.
 */
JPFNeverMoveDiagonally.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        if (dx !== 0) {
            if (grid.isWalkableAt(x, y - 1)) {
                neighbors.push([x, y - 1]);
            }
            if (grid.isWalkableAt(x, y + 1)) {
                neighbors.push([x, y + 1]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
        }
        else if (dy !== 0) {
            if (grid.isWalkableAt(x - 1, y)) {
                neighbors.push([x - 1, y]);
            }
            if (grid.isWalkableAt(x + 1, y)) {
                neighbors.push([x + 1, y]);
            }
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.Never);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFNeverMoveDiagonally;

},{"../core/DiagonalMovement":14,"./JumpPointFinderBase":33}],32:[function(require,module,exports){
/**
 * @author aniero / https://github.com/aniero
 */
var DiagonalMovement = require('../core/DiagonalMovement');
var JPFNeverMoveDiagonally = require('./JPFNeverMoveDiagonally');
var JPFAlwaysMoveDiagonally = require('./JPFAlwaysMoveDiagonally');
var JPFMoveDiagonallyIfNoObstacles = require('./JPFMoveDiagonallyIfNoObstacles');
var JPFMoveDiagonallyIfAtMostOneObstacle = require('./JPFMoveDiagonallyIfAtMostOneObstacle');

/**
 * Path finder using the Jump Point Search algorithm
 * @param {object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {DiagonalMovement} opt.diagonalMovement Condition under which diagonal
 *      movement will be allowed.
 */
function JumpPointFinder(opt) {
    opt = opt || {};
    if (opt.diagonalMovement === DiagonalMovement.Never) {
        return new JPFNeverMoveDiagonally(opt);
    } else if (opt.diagonalMovement === DiagonalMovement.Always) {
        return new JPFAlwaysMoveDiagonally(opt);
    } else if (opt.diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        return new JPFMoveDiagonallyIfNoObstacles(opt);
    } else {
        return new JPFMoveDiagonallyIfAtMostOneObstacle(opt);
    }
}

module.exports = JumpPointFinder;

},{"../core/DiagonalMovement":14,"./JPFAlwaysMoveDiagonally":28,"./JPFMoveDiagonallyIfAtMostOneObstacle":29,"./JPFMoveDiagonallyIfNoObstacles":30,"./JPFNeverMoveDiagonally":31}],33:[function(require,module,exports){
/**
 * @author imor / https://github.com/imor
 */
var Heap       = require('heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Base class for the Jump Point Search algorithm
 * @param {object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */
function JumpPointFinderBase(opt) {
    opt = opt || {};
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.trackJumpRecursion = opt.trackJumpRecursion || false;
}

/**
 * Find and return the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
JumpPointFinderBase.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = this.openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = this.startNode = grid.getNodeAt(startX, startY),
        endNode = this.endNode = grid.getNodeAt(endX, endY), node;

    this.grid = grid;


    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        if (node === endNode) {
            return Util.expandPath(Util.backtrace(endNode));
        }

        this._identifySuccessors(node);
    }

    // fail to find the path
    return [];
};

/**
 * Identify successors for the given node. Runs a jump point search in the
 * direction of each available neighbor, adding any points found to the open
 * list.
 * @protected
 */
JumpPointFinderBase.prototype._identifySuccessors = function(node) {
    var grid = this.grid,
        heuristic = this.heuristic,
        openList = this.openList,
        endX = this.endNode.x,
        endY = this.endNode.y,
        neighbors, neighbor,
        jumpPoint, i, l,
        x = node.x, y = node.y,
        jx, jy, dx, dy, d, ng, jumpNode,
        abs = Math.abs, max = Math.max;

    neighbors = this._findNeighbors(node);
    for(i = 0, l = neighbors.length; i < l; ++i) {
        neighbor = neighbors[i];
        jumpPoint = this._jump(neighbor[0], neighbor[1], x, y);
        if (jumpPoint) {

            jx = jumpPoint[0];
            jy = jumpPoint[1];
            jumpNode = grid.getNodeAt(jx, jy);

            if (jumpNode.closed) {
                continue;
            }

            // include distance, as parent may not be immediately adjacent:
            d = Heuristic.octile(abs(jx - x), abs(jy - y));
            ng = node.g + d; // next `g` value

            if (!jumpNode.opened || ng < jumpNode.g) {
                jumpNode.g = ng;
                jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY));
                jumpNode.f = jumpNode.g + jumpNode.h;
                jumpNode.parent = node;

                if (!jumpNode.opened) {
                    openList.push(jumpNode);
                    jumpNode.opened = true;
                } else {
                    openList.updateItem(jumpNode);
                }
            }
        }
    }
};

module.exports = JumpPointFinderBase;

},{"../core/DiagonalMovement":14,"../core/Heuristic":16,"../core/Util":18,"heap":11}],34:[function(require,module,exports){
var GotandaDiamondMine = require('./GotandaDiamondMine');

// for node.js, not for CommonJS
module.exports = GotandaDiamondMine;

GotandaDiamondMine.TILE_IMAGE_8x8 = new Image();
GotandaDiamondMine.TILE_IMAGE_8x8.src = 'img/8x8.png';
GotandaDiamondMine.TILE_IMAGE_8x8_COLS = 16;
GotandaDiamondMine.TILE_IMAGE_JA = new Image();
GotandaDiamondMine.TILE_IMAGE_JA.src = 'img/misaki_gothic.png';
GotandaDiamondMine.TILE_IMAGE_JA_MAP = require('./__ja_tile_map.json');
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
  var mx = Math.floor(x / this.fontX), my = Math.floor(y / this.fontY);
  return this.point(mx, my);
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
  var mx = Math.floor(px / this.fontX), my = Math.floor(py / this.fontY);
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
      if (old_screen && str === old_screen[y][x]) {
        continue;
      }

      var colors = GotandaDiamondMine.COLOR_REGEXP.exec(str);
      if (colors) {
        if (this.fillStyle !== colors[1]) {
          context.fillStyle = this.fillStyle = colors[1];
        }
        str = colors[2];
      } else {
        if (this.fillStyle !== 'white') {
          context.fillStyle = this.fillStyle = 'white';
        }
      }
      if (this.tileImage === '8x8') {
        var char_code = str.charCodeAt(0);
        var dx = dw * x, dy = dh * y;
        var sx = char_code % GotandaDiamondMine.TILE_IMAGE_8x8_COLS;
        var sy = Math.floor(char_code / GotandaDiamondMine.TILE_IMAGE_8x8_COLS);
        context.fillRect(dx, dy, dw, dh);
        context.drawImage(GotandaDiamondMine.TILE_IMAGE_8x8, sx * dw, sy * dh, dw, dh, dx, dy, dw, dh);
      } else {
        var dx = dw * x, dy = dh * y;
        var sx = GotandaDiamondMine.TILE_IMAGE_JA_MAP[str][0], sy = GotandaDiamondMine.TILE_IMAGE_JA_MAP[str][1];
        context.fillRect(dx, dy, dw, dh);
        context.drawImage(GotandaDiamondMine.TILE_IMAGE_JA, sx, sy, dw, dh, dx, dy, dw, dh);
      }
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

},{"./GotandaDiamondMine":1,"./__ja_tile_map.json":4}]},{},[34])(34)
});