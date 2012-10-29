exports.filters.DoubleFilter = class DoubleFilter extends KernelFilter

  _evaluatePixel: (pixels, x, y, width, height) ->
    r = g = b = 0
    h = @radiusY * 2 - 1
    w = @radiusX * 2 - 1
    for i in [0...@kernel.length]
      p = @_runKernel @kernel[i], pixels, x, y, width, height
      r += p[0] * p[0]
      g += p[1] * p[1]
      b += p[2] * p[2]
    r = Math.sqrt(r)
    g = Math.sqrt(g)
    b = Math.sqrt(b)
    [r, g, b, pixels[y + @radiusY - 1][x + @radiusX - 1][3]]
