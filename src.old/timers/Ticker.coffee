exports.timers.Ticker = class Ticker extends EventDispatcher

  @getInstance: ->
    if Ticker._instance?
      Ticker._instance
    else
      Ticker._isInternal = true
      Ticker._instance = new Ticker

  constructor: ->
    throw new Error("Call Ticker.getInstance()") unless Ticker._isInternal
    Ticker._isInternal = false
    super()

  start: ->
    @running = true
    requestAnimationFrame @_onTick

  _onTick: =>
    if @running
      event = new Event 'tick'
      event.count = requestAnimationFrame @_onTick
      @dispatchEvent event

  stop: ->
    @running = false
