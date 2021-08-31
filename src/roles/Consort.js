const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY} = require("../enum");

class Consort extends MafiaRole {
  constructor() {
    super("Consort");
    this.setType(["mafia", "support"]);
    this.setDescription("You are a beautiful dancer working for organized crime.");
    this.tags.add(ROLE_TAG.ROLEBLOCK_IMMUNE);
  }

  getDayActions() {
    if (this.player.isDead()) {return;}
    return [new DistractAction(this.player)];
  }
}

class DistractAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.CANCELLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    const {target} = this,
      {actions} = target;
    if (target.tags.has(ROLE_TAG.ROLEBLOCK_IMMUNE)) {return;}
    for (const action of actions) {
      if (action.tags.has(ACTION_TAG.ROLEBLOCK_IMMUNE)) {
        continue;
      }
      // TODO: replace with a Message object
      action.cancel("Consort roleblock", this);
    }
  }
}

module.exports = Consort;
module.exports.investigateWith = require("./Escort");
