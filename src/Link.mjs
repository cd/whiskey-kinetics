import Vec2D from './Vec2D.mjs';

/**
 * @class
 */
export default class Link {
  /**
   * TODO
   * @param {MassPoint} from
   * @param {MassPoint|Vec2D} to
   * @param {boolean} [compressible]
   * @param {number} [timestamp]
   * @param {number} [norminalLength]
   */
  constructor(
    from,
    to,
    compressible = true,
    timestamp = 0,
    norminalLength = null
  ) {
    this._fromParticle = from;
    this._toParticle = to;
    this._compressible = compressible;
    this._lastUpdate = timestamp;
    this._norminalLength =
      norminalLength === null
        ? this._toParticle.position
            .clone()
            .subtract(this._fromParticle.position).magnitude
        : norminalLength;
    this._springConstant = 10000;
    this._dampingCoefficient = 0;
    this._lastLength = this.length;

    // TODO: differentiate between tension and pressure?
    this.maxSpringForce = 3000;

    this.destroyed = false;
  }

  /**
   * TODO
   * @return {Vec2D}
   */
  getVector() {
    return this._toParticle.position
      .clone()
      .subtract(this._fromParticle.position);
  }

  /**
   * TODO
   * @return {number}
   */
  get length() {
    return this.getVector().magnitude;
  }

  /**
   * TODO
   * @return {Vec2D}
   */
  get springForce() {
    const lengthDiff = this.length - this._norminalLength;
    if (lengthDiff <= 0 && !this._compressible) return 0;
    return lengthDiff * this._springConstant;
  }

  /**
   * TODO
   * @param {number} timestamp
   */
  update(timestamp) {
    if (this.destroyed) return;
    const dampingForce =
      ((this._lastLength - this.length) / (timestamp - this._lastUpdate)) *
      this._dampingCoefficient;
    const forceVec = this.getVector().unitVector.multiply(
      this.springForce - dampingForce
    );
    if (forceVec.magnitude > this.maxSpringForce) {
      this.destroyed = true;
      return;
    }
    this._fromParticle.addForce(forceVec);
    if (this._toParticle) {
      const newForce = forceVec.clone().multiply(-1);
      this._toParticle.addForce(newForce);
    }
  }
}
