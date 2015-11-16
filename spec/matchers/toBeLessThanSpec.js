describe("toBeLessThan", function() {
  it("passes when actual < expected", function() {
    expect(1).toBeLessThan(2);
  });

  it("fails when actual <= expected", function() {
    expect(1).not.toBeLessThan(1);
    expect(2).not.toBeLessThan(1);
  });
});
