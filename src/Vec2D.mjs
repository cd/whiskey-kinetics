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
