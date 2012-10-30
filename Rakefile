# Requirement
# * node      https://github.com/joyent/node
# * UglifyJS2 https://github.com/mishoo/UglifyJS2
# * nodeunit  https://github.com/caolan/nodeunit

require 'find'
require 'json'


PACKAGE_NAME = 'muon'
VERSION = '0.1.1'
INPUT = 'src'
OUTPUT = 'lib'
TEST = 'test'

def copyright(version)
  <<-EOS
/**
 * @fileOverview
 * @name muon.js
 * @author Daisuke Mino daisuke.mino@gmail.com
 * @url https://github.com/minodisk/muon
 * @version #{version}
 * @license MIT License
 */
EOS
end

def prefix(package_object)
  <<-EOS
;(function () {
  'use strict';

  var __declarations = #{package_object}
    , __modules = #{package_object}
    , require = function (namespace) {
      var namespaces = namespace.split('.')
        , i, len, module, declaration;
  
      module = __modules;
      for (i = 0, len = namespaces.length; i < len; i++) {
        module = module[namespaces[i]];
        if (module == null) {
          break;
        }
      }
      if (module != null) {
        return module;
      }
  
      declaration = __declarations;
      module = __modules;
      for (i = 0, len = namespaces.length; i < len; i++) {
        declaration = declaration[namespaces[i]];
        if (i < len - 1) {
          if (module[namespaces[i]] == null) {
            module[namespaces[i]] = {};
          }
          module = module[namespaces[i]];
        }
      }
      if (declaration == null) {
        throw new Error("Cannot find module '" + namespace + "'");
      }
      if (module.exports == null) {
        module.exports = {};
      }
      declaration.call(module.exports, module, module.exports);
  
      return module.exports;
    };

EOS
end

def postfix
  <<-EOS
  this.require = require;

}).call(this);
EOS
end


filename = nil

task :default => [:compile, :minimize, :test]

desc "Continuation watching build"
task :watch do
  at_exit {
    loop do
      system('rake', '--silent')
      sleep 5
    end
  }
end

task :compile do
  p 'compile...'
  files = search()
  code = compile(files)
  filename = "#{OUTPUT}/#{PACKAGE_NAME}.js"
  write filename, code
end

task :minimize do
  code_min = minimize filename
  filename_min = "#{OUTPUT}/#{PACKAGE_NAME}.min.js"
  write filename_min, code_min
end

task :test do
  #result = system("nodeunit test")
end


def search
  files = Array.new
  Find.find('src') do |path|
    if File.file?(path)
      case File.extname(path)
        when '.js'
          f = open(path)
          code = f.read()
          f.close()
        #when '.coffee'
        #  out = IO.popen("coffee -p \"#{path}\"", "r+")
        #  code = out.readlines()
        else
          next
      end

      packages = File.dirname(path).split('/')
      packages.shift()

      class_name = File.basename(path, File.extname(path))

      files.push(
        'packages' => packages,
        'class_name' => class_name,
        'code' => code
      )
    end
  end
  files
end

def compile(files)
  packages_list = []
  files.each do |file|
    unless packages_list.include?(file['packages'])
      packages_list.push(file['packages'])
    end
  end
  object = {}
  packages_list.each do |packages|
    obj = object
    packages.each do |package|
      obj[package] = obj = {}
    end
  end
  package_object = JSON.generate(object)

  implement = ''
  files.each do |file|
    class_name = file['class_name']
    packages = file['packages']
    file['package'] = packages.join('.')
    file['full_name'] = "#{file['package']}.#{class_name}"
    indented_lines = []
    lines = file['code'].split("\n")
    lines.each do |line|
      indented_lines.push "    #{line}"
    end
    code = indented_lines.join("\n")
    implement += <<-EOS
  __declarations.#{file['full_name']} = function (module, exports) {
#{code}
  };

EOS
  end

  copyright(VERSION) + prefix(package_object) + implement + postfix()
end

def minimize(filename)
  begin
    IO.popen("uglifyjs2 #{filename} --comments") do |io|
      code = ''
      while (line = io.gets)
        code += line
      end
      code
    end
  rescue
    nil
  end
end

def write(filename, content)
  open("#{filename}", 'w') do |f|
    f.write content
  end
end