# **Package:** *geom*<br/>
# **Inheritance:** *Object* > *Rectangle*<br/>
# **Subclasses:** -
#
# The *Rectangle* class represents an area defined by x, y, width and height.
# <br/>
# You can access this module by doing:<br/>

exports.geom.Rectangle = class Rectangle

  # ## new Rectangle(x:*Number* = 0, y:*Number* = 0, width:*Number* = 0, height:*Number* = 0)
  # Creates a new *Rectangle* instance.
  constructor: (@x = 0, @y = 0, @width = 0, @height = 0)->

  # ## toString():*String*
  # Creates *String* composed of x, y, width and height.
  toString: ->
    "[Rectangle x=#{@x} y=#{@y} width=#{@width} height=#{@height}]"

  left: ->
    Math.min @x, @x + @width

  right: ->
    Math.max @x, @x + @width

  top: ->
    Math.min @y, @y + @height

  bottom: ->
    Math.max @y, @y + @height

  # ## clone():*Rectangle*
  # Clones this object.
  clone: ->
    new Rectangle @x, @y, @width, @height

  # ## apply(rect:*Rectangle*):*Rectangle*
  # Applies target properties to this object.
  apply: (rect)->
    @x = rect.x
    @y = rect.y
    @width = rect.width
    @height = rect.height
    @

  contains: (x, y)->
    @x < x < @x + @width and @y < y < @y + @height

  containsPoint: (point)->
    @contains(point.x, point.y)

  contain: (x, y)->
    if x < @x
      @width += @x - x
      @x = x
    else if x > @x + @width
      @width = x - @x
    if y < @y
      @height += @y - y
      @y = y
    else if y > @y + @height
      @height = y - @y
    @

  containPoint: (point)->
    @contain(point.x, point.y)

  # ## offset(dx:*Number*, dy:*Number*):*Rectangle*
  # Add x and y to this object.
  offset: (dx, dy)->
    @x += dx
    @y += dy
    @

  # ## offsetPoint(pt:*Point*):*Rectangle*
  # Add x and y to this object using a *Point* object as a parameter.
  offsetPoint: (pt)->
    @x += pt.x
    @y += pt.y
    @

  inflate: (dw, dh)->
    @width += dw
    @height += dh
    @

  inflatePoint: (pt)->
    @width += pt.x
    @height += pt.y
    @

  deflate: (dw, dh)->
    @width -= dw
    @height -= dh
    @

  deflatePoint: (pt)->
    @width -= pt.x
    @height -= pt.y
    @

  union: (rect)->
    l = if @x < rect.x then @x else rect.x
    r1 = @x + @width
    r2 = rect.x + rect.width
    r = if r1 > r2 then r1 else r2
    w = r - l
    t = if @y < rect.y then @y else rect.y
    b1 = @y + @height
    b2 = rect.y + rect.height
    b = if b1 > b2 then b1 else b2
    h = b - t
    @x = l
    @y = t
    @width = if w < 0 then 0 else w
    @height = if h < 0 then 0 else h
    @

  isEmpty: ->
    @x is 0 and @y is 0 and @width is 0 and @height is 0

  intersects: (rect)->
    l = _max @x, rect.x
    r = _min @x + @width, rect.x + rect.width
    w = r - l
    return false if w <= 0
    t = _max @y, rect.y
    b = _min @y + @height, rect.y + rect.height
    h = b - t
    return false if h <= 0
    true

  intersection: (rect)->
    l = _max @x, rect.x
    r = _min @x + @width, rect.x + rect.width
    w = r - l
    return new Rectangle() if w <= 0
    t = _max @y, rect.y
    b = _min @y + @height, rect.y + rect.height
    h = b - t
    return new Rectangle() if h <= 0
    new Rectangle l, t, w, h

  measureFarDistance: (x, y)->
    l = @x
    r = @x + @width
    t = @y
    b = @y + @height
    dl = x - l
    dr = x - r
    dt = y - t
    db = y - b
    dl = dl * dl
    dr = dr * dr
    dt = dt * dt
    db = db * db
    min = _max dl + dt, dr + dt, dr + db, dl + db
    _sqrt min

  adjustOuter: ->
    x = Math.floor @x
    y = Math.floor @y
    if x isnt @x
      @width++
    if y isnt @y
      @height++
    @x = x
    @y = y
    @width = Math.ceil @width
    @height = Math.ceil @height
    @
    
  transform: (matrix)->
    lt = new Matrix 1, 0, 0, 1, @x, @y
    rt = new Matrix 1, 0, 0, 1, @x + @width, @y
    rb = new Matrix 1, 0, 0, 1, @x + @width, @y + @height
    lb = new Matrix 1, 0, 0, 1, @x, @y + @height
    lt.concat matrix
    rt.concat matrix
    rb.concat matrix
    lb.concat matrix
    l = _min lt.ox, rt.ox, rb.ox, lb.ox
    r = _max lt.ox, rt.ox, rb.ox, lb.ox
    t = _min lt.oy, rt.oy, rb.oy, lb.oy
    b = _max lt.oy, rt.oy, rb.oy, lb.oy
    @x = l
    @y = t
    @width = r - l
    @height = b - t
    @
