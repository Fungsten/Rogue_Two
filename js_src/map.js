// This is the map class for maps

import {TILES} from './tile.js';
import {init2DArray, uniqueID} from './util.js';
import ROT from 'rot-js';
import {DATASTORE} from './datastore.js'

class Map {
  constructor(xdim, ydim) {
    this.mapState = {};
    this.mapState.id = uniqueID();
    this.mapState.xdim = xdim || 1;
    this.mapState.ydim = ydim || 1;
    this.mapState.mapType = 'basic caves';
    //this.rng = ROT.RNG.clone();
    //this.mapState.rngBaseState = this.rng.getState();
    this.mapState.setupRngState = ROT.RNG.getState();
    this.mapState.entityIDtoMapPos = {};
    this.mapState.mapPostoEntityID = {};
  }

  build() {
    //ROT.RNG.setState(this.mapState.rngBaseState);
    this.tileGrid = TILE_GRID_GENERATOR[this.mapState.mapType](this.mapState.xdim, this.mapState.ydim, this.mapState.setupRngState);
  }

  getID() {return this.mapState.id;}
  setID(newID) {this.mapState.id = newID;}

  getXDim() {return this.mapState.xdim;}
  setXDim(newID) {this.mapState.xdim = newID;}

  getYDim() {return this.mapState.ydim;}
  setYDim(newID) {this.mapState.ydim = newID;}

  getMapType() {return this.mapState.mapType;}
  setMapType(newID) {this.mapState.mapType = newID;}

  getRngBaseState() {return this.mapState.rngBaseState}
  setRngBaseState(newID) {this.mapState.rngBaseState = newID;}

  updateEntityPos(ent, newX, newY) {
    let oldPos = this.mapState.entityIDtoMapPos[ent.getID()];
    delete this.mapState.mapPostoEntityID[oldPos];

    this.mapState.mapPostoEntityID[`${newX},${newY}`] = ent.getID();
    this.mapState.entityIDtoMapPos[ent.getID()] = `${newX},${newY}`;
  }

  addEntityAt(ent, mapx, mapy) {
    let pos = `${mapx},${mapy}`;
    this.mapState.entityIDtoMapPos[ent.getID()] = pos;
    this.mapState.mapPostoEntityID[pos] = ent.getID();
    ent.setmapID(this.getID);
    ent.setX(mapx);
    ent.setY(mapy);
  }

  addEntityAtRandPos(ent) {
    let openPos = this.getRandomOpenPosition();
    let p = openPos.split(',');
    this.addEntityAt(ent, p[0], p[1]);
  }

  getRandomOpenPosition() {
    let x = Math.trunc(ROT.RNG.getUniform()*this.mapState.xdim);
    let y = Math.trunc(ROT.RNG.getUniform()*this.mapState.ydim);
    if (this.isPositionOpen(x, y)) {
          return `${x},${y}`;
    }
    return this.getRandomOpenPosition();
  }

  isPositionOpen(mapx, mapy) {
    if (this.tileGrid[x][y].isA('floor')) {
          return true;
    }
    return false;
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
        let pos = `${xi},${yi}`;
        if (this.mapState.mapPostoEntityID[pos]){
          DATASTORE.ENTITIES[this.mapState.mapPostoEntityID[pos]].render(display, cx, cy);
        } else {
          this.getTile(xi, yi).render(display, cx, cy);
        }
        cy++;
      }
      cx++;
      cy = 0;
    }
  }

  toJSON() {
    return JSON.stringify(this.mapState);
  }

  fromState(state) {
    this.mapState = state;
  }

  getTile(mapx, mapy) {
    if (mapx < 0 || mapx > this.mapState.xdim - 1 || mapy < 0 || mapy > this.mapState.ydim - 1) {
      return TILES.NULLTILE;
    }
    return this.tileGrid[mapx][mapy] || TILES.NULLTILE;
  }
}

let TILE_GRID_GENERATOR = {
  'basic caves': function(xd, yd, rngState) {
    let origRngState = ROT.RNG.getState();
    ROT.RNG.setState(rngState);
    let tg = init2DArray(xd, yd, TILES.NULLTILE);
    let gen = new ROT.Map.Cellular(xd, yd, { connected: true });

    gen.randomize(.3);
    gen.create();

    gen.connect(function(x,y,isWall) {
      tg[x][y] = (isWall || x==0 || y==0 || x==xd-1 || y==yd-1) ? TILES.WALL : TILES.FLOOR;
    });
    ROT.RNG.setState(origRngState);
    return tg;
  }
}

export function MapMaker(mapData) {
  let m = new Map(mapData.xdim, mapData.ydim, mapData.mapType);
  // if (mapData){
  //   m = new Map(mapData.xdim, mapData.ydim);
  // }
  if (mapData.id !== undefined) {
    m.fromState(mapData);
  }
  m.build();
  // if (mapData.setupRngState) {
  //   m.setID(mapData.setupRngState);
  // }
  DATASTORE.MAPS[m.getID()] = m;
  return m;
}
