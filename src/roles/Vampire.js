const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Action = require("../Action"),
  {ACTION_TAG, ATTACK, DEFENSE, PRIORITY, TEAM, ROLE_TAG, TARGET_FILTER} = require("../enum");

class Vampire extends NeutralInnocentRole {
  constructor() {
    super("Vampire");
    this.setTeam(TEAM.VAMPIRE);
    this.setType(["neutral", "chaos"]);
    this.setDescription("You are among the undead who want to turn others at night.");
    this.additionalInformation = {
      isYoungest: false
    };
  }

  getNightActions() {
    if (this.player.isAlive() || !this.player.game.otherInformation.vampiresCanBite) {return;}
    return [new VoteAction(this.player)];
  }

  beforeGameSetup() {
    const vamps = this.getVamps(),
      youngest = vamps.find((vamp) => vamp.role.additionalInformation.isYoungest);
    if (!youngest) {
      this.additionalInformation.isYoungest = true;
    }
  }

  getVamps() {
    const vamps = [];
    for (const player of this.player.game.players) {
      if (TARGET_FILTER.TEAM(player, this.player) && TARGET_FILTER.LIVING(player)) {
        vamps.push(player);
      }
    }
    return vamps;
  }

  afterNightSetup() {
    const {game} = this.player,
      biteAction = game.collectPositionedActions().find((action) => {
        return action instanceof BiteAction && !action.isCanceled();
      });
    if (!game.otherInformation.vampiresCanBite) {
      game.otherInformation.vampiresCanBite = true;
    }
    if (biteAction) {
      const {target} = biteAction;
      if (target.isAlive()) {
        if (target.role.getDefense() === DEFENSE.NONE) {
          // successfully bitten?
          game.otherInformation.vampiresCanBite = false;
          biteAction.initiator.additionalInformation.isYoungest = false;
          const vamp = new Vampire;
          vamp.setPlayer(target);
          vamp.additionalInformation.isYoungest = true;
          target.role = vamp;
        }
      }
    }
    this.beforeGameSetup();
  }
}

class VoteAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.setPriority(PRIORITY.CANCELLERS + 0.5);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_TEAM(target, this.initiator);
  }

  execute() {
    if (this.additionalInformation.isYoungest) {
      const {game} = this.initiator,
        actions = game.collectPositionedActions().filter((action) => {
          return action instanceof VoteAction;
        }),
        finalTarget = actions[Math.floor(Math.random() * actions.length)];
      finalTarget.targetActions.add(new BiteAction(this.initiator, finalTarget));
    }
  }
}

class BiteAction extends Action {
  constructor(initiator, target) {
    super(initiator);
    this.setPriority(PRIORITY.KILLERS);
    this.setAttack(ATTACK.BASIC);
    this.setTarget(target);
  }

  execute() {
    const {role} = this.target;
    if (role instanceof Vampire) {return;}
    if (role.getDefense() > DEFENSE.NONE || role.tags.has(ROLE_TAG.VAMPIRE_DEATH) || this.initiator.getVamps().length >= 4) {
      super.execute();
    }
  }
}

module.exports = Vampire;
