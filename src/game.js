class Game {

  constructor(options) {
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
