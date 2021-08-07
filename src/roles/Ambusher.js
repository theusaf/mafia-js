const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER, ACTION_TYPE, ATTACK} = require("../enum");

class AmbushAttackAction extends Action {
  constructor(from, target) {
    this.setPriority(5)
      .setAttack(ATTACK.BASIC)
      .setType(["ambush-attack", ACTION_TYPE.NON_VISIT, ACTION_TYPE.ROLEBLOCK_IMMUNE, ACTION_TYPE.CONTROL_IMMUNE, ACTION_TYPE.TRANSPORT_IMMUNE])
      .setTarget(target);
  }

  execute() {}
}

class AmbushAction extends Action {
  constructor(from) {
    super(from);
    this.setPriority(1)
      .setType(["ambush-prepare", ACTION_TYPE.PASSIVE_VISIT])
      .setTargetFilter((player, me) => {
        return TARGET_FILTER.LIVING(player) && TARGET_FILTER.NOT_TEAM(player);
      });
  }

  execute() {
    const game = this.from.game,
      actions = game.getActions(),
      targetAction = actions.find(action => {
        return action.from.role.team !== "mafia"
          && !action.type.includes(ACTION_TYPE.NON_VISIT)
          && action.target === this.target;
      });
    if (targetAction) {
      const attack = new AmbushAttackAction(this.from, targetAction.from);
    }
  }
}

class Ambusher extends BaseRole {
  constructor(player) {
    super(player, "Ambusher");
    this.setType(["mafia", "killing"])
      .setTeam("mafia")
      .setDescription("You are a stealthy killer who lies in wait for the perfect moment to strike.")
      .setWinsWith([
        "mafia"
      ]);
  }

  getNightActions() {
    if (!this.player.isAlive) {return;}
    return [new AmbushAction(this.player)];
  }

}

module.exports = Ambusher;
