declare class FlexTimer {
  constructor(
    container: HTMLElement | string,
    options?: {
      from?: string | Date | number;
      to?: string | Date | number;
      duration?: number | string | { hours?: number; minutes?: number; seconds?: number };
      interval?: number;
      mode?: "countdown" | "countup" | "timer" | "stopwatch";
      precision?: "seconds" | "milliseconds";
      timezoneOffset?: number;
      showDays?: boolean;
      showHours?: boolean;
      showMinutes?: boolean;
      showSeconds?: boolean;
      showMilliseconds?: boolean;
      showLabels?: boolean;
      labels?: string[];
      style?: "digital" | "flip" | "text" | "circular";
      theme?: "light" | "dark" | "custom";
      color?: string;
      spacing?: number;
      digitSpacing?: number;
      fontFamily?: string;
      fontSize?: string;
      customStyles?: Record<string, any>;
      animation?: "none" | "css" | "js";
      effect?: "flip" | "slide" | "bounce" | "fadeIn" | "zoom";
      speed?: number;
      delay?: number;
      easing?: "ease" | "linear" | "ease-in" | "ease-out" | "ease-in-out";
      loop?: boolean;
      autoStart?: boolean;
      pauseOnBlur?: boolean;
      syncWithServer?: boolean;
      onStart?: () => void;
      onStop?: () => void;
      onPause?: () => void;
      onResume?: () => void;
      onComplete?: () => void;
      onTick?: (time: { days: number; hours: number; minutes: number; seconds: number }) => void;
    }
  );

  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  destroy(): void;
}

export default FlexTimer;
