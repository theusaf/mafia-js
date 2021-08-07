const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  Detail = require("../Detail"),
  {TARGET_FILTER, ACTION_TYPE} = require("../enum");

class DistractAction extends Action {
  constructor(from) {
    super(from);
    this.setType("escort-block", ACTION_TYPE.ROLEBLOCK_IMMUNE)
      .setPriority(2)
      .setTargetFilter((player, me) => TARGET_FILTER.LIVING(player) && TARGET_FILTER.NOT_SELF(player, me));
  }

  execute() {
    const game = this.from.game,
      actions = game.getActions(),
      targetActions = actions.filter(action => action.from === this.target),
      validActions = targetActions.filter(action => !action.type.includes(ACTION_TYPE.ROLEBLOCK_IMMUNE));
    for (const action of validActions) {
      action.addDetail(new Detail("cancel", this.from));
    }
  }
}

class Escort extends BaseRole {
  constructor(player) {
    super(player, "Doctor");
    this.setType(["town", "support"])
      .setTeam("town")
      .setDescription("You are a beautiful person skilled in distraction.")
      .setWinsWith(["town"]);
  }

  getNightActions() {
    if (!this.player.isAlive) {return;}
  }

}

module.exports = Escort;
