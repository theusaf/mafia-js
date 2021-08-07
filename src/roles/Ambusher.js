const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER, ATTACK, DEFENSE} = require("../enum");

class AmbushAttackAction extends Action {

}

class AmbushAction extends Action {
  constructor(from) {
    super(from);
    this.setPriority(1)
      .setType(["ambush-prepare", "transport-immune", "passive-visit"])
      .setTargetFilter((player, me) => {
        return TARGET_FILTER.LIVING(player) && TARGET_FILTER.NOT_TEAM(player);
      });
  }

  execute() {
    const game = this.from.game,
      actions = game.getActions(),
      
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

  }

}

module.exports = Ambusher;
