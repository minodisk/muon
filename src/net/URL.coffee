exports.net.URL = URL =

  REG_EXP: /^((\w+:)(\/*)?(?:([^@]*)@)?(([^\/]+?)(?::(\d*))?))((\/[^\?#]*)?(\?([^#]*)?)?)?(#.*)?$/

  parse: (urlStr, parseQueryString = false)->
    [href, origin, protocol, slashes, auth, host, hostname, port, path, pathname, search, query, hash] = urlStr.match URL.REG_EXP
    obj = {href, origin, protocol, host, hostname}
    if parseQueryString
      query = QueryString.parse query
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
