const {TARGET_FILTER, ATTACK} = require("./enum");

class Action {
  constructor() {
    this.targetFilter = TARGET_FILTER.NONE;
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

}
