exports.utils.StringUtil = StringUtil =

#  split:
#  if 'a'.split(/(a)/).length isnt 0
#    (string, separator, limit) ->
#      String::split.apply(Array::shift.call(arguments), arguments)
#  else
#    (string, separator = null, limit = -1) ->
#      if separator instanceof RegExp
#        separator = new RegExp(separator.source, 'g')
#        chunks = []
#        index = 0
#        while (r = separator.exec(string))?
#          chunks.push(string[index...r.index])
#          chunks.push(r[i]) for i in [1...r.length] by 1
#          index = separator.lastIndex
#        chunks.push(if index isnt string.length then string[index..] else '')
#        if limit < 0 then chunks else chunks.slice(0, limit)
#      else
#        String::split.apply(Array::shift.call(arguments), arguments)
#
#  trim:
#  if typeof String::trim is 'function'
#    (string) -> String::trim.call(string)
#  else
#    (string) -> string.replace(/^\s+|\s+$/g, '')
#  trimLeft:
#  if typeof String::trimLeft is 'function'
#    (string) -> String::trimLeft.call(string)
#  else
#    (string) -> string.replace(/^\s+/g, '')
#  trimRight:
#  if typeof String::trimRight is 'function'
#    (string) -> String::trimRight.call(string)
#  else
#    (string) -> string.replace(/\s+$/g, '')
#
  pad: (string, length, padding = ' ') ->
    string = "#{string}"
    while string.length < length
      string = if (length - string.length & 1) is 0 then padding + string else string + padding
    string
  padLeft: (string, length, padding = ' ') ->
    string = "#{string}"
    while string.length < length
      string = padding + string
    string
  padRight: (string, length, padding = ' ') ->
    string = "#{string}"
    while string.length < length
      string += padding
    string
#
#  repeat: (string, times) ->
#    str = ''
#    while times--
#      str += string
#    str
#
#  insert: (string, index, insert) ->
#    string[0...index] + insert + string[index..]
#
#  reverse: (string) ->
#    i = string.length
#    str = ''
#    while i--
#      str += string.charAt(i)
#    str

  escape: (str)->
    "#{str}"
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  createRandom: (length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')->
    len = chars.length
    str = ''
    while str.length < length
      str += chars[Math.random() * len >> 0]
    str

  formatWithComma: (str)->
    str = "#{str}"
    i = str.length
    j = 0
    res = ''
    while i--
      res = (if ++j % 3 is 0 and i isnt 0 then ',' else '') + str.charAt(i) + res
    res