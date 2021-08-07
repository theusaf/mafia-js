const ENUM = {
  STAGE: {
    NIGHT: 1, // where the majority of actions take place
    PRE_DISCUSSION: 2, // notifying all about deaths and stuff
    DISCUSSION: 3, // discussion
    VOTING: 4, // voting to lynch someone
    VOTE_DEFENSE: 5, // someone's testimony
    VOTE_LYNCH: 6 // whether guilty/innocent
  },
  ACTION_EXECUTE: {
    NIGHT_END: 0,
    IMMEDIATELY: 1,
    NIGHT_START: 2
  },
  ATTACK: {
    NONE: 0,
    BASIC: 1,
    POWERFUL: 2,
    UNSTOPPABLE: 3
  },
  DEFENSE: {
    NONE: 0,
    BASIC: 1,
    POWERFUL: 2,
    INVINCIBLE: 3
  },
  TARGET_FILTER: {
    NONE: () => false,
    ALL: () => true,
    SELF: (player, me) => player === me,
    NOT_SELF: (player, me) => player !== me,
    LIVING: (player) => player.isAlive,
    DEAD: (player) => !ENUM.TARGET_FILTER.LIVING(player),
    TEAM: (player, me) => player.role.team === me.role.team,
    NOT_TEAM: (player, me) => !ENUM.TARGET_FILTER.TEAM(player, me)
  },
  // Currently, these are tags that have to be implemented in each role
  ACTION_TYPE: {
    // Action cannot be transported
    TRANSPORT_IMMUNE: "transport_immune",
    // Action is a passive visit, so certain things (traps, bodyguard) do not take effect
    PASSIVE_VISIT: "passive_visit",
    // Action is executed, but does not actually count as a visit.
    NON_VISIT: "non_visit",
    // Cannot be cancelled
    ROLEBLOCK_IMMUNE: "roleblock_immune",
    // Action will still execute if target is jailed
    BYPASS_JAIL
  }
};

module.exports = ENUM;
