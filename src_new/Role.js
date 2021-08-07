const {DEFENSE} = require("enum");

class Role {

  constructor(player, name) {

    /**
     * @param {Player} player The player object the role is attached to.
     */
    this.player = player;

    /**
     * @param {String} description The description of this role.
     */
    this.description = "";

    /**
     * @param {Object} stats These are stats/properties that can be overwritten, which affects certain things
     */
    this.stats = {

      /**
       * @param {String} name The name of this role.
       */
      name: name,

      /**
       * @param {Number} defense The default defense value of this role.
       */
      defense: DEFENSE.NONE
    };

    /**
     * @param {String} attack The team of this role. "none" if on no team.
     */
    this.team = "none";

    /**
     * @param {String[]} type The type of the role.
     */
    this.type = ["neutral", "benign"];

    /**
     * @param {String[]|String[][]|Function[]} winsWith The type names this role can win with. "*" = all types
     * - If an element is an array of strings, the role must contain all of those strings.
     * - If an element is a function, it must return true if the role is a role that it can win with.
     * Example:
     * (role) => return role.name === "Jester"; // wins with jester
     */
    this.winsWith = ["*"];

    /**
     * @param {Object} additionalInformation Extra information for specific interactions. This is copied over if the role is replaced.
     *
     * Some to note:
     * jailed: (boolean) - set to true when jailed
     */
    this.additionalInformation = {};

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
  didWin() {
    return this.player.isAlive;
  }

  /**
   * getNightActions/getDayActions - Returns the night/day actions of this role.
   * - These are run even if the player is dead.
   *
   * @return {Action[]} An array of actions
   */
  getNightActions() {}
  getDayActions() {}

  /**
   * getJailActions - Returns actions that can be done while in jail.
   *
   * @return {Action[]|Action[][]} An array of actions
   * - If an array of an array of actions, the array of actions is treated like one action.
   */
  getJailActions() {}

  /**
   * beforeGameSetup - Runs before the game starts, when all players have been added and the game starts.
   */
  beforeGameSetup() {}

  /**
   * beforeNightSetup - Runs before the night starts
   */
  beforeNightSetup() {}

  /**
   * afterNightSetup - Runs after all night actions have been completed.
   */
  afterNightSetup() {}

  /**
   * afterVotingSetup - Runs after a player is eliminated in the voting stage.
   */
  afterVotingSetup() {}

  setDefense(defense=0) {this.defense = defense; return this;}
  setType(type) {if(Array.isArray(type)) {this.type = type;} return this;}
  setTeam(team) {this.team = team; return this;}
  setWinsWith(type) {if(Array.isArray(type)) {this.winsWith = type;} return this;}
  setDescription(description="") {this.description = description; return this;}

}

module.exports = Role;