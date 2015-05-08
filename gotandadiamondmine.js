var PF = require("pathfinding");
var Chance = require("chance");

var GotandaDiamondMine = function () {
  this.finder = new PF.AStarFinder({
    heuristic: PF.Heuristic.euclidean,
    diagonalMovement: PF.DiagonalMovement.Never
  });
  this.chance = new Chance();

  this.state = GotandaDiamondMine.STATE_TITLE;
  this.itemsInOriginalDeck = [];
  this.itemsInShop = [];
  this.status = { }; // updated when hero is choosed

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
  { HP: 2, STR: 3, deckTemplate: '||//' }
];

GotandaDiamondMine.ITEMS = [
  [ '|', 'a dagger', 1, [ null, null ], { 'Physical Damage': '1d4' } ],
  [ '/', 'a pole axe', 1, [ null, null ], { 'Physical Damage': '2d6' } ]
];

GotandaDiamondMine.ITEM_ABBR = {
  '|': 'An edged weapon',
  '\\': 'A hafted weapon',
  '/': 'A pole weapon',
  'Physical Damage': 'Phys',
  'Lightning Damage': 'Light'
};

////////////////////////////////////////////////////////////////////////////////
// Common Methods
////////////////////////////////////////////////////////////////////////////////
GotandaDiamondMine.prototype.changeState = function (state) {
  if (state === GotandaDiamondMine.STATE_TITLE) { // TITLE
    //

  } else if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) { // CHOOSE HERO
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

  } else if (state === GotandaDiamondMine.STATE_ANIMATION) { // WAVE ANIMATION
    this.itemsWait = [];
    this.waveWait = 0;
    this.waveState = 0;
    this.waves[this.wave][3] = this.path[this.waveState];
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
  if (5 <= x && x <= 21 && 34 <= y && y <= 36) { // Start
    this.changeState(GotandaDiamondMine.STATE_CHOOSE_HERO);
    return true;
  }
};

GotandaDiamondMine.prototype.pointChooseHero = function (x, y) {
  if (0 <= x && x <= 26 && 0 <= y && y <= 8 && 1 <= this.heroChoices.length) { // Hero 1
    this.selectedHero = 0;
    return true;
  } else if (0 <= x && x <= 26 && 9 <= y && y <= 17 && 2 <= this.heroChoices.length) { // Hero 2
    this.selectedHero = 1;
    return true;
  } else if (0 <= x && x <= 26 && 18 <= y && y <= 26 && 3 <= this.heroChoices.length) { // Hero 3
    this.selectedHero = 2;
    return true;
  } else if (0 <= x && x <= 26 && 27 <= y && y <= 35 && 4 <= this.heroChoices.length) { // Hero 4
    this.selectedHero = 3;
    return true;
  } else if (0 <= x && x <= 26 && 36 <= y && y <= 44 && 5 <= this.heroChoices.length) { // Hero 5
    this.selectedHero = 4;
    return true;
  } else if (0 <= x && x <= 26 && 45 <= y && y <= 47) { // Choose a hero
    if (this.selectedHero !== -1) {
      var selected_hero = this.heroChoices[this.selectedHero];
      for (var key in selected_hero) {
        if (key === 'deckTemplate') {
          this.createDeckFromTemplate(selected_hero[key]);
        } else {
          this.status[key] = selected_hero[key];
        }
      }
      this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
      return true;
    }
  }
};

GotandaDiamondMine.prototype.pointTownItems = function (x, y) {
  if (0 <= x && x <= 8 && 0 <= y && y <= 2) { // Town Items
    this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
    return true;
  } else if (9 <= x && x <= 17 && 0 <= y && y <= 2) { // Town Shop
    this.changeState(GotandaDiamondMine.STATE_TOWN_SHOP);
    return true;
  } else if (18 <= x && x <= 26 && 0 <= y && y <= 2) { // Town Mine
    this.changeState(GotandaDiamondMine.STATE_TOWN_MINE);
    return true;
  }
};

GotandaDiamondMine.prototype.pointTownShop = function (x, y) {
  if (0 <= x && x <= 8 && 0 <= y && y <= 2) { // Town Items
    this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
    return true;
  } else if (9 <= x && x <= 17 && 0 <= y && y <= 2) { // Town Shop
    this.changeState(GotandaDiamondMine.STATE_TOWN_SHOP);
    return true;
  } else if (18 <= x && x <= 26 && 0 <= y && y <= 2) { // Town Mine
    this.changeState(GotandaDiamondMine.STATE_TOWN_MINE);
    return true;
  }
};

