exports.utils.DateUtil = DateUtil =

  _R_PATTERNS: /%[AaBbCcDdeFHhIjkLlMmNnPpRrSsTtUuvVWwXxYyZz%]/g

  keywords:
    A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    p: ['AM', 'PM']
    P: ['am', 'pm']

  _getValue: (date, name, isUTC)->
    date["get#{if isUTC then 'UTC' else ''}#{name}"]()

  _stringify: (date, pattern, isUTC)->
    {keywords, _getValue, stringify, getDays, getSundayWeeks, getMondayWeeks, getISO8601Weeks} = DateUtil
    {padLeft} = StringUtil
    padZero = (num)->
      padLeft num, 2, '0'
    padZero3 = (num)->
      padLeft num, 3, '0'
    padBlank = (num)->
      padLeft num, 2, ' '
    switch pattern
      when '%A' #曜日の名称(Sunday, Monday ... )
        keywords.A[_getValue date, 'Day', isUTC]
      when '%a' #曜日の省略名(Sun, Mon ... )
        keywords.a[_getValue date, 'Day', isUTC]
      when '%B' #月の名称(January, February ... )
        keywords.B[_getValue date, 'Month', isUTC]
      when '%b', '%h' #月の省略名(Jan, Feb ... )
        keywords.b[_getValue date, 'Month', isUTC]
      when '%C' #世紀 (2009年であれば 20)
        _getValue(date, 'FullYear', isUTC) / 100 >> 0
      when '%c' #日付と時刻 (%a %b %e %H:%M:%S %Y)
        stringify date, '%a %b %e %H:%M:%S %Y', isUTC
      when '%D' #日付 (%m/%d/%y)
        stringify date, '%m/%d/%y', isUTC
      when '%d' #日(01-31)
        padZero _getValue date, 'Date', isUTC
      when '%e' #日。一桁の場合、半角空白で埋める ( 1..31)
        padBlank _getValue date, 'Date', isUTC
      when '%F' #%Y-%m-%d と同等 (ISO 8601の日付フォーマット)
        stringify date, '%Y-%m-%d', isUTC
      when '%H' #24時間制の時(00-23)
        padZero _getValue date, 'Hours', isUTC
      when '%I' #12時間制の時(01-12)
        padZero _getValue(date, 'Hours', isUTC) % 12
      when '%j' #年中の通算日(001-366)
        padZero3 getDays date
      when '%k' #24時間制の時。一桁の場合、半角空白で埋める ( 0..23)
        padBlank _getValue date, 'Hours', isUTC
      when '%L', '%N' #ミリ秒 (000.999)
        padZero3 _getValue date, 'Milliseconds', isUTC
      when '%l' #12時間制の時。一桁の場合、半角空白で埋める ( 0..12)
        padBlank _getValue(date, 'Hours', isUTC) % 12
      when '%M' #分(00-59)
        padZero _getValue date, 'Minutes', isUTC
      when '%m' #月を表す数字(01-12)
        padZero _getValue(date, 'Month', isUTC) + 1
      when '%n' #改行 (\n)
        '\n'
      when '%P' #午前または午後(am,pm)
        keywords.P[_getValue(date, 'Hours', isUTC) / 12 >> 0]
      when '%p' #午前または午後(AM,PM)
        keywords.p[_getValue(date, 'Hours', isUTC) / 12 >> 0]
      when '%R' #24時間制の時刻。%H:%M と同等。
        stringify date, '%H:%M', isUTC
      when '%r' #12時間制の時刻。%I:%M:%S %p と同等。
        stringify date, '%I:%M:%S %p', isUTC
      when '%S' #秒(00-60) (60はうるう秒)
        padZero _getValue date, 'Seconds', isUTC
      when '%s' #1970-01-01 00:00:00 UTC からの経過秒
        date.getTime() / 1000 >> 0
      when '%T' #24時間制の時刻。%H:%M:%S と同等。
        stringify date, '%H:%M:%S', isUTC
      when '%t' #タブ文字 (\t)
        '\t'
      when '%U' #週を表す数。最初の日曜日が第1週の始まり(00-53)
        padZero getSundayWeeks date, isUTC
      when '%u' #月曜日を1とした、曜日の数値表現 (1..7)
        day = _getValue date, 'Day', isUTC
        return 7 if day is 0
        day
      when '%v' #VMS形式の日付 (%e-%b-%Y)
        stringify(date, '%e-%b-%Y', isUTC).toUpperCase()
      when '%V' #ISO 8601形式の暦週 (01..53)
        padZero getISO8601Weeks date, isUTC
      when '%W' #週を表す数。最初の月曜日が第1週の始まり(00-53)
        padZero getMondayWeeks date, isUTC
      when '%w' #曜日を表す数。日曜日が0(0-6)
        _getValue date, 'Day', isUTC
      when '%X' #時刻 (%H:%M:%S)
        stringify date, '%H:%M:%S', isUTC
      when '%x' #日付 (%m/%d/%y)
        stringify date, '%m/%d/%y', isUTC
      when '%Y' #西暦を表す数
        _getValue date, 'FullYear', isUTC
      when '%y' #西暦の下2桁(00-99)
        _getValue(date, 'FullYear', isUTC) % 100
      when '%Z' #タイムゾーン
        if (matched = date.toString().match(/\((\w+)\)/))?
          return matched[1]
        undefined
      when '%z' #タイムゾーン。UTCからのオフセット (例 +0900)
        minutes = date.getTimezoneOffset() * -1
        if minutes < 0
          sign = '-'
          minutes *= -1
        else
          sign = '+'
        "#{sign}#{padZero minutes / 60}#{padZero minutes % 60}"
      when '%%' #%自身
        '%'
      else
        throw new Error "Unrecognized pattern '#{pattern}'"

  stringify: (date, format = '%a %b %d %T %Z %Y', isUTC = false)->
    format.replace DateUtil._R_PATTERNS, (pattern)->
      DateUtil._stringify date, pattern, isUTC

  _parse: (char, pattern, isUTC)->


  parse: (str, format, isUTC = false)->
    format.replace DateUtil._R_PATTERNS, (pattern)->
      console.log arguments

  getDays: (date)->
    newYearsDay = new Date date.getFullYear(), 0, 1
    Math.ceil (date.getTime() - newYearsDay.getTime() + 1) / (24 * 60 * 60 * 1000)

  getSundayWeeks: (date, isUTC)->
    {_getValue, getDays} = DateUtil
    y = _getValue date, 'FullYear', isUTC
    newYearsDay = _getValue new Date(y, 0, 1), 'Day', isUTC
    totalDays = getDays date
    paddingDays = 0 - newYearsDay
    if paddingDays < 0
      paddingDays += 7
    Math.ceil (totalDays - paddingDays) / 7

  getMondayWeeks: (date, isUTC)->
    {_getValue, getDays} = DateUtil
    y = _getValue date, 'FullYear', isUTC
    newYearsDay = _getValue new Date(y, 0, 1), 'Day', isUTC
    totalDays = getDays date
    paddingDays = 1 - newYearsDay
    if paddingDays < 0
      paddingDays += 7
    Math.ceil (totalDays - paddingDays) / 7

  getISO8601Weeks: (date, isUTC)->
    {_getValue, getDays, getISO8601Weeks} = DateUtil
    y = _getValue date, 'FullYear', isUTC
    m = _getValue date, 'Month', isUTC
    d = _getValue date, 'Date', isUTC
    newYearsDay = _getValue new Date(y, 0, 1), 'Day', isUTC
    newYearsEveDay = _getValue new Date(y, 11, 31), 'Day', isUTC
    if m is 0 and d <= 3 and (newYearsDay >= 5 or newYearsDay is 0)
      # check edge case: 1/1, 1/2, 1/3
      getISO8601Weeks new Date(y, 0, 0), isUTC
    else if m is 11 and d >= 29 and (newYearsEveDay >= 1 and newYearsEveDay <= 3)
      # check edge case: 12/29, 12/30, 12/31
      getISO8601Weeks new Date(y, 11, 32), isUTC
    else
      totalDays = getDays date
      paddingDays = 1 - newYearsDay
      if paddingDays <= -4
        paddingDays += 7
      Math.ceil (totalDays - paddingDays) / 7

  getLastDateOfMonth: (y, m)->
    new Date y, m, 0

  leap: (year)->
    year % 4 is 0 and year % 100 isnt 0 or year % 400 is 0
