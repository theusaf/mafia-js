const Role = require("./Role"),
  {ROLE_TAG, TEAM} = require("./enum");

class MafiaRole extends Role {
  constructor(name) {
    super(name);
    this.setTeam(TEAM.MAFIA);
    this.tags.add(ROLE_TAG.VAMPIRE_DEATH);
    this.shouldSeeTeam = true;
  }
}

module.exports = MafiaRole;
