import {Color} from './colors.js'

export class DisplaySymbol {
   constructor(chr, fg, bg) {
     this.chr = chr || ' ';
     this.fg = fg || Color.FG;
     this.bg = bg || Color.BG;

   }

  // getRepresentation() {
  //   return '%c{' + this._fgHexColor + '}%b{' + this._bgHexColor + '}' + this._chr;
  // }
  //
  // drawOn(display, dispX, dispY) {
  //   display.draw(dispX, dispY, this._chr, this._fgHexColor, this._bgHexColor);
  // }

  render(display, console_x, console_y){
    display.draw(console_x, console_y, this.chr, this.fg, this.bg);
  }
}
