const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {ACTION_TAG, ATTACK, TEAM, TARGET_FILTER, PRIORITY, ACTION_EXECUTE} = require("../enum");

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
    this.setPriority(PRIORITY.KILLERS);
  }

  isValidTarget(target) {
    return target.effectData.jailed;
  }

  execute() {
    super.execute();
    this.executionsLeft--;
    if (this.target.isDead() && this.target.getTeam(true) === TEAM.TOWN) {
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
  }
}

module.exports = Jailor;
