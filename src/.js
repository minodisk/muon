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
  };

/**
 * Extends classical prototype pattern object or modern module pattern object.
 * You can reference parental prototype with this code `Child.__super__`,
 * when extends prototype pattern.
 * @params {Function|Object} parent   source object of inheritance.
 * @params {Function|Object} child    destination object of inheritance. default {}
 * @returns {Function|Object}         child object
 */
this.extend = function (parent, child) {
  child = child || {};
  copyDeeply(parent, child);
  inheritPrototype(parent, child);
  return child;
};

this.mix = function () {
  var i
    , l
    , arg
    , prop
    , child = {};
  for (i = 0, l = arguments.length; i < l; i++) {
    arg = arguments[i];
    copyDeeply(arg, child);
  }
  return child;
};

this.bind = function (fn, me) {
  return function () {
    return fn.apply(me, Array.prototype.slice.call(arguments));
  };
};
