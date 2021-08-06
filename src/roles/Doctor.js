const BaseRole = require("./BaseRole");

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

  

}
