//the dialogue object where hopefully entities will grab their words from

export class Dialogue {
  constructor() {
    this.rep = 0,
    this.name = '',
    this.greeting = '',
    this.farewell = '',
    this.talk = '',
  }

  addDialogueLaw() {
    if (this.rep >= 25 && this.rep < 75) {
      this.greeting = "Greetings, peacekeeper.";
      this.farewell = "Have a good day.";
      this.talk = "Perhaps you should find a recruitment office.";
    };
    if (this.rep < 25 && this.rep > -25) {
      this.greeting = "Hello citizen.";
      this.farewell = "Good day, citizen.";
      this.talk = "Carry on."
    };
    if (this.rep >= 75) {
      this.greeting = "The solar system is honored by your presence.";
      this.farewell = "May the Aether be with you.";
      this.talk = "It is always a pleasure speaking with you";
    };
    if (this.rep <= -25 && this.rep > -75) {
      this.greeting = "Where have I seen your face before?";
      this.farewell = "I have my eye on you.";
      this.talk = "Don't do anything suspicious.";
    };
    if (this.rep <= -75) {
      this.greeting = "You of vile villainy! Poodoo!";
      this.farewell = "I should have you arrested.";
      this.talk = "...";
    };
  }
}
