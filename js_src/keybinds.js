// keybindings

// Some command constants that are populated by setKey
export let COMMAND = { 'NULLCOMMAND': 1 };

export function getInput(eventType, evt){
  if (eventType != 'keyup') { return COMMAND.NULLCOMMAND; }

  let bindingSet = `key:${evt.key}`;

  console.log('binding type');
  console.log(BINDING_TYPE);
  if (!BINDING_TYPE[bindingSet]) {
    return COMMAND.NULLCOMMAND; }
  return BINDING_TYPE[bindingSet];
}

// Used by getInput, dynamically populated by setKey
let BINDING_TYPE = {};

// takes a set name and preps the commands and binding lookups
// later items override earlier ones, allowing a sort of hierarchical binding system
export function setKey(list) {
  // make sure named list exists
  if (typeof list === 'string') {
    list = [list];
  }

  if (list[0] != 'universal') {
    list.unshift('universal');
  }

  let commandNum = 1;
  COMMAND = {
    NULLCOMMAND: commandNum
  };

  BINDING_TYPE = {};

  for (let i = 0; i <list.length; i++){
    let name = list[i];

    if (!KEY_SETS.hasOwnProperty(name)) { return; }

    for (let command in KEY_SETS[name]){
      commandNum++;
      COMMAND[command] = commandNum;

      for (let j = 0; j < KEY_SETS[name][command].length; j++){
        console.log('in third for');
        BINDING_TYPE[KEY_SETS[name][command][j]] = commandNum;
      }
    }
  }
}

let KEY_SETS = {
  'universal': {
    'HELP': ['key:h'],
  },

  'persistence': {
    'NEW_GAME': ['key:n','key:N'],
    'SAVE_GAME': ['key:s','key:S'],
    'LOAD_GAME': ['key:l','key:L'],
    'CANCEL': ['key:Escape'],
  },

  'play': {
    'TO_PERSISTENCE': ['key:Escape'],
    'MESSAGES': ['key:m','key:M'],
  },

  'movement': {
    'U': ['key:w','key:W','key:8','key:ArrowUp'],
    'L': ['key:a','key:A','key:4','key:ArrowLeft'],
    'D': ['key:s','key:S','key:2','key:ArrowDown'],
    'R': ['key:d','key:D','key:6','key:ArrowRight'],
    'UL': ['key:q','key:Q','key:7'],
    'UR': ['key:e','key:E','key:9'],
    'DL': ['key:z','key:Z','key:1'],
    'DR': ['key:c','key:C','key:3'],
    'WAIT': ['key:Space','key:5'],
  },

  'textNav': {
    'LU': ['key:ArrowUp'],
    'LD': ['key:ArrowDown'],
    'PU': ['key:ArrowRight'],
    'PD': ['key:ArrowLeft'],
    'CANCEL': ['key:Escape'],
  }
};
