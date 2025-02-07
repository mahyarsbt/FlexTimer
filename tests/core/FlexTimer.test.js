import FlexTimer from '../../src/core/FlexTimer.js';

describe('FlexTimer', () => {
  let timerElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="timer"></div>';
    timerElement = document.querySelector('#timer');
  });

  test('should initialize a countdown timer correctly', () => {
    const timer = new FlexTimer(timerElement, {
      mode: 'countdown',
      from: new Date(),
      to: new Date(Date.now() + 5000)
    });

    expect(timer.options.mode).toBe('countdown');
    expect(timer.getRemainingTime()).toBeGreaterThan(0);
  });

  test('should start and stop the timer', () => {
    const timer = new FlexTimer(timerElement, { duration: 5000 });

    timer.start();
    expect(timer.running).toBe(true);

    timer.stop();
    expect(timer.running).toBe(false);
  });

  test('should emit start and complete events', () => {
    const mockStartCallback = jest.fn();
    const mockCompleteCallback = jest.fn();

    const timer = new FlexTimer(timerElement, {
      mode: 'countdown',
      duration: 1000,
      onStart: mockStartCallback,
      onComplete: mockCompleteCallback
    });

    timer.start();
    expect(mockStartCallback).toHaveBeenCalled();

    setTimeout(() => {
      expect(mockCompleteCallback).toHaveBeenCalled();
    }, 1100);
  });
});
