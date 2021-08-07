const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER, ATTACK} = require("../enum");

class SelfJusticeAction extends Action {
  constructor(from) {
    super(from);
    this.setType(["self-justice", "control-immune", "jail-bypass", "transport-immune", "roleblock-immune"])
      .setAttack(ATTACK.UNSTOPPABLE)
      .setPriority(1);
    this.setTarget(from);
  }
}

class ShootAction extends Action {
  constructor(from) {
    super(from);
    this.setTargetFilter((player, me) => {
        return TARGET_FILTER.NOT_SELF(player, me) && TARGET_FILTER.LIVING(player);
      })
      .setType(["vigilante-shoot"])
      .setPriority(5)
      .setAttack(ATTACK.BASIC);
  }

  execute() {
    this.from.additionalInformation.vigilanteBulletsLeft--;
  }

  // TODO: implement.
  isSuccessful() {}

  onSuccess() {
    if (this.target.role.team === "town") {
      this.from.additionalInformation.vigilanteSelfJustice = true;
      // just for fun.
      this.from.additionalInformation.vigilanteBulletsLeft = 1;
    }
  }

}

class Vigilante extends BaseRole {
  constructor(player) {
    super(player, "Vigilante");
    this.setType(["town", "killing"])
      .setTeam("town")
      .setDescription("You are a militant cop who takes the law into your own hands.")
      .setWinsWith([
        "town",
        ["neutral", "benign"]
      ]);
    this.additionalInformation = {
      vigilanteBulletsLeft: 3,
      vigilanteSelfJustice: false
    };
  }

  getNightActions() {
    if (this.additionalInformation.vigilanteSelfJustice) {
      this.getJailActions();
    } else if(this.additionalInformation.vigilanteBulletsLeft > 0) {
      return [new ShootAction(this.player)];
    }
  }

  getJailActions() {
    if (this.additionalInformation.vigilanteSelfJustice) {
      this.player.game.addAction(new SelfJusticeAction(this.player));
    }
  }

}

module.exports = Vigilante;
