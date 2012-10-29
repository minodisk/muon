var array = require('../src/utils/array').array
  , fs = require('fs')
  , path = require('path');

var generateTests = function (array) {
  return {
    isArray: function (test) {
      test.strictEqual(array.isArray(), false);
      test.strictEqual(array.isArray(undefined), false);
      test.strictEqual(array.isArray(null), false);
      test.strictEqual(array.isArray(true), false);
      test.strictEqual(array.isArray(false), false);
      test.strictEqual(array.isArray(0), false);
      test.strictEqual(array.isArray(1), false);
      test.strictEqual(array.isArray(''), false);
      test.strictEqual(array.isArray({}), false);
      test.strictEqual(array.isArray(new Date()), false);
      test.strictEqual(array.isArray(/a/), false);
      test.strictEqual(array.isArray([]), true);
      test.done();
    },

    indexOf: function (test) {
      test.throws(function () {
        array.indexOf();
      }, TypeError);
      test.throws(function () {
        array.indexOf(undefined);
      }, TypeError);
      test.throws(function () {
        array.indexOf(null);
      }, TypeError);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 2), 0);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 7), -1);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 2, 3), 3);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 2, 2), 3);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 2, -2), 3);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 2, -1), 3);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 2, 10), -1);
      test.strictEqual(array.indexOf([2, 5, 9, 2], 2, -10), 0);
      test.done();
    },

    lastIndexOf: function (test) {
      test.throws(function () {
        array.lastIndexOf();
      }, TypeError);
      test.throws(function () {
        array.lastIndexOf(undefined);
      }, TypeError);
      test.throws(function () {
        array.lastIndexOf(null);
      }, TypeError);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 2), 3);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 7), -1);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 2, 3), 3);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 2, 2), 0);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 2, -2), 0);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 2, -1), 3);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 2, 10), 3);
      test.strictEqual(array.lastIndexOf([2, 5, 9, 2], 2, -10), -1);
      test.done();
    },

    include: function (test) {
      test.strictEqual(array.include(['a', 'b', 'c'], 'b'), true);
      test.strictEqual(array.include(['a', 'b', 'c'], 'z'), false);
      test.done()
    }
  };
};

module.exports =
{

  compact: function (test) {
    var arr = [1, '', 2, null, 3, null, 4, undefined];
    test.deepEqual(array.compact(arr), [1, '', 2, 3, 4]);
    test.deepEqual(arr, [1, '', 2, null, 3, null, 4, undefined]);
    test.done();
  },

  delete: function (test) {
    var arr = [1, 2, 3, 2, 1];
    test.strictEqual(array.delete(arr, 2), 2);
    test.deepEqual(arr, [1, 3, 1]);

    var ary = [null, null, null];
    test.strictEqual(array.delete(ary, null), null);
    test.deepEqual(ary, []);
    test.strictEqual(array.delete(ary, null), null);

    test.done();
  },

  deleteAt: function (test) {
    var arr = [0, 1, 2, 3, 4];
    test.strictEqual(array.deleteAt(arr, 2), 2);
    test.deepEqual(arr, [0, 1, 3, 4]);
    test.done();
  },

  random: function (test) {
    function testRandom(arr) {
      var hit = array.random(arr, 1);
      test.notStrictEqual(arr.indexOf(hit), -1);
      var hits = array.random(arr, 2)
        , i = 0
        , l = hits.length;
      for (; i < l; i++) {
        test.notStrictEqual(arr.indexOf(hits[i]), -1);
      }
    }

    var i = 100
    while (i--) {
      testRandom([0, 1, 2, 3, 4]);
    }
    i = 100
    while (i--) {
      testRandom(['a', 'b', 'c']);
    }
    test.done();
  },

  shuffle: function (test) {
    function testShuffle(arr) {
      shuffled = array.shuffle(arr);
      test.notStrictEqual(shuffled, arr);
    }

     var i = 100
    while (i--) {
      testShuffle([0, 1, 2, 3, 4]);
    }
    i = 100
    while (i--) {
      testShuffle(['a', 'b', 'c']);
    }
    test.done();
  },


  native: (function () {
    return generateTests(array);
  })(),

  implementation: (function () {
    // Arrayの静的メソッドとprototype実装のない状況をエミュレート
    new Function('Array', fs.readFileSync(path.join(__dirname, '../src/utils/array.js')).toString('utf8'))(function () {});
    return generateTests(array);
  })()

};
