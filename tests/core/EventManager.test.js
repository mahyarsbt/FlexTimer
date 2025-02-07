import EventManager from '../../src/core/EventManager.js';

describe('EventManager', () => {
  let eventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  test('should register and trigger events correctly', () => {
    const mockCallback = jest.fn();
    eventManager.on('testEvent', mockCallback);
    eventManager.emit('testEvent');

    expect(mockCallback).toHaveBeenCalled();
  });

  test('should remove event listeners correctly', () => {
    const mockCallback = jest.fn();
    eventManager.on('testEvent', mockCallback);
    eventManager.off('testEvent', mockCallback);
    eventManager.emit('testEvent');

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
