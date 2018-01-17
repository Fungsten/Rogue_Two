// a base class that defines all entities (creatures etc) in the game

import {MixableSymbol} from './mixable_symbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';
import {MapMaker} from './map.js';

export class Entity extends MixableSymbol {
  constructor(template) {
    super(template);

    // this.state = {};
    if (! this.state) { this.state = {}; }
    // this.state.chr = template.chr;
    this.state.x = 0;
    this.state.y = 0;
    this.state.mapID = 0;
    this.state.id = uniqueID();
  }

  getName() { return this.state.name; }
  setName(newInfo) { this.state.name = newInfo; }
  getX() { return this.state.x; }
  setX(newInfo) { this.state.x = newInfo; }
  getY() { return this.state.y; }
  setY(newInfo) { this.state.y = newInfo; }

  getPos() { return `${this.state.x}${this.state.y}`; }

  getmapID() { return this.state.mapID; }
  setmapID(newInfo) { this.state.mapID = newInfo; }

  getMap() { return DATASTORE.MAPS[this.state.mapID]; }
  getID() { return this.state.id; }
  setID(newInfo) { this.state.id = newInfo; }

  destroy() {
    console.log("destroying entity");
    this.getMap().extractEntity(this);
    delete DATASTORE.ENTITIES[this.getID()];
    console.dir(DATASTORE);
  }


  // moveBy(dx, dy) {
  //   let newX = this.state.x*1 + dx*1;
  //   let newY = this.state.y*1 + dy*1;
  //
  //   if (this.getMap().isPositionOpen(newX, newY)){
  //     this.state.x = newX;
  //     this.state.y = newY;
  //
  //     this.getMap().updateEntityPos(this, this.state.x, this.state.y);
  //     return true;
  //   }
  //   return false;
  // }

  toJSON() {
    return JSON.stringify(this.state);
  }

  fromJSON(json) {
    this.state = JSON.parse(json);
  }

  fromState(state) {
    this.state = state;
  }
}
