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
import {customizeChar} from './customization.js';

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

    //test
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
        //Message.send("Started new game")
        this.game.switchMode('customize');
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
export class AvatarCreateMode extends UIMode {
  enter() {
    super.enter();
    this.game.isPlaying = true;
    this.currNum = 0;

    initTiming();

    this.game.globalAvatar = EntityFactory.create("avatar");
    setKey(['customize']);
  }

  chooseElement() {
    this.random = ROT.RNG.getUniform();
    console.log('this.random');
    console.log(this.random);
    this.currNum = Math.ceil( this.random * 118);
    console.log('this.currNum');
    console.log(this.currNum);
    Message.send("Press Y for yes or N for no.");
  }

  render(display) {
    display.clear();
    this.chooseElement();
    display.drawText(2,5, "Here is a number: " + this.currNum);
    display.drawText(2,7, "Do you like it?");

  }

  handleInput(eventType,evt) {
    if (eventType == 'keyup') {
      let input = getInput(eventType,evt);
      if (input == COMMAND.NULLCOMMAND) { return false; }

      if (input == COMMAND.YES) {
        console.log('in yes');
        customizeChar(this.currNum,this.game.globalAvatar);
        console.log('global avatar:');
        console.dir(this.game.globalAvatar);
        this.game.modes.play.setupNewGame();
        this.game.switchMode('play');
        return false;
      }
      if (input == COMMAND.NO) {
        console.log('in no');
        // this.chooseElement()
        // this.render(this.game.display);
        return true;
      }
    }
  }

}
//-----------------------------------------------------
//-----------------------------------------------------

export class PlayMode extends UIMode {

