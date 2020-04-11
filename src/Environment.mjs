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
   * @param {Border} border
   * @return {Environment}
   */
  addBorder(border) {
    this._borders.push(border);
    return this;
  }

  /**
   * TODO
   */
  detectCollisions() {
    // TODO: multiple collisions?
    this._particles.forEach((particle) => {
      this._borders.forEach((border) => {
        const v1x = particle.position.x - particle._lastPosition.x;
        const v1y = particle.position.y - particle._lastPosition.y;

        // TODO: 0 division
        if (v1y === 0) {
          return;
        }

        const v2x = border.to.x;
        const v2y = border.to.y;
        const v1sx = particle._lastPosition.x;
        const v1sy = particle._lastPosition.y;
        const v2sx = border.from.x;
        const v2sy = border.from.y;
        const y =
          (v2sx - v1sx - (v1x / v1y) * (v2sy - v1sy)) /
          (v1x * (v2y / v1y) - v2x);
        const x = (v2sy - v1sy + v2y * y) / v1y;
        if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
          // TODO: be more exact
          particle._position.x = particle._lastPosition.x + v1x * x * 0;
          particle._position.y = particle._lastPosition.y + v1y * x * 0;
          particle._lastPosition.x = particle.position.x;
          particle._lastPosition.y = particle.position.y;
          particle.impact(border.to); // todo: recursion?
        }
      });
    });
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
      const density = 0.2;
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
