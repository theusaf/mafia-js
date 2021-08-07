const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER} = require("../enum");

class SeanceAction extends Action {
  constructor(from) {
    super(from);
    this.setType(["seance", "jail-bypass", "control-immune", "roleblock-immune", "transport-immune"])
      .setPriority(1)
      .setTargetFilter((player, me) => {
        return TARGET_FILTER.NOT_SELF(player, me) && TARGET_FILTER.LIVING(player);
      });
  }

  execute() {
    this.from.additionalInformation.mediumSeancesLeft--;
  }
}

class Medium extends BaseRole {
  constructor(player) {
    super(player, "Medium");
    this.setType(["town", "protective"])
      .setTeam("town")
      .setDescription("You are a secret psychic who talks with the dead.")
      .setWinsWith([
        "town"
      ]);
    this.additionalInformation = {
      mediumSeancesLeft: 1
    };
  }

  getDayActions() {
    if (this.additionalInformation.mediumSeancesLeft > 0) {
      return [new SeanceAction(this.player)];
    }
  }

}

module.exports = Medium;
