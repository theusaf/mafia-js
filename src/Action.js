const {TARGET_FILTER, ATTACK, ACTION_EXECUTE} = require("./enum");

/**
 * Represents an action or potential action
 * - Returned in getXActions
 * - Only executed if target is selected
 */
class Action {
  constructor() {
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

  /**
   * execute - Run at the time specified in executeAt
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

}
