const BaseRole = require("./roles/BaseRole");

class Player {

  constructor(id, name) {
    this._role = null;

    /**
     * @param {Game} game The game the player is a part of.    
     */
    this.game = null;

    /**
     * The id of the player
     */
    this.id = id;
    /**
     * The name of the player
     */
    this.name = name;
    /**
     * Whether the player is alive or not
     */
    this.isAlive = true;
    /**
     * The will of the player
     */
    this.finalWill = "";
    /**
     * The death note of the player
     */
    this.deathNote = "";
  }

  /**
   * set role - This setter does some stuff when a role is changed.
   *
   * @param {BaseRole} role The role to set
   */
  set role(role) {
    if (!(role instanceof BaseRole)) {
      throw new TypeError("The role being set must be of type BaseRole or a child class");
    }
    const originalRole = this._role || {additionalInformation: {}},
      {additionalInformation} = originalRole;
    Object.assign(role.additionalInformation, additionalInformation);
    this._role = role;
  }

  /**
   * get role - gets this player's role.
   *
   * @return {BaseRole} This player's role
   */
  get role() {
    return this._role;
  }

  setGame(game) {this.game = game;}

}
module.exports = Player;
