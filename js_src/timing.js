

import ROT from 'rot-js';

export let SCHEDULER;
export let TIME_ENGINE;

export function initTiming() {
  SCEDULER = new ROT.Scheduler.Action();
  TIME_ENGINE = new ROT.Engine.[](Scheduler);
}
