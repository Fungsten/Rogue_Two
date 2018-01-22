// Game Modes

import ROT from 'rot-js';
import {Game} from './game.js';
import {MapMaker} from './map.js';
import {Message} from './message.js';
import {MixableSymbol} from './mixable_symbol.js';
import {DATASTORE, clearDatastore} from './datastore.js';
import {Entity} from './entity.js';
import {EntityFactory} from './entitiesspawn.js';
import {SCHEDULER, TIME_ENGINE, initTiming} from './timing.js';
import {COMMAND, getInput, setKey} from './keybinds.js';

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
  renderAvatar(display) {
    display.clear();
  }
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
      // console.log("what is this");
      // console.dir(this);
      this.game.switchMode('persistence');
      return true;
    }
  }
}

//-----------------------------------------------------
//-----------------------------------------------------

export class PersistenceMode extends UIMode {
  enter() {
    super.enter();
    // if (window.localStorage.getItem("roguetwogame")){
    //   this.game.hasSaved = true;
    // }
    setKey('persistence');
  }

  render(display) {
    display.clear();
    display.drawText(33,2,"N for new game");
    if (this.game.isPlaying) {
      display.drawText(33,3,"S to save game");
      display.drawText(33,6,"Escape to cancel and return to game");
    }
    if (this.game.hasSaved){
      display.drawText(33,4,"L to load previously saved game");
    }

  }

  handleInput(eventType,evt) {
    if (eventType == 'keyup') {
      let input = getInput(eventType,evt);
      if (input == COMMAND.NULLCOMMAND) { return false; }

      if (input == COMMAND.NEW_GAME) {
        this.game.startNewGame();
        Message.send("Started new game")
        this.game.switchMode('play');
        return true;
      }
      if (input == COMMAND.SAVE_GAME) {
        this.handleSave();
        Message.send("Saved current game")
        return true;
      }
      if (input == COMMAND.LOAD_GAME) {
        this.handleRestore();
        Message.send("Loaded previously saved game")
        return true;
      }
      if (input == COMMAND.CANCEL) {
        this.game.switchMode('play');
        return true;
      }
    }
  }

  handleSave(){
    console.log('save game');
    if (!this.localStorageAvailable()) {return;}
    console.dir(DATASTORE);
    window.localStorage.setItem('roguetwogame', JSON.stringify(DATASTORE));
    this.game.hasSaved = true;
    console.log("done saving");
    this.game.switchMode('play');
  }

