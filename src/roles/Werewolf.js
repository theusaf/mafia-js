const Role = require("../Role"),
  Action = require("../Action"),
  Jailor = require("./Jailor"),
  {ATTACK, DEFENSE, ACTION_TAG, TARGET_FILTER, PRIORITY, ROLE_TAG} = require("../enum");

class Werewolf extends Role {
  constructor() {
    super("Werewolf");
    this.setType(["neutral", "killing"]);
    this.setDefense(DEFENSE.BASIC);
    this.setDescription("You are a normal citizen who transforms during the full moon.");
    this.setWinsWith([]);
    this.setGoal("Kill everyone who would oppose you.");
    this.selection.max = 1;
  }

  beforeNightSetup() {
    if (this.player.game.date % 2 === 1 || this.player.game.date > 4) {
      this.tags.delete(ROLE_TAG.DETECTION_IMMUNE);
    } else {
      this.tags.add(ROLE_TAG.DETECTION_IMMUNE);
    }
  }

  getNightActions() {
    if (this.player.isDead() || (this.player.game.date % 2 && !this.player.game.date > 4)) {return;}
    const rampage = new RampageAction(this.player),
      test = new DetectRoleblockAction(this.player),
      rbkill = new KillRoleblockerAction(this.player, test, rampage);
    return [rampage, rbkill];
  }

  getJailActions() {
    return [new KillRoleblockerAction(this.player)];
  }
}

class DetectRoleblockAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
  }

  notPerformed() {return false;}
}

class KillRoleblockerAction extends Action {
  constructor(initiator, test, rampage) {
    super(initiator);
    this.testAction = test;
    this.rampageAction = rampage;
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.setPriority(PRIORITY.CANCELLERS + 0.5);
  }

  notPerformed() {
    return !this.testAction.isCanceled() || this.initiator.effectData.jailed;
  }

  execute() {
    const {game} = this.initiator,
      {players} = game;
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
      const maul = new MaulAction(this.initiator);
      maul.tags.add(ACTION_TAG.NON_VISIT);
      maul.setTarget(jailor);
      jailor.targetActions.add(maul);
    } else {
      this.rampage.setTarget(this.initiator);
    }
  }
}

class RampageAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.setPriority(PRIORITY.CANCELLERS + 0.5);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    console.log("WW Rampage!!");
    const {target} = this,
      {targetActions} = target;
    if (target !== this.initiator) {
      const maul = new MaulAction(this.initiator, target);
      maul.tags.delete(ACTION_TAG.NON_VISIT);
      targetActions.add(maul);
    }
    for (const action of targetActions) {
      if (action.initiator === this.initiator || action.tags.has(ACTION_TAG.NON_VISIT)) {continue;}
      action.initiator.targetActions.add(new MaulAction(this.initiator, action.initiator));
    }
  }
}

class MaulAction extends Action {
  constructor(initiator, target) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.setAttack(ATTACK.BASIC);
    this.setPriority(PRIORITY.KILLERS);
    this.setTarget(target);
  }
}

module.exports = Werewolf;
module.exports.investigateWith = require("./Sheriff");
// TODO: investigate crash when multiple targets to attack are available
