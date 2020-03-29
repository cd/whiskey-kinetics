/**
 * @class
 */
export default class Vec2D {
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
}
