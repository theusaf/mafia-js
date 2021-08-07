class Detail {
  constructor(detail, from, data) {
    /**
     * @param {String} detail The detail name
     *
     * Special ones:
     * - cancel: prevents the action's execute from running
     */
    this.detail = detail;
    /**
     * @param {Player} from The player the detail is from
     */
    this.from = from;
    /**
     * @param {Object} data The data about this detail.
     * Some special functionality:
     * .player
     * -- overwrites role attributes
     * .action
     * -- overwrites the targeted action's attributes
     */
    this.data = data || {};
  }
}
module.exports = Detail;
