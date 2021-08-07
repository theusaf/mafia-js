const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  Detail = require("../Detail"),
  {TARGET_FILTER} = require("../enum");

class TransportAction extends Action {
  constructor(from) {
    super(from);
    this.setTargetFilter(TARGET_FILTER.LIVING)
      .setType(["transport", "roleblock-immune", "control-immune", "transport-immune"])
      .setPriority(1);
  }

  execute() {
    const game = this.from.game,
      actions = game.getActions(),
      otherAction = actions.find(action => action.from === this.from && action instanceof TransportAction2);
    // nobody else was transported
    if (!otherAction) {return;}
    const firstTarget = this.target,
      secondTarget = otherAction.target,
      firstTargetActions = actions.filter(action => {
        return action.target === firstTarget
          && action !== this
          && !action.type.includes("transport-immune");
      }),
      secondTargetActions = actions.filter(action => {
        return action.target === secondTarget
          && action !== otherAction
          && !action.type.includes("transport-immune");
      });
    // begin swapping!
    for (const action of firstTargetActions) {
      action.target = secondTarget;
    }
    for (const action of secondTargetActions) {
      action.target = firstTarget;
    }
  }
}

class TransportAction2 extends TransportAction {
  constructor(from, firstAction) {
    super(from);
    this.firstAction = firstAction;
    this.setTargetFilter((player, me) => {
      return TARGET_FILTER.LIVING(player)
        && player !== this.firstAction.target;
    })
  }

  execute() {}

}

class Transporter extends BaseRole {
  constructor(player) {
    super(player, "Transporter");
    this.setType(["town", "support"])
      .setTeam("town")
      .setDescription("Your job is to transport people without asking any questions.")
      .setWinsWith([
        "town",
        ["neutral", "benign"]
      ]);
  }

  getNightActions() {
    const action1 = new TransportAction(this),
      action2 = new TransportAction2(this, action1);
    return [action1, action2];
  }

}

module.exports = Doctor;
