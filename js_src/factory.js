// a colonel factory system = objects that create other objects
import {DATASTORE} from './datastore.js';
import {MixableSymbol} from './mixable_symbol.js';
import {DisplaySymbol} from './display_symbol.js';

export class Factory {
  constructor(productClass, datastoreKey) {
    this.productClass = productClass;
    this.knownTemplates = {};
    this.datastoreKey = datastoreKey;

  }


  learn(template) {
    this.knownTemplates[template.templateName ? template.templateName : template.name] = template;
  }

  create(templateName, restorationState) {
    let product = new this.productClass(this.knownTemplates[templateName]);
    if (restorationState) {
      product.fromState(restorationState);
    }

    DATASTORE[this.datastoreKey][product.getID()] = product;

    return product;
  }

}
