// hopefully, we can store all the necessary keybindings here

import ROT from 'rot-js';
import {Game} from './game.js';
import {StartupMode, PlayMode, LoseMode, WinMode, PersistenceMode} from './ui_mode.js';

// handleInput(inputType,inputData) {
//   // super.handleInput(inputType,inputData);
//   if (inputType == 'keyup') {
//     if (inputData.key == 'n' || inputData.key == 'N') {
//       console.log('new game');
//       this.game.startNewGame();
//       this.game.switchMode('play');
//       return true;
//     }

export function startUpInput(inputType, inputData) {
  // keybinds for startup mode
  // press any key to be brought to persistence mode
  if (eventType == "keyup") {
    this.game.switchMode('persistence');
    return true;
  }
}

export function persistenceInput(inputType, inputData) {
  // keybinds for persistence mode

  // only respond to key up events
  if (inputType == 'keyup') {

    // if n or N, start new game
    if (inputData.key == 'n' || inputData.key == 'N') {
      console.log('new game');
      this.game.startNewGame();
      this.game.switchMode('play');
      return true;
    }

    // if s or S, save game
    if (inputData.key == 's' || inputData.key == 'S') {
      this.UIMode.persistenceMode.handleSave();
      return true;
    }

    // if l or L, load a saved game
    if (inputData.key == 'l' || inputData.key == 'L') {
      this.UIMode.persistenceMode.handleRestore();
      return true;
    }

    // if esc, go back to current game
    if (inputData.key == 'Escape'){
      this.game.switchMode('play');
      return true;
    }
  }
  return false;
}
