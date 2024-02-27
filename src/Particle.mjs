import Vec2D from "./Vec2D.mjs";

/**
 * @class
 */
export default class Particle {
  /**
   * TODO
   * @param {Vec2D} [position]
   * @param {number} [mass]
   * @param {number} [time] Absolute time in seconds
   * @param {Vec2D} [velocity]
   * @param {number} [dragCoefficient]
   * @param {number} [referenceArea]
   */
  constructor(position = new Vec2D(0, 0), mass = 1, time = 0, velocity = new Vec2D(0, 0)) {
    this._accelerations = [];
    this._lastUpdate = time;
    this.mass = mass;
    this._position = position.clone();
    this._lastPosition = position.clone();
    this._velocity = velocity;
    this.dragCoefficient = 1.35;
    this.referenceArea = 80;
    this.gravity = new Vec2D(0, -9.81);
    this.density = 0.15;
    this._forces = [];
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
   * @param {Vec2D} impactLine
   * @param {number} [coefficientOfRestitution]
   * @param {Vec2D} [velocity]
   * @param {number} [mass]
   */
  impact(impactLine, coefficientOfRestitution = 1, velocity = null, mass = null) {
    const rotDiff = -impactLine.rotation;
    // Transform coordinate system
    this._velocity.rotate(rotDiff);

    // Modify value
    if (velocity && mass) {
      // TODO
      // const vel = new Vec2D(velocity.x, velocity.y);
      // vel.rotate(rotDiff);
      // const massTotal = this.mass + mass;
      // this._velocity.y =
      //   (this.mass * this._velocity.y +
      //     mass * vel.y -
      //     coefficientOfRestitution * mass * (this._velocity.y - vel.y)) /
      //   massTotal;
    } else {
      this._velocity.y *= -coefficientOfRestitution;
    }

    // Undo transformation
    this._velocity.rotate(-rotDiff);
  }

  /**
   * TODO
   * @param {Vec2D} value
   * @return {Particle}
   */
  addForce(value) {
    this._forces.push(value);
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

    // Gravity
    accelerationSum.add(this.gravity);

    // Speed Resistance
    accelerationSum.add(
      this.velocity.unitVector.multiply(
        (Math.pow(this.velocity.magnitude, 2) * this.referenceArea * this.dragCoefficient * this.density) /
          -2 /
          this.mass
      )
    );

    // Further accelerations
    this._accelerations.forEach((acceleration) => {
      accelerationSum.add(acceleration);
    });

    // External forces
    this._forces.forEach((force) => {
      accelerationSum.add(force.clone().multiply(1 / this.mass));
    });

    // Update position + speed
    const duration = time - this._lastUpdate;
    this._lastPosition = this._position.clone();
    this._position
      .add(Vec2D.multiply(accelerationSum, 0.5 * Math.pow(duration, 2)))
      .add(Vec2D.multiply(this._velocity, duration));
    this._velocity.add(Vec2D.multiply(accelerationSum, duration));

    // Clear stack
    this._accelerations = [];
    this._forces = [];

    // Update time
    this._lastUpdate = time;
  }
}
