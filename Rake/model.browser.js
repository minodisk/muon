;(function () {
  'use strict';

  var muon = {};
  muon.name = {};
  muon.name.space = {};

  var __slice = [].slice;
  var __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  };
  var __hasProp = {}.hasOwnProperty;
  var __extends = function (child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) {
        child[key] = parent[key];
      }
    }
    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  var __bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };

  (function () {
    var Foo = {
      bar: function () {
        new Fuga().fuga();
      }
    };
    this.Foo = Foo;
  }).call(muon.name.space);

  (function () {
    function Fuga() {
      this.a = 1;
    }

    Fuga.prototype.fuga = function () {
    };
    this.Fuga = Fuga;
  }).call(muon.name.space);

  (function (Fuga) {
    //import muon.name.space.Fuga;
    __extends(Hoge, Fuga);
    function Hoge() {
    }

    this.Hoge = Hoge;
  }).call(muon.name.space, muon.name.space.Fuga);

  if (oldMuon) {
    var oldMuon = this.muon;
  }
  muon.getOldMuon = function () {
    return oldMuon;
  };
  this.muon = muon;

}).call(this);
