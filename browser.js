var jasmineRequire = require('jasmine-core/lib/jasmine-core/jasmine');
jasmine = jasmineRequire.core(jasmineRequire);

if (typeof mocha !== 'undefined') {
  mocha.setup('bdd');
  mocha.setup = function(type) {
    if (type !== 'bdd') {
      throw new Error('Only bdd style is allowed with chai-jasmine');
    }
  };
} else if (typeof describe === 'undefined') {
  throw new Error("You need to include the mocha library first.")
}

if (typeof chai === 'undefined') {
  throw new Error("You need to include chai library first.")
}
chai.use(require('./src/chai-jasmine'));
