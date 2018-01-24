//defines the various mixins that can be added to an Entity
import {Message} from './message.js';
import {TIME_ENGINE, SCHEDULER} from './timing.js';
import ROT from 'rot-js';
import {DATASTORE} from './datastore.js';
import {COMMAND, getInput, setKey} from './keybinds.js';
import {Game} from './game.js';

let _exampleMixin = {
  META: {
    mixinName: 'ExampleMixin',
    mixinGroupName: 'ExampleMixinGroup',
    stateNameSpace: '_ExampleMixin',
    stateModel: {
      foo: 10
    },
    initialize: function() {
      // do any initialization
    }
  },
  METHODS: {
    method1: function(p) {
      // do stuff
      // can access / manipulate this.state._ExampleMixin
    }
  }
};

export let TimeTracker = {
  META: {
    mixinName: 'TimeTracker',
    mixinGroupName: 'Tracker',
    stateNameSpace: '_TimeTracker',
    stateModel: {
      timeTaken: 0
    }
  },
  METHODS: {
    getTime: function() {
      // do stuff
      // can access / manipulate this.state._ExampleMixin
      return this.state._TimeTracker.timeTaken;
    },
    setTime: function(t) {
      // do stuff
      // can access / manipulate this.state._ExampleMixin
      this.state._TimeTracker.timeTaken = t;
    },
    addTime: function(t) {
      // do stuff
      // can access / manipulate this.state._ExampleMixin
      // console.log("trying to add time");
      // console.dir(this);
      // //console.dir(this.state);
      // console.dir(this.mixins[0].META.stateModel.timeTaken);
      this.state._TimeTracker.timeTaken += t;
    }
  },
  LISTENERS: {
    'turnTaken': function(evtData) {
      this.addTime(evtData.timeUsed);
    }
  }
};

export let WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroupName: 'Walker',
  },
  METHODS: {
    tryWalk: function(dx, dy) {
      // do stuff
      // can access / manipulate this.state._ExampleMixin
      let newX = this.state.x*1 + dx*1;
      let newY = this.state.y*1 + dy*1;

      // if (this.getMap().isPositionOpen(newX, newY)){
      //   this.state.x = newX;
      //   this.state.y = newY;
      //   this.getMap().updateEntityPos(this, this.state.x, this.state.y);
      //
      //   this.raiseMixinEvent('turnTaken', {'timeUsed': 1});
      //
      //   return true;
      // }

      // {{get target movement location}}
      // {{get info for target location: tile, entity}}
      let targetPositionInfo = this.getMap().getTargetPositionInfo(newX, newY);
      // {{if entity, bump it}}
      if (targetPositionInfo.entity) {
        if (this.getFaction() != targetPositionInfo.entity.getFaction() || this.getName() == 'avatar') {
          this.raiseMixinEvent('bumpEntity', {actor: this, target: targetPositionInfo.entity});
          // if (this.getName() == 'avatar') {
          // //   // console.log("the player has moved");
          // //   this.raiseMixinEvent('playerHasMoved');
          // }
        }
        // console.dir(targetPositionInfo);

      } else if (targetPositionInfo.tile.isImpassable()) {
        //console.log("the tile is isImpassable");
        this.raiseMixinEvent('walkblocked');
        return false;
      } else {
        //console.log("moving time");
        this.state.x = newX;
        this.state.y = newY;
        this.getMap().updateEntityPos(this, this.state.x, this.state.y);

        this.raiseMixinEvent('turnTaken', {'timeUsed': 1});
        if (this.getName() == 'avatar') {
          // console.log("the player has moved");
          this.setTarget('');
          this.raiseMixinEvent('playerHasMoved');
        }

        return true;
      }

      return false;
    }
  },
  LISTENERS: {
    'tryWalking': function(evtData) {
      // console.log("trying to walk");
      this.tryWalk(evtData.dx, evtData.dy);
    }
  }
};

