# chai-jasmine

[![Build Status](https://travis-ci.org/crysalead-js/chai-jasmine.png?branch=master)](https://travis-ci.org/crysalead-js/chai-jasmine)

chai-jasmine is an extension which provides [jasmine's](http://jasmine.github.io/) style expect on top of [mocha](https://mochajs.org/) using [chai](http://chaijs.com/) assertion library.

## Usage

```js
require('chai-jasmine');
```

Fully supported:
* Matchers
* Focusing specs
* Spies
* Clock
* Mocking Date
* Asynchronous Support

Not supported:
* jasmine.Env() (too tighly coupled with jasmine specs runner)
* Custom Equality Testers (no workaround for this feature)
* Custom Matchers (need to be rewritten using chai)
* Custom Reporters (need to be rewritten using mocha)
