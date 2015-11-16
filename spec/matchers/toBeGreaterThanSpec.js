describe("toBeGreaterThan", function() {
  it("passes when actual > expected", function() {
    expect(2).toBeGreaterThan(1);
  });

  it("fails when actual <= expected", function() {
    expect(1).not.toBeGreaterThan(1);
    expect(1).not.toBeGreaterThan(2);
  });
});
