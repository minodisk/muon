var require = require('../lib/muon').require;

exports.require = {

  'load': function (test) {
    var array = require('utils.array');
    test.strictEqual(typeof array.isArray, 'function');
    var Event = require('events.Event');
    test.strictEqual(typeof Event, 'function');
    test.done();
  },

  'cache': function (test) {
    var qs = require('serializer.querystring');
    test.strictEqual(require('serializer.querystring'), qs);
    test.done();
  }

};