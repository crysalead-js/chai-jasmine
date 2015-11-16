describe("toBeFalsy", function() {
  it("passes for 'falsy' values", function() {
    expect(false).toBeFalsy();
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
    expect(void 0).toBeFalsy();
  });

  it("fails for 'truthy' values", function() {
    expect(true).not.toBeFalsy();
    expect(1).not.toBeFalsy();
    expect("foo").not.toBeFalsy();
    expect({}).not.toBeFalsy();
  });
});
