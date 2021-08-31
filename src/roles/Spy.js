const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {TARGET_FILTER, PRIORITY} = require("../enum");

class Spy extends TownRole {
  constructor() {
    super("Spy");
    this.setDescription("You are a talented watcher who keeps track of evil in the Town.");
    this.setType(["town", "investigative"]);
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new BugAction(this.player)];
  }

  afterNightSetup() {
    // TODO
  }
}

class BugAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.LOWEST);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

}

module.exports = Spy;
