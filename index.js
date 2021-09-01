const Game = require("./src/Game"),
  roles = require("./src/roles"),
  ENUM = require("./src/enum");

for (const role of roles.roles) {
  const investigateWith = role.investigateWith ?? role;
  ENUM.INVESTIGATOR_GROUP.add(role, investigateWith);
}

ENUM.INVESTIGATOR_GROUP._end();

module.exports = {
  Game,
  roles: roles.roles,
  roleMap: roles.roleMap
};
