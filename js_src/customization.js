// a database for all the element information

import {Entity} from './entity.js';

export class Customizer {
  constructor() {
    this.hpMul = 1;
    this.aeMul = 1;
    this.strMul = 1;
    this.perMul = 1;
    this.endMul = 1;
    this.crmMul = 1;
    this.intMul = 1;
    this.agiMul = 1;
    this.lukMul = 1;
  }

  changeHpMul(newMul) {
    this.hpMul = newMul;
  }

  changeAeMul(newMul) {
    this.aeMul = newMul;
  }

  changeStrMul(newMul) {
    this.strMul = newMul;
  }

  changePerMul(newMul) {
    this.perMul = newMul;
  }

  changeEndMul(newMul) {
    this.endMul = newMul;
  }

  changeCrmMul(newMul) {
    this.crmMul = newMul;
  }

  changeIntMul(newMul) {
    this.intMul = newMul;
  }

  changeAgiMul(newMul) {
    this.agiMul = newMul;
  }

  changeLukMul(newMul) {
    this.lukMul = newMul;
  }
}

export function customizeChar(num, ent) {
  let mc = new Customizer();

  let con_sol = [21, 25, 27, 29, 30, 39, 42, 48, 50, 51, 57, 58, 59, 60, 62, 63, 65, 66, 67, 68, 69, 70, 72, 81];
  let nob_gas = [2, 10, 18, 36, 54, 86];
  let pre_sol = [31, 32, 44, 45, 46, 47, 49, 52, 75, 76, 77, 78, 79, 83];
  let rad_sol = [43, 61, 85, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103];
  let rea_gas = [1, 7, 8, 17];
  let rea_liq = [35];
  let rea_sol = [3, 11, 12, 15, 19, 20, 37, 38, 53, 55, 56, 87, 88];
  let stu_sol = [5, 6, 13, 14, 22, 23, 26, 28, 40, 41, 64, 71, 73, 74];
  let tox_gas = [9];
  let tox_liq = [80];
  let tox_sol = [4, 16, 24, 33, 34, 82, 84];
  let unk_unk = [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];

  if (num in con_sol) {
    mc.changeHpMul(1.25*1.4);
    mc.changeAeMul(0.75*1.4);
    mc.changeStrMul(1.2);
    mc.changePerMul(0.8*1.2);
    mc.changeEndMul(1.4*1.2);
    mc.changeCrmMul(0.8*1.2);
    //mc.changeIntMul(1);
    mc.changeAgiMul(0.8*0.6);
    mc.changeLukMul(0.6);
    return;
  } else if (num in rad_sol) {
    mc.changeHpMul(1.25*0.75);
    mc.changeAeMul(0.75*1.25);
    mc.changeStrMul(1.2*0.8);
    mc.changePerMul(0.8*0.8);
    mc.changeEndMul(1.4*0.8);
    mc.changeCrmMul(0.8*1.4);
    mc.changeIntMul(1.4);
    mc.changeAgiMul(0.8*1.4);
    mc.changeLukMul(1.6);
    return;
  } else if (num in unk_unk) {
    mc.changeLukMul(Math.ceil(9));
    return;
  } else if (num in pre_sol) {
    mc.changeHpMul(1.25*0.75);
    mc.changeAeMul(0.75*1.2);
    mc.changeStrMul(1.2*0.8);
    mc.changePerMul(0.8);
    mc.changeEndMul(1.4*0.8);
    mc.changeCrmMul(0.8*1.4);
    mc.changeIntMul(1.1);
    mc.changeAgiMul(0.8);
    mc.changeLukMul(1.4);
    return;
  } else if (num in stu_sol) {
    mc.changeHpMul(1.25*2);
    mc.changeAeMul(0.75*0.5);
    mc.changeStrMul(1.2*1.75);
    mc.changePerMul(0.8*0.8);
    mc.changeEndMul(1.4*1.5);
    mc.changeCrmMul(0.8*0.8);
    mc.changeIntMul(0.5);
    mc.changeAgiMul(0.8*0.8);
    //mc.changeLukMul(1);
    return;
  } else if (num in rea_sol) {
    mc.changeHpMul(1.25*0.8);
    mc.changeAeMul(0.75*1.6);
    mc.changeStrMul(1.2);
    mc.changePerMul(0.8*1.2);
    mc.changeEndMul(1.4*0.5);
    mc.changeCrmMul(0.8*1.2);
    mc.changeIntMul(1.2);
    mc.changeAgiMul(0.8);
    mc.changeLukMul(1.2);
    return;
  } else if (num in tox_sol) {
    mc.changeHpMul(1.25);
    mc.changeAeMul(0.75*1.2);
    mc.changeStrMul(1.2);
    mc.changePerMul(0.8*1.4);
    mc.changeEndMul(1.4);
    mc.changeCrmMul(0.8*0.8);
    mc.changeIntMul(1.4);
    mc.changeAgiMul(0.8);
    mc.changeLukMul(0.8);
    return;
  } else if (num in nob_gas) {
    mc.changeHpMul(0.75*0.9);
    mc.changeAeMul(1.25*0.9);
    mc.changeStrMul(0.6*0.9);
    mc.changePerMul(1.4*0.9);
    mc.changeEndMul(0.6*0.9);
    mc.changeCrmMul(1.2*1.5);
    mc.changeIntMul(0.9);
    mc.changeAgiMul(1.2*0.9);
    mc.changeLukMul(2);
    return;
  } else if (num in rea_gas) {
    mc.changeHpMul(0.75*0.8);
    mc.changeAeMul(1.25*1.6);
    mc.changeStrMul(0.6);
    mc.changePerMul(1.4*1.2);
    mc.changeEndMul(0.6*0.5);
    mc.changeCrmMul(1.2*1.5);
    mc.changeIntMul(1.2);
    mc.changeAgiMul(1.2);
    mc.changeLukMul(1.2);
    return;
  } else if (num in rea_liq) {
    mc.changeHpMul(0.8);
    mc.changeAeMul(1.6);
    //mc.changeStrMul(1);
    mc.changePerMul(1.2);
    mc.changeEndMul(0.5);
    mc.changeCrmMul(1.5);
    mc.changeIntMul(1.2);
    //mc.changeAgiMul(1);
    mc.changeLukMul(1.2);
    return;
  } else if (num in tox_gas) {
    mc.changeHpMul(0.75);
    mc.changeAeMul(1.25*1.2);
    mc.changeStrMul(0.6);
    mc.changePerMul(1.4*1.4);
    mc.changeEndMul(0.6);
    mc.changeCrmMul(1.2*0.8);
    mc.changeIntMul(1.4);
    mc.changeAgiMul((1.2);
    mc.changeLukMul(0.8);
    return;
  } else if (num in tox_liq) {
    //mc.changeHpMul(1);
    mc.changeAeMul(1.2);
    //mc.changeStrMul(1);
    mc.changePerMul(1.4);
    //mc.changeEndMul(1);
    mc.changeCrmMul(0.8);
    mc.changeIntMul(1.4);
    //mc.changeAgiMul(1);
    mc.changeLukMul(0.8);
    return;
  }
}
