var Matrix = require('geom.Matrix')
  , min = Math.min
  , max = Math.max
  , floor = Math.floor
  , ceil = Math.ceil
  , sqrt = Math.sqrt;

function Rectangle(x, y, width, height) {
  this.x = x != null ? x : 0;
  this.y = y != null ? y : 0;
  this.width = width != null ? width : 0;
  this.height = height != null ? height : 0;
}

Rectangle.prototype.toString = function () {
  return "[Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
};

Rectangle.prototype.left = function () {
  return min(this.x, this.x + this.width);
};

Rectangle.prototype.right = function () {
  return max(this.x, this.x + this.width);
};

Rectangle.prototype.top = function () {
  return min(this.y, this.y + this.height);
};

Rectangle.prototype.bottom = function () {
  return max(this.y, this.y + this.height);
};

Rectangle.prototype.clone = function () {
  return new Rectangle(this.x, this.y, this.width, this.height);
};

Rectangle.prototype.apply = function (rect) {
  this.x = rect.x;
  this.y = rect.y;
  this.width = rect.width;
  this.height = rect.height;
  return this;
};

Rectangle.prototype.contains = function (x, y) {
  return this.x < x && x < this.x + this.width && this.y < y && y < this.y + this.height;
};

Rectangle.prototype.containsPoint = function (point) {
  return this.contains(point.x, point.y);
};

Rectangle.prototype.contain = function (x, y) {
  if (x < this.x) {
    this.width += this.x - x;
    this.x = x;
  } else if (x > this.x + this.width) {
    this.width = x - this.x;
  }
  if (y < this.y) {
    this.height += this.y - y;
    this.y = y;
  } else if (y > this.y + this.height) {
    this.height = y - this.y;
  }
  return this;
};

Rectangle.prototype.containPoint = function (point) {
  return this.contain(point.x, point.y);
};

Rectangle.prototype.offset = function (dx, dy) {
  this.x += dx;
  this.y += dy;
  return this;
};

Rectangle.prototype.offsetPoint = function (pt) {
  this.x += pt.x;
  this.y += pt.y;
  return this;
};

Rectangle.prototype.inflate = function (dw, dh) {
  this.width += dw;
  this.height += dh;
  return this;
};

Rectangle.prototype.inflatePoint = function (pt) {
  this.width += pt.x;
  this.height += pt.y;
  return this;
};

Rectangle.prototype.deflate = function (dw, dh) {
  this.width -= dw;
  this.height -= dh;
  return this;
};

Rectangle.prototype.deflatePoint = function (pt) {
  this.width -= pt.x;
  this.height -= pt.y;
  return this;
};

Rectangle.prototype.union = function (rect) {
  var b, b1, b2, h, l, r, r1, r2, t, w;
  l = this.x < rect.x ? this.x : rect.x;
  r1 = this.x + this.width;
  r2 = rect.x + rect.width;
  r = r1 > r2 ? r1 : r2;
  w = r - l;
  t = this.y < rect.y ? this.y : rect.y;
  b1 = this.y + this.height;
  b2 = rect.y + rect.height;
  b = b1 > b2 ? b1 : b2;
  h = b - t;
  this.x = l;
  this.y = t;
  this.width = w < 0 ? 0 : w;
  this.height = h < 0 ? 0 : h;
  return this;
};

Rectangle.prototype.isEmpty = function () {
  return this.x === 0 && this.y === 0 && this.width === 0 && this.height === 0;
};

Rectangle.prototype.intersects = function (rect) {
  var b, h, l, r, t, w;
  l = max(this.x, rect.x);
  r = min(this.x + this.width, rect.x + rect.width);
  w = r - l;
  if (w <= 0) {
    return false;
  }
  t = max(this.y, rect.y);
  b = min(this.y + this.height, rect.y + rect.height);
  h = b - t;
  if (h <= 0) {
    return false;
  }
  return true;
};

Rectangle.prototype.intersection = function (rect) {
  var b, h, l, r, t, w;
  l = max(this.x, rect.x);
  r = min(this.x + this.width, rect.x + rect.width);
  w = r - l;
  if (w <= 0) {
    return new Rectangle;
  }
  t = max(this.y, rect.y);
  b = min(this.y + this.height, rect.y + rect.height);
  h = b - t;
  if (h <= 0) {
    return new Rectangle;
  }
  return new Rectangle(l, t, w, h);
};

Rectangle.prototype.measureFarDistance = function (x, y) {
  var b, db, dl, dr, dt, l, min, r, t;
  l = this.x;
  r = this.x + this.width;
  t = this.y;
  b = this.y + this.height;
  dl = x - l;
  dr = x - r;
  dt = y - t;
  db = y - b;
  dl = dl * dl;
  dr = dr * dr;
  dt = dt * dt;
  db = db * db;
  min = max(dl + dt, dr + dt, dr + db, dl + db);
  return sqrt(min);
};

Rectangle.prototype.adjustOuter = function () {
  var x, y;
  x = floor(this.x);
  y = floor(this.y);
  if (x !== this.x) {
    this.width++;
  }
  if (y !== this.y) {
    this.height++;
  }
  this.x = x;
  this.y = y;
  this.width = ceil(this.width);
  this.height = ceil(this.height);
  return this;
};

Rectangle.prototype.transform = function (matrix) {
  var b, l, lb, lt, r, rb, rt, t;
  lt = new Matrix(1, 0, 0, 1, this.x, this.y);
  rt = new Matrix(1, 0, 0, 1, this.x + this.width, this.y);
  rb = new Matrix(1, 0, 0, 1, this.x + this.width, this.y + this.height);
  lb = new Matrix(1, 0, 0, 1, this.x, this.y + this.height);
  lt.concat(matrix);
  rt.concat(matrix);
  rb.concat(matrix);
  lb.concat(matrix);
  l = min(lt.ox, rt.ox, rb.ox, lb.ox);
  r = max(lt.ox, rt.ox, rb.ox, lb.ox);
  t = min(lt.oy, rt.oy, rb.oy, lb.oy);
  b = max(lt.oy, rt.oy, rb.oy, lb.oy);
  this.x = l;
  this.y = t;
  this.width = r - l;
  this.height = b - t;
  return this;
};

module.exports = Rectangle;