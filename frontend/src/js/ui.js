// UI controller for updating DOM
export class UIController {
  constructor() {
    this.promptElement = $('#game-prompt');
    this.scoreElement = $('#score-display');
    this.timerElement = $('#timer-display');
    this.feedbackElement = $('#feedback');
    this.resultsElement = $('#results');
  }

  showPrompt(locationName) {
    this.promptElement.html(`
      <h2>🎯 Hit a HOMERUN!</h2>
      <h3 class="location-name">${locationName}</h3>
      <p style="font-size: 1.1rem; margin-top: 10px;">Double-click to hit the ball OUTSIDE the field!</p>
    `);
    this.promptElement.addClass('pulse-animation');
    setTimeout(() => {
      this.promptElement.removeClass('pulse-animation');
    }, 600);
  }

  showFeedback(isCorrect, locationName) {
    const message = isCorrect
      ? `<span class="correct">🏏 HOMERUN! Ball went outside the field!</span>`
      : `<span class="incorrect">⚠️ OUT! Ball landed inside the field.</span>`;

    this.feedbackElement.html(message);
    this.feedbackElement.addClass(isCorrect ? 'correct-feedback' : 'incorrect-feedback');

    setTimeout(() => {
      this.feedbackElement.removeClass('correct-feedback incorrect-feedback');
    }, 2000);
  }

  updateScore(score, total) {
    this.scoreElement.text(`Homeruns: ${score}/${total}`);
  }

  updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.timerElement.text(
      `Time: ${minutes}:${secs.toString().padStart(2, '0')}`
    );
  }

  showResults(score, total, timeElapsed, answers) {
    const percentage = (score / total) * 100;
    const resultHTML = `
      <div class="results-container">
        <h2>⚾ Game Over!</h2>
        <div class="final-score">
          <h3>${score} Homeruns, ${total - score} Outs</h3>
          <p>Hit Success Rate: ${percentage.toFixed(1)}%</p>
          <p>Time: ${this.formatTime(timeElapsed)}</p>
        </div>
        <div class="answer-breakdown">
          ${this.renderAnswerBreakdown(answers)}
        </div>
        <div class="button-group">
          <button id="restart-btn" class="btn-primary">🔄 Play Again</button>
          <button id="retry-btn" class="btn-retry">↻ Retry Last Game</button>
          <button id="view-highscores-btn" class="btn-secondary">🏆 View High Scores</button>
        </div>
      </div>
    `;

    this.resultsElement.html(resultHTML);
    this.resultsElement.show();
    this.resultsElement.addClass('slide-in-animation');
  }

  renderAnswerBreakdown(answers) {
    return answers
      .map(
        (answer, index) => `
      <div class="answer-item ${answer.correct ? 'correct' : 'incorrect'}" title="${answer.correct ? 'HOMERUN!' : 'OUT - Better luck next time!'}">
        <span class="answer-number">Hit ${index + 1}:</span>
        <span class="location-name">${answer.location.name}</span>
        <span class="answer-status ${answer.correct ? 'homerun-status' : 'out-status'}">${answer.correct ? '🏏' : '⚠️'}</span>
      </div>
    `
      )
      .join('');
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  hideResults() {
    this.resultsElement.hide();
  }

  showLoadingSpinner() {
    $('#loading-spinner').show();
  }

  hideLoadingSpinner() {
    $('#loading-spinner').hide();
  }
}
