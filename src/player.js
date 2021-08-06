const BaseRole = require("./roles/BaseRole");

class Player {

  constructor(id, name) {
    this._role = null;
    this.id = id;
    this.name = name;
    this.isAlive = true;
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

}
module.exports = Player;
