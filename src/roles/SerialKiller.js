const Role = require("../Role"),
  Action = require("../Action"),
  Jailor = require("./Jailor"),
  {ATTACK, DEFENSE, ACTION_TAG, TARGET_FILTER} = require("../enum");

class SerialKiller extends Role {
  constructor() {
    super("Serial Killer");
    this.setType(["neutral", "killing"]);
    this.setDefense(DEFENSE.BASIC);
    this.setDescription("You are a psychotic criminal who wants everyone to die.");
  }

  getNightActions() {
    if (this.player.isAlive()) {return;}
  }

  getJailActions() {
  }
}

class CautiousAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    // not roleblock immune, to test for roleblocks
  }

  notPerformed() {
    return false;
  }

  isValidTarget(target) {
    return TARGET_FILTER.SELF(target, this.initiator);
  }
}

class KillRoleblockerAction extends Action {
  constructor(initiator, cautious) {
    super(initiator);
    this.cautiousAction = cautious;
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.setPriority(PRIORITY.CANCELLERS + 0.5);
  }

  notPerformed() {
    return this.cautious.target && (!this.cautious.isCanceled() || this.initiator.effectData.jailed);
  }

  execute() {
    const {game} = this.initiator,
      {players} = game,
      {cancels} = this.cautiousAction;
    if (this.initiator.effectData.jailed) {
      let jailor;
      for (const player of players) {
        if (player.role instanceof Jailor) {
          jailor = player;
          break;
        }
      }
      const stab = new StabAction(this.initiator, true);
      stab.setTarget(jailor);
      jailor.targetActions.add(stab);
    } else {
      for (const cancel of cancels) {
        if (cancel.action.isCanceled()) {
          continue;
        }
        const stab = new StabAction(this.initiator, true),
          {target} = cancel.action.initiator;
        stab.setTarget(target);
        target.targetActions.add(stab);
      }
    }
  }
}

class StabAction extends Action {
  constructor(initiator, bloody) {
    super(initiator);
    this.bloody = bloody;
    this.setAttack(ATTACK.BASIC);
    this.setPriority(PRIORITY.KILLERS);
  }

  execute() {
    if (this.bloody) {
      // TODO: make wills bloody
    }
    super.execute();
  }
}

module.exports = SerialKiller;
