exports.filters.BilateralFilter = class BilateralFilter extends KernelFilter

  constructor: (radiusX, radiusY, sigmaDistance = 1, sigmaColor = 1) ->
    kernel = []
    s = 2 * sigmaDistance * sigmaDistance
    for dy in [1 - radiusY...radiusY] by 1
      for dx in [1 - radiusX...radiusX] by 1
        kernel.push Math.exp(-(dx * dx + dy * dy) / s)
    super radiusX, radiusY, kernel

    @colorWeightMap = []
    s = 2 * sigmaColor * sigmaColor
    for i in [0...0xff * 3] by 1
      @colorWeightMap[i] = Math.exp(-i * i * s)

  _runKernel: (kernel, pixels, x, y, width, height) ->
    p = pixels[y + @radiusY - 1][x + @radiusX - 1]
    cR = p[0]
    cG = p[1]
    cB = p[2]
    r = g = b = 0
    totalWeight = 0
    h = @radiusY * 2 - 1
    w = @radiusX * 2 - 1
    i = 0
    for relY in [0...h] by 1
      absY = y + relY
      for relX in [0...w] by 1
        absX = x + relX
        p = pixels[absY][absX]
        weight = kernel[i] * @colorWeightMap[Math.abs(p[0] - cR) + Math.abs(p[1] - cG) + Math.abs(p[2] - cB)]
        totalWeight += weight
        r += p[0] * weight
        g += p[1] * weight
        b += p[2] * weight
        i++
    [r / totalWeight, g / totalWeight, b / totalWeight]
