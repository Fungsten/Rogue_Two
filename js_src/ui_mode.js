//text
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
    display.drawText(6,33,"Press any key to continue");
  }

  handleInput(eventType, evt) {
    if (eventType == "keyup") {
      console.dir(this);
      this.game.switchMode('play');
      return true;
    }
  }
}

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

export class LoseMode extends UIMode {

  render(display){
    display.clear();
    display.drawText(4,4,"YOU LOSE. GOOD DAY.");
  }
}

export class WinMode extends UIMode {

  render(display){
    display.clear();
    display.drawText(4,4,"A WINNER IS YOU");
  }
}
