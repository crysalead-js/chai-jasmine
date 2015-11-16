describe("toHaveBeenCalled", function() {
  it("passes when the actual was called", function() {
    var calledSpy = j$.createSpy('called-spy');
    calledSpy();
    expect(calledSpy).toHaveBeenCalled();
  });

  it("fails when the actual was not called", function() {
    var uncalledSpy = j$.createSpy('called-spy');
    expect(uncalledSpy).not.toHaveBeenCalled();
  });
});

