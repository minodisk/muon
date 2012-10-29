exports.utils.CSSUtil = CSSUtil =

  parseMatrixString: (str)->
    $ = str.match /matrix\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)/
    unless $?
      null
    else
      parseInt = window.parseInt
      new Matrix parseInt($[1], 10), parseInt($[2], 10), parseInt($[3], 10), parseInt($[4], 10), parseInt($[5], 10), parseInt($[6], 10)