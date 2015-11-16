describe("toBeCloseTo", function() {
  it("passes when within two decimal places by default", function() {
    expect(0).toBeCloseTo(0);
    expect(0).toBeCloseTo(0.001);
  });

  it("fails when not within two decimal places by default", function() {
    expect(0).not.toBeCloseTo(0.01);
  });

  it("accepts an optional precision argument", function() {
    expect(0).toBeCloseTo(0.1, 0);
    expect(0).toBeCloseTo(0.0001, 3);
  });

  it("rounds expected values", function() {
    expect(1.23).toBeCloseTo(1.229);
    expect(1.23).toBeCloseTo(1.226);
    expect(1.23).toBeCloseTo(1.225);
    expect(1.23).not.toBeCloseTo(1.2249999);
    expect(1.23).toBeCloseTo(1.234);
  });
});
