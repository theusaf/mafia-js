class Player {

  constructor(id, name) {

    /**
     * @param {Role} role The current role of the player
     */
    this.role = null;

    /**
     * @param {Game} game The game the player is a part of.
     */
    this.game = null;

    /**
     * @param {String} id The id of the player
     */
    this.id = id;

    /**
     * @param {String} name The name of the player
     */
    this.name = name;

    /**
     * @param {Boolean} isAlive Whether the player is alive or not
     */
    this.alive = true;

    /**
     * @param {String} finalWill The will of the player
     */
    this.finalWill = "";

    /**
     * @param {String} deathNote The death note of the player
     */
    this.deathNote = "";

    /**
     * @param {Object} effectData Information used by roles to store information, such as doused, poisoned, etc.
     */
    this.effectData = {};

    /**
     * @param {Action[]} actions The list of actions the player has/can do
     */
    this.actions = [];

    /**
     * @param {Action[]} targetActions The list of actions taken upon the player.
     */
    this.targetActions = new Set;

    /**
     * @param {Message[]} messages The list of messages received after the night.
     */
    this.messages = new Set;
  }

  sendMessage() {}

  whisper() {}

  /**
   * isAlive - Returns whether the player is alive.
   *
   * @return {Boolean} true if alive, false if dead
   */
  isAlive() {
    return this.alive;
  }

  /**
   * isDead - Returns whether the player is dead.
   *
   * @return {Boolean} true if dead, false if alive
   */
  isDead() {
    return !this.isAlive();
  }

  kill() {
    this.alive = false;
  }

}
module.exports = Player;
