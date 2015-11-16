var jasmineRequire = require('jasmine-core');

if (typeof describe === 'undefined') {
  throw new Error("You need to run specs using `mocha` to make it works.")
}
jasmine = jasmineRequire.core(jasmineRequire);

module.exports = require('./init');
