const Role = require("./Role"),
  {ROLE_TAG, TEAM} = require("./enum");

class MafiaRole extends Role {
  constructor(name) {
    super(name);
    this.setTeam(TEAM.MAFIA);
    this.setGoal("Kill anyone that will not submit to the Mafia.");
    this.tags.add(ROLE_TAG.VAMPIRE_DEATH);
    this.shouldSeeTeam = true;
    this.selection.maxOfTeam = 4;
  }
}

module.exports = MafiaRole;
