(function () {
  "use strict";

  var fs = require('fs')
    , path = require('path')
    , spawn = require('child_process').spawn
    , uglify = require('uglify-js2')
    , util = require('util')

    , PACKAGE_NAME = 'muon'
    , VERSION = '0.1.1'
    , INPUT = 'src'
    , OUTPUT = 'lib'
    , TEST = 'test';


  function find(originalDir, dir, files) {
    if (dir == null) {
      dir = originalDir;
    }
    if (files == null) {
      files = [];
    }
    fs.readdirSync(dir).forEach(function (name) {
      var filename = path.join(dir, name)
        , stats = fs.statSync(filename)
        , extname, code, tmp, packageName, className, namespace;
      if (stats.isFile()) {
        extname = path.extname(filename);
        if (extname === '') {
          extname = path.basename(filename);
        }
        switch (extname) {
          case '.js':
            code = fs.readFileSync(filename, 'utf-8');
            break;
          case '.coffee':
            code = fs.readFileSync(filename, 'utf-8');
            break;
          default:
            return;
        }

        tmp = path.relative(originalDir, filename);
        packageName = path.dirname(tmp);
        className = path.basename(tmp, path.extname(tmp));
        if (className.charAt(0) === '.') {
          namespace = null;
        } else {
          namespace = packageName.split('/');
          namespace.push(className);
        }

        files.push({
          namespace: namespace,
          code     : code
        });

      } else if (stats.isDirectory()) {
        find(originalDir, filename, files);
      }
    });
    return files;
  }

  function createPackageObjectString(files) {
    var object = {};
    files.forEach(function (file) {
      var namespace = file.namespace
        , obj = object;
      namespace.forEach(function (ns) {
        if (obj[ns] == null) {
          obj[ns] = {};
        }
        obj = obj[ns];
      });
    });
    return JSON.stringify(object);
  }

  function copyright(version) {
    return [
      '/**',
      ' * @fileOverview',
      ' * @name muon.js',
      ' * @author Daisuke Mino daisuke.mino@gmail.com',
      ' * @url https://github.com/minodisk/muon',
      ' * @version ' + version,
      ' * @license MIT License',
      ' */',
      ''
    ].join('\n');
  }

  function prefix() {
    return [
      ";(function () {",
      "'use strict';",
      ""
    ].join('\n');
  }

  function implement(files) {
    var blocks = [];
    files.forEach(function (file, i) {
      var lines = []
        , code;
      file.code.split('\n').forEach(function (line, j) {
        lines[j] = '    ' + line;
      });

      code = lines.join('\n');
      blocks[i] = file.namespace == null ? file.code : "  define('" + file.namespace.join('.') + "', function (module, exports) {\n" +
        code + '\n' +
        '  });\n';
    });
    return blocks.join('\n');
  }

  function postfix() {
    return [
      "  this.require = Module.prototype.require;",
      "",
      "}).call(this);",
      ""
    ].join('\n');
  }

  function compile(files) {
    return copyright(VERSION) + prefix() + implement(files) + postfix();
  }

  function minify(code) {
    return uglify.minify(code, {
      fromString: true
    }).code;
  }

  function write(content, postfix) {
    if (postfix == null) {
      postfix = '';
    }
    fs.writeFileSync(path.join(OUTPUT, PACKAGE_NAME + postfix + '.js'), content, 'utf-8');
  }

  function test(dir) {
    var nodeunit = spawn('nodeunit', [dir]);
    nodeunit.stdout.on('data', function (data) {
      util.print(data);
    });
    nodeunit.stderr.on('data', function (data) {
      util.print(data);
    });
    nodeunit.on('exit', function (code) {
    });
  }

  (function () {
    var code = compile(find(INPUT))
      , minified = copyright(VERSION) + minify(code);

    write(code);
    write(minified, '.min');
    test(TEST);
  })();

})();