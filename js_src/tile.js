// Class for individual map tiles

import {DisplaySymbol} from './display_symbol.js';

export class Tile extends DisplaySymbol {
  constructor(name, chr, fg, bg) {
    super(chr, fg, bg);
    this.name = name;
  }
}

export let TILES = {
  NULLTILE: new Tile('nulltile', 'x'),
  WALL: new Tile('wall', '#'),
  FLOOR: new Tile('floor', '.')
}
