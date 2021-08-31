const MafiaRole = require("../MafiaRole"),
  Action = require("../Action"),
  Mafioso = require("./Mafioso"),
  {TARGET_FILTER, PRIORITY, ATTACK, ACTION_TAG, DEFENSE, ROLE_TAG} = require("../enum");

class Godfather extends MafiaRole {
  constructor() {
    super("Godfather");
    this.tags.add(ROLE_TAG.DETECTION_IMMUNE);
    this.setType(["mafia", "killing"]);
    this.setDefense(DEFENSE.BASIC);
    this.setDescription("You are the leader of organized crime.");
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new OrderAction(this.player)];
  }

}

function getMafioso(game) {
  const {players} = game;
  for (const player of players) {
    if (player.isDead()) {
      continue;
    }
    if (player.role instanceof Mafioso) {
      return player;
    }
  }
}

class OrderAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
    // high priority for ensuring attack is only granted if mafioso is not roleblocked
    this.setPriority(PRIORITY.CANCELLERS + 0.5);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    const {game} = this.initiator,
      mafioso = getMafioso(game),
      {target} = this,
      {targetActions} = target;
    if (mafioso) {
      if (mafioso.actions[0]?.isCanceled() || mafioso.effectData.jailed) {
        targetActions.add(new AttackAction(this.initiator, target));
      } else {
        mafioso.actions[0]?.cancel("Godfather order", this);
        targetActions.add(new AttackAction(mafioso, target));
      }
    } else {
      targetActions.add(new AttackAction(this.initiator, target));
    }
  }

  cancel(reason, action) {
    if (this.attackAction) {
      this.attackAction.cancel(reason, this);
    }
    super.cancel(reason, action);
  }

}

class AttackAction extends Action {
  constructor(initiator, target) {
    super(initiator);
    this.setTarget(target);
    this.setAttack(ATTACK.BASIC);
    this.setPriority(PRIORITY.KILLERS);
  }
}

module.exports = Godfather;
module.exports.investigateWith = require("./Bodyguard");
