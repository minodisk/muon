exports.filters.UnsharpMaskFilter = class UnsharpMaskFilter extends KernelFilter

  constructor: (radiusX, radiusY, @amount = 1) ->
    side = radiusX * 2 - 1
    length = i =side * side
    invert = 1 / length
    kernel = []
    kernel.push -invert while i--
    kernel[length >> 1] = 1 + (1 - invert) * @amount
    super radiusX, radiusY, kernel
