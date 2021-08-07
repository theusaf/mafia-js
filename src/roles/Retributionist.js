const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER} = require("../enum");

class CopiedAction extends Action {
  constructor(from, reviveAction) {
    super(from);
    this.reviveAction = reviveAction;
    this.setTargetFilter(TARGET.LIVING);
  }
}

class ReviveAction extends Action {
  constructor(from) {
    super(from);
    this.setTargetFilter(player => {
        return TARGET_FILTER.TEAM(player) && TARGET_FILTER.DEAD(player) && !["Trapper", "Jailor", "Veteran", "Mayor", "Medium", "Transporter", "Retributionist"].includes(player.role.name);
      })
      .setPriority(1)
      .setType(["retribute", "transport-immune", "roleblock-immune", "control-immune"]);
  }

  execute() {
    const game = this.from.game,
      actions = game.getActions(),
      targetRole = this.target.role,
      roleConstructor = targetRole.constructor,
      fakePlayer = {isAlive: true},
      role = new roleConstructor(fakePlayer),
      actions = role.getNightActions();
    if (actions.length > 1) {
      throw new Error("Role actions invalid: " + roleConstructor.name);
    }
    const [action2] = actions,
      {priority} = action2;
    if (priority === 1) {return;}
    action2.from = this.from;
    const otherAction = actions.find(action => action.from === this.from && action instanceof CopiedAction);
    if (!otherAction) {return;}
    action2.target = otherAction.target;
    game.addAction(action2); // TODO: ensuure this works
  }
}

class Retributionist extends BaseRole {
  constructor(player) {
    super(player, "Retributionist");
    this.setType(["town", "support"])
      .setTeam("town")
      .setDescription("You are a powerful mystic that can raise the true-hearted dead.")
      .setWinsWith(["town"]);
    this.selection.max = 1;
    this.additionalInformation = {
      retributionistTargetsSeanced: []
    };
  }

  getNightActions() {
    if (!this.player.isAlive) {return;}
    return [
      new
    ]
  }

}

module.exports = Retributionist;
