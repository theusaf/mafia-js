const Role = require("../../Role");

class Cleaned extends Role {
  constructor(original = {}) {
    super("Cleaned");
    this.setPlayer(original.player);
    this.originalRole = original;
  }
}

module.exports = Cleaned;
