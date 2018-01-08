export class Messenger {
  constructor() {
    this.msg = '';
  }

  render(targetDisplay) {
    targetDisplay.clear();
    targetDisplay.drawText(1,1,this.message);
  }

  send(msg) {
    this.message = msg;
  }

  clear() {
      this.message = '';
  }
}

export let Message = new Messenger();
