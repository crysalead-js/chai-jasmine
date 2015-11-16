describe("toThrow", function() {
  it("passes when an error is thrown", function() {
    expect(function() { throw 5; }).toThrow();
  });

  it("fails if actual does not throw", function() {
    expect(function() { return; }).not.toThrow();
  });
});
