// Game state management
export class GameState {
  constructor(locations) {
    this.locations = locations;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answers = [];
    this.startTime = null;
    this.endTime = null;
    this.isGameActive = false;
  }

  getCurrentLocation() {
    return this.locations[this.currentQuestionIndex];
  }

  submitAnswer(clickedLat, clickedLng) {
    const currentLocation = this.getCurrentLocation();

    // Check for foul ball (soccer field and buildings above)
    const isFoulBall = currentLocation.foulZones &&
      currentLocation.foulZones.some(zone =>
        this.isWithinBounds(clickedLat, clickedLng, zone)
      );

    // For baseball game:
    // OUTSIDE field & NOT foul = HOMERUN (correct)
    // INSIDE field = STRIKEOUT (incorrect)
    // Foul ball = FOUL (counts as strike)
    const isOutsideBounds = !this.isWithinBounds(
      clickedLat,
      clickedLng,
      currentLocation.bounds
    );

    const isHomerun = isOutsideBounds && !isFoulBall;

    this.answers.push({
      location: currentLocation,
      userClick: { lat: clickedLat, lng: clickedLng },
      correct: isHomerun,
      isFoulBall: isFoulBall,
      isStrikeout: !isOutsideBounds,
      timestamp: Date.now()
    });

    if (isHomerun) {
      this.score++;
    }

    return isHomerun;
  }

  isWithinBounds(lat, lng, bounds) {
    return (
      lat <= bounds.north &&
      lat >= bounds.south &&
      lng <= bounds.east &&
      lng >= bounds.west
    );
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    return this.currentQuestionIndex < this.locations.length;
  }

  isGameComplete() {
    return this.currentQuestionIndex >= this.locations.length;
  }

  getElapsedTime() {
    if (!this.startTime) return 0;
    const end = this.endTime || Date.now();
    return Math.floor((end - this.startTime) / 1000);
  }

  startGame() {
    this.startTime = Date.now();
    this.isGameActive = true;
  }

  endGame() {
    this.endTime = Date.now();
    this.isGameActive = false;
  }
}
