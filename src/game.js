const EventEmitter = require("events");

class Game extends EventEmitter {

  constructor(options) {
    super();
    this.date = 0;
    this.stage = 0;
    this.players = {};
  }

  progressStage() {}

  checkVictors() {}

}

module.exports = Game;
