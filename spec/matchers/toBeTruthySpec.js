describe("toBeTruthy", function() {
  it("passes for 'truthy' values", function() {
    expect(true).toBeTruthy();
    expect(1).toBeTruthy();
    expect('foo').toBeTruthy();
    expect({}).toBeTruthy();
  });

  it("fails for 'falsy' values", function() {
    expect(false).not.toBeTruthy();
    expect(0).not.toBeTruthy();
    expect('').not.toBeTruthy();
    expect(null).not.toBeTruthy();
    expect(void 0).not.toBeTruthy();
  });
});
