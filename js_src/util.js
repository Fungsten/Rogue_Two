export function utilAlert() {
  document.write("this is a util function<br/>");
}

export function existentialCrisis() {
  console.log("please work or else this will be the end of me");
}

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
