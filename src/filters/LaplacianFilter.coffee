exports.filters.LaplacianFilter = class LaplacianFilter extends KernelFilter

  constructor: (is4Direction = false) ->
    super 2, 2, if is4Direction then [
      1, 1, 1
      1, -8, 1
      1, 1, 1
    ] else [
      0, 1, 0
      1, -4, 1
      0, 1, 0
    ]
