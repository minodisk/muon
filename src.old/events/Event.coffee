exports.events.Event = class Event

  @COMPLETE: 'complete'

  constructor: (type, bubbles = false, cancelable = false)->
    unless @ instanceof Event then return new Event type, bubbles, cancelable
    if type instanceof Event
      event = type
      type = event.type
      bubbles = event.bubbles
      cancelable = event.cancelable
      @currentTarget = event.currentTarget
      @target = event.target
    @type = type
    @bubbles = bubbles
    @cancelable = cancelable
    @_isPropagationStopped = false
    @_isPropagationStoppedImmediately = false
    @_isDefaultPrevented = false

  formatToString: (className, args...)->
    ''

  stopPropagation: ->
    @_isPropagationStopped = true
    return

  stopImmediatePropagation: ->
    @_isPropagationStopped = true
    @_isPropagationStoppedImmediately = true
    return

  isDefaultPrevented: ->
    @_isDefaultPrevented

  preventDefault: ->
    @_isDefaultPrevented = true
    return
