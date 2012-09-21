{muon} = require '../lib/muon.js'
{StringUtil} = muon.utils

exports.StringUtil =

  dump:

    string: (test)->
      test.strictEqual StringUtil.dump('abc'), '"abc"\n'
      test.done()

    number: (test)->
      test.strictEqual StringUtil.dump(123), '123\n'
      test.done()

    array: (test)->
      test.strictEqual StringUtil.dump(['abc', 123]), '[\n  0: "abc",\n  1: 123\n]\n'
      test.done()

    object: (test)->
      test.strictEqual StringUtil.dump({foo:'abc', bar:123}), '{\n  foo: "abc",\n  bar: 123\n}\n'
      test.done()

    nest: (test)->
      test.strictEqual StringUtil.dump({foo:['abc', 'def'], bar:123}), '{\n  foo: [\n    0: "abc",\n    1: "def"\n  ],\n  bar: 123\n}\n'
      test.done()

  parseBoolean:

    true: (test)->
      test.ok StringUtil.parseBoolean 'true'
      test.ok StringUtil.parseBoolean 'TRUE'
      test.ok StringUtil.parseBoolean 'TRue'
      test.ok StringUtil.parseBoolean '1'
      test.done()

    false: (test)->
      test.ok not StringUtil.parseBoolean 'false'
      test.ok not StringUtil.parseBoolean 'fals'
      test.ok not StringUtil.parseBoolean 'tru'
      test.ok not StringUtil.parseBoolean '0'
      test.ok not StringUtil.parseBoolean '2'
      test.ok not StringUtil.parseBoolean '-1'
      test.done()
