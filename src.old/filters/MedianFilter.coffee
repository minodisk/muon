exports.filters.MedianFilter = class MedianFilter extends KernelFilter

  _runKernel: (kernel, pixels, x, y, width, height) ->
    ps = []
    h = @radiusY * 2 - 1
    w = @radiusX * 2 - 1
    i = 0
    for relY in [0...h] by 1
      absY = y + relY
      for relX in [0...w] by 1
        absX = x + relX
        ps[i] = pixels[absY][absX]
        i++
    ps.sort(@_sortAsSum)
    ps[i >> 1]

  _sortAsSum: (a, b) ->
    sumA = sumB = 0
    for i in [0...3] by 1
      sumA += a[i]
      sumB += b[i]
    sumA - sumB
