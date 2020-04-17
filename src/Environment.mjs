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
    this.gravity = new Vec2D(0, 0);
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
    this._particles.forEach((particle) => {
      this.detectCollisionByParticle(particle);
    });
  }

  /**
   * TODO max rekursion
   * @param {Particle} particle
   * @param {number} depth
   */
  detectCollisionByParticle(particle, depth = 0) {
    const collisions = [];
    const v1x = particle.position.x - particle._lastPosition.x;
    const v1y = particle.position.y - particle._lastPosition.y;

    this._borders.forEach((border) => {
      const v2x = border.to.x;
      const v2y = border.to.y;
      const v1sx = particle._lastPosition.x;
      const v1sy = particle._lastPosition.y;
      const v2sx = border.from.x;
      const v2sy = border.from.y;

      if ((v1x * v2y) / v1y === v2x) return;

      let x;
      let y;
      if (v1y === 0) {
        y = (v1sy - v2sy) / v2y;
        x = (v2sx + v2x * y - v1sx) / v1x;
      } else {
        y =
          (v2sx - v1sx - (v1x / v1y) * (v2sy - v1sy)) /
          (v1x * (v2y / v1y) - v2x);
        x = (v2sy + v2y * y - v1sy) / v1y;
      }
      if (x > 0 && x <= 1 && y >= 0 && y <= 1) {
        collisions.push({
          x,
          border,
        });
      }
    });
    if (collisions.length > 0) {
      const collision = collisions.sort((e1, e2) => e1.x - e2.x)[0];
      this.particleBorderCollision(
        particle,
        Math.floor(collision.x * 1000) / 1000,
        collision.border
      );
      if (depth < 10) {
        this.detectCollisionByParticle(particle, depth + 1);
      } else {
        console.log('MAX DEPTH!!');
      }
    }
  }

  /**
   * TODO
   * @param {Particle} particle
   * @param {number} x
   * @param {Border} border
   */
  particleBorderCollision(particle, x, border) {
    const wayTotal = particle._position
      .clone()
      .subtract(particle._lastPosition);
    const wayDone = wayTotal.multiply(x);
    particle._lastPosition.add(wayDone);
    const oldVel = particle.velocity.magnitude;
    particle.impact(border.to);
    const newVel = particle.velocity.magnitude;
    particle._position = particle._lastPosition
      .clone()
      .add(
        particle.velocity.unitVector.multiply(
          (newVel / oldVel) * (wayTotal.magnitude - wayDone.magnitude)
        )
      );
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
