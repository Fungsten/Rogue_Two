//text
class UIMode {
  constructor() {
    console.log("created "+this.constructor.name);
  }

  enter() {
    console.log("entered "+this.constructor.name);
  } //do something when entering this state
  exit() {
    console.log("exitted "+this.constructor.name);
  } //do something when leaving this state
  handleInput() {
    console.log("handling input for "+this.constructor.name);
  } //take input from user / player
  render(display) {
    console.log("rendering "+this.constructor.name);
    display.drawText(2,2,"rendering "+this.constructor.name);
  } //render
}

export class StartupMode extends UIMode { //defines how an object exists
  constructor() {
    super(); //access the class's parents with super()
  }
}

export class PlayMode extends UIMode {
  constructor() {
    super()
  }
}
//don't need to export parent classes to export subclasses

export class LoseMode extends UIMode {
  constructor() {
    super()
  }
}

export class WinMode extends UIMode {
  constructor() {
    super()
  }
}
