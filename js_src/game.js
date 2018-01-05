import * as U from './util.js';
import ROT from 'rot-js';
import {StartupMode} from './ui_mode.js';
import {PlayMode} from './ui_mode.js';
import {LoseMode} from './ui_mode.js';
import {WinMode} from './ui_mode.js';

export let Game = {

  display: {
    SPACING: 1.1,
    main: {
      w: 150,
      h: 40,
      o: null
    }
  },
  modes: {
    startup: '',
    curMode: ''
  },

  init: function() {
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);

    this.display.main.o = new ROT.Display({
      width: this.display.main.w,
      height: this.display.main.h,
      spacing: this.display.SPACING});

    this.setupModes();

    this.switchMode("startup");
    // this.switchMode("play");
    // this.switchMode("lose");
    // this.switchMode("win");

  },

  setupModes: function() {
    this.modes.startup = new StartupMode(this);
    this.modes.play = new PlayMode(this);
    this.modes.lose = new LoseMode(this);
    this.modes.win = new WinMode(this);
  },


  switchMode: function(newModeName) {
    if (this.curMode) {
      this.curMode.exit();
    }
    this.curMode = this.modes[newModeName];
    if (this.curMode) {
      this.curMode.enter();
    }
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderMain();
    //U.existentialCrisis();
  },

  renderMain: function() {
    console.log("renderMain");

    //if (this.curMode.hasOwnProperty('render')) {
      this.curMode.render(this.display.main.o);
    //}
    // let d = this.display.main.o;
    // for (let i = 0; i < 10; i++) {
    //   d.drawText(5,i+5,"hello world");
    // }
    // for (let i = 5; i < 10; i++) {
    //   d.drawText(11,i+5,"Chewie");
    // }
  },

  bindEvent: function(eventType) {
      window.addEventListener(eventType, (evt) => {
        this.eventHandler(eventType, evt);
      });
  },

  eventHandler: function (eventType, evt) {
      // When an event is received have the current ui handle it
      if (this.curMode !== null && this.curMode != '') {
        if (this.curMode.handleInput(eventType, evt)) {
          this.render();
          //Message.ageMessages();
        }
      }
  }

};







//console.dir(ROT);

//document.write("ROT support status: "+ROT.isSupported()+"<br/>");

//let name = "Bob", time = "today";
//console.log(`Hello ${name}, how are you ${time}?`);
