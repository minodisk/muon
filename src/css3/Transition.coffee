class Transition

  constructor: ->
    @_storage = {}

  add: (name, time, easing)->
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
