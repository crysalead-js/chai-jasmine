var jasmineRequire = require('jasmine-core/lib/jasmine-core/jasmine');

if (typeof mocha !== 'undefined') {
  mocha.setup('bdd');
  mocha.setup = function(type) {
    if (type !== 'bdd') {
      throw new Error('Only bdd style is allowed with chai-jasmine');
    }
  };
} else if (typeof describe === 'undefined') {
  throw new Error("You need to include the `mocha` library first.")
}
jasmine = jasmineRequire.core(jasmineRequire);

module.exports = require('./src/chai-jasmine');