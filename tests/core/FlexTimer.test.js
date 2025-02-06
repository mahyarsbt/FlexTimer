import FlexTimer from '../../src/core/FlexTimer';

describe('FlexTimer', () => {
  test('initializes', () => {
    const timer = new FlexTimer();
    expect(timer).toBeInstanceOf(FlexTimer);
  });
});