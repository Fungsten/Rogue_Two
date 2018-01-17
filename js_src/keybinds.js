// hopefully, we can store all the necessary keybindings here

import ROT from 'rot-js';
import {Game} from './game.js';
import {MapMaker} from './map.js';
import {Message} from './message.js';
import {DisplaySymbol} from './display_symbol';
import {DATASTORE, clearDatastore} from './datastore.js';
import {Entity} from './entity.js';
import {EntityFactory} from './entitiesspawn.js';
import {StartupMode, PlayMode, LoseMode, WinMode, PersistenceMode} from './ui_mode.js';


export function keybindings(inputType, inputData) {

  //keybinds for startup mode
  console.log("reading from keybinds");
  // console.log(Game.curMode.constructor.name);
  // console.log("please");
  // console.log(Game.curMode.constructor.name == 'StartupMode');
  if (Game.curMode.constructor.name == 'StartupMode') {
    if (inputType == 'keyup') {
      Game.curMode.game.switchMode('persistence');
      return true;
    }
  }

  //keybinds for persistence mode
  if (Game.curMode.constructor.name == 'PersistenceMode') {
    if (inputType == 'keyup') {
      if (inputData.key == 'n' || inputData.key == 'N') {
        console.log('new game from keybinds');
        Game.startNewGame();
        Game.switchMode('play');
        return true;
      }
      if (inputData.key == 's' || inputData.key == 'S') {
        console.log('save game');
        PersistenceMode.handleSave();
        Game.switchMode('play');
        return true;
      }
      if (inputData.key == 'l' || inputData.key == 'L') {
        console.log('loading game');
        PersistenceMode.handleRestore();
        Game.switchMode('play');
        return true;
      }
      if (inputData.key == 'Escape'){
        Game.switchMode('play');
        return true;
      }
    }
    return false;
  }
}
