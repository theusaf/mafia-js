const EventEmitter = require("events"),
  {STAGE} = require("./enum"),
  prioritySort = (a, b) => a.priority - b.priority;

class Game extends EventEmitter {

  constructor() {
    super();
    this.date = 0;
    this.stage = STAGE.GAME_START;
    this.players = {};
    this.voteInformation = {};
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
    return list;
  }

  /**
   * positionActions - Executes actions and places actions onto target players.
   * - initial placement. no cancellation/moving/etc has happenned
   */
  positionActions() {
    const actions = this.collectActions();
    for (const action of actions) {
      const positionedActions = action.position();
      positionedActions.forEach(action => target.targetActions.push(action));
    }
  }

  collectPositionedActions() {
    const list = [];
    for (let key in this.players) {
      const player = this.players[key],
        {targetActions:actions} = player;
      for (const action of actions) {
        list.push(action);
      }
    }
    actions.sort(prioritySort);
    return list;
  }

  /**
   * executeActions - The final phase, executes, cancels, moves, and changes states
   */
  executeActions() {
    const ASSUME_ERROR_NUMBER = 500,
      actions = this.collectPositionedActions(),
      alreadyExecutedActions = new Set,
      originalLength = actions.length;
    let index = 0,
      oldLength = actions.length;
    while (index < actions.length) {
      const action = actions[index];
      if (alreadyExecutedActions.has(action)) {index++; continue;}
      action.execute();
      alreadyExecutedActions.add(action);
      if (actions.length !== oldLength) {
        index = 0;
        oldLength = actions.length;
      } else {
        index++;
      }
      if (actions.length >= originalLength + ASSUME_ERROR_NUMBER) {
        throw new RangeError("Detected an infinite loop, check roles which create or cancel actions.");
      }
    }
  }

  checkVictors() {}

}

module.exports = Game;
