const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Action = require("../Action"),
  {ACTION_TAG, TARGET_FILTER, ATTACK, PRIORITY, DEFENSE} = require("../enum");

class Arsonist extends NeutralInnocentRole {
  constructor() {
    super("Arsonist");
    this.setType(["neutral", "killing"]);
    this.setWinsWith([(role) => role.name === "Arsonist"]);
    this.setDefense(DEFENSE.BASIC);
    this.setDescription("You are a pyromaniac that wants to burn everyone.");
    this.setGoal("Live to see everyone burn.");
    this.setWinsWith([role => role instanceof Arsonist]);
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    const douse = new DouseAction(this.player),
      ignite = new IgniteAction(this.player),
      clean = new CleanAction(this.player, douse, ignite);
    return [[douse, ignite], clean, new BackDouseAction(this.player)];
  }

  getJailActions() {
    return [new BackDouseAction(this.player)];
  }

}

class DouseAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.STATE_CHANGERS);
    this.persistent = true;
  }

  execute() {
    // makes the target doused, and becomes immune to being removed
    this.target.effectData.doused = true;
    Object.assign(this.target.role.modifiedStats, {
      name: this.name
    });
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
  }
}

class IgniteAction extends Action {

  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.KILLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.SELF(target, this.initiator);
  }

  execute() {
    const actions = this.initiator.game.collectPositionedActions().filter((action) => {
      return action instanceof DouseAction && !action.isCanceled();
    });
    this.initiator.game.repeatAllPlayers((player) => {
      if (player.effectData.doused) {
        if (!player.effectData.alreadyIgnited) {
          player.targetActions.add(new IgniteKill(this.initiator, player));
        }
        player.effectData.alreadyIgnited = true;
      }
    });
    for (const action of actions) {
      const {target} = action;
      action.cancel("Ignition", this);
    }
  }
}

class IgniteKill extends Action {
  constructor(initiator, target) {
    super(initiator);
    this.setTarget(target);
    this.setPriority(PRIORITY.KILLERS);
    this.setAttack(ATTACK.UNSTOPPABLE);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
  }

}

class CleanAction extends Action {
  constructor(initiator, douse, ignite) {
    super(initiator);
    this.igniteAction = ignite;
    this.douseAction = douse;
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.setTarget(initiator);
    this.setPriority(PRIORITY.LOWEST);
  }

  notPerformed() {
    if (!this.douseAction.notPerformed() || !this.igniteAction.notPerformed()) {
      return true;
    }
    return false;
  }

  execute() {
    this.initiator.effectData.doused = false;
  }
}

class BackDouseAction extends DouseAction {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
    this.setTarget(initiator);
  }

  execute() {
    const {targetActions} = this.initiator;
    for (const action of targetActions) {
      if (action.isCanceled() || action.tags.has(ACTION_TAG.NON_VISIT)) {
        continue;
      }
      const {initiator} = action,
        douse = new DouseAction(this.initiator);
      douse.tags.add(ACTION_TAG.NON_VISIT);
      douse.setTarget(initiator);
      initiator.targetActions.add(douse);
    }
  }

  notPerformed() {return false;}
}

module.exports = Arsonist;
module.exports.investigateWith = require("./Bodyguard");
