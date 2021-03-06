const TownRole = require("../TownRole"),
  Action = require("../Action"),
  Player = require("../Player"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY} = require("../enum");
// TODO: getting results from controlled role
class Retributionist extends TownRole {
  constructor() {
    super("Retributionist");
    this.setType(["town", "support"]);
    this.setDescription("You are a powerful mystic that can raise the true-hearted dead.");
    this.tags.add(ROLE_TAG.ROLEBLOCK_IMMUNE, ROLE_TAG.CONTROL_IMMUNE);
    this.selection.max = 1;
    this.additionalInformation = {
      targetsUsed: new Set
    };
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    const targetAction = new RetributeTarget(this.player),
      animateAction = new RetributeAction(this.player, targetAction);
    return [[targetAction, animateAction]];
  }
}

class RetributeAction extends Action {
  constructor(initiator, targetAction) {
    super(initiator);
    this.targetAction = targetAction;
    this.setPriority(PRIORITY.HIGHEST);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
  }

  notPerformed() {
    return !this.target || !this.targetActions.target;
  }

  isValidTarget(target) {
    return TARGET_FILTER.DEAD(target)
      && TARGET_FILTER.TEAM(target, this.initiator)
      && !["Jailor", "Mayor", "Veteran", "Medium", "Retributionist", "Transporter", "Psychic", "Trapper"].includes(target.role.getName())
      && !this.initiator.role.additionalInformation.targetsUsed.has(target);
  }

  execute() {
    const target = this.target,
      targetRole = target.role,
      targetConstructor = targetRole.constructor,
      copy = new targetConstructor();
    copy.player = new Player("fake", "id");
    const targetActions = copy.getNightActions();
    if (targetActions.length !== 1) {throw new RangeError("Targeted Role has an invalid number of actions. This is not allowed. " + targetRole);}
    let [usedAction] = targetActions;
    if (Array.isArray(usedAction)) {usedAction = usedAction[0];}
    usedAction.initiator = target;
    usedAction.target = this.targetActions.target;
    this.targetActions.target.targetActions.add(usedAction);
  }
}

class RetributeTarget extends Action {
  constructor(initiator) {
    super(initiator);
  }

  isValidTarget(target) {
    return TARGET_FILTER.ALIVE(target);
  }

  notPerformed() {return true;}
}

module.exports = Retributionist;
module.exports.investigateWith = require("./Medium");
