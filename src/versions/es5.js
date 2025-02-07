import FlexTimer from '../index.js';

// Make FlexTimer available in global scope for legacy projects.
if (typeof window !== 'undefined') {
  window.FlexTimer = FlexTimer;
}

export default FlexTimer;
