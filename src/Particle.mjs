import Vec2D from './Vec2D.mjs';

/**
 * @class
 */
export default class Particle {
  /**
   * TODO
   * @param {number} mass
   * @param {number} [time] Absolute time in seconds
   * @param {Vec2D} [position]
   * @param {Vec2D} [velocity]
   * @param {number} [coefficientOfRestitution]
   * @param {number} [dragCoefficient]
   * @param {number} [referenceArea]
   */
  constructor(
    mass,
    time = 0,
    position = new Vec2D(0, 0),
    velocity = new Vec2D(0, 0),
    coefficientOfRestitution = 1,
    dragCoefficient = 1,
    referenceArea = 1
  ) {
    this._accelerations = [];
    this._impacts = [];
    this._lastUpdate = time;
    this.mass = mass;
    this._position = position;
    this._velocity = velocity;
    this.dragCoefficient = dragCoefficient;
    this.referenceArea = referenceArea;
    this.coefficientOfRestitution = coefficientOfRestitution;
  }

  /**
   * TODO
   */
  get velocity() {
    return this._velocity;
  }

  /**
   * TODO
   */
  get position() {
    return this._position;
  }

  /**
   * TODO
   * @param {Vec2D} velocity
   * @param {number} mass
   * @param {number} [coefficientOfRestitution]
   * @return {Particle}
   */
  addImpact(velocity, mass, coefficientOfRestitution = null) {
    this._impacts.push({
      velocity,
      mass,
      coefficientOfRestitution,
    });
    return this;
  }

  /**
   * TODO
   * @param {Vec2D} value
   * @return {Particle}
   */
  addForce(value) {
    this.addAcceleration(Vec2D.multiply(value, 1 / this.mass));
    return this;
  }

  /**
   * TODO
   * @param {Vec2D} value
   * @return {Particle}
   */
  addAcceleration(value) {
    this._accelerations.push(value);
    return this;
  }

  /**
   * TODO
   * @param {number} time
   */
  update(time) {
    // Sum accelerations
    const accelerationSum = new Vec2D(0, 0);
    this._accelerations.forEach((acceleration) => {
      accelerationSum.add(acceleration);
    });

    // Update position + speed
    const duration = time - this._lastUpdate;
    this._position
      .add(Vec2D.multiply(accelerationSum, 0.5 * Math.pow(duration, 2)))
      .add(Vec2D.multiply(this._velocity, duration));
    this._velocity.add(Vec2D.multiply(accelerationSum, duration));

    // Clear stack
    this._accelerations = [];
    this._impacts = [];

    // Update time
    this._lastUpdate = time;
  }
}
