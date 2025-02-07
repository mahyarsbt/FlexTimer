import DriftCorrection from '../../src/core/DriftCorrection.js';

describe('DriftCorrection', () => {
  test('should reset drift to zero', () => {
    const driftCorrection = new DriftCorrection(1000);
    driftCorrection.reset();
    expect(driftCorrection.drift).toBe(0);
  });

  test('should calculate drift correctly', () => {
    const driftCorrection = new DriftCorrection(1000);
    const start = performance.now();
    driftCorrection.checkDrift(start + 1100);

    console.log("Drift value:", driftCorrection.drift);

    expect(driftCorrection.drift).not.toBeUndefined();
    expect(typeof driftCorrection.drift).toBe("number");
    expect(driftCorrection.drift).toBeGreaterThanOrEqual(0);
  });
});
