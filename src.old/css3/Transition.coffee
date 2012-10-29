exports.css3.Transition = class Transition

  constructor: ->
    @_storage = {}

  add: (name, time, easing)->
    # check vendor prefix
    if /^webkit|moz|ms/i.test name
      name = name.replace /([A-Za-z]+?[a-z]*)/g, (text)-> "-#{text.toLowerCase()}"
    @_storage[name] =
      time  : time
      easing: easing

  remove: (name)->
    delete @_storage[name]

  toString: ->
    tmp = []
    for name, value of @_storage
      tmp.push "#{name} #{value.time / 1000}s #{value.easing}"
    tmp.join ', '
