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
    this.drift = 0;
  }

  /**
   * Resets the drift correction mechanism to its initial state.
   * @param {number} [startTime] - Optional parameter to set the start time explicitly, otherwise uses current performance time.
   */
  reset(startTime) {
    this.startTime = startTime || performance.now();
    this.lastTime = this.startTime;
    this.accumulatedDrift = 0;
    this.drift = 0;
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
   * Checks for timing drift and updates the drift value.
   * @param {number} currentTime - Current time in milliseconds.
   * @returns {number} Updated drift amount in milliseconds.
   */
  checkDrift(currentTime) {
    if (typeof currentTime !== 'number' || isNaN(currentTime)) {
      throw new Error("Invalid currentTime: must be a number.");
    }

    if (!this.lastTime) {
      console.warn("Warning: checkDrift called before reset(). Returning 0.");
      this.drift = 0;
      return 0;
    }

    // Compute the drift.
    this.drift = currentTime - (this.lastTime + this.interval);

    return this.drift;
  }

}

export default DriftCorrection;
