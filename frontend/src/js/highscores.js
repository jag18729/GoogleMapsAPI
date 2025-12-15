// High scores management using LocalStorage
const HIGHSCORE_KEY = 'csun_maps_quiz_highscores';
const MAX_SCORES = 10;

export class HighScoreManager {
  constructor() {
    this.scores = this.loadScores();
  }

  loadScores() {
    try {
      const data = localStorage.getItem(HIGHSCORE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading high scores:', e);
      return [];
    }
  }

  saveScores() {
    try {
      localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(this.scores));
    } catch (e) {
      console.error('Error saving high scores:', e);
    }
  }

  addScore(playerName, score, totalQuestions, timeSeconds) {
    const newScore = {
      name: playerName,
      score: score,
      total: totalQuestions,
      percentage: (score / totalQuestions) * 100,
      time: timeSeconds,
      date: new Date().toISOString()
    };

    this.scores.push(newScore);

    // Sort by percentage (desc), then by time (asc)
    this.scores.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return a.time - b.time;
    });

    // Keep only top MAX_SCORES
    this.scores = this.scores.slice(0, MAX_SCORES);

    this.saveScores();

    return this.scores;
  }

  getTopScores(limit = MAX_SCORES) {
    return this.scores.slice(0, limit);
  }

  isHighScore(score, total) {
    if (this.scores.length < MAX_SCORES) return true;

    const percentage = (score / total) * 100;
    const lowestScore = this.scores[this.scores.length - 1];

    return percentage > lowestScore.percentage;
  }

  clearScores() {
    this.scores = [];
    this.saveScores();
  }
}
