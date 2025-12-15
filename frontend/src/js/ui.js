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

  showFeedback(isCorrect, locationName, answerData) {
    let message = '';
    let feedbackClass = '';

    if (answerData && answerData.isFoulBall) {
      message = `<span class="foul">⚾ FOUL BALL! Hit into foul territory!</span>`;
      feedbackClass = 'foul-feedback';
    } else if (answerData && answerData.isStrikeout) {
      message = `<span class="strikeout">❌ STRIKEOUT! Ball landed in the field!</span>`;
      feedbackClass = 'strikeout-feedback';
    } else if (isCorrect) {
      message = `<span class="correct">⚾ HOMERUN! Ball went over the fence!</span>`;
      feedbackClass = 'correct-feedback';
    } else {
      message = `<span class="incorrect">⚠️ OUT! Ball didn't go far enough!</span>`;
      feedbackClass = 'incorrect-feedback';
    }

    this.feedbackElement.html(message);
    this.feedbackElement.addClass(feedbackClass);

    setTimeout(() => {
      this.feedbackElement.removeClass('correct-feedback incorrect-feedback foul-feedback strikeout-feedback');
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
    const strikeouts = answers.filter(a => a.isStrikeout).length;
    const fouls = answers.filter(a => a.isFoulBall).length;

    const resultHTML = `
      <div class="results-container">
        <h2>⚾ Game Over!</h2>
        <div class="final-score">
          <h3>${score} Homeruns • ${strikeouts} Strikeouts • ${fouls} Fouls</h3>
          <p>Batting Average: ${percentage.toFixed(1)}%</p>
          <p>Time: ${this.formatTime(timeElapsed)}</p>
        </div>
        <div class="answer-breakdown">
          <h4>Play-by-Play</h4>
          ${this.renderAnswerBreakdown(answers)}
        </div>
        <div class="field-reference">
          <p>📍 <a href="https://www.google.com/maps/place/Matador+Baseball+Field/@34.2452182,-118.5273758,18z/data=!4m15!1m8!3m7!1s0x80c29af9287eb329:0xab822cfc9f28f0a3!2sMatador+Baseball+Field!8m2!3d34.2452183!4d-118.5270635!10e5!16s%2Fm%2F0cc95m8!3m5!1s0x80c29af9287eb329:0xab822cfc9f28f0a3!8m2!3d34.2452183!4d-118.5270635!16s%2Fm%2F0cc95m8!5m1!1e4?entry=ttu" target="_blank">Visit Matador Baseball Field on Google Maps</a></p>
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
        (answer, index) => {
          let itemClass = 'answer-item';
          let status = '';
          let title = '';

          if (answer.isFoulBall) {
            itemClass += ' foul';
            status = '⚾ FOUL';
            title = 'Foul Ball - Hit into foul territory';
          } else if (answer.isStrikeout) {
            itemClass += ' strikeout';
            status = '❌ STRIKE';
            title = 'Strikeout - Ball stayed in field';
          } else if (answer.correct) {
            itemClass += ' correct';
            status = '⚾ HOME RUN';
            title = 'Homerun - Ball cleared the field!';
          } else {
            itemClass += ' incorrect';
            status = '⚠️ OUT';
            title = 'Out - Better luck next time!';
          }

          return `
          <div class="${itemClass}" title="${title}">
            <span class="answer-number">#${index + 1}</span>
            <span class="location-name">${answer.location.name}</span>
            <span class="answer-status">${status}</span>
          </div>
        `;
        }
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