export let HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroupName: 'HP',
    stateNameSpace: '_HP',
    stateModel: {
      curHP: 0,
      maxHP: 0
    },
    initialize: function(template) {
      // do any initialization
      this.state._HP.maxHP = template.maxHP || 1;
      this.state._HP.curHP = template.curHP || this.state._HP.maxHP;
    }
  },
  METHODS: {
    setHP: function(newHP) {
      this.state._HP.curHP = newHP;
    },

    changeHP: function(delta) {
      if (this.state._HP.curHP <= 0) {return;}
      if (delta < 0) {
        console.log(this.getName() + " has healed " + delta * -1 + " hp!");
      } else {
        console.log(this.getName() + " has lost " + delta * -1 + " hp!");
      }
      this.state._HP.curHP -= delta;
    },

    setMaxHP: function(newMax) {
      this.state._HP.maxHP = newMax;
    },

    getCurHP: function(curr) {
      return this.state._HP.curHP;
    },

    getMaxHP: function(max) {
      return this.state._HP.maxHP;
    }
  },
  LISTENERS: {
    'damaged': function(evtData) {
      // evtData.src
      // evtData.damageAmount
      console.log("damaging");
      // console.dir(this);
      this.changeHP(evtData.damageAmount);
      evtData.src.raiseMixinEvent('damages', {target: this, damageAmount: evtData.damageAmount});
      if (this.getCurHP() <= 0) {
        if (this.getName() != 'avatar') {
          this.raiseMixinEvent('defeatedBy', {src: evtData.src});
          evtData.src.raiseMixinEvent('defeats', {target: this});
          this.destroy();
        } else {
          Game.switchMode('lose');
        }
      }
    },
    'levelUp': function() {
      this.setMaxHP(this.getMaxHP() + 2);
      this.setHP(this.getMaxHP());
    },
    'turnTaken': function(evtData) {
      if (this.getCurHP() < this.getMaxHP()) {
        this.changeHP(evtData.timeUsed * -1);
      }
    }
  }

};

export let Aether = {
  META: {
    mixinName: 'Aether',
    mixinGroupName: 'AE',
    stateNameSpace: '_AE',
    stateModel: {
      curAE: 0,
      maxAE: 0
    },
    initialize: function(template) {
      // do any initialization
      this.state._AE.maxAE = template.maxAE || 1;
      this.state._AE.curAE = template.curAE || this.state._AE.maxAE;
    }
  },
  METHODS: {
    setAE: function(newAE) {
      this.state._AE.curAE = newAE;
    },

    changeAE: function(delta) {
      if (this.state._AE.curAE) {return;}
      this.state._AE.curAE += delta;
    },

    setMaxAE: function(newMax) {
      this.state._AE.maxAE = newMax;
    },

    getCurAE: function(curr) {
      return this.state._AE.curAE;
    },

    getMaxAE: function(max) {
      return this.state._AE.maxAE;
    }
  },
  LISTENERS: {
    'levelUp': function() {
      this.setMaxAE(Math.ceil(this.getMaxAE() * 1.01));
      this.setAE(this.getMaxAE());
    },
    'turnTaken': function(evtData) {
      if (this.getCurAE() < this.getMaxAE()) {
        this.changeAE(evtData.timeUsed);
      }
    }
  }
};

export let MeleeAttacker = {
  META: {
    mixinName: 'MeleeAttacker',
    mixinGroupName: 'MeleeAttacker',
    stateNameSpace: '_MeleeAttacker',
    stateModel: {
      meleeDamage: 10
    },
    initialize: function(template) {
      // do any initialization
      this.state._MeleeAttacker.meleeDamage = template.meleeDamage || 1;
    }
  },
  METHODS: {
    getMeleeDamage: function() {
      return this.state._MeleeAttacker.meleeDamage;
    },
    setMeleeDamage: function(n) {
      this.state._MeleeAttacker.meleeDamage = n;
    }
  },
  LISTENERS: {
    'bumpEntity': function(evtData) {
      // this
      // evtData.target

      // this.raiseMixinEvent('attacks', {actor: this, target: evtData.target});
      // this.raiseMixinEvent('turnTaken', {'timeUsed': 1});
      // evtData.target.raiseMixinEvent('damaged', {src: this, damageAmount: this.getMeleeDamage()});
      // console.log("ATTACK");
      if (this.getName() == 'avatar' && evtData.target.getName() != 'Door') {
        this.state.bumped = true;
        this.setTarget(evtData.target);

        Message.send("What would you like to do to " + evtData.target.getName() + "?\n" +
                      "1. Interact \n" +
                      "2. Attack \n" +
                      "3. Steal \n" +
                      "4. Bluff \n" +
                      "m. Cancel");
        // this.handleInput(eventType,evt);
      } else if (this.getName() == 'avatar' && evtData.target.getName() == 'Door') {
        Message.send("You've found the door \n" +
                      "1. Enter \n" +
                      "m. Cancel \n");
      } else {
        this.raiseMixinEvent('attacks', {actor: this, target: evtData.target});
        this.raiseMixinEvent('turnTaken', {'timeUsed': 0});
        evtData.target.raiseMixinEvent('damaged', {src: this, damageAmount: this.getMeleeDamage()});
      }
    },
  }
};

