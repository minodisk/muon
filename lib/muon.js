/**
 * @fileOverview
 * @name muon.js
 * @author Daisuke Mino daisuke.mino@gmail.com
 * @url https://github.com/minodisk/muon
 * @version 0.1.2
 * @license MIT License
 */
;(function () {
  'use strict';

  var Module = (function () {
      var toString = Object.prototype.toString
        , isArray = Array.isArray || function (arr) {
          return toString.call(arr) === '[object Array]';
        }
        , Constructor = function () {}
        , copyDeeply = function (parent, child) {
          var key;
          for (key in parent) {
            if (parent.hasOwnProperty(key)) {
              if (typeof parent[key] === 'object') {
                child[key] = isArray(parent[key]) ? [] : {};
                copyDeeply(parent[key], child[key]);
              } else {
                child[key] = parent[key];
              }
            }
          }
        }
        , inheritPrototype = function (Parent, Child) {
          Constructor.prototype = Parent.prototype;
          Child.prototype = new Constructor();
          Child.__super__ = Parent.prototype;
          Child.prototype.constructor = Child;
        }
        , __modules = {};
  
      /**
       * Define module.
       * @param {String} id Module ID.
       * @param {Function|Object} definition Module definition.
       */
      Module.define = function (id, definition) {
        new Module(id, definition);
      };
  
      /**
       * Require module.
       * @param {String} id Module ID.
       * @return {Object} Module.
       */
      Module.require = function (id) {
        var module = __modules[id];
        if (module == null) {
          throw new Error("Cannot find module '" + id + "'");
        }
        return module._require();
      };
  
      /**
       * Store named definition.
       * @param {String} id Module ID.
       * @param {Function|Object} definition Module definition.
       * @constructor
       */
      function Module(id, definition) {
        if (__modules[id] != null) {
          throw new Error("Cannot overwrite module '" + id + "'");
        }
        __modules[id] = this;
  
        this.id = id;
        this.definition = definition;
      }
  
      Module.prototype._require = function () {
        if (this.exports != null) {
          return this.exports;
        }
        this.exports = {};
        this.definition.call(this.exports, Module.require, this, this.exports);
        return this.exports;
      };
  
      /**
       * Extends classical prototype pattern object or modern module pattern object.
       * `Child.__super__` provides parent prototype.
       * @param {Function|Object} parent source object.
       * @param {Function|Object} child destination object.
       * @return {Function|Object} child object.
       */
      Module.prototype.extend = function (parent, child) {
        if (child == null) {
          child = {};
        }
        copyDeeply(parent, child);
        inheritPrototype(parent, child);
        return child;
      };
  
      /**
       * Mix properties.
       * @return {Object} Mixed object.
       */
      Module.prototype.mix = function () {
        var i , len , arg
          , child = {};
        for (i = 0, len = arguments.length; i < len; i++) {
          arg = arguments[i];
          copyDeeply(arg, child);
        }
        return child;
      };
  
      /**
       * Bind context with inspected object.
       * @param {Function} fn   Binding function.
       * @param {Object} me     Context object.
       * @return {Function}
       */
      Module.prototype.bind = function (fn, me) {
        return function () {
          return fn.apply(me, Array.prototype.slice.call(arguments));
        };
      };
  
      return Module;
    })()
    , define = Module.define;

  define('errors.ErrorMessage', function (require, module, exports) {
    var ErrorMessage = {};
    
    ErrorMessage.createInvalidNumberOfParameter = function (num) {
      return 'Invalid number of parameters, expected ' + num;
    };
    
    module.exports = ErrorMessage;
  });

  define('events.Event', function (require, module, exports) {
    function Event(type, bubbles, cancelable) {
      var event;
    
      if (bubbles == null) {
        bubbles = false;
      }
      if (cancelable == null) {
        cancelable = false;
      }
      if (!(this instanceof Event)) {
        return new Event(type, bubbles, cancelable);
      }
    
      if (type instanceof Event) {
        event = type;
        type = event.type;
        bubbles = event.bubbles;
        cancelable = event.cancelable;
        this.currentTarget = event.currentTarget;
        this.target = event.target;
      }
      this.type = type;
      this.bubbles = bubbles;
      this.cancelable = cancelable;
      this._isPropagationStopped = false;
      this._isPropagationStoppedImmediately = false;
      this._isDefaultPrevented = false;
    }
    
    Event.prototype.formatToString = function () {
    };
    
    Event.prototype.stopPropagation = function () {
      this._isPropagationStopped = true;
    };
    
    Event.prototype.stopImmediatePropagation = function () {
      this._isPropagationStopped = true;
      this._isPropagationStoppedImmediately = true;
    };
    
    Event.prototype.isDefaultPrevented = function () {
      return this._isDefaultPrevented;
    };
    
    Event.prototype.preventDefault = function () {
      this._isDefaultPrevented = true;
    };
    
    module.exports = Event;
  });

  define('events.EventEmitter', function (require, module, exports) {
    var Event = require('muon.events.Event')
      , EventPhase = require('muon.events.EventPhase');
    
    function EventEmitter() {
      this._events = {};
    }
    
    EventEmitter.prototype.on = function (type, listener, useCapture, priority) {
      if (typeof type !== "string") {
        throw new ErrorMessage("EventEmitter#addEventListener: type isn't string");
      }
      if (typeof listener !== "function") {
        throw new ErrorMessage("EventEmitter#addEventListener: listener isn't function");
      }
      if (useCapture == null) {
        useCapture = false;
      }
      if (priority == null) {
        priority = 0;
      }
    
      if (this._events[type] == null) {
        this._events[type] = [];
      }
      this._events[type].push({
        listener  : listener,
        useCapture: useCapture,
        priority  : priority
      });
      this._events[type].sort(this._sortOnPriorityInDescendingOrder);
      return this;
    };
    
    EventEmitter.prototype._sortOnPriorityInDescendingOrder = function (a, b) {
      return b.priority - a.priority;
    };
    
    EventEmitter.prototype.off = function (type, listener) {
      var i, storage;
      if (storage = this._events[type]) {
        i = storage.length;
        while (i--) {
          if (storage[i].listener === listener) {
            storage.splice(i, 1);
          }
        }
        if (storage.length === 0) {
          delete this._events[type];
        }
      }
      return this;
    };
    
    EventEmitter.prototype.emit = function (event) {
      var obj, objs, i, len;
      if (!(event instanceof Event)) {
        throw new ErrorMessage("EventEmitter#dispatchEvent: event isn't Event");
      }
    
      event.currentTarget = this;
      if ((objs = this._events[event.type]) != null) {
        for (i = 0, len = objs.length; i < len; i++) {
          obj = objs[i];
          if (obj.useCapture && event.eventPhase === EventPhase.CAPTURING_PHASE || obj.useCapture === false && event.eventPhase !== EventPhase.CAPTURING_PHASE) {
            (function (obj, event) {
              return setTimeout(function () {
                return obj.listener(event);
              }, 0);
            })(obj, event);
            if (event._isPropagationStoppedImmediately) {
              break;
            }
          }
        }
      }
      return !event._isDefaultPrevented;
    };
    
    module.exports = EventEmitter;
    
  });

  define('events.EventPhase', function (require, module, exports) {
    var EventPhase = {
      CAPTURING_PHASE: 1,
      AT_TARGET      : 2,
      BUBBLING_PHASE : 3
    };
    
    module.exports = EventPhase;
  });

  define('geom.Matrix', function (require, module, exports) {
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
  });

  define('geom.Point', function (require, module, exports) {
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
    
    function Point(x, y) {
      this.x = x != null ? x : 0;
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
  });

  define('geom.Rectangle', function (require, module, exports) {
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
  });

  define('net.url', function (require, module, exports) {
    var querystring = require('muon.serializer.querystring')
      , array = require('muon.utils.array');
    
    var R_URL = /^((\w+:)(\/*)?(?:([^@]*)@)?(([^\/]+?)(?::(\d*))?))((\/[^\?#]*)?(\?([^#]*)?)?)?(#.*)?$/;
    
    exports.parse = function (urlStr, parseQueryString) {
      if (parseQueryString == null) {
        parseQueryString = false;
      }
      
      var matched = urlStr.match(R_URL)
        , href = matched[0]
        , origin = matched[1]
        , protocol = matched[2]
        , slashes = matched[3]
        , auth = matched[4]
        , host = matched[5]
        , hostname = matched[6]
        , port = matched[7]
        , path = matched[8]
        , pathname = matched[9]
        , search = matched[10]
        , query = matched[11]
        , hash = matched[12]
        , obj, opt, key, val;
      
      obj = {
        href    : href,
        origin  : origin,
        protocol: protocol,
        host    : host,
        hostname: hostname
      };
      if (parseQueryString) {
        query = querystring.parse(query);
      }
      opt = {
        auth    : auth,
        port    : port,
        path    : path,
        pathname: pathname,
        search  : search,
        query   : query,
        hash    : hash
      };
      if (slashes != null) {
        obj.slashes = true;
        if (path == null) {
          obj.path = obj.pathname = '/';
          obj.href += '/';
        }
      }
      for (key in opt) {
        val = opt[key];
        if (val) {
          obj[key] = val;
        }
      }
      return obj;
    };
    
    exports.format = function (urlObj) {
      var protocol = urlObj.protocol
        , protocolPostfix = __indexOf.call(URL.CSS, protocol) >= 0 ? '://' : ':'
        , auth = urlObj.auth
        , host = urlObj.host
        , hostname = urlObj.hostname
        , port = urlObj.port
        , pathname = urlObj.pathname
        , search = urlObj.search
        , query = urlObj.query
        , hash = urlObj.hash;
    
      if (host == null) {
        host = '';
        if (hostname != null) {
          host += hostname;
        }
        if (port != null) {
          host += ':' + port;
        }
      }
      if (pathname.charAt(0) !== '/') {
        pathname = '/' + pathname;
      }
      if (search != null) {
        if (search.charAt(0) !== '?') {
          search = '?' + search;
        }
      } else if (query != null) {
        search = '?' + querystring.stringify(query);
      }
      if (hash != null && hash.charAt(0) !== '#') {
        hash = '#' + hash;
      }
      return protocol + protocolPostfix + host + pathname + search + hash;
    };
    
    exports.resolve = function (from, to) {
    };
  });

  define('serializer.querystring', function (require, module, exports) {
    var encode = encodeURIComponent;
    
    exports.stringify = function (obj) {
      var key
        , tokens = [];
      for (key in obj) {
        tokens.push(key + '=' + encode(obj[key]));
      }
      return tokens.join("&");
    };
    
    exports.parse = function (str) {
      if (str == null) {
        return {};
      }
      var tokens = str.split("&")
        , obj = {}
        , i = 0
        , len = tokens.length
        , kv;
      if (len === 0) {
        throw new ErrorMessage();
      }
      for (; i < len; i++) {
        kv = tokens[i].split('=');
        obj[kv[0]] = encode(kv[1]);
      }
      return obj;
    };
    
  });

  define('timers.Ticker', function (require, module, exports) {
    var EventEmitter = require('muon.events.EventEmitter')
      , requestAnimationFrame = function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function () {
          var counter = 0;
          return function (callback) {
            setTimeout(callback, 66);
            return counter++;
          };
        }();
    }();
    
    function Ticker() {
    
    }
    
    module.exports = Ticker;
  });

  define('utils.array', function (require, module, exports) {
    var _random = Math.random
      , _shift = Array.prototype.shift
      , _slice = Array.prototype.slice
      , _toString = Object.prototype.toString;
    
    /**
     * @type {*|Function}
     */
    exports.isArray = Array.isArray || function (arr) {
      return _toString.call(arr) === '[object Array]';
    };
    
    exports.indexOf = typeof Array.prototype.indexOf === 'function' ?
      function (arr, searchElement, fromIndex) {
        return Array.prototype.indexOf.apply(_shift.call(arguments), arguments);
      }
      :
      function (arr, searchElement, fromIndex) {
        if (arr == null) {
          throw new TypeError('array.indexOf called on null or undefined')
        }
    
        var len = arr.length;
        if (len === 0) {
          return -1;
        }
    
        var i;
        if (fromIndex == null) {
          i = 0;
        } else if (fromIndex < 0) {
          i = fromIndex + len;
        } else {
          i = fromIndex;
        }
        if (i < 0) {
          i = 0;
        } else if (i > len - 1) {
          return -1;
        }
        for (; i < len; i++) {
          if (arr[i] === searchElement) {
            return i;
          }
        }
        return -1;
      };
    
    /*
     should be tested
     */
    exports.lastIndexOf = typeof Array.prototype.lastIndexOf === 'function' ?
      function (array, searchElement, fromIndex) {
        return Array.prototype.lastIndexOf.apply(_shift.call(arguments), arguments);
      }
      :
      function (arr, searchElement, fromIndex) {
        if (arr == null) {
          throw new TypeError();
        }
    
        var len = arr.length;
        if (len === 0) {
          return -1;
        }
    
        var i;
        if (fromIndex == null) {
          i = len;
        } else if (fromIndex < 0) {
          i = len + fromIndex;
        } else {
          i = fromIndex;
        }
        if (i < 0) {
          return -1;
        } else if (i > len - 1) {
          i = len - 1;
        }
        for (; i >= 0; i--) {
          if (arr[i] === searchElement) {
            return i;
          }
        }
        return -1;
      };
    
    exports.include = function (arr, elem) {
      return exports.indexOf(arr, elem) !== -1;
    };
    
    exports.compact = function (arr) {
      var i = arr.length
        , newArr = [];
      while (i--) {
        if (arr[i] != null) {
          newArr.unshift(arr[i]);
        }
      }
      return newArr;
    };
    
    exports.delete = function (arr, val) {
      var i = arr.length
        , deleted = null;
      while (i--) {
        if (arr[i] === val) {
          deleted = arr.splice(i, 1);
          deleted = deleted.length === 1 ? deleted[0] : null;
        }
      }
      return deleted;
    };
    
    exports.deleteAt = function (arr, index) {
      var deleted = arr.splice(index, 1);
      return deleted.length === 1 ? deleted[0] : null;
    };
    
    /**
     * Select value in a random drawing.
     * @param {Array} arr
     * @param {Number} length
     * @return {*|Array}
     */
    exports.random = function (arr, length) {
      if (arr == null) {
        throw new TypeError();
      }
      if (length == null) {
        length = 1;
      }
      if (arr.length === 0 || length <= 0) {
        return null;
      }
    
      if (length === 1) {
        return arr[arr.length * _random() >> 0];
      }
      arr = _slice.call(arr);
      var hits = [];
      while (length-- && arr.length) {
        hits.push(arr.splice(arr.length * _random() >> 0, 1)[0]);
      }
      return hits;
    };
    
    /**
     * Shuffle array
     * @param arr
     * @return {*}
     */
    exports.shuffle = function (arr) {
      if (arr == null) {
        throw new TypeError();
      }
    
      arr = _slice.call(arr);
      var i = arr.length
        , j
        , v;
      while (i) {
        j = _random() * i >> 0;
        v = arr[--i];
        arr[i] = arr[j];
        arr[j] = v;
      }
      return arr;
    };
    
    exports.filter = typeof Array.prototype.filter === 'function' ?
      function (array, callback, thisObject) {
        return Array.prototype.filter.apply(_shift.call(arguments), arguments);
      } :
      function (arr, callback, thisObject) {
        var i, val, _i, _len, _results;
        if (thisObject == null) {
          thisObject = null;
        }
        if (typeof callback !== 'function') {
          throw new TypeError();
        }
        _results = [];
        for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
          val = arr[i];
          if (i in arr && callback.call(thisObject, val, i, arr)) {
            _results.push(val);
          }
        }
        return _results;
      };
    
    exports.forEach = typeof Array.prototype.forEach === 'function' ?
      function (arr, callback, thisObject) {
        Array.prototype.forEach.apply(_shift.call(arguments), arguments);
      } :
      function (arr, callback, thisObject) {
        var i, val, _i, _len;
        if (thisObject == null) {
          thisObject = null;
        }
        if (typeof callback !== 'function') {
          throw new TypeError();
        }
        for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
          val = arr[i];
          if (i in arr) {
            callback.call(thisObject, val, i, arr);
          }
        }
      };
    
    exports.every = typeof Array.prototype.every === 'function' ?
      function (arr, callvack, thisObject) {
        return Array.prototype.every.apply(_shift.call(arguments), arguments);
      } :
      function (arr, callback, thisObject) {
        var i, val, _i, _len;
        if (thisObject == null) {
          thisObject = null;
        }
        if (typeof callback !== 'function') {
          throw new TypeError();
        }
        for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
          val = arr[i];
          if (i in arr && !callback.call(thisObject, val, i, arr)) {
            return false;
          }
        }
        return true;
      };
    
    exports.map = typeof Array.prototype.map === 'function' ?
      function (arr, callback, thisObject) {
        return Array.prototype.map.apply(_shift.call(arguments), arguments);
      } :
      function (arr, callback, thisObject) {
        var i, val, _i, _len, _results;
        if (thisObject == null) {
          thisObject = null;
        }
        if (typeof callback !== 'function') {
          throw new TypeError();
        }
        _results = [];
        for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
          val = arr[i];
          if (i in arr) {
            _results.push(callback.call(thisObject, val, i, arr));
          }
        }
        return _results;
      };
    
    exports.some = typeof Array.prototype.some === 'function' ?
      function (arr, callback, thisObject) {
        return Array.prototype.some.apply(_shift.call(arguments), arguments);
      } :
      function (arr, callback, thisObject) {
        var i, val, _i, _len;
        if (thisObject == null) {
          thisObject = null;
        }
        if (typeof callback !== 'function') {
          throw new TypeError();
        }
        for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
          val = arr[i];
          if (i(fo(arr && callback.call(thisObject, val, i, arr)))) {
            return true;
          }
        }
        return false;
      };
    
    exports.reduce = typeof Array.prototype.reduce === 'function' ?
      function (arr, callback, initialValue) {
        return Array.prototype.reduce.apply(_shift.call(arguments), arguments);
      } :
      function (arr, callback, initialValue) {
        var i, len, val, _i, _ref;
        if (initialValue == null) {
          initialValue = null;
        }
        len = arr.length;
        if (typeof callback !== 'function' || (len === 0 && initialValue === null)) {
          throw new TypeError();
        }
        i = 0;
        if (initialValue === null) {
          do {
            if (i in arr) {
              initialValue = arr[i++];
              break;
            }
            if (++i > len) {
              throw new TypeError();
            }
          } while (true);
    
        }
        for (val = _i = i, _ref = len - 1; _i >= _ref; val = _i += -1) {
          if (val in arr) {
            initialValue = callback.call(null, initialValue, arr[val], val, arr);
          }
        }
        return initialValue;
      };
    
    exports.reduceRight = typeof Array.prototype.reduceRight === 'function' ?
      function (arr, callback, initialValue) {
        return Array.prototype.reduceRight.apply(_shift.call(arguments), arguments);
      } :
      function (arr, callback, initialValue) {
        var i, len, val, _i;
        if (initialValue == null) {
          initialValue = null;
        }
        len = arr.length;
        if (typeof callback !== 'function' || (len === 0 && initialValue === null)) {
          throw new TypeError();
        }
        i = len - 1;
        if (initialValue === null) {
          do {
            if (i in arr) {
              initialValue = arr[i--];
              break;
            }
            if (--i <= len) {
              throw new TypeError();
            }
          } while (true);
    
        }
        for (val = _i = i; _i >= 0; val = _i += -1) {
          if (val in arr) {
            initialValue = callback.call(null, initialValue, arr[val], val, arr);
          }
        }
        return initialValue;
      };
    
    exports.toArray = function (arrayLikeObject) {
      return _slice.call(arrayLikeObject);
    };
    
    exports.unique = function (arr) {
      var storage;
      storage = {};
      for (var i = 0, elem; i < arr.length; ++i) {
        elem = arr[i];
        if (elem in storage) {
          arr.splice(i--, 1);
        }
        storage[elem] = true;
      }
      return arr;
    };
    
    exports.rotate = function (arr, index) {
      if (index == null) {
        index = 1;
      }
      if (index > 0) {
        while (index--) {
          arr.push(arr.shift());
        }
      } else if (index < 0) {
        index *= -1;
        while (index--) {
          arr.unshift(arr.pop());
        }
      }
      return arr;
    };
    
    exports.transpose = function (arr) {
      var cols, columns, elem, i, j, results, row, _i, _j, _len, _len1;
      results = [];
      columns = -1;
      for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
        row = arr[i];
        if (!ArrayUtil.isArray(row)) {
          throw new TypeError('Element isn\'t Array.');
        }
        cols = row.length;
        if (i !== 0 && cols !== columns) {
          throw new Error("Element size differ (" + cols + " should be " + columns + ")");
        }
        columns = cols;
        if (i === 0) {
          while (cols--) {
            results[cols] = [];
          }
        }
        for (j = _j = 0, _len1 = row.length; _j < _len1; j = ++_j) {
          elem = row[j];
          results[j].push(elem);
        }
      }
      return results;
    };
    
  });
  this.require = Module.require;

}).call(this);
