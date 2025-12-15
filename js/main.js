var D=[{id:1,name:"Matador Baseball Field - Hit #1",code:"HIT1",lat:34.2452183,lng:-118.5270635,bounds:{north:34.2465,south:34.244,east:-118.5255,west:-118.5285},difficulty:"easy",hint:"Hit the ball OUTSIDE the field for a HOMERUN!"},{id:2,name:"Matador Baseball Field - Hit #2",code:"HIT2",lat:34.2452183,lng:-118.5270635,bounds:{north:34.2465,south:34.244,east:-118.5255,west:-118.5285},difficulty:"medium",hint:"Another swing - aim for the fence!"},{id:3,name:"Matador Baseball Field - Hit #3",code:"HIT3",lat:34.2452183,lng:-118.5270635,bounds:{north:34.2465,south:34.244,east:-118.5255,west:-118.5285},difficulty:"medium",hint:"Three swings down - keep the momentum!"},{id:4,name:"Matador Baseball Field - Hit #4",code:"HIT4",lat:34.2452183,lng:-118.5270635,bounds:{north:34.2465,south:34.244,east:-118.5255,west:-118.5285},difficulty:"hard",hint:"Fourth hit - one more to go!"},{id:5,name:"Matador Baseball Field - Final Hit",code:"HIT5",lat:34.2452183,lng:-118.5270635,bounds:{north:34.2465,south:34.244,east:-118.5255,west:-118.5285},difficulty:"hard",hint:"Final swing - go for glory with a HOMERUN!"}],R={lat:34.2452183,lng:-118.5270635},z={zoom:16,disableDefaultUI:!1,gestureHandling:"none",zoomControl:!1,scrollwheel:!1,disableDoubleClickZoom:!1,draggable:!1};class K{constructor(h){this.locations=h,this.currentQuestionIndex=0,this.score=0,this.answers=[],this.startTime=null,this.endTime=null,this.isGameActive=!1}getCurrentLocation(){return this.locations[this.currentQuestionIndex]}submitAnswer(h,f){const X=this.getCurrentLocation(),q=!this.isWithinBounds(h,f,X.bounds);if(this.answers.push({location:X,userClick:{lat:h,lng:f},correct:q,timestamp:Date.now()}),q)this.score++;return q}isWithinBounds(h,f,X){return h<=X.north&&h>=X.south&&f<=X.east&&f>=X.west}nextQuestion(){return this.currentQuestionIndex++,this.currentQuestionIndex<this.locations.length}isGameComplete(){return this.currentQuestionIndex>=this.locations.length}getElapsedTime(){if(!this.startTime)return 0;const h=this.endTime||Date.now();return Math.floor((h-this.startTime)/1000)}startGame(){this.startTime=Date.now(),this.isGameActive=!0}endGame(){this.endTime=Date.now(),this.isGameActive=!1}}class W{constructor(h){this.mapElement=document.getElementById(h),this.map=null,this.overlays=[],this.markers=[]}async initialize(){this.map=new google.maps.Map(this.mapElement,{center:R,...z})}addDoubleClickListener(h){google.maps.event.addListener(this.map,"dblclick",(f)=>{h(f.latLng.lat(),f.latLng.lng())})}showOverlay(h,f){const X=f?"#00FF00":"#FF0000",F=new google.maps.Rectangle({bounds:{north:h.north,south:h.south,east:h.east,west:h.west},fillColor:X,fillOpacity:0.4,strokeColor:X,strokeOpacity:0.8,strokeWeight:2,map:this.map});return this.overlays.push(F),this.animateOverlay(F),F}animateOverlay(h){let f=0;const X=setInterval(()=>{if(f+=0.05,h.setOptions({fillOpacity:f}),f>=0.4)clearInterval(X)},30)}clearOverlays(){this.overlays.forEach((h)=>h.setMap(null)),this.overlays=[]}addMarker(h,f,X){const q=new google.maps.Marker({position:{lat:h,lng:f},map:this.map,label:X,animation:google.maps.Animation.DROP});return this.markers.push(q),q}clearMarkers(){this.markers.forEach((h)=>h.setMap(null)),this.markers=[]}}class Y{constructor(){this.promptElement=$("#game-prompt"),this.scoreElement=$("#score-display"),this.timerElement=$("#timer-display"),this.feedbackElement=$("#feedback"),this.resultsElement=$("#results")}showPrompt(h){this.promptElement.html(`
      <h2>\uD83C\uDFAF Hit a HOMERUN!</h2>
      <h3 class="location-name">${h}</h3>
      <p style="font-size: 1.1rem; margin-top: 10px;">Double-click to hit the ball OUTSIDE the field!</p>
    `),this.promptElement.addClass("pulse-animation"),setTimeout(()=>{this.promptElement.removeClass("pulse-animation")},600)}showFeedback(h,f){const X=h?'<span class="correct">\uD83C\uDFCF HOMERUN! Ball went outside the field!</span>':'<span class="incorrect">\u26A0\uFE0F OUT! Ball landed inside the field.</span>';this.feedbackElement.html(X),this.feedbackElement.addClass(h?"correct-feedback":"incorrect-feedback"),setTimeout(()=>{this.feedbackElement.removeClass("correct-feedback incorrect-feedback")},2000)}updateScore(h,f){this.scoreElement.text(`Homeruns: ${h}/${f}`)}updateTimer(h){const f=Math.floor(h/60),X=h%60;this.timerElement.text(`Time: ${f}:${X.toString().padStart(2,"0")}`)}showResults(h,f,X,q){const F=h/f*100,J=`
      <div class="results-container">
        <h2>\u26BE Game Over!</h2>
        <div class="final-score">
          <h3>${h} Homeruns, ${f-h} Outs</h3>
          <p>Hit Success Rate: ${F.toFixed(1)}%</p>
          <p>Time: ${this.formatTime(X)}</p>
        </div>
        <div class="answer-breakdown">
          ${this.renderAnswerBreakdown(q)}
        </div>
        <div class="button-group">
          <button id="restart-btn" class="btn-primary">\uD83D\uDD04 Play Again</button>
          <button id="retry-btn" class="btn-retry">\u21BB Retry Last Game</button>
          <button id="view-highscores-btn" class="btn-secondary">\uD83C\uDFC6 View High Scores</button>
        </div>
      </div>
    `;this.resultsElement.html(J),this.resultsElement.show(),this.resultsElement.addClass("slide-in-animation")}renderAnswerBreakdown(h){return h.map((f,X)=>`
      <div class="answer-item ${f.correct?"correct":"incorrect"}" title="${f.correct?"HOMERUN!":"OUT - Better luck next time!"}">
        <span class="answer-number">Hit ${X+1}:</span>
        <span class="location-name">${f.location.name}</span>
        <span class="answer-status ${f.correct?"homerun-status":"out-status"}">${f.correct?"\uD83C\uDFCF":"\u26A0\uFE0F"}</span>
      </div>
    `).join("")}formatTime(h){const f=Math.floor(h/60),X=h%60;return`${f}m ${X}s`}hideResults(){this.resultsElement.hide()}showLoadingSpinner(){$("#loading-spinner").show()}hideLoadingSpinner(){$("#loading-spinner").hide()}}class v{constructor(h){this.startTime=null,this.elapsedTime=0,this.intervalId=null,this.updateCallback=h,this.isRunning=!1}start(){if(this.isRunning)return;this.startTime=Date.now()-this.elapsedTime,this.isRunning=!0,this.intervalId=setInterval(()=>{this.elapsedTime=Date.now()-this.startTime;const h=Math.floor(this.elapsedTime/1000);this.updateCallback(h)},1000)}stop(){if(!this.isRunning)return;return clearInterval(this.intervalId),this.isRunning=!1,Math.floor(this.elapsedTime/1000)}reset(){this.stop(),this.elapsedTime=0,this.startTime=null,this.updateCallback(0)}getElapsedSeconds(){return Math.floor(this.elapsedTime/1000)}}class H{constructor(){this.scores=this.loadScores()}loadScores(){try{const h=localStorage.getItem("csun_maps_quiz_highscores");return h?JSON.parse(h):[]}catch(h){return console.error("Error loading high scores:",h),[]}}saveScores(){try{localStorage.setItem("csun_maps_quiz_highscores",JSON.stringify(this.scores))}catch(h){console.error("Error saving high scores:",h)}}addScore(h,f,X,q){const F={name:h,score:f,total:X,percentage:f/X*100,time:q,date:(new Date()).toISOString()};return this.scores.push(F),this.scores.sort((J,V)=>{if(V.percentage!==J.percentage)return V.percentage-J.percentage;return J.time-V.time}),this.scores=this.scores.slice(0,10),this.saveScores(),this.scores}getTopScores(h=10){return this.scores.slice(0,h)}isHighScore(h,f){if(this.scores.length<10)return!0;const X=h/f*100,q=this.scores[this.scores.length-1];return X>q.percentage}clearScores(){this.scores=[],this.saveScores()}}class M{constructor(){this.gameState=null,this.mapManager=null,this.ui=new Y,this.timer=new v((h)=>this.ui.updateTimer(h)),this.highScoreManager=new H,this.lastGameState=null}async init(){try{this.ui.showLoadingSpinner(),this.mapManager=new W("map"),await this.mapManager.initialize(),this.setupEventListeners(),this.startNewGame(),this.ui.hideLoadingSpinner()}catch(h){console.error("Error initializing game:",h),alert("Error loading game. Please refresh the page.")}}setupEventListeners(){this.mapManager.addDoubleClickListener((h,f)=>{this.handleMapClick(h,f)}),$(document).on("click","#restart-btn",()=>{this.startNewGame()}),$(document).on("click","#retry-btn",()=>{this.retryLastGame()}),$(document).on("click","#view-highscores-btn",()=>{this.showHighScores()}),$(document).on("click","#close-highscores-btn",()=>{$(".highscores-modal").remove()})}startNewGame(){this.ui.hideResults(),this.mapManager.clearOverlays(),this.mapManager.clearMarkers(),this.gameState=new K(D),this.gameState.startGame(),this.timer.reset(),this.timer.start(),this.ui.updateScore(0,D.length),this.showCurrentQuestion()}showCurrentQuestion(){const h=this.gameState.getCurrentLocation();this.ui.showPrompt(h.name)}handleMapClick(h,f){if(!this.gameState.isGameActive)return;const X=this.gameState.submitAnswer(h,f),q=this.gameState.getCurrentLocation();this.mapManager.showOverlay(q.bounds,X),this.ui.showFeedback(X,q.name),this.ui.updateScore(this.gameState.score,D.length),this.mapManager.addMarker(h,f,X?"\u2713":"\u2717"),setTimeout(()=>{if(this.gameState.nextQuestion())this.showCurrentQuestion();else this.endGame()},2000)}endGame(){this.gameState.endGame(),this.timer.stop();const h=this.gameState.getElapsedTime();if(this.lastGameState={score:this.gameState.score,timeElapsed:h,answers:JSON.parse(JSON.stringify(this.gameState.answers))},this.ui.showResults(this.gameState.score,D.length,h,this.gameState.answers),this.highScoreManager.isHighScore(this.gameState.score,D.length))this.promptForHighScore(h)}retryLastGame(){if(!this.lastGameState){alert("No previous game to retry. Start a new game!");return}this.ui.hideResults(),this.mapManager.clearOverlays(),this.mapManager.clearMarkers(),this.gameState=new K(D),this.gameState.startGame(),this.timer.reset(),this.timer.start(),this.ui.updateScore(0,D.length),this.showCurrentQuestion()}promptForHighScore(h){const f=prompt("Congratulations! Enter your name for the high score board:");if(f)this.highScoreManager.addScore(f,this.gameState.score,D.length,h)}showHighScores(){const f=`
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
              ${this.highScoreManager.getTopScores().map((X,q)=>`
                <tr>
                  <td>${q+1}</td>
                  <td>${X.name}</td>
                  <td>${X.score}/${X.total} (${X.percentage.toFixed(1)}%)</td>
                  <td>${this.ui.formatTime(X.time)}</td>
                  <td>${new Date(X.date).toLocaleDateString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <button id="close-highscores-btn" class="btn-primary">Close</button>
        </div>
      </div>
    `;$("body").append(f)}}window.initMap=function(){new M().init()};$(document).ready(()=>{if(window.google&&window.google.maps)window.initMap()});

//# debugId=1F28DAF18203AC6664756e2164756e21
