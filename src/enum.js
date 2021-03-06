class InvGroup {
  constructor() {
    this.groups = [];
    this.groupAddQueue = [];
  }

  add(role, withRole) {
    const group = this.get(withRole);
    if (group) {
      group.push(role);
    } else {
      const waits = this.groupAddQueue.filter((wait) => {
        return wait.role === withRole || wait.with === role;
      });
      if (waits.length > 0) {
        const group = [role];
        for (let i in waits) {
          const index = this.groupAddQueue.indexOf(waits[i]);
          this.groupAddQueue.splice(index, 1);
          group.push(waits[i].role);
        }
        this.groups.push(group);
      } else {
        this.groupAddQueue.push({
          role,
          with: withRole
        });
      }
    }
  }

  get(role) {
    return this.groups.find((group) => group.includes(role));
  }

  _end() {
    this.groups.push(...this.groupAddQueue.map((wait) => [wait.role]));
  }
}

const ENUM = {
  STAGE: {
    GAME_START: 0,
    PRE_GAME_DISCUSS: -2,
    NIGHT: 1, // where the majority of actions take place
    CALCULATION: -1, // after night, calculating results
    PRE_DISCUSSION: 2, // notifying all about deaths and stuff
    DISCUSSION: 3, // discussion
    VOTING: 4, // voting to lynch someone
    VOTE_DEFENSE: 5, // someone's testimony
    VOTE_LYNCH: 6, // whether guilty/innocent
    GAME_END: 7 // end of the game
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
    TEAM: (player, me) => player.role.getTeam() === me.role.team,
    NOT_TEAM: (player, me) => !ENUM.TARGET_FILTER.TEAM(player, me),
    ALIVE_NOT_SELF: (player, me) => ENUM.TARGET_FILTER.LIVING(player, me) && ENUM.TARGET_FILTER.NOT_SELF(player, me),
    ALIVE_TEAM: (player, me) => ENUM.TARGET_FILTER.LIVING(player, me) && ENUM.TARGET_FILTER.TEAM(player, me),
    ALIVE_NOT_TEAM: (player, me) => ENUM.TARGET_FILTER.LIVING(player, me) && ENUM.TARGET_FILTER.NOT_TEAM(player, me)
  },
  ACTION_TAG: {
    /**
     * @param {String} ENUM This is a special tag, which means that the "target" is actually an enum from a list
     * - isValidTarget should instead return an array of strings/values to select.
     */
    ENUM: "enum",
    NON_VISIT: "non_visit",
    BYPASS_JAIL: "bypass_jail",
    TRANSPORT_IMMUNE: "transport_immune",
    ROLEBLOCK_IMMUNE: "roleblock_immune",
    CONTROL_IMMUNE: "control_immune",
    INVESTIGATIVE: "investigative"
  },
  ROLE_TAG: {
    VAMPIRE_DEATH: "dies_to_vampire",
    ROLEBLOCK_IMMUNE: "roleblock_immune",
    CONTROL_IMMUNE: "control_immune",
    DETECTION_IMMUNE: "detection_immune"
  },
  TEAM: {
    TOWN: "town",
    MAFIA: "mafia",
    COVEN: "coven",
    VAMPIRE: "vampire",
    NONE: "none"
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
  },
  VOTE: {
    INNOCENT: -1,
    ABSTAIN: 0,
    GUILTY: 1
  },
  INVESTIGATOR_GROUP: new InvGroup
};

module.exports = ENUM;
