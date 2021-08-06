const {TARGET_FILTER, ATTACK, ACTION_EXECUTE} = require("./enum");

/**
 * Represents an action or potential action
 * - Returned in getXActions
 * - Only executed if target is selected
 */
class Action {
  constructor() {
    this.targetFilter = TARGET_FILTER.NONE;
    this.target = null;
    this.executeAt = ACTION_EXECUTE.NIGHT_END;
    this.type = [];
    this.attack = ATTACK.NONE;
    this.priority = 0;
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
