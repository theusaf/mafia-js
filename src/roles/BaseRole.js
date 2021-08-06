const {ATTACK, DEFENSE} = require("../enum");

class BaseRole {

  constructor(player, name) {
    /**
     * @param {Player} player The player object the role is attached to.
     */
    this.player = player;
    /**
     * @param {String} name The name of this role.
     */
    this.name = name;
    /**
     * @param {String} description The description of this role.
     */
    this.description = "";
    /**
     * @param {Number} attach The
     */
    this.attack = ATTACK.NONE;
    this.defense = DEFENSE.NONE;
    this.team = null;
    this.type = ["neutral", "benign"];
    this.winsWith = ["*"];

    /**
     * @param {Boolean|String|String[]} require
     * The role(s) that must be in the game before selecting this role. Ignored if a boolean variable.
     * - if an array, only one role is needed, unless requireAll is true
     * @param {Boolean} requireAll Whether all roles in require must be in the game before selecting this role
     * @param {Number} max The maximum number of this role that can be in the game. Ignored if <= 0
     * @param {Number} min The minimum number of this role that can be in the game. Ignored if <= 0
     */
    this.selection = {
      require: false,
      requireAll: false,
      max: 0,
      min: 0
    };
  }

  /**
   * didWin - Called at the end of the game, checks the victory condition of this role.
   *
   * @return {Boolean} Whether the role actually won the game.
   */
  didWin() {}

  /**
   * getNightActions/getDayActions - Returns the night/day actions of this role.
   *
   * @return {Action[]} An array of actions
   */
  getNightActions() {}
  getDayActions() {}

  /**
   * beforeGameSetup - Runs before the game starts, when all players have been added and the game starts.
   */
  beforeGameSetup() {}
  /**
   * afterNightSetup - Runs after all night actions have been completed.
   */
  afterNightSetup() {}
  /**
   * afterVotingSetup - Runs after a player is eliminated in the voting stage.
   */
  afterVotingSetup() {}

  setAttack(attack=0) {this.attack = attack; return this;}
  setDefense(defense=0) {this.defense = defense; return this;}
  setType(type) {if(Array.isArray(type)) {this.type = type;} return this;}
  setWinsWith(type) {if(Array.isArray(type)) {this.winsWith = type;} return this;}
  setDescription(description="") {this.description = description; return this;}

}

module.exports = BaseRole;
