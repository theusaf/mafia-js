const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Action = require("../Action"),
  {ACTION_TAG, ATTACK, VOTE} = require("../enum");

class Jester extends NeutralInnocentRole {
  constructor() {
    super("Jester");
    this.setType(["neutral", "evil"]);
    this.setDescription("You are a crazed lunatic whose life goal is to be publicly executed.");
    this.setGoal("Get yourself lynched by any means necessary.");
    this.additionalInformation = {
      taskFailedSuccessfully: false,
      hasActed: false
    };
  }

  getNightActions() {
    if (this.player.isAlive() || !this.additionalInformation.taskFailedSuccessfully || this.hasActed) {return;}
    return [new HauntAction(this.player)];
  }

  afterVotingSetup() {
    const {game} = this.player,
      {voteInformation} = game;
    if (voteInformation.votedTarget === this.player && this.player.isDead()) {
      this.additionalInformation.taskFailedSuccessfully = true;
    }
  }
}

class HauntAction extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ACTION_TAG.CONTROL_IMMUNE);
    this.tags.add(ACTION_TAG.NON_VISIT);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.tags.add(ACTION_TAG.BYPASS_JAIL);
    this.setPriority(1);
    this.setAttack(ATTACK.UNSTOPPABLE);
  }

  isValidTarget(target) {
    const {game} = this.player,
      {voteInformation} = game,
      {votes} = voteInformation,
      targets = new Set;
    for (const vote of votes) {
      if (vote.vote === VOTE.GUILTY) {
        targets.add(vote.voter);
      }
    }
    return targets.has(target);
  }

  execute() {
    this.initiator.role.additionalInformation.hasActed = true;
    super.execute();
  }
}

module.exports = Jester;
module.exports.investigateWith = require("./Framer");
