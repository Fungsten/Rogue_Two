// a base class that defines all entities (creatures etc) in the game

import {MixableSymbol} from './mixable_symbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';

export class Entity extends MixableSymbol {
  constructor(template) {
    super(template);

    this.entState = {};
    if (! this.entState) { this.entState = {}; }
    //this.entState.chr = template.chr;
    this.entState.x = 0;
    this.entState.y = 0;
    this.entState.mapID = 0;
    this.entState.id = uniqueID();
  }

  getName() { return this.entState.name; }
  setName(newInfo) { this.entState.name = newInfo; }
  getX() { return this.entState.x; }
  setX(newInfo) { this.entState.x = newInfo; }
  getY() { return this.entState.y; }
  setY(newInfo) { this.entState.y = newInfo; }

  getPos() { return `${this.entState.x}${this.entState.y}`; }

  getmapID() { return this.entState.mapID; }
  setmapID(newInfo) { this.entState.mapID = newInfo; }

  getMap() { return DATASTORE.MAPS[this.entState.mapID]; }
  getID() { return this.entState.id; }
  setID(newInfo) { this.entState.id = newInfo; }


  moveBy(dx, dy) {
    let newX = this.entState.x*1 + dx*1;
    let newY = this.entState.y*1 + dy*1;

    if (this.getMap().isPositionOpen(newX, newY)){
      this.entState.x = newX;
      this.entState.y = newY;

      this.getMap().updateEntityPos(this, this.entState.x, this.entState.y);
      return true;
    }
    return false;
  }

  toJSON() {
    return JSON.stringify(this.entState);
  }

  fromJSON(json) {
    this.entState = JSON.parse(json);
  }

  fromState(state) {
    this.entState = state;
  }
}
