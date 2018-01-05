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

  render(display) {
    display.drawText(2,3,"Welcome to ");
display.drawText(2,5,"____    __    ____  __    __       ___   .___________.        ___      .______     ______    __    __  .___________.          ");
display.drawText(2,6,"\\   \\  /  \\  /   / |  |  |  |     /   \\  |           |       /   \\     |   _  \\   /  __  \\  |  |  |  | |           |          ");
display.drawText(3,7," \\   \\/    \\/   /  |  |__|  |    /  ^  \\ `---|  |----`      /  ^  \\    |  |_)  | |  |  |  | |  |  |  | `---|  |----`          ");
display.drawText(4,8,"  \\            /   |   __   |   /  /_\\  \\    |  |          /  /_\\  \\   |   _  <  |  |  |  | |  |  |  |     |  |               ");
display.drawText(5,9,"   \\    /\\    /    |  |  |  |  /  _____  \\   |  |         /  _____  \\  |  |_)  | |  `--'  | |  `--'  |     |  |               ");
display.drawText(6,10,"    \\__/  \\__/     |__|  |__| /__/     \\__\\  |__|        /__/     \\__\\ |______/   \\______/   \\______/      |__|               ");
display.drawText(2,11,"                                                                                                                              ");
display.drawText(2,12,".___________. __    __   _______     _______  .______        ______    __   _______                                           ");
display.drawText(2,13,"|           ||  |  |  | |   ____|   |       \\ |   _  \\      /  __  \\  |  | |       \\                                          ");
display.drawText(2,14,"`---|  |----`|  |__|  | |  |__      |  .--.  ||  |_)  |    |  |  |  | |  | |  .--.  |                                         ");
display.drawText(6,15,"    |  |     |   __   | |   __|     |  |  |  ||      /     |  |  |  | |  | |  |  |  |                                         ");
display.drawText(6,16,"    |  |     |  |  |  | |  |____    |  '--'  ||  |\\  \\----.|  `--'  | |  | |  '--'  |                                         ");
display.drawText(6,17,"    |__|     |__|  |__| |_______|   |_______/ | _| `._____| \\______/  |__| |_______/                                          ");
display.drawText(2,18,"                                                                                                                              ");
display.drawText(7,19,"     ___   .___________.___________.    ___       ______  __  ___      ______   .__   __.    .___________. __    __   _______ ");
display.drawText(6,20,"    /   \\  |           |           |   /   \\     /      ||  |/  /     /  __  \\  |  \\ |  |    |           ||  |  |  | |   ____|");
display.drawText(5,21,"   /  ^  \\ `---|  |----`---|  |----`  /  ^  \\   |  ,----'|  '  /     |  |  |  | |   \\|  |    `---|  |----`|  |__|  | |  |__   ");
display.drawText(4,22,"  /  /_\\  \\    |  |        |  |      /  /_\\  \\  |  |     |    <      |  |  |  | |  . `  |        |  |     |   __   | |   __|  ");
display.drawText(3,23," /  _____  \\   |  |        |  |     /  _____  \\ |  `----.|  .  \\     |  `--'  | |  |\\   |        |  |     |  |  |  | |  |____ ");
display.drawText(2,24,"/__/     \\__\\  |__|        |__|    /__/     \\__\\ \\______||__|\\__\\     \\______/  |__| \\__|        |__|     |__|  |__| |_______|");
display.drawText(2,25,"                                                                                                                              ");
display.drawText(2,26,"____    __    ____  ______     ______    __  ___  __   _______     _______.                                                   ");
display.drawText(2,27,"\\   \\  /  \\  /   / /  __  \\   /  __  \\  |  |/  / |  | |   ____|   /       |                                                   ");
display.drawText(3,28," \\   \\/    \\/   / |  |  |  | |  |  |  | |  '  /  |  | |  |__     |   (----`                                                   ");
display.drawText(4,29,"  \\            /  |  |  |  | |  |  |  | |    <   |  | |   __|     \\   \\                                                       ");
display.drawText(5,30,"   \\    /\\    /   |  `--'  | |  `--'  | |  .  \\  |  | |  |____.----)   |                                                      ");
display.drawText(6,31,"    \\__/  \\__/     \\______/   \\______/  |__|\\__\\ |__| |_______|_______/                                                       ");

  }
}

export class PlayMode extends UIMode {
  constructor() {
    super()
  }

  render(display){
    display.drawText(0,0,"GAME IN PROGRESS");
  }
}
//don't need to export parent classes to export subclasses

export class LoseMode extends UIMode {
  constructor() {
    super()
  }

  render(display){
    display.drawText(3,3,"YOU LOSE. GOOD DAY.");
  }
}

export class WinMode extends UIMode {
  constructor() {
    super()
  }

  render(display){
    display.drawText(3,3,"A WINNER IS YOU");
  }
}
