// but will it blend?

import {DisplaySymbol} from './display_symbol.js';
import * as E from './entity_mixins.js';

export class MixableSymbol extends DisplaySymbol {
  constructor(template) {
    super(template);
    if (! this.state) { this.state = {}; } //potentially must change to entState

    this.mixins = [];
    this.mixinTracker = {};

    if (template.mixinName) {
      for (let mi = 0; mi < template.mixinName.length; mi++) {
        this.mixins.push(E[template.mixinName[mi]]);
        this.mixinTracker[template.mixinName[mi]] = true;
      }
    }

    for (let mi = 0; mi < this.mixins.length; mi++) {
      //this is where the fun begins
      let m = this.mixins[mi];
      if (m.META.stateNameSpace) {
        // console.log('setting up mixin state of '+m.META.stateNameSpace);
        this.state[m.META.stateNameSpace] = {};

        if (m.META.stateModel) {
          for (let sbase in m.META.stateModel) {
            this.state[m.META.stateNameSpace][sbase] = m.META.stateModel[sbase];
            // what about the deep copy command on the base?
          }
        }
      }

      if (m.METHODS) {
        for (let method in m.METHODS) {
          this[method] = m.METHODS[method];
        }
      }
    }

    for (let mi = 0; mi < this.mixins.length; mi++) {
      let m = this.mixins[mi];
      if (m.META.initialize) {
        m.META.initialize.call(this, template);
      }
    }
  }

  raiseMixinEvent(evtLabel, evtData) {
    for (let mi = 0; mi < this.mixins.length; mi++) {
      let m = this.mixins[mi];
      if (m.LISTENERS && m.LISTENERS[evtLabel]) {
        m.LISTENERS[evtLabel].call(this, evtData);
      }
    }
  }
}
