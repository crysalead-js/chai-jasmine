var chai  = require('chai');

if (typeof describe === 'undefined') {
  throw new Error("The `describe()` global function is undefined, mocha need to be included first.")
}

var jasmineRequire = require('jasmine-core');
jasmine = chai.jasmine = jasmineRequire.core(jasmineRequire);

// Overrides Spies so it won't rely on Jasmine's env
var spyRegistry = new jasmine.SpyRegistry();
jasmine.getEnv().spyOn = function() {
  return spyRegistry.spyOn.apply(spyRegistry, arguments);
};

// Adds jasmine-style matchers
chai.use(require('./src/matchers'));

// Setup global functions
fdescribe = global.fdescribe || describe.only;
fcontext = global.fdescribe || context.only;
fit = global.fit || it.only;
xdescribe = global.xdescribe || describe.skip;
xcontext = global.xdescribe || context.skip;
xit = global.xit || it.skip;

expect = chai.expect;
spyOn = spyRegistry.spyOn;
clearSpies = spyRegistry.clearSpies;

afterEach(function() {
  clearSpies();
});

module.exports = chai;
