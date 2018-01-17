import {Entity} from './entity.js';
import {Factory} from './factory.js';

export let EntityFactory = new Factory(Entity, 'ENTITIES');
// export let ENTITIES = {};
EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#eb4',
  'maxHP': 100,
  'maxAE': 100,
  'meleeDamage': 10,
  'mixinName': ['TimeTracker', 'WalkerCorporeal', 'HitPoints', 'Aether', 'MeleeAttacker', 'PlayerMessages']
});

EntityFactory.learn({
  'name': 'Brady',
  'chr': 'B',
  'fg': '#eb4',
  'maxHP': 20,
  'maxAE': 100,
  'mixinName': ['TimeTracker', 'WalkerCorporeal', 'HitPoints', 'Aether']
});
