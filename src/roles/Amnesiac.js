const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Cleaned = require("./other/Cleaned"),
  Action = require("../Action"),
  {TARGET_FILTER, PRIORITY} = require("../enum");

class Amnesiac extends NeutralInnocentRole {
  constructor() {
    super("Amnesiac");
    this.setType(["neutral", "benign"]);
    this.setDescription("You are a trauma patient that does not remember who they were.");
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new RememberAction(this.player)];
  }
}

class RememberAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.LOWEST);
  }

  isValidTarget(target) {
    return TARGET_FILTER.DEAD(target) && !(target.role instanceof Cleaned);
  }

  execute() {
    if (this.initiator.isDead()) {return;}
    if (this.target.isAlive() && !(this.target.role instanceof Amnesiac)) {
      // TODO: error message
      return;
    }
    const {role} = this.target,
      constructor = role.constructor,
      clone = new constructor();
    if (clone.selection.max === 1) {
      const {players} = this.initiator.game;
      for (const player of players) {
        if (player.isDead()) {continue;}
        if (player.role instanceof constructor) {
          // TODO: error message?
          return;
        }
      }
    }
    clone.setPlayer(this.initiator);
    this.initiator.role = clone;
  }

}

module.exports = Amnesiac;
module.exports.investigateWith = require("./Survivor");
