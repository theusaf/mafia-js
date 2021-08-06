const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER} = require("../enum");

class HealAction extends Action {

  constructor(isSelfHeal) {
    super();
    if (isSelfHeal) {
      this.setTargetFilter(TARGET_FILTER.SELF);
    }
    this.setType(["heal"]);
  }

};

class Doctor extends BaseRole {
  constructor(player) {
    super(player, "Doctor");
    this.setType(["town", "protective"])
      .setTeam("town")
      .setDescription("a surgeon skilled in trauma care who secretly heals people.")
      .setWinsWith([
        "town",
        ["neutral", "benign"]
      ]);
    this.additionalInformation = {
      doctorSelfHealsLeft: 1
    };
  }

  getNightActions() {
    return [new HealAction, new HealAction(true)];
  }

}

module.exports = Doctor;