export let PlayerMessages = {
  META: {
    mixinName: 'PlayerMessages',
    mixinGroupName: 'PlayerMessages',
    stateNameSpace: '_PlayerMessages',
  },
  LISTENERS: {
    'walkblocked': function(evtData) {
      // console.log("help");
      Message.send("The way is blocked.");
    },
    'attacks': function(evtData) {
      Message.send(this.getName() + " attacks " + evtData.target.getName() +"!");
    },
    'damages': function(evtData) {
      Message.send("" + this.getName() + " attacks " + evtData.target.getName() + " for " + evtData.damageAmount + " damage!");
    },
    'defeats': function(evtData) {
      Message.send(this.getName() + " has defeated " + evtData.target.getName() + "!");
    },
    'defeatedBY': function(evtData) {
      Message.send(this.getName() + " has been defeated by " + evtData.src.getName() + "!");
    }
  }
};

export let NPCMessages = {
  META: {
    mixinName: 'NPCMessages',
    mixinGroupName: 'NPCMessages',
    stateNameSpace: '_NPCMessages',
  },
  LISTENERS: {
    'attacks': function(evtData) {
      Message.send(this.getName() + " attacks " + evtData.target.getName() +"!");
    },
    'damages': function(evtData) {
      Message.send("" + this.getName() + " attacks " + evtData.target.getName() + " for " + evtData.damageAmount + " damage!");
    },
    'defeats': function(evtData) {
      Message.send(this.getName() + " has defeated " + evtData.target.getName() + "!");
    },
    'defeatedBY': function(evtData) {
      Message.send(this.getName() + " has been defeated by " + evtData.src.getName() + "!");
    }
  }
};

export let PlayerActor = {
  META: {
    mixinName: 'PlayerActor',
    mixinGroup: 'Actor',
    stateNameSpace: '_PlayerActor',
    stateModel: {
      actingState: true,
    },
    initialize: function (template) {
      console.log("PlayerActor initialized");
      SCHEDULER.add(this, true);
    }
  },
  METHODS: {
    act: function() {
      this.actingState = false;
      console.log("it is now the enemy turn");
      // console.log(SCHEDULER.next());
      for (let ent in DATASTORE.ENTITIES)
      {
        SCHEDULER.next().raiseMixinEvent('enemyTurn');
      }
    }
  },
  LISTENERS: {
    'killed': function(evtData) {
      Game.switchMode('lose');
    },
    'playerHasMoved': function() {
      this.act();
    },
    'playerTurn': function() {
       // this.raiseMixinEvent('tryWalk')
    }
  }
};

export let RandomWalker = {
  META: {
    mixinName: 'RandomWalker',
    mixinGroupName: 'Actor',
    stateNamespace: '_RandomWalker',
    stateModel: {
      actingState: false,
    },
    initialize: function(template){
      console.log("RandomWalker initialized");
      SCHEDULER.add(this, true);
    }
  },
  METHODS: {
    act: function(){
      //console.log("enemy now moving");
      if(this.actingState == false){
        return;
      }
      //console.log("walker is acting");
      //Rand number from -1 to 1
      let dx = ROT.RNG.getUniformInt(-1, 1);
      //console.log(dx);
      let dy = ROT.RNG.getUniformInt(-1, 1);
      if (dx == 0 && dy == 0) {
        dy = 1;
      }
      //console.log(dy);
      this.raiseMixinEvent('tryWalking', {'dx': dx, 'dy': dy});
      this.actingState = false;
      this.raiseMixinEvent('playerTurn');
    }
  },
  LISTENERS: {
    defeats: function(evtData){
      // Message.send(this.getName() + " died");
      SCHEDULER.remove(this);
      // this.destroy();
    },
    'enemyTurn': function() {
      this.actingState = true;
      //console.log(this.actingState);
      this.act();
    }
  }
};

