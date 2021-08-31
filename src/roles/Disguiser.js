const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {TARGET_FILTER, PRIORITY} = require("../enum");

class Disguiser extends MafiaRole {
  constructor() {
    super("Disguiser");
    this.setType(["mafia", "deception"]);
    this.setDescription("You are a master of disguise who can make people appear to be someone they are not.");
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    const asAction = new DisguiseAsAction(this.player);
    return [new DisguiseAction(this.player, asAction), asAction];
  }
}

class DisguiseAction extends Action {
  constructor(initiator, asAction) {
    super(initiator);
    this.asAction = asAction;
    this.setPriority(PRIORITY.KILLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.TEAM(target, this.player);
  }

  notPerformed() {
    return super.notPerformed() || this.asAction.notPerformed();
  }

  execute() {
    const {target} = this,
      {role} = target,
      {modifiedStats} = role,
      {target:asTarget} = this.asAction,
      {role:asRole} = asTarget;
    modifiedStats.name = asRole.getName(true);
    modifiedStats.playerName = asRole.getPlayerName(true);
    modifiedStats.team = asRole.getTeam(true);
  }
}

class DisguiseAsAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.KILLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }
}

module.exports = Disguiser;
module.exports.investigateWith = require("./Doctor");
