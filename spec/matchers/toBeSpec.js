describe("toBe", function() {
  it("passes when actual === expected", function() {
    expect(1).toBe(1);
  });

  it("fails when actual !== expected", function() {
    expect(1).not.toBe(2);
  });
});