GotandaDiamondMine.prototype.pointTownMine = function (x, y) {
  if (0 <= x && x <= 8 && 0 <= y && y <= 2) { // Town Items
    this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
    return true;
  } else if (9 <= x && x <= 17 && 0 <= y && y <= 2) { // Town Shop
    this.changeState(GotandaDiamondMine.STATE_TOWN_SHOP);
    return true;
  } else if (18 <= x && x <= 26 && 0 <= y && y <= 2) { // Town Mine
    this.changeState(GotandaDiamondMine.STATE_TOWN_MINE);
    return true;
  } else if (0 <= x && x <= 26 && 3 <= y && y <= 8 && 1 <= this.mineChoices.length) { // Mine 1
    this.selectedMine = 0;
    return true;
  } else if (0 <= x && x <= 26 && 9 <= y && y <= 14 && 2 <= this.mineChoices.length) { // Mine 2
    this.selectedMine = 1;
    return true;
  } else if (0 <= x && x <= 26 && 15 <= y && y <= 20 && 3 <= this.mineChoices.length) { // Mine 3
    this.selectedMine = 2;
    return true;
  } else if (0 <= x && x <= 26 && 21 <= y && y <= 26 && 4 <= this.mineChoices.length) { // Mine 4
    this.selectedMine = 3;
    return true;
  } else if (0 <= x && x <= 26 && 27 <= y && y <= 32 && 5 <= this.mineChoices.length) { // Mine 5
    this.selectedMine = 4;
    return true;
  } else if (0 <= x && x <= 26 && 33 <= y && y <= 38 && 6 <= this.mineChoices.length) { // Mine 6
    this.selectedMine = 4;
    return true;
  } else if (0 <= x && x <= 26 && 39 <= y && y <= 44 && 7 <= this.mineChoices.length) { // Mine 7
    this.selectedMine = 4;
    return true;
  } else if (0 <= x && x <= 26 && 45 <= y && y <= 47) { // Choose a hero
    if (this.selectedMine !== -1) {
      var selected_mine = this.mineChoices[this.selectedMine];
      this.createMap(); // mapSymbol, mapColor, points, path are created
      this.createWaves(selected_mine); // wave, waves are created
      this.itemsOnMap = [];
      this.itemsOnHand = [];
      this.itemsInDeck = [];
      this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      return true;
    }
  }
};

GotandaDiamondMine.prototype.pointChooseItem = function (x, y) {
  if (0 <= x && x <= 26 && 6 <= y && y <= 14 && 1 <= this.itemsOnHand.length) { // Item 1
    this.selectedItem = 0;
    return true;
  } else if (0 <= x && x <= 26 && 15 <= y && y <= 23 && 2 <= this.itemsOnHand.length) { // Item 2
    this.selectedItem = 1;
    return true;
  } else if (0 <= x && x <= 26 && 24 <= y && y <= 32 && 3 <= this.itemsOnHand.length) { // Item 3
    this.selectedItem = 2;
    return true;
  } else if (0 <= x && x <= 26 && 45 <= y && y <= 47) { // Choose an item
    if (this.selectedItem !== -1) {
      this.itemsOnMap.push(this.itemsOnHand[this.selectedItem].concat());
      this.itemsOnHand.splice(this.selectedItem, 1);
      this.changeState(GotandaDiamondMine.STATE_PLACE);
      return true;
    }
  }
};

GotandaDiamondMine.prototype.pointPlace = function (x, y) {
  if (0 <= x && x <= 26 && 6 <= y && y <= 32) { // Map
    if (this.mapSymbol[y - 6][x] === '.') {
      if (this.selectedPlace) { // Cancel post-place before
        this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = '.';
        this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'gray';
      }
      this.mapSymbol[y - 6][x] = this.itemsOnMap[this.placingItem][0];
      if (this.calculatePath()) {
        this.selectedPlace = [ x, y - 6 ];
        this.mapColor[y - 6][x] = 'white'; // do after "calculatePath", for save yellow color if cannot place
        this.placeBlocked = false;
      } else { // blocking, cannot place
        if (this.selectedPlace) { // Re-place
          this.mapSymbol[this.selectedPlace[1]][this.selectedPlace[0]] = this.itemsOnMap[this.placingItem][0];
          this.mapColor[this.selectedPlace[1]][this.selectedPlace[0]] = 'white';
        }
        this.mapSymbol[y - 6][x] = '.';
        this.placeBlocked = true;
      }
      return true;
    }

  } else if (0 <= x && x <= 26 && 45 <= y && y <= 47) { // OK
    if (this.selectedPlace) { // OK
      this.itemsOnMap[this.placingItem][3] = this.selectedPlace;
      ++this.placingItem;
      if (this.placingItem === this.itemsOnMap.length) {
        this.changeState(GotandaDiamondMine.STATE_CONFIRM);
      } else {
        this.selectedPlace = null;
      }
      return true;
    }
    //} else if (0 < this.placingItem) { // Undo
    //  --this.placingItem;
    //  var place = this.itemsOnMap[this.placingItem][3];
    //  this.mapSymbol[place[1]][place[0]] = '.';
    //  this.mapColor[place[1]][place[0]] = 'gray';
    //  this.selectedPlace = null;
    //  return true;
    //}
  }
};

