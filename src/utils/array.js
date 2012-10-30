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
