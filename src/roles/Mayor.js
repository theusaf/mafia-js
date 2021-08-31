const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {ACTION_EXECUTE} = require("../enum");

class Mayor extends TownRole {

  constructor() {
    super("Mayor");
    this.setDescription("You are the leader of the town.");
    this.setType(["town", "support"]);
    this.additionalInformation = {
      isRevealed: false
    };
  }

  getDayActions() {
    if (this.player.isDead() || this.additionalInformation.isRevealed) {return;}
    return [new RevealAction(this.player)];
  }

}

class RevealAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.executeAt = ACTION_EXECUTE.IMMEDIATELY;
  }

  position() {return [];}

  execute() {
    this.initiator.isRevealed = true;
  }
}

module.exports = Mayor;
module.exports.investigateWith = require("./Investigator");
