// a colonel factory system = objects that create other objects
import {DATASTORE} from './datastore.js';

export class Factory {
  constructor(productClass, datastoreKey) {
    this.productClass = productClass;
    this.knownTemplates = {};
    this.datastoreKey = datastoreKey;

  }


  learn(template) {
    this.knownTemplates[template.templateName ? template.templateName : template.name] = template;
  }

  create(templateName) {
    let product = new this.productClass(this.knownTemplates[templateName]);

    DATASTORE[this.datastoreKey][product.getID()] = product;

    return product;
  }

}
