const Role = require("../Role"),
  Action = require("../Action"),
  {TEAM, ROLE_TAG, ACTION_TAG, TARGET_FILTER, ATTACK, PRIORITY} = require("../enum");

class Vigilante extends Role {
  constructor() {
    super("Vigilante");
    this.setDescription("You are a militant cop who takes the law into your own hands.");
    this.setTeam(TEAM.TOWN);
    this.setType(["town", "killing"]);
    this.additionalInformation = {
      bulletsLeft: 3,
      hasFailed: false
    };
  }

  getNightActions() {
    if (this.player.isDead() || this.additionalInformation.bulletsLeft <= 0) {return;}
    if (this.additionalInformation.hasFailed) {
      this.player.targetActions.add(new Oops(this.player));
    } else {
      return [new ShootAction(this.player)];
    }
  }

  afterNightSetup() {
    const myAction = this.player.actions.find(action => action.target && action instanceof ShootAction);
    if(myAction) {
      if (myAction.target.getTeam() === TEAM.TOWN) {
        this.additionalInformation.hasFailed = true;
        this.additionalInformation.bulletsLeft = 1;
      }
    }
  }
}

class Oops extends Action {
  constructor(initiator) {
    super(initiator);
    this.setTarget(initiator);
    this.setPriority(1);
    this.setAttack(ATTACK.UNSTOPPABLE);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
  }
}

class ShootAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.KILLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    this.initiator.role.additionalInformation.bulletsLeft--;
    super.execute();
  }
}

module.exports = Vigilante;
