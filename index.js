var chai  = require('chai');

if (typeof describe === 'undefined') {
  throw new Error("The `describe()` global function is undefined, mocha need to be included first.")
}

chai.use(require('./src/matchers'));

fdescribe = global.fdescribe || describe.only;
fcontext = global.fdescribe || context.only;
fit = global.fit || it.only;
xdescribe = global.xdescribe || describe.skip;
xcontext = global.xdescribe || context.skip;
xit = global.xit || it.skip;

expect = chai.expect;
jasmine = chai.jasmine;
spyOn = jasmine.spyOn;
clearSpies = jasmine.clearSpies;

afterEach(function() {
  clearSpies();
});

module.exports = chai;
