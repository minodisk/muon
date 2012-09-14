exports.filters.KernelFilter = class KernelFilter extends Filter

  constructor: (@radiusX, @radiusY, @kernel)->

  scan       : (imageData, newImageData)->
    pixels = @_getPixels imageData
    for y in [0...@radiusY - 1] by 1
      pixels.unshift pixels[0].concat()
      pixels.push pixels[pixels.length - 1].concat()
    for y in [0...pixels.length] by 1
      for x in [0...@radiusX - 1] by 1
        pixels[y].unshift pixels[y][0].concat()
        pixels[y].push pixels[y][pixels[y].length - 1].concat()
    @_setPixels newImageData, pixels
    newImageData

  _evaluatePixel: (pixels, x, y, width, height)->
    p = @_runKernel @kernel, pixels, x, y, width, height
#    p[3] = pixels[y + @radiusY - 1][x + @radiusX - 1][3]
    p

  _runKernel: (kernel, pixels, x, y, width, height)->
    r = g = b = a = 0
    h = @radiusY * 2 - 1
    w = @radiusX * 2 - 1
    i = 0
    for relY in [0...h] by 1
      absY = y + relY
      for relX in [0...w] by 1
        absX = x + relX
        p = pixels[absY][absX]
        f = kernel[i]
        r += p[0] * f
        g += p[1] * f
        b += p[2] * f
        a += p[3] * f
        i++
    return [r, g, b, a]
