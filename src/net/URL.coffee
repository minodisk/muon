exports.net.URL = URL =

  REG_EXP: /^((\w+:)(\/*)?(?:([^@]*)@)?(([^\/]+?)(?::(\d*))?))((\/[^\?#]*)?(\?([^#]*)?)?)?(#.*)?$/

  parse: (url)->
    [href, origin, protocol, slashes, auth, host, hostname, port, path, pathname, search, query, hash] = url.match URL.REG_EXP
    obj = {href, origin, protocol, host, hostname}
    opt = {auth, port, path, pathname, search, query, hash}
    if slashes?
      obj.slashes = true
      unless path?
        obj.path = obj.pathname = '/'
        obj.href += '/'
    for key, value of opt
      if value
        obj[key] = value
    obj
