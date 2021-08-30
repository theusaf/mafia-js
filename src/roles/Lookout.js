const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {TARGET_FILTER, PRIORITY} = require("../enum");

class Lookout extends TownRole {
  constructor() {
    super("Lookout");
    this.setDescription("You are an eagle-eyed observer, stealthily camping outside houses to gain information.");
    this.setType(["town", "investigative"]);
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new WatchAction(this.player)];
  }

  afterNightSetup() {
    // TODO
  }
}

class WatchAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.INVESTIGATIVE);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

}

module.exports = Lookout;
