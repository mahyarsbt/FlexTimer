# FlexTimer ⏳
**The ultimate countdown and count-up library with seamless animations, customizable modes, and a simple yet powerful API.**

---

## 🔥 Features
✔️ High-precision **countdown** & **countup** timer
✔️ **Drift correction** to maintain timing accuracy
✔️ **Event-driven architecture** with custom event handling
✔️ Supports **multiple display modes** (`digital`, `flip`, `circular`, etc.)
✔️ **Flexible styling & themes**
✔️ Optimized for **CDN, ESM, CommonJS, and frameworks like React, Vue, Angular, Svelte**
✔️ Lightweight & **performance optimized**
✔️ **Unit-tested** for reliability

---

## 📦 Installation

### **Using NPM (Recommended)**
```sh
npm install flextimer
```

### **Using Yarn**
```sh
yarn add flextimer
```

### **Via CDN**
```html
<script src="https://cdn.jsdelivr.net/npm/flextimer@latest/dist/flextimer.min.js"></script>
```

## 🚀 Getting Started
### **Basic Example (Countdown Timer)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FlexTimer Example</title>
</head>
<body>
<div id="timer">00:00:00</div>

<script src="https://cdn.jsdelivr.net/npm/flextimer@latest/dist/flextimer.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const timer = new FlexTimer('#timer', {
      mode: 'countdown',
      from: new Date(),
      to: new Date(Date.now() + 60000), // 1-minute countdown
      showMinutes: true,
      showSeconds: true,
      onComplete: function() {
        console.log("Countdown finished!");
      }
    });

    timer.start();
  });
