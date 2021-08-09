const Role = require("../Role"),
  Action = require("../Action"),
  {TEAM, ROLE_TAG, ACTION_TAG, TARGET_FILTER, ATTACK} = require("../enum");

class Veteran extends Role {

  constructor() {
    super("Veteran");
    this.setDescription("You are a paranoid war hero who will shoot anyone who visits you.");
    this.setTeam(TEAM.TOWN);
    this.setType(["town", "killing"]);
    this.setTags([ROLE_TAG.ROLEBLOCK_IMMUNE, ROLE_TAG.CONTROL_IMMUNE]);
    this.additionalInformation = {
      alertsRemaining: 3
    };
  }

  getNightActions() {
    if (this.player.isDead() || this.additionalInformation.alertsRemaining <= 0) {return;}
    return [new AlertAction(this.player)];
  }

}

class AlertAction extends Action {
  constructor(initiator) {
    super(initiator);
  }

  position() {
    if (this.target === this.initiator) {
      return [this];
    }
  }

  execute() {
    const revengeActions = this.initiator.targetActions.filter(action => {
      return action !== this && !action.tag.has(ACTION_TAG.NON_VISIT) && !action.isCanceled();
    });
    for (const action of revengeActions) {
      const {initiator} = action;
      initiator.targetActions.add(new AttackAction(this.initiator, action));
    }
    this.initiator.role.additionalInformation.alertsRemaining--;
  }
}

class AttackAction extends Action {
  constructor(initiator, targetAction) {
    super(initiator);
    this.revengeAction = targetAction;
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.setTarget(targetAction.initiator);
    this.attack = ATTACK.POWERFUL;
  }

  execute() {
    if (!this.revengeAction.isCanceled()) {
      super.execute();
    }
  }
}

module.exports = Transporter;
