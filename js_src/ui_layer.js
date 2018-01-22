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

//------------------------------------------------------------------------------

export class TextLayer extends UILayer {
  constructor(gameRef, laysOver,text) {
    super(gameRef,laysOver);
    this.yDim = 24;
    this.text = text;
    this.yBase = 0;
    this.totalLines = 0;
    this.canMoveUp = false;
    this.canMoveDown = false;
  }

  bindComm() {setKey(['textNav']);}

  setText(text) {
    this.text = text;
    this.yBase = 0;
    this.totalLines = 0;
    this.canMoveUp = false;
    this.canMoveDown = false;
    this.render();
  }

  checkVal() {
    let linesDrawn = Math.min(this.totalLines,this.yDim);
    let linesAboveFold = this.yBase * -1;
    let linesBelowFole = this.totalLines - linesAboveFold - linesDrawn;
    this.canMoveUp = linesAboveFold > 0;
    this.canMoveDown = linesBelowFold > 0;
  }

  tryLineUp() {
    this.checkVal();
    if (this.canMoveUp) {
      this.yBase = Math.min(0,this.yBase + 1);
    }
  }

  tryLineDown() {
    this.checkVal();
    if (this.canMoveDown) {
      this.yBase--;
    }
  }

  handleInput(eventType, evt) {
    if (eventType == 'keydown') {
      let input = getInput(eventType,evt);
      if (input == COMMAND.NULLCOMMAND) { return false; }

      if (input == COMMAND.CANCEL) {
        this.game.removeUILayer();
        return false;
      }
      if (input == COMMAND.LU) {
        this.tryLineUp();
      } else if (input == COMMAND.LD) {
        this.tryLineDown();
      } else if (input == COMMAND.PU) {
        for (let i = 0; i < this.yDim; i++) {this.tryLineUp();}
      } else if (input == COMMAND.PD) {
        for (let i = 0; i < this.yDim; i++) {this.tryLineDown();}
      }
      this.render();
      return false;
    }
  }

  render() {
    this.display.main.clear();
  }
}
