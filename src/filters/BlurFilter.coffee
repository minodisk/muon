exports.filters.BlurFilter = class BlurFilter extends KernelFilter

  constructor: (radiusX, radiusY)->
    side = radiusX * 2 - 1
    length = side * side
    invert = 1 / length
    kernel = []
    kernel.push invert while length--
    super radiusX, radiusY, kernel
