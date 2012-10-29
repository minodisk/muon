exports.utils.EventUtil = EventUtil =

  getMousePoint: (e)->
    e = e.touches?[0] or e
    x: e.pageX
    y: e.pageY
