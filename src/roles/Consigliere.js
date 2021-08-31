const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {TARGET_FILTER, PRIORITY} = require("../enum");

class Consigliere extends MafiaRole {
  constructor() {
    super("Consigliere");
    this.setDescription("You are a corrupted investigator who gathers information for the Mafia.");
    this.setType(["mafia", "investigative"]);
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new InvestigateAction(this.player)];
  }

  afterNightSetup() {
    // TODO
  }
}

class InvestigateAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.INVESTIGATIVE);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

}

module.exports = Consigliere;
module.exports.investigateWith = require("./Investigator");
