class Message {
  constructor(content, id, from, to) {
    this.content = content;
    this.id = id;
    this.from = from;
    this.to = to;
    this.displaySender = true;
    this.max = 0;
  }

  setMax(max) {this.max = max; return this;}
  shouldDisplaySender(flag) {this.displaySender = flag; return this;}

}
module.exports = Message;
