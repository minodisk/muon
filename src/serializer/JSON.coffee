exports.serializer.JSON = JSON = do ->
  if window.JSON?
    window.JSON
  else
    JSON = {}
    (->
      f = (n) ->
        (if n < 10 then "0" + n else n)

      if typeof Date:: toJSON isnt "function"
        Date:: toJSON = (key) ->
          (if isFinite(@valueOf()) then @getUTCFullYear() + "-" + f(@getUTCMonth() + 1) + "-" + f(@getUTCDate()) + "T" + f(@getUTCHours()) + ":" + f(@getUTCMinutes()) + ":" + f(@getUTCSeconds()) + "Z" else null)
        String:: toJSON = Number:: toJSON = Boolean:: toJSON = (key) ->
          @valueOf()

      cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
      gap = null
      indent = null
      meta =
        "\b": "\\b"
        "\t": "\\t"
        "\n": "\\n"
        "\f": "\\f"
        "\r": "\\r"
        "\"": "\\\""
        "\\": "\\\\"
      rep = null

      quote = (string) ->
        escapable.lastIndex = 0
        (if escapable.test(string) then "\"" + string.replace(escapable, (a) ->
          c = meta[a]
          (if typeof c is "string" then c else "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4))
        ) + "\"" else "\"" + string + "\"")
      str = (key, holder) ->
        mind = gap
        value = holder[key]
        value = value.toJSON(key)  if value and typeof value is "object" and typeof value.toJSON is "function"
        value = rep.call(holder, key, value)  if typeof rep is "function"
        switch typeof value
          when "string"
            quote value
          when "number"
            (if isFinite(value) then String(value) else "null")
          when "boolean", "null"
            String value
          when "object"
            return "null"  unless value
            gap += indent
            partial = []
            if Object:: toString.apply(value) is "[object Array]"
              length = value.length
              i = 0
              while i < length
                partial[i] = str(i, value) or "null"
                i += 1
              v = (if partial.length is 0 then "[]" else (if gap then "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" else "[" + partial.join(",") + "]"))
              gap = mind
              return v
            if rep and typeof rep is "object"
              length = rep.length
              i = 0
              while i < length
                if typeof rep[i] is "string"
                  k = rep[i]
                  v = str(k, value)
                  partial.push quote(k) + (if gap then ": " else ":") + v  if v
                i += 1
            else
              for k of value
                if Object:: hasOwnProperty.call(value, k)
                  v = str(k, value)
                  partial.push quote(k) + (if gap then ": " else ":") + v  if v
            if partial.length is 0
              v = "{}"
            else if gap
              v = "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
            else
              v = "{" + partial.join(",") + "}"
            gap = mind
            v

      if typeof JSON.stringify isnt "function"
        JSON.stringify = (value, replacer, space) ->
          gap = ""
          indent = ""
          if typeof space is "number"
            i = 0
            while i < space
              indent += " "
              i += 1
          else indent = space  if typeof space is "string"
          rep = replacer
          if replacer and typeof replacer isnt "function" and (typeof replacer isnt "object" or typeof replacer.length isnt "number")
            throw new Error("JSON.stringify")
          str "",
            "": value
      if typeof JSON.parse isnt "function"
        JSON.parse = (text, reviver) ->
          walk = (holder, key) ->
            value = holder[key]
            if value and typeof value is "object"
              for k of value
                if Object:: hasOwnProperty.call(value, k)
                  v = walk(value, k)
                  if v isnt undefined
                    value[k] = v
                  else
                    delete value[k]
            reviver.call holder, key, value
          j = undefined
          text = String(text)
          cx.lastIndex = 0
          if cx.test(text)
            text = text.replace(cx, (a) ->
              "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            )
          if /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))
            j = eval("(" + text + ")")
            if typeof reviver is "function"
              return walk({"": j}, "")
            else
              return j
          throw new SyntaxError("JSON.parse")
    )()
    JSON
