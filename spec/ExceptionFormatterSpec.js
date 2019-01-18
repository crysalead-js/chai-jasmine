describe("ExceptionFormatter", function() {
  describe("#message", function() {
    it('formats Firefox exception messages', function() {
      var sampleFirefoxException = {
          fileName: 'foo.js',
          lineNumber: '1978',
          message: 'you got your foo in my bar',
          name: 'A Classic Mistake'
        },
        exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(sampleFirefoxException);

      expect(message).toEqual('A Classic Mistake: you got your foo in my bar in foo.js (line 1978)');
    });

    it('formats Webkit exception messages', function() {
      var sampleWebkitException = {
          sourceURL: 'foo.js',
          line: '1978',
          message: 'you got your foo in my bar',
          name: 'A Classic Mistake'
        },
        exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(sampleWebkitException);

      expect(message).toEqual('A Classic Mistake: you got your foo in my bar in foo.js (line 1978)');
    });

    it('formats V8 exception messages', function() {
      var sampleV8 = {
          message: 'you got your foo in my bar',
          name: 'A Classic Mistake'
        },
        exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(sampleV8);

      expect(message).toEqual('A Classic Mistake: you got your foo in my bar');
    });

    it('formats unnamed exceptions with message', function() {
      var unnamedError = {message: 'This is an unnamed error message.'};

      var exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
          message = exceptionFormatter.message(unnamedError);

      expect(message).toEqual('This is an unnamed error message.');
    });

    it('formats empty exceptions with toString format', function() {
      var EmptyError = function() {};
      EmptyError.prototype.toString = function() {
        return '[EmptyError]';
      };
      var emptyError = new EmptyError();

      var exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
          message = exceptionFormatter.message(emptyError);

      expect(message).toEqual('[EmptyError] thrown');
    });

    it("formats thrown exceptions that aren't errors", function() {
      var thrown = "crazy error",
          exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
          message = exceptionFormatter.message(thrown);

      expect(message).toEqual("crazy error thrown");
    });
  });

  describe("#stack", function() {
    it("formats stack traces", function() {
      var error;
      try { throw new Error("an error") } catch(e) { error = e; }

      expect(new jasmineUnderTest.ExceptionFormatter().stack(error)).toMatch(/ExceptionFormatterSpec\.js.*\d+/)
    });

    it("filters Jasmine stack frames from V8 style traces", function() {
      var error = {
        message: 'nope',
        stack: 'Error: nope\n' +
          '    at fn1 (http://localhost:8888/__spec__/core/UtilSpec.js:115:19)\n' +
          '    at fn2 (http://localhost:8888/__jasmine__/jasmine.js:4320:20)\n' +
          '    at fn3 (http://localhost:8888/__jasmine__/jasmine.js:4320:20)\n' +
          '    at fn4 (http://localhost:8888/__spec__/core/UtilSpec.js:110:19)\n'
      };
      var subject = new jasmineUnderTest.ExceptionFormatter({
        jasmineFile: 'http://localhost:8888/__jasmine__/jasmine.js'
      });
      var result = subject.stack(error);
      expect(result).toEqual('Error: nope\n' +
          '    at fn1 (http://localhost:8888/__spec__/core/UtilSpec.js:115:19)\n' +
          '    at <Jasmine>\n' +
          '    at fn4 (http://localhost:8888/__spec__/core/UtilSpec.js:110:19)'
      );
    });

    it("filters Jamine stack frames from Webkit style traces", function() {
      var error = {
        stack: 'http://localhost:8888/__spec__/core/UtilSpec.js:115:28\n' +
          'fn1@http://localhost:8888/__jasmine__/jasmine.js:4320:27\n' +
          'fn2@http://localhost:8888/__jasmine__/jasmine.js:4320:27\n' +
          'http://localhost:8888/__spec__/core/UtilSpec.js:115:28'
      };
      var subject = new jasmineUnderTest.ExceptionFormatter({
        jasmineFile: 'http://localhost:8888/__jasmine__/jasmine.js'
      });
      var result = subject.stack(error);
      expect(result).toEqual(
        'http://localhost:8888/__spec__/core/UtilSpec.js:115:28\n' +
          '<Jasmine>\n' +
          'http://localhost:8888/__spec__/core/UtilSpec.js:115:28'
      );
    });

    it("returns null if no Error provided", function() {
      expect(new jasmineUnderTest.ExceptionFormatter().stack()).toBeNull();
    });

    it("includes error properties in stack", function() {
      var error;
      try { throw new Error("an error") } catch(e) { error = e; }
      error.someProperty = 'hello there';

      var result = new jasmineUnderTest.ExceptionFormatter().stack(error);

      expect(result).toMatch(/error properties:.*someProperty.*hello there/);
    });

  });
});
