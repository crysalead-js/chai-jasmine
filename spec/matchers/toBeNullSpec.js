describe("toBeNull", function() {
  it("passes for null", function() {
    expect(null).toBeNull();
  });

  it("fails for non-null", function() {
    expect('foo').not.toBeNull();
  });
});