GotandaDiamondMine.prototype.pointConfirm = function (x, y) {
  if (0 <= x && x <= 26 && 6 <= y && y <= 32) { // Map
    return this.pointConfirmItem(GotandaDiamondMine.getIndexNearPoint(this.itemsOnMap, x, y - 6));

  } else if (0 <= x && x <= 26 && 34 <= y && y <= 44) { // Item list 
    return this.pointConfirmItem(this.indexesToPoint[y - 34]);

  //} else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // Undo
  //  var place = this.itemsOnMap[this.itemsOnMap.length - 1][3];
  //  this.mapSymbol[place[1]][place[0]] = '.';
  //  this.mapColor[place[1]][place[0]] = 'gray';
  //  place[0] = place[1] = null;
  //  this.changeState(GotandaDiamondMine.STATE_PLACE);
  //  return true;

  } else if (0 <= x && x <= 26 && 45 <= y && y <= 47) { // Next Wave
    this.changeState(GotandaDiamondMine.STATE_ANIMATION);
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
  if (0 <= x && x <= 26 && 6 <= y && y <= 32) { // Map
    return this.pointUpgradeItem(GotandaDiamondMine.getIndexNearPoint(this.itemsOnMap, x, y - 6));

  } else if (0 <= x && x <= 26 && 34 <= y && y <= 44) { // Item list 
    return this.pointUpgradeItem(this.indexesToPoint[y - 34]);

  } else if (0 <= x && x <= 12 && 45 <= y && y <= 47) { // Combine

  } else if (14 <= x && x <= 26 && 45 <= y && y <= 47) { // Next Wave
    //
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
  } else if (pointed_item === this.sacrificingItem) {
    this.sacrificingItem = -1;
  } else {
    var item_pos = this.itemsOnMap[pointed_item][3];
    this.mapColor[item_pos[1]][item_pos[0]] = 'fuchsia';
    this.sacrificingItem = pointed_item;
  }
  return true;
};

GotandaDiamondMine.prototype.pointAnimation = function (x, y) {
  // wave move
  if (!this.waveWait) {
    if (this.path.length - 1 === this.waveState) { // animation end
      if (0 < this.waves[this.wave][4].HP) {
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
      this.waves[this.wave][3] = this.path[++this.waveState];
      this.waveWait = 4;
    }
  }
  // items attack
  var wave_x = this.waves[this.wave][3][0], wave_y = this.waves[this.wave][3][1];
  var items_on_map = this.itemsOnMap;
  var items_wait = this.itemsWait;
  for (var i = 0; i < items_on_map.length; ++i) {
    var item = items_on_map[i];
    if (!items_wait[i]) {
      var item_x = item[3][0], item_y = item[3][1];
      if (Math.abs(wave_x - item_x) < 2 && Math.abs(wave_y - item_y) < 2) { // attack
        this.waves[this.wave][4].HP -= 10;
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

GotandaDiamondMine.prototype.pointDefeated = function (x, y) {
  if (0 <= x && x <= 26 && 45 <= y && y <= 47) { // You died
    this.changeState(GotandaDiamondMine.STATE_TITLE);
    return true;
  }
};

GotandaDiamondMine.prototype.pointVictory = function (x, y) {
  if (0 <= x && x <= 26 && 45 <= y && y <= 47) { // Back to the town
    this.changeState(GotandaDiamondMine.STATE_TOWN_ITEMS);
    return true;
  }
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

GotandaDiamondMine.prototype.createWaves = function () {
  this.wave = 0;
  this.waves = [
    [ '*', 'gem', 0, [ null, null ], { HP: 0 } ],
    [ 'A', 'monster A', 1, [ null, null ], { HP: Math.floor(Math.random() * 100) } ],
    [ 'B', 'monster B', 2, [ null, null ], { HP: Math.floor(Math.random() * 100) } ],
    [ 'C', 'monster C', 3, [ null, null ], { HP: Math.floor(Math.random() * 100) } ],
    [ 'D', 'monster D', 4, [ null, null ], { HP: Math.floor(Math.random() * 100) } ],
    [ 'E', 'monster E', 5, [ null, null ], { HP: Math.floor(Math.random() * 100) } ]
  ];
};

GotandaDiamondMine.prototype.createHeroChoices = function () {
  this.heroChoices = GotandaDiamondMine.CLASSES.concat(); // TODO
};

GotandaDiamondMine.prototype.createMineChoices = function () {
  this.mineChoices = [ { name: 'ABC', level: 'easy' } ]; // TODO
};

GotandaDiamondMine.prototype.createDeckFromTemplate = function (template) {
  var array = template.split('');
  var deck = [];
  var symbol;
  var check_symbol = function (item) {
    return item[0] === symbol;
  };
  for (var i = 0; i < array.length; ++i) {
    symbol = array[i];
    deck.push(GotandaDiamondMine.ITEMS.filter(check_symbol)[0]);
  }
  this.itemsInOriginalDeck = deck;
};

GotandaDiamondMine.prototype.createItemsOnHand = function () {
  if (this.itemsOnHand.length === 0 && this.itemsInDeck.length === 0) { // reset deck
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
GotandaDiamondMine.toWaveInfoString = function (wave) {
  return wave[2] + ')' + wave[0] + ' ' + wave[4].HP + 'HP                           ';
};

GotandaDiamondMine.prototype.getWaveInfo = function () {
  var wave_now = [], wave_next = [];
  for (var i = 0; i < 6; ++i) {
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
      if (state === GotandaDiamondMine.STATE_ANIMATION && wave[3][0] === x && wave[3][1] === y) {
        row.push(wave[4].HP <= 0 ? '{yellow-fg}*{/yellow-fg}' : '{red-fg}' +  wave[0] + '{/red-fg}');
      } else {
        row.push(map_color[y][x] ? '{' + map_color[y][x] + '-fg}' + map_symbol[y][x] + '{/' + map_color[y][x] + '-fg}' : map_symbol[y][x]);
      }
    }
    map.push(row);
  }
  return map;
};

GotandaDiamondMine.prototype.getStatus = function () {
  var info_str = '';
  var status = this.status;
  for (var key in status) {
    info_str += status[key] + key + ' ';
  }
  return GotandaDiamondMine.colorScreen([ (info_str + this.itemsOnHand.length + '+' + this.itemsInDeck.length + 'Items                           ').split("") ], 'gray');
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
  var display_num = state === GotandaDiamondMine.STATE_TOWN_ITEMS || state === GotandaDiamondMine.STATE_TOWN_SHOP ? 33 : 11;
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

  if (state !== GotandaDiamondMine.STATE_PLACE) {
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
      info.push(GotandaDiamondMine.colorScreen(GotandaDiamondMine.toItemInfoString(items_on_map[index]).split(""), 'gray', 'line'));
    }
    indexes.push(second_offset && i === 5 || items_on_map.length <= index ? -1 : index);
  }
  return info;
};

GotandaDiamondMine.prototype.getButton = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_CHOOSE_HERO) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      "|      Choose a hero      |".split(''),
      "+-------------------------+".split('')
    ], this.selectedHero === -1 ? 'gray' : 'white');
  } else if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      "|     Destroy an item     |".split(''),
      "+-------------------------+".split('')
    ], this.selectedItem === -1 ? 'gray' : 'white');
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      "|       Buy an item       |".split(''),
      "+-------------------------+".split('')
    ], this.selectedItem === -1 ? 'gray' : 'white');
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      "|      Choose a mine      |".split(''),
      "+-------------------------+".split('')
    ], this.selectedMine === -1 ? 'gray' : 'white');
  } else if (state === GotandaDiamondMine.STATE_CHOOSE_ITEM) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      "|     Choose an item      |".split(''),
      "+-------------------------+".split('')
    ], this.selectedItem === -1 ? 'gray' : 'white');
  } else if (state === GotandaDiamondMine.STATE_PLACE) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      this.placeBlocked ? "|        Blocking!         |".split('') : "|     Choose a place      |".split(''),
      "+-------------------------+".split('')
    ], this.selectedPlace ? 'white' : 'gray');
  } else if (state === GotandaDiamondMine.STATE_CONFIRM) {
    if (this.itemsOnMap.length) {
      return [
        "+-------------------------+".split(''),
        "|     Go to next wave     |".split(''),
        "+-------------------------+".split('')
      ];
    } else {
      return [
        "+-------------------------+".split(''),
        "|    Preview the path     |".split(''),
        "+-------------------------+".split('')
      ];
    }
  } else if (state === GotandaDiamondMine.STATE_UPGRADE) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      "|     Combine a item      |".split(''),
      "+-------------------------+".split('')
    ], this.sacrificingItem === -1 ? 'gray' : 'white');
  } else if (state === GotandaDiamondMine.STATE_ANIMATION) {
    return GotandaDiamondMine.colorScreen([
      "+-------------------------+".split(''),
      "|     Now progressing     |".split(''),
      "+-------------------------+".split('')
    ], 'gray');
  } else if (state === GotandaDiamondMine.STATE_DEFEATED) {
    return [
      "+-------------------------+".split(''),
      "|        You died         |".split(''),
      "+-------------------------+".split('')
    ];
  } else if (state === GotandaDiamondMine.STATE_VICTORY) {
    return [
      "+-------------------------+".split(''),
      "|    Back to the town     |".split(''),
      "+-------------------------+".split('')
    ];
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
    heroes = heroes.concat(i === this.selectedHero ? display_hero : GotandaDiamondMine.colorScreen(display_hero, 'gray'));
  }
  return [].concat(heroes, this.getButton());
};

