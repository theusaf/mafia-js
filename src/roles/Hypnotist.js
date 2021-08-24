const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY, ACTION_EXECUTE, TEAM} = require("../enum");

class Hypnotist extends MafiaRole {
  constructor() {
    super("Hypnotist");
    this.setType(["mafia", "deception"]);
    this.setDescription("You are a skilled hypnotist who can alter the perception of others.");
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    const messageAction = new HypnotizeMessage(this.player),
      hypnoAction = new HypnotizeAction(this.player, messageAction);
    return [[hypnoAction, messageAction]];
  }
}

class HypnotizeAction extends Action {
  constructor(initiator, messageAction) {
    super(initiator);
    this.messageAction = messageAction;
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  notPerformed() {
    return super.notPerformed() && !messageAction.target;
  }

  execute() {
    // TODO: messages
  }

}

class HypnotizeMessage extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.ENUM);
  }

  isValidTarget() {
    return [
      "You were transported to another location.",
      "Someone occupied your night. You were role blocked!",
      "You were attacked but someone fought off your attacker!",
      "You were attacked but someone nursed you back to health!",
      "You feel a mystical power dominating you. You were controlled by a Witch!"
    ];
  }

  notPerformed() {
    return true;
  }
}

module.exports = Hypnotist;
