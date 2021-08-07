const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  Detail = require("../Detail"),
  {TARGET_FILTER, ATTACK, DEFENSE} = require("../enum");

class HealAction extends Action {

  constructor(from, isSelfHeal) {
    super(from);
    if (isSelfHeal) {
      this.setTargetFilter(TARGET_FILTER.SELF);
    }
    this.setType(["heal"])
      .setPriority(3);
  }

  /**
   * execute - Adds a "heal" detail to attacks on the target
   */
  execute() {
    const game = this.from.game,
      actions = this.getActionsAgainstTarget(game.getActions(), true);
    for (const action of actions) {
      const attack = action.attack;
      if (attack > ATTACK.NONE) {
        action.addDetail(
          new Detail("heal", this.from, {
            player: {
              defense: DEFENSE.POWERFUL
            }
          })
        );
      }
    }
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
    return [new HealAction(this), new HealAction(this, true)];
  }

}

module.exports = Doctor;
