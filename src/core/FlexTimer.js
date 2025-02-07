import EventManager from './EventManager.js';
import DriftCorrection from './DriftCorrection.js';
import { getTimeDiff, formatTime, isValidDate, normalizeTimeInput  } from './TimerUtils.js';

/**
 * FlexTimer: A high-precision countdown & count-up timer with drift correction.
 */
class FlexTimer {

  /**
   * Creates an instance of FlexTimer.
   * @param {string|HTMLElement} container - The DOM element or selector where the timer will be displayed.
   * @param {Object} [options={}] - Configuration options for the timer.
   * @throws {Error} If no container is provided.
   */
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
        from: options.from = options.from ? normalizeTimeInput(options.from) : new Date(),

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
         * Accepts: "countdown", "countup", "timer", "stopwatch", "clock".
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
        showLabels: options.showLabels ?? false, // Whether to display labels (e.g., "Days", "Hours").
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

    // Initialize timer state.
    this.elapsedTime = 0;
    this.running = false;
    this.paused = false;
    this.timerId = null;
    this.startTime = null;

    // Initialize helper objects.
    this.eventManager = new EventManager();
    this.driftCorrection = new DriftCorrection(this.options.interval);
    // Reset drift correction here, not just in start()
    this.driftCorrection.reset(this.options.from instanceof Date ? this.options.from.getTime() : this.options.from);

    // Perform initial setup.
    this._init();

    // Apply timezone adjustments if needed.
    this.applyTimezoneOffset();

    // Compute end time if only duration is provided.
    if (!this.options.to && this.options.duration > 0) {
      this.options.to = new Date(this.options.from.getTime() + this.options.duration);
    }

    // Initialize the display immediately after creating the timer.
    this.updateDisplay(this.getRemainingTime());

