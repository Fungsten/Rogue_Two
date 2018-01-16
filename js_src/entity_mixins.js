//defines the various mixins that can be added to an Entity

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

// *************************************************************

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
      this.state._TimeTracker.timeTaken += t;
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

      if (this.getMap().isPositionOpen(newX, newY)){
        this.state.x = newX;
        this.state.y = newY;

        this.getMap().updateEntityPos(this, this.state.x, this.state.y);

        this.raiseMixinEvent('turnTaken');

        return true;
      }
      return false;
    }
  }
};
