// Class for individual map tiles

import {DisplaySymbol} from './display_symbol.js';

class Tile extends DisplaySymbol {
  constructor(name, chr, fg, bg) {
    super(chr, fb, bg);
    this.name = name;
  }
}

let TILES = {
  NULLTILE: new Tile('nulltile', 'X');
  WALL: new Tile('wall', '#');
  FLOOR: new Tile('floor', '.');
}