  enter() {
    super.enter();
    //this.game.isPlaying = true;
    setKey(['play','movement','interact']);
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

    let a = this.game.globalAvatar;
    a.setMaxHP(Math.ceil(a.getMaxHP() * a.getHPMul()));
    a.setHP(a.getMaxHP());

    console.log('max AE: '+ a.getMaxAE());
    console.log('AE mul: '+ a.getAEMul());
    console.log('multiplied: '+ a.getMaxAE()*a.getAEMul());
    console.log('ceil: '+Math.ceil(a.getMaxAE() * a.getAEMul()));
    a.setMaxAE(Math.ceil(a.getMaxAE() * a.getAEMul()));
    a.setAE(a.getMaxAE());

    a.setSTR((a.getSTR() * a.getSTRMul()).toFixed(2));
    a.setPER((a.getPER() * a.getPERMul()).toFixed(2));
    a.setEND((a.getEND() * a.getENDMul()).toFixed(2));
    a.setCRM((a.getCRM() * a.getCRMMul()).toFixed(2));
    a.setINT((a.getINT() * a.getINTMul()).toFixed(2));
    a.setAGI((a.getAGI() * a.getAGIMul()).toFixed(2));
    a.setLUK((a.getLUK() * a.getLUKMul()).toFixed(2));

    m.addEntityAtRandPos(a);
    // let b = EntityFactory.create("Brady");

    this.curry.avatarID = a.getID();

    let bradyNumber = 4;
    for (let i = 0; i < bradyNumber; i++) {
      let b = EntityFactory.create("Brady");
      m.addEntityAtRandPos(b);
    }

    let jarNumber = 4;
    for (let i = 0; i < jarNumber; i++) {
      let b = EntityFactory.create("Jar Jar");
      m.addEntityAtRandPos(b);
    }

    let d = EntityFactory.create("Door");
    m.addEntityAtRandPos(d);

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
    display.drawText(0,5,"Money: " + this.getAvatar().getMoney() +" credits");

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
    console.log('entered uimode play handle input');

    if (this.getAvatar().getCurHP() <= 0){
      this.game.globalAvatar = this.getAvatar();
      this.game.switchMode('lose');
    }

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
        Message.clear();
        this.moveAvatar(-1, -1);
        return true;
      }
      //up
      if (input == COMMAND.U) {
        Message.clear();
        this.moveAvatar(0, -1);
        return true;
      }
      //upper right
      if (input == COMMAND.UR) {
        Message.clear();
        this.moveAvatar(1, -1);
        return true;
      }
      //left
      if (input == COMMAND.L) {
        Message.clear();
        this.moveAvatar(-1, 0);
        return true;
      }
      //right
      if (input == COMMAND.R) {
        Message.clear();
        this.moveAvatar(1, 0);
        return true;
      }
      //lower left
      if (input == COMMAND.DL) {
        Message.clear();
        this.moveAvatar(-1, 1);
        return true;
      }
      //down
      if (input == COMMAND.D) {
        Message.clear();
        this.moveAvatar(0, 1);
        return true;
      }
      //lower right
      if (input == COMMAND.DR) {
        Message.clear();
        this.moveAvatar(1, 1);
        return true;
      }
      //wait, don't move
      if (input == COMMAND.WAIT) {
        Message.clear();
        this.getAvatar().raiseMixinEvent('playerHasMoved');
        this.getAvatar().raiseMixinEvent('turnTaken', {'timeUsed': 1});
        return true;
      }
      if (input == COMMAND.INTERACT) {
        Message.send("You drop a little sarcasm. " + this.getAvatar().state.activeTarget.getName() + " did not respond well.");
        let a = this.getAvatar();
        if (this.getAvatar().state.activeTarget.getName() == 'Door') {
          let m = MapMaker({xdim: 30, ydim: 20});

          this.curry = {};
          this.curry.curMapID = m.getID();
          this.curry.view = {};
          this.curry.camerax = 40;
          this.curry.cameray = 12;

          initTiming();
          console.dir(a);

          // let a = this.getAvatar();
          m.addEntityAtRandPos(a);

          this.curry.avatarID = a.getID();

          let bradyNumber = 40;
          for (let i = 0; i < bradyNumber; i++) {
            let b = EntityFactory.create("Brady");
            m.addEntityAtRandPos(b);
          }

          let jarNumber = 40;
          for (let i = 0; i < jarNumber; i++) {
            let b = EntityFactory.create("Jar Jar");
            m.addEntityAtRandPos(b);
          }

          let d = EntityFactory.create("Door");
          m.addEntityAtRandPos(d);

          a.setmapID(this.curry.curMapID);
          this.updateCameraToAvatar();
          Message.clear();
          Message.send("Arrived in new area.");
        }
        return true;
      }
      if (input == COMMAND.ATTACK) {
        console.log("ATTACK");
        if (this.getAvatar().getFaction() == this.getAvatar().state.activeTarget.getFaction()) {
          this.getAvatar().setFaction('player');
        }
        this.getAvatar().raiseMixinEvent('attacks', {actor: this.getAvatar(), target: this.getAvatar().state.activeTarget});
        this.getAvatar().raiseMixinEvent('turnTaken', {'timeUsed': 1});
        this.getAvatar().raiseMixinEvent('attackUsed');
        this.getAvatar().state.activeTarget.raiseMixinEvent('damaged', {src: this.getAvatar(), damageAmount: this.getAvatar().getMeleeDamage()});
        this.getAvatar().setTarget('');
        this.getAvatar().raiseMixinEvent('playerHasMoved');
        return true;
      }
      if (input == COMMAND.STEAL) {
        // Message.send("You attempt stealing.");
        // Message.send("You stole " + this.getAvatar().state.activeTarget.getMoney() + " credits.");

        if (this.getAvatar().state.activeTarget.getMoney() != 0) {
          Message.send("You stole " + this.getAvatar().state.activeTarget.getMoney() + " credits.");
          this.getAvatar().getMoreMoney(this.getAvatar().state.activeTarget.getMoney());
          this.getAvatar().state.activeTarget.getMoreMoney(this.getAvatar().state.activeTarget.getMoney() * -1);
          this.getAvatar().gainExp(50 * (this.getAvatar().state.activeTarget.getLevel() + 1));


          this.getAvatar().setTarget('');
          this.getAvatar().raiseMixinEvent('playerHasMoved');
        } else {
          Message.send("You've already stolen from this poor schmuck.")
        }
        return true;
      }
      if (input == COMMAND.BLUFF) {
        Message.send("You attempt bluffing.");

        if (this.getAvatar().getFaction() != this.getAvatar().state.activeTarget.getFaction()) {
          this.getAvatar().setFaction(this.getAvatar().state.activeTarget.getFaction());
          this.getAvatar().gainExp(50 * (this.getAvatar().state.activeTarget.getLevel() + 1));
          Message.send("They now think you're one of them.");

          this.getAvatar().setTarget('');
          this.getAvatar().raiseMixinEvent('playerHasMoved');
        } else {
          Message.send("They already think you're one of them.");
        }
        return true;
      }
      if (input != COMMAND.INTERACT || input != COMMAND.ATTACK || input != COMMAND.STEAL || input != COMMAND.BLUFF) {
        Message.send("You decide not to interact.");
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
  enter() {
    super.enter();
    this.endMoney = this.game.globalAvatar.getMoney();
  }

  render(display){
    display.clear();
    display.drawText(33,12,`You died with ${this.endMoney} credits.`);
    if (this.endMoney < 100) {
      Message.send("You were practically broke and a failure of a criminal.");
    } else if (this.endMoney < 1100) {
      Message.send("You may as well be the Solar System's worst thief.");
    } else if (this.endMoney < 6100) {
      Message.send("You were barely an amateur.");
    } else if (this.endMoney < 16100) {
      Message.send("It's a pity you only managed to become sort of an amateur.");
    } else if (this.endMoney < 31100) {
      Message.send("Congratulations, you made it to amateur criminal.");
    } else if (this.endMoney < 56100) {
      Message.send("You were known as a competent criminal.");
    } else if (this.endMoney < 106100) {
      Message.send("You managed to become a noteworthy criminal.");
    } else if (this.endMoney < 206100) {
      Message.send("It's a pity, you were finally becoming reputable as a criminal.");
    } else if (this.endMoney < 356100) {
      Message.send("Well, you managed to become a wanted criminal.");
    } else if (this.endMoney < 556100) {
      Message.send("You were a hunted criminal with considerable cash, so perhaps you had an excuse.");
    } else if (this.endMoney < 1056100) {
      Message.send("A dangerous but reasonably rich criminal died this day.");
    } else if (this.endMoney < 2056100) {
      Message.send("You were really quite a remarkable criminal.");
    } else if (this.endMoney < 3556100) {
      Message.send("You were a master criminal who mastered the art of cash-obtaining.");
    } else if (this.endMoney < 6056100) {
      Message.send("You were one grand master of a criminal.");
    } else if (this.endMoney < 11056100) {
      Message.send("You will be forever known as a supremely wealthy criminal.");
    } else {
      Message.send("You made your mark as the ultimate, richest criminal in the Solar System.");
    }
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
