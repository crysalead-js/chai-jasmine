describe("toBeNaN", function() {
  it("passes for NaN with a custom .not fail", function() {
    expect(Number.NaN).toBeNaN();
  });

  it("fails for anything not a NaN", function() {
    expect(1).not.toBeNaN();
    expect(null).not.toBeNaN();
    expect('').not.toBeNaN();
    expect(Number.POSITIVE_INFINITY).not.toBeNaN();
  });

});
