/* eslint-disable compat/compat */
describe('toEqual', function() {
  'use strict';

  function compareEquals(actual, expected) {
    const matchersUtil = new jasmineUnderTest.MatchersUtil({
        pp: jasmineUnderTest.makePrettyPrinter()
      }),
      matcher = jasmineUnderTest.matchers.toEqual(matchersUtil);

    const result = matcher.compare(actual, expected);

    return result;
  }

  it('delegates to equals function', function() {
    const matchersUtil = {
        equals: jasmine.createSpy('delegated-equals').and.returnValue(true),
        buildFailureMessage: function() {
          return 'does not matter';
        },
        DiffBuilder: new jasmineUnderTest.DiffBuilder()
      },
      matcher = jasmineUnderTest.matchers.toEqual(matchersUtil);

    const result = matcher.compare(1, 1);

    expect(matchersUtil.equals).toHaveBeenCalledWith(1, 1, jasmine.anything());
    expect(result.pass).toBe(true);
  });

  it('works with custom equality testers', function() {
    const tester = function(a, b) {
        return a.toString() === b.toString();
      },
      matchersUtil = new jasmineUnderTest.MatchersUtil({
        customTesters: [tester]
      }),
      matcher = jasmineUnderTest.matchers.toEqual(matchersUtil);

    const result = matcher.compare(1, '1');

    expect(result.pass).toBe(true);
  });

  it('reports the difference between objects that are not equal', function() {
    const actual = { x: 1, y: 3 },
      expected = { x: 2, y: 3 },
      message = 'Expected $.x = 1 to equal 2.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports differences between enumerable symbol properties', function() {
    const x = Symbol('x'),
      actual = { [x]: 1, y: 3 },
      expected = { [x]: 2, y: 3 },
      message = 'Expected $[Symbol(x)] = 1 to equal 2.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('excludes non-enumerable symbol properties from the comparison', function() {
    const sym = Symbol('foo');
    const actual = {};
    Object.defineProperty(actual, sym, {
      value: '',
      enumerable: false
    });
    const expected = {};

    expect(compareEquals(actual, expected).pass).toBeTrue();
  });

  it('reports the difference between nested objects that are not equal', function() {
    const actual = { x: { y: 1 } },
      expected = { x: { y: 2 } },
      message = 'Expected $.x.y = 1 to equal 2.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("formats property access so that it's valid JavaScript", function() {
    const actual = { 'my prop': 1 },
      expected = { 'my prop': 2 },
      message = "Expected $['my prop'] = 1 to equal 2.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports missing properties', function() {
    const actual = { x: {} },
      expected = { x: { y: 1 } },
      message = 'Expected $.x to have properties\n' + '    y: 1';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports missing symbol properties', function() {
    const actual = { x: {} },
      expected = { x: { [Symbol('y')]: 1 } },
      message = 'Expected $.x to have properties\n' + '    Symbol(y): 1';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports extra symbol properties', function() {
    const actual = { x: { [Symbol('y')]: 1 } },
      expected = { x: {} },
      message = 'Expected $.x not to have properties\n' + '    Symbol(y): 1';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports extra properties', function() {
    const actual = { x: { y: 1, z: 2 } },
      expected = { x: {} },
      message =
        'Expected $.x not to have properties\n' + '    y: 1\n' + '    z: 2';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('pretty-prints properties', function() {
    const actual = { x: { y: 'foo bar' } },
      expected = { x: {} },
      message = 'Expected $.x not to have properties\n' + "    y: 'foo bar'";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('uses custom object formatters to pretty-print simple properties', function() {
    function formatter(x) {
      if (typeof x === 'number') {
        return '|' + x + '|';
      }
    }

    const actual = { x: { y: 1, z: 2, f: 4 } },
      expected = { x: { y: 1, z: 2, g: 3 } },
      pp = jasmineUnderTest.makePrettyPrinter([formatter]),
      matchersUtil = new jasmineUnderTest.MatchersUtil({ pp: pp }),
      matcher = jasmineUnderTest.matchers.toEqual(matchersUtil),
      message =
        'Expected $.x to have properties\n' +
        '    g: |3|\n' +
        'Expected $.x not to have properties\n' +
        '    f: |4|';

    expect(matcher.compare(actual, expected).message).toEqual(message);
  });

  it('uses custom object formatters to show simple values in diffs', function() {
    function formatter(x) {
      if (typeof x === 'number') {
        return '|' + x + '|';
      }
    }

    const actual = [{ foo: 4 }],
      expected = [{ foo: 5 }],
      prettyPrinter = jasmineUnderTest.makePrettyPrinter([formatter]),
      matchersUtil = new jasmineUnderTest.MatchersUtil({ pp: prettyPrinter }),
      matcher = jasmineUnderTest.matchers.toEqual(matchersUtil),
      message = 'Expected $[0].foo = |4| to equal |5|.';

    expect(matcher.compare(actual, expected).message).toEqual(message);
  });

  it('uses custom object formatters to show more complex objects diffs', function() {
    function formatter(x) {
      if (x.hasOwnProperty('a')) {
        return '[thing with a=' + x.a + ', b=' + x.b + ']';
      }
    }

    const actual = [
        {
          foo: { a: 1, b: 2 },
          bar: 'should not be pretty printed'
        }
      ],
      expected = [
        {
          foo: { a: 5, b: 2 },
          bar: "shouldn't be pretty printed"
        }
      ],
      prettyPrinter = jasmineUnderTest.makePrettyPrinter([formatter]),
      matchersUtil = new jasmineUnderTest.MatchersUtil({ pp: prettyPrinter }),
      matcher = jasmineUnderTest.matchers.toEqual(matchersUtil),
      message =
        'Expected $[0].foo = [thing with a=1, b=2] to equal [thing with a=5, b=2].\n' +
        "Expected $[0].bar = 'should not be pretty printed' to equal 'shouldn't be pretty printed'.";

    expect(matcher.compare(actual, expected).message).toEqual(message);
  });

  it('reports extra and missing properties of the root-level object', function() {
    const actual = { x: 1 },
      expected = { a: 1 },
      message =
        'Expected object to have properties\n' +
        '    a: 1\n' +
        'Expected object not to have properties\n' +
        '    x: 1';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports multiple incorrect values', function() {
    const actual = { x: 1, y: 2 },
      expected = { x: 3, y: 4 },
      message =
        'Expected $.x = 1 to equal 3.\n' + 'Expected $.y = 2 to equal 4.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatch between actual child object and expected child number', function() {
    const actual = { x: { y: 2 } },
      expected = { x: 1 },
      message = 'Expected $.x = Object({ y: 2 }) to equal 1.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('uses the default failure message if actual is not an object', function() {
    const actual = 1,
      expected = { x: {} },
      message = 'Expected 1 to equal Object({ x: Object({  }) }).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('uses the default failure message if expected is not an object', function() {
    const actual = { x: {} },
      expected = 1,
      message = 'Expected Object({ x: Object({  }) }) to equal 1.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('uses the default failure message given arrays with different lengths', function() {
    const actual = [1, 2],
      expected = [1, 2, 3],
      message =
        'Expected $.length = 2 to equal 3.\n' +
        'Expected $[2] = undefined to equal 3.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports a mismatch between elements of equal-length arrays', function() {
    const actual = [1, 2, 5],
      expected = [1, 2, 3],
      message = 'Expected $[2] = 5 to equal 3.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports a mismatch between multiple array elements', function() {
    const actual = [2, 2, 5],
      expected = [1, 2, 3],
      message =
        'Expected $[0] = 2 to equal 1.\n' + 'Expected $[2] = 5 to equal 3.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports a mismatch between properties of objects in arrays', function() {
    const actual = [{ x: 1 }],
      expected = [{ x: 2 }],
      message = 'Expected $[0].x = 1 to equal 2.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports a mismatch between arrays in objects', function() {
    const actual = { x: [1] },
      expected = { x: [2] },
      message = 'Expected $.x[0] = 1 to equal 2.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between nested arrays', function() {
    const actual = [[1]],
      expected = [[2]],
      message = 'Expected $[0][0] = 1 to equal 2.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between arrays of different types', function() {
    const actual = new Uint32Array([1, 2, 3]),
      expected = new Uint16Array([1, 2, 3]),
      message =
        'Expected Uint32Array [ 1, 2, 3 ] to equal Uint16Array [ 1, 2, 3 ].';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches involving NaN', function() {
    const actual = { x: 0 },
      expected = { x: 0 / 0 },
      message = 'Expected $.x = 0 to equal NaN.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches involving regular expressions', function() {
    const actual = { x: '1' },
      expected = { x: /1/ },
      message = "Expected $.x = '1' to equal /1/.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches involving infinities', function() {
    const actual = { x: 0 },
      expected = { x: 1 / 0 },
      message = 'Expected $.x = 0 to equal Infinity.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches involving booleans', function() {
    const actual = { x: false },
      expected = { x: true },
      message = 'Expected $.x = false to equal true.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches involving strings', function() {
    const actual = { x: 'foo' },
      expected = { x: 'bar' },
      message = "Expected $.x = 'foo' to equal 'bar'.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches involving undefined', function() {
    const actual = { x: void 0 },
      expected = { x: 0 },
      message = 'Expected $.x = undefined to equal 0.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches involving null', function() {
    const actual = { x: null },
      expected = { x: 0 },
      message = 'Expected $.x = null to equal 0.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between objects with different constructors', function() {
    function Foo() {}
    function Bar() {}

    const actual = { x: new Foo() },
      expected = { x: new Bar() },
      message = 'Expected $.x to be a kind of Bar, but was Foo({  }).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('uses custom object formatters for the value but not the type when reporting objects with different constructors', function() {
    function Foo() {}
    function Bar() {}
    function formatter(x) {
      if (x instanceof Foo || x instanceof Bar) {
        return '|' + x + '|';
      }
    }

    const actual = { x: new Foo() },
      expected = { x: new Bar() },
      message = 'Expected $.x to be a kind of Bar, but was |[object Object]|.',
      pp = jasmineUnderTest.makePrettyPrinter([formatter]),
      matchersUtil = new jasmineUnderTest.MatchersUtil({ pp: pp }),
      matcher = jasmineUnderTest.matchers.toEqual(matchersUtil);

    expect(matcher.compare(actual, expected).message).toEqual(message);
  });

  it('reports type mismatches at the root level', function() {
    function Foo() {}
    function Bar() {}

    const actual = new Foo(),
      expected = new Bar(),
      message = 'Expected object to be a kind of Bar, but was Foo({  }).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports value mismatches at the root level', function() {
    expect(compareEquals(1, 2).message).toEqual('Expected 1 to equal 2.');
  });

  it('reports mismatches between objects with their own constructor property', function() {
    const actual = { x: { constructor: 'blerf' } },
      expected = { x: { constructor: 'ftarrh' } },
      message = "Expected $.x.constructor = 'blerf' to equal 'ftarrh'.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between an object with a real constructor and one with its own constructor property', function() {
    const actual = { x: {} },
      expected = { x: { constructor: 'ftarrh' } },
      message =
        'Expected $.x to have properties\n' + "    constructor: 'ftarrh'";

    expect(compareEquals(actual, expected).message).toEqual(message);
    expect(compareEquals(expected, actual).message).toEqual(
      "Expected $.x not to have properties\n    constructor: 'ftarrh'"
    );
  });

  it('reports mismatches between 0 and -0', function() {
    const actual = { x: 0 },
      expected = { x: -0 },
      message = 'Expected $.x = 0 to equal -0.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between 0 and Number.MIN_VALUE', function() {
    const actual = { x: 0 },
      expected = { x: Number.MIN_VALUE },
      message = 'Expected $.x = 0 to equal 5e-324.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Errors', function() {
    const actual = { x: new Error('the error you got') },
      expected = { x: new Error('the error you want') },
      message =
        'Expected $.x = Error: the error you got to equal Error: the error you want.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Functions', function() {
    const actual = { x: function() {} },
      expected = { x: function() {} },
      message = 'Expected $.x = Function to equal Function.';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between an object and objectContaining', function() {
    const actual = { a: 1, b: 4, c: 3, extra: 'ignored' };
    const expected = jasmineUnderTest.objectContaining({
      a: 1,
      b: 2,
      c: 3,
      d: 4
    });
    expect(compareEquals(actual, expected).message).toEqual(
      'Expected $.b = 4 to equal 2.\n' + 'Expected $.d = undefined to equal 4.'
    );
  });

  it('reports mismatches between a non-object and objectContaining', function() {
    const actual = 1;
    const expected = jasmineUnderTest.objectContaining({ a: 1 });
    expect(compareEquals(actual, expected).message).toEqual(
      "Expected 1 to equal '<jasmine.objectContaining(Object({ a: 1 }))>'."
    );
  });

  it('reports mismatches involving a nested objectContaining', function() {
    const actual = { x: { a: 1, b: 4, c: 3, extra: 'ignored' } };
    const expected = {
      x: jasmineUnderTest.objectContaining({ a: 1, b: 2, c: 3, d: 4 })
    };
    expect(compareEquals(actual, expected).message).toEqual(
      'Expected $.x.b = 4 to equal 2.\n' +
        'Expected $.x.d = undefined to equal 4.'
    );
  });

  // == Sets ==

  it('reports mismatches between Sets', function() {
    const actual = new Set();
    actual.add(1);
    const expected = new Set();
    expected.add(2);
    const message = 'Expected Set( 1 ) to equal Set( 2 ).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports deep mismatches within Sets', function() {
    const actual = new Set();
    actual.add({ x: 1 });
    const expected = new Set();
    expected.add({ x: 2 });
    const message =
      'Expected Set( Object({ x: 1 }) ) to equal Set( Object({ x: 2 }) ).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Sets nested in objects', function() {
    const actualSet = new Set();
    actualSet.add(1);
    const expectedSet = new Set();
    expectedSet.add(2);

    const actual = { sets: [actualSet] };
    const expected = { sets: [expectedSet] };
    const message = 'Expected $.sets[0] = Set( 1 ) to equal Set( 2 ).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Sets of different lengths', function() {
    const actual = new Set();
    actual.add(1);
    actual.add(2);
    const expected = new Set();
    expected.add(2);
    const message = 'Expected Set( 1, 2 ) to equal Set( 2 ).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Sets where actual is missing a value from expected', function() {
    // Use 'duplicate' object in actual so sizes match
    const actual = new Set();
    actual.add({ x: 1 });
    actual.add({ x: 1 });
    const expected = new Set();
    expected.add({ x: 1 });
    expected.add({ x: 2 });
    const message =
      'Expected Set( Object({ x: 1 }), Object({ x: 1 }) ) to equal Set( Object({ x: 1 }), Object({ x: 2 }) ).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Sets where actual has a value missing from expected', function() {
    // Use 'duplicate' object in expected so sizes match
    const actual = new Set();
    actual.add({ x: 1 });
    actual.add({ x: 2 });
    const expected = new Set();
    expected.add({ x: 1 });
    expected.add({ x: 1 });
    const message =
      'Expected Set( Object({ x: 1 }), Object({ x: 2 }) ) to equal Set( Object({ x: 1 }), Object({ x: 1 }) ).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  // == Maps ==

  it('does not report mismatches between deep equal Maps', function() {
    // values are the same but with different object identity
    const actual = new Map();
    actual.set('a', { x: 1 });
    const expected = new Map();
    expected.set('a', { x: 1 });

    expect(compareEquals(actual, expected).pass).toBe(true);
  });

  it('reports deep mismatches within Maps', function() {
    const actual = new Map();
    actual.set('a', { x: 1 });
    const expected = new Map();
    expected.set('a', { x: 2 });
    const message =
      "Expected Map( [ 'a', Object({ x: 1 }) ] ) to equal Map( [ 'a', Object({ x: 2 }) ] ).";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Maps nested in objects', function() {
    const actual = { Maps: [new Map()] };
    actual.Maps[0].set('a', 1);
    const expected = { Maps: [new Map()] };
    expected.Maps[0].set('a', 2);

    const message =
      "Expected $.Maps[0] = Map( [ 'a', 1 ] ) to equal Map( [ 'a', 2 ] ).";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Maps of different lengths', function() {
    const actual = new Map();
    actual.set('a', 1);
    const expected = new Map();
    expected.set('a', 2);
    expected.set('b', 1);
    const message =
      "Expected Map( [ 'a', 1 ] ) to equal Map( [ 'a', 2 ], [ 'b', 1 ] ).";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('reports mismatches between Maps with equal values but differing keys', function() {
    const actual = new Map();
    actual.set('a', 1);
    const expected = new Map();
    expected.set('b', 1);
    const message = "Expected Map( [ 'a', 1 ] ) to equal Map( [ 'b', 1 ] ).";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('does not report mismatches between Maps with keys with same object identity', function() {
    const key = { x: 1 };
    const actual = new Map();
    actual.set(key, 2);
    const expected = new Map();
    expected.set(key, 2);

    expect(compareEquals(actual, expected).pass).toBe(true);
  });

  it('reports mismatches between Maps with identical keys with different object identity', function() {
    const actual = new Map();
    actual.set({ x: 1 }, 2);
    const expected = new Map();
    expected.set({ x: 1 }, 2);
    const message =
      'Expected Map( [ Object({ x: 1 }), 2 ] ) to equal Map( [ Object({ x: 1 }), 2 ] ).';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it('does not report mismatches when comparing Map key to jasmine.anything()', function() {
    const actual = new Map();
    actual.set('a', 1);
    const expected = new Map();
    expected.set(jasmineUnderTest.anything(), 1);

    expect(compareEquals(actual, expected).pass).toBe(true);
  });

  it('does not report mismatches when comparing Maps with the same symbol keys', function() {
    const key = Symbol();
    const actual = new Map();
    actual.set(key, 1);
    const expected = new Map();
    expected.set(key, 1);

    expect(compareEquals(actual, expected).pass).toBe(true);
  });

  it('reports mismatches between Maps with different symbol keys', function() {
    const actual = new Map();
    actual.set(Symbol(), 1);
    const expected = new Map();
    expected.set(Symbol(), 1);
    const message =
      'Expected Map( [ Symbol(), 1 ] ) to equal Map( [ Symbol(), 1 ] ).';

    expect(compareEquals(actual, expected).message).toBe(message);
  });

  it('does not report mismatches when comparing Map symbol key to jasmine.anything()', function() {
    const actual = new Map();
    actual.set(Symbol(), 1);
    const expected = new Map();
    expected.set(jasmineUnderTest.anything(), 1);

    expect(compareEquals(actual, expected).pass).toBe(true);
  });

  describe('Symbols', function() {
    it('Fails if Symbol compared to Object', function() {
      const sym = Symbol('foo');
      const obj = {};

      expect(sym).not.toEqual(obj);
    });

    it('Passes Symbol with itself', function() {
      const sym = Symbol('foo');

      expect(sym).toEqual(sym);
    });

    it('Fails if two Symbols with same value are compared', function() {
      const symA = Symbol('foo');
      const symB = Symbol('foo');

      expect(symA).not.toEqual(symB);
    });

    it('Fails if two Symbols with different value are compared', function() {
      const symA = Symbol('foo');
      const symB = Symbol('bar');

      expect(symA).not.toEqual(symB);
    });

    it('Fails if Symbol compared to NaN', function() {
      const sym = Symbol('foo');

      expect(sym).not.toEqual(NaN);
    });

    it('Fails if Symbol compared to Infinity', function() {
      const sym = Symbol('foo');

      expect(sym).not.toEqual(Infinity);
    });

    it('Fails if Symbol compared to String', function() {
      const sym = Symbol('foo');
      const str = 'foo';

      expect(sym).not.toEqual(str);
    });

    it('Fails if Symbol compared to Number', function() {
      const sym = Symbol('foo');
      const num = Math.random();

      expect(sym).not.toEqual(num);
    });

    it('Fails if Symbol compared to Boolean', function() {
      const sym = Symbol('foo');

      expect(sym).not.toEqual(true);
      expect(sym).not.toEqual(false);
    });

    it('Fails if Symbol compared to Undefined', function() {
      const sym = Symbol('foo');

      expect(sym).not.toEqual(undefined);
    });

    it('Fails if Symbol compared to null', function() {
      const sym = Symbol('foo');

      expect(sym).not.toEqual(null);
    });

    it('Fails if Symbol compared to []', function() {
      const sym = Symbol('foo');
      const arr = ['foo'];

      expect(sym).not.toEqual(arr);
    });

    it('Fails if Symbol compared to Function', function() {
      const sym = Symbol('foo');
      const f = function func() {};

      expect(sym).not.toEqual(f);
    });
  });
});
