// This is the map class for maps

import {TILES} from './tile.js';
import {init2DArray} from './util.js';
import ROT from 'rot-js';

export class Map {
  constructor(xdim, ydim) {
    this.xdim = xdim || 1;
    this.ydim = ydim || 1;
    //this.tileGrid = init2DArray(this.xdim, this.ydim, TILES.NULLTILE);
    this.tileGrid = TILE_GRID_GENERATOR['basic caves'](xdim, ydim);

  }

  render(display, camera_x, camera_y) {
    let cx = 0;
    let cy = 0;
    for(let xi = 0; xi < this.xdim; xi++){
      for(let yi = 0; yi < this.ydim; yi++){
        this.tileGrid[xi][yi].render(display, cx, cy);
        cy++;
      }
      cx++;
      cy = 0;
    }
  }
}

let TILE_GRID_GENERATOR = {
  'basic caves': function(xd, yd) {
    let tg = init2DArray(xd, yd, TILES.NULLTILE);
    let gen = new ROT.Map.Cellular(xd, yd, { connected: true });
    gen.randomize(.5);
    gen.create();
    gen.create();
    gen.create();
    gen.connect(function(x,y,isWall) {
      tg[x][y] = (isWall || x==0 || y==0 || x==xd-1 || y==yd-1) ? TILES.WALL : TILES.FLOOR;
    });
    //ROT.RNG.setState(origRngState);
    return tg;
  }
}
