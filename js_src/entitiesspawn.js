import {Entity} from './entity.js';
import {Factory} from './factory.js';

export let EntityFactory = new Factory(Entity, 'ENTITIES');
// export let ENTITIES = {};
EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#eb4',
  'mixinName': ['TimeTracker', 'WalkerCorporeal']
});

EntityFactory.learn({
  'name': 'Brady',
  'chr': 'B',
  'fg': '#eb4',
});
