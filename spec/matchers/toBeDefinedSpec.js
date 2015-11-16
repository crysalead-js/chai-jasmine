describe("toBeDefined", function() {
  it("matches for defined values", function() {
    expect('foo').toBeDefined();
  });

  it("fails when matching undefined values", function() {
    expect(void 0).not.toBeDefined(false);
  });
});
