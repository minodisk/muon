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

  format: (urlObj)->
    {protocol, auth, host, hostname, port, pathname, search, query, hash} = urlObj
    protocolPostfix = if protocol in URL.CSS then '://' else ':'
    unless host?
      host = ''
      host += hostname if hostname?
      host += ":#{port}" if port?
    pathname = "/#{pathname}" unless pathname.charAt(0) is '/'
    if search?
      search = "?#{search}" unless search.charAt(0) is '?'
    else if query?
      search = "?#{QueryString.stringify(query)}"
    if hash? and hash.charAt(0) isnt '#'
      hash = "##{hash}"
    "#{protocol}#{protocolPostfix}#{host}#{pathname}#{search}#{hash}"

  resolve: (from, to)->
