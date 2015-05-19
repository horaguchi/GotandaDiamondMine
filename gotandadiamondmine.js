var PF = require("pathfinding");
var Chance = require("chance");

var GotandaDiamondMine = function () {
  this.finder = new PF.AStarFinder({
    heuristic: PF.Heuristic.euclidean,
    diagonalMovement: PF.DiagonalMovement.Never
  });
  this.chance = new Chance();

  this.state = GotandaDiamondMine.STATE_TITLE;

};

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

// for node.js, not for CommonJS
if (typeof module === "object" && module) {
  module.exports = GotandaDiamondMine;
}

////////////////////////////////////////////////////////////////////////////////
// Common Definitions
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.CLASSES = [
  { HP: 2, maxHP:10, '%': 100, '*': 0, STR: 3, deckTemplate: '||||////%%' }
];

// [ symbol, item_name, level_number, [ x, y ], parameter_object, status_object ]
GotandaDiamondMine.ITEMS = [
  [ '|', 'a dagger', 1, [ null, null ], { 'Physical Damage': '1d4', 'Upgrade': '+0%' }, null ],
  [ '|', 'a dagger', 2, [ null, null ], { 'Physical Damage': '2d4', 'Upgrade': '+0%' }, null ],
  [ '|', 'a dagger', 3, [ null, null ], { 'Physical Damage': '5d4', 'Upgrade': '+0%' }, null ],
  [ '|', 'a dagger', 4, [ null, null ], { 'Physical Damage': '15d4', 'Upgrade': '+0%' }, null ],
  [ '|', 'a sword', 1, [ null, null ], { 'Physical Damage': '1d6', 'Upgrade': '+0|' }, null ],
  [ '|', 'a sword', 2, [ null, null ], { 'Physical Damage': '2d6', 'Upgrade': '+0|' }, null ],
  [ '|', 'a sword', 3, [ null, null ], { 'Physical Damage': '5d6', 'Upgrade': '+0|' }, null ],
  [ '|', 'a sword', 4, [ null, null ], { 'Physical Damage': '15d6', 'Upgrade': '+0|' }, null ],
  [ '/', 'a pole axe', 1, [ null, null ], { 'Physical Damage': '1d8', 'Upgrade': '+0/' }, null ],
  [ '/', 'a pole axe', 2, [ null, null ], { 'Physical Damage': '2d8', 'Upgrade': '+0/' }, null ],
  [ '/', 'a pole axe', 3, [ null, null ], { 'Physical Damage': '5d8', 'Upgrade': '+0/' }, null ],
  [ '/', 'a pole axe', 4, [ null, null ], { 'Physical Damage': '15d8', 'Upgrade': '+0/' }, null ],
  [ '%', 'an apple', 1, [ null, null ], { 'Energy': '^15', 'Upgrade': '+0%' }, null ],
  [ '"', 'an amulet of damage', 1, [ null, null ], { 'Physical Damage Buff': '1.5', 'Upgrade': '+0%' }, null ],
  [ '[', 'a ring armour', 1, [ null, null ], { 'Armor Class': '+10', '\ Luck Bonus': '+25', 'Upgrade': '+0[' }, null ],
  [ '`', 'a rock', 1, [ null, null ], { 'Upgrade': '+0`' }, null ]
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
  '|': 'An edged weapon',
  '\\': 'A hafted weapon',
  '/': 'A pole weapon',
  'Upgrade': 'UG',
  'Physical Damage': 'PD',
  'Fire Damage': 'FD',
  'Cold Damage': 'CD',
  'Lightning Damage': 'LD',
  'Poison Damage': 'PD',
  'Armor Class': 'AC',
  'All Resistance': 'AR',
  'Fire Resistance': 'FR',
  'Cold Resistance': 'CR',
  'Lightning Resistance': 'LR',
  'Poison Resistance': 'PR',
  'Physical Damage Buff': 'PDB',
  'Energy': '%',
  '\ Luck Bonus': '%LB'
};

GotandaDiamondMine.MAPS = {
  'Small': [
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "         .........         ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
  ],
  'Flats': [
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split(''),
    "...........................".split('')
  ],
  'Paddy': [
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "   .....................   ".split(''),
    "   .....................   ".split(''),
    "   .....................   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   .....................   ".split(''),
    "   .....................   ".split(''),
    "   .....................   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   ...      ...      ...   ".split(''),
    "   .....................   ".split(''),
    "   .....................   ".split(''),
    "   .....................   ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split('')
  ]
};

