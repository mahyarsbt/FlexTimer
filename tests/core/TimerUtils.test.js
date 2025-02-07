import { formatTime, getTimeDiff, isValidDate } from '../../src/core/TimerUtils.js';

describe('TimerUtils', () => {
  test('formatTime should format numbers correctly', () => {
    expect(formatTime(5)).toBe('05');
    expect(formatTime(12)).toBe('12');
    expect(formatTime(3, 3)).toBe('003');
  });

  test('getTimeDiff should correctly calculate time breakdown', () => {
    const diff = getTimeDiff(90061000); // 1 day, 1 hour, 1 minute, 1 second
    expect(diff.days).toBe(1);
    expect(diff.hours).toBe(1);
    expect(diff.minutes).toBe(1);
    expect(diff.seconds).toBe(1);
  });

  test('isValidDate should correctly validate dates', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate('invalid')).toBe(false);
    expect(isValidDate(null)).toBe(false);
  });
});
