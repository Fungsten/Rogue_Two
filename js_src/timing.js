

import ROT from 'rot-js';

export let SCHEDULER;
export let TIME_ENGINE;

export function initTiming() {
  SCHEDULER = new ROT.Scheduler.Simple();
  TIME_ENGINE = new ROT.Engine(SCHEDULER);
}
