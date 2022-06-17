describe('toBeResolved', function() {
  it('passes if the actual is resolved', function() {
    const matchersUtil = new jasmineUnderTest.MatchersUtil(),
      matcher = jasmineUnderTest.asyncMatchers.toBeResolved(matchersUtil),
      actual = Promise.resolve();

    return matcher.compare(actual).then(function(result) {
      expect(result).toEqual(jasmine.objectContaining({ pass: true }));
    });
  });

  it('fails if the actual is rejected', function() {
    const matchersUtil = new jasmineUnderTest.MatchersUtil({
        pp: jasmineUnderTest.makePrettyPrinter([])
      }),
      matcher = jasmineUnderTest.asyncMatchers.toBeResolved(matchersUtil),
      actual = Promise.reject(new Error('AsyncExpectationSpec rejection'));

    return matcher.compare(actual).then(function(result) {
      expect(result).toEqual({
        pass: false,
        message:
          'Expected a promise to be resolved but it was rejected ' +
          'with Error: AsyncExpectationSpec rejection.'
      });
    });
  });

  it('fails if actual is not a promise', function() {
    const matchersUtil = new jasmineUnderTest.MatchersUtil(),
      matcher = jasmineUnderTest.asyncMatchers.toBeResolved(matchersUtil),
      actual = 'not a promise';

    function f() {
      return matcher.compare(actual);
    }

    expect(f).toThrowError('Expected toBeResolved to be called on a promise.');
  });
});
