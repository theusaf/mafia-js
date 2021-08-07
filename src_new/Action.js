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
  }

  /**
   * execute - Executed at the end of the night. Should return actions to add to targets.
   *
   * @return {Action[]}
   */
  execute() {

  }

  getTargetFilter() {}

  setTarget(target) {}

  notPerformed() {}

  cancel(reason, cancelAction) {}
}

module.exports = Action;
