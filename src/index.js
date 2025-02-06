import FlexTimer from './core/FlexTimer.js';
import './styles/FlexTimer.css';

if (typeof window !== 'undefined') {
    window.FlexTimer = FlexTimer;
}

export default FlexTimer;
export { FlexTimer };
