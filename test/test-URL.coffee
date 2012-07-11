{muon} = require '../lib/muon.js'
{URL} = muon.net
url = require 'url'
check = (test, str)->
  obj = url.parse(str)
  obj.origin = "#{obj.protocol}#{if obj.slashes then '//' else ''}#{if obj.auth? then obj.auth + '@' else ''}#{obj.host}"
  test.deepEqual URL.parse(str), obj
  test.done()

exports.url =

  parse:
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
