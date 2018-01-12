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
  getmapID() { return this.entState.name; }
  setmapID(newInfo) { this.entState.name = newInfo; }
  getMap() { return DATASTORE.MAPS[this.entState.mapID]; }
  getID() { return this.entState.id; }
  setID(newInfo) { this.entState.id = newInfo; }

}
