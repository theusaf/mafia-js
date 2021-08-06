const ENUM = {
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
    ALL: () => true,
    SELF: (player, me) => player === me,
    NOT_SELF: (player, me) => player !== me,
    LIVING: (player) => player.isAlive,
    DEAD: (player) => !ENUM.TARGET_FILTER.LIVING(player),
    TEAM: (player, me) => player.role.team === me.role.team,
    NOT_TEAM: (player, me) => !ENUM.TARGET_FILTER.TEAM(player, me)
  }
};

module.exports = ENUM;
