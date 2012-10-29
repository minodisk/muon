var querystring = this.require('muon.serializer.querystring')
  , array = this.require('muon.utils.array');

var url = {}
  , R_URL = /^((\w+:)(\/*)?(?:([^@]*)@)?(([^\/]+?)(?::(\d*))?))((\/[^\?#]*)?(\?([^#]*)?)?)?(#.*)?$/;

url.parse = function (urlStr, parseQueryString) {
  if (parseQueryString == null) {
    parseQueryString = false;
  }
  
  var matched = urlStr.match(R_URL)
    , href = matched[0]
    , origin = matched[1]
    , protocol = matched[2]
    , slashes = matched[3]
    , auth = matched[4]
    , host = matched[5]
    , hostname = matched[6]
    , port = matched[7]
    , path = matched[8]
    , pathname = matched[9]
    , search = matched[10]
    , query = matched[11]
    , hash = matched[12]
    , obj, opt, key;
  
  obj = {
    href    : href,
    origin  : origin,
    protocol: protocol,
    host    : host,
    hostname: hostname
  };
  if (parseQueryString) {
    query = querystring.parse(query);
  }
  opt = {
    auth    : auth,
    port    : port,
    path    : path,
    pathname: pathname,
    search  : search,
    query   : query,
    hash    : hash
  };
  if (slashes != null) {
    obj.slashes = true;
    if (path == null) {
      obj.path = obj.pathname = '/';
      obj.href += '/';
    }
  }
  for (key in opt) {
    value = opt[key];
    if (value) {
      obj[key] = value;
    }
  }
  return obj;
};

url.format = function (urlObj) {
  var protocol = urlObj.protocol
    , protocolPostfix = __indexOf.call(URL.CSS, protocol) >= 0 ? '://' : ':'
    , auth = urlObj.auth
    , host = urlObj.host
    , hostname = urlObj.hostname
    , port = urlObj.port
    , pathname = urlObj.pathname
    , search = urlObj.search
    , query = urlObj.query
    , hash = urlObj.hash;

  if (host == null) {
    host = '';
    if (hostname != null) {
      host += hostname;
    }
    if (port != null) {
      host += ':' + port;
    }
  }
  if (pathname.charAt(0) !== '/') {
    pathname = '/' + pathname;
  }
  if (search != null) {
    if (search.charAt(0) !== '?') {
      search = '?' + search;
    }
  } else if (query != null) {
    search = '?' + querystring.stringify(query);
  }
  if (hash != null && hash.charAt(0) !== '#') {
    hash = '#' + hash;
  }
  return protocol + protocolPostfix + host + pathname + search + hash;
};

url.resolve = function (from, to) {
};

this.url = url;