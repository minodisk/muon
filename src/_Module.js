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