// interface layers that run over other ui modes while those modes are still running

import ROT from 'rot-js';
import {Message} from './message.js';
import {UIMode} from './ui_mode_base.js';
import {COMMAND,getCommandFromInput,setKeyBinding} from './commands.js';
import {customizeChar} from './customization.js';

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

//------------------------------------------------------------------------------

export class Customize extends UILayer {
  constructor(gameRef, laysOver, avatar) {
    super(gameRef, laysOver);
    this.av = avatar;
    this.currNum = 0
  }

  bindComm() {
    setKey('customize');
  };

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      let input = getInput(eventType,evt);
      if (input == COMMAND.NULLCOMMAND) { return false; }

      if (input == COMMAND.YES) {
        customizeChar(this.currNum,this.av);
        this.exit();
      }
      if (input == COMMAND.NO) {
        this.render();
      }
    }
  }

  render() {
    this.currNum = Math.ceiling(ROT.RNG.getUniform() * 118);

    display.drawText(2,5, "Here is a number: " + currNum);
    display.drawText(2,7, "Do you like it?");
    Message.send("Press Y for yes or N for no.");
  }

}
