const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {TEAM, ROLE_TAG, ACTION_TAG, TARGET_FILTER, ATTACK, PRIORITY, ACTION_EXECUTE} = require("../enum");
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
    return !this.target || !this.targetAction.target;
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
    const [usedAction] = targetActions;
    usedAction.initiator = target;
    usedAction.target = this.targetAction.target;
    this.targetAction.target.targetActions.add(usedAction);
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
