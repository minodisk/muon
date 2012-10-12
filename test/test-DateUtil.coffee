{muon} = require '../lib/muon.js'
{stringify, parse} = muon.utils.DateUtil

exports.DateUtil =

  stringify: (test)->
    console.log stringify(new Date(2010, 9 - 1, 5, 15, 41, 17))
    test.strictEqual stringify(new Date(2010, 9 - 1, 5, 15, 41, 17)), 'Sun May 20 23:59:59 JST 2001'
    test.strictEqual stringify(new Date(2010, 9 - 1, 5, 15, 41, 17), 'Now, %A %B %d %X %Z %Y'), 'Now, Sun May 20 23:59:59 JST 2001'
    test.strictEqual stringify(new Date(2010, 9 - 1, 5, 15, 41, 17), '%Y-%m-%d %H:%M:%S'), '2001-05-20 23:59:59'
    test.done()
