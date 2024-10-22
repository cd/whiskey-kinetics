/**
 * Class for links (to connect two particles).
 * @class
 */
export class Link {
  /**
   * Create a link between two particles.
   * @param {Particle} from
   * @param {Particle} to
   * @param {object} [properties]
   * @param {number} [properties.initialTime] Starting time in seconds (default: `0`).
   * @param {boolean} [properties.compressible] For rope-like behavior (no absorption of compressive forces), this
   *   value must be set to `false` (default: `true`).
   * @param {number} [properties.norminalLength] Unstressed length (in m) (default: distance between the particles).
   * @param {number} [properties.maxTensileForce] Tensile force in N at which the element is destroyed
   *   (default: `35550`).
   *
   *   Example: If the link is to represent a construction steel bar (tensile strength of ~450 N/mm²) with a
   *   diameter of 10 mm (area 79 mm²), the value would be 35550 N (450 N/mm² ⋅ 79 mm²).
   * @param {number} [properties.tensileStiffness] Arithmetic product of modulus of elasticity and
   *   cross sectional area (E ⋅ A) in N (default: `16590000`).
   *
   *   Example: If the link is to represent a construction steel bar (modulus of elasticity 210000 N/mm²) with a
   *   diameter of 10 mm (area 79 mm²), the value would be 16590000 N (210000 N/mm² ⋅ 79 mm²).
   * @param {number} [properties.dampingCoefficient] Parameter to control the damping effect, based on the velocity of
   *   the change of the length (default: `0`).
   */
  constructor(from, to, properties = {}) {
    this._fromParticle = from;
    this._toParticle = to;
    this._lastUpdate = properties.initialTime || 0;
    this.compressible = properties.compressible === false ? false : true;
    this.norminalLength =
      properties.norminalLength || this._toParticle.position.clone().subtract(this._fromParticle.position).magnitude;
    this.springConstant = (properties.tensileStiffness || 16590000) / this.norminalLength;
    this.dampingCoefficient = properties.dampingCoefficient || 0;
    this.maxTensileForce = properties.maxTensileForce || 35550;
    this.destroyed = false;
    this._dampingForce = 0;
  }

  /**
   * Get vector between 'from' and 'to' particle.
   * @return {Vec2D}
   */
  getVector() {
    return this._toParticle.position.clone().subtract(this._fromParticle.position);
  }

  /**
   * Get distance between the 'from' and 'to' particles.
   * @return {number}
   */
  get length() {
    return this.getVector().magnitude;
  }

  /**
   * Get spring force.
   * @return {Vec2D}
   */
  get springForce() {
    if (this.destroyed) return null;
    const lengthDiff = this.length - this.norminalLength;
    if (lengthDiff < 0 && !this.compressible) return 0;
    return lengthDiff * this.springConstant;
  }

  /**
   * Get damping force.
   * @return {Vec2D}
   */
  get dampingForce() {
    if (this.destroyed) return null;
    return this._dampingForce;
  }

  /**
   * Apply the spring and damping force to the destroy status and the 'from' and 'to' particles.
   * @param {number} timestamp
   */
  update(timestamp) {
    if (this.destroyed) return;

    // Calc damping force
    const lastLength = this._toParticle._lastPosition.clone().subtract(this._fromParticle._lastPosition).magnitude;
    this._dampingForce = ((lastLength - this.length) / (timestamp - this._lastUpdate)) * this.dampingCoefficient;
    const dampingForceVec = this.getVector().unitVector.multiply(this._dampingForce);

    // Calc spring force
    const springForceVec = this.getVector().unitVector.multiply(this.springForce);

    // Calc total force
    const totalForceVec = dampingForceVec.clone().add(springForceVec);
    if (totalForceVec.magnitude > this.maxTensileForce) {
      this.destroyed = true;
      return;
    }

    // Apply total force to particles
    this._fromParticle.addForce(totalForceVec);
    this._toParticle.addForce(totalForceVec.clone().multiply(-1));

    this._lastUpdate = timestamp;
  }
}

/**
 * Class for mass points / particles.
 * @class
 */
