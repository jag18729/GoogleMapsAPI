// Timer functionality
export class Timer {
  constructor(updateCallback) {
    this.startTime = null;
    this.elapsedTime = 0;
    this.intervalId = null;
    this.updateCallback = updateCallback;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.startTime = Date.now() - this.elapsedTime;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      const seconds = Math.floor(this.elapsedTime / 1000);
      this.updateCallback(seconds);
    }, 1000);
  }

  stop() {
    if (!this.isRunning) return;

    clearInterval(this.intervalId);
    this.isRunning = false;
    return Math.floor(this.elapsedTime / 1000);
  }

  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.startTime = null;
    this.updateCallback(0);
  }

  getElapsedSeconds() {
    return Math.floor(this.elapsedTime / 1000);
  }
}
