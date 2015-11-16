describe("toMatch", function() {
  it("passes when RegExps are equivalent", function() {
    expect(/foo/).toMatch(/foo/);
  });

  it("fails when RegExps are not equivalent", function() {
    expect(/bar/).not.toBe(/foo/);
  });

  it("passes when the actual matches the expected string as a pattern", function() {
    expect('foosball').toMatch('foo');
  });

  it("fails when the actual matches the expected string as a pattern", function() {
    expect('bar').not.toMatch('foo');
  });
});

