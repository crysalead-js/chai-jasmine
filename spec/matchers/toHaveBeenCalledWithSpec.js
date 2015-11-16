describe("toHaveBeenCalledWith", function() {
  it("passes when the actual was called with matching parameters", function() {
    var calledSpy = j$.createSpy('called-spy');
    calledSpy('a', 'b');
    expect(calledSpy).toHaveBeenCalledWith('a', 'b');
  });

  it("fails when the actual was not called", function() {
    var calledSpy = j$.createSpy('called-spy');
    expect(calledSpy).not.toHaveBeenCalledWith('a', 'b');
  });

  it("fails when the actual was called with different parameters", function() {
    var calledSpy = j$.createSpy('called-spy');
    calledSpy('a');
    calledSpy('c', 'd');
    expect(calledSpy).not.toHaveBeenCalledWith('a', 'b');
  });
});
