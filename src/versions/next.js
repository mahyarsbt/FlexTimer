import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const FlexTimer = dynamic(() => import('../index'), { ssr: false });

const FlexTimerNext = ({ options }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      const timer = new FlexTimer(timerRef.current, options);
      timer.start();
    }
  }, [options]);

  return <div ref={timerRef}></div>;
};

export default FlexTimerNext;
