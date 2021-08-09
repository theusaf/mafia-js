const Role = require("./Role"),
  {ROLE_TAG, TEAM} = require("./enum");

class TownRole extends Role {
  constructor(name) {
    super(name);
    this.setTeam(TEAM.TOWN);
    this.tags.add(ROLE_TAG.DETECTION_IMMUNE);
  }
}

module.exports = TownRole;
