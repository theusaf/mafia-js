const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Action = require("../Action"),
  {TARGET_FILTER, DEFENSE, PRIORITY} = require("../enum");

class Survivor extends NeutralInnocentRole {
  constructor() {
    super("Survivor");
    this.setType(["neutral", "benign"]);
    this.setDescription("You are a neutral character who just wants to live.");
    this.additionalInformation = {
      vestsRemaining: 4
    };
  }

  getNightActions() {
    if (this.player.isAlive() || this.additionalInformation.vestsRemaining < 1) {return;}
    return [new VestAction(this.player)];
  }
}

class VestAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {return TARGET_FILTER.SELF(target, this.initiator);}

  execute() {
    if (this.initiator.role.modifiedStats.defense < DEFENSE.BASIC) {
      this.initiator.role.modifiedStats.defense = DEFENSE.BASIC;
    }
    this.initiator.additionalInformation.vestsRemaining--;
  }
}

module.exports = Survivor;
