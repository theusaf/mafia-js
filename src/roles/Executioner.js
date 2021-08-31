const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Jester = require("./Jester"),
  {DEFENSE, TEAM} = require("../enum"),
  roleFilter = (role) => role.team === TEAM.TOWN && role.name !== "Mayor" && role.name !== "Jailor";

class Executioner extends NeutralInnocentRole {
  constructor() {
    super("Executioner");
    this.setType(["neutral", "evil"]);
    this.setDescription("You are an obsessed lyncher who will stop at nothing to execute your target.");
    this.setDefense(DEFENSE.BASIC);
    this.additionalInformation = {
      target: null,
      hasWon: false
    };
    this.selection.require = roleFilter;
  }

  beforeGameSetup() {
    const possibleTargets = this.player.game.players.filter((player) => {
      const {role} = player;
      return roleFilter(role);
    });
    this.target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
  }

  afterNightSetup() {
    if (this.additionalInformation.target.isDead() && !this.additionalInformation.hasWon && this.player.isAlive()) {
      // convert to jester
      const jest = new Jester();
      jest.setPlayer(this.player);
      this.player.role = jest;
    }
  }

  afterVotingSetup() {
    const {game} = this.player,
      {voteInformation} = game;
    if (voteInformation.votedTarget === this.additionalInformation.target && this.player.isDead()) {
      this.additionalInformation.hasWon = true;
    }
  }
}

module.exports = Executioner;
module.exports.investigateWith = require("./Sheriff");
