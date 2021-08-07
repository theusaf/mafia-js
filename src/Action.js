const {TARGET_FILTER, ATTACK, ACTION_EXECUTE} = require("./enum");

/**
 * Represents an action or potential action
 * - Returned in getXActions
 * - Only executed if target is selected
 */
class Action {
  constructor(from) {
    /**
     * @param {Player} from The player that initiated this Action.
     */
    this.from = from;

    /**
     * @param {Function} targetFilter The filter to select targets
     * - Takes a player and a me parameter, of type Player
     * - me is the Player the action comes from
     */
    this.targetFilter = TARGET_FILTER.NONE;
    /**
     * @param {Player} target The target of the action
     */
    this.target = null;
    /**
     * @param {Number} executeAt When the action's code should be executed
     */
    this.executeAt = ACTION_EXECUTE.NIGHT_END;
    /**
     * @param {String[]} type An array of strings, which are tags that group actions
     */
    this.type = [];
    /**
     * @param {Number} attack The attack value of the action
     */
    this.attack = ATTACK.NONE;
    /**
     * @param {Number} priority The priority of the action. 1 = highest, 6 = lowest.
     * - Determines execute order, not overwrite order.
     */
    this.priority = 6;

    /**
     * @param {Object[]} details This is used to store information about actions against this action.
     * - Ex: {detail: "cancelled", from: Role}
     */
    this.details = [];
  }

  /**
   * execute - Run at the time specified in executeAt
   * - Only executes if a target is selected
   *
   * If you need to execute if no target is selected, use BaseRole's afterNightSetup()
   */
  execute() {}

  /**
   * setTarget - Sets the target of the action
   */
  setTarget(player) {
    this.target = player;
    if (this.executeAt === ACTION_EXECUTE.IMMEDIATELY) {
      execute();
    }
  }

  /**
   * addDetail - Adds a detail
   *
   * @param  {Object} detail The details
   */
  addDetail(detail) {
    this.details.push(detail);
  }

  /**
   * getActionsAgainstTarget - Gets the actions on the target
   *
   * @param  {Action[]} actions   The full list of actions
   * @param  {Boolean} ignoreSelf Whether to ignore this action in the returned list
   * @return {Action[]}           The actions against the target
   */
  getActionsAgainstTarget(actions, ignoreSelf) {
    return actions.filter(action => {
      if (ignoreSelf) {
        return action.target === this.target && action !== this;
      }
      return action.target === this.target;
    });
  }


  /**
   * isSuccessful - executed after execute(). Checks if the action is successful.
   *
   * @return {Boolean} Whether the action is successful.
   */
  isSuccessful() {return true;}

  /**
   * onSuccess - executed after execute(), executed if the action isSuccessful().
   */
  onSuccess() {}

  /**
   * isCancelled - returns whether the action was cancelled. If it is cancelled, it will not execute.
   *
   * @return {Boolean} Whether it is cancelled or not.
   */
  isCancelled() {
    return !!this.details.find(detail => detail.detail === "cancel");
  }

  setTargetFilter(targetFilter) {
    if (typeof targetFilter !== "function") {
      throw new TypeError("targetFilter must be a function.");
    }
    this.targetFilter = targetFilter;
    return this;
  }
  setType(type) {
    if (!Array.isArray(type)) {throw new TypeError("type must be an array of strings");}
    this.type = type;
    return this;
  }
  setAttack(attack) {this.attack = attack; return this;}
  setExecuteAt(executeAt) {this.executeAt = executeAt; return this;}
  setPriority(priority) {this.priority = priority; return this;}

}
