// a base for UI modes

export class UIMode {
  constructor(gameRef) {
    this.game = gameRef;
    this.display = this.game.getDisplay("main");
    this.overlay = null;
  }

  enter() {
    console.log(`Entering ${this.constructor.name}`);
    this.bindComm();
  }

  bindComm(){}

  exit() {
    console.log(`Exitting ${this.constructor.name}`);
  }

  isLayer() {
    return false;
  }

  render() {
    console.log(`Rendering ${this.constructor.name}`);
  }

  renderAvatar(display) {return;}

  handleInput(eventType, evt) {
    console.log(`${this.constructor.name} is handling input`);
    UIMode.dumpInput(eventType, evt);
    return false;
  }

  static dumpInput(eventType, evt) {
    console.log(`inputType: ${inputType}`);
    console.log('inputData:');
    console.dir(inputData);
  }

  toJSON() {}
  fromJSON() {}
}
