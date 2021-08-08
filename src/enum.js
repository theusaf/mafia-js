const ENUM = {
  STAGE: {
    GAME_START: 0,
    NIGHT: 1, // where the majority of actions take place
    CALCULATION: -1, // after night, calculating results
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
    NOT_TEAM: (player, me) => !ENUM.TARGET_FILTER.TEAM(player, me),
    ALIVE_NOT_SELF: (player, me) => ENUM.TARGET_FILTER.LIVING(player, me) && ENUM.TARGET_FILTER.NOT_SELF(player, me),
    ALIVE_TEAM: (player, me) => ENUM.TARGET_FILTER.LIVING(player, me) && ENUM.TARGET_FILTER.TEAM(player, me),
    ALIVE_NOT_TEAM: (player, me) => ENUM.TARGET_FILTER.LIVING(player, me) && ENUM.TARGET_FILTER.NOT_TEAM(player, me)
  },
  ACTION_TAG: {
    PASSIVE_VISIT: "passive_visit",
    NON_VISIT: "non_visit",
    BYPASS_JAIL: "bypass_jail",
    TRANSPORT_IMMUNE: "transport_immune"
  },
  ROLE_TAG: {
    ROLEBLOCK_IMMUNE: "roleblock_immune",
    CONTROL_IMMUNE: "control_immune",
    VAMPIRE_DEATH: "dies_to_vampire"
  },
  TEAM: {
    TOWN: "town",
    MAFIA: "mafia",
    COVEN: "coven",
    VAMPIRE: "vampire"
  },
  PRIORITY: {
    /**
     * HIGHEST: Priority for major changes, creating new actions, swapping actions, etc.
     */
    HIGHEST: 1,
    /**
     * CANCELLERS: Priority for 'cancellers' which cancel other actions and/or create new ones.
     */
    CANCELLERS: 2,
    /**
     * STATE_CHANGERS: Priority for actions which change states (defense, douses, protecting, etc.)
     */
    STATE_CHANGERS: 3,
    /**
     * INVESTIGATIVE: Priority for actions which investigate role information.
     */
    INVESTIGATIVE: 4,
    /**
     * KILLERS: Priority for actions which deal damage or convert.
     */
    KILLERS: 5,
    /**
     * LOWEST: Priority for actions which need to wait for all other actions, or convert the role if not killed.
     */
    LOWEST: 6
  }
};

module.exports = ENUM;
