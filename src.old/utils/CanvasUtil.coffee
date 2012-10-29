exports.utils.CanvasUtil = CanvasUtil =

  createCanvas: (width, height)->
    canvas = document.createElement 'canvas'
    canvas.width = width
    canvas.height = height
    canvas

  clearCanvas: (canvas)->
    canvas.width = canvas.width

  setAlpha: (imageData, alpha)->
    d = imageData.data
    for i in [0...d.length] by 4
      d[i + 3] = 0xff * alpha >> 0
