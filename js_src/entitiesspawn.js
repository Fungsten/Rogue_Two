import {Entity} from './entity.js';
import {Factory} from './factory.js';

export let EntityFactory = new Factory(Entity, 'ENTITIES');
// export let ENTITIES = {};
EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#0e2',
  'faction': 'player',
  'maxHP': 100,
  'maxAE': 100,
  'meleeDamage': 10,
  'str': 1,
  'per': 1,
  'end': 1,
  'crm': 1,
  'int': 1,
  'agi': 1,
  'luk': 1,
  'level': 0,
  'yield': 1,
  'mixinName': ['TimeTracker', 'WalkerCorporeal', 'HitPoints', 'Aether', 'MeleeAttacker', 'PlayerMessages', 'PlayerActor', 'Special', 'Experience']
});

EntityFactory.learn({
  'name': 'Brady',
  'chr': 'B',
  'fg': '#eb4',
  'faction': 'neutrals',
  'maxHP': 10,
  'maxAE': 100,
  'meleeDamage' : 10,
  'str': 1,
  'per': 1,
  'end': 1,
  'crm': 1,
  'int': 1,
  'agi': 1,
  'luk': 1,
  'level': 0,
  'yield': 10,
  'mixinName': ['TimeTracker', 'WalkerCorporeal', 'HitPoints', 'Aether', 'MeleeAttacker', 'RandomWalker', 'NPCMessages', 'Special', 'Experience']
});

EntityFactory.learn({
  'name': 'Jar Jar',
  'chr': 'J',
  'fg': '#c00',
  'faction': 'criminal',
  'maxHP': 100,
  'maxAE': 100,
  'meleeDamage' : 10,
  'str': 1,
  'per': 1,
  'end': 1,
  'crm': 1,
  'int': 1,
  'agi': 1,
  'luk': 1,
  'level': 0,
  'yield': 10,
  'mixinName': ['TimeTracker', 'WalkerCorporeal', 'HitPoints', 'Aether', 'MeleeAttacker', 'RandomWalker', 'NPCMessages', 'Special', 'Experience']
});
