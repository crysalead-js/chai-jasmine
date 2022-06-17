describe('ExceptionFormatter', function() {
  describe('#message', function() {
    it('formats Firefox exception messages', function() {
      const sampleFirefoxException = {
          fileName: 'foo.js',
          lineNumber: '1978',
          message: 'you got your foo in my bar',
          name: 'A Classic Mistake'
        },
        exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(sampleFirefoxException);

      expect(message).toEqual(
        'A Classic Mistake: you got your foo in my bar in foo.js (line 1978)'
      );
    });

    it('formats Webkit exception messages', function() {
      const sampleWebkitException = {
          sourceURL: 'foo.js',
          line: '1978',
          message: 'you got your foo in my bar',
          name: 'A Classic Mistake'
        },
        exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(sampleWebkitException);

      expect(message).toEqual(
        'A Classic Mistake: you got your foo in my bar in foo.js (line 1978)'
      );
    });

    it('formats V8 exception messages', function() {
      const sampleV8 = {
          message: 'you got your foo in my bar',
          name: 'A Classic Mistake'
        },
        exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(sampleV8);

      expect(message).toEqual('A Classic Mistake: you got your foo in my bar');
    });

    it('formats unnamed exceptions with message', function() {
      const unnamedError = { message: 'This is an unnamed error message.' };

      const exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(unnamedError);

      expect(message).toEqual('This is an unnamed error message.');
    });

    it('formats empty exceptions with toString format', function() {
      const EmptyError = function() {};
      EmptyError.prototype.toString = function() {
        return '[EmptyError]';
      };
      const emptyError = new EmptyError();

      const exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(emptyError);

      expect(message).toEqual('[EmptyError] thrown');
    });

    it("formats thrown exceptions that aren't errors", function() {
      const thrown = 'crazy error',
        exceptionFormatter = new jasmineUnderTest.ExceptionFormatter(),
        message = exceptionFormatter.message(thrown);

      expect(message).toEqual('crazy error thrown');
    });
  });

  describe('#stack', function() {
    it('formats stack traces', function() {
      const error = new Error('an error');

      expect(new jasmineUnderTest.ExceptionFormatter().stack(error)).toMatch(
        /ExceptionFormatterSpec\.js.*\d+/
      );
    });

    it('filters Jasmine stack frames from V8-style traces but leaves unmatched lines intact', function() {
      const error = {
        message: 'nope',
        stack:
          'C:\\__spec__\\core\\UtilSpec.ts:120\n' +
          "                new Error('nope');\n" +
          '                ^\n' +
          '\n' +
          'Error: nope\n' +
          '    at fn1 (C:\\__spec__\\core\\UtilSpec.js:115:19)\n' +
          '        -> C:\\__spec__\\core\\UtilSpec.ts:120:15\n' +
          '    at fn2 (C:\\__jasmine__\\lib\\jasmine-core\\jasmine.js:7533:40)\n' +
          '    at fn3 (C:\\__jasmine__\\lib\\jasmine-core\\jasmine.js:7575:25)\n' +
          '    at fn4 (node:internal/timers:462:21)\n'
      };
      const subject = new jasmineUnderTest.ExceptionFormatter({
        jasmineFile: 'C:\\__jasmine__\\lib\\jasmine-core\\jasmine.js'
      });
      const result = subject.stack(error);
      expect(result).toEqual(
        'C:\\__spec__\\core\\UtilSpec.ts:120\n' +
          "                new Error('nope');\n" +
          '                ^\n' +
          'Error: nope\n' +
          '    at fn1 (C:\\__spec__\\core\\UtilSpec.js:115:19)\n' +
          '        -> C:\\__spec__\\core\\UtilSpec.ts:120:15\n' +
          '    at <Jasmine>\n' +
          '    at fn4 (node:internal/timers:462:21)'
      );
    });

    it('filters Jasmine stack frames from V8 style traces', function() {
      const error = {
        message: 'nope',
        stack:
          'Error: nope\n' +
          '    at fn1 (http://localhost:8888/__spec__/core/UtilSpec.js:115:19)\n' +
          '    at fn2 (http://localhost:8888/__jasmine__/jasmine.js:4320:20)\n' +
          '    at fn3 (http://localhost:8888/__jasmine__/jasmine.js:4320:20)\n' +
          '    at fn4 (http://localhost:8888/__spec__/core/UtilSpec.js:110:19)\n'
      };
      const subject = new jasmineUnderTest.ExceptionFormatter({
        jasmineFile: 'http://localhost:8888/__jasmine__/jasmine.js'
      });
      const result = subject.stack(error);
      expect(result).toEqual(
        'Error: nope\n' +
          '    at fn1 (http://localhost:8888/__spec__/core/UtilSpec.js:115:19)\n' +
          '    at <Jasmine>\n' +
          '    at fn4 (http://localhost:8888/__spec__/core/UtilSpec.js:110:19)'
      );
    });

    it('filters Jasmine stack frames from Webkit style traces', function() {
      const error = {
        stack:
          'http://localhost:8888/__spec__/core/UtilSpec.js:115:28\n' +
          'fn1@http://localhost:8888/__jasmine__/jasmine.js:4320:27\n' +
          'fn2@http://localhost:8888/__jasmine__/jasmine.js:4320:27\n' +
          'http://localhost:8888/__spec__/core/UtilSpec.js:115:28'
      };
      const subject = new jasmineUnderTest.ExceptionFormatter({
        jasmineFile: 'http://localhost:8888/__jasmine__/jasmine.js'
      });
      const result = subject.stack(error);
      expect(result).toEqual(
        'http://localhost:8888/__spec__/core/UtilSpec.js:115:28\n' +
          '<Jasmine>\n' +
          'http://localhost:8888/__spec__/core/UtilSpec.js:115:28'
      );
    });

    it('returns null if no Error provided', function() {
      expect(new jasmineUnderTest.ExceptionFormatter().stack()).toBeNull();
    });

    it('includes error properties in stack', function() {
      const error = new Error('an error');
      error.someProperty = 'hello there';

      const result = new jasmineUnderTest.ExceptionFormatter().stack(error);

      expect(result).toMatch(/error properties:.*someProperty.*hello there/);
    });

    describe('When omitMessage is true', function() {
      it('filters the message from V8-style stack traces', function() {
        const error = {
          message: 'nope',
          stack:
            'Error: nope\n' +
            '    at fn1 (http://localhost:8888/__spec__/core/UtilSpec.js:115:19)\n' +
            '    at fn2 (http://localhost:8888/__jasmine__/jasmine.js:4320:20)\n' +
            '    at fn3 (http://localhost:8888/__jasmine__/jasmine.js:4320:20)\n' +
            '    at fn4 (http://localhost:8888/__spec__/core/UtilSpec.js:110:19)\n'
        };
        const subject = new jasmineUnderTest.ExceptionFormatter({
          jasmineFile: 'http://localhost:8888/__jasmine__/jasmine.js'
        });
        const result = subject.stack(error, { omitMessage: true });
        expect(result).toEqual(
          '    at fn1 (http://localhost:8888/__spec__/core/UtilSpec.js:115:19)\n' +
            '    at <Jasmine>\n' +
            '    at fn4 (http://localhost:8888/__spec__/core/UtilSpec.js:110:19)'
        );
      });

      it('handles Webkit style traces that do not include a message', function() {
        const error = {
          stack:
            'http://localhost:8888/__spec__/core/UtilSpec.js:115:28\n' +
            'fn1@http://localhost:8888/__jasmine__/jasmine.js:4320:27\n' +
            'fn2@http://localhost:8888/__jasmine__/jasmine.js:4320:27\n' +
            'http://localhost:8888/__spec__/core/UtilSpec.js:115:28'
        };
        const subject = new jasmineUnderTest.ExceptionFormatter({
          jasmineFile: 'http://localhost:8888/__jasmine__/jasmine.js'
        });
        const result = subject.stack(error, { omitMessage: true });
        expect(result).toEqual(
          'http://localhost:8888/__spec__/core/UtilSpec.js:115:28\n' +
            '<Jasmine>\n' +
            'http://localhost:8888/__spec__/core/UtilSpec.js:115:28'
        );
      });

      it('ensures that stack traces do not include the message in this environment', function() {
        const error = new Error('an error');
        const subject = new jasmineUnderTest.ExceptionFormatter({
          jasmineFile: jasmine.util.jasmineFile()
        });
        const result = subject.stack(error, { omitMessage: true });
        expect(result).not.toContain('an error');
      });
    });
  });
});
