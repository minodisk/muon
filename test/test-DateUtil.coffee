{muon} = require '../lib/muon.js'
{stringify, parse, leap} = muon.utils.DateUtil

exports.DateUtil =

  stringify:

    local:

      pattern: (test)->
        date = new Date(2012, 4 - 1, 8, 9, 4, 3)
        date.setMilliseconds(23)

        test.strictEqual stringify(date, '%A'), 'Sunday', '%A'
        test.strictEqual stringify(date, '%a'), 'Sun', '%a'
        test.strictEqual stringify(date, '%B'), 'April', '%B'
        test.strictEqual stringify(date, '%b'), 'Apr', '%b'
        test.strictEqual stringify(date, '%C'), '20', '%C'
        test.strictEqual stringify(date, '%c'), 'Sun Apr  8 09:04:03 2012', '%c'
        test.strictEqual stringify(date, '%D'), '04/08/12', '%D'
        test.strictEqual stringify(date, '%d'), '08', '%d'
        test.strictEqual stringify(date, '%e'), ' 8', '%e'
        test.strictEqual stringify(date, '%F'), '2012-04-08', '%F'
        test.strictEqual stringify(date, '%H'), '09', '%H'
        test.strictEqual stringify(date, '%h'), 'Apr', '%h'
        test.strictEqual stringify(date, '%I'), '09', '%I'
        test.strictEqual stringify(date, '%j'), '099', '%j'
        test.strictEqual stringify(date, '%k'), ' 9', '%k'
        test.strictEqual stringify(date, '%L'), '023', '%L'
        test.strictEqual stringify(date, '%l'), ' 9', '%l'
        test.strictEqual stringify(date, '%M'), '04', '%M'
        test.strictEqual stringify(date, '%m'), '04', '%m'
        test.strictEqual stringify(date, '%n'), '\n', '%n'
        test.strictEqual stringify(date, '%N'), '023', '%N'
        test.strictEqual stringify(date, '%P'), 'am', '%P'
        test.strictEqual stringify(date, '%p'), 'AM', '%p'
        test.strictEqual stringify(date, '%R'), '09:04', '%R'
        test.strictEqual stringify(date, '%r'), '09:04:03 AM', '%r'
        test.strictEqual stringify(date, '%S'), '03', '%S'
        test.strictEqual stringify(date, '%s'), '1333843443', '%s'
        test.strictEqual stringify(date, '%T'), '09:04:03', '%T'
        test.strictEqual stringify(date, '%t'), '\t', '%t'
        test.strictEqual stringify(date, '%U'), '15', '%U'
        test.strictEqual stringify(date, '%u'), '7', '%u'
        test.strictEqual stringify(date, '%v'), ' 8-APR-2012', '%v'
        test.strictEqual stringify(date, '%V'), '14', '%V'
        test.strictEqual stringify(date, '%W'), '14', '%W'
        test.strictEqual stringify(date, '%w'), '0', '%w'
        test.strictEqual stringify(date, '%X'), '09:04:03', '%X'
        test.strictEqual stringify(date, '%x'), '04/08/12', '%x'
        test.strictEqual stringify(date, '%Y'), '2012', '%Y'
        test.strictEqual stringify(date, '%y'), '12', '%y'
        test.strictEqual stringify(date, '%Z'), 'JST', '%Z'
        test.strictEqual stringify(date, '%z'), '+0900', '%z'
        test.strictEqual stringify(date, '%%'), '%', '%%'
        test.done()

      week: (test)->
        testYear = (y, results)->
          dates = [
            new Date(y, 1 - 1, 1)
            new Date(y, 1 - 1, 7)
            new Date(y, 1 - 1, 11)
            new Date(y, 12 - 1, 21)
            new Date(y, 12 - 1, 25)
            new Date(y, 12 - 1, 31)
          ]
          for date, i in dates
            test.strictEqual stringify(date, '%U, %V, %W'), results[i], "#{date.getFullYear()}/#{date.getMonth() + 1}/#{date.getDate()}"

        testYear 1998, [
          '00, 01, 00'
          '01, 02, 01'
          '02, 02, 01'
          '51, 52, 51'
          '51, 52, 51'
          '52, 53, 52'
        ]
        testYear 1999, [
          '00, 53, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '51, 51, 51'
          '52, 52, 52'
        ]
        testYear 2000, [
          '00, 52, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '52, 52, 52'
          '53, 52, 52'
        ]
        testYear 2001, [
          '00, 01, 01'
          '01, 01, 01'
          '01, 02, 02'
          '50, 51, 51'
          '51, 52, 52'
          '52, 01, 53'
        ]
        testYear 2002, [
          '00, 01, 00'
          '01, 02, 01'
          '01, 02, 01'
          '50, 51, 50'
          '51, 52, 51'
          '52, 01, 52'
        ]
        testYear 2003, [
          '00, 01, 00'
          '01, 02, 01'
          '01, 02, 01'
          '51, 51, 50'
          '51, 52, 51'
          '52, 01, 52'
        ]
        testYear 2004, [
          '00, 01, 00'
          '01, 02, 01'
          '02, 02, 01'
          '51, 52, 51'
          '51, 52, 51'
          '52, 53, 52'
        ]
        testYear 2005, [
          '00, 53, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '52, 51, 51'
          '52, 52, 52'
        ]
        testYear 2006, [
          '01, 52, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '52, 52, 52'
          '53, 52, 52'
        ]
        testYear 2007, [
          '00, 01, 01'
          '01, 01, 01'
          '01, 02, 02'
          '50, 51, 51'
          '51, 52, 52'
          '52, 01, 53'
        ]
        testYear 2008, [
          '00, 01, 00'
          '01, 02, 01'
          '01, 02, 01'
          '51, 51, 50'
          '51, 52, 51'
          '52, 01, 52'
        ]
        testYear 2009, [
          '00, 01, 00'
          '01, 02, 01'
          '02, 02, 01'
          '51, 52, 51'
          '51, 52, 51'
          '52, 53, 52'
        ]
        testYear 2010, [
          '00, 53, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '51, 51, 51'
          '52, 52, 52'
        ]
        testYear 2011, [
          '00, 52, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '52, 51, 51'
          '52, 52, 52'
        ]
        testYear 2012, [
          '01, 52, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '52, 52, 52'
          '53, 01, 53'
        ]
        testYear 2013, [
          '00, 01, 00'
          '01, 02, 01'
          '01, 02, 01'
          '50, 51, 50'
          '51, 52, 51'
          '52, 01, 52'
        ]
        testYear 2014, [
          '00, 01, 00'
          '01, 02, 01'
          '01, 02, 01'
          '51, 51, 50'
          '51, 52, 51'
          '52, 01, 52'
        ]
        testYear 2015, [
          '00, 01, 00'
          '01, 02, 01'
          '02, 02, 01'
          '51, 52, 51'
          '51, 52, 51'
          '52, 53, 52'
        ]
        testYear 2016, [
          '00, 53, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '52, 51, 51'
          '52, 52, 52'
        ]
        testYear 2017, [
          '01, 52, 00'
          '01, 01, 01'
          '02, 02, 02'
          '51, 51, 51'
          '52, 52, 52'
          '53, 52, 52'
        ]
        testYear 2018, [
          '00, 01, 01'
          '01, 01, 01'
          '01, 02, 02'
          '50, 51, 51'
          '51, 52, 52'
          '52, 01, 53'
        ]
        testYear 2019, [
          '00, 01, 00'
          '01, 02, 01'
          '01, 02, 01'
          '50, 51, 50'
          '51, 52, 51'
          '52, 01, 52'
        ]
        testYear 2020, [
          '00, 01, 00'
          '01, 02, 01'
          '01, 02, 01'
          '51, 52, 51'
          '51, 52, 51'
          '52, 53, 52'
        ]
        test.done()

      composition: (test)->
        test.strictEqual stringify(new Date(2010, 9 - 1, 5, 2, 3, 6), 'Now, %A %B %d %X %Z %Y'), 'Now, Sunday September 05 02:03:06 JST 2010'
        test.strictEqual stringify(new Date(2010, 9 - 1, 5, 2, 3, 6), '%Y-%m-%d %H:%M:%S'), '2010-09-05 02:03:06'
        test.done()

  leap: (test)->
    test.ok leap 1996
    test.ok not leap 1997
    test.ok not leap 1998
    test.ok not leap 1999
    test.ok leap 2000
    test.ok not leap 2001
    test.ok not leap 2002
    test.ok not leap 2003
    test.ok leap 2004
    test.ok not leap 2010
    test.ok leap 2020
    test.ok not leap 2030
    test.ok leap 2040
    test.ok not leap 2050
    test.ok leap 2060
    test.ok not leap 2070
    test.ok leap 2080
    test.ok not leap 2090
    test.ok not leap 2100
    test.ok not leap 2200
    test.ok not leap 2300
    test.ok leap 2400
    test.done()