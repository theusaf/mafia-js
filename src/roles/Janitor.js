const MafiaRole = require("../MafiaRole"),
  Cleaned = require("./other/Cleaned"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY, ACTION_EXECUTE, TEAM} = require("../enum");

class Janitor extends MafiaRole {
  constructor() {
    super("Janitor");
    this.setType(["mafia", "deception"]);
    this.setDescription("You are a sanitation expert working for organized crime.");
    this.additionalInformation = {
      cleansLeft: 3
    };
  }

  getNightActions() {
    if (this.player.isDead() || this.additionalInformation.cleansLeft < 1) {return;}
    return [new CleanAction(this.player)];
  }

  afterNightSetup() {
    const action = this.player.game.collectPositionedActions().find(action => action.initiator === this.player && !action.isCanceled());
    if (action) {
      const {target} = action,
        {role} = target;
      if (target.isDead()) {
        target.role = new Cleaned(role);
      }
    }
  }

}

class CleanAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.isAlive(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    this.additionalInformation.cleansLeft--;
  }
}

module.exports = Janitor;
