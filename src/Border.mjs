/**
 * @class
 */
export default class Border {
  /**
   * TODO
   * @param {Vec2D} from
   * @param {Vec2D} to
   * @param {number} [restitution]
   */
  constructor(from, to, restitution = null) {
    this.from = from;
    this.to = to;
    this.restitution = restitution;
  }
}
