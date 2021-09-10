const EventEmitter = require("events"),
  Mayor = require("./roles/Mayor"),
  Cleaned = require("./roles/other/Cleaned"),
  Player = require("./Player"),
  ENUM = require("./enum"),
  {STAGE, ACTION_TAG, ACTION_EXECUTE, VOTE} = ENUM,
  shuffle = require("./util/shuffle"),
  roles = require("./roles"),
  prioritySort = (a, b) => a.priority - b.priority;

class Game extends EventEmitter {

  constructor(options = {}) {
    super();
    this.options = {
      roles: options.roles ?? roles.roles.filter((role) => !(role === Cleaned)),
      autoPlayThrough: !!options.autoPlayThrough
    };
    this.date = 0;
    this.stage = STAGE.GAME_START;
    this.players = new Set;
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
      vampiresCanBite: true,
      livingPlayersBeforeNight: [],
      killedAtNight: []
    };
  }

  addPlayer(name, id=this.players.size) {
    const dupeCheck = this.getPlayerById(id);
    if (dupeCheck) {throw new RangeError("Provided ID is already taken");}
    const player = new Player(id, name);
    player.game = this;
    this.players.add(player);
  }

  removePlayer(id) {
    const toRemove = this.getPlayerById(id);
    this.players.delete(toRemove);
  }

  getPlayerById(id) {
    for (const player of this.players) {
      if (player.id === id) {return player;}
    }
    return null;
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
        if (action.persistent && !action.isCanceled()) {
          continue;
        }
        if (this.stage !== STAGE.CALCULATION && action.executeAt === ACTION_EXECUTE.NIGHT_START) {
          continue;
        }
        player.targetActions.delete(action);
      }
    });
  }

  beforeNightSetup() {
    this.date++;
    this.clearTempData();
    this.executeActions(ACTION_EXECUTE.NIGHT_START);
    this.repeatAllPlayers((player) => player.role.beforeNightSetup());
    this.repeatAllPlayers((player) => {
      if (player.effectData.jailed) {
        player.actions = player.role.getJailActions();
      } else {
        player.actions = player.role.getNightActions();
      }
    });
  }

  checkVotes() {
    function votesOnPlayer(getPlayer) {
      return this.voteInformation.votes.reduce((info, value) => {
        const {player, vote, target} = info;
        if (target !== getPlayer) {
          return value;
        }
        if (player.role instanceof Mayor && player.role.additionalInformation.isRevealed) {
          return value + vote * 3;
        } else {
          return value + vote;
        }
      }, 0);
    }
    const livingPlayers = [];
    for (const player of this.players) {
      if (player.isAlive()) {livingPlayers.push(player);}
    }
    const requiredVotes = Math.floor(livingPlayers.length / 2) + 1;
    for (const player of livingPlayers) {
      if (votesOnPlayer >= requiredVotes) {
        this.voteInformation.votedTarget = player;
        progressStage();
        break;
      }
    }
  }

  progressStage() {
    switch (this.stage) {
    case STAGE.GAME_START: {
      this.repeatAllPlayers((player) => player.role.beforeGameSetup());
      this.stage = STAGE.PRE_GAME_DISCUSS;
      break;
    }
    case STAGE.PRE_GAME_DISCUSS: {
      this.stage = STAGE.NIGHT;
      this.beforeNightSetup();
      break;
    }
    case STAGE.NIGHT: {
      this.stage = STAGE.CALCULATION; // TODO: do I really need this?
      this.otherInformation.livingPlayersBeforeNight = [];
      this.otherInformation.killedAtNight = [];
      this.repeatAllPlayers((player) => {
        if (player.isAlive()) {
          this.otherInformation.livingPlayersBeforeNight.push(player);
        }
      });
      this.executeActions();
      this.repeatAllPlayers((player) => player.role.afterNightSetup());
      for (const player of this.otherInformation.livingPlayersBeforeNight) {
        if (player.isDead()) {
          player.role.afterDeathSetup();
          if (player.isDead()) {
            this.otherInformation.killedAtNight.push(player);
          }
        }
      }
      this.stage = STAGE.PRE_DISCUSSION;
      break;
    }
    case STAGE.PRE_DISCUSSION: {
      this.clearTempData();
      this.stage = STAGE.DISCUSSION;
      this.checkVictors();
      this.repeatAllPlayers((player) => {
        player.actions = player.role.getDayActions();
      });
      break;
    }
    case STAGE.DISCUSSION: {
      this.stage = STAGE.VOTING;
      this.voteInformation.voteSessionsRemaining = 3;
      this.voteInformation.votedTarget = null;
      this.voteInformation.votes = [];
      break;
    }
    case STAGE.VOTING: {
      if (this.votedTarget) {
        this.stage = STAGE.VOTE_DEFENSE;
        this.voteInformation.votes = [];
      } else {
        this.stage = STAGE.NIGHT;
        this.beforeNightSetup();
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
        this.repeatAllPlayers((player) => player.role.afterVotingSetup());
        this.checkVictors();
        if (this.stage !== STAGE.GAME_END) {
          this.beforeNightSetup();
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
    for (const player of this.players) {
      let actions = player.actions ?? [];
      actions = actions.flat();
      for (const action of actions) {
        if (action.notPerformed()) {
          continue;
        }
        if (action.target?.effectData.jailed && !action.tags.has(ACTION_TAG.BYPASS_JAIL)) {
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
      positionedActions?.forEach(action => action.target?.targetActions.add(action));
    }
  }

  collectPositionedActions() {
    const list = [];
    for (const player of this.players) {
      const {targetActions:actions} = player;
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
    const ASSUME_ERROR_NUMBER = 100,
      alreadyExecutedActions = new Set;
    this.positionActions();
    let index = 0,
      actions = this.collectPositionedActions(),
      oldLength = actions.length,
      originalLength = actions.length;
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

  votePlayer(voter, voteTarget) {
    this.voteInformation.votes.push({
      vote: VOTE.GUILTY,
      player: voter,
      target: voteTarget
    });
    this.checkVotes();
  }

  cancelVotePlayer(voter) {
    // TODO
  }

  voteGuilty(voter) {} // TODO

  cancelVoteGuilty(voter) {} // TODO

  checkVictors() {}

  startGame() {
    if (this.stage === STAGE.GAME_START) {
      const players = [];
      this.repeatAllPlayers((player) => players.push(player));
      shuffle(players, true);
      // create roles!
      const {roles} = this.options;
      for (let i = 0; i < players.length; i++) {
        let roleNotFound = true;
        while(roleNotFound) {
          const chosenRoleConstructor = roles[Math.floor(Math.random() * roles.length)],
            chosenRole = new chosenRoleConstructor,
            {selection} = chosenRole;
          // check max
          if (selection.max > 0) {
            const currentCount = players.reduce((count, player) => {
              if (player.role instanceof chosenRoleConstructor) {count++;}
              return count;
            }, 0);
            if (currentCount >= selection.max) {
              continue;
            }
          }
          // check team max
          if (selection.maxOfTeam > 0) {
            const currentCount = players.reduce((count, player) => {
              if (player.role?.getTeam(true) === chosenRole.getTeam(true)) {count++;}
              return count;
            }, 0);
            if (currentCount >= selection.maxOfTeam) {
              continue;
            }
          }
          // check requires
          if (selection.require) {
            if (selection.requireAll && Array.isArray(selection.require)) {
              let foundMatch = true;
              for (const req of selection.require) {
                let match;
                if (typeof req === "function") {
                  match = players.find((player) => player.role ? req(player.role) : false);
                } else {
                  match = players.find((player) => player.role?.getName(true) === req);
                }
                if (!match) {
                  foundMatch = false;
                  break;
                }
              }
              if (!foundMatch) {continue;}
            } else if (Array.isArray(selection.require)) {
              let foundMatch = false;
              for (const req of selection.require) {
                let match;
                if (typeof req === "function") {
                  match = players.find((player) => player.role ? req(player.role) : false);
                } else {
                  match = players.find((player) => player.role?.getName(true) === req);
                }
                if (match) {
                  foundMatch = true;
                  break;
                }
              }
              if (!foundMatch) {continue;}
            } else {
              if (typeof selection.require === "function") {
                const match = players.find((player) => player.role ? selection.require(player.role) : false);
                if (!match) {continue;}
              } else {
                const match = players.find((player) => player.role?.getName(true) === selection.require);
                if (!match) {continue;}
              }
            }
          }
          // check mins
          if (selection.min > 0) {
            if (selection.min + i < players.length) {
              for (let j = 0; j < selection.min; j++) {
                const role = new chosenRoleConstructor();
                players[i + j].role = role;
                role.setPlayer(players[i + j]);
              }
              i += selection.min - 1;
              roleNotFound = false;
              continue;
            } else {
              continue;
            }
          }
          // set role!
          players[i].role = chosenRole;
          chosenRole.setPlayer(players[i]);
          roleNotFound = false;
        }
      }
      this.emit("startGame", this.players);
      this.progressStage();
    } else {
      throw new RangeError("Game already started");
    }
  }

}

module.exports = Game;
