import Vec2D from './Vec2D.mjs';

/**
 * @class
 */
export default class Environment {
  /**
   * TODO
   * @param {number} [time] Absolute time in seconds
   */
  constructor(time) {
    this.gravity = new Vec2D(0, -9.81);
    this._lastUpdate = time || 0;
    this._particles = [];
    this._fluids = [];
    this._links = [];
    this._borders = [];
  }

  /**
   * TODO
   * @param {Particle} particle
   * @return {Environment}
   */
  addParticle(particle) {
    this._particles.push(particle);
    return this;
  }

  /**
   * TODO
   * @param {number} time Absolute time in seconds
   */
  update(time) {
    this._particles.forEach((particle) => {
      // Gravity
      particle.addAcceleration(this.gravity);

      // Speed Resistance (TODO)
      const density = 1.2;
      const force =
        (Math.pow(particle.velocity.magnitude, 2) *
          particle.referenceArea *
          particle.dragCoefficient *
          density) /
        2;
      particle.addForce(particle.velocity.unitVector.multiply(-1 * force));

      // Calc position + velocity
      particle.update(time);

      this._lastUpdate = time;
    });
  }
}
