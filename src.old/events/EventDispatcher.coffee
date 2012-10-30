exports.events.EventDispatcher = class EventDispatcher

  constructor: ->
    @_events = {}

  addEventListener: (type, listener, useCapture = false, priority = 0)->
    if typeof type isnt 'string'
      throw new ErrorMessage "EventDispatcher#addEventListener: type isn't string"
    if typeof listener isnt 'function'
      throw new ErrorMessage "EventDispatcher#addEventListener: listener isn't function"

    unless @_events[type]?
      @_events[type] = []
    @_events[type].push
      listener  : listener
      useCapture: useCapture
      priority  : priority
    @_events[type].sort @_sortOnPriorityInDescendingOrder
    @
  on              : EventDispatcher::addEventListener

  _sortOnPriorityInDescendingOrder: (a, b)->
    b.priority - a.priority

  removeEventListener: (type, listener)->
    if storage = @_events[type]
      i = storage.length
      while i--
        if storage[i].listener is listener
          storage.splice i, 1
      if storage.length is 0
        delete @_events[type]
    @
  off                : EventDispatcher::removeEventListener

  dispatchEvent: (event)->
    unless event instanceof Event
      throw new ErrorMessage "EventDispatcher#dispatchEvent: event isn't Event"

    event.currentTarget = @
    if (objs = @_events[event.type])?
      for obj in objs
        if (obj.useCapture and event.eventPhase is EventPhase.CAPTURING_PHASE) or (obj.useCapture is false and event.eventPhase isnt EventPhase.CAPTURING_PHASE)
          do (obj, event)->
            setTimeout (->
              obj.listener event
            ), 0
          break if event._isPropagationStoppedImmediately
    !event._isDefaultPrevented
  emit         : EventDispatcher::dispatchEvent
