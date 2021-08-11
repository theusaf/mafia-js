const TownRole = require("../Role"),
  Action = require("../Action"),
  {TARGET_FILTER, DEFENSE, PRIORITY} = require("../enum");

class Doctor extends TownRole {

  constructor() {
    super("Doctor");
    this.setDescription("You are a surgeon skilled in trauma care who secretly heals people.");
    this.setType(["town", "protective"]);
    this.additionalInformation = {
      selfHealsRemaining: 1
    };
  }

  getNightActions() {
    if (!this.player.isAlive()) {return;}
    const actions = [new HealAction(this.player)];
    if (this.additionalInformation.selfHealsRemaining > 0) {
      actions.push(new SelfHealAction(this.player));
    }
    if (actions.length > 1) {
      return [actions];
    } else {
      return actions;
    }
  }

}

class HealAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    const {target} = this;
    if (target.role.modifiedStats.defense < DEFENSE.POWERFUL && target.role.getDefense(true) < DEFENSE.POWERFUL) {
      target.role.modifiedStats.defense = DEFENSE.POWERFUL;
    }
  }
}

class SelfHealAction extends HealAction {
  constructor(initiator) {
    super(initiator);
  }

  isValidTarget(target) {
    return TARGET_FILTER.SELF(target, this.initiator);
  }

  execute() {
    super.execute();
    this.initiator.role.additionalInformation.selfHealsRemaining--;
  }
}

module.exports = Doctor;
