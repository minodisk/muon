exports.css3.Tween = Tween =
  _transitions   :
    {}
  _computedStyles:
    {}

  to: (elem, props, time, easing = Easing.ease, callback)->
    # run after escaping the event loop for iOS
    setTimeout (=>
      propList = {}
      len = 0
      computedStyle = window.getComputedStyle elem
      unless transition = @_transitions[elem]
        transition = @_transitions[elem] = new Transition()
      for name, value of props
        if computedStyle[name] isnt String(value)
          propList[name] = value
          transition.add name, time, easing
          len++

      if len is 0
        setTimeout (-> callback?()), 0
      if len isnt 0
        listener = (e)=>
          elem = e.target
          transition = @_transitions[elem]
          transition.remove e.propertyName
          elem.removeEventListener 'webkitTransitionEnd', listener
          elem.style.webkitTransition = transition.toString()
          callback?()
        elem.addEventListener 'webkitTransitionEnd', listener
        elem.style.webkitTransition = transition.toString()
        for name, value of propList
          elem.style[name] = value
    ), 0
