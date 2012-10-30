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

    Module.define = function (id, definition) {
      new Module(id, definition);
    };

    function Module(id, definition) {
      if (__modules[id] != null) {
        throw new Error("Cannot overwrite module '" + id + "'");
      }
      __modules[id] = this;

      this.id = id;
      this.definition = definition;
    }

    Module.prototype.require = function (id) {
      var module = __modules[id];
      if (module == null) {
        throw new Error("Cannot find module '" + id + "'");
      }
      return module._require();
    };

    Module.prototype._require = function () {
      if (this.exports != null) {
        return this.exports;
      }
      this.exports = {};
      this.definition.call(this.exports, this, this.exports);
      return this.exports;
    };

    /**
     * Extends classical prototype pattern object or modern module pattern object.
     * You can reference parental prototype with this code `Child.__super__`,
     * when extends prototype pattern.
     * @params {Function|Object} parent   source object of inheritance.
     * @params {Function|Object} child    destination object of inheritance. default {}
     * @returns {Function|Object}         child object
     */
    Module.prototype.extend = function (parent, child) {
      if (child == null) {
        child = {};
      }
      copyDeeply(parent, child);
      inheritPrototype(parent, child);
      return child;
    };

    Module.prototype.mix = function () {
      var i , len , arg
        , child = {};
      for (i = 0, len = arguments.length; i < len; i++) {
        arg = arguments[i];
        copyDeeply(arg, child);
      }
      return child;
    };

    Module.prototype.bind = function (fn, me) {
      return function () {
        return fn.apply(me, Array.prototype.slice.call(arguments));
      };
    };

    return Module;
  })()
  , define = Module.define;