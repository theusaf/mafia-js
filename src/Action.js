const {ATTACK, TARGET_FILTER, PRIORITY, ACTION_EXECUTE} = require("./enum");

class Action {
  constructor(initiator) {

    /**
     * @param {Player} initiator The player who initiates this action
     */
    this.initiator = initiator;

    /**
     * @param {Number} priority The priority this action takes to execute. See enum.js for more information.
     */
    this.priority = PRIORITY.LOWEST;

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

    /**
     * @param {Number} executeAt When the action should be executed.    
     */
    this.executeAt = ACTION_EXECUTE.NIGHT_END;
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
  execute() {
    if (this.attack > ATTACK.NONE) {
      const targetDefense = this.target.role.getDefense();
      if (this.attack > targetDefense) {
        this.target.kill();
      }
    }
  }

  isValidTarget(target) {
    return TARGET_FILTER.NONE(target);
  }

  setTarget(target) {
    this.target = target;
    return this;
  }

  setAttack(attack) {
    this.attack = attack;
    return this;
  }

  setPriority(priority) {
    this.priority = priority;
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
    this.cancels.add(data);
  }

  isCanceled() {
    let isReallyCanceled = false;
    for (const cancel of this.cancels) {
      if (cancel.action.isCanceled()) {
        continue;
      }
      isReallyCanceled = true;
    }
    return isReallyCanceled;
  }
}

module.exports = Action;
