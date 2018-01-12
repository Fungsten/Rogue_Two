// a base class that defines all entities (creatures etc) in the game

import {DisplaySymbol} from './display_symbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';

export class Entity extends DisplaySymbol {
  constructor(template) {
    super(template);

    this.entState = {};
    this.entState.name = template.name;
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

  getPos() {
    return `${this.entState.x}${this.entState.y}`;
  }

  getmapID() { return this.entState.mapID; }
  setmapID(newInfo) { this.entState.mapID = newInfo; }

  getMap() { return DATASTORE.MAPS[this.entState.mapID]; }
  getID() { return this.entState.id; }
  setID(newInfo) { this.entState.id = newInfo; }


  moveBy(dx, dy) {
    console.log(this.entState.mapID);
    console.log("datastore.maps");
    console.log(DATASTORE.MAPS);
    console.log("datasore.maps[this.entstate.mapid]");
    console.log(DATASTORE.MAPS[this.entState.mapID]);
    console.log(this.getPos());
    console.log(this.getMap());

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
}
