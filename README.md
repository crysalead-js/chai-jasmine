# chai-jasmine

[![Build Status](https://travis-ci.org/crysalead-js/chai-jasmine.png?branch=master)](https://travis-ci.org/crysalead-js/chai-jasmine)

chai-jasmine is an extension which provides [Jasmine's](http://jasmine.github.io/) style expect on top of [mocha](https://mochajs.org/) using [chai](http://chaijs.com/) assertion library.


## Installation

```bash
npm install chai-jasmine --save-dev;
```

## Usage

node:
```js
require('chai-jasmine');
```

browser:
```js
<script src="vendor/mocha/mocha.js" type="text/javascript"></script>
<script src="vendor/chai/chai.js" type="text/javascript"></script>
<script src="vendor/chai-jasmine/chai-jasmine.js" type="text/javascript"></script>
```

This implementation is based on Jasmine's core directly so all Jasmine's features are supported out of the box :
* Focusing specs
* Spies
* Clock
* Mocking Date
* Asynchronous (with the `done()` function, Jasmine >= 2.0).

Jasmine's matchers has been rewriten to work on top of chai so features like the [Jasmine's custom equality testers ](http://Jasmine.github.io/2.0/custom_equality.html) won't work anymore. Moreover you'll need to rewrite all your Jasmine custom matchers using chai and include them like so to make them work:

```js
var chai = require('chai-jasmine');
chai.use(require('./your-custom-matchers'));
```

Note: all features related to the Jasmine's specs runner (like Jasmine.Env()) or reporting won't have any effect anymore.

Note: spies are now cleared up during `afterEach()` which may changes a bit the spiecs persistance behavior over specs.
