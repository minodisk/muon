exports.filters.PrewittFilter = class PrewittFilter extends DoubleFilter

  constructor: ->
    super 2, 2, [
      [
        -1, 0, 1
        -1, 0, 1
        -1, 0, 1
      ]
      [
        -1, -1, -1
        0, 0, 0
        1, 1, 1
      ]
    ]
