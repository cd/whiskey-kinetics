/**
 * @class
 */
export class Link {
  /**
   * TODO
   * @param {MassPoint} from
   * @param {MassPoint|Vec2D} to
   * @param {boolean} [compressible]
   * @param {number} [timestamp]
   * @param {number} [norminalLength]
   */
  constructor(from, to, compressible = true, timestamp = 0, norminalLength = null) {
    this._fromParticle = from;
    this._toParticle = to;
    this._compressible = compressible;
    this._lastUpdate = timestamp;
    this._norminalLength =
      norminalLength === null
        ? this._toParticle.position.clone().subtract(this._fromParticle.position).magnitude
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
    return this._toParticle.position.clone().subtract(this._fromParticle.position);
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
    if (this.destroyed) return null;
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
    const dampingForce = ((this._lastLength - this.length) / (timestamp - this._lastUpdate)) * this._dampingCoefficient;
    const forceVec = this.getVector().unitVector.multiply(this.springForce - dampingForce);
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

/**
 * @class
 */
export class Particle {
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

/**
 * @class
 */
export class Vec2D {
  /**
   * TODO
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * TODO
   * @return {number}
   */
  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * TODO
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
   * TODO
   * @return {number}
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
   * TODO
   * @return {Vec2D}
   */
  get unitVector() {
    const magnitude = this.magnitude;
    if (magnitude === 0) return new Vec2D(0, 0);
    return new Vec2D(this.x / magnitude, this.y / magnitude);
  }

  /**
   * TODO
   * @param {Vec2D} valVec2D
   * @param {Vec2D} valNumber
   * @return {Vec2D}
   */
  static multiply(valVec2D, valNumber) {
    return new Vec2D(valVec2D.x * valNumber, valVec2D.y * valNumber);
  }

  /**
   * TODO
   * @param {number} number
   * @return {Vec2D}
   */
  multiply(number) {
    this.x *= number;
    this.y *= number;
    return this;
  }

  /**
   * TODO
   * @param {Vec2D} vec
   * @return {Vec2D}
   */
  set(vec) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }

  /**
   * TODO
   * @param {Vec2D} vec
   * @return {Vec2D}
   */
  clone() {
    return new Vec2D(this.x, this.y);
  }

  /**
   * TODO
   * @param {number} val rotation
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
   * TODO
   * @param {Vec2D} vec1
   * @param {Vec2D} vec2
   * @return {Vec2D}
   */
  static add(vec1, vec2) {
    return new Vec2D(vec1.x + vec2.x, vec1.y + vec2.y);
  }

  /**
   * TODO
   * @param {Vec2D} vec
   * @return {Vec2D}
   */
  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  /**
   * TODO
   * @param {Vec2D} vec
   * @return {Vec2D}
   */
  subtract(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }
}
