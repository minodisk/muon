var Matrix = require('geom.Matrix')
  , sin = Math.sin
  , cos = Math.cos
  , sqrt = Math.sqrt
  , atan2 = Math.atan2;

Point.polar = function (distance, angle) {
  return new Point(distance * cos(angle), distance * sin(angle));
};

Point.add = function (pt0, pt1) {
  return new Point(pt0.x + pt1.x, pt0.y + pt1.y);
};

Point.subtract = function (pt0, pt1) {
  return new Point(pt0.x - pt1.x, pt0.y - pt1.y);
};

Point.multiple = function (pt, num) {
  return new Point(pt.x * num, pt.y * num);
};

Point.divide = function (pt, num) {
  return new Point(pt.x / num, pt.y / num);
};

Point.crossProduct = function (a, b) {
  return a.distance * b.distance * sin(b.angle - a.angle);
};

Point.dotProduct = function (a, b) {
};

Point.distance = function (a, b) {
  var x, y;
  x = a.x - b.x;
  y = a.y - b.y;
  return sqrt(x * x + y * y);
};

Point.between = function (src, dst, ratio) {
  if (ratio == null) {
    ratio = .5;
  }
  return new Point(src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio);
};

/**
 * Coordination position.
 * @param {Number} x    Horizontal position.
 * @param {Number} y    Vertical position.
 * @constructor
 */
function Point(x, y) {
  /**
   * Horizontal position.
   * @type {Number}
   */
  this.x = x != null ? x : 0;

  /**
   * Vertical position.
   * @type {Number}
   */
  this.y = y != null ? y : 0;
}

Point.prototype.distance = function () {
  return sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.angle = function () {
  return atan2(this.y, this.x);
};

Point.prototype.clone = function () {
  return new Point(this.x, this.y);
};

Point.prototype.add = function (pt) {
  this.x += pt.x;
  this.y += pt.y;
  return this;
};

Point.prototype.subtract = function (pt) {
  this.x -= pt.x;
  this.y -= pt.y;
  return this;
};

Point.prototype.multiple = function (num) {
  this.x *= num;
  this.y *= num;
  return this;
};

Point.prototype.divide = function (num) {
  this.x /= num;
  this.y /= num;
  return this;
};

Point.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};

Point.prototype.equals = function (pt) {
  return this.x === pt.x && this.y === pt.y;
};

Point.prototype.normalize = function (thickness) {
  var ratio;
  if (thickness == null) {
    thickness = 1;
  }
  ratio = thickness / sqrt(this.x * this.x + this.y * this.y);
  this.x *= ratio;
  this.y *= ratio;
  return this;
};

Point.prototype.transform = function (matrix) {
  var m;
  m = new Matrix(1, 0, 0, 1, this.x, this.y);
  m.concat(matrix);
  this.x = m.ox;
  this.y = m.oy;
  return this;
};

module.exports = Point;