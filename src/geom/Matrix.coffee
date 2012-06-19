# **Package:** *geom*<br/>
# **Inheritance:** *Object* → *Matrix*<br/>
# **Subclasses:** -
#
# The *Matrix* is 3 x 3 matrix. You can translate, scale, rotate, and skew
# display object.<br/>
#
#              |xx yx ox|
#     Matrix = |xy yy oy|
#              |0  0  1 |
#
# You can access this module by doing:<br/>

_sin = Math.sin
_cos = Math.cos
_tan = Math.tan

exports.geom.Matrix = class Matrix

# ## new Matrix(a:*Number* = 1, b:*Number* = 0, c:*Number* = 0, d:*Number* = 1, x:*Number* = 0, y:*Number* = 0)
# Creates a new Matrix object.
  constructor: (@xx = 1, @xy = 0, @yx = 0, @yy = 1, @ox = 0, @oy = 0)->

  identity:->
    @xx = 1
    @xy = 0
    @yx = 0
    @yy = 1
    @ox = 0
    @oy = 0

  # ## clone():*Matrix*
  # Copies this object.
  clone: ->
    new Matrix @xx, @xy, @yx, @yy, @ox, @oy

  toString: ->
    """
    #{@xx} #{@yx} #{@ox}
    #{@xy} #{@yy} #{@oy}
    0 0 1
    """

  # ## apply(matrix:*Matrix*):*void*
  # Applies the properties of specified *Matrix* object to this object.
  apply: (matrix)->
    @_apply matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.ox, matrix.oy
  _apply: (xx, xy, yx, yy, ox, oy)->
    @xx = xx
    @xy = xy
    @yx = yx
    @yy = yy
    @ox = ox
    @oy = oy
    @

  # ## setTo(context:*CanvasRenderingContext2D*):*void*
  # Sets transform to specified *CanvasRenderingContext2D* object.
  setTo: (context)->
    context.setTransform @xx, @xy, @yx, @yy, @ox, @oy

  # ## concat(matrix:*Matrix*):*Matrix*
  # Concatenates the specified *Matrix* to this object.
  #
  #     |xx yx ox||@xx @yx @ox|   |xx*@xx+yx*@xy xx*@yx+yx*@yy xx*@ox+yx*@oy+ox|
  #     |xy yy oy||@xy @yy @oy| = |xy*@xx+yy*@xy xy*@yx+yy*@yy xy*@ox+yy*@oy+oy|
  #     |0  0  1 ||0   0   1  |   |0             0             1               |
  concat: (matrix)->
    @_concat matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.ox, matrix.oy
  _concat:(xx, xy, yx, yy, ox, oy)->
    _xx = @xx
    _xy = @xy
    _yx = @yx
    _yy = @yy
    _ox = @ox
    _oy = @oy
    @xx = xx * _xx + yx * _xy
    @xy = xy * _xx + yy * _xy
    @yx = xx * _yx + yx * _yy
    @yy = xy * _yx + yy * _yy
    @ox = xx * _ox + yx * _oy + ox
    @oy = xy * _ox + yy * _oy + oy
    @

  # ## translate(tx:*Number*, ty:*Number*):*Matrix*
  # Applies a translating transformation to this object.
  translate: (tx, ty)->
    @_concat 1, 0, 0, 1, tx, ty

  # ## scale(sx:*Number*, sy:*Number*):*Matrix*
  # Applies a scaling transformation to this object.
  scale: (sx, sy)->
    @_concat sx, 0, 0, sy, 0, 0

  # ## rotate(angle:*Number*):*Matrix*
  # Applies a rotation transformation to this object.
  rotate: (angle)->
    c = _cos angle
    s = _sin angle
    @_concat c, s, -s, c, 0, 0

  # ## skew(skewX:*Number*, skewY:*Number*):*Matrix*
  # Applies a skewing transformation to this object.
  skew: (skewX, skewY)->
    @_concat 0, _tan(skewY), _tan(skewX), 0, 0, 0

  #     d = xx*yy - xy*yx
  #     |xx yx ox|-1   |yy/d  -yx/d (yx*oy-yy*ox)/d|
  #     |xy yy oy|   = |-xy/d xx/d  (xy*ox-xx*oy)/d|
  #     |0  0  1 |     |0     0     1              |
  invert: ->
    xx = @xx
    xy = @xy
    yx = @yx
    yy = @yy
    ox = @ox
    oy = @oy
    d = xx * yy - xy * yx
    @xx = yy / d
    @xy = -xy / d
    @yx = -yx / d
    @yy = xx / d
    @ox = (yx * oy - yy * ox) / d
    @oy = (xy * ox - xx * oy) / d
    @

  #     |@xx @yx @ox||1 0 pt.x|   |@xx @yx @xx*pt.x+@yx*pt.y+@ox|
  #     |@xy @yy @oy||0 1 pt.y| = |@xy @yy @xy*pt.x+@yy*pt.y+@oy|
  #     |0   0   1  ||0 0 1   |   |0   0   1                    |
  transformPoint: (pt)->
    new Vector @xx * pt.x + @yx * pt.y + @ox, @xy * pt.x + @yy * pt.y + @oy

  deltaTransformPoint: (pt)->
    new Vector @xx * pt.x + @yx * pt.y, @xy * pt.x + @yy * pt.y

  #     |1 0 tx||sx 0  0||c -s 0|   |sx 0  tx||c -s 0|   |sx*c -sx*s tx|
  #     |0 1 ty||0  sy 0||s c  0| = |0  sy ty||s c  0| = |sy*s sy*c  ty|
  #     |0 0 1 ||0  0  1||0 0  1|   |0  0  1 ||0 0  1|   |0    0     1 |
  createBox: (scaleX, scaleY, rotation = 0, tx = 0, ty = 0)->
    c = _cos rotation
    s = _sin rotation
    @_concat scaleX * c, scaleY * s, -scaleX * s, scaleY * c, tx, ty

  # ## createGradientBox(x:*Number*, y:*Number*, width:*Number*, height:*Number*, rotation:*Number*):*Matrix*
  # Creates the gradient style of *Matrix* expected by the `beginGradientFill()
  # and `lineGradientFill()` methods of *Shape* object.
  createGradientBox: (width, height, rotation = 0, x = 0, y = 0)->
    @createBox width / 1638.4, height / 1638.4, rotation, x + width / 2, y + height / 2
