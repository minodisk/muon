var Point = require('geom.Point')
  , sin = Math.sin
  , cos = Math.cos
  , tan = Math.tan;

function Matrix(xx, xy, yx, yy, ox, oy) {
  this.xx = xx != null ? xx : 1;
  this.xy = xy != null ? xy : 0;
  this.yx = yx != null ? yx : 0;
  this.yy = yy != null ? yy : 1;
  this.ox = ox != null ? ox : 0;
  this.oy = oy != null ? oy : 0;
}

Matrix.prototype.identity = function () {
  this.xx = 1;
  this.xy = 0;
  this.yx = 0;
  this.yy = 1;
  this.ox = 0;
  return this.oy = 0;
};

Matrix.prototype.clone = function () {
  return new Matrix(this.xx, this.xy, this.yx, this.yy, this.ox, this.oy);
};

Matrix.prototype.toString = function () {
  return "" + this.xx + " " + this.yx + " " + this.ox + "\n" + this.xy + " " + this.yy + " " + this.oy + "\n0 0 1";
};

Matrix.prototype.apply = function (_arg) {
  var ox, oy, xx, xy, yx, yy;
  xx = _arg.xx, xy = _arg.xy, yx = _arg.yx, yy = _arg.yy, ox = _arg.ox, oy = _arg.oy;
  return this._apply(xx, xy, yx, yy, ox, oy);
};

Matrix.prototype._apply = function (xx, xy, yx, yy, ox, oy) {
  this.xx = xx;
  this.xy = xy;
  this.yx = yx;
  this.yy = yy;
  this.ox = ox;
  this.oy = oy;
  return this;
};

Matrix.prototype.setTo = function (context) {
  return context.setTransform(this.xx, this.xy, this.yx, this.yy, this.ox, this.oy);
};

Matrix.prototype.concat = function (_arg) {
  var ox, oy, xx, xy, yx, yy;
  xx = _arg.xx, xy = _arg.xy, yx = _arg.yx, yy = _arg.yy, ox = _arg.ox, oy = _arg.oy;
  return this._concat(xx, xy, yx, yy, ox, oy);
};

Matrix.prototype._concat = function (xx, xy, yx, yy, ox, oy) {
  var _ox, _oy, _xx, _xy, _yx, _yy;
  _xx = this.xx;
  _xy = this.xy;
  _yx = this.yx;
  _yy = this.yy;
  _ox = this.ox;
  _oy = this.oy;
  this.xx = xx * _xx + yx * _xy;
  this.xy = xy * _xx + yy * _xy;
  this.yx = xx * _yx + yx * _yy;
  this.yy = xy * _yx + yy * _yy;
  this.ox = xx * _ox + yx * _oy + ox;
  this.oy = xy * _ox + yy * _oy + oy;
  return this;
};

Matrix.prototype.translate = function (tx, ty) {
  return this._concat(1, 0, 0, 1, tx, ty);
};

Matrix.prototype.translatePoint = function (_arg) {
  var x, y;
  x = _arg.x, y = _arg.y;
  return this.translate(x, y);
};

Matrix.prototype.scale = function (sx, sy) {
  return this._concat(sx, 0, 0, sy, 0, 0);
};

Matrix.prototype.scalePoint = function (_arg) {
  var x, y;
  x = _arg.x, y = _arg.y;
  return this.scale(x, y);
};

Matrix.prototype.rotate = function (angle) {
  var c, s;
  c = cos(angle);
  s = sin(angle);
  return this._concat(c, s, -s, c, 0, 0);
};

Matrix.prototype.skew = function (skewX, skewY) {
  return this._concat(0, tan(skewY), tan(skewX), 0, 0, 0);
};

Matrix.prototype.invert = function () {
  var d, ox, oy, xx, xy, yx, yy;
  xx = this.xx;
  xy = this.xy;
  yx = this.yx;
  yy = this.yy;
  ox = this.ox;
  oy = this.oy;
  d = xx * yy - xy * yx;
  this.xx = yy / d;
  this.xy = -xy / d;
  this.yx = -yx / d;
  this.yy = xx / d;
  this.ox = (yx * oy - yy * ox) / d;
  this.oy = (xy * ox - xx * oy) / d;
  return this;
};

Matrix.prototype.transformPoint = function (_arg) {
  var x, y;
  x = _arg.x, y = _arg.y;
  return new Point(this.xx * x + this.yx * y + this.ox, this.xy * x + this.yy * y + this.oy);
};

Matrix.prototype.deltaTransformPoint = function (_arg) {
  var x, y;
  x = _arg.x, y = _arg.y;
  return new Point(this.xx * x + this.yx * y, this.xy * x + this.yy * y);
};

Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
  var c, s;
  if (rotation == null) {
    rotation = 0;
  }
  if (tx == null) {
    tx = 0;
  }
  if (ty == null) {
    ty = 0;
  }
  c = cos(rotation);
  s = sin(rotation);
  return this._concat(scaleX * c, scaleY * s, -scaleX * s, scaleY * c, tx, ty);
};

Matrix.prototype.createGradientBox = function (width, height, rotation, x, y) {
  if (rotation == null) {
    rotation = 0;
  }
  if (x == null) {
    x = 0;
  }
  if (y == null) {
    y = 0;
  }
  return this.createBox(width / 1638.4, height / 1638.4, rotation, x + width / 2, y + height / 2);
};

module.exports = Matrix;