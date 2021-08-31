const Role = require("../Role"),
  Action = require("../Action"),
  Jailor = require("./Jailor"),
  {ATTACK, DEFENSE, ACTION_TAG, TARGET_FILTER, PRIORITY} = require("../enum");

class SerialKiller extends Role {
  constructor() {
    super("Serial Killer");
    this.setType(["neutral", "killing"]);
    this.setDefense(DEFENSE.BASIC);
    this.setDescription("You are a psychotic criminal who wants everyone to die.");
    this.setWinsWith([role => role instanceof SerialKiller]);
  }

  getNightActions() {
    if (this.player.isAlive()) {return;}
    const attack = new StabAction(this.player),
      cautious = new CautiousAction(this.player, attack),
      rbkill = new KillRoleblockerAction(this.player, cautious);
    return [attack, cautious, rbkill];
  }

  getJailActions() {
    const cautious = new CautiousAction(this.player),
      rbkill = new KillRoleblockerAction(this.player, cautious);
    return [cautious, rbkill];
  }
}

class CautiousAction extends Action {
  constructor(initiator, mainAttack) {
    super(initiator);
    this.mainAttack = mainAttack;
    this.setPriority(PRIORITY.HIGHEST);
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

  execute() {
    this.mainAttack?.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
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
      if (jailor.effectData.didExecute) {
        return;
      }
      const stab = new StabAction(this.initiator, true);
      stab.setTarget(jailor);
      stab.tags.add(ACTION_TAG.NON_VISIT);
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

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    if (this.bloody) {
      // TODO: make wills bloody
    }
    super.execute();
  }
}

module.exports = SerialKiller;
module.exports.investigateWith = require("./Doctor");