</script>
</body>
</html>
```

## ⚙️ API Documentation
### **new FlexTimer(container, options)**
Creates a new FlexTimer instance.

| Parameter  | Type                         | Description                          |
|------------|------------------------------|--------------------------------------|
| `container` | `string | HTMLElement`       | The target container element or selector. |
| `options`  | `Object`                     | Configuration options (see below).   |

### **Options**
| Option       | Type      | Default        | Description |
|-------------|----------|--------------|-------------|
| `mode`      | `string`  | `"countdown"` | Timer mode (`"countdown"`, `"countup"`, `"stopwatch"`). |
| `from`      | `Date`    | `new Date()`  | Start time. |
| `to`        | `Date`    | `null`        | End time (required for countdown). |
| `interval`  | `number`  | `1000`        | Update interval in milliseconds. |
| `showDays`  | `boolean` | `false`       | Show days in output. |
| `showHours` | `boolean` | `true`        | Show hours in output. |
| `showMinutes` | `boolean` | `true`      | Show minutes in output. |
| `showSeconds` | `boolean` | `true`      | Show seconds in output. |
| `onStart`   | `function` | `null`       | Callback when timer starts. |
| `onPause`   | `function` | `null`       | Callback when timer pauses. |
| `onResume`  | `function` | `null`       | Callback when timer resumes. |
| `onComplete` | `function` | `null`      | Callback when timer completes. |


### 🔄 Available Methods

| Method               | Description                                  |
|----------------------|----------------------------------------------|
| `start()`           | Starts the timer.                            |
| `pause()`           | Pauses the timer.                            |
| `resume()`          | Resumes the timer from the last state.       |
| `stop()`            | Stops the timer completely.                  |
| `getRemainingTime()` | Returns the remaining time in milliseconds.  |
| `updateDisplay(time)` | Updates the UI with the formatted time.    |


## 🏗 Project Structure
```bash
FlexTimer/
├── src/                       # Source code of the FlexTimer library
│   ├── core/                  # Core functionalities
│   │   ├── FlexTimer.js       # Main FlexTimer engine
│   │   ├── TimerUtils.js      # Utility functions for time processing
│   │   ├── EventManager.js    # Event handling system
│   │   ├── DriftCorrection.js # Drift correction to maintain accuracy
│   │   └── Config.js          # Default configuration settings
│   │
│   ├── animations/            # Animation modules for timer visualization
│   │   ├── BaseAnimation.js   # Base class for animations
│   │   ├── Flip.js            # Flip animation effect
│   │   ├── Slide.js           # Slide animation effect
│   │   ├── Bounce.js          # Bounce animation effect
│   │   ├── Fade.js            # Fade-in/Fade-out animation
│   │   ├── Circular.js        # Circular timer visualization
│   │   ├── Digital.js         # Digital-style timer visualization
│   │   ├── Matrix.js          # Matrix-style timer visualization
│   │   └── Custom.js          # Custom animations for timers
│   │
│   ├── versions/              # Different versions of FlexTimer for various environments
│   │   ├── es5.js             # ES5 + UMD compatible version
│   │   ├── node.js            # Node.js (CommonJS) compatible version
│   │   ├── esm.js             # ES Modules (ESM) compatible version
│   │   ├── cdn.js             # Optimized version for CDN distribution
│   │   ├── jquery.js          # jQuery plugin version
│   │   ├── react.js           # React component version
│   │   ├── vue.js             # Vue component version
│   │   ├── angular.js         # Angular component version
│   │   ├── next.js            # Next.js support
│   │   ├── svelte.js          # Svelte component version
│   │   ├── solid.js           # Solid.js component version
│   │   └── preact.js          # Preact component version
│   │
│   ├── styles/                # CSS styles for different timer themes
│   │   ├── FlexTimer.css      # Core styling for FlexTimer
│   │   ├── Flip.css           # Flip animation styles
│   │   ├── Slide.css          # Slide animation styles
│   │   ├── Digital.css        # Digital timer styles
│   │   └── Circular.css       # Circular timer styles
│   │
│   ├── types/                 # Type definitions for TypeScript support
│   │   └── index.d.ts         # Type definitions file
│   │
│   ├── index.js               # Main entry point for the library
│   │
├── dist/                      # Compiled and minified build outputs
│   ├── flextimer.js
│   ├── flextimer.min.js
│   ├── flextimer.es5.js
│   ├── flextimer.node.js
│   ├── flextimer.esm.js
│   ├── flextimer.cdn.js
│   ├── flextimer.cdn.min.js
│   ├── jquery.flextimer.js
│   ├── flextimer.react.js
│   ├── flextimer.vue.js
│   ├── flextimer.angular.js
│   ├── flextimer.next.js
│   ├── flextimer.svelte.js
│   ├── flextimer.solid.js
│   ├── flextimer.preact.js
│   └── flextimer.css
│
├── tests/                     # Unit tests for FlexTimer components
│   ├── core/                  # Tests for core functionalities
│   │   ├── FlexTimer.test.js
│   │   ├── TimerUtils.test.js
│   │   └── EventManager.test.js
│   ├── animations/            # Tests for animation modules
│   │   ├── Flip.test.js
│   │   ├── Slide.test.js
│   │   ├── Bounce.test.js
│   │   ├── Fade.test.js
│   │   └── Circular.test.js
│   │
│   ├── versions/               # Tests for different versions
│   │   ├── flextimer.esm.test.js
│   │   ├── flextimer.umd.test.js
│   │   ├── flextimer.es5.test.js
│   │   ├── flextimer.react.test.js
│   │   ├── flextimer.vue.test.js
│   │   ├── flextimer.angular.test.js
│   │   ├── flextimer.next.test.js
│   │   ├── flextimer.svelte.test.js
│   │   ├── flextimer.solid.test.js
│   │   └── flextimer.preact.test.js
│
├── examples/                   # Example implementations
│   ├── countdown.html          # Countdown timer example
│   ├── countup.html            # Count-up timer example
│   ├── timer.html              # General timer example
│   ├── flip.html               # Flip animation example
│   ├── slide.html              # Slide animation example
│   ├── bounce.html             # Bounce animation example
│   ├── digital.html            # Digital timer example
│   ├── circular.html           # Circular timer example
│   ├── jquery.html             # jQuery integration example
│   ├── react.html              # React integration example
│   ├── vue.html                # Vue integration example
│   ├── angular.html            # Angular integration example
│   ├── next.html               # Next.js integration example
│   ├── svelte.html             # Svelte integration example
│   ├── solid.html              # Solid.js integration example
│   └── preact.html             # Preact integration example
│
├── .babelrc                    # Babel configuration
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── LICENSE                     # License information
├── package.json                # npm package information
├── README.md                   # Documentation and instructions
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Webpack bundler configuration
└── rollup.config.js            # Rollup bundler configuration
```

## 💡 Contributing
We welcome contributions! To get started:

1. Fork the repository
2. Create a new feature branch
3. Make your changes and commit them
4. Submit a pull request 🚀

## 📜 License
FlexTimer is licensed under the MIT License.
