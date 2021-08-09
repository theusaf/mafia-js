const Role = require("./Role"),
  {ROLE_TAG, TEAM} = require("./enum");

class NeutralInnocentRole extends Role {
  constructor(name) {
    super(name);
    this.setTeam(TEAM.NONE);
    this.tags.add(ROLE_TAG.DETECTION_IMMUNE);
  }
}

module.exports = NeutralInnocentRole;
