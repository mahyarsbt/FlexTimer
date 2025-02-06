import { createEffect, onCleanup } from 'solid-js';
import FlexTimer from '../index';

const FlexTimerSolid = (props) => {
  let timerRef;

  createEffect(() => {
    const timer = new FlexTimer(timerRef, props.options);
    timer.start();

    onCleanup(() => timer.stop());
  });

  return <div ref={timerRef}></div>;
};

export default FlexTimerSolid;
