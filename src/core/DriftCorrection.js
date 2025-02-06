/**
 * DriftCorrection - Ensures FlexTimer maintains high accuracy by compensating for timing drift.
 */
class DriftCorrection {

  /**
   * Creates an instance of DriftCorrection.
   * @param {number} interval - The expected interval between ticks in milliseconds.
   */
  constructor(interval) {
    this.interval = interval;
    this.startTime = null;
    this.lastTime = null;
    this.accumulatedDrift = 0;
  }

  /**
   * Resets the drift correction mechanism to its initial state.
   */
  reset() {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.accumulatedDrift = 0;
  }

  /**
   * Calculates the elapsed time and applies drift correction.
   * @returns {number} Adjusted elapsed time in milliseconds.
   */
  getElapsedTime() {
    const now = performance.now();
    const elapsed = now - this.lastTime;
    this.lastTime = now;

    // Compute drift.
    const drift = elapsed - this.interval;
    this.accumulatedDrift += drift;

    // If there's drift, compensate for it.
    let correctedElapsed = this.interval - this.accumulatedDrift;

    // Ensure accumulated drift doesn't grow indefinitely.
    this.accumulatedDrift = Math.max(this.accumulatedDrift - this.interval, 0);

    // Ensure we never return negative time.
    return Math.max(correctedElapsed, 0);
  }

  /**
   * Checks for timing drift.
   * @param {number} currentTime - Current time in milliseconds.
   * @returns {number} Drift amount in milliseconds.
   */
  checkDrift(currentTime) {
    // Prevent undefined errors if reset() hasn't been called yet.
    if (!this.lastTime) return 0;
    return currentTime - (this.lastTime + this.interval);
  }

}

export default DriftCorrection;
