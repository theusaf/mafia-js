const EventEmitter = require("events"),
  {STAGE, ACTION_TAG} = require("./enum"),
  prioritySort = (a, b) => a.priority - b.priority;

class Game extends EventEmitter {

  constructor() {
    super();
    this.date = 0;
    this.stage = STAGE.GAME_START;
    this.players = {};
    this.voteInformation = {
      votedTarget: null,
      /**
       * @param {Object[]} votes Vote information
       * {
       *   voter: Player,
       *   vote: -1, 0, 1
       * }
       */
      votes: []
    };
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
        if (action.target.effectData.jailed && !action.tags.has(ACTION_TAG.BYPASS_JAIL)) {
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
      positionedActions.forEach(action => action.target.targetActions.push(action));
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
    list.sort(prioritySort);
    return list;
  }

  /**
   * executeActions - The final phase, executes, cancels, moves, and changes states
   */
  executeActions() {
    const ASSUME_ERROR_NUMBER = 500,
      alreadyExecutedActions = new Set,
      originalLength = actions.length;
    let index = 0,
      oldLength = actions.length,
      actions = this.collectPositionedActions();
    while (index < actions.length) {
      const action = actions[index];
      if (alreadyExecutedActions.has(action)) {index++; continue;}
      if (action.isCanceled()) {index++; continue;}
      action.execute();
      alreadyExecutedActions.add(action);
      if (this.collectPositionedActions().length !== oldLength) {
        index = 0;
        actions = this.collectPositionedActions();
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
