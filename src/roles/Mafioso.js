const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {TARGET_FILTER, PRIORITY, ATTACK} = require("../enum");

class Mafioso extends MafiaRole {
  constructor() {
    super("Mafioso");
    this.setType(["mafia", "killing"]);
    this.setDescription("You are a member of organized crime, trying to work your way to the top.");
    this.selection.max = 1;
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new AttackAction(this.player)];
  }

}

class AttackAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.KILLERS);
    this.setAttack(ATTACK.BASIC);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target);
  }
}

module.exports = Mafioso;
module.exports.investigateWith = require("./Vigilante");