    // Auto-start the timer if configured to do so.
    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Initializes the timer based on provided options.
   * @private
   */
  _init() {
    const hasTimeParam = this.options.from || this.options.to || this.options.duration > 0;
    if (!hasTimeParam) {
      console.warn('[FlexTimer] No time parameters provided; switching to countup mode.');
      this.options.mode = 'countup';
      this.options.from = performance.now();
    } else {
      // Validate 'from' date only if mode isn't changed to countup.
      if (this.options.mode !== 'countup' && !isValidDate(this.options.from)) {
        throw new Error('[FlexTimer] Invalid start date provided.');
      }

      // Validate 'to' date if provided.
      if (this.options.to && !isValidDate(this.options.to)) {
        throw new Error('[FlexTimer] Invalid end date provided.');
      }

      // Validate duration.
      if (typeof this.options.duration !== 'number' || isNaN(this.options.duration) || this.options.duration < 0) {
        throw new Error('[FlexTimer] Invalid duration provided.');
      }
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
   * @param {number} [from] - Start time in milliseconds if not a Date, otherwise it's the Date object's time.
   */
  start() {
    if (this.running) return;

    this.running = true;
    this.paused = false;

    // Reset drift correction with the appropriate start time based on the mode.
    this.driftCorrection.reset(this.options.from instanceof Date ? this.options.from.getTime() : this.options.from);

    if (this.options.mode === 'countup') {
      this.startTime = performance.now();
    } else {
      this.startTime = this.options.from instanceof Date ? this.options.from.getTime() : this.options.from;
    }

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
    // renamed for clarity since it's not always 'remaining' time.
    const currentTime = this.getRemainingTime();

    // Update elapsedTime for modes where it's relevant.
    if (['countup', 'stopwatch', 'timer'].includes(this.options.mode)) {
      this.elapsedTime = currentTime;
    }

    // Update the timer display at every tick, regardless of mode.
    this.updateDisplay(currentTime);

    // Emit an event with the formatted time.
    this.eventManager.emit('tick', this.getFormattedTime(currentTime));

    // Call the user-defined onTick callback if provided.
    if (typeof this.options.onTick === 'function') {
      this.options.onTick(currentTime);
    }

    // Stop the timer if countdown reaches zero.
    if (this.options.mode === 'countdown' && currentTime <= 0) {
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

    switch (this.options.mode) {
      case 'countdown':
        // If 'to' is not provided, we should handle this scenario.
        if (!this.options.to) {
          // If to is not set, we really should not be in countdown mode.
          console.warn('[FlexTimer] No end time set for countdown mode; switching to countup.');
          this.options.mode = 'countup';
          this.startTime = now;
          return now - this.startTime + drift;
        }
        // Calculate remaining time for countdown mode, considering drift correction.
        return Math.max(0, this.options.to - now + drift);
      case 'countup':
        // Calculate elapsed time for count-up mode, including drift correction.
        return Math.max(0, now - this.startTime + drift);
      case 'stopwatch':
        // Calculate elapsed time for stopwatch mode. If running, use current time.
        return this.running ? now - this.startTime + drift : this.elapsedTime;
      case 'timer':
        return this.options.duration ? Math.max(0, this.options.duration - this.elapsedTime) : this.elapsedTime;
      case 'clock':
        // For clock mode, we'll return the current time, not a difference.
        return Date.now();
      default:
        // Default return value if no valid mode is set.
        return 0;
    }
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
   *
   * @param {number} elapsedTime - The elapsed or remaining time in milliseconds
   * for modes other than 'clock'.
   */
  updateDisplay(elapsedTime) {
    let displayTime;
    let timeDiff;

    if (!this.container) {
      console.error('[FlexTimer] Container element is invalid.');
      return;
    }

    // Determine the time difference and format based on the timer mode.
    switch (this.options.mode) {
      case 'countdown':
        // If an end time is set, calculate the remaining time.
        if (this.options.to) {
          displayTime = Math.max(0, this.options.to.getTime() - Date.now());
        } else {
          // If no end time is set, use the elapsed time.
          console.warn('[FlexTimer] No end time set for countdown mode; using elapsed time instead.');
          displayTime = elapsedTime;
        }
        timeDiff = getTimeDiff(displayTime);
        break;

      case 'countup':
        // Calculate the elapsed time from the start time.
        if (this.startTime) {
          displayTime = Math.max(0, performance.now() - this.startTime);
        } else {
          // If the start time isn't set, display 0.
          displayTime = 0;
        }
        timeDiff = getTimeDiff(displayTime);
        break;

      case 'stopwatch':
        // Calculate the elapsed time for the stopwatch mode.
        displayTime = this.running ? performance.now() - this.startTime : this.elapsedTime;
        timeDiff = getTimeDiff(displayTime);
        break;

      case 'timer':
        // Calculate the remaining or elapsed time for the timer mode.
        displayTime = this.options.duration
          ? Math.max(0, this.options.duration - this.elapsedTime)
          : this.elapsedTime;
        timeDiff = getTimeDiff(displayTime);
        break;

      case 'clock':
        // For clock mode, use the current time.
        const now = new Date();
        timeDiff = {
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds()
        };
        break;

      default:
        // Default to 0 for any unrecognized mode.
        timeDiff = getTimeDiff(0);
    }

    // Format time parts based on the configuration.
    const parts = [
      this.options.showDays &&
      `${formatTime(timeDiff.days)}${this.options.showLabels ? ' ' + this.options.labels[0] : ''}`,
      this.options.showHours &&
      `${formatTime(this.options.mode === 'clock' ? timeDiff.hours % 12 || 12 : timeDiff.hours)}${this.options.showLabels ? ' ' + this.options.labels[1] : ''}`,
      this.options.showMinutes &&
      `${formatTime(timeDiff.minutes)}${this.options.showLabels ? ' ' + this.options.labels[2] : ''}`,
      this.options.showSeconds &&
      `${formatTime(timeDiff.seconds)}${this.options.showLabels ? ' ' + this.options.labels[3] : ''}`,
      this.options.precision === 'milliseconds' && this.options.showMilliseconds &&
      `${formatTime(timeDiff.milliseconds, 3)}`
    ].filter(Boolean); // Remove falsy values.

    // Add AM/PM for clock mode.
    if (this.options.mode === 'clock' && this.options.showHours) {
      parts.push(timeDiff.hours < 12 ? 'AM' : 'PM');
    }

    // Update the container with the formatted time string.
    this.container.innerText = parts.join(':');
  }

}

export default FlexTimer;
