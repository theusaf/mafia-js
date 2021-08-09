const {ATTACK, TARGET_FILTER} = require("./enum");

class Action {
  constructor(initiator) {

    /**
     * @param {Player} initiator The player who initiates this action
     */
    this.initiator = initiator;

    /**
     * @param {Player} target The player who is the target of this action
     */
    this.target = null;

    /**
     * @param {Boolean} persistent Whether this action should stay on the target until forcefully removed or until the end of the game
     */
    this.persistent = false;

    /**
     * @param {Number} attack The attack value of this action
     */
    this.attack = ATTACK.NONE;

    /**
     * @param {Set<String>} tags Various tags
     */
    this.tags = new Set;

    /**
     * @param {Set<Object>} cancels The cancel reasons for this action
     */
    this.cancels = new Set;
  }

  /**
   * position - Executed at the end of the night. Should return actions to add to targets.
   *
   * @return {Action[]}
   */
  position() {
    return [this];
  }

  /**
   * execute - Run at the end of the night. Main logic, cancels, moves, changes states, adds new actions, etc.
   */
  execute() {}

  isValidTarget(target) {
    return TARGET_FILTER.NONE(target);
  }

  setTarget(target) {
    this.target = target;
    return this;
  }

  notPerformed() {
    return !this.target;
  }

  cancel(reason, cancelAction) {
    const data = {
      description: reason,
      action: cancelAction
    };
    this.cancels.push(data);
  }
}

module.exports = Action;
