import * as U from './util.js';
import ROT from 'rot-js';
import {StartupMode, PlayMode, LoseMode, WinMode, PersistenceMode, MessageMode} from './ui_mode.js';
import {Message} from './message.js';
import {DATASTORE, clearDatastore} from './datastore.js';

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
  curModeStack: [],
  modes: {
    startup: '',
    persistence: '',
    play: '',
    messages: '',
    win: '',
    lose: ''
  },

  isPlaying: false,
  hasSaved: false,

  init: function() {
    console.log("Game object:");
    console.dir(Game);

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

    Message.send("A game made by Will & Grace");

    this.switchMode("startup");
    // console.dir(this);

    console.log('datastore');
    console.dir(DATASTORE);
  },

  setupModes: function() {
    this.modes.startup = new StartupMode(this);
    this.modes.play = new PlayMode(this);
    this.modes.lose = new LoseMode(this);
    this.modes.win = new WinMode(this);
    this.modes.persistence = new PersistenceMode(this);
    //this.modes.messages = new MessageMode(this);
  },


  switchMode: function(newModeName) {
    if (this.curModeStack.length > 0) {
      this.delAllUILayers();
      this.curModeStack[0].exit();
    }
    this.curModeStack[0] = this.modes[newModeName];
    if (this.curModeStack[0]) {
      this.curModeStack[0].enter();
      this.render();
    }
  },

  addUILayer: function(layer) {
    this.curModeStack.unshift(layer);
    this.curModeStack[0].enter();
    this.render();
  }

  removeUILayer: function(layer){
    if (this.curModeStack.length > 0 && this.curModeStack[0].isLayer()) {
      this.curModeStack[0].exit();
      this.curModeStack.shift();
    }
    this.render();
  }

  delAllUILayers: function() {
    while (this.curModeStack.length > 0 && this.curModeStack[0].isLayer()) {
      this.removeUILayer;
    }
  }

  startNewGame: function() {
    //this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("new game");
    clearDatastore();
    console.log('datastore');
    console.dir(DATASTORE);
    DATASTORE.GAME = this;
    //console.log("using random seed "+this._randomSeed);
    //ROT.RNG.setSeed(this._randomSeed);
    this.modes.play.setupNewGame();

    // initTiming();
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderAvatar();
    this.renderMain();
    this.renderMessage();
  },

  renderMain: function() {
    this.curModeStack[0].render(this.display.main.o);
  },

  renderAvatar: function() {
    let d = this.display.avatar.o;
    this.curModeStack[0].renderAvatar(d);
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
      if (this.curModeStack[0] !== null && this.curMode != '') {
        if (this.curModeStack[0].handleInput(eventType, evt)) {
          this.render();
          //Message.ageMessages();
        }
      }
  },

  toJSON: function() {
    return this.modes.play.toJSON();
  },

  fromJSON: function(json) {
    this.modes.play.fromJSON(json);
  },

  restoreFromState(stateData){
    this.state = stateData;
  },
};
