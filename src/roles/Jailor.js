const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {ACTION_TAG, ATTACK, DEFENSE, TEAM, TARGET_FILTER, PRIORITY, ACTION_EXECUTE} = require("../enum");

class Jailor extends TownRole {
  constructor() {
    super("Jailor");
    this.setType(["town", "killing"]);
    this.setDescription("You are a prison guard who secretly detains suspects.");
    this.additionalInformation = {
      executionsLeft: 3
    };
  }

  getDayActions() {
    if (this.player.isDead()) {return;}
    return [new JailAction(this.player)];
  }

  getNightActions() {
    if (this.player.isDead() || this.additionalInformation.executionsLeft < 1) {return;}
    return [new ExecuteAction(this.player)];
  }
}

class ExecuteAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.setAttack(ATTACK.UNSTOPPABLE);
    this.setPriority(PRIORITY.KILLERS - 0.5);
  }

  isValidTarget(target) {
    return target.effectData.jailed;
  }

  execute() {
    super.execute();
    this.initiator.effectData.didExecute = true;
    this.executionsLeft--;
    if (this.target.isDead() && this.target.role.getTeam(true) === TEAM.TOWN) {
      this.executionsLeft = 0;
    }
  }
}

class JailAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.HIGHEST);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.executeAt = ACTION_EXECUTE.NIGHT_START;
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    if (this.notPerformed()) {return;}
    this.target.effectData.jailed = true;
    const {role} = this.target,
      jailProtect = new JailProtectionAction(this.initiator, this.target);
    this.target.targetActions.add(jailProtect);
    if (role.getDefense() < DEFENSE.POWERFUL) {
      role.modifiedStats.defense = DEFENSE.POWERFUL;
    }
  }
}

class JailProtectionAction extends Action {
  constructor(initiator, target) {
    super(initiator);
    this.setPriority(PRIORITY.HIGHEST);
    this.setTarget(target);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
  }

  execute() {
    const {targetActions} = this.target;
    for (const action of targetActions) {
      if (action.tags.has(ACTION_TAG.NON_VISIT)
      || action.tags.has(ACTION_TAG.BYPASS_JAIL)
      || action.initiator === this.initiator) {
        continue;
      }
      action.cancel("Jail", this);
    }
  }
}

module.exports = Jailor;
module.exports.investigateWith = require("./Spy");
