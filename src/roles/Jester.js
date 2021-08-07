const BaseRole = require("./BaseRole"),
  Action = require("../Action"),
  {TARGET_FILTER, ATTACK, ACTION_TYPE} = require("../enum");

class HauntAction extends Action {
  constructor(from) {
    super(from);
    this.setTargetFilter((player, me) => {
      // TODO: implement targetting abstains and guilties, but not innos
      return TARGET_FILTER.NOT_SELF(player, me) && TARGET_FILTER.LIVING(player);
    })
      .setCancelable(false)
      .setPriority(1)
      .setType(["jester-haunt", ACTION_TYPE.BYPASS_JAIL, ACTION_TYPE.TRANSPORT_IMMUNE, ACTION_TYPE.ROLEBLOCK_IMMUNE, ACTION_TYPE.CONTROL_IMMUNE])
      .setAttack(ATTACK.UNSTOPPABLE);
    const currentLivingPlayers = Array.from(from.game.players).filter(player => player.isAlive),
      randomLivingPlayer = currentLivingPlayers[Math.floor(Math.random() * currentLivingPlayers.length)];
    this.setTarget(randomLivingPlayer);
  }

  execute() {
    this.from.additionalInformation.jesterHasHaunted = true;
  }
}

class Jester extends BaseRole {
  constructor(player) {
    super(player, "Jester");
    this.setType(["neutral", "evil"])
      .setDescription("You are a crazed lunatic whose life goal is to be publicly executed.")
      .setWinsWith(["*"]);
    this.additionalInformation = {
      jesterTaskFailedSuccessfully: false,
      jesterHasHaunted: false
    };
  }

  afterVotingSetup() {
    // TODO: implement jester getting lynched victory
  }

  didWin() {
    return this.addAction.jesterTaskFailedSuccessfully;
  }

  getActions() {
    if (!this.player.isAlive && !this.additionalInformation.jesterHasHaunted && this.additionalInformation.jesterTaskFailedSuccessfully) {

    }
  }

}

module.exports = Jester;
