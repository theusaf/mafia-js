const NeutralInnocentRole = require("../NeutralInnocentRole"),
  Jester = require("./Jester"),
  {DEFENSE, TEAM} = require("../enum"),
  roleFilter = (role) => role.team === TEAM.TOWN && role.name !== "Mayor" && role.name !== "Jailor";

class Executioner extends NeutralInnocentRole {
  constructor() {
    super("Executioner");
    this.setType(["neutral", "evil"]);
    this.setDescription("You are an obsessed lyncher who will stop at nothing to execute your target.");
    this.setGoal("Get your target lynched at any cost.");
    this.setDefense(DEFENSE.BASIC);
    this.additionalInformation = {
      target: null,
      hasWon: false
    };
    this.selection.require = roleFilter;
  }

  beforeGameSetup() {
    const possibleTargets = [];
    this.player.game.repeatAllPlayers((player) => {
      const {role} = player;
      if (roleFilter(role)) {possibleTargets.push(player);}
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
    if (this.player.isDead()) {return;}
    const {game} = this.player,
      {voteInformation} = game;
    if (voteInformation.votedTarget === this.additionalInformation.target && this.player.isDead()) {
      this.additionalInformation.hasWon = true;
    }
  }
}

module.exports = Executioner;
module.exports.investigateWith = require("./Sheriff");
