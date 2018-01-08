import ROT from 'rot-js';
import {DATASTORE,initializeDatastore} from './datastore.js';

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
    display.drawText(2,5,".______        ______     _______  __    __   _______ ");
    display.drawText(2,6,"|   _  \\      /  __  \\   /  _____||  |  |  | |   ____|");
    display.drawText(2,7,"|  |_)  |    |  |  |  | |  |  __  |  |  |  | |  |__   ");
    display.drawText(2,8,"|      /     |  |  |  | |  | |_ | |  |  |  | |   __|  ");
    display.drawText(2,9,"|  |\\  \\----.|  `--'  | |  |__| | |  `--'  | |  |____ ");
    display.drawText(2,10,"| _| `._____| \\______/   \\______|  \\______/  |_______|");
    display.drawText(2,11,"                                                      ");
    display.drawText(8,12,"      .___________.____    __    ____  ______         ");
    display.drawText(8,13,"      |           |\\   \\  /  \\  /   / /  __  \\        ");
    display.drawText(8,14,"      `---|  |----` \\   \\/    \\/   / |  |  |  |       ");
    display.drawText(12,15,"          |  |       \\            /  |  |  |  |       ");
    display.drawText(12,16,"          |  |        \\    /\\    /   |  `--'  |       ");
    display.drawText(12,17,"          |__|         \\__/  \\__/     \\______/        ");
    display.drawText(6,20,"Press any key to continue");
  }

  handleInput(eventType, evt) {
    if (eventType == "keyup") {
      console.dir(this);
      this.game.switchMode('play');
      return true;
    }
  }
}

//-----------------------------------------------------
//-----------------------------------------------------

// export class UIModePersistence extends UIMode {
//   enter() {
//     super.enter();
//     if (window.localStorage.getItem(this.game.PERSISTANCE_NAMESPACE)) {
//       this.game.hasSaved = true;
//     }
//   }
//
//   render() {
//     this.display.drawText(1,1,"Game Control",Color.FG,Color.BG);
//     this.display.drawText(5,3,"N - start a new game",Color.FG,Color.BG);
//     if (this.game.isPlaying) {
//       this.display.drawText(5,4,"S - save the current game",Color.FG,Color.BG);
//       this.display.drawText(1,8,"[Escape] - cancel/return to play",Color.FG,Color.BG);
//     }
//     if (this.game.hasSaved) {
//       this.display.drawText(5,5,"L - load the saved game",Color.FG,Color.BG);
//     }
//   }
//
//   handleInput(inputType,inputData) {
//     // super.handleInput(inputType,inputData);
//     if (inputType == 'keyup') {
//       if (inputData.key == 'n' || inputData.key == 'N') {
//         this.game.startNewGame();
//         Message.send("New game started");
//         this.game.switchMode('play');
//       }
//       else if (inputData.key == 's' || inputData.key == 'S') {
//         if (this.game.isPlaying) {
//           this.handleSaveGame();
//         }
//       }
//       else if (inputData.key == 'l' || inputData.key == 'L') {
//         if (this.game.hasSaved) {
//           this.handleRestoreGame();
//         }
//       }
//       else if (inputData.key == 'Escape') {
//         if (this.game.isPlaying) {
//           this.game.switchMode('play');
//         }
//       }
//       return false;
//     }
//   }
//
//   handleSaveGame() {
//     if (! this.localStorageAvailable()) {
//       return;
//     }
//     // let serializedGameState = this.game.serialize();
//     window.localStorage.setItem(this.game._PERSISTANCE_NAMESPACE,JSON.stringify(DATASTORE));
//     this.game.hasSaved = true;
//     Message.send("Game saved");
//     this.game.switchMode('play');
//   }
//
//   handleRestoreGame() {
//     if (! this.localStorageAvailable()) {
//       return;
//     }
//     let serializedGameState = window.localStorage.getItem(this.game._PERSISTANCE_NAMESPACE);
//     let savedState = JSON.parse(serializedGameState);
//
//     initializeDatastore();
//
//     // restore game core
//     DATASTORE.GAME = this.game;
//     DATASTORE.ID_SEQ = savedState.ID_SEQ;
//
//     // // restore maps (note: in the future might not instantiate all maps here, but instead build some kind of instantiate on demand)
//     // for (let savedMapId in savedState.MAPS) {
//     //   makeMap(JSON.parse(savedState.MAPS[savedMapId]));
//     // }
//     //
//     // // restore entities
//     // for (let savedEntityId in savedState.ENTITIES) {
//     //   let entState = JSON.parse(savedState.ENTITIES[savedEntityId]);
//     //   EntityFactory.create(entState.templateName,entState);
//     // }
//
//     // restore play state
//     this.game.fromJSON(savedState.GAME);
//
//     Message.send("Game loaded");
//     this.game.switchMode('play');
//   }
//
//   localStorageAvailable() {
//     / : see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
//     try {
//       var x = '__storage_test__';
//       window.localStorage.setItem( x, x);
//       window.localStorage.removeItem(x);
//       return true;
//     }
//     catch(e) {
//       Message.send('Sorry, no local data storage is available for this browser so game save/load is not possible');
//       return false;
//     }
//   }
// }

//-----------------------------------------------------
//-----------------------------------------------------

export class PlayMode extends UIMode {

  render(display){
    display.clear();
    display.drawText(4,4,"GAME IN PROGRESS");
    display.drawText(4,5,"PRESS W TO WIN, L TO LOSE");
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
    display.drawText(4,4,"YOU LOSE. GOOD DAY.");
  }
}

//-----------------------------------------------------
//-----------------------------------------------------

export class WinMode extends UIMode {

  render(display){
    display.clear();
    display.drawText(4,4,"A WINNER IS YOU");
  }
}
