exports.serializer.QueryString = QueryString =

  stringify: (data)->
    tokens = []
    for name, value of data
      tokens.push "#{name}=#{encodeURIComponent value}"
    tokens.join '&'

  parse: (query)->
    unless query
      return {}
    tokens = query.split '&'
    if tokens.length is 0
      throw new ErrorMessage "QueryString.parse: query is invalid"
    data = {}
    for token in tokens
      nv = token.split '='
      data[nv[0]] = decodeURIComponent nv[1]
    data