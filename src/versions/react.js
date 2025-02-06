import React, { useEffect, useRef } from 'react';
import FlexTimer from '../index';

const FlexTimerReact = ({ options }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      const timer = new FlexTimer(timerRef.current, options);
      timer.start();
    }
  }, [options]);

  return <div ref={timerRef}></div>;
};

export default FlexTimerReact;
