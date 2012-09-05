{muon} = require '../lib/muon.js'
{URL} = muon.net
url = require 'url'
check = (test, urlStr, parseQueryString = false)->
  obj = url.parse(urlStr, parseQueryString)
  if parseQueryString and obj.search is ''
    delete obj.search
  obj.origin = "#{obj.protocol}#{if obj.slashes then '//' else ''}#{if obj.auth? then obj.auth + '@' else ''}#{obj.host}"
  test.deepEqual URL.parse(urlStr, parseQueryString), obj
  test.done()

exports.url =

  parse:

    'parseQueryString=false':

      'without slash': (test)->
        check test, 'http://example.com'

      'with slash': (test)->
        check test, 'http://example.com/'

      'node': (test)->
        check test, 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'

      'rfc 3986': (test)->
        check test, 'foo://example.com:8042/over/there?name=ferret#nose'

      'rfc 2396':

        'ftp': (test)->
          check test, 'ftp://ftp.is.co.za/rfc/rfc1808.txt'

        'gopher': (test)->
          check test, 'gopher://spinaltap.micro.umn.edu/00/Weather/California/Los%20Angeles'

        'http': (test)->
          check test, 'http://www.math.uio.no/faq/compression-faq/part1.html'

        'mailto': (test)->
          check test, 'mailto:mduerst@ifi.unizh.ch'

        'news': (test)->
          check test, 'news:comp.infosystems.www.servers.unix'

        'telnet': (test)->
          check test, 'telnet://melvyl.ucop.edu/'

    'parseQueryString=true':

      'without slash': (test)->
        check test, 'http://example.com', true

      'with slash': (test)->
        check test, 'http://example.com/', true

      'node': (test)->
        check test, 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash', true

      'rfc 3986': (test)->
        check test, 'foo://example.com:8042/over/there?name=ferret#nose', true

      'rfc 2396':

        'ftp': (test)->
          check test, 'ftp://ftp.is.co.za/rfc/rfc1808.txt', true

        'gopher': (test)->
          check test, 'gopher://spinaltap.micro.umn.edu/00/Weather/California/Los%20Angeles', true

        'http': (test)->
          check test, 'http://www.math.uio.no/faq/compression-faq/part1.html', true

        'mailto': (test)->
          check test, 'mailto:mduerst@ifi.unizh.ch', true

        'news': (test)->
          check test, 'news:comp.infosystems.www.servers.unix', true

        'telnet': (test)->
          check test, 'telnet://melvyl.ucop.edu/', true
