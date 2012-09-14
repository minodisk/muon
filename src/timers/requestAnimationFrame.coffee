exports.timers.requestAnimationFrame = requestAnimationFrame = do ->
  window.requestAnimationFrame or
  window.webkitRequestAnimationFrame or
  window.mozRequestAnimationFrame or
  window.msRequestAnimationFrame or
  window.oRequestAnimationFrame or
  do ->
    counter = 0
    (callback)->
      setTimeout callback, 66
      counter++