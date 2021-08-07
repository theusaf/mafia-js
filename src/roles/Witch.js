const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER, ACTION_TYPE} = require("../enum");

class ControlTargetAction extends Action {
  constructor(from) {
    this.setTargetFilter(TARGET_FILTER.LIVING)
      .setType(["witch-control-target"]);
  }
}

class ControlAction extends Action {
  constructor(from, targetAction) {

  }
}

class Witch extends BaseRole {
  constructor(player) {
    super(player, "Witch");
    this.setType(["neutral", "evil"])
      .setTeam("coven")
      .setDescription("YYou are a voodoo master who can control other peoples actions.")
      .setWinsWith([(role) => role.team !== "town"]);
    this.additionalInformation = {
      witchMagicalDefenseLeft: 1
    };
  }

  getNightActions() {
    if (!this.player.isAlive) {return;}
  }

}

module.exports = Witch;