GotandaDiamondMine.prototype.getTownTab = function () {
  var state = this.state;
  if (state === GotandaDiamondMine.STATE_TOWN_ITEMS) {
    return GotandaDiamondMine.colorScreen([
      "         +-------++-------+".split(''),
      "  Items  | Shop  || Mine  |".split(''),
      "         +-------++-------+".split('')
    ], 'gray', 'x', 0, 8);
  } else if (state === GotandaDiamondMine.STATE_TOWN_SHOP) {
    return GotandaDiamondMine.colorScreen([
      "+-------+         +-------+".split(''),
      "| Items |  Shop   | Mine  |".split(''),
      "--------+         +-------+".split('')
    ], 'gray', 'x', 9, 17);
  } else if (state === GotandaDiamondMine.STATE_TOWN_MINE) {
    return GotandaDiamondMine.colorScreen([
      "+-------++-------+         ".split(''),
      "| Items || Shop  |  Mine   ".split(''),
      "--------++-------+         ".split('')
    ], 'gray', 'x', 18, 26);
  }
};

GotandaDiamondMine.prototype.getScreenAtTownItems = function () {
  return [].concat(this.getTownTab(), GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_LINED_BOX, 'gray'), this.getItemInfo(true), this.getButton());
};

GotandaDiamondMine.prototype.getScreenAtTownShop = function () {
  return [].concat(this.getTownTab(), GotandaDiamondMine.colorScreen(GotandaDiamondMine.EMPTY_LINED_BOX, 'gray'), this.getItemInfo(true), this.getButton());
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
    mines = mines.concat(i === this.selectedMine ? display_mine : GotandaDiamondMine.colorScreen(display_mine, 'gray'));
  }
  return [].concat(this.getTownTab(), mines, this.getButton());
};

GotandaDiamondMine.getDetailItemInfo = function (item) { // 27 x 9
  var output = [ "+-------------------------+".split("") ];
  output.push( ("|" + item[0] + " Lvl." + item[2] + " " + item[1] + "                           ").split("") );
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
    items = items.concat(i === this.selectedItem ? item : GotandaDiamondMine.colorScreen(item, 'gray'));
  }
  return [].concat(this.getWaveInfo(), items, this.getStatus(), this.getItemInfo(), this.getButton());
};

GotandaDiamondMine.prototype.getScreenToUpgrade = function () {
  return [].concat(this.getWaveInfo(), this.getMap(), this.getStatus(), this.getUpgradeItemInfo(), this.getButton());
};

GotandaDiamondMine.prototype.getScreenDefault = function () {
  return [].concat(this.getWaveInfo(), this.getMap(), this.getStatus(), this.getItemInfo(), this.getButton());
};
