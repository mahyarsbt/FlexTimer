/**
 * EventManager - A lightweight event handling system for FlexTimer.
 * Implements a simple pub-sub (publish-subscribe) pattern.
 */
class EventManager {

  /**
   * Creates an instance of EventManager.
   */
  constructor() {
    this.events = {};
  }

  /**
   * Registers a listener for an event.
   * @param {string} event - The event name.
   * @param {Function} listener - The callback function to execute when the event is triggered.
   * @returns {Function} A function to remove the registered listener.
   */
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  /**
   * Removes a specific listener from an event.
   * @param {string} event - The event name.
   * @param {Function} listener - The callback function to remove.
   */
  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  /**
   * Emits an event, triggering all registered listeners.
   * @param {string} event - The event name.
   * @param {...any} args - Arguments to pass to the listeners.
   */
  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Removes all listeners for a specific event.
   * @param {string} event - The event name.
   */
  clear(event) {
    if (this.events[event]) {
      delete this.events[event];
    }
  }

}

export default EventManager;
