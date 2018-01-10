import * as U from './util.js';
import ROT from 'rot-js';
import {StartupMode, PlayMode, LoseMode, WinMode, PersistenceMode} from './ui_mode.js';
import {Message} from './message.js';
import {DATASTORE} from './datastore.js';

export let Game = {

  display: {
    SPACING: 1.1,
    main: {
      w: 80,
      h: 24,
      o: null
    },
    avatar: {
      w: 20,
      h: 24,
      o: null
    },
    message: {
      w: 100,
      h: 6,
      o: null
    }

  },
  modes: {
    startup: '',
    curMode: '',
    persistence: ''
  },

  init: function() {
    // this._randomSeed = 5 + Math.floor(Math.random()*100000);
    // //this._randomSeed = 76250;
    // console.log("using random seed "+this._randomSeed);
    // ROT.RNG.setSeed(this._randomSeed);
    console.dir(this);

    this.display.main.o = new ROT.Display({
      width: this.display.main.w,
      height: this.display.main.h,
      spacing: this.display.SPACING});

    this.display.avatar.o = new ROT.Display({
     width: this.display.avatar.w,
     height: this.display.avatar.h,
     spacing: this.display.SPACING});

    this.display.message.o = new ROT.Display({
     width: this.display.message.w,
     height: this.display.message.h,
     spacing: this.display.SPACING});

    this.setupModes();

    Message.send("What about the droid attack on the Wookies?");

    this.switchMode("startup");
    console.dir(this);
    // this.switchMode("play");
    // this.switchMode("lose");
    // this.switchMode("win");

    console.log('datastore');
    console.dir(DATASTORE);
  },

  setupModes: function() {
    this.modes.startup = new StartupMode(this);
    this.modes.play = new PlayMode(this);
    this.modes.lose = new LoseMode(this);
    this.modes.win = new WinMode(this);
    this.modes.persistence = new PersistenceMode(this);
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

  setupNewGame: function() {
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderMain();
    this.renderMessage();
  },

  renderMain: function() {
    this.curMode.render(this.display.main.o);
  },

  renderAvatar: function() {
    let d = this.display.avatar.o;
    d.clear();
    for (let i = 0; i < 10; i++) {
      d.drawText(5,i+5,"avatar");
    }
  },

  renderMessage: function() {
    Message.render(this.display.message.o);
  },

  bindEvent: function(eventType) {
      window.addEventListener(eventType, (evt) => {
        this.eventHandler(eventType, evt);
      });
  },

  eventHandler: function(eventType, evt) {
      // When an event is received have the current ui handle it
      if (this.curMode !== null && this.curMode != '') {
        if (this.curMode.handleInput(eventType, evt)) {
          this.render();
          //Message.ageMessages();
        }
      }
  },

  toJSON: function() {
    let json = '';
    console.log("the random seed is " + this._randomSeed);
    json = JSON.stringify({rseed: this._randomSeed});
    return json;
  },

  fromJSON: function(json) {
    let state = JSON.parse(json);
    this._randomSeed = state.rseed;
    console.log("the random seed is " + this._randomSeed);
  }

};







//console.dir(ROT);

//document.write("ROT support status: "+ROT.isSupported()+"<br/>");

//let name = "Bob", time = "today";
//console.log(`Hello ${name}, how are you ${time}?`);
