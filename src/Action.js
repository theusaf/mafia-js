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
     * @param {String[]} tags Various tags
     */
    this.tags = [];

    /**
     * @param {Object[]} cancels The cancel reasons for this action
     */
    this.cancels = [];
  }

  /**
   * execute - Executed at the end of the night. Should return actions to add to targets.
   *
   * @return {Action[]}
   */
  execute() {

  }

  isValidTarget(target) {
    return TARGET_FILTER.NONE(target);
  }

  setTarget(target) {
    this.target = target;
    return this;
  }

  notPerformed() {}

  cancel(reason, cancelAction) {
    const data = {
      description: reason,
      action: cancelAction
    };
    this.cancels.push(data);
  }
}

module.exports = Action;
