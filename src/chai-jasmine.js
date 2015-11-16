var chai = require('chai');

// Overrides Spies so it won't rely on Jasmine's env
var spyRegistry = new jasmine.SpyRegistry();
jasmine.getEnv().spyOn = function() {
  return spyRegistry.spyOn.apply(spyRegistry, arguments);
};

// Adds jasmine-style matchers
chai.use(require('./matchers'));

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

module.exports = chai;
