{muon} = require '../lib/muon.js'
{Transition} = muon.css3

exports.transition =

  camelCaseToVendorPrefix: (test)->
    transition = new Transition()
    transition.add('-webkit-transform')
    transition.add('webkitTransformOrigin')
    test.notStrictEqual transition._storage['-webkit-transform'], undefined
    test.notStrictEqual transition._storage['-webkit-transform-origin'], undefined
    test.done()
