const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY} = require("../enum");

class Escort extends TownRole {
  constructor() {
    super("Escort");
    this.setType(["town", "support"]);
    this.setDescription("You are a beautiful person skilled in distraction.");
    this.tags.add(ROLE_TAG.ROLEBLOCK_IMMUNE);
  }

  getNightActions() {
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
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
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
      action.cancel("Escort roleblock", this);
    }
  }
}

module.exports = Escort;
module.exports.investigateWith = Escort;
