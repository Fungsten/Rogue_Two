// a database for all the element information

import {Entity} from './entity.js';

export function customizeChar(num, avatar) {
  console.log('in customize');
  console.log('num = ' + num);

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

  if (con_sol.includes(num)) {
    console.log('in con_sol');
    avatar.setHPMul(1.25*1.4);
    avatar.setAEMul(0.75*1.4);
    avatar.setSTRMul(1.2);
    avatar.setPERMul(0.8*1.2);
    avatar.setENDMul(1.4*1.2);
    avatar.setCRMMul(0.8*1.2);
    //avatar.setINTMul(1);
    avatar.setAGIMul(0.8*0.6);
    avatar.setLUKMul(0.6);
  }
  else if (rad_sol.includes(num)) {
    console.log('in rad_sol');
    avatar.setHPMul(1.25*0.75);
    avatar.setAEMul(0.75*1.25);
    avatar.setSTRMul(1.2*0.8);
    avatar.setPERMul(0.8*0.8);
    avatar.setENDMul(1.4*0.8);
    avatar.setCRMMul(0.8*1.4);
    avatar.setINTMul(1.4);
    avatar.setAGIMul(0.8*1.4);
    avatar.setLUKMul(1.6);
  }
  else if (unk_unk.includes(num)) {
    console.log('in unk_unk');
    avatar.setLUKMul(9);
  }
  else if (pre_sol.includes(num)) {
    console.log('in pre_sol');
    avatar.setHPMul(1.25*0.75);
    avatar.setAEMul(0.75*1.2);
    avatar.setSTRMul(1.2*0.8);
    avatar.setPERMul(0.8);
    avatar.setENDMul(1.4*0.8);
    avatar.setCRMMul(0.8*1.4);
    avatar.setINTMul(1.1);
    avatar.setAGIMul(0.8);
    avatar.setLUKMul(1.4);
  }
  else if (stu_sol.includes(num)) {
    console.log('in stu_sol');
    avatar.setHPMul(1.25*2);
    avatar.setAEMul(0.75*0.5);
    avatar.setSTRMul(1.2*1.75);
    avatar.setPERMul(0.8*0.8);
    avatar.setENDMul(1.4*1.5);
    avatar.setCRMMul(0.8*0.8);
    avatar.setINTMul(0.5);
    avatar.setAGIMul(0.8*0.8);
    //avatar.setLUKMul(1);
  }
  else if (rea_sol.includes(num)) {
    console.log('in rea_sol');
    avatar.setHPMul(1.25*0.8);
    avatar.setAEMul(0.75*1.6);
    avatar.setSTRMul(1.2);
    avatar.setPERMul(0.8*1.2);
    avatar.setENDMul(1.4*0.5);
    avatar.setCRMMul(0.8*1.2);
    avatar.setINTMul(1.2);
    avatar.setAGIMul(0.8);
    avatar.setLUKMul(1.2);
  }
  else if (tox_sol.includes(num)) {
    console.log('in tox_sol');
    avatar.setHPMul(1.25);
    avatar.setAEMul(0.75*1.2);
    avatar.setSTRMul(1.2);
    avatar.setPERMul(0.8*1.4);
    avatar.setENDMul(1.4);
    avatar.setCRMMul(0.8*0.8);
    avatar.setINTMul(1.4);
    avatar.setAGIMul(0.8);
    avatar.setLUKMul(0.8);
  }
  else if (nob_gas.includes(num)) {
    console.log('in nob_gas');
    avatar.setHPMul(0.75*0.9);
    avatar.setAEMul(1.25*0.9);
    avatar.setSTRMul(0.6*0.9);
    avatar.setPERMul(1.4*0.9);
    avatar.setENDMul(0.6*0.9);
    avatar.setCRMMul(1.2*1.5);
    avatar.setINTMul(0.9);
    avatar.setAGIMul(1.2*0.9);
    avatar.setLUKMul(2);
  }
  else if (rea_gas.includes(num)) {
    console.log('in rea_gas');
    avatar.setHPMul(0.75*0.8);
    avatar.setAEMul(1.25*1.6);
    avatar.setSTRMul(0.6);
    avatar.setPERMul(1.4*1.2);
    avatar.setENDMul(0.6*0.5);
    avatar.setCRMMul(1.2*1.5);
    avatar.setINTMul(1.2);
    avatar.setAGIMul(1.2);
    avatar.setLUKMul(1.2);
  }
  else if (rea_liq.includes(num)) {
    console.log('in rea_liq');
    avatar.setHPMul(0.8);
    avatar.setAEMul(1.6);
    //avatar.setSTRMul(1);
    avatar.setPERMul(1.2);
    avatar.setENDMul(0.5);
    avatar.setCRMMul(1.5);
    avatar.setINTMul(1.2);
    //avatar.setAGIMul(1);
    avatar.setLUKMul(1.2);
  }
  else if (tox_gas.includes(num)) {
    console.log('in tox_gas');
    avatar.setHPMul(0.75);
    avatar.setAEMul(1.25*1.2);
    avatar.setSTRMul(0.6);
    avatar.setPERMul(1.4*1.4);
    avatar.setENDMul(0.6);
    avatar.setCRMMul(1.2*0.8);
    avatar.setINTMul(1.4);
    avatar.setAGIMul(1.2);
    avatar.setLUKMul(0.8);
  }
  else if (tox_liq.includes(num)) {
    console.log('in tox_liq');
    //avatar.setHPMul(1);
    avatar.setAEMul(1.2);
    //avatar.setSTRMul(1);
    avatar.setPERMul(1.4);
    //avatar.setENDMul(1);
    avatar.setCRMMul(0.8);
    avatar.setINTMul(1.4);
    //avatar.setAGIMul(1);
    avatar.setLUKMul(0.8);
  }
}
