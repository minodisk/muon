_mix = (a, b, f)->
  a + (((b - a) * f) >> 8)
_peg = (n)->
  if n < 0 then 0 else if n > 255 then 255 else n
_min = Math.min
_max = Math.max

exports.filters.Blend = Blend =

  scan: (dst, src, method)->
    method = @[method]
    throw new TypeError "#{ method } isn't defined." unless method?
    d = dst.data
    s = src.data
    for i in [0...d.length] by 4
      o = method d[i], d[i + 1], d[i + 2], d[i + 3], s[i], s[i + 1], s[i + 2], s[i + 3]
      d[i..i + 3] = o[0..3]
    dst

  blend: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, sr, sa
      _mix dg, sg, sa
      _mix db, sb, sa
      da + sa
    ]

  add: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      dr + (sr * sa >> 8)
      dg + (sg * sa >> 8)
      db + (sb * sa >> 8)
      da + sa
    ]

  subtract: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      dr - (sr * sa >> 8)
      dg - (sg * sa >> 8)
      db - (sb * sa >> 8)
      da + sa
    ]

  darkest: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, _min(dr, sr * sa >> 8), sa
      _mix dg, _min(dg, sg * sa >> 8), sa
      _mix db, _min(db, sb * sa >> 8), sa
      da + sa
    ]

  lightest: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _max dr, sr * sa >> 8
      _max dg, sg * sa >> 8
      _max db, sb * sa >> 8
      da + sa
    ]

  difference: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, (if dr > sr then dr - sr else sr - dr), sa
      _mix dg, (if dg > sg then dg - sg else sg - dg), sa
      _mix db, (if db > sb then db - sb else sb - db), sa
      da + sa
    ]

  exclusion: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, dr + sr - (dr * sr >> 7), sa
      _mix dg, dg + sg - (dg * sg >> 7), sa
      _mix db, db + sb - (db * sb >> 7), sa
      da + sa
    ]

  reflex: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, (if sr is 0xff then sr else dr * dr / (0xff - sr)), sa
      _mix dg, (if sg is 0xff then sg else dg * dg / (0xff - sg)), sa
      _mix db, (if sb is 0xff then sb else db * db / (0xff - sb)), sa
      da + sa
    ]

  multiply: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, dr * sr >> 8, sa
      _mix dg, dg * sg >> 8, sa
      _mix db, db * sb >> 8, sa
      da + sa
    ]

  screen: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, 0xff - ((0xff - dr) * (0xff - sr) >> 8), sa
      _mix dg, 0xff - ((0xff - dg) * (0xff - sg) >> 8), sa
      _mix db, 0xff - ((0xff - db) * (0xff - sb) >> 8), sa
      da + sa
    ]

  overlay: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, (if dr < 0x80 then dr * sr >> 7 else 0xff - ((0xff - dr) * (0xff - sr) >> 7)), sa
      _mix dg, (if dg < 0x80 then dg * sg >> 7 else 0xff - ((0xff - dg) * (0xff - sg) >> 7)), sa
      _mix db, (if db < 0x80 then db * sb >> 7 else 0xff - ((0xff - db) * (0xff - sb) >> 7)), sa
      da + sa
    ]

  softLight: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, (dr * sr >> 7) + (dr * dr >> 8) - (dr * dr * sr >> 15), sa
      _mix dg, (dg * sg >> 7) + (dg * dg >> 8) - (dg * dg * sg >> 15), sa
      _mix db, (db * sb >> 7) + (db * db >> 8) - (db * db * sb >> 15), sa
      da + sa
    ]

  hardLight: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, (if sr < 0x80 then dr * sr >> 7 else 0xff - (((0xff - dr) * (0xff - sr)) >> 7)), sa
      _mix dg, (if sg < 0x80 then dg * sg >> 7 else 0xff - (((0xff - dg) * (0xff - sg)) >> 7)), sa
      _mix db, (if sb < 0x80 then db * sb >> 7 else 0xff - (((0xff - db) * (0xff - sb)) >> 7)), sa
      da + sa
    ]

  vividLight: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      if sr is 0 then 0
      else if sr is 0xff then 0xff
      else if sr < 0x80 then 0xff - _peg(((0xff - dr) << 8) / (sr * 2))
      else _peg((dr << 8) / ((0xff - sr) * 2))
    ,
      if sg is 0 then 0
      else if sg is 0xff then 0xff
      else if sg < 0x80 then 0xff - _peg(((0xff - dg) << 8) / (sg * 2))
      else _peg((dg << 8) / ((0xff - sg) * 2))
    ,
      if sb is 0 then 0
      else if sb is 0xff then 0xff
      else if sb < 0x80 then 0xff - _peg(((0xff - db) << 8) / (sb * 2))
      else _peg((db << 8) / ((0xff - sb) * 2))
    ,
      da + sa
    ]

  linearLight: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      if sr < 0x80 then _max(sr * 2 + dr - 0xff, 0)
      else _min(sr + dr, 0xff)
    ,
      if sg < 0x80 then _max(sg * 2 + dg - 0xff, 0)
      else _min(sg + dg, 0xff)
    ,
      if sb < 0x80 then _max(sb * 2 + db - 0xff, 0)
      else _min(sb + db, 0xff)
    ,
      da + sa
    ]

  pinLight: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      if sr < 0x80 then _min sr * 2, dr
      else _max((sr - 0x80) * 2, dr)
    ,
      if sg < 0x80 then _min sg * 2, dg
      else _max((sg - 0x80) * 2, dg)
    ,
      if sb < 0x80 then _min sb * 2, db
      else _max((sb - 0x80) * 2, db)
    ,
      da + sa
    ]

  hardMix: (dr, dg, db, da, sr, sg, sb, sa)->
    r =
      if sr is 0 then 0
      else if sr is 0xff then 0xff
      else if sr < 0x80 then 0xff - _peg(((0xff - dr) << 8) / (sr * 2))
      else _peg((dr << 8) / ((0xff - sr) * 2))
    g =
      if sg is 0 then 0
      else if sg is 0xff then 0xff
      else if sg < 0x80 then 0xff - _peg(((0xff - dg) << 8) / (sg * 2))
      else _peg((dg << 8) / ((0xff - sg) * 2))
    b =
      if sb is 0 then 0
      else if sb is 0xff then 0xff
      else if sb < 0x80 then 0xff - _peg(((0xff - db) << 8) / (sb * 2))
      else _peg((db << 8) / ((0xff - sb) * 2))
    r = if r < 0x80 then 0 else 0xff
    g = if g < 0x80 then 0 else 0xff
    b = if b < 0x80 then 0 else 0xff
    [
      dr * (0xff-sa) / 0xff + r * sa / 0xff
      dg * (0xff-sa) / 0xff + g * sa / 0xff
      db * (0xff-sa) / 0xff + b * sa / 0xff
      da + sa
    ]

  dodge: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, _peg((dr << 8) / (0xff - sr)), sa
      _mix dg, _peg((dg << 8) / (0xff - sg)), sa
      _mix db, _peg((db << 8) / (0xff - sb)), sa
      da + sa
    ]

  burn: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, (if sr is 0 then 0 else 0xff - _peg(((0xff - dr) << 8) / sr)), sa
      _mix dg, (if sg is 0 then 0 else 0xff - _peg(((0xff - dg) << 8) / sg)), sa
      _mix db, (if sb is 0 then 0 else 0xff - _peg(((0xff - db) << 8) / sb)), sa
      da + sa
    ]

  linearDodge: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, _min(sr + dr, 0xff), sa
      _mix dg, _min(dg + sg, 0xff), sa
      _mix db, _min(db + sb, 0xff), sa
      da + sa
    ]

  linearBurn: (dr, dg, db, da, sr, sg, sb, sa)->
    [
      _mix dr, _max(sr + dr - 0xff, 0), sa
      _mix dg, _max(dg + sg - 0xff, 0), sa
      _mix db, _max(db + sb - 0xff, 0), sa
      da + sa
    ]
