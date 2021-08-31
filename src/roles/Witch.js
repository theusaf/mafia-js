const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Action = require("../Action"),
  {ACTION_TAG, TEAM, ROLE_TAG, PRIORITY, DEFENSE, TARGET_FILTER} = require("../enum");

class Witch extends NeutralInnocentRole {
  constructor() {
    super("Witch");
    this.setType(["neutral", "evil"]);
    this.setWinsWith([role => role.team !== TEAM.TOWN]);
    this.setDescription("You are a voodoo master who can control other peoples actions.");
    this.setTeam(TEAM.COVEN);
    this.tags.add(ROLE_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ROLE_TAG.VAMPIRE_DEATH);
    this.additionalInformation = {
      magicBarriers: 1
    };
  }

  getNightActions() {
    const target = new ControlTarget(this.player),
      control = new ControlAction(this.player, target);
    return [[control, target]];
  }

  afterDeathSetup() {
    const targetActions = this.player.targetActions,
      attacks = Array.from(targetActions).map(action => action.attack),
      highestAttack = Math.max(...attacks);
    if (highestAttack > 0) {
      if (this.additionalInformation.magicBarriers > 0) {
        if (highestAttack <= DEFENSE.BASIC) {
          this.player.isAlive = true;
        }
        this.additionalInformation.magicBarriers--;
      }
    }
  }
}

class ControlAction extends Action {
  constructor(initiator, targetAction) {
    super(initiator);
    this.targetAction = targetAction;
    this.setPriority(PRIORITY.CANCELLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    const {target} = this,
      {target:target2} = this.targetAction,
      {actions} = target;
    if (target.tags.has(ROLE_TAG.CONTROL_IMMUNE)) {return;}
    for (const action of actions) {
      if (action.tags.has(ACTION_TAG.CONTROL_IMMUNE)) {
        continue;
      }
      action.cancel("Witch Control", this);
    }
    const [useAction] = target.role.getNightActions();
    if (useAction) {
      let finalAction = useAction;
      if (Array.isArray(useAction)) {
        finalAction = useAction[0];
      }
      finalAction.setTarget(target2);
      target2.targetActions.add(finalAction);
    }
  }
}

class ControlTarget extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target);
  }

  notPerformed() {return true;}
}

module.exports = Witch;
module.exports.investigateWith = require("./Lookout");
