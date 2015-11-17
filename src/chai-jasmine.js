module.exports = function (chai, _) {
  var Assertion = chai.Assertion
    , flag = _.flag;

  // Overrides Spies so it won't rely on Jasmine's env
  var spies = [];
  var spyRegistry = new jasmine.SpyRegistry({
    currentSpies: function() {
      return spies;
    }
  });
  jasmine.getEnv().spyOn = function() {
    return spyRegistry.spyOn.apply(spyRegistry, arguments);
  };

  // Setup aliases
  fdescribe = describe.only;
  fcontext = context.only;
  fit = it.only;
  xdescribe = describe.skip;
  xcontext = context.skip;
  xit = it.skip;

  // Setup some additional globals
  expect = chai.expect;
  spyOn = spyRegistry.spyOn;

  afterEach(function() {
    spyRegistry.clearSpies();
  });

  Assertion.addMethod("toBe", function (expected) {
    this.equal(expected);
  });

  Assertion.addMethod("toBeCloseTo", function (expected, precision) {
    precision = precision !== undefined ? precision : 2;
    var delta = (Math.pow(10, -precision) / 2);
    this.assert(
        Math.abs(expected - this._obj) < delta
      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
    );
  });

  Assertion.addMethod("toBeFalsy", function () {
    this.assert(
        !flag(this, 'object')
      , 'expected #{this} to be truthy'
      , 'expected #{this} to be falsy');
  });

  Assertion.addMethod("toBeGreaterThan", function (expected, msg) {
    this.greaterThan(expected, msg);
  });

  Assertion.addMethod("toBeLessThan", function (expected, msg) {
    this.lessThan(expected, msg);
  });

  Assertion.addMethod("toBeNull", function () {
    this.null;
  });

  Assertion.addMethod("toBeTruthy", function () {
    this.ok;
  });

  Assertion.addMethod("toBeDefined", function () {
    this.defined;
  });

  Assertion.addMethod("toBeUndefined", function () {
    this.undefined;
  });

  Assertion.addMethod("toBeNaN", function () {
    this.NaN;
  });

  Assertion.addMethod("toContain", function (expected, msg) {
    if (Array.isArray(expected)) {
      this.contain.all(expected, msg);
    } else {
      this.contain(expected, msg);
    }
  });

  Assertion.addMethod("toEqual", function (expected, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        jasmine.matchersUtil.equals(obj, expected)
      , 'expected #{this} to equal #{exp}'
      , 'expected #{this} to not equal #{exp}'
      , expected && expected.jasmineToString ? expected.jasmineToString() : expected
      , obj
      , true
    );
  });

  Assertion.addMethod("toMatch", function (expected, msg) {
    this.match(new RegExp(expected), msg);
  });

  Assertion.addMethod("toThrow", function (msg) {
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('function');

    var thrown;

    try {
      obj();
    } catch (err) {
      thrown = err;
    }

    this.assert(
        thrown !== undefined
      , 'expected #{this} to throw an error'
      , 'expected #{this} to not throw an error'
    );
  });

  Assertion.addMethod("toThrowError", function (constructor, errMsg, msg) {

    function stringify (expected) {
      if (expected.e) {
        return expected.e.message ? expected.e.toString() : expected.e.name;
      }
      if (expected.type) {
        var constructor = expected.type;
        return new constructor().name;
      }
    }

    function similarException (expected, thrown) {
      var exception = expected.e;
      if (exception && exception.constructor === thrown.constructor) {
        return exception.name === thrown.name;
      }
      return !expected.type || thrown instanceof expected.type;
    }

    function similarMessage (expected, thrown) {
      var isThrownedException = typeof thrown === 'object' && thrown.hasOwnProperty('message');
      var message = isThrownedException ? thrown.message : '' + thrown;
      if (expected.errMsg instanceof RegExp) {
        return expected.errMsg.test(message);
      }
      if (!expected.errMsg) {
        return true;
      }
      if (expected.action === 'matching') {
        return message === expected.errMsg;
      }
      return !!~message.indexOf(expected.errMsg);
    }

    function parseParams (constructor, errMsg) {
      var expected = { placeholder: 'an error', action: 'matching' };
      if (!arguments.length || !constructor) {
        return expected;
      }
      if (constructor instanceof RegExp) {
        expected.errMsg = constructor;
        return expected;
      }
      if (typeof constructor === 'string') {
        expected.errMsg = constructor;
        expected.action = 'including';
        return expected;
      }
      if (constructor instanceof Error) {
        expected.e = constructor;
        expected.type = constructor.constructor;
        expected.errMsg = constructor.message;
      } else {
        expected.type = constructor;
        expected.errMsg = errMsg;
        if (typeof errMsg === 'string') {
          expected.action = 'including';
        }
      }
      expected.placeholder = '#{exp}';
      return expected;
    }

    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('function');

    var thrown;
    var expected = parseParams.apply(null, arguments);

    try {
      obj();
    } catch (err) {
      thrown = err;
    }

    if (thrown === undefined) {
      this.assert(
          false
        , 'expected #{this} to throw ' + expected.placeholder
        , 'expected #{this} to not throw ' + expected.placeholder
        , stringify(expected)
      );
      return this;
    }

    var similarException = similarException(expected, thrown);
    var similarMessage = similarMessage(expected, thrown);

    if (!similarException || !expected.errMsg) {
      this.assert(
          similarException && similarMessage
        , 'expected #{this} to throw ' + expected.placeholder + ' but #{act} was thrown'
        , 'expected #{this} to not throw ' + expected.placeholder + ' but #{act} was thrown'
        , stringify(expected)
        , (thrown instanceof Error ? thrown.toString() : thrown)
      );
    } else {
      this.assert(
          similarException && similarMessage
        , 'expected #{this} to throw error ' + expected.action + ' #{exp} but got #{act}'
        , 'expected #{this} to not throw error ' + expected.action + ' #{exp}'
        , expected.errMsg
        , (thrown instanceof Error ? thrown.message : thrown)
      );
    }
    flag(this, 'object', thrown);
    return this;
  });

  Assertion.addMethod("toHaveBeenCalled", function () {
    var obj = flag(this, 'object');

    if (!jasmine.isSpy(obj)) {
      throw new Error('Expected a spy, but got something else.');
    }

    if (arguments.length > 1) {
      throw new Error('toHaveBeenCalled does not take arguments, use toHaveBeenCalledWith');
    }

    this.assert(
        obj.calls.any()
      , 'expected spy #{this} to have been called.'
      , 'expected spy #{this} to not throw have been called.'
    );

    return this;
  });

  Assertion.addMethod("toHaveBeenCalledTimes", function (expected) {
    var obj = flag(this, 'object');

    if (!jasmine.isSpy(obj)) {
      throw new Error('Expected a spy, but got something else.');
    }

    if (arguments.length > 1) {
      throw new Error('toHaveBeenCalled does not take arguments, use toHaveBeenCalledWith');
    }

    var count = obj.calls.count();
    var timesMessage = expected === 1 ? 'once' : expected + ' times';

    this.assert(
        count === expected
      , 'expected spy #{this} to have been called ' + timesMessage + '. It was called ' + count + ' times.'
      , 'expected spy #{this} to not throw have been called ' + timesMessage + '.'
    );

    return this;
  });

  Assertion.addMethod("toHaveBeenCalledWith", function (expected) {
    var obj = flag(this, 'object');
    var expectedArgs = Array.prototype.slice.call(arguments, 0);

    if (!jasmine.isSpy(obj)) {
      throw new Error('Expected a spy, but got something else.');
    }

    var expected = [];
    var len = expectedArgs.length;
    for (var i = 0; i < len; i++) {
      expected.push(expectedArgs[i] && expectedArgs[i].jasmineToString ? expectedArgs[i].jasmineToString() : expectedArgs[i]);
    }

    if (!obj.calls.any()) {
      this.assert(
          false
        , 'expected spy #{this} to have been called with #{exp} but it was never called.'
        , 'expected spy #{this} to not have been called with #{exp} but it was called.'
        , expected
      );
      return this;
    }

    this.assert(
        jasmine.matchersUtil.contains(obj.calls.allArgs(), expectedArgs)
      , 'expected spy #{this} to have been called with #{exp} but actual calls were #{act}.'
      , 'expected spy #{this} to not have been called with #{exp} but it was.'
      , expected
      , obj.calls.allArgs()
    );
    return this;
  });
};
