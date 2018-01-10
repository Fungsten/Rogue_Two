// Game Modes

import ROT from 'rot-js';
import {Game} from './game.js';
import {MapMaker} from './map.js';
import {Message} from './message.js';
import {DisplaySymbol} from './display_symbol';
import {DATASTORE, clearDatastore} from './datastore.js';

class UIMode {
  constructor(thegame) {
    console.log("created "+this.constructor.name);
    this.game = thegame;
  }

  enter() {
    console.log("entered "+this.constructor.name);
  } //do something when entering this state
  exit() {
    console.log("exitted "+this.constructor.name);
  } //do something when leaving this state
  handleInput(eventType, evt) {
    console.log("handling input for "+this.constructor.name);
    console.log(`event type is ${eventType}`);
    console.dir(evt);
    return false;
  } //take input from user / player
  render(display) {
    console.log("rendering "+this.constructor.name);
    display.drawText(2,2,"rendering "+this.constructor.name);
  } //render
}

//-----------------------------------------------------
//-----------------------------------------------------

export class StartupMode extends UIMode { //defines how an object exists

  render(display) {
    display.drawText(2,3,"Welcome to ");
    display.drawText(2,5," _______  _______ _________          _______  _______ ");
    display.drawText(2,6,"(  ___  )(  ____ \\\\__   __/|\\     /|(  ____ \\(  ____ )");
    display.drawText(2,7,"| (   ) || (    \\/   ) (   | )   ( || (    \\/| (    )|");
    display.drawText(2,8,"| (___) || (__       | |   | (___) || (__    | (____)|");
    display.drawText(2,9,"|  ___  ||  __)      | |   |  ___  ||  __)   |     __)");
    display.drawText(2,10,"| (   ) || (         | |   | (   ) || (      | (\\ (   ");
    display.drawText(2,11,"| )   ( || (____/\\   | |   | )   ( || (____/\\| ) \\ \\__");
    display.drawText(2,12,"|/     \\|(_______/   )_(   |/     \\|(_______/|/   \\__/");

    display.drawText(6,20,"Press any key to continue");
  }

  handleInput(eventType, evt) {
    if (eventType == "keyup") {
      console.dir(this);
      this.game.switchMode('persistence');
      return true;
    }
  }
}

//-----------------------------------------------------
//-----------------------------------------------------

export class PersistenceMode extends UIMode {
  render(display) {
    display.clear();
    display.drawText(33,2,"N for new game");
    display.drawText(33,3,"S to save game");
    display.drawText(33,4,"L to load previously saved game");
  }

  handleInput(inputType,inputData) {
    // super.handleInput(inputType,inputData);
    if (inputType == 'keyup') {
      if (inputData.key == 'n' || inputData.key == 'N') {
        console.log('new game');
        this.game.setupNewGame();
        this.game.switchMode('play');
        return true;
      }
      if (inputData.key == 's' || inputData.key == 'S') {
        this.handleSave();
        return true;
      }
      if (inputData.key == 'l' || inputData.key == 'L') {
        this.handleRestore();
        this.game.switchMode('play');
        return true;
      }
      if (inputData.key == 'Escape'){
        this.game.switchMode('play');
        return true;
      }

    }
    return false;
  }

  handleSave(){
    console.log('save game');
    if (!this.localStorageAvailable()) {return false;}

    window.localStorage.setItem('roguetwogame',JSON.stringify(DATASTORE));
  }

  handleRestore(){
    console.log('load game');
    if (!this.localStorageAvailable()) {return false;}

    let restorationString = window.localStorage.getItem('roguetwogame');
    //this.game.fromJSON(restorationString);

    let state = JSON.parse(restorationString);
    clearDatastore();
    DATASTORE.ID_SEQ = state.ID_SEQ;
    this.game.fromJson(state.GAME);

    DATASTORE.MAPS = state.MAPS;

    console.log('post-save datastore:');
    console.dir(DATASTORE);
  }

  localStorageAvailable() {
    // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    try {
      var x = '__storage_test__';
      window.localStorage.setItem( x, x);
      window.localStorage.removeItem(x);
      return true;
    }
    catch(e) {
      Message.send('Sorry, no local data storage is available for this browser so game save/load is not possible');
      return false;
    }
  }

}

//-----------------------------------------------------
//-----------------------------------------------------

