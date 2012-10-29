exports.filters.GaussianFilter = class GaussianFilter extends KernelFilter

  constructor: (radiusX, radiusY, sigma = 1) ->
    s = 2 * sigma * sigma
    weight = 0
    kernel = []
    for dy in [1 - radiusY...radiusY] by 1
      for dx in [1 - radiusX...radiusX] by 1
        w = 1 / (s * Math.PI) * Math.exp(-(dx * dx + dy * dy) / s)
        weight += w
        kernel.push w
    kernel[i] /= weight for i in [0...kernel.length] by 1
    super radiusX, radiusY, kernel
