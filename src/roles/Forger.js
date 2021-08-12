const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY, ACTION_EXECUTE} = require("../enum");

class Forger extends MafiaRole {
  constructor() {
    super("Forger");
    this.setType(["mafia", "support"]);
    this.setDescription("You are a crooked lawyer that replaces documents.");
    this.additionalInformation = {
      forgeriesLeft: 2
    };
  }

  getNightActions() {
    if (this.player.isDead() || this.additionalInformation.forgeriesLeft <= 0) {return;}
    const roleChoice = new RoleChoice(this.player);
    return [new ForgeAction(this.player, roleChoice)];
  }
}

class ForgeAction extends Action {
  constructor(initiator, roleChoice) {
    super(initiator);
    this.roleChoice = roleChoice;
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    this.target.effectData.isForged = true;
    this.target.effectData.forgedWill = this.initiator.deathNote;
    this.initiator.role.additionalInformation.forgeriesLeft--;
  }
}

class RoleChoice extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.ENUM);
  }

  isValidTarget() {
    // TODO: return a list of all role names
    return [];
  }

  notPerformed() {
    return true;
  }
}

module.exports = Forger;
