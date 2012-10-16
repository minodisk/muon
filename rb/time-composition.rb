def printStrftime(year, mon, day, hour, min, sec, format = '')
  print Time.local(year, mon, day, hour, min, sec).strftime(format + '%n')
end

printStrftime(2010, 9, 5, 2, 3, 6, 'Now, %A %B %d %X %Z %Y')
printStrftime(2010, 9, 5, 2, 3, 6, '%Y-%m-%d %H:%M:%S')
