const EventEmitter = require("events"),
  Mayor = require("./roles/Mayor"),
  {STAGE, ACTION_TAG, ACTION_EXECUTE} = require("./enum"),
  shuffle = require("./util/shuffle"),
  prioritySort = (a, b) => a.priority - b.priority;

class Game extends EventEmitter {

  constructor() {
    super();
    this.date = 0;
    this.stage = STAGE.GAME_START;
    this.players = {};
    this.voteInformation = {

      /**
       * @param {Player} votedTarget The target that was voted
       */
      votedTarget: null,
      /**
       * @param {Object[]} votes Vote information
       * {
       *   voter: Player,
       *   vote: -1, 0, 1
       * }
       */
      votes: [],
      voteSessionsRemaining: 3
    };
    this.otherInformation = {

      /**
       * @param {Boolean} vampiresCanBite Whether vampires can bite
       */
      vampiresCanBite: true
    };
  }

  repeatAllPlayers(func) {
    for (const player of this.players) {
      func(player);
    }
  }

  /**
   * clearTempData - Clears information (effectData, completed actions, etc) from the players
   */
  clearTempData() {
    this.repeatAllPlayers((player) => {
      player.effectData = {};
      player.role.modifiedStats = {};
      player.actions = [];
      for (const action of player.targetActions) {
        if (action.tags.persistent && !action.isCanceled()) {
          continue;
        }
        player.targetActions.delete(action);
      }
    });
  }

  progressStage() {
    switch (this.stage) {
    case STAGE.GAME_START: {
      this.repeatAllPlayers((player) => player.role.beforeGameSetup());
      this.stage = STAGE.NIGHT;
      this.repeatAllPlayers((player) => player.role.beforeNightSetup());
      break;
    }
    case STAGE.NIGHT: {
      this.stage = STAGE.CALCULATION;
      this.executeActions();
      break;
    }
    case STAGE.CALCULATION: {
      this.repeatAllPlayers((player) => player.role.afterNightSetup());
      this.stage = STAGE.PRE_DISCUSSION;
      break;
    }
    case STAGE.PRE_DISCUSSION: {
      this.clearTempData();
      this.stage = STAGE.DISCUSSION;
      this.checkVictors();
      break;
    }
    case STAGE.DISCUSSION: {
      this.stage = STAGE.VOTING;
      this.voteInformation.voteSessionsRemaining = 3;
      this.votedTarget = null;
      break;
    }
    case STAGE.VOTING: {
      if (this.votedTarget) {
        this.stage = STAGE.VOTE_DEFENSE;
      } else {
        this.stage = STAGE.NIGHT;
        this.repeatAllPlayers((player) => player.role.beforeNightSetup());
      }
      break;
    }
    case STAGE.VOTE_DEFENSE: {
      this.stage = STAGE.VOTE_LYNCH;
      break;
    }
    case STAGE.VOTE_LYNCH: {
      const val = this.voteInformation.votes.reduce((info, value) => {
        const {player, vote} = info;
        if (player.role instanceof Mayor && player.role.additionalInformation.isRevealed) {
          return value + vote * 3;
        } else {
          return value + vote;
        }
      }, 0);
      if (val > 0) {
        this.voteInformation.voteSessionsRemaining--;
        this.stage = STAGE.VOTING;
      } else {
        this.stage = STAGE.NIGHT;
        this.checkVictors();
        if (this.stage !== STAGE.GAME_END) {
          this.repeatAllPlayers((player) => player.role.beforeNightSetup());
        }
      }
      break;
    }}
    this.emit("stageProgress", this.stage);
  }

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
  executeActions(executeAt = ACTION_EXECUTE.NIGHT_END) {
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
      if (action.executeAt !== executeAt) {index++; continue;}
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
        throw new RangeError("Detected an infinite loop, check roles which create or cancel actions.", actions);
      }
    }
  }

  checkVictors() {}

  startGame() {
    if (this.stage === STAGE.GAME_START) {
      const players = [];
      this.repeatAllPlayers((player) => players.push(player));
      shuffle(players, true);
      // create roles!
      

      this.progressStage();
    } else {
      throw new RangeError("Game already started");
    }
  }

}

module.exports = Game;
