const TownRole = require("../TownRole"),
  Action = require("../Action"),
  {ROLE_TAG, ACTION_TAG, TARGET_FILTER, PRIORITY} = require("../enum");

class Transporter extends TownRole {

  constructor() {
    super("Transporter");
    this.setDescription("Your job is to transport people without asking any questions.");
    this.setType(["town", "support"]);
    this.tags.add(ROLE_TAG.ROLEBLOCK_IMMUNE);
    this.tags.add(ROLE_TAG.CONTROL_IMMUNE);
  }

  getNightActions() {
    if (this.player.isDead()) {return;}
    const target = new TransportTarget(this.player),
      main = new TransportAction(this.player, target);
    target.firstTransport = main;
    return [[main, target]];
  }

}

class TransportAction extends Action {
  constructor(initiator, transportAction2) {
    super(initiator);
    this.secondTransport = transportAction2;
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.setPriority(PRIORITY.HIGHEST);
  }

  position() {
    return [this, this.secondTransport];
  }

  execute() {
    const target1 = this.target,
      target2 = this.secondTransport.target,
      actions1 = [],
      actions2 = [];
    for (const action of target1.targetActions) {
      if (action !== this
        && !action.tags.has(ACTION_TAG.TRANSPORT_IMMUNE)
        && !action.isCanceled()) {
        actions1.push(action);
      }
    }
    for (const action of target2.targetActions) {
      if (action !== this
        && !action.tags.has(ACTION_TAG.TRANSPORT_IMMUNE)
        && !action.isCanceled()) {
        actions2.push(action);
      }
    }
    // begin swapping
    actions1.forEach(action => {
      action.target = target2;
      target1.delete(action);
      target2.add(action);
    });
    actions2.forEach(action => {
      action.target = target1;
      target2.delete(action);
      target1.add(action);
    });
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && this.secondTransport.target !== target;
  }

  notPerformed() {
    return !this.target || !this.secondTransport.target;
  }
}

class TransportTarget extends Action {
  constructor(initiator) {
    super(initiator);
    this.tags.add(ACTION_TAG.TRANSPORT_IMMUNE);
    this.firstTransport = null;
  }

  isValidTarget(target) {
    return TARGET_FILTER.LIVING(target) && this.firstTransport.target !== target;
  }

  notPerformed() {
    return true;
  }
}

module.exports = Transporter;
module.exports.investigateWith = require("./Escort");
