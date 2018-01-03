import * as U from './util.js';
import ROT from 'rot-js';

export let Game = {

  display: {
    SPACING: 1.1,
    main: {
      w: 80,
      h: 24,
      o: null
    }
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
  },


  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderMain();
    U.existentialCrisis();
  },

  renderMain: function() {
    let d = this.display.main.o;
    for (let i = 0; i < 10; i++) {
      d.drawText(5,i+5,"hello world");
    }
    for (let i = 5; i < 10; i++) {
      d.drawText(11,i+5,"Chewie");
    }
  }

};








//console.dir(ROT);

//document.write("ROT support status: "+ROT.isSupported()+"<br/>");

//let name = "Bob", time = "today";
//console.log(`Hello ${name}, how are you ${time}?`);
