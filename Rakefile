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
COPYRIGHT = <<-EOS
/**
 * @fileOverview
 * @name muon.js
 * @author Daisuke Mino daisuke.mino@gmail.com
 * @url https://github.com/minodisk/muon
 * @version #{VERSION}
 * @license MIT License
 */
EOS
PREFIX = <<-EOS
;(function () {
  'use strict';

EOS
POSTFIX = <<-EOS
  var tmp = this.#{PACKAGE_NAME};
  #{PACKAGE_NAME}.conflict = function () {
    return tmp;
  };
  this.#{PACKAGE_NAME} = #{PACKAGE_NAME};

}).call(this);
EOS


filename = nil

task :default => [:compile, :minimize, :test]

task :compile do
  files = search()
  code = compile(files)
  filename = "#{OUTPUT}/#{PACKAGE_NAME}.js"
  write filename, code
end

task :minimize do
  codeMin = minimize filename
  filenameMin = "#{OUTPUT}/#{PACKAGE_NAME}.min.js"
  write filenameMin, codeMin
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

      className = File.basename(path, File.extname(path))

      files.push(
        'packages' => packages,
        'className' => className,
        'code' => code
      )
    end
  end
  files
end

def compile(files)
  declarations = ["#{PACKAGE_NAME} = {}"]
  packagesList = []
  files.each do |file|
    unless packagesList.include?(file['packages'])
      packagesList.push(file['packages'])
    end
  end
  object = {}
  packagesList.each do |packages|
    obj = object
    packages.each do |package|
      obj[package] = obj = {}
    end
  end
  declaration = <<-EOS
  var #{PACKAGE_NAME} = #{JSON.generate(object)};

EOS

  implement = ''
  files.each do |file|
    className = file['className']
    packages = file['packages']
    code = file['code']

    requires = code.scan(/\/\/\s*import\s+([\w\.]+)/).flatten()
    file['package'] = "#{PACKAGE_NAME}.#{packages.join('.')}"
    file['fullName'] = "#{file['package']}.#{className}"
    file['requires'] = requires
  end

  files.sort! do |a, b|
    aDepB = a['requires'].include?(b['fullName'])
    bDepA = b['requires'].include?(a['fullName'])
    if aDepB and bDepA
      raise 'circular dependencies'
    end

    if aDepB
      1
    elsif bDepA
      -1
    else
      0
    end
  end

  files.each do |file|
    indentedCode = ''
    lines = file['code'].split("\n")
    lines.each do |line|
      indentedCode += <<-EOS
    #{line}
EOS
    end

    fullName = file['fullName'];
    requires = file['requires'];
    puts "#{fullName} <- #{requires}"
    names = []
    requires.each do |import|
      names.push(import.split('.').pop())
    end
    arguments = [file['package']].concat(requires)
    implement += <<-EOS
  (function (#{names.join(', ')}) {
#{indentedCode}
  }).call(#{arguments.join(', ')});

EOS
  end

  COPYRIGHT + PREFIX + declaration + implement + POSTFIX
end

#def getVersion
#  begin
#    IO.popen('git tag') do |io|
#      tags = []
#      while (tag = io.gets)
#        tags.push(tag)
#      end
#      if tags.empty?
#        nil
#      else
#        tag = tags.pop()
#        versions = tag.scan(/([\d\.]+)/).flatten()
#        versions.shift()
#      end
#    end
#  rescue
#    nil
#  end
#end

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