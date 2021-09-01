/*
  Non-TOS role
  - wins with (non town, non mafia)
  - min 2; max 2
  - night action (1): can check a player to see if they are the one
  -- if target IS the one:
  --- if target also is visiting player:
  ---- if another lover:
  ----- they find each other, marriage announced in day
        - "Two Star-Crossed Lovers have united, taking the Vest from the Town, and the Gun from the Mafia"
  ---- else:
  ----- "you stare into the other's eyes, but they are not the one"
  --- else:
  ---- if another lover:
  ----- see (else)
        other player notified: "you feel the gaze of your fated one upon your back"
  ---- else:
  ----- you look at your target, but are not sure if they are the one.

  - upon marriage:
  -- gains BASIC defense
  - night action (2): can attack with a BASIC attack.
*/

const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Action = require("../Action"),
  {TEAM, DEFENSE, ATTACK, TARGET_FILTER, PRIORITY, ACTION_TAG} = require("../enum");

class StarCrossedLover extends NeutralInnocentRole {
  constructor() {
    super("Star Crossed Lover");
    this.setType(["neutral", "killing"]);
    this.setGoal("Find true love and kill the town and mafia who oppose you.");
    this.setDescription("You are a person who wants to be alone with the one they love.");
    this.setWinsWith([role => role.team !== TEAM.TOWN && role.team !== TEAM.MAFIA]);
    this.selection.max = 2;
    this.selection.min = 2;
    this.additionalInformation = {
      hasFoundLove: false,
      hasBrokenHeart: false
    };
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    if (this.additionalInformation.hasBrokenHeart) {
      return [new BrokenAction(this.player)];
    }
    if (this.additionalInformation.hasFoundLove) {
      return [new KillAction(this.player)];
    }
    return [new StareAction(this.player)];
  }

  afterNightSetup() {
    if (this.additionalInformation.hasBrokenHeart || this.player.isDead()) {
      return;
    }
    const {targetActions, game} = this.player,
      {players} = game;
    for (const player of players) {
      if (player.role instanceof StarCrossedLover && player.isDead()) {
        this.additionalInformation.hasBrokenHeart = true;
        return;
      }
    }
    if (this.additionalInformation.hasFoundLove) {return;}
    let foundAction, foundAction2;
    for (const action of targetActions) {
      if (action.isCanceled()) {continue;}
      if (!(action instanceof StareAction)) {continue;}
      if (action.initiator === this.player) {continue;}
      foundAction = action;
      break;
    }
    if (!foundAction) {return;}
    const {targetActions:targetActions2} = foundAction.initiator;
    for (const action of targetActions2) {
      if (action.isCanceled()) {continue;}
      if (!(action instanceof StareAction)) {continue;}
      if (action.initiator !== this.player) {continue;}
      foundAction2 = action;
      break;
    }
    if (!foundAction2) {return;}
    this.additionalInformation.hasFoundLove = true;
    this.setDefense(DEFENSE.BASIC);
  }

}

class KillAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setAttack(ATTACK.BASIC);
    this.setPriority(PRIORITY.KILLERS);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && target.role.getName(true) !== this.initiator.role.getName(true);
  }
}

class StareAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.INVESTIGATIVE);
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && TARGET_FILTER.NOT_SELF(target, this.initiator);
  }

  execute() {
    const {target} = this,
      {targetActions} = this.initiator;
    if (target.role instanceof StarCrossedLover) {
      for (const action of targetActions) {
        if (action instanceof StareAction && !action.isCanceled() && action.initiator !== this.initiator) {
          // they found each other!
        } else {
          // send message to other...
        }
      }
    } else {
      // Not the one
    }
  }
}

class BrokenAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.setPriority(PRIORITY.HIGHEST);
    this.setAttack(ATTACK.UNSTOPPABLE);
    this.setTarget(initiator);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
  }
}

module.exports = StarCrossedLover;
module.exports.investigateWith = require("./Investigator");
// NOTE: could be underpowered
