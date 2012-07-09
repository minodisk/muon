(function() {
  var ArrayUtil, Blend, CSSUtil, ColorMatrix, ColorMatrixFilter, DOM, Easing, Event, EventDispatcher, EventPhase, HTTP, JSON, MathUtil, Matrix, ObjectUtil, Point, QueryString, Rectangle, StringUtil, Transition, Tween, exports, _IDENTITY, _LUMA_B, _LUMA_B2, _LUMA_G, _LUMA_G2, _LUMA_R, _LUMA_R2, _ONETHIRD, _RAD, _cos, _max, _min, _mix, _peg, _sin, _tan, __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty;
  if (typeof window.muon === "undefined") window.muon = {};
  if (typeof window.muon.dom === "undefined") window.muon.dom = {};
  if (typeof window.muon.css3 === "undefined") window.muon.css3 = {};
  if (typeof window.muon.events === "undefined") window.muon.events = {};
  if (typeof window.muon.filters === "undefined") window.muon.filters = {};
  if (typeof window.muon.geom === "undefined") window.muon.geom = {};
  if (typeof window.muon.net === "undefined") window.muon.net = {};
  if (typeof window.muon.serializer === "undefined") window.muon.serializer = {};
  if (typeof window.muon.utils === "undefined") window.muon.utils = {};
  exports = window.muon;
  exports.css3.Easing = Easing = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    easeInQuad: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
    easeOutQuad: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
    easeInOutQuad: "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
    easeInQuart: "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
    easeOutQuart: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
    easeInOutQuart: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
    easeInQuint: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
    easeOutQuint: "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
    easeInOutQuint: "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
    easeInCubic: "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
    easeOutCubic: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
    easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
    easeInSine: "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
    easeOutSine: "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
    easeInOutSine: "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
    easeInExpo: "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
    easeOutExpo: "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
    easeInOutExpo: "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
    easeInCirc: "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
    easeOutCirc: "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
    easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
    easeInBack: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
    easeOutBack: "cubic-bezier(0.175,  0.885, 0.320, 1.275)",
    easeInOutBack: "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
  };
  Transition = function() {
    function Transition() {
      this._storage = {};
    }
    Transition.prototype.add = function(name, time, easing) {
      return this._storage[name] = {
        time: time,
        easing: easing
      };
    };
    Transition.prototype.remove = function(name) {
      return delete this._storage[name];
    };
    Transition.prototype.toString = function() {
      var name, tmp, value, _ref;
      tmp = [];
      _ref = this._storage;
      for (name in _ref) {
        value = _ref[name];
        tmp.push("" + name + " " + value.time / 1e3 + "s " + value.easing);
      }
      return tmp.join(", ");
    };
    return Transition;
  }();
  exports.css3.Tween = Tween = {
    _transitions: {},
    _computedStyles: {},
    to: function(elem, props, time, easing, callback) {
      var _this = this;
      if (easing == null) easing = Easing.ease;
      return setTimeout(function() {
        var computedStyle, len, listener, name, propList, transition, value, _results;
        propList = {};
        len = 0;
        computedStyle = window.getComputedStyle(elem);
        if (!(transition = _this._transitions[elem])) {
          transition = _this._transitions[elem] = new Transition;
        }
        for (name in props) {
          value = props[name];
          if (computedStyle[name] !== String(value)) {
            propList[name] = value;
            transition.add(name, time, easing);
            len++;
          }
        }
        if (len === 0) {
          setTimeout(function() {
            return typeof callback === "function" ? callback() : void 0;
          }, 0);
        }
        if (len !== 0) {
          listener = function(e) {
            elem = e.target;
            transition = _this._transitions[elem];
            transition.remove(e.propertyName);
            elem.removeEventListener("webkitTransitionEnd", listener);
            elem.style["-webkit-transition"] = transition.toString();
            return typeof callback === "function" ? callback() : void 0;
          };
          elem.addEventListener("webkitTransitionEnd", listener);
          elem.style["-webkit-transition"] = transition.toString();
          _results = [];
          for (name in propList) {
            value = propList[name];
            _results.push(elem.style[name] = value);
          }
          return _results;
        }
      }, 0);
    }
  };
  exports.dom.DOM = DOM = {
    create: function(nodeName, attrs, text) {
      var elem, key, value;
      elem = document.createElement(nodeName);
      for (key in attrs) {
        value = attrs[key];
        if (key === "value") value = StringUtil.escape(value);
        elem.setAttribute(key, value);
      }
      if (text != null) this.setText(elem, text);
      return elem;
    },
    getComputedStyle: function(elem) {
      return elem.currentStyle || document.defaultView.getComputedStyle(elem, "");
    },
    setText: function(elem, text) {
      if (typeof elem === "string") elem = document.createElement(elem);
      if (elem != null) elem.innerHTML = StringUtil.escape(text);
      return elem;
    },
    getFormData: function(form) {
      var data, elem, value, _i, _len, _ref;
      data = {};
      _ref = form.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (elem.name && elem.name !== "") {
          if (ArrayUtil.isArray(data[elem.name])) {
            data[elem.name].push(elem.value);
          } else if (data[elem.name] != null) {
            value = data[elem.name];
            data[elem.name] = [ elem.value ];
          } else {
            data[elem.name] = elem.value;
          }
        }
      }
      return data;
    },
    clearForm: function(form) {
      var elem, first, nodeName, type, _i, _len, _ref, _results;
      first = true;
      _ref = form.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if ((nodeName = elem.nodeName) === "TEXTAREA" || nodeName === "INPUT" && ((type = elem.getAttribute("type")) === "text" || type === "password")) {
          elem.value = "";
          if (first) {
            first = false;
            _results.push(elem.focus());
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    prependChild: function(elem, parent) {
      return parent.insertBefore(elem, parent.firstChild);
    },
    insertBefore: function(elem, before) {
      before.parentNode.insertBefore(elem, before.nextSibling);
      return elem;
    },
    remove: function(elem) {
      var _ref;
      return elem != null ? (_ref = elem.parentNode) != null ? _ref.removeChild(elem) : void 0 : void 0;
    },
    replaceWithInput: function(elem) {
      return elem.addEventListener("click", function(e) {
        var input, text;
        elem = e.target;
        elem.style.display = "none";
        text = elem.innerHTML;
        input = document.createElement("input");
        input.setAttribute("size", text.length);
        input.setAttribute("type", "text");
        input.className = "copy";
        input.value = text;
        DOM.insertBefore(input, elem);
        return function(input, elem) {
          setTimeout(function() {
            input.focus();
            return input.select();
          }, 0);
          return input.addEventListener("focusout", function(e) {
            DOM.remove(input);
            return elem.style.display = "inline";
          });
        }(input, elem);
      });
    },
    getRect: function(elem) {
      var el, ox, oy, sx, sy;
      ox = 0;
      oy = 0;
      el = elem;
      while (el) {
        ox += el.offsetLeft || 0;
        oy += el.offsetTop || 0;
        el = el.offsetParent;
      }
      sx = 0;
      sy = 0;
      el = elem;
      while (el) {
        sx += el.scrollLeft || 0;
        sy += el.scrollTop || 0;
        el = el.parentNode;
      }
      return {
        x: ox - sx,
        y: oy - sy,
        width: elem.offsetWidth,
        height: elem.offsetHeight
      };
    },
    listen: function() {
      if (typeof window.addEventListener === "function") {
        return function(elem, type, listener) {
          return elem.addEventListener(type, listener, false);
        };
      } else {
        return function(elem, type, listener) {
          return elem.attachEvent("on" + type, function(e) {
            e.stopPropagation = function() {
              return this.cancelBubble = true;
            };
            e.preventDefault = function() {
              return this.returnValue = false;
            };
            return listener(e);
          });
        };
      }
    }()
  };
  exports.events.Event = Event = function() {
    Event.COMPLETE = "complete";
    function Event(type, bubbles, cancelable) {
      var event;
      if (bubbles == null) bubbles = false;
      if (cancelable == null) cancelable = false;
      if (!(this instanceof Event)) return new Event(type, bubbles, cancelable);
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
    Event.prototype.formatToString = function() {
      var args, className;
      className = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return "";
    };
    Event.prototype.stopPropagation = function() {
      this._isPropagationStopped = true;
    };
    Event.prototype.stopImmediatePropagation = function() {
      this._isPropagationStopped = true;
      this._isPropagationStoppedImmediately = true;
    };
    Event.prototype.isDefaultPrevented = function() {
      return this._isDefaultPrevented;
    };
    Event.prototype.preventDefault = function() {
      this._isDefaultPrevented = true;
    };
    return Event;
  }();
  exports.events.EventDispatcher = EventDispatcher = function() {
    function EventDispatcher() {
      this._events = {};
    }
    EventDispatcher.prototype.addEventListener = function(type, listener, useCapture, priority) {
      if (useCapture == null) useCapture = false;
      if (priority == null) priority = 0;
      if (typeof type !== "string") {
        throw new TypeError("EventDispatcher#addEventListener: type isn't string");
      }
      if (typeof listener !== "function") {
        throw new TypeError("EventDispatcher#addEventListener: listener isn't function");
      }
      if (this._events[type] == null) this._events[type] = [];
      this._events[type].push({
        listener: listener,
        useCapture: useCapture,
        priority: priority
      });
      this._events[type].sort(this._sortOnPriorityInDescendingOrder);
      return this;
    };
    EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
    EventDispatcher.prototype._sortOnPriorityInDescendingOrder = function(a, b) {
      return b.priority - a.priority;
    };
    EventDispatcher.prototype.removeEventListener = function(type, listener) {
      var i, storage;
      if (storage = this._events[type]) {
        i = storage.length;
        while (i--) {
          if (storage[i].listener === listener) storage.splice(i, 1);
        }
        if (storage.length === 0) delete this._events[type];
      }
      return this;
    };
    EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;
    EventDispatcher.prototype.dispatchEvent = function(event) {
      var obj, objs, _i, _len;
      if (!(event instanceof Event)) {
        throw new TypeError("EventDispatcher#dispatchEvent: event isn't Event");
      }
      event.currentTarget = this;
      if ((objs = this._events[event.type]) != null) {
        for (_i = 0, _len = objs.length; _i < _len; _i++) {
          obj = objs[_i];
          if (obj.useCapture && event.eventPhase === EventPhase.CAPTURING_PHASE || obj.useCapture === false && event.eventPhase !== EventPhase.CAPTURING_PHASE) {
            (function(obj, event) {
              return setTimeout(function() {
                return obj.listener(event);
              }, 0);
            })(obj, event);
            if (event._isPropagationStoppedImmediately) break;
          }
        }
      }
      return !event._isDefaultPrevented;
    };
    EventDispatcher.prototype.emit = EventDispatcher.prototype.dispatchEvent;
    return EventDispatcher;
  }();
  exports.events.EventPhase = EventPhase = {
    CAPTURING_PHASE: 1,
    AT_TARGET: 2,
    BUBBLING_PHASE: 3
  };
  _mix = function(a, b, f) {
    return a + ((b - a) * f >> 8);
  };
  _peg = function(n) {
    if (n < 0) {
      return 0;
    } else if (n > 255) {
      return 255;
    } else {
      return n;
    }
  };
  _min = Math.min;
  _max = Math.max;
  exports.filters.Blend = Blend = {
    scan: function(dst, src, method) {
      var d, i, o, s, _ref, _ref2;
      method = this[method];
      if (method == null) throw new TypeError("" + method + " isn't defined.");
      d = dst.data;
      s = src.data;
      for (i = 0, _ref = d.length; i < _ref; i += 4) {
        o = method(d[i], d[i + 1], d[i + 2], d[i + 3], s[i], s[i + 1], s[i + 2], s[i + 3]);
        [].splice.apply(d, [ i, i + 3 - i + 1 ].concat(_ref2 = o.slice(0, 4))), _ref2;
      }
      return dst;
    },
    blend: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, sr, sa), _mix(dg, sg, sa), _mix(db, sb, sa), da + sa ];
    },
    add: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ dr + (sr * sa >> 8), dg + (sg * sa >> 8), db + (sb * sa >> 8), da + sa ];
    },
    subtract: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ dr - (sr * sa >> 8), dg - (sg * sa >> 8), db - (sb * sa >> 8), da + sa ];
    },
    darkest: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, _min(dr, sr * sa >> 8), sa), _mix(dg, _min(dg, sg * sa >> 8), sa), _mix(db, _min(db, sb * sa >> 8), sa), da + sa ];
    },
    lightest: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _max(dr, sr * sa >> 8), _max(dg, sg * sa >> 8), _max(db, sb * sa >> 8), da + sa ];
    },
    difference: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, dr > sr ? dr - sr : sr - dr, sa), _mix(dg, dg > sg ? dg - sg : sg - dg, sa), _mix(db, db > sb ? db - sb : sb - db, sa), da + sa ];
    },
    exclusion: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, dr + sr - (dr * sr >> 7), sa), _mix(dg, dg + sg - (dg * sg >> 7), sa), _mix(db, db + sb - (db * sb >> 7), sa), da + sa ];
    },
    reflex: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, sr === 255 ? sr : dr * dr / (255 - sr), sa), _mix(dg, sg === 255 ? sg : dg * dg / (255 - sg), sa), _mix(db, sb === 255 ? sb : db * db / (255 - sb), sa), da + sa ];
    },
    multiply: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, dr * sr >> 8, sa), _mix(dg, dg * sg >> 8, sa), _mix(db, db * sb >> 8, sa), da + sa ];
    },
    screen: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, 255 - ((255 - dr) * (255 - sr) >> 8), sa), _mix(dg, 255 - ((255 - dg) * (255 - sg) >> 8), sa), _mix(db, 255 - ((255 - db) * (255 - sb) >> 8), sa), da + sa ];
    },
    overlay: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, dr < 128 ? dr * sr >> 7 : 255 - ((255 - dr) * (255 - sr) >> 7), sa), _mix(dg, dg < 128 ? dg * sg >> 7 : 255 - ((255 - dg) * (255 - sg) >> 7), sa), _mix(db, db < 128 ? db * sb >> 7 : 255 - ((255 - db) * (255 - sb) >> 7), sa), da + sa ];
    },
    softLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, (dr * sr >> 7) + (dr * dr >> 8) - (dr * dr * sr >> 15), sa), _mix(dg, (dg * sg >> 7) + (dg * dg >> 8) - (dg * dg * sg >> 15), sa), _mix(db, (db * sb >> 7) + (db * db >> 8) - (db * db * sb >> 15), sa), da + sa ];
    },
    hardLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, sr < 128 ? dr * sr >> 7 : 255 - ((255 - dr) * (255 - sr) >> 7), sa), _mix(dg, sg < 128 ? dg * sg >> 7 : 255 - ((255 - dg) * (255 - sg) >> 7), sa), _mix(db, sb < 128 ? db * sb >> 7 : 255 - ((255 - db) * (255 - sb) >> 7), sa), da + sa ];
    },
    vividLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ sr === 0 ? 0 : sr === 255 ? 255 : sr < 128 ? 255 - _peg((255 - dr << 8) / (sr * 2)) : _peg((dr << 8) / ((255 - sr) * 2)), sg === 0 ? 0 : sg === 255 ? 255 : sg < 128 ? 255 - _peg((255 - dg << 8) / (sg * 2)) : _peg((dg << 8) / ((255 - sg) * 2)), sb === 0 ? 0 : sb === 255 ? 255 : sb < 128 ? 255 - _peg((255 - db << 8) / (sb * 2)) : _peg((db << 8) / ((255 - sb) * 2)), da + sa ];
    },
    linearLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ sr < 128 ? _max(sr * 2 + dr - 255, 0) : _min(sr + dr, 255), sg < 128 ? _max(sg * 2 + dg - 255, 0) : _min(sg + dg, 255), sb < 128 ? _max(sb * 2 + db - 255, 0) : _min(sb + db, 255), da + sa ];
    },
    pinLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ sr < 128 ? _min(sr * 2, dr) : _max((sr - 128) * 2, dr), sg < 128 ? _min(sg * 2, dg) : _max((sg - 128) * 2, dg), sb < 128 ? _min(sb * 2, db) : _max((sb - 128) * 2, db), da + sa ];
    },
    hardMix: function(dr, dg, db, da, sr, sg, sb, sa) {
      var b, g, r;
      r = sr === 0 ? 0 : sr === 255 ? 255 : sr < 128 ? 255 - _peg((255 - dr << 8) / (sr * 2)) : _peg((dr << 8) / ((255 - sr) * 2));
      g = sg === 0 ? 0 : sg === 255 ? 255 : sg < 128 ? 255 - _peg((255 - dg << 8) / (sg * 2)) : _peg((dg << 8) / ((255 - sg) * 2));
      b = sb === 0 ? 0 : sb === 255 ? 255 : sb < 128 ? 255 - _peg((255 - db << 8) / (sb * 2)) : _peg((db << 8) / ((255 - sb) * 2));
      r = r < 128 ? 0 : 255;
      g = g < 128 ? 0 : 255;
      b = b < 128 ? 0 : 255;
      return [ dr * (255 - sa) / 255 + r * sa / 255, dg * (255 - sa) / 255 + g * sa / 255, db * (255 - sa) / 255 + b * sa / 255, da + sa ];
    },
    dodge: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, _peg((dr << 8) / (255 - sr)), sa), _mix(dg, _peg((dg << 8) / (255 - sg)), sa), _mix(db, _peg((db << 8) / (255 - sb)), sa), da + sa ];
    },
    burn: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, sr === 0 ? 0 : 255 - _peg((255 - dr << 8) / sr), sa), _mix(dg, sg === 0 ? 0 : 255 - _peg((255 - dg << 8) / sg), sa), _mix(db, sb === 0 ? 0 : 255 - _peg((255 - db << 8) / sb), sa), da + sa ];
    },
    linearDodge: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, _min(sr + dr, 255), sa), _mix(dg, _min(dg + sg, 255), sa), _mix(db, _min(db + sb, 255), sa), da + sa ];
    },
    linearBurn: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [ _mix(dr, _max(sr + dr - 255, 0), sa), _mix(dg, _max(dg + sg - 255, 0), sa), _mix(db, _max(db + sb - 255, 0), sa), da + sa ];
    }
  };
  exports.filters.ColorMatrixFilter = ColorMatrixFilter = function() {
    function ColorMatrixFilter(matrix) {
      this.matrix = matrix;
    }
    ColorMatrixFilter.prototype.scan = function(src, dst) {
      var a, b, d, g, i, m, r, s, _ref;
      m = this.matrix.matrix;
      s = src.data;
      d = dst.data;
      for (i = 0, _ref = d.length; i < _ref; i += 4) {
        r = s[i];
        g = s[i + 1];
        b = s[i + 2];
        a = s[i + 3];
        d[i] = r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4];
        d[i + 1] = r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9];
        d[i + 2] = r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14];
        d[i + 3] = r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19];
      }
      return dst;
    };
    return ColorMatrixFilter;
  }();
  _LUMA_R = .212671;
  _LUMA_G = .71516;
  _LUMA_B = .072169;
  _LUMA_R2 = .3086;
  _LUMA_G2 = .6094;
  _LUMA_B2 = .082;
  _ONETHIRD = 1 / 3;
  _IDENTITY = [ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0 ];
  _RAD = Math.PI / 180;
  exports.geom.ColorMatrix = ColorMatrix = function() {
    function ColorMatrix(matrix) {
      if (matrix instanceof ColorMatrix) {
        this.matrix = matrix.matrix.concat();
      } else if (Array.isArray(matrix)) {
        this.matrix = matrix.concat();
      } else {
        this.reset();
      }
    }
    ColorMatrix.prototype.toString = function() {
      var i, l, t, tmp, v, x, y, _len, _ref, _ref2, _ref3, _ref4;
      tmp = [];
      _ref = this.matrix;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        v = _ref[i];
        if (i % 5 === 0) t = [];
        t.push(String(v));
        if (i % 5 === 4 || i === this.matrix.length - 1) tmp.push(t);
      }
      for (x = 0; x < 5; x++) {
        l = 0;
        for (y = 0, _ref2 = tmp.length; y < _ref2; y += 1) {
          l = Math.max(l, tmp[y][x].length);
        }
        for (y = 0, _ref3 = tmp.length; y < _ref3; y += 1) {
          tmp[y][x] = StringUtil.padLeft(tmp[y][x], l);
        }
      }
      for (y = 0, _ref4 = tmp.length; y < _ref4; y += 1) {
        tmp[y] = tmp[y].join(", ");
        if (y !== tmp.length - 1) tmp[y] += ",";
      }
      return tmp.join("\n");
    };
    ColorMatrix.prototype.clone = function() {
      return new ColorMatrix(this.matrix);
    };
    ColorMatrix.prototype.reset = function() {
      return this.matrix = _IDENTITY.concat();
    };
    ColorMatrix.prototype.concat = function(src) {
      var dst, i, out, x, y;
      dst = this.matrix;
      out = [];
      for (y = 0; y < 4; y++) {
        i = 5 * y;
        for (x = 0; x < 5; x++) {
          out[i + x] = src[i] * dst[x] + src[i + 1] * dst[x + 5] + src[i + 2] * dst[x + 10] + src[i + 3] * dst[x + 15];
        }
        out[i + 4] += src[i + 4];
      }
      this.matrix = out;
      return this;
    };
    ColorMatrix.prototype.invert = function() {
      return this.concat([ -1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.adjustSaturation = function(s) {
      var iblum, iglum, irlum;
      irlum = -s * _LUMA_R;
      iglum = -s * _LUMA_G;
      iblum = -s * _LUMA_B;
      ++s;
      return this.concat([ irlum + s, iglum, iblum, 0, 0, irlum, iglum + s, iblum, 0, 0, irlum, iglum, iblum + s, 0, 0, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.adjustContrast = function(r, g, b) {
      if (g == null) g = r;
      if (b == null) b = r;
      return this.concat([ 1 + r, 0, 0, 0, -128 * r, 0, 1 + g, 0, 0, -128 * g, 0, 0, 1 + b, 0, -128 * b, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.adjustBrightness = function(r, g, b) {
      if (g == null) g = r;
      if (b == null) b = r;
      return this.concat([ 1, 0, 0, 0, 255 * r, 0, 1, 0, 0, 255 * g, 0, 0, 1, 0, 255 * b, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.adjustHue = function(degree) {
      var B, G, R, c, l, m, n, s;
      R = _LUMA_R;
      G = _LUMA_G;
      B = _LUMA_B;
      degree *= _RAD;
      c = Math.cos(degree);
      s = Math.sin(degree);
      l = 1 - c;
      m = l - s;
      n = l + s;
      return this.concat([ R * m + c, G * m, B * m + s, 0, 0, R * l + s * .143, G * l + c + s * .14, B * l + s * -.283, 0, 0, R * n - s, G * n, B * n + c, 0, 0, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.rotateHue = function(degree) {
      this._initHue();
      this.concat(this._preHue.matrix);
      this.rotateBlue(degree);
      return this.concat(this._postHue.matrix);
    };
    ColorMatrix.prototype.luminance2Alpha = function() {
      return this.concat([ 0, 0, 0, 0, 255, 0, 0, 0, 0, 255, 0, 0, 0, 0, 255, _LUMA_R, _LUMA_G, _LUMA_B, 0, 0 ]);
    };
    ColorMatrix.prototype.adjustAlphaContrast = function(amount) {
      return this.concat([ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, amount + 1, -128 * amount ]);
    };
    ColorMatrix.prototype.colorize = function(rgb, amount) {
      var B, G, R, b, g, invAmount, r;
      if (amount == null) amount = 1;
      R = _LUMA_R;
      G = _LUMA_G;
      B = _LUMA_B;
      r = (rgb >> 16 & 255) / 255;
      g = (rgb >> 8 & 255) / 255;
      b = (rgb & 255) / 255;
      invAmount = 1 - amount;
      return this.concat([ invAmount + amount * r * R, amount * r * G, amount * r * B, 0, 0, amount * g * R, invAmount + amount * g * G, amount * g * B, 0, 0, amount * b * R, amount * b * G, invAmount + amount * b * B, 0, 0, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.setChannels = function(r, g, b, a) {
      var af, bf, gf, rf;
      if (r == null) r = 1;
      if (g == null) g = 2;
      if (b == null) b = 4;
      if (a == null) a = 8;
      rf = ((r & 1) === 1 ? 1 : 0) + ((r & 2) === 2 ? 1 : 0) + ((r & 4) === 4 ? 1 : 0) + ((r & 8) === 8 ? 1 : 0);
      if (rf > 0) rf = 1 / rf;
      gf = ((g & 1) === 1 ? 1 : 0) + ((g & 2) === 2 ? 1 : 0) + ((g & 4) === 4 ? 1 : 0) + ((g & 8) === 8 ? 1 : 0);
      if (gf > 0) gf = 1 / gf;
      bf = ((b & 1) === 1 ? 1 : 0) + ((b & 2) === 2 ? 1 : 0) + ((b & 4) === 4 ? 1 : 0) + ((b & 8) === 8 ? 1 : 0);
      if (bf > 0) bf = 1 / bf;
      af = ((a & 1) === 1 ? 1 : 0) + ((a & 2) === 2 ? 1 : 0) + ((a & 4) === 4 ? 1 : 0) + ((a & 8) === 8 ? 1 : 0);
      if (af > 0) af = 1 / af;
      return this.concat([ (r & 1) === 1 ? rf : 0, (r & 2) === 2 ? rf : 0, (r & 4) === 4 ? rf : 0, (r & 8) === 8 ? rf : 0, 0, (g & 1) === 1 ? gf : 0, (g & 2) === 2 ? gf : 0, (g & 4) === 4 ? gf : 0, (g & 8) === 8 ? gf : 0, 0, (b & 1) === 1 ? bf : 0, (b & 2) === 2 ? bf : 0, (b & 4) === 4 ? bf : 0, (b & 8) === 8 ? bf : 0, 0, (a & 1) === 1 ? af : 0, (a & 2) === 2 ? af : 0, (a & 4) === 4 ? af : 0, (a & 8) === 8 ? af : 0, 0 ]);
    };
    ColorMatrix.prototype.blend = function(matrix, amount) {
      var i, v, _len, _ref;
      _ref = matrix.matrix;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        v = _ref[i];
        this.matrix[i] = this.matrix[i] * (1 - amount) + v * amount;
      }
      return this;
    };
    ColorMatrix.prototype.average = function(r, g, b) {
      if (r == null) r = _ONETHIRD;
      if (g == null) g = _ONETHIRD;
      if (b == null) b = _ONETHIRD;
      return this.concat([ r, g, b, 0, 0, r, g, b, 0, 0, r, g, b, 0, 0, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.threshold = function(threshold, factor) {
      var B, G, R, t;
      if (factor == null) factor = 256;
      R = factor * _LUMA_R;
      G = factor * _LUMA_G;
      B = factor * _LUMA_B;
      t = -factor * threshold;
      return this.concat([ R, G, B, 0, t, R, G, B, 0, t, R, G, B, 0, t, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.desaturate = function() {
      var B, G, R;
      R = _LUMA_R;
      G = _LUMA_G;
      B = _LUMA_B;
      return this.concat([ R, G, B, 0, 0, R, G, B, 0, 0, R, G, B, 0, 0, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.randomize = function(amount) {
      var b1, b2, b3, g1, g2, g3, inv_amount, o1, o2, o3, r1, r2, r3;
      if (amount == null) amount = 1;
      inv_amount = 1 - amount;
      r1 = inv_amount + amount * (Math.random() - Math.random());
      g1 = amount * (Math.random() - Math.random());
      b1 = amount * (Math.random() - Math.random());
      o1 = amount * 255 * (Math.random() - Math.random());
      r2 = amount * (Math.random() - Math.random());
      g2 = inv_amount + amount * (Math.random() - Math.random());
      b2 = amount * (Math.random() - Math.random());
      o2 = amount * 255 * (Math.random() - Math.random());
      r3 = amount * (Math.random() - Math.random());
      g3 = amount * (Math.random() - Math.random());
      b3 = inv_amount + amount * (Math.random() - Math.random());
      o3 = amount * 255 * (Math.random() - Math.random());
      return this.concat([ r1, g1, b1, 0, o1, r2, g2, b2, 0, o2, r3, g3, b3, 0, o3, 0, 0, 0, 1, 0 ]);
    };
    ColorMatrix.prototype.setMultiplicators = function(r, g, b, a) {
      if (r == null) r = 1;
      if (g == null) g = 1;
      if (b == null) b = 1;
      if (a == null) a = 1;
      return this.concat([ r, 0, 0, 0, 0, 0, g, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, a, 0 ]);
    };
    ColorMatrix.prototype.clearChannels = function(r, g, b, a) {
      if (r == null) r = false;
      if (g == null) g = false;
      if (b == null) b = false;
      if (a == null) a = false;
      if (r) {
        this.matrix[0] = this.matrix[1] = this.matrix[2] = this.matrix[3] = this.matrix[4] = 0;
      }
      if (g) {
        this.matrix[5] = this.matrix[6] = this.matrix[7] = this.matrix[8] = this.matrix[9] = 0;
      }
      if (b) {
        this.matrix[10] = this.matrix[11] = this.matrix[12] = this.matrix[13] = this.matrix[14] = 0;
      }
      if (a) {
        return this.matrix[15] = this.matrix[16] = this.matrix[17] = this.matrix[18] = this.matrix[19] = 0;
      }
    };
    ColorMatrix.prototype.thresholdAlpha = function(threshold, factor) {
      if (factor == null) factor = 256;
      return this.concat([ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, factor, -factor * threshold ]);
    };
    ColorMatrix.prototype.averageRGB2Alpha = function() {
      return this.concat([ 0, 0, 0, 0, 255, 0, 0, 0, 0, 255, 0, 0, 0, 0, 255, _ONETHIRD, _ONETHIRD, _ONETHIRD, 0, 0 ]);
    };
    ColorMatrix.prototype.invertAlpha = function() {
      return this.concat([ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1, 255 ]);
    };
    ColorMatrix.prototype.rgb2Alpha = function(r, g, b) {
      return this.concat([ 0, 0, 0, 0, 255, 0, 0, 0, 0, 255, 0, 0, 0, 0, 255, r, g, b, 0, 0 ]);
    };
    ColorMatrix.prototype.setAlpha = function(alpha) {
      return this.concat([ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, alpha, 0 ]);
    };
    ColorMatrix.prototype.rotateRed = function(degree) {
      return this._rotateColor(degree, 2, 1);
    };
    ColorMatrix.prototype.rotateGreen = function(degree) {
      return this._rotateColor(degree, 0, 2);
    };
    ColorMatrix.prototype.rotateBlue = function(degree) {
      return this._rotateColor(degree, 1, 0);
    };
    ColorMatrix.prototype._rotateColor = function(degree, x, y) {
      var mat;
      degree *= _RAD;
      mat = _IDENTITY.concat();
      mat[x + x * 5] = mat[y + y * 5] = Math.cos(degree);
      mat[y + x * 5] = Math.sin(degree);
      mat[x + y * 5] = -Math.sin(degree);
      return this.concat(mat);
    };
    ColorMatrix.prototype.shearRed = function(green, blue) {
      return this._shearColor(0, 1, green, 2, blue);
    };
    ColorMatrix.prototype.shearGreen = function(red, blue) {
      return this._shearColor(1, 0, red, 2, blue);
    };
    ColorMatrix.prototype.shearBlue = function(red, green) {
      return this._shearColor(2, 0, red, 1, green);
    };
    ColorMatrix.prototype._shearColor = function(x, y1, d1, y2, d2) {
      var mat;
      mat = _IDENTITY.concat();
      mat[y1 + x * 5] = d1;
      mat[y2 + x * 5] = d2;
      return this.concat(mat);
    };
    ColorMatrix.prototype.applyColorDeficiency = function(type) {
      switch (type) {
       case "Protanopia":
        this.concat([ .567, .433, 0, 0, 0, .558, .442, 0, 0, 0, 0, .242, .758, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
       case "Protanomaly":
        this.concat([ .817, .183, 0, 0, 0, .333, .667, 0, 0, 0, 0, .125, .875, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
       case "Deuteranopia":
        this.concat([ .625, .375, 0, 0, 0, .7, .3, 0, 0, 0, 0, .3, .7, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
       case "Deuteranomaly":
        this.concat([ .8, .2, 0, 0, 0, .258, .742, 0, 0, 0, 0, .142, .858, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
       case "Tritanopia":
        this.concat([ .95, .05, 0, 0, 0, 0, .433, .567, 0, 0, 0, .475, .525, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
       case "Tritanomaly":
        this.concat([ .967, .033, 0, 0, 0, 0, .733, .267, 0, 0, 0, .183, .817, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
       case "Achromatopsia":
        this.concat([ .299, .587, .114, 0, 0, .299, .587, .114, 0, 0, .299, .587, .114, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
       case "Achromatomaly":
        this.concat([ .618, .32, .062, 0, 0, .163, .775, .062, 0, 0, .163, .32, .516, 0, 0, 0, 0, 0, 1, 0 ]);
        break;
      }
    };
    ColorMatrix.prototype.applyMatrix = function(rgba) {
      var a, a2, b, b2, g, g2, m, r, r2;
      a = rgba >>> 24 & 255;
      r = rgba >>> 16 & 255;
      g = rgba >>> 8 & 255;
      b = rgba & 255;
      m = this.matrix;
      r2 = .5 + r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4];
      g2 = .5 + r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9];
      b2 = .5 + r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14];
      a2 = .5 + r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19];
      if (a2 < 0) a2 = 0;
      if (a2 > 255) a2 = 255;
      if (r2 < 0) r2 = 0;
      if (r2 > 255) r2 = 255;
      if (g2 < 0) g2 = 0;
      if (g2 > 255) g2 = 255;
      if (b2 < 0) b2 = 0;
      if (b2 > 255) b2 = 255;
      return a2 << 24 | r2 << 16 | g2 << 8 | b2;
    };
    ColorMatrix.prototype.transformVector = function(values) {
      var m, oA, oB, oG, oR, sA, sB, sG, sR;
      if (values.length !== 4) throw new TypeError("values length isn't 4");
      m = this.matrix;
      sR = values[0];
      sG = values[1];
      sB = values[2];
      sA = values[3];
      oR = sR * m[0] + sG * m[1] + sB * m[2] + sA * m[3] + m[4];
      oG = sR * m[5] + sG * m[6] + sB * m[7] + sA * m[8] + m[9];
      oB = sR * m[10] + sG * m[11] + sB * m[12] + sA * m[13] + m[14];
      oA = sR * m[15] + sG * m[16] + sB * m[17] + sA * m[18] + m[19];
      values[0] = oR;
      values[1] = oG;
      values[2] = oB;
      return values[3] = oA;
    };
    ColorMatrix.prototype._initHue = function() {
      var green, greenRotation, lum, red;
      greenRotation = 39.182655;
      if (!this._hueInitialized) {
        this._hueInitialized = true;
        this._preHue = new ColorMatrix;
        this._preHue.rotateRed(45);
        this._preHue.rotateGreen(-greenRotation);
        lum = [ _LUMA_R2, _LUMA_G2, _LUMA_B2, 1 ];
        this._preHue.transformVector(lum);
        red = lum[0] / lum[2];
        green = lum[1] / lum[2];
        this._preHue.shearBlue(red, green);
        this._postHue = new ColorMatrix;
        this._postHue.shearBlue(-red, -green);
        this._postHue.rotateGreen(greenRotation);
        return this._postHue.rotateRed(-45);
      }
    };
    return ColorMatrix;
  }();
  _sin = Math.sin;
  _cos = Math.cos;
  _tan = Math.tan;
  exports.geom.Matrix = Matrix = function() {
    function Matrix(xx, xy, yx, yy, ox, oy) {
      this.xx = xx != null ? xx : 1;
      this.xy = xy != null ? xy : 0;
      this.yx = yx != null ? yx : 0;
      this.yy = yy != null ? yy : 1;
      this.ox = ox != null ? ox : 0;
      this.oy = oy != null ? oy : 0;
    }
    Matrix.prototype.identity = function() {
      this.xx = 1;
      this.xy = 0;
      this.yx = 0;
      this.yy = 1;
      this.ox = 0;
      return this.oy = 0;
    };
    Matrix.prototype.clone = function() {
      return new Matrix(this.xx, this.xy, this.yx, this.yy, this.ox, this.oy);
    };
    Matrix.prototype.toString = function() {
      return "" + this.xx + " " + this.yx + " " + this.ox + "\n" + this.xy + " " + this.yy + " " + this.oy + "\n0 0 1";
    };
    Matrix.prototype.apply = function(_arg) {
      var ox, oy, xx, xy, yx, yy;
      xx = _arg.xx, xy = _arg.xy, yx = _arg.yx, yy = _arg.yy, ox = _arg.ox, oy = _arg.oy;
      return this._apply(xx, xy, yx, yy, ox, oy);
    };
    Matrix.prototype._apply = function(xx, xy, yx, yy, ox, oy) {
      this.xx = xx;
      this.xy = xy;
      this.yx = yx;
      this.yy = yy;
      this.ox = ox;
      this.oy = oy;
      return this;
    };
    Matrix.prototype.setTo = function(context) {
      return context.setTransform(this.xx, this.xy, this.yx, this.yy, this.ox, this.oy);
    };
    Matrix.prototype.concat = function(_arg) {
      var ox, oy, xx, xy, yx, yy;
      xx = _arg.xx, xy = _arg.xy, yx = _arg.yx, yy = _arg.yy, ox = _arg.ox, oy = _arg.oy;
      return this._concat(xx, xy, yx, yy, ox, oy);
    };
    Matrix.prototype._concat = function(xx, xy, yx, yy, ox, oy) {
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
    Matrix.prototype.translate = function(tx, ty) {
      return this._concat(1, 0, 0, 1, tx, ty);
    };
    Matrix.prototype.translatePoint = function(_arg) {
      var x, y;
      x = _arg.x, y = _arg.y;
      return this.translate(x, y);
    };
    Matrix.prototype.scale = function(sx, sy) {
      return this._concat(sx, 0, 0, sy, 0, 0);
    };
    Matrix.prototype.scalePoint = function(_arg) {
      var x, y;
      x = _arg.x, y = _arg.y;
      return this.scale(x, y);
    };
    Matrix.prototype.rotate = function(angle) {
      var c, s;
      c = _cos(angle);
      s = _sin(angle);
      return this._concat(c, s, -s, c, 0, 0);
    };
    Matrix.prototype.skew = function(skewX, skewY) {
      return this._concat(0, _tan(skewY), _tan(skewX), 0, 0, 0);
    };
    Matrix.prototype.invert = function() {
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
    Matrix.prototype.transformPoint = function(_arg) {
      var x, y;
      x = _arg.x, y = _arg.y;
      return new Point(this.xx * x + this.yx * y + this.ox, this.xy * x + this.yy * y + this.oy);
    };
    Matrix.prototype.deltaTransformPoint = function(_arg) {
      var x, y;
      x = _arg.x, y = _arg.y;
      return new Point(this.xx * x + this.yx * y, this.xy * x + this.yy * y);
    };
    Matrix.prototype.createBox = function(scaleX, scaleY, rotation, tx, ty) {
      var c, s;
      if (rotation == null) rotation = 0;
      if (tx == null) tx = 0;
      if (ty == null) ty = 0;
      c = _cos(rotation);
      s = _sin(rotation);
      return this._concat(scaleX * c, scaleY * s, -scaleX * s, scaleY * c, tx, ty);
    };
    Matrix.prototype.createGradientBox = function(width, height, rotation, x, y) {
      if (rotation == null) rotation = 0;
      if (x == null) x = 0;
      if (y == null) y = 0;
      return this.createBox(width / 1638.4, height / 1638.4, rotation, x + width / 2, y + height / 2);
    };
    return Matrix;
  }();
  exports.geom.Point = Point = function() {
    Point.polar = function(distance, angle) {
      return new Point(distance * _cos(angle), distance * _sin(angle));
    };
    Point.add = function(pt0, pt1) {
      return new Point(pt0.x + pt1.x, pt0.y + pt1.y);
    };
    Point.subtract = function(pt0, pt1) {
      return new Point(pt0.x - pt1.x, pt0.y - pt1.y);
    };
    Point.multiple = function(pt, num) {
      return new Point(pt.x * num, pt.y * num);
    };
    Point.divide = function(pt, num) {
      return new Point(pt.x / num, pt.y / num);
    };
    Point.crossProduct = function(a, b) {
      return a.distance * b.distance * _sin(b.angle - a.angle);
    };
    Point.dotProduct = function(a, b) {};
    Point.distance = function(a, b) {
      var x, y;
      x = a.x - b.x;
      y = a.y - b.y;
      return Math.sqrt(x * x + y * y);
    };
    Point.between = function(src, dst, ratio) {
      if (ratio == null) ratio = .5;
      return new Point(src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio);
    };
    function Point(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }
    Point.prototype.distance = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Point.prototype.angle = function() {
      return Math.atan2(this.y, this.x);
    };
    Point.prototype.clone = function() {
      return new Point(this.x, this.y);
    };
    Point.prototype.add = function(pt) {
      this.x += pt.x;
      this.y += pt.y;
      return this;
    };
    Point.prototype.subtract = function(pt) {
      this.x -= pt.x;
      this.y -= pt.y;
      return this;
    };
    Point.prototype.multiple = function(num) {
      this.x *= num;
      this.y *= num;
      return this;
    };
    Point.prototype.divide = function(num) {
      this.x /= num;
      this.y /= num;
      return this;
    };
    Point.prototype.toString = function() {
      return "(" + this.x + ", " + this.y + ")";
    };
    Point.prototype.toPolar = function() {
      return new Polar(this.distance, this.angle);
    };
    Point.prototype.equals = function(pt) {
      return this.x === pt.x && this.y === pt.y;
    };
    Point.prototype.normalize = function(thickness) {
      var ratio;
      if (thickness == null) thickness = 1;
      ratio = thickness / Math.sqrt(this.x * this.x + this.y * this.y);
      this.x *= ratio;
      this.y *= ratio;
      return this;
    };
    Point.prototype.transform = function(matrix) {
      var m;
      m = new Matrix(1, 0, 0, 1, this.x, this.y);
      m.concat(matrix);
      this.x = m.ox;
      this.y = m.oy;
      return this;
    };
    return Point;
  }();
  exports.geom.Rectangle = Rectangle = function() {
    function Rectangle(x, y, width, height) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.width = width != null ? width : 0;
      this.height = height != null ? height : 0;
    }
    Rectangle.prototype.toString = function() {
      return "[Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    };
    Rectangle.prototype.left = function() {
      return Math.min(this.x, this.x + this.width);
    };
    Rectangle.prototype.right = function() {
      return Math.max(this.x, this.x + this.width);
    };
    Rectangle.prototype.top = function() {
      return Math.min(this.y, this.y + this.height);
    };
    Rectangle.prototype.bottom = function() {
      return Math.max(this.y, this.y + this.height);
    };
    Rectangle.prototype.clone = function() {
      return new Rectangle(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.apply = function(rect) {
      this.x = rect.x;
      this.y = rect.y;
      this.width = rect.width;
      this.height = rect.height;
      return this;
    };
    Rectangle.prototype.contains = function(x, y) {
      return this.x < x && x < this.x + this.width && this.y < y && y < this.y + this.height;
    };
    Rectangle.prototype.containsPoint = function(point) {
      var _ref, _ref2;
      return this.x < (_ref = point.x) && _ref < this.x + this.width && this.y < (_ref2 = point.y) && _ref2 < this.y + this.height;
    };
    Rectangle.prototype.contain = function(x, y) {
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
    Rectangle.prototype.offset = function(dx, dy) {
      this.x += dx;
      this.y += dy;
      return this;
    };
    Rectangle.prototype.offsetPoint = function(pt) {
      this.x += pt.x;
      this.y += pt.y;
      return this;
    };
    Rectangle.prototype.inflate = function(dw, dh) {
      this.width += dw;
      this.height += dh;
      return this;
    };
    Rectangle.prototype.inflatePoint = function(pt) {
      this.width += pt.x;
      this.height += pt.y;
      return this;
    };
    Rectangle.prototype.deflate = function(dw, dh) {
      this.width -= dw;
      this.height -= dh;
      return this;
    };
    Rectangle.prototype.deflatePoint = function(pt) {
      this.width -= pt.x;
      this.height -= pt.y;
      return this;
    };
    Rectangle.prototype.union = function(rect) {
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
    Rectangle.prototype.isEmpty = function() {
      return this.x === 0 && this.y === 0 && this.width === 0 && this.height === 0;
    };
    Rectangle.prototype.intersects = function(rect) {
      var b, h, l, r, t, w;
      l = _max(this.x, rect.x);
      r = _min(this.x + this.width, rect.x + rect.width);
      w = r - l;
      if (w <= 0) return false;
      t = _max(this.y, rect.y);
      b = _min(this.y + this.height, rect.y + rect.height);
      h = b - t;
      if (h <= 0) return false;
      return true;
    };
    Rectangle.prototype.intersection = function(rect) {
      var b, h, l, r, t, w;
      l = _max(this.x, rect.x);
      r = _min(this.x + this.width, rect.x + rect.width);
      w = r - l;
      if (w <= 0) return new Rectangle;
      t = _max(this.y, rect.y);
      b = _min(this.y + this.height, rect.y + rect.height);
      h = b - t;
      if (h <= 0) return new Rectangle;
      return new Rectangle(l, t, w, h);
    };
    Rectangle.prototype.measureFarDistance = function(x, y) {
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
      min = _max(dl + dt, dr + dt, dr + db, dl + db);
      return _sqrt(min);
    };
    Rectangle.prototype.adjustOuter = function() {
      var x, y;
      x = Math.floor(this.x);
      y = Math.floor(this.y);
      if (x !== this.x) this.width++;
      if (y !== this.y) this.height++;
      this.x = x;
      this.y = y;
      this.width = Math.ceil(this.width);
      this.height = Math.ceil(this.height);
      return this;
    };
    Rectangle.prototype.transform = function(matrix) {
      var b, l, lb, lt, r, rb, rt, t;
      lt = new Matrix(1, 0, 0, 1, this.x, this.y);
      rt = new Matrix(1, 0, 0, 1, this.x + this.width, this.y);
      rb = new Matrix(1, 0, 0, 1, this.x + this.width, this.y + this.height);
      lb = new Matrix(1, 0, 0, 1, this.x, this.y + this.height);
      lt.concat(matrix);
      rt.concat(matrix);
      rb.concat(matrix);
      lb.concat(matrix);
      l = _min(lt.ox, rt.ox, rb.ox, lb.ox);
      r = _max(lt.ox, rt.ox, rb.ox, lb.ox);
      t = _min(lt.oy, rt.oy, rb.oy, lb.oy);
      b = _max(lt.oy, rt.oy, rb.oy, lb.oy);
      this.x = l;
      this.y = t;
      this.width = r - l;
      this.height = b - t;
      return this;
    };
    return Rectangle;
  }();
  exports.net.HTTP = HTTP = {
    createFormData: function(data) {
      var formData, name, value, _len;
      formData = new FormData;
      for (value = 0, _len = data.length; value < _len; value++) {
        name = data[value];
        formData.append(name, value);
      }
      return formData;
    },
    get: function(options, callback) {
      options.method = "get";
      return this.request(options, callback);
    },
    post: function(options, callback) {
      options.method = "post";
      return this.request(options, callback);
    },
    request: function(options, callback) {
      var contentType, data, dataType, method, url, xhr, _ref, _ref2;
      method = ((_ref = options.method) != null ? _ref.toLowerCase() : void 0) || "get";
      url = options.url;
      dataType = (_ref2 = options.dataType) != null ? _ref2.toLowerCase() : void 0;
      data = options.data;
      if (!(data instanceof FormData)) {
        if (dataType === "json") {
          contentType = "application/json;charset=UTF-8";
        } else {
          contentType = "application/x-www-form-urlencoded;charset=UTF-8";
        }
      }
      if (method === "get" && data != null) {
        url = "" + url + "?" + data;
        data = null;
      }
      xhr = new (window.ActiveXObject || XMLHTTPRequest)("Microsoft.XMLHTTP");
      if (options.onProgress != null) {
        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) return options.onProgress(e.loaded / e.total);
        };
      }
      if (options.onComplete != null) {
        xhr.upload.onload = function(e) {
          return options.onComplete();
        };
      }
      if (callback != null) {
        xhr.onreadystatechange = function(e) {
          var _ref3;
          if (xhr.readyState === 4) {
            if ((_ref3 = xhr.status) === 0 || _ref3 === 200) {
              data = xhr.responseText;
              return callback(null, data);
            } else {
              return callback({
                code: xhr.status,
                message: "" + xhr.status + " (" + xhr.statusText + ")" + (xhr.responseText ? ": " + xhr.responseText : "")
              });
            }
          }
        };
      }
      xhr.open(method, url, true);
      if (typeof xhr.overrideMimeType === "function") {
        xhr.overrideMimeType("text/plain");
      }
      xhr.setRequestHeader("X-Requested-With", "XMLHTTPRequest");
      if (contentType) xhr.setRequestHeader("content-type", contentType);
      return xhr.send(data);
    }
  };
  exports.serializer.JSON = JSON = function() {
    if (window.JSON != null) {
      return window.JSON;
    } else {
      JSON = {};
      (function() {
        var cx, escapable, f, gap, indent, meta, quote, rep, str;
        f = function(n) {
          if (n < 10) {
            return "0" + n;
          } else {
            return n;
          }
        };
        if (typeof Date.prototype.toJSON !== "function") {
          Date.prototype.toJSON = function(key) {
            if (isFinite(this.valueOf())) {
              return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z";
            } else {
              return null;
            }
          };
          String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf();
          };
        }
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        gap = null;
        indent = null;
        meta = {
          "\b": "\\b",
          "	": "\\t",
          "\n": "\\n",
          "\f": "\\f",
          "\r": "\\r",
          '"': '\\"',
          "\\": "\\\\"
        };
        rep = null;
        quote = function(string) {
          escapable.lastIndex = 0;
          if (escapable.test(string)) {
            return '"' + string.replace(escapable, function(a) {
              var c;
              c = meta[a];
              if (typeof c === "string") {
                return c;
              } else {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
              }
            }) + '"';
          } else {
            return '"' + string + '"';
          }
        };
        str = function(key, holder) {
          var i, k, length, mind, partial, v, value;
          mind = gap;
          value = holder[key];
          if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
          }
          if (typeof rep === "function") value = rep.call(holder, key, value);
          switch (typeof value) {
           case "string":
            return quote(value);
           case "number":
            if (isFinite(value)) {
              return String(value);
            } else {
              return "null";
            }
           case "boolean":
           case "null":
            return String(value);
           case "object":
            if (!value) return "null";
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
              length = value.length;
              i = 0;
              while (i < length) {
                partial[i] = str(i, value) || "null";
                i += 1;
              }
              v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
              gap = mind;
              return v;
            }
            if (rep && typeof rep === "object") {
              length = rep.length;
              i = 0;
              while (i < length) {
                if (typeof rep[i] === "string") {
                  k = rep[i];
                  v = str(k, value);
                  if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
                i += 1;
              }
            } else {
              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                  v = str(k, value);
                  if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
              }
            }
            if (partial.length === 0) {
              v = "{}";
            } else if (gap) {
              v = "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}";
            } else {
              v = "{" + partial.join(",") + "}";
            }
            gap = mind;
            return v;
          }
        };
        if (typeof JSON.stringify !== "function") {
          JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
              i = 0;
              while (i < space) {
                indent += " ";
                i += 1;
              }
            } else {
              if (typeof space === "string") indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
              throw new Error("JSON.stringify");
            }
            return str("", {
              "": value
            });
          };
        }
        if (typeof JSON.parse !== "function") {
          return JSON.parse = function(text, reviver) {
            var j, walk;
            walk = function(holder, key) {
              var k, v, value;
              value = holder[key];
              if (value && typeof value === "object") {
                for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== void 0) {
                      value[k] = v;
                    } else {
                      delete value[k];
                    }
                  }
                }
              }
              return reviver.call(holder, key, value);
            };
            j = void 0;
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
              text = text.replace(cx, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
              });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
              j = eval("(" + text + ")");
              if (typeof reviver === "function") {
                return walk({
                  "": j
                }, "");
              } else {
                return j;
              }
            }
            throw new SyntaxError("JSON.parse");
          };
        }
      })();
      return JSON;
    }
  }();
  exports.serializer.QueryString = QueryString = {
    stringify: function(data) {
      var name, tokens, value;
      tokens = [];
      for (name in data) {
        value = data[name];
        tokens.push("" + name + "=" + encodeURIComponent(value));
      }
      return tokens.join("&");
    },
    parse: function(query) {
      var data, nv, token, tokens, _i, _len;
      if (query === "") return {};
      tokens = query.split("&");
      if (tokens.length === 0) {
        throw new TypeError("QueryString.parse: query is invalid");
      }
      data = {};
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        nv = token.split("=");
        data[nv[0]] = decodeURIComponent(nv[1]);
      }
      return data;
    }
  };
  exports.utils.ArrayUtil = ArrayUtil = {
    isArray: Array.isArray || function(arr) {
      return Object.prototype.toString.call(arr) === "[object Array]";
    },
    random: function(array, length) {
      var _results;
      if (length == null) length = 1;
      if (length === 1) {
        return array[array.length * Math.random() >> 0];
      } else {
        array = Array.prototype.slice.call(array);
        _results = [];
        while (length--) {
          _results.push(array.splice(array.length * Math.random() >> 0, 1)[0]);
        }
        return _results;
      }
    },
    shuffle: function(array) {
      var i, j, v;
      i = array.length;
      while (i) {
        j = Math.random() * i >> 0;
        v = array[--i];
        array[i] = array[j];
        array[j] = v;
      }
      return array;
    }
  };
  exports.utils.CSSUtil = CSSUtil = {
    parseMatrixString: function(str) {
      var $, parseInt;
      $ = str.match(/matrix\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)/);
      if ($ == null) {
        return null;
      } else {
        parseInt = window.parseInt;
        return new Matrix(parseInt($[1], 10), parseInt($[2], 10), parseInt($[3], 10), parseInt($[4], 10), parseInt($[5], 10), parseInt($[6], 10));
      }
    }
  };
  exports.utils.MathUtil = MathUtil = {
    DEGREE_PER_RADIAN: 180 / Math.PI,
    RADIAN_PER_DEGREE: Math.PI / 180,
    nearestIn: function(number, numbers) {
      var compared, n, _i, _len;
      compared = [];
      for (_i = 0, _len = numbers.length; _i < _len; _i++) {
        n = numbers[_i];
        compared.push(Math.abs(n - number));
      }
      return numbers[compared.indexOf(Math.min.apply(null, compared))];
    },
    randomBetween: function(a, b) {
      return a + (b - a) * Math.random();
    },
    convergeBetween: function(number, a, b) {
      var max, min;
      min = Math.min(a, b);
      max = Math.max(a, b);
      if (number < min) {
        return min;
      } else if (number > max) {
        return max;
      } else {
        return number;
      }
    }
  };
  exports.utils.ObjectUtil = ObjectUtil = {
    keys: Object.keys || function(obj) {
      var key, type, _results;
      if ((type = typeof obj) !== "object" && type !== "function") {
        throw new TypeError("" + obj + " isn't Object object");
      }
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        _results.push(key);
      }
      return _results;
    }
  };
  exports.utils.StringUtil = StringUtil = {
    pad: function(string, length, padding) {
      if (padding == null) padding = " ";
      string = "" + string;
      while (string.length < length) {
        string = (length - string.length & 1) === 0 ? padding + string : string + padding;
      }
      return string;
    },
    padLeft: function(string, length, padding) {
      if (padding == null) padding = " ";
      string = "" + string;
      while (string.length < length) {
        string = padding + string;
      }
      return string;
    },
    padRight: function(string, length, padding) {
      if (padding == null) padding = " ";
      string = "" + string;
      while (string.length < length) {
        string += padding;
      }
      return string;
    },
    escape: function(str) {
      return ("" + str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
    },
    createRandom: function(length, chars) {
      var len, str;
      if (chars == null) {
        chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }
      len = chars.length;
      str = "";
      while (str.length < length) {
        str += chars[Math.random() * len >> 0];
      }
      return str;
    },
    formatWithComma: function(str) {
      var i, j, res;
      str = "" + str;
      i = str.length;
      j = 0;
      res = "";
      while (i--) {
        res = (++j % 3 === 0 && i !== 0 ? "," : "") + str.charAt(i) + res;
      }
      return res;
    }
  };
}).call(this);