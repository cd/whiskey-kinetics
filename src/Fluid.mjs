/**
 * @class
 */
export default class Fluid {
  /**
   * TODO
   * @param {number} density
   * @param {Vec2D} [velocity]
   * @param {Vec2D} [position]
   * @param {Vec2D} [size]
   */
  constructor(density, velocity = null, position = null, size = null) {
    this.density = density;
    this.velocity = velocity;
    this.position = position;
    this.size = size;
  }

  /**
   * TODO
   * @param {Partcle} particle
   */
  isInside(particle) {}
}