export class PlayMode extends UIMode {
  constructor(thegame) {
    super(thegame);
    this.state = {
      mapID: '',
      cameramapx: '',
      cameramapy: ''
    };
  }

  enter() {
    if(! this.state.map) {
      let m = MapMaker(80,40);
      this.mapID = m.getID();
      m.build();
    }
    this.state.camerax = 5;
    this.state.cameray = 8;
    this.cameraSymbol = new DisplaySymbol('@', '#eb4');
  }

  toJSON() {
    return JSON.stringify(this.state);
  }

  restoreFromState(stateData) {
    console.log('restoring play state from');
    console.dir(stateData);
    this.state = stateData;
  }

  render(display){
    display.clear();
    display.drawText(33,4,"GAME IN PROGRESS");
    display.drawText(33,5,"PRESS W TO WIN, L TO LOSE");
    DATASTORE.MAPS[this.state.mapID].render(display, this.state.cameraxmapx, this.state.cameramapy);
    this.cameraSymbol.render(display, display.getOptions().width / 2, display.getOptions().height / 2);
  }

  handleInput(eventType, evt) {
    if (evt.key == 'l') {
      console.dir(this);
      this.game.switchMode('lose');
      return true;
    }
    if (evt.key == 'w') {
      console.dir(this);
      this.game.switchMode('win');
      return true;
    }
    if (evt.key == 'Escape' && eventType == 'keyup'){
      this.game.switchMode('persistence');
      return true;
    }

    //-----------------------------------------------------
    //-----------------------------------------------------

    //upper left
    console.dir(evt);
    if (evt.key == '7' && eventType == 'keydown') {
      this.moveCamera(-1, -1);
      return true;
    }
    //up
    console.dir(evt);
    if (evt.key == '8' && eventType == 'keydown') {
      this.moveCamera(0, -1);
      return true;
    }
    //upper right
    console.dir(evt);
    if (evt.key == '9' && eventType == 'keydown') {
      this.moveCamera(1, -1);
      return true;
    }
    //left
    console.dir(evt);
    if (evt.key == '4' && eventType == 'keydown') {
      this.moveCamera(-1, 0);
      return true;
    }
    //right
    console.dir(evt);
    if (evt.key == '6' && eventType == 'keydown') {
      this.moveCamera(1, 0);
      return true;
    }
    //lower left
    console.dir(evt);
    if (evt.key == '1' && eventType == 'keydown') {
      this.moveCamera(-1, 1);
      return true;
    }
    //down
    console.dir(evt);
    if (evt.key == '2' && eventType == 'keydown') {
      this.moveCamera(0, 1);
      return true;
    }
    //lower right
    console.dir(evt);
    if (evt.key == '3' && eventType == 'keydown') {
      this.moveCamera(1, 1);
      return true;
    }

    //-----------------------------------------------------
    //-----------------------------------------------------
  }

  moveCamera(x,y) {
      console.log(x + y);
      this.camerax += x;
      this.cameray += y;
  }
}



//-----------------------------------------------------
//-----------------------------------------------------

export class UIModeMessages extends UIMode {
  render() {
    Message.renderOn(this.display);
  }

  handleInput(inputType,inputData) {
    if (inputType == 'keyup') {
      if (inputData.key == 'Escape') {
        if (this.game.isPlaying) {
          this.game.switchMode('play');
        }
      }
      return false;
    }
  }



}
//don't need to export parent classes to export subclasses

//-----------------------------------------------------
//-----------------------------------------------------

export class LoseMode extends UIMode {

  render(display){
    display.clear();
    display.drawText(33,4,"YOU LOSE. GOOD DAY.");
    Message.send("It's treason then.");
  }
  handleInput(eventType, evt) {
    if (evt.key == 'Escape' && eventType == 'keyup'){
      this.game.switchMode('persistence');
      return true;
    }
  }
}

//-----------------------------------------------------
//-----------------------------------------------------

export class WinMode extends UIMode {

  render(display){
    display.clear();
    display.drawText(33,4,"A WINNER IS YOU");
    Message.send("He's right. It's a system we can't afford to lose.");
  }

  handleInput(eventType, evt) {
    if (evt.key == 'Escape' && eventType == 'keyup'){
      this.game.switchMode('persistence');
      return true;
    }
  }
}
