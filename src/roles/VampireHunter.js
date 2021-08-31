const TownRole = require("../TownRole"),
  Action = require("../Action"),
  Vampire = require("./Vampire"),
  Vigilante = require("./Vigilante"),
  {ACTION_TAG, TARGET_FILTER, ATTACK, PRIORITY} = require("../enum");

class VampireHunter extends TownRole {
  constructor() {
    super("Vampire Hunter");
    this.setDescription("You will do whatever it takes to eliminate the Vampires.");
    this.setType(["town", "killing"]);
    this.selection.require = "Vampire";
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    return [new CheckAction(this.player), new CounterStakeAction(this.player)];
  }

  afterNightSetup() {
    const {game} = this.player;
    let noMoreVamps = true;
    for (const player of game.players) {
      if (player.isAlive() && player.role instanceof Vampire) {
        noMoreVamps = false;
        break;
      }
    }
    if (noMoreVamps) {
      const vigi = new Vigilante;
      vigi.setPlayer(this.player);
      vigi.additionalInformation.bulletsLeft = 1;
      this.player.role = vigi;
    }
  }
}

class CheckAction extends Action {
  constructor(initiator) {
    super(initiator);
    // high priority for ensuring attack is only granted for vampires
    this.setPriority(PRIORITY.CANCELLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    const {role} = this.target.player;
    if (role instanceof Vampire) {
      const stake = new StakeAction(this.initiator, this);
      this.stakeAction = stake;
      this.target.targetActions.add(stake);
    }
  }

  cancel(reason, action) {
    if (this.stakeAction) {
      this.stakeAction.cancel(reason, this);
    }
    super.cancel(reason, action);
  }

}

class CounterStakeAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setTarget(initiator);
    // higher priority over vampires...
    this.setPriority(PRIORITY.STATE_CHANGERS);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
  }

  notPerformed() {
    return false;
  }

  execute() {
    const {targetActions} = this.initiator;
    for (const action of targetActions) {
      const {initiator} = action;
      if (initiator.role instanceof Vampire) {
        action.cancel("Vampire Hunter - Counter", this);
        action.targetActions.add(new StakeAction(this.initiator, {
          target: initiator
        }));
      }
    }
  }

}

class StakeAction extends Action {
  constructor(initiator, parent) {
    super(initiator);
    this.setTarget(parent.target);
    this.setAttack(ATTACK.BASIC);
    this.setPriority(PRIORITY.KILLERS);
  }
}

module.exports = VampireHunter;
module.exports.investigateWith = require("./Survivor");
