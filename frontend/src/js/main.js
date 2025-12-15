// Main application orchestrator
import { QUIZ_LOCATIONS } from './locations.js';
import { GameState } from './game.js';
import { MapManager } from './map.js';
import { UIController } from './ui.js';
import { Timer } from './timer.js';
import { HighScoreManager } from './highscores.js';
import { AudioManager } from './audio.js';

class QuizGame {
  constructor() {
    this.gameState = null;
    this.mapManager = null;
    this.ui = new UIController();
    this.timer = new Timer((seconds) => this.ui.updateTimer(seconds));
    this.highScoreManager = new HighScoreManager();
    this.audioManager = new AudioManager();
    this.lastGameState = null; // Store last game state for retry
    this.promptShown = false; // Prevent double high score prompt
  }

  async init() {
    try {
      this.ui.showLoadingSpinner();

      // Initialize audio manager (will activate on first click)
      this.audioManager.init();

      // Initialize map (Google Maps already loaded via script tag)
      this.mapManager = new MapManager('map');
      await this.mapManager.initialize();

      // Set up event listeners
      this.setupEventListeners();

      // Start game
      this.startNewGame();

      this.ui.hideLoadingSpinner();
    } catch (error) {
      console.error('Error initializing game:', error);
      alert('Error loading game. Please refresh the page.');
    }
  }

  setupEventListeners() {
    // Map double-click handler
    this.mapManager.addDoubleClickListener((lat, lng) => {
      this.handleMapClick(lat, lng);
    });

    // Restart button (new game) - delegated event
    $(document).on('click', '#restart-btn', () => {
      this.startNewGame();
    });

    // Retry button (same game, different selections)
    $(document).on('click', '#retry-btn', () => {
      this.retryLastGame();
    });

    // High scores button
    $(document).on('click', '#view-highscores-btn', () => {
      this.showHighScores();
    });

    // Close high scores modal
    $(document).on('click', '#close-highscores-btn', () => {
      $('.highscores-modal').remove();
    });
  }

  startNewGame() {
    // Reset UI
    this.ui.hideResults();
    this.mapManager.clearOverlays();
    this.mapManager.clearMarkers();

    // Reset prompt flag for new game
    this.promptShown = false;

    // Initialize new game state
    this.gameState = new GameState(QUIZ_LOCATIONS);
    this.gameState.startGame();

    // Start timer
    this.timer.reset();
    this.timer.start();

    // Update UI
    this.ui.updateScore(0, QUIZ_LOCATIONS.length);
    this.showCurrentQuestion();
  }

  showCurrentQuestion() {
    const location = this.gameState.getCurrentLocation();
    this.ui.showPrompt(location.name);
  }

  handleMapClick(lat, lng) {
    if (!this.gameState.isGameActive) return;

    // Play bat crack sound effect
    this.audioManager.playCrackSound();

    const isCorrect = this.gameState.submitAnswer(lat, lng);
    const currentLocation = this.gameState.getCurrentLocation();
    const lastAnswer = this.gameState.answers[this.gameState.answers.length - 1];

    // Play result sound based on outcome
    if (lastAnswer.isFoulBall) {
      this.audioManager.playFoulSound();
    } else if (lastAnswer.isStrikeout) {
      this.audioManager.playStrikeoutSound();
    } else if (isCorrect) {
      this.audioManager.playHomerunSound();
    }

    // Show visual feedback with answer data (for strikes/fouls)
    this.mapManager.showOverlay(currentLocation.bounds, isCorrect);
    this.ui.showFeedback(isCorrect, currentLocation.name, lastAnswer);
    this.ui.updateScore(this.gameState.score, QUIZ_LOCATIONS.length);

    // Add marker for user's click with appropriate icon
    let icon = '✓';
    if (lastAnswer.isFoulBall) icon = '⚾';
    else if (lastAnswer.isStrikeout) icon = '❌';
    this.mapManager.addMarker(lat, lng, icon);

    // Proceed to next question or end game
    setTimeout(() => {
      if (this.gameState.nextQuestion()) {
        this.showCurrentQuestion();
      } else {
        this.endGame();
      }
    }, 2000);
  }

  endGame() {
    this.gameState.endGame();
    this.timer.stop();

    // Play game over sound
    this.audioManager.playGameOverSound();

    const timeElapsed = this.gameState.getElapsedTime();

    // Save game state for retry
    this.lastGameState = {
      score: this.gameState.score,
      timeElapsed: timeElapsed,
      answers: JSON.parse(JSON.stringify(this.gameState.answers)) // Deep copy
    };

    // Show results
    this.ui.showResults(
      this.gameState.score,
      QUIZ_LOCATIONS.length,
      timeElapsed,
      this.gameState.answers
    );

    // Check for high score (only prompt if not already shown this game)
    if (
      !this.promptShown &&
      this.highScoreManager.isHighScore(
        this.gameState.score,
        QUIZ_LOCATIONS.length
      )
    ) {
      this.promptForHighScore(timeElapsed);
    }
  }

  retryLastGame() {
    if (!this.lastGameState) {
      alert('No previous game to retry. Start a new game!');
      return;
    }

    // Reset UI
    this.ui.hideResults();
    this.mapManager.clearOverlays();
    this.mapManager.clearMarkers();

    // Reset prompt flag for retry
    this.promptShown = false;

    // Initialize new game state (fresh attempt)
    this.gameState = new GameState(QUIZ_LOCATIONS);
    this.gameState.startGame();

    // Start timer
    this.timer.reset();
    this.timer.start();

    // Update UI
    this.ui.updateScore(0, QUIZ_LOCATIONS.length);
    this.showCurrentQuestion();
  }

  promptForHighScore(timeElapsed) {
    // Set flag to prevent double prompt
    this.promptShown = true;

    const playerName = prompt(
      'Congratulations! Enter your name for the high score board:'
    );
    if (playerName) {
      this.highScoreManager.addScore(
        playerName,
        this.gameState.score,
        QUIZ_LOCATIONS.length,
        timeElapsed
      );
    }
  }

  showHighScores() {
    const scores = this.highScoreManager.getTopScores();
    const scoresHTML = `
      <div class="highscores-modal">
        <div class="highscores-content">
          <h2>High Scores</h2>
          <table class="highscores-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${scores
                .map(
                  (score, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${score.name}</td>
                  <td>${score.score}/${score.total} (${score.percentage.toFixed(1)}%)</td>
                  <td>${this.ui.formatTime(score.time)}</td>
                  <td>${new Date(score.date).toLocaleDateString()}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <button id="close-highscores-btn" class="btn-primary">Close</button>
        </div>
      </div>
    `;

    $('body').append(scoresHTML);
  }
}

// Initialize game when DOM and Google Maps are ready
window.initMap = function () {
  const game = new QuizGame();
  game.init();
};

// Fallback if initMap callback doesn't fire
$(document).ready(() => {
  if (window.google && window.google.maps) {
    window.initMap();
  }
});
