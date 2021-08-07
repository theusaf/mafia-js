class Action {
  constructor() {
    this.target = null;
  }

  /**
   * execute - Executed at the end of the night. Should return actions to add to targets.
   *
   * @return {Action[]}
   */
  execute() {

  }

  getTargetFilter() {}

  setTarget(target) {}

  notPerformed() {}

  cancel(reason, cancelAction) {}
}

module.exports = Action;
