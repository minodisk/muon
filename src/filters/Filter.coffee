exports.filters.Filter = class Filter

  constructor: ->

  scan       : (graphics)->
    src = graphics.getImageData()
    pixels = @_getPixels src
    out = graphics.createImageData()
    @_setPixels out, pixels
    out

  _getPixels: (imageData)->
    data = imageData.data
    width = imageData.width
    height = imageData.height
    pixels = []
    i = 0
    for y in [0...height] by 1
      pixels[y] = []
      for x in [0...width] by 1
        pixels[y][x] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
        i += 4
    pixels

  _setPixels: (imageData, pixels)->
    data = imageData.data
    width = imageData.width
    height = imageData.height
    i = 0
    for y in [0...height] by 1
      for x in [0...width] by 1
        p = @_evaluatePixel(pixels, x, y, width, height)
        data[i] = p[0]
        data[i + 1] = p[1]
        data[i + 2] = p[2]
        data[i + 3] = p[3]
        i += 4
    return

  _evaluatePixel: (pixels, x, y, width, height)->
    pixels[y][x]
