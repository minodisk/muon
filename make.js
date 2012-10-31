// Requirement
// * docco http://jashkenas.github.com/docco/
// * pygments http://pygments.org/
// * dox https://github.com/visionmedia/dox
// * jade https://github.com/visionmedia/jade
(function () {
  "use strict";

  var fs = require('fs')
    , path = require('path')
    , spawn = require('child_process').spawn
    , util = require('util')
    , uglify = require('uglify-js2')
    , dox = require('dox')
    , jade = require('jade')

    , PACKAGE_NAME = 'muon'
    , VERSION = '0.1.2'
    , INPUT = 'src'
    , OUTPUT = 'lib'
    , TEST = 'test'
    , DOC = 'docs'
    , TEMPLATE = 'docs-template'
    , API = 'api';


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
        , extname, code, tmp, packageName, className, topLevel, names, file;
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
        topLevel = className.charAt(0) === '_';
        if (topLevel) {
          while (className.charAt(0) === '_') {
            className = className.substr(1);
          }
        }
        if (packageName === '.') {
          names = [className];
        } else {
          names = packageName.split('/');
          names.push(className);
        }

        file = {
          namespace: names.join('.'),
          code     : code,
          topLevel : topLevel
        };
        files.push(file);

      } else if (stats.isDirectory()) {
        find(originalDir, filename, files);
      }
    });

    files.sort(function (a, b) {
      if ((a.topLevel && b.topLevel) || (!a.topLevel && !b.topLevel)) {
        if ([a.namespace, b.namespace].sort().indexOf(a.namespace) === 0) {
          return -1;
        } else {
          return 1;
        }
      } else if (a.topLevel) {
        return -1;
      } else if (b.topLevel) {
        return 1;
      }
    });

    return files;
  }

  /*  function createPackageObjectString(files) {
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
   }*/

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
      "  'use strict';",
      "",
      ""
    ].join('\n');
  }

  function implement(files) {
    var blocks = [];
    files.forEach(function (file, i) {
      var lines = []
        , indent, code;

      indent = file.topLevel ? '  ' : '    ';
      file.code.split('\n').forEach(function (line, j) {
        lines[j] = indent + line;
      });
      code = lines.join('\n');
      blocks[i] = file.topLevel ? code + '\n' : "  define('" + file.namespace + "', function (require, module, exports) {\n" +
        code + '\n' +
        '  });\n';
    });
    return blocks.join('\n');
  }

  function postfix() {
    return [
      "  this.require = Module.require;",
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

  function docCode(dir, filename) {
    var docco = spawn('docco', ['-o', dir, filename]);
    docco.stdout.on('data', function (data) {
      util.print(data);
    });
    docco.stderr.on('data', function (data) {
      util.print(data);
    });
    docco.on('exit', function (code) {
    });
  }

  function docAPI(files, template, output) {
    var modules = [];
    files.forEach(function (file) {
      var module = {
        namespace: file.namespace,
        comments : dox.parseComments(file.code)
      };

      console.log(file.namespace, '===========================================');

      module.comments.forEach(function (comment) {
        var ctx = comment.ctx
          , tags = comment.tags
          , params
          , type;
        if (ctx) {
          console.log(ctx.string, '---------------------------------------');
          //          console.log('ctx:', ctx.type);
          console.log('ctx:', ctx);
          //          console.log('description:', comment.description.full);
          comment.tags.forEach(function (tag) {
            console.log('tag:', tag);
          });
          if (tags) {
            params = [];
            tags.forEach(function (tag) {
              switch (tag.type) {
                case 'param':
                  params.push(tag.name + ':' + tag.types.join('|'));
                  break;
                case 'return':
                case 'type':
                  type = tag.types.join('|');
                  break;
              }
              if (type == null) {
                type = 'void';
              }
            });
            type = ':' + type;
            switch (ctx.type) {
              case 'function':
              case 'method':
                ctx.declaration = ctx.name + '(' + params.join(', ') + ')' + type;
                break;
              case 'property':
                ctx.declaration = ctx.name + type;
                break;
            }
          }
          console.log('declaration:', ctx.declaration);
        }
      });

      modules.push(module);
    });

    var gen = jade.compile(fs.readFileSync(template), {
      compileDebug: true,
      pretty      : true
    });
    fs.writeFileSync(output, gen({
      modules: modules
    }), 'utf-8');

    util.print('jade: ', template, ' -> ', output);
  }

  function run() {
    var files = find(INPUT)
      , code = compile(files)
      , minified = copyright(VERSION) + minify(code);

    write(code);
    write(minified, '.min');
    test(TEST);
    docCode(DOC, OUTPUT + '/' + PACKAGE_NAME + '.js');
    docAPI(files, TEMPLATE + '/' + API + '.jade', DOC + '/' + API + '.html');
  }

  var requestRun = (function () {
    var timeoutId;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(run, 1000);
    };
  })();

  function watch() {
    Array.prototype.slice.call(arguments).forEach(function (dir) {
      var watcher = fs.watch(dir);
      watcher.on('change', requestRun);
    });
  }

  (function () {
    requestRun();
    watch(INPUT, OUTPUT, TEST, TEMPLATE);
  })();

})();