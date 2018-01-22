// interface layers that run over other ui modes while those modes are still running

import {UIMode} from './ui_mode.js';
import {COMMAND, getInput, setKey} from './keybinds.js';
import {Color} from './colors.js';

class UILayer extends UIMode {
  constructor(gameRef, laysOver) {
    super(gameRef);
    this.laysOver = laysOver;
  }

  isLayer() {return true;}

  exit() {
    super.exit();
    this.laysOver.bindComm();
  }
}
