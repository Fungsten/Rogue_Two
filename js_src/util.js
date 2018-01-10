// Some helpful tools
import {DATASTORE} from './datastore';

export function init2DArray(xdim, ydim, initVal) {
  let a = [];
  //console.log(a + " and " + initVal);
  for (let x = 0; x < xdim; x++) {
    a.push([]);
    for (let y = 0; y < ydim; y++) {
      //console.log(xdim);
      a[x].push(initVal);
    }
  }
  return a;
}

let randCharSource = '0123456789qwertyuiopasdfghjklzxcvbnm;'.split('');
export function uniqueID() {
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += randCharSource.random();
  }
  id = `${tag ? tag+'-' : ''}${DATASTORE.ID_SEQ}-${id}`; //DATASTORE.ID_SEQ + '-' + id;
  DATASTORE.ID_SEQ++;
  return id;
}
