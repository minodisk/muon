exports.dom.DOM = DOM =

  create: (nodeName, attrs, text)->
    elem = document.createElement nodeName
    for key, value of attrs
      if key is 'value'
        value = StringUtil.escape value
      elem.setAttribute key, value
    if text?
      @setText elem, text
    elem

  getComputedStyle: (elem)->
    elem.currentStyle or document.defaultView.getComputedStyle elem, ''

  setText: (elem, text)->
    if typeof elem is 'string'
      elem = document.createElement elem
    elem?.innerHTML = StringUtil.escape text
    elem

  getFormData: (form)->
    data = {}
    for elem in form.elements
      if elem.name and elem.name isnt ''
        if ArrayUtil.isArray data[elem.name]
          data[elem.name].push elem.value
        else if data[elem.name]?
          value = data[elem.name]
          data[elem.name] = [elem.value]
        else
          data[elem.name] = elem.value
    data

  clearForm: (form)->
    first = true
    for elem in form.elements
      if (nodeName = elem.nodeName) is 'TEXTAREA' or (nodeName is 'INPUT' and ((type = elem.getAttribute('type')) is 'text' or type is 'password'))
        elem.value = ''
        if first
          first = false
          elem.focus()

  prependChild: (elem, parent)->
    parent.insertBefore elem, parent.firstChild

  insertBefore: (elem, before)->
    before.parentNode.insertBefore elem, before.nextSibling
    elem

  remove: (elem)->
    elem?.parentNode?.removeChild elem

  replaceWithInput: (elem)->
    elem.addEventListener 'click', (e)->
      elem = e.target
      elem.style.display = 'none'
      text = elem.innerHTML

      input = document.createElement 'input'
      input.setAttribute 'size', text.length
      input.setAttribute 'type', 'text'
      input.className = 'copy'
      input.value = text
      DOM.insertBefore input, elem

      do (input, elem)->
        setTimeout (->
          input.focus()
          input.select()
        ), 0
        input.addEventListener 'focusout', (e)->
          DOM.remove input
          elem.style.display = 'inline'

  getRect: (elem)->
    ox = 0
    oy = 0
    el = elem
    while el
      ox += el.offsetLeft or 0
      oy += el.offsetTop or 0
      el = el.offsetParent

    sx = 0
    sy = 0
    el = elem
    while el
      sx += el.scrollLeft or 0
      sy += el.scrollTop or 0
      el = el.parentNode

    x     : ox - sx
    y     : oy - sy
    width : elem.offsetWidth
    height: elem.offsetHeight

  listen: do ->
    if typeof window.addEventListener is 'function'
      (elem, type, listener)->
        elem.addEventListener type, listener, false
    else
      (elem, type, listener)->
        elem.attachEvent "on#{type}", (e)->
          e.stopPropagation = ->
            @cancelBubble = true
          e.preventDefault = ->
            @returnValue = false
          listener e
          