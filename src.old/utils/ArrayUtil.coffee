exports.utils.ArrayUtil = ArrayUtil =

  isArray: Array.isArray or (arr)->
    Object::toString.call(arr) is '[object Array]'

  indexOf: if typeof Array::indexOf is 'function'
    (array, searchElement, fromIndex)->
      Array::indexOf.apply(Array::shift.call(arguments), arguments)
  else
    (array, searchElement, fromIndex = 0)->
      len = array.length
      fromIndex = if fromIndex < 0 then Math.ceil(fromIndex) else Math.floor(fromIndex)
      fromIndex += len if fromIndex < 0
      return i for i in [fromIndex..len] by 1 when i of array and array[i] is searchElement
      -1

  lastIndexOf: if typeof Array::lastIndexOf is 'function'
    (array, searchElement, fromIndex)->
      Array::lastIndexOf.apply(Array::shift.call(arguments), arguments)
  else
    (array, searchElement, fromIndex = Number.MAX_VALUE) ->
      len = array.length
      fromIndex = if fromIndex < 0 then Math.ceil(fromIndex) else Math.floor(fromIndex)
      if fromIndex < 0 then fromIndex += len else fromIndex = len - 1
      return i for i in [fromIndex..-1] by -1 when i of array and array[i] is searchElement
      -1

  random: (array, length = 1)->
    if length is 1
      array[array.length * Math.random() >> 0]
    else
      array = Array::slice.call(array)
      array.splice(array.length * Math.random() >> 0, 1)[0] while length--

  shuffle: (array)->
    i = array.length
    while i
      j = Math.random() * i >> 0
      v = array[--i]
      array[i] = array[j]
      array[j] = v
    array

  ###
  shold be tested
  ###
  in     : (array, searchElement)->
    searchElement in array

  filter     : if typeof Array::filter is 'function'
    (array, callback, thisObject) ->
      Array::filter.apply(Array::shift.call(arguments), arguments)
  else
    (array, callback, thisObject = null) ->
      throw new TypeError() if typeof callback isnt 'function'
      val for val, i in array when i of array and callback.call(thisObject, val, i, array)
  forEach    : if typeof Array::forEach is 'function'
    (array, callback, thisObject) ->
      Array::forEach.apply(Array::shift.call(arguments), arguments)
      return
  else
    (array, callback, thisObject = null) ->
      throw new TypeError() if typeof callback isnt 'function'
      callback.call(thisObject, val, i, array) for val, i in array when i of array
      return
  every      : if typeof Array::every is 'function'
    (array, callvack, thisObject) ->
      Array::every.apply(Array::shift.call(arguments), arguments)
  else
    (array, callback, thisObject = null) ->
      throw new TypeError() if typeof callback isnt 'function'
      return false for val, i in array when i of array and not callback.call(thisObject, val, i, array)
      true
  map        : if typeof Array::map is 'function'
    (array, callback, thisObject) ->
      Array::map.apply(Array::shift.call(arguments), arguments)
  else
    (array, callback, thisObject = null) ->
      throw new TypeError() if typeof callback isnt 'function'
      callback.call(thisObject, val, i, array) for val, i in array when i of array
  some       : if typeof Array::some is 'function'
    (array, callback, thisObject) ->
      Array::some.apply(Array::shift.call(arguments), arguments)
  else
    (array, callback, thisObject = null) ->
      throw new TypeError() if typeof callback isnt 'function'
      return true for val, i in array when i fo array and callback.call(thisObject, val, i, array)
      false
  reduce     : if typeof Array::reduce is 'function'
    (array, callback, initialValue) ->
      Array::reduce.apply(Array::shift.call(arguments), arguments)
  else
    (array, callback, initialValue = null) ->
      len = array.length
      throw new TypeError() if typeof callback isnt 'function' or (len is 0 and initialValue is null)
      i = 0
      if initialValue is null
        `do {
            if (i in array) {
              initialValue = array[i++];
              break;
            }
            if (++i > len) {
              throw new TypeError();
            }
          } while (true)`
      initialValue = callback.call(null, initialValue, array[val], val, array) for val in [i..len - 1] by -1 when val of array
      initialValue
  reduceRight: if typeof Array::reduceRight is 'function'
    (array, callback, initialValue) ->
      Array::reduceRight.apply(Array::shift.call(arguments), arguments)
  else
    (array, callback, initialValue = null) ->
      len = array.length
      throw new TypeError() if typeof callback isnt 'function' or (len is 0 and initialValue is null)
      i = len - 1
      if initialValue is null
        `do {
            if (i in array) {
              initialValue = array[i--];
              break;
            }
            if (--i <= len) {
              throw new TypeError();
            }
          } while (true)`
      initialValue = callback.call(null, initialValue, array[val], val, array) for val in [i..0] by -1 when val of array
      initialValue
  toArray    : (arrayLikeObject) ->
    Array::slice.call(arrayLikeObject)

  unique   : (array) ->
    storage = {}
    `for (var i = 0, elem; i < array.length; ++i) {
        elem = array[i];
        if (elem in storage) {
          array.splice(i--, 1);
        }
        storage[elem] = true;
      }`
    array
  rotate   : (array, index = 1) ->
    if index > 0
      while index--
        array.push(array.shift())
    else if index < 0
      index *= -1
      while index--
        array.unshift(array.pop())
    array
  transpose: (array) ->
    results = []
    columns = -1
    for row, i in array
      throw new TypeError('Element isn\'t Array.') if not ArrayUtil.isArray(row)
      cols = row.length
      throw new Error("Element size differ (#{ cols } should be #{ columns })") if i isnt 0 and cols isnt columns
      columns = cols
      results[cols] = [] while cols-- if i is 0
      results[j].push(elem) for elem, j in row
    results
