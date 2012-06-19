exports.utils.MathUtil = MathUtil =

  DEGREE_PER_RADIAN: 180 / Math.PI
  RADIAN_PER_DEGREE: Math.PI / 180

  nearestIn: (number, numbers) ->
    compared = []
    compared.push(Math.abs(n - number)) for n in numbers
    numbers[compared.indexOf(Math.min.apply(null, compared))]

  randomBetween: (a, b) ->
    a + (b - a) * Math.random()

  convergeBetween: (number, a, b) ->
    min = Math.min(a, b)
    max = Math.max(a, b)
    if number < min then min else if number > max then max else number
