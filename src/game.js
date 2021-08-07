const EventEmitter = require("events");

class Game extends EventEmitter {

  constructor(options) {
    super();
    this.date = 0;
    this.stage = 0;
    this.players = {};
    this.actions = new Set;
    this.nightMessages = [];
  }

  progressStage() {}

  checkVictors() {}

  getActions() {
    return Array.from(this.actions);
  }

  addAction() {}
  removeAction() {}

}

module.exports = Game;
