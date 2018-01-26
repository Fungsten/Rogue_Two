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
      return this.state._TimeTracker.timeTaken;
    },
    setTime: function(t) {
      this.state._TimeTracker.timeTaken = t;
    },
    addTime: function(t) {
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
      let newX = this.state.x*1 + dx*1;
      let newY = this.state.y*1 + dy*1;

      // {{get target movement location}}
      // {{get info for target location: tile, entity}}
      let targetPositionInfo = this.getMap().getTargetPositionInfo(newX, newY);
      // {{if entity, bump it}}
      if (targetPositionInfo.entity) {
        if (this.getFaction() != targetPositionInfo.entity.getFaction() || this.getName() == 'avatar') {
          this.raiseMixinEvent('bumpEntity', {actor: this, target: targetPositionInfo.entity});
        }
      } else if (targetPositionInfo.tile.isImpassable()) {
        this.raiseMixinEvent('walkblocked');
        return false;
      } else {
        this.state.x = newX;
        this.state.y = newY;
        this.getMap().updateEntityPos(this, this.state.x, this.state.y);

        this.raiseMixinEvent('turnTaken', {'timeUsed': 1});
        if (this.getName() == 'avatar') {
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
      this.state._HP.maxHP = template.maxHP || 1;
      this.state._HP.curHP = template.curHP || this.state._HP.maxHP;
      this.state._HP.hpMul = 1;
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
    },

    setHPMul: function(newMul) {
      this.state._HP.hpMul = newMul;
    },

    getHPMul: function() {
      return this.state._HP.hpMul;
    }
  },
  LISTENERS: {
    'damaged': function(evtData) {
      // evtData.src
      // evtData.damageAmount
      console.log("damaging");
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
      this.setMaxHP(Math.ceil(this.getMaxHP() * this.getHPMul()));
      this.setHP(this.getMaxHP());
      if (this.getName() =='avatar') {
        Message.send("Leveled up!");
      }
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
      this.state._AE.maxAE = template.maxAE || 1;
      this.state._AE.curAE = template.curAE || this.state._AE.maxAE;
      this.state._AE.AEMul = 1;
    }
  },
  METHODS: {
    setAE: function(newAE) {
      this.state._AE.curAE = newAE;
    },

    changeAE: function(delta) {
      // if (this.state._AE.curAE) {return;}
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
    },

    setAEMul: function(newMul) {
      this.state._AE.AEMul = newMul;
    },

    getAEMul: function() {
      return this.state._AE.AEMul;
    }
  },
  LISTENERS: {
    'levelUp': function() {
      this.setMaxAE(Math.ceil(this.getMaxAE() * this.getAEMul()));
      this.setAE(this.getMaxAE());
    },
    'turnTaken': function(evtData) {
      if (this.getCurAE() < this.getMaxAE()) {
        this.changeAE(evtData.timeUsed);
      }
    },
    'attackUsed': function() {
      if (this.getCurAE() > 10) {
        this.changeAE(-10);
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
      this.state._MeleeAttacker.meleeDamage = template.meleeDamage || 1;
    }
  },
  METHODS: {
    getMeleeDamage: function() {
      return this.state._MeleeAttacker.meleeDamage;
    },
    setMeleeDamage: function(n) {
      this.state._MeleeAttacker.meleeDamage = n;
    },

  },
  LISTENERS: {
    'bumpEntity': function(evtData) {
      if (this.getName() == 'avatar' && evtData.target.getName() != 'Door') {
        this.setTarget(evtData.target);

        Message.send("What would you like to do to " + evtData.target.getName() + "?\n" +
                      "1. Interact \n" +
                      "2. Attack \n" +
                      "3. Steal \n" +
                      "4. Bluff \n" +
                      "m. Cancel");
      } else if (this.getName() == 'avatar' && evtData.target.getName() == 'Door') {
        this.setTarget(evtData.target);

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
      if(this.actingState == false){
        return;
      }
      //Rand number from -1 to 1
      let dx = ROT.RNG.getUniformInt(-1, 1);
      let dy = ROT.RNG.getUniformInt(-1, 1);
      if (dx == 0 && dy == 0) {
        dy = 1;
      }
      this.raiseMixinEvent('tryWalking', {'dx': dx, 'dy': dy});
      this.actingState = false;
      this.raiseMixinEvent('playerTurn');
    }
  },
  LISTENERS: {
    defeats: function(evtData){
      SCHEDULER.remove(this);
    },
    'enemyTurn': function() {
      this.actingState = true;
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
      strMul: 0,
      per: 0,
      perMul: 0,
      end: 0,
      endMul: 0,
      crm: 0,
      crmMul: 0,
      int: 0,
      intMul: 0,
      agi: 0,
      agiMul: 0,
      luk: 0,
      lukMul: 0,
    },
    initialize: function(template) {
      this.state._SP.str = template.str || 1;
      this.state._SP.strMul = 1;
      this.state._SP.per = template.per || 1;
      this.state._SP.perMul = 1;
      this.state._SP.end = template.end || 1;
      this.state._SP.endMul = 1;
      this.state._SP.crm = template.crm || 1;
      this.state._SP.crmMul = 1;
      this.state._SP.int = template.int || 1;
      this.state._SP.intMul = 1;
      this.state._SP.agi = template.agi || 1;
      this.state._SP.agiMul = 1;
      this.state._SP.luk = template.luk || 1;
      this.state._SP.lukMul = 1;
    }
  },
  METHODS: {
    setSTR: function(newSTR) {
      this.state._SP.str = newSTR;
    },

    getSTR: function() {
      return this.state._SP.str;
    },

    setSTRMul: function(newMul) {
      this.state._SP.strMul = newMul;
    },

    getSTRMul: function() {
      return this.state._SP.strMul;
    },

    changeSTR: function(delta) {
      if (this.state._SP.str + delta <= 0) {
        this.state._SP.str = 0;
      } else {
        this.state._SP.str += Math.ceil(delta*this.getSTRMul());
      }
    },

    setPER: function(newPER) {
      this.state._SP.per = newPER;
    },

    getPER: function() {
      return this.state._SP.per;
    },

    setPERMul: function(newMul) {
      this.state._SP.perMul = newMul;
    },

    getPERMul: function() {
      return this.state._SP.perMul;
    },

    changePER: function(delta) {
      if (this.state._SP.per + delta <= 0) {
        this.state._SP.per = 0;
      } else {
        this.state._SP.per += Math.ceil(delta*this.getPERMul());
      }
    },

    setEND: function(newEND) {
      this.state._SP.end = newEND;
    },

    getEND: function() {
      return this.state._SP.end;
    },

    setENDMul: function(newMul) {
      this.state._SP.endMul = newMul;
    },

    getENDMul: function() {
      return this.state._SP.endMul;
    },

    changeEND: function(delta) {
      if (this.state._SP.end + delta <= 0) {
        this.state._SP.end = 0;
      } else {
        this.state._SP.end += Math.ceil(delta*this.getENDMul());
      }
    },

    setCRM: function(newCRM) {
      this.state._SP.crm = newCRM;
    },

    getCRM: function() {
      return this.state._SP.crm;
    },

    setCRMMul: function(newMul) {
      this.state._SP.crmMul = newMul;
    },

    getCRMMul: function() {
      return this.state._SP.crmMul;
    },

    changeCRM: function(delta) {
      if (this.state._SP.crm + delta <= 0) {
        this.state._SP.crm = 0;
      } else {
        this.state._SP.crm += Math.ceil(delta*this.getCRMMul());
      }
    },

    setINT: function(newINT) {
      this.state._SP.int = newINT;
    },

    getINT: function() {
      return this.state._SP.int;
    },

    setINTMul: function(newMul) {
      this.state._SP.intMul = newMul;
    },

    getINTMul: function() {
      return this.state._SP.intMul;
    },

    changeINT: function(delta) {
      if (this.state._SP.int + delta <= 0) {
        this.state._SP.int = 0;
      } else {
        this.state._SP.int += Math.ceil(delta*this.getINTMul());
      }
    },

    setAGI: function(newAGI) {
      this.state._SP.agi = newAGI;
    },

    getAGI: function() {
      return this.state._SP.agi;
    },

    setAGIMul: function(newMul) {
      this.state._SP.agiMul = newMul;
    },

    getAGIMul: function() {
      return this.state._SP.agiMul;
    },

    changeAGI: function(delta) {
      if (this.state._SP.agi + delta <= 0) {
        this.state._SP.agi = 0;
      } else {
        this.state._SP.agi += Math.ceil(delta*this.getAGIMul());
      }
    },

    setLUK: function(newLUK) {
      this.state._SP.luk = newLUK;
    },

    getLUK: function() {
      return this.state._SP.luk;
    },

    setLUKMul: function(newMul) {
      this.state._SP.lukMul = newMul;
    },

    getLUKMul: function() {
      return this.state._SP.lukMul;
    },

    changeLUK: function(delta) {
      if (this.state._SP.luk + delta <= 0) {
        this.state._SP.luk = 0;
      } else {
        this.state._SP.luk += Math.ceil(delta*this.getLUKMul());
      }
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
      this.state._CurrMul = 1;
    }
  },
  METHODS: {
    getMoney: function() {
      return this.state._Currency;
    },
    getMoreMoney: function(n) {
      this.state._Currency += n;
    },
    setCurrMul: function(newMul) {
      this.state._CurrMUl = newmul;
    },
    getCurrMul: function() {
      return this.state._CurrMul;
    }
  },
  LISTENERS: {
    'defeats': function(evtData) {
      this.getMoreMoney(Math.ceil(evtData.target.getYield()*this.getCurrMul()));
    }
  }
}
