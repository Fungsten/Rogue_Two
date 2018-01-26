import * as U from './util.js';
import ROT from 'rot-js';
import {StartupMode, PlayMode, LoseMode,PersistenceMode, MessageMode} from './ui_mode.js';
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
      h: 8,
      o: null
    }

  },
  curMode: '',
  modes: {
    startup: '',
    persistence: '',
    play: '',
    messages: '',
    lose: ''
  },

  isPlaying: false,
  hasSaved: false,
  globalAvatar: '',

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
    this.modes.persistence = new PersistenceMode(this);
    //this.modes.messages = new MessageMode(this);
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
    this.modes.customize.chooseElement();

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
    this.curMode.render(this.display.main.o);
  },

  renderAvatar: function() {
    let d = this.display.avatar.o;
    this.curMode.renderAvatar(d);
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
    return this.modes.play.toJSON();
  },

  fromJSON: function(json) {
    this.modes.play.fromJSON(json);
  },

  restoreFromState(stateData){
    this.state = stateData;
  },
};
