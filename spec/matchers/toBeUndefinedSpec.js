describe("toBeUndefined", function() {
  it("matches for undefined values", function() {
    expect(void 0).toBeUndefined(false);

  });

  it("fails when matching defined values", function() {
    expect('foo').not.toBeUndefined();
  });
});
