const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER, ATTACK, DEFENSE, ACTION_TYPE} = require("../enum");

class CounterAttackAction extends Action {
  constructor(from, target) {
    super(from);
    this.setPriority(5)
      .setType(["alert-response", ACTION_TYPE.ROLEBLOCK_IMMUNE, ACTION_TYPE.CONTROL_IMMUNE, ACTION_TYPE.TRANSPORT_IMMUNE, ACTION_TYPE.NON_VISIT])
      .setAttack(ATTACK.POWERFUL)
      .setTarget(target);
  }
}

class AlertAction extends Action {
  constructor(from) {
    super(from);
    this.setTargetFilter(TARGET_FILTER.SELF)
      .setPriority(1)
      .setType(["alert", ACTION_TYPE.ROLEBLOCK_IMMUNE, ACTION_TYPE.CONTROL_IMMUNE, ACTION_TYPE.NON_VISIT]);
  }

  execute() {
    this.addDetail("alertDefense", this.from, {
      player: {
        defense: DEFENSE.BASIC
      }
    });
    const game = this.from.game,
      actions = this.getActionsAgainstTarget(game.getActions(), true);
    for (const action of actions) {
      game.addAction(new CounterAttackAction(this.from, action.from));
    }
    this.from.additionalInformation.veteranAlertsLeft--;
  }
}

class Veteran extends BaseRole {
  constructor(player) {
    super(player, "Veteran");
    this.setType(["town", "killing"])
      .setTeam("town")
      .setDescription("You are a paranoid war hero who will shoot anyone who visits you.")
      .setWinsWith([
        "town"
      ]);
    this.selection.max = 1;
    this.additionalInformation = {
      veteranAlertsLeft: 3
    };
  }

  getNightActions() {
    if (!this.player.isAlive) {return;}
    if (this.additionalInformation.veteranAlertsLeft > 0) {
      return [new AlertAction(this.player)];
    }
  }

}

module.exports = Veteran;
