const EventEmitter = require("events");

class Game extends EventEmitter {

  constructor(options) {
    super();
    this.date = 0;
    this.stage = 0;
    this.players = {};
    this.dead = new Set();
    this.alive = new Set();
  }

  progressStage() {}

  checkVictors() {}

}

module.exports = Game;