export let Special = {
  META: {
    mixinName: 'Special',
    mixinGroupName: 'SP',
    stateNameSpace: '_SP',
    stateModel: {
      str: 0,
      per: 0,
      end: 0,
      crm: 0,
      int: 0,
      agi: 0,
      luk: 0,
    },
    initialize: function(template) {
      // do any initialization
      this.state._SP.str = template.str || 1;
      this.state._SP.per = template.per || 1;
      this.state._SP.end = template.end || 1;
      this.state._SP.crm = template.crm || 1;
      this.state._SP.int = template.int || 1;
      this.state._SP.agi = template.agi || 1;
      this.state._SP.luk = template.luk || 1;
    }
  },
  METHODS: {
    setSTR: function(newSTR) {
      this.state._SP.str = newSTR;
    },

    changeSTR: function(delta) {
      if (this.state._SP.str + delta <= 0) {
        this.state._SP.str = 0;
      } else {
        this.state._SP.str += delta;
      }
    },
    changePER: function(delta) {
      if (this.state._SP.per + delta <= 0) {
        this.state._SP.per = 0;
      } else {
        this.state._SP.per += delta;
      }
    },
    changeEND: function(delta) {
      if (this.state._SP.end + delta <= 0) {
        this.state._SP.end = 0;
      } else {
        this.state._SP.end += delta;
      }
    },
    changeCRM: function(delta) {
      if (this.state._SP.crm + delta <= 0) {
        this.state._SP.crm = 0;
      } else {
        this.state._SP.crm += delta;
      }
    },
    changeINT: function(delta) {
      if (this.state._SP.int + delta <= 0) {
        this.state._SP.int = 0;
      } else {
        this.state._SP.int += delta;
      }
    },
    changeAGI: function(delta) {
      if (this.state._SP.agi + delta <= 0) {
        this.state._SP.agi = 0;
      } else {
        this.state._SP.agi += delta;
      }
    },
    changeLUK: function(delta) {
      if (this.state._SP.luk + delta <= 0) {
        this.state._SP.luk = 0;
      } else {
        this.state._SP.luk += delta;
      }
    },

    getSTR: function() {
      return this.state._SP.str;
    },
    getPER: function() {
      return this.state._SP.per;
    },
    getEND: function() {
      return this.state._SP.end;
    },
    getCRM: function() {
      return this.state._SP.crm;
    },
    getINT: function() {
      return this.state._SP.int;
    },
    getAGI: function() {
      return this.state._SP.agi;
    },
    getLUK: function() {
      return this.state._SP.luk;
    },
  },
  LISTENERS: {
    'levelUp': function() {
      this.changeSTR(1);
      this.changePER(1);
      this.changeEND(1);
      this.changeCRM(1);
      this.changeINT(1);
      this.changeAGI(1);
      this.changeLUK(1);
    }
  }
};

export let Experience = {
  META: {
    mixinName: 'Experience',
    mixinGroupName: 'Experience',
    stateNameSpace: '_Exp',
    stateModel: {
      level: 0,
      currExp: 0,
      nextExp: 10,
      yield: 10
    },
    initialize: function(template) {
      this.state._Exp.level = template.level || 0;
      this.state._Exp.yield = template.yield * (this.state._Exp.level + 1) || 1;
    }
  },
  METHODS: {
    getLevel: function() {
      return this.state._Exp.level;
    },
    getCurrExp: function() {
      return this.state._Exp.currExp;
    },
    getNextExp: function() {
      return this.state._Exp.nextExp;
    },
    gainExp: function(exp) {
      this.state._Exp.currExp += exp;
      while (this.state._Exp.currExp >= this.state._Exp.nextExp) {
        this.state._Exp.currExp -= this.state._Exp.nextExp;
        this.state._Exp.level += 1;
        this.state._Exp.nextExp = Math.ceil(this.state._Exp.nextExp * 1.2);
        this.state._Exp.yield = this.state._Exp.yield * this.state._Exp.level;
        this.raiseMixinEvent('levelUp');
      }
    },
    getYield: function() {
      return this.state._Exp.yield;
    }
  },
  LISTENERS: {
    'defeats': function(evtData) {
      this.gainExp(evtData.target.getYield());
    }
  }
};

export let Currency = {
  META: {
    mixinName: 'Currency',
    mixinGroupName: 'Currency',
    stateNameSpace: '_Currency',
    stateModel: {
      money: 10
    },
    initialize: function(template) {
      this.state._Currency = template.money || 10;
    }
  },
  METHODS: {
    getMoney: function() {
      return this.state._Currency;
    },
    getMoreMoney: function(n) {
      this.state._Currency += n;
    }
  },
  LISTENERS: {
    'defeats': function(evtData) {
      this.getMoreMoney(evtData.target.getYield());
    }
  }
};
