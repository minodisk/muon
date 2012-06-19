exports.net.HTTP = HTTP =

  createFormData: (data)->
    formData = new FormData()
    for name, value in data
      formData.append name, value
    formData

  get: (options, callback)->
    options.method = 'get'
    @request options, callback

  post: (options, callback)->
    options.method = 'post'
    @request options, callback

  request: (options, callback)->
    method = options.method?.toLowerCase() or 'get'
    url = options.url
    dataType = options.dataType?.toLowerCase()
    data = options.data
    unless data instanceof FormData
      if dataType is 'json'
        contentType = 'application/json;charset=UTF-8'
      else
        contentType = 'application/x-www-form-urlencoded;charset=UTF-8'
    #    if data?
    #      if contentType? and typeof data is 'object'
    #        switch dataType
    #          when 'json'
    #            data = JSON.stringify data
    #          else
    #            data = querystring.stringify data
    if method is 'get' and data?
      url = "#{url}?#{data}"
      data = null

    xhr = new (window.ActiveXObject or XMLHTTPRequest)('Microsoft.XMLHTTP')
    if options.onProgress?
      xhr.upload.onprogress = (e)->
        if e.lengthComputable
          options.onProgress e.loaded / e.total
    if options.onComplete?
      xhr.upload.onload = (e)->
        options.onComplete()
    if callback?
      xhr.onreadystatechange = (e)->
        if xhr.readyState is 4
          if xhr.status in [0, 200]
            data = xhr.responseText
            #            try
            #              data = JSON.parse data
            #            catch err
            #              try
            #                data = querystring.parse data
            #              catch err
            callback null, data
          else
            callback
              code   : xhr.status
              message: "#{xhr.status} (#{xhr.statusText})" + if xhr.responseText then ": #{xhr.responseText}" else ''
    xhr.open method, url, true
    xhr.overrideMimeType? 'text/plain'
    xhr.setRequestHeader 'X-Requested-With', 'XMLHTTPRequest'
    if contentType then xhr.setRequestHeader 'content-type', contentType
    xhr.send data