const TownRole = require("../Role"),
  Action = require("../Action"),
  {ACTION_TAG, TARGET_FILTER, PRIORITY} = require("../enum");

class Sheriff extends TownRole {
  constructor() {
    super("Sheriff");
    this.setDescription("You are the law enforcer of the town forced into hiding from threat of murder.");
    this.setType(["town", "investigative"]);
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new InterrogateAction(this.player)];
  }

  afterNightSetup() {
    // TODO
  }
}

class InterrogateAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.INVESTIGATIVE);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

}

module.exports = Sheriff;
