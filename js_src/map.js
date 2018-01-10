// This is the map class for maps

import {TILES} from './tile.js';
import {init2DArray, uniqueID} from './util.js';
import ROT from 'rot-js';

class Map {
  constructor(xdim, ydim) {
    this.xdim = xdim || 1;
    this.ydim = ydim || 1;
    //this.tileGrid = init2DArray(this.xdim, this.ydim, TILES.NULLTILE);
    this.tileGrid = TILE_GRID_GENERATOR['basic caves'](xdim, ydim);
    this.mapID = uniqueID();

    console.dir(this);
  }

  render(display, camera_map_x, camera_map_y) {
    let cx = 0;
    let cy = 0;
    let xstart = camera_map_x - Math.trunc(display.getOptions().width / 2);
    let xend = xstart + display.getOptions().width; //{{display width}};
    let ystart = camera_map_y - Math.trunc(display.getOptions().height / 2);;
    let yend = ystart + display.getOptions().height; //{{display height}};


    for(let xi = xstart; xi < xend; xi++){
      for(let yi = ystart; yi < yend; yi++){
        this.getTile(xi, yi).render(display, cx, cy);
        cy++;
      }
      cx++;
      cy = 0;
    }
  }

  getTile(mapx, mapy) {
    if (mapx < 0 || mapx > this.xdim - 1 || mapy < 0 || mapy > this.ydim - 1) {
      return TILES.NULLTILE;
    }
    return this.tileGrid[mapx][mapy];
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

export function MapMaker(mapWidth,mapHeight) {
  let m = new Map(mapWidth,mapHeight);
  return m;
}
