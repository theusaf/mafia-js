const Role = require("./Role"),
  {ROLE_TAG, TEAM} = require("./enum");

class TownRole extends Role {
  constructor(name) {
    super(name);
    this.setTeam(TEAM.MAFIA);
    this.shouldSeeTeam = true;
  }
}

module.exports = TownRole;
