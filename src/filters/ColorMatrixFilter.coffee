exports.filters.ColorMatrixFilter = class ColorMatrixFilter

  constructor: (@matrix)->

  scan: (src, dst)->
    m = @matrix.matrix
    s = src.data
    d = dst.data
    for i in [0...d.length] by 4
      r = s[i]
      g = s[i + 1]
      b = s[i + 2]
      a = s[i + 3]
      d[i] = r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4]
      d[i + 1] = r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9]
      d[i + 2] = r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14]
      d[i + 3] = r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19]
    dst
