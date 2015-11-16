var getJasmineRequireObj = (function (jasmineGlobal) {
  var jasmineRequire;

  if (typeof module !== 'undefined' && module.exports) {
    if (typeof global !== 'undefined') {
      jasmineGlobal = global;
    } else {
      jasmineGlobal = {};
    }
    jasmineRequire = exports;
  } else {
    if (typeof window !== 'undefined' && typeof window.toString === 'function' && window.toString() === '[object GjsGlobal]') {
      jasmineGlobal = window;
    }
    jasmineRequire = jasmineGlobal.jasmineRequire = jasmineGlobal.jasmineRequire || {};
  }

  function getJasmineRequire() {
    return jasmineRequire;
  }

  getJasmineRequire().core = function(jRequire) {
    var j$ = {};

    jRequire.base(j$, jasmineGlobal);
    j$.util = jRequire.util();
    j$.Any = jRequire.Any(j$);
    j$.Anything = jRequire.Anything(j$);
    j$.CallTracker = jRequire.CallTracker();
    j$.MockDate = jRequire.MockDate();
    j$.Clock = jRequire.Clock();
    j$.DelayedFunctionScheduler = jRequire.DelayedFunctionScheduler();
    j$.SpyRegistry = jRequire.SpyRegistry(j$);
    j$.SpyStrategy = jRequire.SpyStrategy();
    j$.Env = jRequire.Env(j$);
    j$.matchersUtil = jRequire.matchersUtil(j$);
    j$.ObjectContaining = jRequire.ObjectContaining(j$);
    j$.ArrayContaining = jRequire.ArrayContaining(j$);
    j$.StringMatching = jRequire.StringMatching(j$);
    j$.pp = jRequire.pp(j$);
    j$.Timer = jRequire.Timer();
    j$.version = '2.3.4';
    j$.Order = jRequire.Order();
    return j$;
  };

  getJasmineRequire().util = function() {

    var util = {};

    util.inherit = function(childClass, parentClass) {
      var Subclass = function() {
      };
      Subclass.prototype = parentClass.prototype;
      childClass.prototype = new Subclass();
    };

    util.htmlEscape = function(str) {
      if (!str) {
        return str;
      }
      return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    util.argsToArray = function(args) {
      var arrayOfArgs = [];
      for (var i = 0; i < args.length; i++) {
        arrayOfArgs.push(args[i]);
      }
      return arrayOfArgs;
    };

    util.isUndefined = function(obj) {
      return obj === void 0;
    };

    util.arrayContains = function(array, search) {
      var i = array.length;
      while (i--) {
        if (array[i] === search) {
          return true;
        }
      }
      return false;
    };

    util.clone = function(obj) {
      if (Object.prototype.toString.apply(obj) === '[object Array]') {
        return obj.slice();
      }

      var cloned = {};
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          cloned[prop] = obj[prop];
        }
      }

      return cloned;
    };

    return util;
  };

  getJasmineRequire().base = function(j$, jasmineGlobal) {
    j$.unimplementedMethod_ = function() {
      throw new Error('unimplemented method');
    };

    j$.getGlobal = function() {
      return jasmineGlobal;
    };

    j$.getEnv = function(options) {
      var env = j$.currentEnv_ = j$.currentEnv_ || new j$.Env(options);
      //jasmine. singletons in here (setTimeout blah blah).
      return env;
    };

    j$.isArray_ = function(value) {
      return j$.isA_('Array', value);
    };

    j$.isString_ = function(value) {
      return j$.isA_('String', value);
    };

    j$.isNumber_ = function(value) {
      return j$.isA_('Number', value);
    };

    j$.isA_ = function(typeName, value) {
      return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
    };

    j$.isDomNode = function(obj) {
      return obj.nodeType > 0;
    };

    j$.fnNameFor = function(func) {
      return func.name || func.toString().match(/^\s*function\s*(\w*)\s*\(/)[1];
    };

    j$.any = function(clazz) {
      return new j$.Any(clazz);
    };

    j$.anything = function() {
      return new j$.Anything();
    };

    j$.objectContaining = function(sample) {
      return new j$.ObjectContaining(sample);
    };

    j$.stringMatching = function(expected) {
      return new j$.StringMatching(expected);
    };

    j$.arrayContaining = function(sample) {
      return new j$.ArrayContaining(sample);
    };

    j$.createSpy = function(name, originalFn) {

      var spyStrategy = new j$.SpyStrategy({
          name: name,
          fn: originalFn,
          getSpy: function() { return spy; }
        }),
        callTracker = new j$.CallTracker(),
        spy = function() {
          var callData = {
            object: this,
            args: Array.prototype.slice.apply(arguments)
          };

          callTracker.track(callData);
          var returnValue = spyStrategy.exec.apply(this, arguments);
          callData.returnValue = returnValue;

          return returnValue;
        };

      for (var prop in originalFn) {
        if (prop === 'and' || prop === 'calls') {
          throw new Error('Jasmine spies would overwrite the \'and\' and \'calls\' properties on the object being spied upon');
        }

        spy[prop] = originalFn[prop];
      }

      spy.and = spyStrategy;
      spy.calls = callTracker;

      return spy;
    };

    j$.isSpy = function(putativeSpy) {
      if (!putativeSpy) {
        return false;
      }
      return putativeSpy.and instanceof j$.SpyStrategy &&
        putativeSpy.calls instanceof j$.CallTracker;
    };

    j$.createSpyObj = function(baseName, methodNames) {
      if (j$.isArray_(baseName) && j$.util.isUndefined(methodNames)) {
        methodNames = baseName;
        baseName = 'unknown';
      }

      if (!j$.isArray_(methodNames) || methodNames.length === 0) {
        throw 'createSpyObj requires a non-empty array of method names to create spies for';
      }
      var obj = {};
      for (var i = 0; i < methodNames.length; i++) {
        obj[methodNames[i]] = j$.createSpy(baseName + '.' + methodNames[i]);
      }
      return obj;
    };
  };

  getJasmineRequire().Timer = function() {
    var defaultNow = (function(Date) {
      return function() { return new Date().getTime(); };
    })(Date);

    function Timer(options) {
      options = options || {};

      var now = options.now || defaultNow,
        startTime;

      this.start = function() {
        startTime = now();
      };

      this.elapsed = function() {
        return now() - startTime;
      };
    }

    return Timer;
  };

  getJasmineRequire().SpyStrategy = function() {

    function SpyStrategy(options) {
      options = options || {};

      var identity = options.name || 'unknown',
          originalFn = options.fn || function() {},
          getSpy = options.getSpy || function() {},
          plan = function() {};

      this.identity = function() {
        return identity;
      };

      this.exec = function() {
        return plan.apply(this, arguments);
      };

      this.callThrough = function() {
        plan = originalFn;
        return getSpy();
      };

      this.returnValue = function(value) {
        plan = function() {
          return value;
        };
        return getSpy();
      };

      this.returnValues = function() {
        var values = Array.prototype.slice.call(arguments);
        plan = function () {
          return values.shift();
        };
        return getSpy();
      };

      this.throwError = function(something) {
        var error = (something instanceof Error) ? something : new Error(something);
        plan = function() {
          throw error;
        };
        return getSpy();
      };

      this.callFake = function(fn) {
        plan = fn;
        return getSpy();
      };

      this.stub = function(fn) {
        plan = function() {};
        return getSpy();
      };
    }

    return SpyStrategy;
  };

  getJasmineRequire().SpyRegistry = function(j$) {

    function SpyRegistry(options) {
      options = options || {};
      var currentSpies = options.currentSpies || function() { return []; };

      this.spyOn = function(obj, methodName) {
        if (j$.util.isUndefined(obj)) {
          throw new Error('spyOn could not find an object to spy upon for ' + methodName + '()');
        }

        if (j$.util.isUndefined(methodName)) {
          throw new Error('No method name supplied');
        }

        if (j$.util.isUndefined(obj[methodName])) {
          throw new Error(methodName + '() method does not exist');
        }

        if (obj[methodName] && j$.isSpy(obj[methodName])) {
          //TODO?: should this return the current spy? Downside: may cause user confusion about spy state
          throw new Error(methodName + ' has already been spied upon');
        }

        var descriptor;
        try {
          descriptor = Object.getOwnPropertyDescriptor(obj, methodName);
        } catch(e) {
          // IE 8 doesn't support `definePropery` on non-DOM nodes
        }

        if (descriptor && !(descriptor.writable || descriptor.set)) {
          throw new Error(methodName + ' is not declared writable or has no setter');
        }

        var spy = j$.createSpy(methodName, obj[methodName]);

        currentSpies().push({
          spy: spy,
          baseObj: obj,
          methodName: methodName,
          originalValue: obj[methodName]
        });

        obj[methodName] = spy;

        return spy;
      };

      this.clearSpies = function() {
        var spies = currentSpies();
        for (var i = 0; i < spies.length; i++) {
          var spyEntry = spies[i];
          spyEntry.baseObj[spyEntry.methodName] = spyEntry.originalValue;
        }
      };
    }

    return SpyRegistry;
  };

  getJasmineRequire().Order = function() {
    function Order(options) {
      this.random = 'random' in options ? options.random : true;
      var seed = this.seed = options.seed || generateSeed();
      this.sort = this.random ? randomOrder : naturalOrder;

      function naturalOrder(items) {
        return items;
      }

      function randomOrder(items) {
        var copy = items.slice();
        copy.sort(function(a, b) {
          return jenkinsHash(seed + a.id) - jenkinsHash(seed + b.id);
        });
        return copy;
      }

      function generateSeed() {
        return String(Math.random()).slice(-5);
      }

      // Bob Jenkins One-at-a-Time Hash algorithm is a non-cryptographic hash function
      // used to get a different output when the key changes slighly.
      // We use your return to sort the children randomly in a consistent way when
      // used in conjunction with a seed

      function jenkinsHash(key) {
        var hash, i;
        for(hash = i = 0; i < key.length; ++i) {
          hash += key.charCodeAt(i);
          hash += (hash << 10);
          hash ^= (hash >> 6);
        }
        hash += (hash << 3);
        hash ^= (hash >> 11);
        hash += (hash << 15);
        return hash;
      }

    }

    return Order;
  };

  getJasmineRequire().MockDate = function() {
    function MockDate(global) {
      var self = this;
      var currentTime = 0;

      if (!global || !global.Date) {
        self.install = function() {};
        self.tick = function() {};
        self.uninstall = function() {};
        return self;
      }

      var GlobalDate = global.Date;

      self.install = function(mockDate) {
        if (mockDate instanceof GlobalDate) {
          currentTime = mockDate.getTime();
        } else {
          currentTime = new GlobalDate().getTime();
        }

        global.Date = FakeDate;
      };

      self.tick = function(millis) {
        millis = millis || 0;
        currentTime = currentTime + millis;
      };

      self.uninstall = function() {
        currentTime = 0;
        global.Date = GlobalDate;
      };

      createDateProperties();

      return self;

      function FakeDate() {
        switch(arguments.length) {
          case 0:
            return new GlobalDate(currentTime);
          case 1:
            return new GlobalDate(arguments[0]);
          case 2:
            return new GlobalDate(arguments[0], arguments[1]);
          case 3:
            return new GlobalDate(arguments[0], arguments[1], arguments[2]);
          case 4:
            return new GlobalDate(arguments[0], arguments[1], arguments[2], arguments[3]);
          case 5:
            return new GlobalDate(arguments[0], arguments[1], arguments[2], arguments[3],
                                  arguments[4]);
          case 6:
            return new GlobalDate(arguments[0], arguments[1], arguments[2], arguments[3],
                                  arguments[4], arguments[5]);
          default:
            return new GlobalDate(arguments[0], arguments[1], arguments[2], arguments[3],
                                  arguments[4], arguments[5], arguments[6]);
        }
      }

      function createDateProperties() {
        FakeDate.prototype = GlobalDate.prototype;

        FakeDate.now = function() {
          if (GlobalDate.now) {
            return currentTime;
          } else {
            throw new Error('Browser does not support Date.now()');
          }
        };

        FakeDate.toSource = GlobalDate.toSource;
        FakeDate.toString = GlobalDate.toString;
        FakeDate.parse = GlobalDate.parse;
        FakeDate.UTC = GlobalDate.UTC;
      }
    }

    return MockDate;
  };

  getJasmineRequire().Env = function(j$) {
    function Env(options) {
      options = options || {};

      var global = options.global || j$.getGlobal();

      var realSetTimeout = global.setTimeout;
      var realClearTimeout = global.clearTimeout;
      this.clock = new j$.Clock(global, function () { return new j$.DelayedFunctionScheduler(); }, new j$.MockDate(global));

      var spyRegistry = new j$.SpyRegistry();

      this.spyOn = function() {
        return spyRegistry.spyOn.apply(spyRegistry, arguments);
      };

      this.clearSpies = function() {
        return spyRegistry.clearSpies();
      };
    }
    return Env;
  };

  getJasmineRequire().DelayedFunctionScheduler = function() {
    function DelayedFunctionScheduler() {
      var self = this;
      var scheduledLookup = [];
      var scheduledFunctions = {};
      var currentTime = 0;
      var delayedFnCount = 0;

      self.tick = function(millis) {
        millis = millis || 0;
        var endTime = currentTime + millis;

        runScheduledFunctions(endTime);
        currentTime = endTime;
      };

      self.scheduleFunction = function(funcToCall, millis, params, recurring, timeoutKey, runAtMillis) {
        var f;
        if (typeof(funcToCall) === 'string') {
          /* jshint evil: true */
          f = function() { return eval(funcToCall); };
          /* jshint evil: false */
        } else {
          f = funcToCall;
        }

        millis = millis || 0;
        timeoutKey = timeoutKey || ++delayedFnCount;
        runAtMillis = runAtMillis || (currentTime + millis);

        var funcToSchedule = {
          runAtMillis: runAtMillis,
          funcToCall: f,
          recurring: recurring,
          params: params,
          timeoutKey: timeoutKey,
          millis: millis
        };

        if (runAtMillis in scheduledFunctions) {
          scheduledFunctions[runAtMillis].push(funcToSchedule);
        } else {
          scheduledFunctions[runAtMillis] = [funcToSchedule];
          scheduledLookup.push(runAtMillis);
          scheduledLookup.sort(function (a, b) {
            return a - b;
          });
        }

        return timeoutKey;
      };

      self.removeFunctionWithId = function(timeoutKey) {
        for (var runAtMillis in scheduledFunctions) {
          var funcs = scheduledFunctions[runAtMillis];
          var i = indexOfFirstToPass(funcs, function (func) {
            return func.timeoutKey === timeoutKey;
          });

          if (i > -1) {
            if (funcs.length === 1) {
              delete scheduledFunctions[runAtMillis];
              deleteFromLookup(runAtMillis);
            } else {
              funcs.splice(i, 1);
            }

            // intervals get rescheduled when executed, so there's never more
            // than a single scheduled function with a given timeoutKey
            break;
          }
        }
      };

      return self;

      function indexOfFirstToPass(array, testFn) {
        var index = -1;

        for (var i = 0; i < array.length; ++i) {
          if (testFn(array[i])) {
            index = i;
            break;
          }
        }

        return index;
      }

      function deleteFromLookup(key) {
        var value = Number(key);
        var i = indexOfFirstToPass(scheduledLookup, function (millis) {
          return millis === value;
        });

        if (i > -1) {
          scheduledLookup.splice(i, 1);
        }
      }

      function reschedule(scheduledFn) {
        self.scheduleFunction(scheduledFn.funcToCall,
          scheduledFn.millis,
          scheduledFn.params,
          true,
          scheduledFn.timeoutKey,
          scheduledFn.runAtMillis + scheduledFn.millis);
      }

      function forEachFunction(funcsToRun, callback) {
        for (var i = 0; i < funcsToRun.length; ++i) {
          callback(funcsToRun[i]);
        }
      }

      function runScheduledFunctions(endTime) {
        if (scheduledLookup.length === 0 || scheduledLookup[0] > endTime) {
          return;
        }

        do {
          currentTime = scheduledLookup.shift();

          var funcsToRun = scheduledFunctions[currentTime];
          delete scheduledFunctions[currentTime];

          forEachFunction(funcsToRun, function(funcToRun) {
            if (funcToRun.recurring) {
              reschedule(funcToRun);
            }
          });

          forEachFunction(funcsToRun, function(funcToRun) {
            funcToRun.funcToCall.apply(null, funcToRun.params || []);
          });
        } while (scheduledLookup.length > 0 &&
                // checking first if we're out of time prevents setTimeout(0)
                // scheduled in a funcToRun from forcing an extra iteration
                   currentTime !== endTime  &&
                   scheduledLookup[0] <= endTime);
      }
    }

    return DelayedFunctionScheduler;
  };

  getJasmineRequire().Clock = function() {
    function Clock(global, delayedFunctionSchedulerFactory, mockDate) {
      var self = this,
        realTimingFunctions = {
          setTimeout: global.setTimeout,
          clearTimeout: global.clearTimeout,
          setInterval: global.setInterval,
          clearInterval: global.clearInterval
        },
        fakeTimingFunctions = {
          setTimeout: setTimeout,
          clearTimeout: clearTimeout,
          setInterval: setInterval,
          clearInterval: clearInterval
        },
        installed = false,
        delayedFunctionScheduler,
        timer;


      self.install = function() {
        if(!originalTimingFunctionsIntact()) {
          throw new Error('Jasmine Clock was unable to install over custom global timer functions. Is the clock already installed?');
        }
        replace(global, fakeTimingFunctions);
        timer = fakeTimingFunctions;
        delayedFunctionScheduler = delayedFunctionSchedulerFactory();
        installed = true;

        return self;
      };

      self.uninstall = function() {
        delayedFunctionScheduler = null;
        mockDate.uninstall();
        replace(global, realTimingFunctions);

        timer = realTimingFunctions;
        installed = false;
      };

      self.withMock = function(closure) {
        this.install();
        try {
          closure();
        } finally {
          this.uninstall();
        }
      };

      self.mockDate = function(initialDate) {
        mockDate.install(initialDate);
      };

      self.setTimeout = function(fn, delay, params) {
        if (legacyIE()) {
          if (arguments.length > 2) {
            throw new Error('IE < 9 cannot support extra params to setTimeout without a polyfill');
          }
          return timer.setTimeout(fn, delay);
        }
        return Function.prototype.apply.apply(timer.setTimeout, [global, arguments]);
      };

      self.setInterval = function(fn, delay, params) {
        if (legacyIE()) {
          if (arguments.length > 2) {
            throw new Error('IE < 9 cannot support extra params to setInterval without a polyfill');
          }
          return timer.setInterval(fn, delay);
        }
        return Function.prototype.apply.apply(timer.setInterval, [global, arguments]);
      };

      self.clearTimeout = function(id) {
        return Function.prototype.call.apply(timer.clearTimeout, [global, id]);
      };

      self.clearInterval = function(id) {
        return Function.prototype.call.apply(timer.clearInterval, [global, id]);
      };

      self.tick = function(millis) {
        if (installed) {
          mockDate.tick(millis);
          delayedFunctionScheduler.tick(millis);
        } else {
          throw new Error('Mock clock is not installed, use jasmine.clock().install()');
        }
      };

      return self;

      function originalTimingFunctionsIntact() {
        return global.setTimeout === realTimingFunctions.setTimeout &&
          global.clearTimeout === realTimingFunctions.clearTimeout &&
          global.setInterval === realTimingFunctions.setInterval &&
          global.clearInterval === realTimingFunctions.clearInterval;
      }

      function legacyIE() {
        //if these methods are polyfilled, apply will be present
        return !(realTimingFunctions.setTimeout || realTimingFunctions.setInterval).apply;
      }

      function replace(dest, source) {
        for (var prop in source) {
          dest[prop] = source[prop];
        }
      }

      function setTimeout(fn, delay) {
        return delayedFunctionScheduler.scheduleFunction(fn, delay, argSlice(arguments, 2));
      }

      function clearTimeout(id) {
        return delayedFunctionScheduler.removeFunctionWithId(id);
      }

      function setInterval(fn, interval) {
        return delayedFunctionScheduler.scheduleFunction(fn, interval, argSlice(arguments, 2), true);
      }

      function clearInterval(id) {
        return delayedFunctionScheduler.removeFunctionWithId(id);
      }

      function argSlice(argsObj, n) {
        return Array.prototype.slice.call(argsObj, n);
      }
    }

    return Clock;
  };

  getJasmineRequire().CallTracker = function() {

    function CallTracker() {
      var calls = [];

      this.track = function(context) {
        calls.push(context);
      };

      this.any = function() {
        return !!calls.length;
      };

      this.count = function() {
        return calls.length;
      };

      this.argsFor = function(index) {
        var call = calls[index];
        return call ? call.args : [];
      };

      this.all = function() {
        return calls;
      };

      this.allArgs = function() {
        var callArgs = [];
        for(var i = 0; i < calls.length; i++){
          callArgs.push(calls[i].args);
        }

        return callArgs;
      };

      this.first = function() {
        return calls[0];
      };

      this.mostRecent = function() {
        return calls[calls.length - 1];
      };

      this.reset = function() {
        calls = [];
      };
    }

    return CallTracker;
  };

  getJasmineRequire().matchersUtil = function(j$) {
    // TODO: what to do about jasmine.pp not being inject? move to JSON.stringify? gut PrettyPrinter?

    return {
      equals: function(a, b, customTesters) {
        customTesters = customTesters || [];

        return eq(a, b, [], [], customTesters);
      },

      contains: function(haystack, needle, customTesters) {
        customTesters = customTesters || [];

        if ((Object.prototype.toString.apply(haystack) === '[object Array]') ||
          (!!haystack && !haystack.indexOf))
        {
          for (var i = 0; i < haystack.length; i++) {
            if (eq(haystack[i], needle, [], [], customTesters)) {
              return true;
            }
          }
          return false;
        }

        return !!haystack && haystack.indexOf(needle) >= 0;
      }
    };

    function isAsymmetric(obj) {
      return obj && j$.isA_('Function', obj.asymmetricMatch);
    }

    function asymmetricMatch(a, b) {
      var asymmetricA = isAsymmetric(a),
          asymmetricB = isAsymmetric(b);

      if (asymmetricA && asymmetricB) {
        return undefined;
      }

      if (asymmetricA) {
        return a.asymmetricMatch(b);
      }

      if (asymmetricB) {
        return b.asymmetricMatch(a);
      }
    }

    // Equality function lovingly adapted from isEqual in
    //   [Underscore](http://underscorejs.org)
    function eq(a, b, aStack, bStack, customTesters) {
      var result = true;

      var asymmetricResult = asymmetricMatch(a, b);
      if (!j$.util.isUndefined(asymmetricResult)) {
        return asymmetricResult;
      }

      for (var i = 0; i < customTesters.length; i++) {
        var customTesterResult = customTesters[i](a, b);
        if (!j$.util.isUndefined(customTesterResult)) {
          return customTesterResult;
        }
      }

      if (a instanceof Error && b instanceof Error) {
        return a.message == b.message;
      }

      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      // A strict comparison is necessary because `null == undefined`.
      if (a === null || b === null) { return a === b; }
      var className = Object.prototype.toString.call(a);
      if (className != Object.prototype.toString.call(b)) { return false; }
      switch (className) {
        // Strings, numbers, dates, and booleans are compared by value.
        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return a == String(b);
        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
          // other numeric values.
          return a != +a ? b != +b : (a === 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
          return a.source == b.source &&
            a.global == b.global &&
            a.multiline == b.multiline &&
            a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }

      var aIsDomNode = j$.isDomNode(a);
      var bIsDomNode = j$.isDomNode(b);
      if (aIsDomNode && bIsDomNode) {
        // At first try to use DOM3 method isEqualNode
        if (a.isEqualNode) {
          return a.isEqualNode(b);
        }
        // IE8 doesn't support isEqualNode, try to use outerHTML && innerText
        var aIsElement = a instanceof Element;
        var bIsElement = b instanceof Element;
        if (aIsElement && bIsElement) {
          return a.outerHTML == b.outerHTML;
        }
        if (aIsElement || bIsElement) {
          return false;
        }
        return a.innerText == b.innerText && a.textContent == b.textContent;
      }
      if (aIsDomNode || bIsDomNode) {
        return false;
      }

      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      var length = aStack.length;
      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] == a) { return bStack[length] == b; }
      }
      // Add the first object to the stack of traversed objects.
      aStack.push(a);
      bStack.push(b);
      var size = 0;
      // Recursively compare objects and arrays.
      // Compare array lengths to determine if a deep comparison is necessary.
      if (className == '[object Array]' && a.length !== b.length) {
        result = false;
      }

      if (result) {
        // Objects with different constructors are not equivalent, but `Object`s
        // or `Array`s from different frames are.
        if (className !== '[object Array]') {
          var aCtor = a.constructor, bCtor = b.constructor;
          if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                 isFunction(bCtor) && bCtor instanceof bCtor)) {
            return false;
          }
        }
        // Deep compare objects.
        for (var key in a) {
          if (has(a, key)) {
            // Count the expected number of properties.
            size++;
            // Deep compare each member.
            if (!(result = has(b, key) && eq(a[key], b[key], aStack, bStack, customTesters))) { break; }
          }
        }
        // Ensure that both objects contain the same number of properties.
        if (result) {
          for (key in b) {
            if (has(b, key) && !(size--)) { break; }
          }
          result = !size;
        }
      }
      // Remove the first object from the stack of traversed objects.
      aStack.pop();
      bStack.pop();

      return result;

      function has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      }

      function isFunction(obj) {
        return typeof obj === 'function';
      }
    }
  };

  getJasmineRequire().Any = function(j$) {

    function Any(expectedObject) {
      if (typeof expectedObject === 'undefined') {
        throw new TypeError(
          'jasmine.any() expects to be passed a constructor function. ' +
          'Please pass one or use jasmine.anything() to match any object.'
        );
      }
      this.expectedObject = expectedObject;
    }

    Any.prototype.asymmetricMatch = function(other) {
      if (this.expectedObject == String) {
        return typeof other == 'string' || other instanceof String;
      }

      if (this.expectedObject == Number) {
        return typeof other == 'number' || other instanceof Number;
      }

      if (this.expectedObject == Function) {
        return typeof other == 'function' || other instanceof Function;
      }

      if (this.expectedObject == Object) {
        return typeof other == 'object';
      }

      if (this.expectedObject == Boolean) {
        return typeof other == 'boolean';
      }

      return other instanceof this.expectedObject;
    };

    Any.prototype.jasmineToString = function() {
      return '<jasmine.any(' + j$.fnNameFor(this.expectedObject) + ')>';
    };

    return Any;
  };

  getJasmineRequire().Anything = function(j$) {

    function Anything() {}

    Anything.prototype.asymmetricMatch = function(other) {
      return !j$.util.isUndefined(other) && other !== null;
    };

    Anything.prototype.jasmineToString = function() {
      return '<jasmine.anything>';
    };

    return Anything;
  };

  getJasmineRequire().ArrayContaining = function(j$) {
    function ArrayContaining(sample) {
      this.sample = sample;
    }

    ArrayContaining.prototype.asymmetricMatch = function(other) {
      var className = Object.prototype.toString.call(this.sample);
      if (className !== '[object Array]') { throw new Error('You must provide an array to arrayContaining, not \'' + this.sample + '\'.'); }

      for (var i = 0; i < this.sample.length; i++) {
        var item = this.sample[i];
        if (!j$.matchersUtil.contains(other, item)) {
          return false;
        }
      }

      return true;
    };

    ArrayContaining.prototype.jasmineToString = function () {
      return '<jasmine.arrayContaining(' + jasmine.pp(this.sample) +')>';
    };

    return ArrayContaining;
  };

  getJasmineRequire().ObjectContaining = function(j$) {

    function ObjectContaining(sample) {
      this.sample = sample;
    }

    function getPrototype(obj) {
      if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(obj);
      }

      if (obj.constructor.prototype == obj) {
        return null;
      }

      return obj.constructor.prototype;
    }

    function hasProperty(obj, property) {
      if (!obj) {
        return false;
      }

      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        return true;
      }

      return hasProperty(getPrototype(obj), property);
    }

    ObjectContaining.prototype.asymmetricMatch = function(other) {
      if (typeof(this.sample) !== 'object') { throw new Error('You must provide an object to objectContaining, not \''+this.sample+'\'.'); }

      for (var property in this.sample) {
        if (!hasProperty(other, property) ||
            !j$.matchersUtil.equals(this.sample[property], other[property])) {
          return false;
        }
      }

      return true;
    };

    ObjectContaining.prototype.jasmineToString = function() {
      return '<jasmine.objectContaining(' + j$.pp(this.sample) + ')>';
    };

    return ObjectContaining;
  };

  getJasmineRequire().StringMatching = function(j$) {

    function StringMatching(expected) {
      if (!j$.isString_(expected) && !j$.isA_('RegExp', expected)) {
        throw new Error('Expected is not a String or a RegExp');
      }

      this.regexp = new RegExp(expected);
    }

    StringMatching.prototype.asymmetricMatch = function(other) {
      return this.regexp.test(other);
    };

    StringMatching.prototype.jasmineToString = function() {
      return '<jasmine.stringMatching(' + this.regexp + ')>';
    };

    return StringMatching;
  };

  getJasmineRequire().interface = function(j$, env) {

    j$.spyOn = function(obj, methodName) {
      return env.spyOn(obj, methodName);
    },

    j$.clearSpies = function() {
      return env.clearSpies();
    },

    j$.clock = function() {
      return env.clock;
    };
  };

  getJasmineRequire().pp = function(j$) {

    function PrettyPrinter() {
      this.ppNestLevel_ = 0;
      this.seen = [];
    }

    PrettyPrinter.prototype.format = function(value) {
      this.ppNestLevel_++;
      try {
        if (j$.util.isUndefined(value)) {
          this.emitScalar('undefined');
        } else if (value === null) {
          this.emitScalar('null');
        } else if (value === 0 && 1/value === -Infinity) {
          this.emitScalar('-0');
        } else if (value === j$.getGlobal()) {
          this.emitScalar('<global>');
        } else if (value.jasmineToString) {
          this.emitScalar(value.jasmineToString());
        } else if (typeof value === 'string') {
          this.emitString(value);
        } else if (j$.isSpy(value)) {
          this.emitScalar('spy on ' + value.and.identity());
        } else if (value instanceof RegExp) {
          this.emitScalar(value.toString());
        } else if (typeof value === 'function') {
          this.emitScalar('Function');
        } else if (typeof value.nodeType === 'number') {
          this.emitScalar('HTMLNode');
        } else if (value instanceof Date) {
          this.emitScalar('Date(' + value + ')');
        } else if (value.toString && typeof value === 'object' && !(value instanceof Array) && value.toString !== Object.prototype.toString) {
          this.emitScalar(value.toString());
        } else if (j$.util.arrayContains(this.seen, value)) {
          this.emitScalar('<circular reference: ' + (j$.isArray_(value) ? 'Array' : 'Object') + '>');
        } else if (j$.isArray_(value) || j$.isA_('Object', value)) {
          this.seen.push(value);
          if (j$.isArray_(value)) {
            this.emitArray(value);
          } else {
            this.emitObject(value);
          }
          this.seen.pop();
        } else {
          this.emitScalar(value.toString());
        }
      } finally {
        this.ppNestLevel_--;
      }
    };

    PrettyPrinter.prototype.iterateObject = function(obj, fn) {
      for (var property in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, property)) { continue; }
        fn(property, obj.__lookupGetter__ ? (!j$.util.isUndefined(obj.__lookupGetter__(property)) &&
            obj.__lookupGetter__(property) !== null) : false);
      }
    };

    PrettyPrinter.prototype.emitArray = j$.unimplementedMethod_;
    PrettyPrinter.prototype.emitObject = j$.unimplementedMethod_;
    PrettyPrinter.prototype.emitScalar = j$.unimplementedMethod_;
    PrettyPrinter.prototype.emitString = j$.unimplementedMethod_;

    function StringPrettyPrinter() {
      PrettyPrinter.call(this);

      this.string = '';
    }

    j$.util.inherit(StringPrettyPrinter, PrettyPrinter);

    StringPrettyPrinter.prototype.emitScalar = function(value) {
      this.append(value);
    };

    StringPrettyPrinter.prototype.emitString = function(value) {
      this.append('\'' + value + '\'');
    };

    StringPrettyPrinter.prototype.emitArray = function(array) {
      if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
        this.append('Array');
        return;
      }
      var length = Math.min(array.length, j$.MAX_PRETTY_PRINT_ARRAY_LENGTH);
      this.append('[ ');
      for (var i = 0; i < length; i++) {
        if (i > 0) {
          this.append(', ');
        }
        this.format(array[i]);
      }
      if(array.length > length){
        this.append(', ...');
      }

      var self = this;
      var first = array.length === 0;
      this.iterateObject(array, function(property, isGetter) {
        if (property.match(/^\d+$/)) {
          return;
        }

        if (first) {
          first = false;
        } else {
          self.append(', ');
        }

        self.formatProperty(array, property, isGetter);
      });

      this.append(' ]');
    };

    StringPrettyPrinter.prototype.emitObject = function(obj) {
      var constructorName = obj.constructor ? j$.fnNameFor(obj.constructor) : 'null';
      this.append(constructorName);

      if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
        return;
      }

      var self = this;
      this.append('({ ');
      var first = true;

      this.iterateObject(obj, function(property, isGetter) {
        if (first) {
          first = false;
        } else {
          self.append(', ');
        }

        self.formatProperty(obj, property, isGetter);
      });

      this.append(' })');
    };

    StringPrettyPrinter.prototype.formatProperty = function(obj, property, isGetter) {
        this.append(property);
        this.append(': ');
        if (isGetter) {
          this.append('<getter>');
        } else {
          this.format(obj[property]);
        }
    };

    StringPrettyPrinter.prototype.append = function(value) {
      this.string += value;
    };

    return function(value) {
      var stringPrettyPrinter = new StringPrettyPrinter();
      stringPrettyPrinter.format(value);
      return stringPrettyPrinter.string;
    };
  };

  if (typeof exports === 'object') {
    module.exports = jasmineRequire;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { jasmineGlobal.jasmine = jasmineRequire; });
  } else {
    jasmineGlobal.jasmine = jasmineRequire;
  }

})(this);
