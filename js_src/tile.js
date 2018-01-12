// Class for individual map tiles

import {DisplaySymbol} from './display_symbol.js';

export class Tile extends DisplaySymbol {
  constructor(template) {
    super(template);
    this.name = template.name;
  }
}

export let TILES = {
  NULLTILE: new Tile({name: 'nulltile', chr: 'x'}),
  WALL: new Tile({name: 'wall', chr: '#'}),
  FLOOR: new Tile({name: 'floor', chr: '.'})
}
