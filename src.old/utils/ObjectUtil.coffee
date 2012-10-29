exports.utils.ObjectUtil = ObjectUtil =

#  clone: (obj) ->
#    JSON.parse(JSON.stringify(obj), DateFormat.reviveJSON)

  keys: Object.keys or (obj) ->
    throw new TypeError("#{obj} isn't Object object") if (type = typeof obj) isnt 'object' and type isnt 'function'
    key for own key of obj
