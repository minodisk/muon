# ColorMatrix Class v2.1
# released under MIT License (X11)
# http:#www.opensource.org/licenses/mit-license.php
# Author: Mario Klingemann
# http:#www.quasimondo.com

# RGB to Luminance conversion constants as found on
# Charles A. Poynton's colorspace-faq:
# http:#www.faqs.org/faqs/graphics/colorspace-faq/
_LUMA_R = 0.212671
_LUMA_G = 0.71516
_LUMA_B = 0.072169

# There seem different standards for converting RGB
# values to Luminance. This is the one by Paul Haeberli:
_LUMA_R2 = 0.3086
_LUMA_G2 = 0.6094
_LUMA_B2 = 0.0820

_ONETHIRD = 1 / 3
_IDENTITY = [
  1, 0, 0, 0, 0
  0, 1, 0, 0, 0
  0, 0, 1, 0, 0
  0, 0, 0, 1, 0
]
_RAD = Math.PI / 180

exports.geom.ColorMatrix = class ColorMatrix

  constructor: (matrix) ->
    if matrix instanceof ColorMatrix
      @matrix = matrix.matrix.concat()
    else if Array.isArray(matrix)
      @matrix = matrix.concat()
    else
      @reset()

  toString: ->
    tmp = []
    for v, i in @matrix
      t = [] if i % 5 is 0
      t.push String(v)
      tmp.push t if i % 5 is 4 or i is @matrix.length - 1
    for x in [0...5]
      l = 0
      for y in [0...tmp.length] by 1
        l = Math.max l, tmp[y][x].length
      for y in [0...tmp.length] by 1
        tmp[y][x] = StringUtil.padLeft tmp[y][x], l
    for y in [0...tmp.length] by 1
      tmp[y] = tmp[y].join ', '
      tmp[y] += ',' if y != tmp.length - 1
    tmp.join '\n'

  clone: ->
    new ColorMatrix @matrix

  reset: ->
    @matrix = _IDENTITY.concat()

  concat: (src) ->
    dst = @matrix
    out = []
    for y in [0...4]
      i = 5 * y
      for x in [0...5]
        out[i + x] = src[i] * dst[x] + src[i + 1] * dst[x + 5] + src[i + 2] * dst[x + 10] + src[i + 3] * dst[x + 15]
      out[i + 4] += src[i + 4]
    @matrix = out
    @

  invert: ->
    @concat [
      -1, 0, 0, 0, 0xff
      0, -1, 0, 0, 0xff
      0, 0, -1, 0, 0xff
      0, 0, 0, 1, 0
    ]

  adjustSaturation: (s) ->
    irlum = -s * _LUMA_R
    iglum = -s * _LUMA_G
    iblum = -s * _LUMA_B
    ++s
    @concat [
      irlum + s, iglum, iblum, 0, 0
      irlum, iglum + s, iblum, 0, 0
      irlum, iglum, iblum + s, 0, 0
      0, 0, 0, 1, 0
    ]

  adjustContrast: (r, g = r, b = r) ->
    @concat [
      1 + r, 0, 0, 0, -0x80 * r
      0, 1 + g, 0, 0, -0x80 * g
      0, 0, 1 + b, 0, -0x80 * b
      0, 0, 0, 1, 0
    ]

  adjustBrightness: (r, g = r, b = r) ->
    @concat [
      1, 0, 0, 0, 0xff * r
      0, 1, 0, 0, 0xff * g
      0, 0, 1, 0, 0xff * b
      0, 0, 0, 1, 0
    ]

  adjustHue: (degree) ->
    R = _LUMA_R
    G = _LUMA_G
    B = _LUMA_B
    degree *= _RAD
    c = Math.cos degree
    s = Math.sin degree
    l = 1 - c
    m = l - s
    n = l + s
    @concat [
      R * m + c, G * m, B * m + s, 0, 0
      R * l + s * 0.143, G * l + c + s * 0.14, B * l + s * -0.283, 0, 0
      R * n - s, G * n, B * n + c, 0, 0
      0, 0, 0, 1, 0
    ]

  rotateHue: (degree) ->
    @_initHue()
    @concat @_preHue.matrix
    @rotateBlue degree
    @concat @_postHue.matrix

  luminance2Alpha: ->
    @concat [
      0, 0, 0, 0, 0xff
      0, 0, 0, 0, 0xff
      0, 0, 0, 0, 0xff
      _LUMA_R, _LUMA_G, _LUMA_B, 0, 0
    ]

  adjustAlphaContrast: (amount) ->
    @concat [
      1, 0, 0, 0, 0
      0, 1, 0, 0, 0
      0, 0, 1, 0, 0
      0, 0, 0, amount + 1, -0x80 * amount
    ]

  colorize: (rgb, amount = 1) ->
    R = _LUMA_R
    G = _LUMA_G
    B = _LUMA_B
    r = ((rgb >> 16) & 0xFF) / 0xFF
    g = ((rgb >> 8) & 0xFF) / 0xFF
    b = (rgb & 0xFF) / 0xFF
    invAmount = 1 - amount
    @concat [
      invAmount + amount * r * R, amount * r * G, amount * r * B, 0, 0,
      amount * g * R, invAmount + amount * g * G, amount * g * B, 0, 0,
      amount * b * R, amount * b * G, invAmount + amount * b * B, 0, 0,
      0, 0, 0, 1, 0
    ]

  setChannels: (r = 1, g = 2, b = 4, a = 8) ->
    rf = (if ((r & 1) is 1) then 1 else 0) + (if ((r & 2) is 2) then 1 else 0) + (if ((r & 4) is 4) then 1 else 0) + (if ((r & 8) is 8) then 1 else 0)
    rf = (1 / rf) if rf > 0
    gf = (if ((g & 1) is 1) then 1 else 0) + (if ((g & 2) is 2) then 1 else 0) + (if ((g & 4) is 4) then 1 else 0) + (if ((g & 8) is 8) then  1  else 0)
    gf = (1 / gf) if gf > 0
    bf = (if ((b & 1) is 1) then 1 else 0) + (if ((b & 2) is 2) then 1 else 0) + (if ((b & 4) is 4) then 1 else 0) + (if ((b & 8) is 8) then 1 else 0)
    bf = (1 / bf) if bf > 0
    af = (if ((a & 1) is 1) then 1 else 0) + (if ((a & 2) is 2) then 1 else 0) + (if ((a & 4) is 4) then 1 else 0) + (if ((a & 8) is 8) then 1 else 0)
    af = (1 / af) if af > 0
    @concat [
      (if ((r & 1) is 1) then rf else 0), (if ((r & 2) is 2) then rf else 0), (if ((r & 4) is 4) then rf else 0), (if ((r & 8) is 8) then rf else 0), 0
      (if ((g & 1) is 1) then gf else 0), (if ((g & 2) is 2) then gf else 0), (if ((g & 4) is 4) then gf else 0), (if ((g & 8) is 8) then gf else 0), 0
      (if ((b & 1) is 1) then bf else 0), (if ((b & 2) is 2) then bf else 0), (if ((b & 4) is 4) then bf else 0), (if ((b & 8) is 8) then bf else 0), 0
      (if ((a & 1) is 1) then af else 0), (if ((a & 2) is 2) then af else 0), (if ((a & 4) is 4) then af else 0), (if ((a & 8) is 8) then af else 0), 0
    ]

  blend: (matrix, amount) ->
    for v, i in matrix.matrix
      @matrix[i] = @matrix[i] * (1 - amount) + v * amount
    @

  average: (r = _ONETHIRD, g = _ONETHIRD, b = _ONETHIRD) ->
    @concat [
      r, g, b, 0, 0
      r, g, b, 0, 0
      r, g, b, 0, 0
      0, 0, 0, 1, 0
    ]

  threshold: (threshold, factor = 0x100) ->
    R = factor * _LUMA_R
    G = factor * _LUMA_G
    B = factor * _LUMA_B
    t = -factor * threshold
    @concat [
      R, G, B, 0, t
      R, G, B, 0, t
      R, G, B, 0, t
      0, 0, 0, 1, 0
    ]

  desaturate: ->
    R = _LUMA_R
    G = _LUMA_G
    B = _LUMA_B
    @concat [
      R, G, B, 0, 0
      R, G, B, 0, 0
      R, G, B, 0, 0
      0, 0, 0, 1, 0
    ]

  randomize: (amount = 1) ->
    inv_amount = (1 - amount)
    r1 = (inv_amount + (amount * (Math.random() - Math.random())))
    g1 = (amount * (Math.random() - Math.random()))
    b1 = (amount * (Math.random() - Math.random()))
    o1 = ((amount * 0xFF) * (Math.random() - Math.random()))
    r2 = (amount * (Math.random() - Math.random()))
    g2 = (inv_amount + (amount * (Math.random() - Math.random())))
    b2 = (amount * (Math.random() - Math.random()))
    o2 = ((amount * 0xFF) * (Math.random() - Math.random()))
    r3 = (amount * (Math.random() - Math.random()))
    g3 = (amount * (Math.random() - Math.random()))
    b3 = (inv_amount + (amount * (Math.random() - Math.random())))
    o3 = ((amount * 0xFF) * (Math.random() - Math.random()))
    @concat [
      r1, g1, b1, 0, o1
      r2, g2, b2, 0, o2
      r3, g3, b3, 0, o3
      0, 0, 0, 1, 0
    ]

  setMultiplicators: (r = 1, g = 1, b = 1, a = 1) ->
    @concat [
      r, 0, 0, 0, 0
      0, g, 0, 0, 0
      0, 0, b, 0, 0
      0, 0, 0, a, 0
    ]

  clearChannels: (r = false, g = false, b = false, a = false) ->
    @matrix[0] = @matrix[1] = @matrix[2] = @matrix[3] = @matrix[4] = 0 if r
    @matrix[5] = @matrix[6] = @matrix[7] = @matrix[8] = @matrix[9] = 0 if g
    @matrix[10] = @matrix[11] = @matrix[12] = @matrix[13] = @matrix[14] = 0 if b
    @matrix[15] = @matrix[16] = @matrix[17] = @matrix[18] = @matrix[19] = 0 if a

  thresholdAlpha: (threshold, factor = 0x100) ->
    @concat [
      1, 0, 0, 0, 0
      0, 1, 0, 0, 0
      0, 0, 1, 0, 0
      0, 0, 0, factor, -factor * threshold
    ]

  averageRGB2Alpha: ->
    @concat [
      0, 0, 0, 0, 0xff
      0, 0, 0, 0, 0xff
      0, 0, 0, 0, 0xff
      _ONETHIRD, _ONETHIRD, _ONETHIRD, 0, 0
    ]

  invertAlpha: ->
    @concat [
      1, 0, 0, 0, 0
      0, 1, 0, 0, 0
      0, 0, 1, 0, 0
      0, 0, 0, -1, 0xff
    ]

  rgb2Alpha: (r, g, b) ->
    @concat [
      0, 0, 0, 0, 0xff
      0, 0, 0, 0, 0xff
      0, 0, 0, 0, 0xff
      r, g, b, 0, 0
    ]

  setAlpha: (alpha) ->
    @concat [
      1, 0, 0, 0, 0
      0, 1, 0, 0, 0
      0, 0, 1, 0, 0
      0, 0, 0, alpha, 0
    ]

  rotateRed: (degree) ->
    @_rotateColor degree, 2, 1

  rotateGreen: (degree) ->
    @_rotateColor degree, 0, 2

  rotateBlue: (degree) ->
    @_rotateColor degree, 1, 0

  _rotateColor: (degree, x, y) ->
    degree *= _RAD
    mat = _IDENTITY.concat()
    mat[x + x * 5] = mat[y + y * 5] = Math.cos degree
    mat[y + x * 5] = Math.sin degree
    mat[x + y * 5] = -Math.sin degree
    @concat mat

  shearRed: (green, blue) ->
    @_shearColor 0, 1, green, 2, blue

  shearGreen: (red, blue) ->
    @_shearColor 1, 0, red, 2, blue

  shearBlue: (red, green) ->
    @_shearColor 2, 0, red, 1, green

  _shearColor: (x, y1, d1, y2, d2) ->
    mat = _IDENTITY.concat()
    mat[y1 + x * 5] = d1
    mat[y2 + x * 5] = d2
    @concat mat

  applyColorDeficiency: (type) ->
    # the values of this method are copied from http:#www.nofunc.com/Color_Matrix_Library/
    switch type
      when 'Protanopia'
        @concat [
          0.567, 0.433, 0.0, 0.0, 0.0
          0.558, 0.442, 0.0, 0.0, 0.0
          0.0, 0.242, 0.758, 0.0, 0.0
          0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break
      when 'Protanomaly'
        @concat [
          0.817, 0.183, 0.0, 0.0, 0.0
          0.333, 0.667, 0.0, 0.0, 0.0
          0.0, 0.125, 0.875, 0.0, 0.0
          0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break
      when 'Deuteranopia'
        @concat [
          0.625, 0.375, 0.0, 0.0, 0.0
          0.7, 0.3, 0.0, 0.0, 0.0
          0.0, 0.3, 0.7, 0.0, 0.0
          0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break
      when 'Deuteranomaly'
        @concat [
          0.8, 0.2, 0.0, 0.0, 0.0,
          0.258, 0.742, 0.0, 0.0, 0.0
          0.0, 0.142, 0.858, 0.0, 0.0
          0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break
      when 'Tritanopia'
        @concat [
          0.95, 0.05, 0.0, 0.0, 0.0
          0.0, 0.433, 0.567, 0.0, 0.0
          0.0, 0.475, 0.525, 0.0, 0.0
          0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break
      when 'Tritanomaly'
        @concat [
          0.967, 0.033, 0.0, 0.0, 0.0
        0.0, 0.733, 0.267, 0.0, 0.0
        0.0, 0.183, 0.817, 0.0, 0.0
        0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break
      when 'Achromatopsia'
        @concat [
          0.299, 0.587, 0.114, 0.0, 0.0
        0.299, 0.587, 0.114, 0.0, 0.0
        0.299, 0.587, 0.114, 0.0, 0.0
        0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break
      when 'Achromatomaly'
        @concat [
          0.618, 0.320, 0.062, 0.0, 0.0
        0.163, 0.775, 0.062, 0.0, 0.0
        0.163, 0.320, 0.516, 0.0, 0.0
        0.0, 0.0, 0.0, 1.0, 0.0
        ]
        break

  applyMatrix: (rgba) ->
    a = ( rgba >>> 24 ) & 0xff
    r = ( rgba >>> 16 ) & 0xff
    g = ( rgba >>> 8 ) & 0xff
    b = rgba & 0xff

    m = @matrix
    r2 = 0.5 + r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4]
    g2 = 0.5 + r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9]
    b2 = 0.5 + r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14]
    a2 = 0.5 + r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19]

    a2 = 0 if a2 < 0
    a2 = 0xff if a2 > 0xff
    r2 = 0 if r2 < 0
    r2 = 0xff if r2 > 0xff
    g2 = 0 if g2 < 0
    g2 = 0xff if g2 > 0xff
    b2 = 0 if b2 < 0
    b2 = 0xff if b2 > 0xff

    a2 << 24 | r2 << 16 | g2 << 8 | b2

  transformVector: (values) ->
    throw new TypeError "values length isn't 4" if values.length isnt 4
    m = @matrix
    sR = values[0]
    sG = values[1]
    sB = values[2]
    sA = values[3]
    oR = sR * m[0] + sG * m[1] + sB * m[2] + sA * m[3] + m[4]
    oG = sR * m[5] + sG * m[6] + sB * m[7] + sA * m[8] + m[9]
    oB = sR * m[10] + sG * m[11] + sB * m[12] + sA * m[13] + m[14]
    oA = sR * m[15] + sG * m[16] + sB * m[17] + sA * m[18] + m[19]
    values[0] = oR
    values[1] = oG
    values[2] = oB
    values[3] = oA

  _initHue: ->
    #greenRotation = 35.0
    greenRotation = 39.182655

    unless @_hueInitialized
      @_hueInitialized = true
      @_preHue = new ColorMatrix()
      @_preHue.rotateRed(45)
      @_preHue.rotateGreen(-greenRotation)

      lum = [
        _LUMA_R2,
        _LUMA_G2,
        _LUMA_B2,
        1.0
      ]

      @_preHue.transformVector(lum)

      red = lum[0] / lum[2]
      green = lum[1] / lum[2]

      @_preHue.shearBlue red, green

      @_postHue = new ColorMatrix()
      @_postHue.shearBlue -red, -green
      @_postHue.rotateGreen greenRotation
      @_postHue.rotateRed -45.0