//defines the various mixins that can be added to an Entity
import {Message} from "./message.js";
import {TIME_ENGINE, SCHEDULER} from './timing.js';

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
        this.raiseMixinEvent('bumpEntity', {actor: this, target: targetPositionInfo.entity});
        console.dir(targetPositionInfo);
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

        return true;
      }

      return false;
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
      console.dir(this);
      this.changeHP(evtData.damageAmount);
      evtData.src.raiseMixinEvent('damages', {target: this, damageAmount: evtData.damageAmount});
      if (this.getCurHP() <= 0) {
        this.raiseMixinEvent('defeatedBy', {src: evtData.src});
        evtData.src.raiseMixinEvent('defeats', {target: this});
        this.destroy();
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

      this.raiseMixinEvent('attacks', {actor: this, target: evtData.target});
      evtData.target.raiseMixinEvent('damaged', {src: this, damageAmount: this.getMeleeDamage()});
      console.log("ATTACK");
    }
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
      console.log("help");
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

export let PlayerActor = {
  META: {
    mixinName: 'PlayerActor',
    mixinGroup: 'Actor',
    stateNameSpace: '_PlayerActor',
    stateModel: {
      baseActionDuration: 1000,
      actingState: false,
      currentActionDuration: 1000
    },
    init: function (template) {
      timing.SCHEDULER.add(this,true,1);
    }
  },
  METHODS: {
    getBaseActDur: function() {
      return this.state._PlayerActor.baseActionDuration;
    },
    setBaseActDur: function(n) {
      this.state._PlayerActor.baseActionDuration = n;
    },
    getCurActDur: function() {
      return this.state._PlayerActor.currentActionDuration;
    },
    setCurActDur: function(n){
      this.state._PlayerActor.currentActionDuration = n;
    },
    isActing: function(state) {
      if (state !== undefined) {
        this.state._PlayerActor.actingState = state;
      }
      return this.state._PlayerActor.actingState;
    },
    act: function() {
      if (this.isActing()) {return;}
      this.isActing(true);
      Game.render();
      timing.TIME_ENGINE.lock();
      this.isActing(false);
    }
  },
  LISTENERS: {
    'actionDone': function(evtData) {
        timing.setDuration(this.getCurActDur());
        this.setCurActDur(this.getBaseActDur());
        setTimeout(function() {
          timing.TIME_ENGINE.unlock();
        }, 1);
    },
    'killed': function(evtData) {
      Game.switchMode('lose');
    }

  }
};

export let RandomWalker = {
  META: {
    mixinName: 'RandomWalker',
    mixinGroupName: 'Actor',
    stateNamespace: '_RandomWalker',
    stateModel: {
      baseActionDuration: 1000,
      actingState: false,
      currentActionDuration: 1000
    },
    initialize: function(){
      SCHEDULER.add(this, true, 2);
    }
  },
  METHODS: {
    getBaseActionDuration: function(){
      return this.attr._RandomWalker.baseActionDuration;
    },
    setBaseActionDuration: function(n){
      this.attr._RandomWalker.baseActionDuration = n;
    },
    getCurrentActionDuration: function(){
      return this.attr._RandomWalker.currentActionDuration;
    },
    setCurrentActionDuration: function(n){
      this.attr._RandomWalker.currentActionDuration = n;
    },

    isActing: function(state){
      if(state){
        this.attr._RandomWalker.actingState = state;
      }
      return this.attr._RandomWalker.actingState;
    },
    act: function(){
      if(this.isActing()){
        return;
      }
      console.log("walker is acting");
      this.isActing(true);
      TIME_ENGINE.lock();
      //Rand number from -1 to 1
      console.log("walker has locked");
      let dx = Math.trunc(ROT.RNG.getUniform() * 3) - 1;
      let dy = Math.trunc(ROT.RNG.getUniform() * 3) - 1;
      this.raiseMixinEvent('walkAttempt', {'dx': dx, 'dy': dy});
      SCHEDULER.setDuration(this.getBaseActionDuration());
      this.setBaseActionDuration(this.getBaseActionDuration()); //get random int
      TIME_ENGINE.unlock();
      this.isActing(false);
      console.log("walker is done acting");
    }
  },
  LISTENERS: {
    killed: function(evtData){
      Message.send(this.getName() + " died");
      SCHEDULER.remove(this);
    }
  }
};
