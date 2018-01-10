// This is the map class for maps

import {TILES} from './tile.js';
import {init2DArray, uniqueID} from './util.js';
import ROT from 'rot-js';
import {DATASTORE} from './datastore.js'

class Map {
  constructor(xdim, ydim) {
    this.state = {};
    this.state.xdim = xdim || 1;
    this.state.ydim = ydim || 1;
    this.state.mapType = 'basic caves';
    this.state.setupRngState = ROT.RNG.getState();
    this.state.id = uniqueID();
  }

  build() {
    this.tileGrid = TILE_GRID_GENERATOR[this.state.mapType](this.state.xdim, this.state.ydim, this.state.setupRngState);
  }

  getID() {return this.state.id;}
  setID(newID) {this.state.id = newID;}

  getXDim() {return this.state.xdim;}
  setXDim(newID) {this.state.xdim = newID;}

  getYDim() {return this.state.ydim;}
  setYDim(newID) {this.state.ydim = newID;}

  getMapType() {return this.state.mapType;}
  setMapType(newID) {this.state.mapType = newID;}

  getRngState() {return this.state.RngState}
  setRngState(newID) {this.state.RngState = newID;}

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

  toJSON() {
    return JSON.stringify(this.state);
  }

  getTile(mapx, mapy) {
    if (mapx < 0 || mapx > this.state.xdim - 1 || mapy < 0 || mapy > this.state.ydim - 1) {
      return TILES.NULLTILE;
    }
    return this.tileGrid[mapx][mapy];
  }
}

let TILE_GRID_GENERATOR = {
  'basic caves': function(xd, yd, rngState) {
    let tg = init2DArray(xd, yd, TILES.NULLTILE);
    let gen = new ROT.Map.Cellular(xd, yd, { connected: true });
    let origRngState = ROT.RNG.getState();
    ROT.RNG.setState(rngState);

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

export function MapMaker(mapWidth, mapHeight) {
  let m = new Map(mapWidth, mapHeight);
  DATASTORE.MAPS[m.getID()] = m;
  return m;
}
