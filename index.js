var jasmineRequire = require('jasmine-core');
jasmine = jasmineRequire.core(jasmineRequire);

if (typeof describe === 'undefined') {
  throw new Error("You need to include the mocha library first or use the `mocha` command line.")
}

var chai = require('chai');
chai.use(require('./src/chai-jasmine'));

module.exports = chai;
