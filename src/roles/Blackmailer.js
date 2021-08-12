const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY, ACTION_EXECUTE} = require("../enum");

// TODO: messages
class Blackmailer extends MafiaRole {
  constructor() {
    super("Blackmailer");
    this.setType(["mafia", "support"]);
    this.setDescription("You are an eavesdropper who uses information to keep people quiet.");
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new BlackmailAction(this.player)];
  }
}

class BlackmailAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    this.target.effectData.isBlackmailed = true;
  }
}

module.exports = Blackmailer;