GotandaDiamondMine.TITLE_SCREEN = [
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "Gotanda Diamond Mine v0.0.1".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split(''),
    "                           ".split('')
];

////////////////////////////////////////////////////////////////////////////////
// Common Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.REGEXP_DICE = /^([-+^])?(\d+)?(d\d+)?$/;
GotandaDiamondMine.prototype.roll = function (param) {
  if (typeof param === "number") {
    return param;
  } else if (typeof param !== "string") {
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

  } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) { // TOWN ITEMS
    this.selectedItem = -1;

  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) { // TOWN SHOP
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
      this.unitsWait.push(i * 32);
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

GotandaDiamondMine.EMPTY_LINE = [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "];

GotandaDiamondMine.EMPTY_BOX = [
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

GotandaDiamondMine.EMPTY_MINE_BOX = [
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "]
];

GotandaDiamondMine.EMPTY_LINED_BOX = [
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
        if (key === 'deckTemplate') {
          this.createDeckFromTemplate(selected_hero[key]);
        } else {
          this.heroParameter[key] = selected_hero[key];
        }
      }
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
        //--this.heroStatus.HP;
        // TODO: diremond OR hp minus
      }
    }
    pre_unit_pos = unit[2];
    --units_wait[i];
  }
  if (!wave_moving) { // animation end
    ++this.wave;
    if (this.heroParameter['Damage'] <= this.heroStatus['Damage']) {
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
  this.mapColor = this.mapSymbol.map(function (row) { return row.map(function (value) { return value === ' ' ? '' : "gray"; }); });

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
  var level = mine['level'];
  var waves = this.waves = [
    [ '*', 'gem', 5, [ null, null ], { HP: 0 } ]
  ];
  for (var i = 1; i <= 50; ++i) {
    waves.push([ 'A', 'monster A', 2, [ null, null ], { HP: Math.round(10 * Math.pow(i, level)) } ]);
  }
};

GotandaDiamondMine.prototype.createHeroChoices = function () {
  this.heroChoices = GotandaDiamondMine.CLASSES.concat(); // TODO
};

GotandaDiamondMine.prototype.createMineChoices = function () {
  // TODO
  this.mineChoices = [
    { name: 'ABC', level: 1.2, map: 'Flats' },
    { name: 'ABC', level: 1.3, map: 'Small' },
    { name: 'ABC', level: 1.4, map: 'Paddy' }
  ];
};

GotandaDiamondMine.prototype.createDeckFromTemplate = function (template) {
  var array = template.split('');
  var deck = [];
  var symbol;
  var check_symbol = function (item) {
    return item[0] === symbol && item[2] === 1; // Level 1
  };
  for (var i = 0; i < array.length; ++i) {
    symbol = array[i];
    deck.push(this.chance.shuffle(GotandaDiamondMine.ITEMS.filter(check_symbol))[0]);
  }
  this.itemsInOriginalDeck = deck;
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

GotandaDiamondMine.getButtonBox = function (str, color) {
  return GotandaDiamondMine.colorScreen([
    "+-------------------------+".split(''),
    ("|" + str + "|").split(''),
    "+-------------------------+".split('')
  ], color);
};

GotandaDiamondMine.prototype.getButton = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TITLE) {
    return GotandaDiamondMine.getButtonBox('          Play           ', 'lime');
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) {
    if (this.selectedHero === -1) {
      return GotandaDiamondMine.getButtonBox('      Choose a hero      ', 'gray');
    } else {
      return GotandaDiamondMine.getButtonBox('    Choose this hero     ', 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    if (this.selectedItem === -1) {
      return GotandaDiamondMine.getButtonBox('     Destroy an item     ', 'gray');
    } else {
      return GotandaDiamondMine.getButtonBox('    Destroy this item    ', 'lime');  
    }
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    if (this.selectedItem === -1) {
      return GotandaDiamondMine.getButtonBox('       Buy an item       ', 'gray');
    } else {
      return GotandaDiamondMine.getButtonBox('      Buy this item      ', 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    if (this.selectedMine === -1) {
      return GotandaDiamondMine.getButtonBox('      Choose a mine      ', 'gray');
    } else {
      return GotandaDiamondMine.getButtonBox('    Choose this mine     ', 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    if (this.selectedItem === -1) {
      return GotandaDiamondMine.getButtonBox('     Choose an item      ', 'gray');
    } else {
      return GotandaDiamondMine.getButtonBox('    Choose this item     ', 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_PLACE) {
    if (this.selectedPlace === null) {
      return GotandaDiamondMine.getButtonBox(this.placeBlocked ? '        Blocking!         ' : '     Choose a place      ', 'gray');
    } else {
      return GotandaDiamondMine.getButtonBox(this.placeBlocked ? '        Blocking!         ' : '    Choose this place    ', 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) {
    if (this.itemsOnMap.length === 0) {
      return GotandaDiamondMine.getButtonBox('    Preview the path     ', 'lime');
    } else {
      return GotandaDiamondMine.getButtonBox('     Go to next wave     ', 'lime');
    }
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    if (this.sacrificingItem === -1) {
      return GotandaDiamondMine.getButtonBox('    Replace this item    ', 'lime');
    } else if (this.canSacrifice) {
      return GotandaDiamondMine.getButtonBox('   Combine these items   ', 'lime');
    } else {
      return GotandaDiamondMine.getButtonBox('     Cannot combine!     ', 'gray');
    }
  } else if (state === GotandaDiamondMine.STATE_ANIMATION) {
    return GotandaDiamondMine.getButtonBox('     Now progressing     ', 'gray');
  } else if (state === GotandaDiamondMine.STATE_DEFEATED) {
    return GotandaDiamondMine.getButtonBox('        You died         ', 'lime');
  } else if (state === GotandaDiamondMine.STATE_VICTORY) {
    return GotandaDiamondMine.getButtonBox('    Back to the town     ', 'lime');
  } else {
    return [ GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE, GotandaDiamondMine.EMPTY_LINE ];
  }
};

GotandaDiamondMine.prototype.getScreenTitle = function () {
  return [].concat(this.getButton(), GotandaDiamondMine.TITLE_SCREEN);
};

GotandaDiamondMine.getDetailHeroInfo = function (hero_info) { // 27 x 9
  var output = [ "+-------------------------+".split("") ];
  output.push( ("|@                        |").split("") );
  var i = 0;
  for (var key in hero_info ) {
    output.push( ("|" + hero_info[key] + " " + key + "                           ").split("") );
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

GotandaDiamondMine.prototype.getScreenToChooseHero = function () {
  var heroes = [];
  for (var i = 0; i < 5; ++i) {
    var display_hero = this.heroChoices[i] ? GotandaDiamondMine.getDetailHeroInfo(this.heroChoices[i]) : GotandaDiamondMine.EMPTY_BOX;
    heroes = heroes.concat(i === this.selectedHero ? display_hero : GotandaDiamondMine.colorScreen(display_hero, 'green'));
  }
  return [].concat(this.getButton(), heroes);
};

GotandaDiamondMine.prototype.getTownTab = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    return GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen([
      "         +-------++-------+".split(''),
      "  Items  | Shop  || Mine  |".split(''),
      "         +-------++-------+".split('')
    ], 'gray', 'x', 0, 8), 'lime', 'x', 9, 17), 'lime', 'x', 18, 26);
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    return GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen([
      "+-------+         +-------+".split(''),
      "| Items |  Shop   | Mine  |".split(''),
      "--------+         +-------+".split('')
    ], 'lime', 'x', 0, 8), 'gray', 'x', 9, 17), 'lime', 'x', 18, 26);
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    return GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen(GotandaDiamondMine.colorScreen([
      "+-------++-------+         ".split(''),
      "| Items || Shop  |  Mine   ".split(''),
      "--------++-------+         ".split('')
    ], 'lime', 'x', 0, 8), 'lime', 'x', 9, 17), 'gray', 'x', 18, 26);
  }
};

GotandaDiamondMine.prototype.getScreenAtTownItems = function () {
  return [].concat(this.getButton(), this.getTownTab(), GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_LINED_BOX, 'gray'), this.getStatus(), this.getItemInfo(true));
};

GotandaDiamondMine.prototype.getScreenAtTownShop = function () {
  return [].concat(this.getButton(), this.getTownTab(), GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_LINED_BOX, 'gray'), this.getStatus(), this.getItemInfo(true));
};

GotandaDiamondMine.getDetailMineInfo = function (mine_info) { // 27 x 6
  var output = [ "+-------------------------+".split("") ];
  var i = 0;
  for (var key in mine_info ) {
    output.push( ("|" + mine_info[key] + " " + key + "                           ").split("") );
    ++i;
  }
  for (i; i < 4; ++i) {
    output.push("|                         |".split(""));
  }
  for (var i = 1; i <= 4; ++i) {
    output[i][26] = '|';
  }
  output.push("+-------------------------+".split(""));
  return output;
};

GotandaDiamondMine.prototype.getScreenAtTownMine = function () {
  var mines = [];
  for (var i = 0; i < 7; ++i) {
    var display_mine = this.mineChoices[i] ? GotandaDiamondMine.getDetailMineInfo(this.mineChoices[i]) : GotandaDiamondMine.EMPTY_MINE_BOX;
    mines = mines.concat(i === this.selectedMine ? display_mine : GotandaDiamondMine.colorScreen(display_mine, 'green'));
  }
  return [].concat(this.getButton(), this.getTownTab(), mines);
};

GotandaDiamondMine.getDetailItemInfo = function (item) { // 27 x 9
  var output = [ "+-------------------------+".split("") ];
  output.push( ("|" + item[0] + item[2] + " " + item[1] + "                           ").split("") );
  var i = 0;
  for (var key in item[4] ) {
    output.push( ("|" + item[4][key] + " " + key + "                           ").split("") );
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

GotandaDiamondMine.prototype.getScreenToChooseItem = function () {
  var items = [];
  for (var i = 0; i < 3; ++i) {
    var item = this.itemsOnHand[i] ? GotandaDiamondMine.getDetailItemInfo(this.itemsOnHand[i]) : GotandaDiamondMine.EMPTY_BOX;
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

GotandaDiamondMine.toWaveInfoString = function (wave, num) {
  return num + ')' + wave[2] + wave[0] + ' ' + wave[4].HP + 'HP                           ';
};

GotandaDiamondMine.prototype.getUnitsInfoString = function (wave, num) {
  var live_units = this.units.filter(function (unit) {
    return unit[5]['Damage'] < unit[4]['HP'];
  });
  var unit = live_units.length === 0 ? this.units[this.units.length - 1] : live_units[0];
  return num + ')' + live_units.length + wave[0] + ' ' + (unit[4]['HP'] - unit[5]['Damage']) + '/' + unit[4]['HP'] + 'HP                           ';
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
          wave_now.push(GotandaDiamondMine.toWaveInfoString(wave, wave_num).split(''));
        }
      } else {
        wave_next.push(GotandaDiamondMine.toWaveInfoString(wave, wave_num).split(''));
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
  return GotandaDiamondMine.colorScreen([ (info_str + '                           ').split("") ], 'gray');
};

GotandaDiamondMine.toItemInfoString = function (item) {
  var info_str = item[0] + item[2];
  for (var key in item[4]) {
    info_str += ' ' + item[4][key] + GotandaDiamondMine.ITEM_ABBR[key];
  }
  return info_str + '                           ';
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
    if (state === GotandaDiamondMine.STATE_PLACE) {
      index = Math.min(index, this.placingItem + i); // for many undos
      if (index === this.placingItem) {
        info = GotandaDiamondMine.colorScreen(info, 'gray');
      }
    }
    info.push(items_to_display.length <= index ? GotandaDiamondMine.EMPTY_LINE : GotandaDiamondMine.toItemInfoString(items_to_display[index]).split(""));
    indexes.push(items_to_display.length <= index ? -1 : index);
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
      info.push("---------------------------".split(''));
    } else if (items_on_map.length <= index) {
      info.push(GotandaDiamondMine.EMPTY_LINE);
    } else if (index === this.confirmingItem) {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.toItemInfoString(items_on_map[index]).split(""), 'aqua', 'line'));
    } else if (index === this.sacrificingItem) {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.toItemInfoString(items_on_map[index]).split(""), 'fuchsia', 'line'));
    } else {
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.toItemInfoString(items_on_map[index]).split(""), 'green', 'line'));
    }
    indexes.push(second_offset && i === 5 || items_on_map.length <= index ? -1 : index);
  }
  return info;
};