  handleRestore(){
    console.log('load game');
    if (!this.localStorageAvailable()) {return;}

    let restorationString = window.localStorage.getItem('roguetwogame');
    let state = JSON.parse(restorationString);
    clearDatastore();
    DATASTORE.GAME = this.game;
    DATASTORE.ID_SEQ = state.ID_SEQ;
    console.dir(state);

    console.log("saveState.maps looks like");
    console.dir(state.MAPS);

    for (let mapid in state.MAPS) {
      MapMaker(JSON.parse(state.MAPS[mapid]));
    }

    for (let entityID in state.ENTITIES) {
      let entState = JSON.parse(state.ENTITIES[entityID]);
      console.log("state.ENTITIES: ");
      console.log(state.ENTITIES);
      console.log("The entState is: ");
      console.log(entState.name);
      // DATASTORE.ENTITIES
      EntityFactory.create(entState.name, entState);
    }

    this.game.fromJSON(state.GAME);

    console.log('post-save datastore:');
    console.dir(DATASTORE);
    this.game.switchMode('play');
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

  enter() {
    super.enter();
    this.game.isPlaying = true;
    setKey(['play','movement']);
  }

  toJSON() {
    return JSON.stringify(this.curry);
  }

  fromJSON(json) {
    this.curry = JSON.parse(json);
  }

  restoreFromState(stateData) {
    console.log('restoring play state from');
    console.dir(stateData);
    this.state = stateData;
  }

  setupNewGame() {
    let m = MapMaker({xdim: 30, ydim: 20});

    this.curry = {};
    this.curry.curMapID = m.getID();
    this.curry.view = {};
    this.curry.camerax = 40;
    this.curry.cameray = 12;
    // this.curry.avatarID = {}
    // this.curry.viewDisplayLoc = {
    //   x: Math.round(display.getOptions().width/2),
    //   y: Math.round(display.getOptions().height/2)
    // };
    initTiming();

    let a = EntityFactory.create("avatar");
    m.addEntityAtRandPos(a);
    // let b = EntityFactory.create("Brady");

    this.curry.avatarID = a.getID();

    let bradyNumber = 50;
    for (let i = 0; i < bradyNumber; i++) {
      let b = EntityFactory.create("Brady");
      m.addEntityAtRandPos(b);
    }

    a.setmapID(this.curry.curMapID);
    this.updateCameraToAvatar();
    console.log("play mode - new game started");
    Message.clear();
    Message.send("You have just been arrested. But you seem to be on top of things.");
}

  render(display){
    display.clear();
    //display.drawText(33,4,"GAME IN PROGRESS");
    //display.drawText(33,5,"PRESS W TO WIN, L TO LOSE");
    DATASTORE.MAPS[this.curry.curMapID].render(display, this.curry.camerax, this.curry.cameray);
    // this.cameraSymbol.render(display, display.getOptions().width / 2, display.getOptions().height / 2);
  }

  renderAvatar(display) {
    display.clear();
    display.drawText(0,2,"Avatar Level: " + this.getAvatar().getLevel());
    display.drawText(0,0,"time: " + this.getAvatar().getTime());
    display.drawText(0,3,"HP: " + this.getAvatar().getCurHP() + " / " + this.getAvatar().getMaxHP());
    display.drawText(0,4,"AE: " + this.getAvatar().getCurAE() + " / " + this.getAvatar().getMaxAE());
    display.drawText(0,5,"Money: Many");

    display.drawText(0,7,"Strength:     " + this.getAvatar().getSTR());
    display.drawText(0,8,"Perception:   " + this.getAvatar().getPER());
    display.drawText(0,9,"Endurance:    " + this.getAvatar().getEND());
    display.drawText(0,10,"Charisma:     " + this.getAvatar().getCRM());
    display.drawText(0,11,"Intelligence: " + this.getAvatar().getINT());
    display.drawText(0,12,"Agility:      " + this.getAvatar().getAGI());
    display.drawText(0,13,"Luck:         " + this.getAvatar().getLUK());

    display.drawText(0,15,"EXP: " + this.getAvatar().getCurrExp() + " / " + this.getAvatar().getNextExp());
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      let input = getInput(eventType,evt);
      if (input == COMMAND.NULLCOMMAND) { return false; }

      if (input == COMMAND.TO_PERSISTENCE) {
        this.game.switchMode('persistence');
        return true;
      }

      // if (input == COMMAND.MESSAGES) {
      //   this.game.switchMode('messages');
      //   return true;
      // }

      //upper left
      if (input == COMMAND.UL) {
        this.moveAvatar(-1, -1);
        return true;
      }
      //up
      if (input == COMMAND.U) {
        this.moveAvatar(0, -1);
        return true;
      }
      //upper right
      if (input == COMMAND.UR) {
        this.moveAvatar(1, -1);
        return true;
      }
      //left
      if (input == COMMAND.L) {
        this.moveAvatar(-1, 0);
        return true;
      }
      //right
      if (input == COMMAND.R) {
        this.moveAvatar(1, 0);
        return true;
      }
      //lower left
      if (input == COMMAND.DL) {
        this.moveAvatar(-1, 1);
        return true;
      }
      //down
      if (input == COMMAND.D) {
        this.moveAvatar(0, 1);
        return true;
      }
      //lower right
      if (input == COMMAND.DR) {
        this.moveAvatar(1, 1);
        return true;
      }
      //wait, don't move
      if (input == COMMAND.WAIT) {
        return true;
      }
    }
  }
  moveAvatar(dx,dy) {
      //console.log(x + y);
      // this.curry.camerax += dx;
      // this.curry.cameray += dy;
      this.getAvatar().tryWalk(dx,dy);
      this.updateCameraToAvatar();
  }

  updateCameraToAvatar() {
    this.curry.camerax = this.getAvatar().getX();
    this.curry.cameray = this.getAvatar().getY();
  }

  getAvatar() {
    return DATASTORE.ENTITIES[this.curry.avatarID];
  }
}
//-----------------------------------------------------
//-----------------------------------------------------

export class MessageMode extends UIMode {
  render() {
    Message.render(this.display);
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
