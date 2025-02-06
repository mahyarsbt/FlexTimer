import EventManager from './EventManager.js';
import DriftCorrection from './DriftCorrection.js';
import { getTimeDiff, formatTime, isValidDate } from './TimerUtils.js';

/**
 * FlexTimer: A high-precision countdown & count-up timer with drift correction.
 */
class FlexTimer {
  constructor(container, options = {}) {
    // Ensure a valid container element is provided.
    if (!container) {
      throw new Error('[FlexTimer] Container element is required.');
    }

    // Determine if the container is a selector string or a direct DOM element.
    this.container = typeof container === 'string' ? document.querySelector(container) : container;

    // Validate that the container is a valid DOM element.
    if (!this.container) {
      throw new Error('[FlexTimer] Invalid container element.');
    }

    /**
     * Timer configuration options.
     */
    this.options = Object.assign(
      {
        /**
         * Defines the starting point of the timer.
         * Accepts: Date object, timestamp (number), or ISO string.
         * Default: Current time.
         */
        from: options.from ? new Date(options.from) : new Date(),

        /**
         * Defines the end point of the timer.
         * Accepts: Date object, timestamp (number), or ISO string.
         * Default: Null (used when duration is specified).
         */
        to: options.to ? new Date(options.to) : null,

        /**
         * Specifies the duration of the timer if no `to` value is provided.
         * Accepts: Number (milliseconds), formatted string ("1h 30m"), or object ({ hours: 1, minutes: 30 }).
         * Default: 0 (indicating infinite timer if `to` is also null).
         */
        duration: options.duration || 0,

        /**
         * Interval for updating the timer display.
         * Accepts: Number (milliseconds).
         * Default: 1000ms (1 second).
         */
        interval: options.interval || 1000,

        /**
         * Mode of the timer.
         * Accepts: "countdown", "countup", "timer", "stopwatch".
         * Default: "countdown".
         */
        mode: options.mode || 'countdown',

        /**
         * Precision level of the timer.
         * Accepts: "seconds", "milliseconds".
         * Default: "seconds".
         */
        precision: options.precision || 'seconds',

        /**
         * Adjusts the timezone offset (in minutes).
         * Accepts: Number (positive or negative, in minutes).
         * Default: 0 (no timezone adjustment).
         */
        timezoneOffset: options.timezoneOffset || 0,

        /**
         * Display settings.
         */
        showDays: options.showDays !== false, // Whether to display days.
        showHours: options.showHours !== false, // Whether to display hours.
        showMinutes: options.showMinutes !== false, // Whether to display minutes.
        showSeconds: options.showSeconds !== false, // Whether to display seconds.
        showMilliseconds: options.showMilliseconds || false, // Whether to display milliseconds.
        showLabels: options.showLabels !== false, // Whether to display labels (e.g., "Days", "Hours").
        labels: options.labels || ['Days', 'Hours', 'Minutes', 'Seconds'], // Custom labels for time units.

        /**
         * Styling options.
         */
        style: options.style || 'digital', // Accepts: "digital", "flip", "text", "circular".
        theme: options.theme || 'dark', // Accepts: "light", "dark", "custom".
        color: options.color || 'black', // Accepts any valid CSS color value.
        spacing: options.spacing || 15, // Spacing between groups of digits.
        digitSpacing: options.digitSpacing || 0, // Spacing between individual digits.
        fontFamily: options.fontFamily || 'Arial', // Font family for the timer.
        fontSize: options.fontSize || '20px', // Font size in pixels.
        customStyles: options.customStyles || {}, // Custom styles applied to the timer.

        /**
         * Animation settings.
         */
        animation: options.animation || 'css', // Accepts: "none", "css", "js".
        effect: options.effect || 'flip', // Accepts: "flip", "slide", "bounce", "fadeIn", "zoom", etc.
        speed: options.speed || 500, // Speed of animation in milliseconds.
        delay: options.delay || 100, // Delay before animation starts (ms).
        easing: options.easing || 'ease-in-out', // Accepts: "ease", "linear", "ease-in", "ease-out", "ease-in-out".

        /**
         * Timer behavior settings.
         */
        loop: options.loop || false, // Whether the timer should restart when completed.
        autoStart: options.autoStart !== false, // Whether the timer starts automatically.
        pauseOnBlur: options.pauseOnBlur || false, // Whether the timer pauses when the tab loses focus.
        syncWithServer: options.syncWithServer || false, // Whether the timer synchronizes with a server.

        /**
         * Event callbacks.
         */
        onStart: options.onStart || null, // Callback function when the timer starts.
        onStop: options.onStop || null, // Callback function when the timer stops.
        onPause: options.onPause || null, // Callback function when the timer is paused.
        onResume: options.onResume || null, // Callback function when the timer resumes.
        onComplete: options.onComplete || null, // Callback function when the timer completes.
        onTick: options.onTick || null, // Callback function on each tick update.
      },
      options
    );

    // Validate options
    if (!isValidDate(this.options.from)) {
      throw new Error('[FlexTimer] Invalid start date provided.');
    }
    if (this.options.to && !isValidDate(this.options.to)) {
      throw new Error('[FlexTimer] Invalid end date provided.');
    }
    if (typeof this.options.duration !== 'number' || isNaN(this.options.duration) || this.options.duration < 0) {
      throw new Error('[FlexTimer] Invalid duration provided.');
    }

    this.elapsedTime = 0;
    this.running = false;
    this.paused = false;
    this.timerId = null;
    this.startTime = null;
    this.eventManager = new EventManager();
    this.driftCorrection = new DriftCorrection(this.options.interval);
    this.applyTimezoneOffset();

    // Compute end time if only duration is provided.
    if (!this.options.to && this.options.duration > 0) {
      this.options.to = new Date(this.options.from.getTime() + this.options.duration);
    }

    // Initialize the display immediately after creating the timer.
    this.updateDisplay(this.getRemainingTime());

    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Adjusts the `from` and `to` times based on the configured timezone offset.
   * This ensures the timer correctly reflects the intended time zone adjustment.
   * The offset is applied only if `timezoneOffset` is not zero.
   */
  applyTimezoneOffset() {
    if (this.options.timezoneOffset !== 0) {
      // Ensure `from` is a valid date before applying the offset.
      if (isValidDate(this.options.from)) {
        this.options.from.setMinutes(this.options.from.getMinutes() + this.options.timezoneOffset);
      }

      // Ensure `to` is a valid date before applying the offset.
      if (isValidDate(this.options.to)) {
        this.options.to.setMinutes(this.options.to.getMinutes() + this.options.timezoneOffset);
      }
    }
  }

  /**
   * Starts the timer with drift correction.
   */
  start() {
    if (this.running) return;

    this.running = true;
    this.paused = false;
    this.driftCorrection.reset();

    this.startTime = this.options.from ? this.options.from.getTime() : performance.now();

    // Update the display immediately before the timer starts.
    this.updateDisplay(this.getRemainingTime());

    this.startTimer();

    // Emit the start event.
    this.eventManager.emit('start');

    // Call the user-defined onStart callback if provided.
    if (typeof this.options.onStart === 'function') {
      this.options.onStart();
    }
  }

  /**
   * Pauses the timer and stores elapsed time.
   */
  pause() {
    if (!this.running) return;

    clearInterval(this.timerId);
    this.running = false;
    this.paused = true;

    // Store elapsed time to resume later.
    this.elapsedTime = performance.now() - this.startTime;

    // Emit the pause event.
    this.eventManager.emit('pause');

    // Call the user-defined onPause callback if provided.
    if (typeof this.options.onPause === 'function') {
      this.options.onPause();
    }
  }

  /**
   * Resumes the timer from where it was paused.
   */
  resume() {
    if (!this.paused) return;

    this.running = true;
    this.paused = false;

    this.startTime = performance.now() - this.elapsedTime;

    // Adjust start time based on elapsed time.
    this.elapsedTime = performance.now() - this.startTime;

    this.startTimer();

    // Emit the resume event.
    this.eventManager.emit('resume');

    // Call the user-defined onResume callback if provided.
    if (typeof this.options.onResume === 'function') {
      this.options.onResume();
    }
  }

  /**
   * Stops the timer completely.
   */
  stop() {
    if (!this.running) return;

    this.clearTimer();
    this.running = false;
    this.paused = false;
    this.elapsedTime = 0;
    this.startTime = this.options.from ? this.options.from.getTime() : null;

    // Emit the stop event.
    this.eventManager.emit('stop');

    // Call the user-defined onStop callback if provided.
    if (typeof this.options.onStop === 'function') {
      this.options.onStop();
    }
  }

  /**
   * Executes a tick, updates elapsed time, and triggers necessary events.
   */
  tick() {
    const remainingTime = this.getRemainingTime();

    // Update the timer display at every tick.
    this.updateDisplay(remainingTime);

    // Emit an event with the formatted remaining time.
    this.eventManager.emit('tick', this.getFormattedTime(remainingTime));

    // Call the user-defined onTick callback if provided.
    if (typeof this.options.onTick === 'function') {
      this.options.onTick(remainingTime);
    }

    // Stop the timer if countdown reaches zero.
    if (this.options.mode === 'countdown' && remainingTime <= 0) {
      this.stop();
      this.eventManager.emit('complete');

      // Call the user-defined onComplete callback if provided.
      if (typeof this.options.onComplete === 'function') {
        this.options.onComplete();
      }

      // Restart the timer if loop mode is enabled.
      if (this.options.loop) {
        this.resetTimer();
        this.start();
      }
    }
  }

  /**
   * Starts the timer by executing `tick()` at the configured interval.
   */
  startTimer() {
    this.timerId = setInterval(() => {
      this.tick();
    }, this.options.interval);
  }

  /**
   * Resets the timer to its initial state for looping.
   */
  resetTimer() {
    this.startTime = this.options.from.getTime();
    this.elapsedTime = 0;
  }

  /**
   * Resets the timer for looping by restoring its initial state.
   */
  clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Calculates the remaining time based on the mode and applies drift correction if necessary.
   * @returns {number} Remaining time in milliseconds.
   */
  getRemainingTime() {
    const now = performance.now();
    const drift = this.driftCorrection ? this.driftCorrection.checkDrift(now) : 0;

    if (this.options.mode === 'countdown') {
      // Calculate remaining time for countdown mode, considering drift correction.
      return Math.max(0, this.options.to - now + drift);
    }
    if (this.options.mode === 'countup') {
      // Calculate elapsed time for count-up mode, including drift correction.
      return now - this.startTime + drift;
    }
    if (this.options.mode === 'stopwatch') {
      // Calculate elapsed time for stopwatch mode. If running, use current time.
      return this.running ? now - this.startTime + drift : this.elapsedTime;
    }
    return 0; // Default return value if no valid mode is set.
  }

  /**
   * Formats the given time value into a readable string.
   * @param {number} ms - Time value in milliseconds.
   * @returns {string} Formatted time string.
   */
  getFormattedTime(ms) {
    return formatTime(ms);
  }

  /**
   * Updates the displayed timer value in the container.
   * @param {number} elapsedTime - The elapsed or remaining time in milliseconds.
   */
  updateDisplay(elapsedTime) {
    let displayTime = elapsedTime;

    // If the timer is in countdown mode, recalculate the remaining time.
    if (this.options.mode === 'countdown') {
      displayTime = Math.max(0, this.options.to.getTime() - Date.now());
    }

    // Convert the time difference into an object containing days, hours,
    // minutes, seconds, and milliseconds.
    const timeDiff = getTimeDiff(displayTime);
    let parts = [];

    // Format and add each time unit to the display parts array based on user settings.
    if (this.options.showDays) {
      parts.push(`${formatTime(timeDiff.days)} ${this.options.showLabels ? this.options.labels[0] : ''}`);
    }
    if (this.options.showHours) {
      parts.push(`${formatTime(timeDiff.hours)} ${this.options.showLabels ? this.options.labels[1] : ''}`);
    }
    if (this.options.showMinutes) {
      parts.push(`${formatTime(timeDiff.minutes)} ${this.options.showLabels ? this.options.labels[2] : ''}`);
    }
    if (this.options.showSeconds) {
      parts.push(`${formatTime(timeDiff.seconds)} ${this.options.showLabels ? this.options.labels[3] : ''}`);
    }
    if (this.options.precision === 'milliseconds' && this.options.showMilliseconds) {
      parts.push(`${formatTime(timeDiff.milliseconds, 3)}`);
    }

    // Update the container with the formatted time string.
    this.container.innerText = parts.join(' ');
  }

}

export default FlexTimer;
