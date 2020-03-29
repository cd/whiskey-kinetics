import Vec2D from './Vec2D.mjs';

/**
 * @class
 */
export default class Link {
  /**
   * TODO
   * @param {MassPoint} from
   * @param {MassPoint|Vec2D} to
   * @param {number} length
   */
  constructor(from, to, length) {
    this._from = from.position;

    // TODO: Keep reference?
    // TODO: Better check if it is an instance of Particle?
    this._to = Object.hasOwnProperty.call(to, 'position') ? to.position : to;

    this._length = length; // todo: default auto distance from-to
    this._springConstant = 100;
    this._dampingCoefficient = 1;
  }

  /**
   * TODO
   * @return {Vec2D}
   */
  getVector() {
    return new Vec2D(this.from.x - this.to.x, this.from.y - this.to.y);
  }

  /**
   * TODO
   * @return {number}
   */
  getSpringLength() {
    return Math.sqrt(
      Math.pow(this.from.x - this.to.x, 2) +
        Math.pow(this.from.y - this.to.y, 2)
    );
  }

  /**
   * TODO
   * @return {Vec2D}
   */
  getSpringForceVec() {
    const force = (this.getSpringLength() - this.length) * this.springConstant;
    return this.getVector().unitVector.multiply(force);
  }
}
