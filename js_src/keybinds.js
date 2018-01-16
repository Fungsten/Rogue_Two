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

export function keybindings(inputType, inputData) {
  //keybinds for startup mode
  if (Game.StartupMode) {
    if (inputType == 'keyup') {
      Game.switchMode('persistence');
      return true;
    }
  }

  //keybinds for persistence mode
}
