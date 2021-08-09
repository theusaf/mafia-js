const MafiaRole = require("../Role"),
  Action = require("../Action"),
  {TEAM, ACTION_TAG, TARGET_FILTER, ATTACK, PRIORITY} = require("../enum");

class Ambusher extends MafiaRole {
  constructor() {
    super("Ambusher");
    this.setDescription("You are a stealthy killer who lies in wait for the perfect moment to strike.");
    this.setType(["mafia", "killing"]);
    this.selection.max = 1;
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
  }
}

class AmbushAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.HIGHEST);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    const mainTarget = this.target,
      mainTargetActions = mainTarget.targetActions;
    for (const action of mainTargetActions) {
      if (action.tags.has(ACTION_TAG.NON_VISIT)) {continue;}
      if (action.initiator.role.team === TEAM.MAFIA) {continue;}
      const target = action.initiator,
        targetActions = target.targetActions;
      targetActions.add(new AmbushAttack(this.initiator, target));
      break;
    }
  }
}

class AmbushAttack extends Action {
  constructor(initiator, target) {
    super(initiator);
    this.setTarget(target);
    this.setPriority(PRIORITY.KILLERS);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.setAttack(ATTACK.BASIC);
  }
}

module.exports = Ambusher;
