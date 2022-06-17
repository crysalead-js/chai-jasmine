describe('base helpers', function() {
  describe('isError_', function() {
    it('correctly handles WebSocket events', function(done) {
      if (typeof jasmine.getGlobal().WebSocket === 'undefined') {
        done();
        return;
      }

      const obj = (function() {
        const sock = new WebSocket('ws://localhost');
        let event;
        sock.onerror = function(e) {
          event = e;
        };
        return function() {
          return event;
        };
      })();
      let left = 20;

      const int = setInterval(function() {
        if (obj() || left === 0) {
          const result = jasmineUnderTest.isError_(obj());
          expect(result).toBe(false);
          clearInterval(int);
          done();
        } else {
          left--;
        }
      }, 100);
    });

    it('returns true for an Error subclass', function() {
      function MyError() {}
      MyError.prototype = new Error();
      expect(jasmineUnderTest.isError_(new MyError())).toBe(true);
    });

    it('returns true for an un-thrown Error with no message in this environment', function() {
      expect(jasmineUnderTest.isError_(new Error())).toBe(true);
    });

    it('returns false for a falsy value', function() {
      expect(jasmineUnderTest.isError_(undefined)).toBe(false);
    });

    it('returns false for a non-Error object', function() {
      expect(jasmineUnderTest.isError_({})).toBe(false);
    });
  });

  describe('isAsymmetricEqualityTester_', function() {
    it('returns false when the argument is falsy', function() {
      expect(jasmineUnderTest.isAsymmetricEqualityTester_(null)).toBe(false);
    });

    it('returns false when the argument does not have a asymmetricMatch property', function() {
      const obj = {};
      expect(jasmineUnderTest.isAsymmetricEqualityTester_(obj)).toBe(false);
    });

    it("returns false when the argument's asymmetricMatch is not a function", function() {
      const obj = { asymmetricMatch: 'yes' };
      expect(jasmineUnderTest.isAsymmetricEqualityTester_(obj)).toBe(false);
    });

    it("returns true when the argument's asymmetricMatch is a function", function() {
      const obj = { asymmetricMatch: function() {} };
      expect(jasmineUnderTest.isAsymmetricEqualityTester_(obj)).toBe(true);
    });
  });

  describe('isSet', function() {
    it('returns true when the object is a Set', function() {
      expect(jasmineUnderTest.isSet(new Set())).toBe(true);
    });

    it('returns false when the object is not a Set', function() {
      expect(jasmineUnderTest.isSet({})).toBe(false);
    });
  });

  describe('isURL', function() {
    it('returns true when the object is a URL', function() {
      expect(jasmineUnderTest.isURL(new URL('http://localhost/'))).toBe(true);
    });

    it('returns false when the object is not a URL', function() {
      expect(jasmineUnderTest.isURL({})).toBe(false);
    });
  });

  describe('isIterable_', function() {
    it('returns true when the object is an Array', function() {
      expect(jasmineUnderTest.isIterable_([])).toBe(true);
    });

    it('returns true when the object is a Set', function() {
      expect(jasmineUnderTest.isIterable_(new Set())).toBe(true);
    });
    it('returns true when the object is a Map', function() {
      expect(jasmineUnderTest.isIterable_(new Map())).toBe(true);
    });

    it('returns true when the object implements @@iterator', function() {
      const myIterable = { [Symbol.iterator]: function() {} };
      expect(jasmineUnderTest.isIterable_(myIterable)).toBe(true);
    });

    it('returns false when the object does not implement @@iterator', function() {
      expect(jasmineUnderTest.isIterable_({})).toBe(false);
    });
  });

  describe('DEFAULT_TIMEOUT_INTERVAL setter', function() {
    const max = 2147483647;

    beforeEach(function() {
      this.initialValue = jasmineUnderTest.DEFAULT_TIMEOUT_INTERVAL;
    });

    afterEach(function() {
      jasmineUnderTest.DEFAULT_TIMEOUT_INTERVAL = this.initialValue;
    });

    it('accepts only values <= ' + max, function() {
      expect(function() {
        jasmineUnderTest.DEFAULT_TIMEOUT_INTERVAL = max + 1;
      }).toThrowError(
        'jasmine.DEFAULT_TIMEOUT_INTERVAL cannot be greater than ' + max
      );

      jasmineUnderTest.DEFAULT_TIMEOUT_INTERVAL = max;
      expect(jasmineUnderTest.DEFAULT_TIMEOUT_INTERVAL).toEqual(max);
    });

    it('is consistent with setTimeout in this environment', function(done) {
      const f1 = jasmine.createSpy('setTimeout callback for ' + max),
        f2 = jasmine.createSpy('setTimeout callback for ' + (max + 1));

      // Suppress printing of TimeoutOverflowWarning in node
      spyOn(console, 'error');

      let id = setTimeout(f1, max);
      setTimeout(function() {
        clearTimeout(id);
        expect(f1).not.toHaveBeenCalled();

        id = setTimeout(f2, max + 1);
        setTimeout(function() {
          clearTimeout(id);
          expect(f2).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('debugLog', function() {
    it("forwards to the current env's debugLog function", function() {
      spyOn(jasmineUnderTest.getEnv(), 'debugLog');
      jasmineUnderTest.debugLog('a message');
      expect(jasmineUnderTest.getEnv().debugLog).toHaveBeenCalledWith(
        'a message'
      );
    });
  });
});
