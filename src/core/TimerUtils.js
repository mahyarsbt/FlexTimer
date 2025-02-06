/**
 * TimerUtils - Utility functions for handling time calculations in FlexTimer.
 */

/**
 * Formats a given numeric value as a string with the specified number of digits.
 * @param {number} value - The numeric value to format.
 * @param {number} [digits=2]Number of digits to pad to.
 * @returns {string}
 *   A string representation of the value with the specified digits.
 */
export function formatTime(value, digits = 2) {
  // Pad the number to ensure it's the correct number of digits.
  return value.toString().padStart(digits, '0');
}

/**
 * Calculates the time difference in days, hours, minutes, seconds,
 * and milliseconds.
 * @param {number} diff - The time difference in milliseconds.
 * @returns {Object} An object containing days, hours, minutes, seconds,
 * and milliseconds.
 */
export function getTimeDiff(diff) {
  if (typeof diff !== 'number' || isNaN(diff) || diff < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    milliseconds: Math.floor(diff % 1000),
  };
}

/**
 * Validates whether a given value is a valid JavaScript Date object.
 * @param {any} date - The value to validate.
 * @returns {boolean} True if the value is a valid Date object, otherwise false.
 */
export function isValidDate(date) {
  // Check if it's a Date object and not NaN.
  return date instanceof Date && !isNaN(date.getTime());
}
