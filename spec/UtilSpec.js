describe('util', function() {
  describe('isArray_', function() {
    it('should return true if the argument is an array', function() {
      expect(jasmineUnderTest.isArray_([])).toBe(true);
      expect(jasmineUnderTest.isArray_(['a'])).toBe(true);
    });

    it('should return false if the argument is not an array', function() {
      expect(jasmineUnderTest.isArray_(undefined)).toBe(false);
      expect(jasmineUnderTest.isArray_({})).toBe(false);
      expect(jasmineUnderTest.isArray_(function() {})).toBe(false);
      expect(jasmineUnderTest.isArray_('foo')).toBe(false);
      expect(jasmineUnderTest.isArray_(5)).toBe(false);
      expect(jasmineUnderTest.isArray_(null)).toBe(false);
    });
  });

  describe('isObject_', function() {
    it('should return true if the argument is an object', function() {
      expect(jasmineUnderTest.isObject_({})).toBe(true);
      expect(jasmineUnderTest.isObject_({ an: 'object' })).toBe(true);
    });

    it('should return false if the argument is not an object', function() {
      expect(jasmineUnderTest.isObject_(undefined)).toBe(false);
      expect(jasmineUnderTest.isObject_([])).toBe(false);
      expect(jasmineUnderTest.isObject_(function() {})).toBe(false);
      expect(jasmineUnderTest.isObject_('foo')).toBe(false);
      expect(jasmineUnderTest.isObject_(5)).toBe(false);
      expect(jasmineUnderTest.isObject_(null)).toBe(false);
    });
  });

  describe('promise utils', function() {
    let mockNativePromise, mockPromiseLikeObject;

    const mockPromiseLike = function() {
      this.then = function() {};
    };

    beforeEach(function() {
      mockNativePromise = new Promise(function() {});
      mockPromiseLikeObject = new mockPromiseLike();
    });

    describe('isPromise', function() {
      it('should return true when passed a native promise', function() {
        expect(jasmineUnderTest.isPromise(mockNativePromise)).toBe(true);
      });

      it('should return false for promise like objects', function() {
        expect(jasmineUnderTest.isPromise(mockPromiseLikeObject)).toBe(false);
      });

      it('should return false for strings', function() {
        expect(jasmineUnderTest.isPromise('hello')).toBe(false);
      });

      it('should return false for numbers', function() {
        expect(jasmineUnderTest.isPromise(3)).toBe(false);
      });

      it('should return false for null', function() {
        expect(jasmineUnderTest.isPromise(null)).toBe(false);
      });

      it('should return false for undefined', function() {
        expect(jasmineUnderTest.isPromise(undefined)).toBe(false);
      });

      it('should return false for arrays', function() {
        expect(jasmineUnderTest.isPromise([])).toBe(false);
      });

      it('should return false for objects', function() {
        expect(jasmineUnderTest.isPromise({})).toBe(false);
      });

      it('should return false for boolean values', function() {
        expect(jasmineUnderTest.isPromise(true)).toBe(false);
      });
    });

    describe('isPromiseLike', function() {
      it('should return true when passed a native promise', function() {
        expect(jasmineUnderTest.isPromiseLike(mockNativePromise)).toBe(true);
      });

      it('should return  true for promise like objects', function() {
        expect(jasmineUnderTest.isPromiseLike(mockPromiseLikeObject)).toBe(
          true
        );
      });

      it('should return false if then is not a function', function() {
        expect(
          jasmineUnderTest.isPromiseLike({ then: { its: 'Not a function :O' } })
        ).toBe(false);
      });

      it('should return false for strings', function() {
        expect(jasmineUnderTest.isPromiseLike('hello')).toBe(false);
      });

      it('should return false for numbers', function() {
        expect(jasmineUnderTest.isPromiseLike(3)).toBe(false);
      });

      it('should return false for null', function() {
        expect(jasmineUnderTest.isPromiseLike(null)).toBe(false);
      });

      it('should return false for undefined', function() {
        expect(jasmineUnderTest.isPromiseLike(undefined)).toBe(false);
      });

      it('should return false for arrays', function() {
        expect(jasmineUnderTest.isPromiseLike([])).toBe(false);
      });

      it('should return false for objects', function() {
        expect(jasmineUnderTest.isPromiseLike({})).toBe(false);
      });

      it('should return false for boolean values', function() {
        expect(jasmineUnderTest.isPromiseLike(true)).toBe(false);
      });
    });
  });

  describe('isUndefined', function() {
    it('reports if a variable is defined', function() {
      let a;
      expect(jasmineUnderTest.util.isUndefined(a)).toBe(true);
      expect(jasmineUnderTest.util.isUndefined(undefined)).toBe(true);

      const defined = 'diz be undefined yo';
      expect(jasmineUnderTest.util.isUndefined(defined)).toBe(false);
    });
  });

  describe('cloneArgs', function() {
    it('clones primitives as-is', function() {
      expect(jasmineUnderTest.util.cloneArgs([true, false])).toEqual([
        true,
        false
      ]);
      expect(jasmineUnderTest.util.cloneArgs([0, 1])).toEqual([0, 1]);
      expect(jasmineUnderTest.util.cloneArgs(['str'])).toEqual(['str']);
    });

    it('clones Regexp objects as-is', function() {
      const regex = /match/;
      expect(jasmineUnderTest.util.cloneArgs([regex])).toEqual([regex]);
    });

    it('clones Date objects as-is', function() {
      const date = new Date(2022, 1, 1);
      expect(jasmineUnderTest.util.cloneArgs([date])).toEqual([date]);
    });

    it('clones null and undefined', function() {
      expect(jasmineUnderTest.util.cloneArgs([null])).toEqual([null]);
      expect(jasmineUnderTest.util.cloneArgs([undefined])).toEqual([undefined]);
    });
  });

  describe('getPropertyDescriptor', function() {
    it('get property descriptor from object', function() {
      const obj = { prop: 1 },
        actual = jasmineUnderTest.util.getPropertyDescriptor(obj, 'prop'),
        expected = Object.getOwnPropertyDescriptor(obj, 'prop');

      expect(actual).toEqual(expected);
    });

    it('get property descriptor from object property', function() {
      const proto = { prop: 1 },
        actual = jasmineUnderTest.util.getPropertyDescriptor(proto, 'prop'),
        expected = Object.getOwnPropertyDescriptor(proto, 'prop');

      expect(actual).toEqual(expected);
    });
  });

  describe('jasmineFile', function() {
    it('returns the file containing jasmine.util', function() {
      // Chrome sometimes reports foo.js as foo.js/, so tolerate
      // a trailing slash if present.
      expect(jasmineUnderTest.util.jasmineFile()).toMatch(/jasmine.js\/?$/);
      expect(jasmine.util.jasmineFile()).toMatch(/jasmine.js\/?$/);
    });
  });
});
