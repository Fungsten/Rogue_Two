// but will it blend?

import {DisplaySymbol} from './display_symbol.js';

export class MixableSymbol extends DisplaySymbol {
  constructor(template) {
    super(template);
    if (! this.entState) { this.entState = {}; }

  }
}
