describe("toHaveBeenCalledTimes", function() {
  it("passes when the actual was called once", function() {
    var calledSpy = j$.createSpy('called-spy');
    calledSpy();
    expect(calledSpy).toHaveBeenCalledTimes(1);
  });

  it("passes when the actual was called the expected times", function() {
    var calledSpy = j$.createSpy('called-spy');
    calledSpy();
    calledSpy();
    calledSpy();
    expect(calledSpy).toHaveBeenCalledTimes(3);
  });

  it("fails when the actual was called less than the expected", function() {
    var calledSpy = j$.createSpy('called-spy');
    calledSpy();
    calledSpy();
    calledSpy();
    expect(calledSpy).not.toHaveBeenCalledTimes(2);
  });

  it("fails when the actual was called more than the expected", function() {
    var calledSpy = j$.createSpy('called-spy');
    calledSpy();
    calledSpy();
    calledSpy();
    expect(calledSpy).not.toHaveBeenCalledTimes(4);
  });
});
