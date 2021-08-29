const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY, ACTION_EXECUTE, TEAM} = require("../enum");

class Framer extends MafiaRole {
  constructor() {
    super("Framer");
    this.setType(["mafia", "deception"]);
    this.setDescription("You are a skilled counterfeiter who manipulates information.");
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new FrameAction(this.player)];
  }

  afterNightSetup() {
    const actions = this.player.game.collectPositionedActions().filter(action => action.initiator === this.player);
    for (const action of actions) {
      const {target} = action,
        {targetActions} = target;
      for (const ta of targetActions) {
        if (ta.tags.has(ACTION_TAG.INVESTIGATIVE) && !ta.isCanceled()) {
          targetActions.delete(action);
          break;
        }
      }
    }
  }
}

class FrameAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.persistent = true;
    this.setPriority(PRIORITY.STATE_CHANGERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    const {target} = this;
    Object.assign(target.role.modifiedStats, {
      name: "Framer"
    });
  }
}

module.exports = Framer;