export class Particle {
  /**
   * Create a particle.
   * @param {Vec2D} position
   * @param {number} mass Mass in kg.
   * @param {object} [properties]
   * @param {number} [properties.initialTime] Starting time in seconds (default: `0`)
   * @param {Vec2D} [properties.velocity] Starting velocity in m/s (default: `0`)
   * @param {number} [properties.dragForceFactor] Arithmetic product (in kg) of drag coefficient, reference area and
   *  mass density of the fluid (default: `0`). This value is used to calculate the flow resistance force when the
   *  particle moves during update(). Learn more at https://en.wikipedia.org/wiki/Drag_coefficient
   *
   *  Example: Simulation of a golf ball
   *    - drag coefficient ~0.5
   *    - reference area ~0.0014 m³ (π * (42.7 mm)² / 4)
   *    - mass density (of the air) ~1.2 kg/m³
   *
   *  The particle representing the ball would therefore have a dragForceFactor of 0.00084 kg (0.5 * 0.0014 * 1.2).
   *  However, if the particle is only 1 of 1000 particles that represent the ball (finite element method), then
   *  the value must be divided by the number of particles. In this example, this would be 0.00000084 kg.
   */
  constructor(position, mass, properties = {}) {
    this._accelerations = [];
    this._forces = [];
    this._position = position.clone();
    this._lastPosition = position.clone();
    this.mass = mass;
    this._lastUpdate = properties.initialTime || 0;
    this._velocity = properties.velocity || new Vec2D(0, 0);
    this.dragForceFactor = properties.dragForceFactor || 0;
  }

  /**
   * Get velocity of the particle.
   * @return {Vec2D}
   */
  get velocity() {
    return this._velocity;
  }

  /**
   * Get position of the particle.
   * @return {Vec2D}
   */
  get position() {
    return this._position;
  }

  /**
   * Add external force to the particle. This only takes effect on the next update().
   * @param {Vec2D} value (in N)
   * @return {Particle} this
   */
  addForce(value) {
    this._forces.push(value);
    return this;
  }

  /**
   * Add external acceleration (e. g. gravity) to the particle. This only takes effect on the next update().
   * @param {Vec2D} value (in m/s²)
   * @return {Particle} this
   */
  addAcceleration(value) {
    this._accelerations.push(value);
    return this;
  }

  /**
   * Update position and speed depending on external accelerations, external forces and the speed resistance.
   * @param {number} time (in s)
   */
  update(time) {
    // Sum accelerations
    const accelerationSum = new Vec2D(0, 0);

    // Speed Resistance
    accelerationSum.add(
      this.velocity.unitVector.multiply((Math.pow(this.velocity.magnitude, 2) * this.dragForceFactor) / -2 / this.mass)
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
      .add(accelerationSum.clone().multiply(0.5 * Math.pow(duration, 2)))
      .add(this._velocity.clone().multiply(duration));
    this._velocity.add(accelerationSum.clone().multiply(duration));

    // Clear stack
    this._accelerations = [];
    this._forces = [];

    // Update time
    this._lastUpdate = time;
  }
}

/**
 * Helper class for working with two-dimensional vectors.
 * @class
 */
export class Vec2D {
  /**
   * Create a 2D vector.
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get magnitude of the vector.
   * @return {number}
   */
  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Set magnitude of the vector.
   * @param {number} val
   */
  set magnitude(val) {
    if (this.x === 0) {
      this.y = val;
      return;
    }
    const ratio = this.y / this.x;
    this.x = Math.sqrt(Math.pow(val, 2) / (1 + Math.pow(ratio, 2)));
    this.y = ratio * this.x;
  }

  /**
   * Get rotation of the vector.
   * @return {number} in rad
   */
  get rotation() {
    if (this.y >= 0) {
      if (this.x >= 0) {
        return Math.atan(this.y / this.x);
      } else {
        return Math.atan(-this.x / this.y) + Math.PI / 2;
      }
    } else {
      if (this.x >= 0) {
        return Math.atan(this.x / -this.y) + (Math.PI * 3) / 2;
      } else {
        return Math.atan(-this.y / -this.x) + Math.PI;
      }
    }
  }

  /**
   * Get unit vector copy of the vector.
   * @return {Vec2D}
   */
  get unitVector() {
    const magnitude = this.magnitude;
    if (magnitude === 0) return new Vec2D(0, 0);
    return new Vec2D(this.x / magnitude, this.y / magnitude);
  }

  /**
   * Multiply vector.
   * @param {number} number
   * @return {Vec2D}
   */
  multiply(number) {
    this.x *= number;
    this.y *= number;
    return this;
  }

  /**
   * Set the X and Y coordinates according to the specified vector.
   * @param {Vec2D} vec from which the X and Y coordinates are to be taken.
   * @return {Vec2D}
   */
  set(vec) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }

  /**
   * Get copy of the vector.
   * @return {Vec2D}
   */
  clone() {
    return new Vec2D(this.x, this.y);
  }

  /**
   * Apply rotation to the vector.
   * @param {number} val (in rad) by which the vector is to be rotated
   * @return {Vec2D}
   */
  rotate(val) {
    const x = this.x * Math.cos(val) - this.y * Math.sin(val);
    const y = this.x * Math.sin(val) + this.y * Math.cos(val);
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Add vector.
   * @param {Vec2D} vec
   * @return {Vec2D}
   */
  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  /**
   * Subtract vector.
   * @param {Vec2D} vec
   * @return {Vec2D}
   */
  subtract(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }
}
