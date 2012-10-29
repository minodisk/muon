var querystring = {}
  , encode = encodeURIComponent;

querystring.stringify = function (obj) {
  var key
    , tokens = [];
  for (key in obj) {
    tokens.push(key + '=' + encode(obj[key]));
  }
  return tokens.join("&");
};

querystring.parse = function (str) {
  if (str == null) {
    return {};
  }
  var tokens = str.split("&")
    , obj = {}
    , i = 0
    , len = tokens.length
    , kv;
  if (len === 0) {
    throw new TypeError();
  }
  for (; i < len; i++) {
    kv = tokens[i].split('=');
    obj[kv[0]] = encode(kv[1]);
  }
  return obj;
};

this.querystring = querystring;