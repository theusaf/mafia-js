const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {TEAM, ROLE_TAG, ACTION_TAG, TARGET_FILTER, ATTACK, PRIORITY, ACTION_EXECUTE} = require("../enum");

class Medium extends TownRole {
  constructor() {
    super("Medium");
    this.setType(["town", "support"]);
    this.setDescription("You are a secret psychic who talks with the dead.");
    this.additionalInformation = {
      seancesLeft: 1
    };
  }

  getDayActions() {
    if (this.player.isAlive() || this.additionalInformation.seancesLeft < 1) {return;}
    return [new SeanceAction(this.player)];
  }
}

class SeanceAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.executeAt = ACTION_EXECUTE.NIGHT_START;
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target);
  }

  execute() {
    // TODO: messages
    this.initiator.role.additionalInformation.seancesLeft--;
  }
}

module.exports = Medium;
