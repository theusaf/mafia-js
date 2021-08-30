const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, ATTACK, DEFENSE, PRIORITY} = require("../enum");

class Bodyguard extends TownRole {

  constructor() {
    super("Bodyguard");
    this.setDescription("You are an ex-soldier who secretly makes a living by selling protection.");
    this.setType(["town", "protective"]);
    this.additionalInformation = {
      vestsRemaining: 1
    };
  }

  getNightActions() {
    if (!this.player.isAlive()) {return;}
    const actions = [new GuardAction(this.player)];
    if (this.additionalInformation.vestsRemaining >= 1) {
      actions.push(new VestAction(this.player));
    }
    return actions;
  }

}

class VestAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {return TARGET_FILTER.SELF(target, this.initiator);}

  execute() {
    if (this.initiator.role.modifiedStats.defense < DEFENSE.BASIC) {
      this.initiator.role.modifiedStats.defense = DEFENSE.BASIC;
    }
    this.initiator.additionalInformation.vestsRemaining--;
  }
}

class GuardAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    const employer = this.target,
      {targetActions} = employer;
    for (const action of targetActions) {
      if (action.isCanceled() || action.tags.has(ACTION_TAG.NON_VISIT)) {continue;}
      if (action.attack > ATTACK.NONE) {
        action.cancel("Bodyguard defend", this);
        action.initiator.targetActions.add(new DefendAction(this.initiator, action));
        this.initiator.targetAction.add(new SacrificeAction(this.initiator));
        break;
      }
    }
  }
}

class SacrificeAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setTarget(initiator);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.setPriority(PRIORITY.KILLERS);
    this.setAttack(ATTACK.POWERFUL);
  }
}

class DefendAction extends Action {
  constructor(initiator, revengeAction) {
    super(initiator);
    this.revengeAction = revengeAction;
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.setPriority(PRIORITY.KILLERS);
    this.setTarget(revengeAction.initiator);
    this.setAttack(ATTACK.POWERFUL);
    revengeAction.cancel("Bodyguard defend", this);
  }
}

module.exports = Bodyguard;
