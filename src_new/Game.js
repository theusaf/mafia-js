const EventEmitter = require("events"),
  {STAGE} = require("./enum"),
  prioritySort = (a, b) => a.priority - b.priority;

class Game extends EventEmitter {

  constructor(options) {
    super();
    this.date = 0;
    this.stage = STAGE.GAME_START;
    this.players = {};
  }

  progressStage() {}

  /**
   * collectActions - Runs through all players, collecting all actions before executing.
   *
   * @return {Action[]} Sorted list by priority
   */
  collectActions() {
    const list = [];
    for (let key in this.players) {
      const player = this.players[key],
        {actions} = player;
      for (const action of actions) {
        if (action.notPerformed()) {
          continue;
        }
        list.push(action);
      }
    }
    list.sort(prioritySort);
    return list;
  }

  /**
   * positionActions - Executes actions and places actions onto target players.
   * - initial placement. no cancellation/moving/etc has happenned
   */
  positionActions() {
    const actions = this.collectActions();
  }

  /**
   * executeActions - The final phase, executes, cancels, moves, and changes states
   */
  executeActions() {}

  checkVictors() {}

}

module.exports = Game;
