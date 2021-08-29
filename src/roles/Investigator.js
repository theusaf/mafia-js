const TownRole = require("../Role"),
  Action = require("../Action"),
  {ACTION_TAG, TARGET_FILTER, PRIORITY} = require("../enum");

class Investigator extends TownRole {
  constructor() {
    super("Investigator");
    this.setDescription("You are a private eye who secretly gathers information.");
    this.setType(["town", "investigative"]);
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new InvestigateAction(this.player)];
  }
}

class InvestigateAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.INVESTIGATIVE);
    this.tags.add(ACTION_TAG.INVESTIGATIVE);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    // TODO
  }
}

module.exports = Investigator;
