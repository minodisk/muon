exports.utils.DateUtil = DateUtil =

  keywords:
    A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  _getValue: (date, name, isUTC)->
    date["get#{if isUTC then 'UTC' else ''}#{name}"]()

  _toString: (date, pattern, isUTC)->
    {keywords, _getValue} = DateUtil
    switch pattern
      when '%A' #曜日の名称(Sunday, Monday ... )
        keywords.A[_getValue date, 'Day', isUTC]
      when '%a' #曜日の省略名(Sun, Mon ... )
        keywords.a[_getValue date, 'Day', isUTC]
      when '%B' #月の名称(January, February ... )
        keywords.B[_getValue date, 'Month', isUTC]
      when '%b' #月の省略名(Jan, Feb ... )
        keywords.b[_getValue date, 'Month', isUTC]
      when '%C' #世紀 (2009年であれば 20)
        _getValue date, 'FullYear', isUTC
      when '%c' #日付と時刻
        ''
      when '%D' #日付 (%m/%d/%y)
        ''
      when '%d' #日(01-31)
        ''
      when '%e' #日。一桁の場合、半角空白で埋める (1..31)
        ''
      when '%F' #%Y-%m-%d と同等 (ISO 8601の日付フォーマット)
        ''
      when '%H' #24時間制の時(00-23)
        ''
      when '%h' #%b と同等
        ''
      when '%I' #12時間制の時(01-12)
        ''
      when '%j' #年中の通算日(001-366)
        ''
      when '%k' #24時間制の時。一桁の場合、半角空白で埋める (0..23)
        ''
      when '%L' #ミリ秒 (000.999)
        ''
      when '%l' #12時間制の時。一桁の場合、半角空白で埋める (0..12)
        ''
      when '%M' #分(00-59)
        ''
      when '%m' #月を表す数字(01-12)
        ''
      when '%n' #改行 (\n)
        '\n'
      when '%N' #秒の小数点以下。桁の指定がない場合は9桁 (ナノ秒)、%6N: マイクロ秒 (6桁)、%3N: ミリ秒 (3桁)
        ''
      when '%P' #午前または午後(am,pm)
        ''
      when '%p' #午前または午後(AM,PM)
        ''
      when '%R' #24時間制の時刻。%H:%M と同等。
        ''
      when '%r' #12時間制の時刻。%I:%M:%S %p と同等。
        ''
      when '%S' #秒(00-60) (60はうるう秒)
        ''
      when '%s' #1970-01-01 00:00:00 UTC からの経過秒
        ''
      when '%T' #24時間制の時刻。%H:%M:%S と同等。
        ''
      when '%t' #タブ文字 (\t)
        '\t'
      when '%U' #週を表す数。最初の日曜日が第1週の始まり(00-53)
        ''
      when '%u' #月曜日を1とした、曜日の数値表現 (1..7)
        ''
      when '%v' #VMS形式の日付 (%e-%b-%Y)
        ''
      when '%V' #ISO 8601形式の暦週 (01..53)
        ''
      when '%W' #週を表す数。最初の月曜日が第1週の始まり(00-53)
        ''
      when '%w' #曜日を表す数。日曜日が0(0-6)
        ''
      when '%X' #時刻
        ''
      when '%x' #日付
        ''
      when '%Y' #西暦を表す数
        _getValue date, 'FullYear', isUTC
      when '%y' #西暦の下2桁(00-99)
        _getValue(date, 'FullYear', isUTC) % 100
      when '%Z' #タイムゾーン
        ''
      when '%z' #タイムゾーン。UTCからのオフセット (例 +0900)
        _getValue date, 'TimezoneOffset', false
      when '%%' #%自身
        '%'

  stringify: (date, format = '%a %b %d %T %Z %Y', isUTC = false)->
    format.replace /%[%\w]/g, (pattern)->
      DateUtil._toString date, pattern, isUTC

  parse: (str, format, isUTC = false)->
