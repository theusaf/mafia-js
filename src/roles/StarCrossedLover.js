/*
  Non-TOS role
  - wins with (non town, non mafia)
  - min 2; max 2
  - night action (1): can check a player to see if they are the one
  -- if target IS the one:
  --- if target also is visiting player:
  ---- if another lover:
  ----- they find each other, marriage announced in day
        - "Two Star-Crossed Lovers have united, taking the Vest from the Town, and the Gun from the Mafia"
  ---- else:
  ----- "you stare into the other's eyes, but they are not the one"
  --- else:
  ---- if another lover:
  ----- see (else)
        other player notified: "you feel the gaze of your fated one upon your back"
  ---- else:
  ----- you look at your target, but are not sure if they are the one.

  - upon marriage:
  -- gains BASIC defense
  - night action (2): can attack with a BASIC attack.
*/

const NeutralInnocentRole = require("../NeutralInnocentRole");

class StarCrossedLover extends NeutralInnocentRole {
  constructor() {
    super("Star Crossed Lover");
    this.setType(["neutral", "killing"]);
    this.setGoal("Find true love and kill the town and mafia who oppose you.");
    this.setDescription("You are a person who wants to be alone with the one they love.");
    this.setWinsWith([role => role.team !== TEAM.TOWN && role.team !== TEAM.MAFIA]);
    this.selection.max = 2;
    this.selection.min = 2;
  }
}

module.exports = StarCrossedLover;
