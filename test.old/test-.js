var req = require('../lib/muon').require
  , module = req('module')
  , extend = module.extend
  , mix = module.mix
  , bind = module.bind;

this['extend'] = {

  'classical inheritance': function (test) {
    function Parent(name) {
      this.name = name || 'Adam';
    }

    Parent.prototype.say = function () {
      return this.name;
    };
    Parent.prototype.shout = function () {
      return this.name + '!';
    };

    extend(Parent, Child);
    function Child(name) {
      this.name = name;
    }

    Child.prototype.shout = function () {
      return Child.__super__.shout.apply(this, arguments) + '?';
    };

    var dad = new Parent();
    var kid = new Child();

    test.notStrictEqual(kid.name, 'Adam', 'should not inherit property');
    test.notStrictEqual(kid.say(), 'Adam', 'should not inherit property');
    test.strictEqual(kid.constructor.name, 'Child', 'constructor name');
    test.notStrictEqual(kid.constructor, Parent, 'constructor');
    test.strictEqual(kid.constructor, Child, 'constructor');

    var s = new Child('Seth');
    test.strictEqual(s.name, 'Seth');
    test.strictEqual(s.say(), 'Seth');
    test.strictEqual(dad.shout(), 'Adam!', 'parent method');
    test.strictEqual(s.shout(), 'Seth!?', 'child override parent method');

    test.done();
  },

  'modern inheritance': function (test) {
    var dad = {
      name  : 'Papa',
      counts: [1, 2, 3],
      reads : {paper: true}
    };
    var kid = extend(dad);
    kid.counts.push(4);

    test.strictEqual(kid.name, 'Papa', 'inherit name');
    test.deepEqual(dad.counts, [1, 2, 3], 'inherit counts');
    test.deepEqual(kid.counts, [1, 2, 3, 4], 'inherit counts and pushed value');
    test.notStrictEqual(dad.reads, kid.reads, 'should copy deeply');
    test.done();
  }

};


this['mix'] = function (test) {
  var cream = {milk: 1, sugar: true};
  var cake = mix(
    {eggs: 2, large: true},
    {butter: 1, salted: true},
    {flour: '3 cups'},
    {sugar: 'sure!'},
    {cream: cream}
  );
  test.deepEqual(cake, {
    eggs  : 2,
    large : true,
    butter: 1,
    salted: true,
    flour : '3 cups',
    sugar : 'sure!',
    cream : {milk: 1, sugar: true}
  });
  test.notStrictEqual(cake.cream, cream);
  test.done();
};


this['bind'] = function (test) {
  var one = {
    name: 'object',
    say : function (greet) {
      return greet + ', ' + this.name;
    }
  };
  var two = {
    name: 'another object'
  };

  test.strictEqual(one.say('hi'), 'hi, object');
  test.strictEqual(one.say.apply(two, ['hello']), 'hello, another object');

  var say = one.say;
  test.strictEqual(say('hoho'), 'hoho, undefined');

  var yetanother = {
    name: 'Yet another object',
    method: function (callback) {
      return callback('Holla');
    }
  };
  test.strictEqual(yetanother.method(one.say), 'Holla, undefined');

  var twosay = bind(one.say, two);
  test.strictEqual(twosay('yo'), 'yo, another object');

  test.done();
};
