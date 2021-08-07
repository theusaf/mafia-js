const EventEmitter = require("events"),
  {STAGE} = require("./enum");

class Game extends EventEmitter {

  constructor(options) {
    super();
    this.date = 0;
    this.stage = STAGE.GAME_START;
    this._currentPriorityNumber = 0;
    this.players = {};
    this.actions = new Set;
    this.nightMessages = [];
  }

  progressStage() {}

  checkVictors() {}

  getActions() {
    return Array.from(this.actions);
  }

  addAction(action) {
    if (this.stage === CALCULATION) {
      if (action.priority <= this._currentPriorityNumber) {
        throw new RangeError("New action's priority is equal to or higher than creator priority.");
      }
    }
    this.actions.add(action);
  }
  removeAction(action) {
    this.actions.delete(action);
  }

}

module.exports = Game;
